import { applyActivity, createDefaultGrowthEngine } from '../src/core/growthEngine';
import { createInitialPetState, getRequiredExp } from '../src/core/petState';
import { ActivityEvent } from '../src/core/events';

describe('growth engine', () => {
  it('combines base diff, refactor, and file type rules', () => {
    const state = createInitialPetState('2026-04-27T00:00:00.000Z');
    const event: ActivityEvent = {
      type: 'diff',
      stats: {
        added: 10,
        deleted: 25,
        files: 3,
        touchedFiles: ['src/app.ts', 'tests/app.test.ts', 'README.md']
      },
      occurredAt: '2026-04-27T00:01:00.000Z'
    };

    const result = createDefaultGrowthEngine().evaluate(event, state);

    expect(result.expDelta).toBe(33);
    expect(result.moodDelta).toBe(5);
    expect(result.hungerDelta).toBe(-3);
    expect(result.energyDelta).toBe(2);
    expect(result.healthDelta).toBe(5);
    expect(result.reasons).toEqual([
      'Code changes',
      'Refactoring',
      'Test changes',
      'README changes'
    ]);
  });

  it('rewards useful commit messages with automatic care recovery', () => {
    const state = createInitialPetState('2026-04-27T00:00:00.000Z');
    const event: ActivityEvent = {
      type: 'commit',
      hash: 'abc123',
      message: 'refactor growth engine',
      occurredAt: '2026-04-27T00:01:00.000Z'
    };

    const result = createDefaultGrowthEngine().evaluate(event, state);

    expect(result.expDelta).toBe(30);
    expect(result.hungerDelta).toBe(-5);
    expect(result.energyDelta).toBe(4);
    expect(result.healthDelta).toBe(3);
    expect(result.breakdown).toContainEqual({
      id: 'commit-message',
      label: 'Refactor commit',
      expDelta: 30,
      moodDelta: 5,
      hungerDelta: -5,
      energyDelta: 4,
      healthDelta: 3
    });
  });

  it('raises mood, exp, and health when diagnostics are resolved', () => {
    const state = createInitialPetState('2026-04-27T00:00:00.000Z');
    const event: ActivityEvent = {
      type: 'diagnostics',
      previous: 5,
      current: 2,
      occurredAt: '2026-04-27T00:01:00.000Z'
    };

    const result = createDefaultGrowthEngine().evaluate(event, state);

    expect(result.expDelta).toBe(48);
    expect(result.moodDelta).toBe(9);
    expect(result.hungerDelta).toBe(-2);
    expect(result.energyDelta).toBe(1);
    expect(result.healthDelta).toBe(12);
    expect(result.reasons).toEqual(['Diagnostics resolved']);
  });

  it('keeps diagnostics spikes from dropping health to zero', () => {
    const state = {
      ...createInitialPetState('2026-04-27T00:00:00.000Z'),
      health: 40
    };
    const event: ActivityEvent = {
      type: 'diagnostics',
      previous: 2,
      current: 80,
      occurredAt: '2026-04-27T00:01:00.000Z'
    };

    const next = applyActivity(state, event, createDefaultGrowthEngine());

    expect(next.health).toBe(1);
    expect(next.lifeStatus).toBe('critical');
    expect(next.logs[0].breakdown).toContainEqual({
      id: 'diagnostics.increased',
      label: 'Diagnostics increased',
      moodDelta: -234,
      energyDelta: -1,
      healthDelta: -39
    });
  });

  it('restores energy when coding resumes after idle time', () => {
    const state = {
      ...createInitialPetState('2026-04-20T00:00:00.000Z'),
      energy: 15,
      lifeStatus: 'sleeping' as const
    };
    const event: ActivityEvent = {
      type: 'diff',
      stats: {
        added: 12,
        deleted: 0,
        files: 1,
        touchedFiles: ['src/return.ts']
      },
      occurredAt: '2026-04-23T00:01:00.000Z'
    };

    const next = applyActivity(state, event, createDefaultGrowthEngine());

    expect(next.energy).toBe(35);
    expect(next.lifeStatus).toBe('alive');
    expect(next.logs[0].breakdown).toContainEqual({
      id: 'return-from-idle',
      label: 'Return from idle',
      energyDelta: 20,
      moodDelta: 2
    });
  });

  it('applies idle decay as hunger increase and energy loss', () => {
    const state = createInitialPetState('2026-04-20T00:00:00.000Z');
    const event: ActivityEvent = {
      type: 'idleTick',
      now: '2026-04-23T00:00:00.000Z',
      occurredAt: '2026-04-23T00:00:00.000Z'
    };

    const result = createDefaultGrowthEngine().evaluate(event, state);

    expect(result.hungerDelta).toBe(45);
    expect(result.moodDelta).toBe(-18);
    expect(result.energyDelta).toBe(-24);
    expect(result.reasons).toEqual(['Idle decay']);
  });

  it('keeps idle decay from dropping health to zero', () => {
    const state = createInitialPetState('2026-04-20T00:00:00.000Z');
    const event: ActivityEvent = {
      type: 'idleTick',
      now: '2026-04-28T00:00:00.000Z',
      occurredAt: '2026-04-28T00:00:00.000Z'
    };

    const result = createDefaultGrowthEngine().evaluate(event, state);

    expect(result.healthDelta).toBe(-99);
    expect(result.breakdown).toContainEqual({
      id: 'idle-decay',
      label: 'Idle decay',
      moodDelta: -48,
      hungerDelta: 120,
      energyDelta: -64,
      healthDelta: -99
    });
  });

  it('applies bounded state changes and level ups', () => {
    const state = {
      ...createInitialPetState('2026-04-27T00:00:00.000Z'),
      exp: getRequiredExp(1) - 5,
      hunger: 1,
      mood: 98
    };
    const event: ActivityEvent = {
      type: 'diff',
      stats: {
        added: 25,
        deleted: 0,
        files: 1,
        touchedFiles: ['src/feature.ts']
      },
      occurredAt: '2026-04-27T00:01:00.000Z'
    };

    const next = applyActivity(state, event, createDefaultGrowthEngine());

    expect(next.level).toBe(2);
    expect(next.exp).toBe(0);
    expect(next.hunger).toBe(0);
    expect(next.mood).toBe(100);
  });

  it('dampens very large diffs so one snapshot cannot dominate growth', () => {
    const state = createInitialPetState('2026-04-27T00:00:00.000Z');
    const event: ActivityEvent = {
      type: 'diff',
      stats: {
        added: 2000,
        deleted: 0,
        files: 20,
        touchedFiles: ['src/largeFeature.ts']
      },
      occurredAt: '2026-04-27T00:01:00.000Z'
    };

    const result = createDefaultGrowthEngine().evaluate(event, state);

    expect(result.expDelta).toBe(167);
    expect(result.breakdown).toContainEqual({ id: 'base-diff', label: 'Code changes', expDelta: 167, moodDelta: 2, hungerDelta: -3, healthDelta: 1 });
  });
});
