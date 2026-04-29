import { PetAffinity, PetEvolution, PetLineage, PetMood, PetState, StyleScoreKey } from '../core/petState';
import { PixelFrame, SpritePack } from './spriteTypes';

const palette = {
  '.': 'transparent',
  k: '#1f2937',
  s: '#64748b',
  d: '#475569',
  w: '#f8fafc',
  g: '#bbf7d0',
  y: '#fde68a',
  o: '#fdba74',
  a: '#fb923c',
  c: '#67e8f9',
  t: '#5eead4',
  r: '#fca5a5',
  q: '#fb7185',
  b: '#93c5fd',
  n: '#60a5fa',
  m: '#d8b4fe',
  v: '#c4b5fd',
  p: '#f9a8d4',
  e: '#f5c38b',
  h: '#b7794a',
  l: '#fef3c7',
  x: '#cbd5e1',
  u: '#94a3b8'
};

type Canvas = string[][];
type StageKind = 'hatchling' | 'toolkit' | 'specialist' | 'ultimate';
type Point = { x: number; y: number };

const styleOrder: StyleScoreKey[] = ['builder', 'cleaner', 'debugger', 'scholar', 'streak'];
const lineageOrder: PetLineage[] = ['buildling', 'refact', 'debugon', 'archivox'];

const stageSizes: Record<StageKind, number> = {
  hatchling: 16,
  toolkit: 20,
  specialist: 24,
  ultimate: 32
};

const lineageTokens: Record<PetLineage, { body: string; shade: string; accent: string; dark: string }> = {
  buildling: { body: 'e', shade: 'h', accent: 'o', dark: 'a' },
  refact: { body: 'x', shade: 'u', accent: 'c', dark: 't' },
  debugon: { body: 'r', shade: 'q', accent: 'r', dark: 'q' },
  archivox: { body: 'b', shade: 'n', accent: 'b', dark: 'v' }
};

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

function makeCanvas(size: number): Canvas {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => '.'));
}

function setPixel(canvas: Canvas, x: number, y: number, token: string): void {
  if (y < 0 || y >= canvas.length || x < 0 || x >= canvas[y].length) {
    return;
  }
  canvas[y][x] = token;
}

function rect(canvas: Canvas, x: number, y: number, width: number, height: number, token: string): void {
  for (let yy = y; yy < y + height; yy++) {
    for (let xx = x; xx < x + width; xx++) {
      setPixel(canvas, xx, yy, token);
    }
  }
}

function ellipse(canvas: Canvas, cx: number, cy: number, rx: number, ry: number, token: string): void {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      if ((dx * dx) + (dy * dy) <= 1) {
        setPixel(canvas, x, y, token);
      }
    }
  }
}

function outlineEllipse(canvas: Canvas, cx: number, cy: number, rx: number, ry: number): void {
  for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry + 1); y++) {
    for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      const score = (dx * dx) + (dy * dy);
      if (score > 1 && score <= 1.24) {
        setPixel(canvas, x, y, 'k');
      }
    }
  }
}

function line(canvas: Canvas, from: Point, to: Point, token: string): void {
  const steps = Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y));
  for (let i = 0; i <= steps; i++) {
    const x = Math.round(from.x + ((to.x - from.x) * i) / steps);
    const y = Math.round(from.y + ((to.y - from.y) * i) / steps);
    setPixel(canvas, x, y, token);
  }
}

function triangle(canvas: Canvas, points: [Point, Point, Point], token: string): void {
  const [a, b, c] = points;
  const minX = Math.min(a.x, b.x, c.x);
  const maxX = Math.max(a.x, b.x, c.x);
  const minY = Math.min(a.y, b.y, c.y);
  const maxY = Math.max(a.y, b.y, c.y);
  const area = (p1: Point, p2: Point, p3: Point) => (
    Math.abs((p1.x * (p2.y - p3.y)) + (p2.x * (p3.y - p1.y)) + (p3.x * (p1.y - p2.y))) / 2
  );
  const total = area(a, b, c);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const p = { x, y };
      if (Math.abs(area(p, b, c) + area(a, p, c) + area(a, b, p) - total) < 0.01) {
        setPixel(canvas, x, y, token);
      }
    }
  }
}

