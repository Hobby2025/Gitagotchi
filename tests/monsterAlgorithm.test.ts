import { ActivityEvent } from '../src/core/events';
import { applyActivity, createDefaultGrowthEngine } from '../src/core/growthEngine';
import { createInitialPetState, PetSkill } from '../src/core/petState';
import { resolveMonsterIdentity } from '../src/core/monsterIdentity';
import { calculateStyleDelta } from '../src/core/styleScoring';

describe('monster-style growth algorithm', () => {
  it('scores coding style from diff shape and touched file intent', () => {
    const event: ActivityEvent = {
      type: 'diff',
      stats: {
        added: 80,
        deleted: 12,
        files: 4,
        touchedFiles: ['src/feature.ts', 'tests/feature.test.ts', 'README.md', 'vite.config.ts']
      },
      occurredAt: '2026-04-27T00:00:00.000Z'
    };

    expect(calculateStyleDelta(event)).toEqual({
      builder: 16,
      cleaner: 2,
      debugger: 0,
      scholar: 28,
      streak: 0
    });
  });

  it('derives species from dominant style score and level gates', () => {
    const base = createInitialPetState('2026-04-27T00:00:00.000Z');

    expect(resolveMonsterIdentity({
      ...base,
      level: 12,
      styleScores: { builder: 120, cleaner: 20, debugger: 10, scholar: 5, streak: 0 }
    }).species).toBe('forgebeak');

    expect(resolveMonsterIdentity({
      ...base,
      level: 22,
      styleScores: { builder: 12, cleaner: 180, debugger: 10, scholar: 5, streak: 0 }
    }).species).toBe('refactoraptor');

    expect(resolveMonsterIdentity({
      ...base,
      level: 31,
      styleScores: { builder: 40, cleaner: 40, debugger: 40, scholar: 40, streak: 160 }
    }).species).toBe('architect-drake');
  });

  it('unlocks skills from species, care, and style mastery', () => {
    const base = createInitialPetState('2026-04-27T00:00:00.000Z');
    const identity = resolveMonsterIdentity({
      ...base,
      level: 18,
      mood: 82,
      health: 90,
      species: 'refactoraptor',
      styleScores: { builder: 10, cleaner: 140, debugger: 20, scholar: 5, streak: 8 }
    });

    expect(identity.skills).toEqual(['deepClean', 'focusFlow']);
  });

  it('applies species skills as readable bonus rewards', () => {
    const state = {
      ...createInitialPetState('2026-04-27T00:00:00.000Z'),
      level: 18,
      mood: 82,
      health: 90,
      species: 'refactoraptor' as const,
      styleScores: { builder: 10, cleaner: 140, debugger: 20, scholar: 5, streak: 8 },
      skills: ['deepClean', 'focusFlow'] satisfies PetSkill[]
    };
    const event: ActivityEvent = {
      type: 'diff',
      stats: {
        added: 20,
        deleted: 80,
        files: 2,
        touchedFiles: ['src/legacy.ts', 'src/newCore.ts']
      },
      occurredAt: '2026-04-27T00:03:00.000Z'
    };

    const next = applyActivity(state, event, createDefaultGrowthEngine());

    expect(next.exp).toBe(42);
    expect(next.styleScores.cleaner).toBe(160);
    expect(next.skills).toContain('deepClean');
    expect(next.logs[0].breakdown?.map((entry) => entry.label)).toContain('Deep Clean skill');
    expect(next.logs[0].breakdown?.map((entry) => entry.label)).toContain('Focus Flow skill');
  });
});
