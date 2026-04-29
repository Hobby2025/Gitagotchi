import { developerToolSpritePacks } from '../src/character/developerToolSprites';
import { createPetDexEntries, discoverCurrentPetSprite, groupPetDexEntries } from '../src/character/petDex';
import { createInitialPetState } from '../src/core/petState';

describe('pet dex model', () => {
  it('lists every current Gitagotchi sprite as an unlocked dex entry by default', () => {
    const entries = createPetDexEntries();

    expect(entries).toHaveLength(33);
    expect(entries.map((entry) => entry.id)).toEqual(developerToolSpritePacks.map((sprite) => sprite.id));
    expect(entries.every((entry) => entry.unlocked)).toBe(true);
  });

  it('prepares locked entries from an unlock id set without changing sprite identity', () => {
    const unlockedIds = new Set(['egg-common-normal', 'debugon-specialist-debugger-normal']);
    const entries = createPetDexEntries({ unlockedIds });

    expect(entries.filter((entry) => entry.unlocked).map((entry) => entry.id)).toEqual([
      'egg-common-normal',
      'debugon-specialist-debugger-normal'
    ]);
    expect(entries.find((entry) => entry.id === 'buildling-hatchling-normal')?.unlocked).toBe(false);
  });

  it('discovers the current pet sprite without unlocking unrelated dex entries', () => {
    const state = discoverCurrentPetSprite({
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      level: 8,
      evolution: 'mid',
      stage: 'toolkit',
      lineage: 'refact',
      discoveredSpriteIds: ['egg-common-normal']
    });
    const entries = createPetDexEntries({ state });

    expect(state.discoveredSpriteIds).toEqual(['egg-common-normal', 'refact-toolkit-normal']);
    expect(entries.filter((entry) => entry.unlocked).map((entry) => entry.id)).toEqual([
      'egg-common-normal',
      'refact-toolkit-normal'
    ]);
  });

  it('groups entries in growth order for the dex grid', () => {
    const groups = groupPetDexEntries(createPetDexEntries());

    expect(groups.map(([stage]) => stage)).toEqual(['egg', 'hatchling', 'toolkit', 'specialist', 'ultimate']);
    expect(groups.map(([, entries]) => entries.length)).toEqual([1, 4, 4, 20, 4]);
  });
});
