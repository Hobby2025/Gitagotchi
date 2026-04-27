import { LeaderboardSyncSnapshot } from './leaderboardTypes';

const HOUR_MS = 60 * 60 * 1000;

export function shouldSyncLeaderboard(
  snapshot: LeaderboardSyncSnapshot,
  currentScore: number,
  now: string,
  intervalMs = HOUR_MS
): boolean {
  if (snapshot.lastScore === currentScore) {
    return false;
  }

  if (!snapshot.lastSyncedAt) {
    return true;
  }

  return new Date(now).getTime() - new Date(snapshot.lastSyncedAt).getTime() >= intervalMs;
}

export function getNextSyncAt(snapshot: LeaderboardSyncSnapshot, intervalMs = HOUR_MS): string | undefined {
  if (!snapshot.lastSyncedAt) {
    return undefined;
  }

  return new Date(new Date(snapshot.lastSyncedAt).getTime() + intervalMs).toISOString();
}

export class MemoryLeaderboardSyncState {
  constructor(private snapshot: LeaderboardSyncSnapshot = {}) {}

  load(): LeaderboardSyncSnapshot {
    return this.snapshot;
  }

  save(snapshot: LeaderboardSyncSnapshot): void {
    this.snapshot = snapshot;
  }
}
