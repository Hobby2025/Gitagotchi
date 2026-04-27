import { createInitialPetState } from '../src/core/petState';
import { PublicLeaderboardPlayer } from '../src/leaderboard/leaderboardTypes';
import {
  createAvatarKey,
  createPublicLeaderboardPlayer,
  getLeaderboardScore,
  sortLeaderboardPlayers,
  upsertLeaderboardPlayer
} from '../src/leaderboard/leaderboardModel';

describe('leaderboard model', () => {
  it('creates a public player snapshot without private activity data', () => {
    const state = {
      ...createInitialPetState('2026-04-27T00:00:00.000Z'),
      level: 12,
      exp: 345,
      species: 'refactoraptor' as const,
      evolution: 'mid' as const,
      archetype: 'cleanCoder' as const,
      logs: [{
        message: 'private activity',
        expDelta: 5,
        occurredAt: '2026-04-27T00:00:00.000Z'
      }]
    };

    const player = createPublicLeaderboardPlayer(state, {
      githubLogin: 'octocat',
      displayName: 'Octo',
      updatedAt: '2026-04-27T01:00:00.000Z'
    });

    expect(player).toEqual({
      githubLogin: 'octocat',
      displayName: 'Octo',
      level: 12,
      exp: 345,
      avatarKey: 'refactoraptor:mid:cleanCoder',
      updatedAt: '2026-04-27T01:00:00.000Z'
    });
    expect(JSON.stringify(player)).not.toContain('private activity');
  });

  it('scores and sorts players by level then exp', () => {
    const players = [
      player('a', 2, 900),
      player('b', 3, 1),
      player('c', 3, 50)
    ];

    expect(getLeaderboardScore(players[0])).toBe(200900);
    expect(sortLeaderboardPlayers(players).map((entry) => entry.githubLogin)).toEqual(['c', 'b', 'a']);
  });

  it('upserts one player while preserving the rest of the document', () => {
    const document = {
      version: 1 as const,
      updatedAt: '2026-04-27T00:00:00.000Z',
      players: [player('a', 1, 1), player('b', 1, 2)]
    };
    const next = upsertLeaderboardPlayer(document, player('b', 5, 10), '2026-04-27T01:00:00.000Z');

    expect(next.updatedAt).toBe('2026-04-27T01:00:00.000Z');
    expect(next.players).toHaveLength(2);
    expect(next.players.find((entry) => entry.githubLogin === 'b')?.level).toBe(5);
  });

  it('creates avatar keys from public monster identity', () => {
    expect(createAvatarKey('bugwyrm', 'senior', 'debugger')).toBe('bugwyrm:senior:debugger');
  });
});

function player(githubLogin: string, level: number, exp: number): PublicLeaderboardPlayer {
  return {
    githubLogin,
    displayName: githubLogin,
    level,
    exp,
    avatarKey: 'bytepup:egg:balanced' as const,
    updatedAt: '2026-04-27T00:00:00.000Z'
  };
}
