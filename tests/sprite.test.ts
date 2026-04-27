import { getSpritePack, validateSpritePack } from '../src/character/evolutionSprites';

describe('sprite packs', () => {
  it('selects a mood-specific sprite for an evolution stage', () => {
    const sprite = getSpritePack('junior', 'happy');

    expect(sprite.evolution).toBe('junior');
    expect(sprite.mood).toBe('happy');
    expect(validateSpritePack(sprite)).toBe(true);
  });

  it('falls back to normal mood when a specific mood is missing', () => {
    const sprite = getSpritePack('architect', 'sleeping');

    expect(sprite.evolution).toBe('architect');
    expect(sprite.mood).toBe('normal');
  });

  it('keeps frame dimensions consistent for LittleJS rendering', () => {
    const sprite = getSpritePack('egg', 'normal');

    expect(sprite.frames[0].pixels).toHaveLength(sprite.frames[0].height);
    expect(sprite.frames[0].pixels.every((row) => row.length === sprite.frames[0].width)).toBe(true);
  });
});
