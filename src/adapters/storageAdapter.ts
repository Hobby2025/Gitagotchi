import { createInitialPetState, getLifeStatus, PetState } from '../core/petState';
import { resolveEvolution } from '../core/evolutionEngine';

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

const SCHEMA_VERSION = 3;

type VersionedState = { _schemaVersion?: number } & Partial<PetState>;

function migrate(saved: VersionedState): VersionedState {
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
    return {
      ...saved,
      discoveredSpriteIds: saved.discoveredSpriteIds ?? ['egg-common-normal'],
      _schemaVersion: SCHEMA_VERSION
    };
  }

  return saved;
}

export class PetStateStore {
  constructor(
    private readonly memento: MementoLike,
    private readonly initialNow = new Date().toISOString(),
    private readonly key = 'gitagotchi.petState'
  ) {}

  load(): PetState {
    const raw = this.memento.get<VersionedState>(this.key);
    if (!raw) {
      return createInitialPetState(this.initialNow);
    }

    const saved = migrate(raw);
    const base = createInitialPetState(this.initialNow);
    const merged = {
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
      species: saved.species ?? base.species,
      logs: saved.logs ?? base.logs
    };

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
