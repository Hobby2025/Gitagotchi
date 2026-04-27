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

/**
 * 저장 데이터의 스키마 버전입니다.
 * 데이터 구조 변경 시 이 값을 올리고 migrate 함수를 추가합니다.
 */
const SCHEMA_VERSION = 1;

type VersionedState = { _schemaVersion?: number } & Partial<PetState>;

/**
 * 이전 버전의 저장 데이터를 현재 스키마로 마이그레이션합니다.
 * @param saved - 디스크에서 로드한 원본 데이터
 * @returns 현재 스키마에 맞게 보정된 상태
 */
function migrate(saved: VersionedState): VersionedState {
  const version = saved._schemaVersion ?? 0;

  if (version < 1) {
    // v0 → v1: counters, styleScores, skills, species, logs 기본값 보정
    return {
      ...saved,
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
      species: saved.species ?? base.species,
      logs: saved.logs ?? base.logs
    };

    return {
      ...merged,
      lifeStatus: saved.lifeStatus ?? getLifeStatus(merged)
    };
  }

  async save(state: PetState): Promise<void> {
    await this.memento.update(this.key, { ...state, _schemaVersion: SCHEMA_VERSION });
  }
}
