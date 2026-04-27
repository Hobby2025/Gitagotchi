import { createInitialPetState, getLifeStatus, PetState } from '../core/petState';

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

export class PetStateStore {
  constructor(
    private readonly memento: MementoLike,
    private readonly initialNow = new Date().toISOString(),
    private readonly key = 'gitagotchi.petState'
  ) {}

  load(): PetState {
    const saved = this.memento.get<Partial<PetState>>(this.key);
    if (!saved) {
      return createInitialPetState(this.initialNow);
    }

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
      species: saved.species ?? base.species,
      logs: saved.logs ?? base.logs
    };

    return {
      ...merged,
      lifeStatus: saved.lifeStatus ?? getLifeStatus(merged)
    };
  }

  async save(state: PetState): Promise<void> {
    await this.memento.update(this.key, state);
  }
}
