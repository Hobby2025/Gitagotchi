import { PetArchetype, PetEvolution, PetSpecies, PetState } from '../core/petState';
import { AvatarKey, LeaderboardDocument, PublicLeaderboardPlayer } from './leaderboardTypes';

export function createAvatarKey(
  species: PetSpecies,
  evolution: PetEvolution,
  archetype: PetArchetype
): AvatarKey {
  return `${species}:${evolution}:${archetype}`;
}

export function createPublicLeaderboardPlayer(
  state: PetState,
  input: { githubLogin: string; displayName: string; updatedAt: string }
): PublicLeaderboardPlayer {
  return {
    githubLogin: input.githubLogin,
    displayName: input.displayName,
    level: state.level,
    exp: state.exp,
    avatarKey: createAvatarKey(state.species, state.evolution, state.archetype),
    updatedAt: input.updatedAt
  };
}

export function getLeaderboardScore(player: Pick<PublicLeaderboardPlayer, 'level' | 'exp'>): number {
  return player.level * 100000 + player.exp;
}

export function sortLeaderboardPlayers(players: PublicLeaderboardPlayer[]): PublicLeaderboardPlayer[] {
  return [...players].sort((a, b) => {
    const scoreDelta = getLeaderboardScore(b) - getLeaderboardScore(a);
    if (scoreDelta !== 0) {
      return scoreDelta;
    }
    return a.githubLogin.localeCompare(b.githubLogin);
  });
}

export function createEmptyLeaderboardDocument(now: string): LeaderboardDocument {
  return {
    version: 1,
    updatedAt: now,
    players: []
  };
}

export function upsertLeaderboardPlayer(
  document: LeaderboardDocument | undefined,
  player: PublicLeaderboardPlayer,
  updatedAt: string
): LeaderboardDocument {
  const base = document ?? createEmptyLeaderboardDocument(updatedAt);
  const players = base.players.filter((entry) => entry.githubLogin !== player.githubLogin);

  return {
    version: 1,
    updatedAt,
    players: sortLeaderboardPlayers([...players, player])
  };
}
