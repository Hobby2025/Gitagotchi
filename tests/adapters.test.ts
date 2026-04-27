import { MemoryMemento, PetStateStore } from '../src/adapters/storageAdapter';
import { createCommitEventIfChanged } from '../src/adapters/gitAdapter';
import { createDiagnosticsEventIfChanged } from '../src/adapters/diagnosticsAdapter';

describe('adapters', () => {
  it('persists pet state in a memento-compatible global store', async () => {
    const store = new PetStateStore(new MemoryMemento(), '2026-04-27T00:00:00.000Z');
    const initial = store.load();

    await store.save({ ...initial, level: 7 });

    expect(store.load().level).toBe(7);
  });

  it('emits a commit event only when the hash changed', () => {
    expect(createCommitEventIfChanged(undefined, 'abc', 'feat pet')).toMatchObject({
      type: 'commit',
      hash: 'abc',
      message: 'feat pet'
    });
    expect(createCommitEventIfChanged('abc', 'abc', 'feat pet')).toBeUndefined();
  });

  it('emits diagnostics events only when the count changed', () => {
    expect(createDiagnosticsEventIfChanged(5, 3)).toMatchObject({
      type: 'diagnostics',
      previous: 5,
      current: 3
    });
    expect(createDiagnosticsEventIfChanged(3, 3)).toBeUndefined();
  });

  it('ignores commit event when currentHash is empty', () => {
    expect(createCommitEventIfChanged(undefined, '', 'empty')).toBeUndefined();
    expect(createCommitEventIfChanged('abc', '', 'empty')).toBeUndefined();
  });

  it('migrates v0 storage data to current schema', async () => {
    const memento = new MemoryMemento();
    // v0 데이터: _schemaVersion 없음
    const v0 = { level: 5, exp: 50, hunger: 30, counters: { refactor: 2 } };
    await memento.update('gitagotchi.petState', v0);

    const store = new PetStateStore(memento, '2026-04-27T00:00:00.000Z');
    const loaded = store.load();

    expect(loaded.level).toBe(5);
    expect(loaded.counters.refactor).toBe(2);
    expect(loaded.counters.feature).toBe(0); // 기본값 보정 확인
  });

  it('saves state with schema version tag', async () => {
    const memento = new MemoryMemento();
    const store = new PetStateStore(memento, '2026-04-27T00:00:00.000Z');
    const initial = store.load();
    await store.save({ ...initial, level: 3 });

    const raw = memento.get<Record<string, unknown>>('gitagotchi.petState');
    expect(raw?._schemaVersion).toBe(1);
    expect(raw?.level).toBe(3);
  });
});
