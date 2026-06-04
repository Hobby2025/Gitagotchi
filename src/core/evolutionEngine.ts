import { PetAffinity, PetArchetype, PetEvolution, PetLineage, PetStage, PetState, StyleScoreKey } from './petState';

const ULTIMATE_STYLE_THRESHOLD = 120;
const styleOrder: StyleScoreKey[] = ['builder', 'cleaner', 'debugger', 'scholar', 'streak'];

function hasCareForMid(state: PetState): boolean {
  return state.mood >= 45 && state.energy >= 25 && state.health >= 40 && state.lifeStatus !== 'dead';
}

function hasCareForSenior(state: PetState): boolean {
  return state.mood >= 60 && state.energy >= 45 && state.health >= 60 && state.lifeStatus === 'alive';
}

function hasMasteryForArchitect(state: PetState): boolean {
  const total = state.counters.refactor + state.counters.feature + state.counters.debug;
  return total >= 30 &&
    styleOrder.every((key) => state.styleScores[key] >= ULTIMATE_STYLE_THRESHOLD) &&
    state.health >= 70 &&
    state.mood >= 70 &&
    state.energy >= 60 &&
    state.lifeStatus === 'alive';
}

export function getGatedEvolution(state: PetState): PetEvolution {
  if (state.level >= 30 && hasMasteryForArchitect(state)) {
    return 'architect';
  }

  if (state.level >= 15 && hasCareForSenior(state)) {
    return 'senior';
  }

  if (state.level >= 5 && hasCareForMid(state)) {
    return 'mid';
  }

  if (state.level >= 2) {
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

function getStage(evolution: PetEvolution): PetStage {
  if (evolution === 'junior') {
    return 'hatchling';
  }
  if (evolution === 'mid') {
    return 'toolkit';
  }
  if (evolution === 'senior') {
    return 'specialist';
  }
  if (evolution === 'architect') {
    return 'ultimate';
  }
  return 'egg';
}

function dominantStyle(state: PetState): StyleScoreKey {
  return styleOrder.reduce((best, key) => (
    state.styleScores[key] > state.styleScores[best] ? key : best
  ), styleOrder[0]);
}

function lineageFromStyle(style: StyleScoreKey): PetLineage {
  if (style === 'builder') {
    return 'buildling';
  }
  if (style === 'cleaner') {
    return 'refact';
  }
  if (style === 'debugger') {
    return 'debugon';
  }
  return 'archivox';
}

function getLineage(state: PetState, stage: PetStage): PetLineage | undefined {
  if (stage === 'egg') {
    return undefined;
  }

  return state.lineage ?? lineageFromStyle(dominantStyle(state));
}

function getAffinity(state: PetState, stage: PetStage): PetAffinity | undefined {
  if (stage !== 'specialist' && stage !== 'ultimate') {
    return undefined;
  }

  return state.affinity ?? dominantStyle(state);
}

export function resolveEvolution(state: PetState): PetState {
  const evolution = getGatedEvolution(state);
  const stage = getStage(evolution);

  return {
    ...state,
    evolution,
    stage,
    lineage: getLineage(state, stage),
    affinity: getAffinity(state, stage),
    archetype: getArchetype(state)
  };
}
