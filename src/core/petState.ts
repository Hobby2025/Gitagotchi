export type PetEvolution = 'egg' | 'junior' | 'mid' | 'senior' | 'architect';
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
  level: number;
  exp: number;
  hunger: number;
  mood: number;
  energy: number;
  health: number;
  lifeStatus: PetLifeStatus;
  evolution: PetEvolution;
  archetype: PetArchetype;
  species: PetSpecies;
  styleScores: StyleScores;
  skills: PetSkill[];
  lastActiveAt: string;
  lastCommitHash?: string;
  counters: PetCounters;
  logs: PetLogEntry[];
};

export const DEFAULT_LEVEL_EXP = 100;

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
    1: 100,
    2: 135,
    5: 330,
    10: 975,
    20: 3465,
    30: 7625
  };

  if (exactCurve[level]) {
    return exactCurve[level];
  }

  const scaled = DEFAULT_LEVEL_EXP + Math.pow(Math.max(0, level - 1), 2.08) * 25 + Math.max(0, level - 1) * 10;
  return Math.round(scaled / 5) * 5;
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
