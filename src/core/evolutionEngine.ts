import { PetAffinity, PetArchetype, PetEvolution, PetLineage, PetStage, PetState, StyleScoreKey } from './petState';

const ULTIMATE_STYLE_THRESHOLD = 120;
const styleOrder: StyleScoreKey[] = ['builder', 'cleaner', 'debugger', 'scholar', 'streak'];

export type EvolutionRequirementId =
  | 'level'
  | 'mood'
  | 'energy'
  | 'health'
  | 'alive'
  | 'counterTotal'
  | 'styleBalance';

export type EvolutionRequirement = {
  id: EvolutionRequirementId;
  current: number;
  target: number;
  met: boolean;
};

export type EvolutionPreview = {
  currentEvolution: PetEvolution;
  currentStage: PetStage;
  nextEvolution?: PetEvolution;
  nextStage?: PetStage;
  requirements: EvolutionRequirement[];
};

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

function createRequirement(id: EvolutionRequirementId, current: number, target: number): EvolutionRequirement {
  return {
    id,
    current,
    target,
    met: current >= target
  };
}

function getCounterTotal(state: PetState): number {
  return state.counters.refactor + state.counters.feature + state.counters.debug;
}

function getMinimumStyleScore(state: PetState): number {
  return Math.min(...styleOrder.map((key) => state.styleScores[key]));
}

export function getEvolutionPreview(state: PetState): EvolutionPreview {
  const currentEvolution = getGatedEvolution(state);
  const currentStage = getStage(currentEvolution);

  if (currentEvolution === 'architect') {
    return {
      currentEvolution,
      currentStage,
      requirements: []
    };
  }

  if (currentEvolution === 'senior') {
    const alive = state.lifeStatus === 'alive' ? 1 : 0;
    return {
      currentEvolution,
      currentStage,
      nextEvolution: 'architect',
      nextStage: 'ultimate',
      requirements: [
        createRequirement('level', state.level, 30),
        createRequirement('counterTotal', getCounterTotal(state), 30),
        createRequirement('styleBalance', getMinimumStyleScore(state), ULTIMATE_STYLE_THRESHOLD),
        createRequirement('health', state.health, 70),
        createRequirement('mood', state.mood, 70),
        createRequirement('energy', state.energy, 60),
        createRequirement('alive', alive, 1)
      ]
    };
  }

  if (currentEvolution === 'mid') {
    const alive = state.lifeStatus === 'alive' ? 1 : 0;
    return {
      currentEvolution,
      currentStage,
      nextEvolution: 'senior',
      nextStage: 'specialist',
      requirements: [
        createRequirement('level', state.level, 15),
        createRequirement('mood', state.mood, 60),
        createRequirement('energy', state.energy, 45),
        createRequirement('health', state.health, 60),
        createRequirement('alive', alive, 1)
      ]
    };
  }

  if (currentEvolution === 'junior') {
    const notDead = state.lifeStatus === 'dead' ? 0 : 1;
    return {
      currentEvolution,
      currentStage,
      nextEvolution: 'mid',
      nextStage: 'toolkit',
      requirements: [
        createRequirement('level', state.level, 5),
        createRequirement('mood', state.mood, 45),
        createRequirement('energy', state.energy, 25),
        createRequirement('health', state.health, 40),
        createRequirement('alive', notDead, 1)
      ]
    };
  }

  return {
    currentEvolution,
    currentStage,
    nextEvolution: 'junior',
    nextStage: 'hatchling',
    requirements: [
      createRequirement('level', state.level, 2)
    ]
  };
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
