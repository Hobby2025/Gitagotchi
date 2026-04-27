import { applyActivity, createDefaultGrowthEngine } from '../src/core/growthEngine';
import { createInitialPetState, getRequiredExp } from '../src/core/petState';
import { ActivityEvent } from '../src/core/events';
import { resolveEvolution } from '../src/core/evolutionEngine';

describe('level design and life cycle', () => {
  it('uses a steeper level curve after the first level', () => {
    expect(getRequiredExp(1)).toBe(100);
    expect(getRequiredExp(2)).toBe(135);
    expect(getRequiredExp(5)).toBe(330);
    expect(getRequiredExp(10)).toBe(975);
    expect(getRequiredExp(20)).toBe(3465);
    expect(getRequiredExp(30)).toBe(7625);
  });

  it('requires care gates for advanced evolutions', () => {
    const base = createInitialPetState('2026-04-27T00:00:00.000Z');

    expect(resolveEvolution({ ...base, level: 10, mood: 20, energy: 80, health: 80 }).evolution).toBe('junior');
    expect(resolveEvolution({ ...base, level: 10, mood: 55, energy: 35, health: 80 }).evolution).toBe('mid');
    expect(resolveEvolution({ ...base, level: 20, mood: 80, energy: 80, health: 45 }).evolution).toBe('mid');
    expect(resolveEvolution({
      ...base,
      level: 30,
      mood: 80,
      energy: 80,
      health: 80,
      counters: { refactor: 8, feature: 8, debug: 4 }
    }).evolution).toBe('architect');
  });

  it('decays into sleeping, critical, and dead states through neglect', () => {
    const state = createInitialPetState('2026-04-20T00:00:00.000Z');

    const sleeping = applyActivity(state, idle('2026-04-23T00:00:00.000Z'), createDefaultGrowthEngine());
    expect(sleeping.lifeStatus).toBe('sleeping');

    const critical = applyActivity(state, idle('2026-04-25T00:00:00.000Z'), createDefaultGrowthEngine());
    expect(critical.lifeStatus).toBe('critical');

    const dead = applyActivity(state, idle('2026-04-28T00:00:00.000Z'), createDefaultGrowthEngine());
    expect(dead.lifeStatus).toBe('dead');
    expect(dead.health).toBe(0);
  });

  it('blocks growth events while dead', () => {
    const dead = {
      ...createInitialPetState('2026-04-20T00:00:00.000Z'),
      lifeStatus: 'dead' as const,
      health: 0,
      exp: 50
    };
    const event: ActivityEvent = {
      type: 'diff',
      stats: {
        added: 500,
        deleted: 10,
        files: 4,
        touchedFiles: ['src/bigFeature.ts']
      },
      occurredAt: '2026-04-27T00:00:00.000Z'
    };

    const next = applyActivity(dead, event, createDefaultGrowthEngine());

    expect(next.exp).toBe(50);
    expect(next.level).toBe(1);
    expect(next.logs[0].message).toBe('No growth while dead');
  });
});

function idle(now: string): ActivityEvent {
  return {
    type: 'idleTick',
    now,
    occurredAt: now
  };
}
