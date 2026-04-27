import { PetEvolution, PetMood } from '../core/petState';

export type PixelFrame = {
  width: number;
  height: number;
  palette: Record<string, string>;
  pixels: string[];
};

export type SpritePack = {
  id: string;
  evolution: PetEvolution;
  mood: PetMood;
  frames: PixelFrame[];
};
