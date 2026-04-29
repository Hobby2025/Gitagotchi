import { ActivityEvent } from '../events';
import { GrowthResult, GrowthRule } from '../growthEngine';
import { PetState } from '../petState';

export const diagnosticsRule: GrowthRule = {
  id: 'diagnostics',
  appliesTo(event: ActivityEvent): boolean {
    return event.type === 'diagnostics';
  },
  apply(event: ActivityEvent, _state: PetState): GrowthResult {
    if (event.type !== 'diagnostics') {
      throw new Error('diagnosticsRule only accepts diagnostics events');
    }

    const delta = event.previous - event.current;

    if (delta > 0) {
      return {
        expDelta: delta * 16,
        moodDelta: delta * 3,
        hungerDelta: -2,
        energyDelta: 1,
        healthDelta: delta * 4,
        styleScoresDelta: {},
        countersDelta: {
          debug: 1
        },
        reasons: ['Diagnostics resolved'],
        breakdown: [{ id: 'diagnostics.resolved', label: 'Diagnostics resolved', expDelta: delta * 16, moodDelta: delta * 3, hungerDelta: -2, energyDelta: 1, healthDelta: delta * 4 }]
      };
    }

    if (delta < 0) {
      return {
        expDelta: 0,
        moodDelta: delta * 3,
        hungerDelta: 0,
        energyDelta: -1,
        healthDelta: delta,
        styleScoresDelta: {},
        countersDelta: {},
        reasons: ['Diagnostics increased'],
        breakdown: [{ id: 'diagnostics.increased', label: 'Diagnostics increased', moodDelta: delta * 3, energyDelta: -1, healthDelta: delta }]
      };
    }

    return {
      expDelta: 0,
      moodDelta: 0,
      hungerDelta: 0,
      energyDelta: 0,
      healthDelta: 0,
      styleScoresDelta: {},
      countersDelta: {},
      reasons: [],
      breakdown: []
    };
  }
};
