import { ActivityEvent } from '../events';
import { GrowthResult, GrowthRule } from '../growthEngine';
import { PetState } from '../petState';

function dampenDiffExp(rawExp: number): number {
  if (rawExp <= 80) {
    return rawExp;
  }

  return Math.min(180, Math.round(80 + Math.sqrt(rawExp - 80) * 6));
}

export const baseDiffRule: GrowthRule = {
  id: 'base-diff',
  appliesTo(event: ActivityEvent): boolean {
    return event.type === 'diff' && event.stats.files > 0;
  },
  apply(event: ActivityEvent, _state: PetState): GrowthResult {
    if (event.type !== 'diff') {
      throw new Error('baseDiffRule only accepts diff events');
    }

    const rawExp = Math.floor(event.stats.added / 8) + Math.floor(event.stats.deleted / 12) + event.stats.files * 2;
    const expDelta = dampenDiffExp(rawExp);

    return {
      expDelta,
      moodDelta: 2,
      hungerDelta: -3,
      energyDelta: 0,
      healthDelta: 1,
      styleScoresDelta: {},
      countersDelta: {
        feature: event.stats.added > event.stats.deleted ? 1 : 0
      },
      reasons: ['Code changes'],
      breakdown: [{ id: 'base-diff', label: 'Code changes', expDelta, moodDelta: 2, hungerDelta: -3, healthDelta: 1 }]
    };
  }
};
