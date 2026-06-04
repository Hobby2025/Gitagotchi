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
export type DailyQuestId = 'bugHunt' | 'deepClean' | 'fieldGuide' | 'shipIt' | 'balanceTraining';
export type DecorationId =
  | 'bugLens'
  | 'tidyRibbon'
  | 'bookmarkCape'
  | 'commitMedal'
  | 'balanceHalo'
  | 'releaseEmblem'
  | 'gardenEmblem'
  | 'trackerEmblem'
  | 'archiveEmblem'
  | 'balanceEmblem'
  | 'legacyCrown'
  | 'debugCrown'
  | 'releaseBanner'
  | 'dependencyCharm'
  | 'breakpointCrown'
  | 'starShard'
  | 'seasonRelic';
export type PetClassId = 'releaseMaster' | 'codeGardener' | 'bugTracker' | 'archivist' | 'balanceArchitect';
export type RaidBossId = 'legacyDragon' | 'bugLord' | 'releaseGolem' | 'dependencyWraith' | 'breakpointHydra';
export type ComboId = 'stabilizer' | 'cleanupComplete' | 'specDriven';
export type SeasonId = 'breakpointRuins';
export type StarTreeNodeId = 'raidMight' | 'steadyCare' | 'seasonMemory';

export type StyleScores = Record<StyleScoreKey, number>;

export type PetCounters = {
  refactor: number;
  feature: number;
  debug: number;
};

export type DailyQuestState = {
  dayKey: string;
  offeredIds: DailyQuestId[];
  activeId?: DailyQuestId;
  progress: number;
  completedId?: DailyQuestId;
};

export type RaidState = {
  id: RaidBossId;
  hp: number;
  maxHp: number;
  startedAt: string;
};

export type SeasonState = {
  id: SeasonId;
  progress: number;
  claimedMilestones: number[];
};

export type ClassQuestState = {
  dayKey: string;
  classId?: PetClassId;
  progress: number;
  completedClassId?: PetClassId;
};

export type RaidClearRecord = {
  id: RaidBossId;
  defeatedAt: string;
  decoration: DecorationId;
  maxHp: number;
};

export type StarTreeState = {
  unspent: number;
  nodes: Record<StarTreeNodeId, number>;
};

export type ProjectProfileState = {
  key: string;
  label: string;
  exp: number;
  dayKey?: string;
  dailyExp?: number;
  raidsCleared: number;
  lastActiveAt: string;
};

export type TeamRaidState = {
  id: 'breakpointSquad';
  target: number;
  contribution: number;
  clears: number;
  lastContributionAt?: string;
};

export type WeeklyReviewState = {
  weekKey: string;
  title: string;
  summary: string;
  dominantStyle: StyleScoreKey;
};

export type EndgameState = {
  classId?: PetClassId;
  classLevels: Partial<Record<PetClassId, number>>;
  masteryRank: number;
  reincarnations: number;
  stars: number;
  totalEarnedExp: number;
  activeRaid?: RaidState;
  defeatedRaidIds: RaidBossId[];
  raidHistory: RaidClearRecord[];
  labExpSpent: number;
  classQuest: ClassQuestState;
  comboHistory: string[];
  unlockedComboIds: ComboId[];
  season: SeasonState;
  starTree: StarTreeState;
  activeProjectKey: string;
  projectProfiles: Record<string, ProjectProfileState>;
  teamRaid: TeamRaidState;
  recentActivityFingerprints: string[];
  weeklyReview?: WeeklyReviewState;
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
  decorations: DecorationId[];
  equippedDecorations: DecorationId[];
  dailyQuest: DailyQuestState;
  endgame: EndgameState;
  lastActiveAt: string;
  lastPattedAt?: string;
  lastCommitHash?: string;
  counters: PetCounters;
  logs: PetLogEntry[];
};

export const DEFAULT_LEVEL_EXP = 80;

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
    decorations: [],
    equippedDecorations: [],
    dailyQuest: {
      dayKey: '',
      offeredIds: [],
      progress: 0
    },
    endgame: {
      classLevels: {},
      masteryRank: 0,
      reincarnations: 0,
      stars: 0,
      totalEarnedExp: 0,
      defeatedRaidIds: [],
      raidHistory: [],
      labExpSpent: 0,
      classQuest: {
        dayKey: '',
        progress: 0
      },
      comboHistory: [],
      unlockedComboIds: [],
      season: {
        id: 'breakpointRuins',
        progress: 0,
        claimedMilestones: []
      },
      starTree: {
        unspent: 0,
        nodes: {
          raidMight: 0,
          steadyCare: 0,
          seasonMemory: 0
        }
      },
      activeProjectKey: 'workspace',
      projectProfiles: {},
      teamRaid: {
        id: 'breakpointSquad',
        target: 600,
        contribution: 0,
        clears: 0
      },
      recentActivityFingerprints: []
    },
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
    1: 80,
    2: 100,
    5: 220,
    10: 420,
    15: 700,
    20: 1050,
    30: 2000,
    50: 5000,
    90: 15000
  };

  if (exactCurve[level]) {
    return exactCurve[level];
  }

  const scaled = DEFAULT_LEVEL_EXP + Math.pow(Math.max(0, level - 1), 1.45) * 12 + Math.max(0, level - 1) * 22;
  return Math.round(scaled / 10) * 10;
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
