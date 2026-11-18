
import type { TrackingInterval } from '../../domain/tracking-interval';
import type { TrackingState } from '../../domain/tracking-state';
import type { TrackingRepository } from '../ports/tracking.repository';

// Get Tracking Status
export function getTrackingStatus(
  trackingRepository: TrackingRepository,
) {
  return async (): Promise<TrackingState> => {
    const snapshot = await trackingRepository.getSnapshot();

    return snapshot.state;
  };
}

// End Work
export function endWork(trackingRepository: TrackingRepository) {
  return async (): Promise<void> => {
    const snapshot = await trackingRepository.getSnapshot();

    if (snapshot.state.status === 'stopped') {
      return;
    }

    const now = Date.now();

    const updatedIntervals: TrackingInterval[] =
      snapshot.intervals.map((interval) => {
        if (
          interval.id !== snapshot.state.activeIntervalId ||
          interval.endedAt !== null
        ) {
          return interval;
        }

        return {
          ...interval,
          endedAt: now,
          durationMs: Math.max(0, now - interval.startedAt),
        };
      });

    const updatedState: TrackingState = {
      ...snapshot.state,
      status: 'stopped',
      activeWorkId: null,
      activeIntervalId: null,
      pauseReason: null,
      lastEvaluatedAt: now,
    };

    await trackingRepository.saveSnapshot({
      state: updatedState,
      intervals: updatedIntervals,
    });
  };
}
