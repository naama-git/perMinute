
const IDLE_THRESHOLD_SECONDS = 120;

interface BrowserContext {
  activeTabHostname: string | null;
  isWindowFocused: boolean;
  isUserIdle: boolean;
  observedAt: number;
}

function getHostname(url?: string): string | null {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return null;
    }

    return parsedUrl.hostname.toLowerCase();
  } catch {
    return null;
  }
}

async function getBrowserContext(): Promise<BrowserContext> {
  const [tabs, focusedWindow, idleState] = await Promise.all([
    browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    }),
    browser.windows.getLastFocused(),
    browser.idle.queryState(IDLE_THRESHOLD_SECONDS),
  ]);

  const activeTab = tabs[0];

  return {
    activeTabHostname: getHostname(activeTab?.url),
    isWindowFocused: focusedWindow.focused === true,
    isUserIdle: idleState !== 'active',
    observedAt: Date.now(),
  };
}

async function logBrowserContext(trigger: string): Promise<void> {
  try {
    const context = await getBrowserContext();

    console.log(`[PerMinute] ${trigger}`, context);
  } catch (error) {
    console.error('[PerMinute] Failed to get browser context:', error);
  }
}

export default defineBackground(() => {
  browser.idle.setDetectionInterval(IDLE_THRESHOLD_SECONDS);

  browser.tabs.onActivated.addListener(() => {
    void logBrowserContext('Tab activated');
  });

  browser.tabs.onUpdated.addListener((_tabId, changeInfo) => {
    if (changeInfo.url || changeInfo.status === 'complete') {
      void logBrowserContext('Tab updated');
    }
  });

  browser.windows.onFocusChanged.addListener(() => {
    void logBrowserContext('Window focus changed');
  });

  browser.idle.onStateChanged.addListener(() => {
    void logBrowserContext('Idle state changed');
  });

  void logBrowserContext('Background started');
});
