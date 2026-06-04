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
    expect(loaded.stage).toBe('toolkit');
    expect(loaded.lineage).toBe('buildling');
    expect(loaded.discoveredSpriteIds).toEqual(['egg-common-normal']);
  });

  it('revives pets that were killed by previous idle decay storage', async () => {
    const memento = new MemoryMemento();
    await memento.update('gitagotchi.petState', {
      _schemaVersion: 3,
      health: 0,
      lifeStatus: 'dead',
      logs: [{
        message: 'Idle decay',
        expDelta: 0,
        occurredAt: '2026-04-28T00:00:00.000Z',
        breakdown: [{ id: 'idle-decay', label: 'Idle decay', healthDelta: -120 }]
      }]
    });

    const store = new PetStateStore(memento, '2026-04-27T00:00:00.000Z');
    const loaded = store.load();

    expect(loaded.health).toBe(1);
    expect(loaded.lifeStatus).toBe('critical');
  });

  it('revives idle decay deaths even when the saved schema is current', async () => {
    const memento = new MemoryMemento();
    await memento.update('gitagotchi.petState', {
      _schemaVersion: 4,
      health: 0,
      lifeStatus: 'dead',
      logs: [{
        message: 'Idle decay',
        expDelta: 0,
        occurredAt: '2026-04-28T00:00:00.000Z',
        breakdown: [{ id: 'idle-decay', label: 'Idle decay', healthDelta: -120 }]
      }]
    });

    const store = new PetStateStore(memento, '2026-04-27T00:00:00.000Z');
    const loaded = store.load();

    expect(loaded.health).toBe(1);
    expect(loaded.lifeStatus).toBe('critical');
  });

  it('keeps non-idle dead pets dead', async () => {
    const memento = new MemoryMemento();
    await memento.update('gitagotchi.petState', {
      _schemaVersion: 4,
      health: 0,
      lifeStatus: 'dead',
      logs: [{
        message: 'Manual test death',
        expDelta: 0,
        occurredAt: '2026-04-28T00:00:00.000Z',
        breakdown: [{ id: 'other', label: 'Other', healthDelta: -120 }]
      }]
    });

    const store = new PetStateStore(memento, '2026-04-27T00:00:00.000Z');
    const loaded = store.load();

    expect(loaded.health).toBe(0);
    expect(loaded.lifeStatus).toBe('dead');
  });

  it('saves state with schema version tag', async () => {
    const memento = new MemoryMemento();
    const store = new PetStateStore(memento, '2026-04-27T00:00:00.000Z');
    const initial = store.load();
    await store.save({ ...initial, level: 3 });

    const raw = memento.get<Record<string, unknown>>('gitagotchi.petState');
    expect(raw?._schemaVersion).toBe(4);
    expect(raw?.level).toBe(3);
  });

  it('persists the pet name once configured', async () => {
    const memento = new MemoryMemento();
    const store = new PetStateStore(memento, '2026-04-27T00:00:00.000Z');
    const initial = store.load();

    await store.save({ ...initial, name: 'Mochi' });

    expect(store.load().name).toBe('Mochi');
  });

  it('resets the pet to a fresh unnamed initial state while preserving discovered sprites', async () => {
    const memento = new MemoryMemento();
    const store = new PetStateStore(memento, '2026-04-27T00:00:00.000Z');
    const initial = store.load();
    await store.save({
      ...initial,
      name: 'Mochi',
      level: 9,
      exp: 44,
      hunger: 90,
      discoveredSpriteIds: ['egg-common-normal', 'buildling-hatchling-normal']
    });

    const reset = await store.reset('2026-04-28T00:00:00.000Z');

    expect(reset.name).toBeUndefined();
    expect(reset.level).toBe(1);
    expect(reset.exp).toBe(0);
    expect(reset.stage).toBe('egg');
    expect(reset.lineage).toBeUndefined();
    expect(reset.affinity).toBeUndefined();
    expect(reset.discoveredSpriteIds).toEqual(['egg-common-normal', 'buildling-hatchling-normal']);
    expect(reset.hunger).toBe(20);
    expect(reset.lastActiveAt).toBe('2026-04-28T00:00:00.000Z');
    expect(store.load().level).toBe(1);
    expect(store.load().discoveredSpriteIds).toEqual(['egg-common-normal', 'buildling-hatchling-normal']);
  });
});
