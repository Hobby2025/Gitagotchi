import { MementoLike } from '../adapters/storageAdapter';
import { LeaderboardSyncSnapshot } from './leaderboardTypes';

export class LeaderboardSyncStateStore {
  constructor(
    private readonly memento: MementoLike,
    private readonly key = 'gitagotchi.leaderboard.sync'
  ) {}

  load(): LeaderboardSyncSnapshot {
    return this.memento.get<LeaderboardSyncSnapshot>(this.key) ?? {};
  }

  async save(snapshot: LeaderboardSyncSnapshot): Promise<void> {
    await this.memento.update(this.key, snapshot);
  }
}
