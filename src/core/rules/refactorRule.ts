import { ActivityEvent } from '../events';
import { GrowthResult, GrowthRule } from '../growthEngine';
import { PetState } from '../petState';

export const refactorRule: GrowthRule = {
  id: 'refactor',
  appliesTo(event: ActivityEvent): boolean {
    return event.type === 'diff' && event.stats.deleted > event.stats.added;
  },
  apply(_event: ActivityEvent, _state: PetState): GrowthResult {
    return {
      expDelta: 8,
      moodDelta: 3,
      hungerDelta: 0,
      energyDelta: 0,
      healthDelta: 1,
      styleScoresDelta: {},
      countersDelta: {
        refactor: 1
      },
      reasons: ['Refactoring'],
      breakdown: [{ id: 'refactor', label: 'Refactoring', expDelta: 8, moodDelta: 3, healthDelta: 1 }]
    };
  }
};
