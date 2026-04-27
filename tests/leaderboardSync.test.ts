import { createInitialPetState } from '../src/core/petState';
import { MemoryLeaderboardSyncState, shouldSyncLeaderboard } from '../src/leaderboard/leaderboardScheduler';
import { publishLeaderboard } from '../src/leaderboard/leaderboardService';
import { LeaderboardDocument, LeaderboardSyncAdapter } from '../src/leaderboard/leaderboardTypes';

describe('leaderboard sync', () => {
  it('syncs only after one hour and only when score changed', () => {
    const syncState = new MemoryLeaderboardSyncState({
      lastSyncedAt: '2026-04-27T00:00:00.000Z',
      lastScore: 100001
    });

    expect(shouldSyncLeaderboard(syncState.load(), 100002, '2026-04-27T00:59:00.000Z')).toBe(false);
    expect(shouldSyncLeaderboard(syncState.load(), 100001, '2026-04-27T01:01:00.000Z')).toBe(false);
    expect(shouldSyncLeaderboard(syncState.load(), 100002, '2026-04-27T01:01:00.000Z')).toBe(true);
  });

  it('publishes a player snapshot without mutating local pet state', async () => {
    const state = createInitialPetState('2026-04-27T00:00:00.000Z');
    const adapter = new MemoryLeaderboardAdapter();

    const document = await publishLeaderboard({
      adapter,
      state,
      githubLogin: 'octocat',
      displayName: 'Octo',
      now: '2026-04-27T01:00:00.000Z'
    });

    expect(document.players[0].githubLogin).toBe('octocat');
    expect(state.logs).toEqual([]);
  });

  it('retries once after a write conflict using the latest document', async () => {
    const state = createInitialPetState('2026-04-27T00:00:00.000Z');
    const adapter = new ConflictOnceAdapter();

    const document = await publishLeaderboard({
      adapter,
      state,
      githubLogin: 'octocat',
      displayName: 'Octo',
      now: '2026-04-27T01:00:00.000Z'
    });

    expect(adapter.saveAttempts).toBe(2);
    expect(document.players.map((player) => player.githubLogin)).toEqual(['friend', 'octocat']);
  });
});

class MemoryLeaderboardAdapter implements LeaderboardSyncAdapter {
  document: LeaderboardDocument = {
    version: 1 as const,
    updatedAt: '2026-04-27T00:00:00.000Z',
    players: []
  };

  async load() {
    return this.document;
  }

  async save(document: typeof this.document) {
    this.document = document;
  }
}

class ConflictOnceAdapter implements LeaderboardSyncAdapter {
  saveAttempts = 0;
  document: LeaderboardDocument = {
    version: 1 as const,
    updatedAt: '2026-04-27T00:00:00.000Z',
    players: [{
      githubLogin: 'friend',
      displayName: 'Friend',
      level: 2,
      exp: 3,
      avatarKey: 'bytepup:egg:balanced' as const,
      updatedAt: '2026-04-27T00:00:00.000Z'
    }]
  };

  async load() {
    return this.document;
  }

  async save(document: typeof this.document) {
    this.saveAttempts += 1;
    if (this.saveAttempts === 1) {
      const error = new Error('conflict') as Error & { status?: number };
      error.status = 409;
      throw error;
    }
    this.document = document;
  }
}