function mirror(canvas: Canvas): void {
  const size = canvas.length;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < Math.floor(size / 2); x++) {
      const right = size - 1 - x;
      if (canvas[y][x] !== '.' && canvas[y][right] === '.') {
        canvas[y][right] = canvas[y][x];
      }
    }
  }
}

function drawEyes(canvas: Canvas, size: number, leftX: number, rightX: number, y: number): void {
  setPixel(canvas, leftX, y, 'k');
  setPixel(canvas, rightX, y, 'k');
  if (size >= 20) {
    setPixel(canvas, leftX, y - 1, 'w');
    setPixel(canvas, rightX, y - 1, 'w');
  }
}

function drawDog(canvas: Canvas, size: number, stage: StageKind): void {
  const t = lineageTokens.buildling;
  const scale = size / 16;
  outlineEllipse(canvas, size / 2, size * 0.55, size * 0.34, size * 0.29);
  ellipse(canvas, size / 2, size * 0.56, size * 0.31, size * 0.26, t.body);
  ellipse(canvas, size / 2, size * 0.42, size * 0.27, size * 0.22, t.body);
  ellipse(canvas, size * 0.28, size * 0.38, size * 0.09, size * 0.16, t.shade);
  ellipse(canvas, size * 0.72, size * 0.38, size * 0.09, size * 0.16, t.shade);
  ellipse(canvas, size * 0.50, size * 0.50, size * 0.12, size * 0.08, 'l');
  drawEyes(canvas, size, Math.round(size * 0.42), Math.round(size * 0.58), Math.round(size * 0.40));
  setPixel(canvas, Math.round(size * 0.50), Math.round(size * 0.48), 'k');
  rect(canvas, Math.round(size * 0.35), Math.round(size * 0.76), Math.max(1, Math.round(scale * 2)), Math.max(1, Math.round(scale * 2)), t.shade);
  rect(canvas, Math.round(size * 0.58), Math.round(size * 0.76), Math.max(1, Math.round(scale * 2)), Math.max(1, Math.round(scale * 2)), t.shade);
  line(canvas, { x: Math.round(size * 0.76), y: Math.round(size * 0.58) }, { x: Math.round(size * 0.90), y: Math.round(size * 0.45) }, t.shade);
  if (stage !== 'hatchling') {
    rect(canvas, Math.round(size * 0.31), Math.round(size * 0.61), Math.round(size * 0.38), Math.max(1, Math.round(scale * 2)), 's');
    setPixel(canvas, Math.round(size * 0.50), Math.round(size * 0.62), t.accent);
  }
}

function drawCat(canvas: Canvas, size: number, stage: StageKind): void {
  const t = lineageTokens.refact;
  outlineEllipse(canvas, size / 2, size * 0.55, size * 0.31, size * 0.25);
  ellipse(canvas, size / 2, size * 0.57, size * 0.29, size * 0.24, t.body);
  ellipse(canvas, size / 2, size * 0.40, size * 0.26, size * 0.20, t.body);
  triangle(canvas, [
    { x: Math.round(size * 0.28), y: Math.round(size * 0.32) },
    { x: Math.round(size * 0.37), y: Math.round(size * 0.08) },
    { x: Math.round(size * 0.45), y: Math.round(size * 0.33) }
  ], t.shade);
  triangle(canvas, [
    { x: Math.round(size * 0.55), y: Math.round(size * 0.33) },
    { x: Math.round(size * 0.63), y: Math.round(size * 0.08) },
    { x: Math.round(size * 0.72), y: Math.round(size * 0.32) }
  ], t.shade);
  drawEyes(canvas, size, Math.round(size * 0.42), Math.round(size * 0.58), Math.round(size * 0.40));
  setPixel(canvas, Math.round(size * 0.50), Math.round(size * 0.48), 'k');
  line(canvas, { x: Math.round(size * 0.69), y: Math.round(size * 0.63) }, { x: Math.round(size * 0.90), y: Math.round(size * 0.75) }, t.shade);
  line(canvas, { x: Math.round(size * 0.90), y: Math.round(size * 0.75) }, { x: Math.round(size * 0.83), y: Math.round(size * 0.88) }, t.accent);
  line(canvas, { x: Math.round(size * 0.35), y: Math.round(size * 0.48) }, { x: Math.round(size * 0.18), y: Math.round(size * 0.44) }, 'd');
  line(canvas, { x: Math.round(size * 0.65), y: Math.round(size * 0.48) }, { x: Math.round(size * 0.82), y: Math.round(size * 0.44) }, 'd');
  if (stage !== 'hatchling') {
    rect(canvas, Math.round(size * 0.43), Math.round(size * 0.60), Math.round(size * 0.14), 2, t.accent);
  }
}

