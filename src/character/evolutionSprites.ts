import { PetEvolution, PetMood } from '../core/petState';
import { spritePacks } from './spritePacks';
import { SpritePack } from './spriteTypes';

export function validateSpritePack(sprite: SpritePack): boolean {
  return sprite.frames.length > 0 && sprite.frames.every((frame) => (
    frame.width > 0 &&
    frame.height > 0 &&
    frame.pixels.length === frame.height &&
    frame.pixels.every((row) => row.length === frame.width)
  ));
}

export function getSpritePack(evolution: PetEvolution, mood: PetMood): SpritePack {
  const direct = spritePacks.find((sprite) => sprite.evolution === evolution && sprite.mood === mood);
  if (direct) {
    return direct;
  }

  const normal = spritePacks.find((sprite) => sprite.evolution === evolution && sprite.mood === 'normal');
  if (normal) {
    return normal;
  }

  return spritePacks[0];
}
