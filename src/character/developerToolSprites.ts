import { PetAffinity, PetEvolution, PetLineage, PetMood, PetState, StyleScoreKey } from '../core/petState';
import { PixelFrame, SpritePack } from './spriteTypes';

const palette = {
  '.': 'transparent',
  k: '#0f172a',
  s: '#334155',
  d: '#1e293b',
  w: '#f8fafc',
  g: '#86efac',
  y: '#facc15',
  o: '#fb923c',
  a: '#f97316',
  c: '#22d3ee',
  t: '#14b8a6',
  r: '#f87171',
  q: '#ef4444',
  b: '#60a5fa',
  n: '#2563eb',
  m: '#c084fc',
  v: '#a78bfa',
  p: '#f472b6'
};

type PaletteToken = keyof typeof palette;
type GrowthSpriteStage = 'hatchling' | 'toolkit' | 'specialist' | 'ultimate';

const styleOrder: StyleScoreKey[] = ['builder', 'cleaner', 'debugger', 'scholar', 'streak'];

const lineageColor: Record<PetLineage, PaletteToken> = {
  buildling: 'o',
  refact: 'c',
  debugon: 'r',
  archivox: 'b'
};

const lineageShade: Record<PetLineage, PaletteToken> = {
  buildling: 'a',
  refact: 't',
  debugon: 'q',
  archivox: 'n'
};

const lineageHighlight: Record<PetLineage, PaletteToken> = {
  buildling: 'y',
  refact: 'w',
  debugon: 'p',
  archivox: 'm'
};

const affinityColor: Record<PetAffinity, PaletteToken> = {
  builder: 'o',
  cleaner: 'c',
  debugger: 'r',
  scholar: 'b',
  streak: 'g'
};

const stageSize: Record<GrowthSpriteStage, number> = {
  hatchling: 16,
  toolkit: 24,
  specialist: 24,
  ultimate: 32
};

function createGrid(size: number): string[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => '.'));
}

function setPixel(grid: string[][], x: number, y: number, token: PaletteToken): void {
  if (grid[y]?.[x] !== undefined) {
    grid[y][x] = token;
  }
}

function drawRect(grid: string[][], x: number, y: number, width: number, height: number, token: PaletteToken): void {
  for (let yy = y; yy < y + height; yy += 1) {
    for (let xx = x; xx < x + width; xx += 1) {
      setPixel(grid, xx, yy, token);
    }
  }
}

function drawOutlineRect(grid: string[][], x: number, y: number, width: number, height: number, token: PaletteToken): void {
  for (let xx = x; xx < x + width; xx += 1) {
    setPixel(grid, xx, y, token);
    setPixel(grid, xx, y + height - 1, token);
  }
  for (let yy = y; yy < y + height; yy += 1) {
    setPixel(grid, x, yy, token);
    setPixel(grid, x + width - 1, yy, token);
  }
}

function drawLine(grid: string[][], x1: number, y1: number, x2: number, y2: number, token: PaletteToken): void {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
  for (let i = 0; i <= steps; i += 1) {
    const x = Math.round(x1 + ((x2 - x1) * i) / steps);
    const y = Math.round(y1 + ((y2 - y1) * i) / steps);
    setPixel(grid, x, y, token);
  }
}

function drawDiamond(grid: string[][], cx: number, cy: number, radius: number, token: PaletteToken): void {
  for (let y = -radius; y <= radius; y += 1) {
    const span = radius - Math.abs(y);
    drawRect(grid, cx - span, cy + y, span * 2 + 1, 1, token);
  }
}

function drawOutlineDiamond(grid: string[][], cx: number, cy: number, radius: number, token: PaletteToken): void {
  for (let i = 0; i <= radius; i += 1) {
    setPixel(grid, cx - i, cy - radius + i, token);
    setPixel(grid, cx + i, cy - radius + i, token);
    setPixel(grid, cx - i, cy + radius - i, token);
    setPixel(grid, cx + i, cy + radius - i, token);
  }
}

function rows(grid: string[][]): string[] {
  return grid.map((row) => row.join(''));
}

function scale(size: number, value: number): number {
  return Math.round((size / 24) * value);
}

function drawEyes(grid: string[][], cx: number, y: number): void {
  setPixel(grid, cx - 2, y, 'k');
  setPixel(grid, cx + 2, y, 'k');
  setPixel(grid, cx - 1, y + 3, 'w');
  setPixel(grid, cx, y + 3, 'w');
}

