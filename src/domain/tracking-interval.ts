// Entity

export interface TrackingInterval {
  id: string;
  workId: string;
  startedAt: number;
  endedAt: number | null;
  durationMs: number;
}