function drawRabbit(canvas: Canvas, size: number, stage: StageKind): void {
  const t = lineageTokens.debugon;
  outlineEllipse(canvas, size / 2, size * 0.58, size * 0.30, size * 0.24);
  ellipse(canvas, size / 2, size * 0.60, size * 0.28, size * 0.23, t.body);
  ellipse(canvas, size / 2, size * 0.42, size * 0.24, size * 0.19, t.body);
  ellipse(canvas, size * 0.38, size * 0.18, size * 0.07, size * 0.22, t.body);
  ellipse(canvas, size * 0.62, size * 0.18, size * 0.07, size * 0.22, t.body);
  line(canvas, { x: Math.round(size * 0.38), y: Math.round(size * 0.06) }, { x: Math.round(size * 0.38), y: Math.round(size * 0.30) }, t.shade);
  line(canvas, { x: Math.round(size * 0.62), y: Math.round(size * 0.06) }, { x: Math.round(size * 0.62), y: Math.round(size * 0.30) }, t.shade);
  drawEyes(canvas, size, Math.round(size * 0.42), Math.round(size * 0.58), Math.round(size * 0.41));
  setPixel(canvas, Math.round(size * 0.50), Math.round(size * 0.49), 'k');
  ellipse(canvas, size * 0.30, size * 0.80, size * 0.10, size * 0.06, t.shade);
  ellipse(canvas, size * 0.70, size * 0.80, size * 0.10, size * 0.06, t.shade);
  if (stage !== 'hatchling') {
    rect(canvas, Math.round(size * 0.72), Math.round(size * 0.55), Math.round(size * 0.11), Math.round(size * 0.12), 's');
    setPixel(canvas, Math.round(size * 0.78), Math.round(size * 0.57), t.dark);
  }
}

function drawOwl(canvas: Canvas, size: number, stage: StageKind): void {
  const t = lineageTokens.archivox;
  outlineEllipse(canvas, size / 2, size * 0.55, size * 0.32, size * 0.30);
  ellipse(canvas, size / 2, size * 0.57, size * 0.30, size * 0.28, t.body);
  triangle(canvas, [
    { x: Math.round(size * 0.27), y: Math.round(size * 0.28) },
    { x: Math.round(size * 0.36), y: Math.round(size * 0.12) },
    { x: Math.round(size * 0.44), y: Math.round(size * 0.31) }
  ], t.shade);
  triangle(canvas, [
    { x: Math.round(size * 0.56), y: Math.round(size * 0.31) },
    { x: Math.round(size * 0.64), y: Math.round(size * 0.12) },
    { x: Math.round(size * 0.73), y: Math.round(size * 0.28) }
  ], t.shade);
  ellipse(canvas, size * 0.41, size * 0.40, size * 0.10, size * 0.10, 'w');
  ellipse(canvas, size * 0.59, size * 0.40, size * 0.10, size * 0.10, 'w');
  drawEyes(canvas, size, Math.round(size * 0.41), Math.round(size * 0.59), Math.round(size * 0.40));
  triangle(canvas, [
    { x: Math.round(size * 0.48), y: Math.round(size * 0.48) },
    { x: Math.round(size * 0.52), y: Math.round(size * 0.48) },
    { x: Math.round(size * 0.50), y: Math.round(size * 0.55) }
  ], 'y');
  ellipse(canvas, size * 0.29, size * 0.60, size * 0.08, size * 0.20, t.shade);
  ellipse(canvas, size * 0.71, size * 0.60, size * 0.08, size * 0.20, t.shade);
  if (stage !== 'hatchling') {
    rect(canvas, Math.round(size * 0.36), Math.round(size * 0.66), Math.round(size * 0.28), Math.round(size * 0.12), 'w');
    setPixel(canvas, Math.round(size * 0.50), Math.round(size * 0.69), t.dark);
  }
}