function drawBuildling(grid: string[][], stage: GrowthSpriteStage): void {
  const size = grid.length;
  const cx = Math.floor(size / 2);
  const base = lineageColor.buildling;
  const shade = lineageShade.buildling;
  const hi = lineageHighlight.buildling;
  const bodyW = scale(size, stage === 'hatchling' ? 10 : 12);
  const bodyH = scale(size, stage === 'hatchling' ? 9 : 11);
  const bodyX = cx - Math.floor(bodyW / 2);
  const bodyY = scale(size, 7);

  drawOutlineRect(grid, bodyX, bodyY, bodyW, bodyH, 'k');
  drawRect(grid, bodyX + 1, bodyY + 1, bodyW - 2, bodyH - 2, base);
  drawRect(grid, bodyX + 3, bodyY + 2, bodyW - 6, 2, hi);
  drawRect(grid, bodyX + 2, bodyY + bodyH - 3, bodyW - 4, 2, shade);
  drawEyes(grid, cx, bodyY + 4);

  drawRect(grid, bodyX + 2, bodyY - 3, 3, 3, shade);
  drawRect(grid, bodyX + bodyW - 5, bodyY - 3, 3, 3, shade);
  drawRect(grid, bodyX - 3, bodyY + 4, 3, 5, shade);
  drawRect(grid, bodyX + bodyW, bodyY + 4, 3, 5, shade);
  drawRect(grid, bodyX + 2, bodyY + bodyH, 3, 3, shade);
  drawRect(grid, bodyX + bodyW - 5, bodyY + bodyH, 3, 3, shade);

  if (stage !== 'hatchling') {
    drawRect(grid, bodyX + bodyW + 2, bodyY - 1, 2, 11, 's');
    drawRect(grid, bodyX + bodyW, bodyY - 3, 6, 3, hi);
    drawRect(grid, bodyX + bodyW + 1, bodyY + 10, 4, 3, shade);
    setPixel(grid, bodyX + 3, bodyY + 6, 'y');
    setPixel(grid, bodyX + bodyW - 4, bodyY + 6, 'y');
  }
}

function drawRefact(grid: string[][], stage: GrowthSpriteStage): void {
  const size = grid.length;
  const cx = Math.floor(size / 2);
  const base = lineageColor.refact;
  const shade = lineageShade.refact;
  const hi = lineageHighlight.refact;
  const radius = scale(size, stage === 'hatchling' ? 5 : 7);
  const cy = scale(size, 12);

  drawOutlineDiamond(grid, cx, cy, radius + 1, 'k');
  drawDiamond(grid, cx, cy, radius, base);
  drawLine(grid, cx, cy - radius + 1, cx, cy + radius - 1, hi);
  drawLine(grid, cx - radius + 1, cy, cx + radius - 1, cy, shade);
  drawEyes(grid, cx, cy - 2);

  drawLine(grid, cx - radius - 2, cy - 3, cx - radius - 6, cy + 4, shade);
  drawLine(grid, cx + radius + 2, cy - 3, cx + radius + 6, cy + 4, shade);
  drawLine(grid, cx - 3, cy + radius, cx - 6, cy + radius + 4, shade);
  drawLine(grid, cx + 3, cy + radius, cx + 6, cy + radius + 4, shade);

  if (stage !== 'hatchling') {
    drawLine(grid, cx - radius - 5, cy + 3, cx - radius - 1, cy + 8, hi);
    drawLine(grid, cx + radius + 5, cy + 3, cx + radius + 1, cy + 8, hi);
    drawOutlineDiamond(grid, cx, scale(size, 5), 3, base);
  }
}

