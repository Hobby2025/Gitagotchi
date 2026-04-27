import { SpritePack } from './spriteTypes';

const palette = {
  '.': 'transparent',
  y: '#facc15',
  o: '#fb923c',
  b: '#111827',
  w: '#f8fafc',
  g: '#86efac',
  r: '#f87171',
  p: '#c084fc'
};

export const spritePacks: SpritePack[] = [
  {
    id: 'egg-normal',
    evolution: 'egg',
    mood: 'normal',
    frames: [{
      width: 8,
      height: 8,
      palette,
      pixels: [
        '..yyyy..',
        '.yyyyyy.',
        'yyyyyyyy',
        'yyybbyyy',
        'yyyyyyyy',
        'yyyyyyyy',
        '.yyyyyy.',
        '..yyyy..'
      ]
    }]
  },
  {
    id: 'junior-happy',
    evolution: 'junior',
    mood: 'happy',
    frames: [{
      width: 8,
      height: 8,
      palette,
      pixels: [
        '..oooo..',
        '.yyyyyy.',
        'yyyyyyyy',
        'yybyybyy',
        'yyyyyyyy',
        'yyybbyyy',
        '.yyyyyy.',
        '..y..y..'
      ]
    }]
  },
  {
    id: 'junior-normal',
    evolution: 'junior',
    mood: 'normal',
    frames: [{
      width: 8,
      height: 8,
      palette,
      pixels: [
        '..oooo..',
        '.yyyyyy.',
        'yyyyyyyy',
        'yybyybyy',
        'yyyyyyyy',
        'yyyyyyyy',
        '.yyyyyy.',
        '..y..y..'
      ]
    }]
  },
  {
    id: 'mid-normal',
    evolution: 'mid',
    mood: 'normal',
    frames: [{
      width: 8,
      height: 8,
      palette,
      pixels: [
        '..gggg..',
        '.yyyyyy.',
        'yyyyyyyy',
        'yybyybyy',
        'yyyyyyyy',
        'yybbbbyy',
        '.yyyyyy.',
        '.yy..yy.'
      ]
    }]
  },
  {
    id: 'senior-normal',
    evolution: 'senior',
    mood: 'normal',
    frames: [{
      width: 8,
      height: 8,
      palette,
      pixels: [
        '.rrrrrr.',
        'ryyyyyyr',
        'yyyyyyyy',
        'yybyybyy',
        'yyyyyyyy',
        'yybbbbyy',
        '.yyyyyy.',
        '.yy..yy.'
      ]
    }]
  },
  {
    id: 'architect-normal',
    evolution: 'architect',
    mood: 'normal',
    frames: [{
      width: 8,
      height: 8,
      palette,
      pixels: [
        'pp....pp',
        '.pyyyyp.',
        'yyyyyyyy',
        'yybyybyy',
        'yyyyyyyy',
        'yybbbbyy',
        '.yyyyyy.',
        '.yy..yy.'
      ]
    }]
  },
  {
    id: 'sad-normal',
    evolution: 'egg',
    mood: 'sad',
    frames: [{
      width: 8,
      height: 8,
      palette,
      pixels: [
        '..yyyy..',
        '.yyyyyy.',
        'yyyyyyyy',
        'yybyybyy',
        'yyyyyyyy',
        'yyb..byy',
        '.yyyyyy.',
        '..yyyy..'
      ]
    }]
  }
];
