import { ActivityEvent } from '../events';
import { GrowthResult, GrowthRule } from '../growthEngine';
import { PetState } from '../petState';

const DAY_MS = 24 * 60 * 60 * 1000;

export const idleDecayRule: GrowthRule = {
  id: 'idle-decay',
  appliesTo(event: ActivityEvent, state: PetState): boolean {
    if (event.type !== 'idleTick') {
      return false;
    }

    return new Date(event.now).getTime() > new Date(state.lastActiveAt).getTime();
  },
  apply(event: ActivityEvent, state: PetState): GrowthResult {
    if (event.type !== 'idleTick') {
      throw new Error('idleDecayRule only accepts idleTick events');
    }

    const elapsedDays = Math.floor((new Date(event.now).getTime() - new Date(state.lastActiveAt).getTime()) / DAY_MS);
    const days = Math.max(0, elapsedDays);

    return {
      expDelta: 0,
      moodDelta: -6 * days,
      hungerDelta: 15 * days,
      energyDelta: -8 * days,
      healthDelta: -15 * days,
      styleScoresDelta: {},
      countersDelta: {},
      reasons: days > 0 ? ['Idle decay'] : [],
      breakdown: days > 0 ? [{ id: 'idle-decay', label: 'Idle decay', moodDelta: -6 * days, hungerDelta: 15 * days, energyDelta: -8 * days, healthDelta: -15 * days }] : []
    };
  }
};