function drawDebugon(grid: string[][], stage: GrowthSpriteStage): void {
  const size = grid.length;
  const cx = Math.floor(size / 2);
  const base = lineageColor.debugon;
  const shade = lineageShade.debugon;
  const hi = lineageHighlight.debugon;
  const bodyW = scale(size, stage === 'hatchling' ? 10 : 12);
  const bodyH = scale(size, stage === 'hatchling' ? 8 : 10);
  const bodyX = cx - Math.floor(bodyW / 2);
  const bodyY = scale(size, 9);

  drawLine(grid, cx - 3, bodyY, cx - 8, bodyY - 5, hi);
  drawLine(grid, cx + 3, bodyY, cx + 8, bodyY - 5, hi);
  setPixel(grid, cx - 9, bodyY - 6, 'p');
  setPixel(grid, cx + 9, bodyY - 6, 'p');
  drawOutlineRect(grid, bodyX, bodyY, bodyW, bodyH, 'k');
  drawRect(grid, bodyX + 1, bodyY + 1, bodyW - 2, bodyH - 2, base);
  drawRect(grid, bodyX + 3, bodyY + 1, bodyW - 6, 2, hi);
  drawEyes(grid, cx, bodyY + 3);

  drawRect(grid, bodyX - 3, bodyY + 3, 3, 5, shade);
  drawRect(grid, bodyX + bodyW, bodyY + 3, 3, 5, shade);
  drawLine(grid, cx, bodyY + bodyH, cx + scale(size, 7), bodyY + bodyH + scale(size, 4), shade);

  if (stage !== 'hatchling') {
    drawOutlineRect(grid, bodyX - 5, bodyY + 1, 5, 5, hi);
    drawOutlineRect(grid, bodyX + bodyW, bodyY + 1, 5, 5, hi);
    drawRect(grid, cx - 1, bodyY - 3, 2, 3, shade);
  }
}

function drawArchivox(grid: string[][], stage: GrowthSpriteStage): void {
  const size = grid.length;
  const cx = Math.floor(size / 2);
  const base = lineageColor.archivox;
  const shade = lineageShade.archivox;
  const hi = lineageHighlight.archivox;
  const bodyW = scale(size, stage === 'hatchling' ? 9 : 11);
  const bodyH = scale(size, stage === 'hatchling' ? 9 : 11);
  const bodyX = cx - Math.floor(bodyW / 2);
  const bodyY = scale(size, 8);

  drawOutlineRect(grid, bodyX, bodyY, bodyW, bodyH, 'k');
  drawRect(grid, bodyX + 1, bodyY + 1, bodyW - 2, bodyH - 2, 'w');
  drawRect(grid, bodyX + 1, bodyY + bodyH - 4, bodyW - 2, 3, base);
  drawLine(grid, bodyX - 1, bodyY + 2, bodyX - 6, bodyY + 7, shade);
  drawLine(grid, bodyX + bodyW, bodyY + 2, bodyX + bodyW + 5, bodyY + 7, shade);
  drawEyes(grid, cx, bodyY + 4);

  drawRect(grid, bodyX + 2, bodyY - 4, bodyW - 4, 3, hi);
  drawRect(grid, bodyX + 4, bodyY - 6, bodyW - 8, 2, base);
  drawRect(grid, bodyX + 2, bodyY + bodyH, 3, 3, shade);
  drawRect(grid, bodyX + bodyW - 5, bodyY + bodyH, 3, 3, shade);

  if (stage !== 'hatchling') {
    setPixel(grid, cx - 3, bodyY + bodyH - 2, 'm');
    setPixel(grid, cx, bodyY + bodyH - 2, 'm');
    setPixel(grid, cx + 3, bodyY + bodyH - 2, 'm');
    drawOutlineRect(grid, bodyX - 6, bodyY + 5, 5, 7, base);
    drawOutlineRect(grid, bodyX + bodyW + 1, bodyY + 5, 5, 7, base);
  }
}

function drawAffinityGear(grid: string[][], affinity: PetAffinity, stage: GrowthSpriteStage): void {
  const size = grid.length;
  const cx = Math.floor(size / 2);
  const color = affinityColor[affinity];
  const y = stage === 'ultimate' ? scale(size, 23) : scale(size, 20);

  if (affinity === 'builder') {
    drawRect(grid, cx - 2, y, 4, 2, color);
    drawRect(grid, cx - 1, y - 2, 2, 6, color);
  } else if (affinity === 'cleaner') {
    drawLine(grid, cx - 5, y + 2, cx + 5, y - 2, color);
    drawLine(grid, cx - 4, y - 2, cx + 4, y + 2, color);
  } else if (affinity === 'debugger') {
    drawOutlineRect(grid, cx - 5, y - 3, 4, 4, color);
    drawOutlineRect(grid, cx + 2, y - 3, 4, 4, color);
  } else if (affinity === 'scholar') {
    drawOutlineRect(grid, cx - 6, y - 4, 5, 6, color);
    drawOutlineRect(grid, cx + 1, y - 4, 5, 6, color);
  } else {
    drawOutlineRect(grid, cx - 8, y - 1, 16, 3, color);
    setPixel(grid, cx, y, 'w');
  }
}

