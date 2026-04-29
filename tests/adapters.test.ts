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
    const v0 = { level: 5, exp: 50, hunger: 30, counters: { refactor: 2 } };
    await memento.update('gitagotchi.petState', v0);

    const store = new PetStateStore(memento, '2026-04-27T00:00:00.000Z');
    const loaded = store.load();

    expect(loaded.level).toBe(5);
    expect(loaded.counters.refactor).toBe(2);
    expect(loaded.counters.feature).toBe(0);
    expect(loaded.stage).toBe('egg');
    expect(loaded.lineage).toBeUndefined();
    expect(loaded.discoveredSpriteIds).toEqual(['egg-common-normal']);
  });

  it('saves state with schema version tag', async () => {
    const memento = new MemoryMemento();
    const store = new PetStateStore(memento, '2026-04-27T00:00:00.000Z');
    const initial = store.load();
    await store.save({ ...initial, level: 3 });

    const raw = memento.get<Record<string, unknown>>('gitagotchi.petState');
    expect(raw?._schemaVersion).toBe(3);
    expect(raw?.level).toBe(3);
  });

  it('persists the pet name once configured', async () => {
    const memento = new MemoryMemento();
    const store = new PetStateStore(memento, '2026-04-27T00:00:00.000Z');
    const initial = store.load();

    await store.save({ ...initial, name: 'Mochi' });

    expect(store.load().name).toBe('Mochi');
  });

  it('resets the pet to a fresh unnamed initial state', async () => {
    const memento = new MemoryMemento();
    const store = new PetStateStore(memento, '2026-04-27T00:00:00.000Z');
    const initial = store.load();
    await store.save({ ...initial, name: 'Mochi', level: 9, exp: 44, hunger: 90 });

    const reset = await store.reset('2026-04-28T00:00:00.000Z');

    expect(reset.name).toBeUndefined();
    expect(reset.level).toBe(1);
    expect(reset.exp).toBe(0);
    expect(reset.stage).toBe('egg');
    expect(reset.lineage).toBeUndefined();
    expect(reset.affinity).toBeUndefined();
    expect(reset.discoveredSpriteIds).toEqual(['egg-common-normal']);
    expect(reset.hunger).toBe(20);
    expect(reset.lastActiveAt).toBe('2026-04-28T00:00:00.000Z');
    expect(store.load().level).toBe(1);
  });
});
