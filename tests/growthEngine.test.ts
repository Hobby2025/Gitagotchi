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
    expect(result.hungerDelta).toBe(-2);
    expect(result.reasons).toEqual([
      'Code changes',
      'Refactoring',
      'Test changes',
      'README changes'
    ]);
  });

  it('rewards useful commit messages once commit events are emitted', () => {
    const state = createInitialPetState('2026-04-27T00:00:00.000Z');
    const event: ActivityEvent = {
      type: 'commit',
      hash: 'abc123',
      message: 'refactor growth engine',
      occurredAt: '2026-04-27T00:01:00.000Z'
    };

    expect(createDefaultGrowthEngine().evaluate(event, state).expDelta).toBe(30);
  });

  it('raises mood and exp when diagnostics are resolved', () => {
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
    expect(result.reasons).toEqual(['Diagnostics resolved']);
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
    expect(result.breakdown).toContainEqual({ id: 'base-diff', label: 'Code changes', expDelta: 167, moodDelta: 2, healthDelta: 1 });
  });
});
