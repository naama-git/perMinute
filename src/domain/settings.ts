
export interface Settings {
  idleThresholdMs: number;
  schemaVersion: number;
}

export const DEFAULT_SETTINGS: Settings = {
  idleThresholdMs: 120_000,
  schemaVersion: 1,
};
