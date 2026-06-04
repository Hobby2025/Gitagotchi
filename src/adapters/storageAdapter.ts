import { createInitialPetState, PetState } from '../core/petState';
import { getLifeStatus, resolveEvolution } from '../domain/pet/petSystem';

export type MementoLike = {
  get<T>(key: string): T | undefined;
  update(key: string, value: unknown): Thenable<void> | Promise<void>;
};

export class MemoryMemento implements MementoLike {
  private readonly values = new Map<string, unknown>();

  get<T>(key: string): T | undefined {
    return this.values.get(key) as T | undefined;
  }

  async update(key: string, value: unknown): Promise<void> {
    this.values.set(key, value);
  }
}

const SCHEMA_VERSION = 9;
const PET_STATE_STORAGE_KEY = 'gitagotchi.petState';

type SavedPetState = { _schemaVersion?: number } & Partial<PetState>;

function wasKilledByIdleDecay(saved: SavedPetState): boolean {
  return saved.lifeStatus === 'dead'
    && (saved.health ?? 0) <= 0
    && (saved.logs?.[0]?.breakdown?.some((entry) => entry.id === 'idle-decay') ?? false);
}

function migrateSavedPetState(saved: SavedPetState): SavedPetState {
  const version = saved._schemaVersion ?? 0;

  if (version < 1) {
    saved = {
      ...saved,
      _schemaVersion: 1
    };
  }

  if (version < 2) {
    saved = {
      ...saved,
      _schemaVersion: 2
    };
  }

  if (version < 3) {
    saved = {
      ...saved,
      discoveredSpriteIds: saved.discoveredSpriteIds ?? ['egg-common-normal'],
      _schemaVersion: 3
    };
  }

  if (wasKilledByIdleDecay(saved)) {
    saved = {
      ...saved,
      health: 1,
      lifeStatus: 'critical'
    };
  }

  return {
    ...saved,
    _schemaVersion: SCHEMA_VERSION
  };
}

function mergeSavedPetState(base: PetState, saved: SavedPetState): PetState {
  return {
    ...base,
    ...saved,
    counters: {
      ...base.counters,
      ...saved.counters
    },
    styleScores: {
      ...base.styleScores,
      ...saved.styleScores
    },
    skills: saved.skills ?? base.skills,
    discoveredSpriteIds: saved.discoveredSpriteIds ?? base.discoveredSpriteIds,
    decorations: saved.decorations ?? base.decorations,
    equippedDecorations: saved.equippedDecorations ?? base.equippedDecorations,
    dailyQuest: {
      ...base.dailyQuest,
      ...saved.dailyQuest
    },
    endgame: {
      ...base.endgame,
      ...saved.endgame,
      classLevels: {
        ...base.endgame.classLevels,
        ...saved.endgame?.classLevels
      },
      season: {
        ...base.endgame.season,
        ...saved.endgame?.season
      },
      starTree: {
        ...base.endgame.starTree,
        ...saved.endgame?.starTree,
        nodes: {
          ...base.endgame.starTree.nodes,
          ...saved.endgame?.starTree?.nodes
        }
      },
      classQuest: {
        ...base.endgame.classQuest,
        ...saved.endgame?.classQuest
      },
      projectProfiles: {
        ...base.endgame.projectProfiles,
        ...saved.endgame?.projectProfiles
      },
      teamRaid: {
        ...base.endgame.teamRaid,
        ...saved.endgame?.teamRaid
      },
      defeatedRaidIds: saved.endgame?.defeatedRaidIds ?? base.endgame.defeatedRaidIds,
      raidHistory: saved.endgame?.raidHistory ?? base.endgame.raidHistory,
      recentActivityFingerprints: saved.endgame?.recentActivityFingerprints ?? base.endgame.recentActivityFingerprints,
      comboHistory: saved.endgame?.comboHistory ?? base.endgame.comboHistory,
      unlockedComboIds: saved.endgame?.unlockedComboIds ?? base.endgame.unlockedComboIds
    },
    species: saved.species ?? base.species,
    logs: saved.logs ?? base.logs
  };
}

export class PetStateStore {
  constructor(
    private readonly memento: MementoLike,
    private readonly initialNow = new Date().toISOString(),
    private readonly key = PET_STATE_STORAGE_KEY
  ) {}

  load(): PetState {
    const raw = this.memento.get<SavedPetState>(this.key);
    if (!raw) {
      return createInitialPetState(this.initialNow);
    }

    const saved = migrateSavedPetState(raw);
    const base = createInitialPetState(this.initialNow);
    const merged = mergeSavedPetState(base, saved);

    const withLife = {
      ...merged,
      lifeStatus: saved.lifeStatus ?? getLifeStatus(merged)
    };

    return resolveEvolution(withLife);
  }

  async save(state: PetState): Promise<void> {
    await this.memento.update(this.key, { ...state, _schemaVersion: SCHEMA_VERSION });
  }

  async reset(now: string = new Date().toISOString()): Promise<PetState> {
    const previous = this.load();
    const state = {
      ...createInitialPetState(now),
      discoveredSpriteIds: previous.discoveredSpriteIds
    };
    await this.save(state);
    return state;
  }
}
