import { ActivityEvent } from '../src/core/events';
import { applyActivity, createDefaultGrowthEngine } from '../src/core/growthEngine';
import { createInitialPetState, PetSkill } from '../src/core/petState';
import { createActivityMessages } from '../src/messages/messageEngine';

describe('growth breakdown and message blocks', () => {
  it('stores itemized growth breakdown entries instead of duplicating total exp per reason', () => {
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

    expect(next.logs[0].message).toBe('+42 EXP from 4 bonuses');
    expect(next.logs[0].breakdown).toEqual([
      { id: 'base-diff', label: 'Code changes', expDelta: 16, moodDelta: 2, healthDelta: 1 },
      { id: 'refactor', label: 'Refactoring', expDelta: 10, moodDelta: 3, healthDelta: 1 },
      { id: 'skill.deepClean', label: 'Deep Clean skill', expDelta: 12, moodDelta: 2 },
      { id: 'skill.focusFlow', label: 'Focus Flow skill', expDelta: 4, energyDelta: 1 }
    ]);
  });

  it('builds modular messages from growth, style, and skill blocks', () => {
    const messages = createActivityMessages({
      occurredAt: '2026-04-27T00:03:00.000Z',
      expDelta: 42,
      breakdown: [
        { id: 'base-diff', label: 'Code changes', expDelta: 16 },
        { id: 'skill.deepClean', label: 'Deep Clean skill', expDelta: 12 }
      ],
      styleScoresDelta: { builder: 0, cleaner: 20, debugger: 0, scholar: 0, streak: 0 },
      unlockedSkills: ['deepClean']
    });

    expect(messages).toEqual([
      { kind: 'reward', text: '+42 EXP from 2 bonuses' },
      { kind: 'style', text: 'Refactor Craft +20' },
      { kind: 'unlock', text: 'Learned Deep Clean' }
    ]);
  });
});
