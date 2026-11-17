// type
export interface TrackingState {
  status: | 'tracking' | 'paused' | 'needs-work-selection' | 'stopped';
  activeWorkId: string | null;
  activeIntervalId: string | null;
  pauseReason:
    | 'non-work-tab'
    | 'window-inactive'
    | 'idle'
    | 'ambiguous-work'
    | 'manual'
    | null;
  lastEvaluatedAt: number;
  schemaVersion: number;
}