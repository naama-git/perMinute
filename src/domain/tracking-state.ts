// type

export type TrackingStatus =
  | 'tracking'
  | 'paused'
  | 'needs-work-selection'
  | 'stopped';

export type PauseReason =
  | 'non-work-tab'
  | 'window-inactive'
  | 'idle'
  | 'ambiguous-work'
  | 'manual'
  | null;

export interface TrackingState {
  status: TrackingStatus;

  activeWorkId: string | null;
  activeIntervalId: string | null;

  pauseReason: PauseReason;

  lastEvaluatedAt: number;
  schemaVersion: number;
}
