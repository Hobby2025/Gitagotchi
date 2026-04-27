import { PetState } from '../core/petState';
import { createPublicLeaderboardPlayer, getLeaderboardScore, upsertLeaderboardPlayer } from './leaderboardModel';
import { LeaderboardDocument, LeaderboardSyncAdapter } from './leaderboardTypes';

export type PublishLeaderboardInput = {
  adapter: LeaderboardSyncAdapter;
  state: PetState;
  githubLogin: string;
  displayName: string;
  now: string;
};

function isConflict(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'status' in error && (error as { status?: number }).status === 409;
}

export async function publishLeaderboard(input: PublishLeaderboardInput): Promise<LeaderboardDocument> {
  const player = createPublicLeaderboardPlayer(input.state, {
    githubLogin: input.githubLogin,
    displayName: input.displayName,
    updatedAt: input.now
  });

  const publishOnce = async (): Promise<LeaderboardDocument> => {
    const current = await input.adapter.load();
    const next = upsertLeaderboardPlayer(current, player, input.now);
    await input.adapter.save(next);
    return next;
  };

  try {
    return await publishOnce();
  } catch (error) {
    if (!isConflict(error)) {
      throw error;
    }
    return publishOnce();
  }
}

export function getPetLeaderboardScore(state: PetState): number {
  return getLeaderboardScore({ level: state.level, exp: state.exp });
}
