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
});
