import { resolveEvolution } from '../src/core/evolutionEngine';
import { createInitialPetState } from '../src/core/petState';

describe('resolveEvolution', () => {
  it.each([
    [1, 'egg'],
    [5, 'junior'],
    [10, 'mid'],
    [20, 'senior']
  ] as const)('maps level %i to %s evolution', (level, evolution) => {
    const state = { ...createInitialPetState('2026-04-27T00:00:00.000Z'), level };

    expect(resolveEvolution(state).evolution).toBe(evolution);
  });

  it('requires mastery counters before architect evolution', () => {
    const state = {
      ...createInitialPetState('2026-04-27T00:00:00.000Z'),
      level: 30,
      counters: { refactor: 8, feature: 8, debug: 4 },
      styleScores: { builder: 130, cleaner: 130, debugger: 130, scholar: 130, streak: 130 }
    };

    expect(resolveEvolution(state).evolution).toBe('architect');
    expect(resolveEvolution(state).stage).toBe('ultimate');
  });

  it('assigns archetypes from activity counters', () => {
    const base = createInitialPetState('2026-04-27T00:00:00.000Z');

    expect(resolveEvolution({ ...base, counters: { ...base.counters, refactor: 5 } }).archetype).toBe('cleanCoder');
    expect(resolveEvolution({ ...base, counters: { ...base.counters, feature: 5 } }).archetype).toBe('builder');
    expect(resolveEvolution({ ...base, counters: { ...base.counters, debug: 5 } }).archetype).toBe('debugger');
  });

  it('stays at junior when mid gate conditions are not met', () => {
    const base = createInitialPetState('2026-04-27T00:00:00.000Z');
    const state = { ...base, level: 10, mood: 30, energy: 20, health: 30 };

    expect(resolveEvolution(state).evolution).toBe('junior');
  });

  it('stays at mid when senior gate conditions are not met', () => {
    const base = createInitialPetState('2026-04-27T00:00:00.000Z');
    const state = { ...base, level: 20, mood: 50, energy: 30, health: 50 };

    expect(resolveEvolution(state).evolution).toBe('mid');
  });

  it('stays at senior when architect mastery is not met', () => {
    const base = createInitialPetState('2026-04-27T00:00:00.000Z');
    const state = {
      ...base,
      level: 30,
      health: 80,
      mood: 80,
      energy: 70,
      counters: { refactor: 8, feature: 8, debug: 4 },
      styleScores: { builder: 130, cleaner: 130, debugger: 40, scholar: 130, streak: 130 }
    };

    expect(resolveEvolution(state).evolution).toBe('senior');
    expect(resolveEvolution(state).stage).toBe('specialist');
  });

  it('persists monster branch fields from dominant developer ability', () => {
    const base = createInitialPetState('2026-04-27T00:00:00.000Z');
    const state = resolveEvolution({
      ...base,
      level: 20,
      styleScores: { builder: 10, cleaner: 5, debugger: 90, scholar: 30, streak: 40 }
    });

    expect(state.stage).toBe('specialist');
    expect(state.lineage).toBe('debugon');
    expect(state.affinity).toBe('debugger');
  });
});