function drawAnimal(canvas: Canvas, lineage: PetLineage, stage: StageKind): void {
  if (lineage === 'buildling') {
    drawDog(canvas, canvas.length, stage);
  } else if (lineage === 'refact') {
    drawCat(canvas, canvas.length, stage);
  } else if (lineage === 'debugon') {
    drawRabbit(canvas, canvas.length, stage);
  } else {
    drawOwl(canvas, canvas.length, stage);
  }
}

function drawStageGear(canvas: Canvas, lineage: PetLineage, stage: StageKind): void {
  const size = canvas.length;
  const t = lineageTokens[lineage];
  if (stage === 'toolkit' || stage === 'specialist' || stage === 'ultimate') {
    rect(canvas, Math.round(size * 0.36), Math.round(size * 0.72), Math.round(size * 0.28), Math.max(1, Math.round(size * 0.06)), t.accent);
    setPixel(canvas, Math.round(size * 0.50), Math.round(size * 0.74), 'w');
  }
  if (stage === 'ultimate') {
    rect(canvas, Math.round(size * 0.27), Math.round(size * 0.18), Math.round(size * 0.46), Math.max(1, Math.round(size * 0.05)), 'm');
    line(canvas, { x: Math.round(size * 0.18), y: Math.round(size * 0.62) }, { x: Math.round(size * 0.08), y: Math.round(size * 0.88) }, t.dark);
    line(canvas, { x: Math.round(size * 0.82), y: Math.round(size * 0.62) }, { x: Math.round(size * 0.92), y: Math.round(size * 0.88) }, t.dark);
  }
}

function drawAffinityGear(canvas: Canvas, lineage: PetLineage, affinity?: PetAffinity): void {
  if (!affinity) {
    return;
  }

  const size = canvas.length;
  const cx = Math.round(size * 0.50);
  const cy = Math.round(size * 0.25);
  if (affinity === 'builder') {
    rect(canvas, cx - 2, cy - 2, 5, 3, 'o');
    setPixel(canvas, cx, cy - 3, 'y');
    line(canvas, { x: Math.round(size * 0.72), y: Math.round(size * 0.74) }, { x: Math.round(size * 0.88), y: Math.round(size * 0.88) }, 'o');
    setPixel(canvas, Math.round(size * 0.89), Math.round(size * 0.89), 'y');
  } else if (affinity === 'cleaner') {
    line(canvas, { x: Math.round(size * 0.28), y: Math.round(size * 0.26) }, { x: Math.round(size * 0.72), y: Math.round(size * 0.26) }, 'c');
    rect(canvas, cx - 3, Math.round(size * 0.70), 7, 2, 'w');
    setPixel(canvas, cx - 4, Math.round(size * 0.70), 'c');
    setPixel(canvas, cx + 4, Math.round(size * 0.70), 'c');
  } else if (affinity === 'debugger') {
    ellipse(canvas, size * 0.72, size * 0.33, size * 0.08, size * 0.08, 'r');
    setPixel(canvas, Math.round(size * 0.72), Math.round(size * 0.33), 'w');
    rect(canvas, Math.round(size * 0.20), Math.round(size * 0.68), Math.round(size * 0.14), Math.round(size * 0.14), 's');
    setPixel(canvas, Math.round(size * 0.25), Math.round(size * 0.72), 'q');
  } else if (affinity === 'scholar') {
    rect(canvas, Math.round(size * 0.31), Math.round(size * 0.73), Math.round(size * 0.38), Math.round(size * 0.12), 'b');
    rect(canvas, Math.round(size * 0.34), Math.round(size * 0.75), Math.round(size * 0.12), Math.round(size * 0.08), 'w');
    rect(canvas, Math.round(size * 0.54), Math.round(size * 0.75), Math.round(size * 0.12), Math.round(size * 0.08), 'w');
    setPixel(canvas, cx, Math.round(size * 0.29), 'm');
  } else {
    line(canvas, { x: Math.round(size * 0.24), y: Math.round(size * 0.81) }, { x: Math.round(size * 0.40), y: Math.round(size * 0.90) }, 'g');
    line(canvas, { x: Math.round(size * 0.40), y: Math.round(size * 0.90) }, { x: Math.round(size * 0.72), y: Math.round(size * 0.70) }, 'g');
    rect(canvas, Math.round(size * 0.76), Math.round(size * 0.20), Math.round(size * 0.08), Math.round(size * 0.50), 'g');
  }

  const t = lineageTokens[lineage];
  setPixel(canvas, Math.round(size * 0.16), Math.round(size * 0.18), t.accent);
  setPixel(canvas, Math.round(size * 0.84), Math.round(size * 0.18), t.accent);
}

