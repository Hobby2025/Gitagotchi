export type PetEvolution = 'egg' | 'junior' | 'mid' | 'senior' | 'architect';
export type PetStage = 'egg' | 'hatchling' | 'toolkit' | 'specialist' | 'ultimate';
export type PetLineage = 'buildling' | 'refact' | 'debugon' | 'archivox';
export type PetAffinity = 'builder' | 'cleaner' | 'debugger' | 'scholar' | 'streak';
export type PetArchetype = 'balanced' | 'cleanCoder' | 'builder' | 'debugger';
export type PetMood = 'happy' | 'normal' | 'sad' | 'sleeping';
export type PetLifeStatus = 'alive' | 'sleeping' | 'critical' | 'dead';
export type StyleScoreKey = 'builder' | 'cleaner' | 'debugger' | 'scholar' | 'streak';
export type PetSpecies = 'bytepup' | 'forgebeak' | 'refactoraptor' | 'bugwyrm' | 'documancer' | 'architect-drake';
export type PetSkill = 'deepClean' | 'quickFix' | 'fieldGuide' | 'focusFlow' | 'commitRoar';

export type StyleScores = Record<StyleScoreKey, number>;

export type PetCounters = {
  refactor: number;
  feature: number;
  debug: number;
};

export type PetLogEntry = {
  message: string;
  expDelta: number;
  occurredAt: string;
  breakdown?: GrowthBreakdownEntry[];
  messages?: PetMessage[];
};

export type GrowthBreakdownEntry = {
  id: string;
  label: string;
  expDelta?: number;
  moodDelta?: number;
  hungerDelta?: number;
  energyDelta?: number;
  healthDelta?: number;
};

export type PetMessageKind = 'reward' | 'style' | 'unlock' | 'status';

export type PetMessage = {
  kind: PetMessageKind;
  text: string;
};

export type PetState = {
  name?: string;
  level: number;
  exp: number;
  hunger: number;
  mood: number;
  energy: number;
  health: number;
  lifeStatus: PetLifeStatus;
  evolution: PetEvolution;
  stage: PetStage;
  lineage?: PetLineage;
  affinity?: PetAffinity;
  archetype: PetArchetype;
  species: PetSpecies;
  styleScores: StyleScores;
  skills: PetSkill[];
  discoveredSpriteIds: string[];
  lastActiveAt: string;
  lastPattedAt?: string;
  lastCommitHash?: string;
  counters: PetCounters;
  logs: PetLogEntry[];
};

export const DEFAULT_LEVEL_EXP = 200;

export function createInitialPetState(now: string = new Date().toISOString()): PetState {
  return {
    level: 1,
    exp: 0,
    hunger: 20,
    mood: 70,
    energy: 80,
    health: 100,
    lifeStatus: 'alive',
    evolution: 'egg',
    stage: 'egg',
    archetype: 'balanced',
    species: 'bytepup',
    styleScores: {
      builder: 0,
      cleaner: 0,
      debugger: 0,
      scholar: 0,
      streak: 0
    },
    skills: [],
    discoveredSpriteIds: ['egg-common-normal'],
    lastActiveAt: now,
    counters: {
      refactor: 0,
      feature: 0,
      debug: 0
    },
    logs: []
  };
}

export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getRequiredExp(level: number): number {
  const exactCurve: Record<number, number> = {
    1: 200,
    2: 325,
    5: 850,
    10: 2400,
    20: 8500,
    30: 19000,
    50: 62000,
    90: 220000
  };

  if (exactCurve[level]) {
    return exactCurve[level];
  }

  const scaled = DEFAULT_LEVEL_EXP + Math.pow(Math.max(0, level - 1), 2.22) * 76 + Math.max(0, level - 1) * 58;
  return Math.round(scaled / 25) * 25;
}

export function getMoodName(state: PetState): PetMood {
  if (state.lifeStatus === 'dead' || state.lifeStatus === 'sleeping' || state.energy <= 15 || state.hunger >= 90) {
    return 'sleeping';
  }

  if (state.mood >= 75) {
    return 'happy';
  }

  if (state.mood <= 35 || state.hunger >= 75) {
    return 'sad';
  }

  return 'normal';
}

export function getLifeStatus(state: PetState): PetLifeStatus {
  if (state.health <= 0) {
    return 'dead';
  }

  if (state.health <= 25 || state.hunger >= 95) {
    return 'critical';
  }

  if (state.health <= 55 || state.energy <= 20 || state.hunger >= 80) {
    return 'sleeping';
  }

  return 'alive';
}
