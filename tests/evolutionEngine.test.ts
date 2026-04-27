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
      counters: { refactor: 8, feature: 8, debug: 4 }
    };

    expect(resolveEvolution(state).evolution).toBe('architect');
  });

  it('assigns archetypes from activity counters', () => {
    const base = createInitialPetState('2026-04-27T00:00:00.000Z');

    expect(resolveEvolution({ ...base, counters: { ...base.counters, refactor: 5 } }).archetype).toBe('cleanCoder');
    expect(resolveEvolution({ ...base, counters: { ...base.counters, feature: 5 } }).archetype).toBe('builder');
    expect(resolveEvolution({ ...base, counters: { ...base.counters, debug: 5 } }).archetype).toBe('debugger');
  });
});