function makePixels(lineage: PetLineage, stage: StageKind, affinity?: PetAffinity): string[] {
  const canvas = makeCanvas(stageSizes[stage]);
  drawAnimal(canvas, lineage, stage);
  drawStageGear(canvas, lineage, stage);
  drawAffinityGear(canvas, lineage, affinity);
  if (stage === 'ultimate') {
    drawAffinityGear(canvas, lineage, lineage === 'buildling' ? 'builder' : lineage === 'refact' ? 'cleaner' : lineage === 'debugon' ? 'debugger' : 'scholar');
  }
  mirror(canvas);

  return canvas.map((row) => row.join(''));
}

function frame(width: number, height: number, pixels: string[]): PixelFrame {
  return {
    width,
    height,
    palette,
    pixels
  };
}

function setRowToken(row: string, x: number, token: string): string {
  if (x < 0 || x >= row.length) {
    return row;
  }

  return `${row.slice(0, x)}${token}${row.slice(x + 1)}`;
}

function addCuteBlush(pixels: string[]): string[] {
  const height = pixels.length;
  const width = pixels[0]?.length ?? 0;
  const cheekY = Math.max(3, Math.min(height - 4, Math.floor(height * 0.42)));
  const leftCheekX = Math.max(1, Math.floor(width * 0.34));
  const rightCheekX = Math.min(width - 2, Math.ceil(width * 0.66));

  return pixels.map((row, y) => {
    if (y !== cheekY) {
      return row;
    }

    return setRowToken(setRowToken(row, leftCheekX, 'p'), rightCheekX, 'p');
  });
}

function pack(id: string, evolution: PetEvolution, mood: PetMood, pixels: string[]): SpritePack {
  const designedPixels = id === 'egg-common-normal' ? pixels : addCuteBlush(pixels);

  return {
    id,
    evolution,
    mood,
    frames: [frame(designedPixels[0]?.length ?? 0, designedPixels.length, designedPixels)]
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

export const developerToolSpritePacks: SpritePack[] = [
  pack('egg-common-normal', 'egg', 'normal', eggPixels),
  ...lineageOrder.map((lineage) => pack(`${lineage}-hatchling-normal`, 'junior', 'normal', makePixels(lineage, 'hatchling'))),
  ...lineageOrder.map((lineage) => pack(`${lineage}-toolkit-normal`, 'mid', 'normal', makePixels(lineage, 'toolkit'))),
  ...lineageOrder.flatMap((lineage) => styleOrder.map((affinity) => (
    pack(`${lineage}-specialist-${affinity}-normal`, 'senior', 'normal', makePixels(lineage, 'specialist', affinity))
  ))),
  ...lineageOrder.map((lineage) => pack(`${lineage}-ultimate-normal`, 'architect', 'normal', makePixels(lineage, 'ultimate')))
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
