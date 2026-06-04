import { applyActivity, createDefaultGrowthEngine } from '../src/core/growthEngine';
import { createInitialPetState } from '../src/core/petState';
import {
  applyReincarnation,
  classChangeCost,
  equipDecoration,
  investStarTreeNode,
  selectPetClass,
  startRaidBoss
} from '../src/domain/game/gameSystem';
import { ActivityEvent } from '../src/core/events';

describe('endgame engine', () => {
  it('adds class focus bonuses when the chosen class style advances', () => {
    const state = selectPetClass(createInitialPetState('2026-06-04T00:00:00.000Z'), 'releaseMaster');
    const event: ActivityEvent = {
      type: 'diff',
      stats: {
        added: 40,
        deleted: 2,
        files: 1,
        touchedFiles: ['src/feature.ts']
      },
      occurredAt: '2026-06-04T01:00:00.000Z'
    };

    const next = applyActivity(state, event, createDefaultGrowthEngine());

    expect(next.endgame.classId).toBe('releaseMaster');
    expect(next.logs[0].breakdown).toContainEqual({
      id: 'class.releaseMaster',
      label: 'Class focus: releaseMaster',
      expDelta: 6,
      moodDelta: 1
    });
    expect(next.endgame.classLevels.releaseMaster).toBe(1);
  });

  it('runs one class-specific training quest per day and unlocks class decorations', () => {
    const state = selectPetClass(createInitialPetState('2026-06-04T00:00:00.000Z'), 'archivist');
    const event: ActivityEvent = {
      type: 'diff',
      stats: {
        added: 10,
        deleted: 1,
        files: 1,
        touchedFiles: ['docs/class-training.md']
      },
      occurredAt: '2026-06-04T01:00:00.000Z'
    };

    const next = applyActivity(state, event, createDefaultGrowthEngine());

    expect(next.decorations).toContain('archiveEmblem');
    expect(next.endgame.classQuest).toMatchObject({
      classId: 'archivist',
      progress: 1,
      completedClassId: 'archivist'
    });
    expect(next.logs[0].breakdown?.some((entry) => entry.id === 'classQuest.archivist')).toBe(true);
  });

  it('charges EXP for switching an already selected class', () => {
    const selected = selectPetClass({
      ...createInitialPetState('2026-06-04T00:00:00.000Z'),
      exp: classChangeCost - 1
    }, 'releaseMaster');
    const blocked = selectPetClass(selected, 'bugTracker');
    const funded = selectPetClass({
      ...selected,
      exp: classChangeCost + 10
    }, 'bugTracker');

    expect(blocked.endgame.classId).toBe('releaseMaster');
    expect(blocked.exp).toBe(classChangeCost - 1);
    expect(funded.endgame.classId).toBe('bugTracker');
    expect(funded.exp).toBe(10);
  });

  it('defeats active raid bosses and unlocks raid decorations', () => {
    const started = startRaidBoss(createInitialPetState('2026-06-04T00:00:00.000Z'), 'releaseGolem');
    const state = {
      ...started,
      endgame: {
        ...started.endgame,
        activeRaid: started.endgame.activeRaid ? { ...started.endgame.activeRaid, hp: 20 } : undefined
      }
    };
    const event: ActivityEvent = {
      type: 'commit',
      hash: 'abc123',
      message: 'feat: release raid reward',
      occurredAt: '2026-06-04T01:00:00.000Z'
    };

    const next = applyActivity(state, event, createDefaultGrowthEngine());

    expect(next.endgame.activeRaid).toBeUndefined();
    expect(next.endgame.defeatedRaidIds).toContain('releaseGolem');
    expect(next.decorations).toContain('releaseBanner');
    expect(next.logs[0].breakdown?.some((entry) => entry.id === 'raid.defeat.releaseGolem')).toBe(true);
  });

  it('tracks season bosses, raid history, milestones, and project profiles', () => {
    const started = selectPetClass(
      startRaidBoss(createInitialPetState('2026-06-04T00:00:00.000Z'), 'breakpointHydra'),
      'archivist'
    );
    const state = {
      ...started,
      endgame: {
        ...started.endgame,
        activeRaid: started.endgame.activeRaid ? { ...started.endgame.activeRaid, hp: 12 } : undefined,
        season: {
          ...started.endgame.season,
          progress: 95,
          claimedMilestones: []
        },
        starTree: {
          unspent: 0,
          nodes: {
            raidMight: 1,
            steadyCare: 0,
            seasonMemory: 1
          }
        }
      }
    };
    const event: ActivityEvent = {
      type: 'diff',
      stats: {
        added: 24,
        deleted: 4,
        files: 2,
        touchedFiles: ['docs/raid-plan.md', 'tests/raid.spec.ts']
      },
      occurredAt: '2026-06-04T01:00:00.000Z',
      projectKey: 'repo-a',
      projectLabel: 'Repo A'
    };

    const next = applyActivity(state, event, createDefaultGrowthEngine());

    expect(next.endgame.activeRaid).toBeUndefined();
    expect(next.endgame.defeatedRaidIds).toContain('breakpointHydra');
    expect(next.endgame.raidHistory[0]).toMatchObject({
      id: 'breakpointHydra',
      decoration: 'breakpointCrown',
      maxHp: 320
    });
    expect(next.decorations).toContain('breakpointCrown');
    expect(next.endgame.season.claimedMilestones).toContain(100);
    expect(next.endgame.projectProfiles['repo-a']).toMatchObject({
      label: 'Repo A',
      raidsCleared: 1
    });
    expect(next.logs[0].breakdown?.some((entry) => entry.id === 'season.milestone.100')).toBe(true);
  });

  it('does not duplicate raid history records for bosses already defeated', () => {
    const started = startRaidBoss(createInitialPetState('2026-06-04T00:00:00.000Z'), 'releaseGolem');
    const state = {
      ...started,
      decorations: ['releaseBanner' as const],
      endgame: {
        ...started.endgame,
        defeatedRaidIds: ['releaseGolem' as const],
        raidHistory: [{
          id: 'releaseGolem' as const,
          defeatedAt: '2026-06-03T01:00:00.000Z',
          decoration: 'releaseBanner' as const,
          maxHp: 260
        }],
        activeRaid: started.endgame.activeRaid ? { ...started.endgame.activeRaid, hp: 1 } : undefined
      }
    };
    const event: ActivityEvent = {
      type: 'commit',
      hash: 'again123',
      message: 'feat: clear same boss again',
      occurredAt: '2026-06-04T01:00:00.000Z'
    };

    const next = applyActivity(state, event, createDefaultGrowthEngine());

    expect(next.endgame.raidHistory).toHaveLength(1);
    expect(next.endgame.raidHistory[0].defeatedAt).toBe('2026-06-03T01:00:00.000Z');
    expect(next.decorations.filter((decoration) => decoration === 'releaseBanner')).toHaveLength(1);
  });

  it('caps same-project daily rewards and records the cap in the reward breakdown', () => {
    const base = createInitialPetState('2026-06-04T00:00:00.000Z');
    const state = {
      ...base,
      endgame: {
        ...base.endgame,
        projectProfiles: {
          'repo-a': {
            key: 'repo-a',
            label: 'Repo A',
            exp: 419,
            dayKey: '2026-06-04',
            dailyExp: 419,
            raidsCleared: 0,
            lastActiveAt: '2026-06-04T00:30:00.000Z'
          }
        }
      }
    };
    const event: ActivityEvent = {
      type: 'commit',
      hash: 'cap123',
      message: 'feat: cap project reward',
      occurredAt: '2026-06-04T01:00:00.000Z',
      projectKey: 'repo-a',
      projectLabel: 'Repo A'
    };

    const next = applyActivity(state, event, createDefaultGrowthEngine());

    expect(next.logs[0].expDelta).toBe(1);
    expect(next.endgame.projectProfiles['repo-a'].dailyExp).toBe(420);
    expect(next.logs[0].breakdown?.some((entry) => entry.id === 'antiAbuse.projectCap')).toBe(true);
  });

  it('adds workspace team raid contribution and rewards clears', () => {
    const base = createInitialPetState('2026-06-04T00:00:00.000Z');
    const state = {
      ...base,
      endgame: {
        ...base.endgame,
        teamRaid: {
          ...base.endgame.teamRaid,
          contribution: 599,
          clears: 0
        }
      }
    };
    const event: ActivityEvent = {
      type: 'commit',
      hash: 'team123',
      message: 'feat: finish workspace raid',
      occurredAt: '2026-06-04T01:00:00.000Z'
    };

    const next = applyActivity(state, event, createDefaultGrowthEngine());

    expect(next.endgame.teamRaid.clears).toBe(1);
    expect(next.endgame.teamRaid.contribution).toBeLessThan(599);
    expect(next.logs[0].breakdown?.some((entry) => entry.id === 'teamRaid.clear')).toBe(true);
  });

  it('spends reincarnation stars on tree nodes and toggles owned decorations', () => {
    const base = {
      ...createInitialPetState('2026-06-04T00:00:00.000Z'),
      decorations: ['breakpointCrown' as const],
      endgame: {
        ...createInitialPetState('2026-06-04T00:00:00.000Z').endgame,
        starTree: {
          unspent: 2,
          nodes: {
            raidMight: 0,
            steadyCare: 0,
            seasonMemory: 0
          }
        }
      }
    };

    const invested = investStarTreeNode(base, 'raidMight');
    const equipped = equipDecoration(invested, 'breakpointCrown');
    const unequipped = equipDecoration(equipped, 'breakpointCrown');

    expect(invested.endgame.starTree.unspent).toBe(1);
    expect(invested.endgame.starTree.nodes.raidMight).toBe(1);
    expect(equipped.equippedDecorations).toEqual(['breakpointCrown']);
    expect(unequipped.equippedDecorations).toEqual([]);
  });

  it('reincarnates ultimate pets into stars while preserving collection progress', () => {
    const state = {
      ...createInitialPetState('2026-06-04T00:00:00.000Z'),
      level: 30,
      stage: 'ultimate' as const,
      evolution: 'architect' as const,
      lifeStatus: 'alive' as const,
      discoveredSpriteIds: ['egg-common-normal', 'buildling-ultimate-happy'],
      decorations: ['releaseBanner' as const],
      styleScores: {
        builder: 200,
        cleaner: 160,
        debugger: 140,
        scholar: 130,
        streak: 150
      }
    };

    const result = applyReincarnation(state, new Date('2026-06-04T02:00:00.000Z'));

    expect(result.reincarnated).toBe(true);
    if (!result.reincarnated) {
      return;
    }
    expect(result.starsGained).toBe(1);
    expect(result.state.level).toBe(1);
    expect(result.state.endgame.stars).toBe(1);
    expect(result.state.endgame.starTree.unspent).toBe(1);
    expect(result.state.endgame.reincarnations).toBe(1);
    expect(result.state.discoveredSpriteIds).toContain('buildling-ultimate-happy');
    expect(result.state.decorations).toContain('releaseBanner');
    expect(result.state.styleScores.builder).toBe(30);
  });
});
