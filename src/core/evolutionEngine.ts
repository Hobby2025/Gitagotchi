import { PetArchetype, PetEvolution, PetState } from './petState';

export function getEvolutionForLevel(level: number): PetEvolution {
  if (level >= 30) {
    return 'architect';
  }
  if (level >= 20) {
    return 'senior';
  }
  if (level >= 10) {
    return 'mid';
  }
  if (level >= 5) {
    return 'junior';
  }
  return 'egg';
}

function hasCareForMid(state: PetState): boolean {
  return state.mood >= 45 && state.energy >= 25 && state.health >= 40 && state.lifeStatus !== 'dead';
}

function hasCareForSenior(state: PetState): boolean {
  return state.mood >= 60 && state.energy >= 45 && state.health >= 60 && state.lifeStatus === 'alive';
}

function hasMasteryForArchitect(state: PetState): boolean {
  const total = state.counters.refactor + state.counters.feature + state.counters.debug;
  return total >= 20 && state.health >= 70 && state.mood >= 70 && state.energy >= 60 && state.lifeStatus === 'alive';
}

export function getGatedEvolution(state: PetState): PetEvolution {
  if (state.level >= 30 && hasMasteryForArchitect(state)) {
    return 'architect';
  }

  if (state.level >= 20 && hasCareForSenior(state)) {
    return 'senior';
  }

  if (state.level >= 10 && hasCareForMid(state)) {
    return 'mid';
  }

  if (state.level >= 5) {
    return 'junior';
  }

  return 'egg';
}

function getArchetype(state: PetState): PetArchetype {
  const { refactor, feature, debug } = state.counters;
  const max = Math.max(refactor, feature, debug);

  if (max <= 0) {
    return 'balanced';
  }

  if (refactor === max && refactor > feature && refactor > debug) {
    return 'cleanCoder';
  }

  if (feature === max && feature > refactor && feature > debug) {
    return 'builder';
  }

  if (debug === max && debug > refactor && debug > feature) {
    return 'debugger';
  }

  return 'balanced';
}

export function resolveEvolution(state: PetState): PetState {
  return {
    ...state,
    evolution: getGatedEvolution(state),
    archetype: getArchetype(state)
  };
}
