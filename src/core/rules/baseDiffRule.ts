import { ActivityEvent } from '../events';
import { GrowthResult, GrowthRule } from '../growthEngine';
import { PetState } from '../petState';

export const baseDiffRule: GrowthRule = {
  id: 'base-diff',
  appliesTo(event: ActivityEvent): boolean {
    return event.type === 'diff' && event.stats.files > 0;
  },
  apply(event: ActivityEvent, _state: PetState): GrowthResult {
    if (event.type !== 'diff') {
      throw new Error('baseDiffRule only accepts diff events');
    }

    const expDelta = Math.floor(event.stats.added / 5) + Math.floor(event.stats.deleted / 10) + event.stats.files * 2;

    return {
      expDelta,
      moodDelta: 2,
      hungerDelta: -2,
      energyDelta: -1,
      healthDelta: 1,
      styleScoresDelta: {},
      countersDelta: {
        feature: event.stats.added > event.stats.deleted ? 1 : 0
      },
      reasons: ['Code changes'],
      breakdown: [{ id: 'base-diff', label: 'Code changes', expDelta, moodDelta: 2, healthDelta: 1 }]
    };
  }
};
