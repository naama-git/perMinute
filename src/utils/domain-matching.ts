import type { Work } from '../domain/work';

/**
 * Converts a URL or hostname into a canonical hostname.
 * Returns null for invalid or unsupported input.
 */
export function normalizeDomain(input: string): string | null {
  const value = input.trim().toLowerCase();

  if (!value) return null;

  try {
    const hasProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(value);
    const url = new URL(hasProtocol ? value : `https://${value}`);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }

    return url.hostname
      .toLowerCase()
      .replace(/\.$/, '')
      .replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * Checks whether an active hostname belongs to a configured domain.
 * Supports exact matches and subdomains.
 */
export function matchesDomain(
  activeHostname: string,
  configuredDomain: string,
): boolean {
  const hostname = normalizeDomain(activeHostname);
  const domain = normalizeDomain(configuredDomain);

  if (!hostname || !domain) return false;

  return hostname === domain || hostname.endsWith(`.${domain}`);
}

/**
 * Returns every active Work matching the given hostname.
 * Never selects a Work automatically.
 */
export function findMatchingWorks(
  hostname: string,
  works: Work[],
): Work[] {
  return works.filter(
    (work) =>
      work.archivedAt === null &&
      work.websiteDomains.some((domain) =>
        matchesDomain(hostname, domain),
      ),
  );
}