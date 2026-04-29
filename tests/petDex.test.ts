import { developerToolSpritePacks } from '../src/character/developerToolSprites';
import { createPetDexEntries, groupPetDexEntries } from '../src/character/petDex';

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

  it('groups entries in growth order for the dex grid', () => {
    const groups = groupPetDexEntries(createPetDexEntries());

    expect(groups.map(([stage]) => stage)).toEqual(['egg', 'hatchling', 'toolkit', 'specialist', 'ultimate']);
    expect(groups.map(([, entries]) => entries.length)).toEqual([1, 4, 4, 20, 4]);
  });
});