function drawUltimateFrame(grid: string[][], lineage: PetLineage): void {
  const size = grid.length;
  const color = lineageColor[lineage];
  const hi = lineageHighlight[lineage];
  drawOutlineRect(grid, 5, 3, size - 10, size - 7, hi);
  drawRect(grid, 12, 1, 8, 3, color);
  drawRect(grid, 3, 13, 4, 8, color);
  drawRect(grid, size - 7, 13, 4, 8, color);
  setPixel(grid, 8, 5, 'w');
  setPixel(grid, size - 9, 5, 'w');
}

function createLineagePixels(lineage: PetLineage, stage: GrowthSpriteStage, affinity?: PetAffinity): string[] {
  const grid = createGrid(stageSize[stage]);

  if (stage === 'ultimate') {
    drawUltimateFrame(grid, lineage);
  }

  if (lineage === 'buildling') {
    drawBuildling(grid, stage);
  } else if (lineage === 'refact') {
    drawRefact(grid, stage);
  } else if (lineage === 'debugon') {
    drawDebugon(grid, stage);
  } else {
    drawArchivox(grid, stage);
  }

  if (affinity && (stage === 'specialist' || stage === 'ultimate')) {
    drawAffinityGear(grid, affinity, stage);
  }

  return rows(grid);
}

function frame(width: number, height: number, pixels: string[]): PixelFrame {
  return {
    width,
    height,
    palette,
    pixels
  };
}

function pack(id: string, evolution: PetEvolution, mood: PetMood, pixels: string[]): SpritePack {
  return {
    id,
    evolution,
    mood,
    frames: [frame(pixels[0]?.length ?? 0, pixels.length, pixels)]
  };
}

function dominantStyle(state: PetState): StyleScoreKey {
  return styleOrder.reduce((best, key) => (
    state.styleScores[key] > state.styleScores[best] ? key : best
  ), styleOrder[0]);
}

function lineageFromStyle(style: StyleScoreKey): PetLineage {
  if (style === 'builder') {
    return 'buildling';
  }
  if (style === 'cleaner') {
    return 'refact';
  }
  if (style === 'debugger') {
    return 'debugon';
  }
  return 'archivox';
}

const eggPixels = [
  '....kkkk....',
  '...kyyyyk...',
  '..kyywwyyk..',
  '.kyygccgyyk.',
  '.kygcsscgyk.',
  'kyygskksgyyk',
  'kyygskksgyyk',
  '.kygcsscgyk.',
  '.kyygccgyyk.',
  '..kyywwyyk..',
  '...kyssyk...',
  '....kkkk....'
];

const lineageOrder: PetLineage[] = ['buildling', 'refact', 'debugon', 'archivox'];

export const developerToolSpritePacks: SpritePack[] = [
  pack('egg-common-normal', 'egg', 'normal', eggPixels),
  pack('buildling-hatchling-happy', 'junior', 'happy', createLineagePixels('buildling', 'hatchling')),
  ...lineageOrder.map((lineage) => pack(`${lineage}-hatchling-normal`, 'junior', 'normal', createLineagePixels(lineage, 'hatchling'))),
  ...lineageOrder.map((lineage) => pack(`${lineage}-toolkit-normal`, 'mid', 'normal', createLineagePixels(lineage, 'toolkit'))),
  ...lineageOrder.flatMap((lineage) => styleOrder.map((affinity) => (
    pack(`${lineage}-specialist-${affinity}-normal`, 'senior', 'normal', createLineagePixels(lineage, 'specialist', affinity))
  ))),
  ...lineageOrder.map((lineage) => pack(`${lineage}-ultimate-normal`, 'architect', 'normal', createLineagePixels(lineage, 'ultimate')))
];

export function getDeveloperToolSpritePack(state: PetState, mood: PetMood): SpritePack {
  const style = dominantStyle(state);
  const lineage = state.lineage ?? lineageFromStyle(style);
  const affinity = state.affinity ?? style;
  let id: string;

  if (state.evolution === 'egg') {
    id = 'egg-common';
  } else if (state.evolution === 'junior') {
    id = `${lineage}-hatchling`;
  } else if (state.evolution === 'mid') {
    id = `${lineage}-toolkit`;
  } else if (state.evolution === 'senior') {
    id = `${lineage}-specialist-${affinity}`;
  } else {
    id = `${lineage}-ultimate`;
  }

  return developerToolSpritePacks.find((sprite) => sprite.id === `${id}-${mood}`)
    ?? developerToolSpritePacks.find((sprite) => sprite.id === `${id}-normal`)
    ?? developerToolSpritePacks[0];
}
