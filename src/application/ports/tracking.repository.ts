
import type { TrackingInterval } from '../../domain/tracking-interval';
import type { TrackingState } from '../../domain/tracking-state';

export interface TrackingSnapshot {
  state: TrackingState;
  intervals: TrackingInterval[];
}

export interface TrackingRepository {
  getSnapshot(): Promise<TrackingSnapshot>;
  saveSnapshot(snapshot: TrackingSnapshot): Promise<void>;
}
