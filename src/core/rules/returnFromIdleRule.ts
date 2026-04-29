import { ActivityEvent } from '../events';
import { GrowthResult, GrowthRule } from '../growthEngine';
import { PetState } from '../petState';

const DAY_MS = 24 * 60 * 60 * 1000;

export const returnFromIdleRule: GrowthRule = {
  id: 'return-from-idle',
  appliesTo(event: ActivityEvent, state: PetState): boolean {
    if (event.type === 'idleTick') {
      return false;
    }

    const elapsedDays = Math.floor((new Date(event.occurredAt).getTime() - new Date(state.lastActiveAt).getTime()) / DAY_MS);
    return elapsedDays > 0;
  },
  apply(event: ActivityEvent, state: PetState): GrowthResult {
    if (event.type === 'idleTick') {
      throw new Error('returnFromIdleRule only accepts active events');
    }

    const elapsedDays = Math.floor((new Date(event.occurredAt).getTime() - new Date(state.lastActiveAt).getTime()) / DAY_MS);
    const energyDelta = Math.min(20, Math.max(0, elapsedDays) * 8);

    return {
      expDelta: 0,
      moodDelta: 2,
      hungerDelta: 0,
      energyDelta,
      healthDelta: 0,
      styleScoresDelta: {},
      countersDelta: {},
      reasons: ['Return from idle'],
      breakdown: [{ id: 'return-from-idle', label: 'Return from idle', energyDelta, moodDelta: 2 }]
    };
  }
};
