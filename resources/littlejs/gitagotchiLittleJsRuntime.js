import * as LJS from './littlejs.esm.min.js';

const script = document.currentScript;
const targetId = script?.dataset.target ?? 'gitagotchi-littlejs';
const canvas = document.getElementById(targetId);
const payload = JSON.parse(document.getElementById(targetId + '-data')?.textContent ?? '{}');
const frame = payload.frame;
const pixelSize = payload.pixelSize ?? 12;
const worldSize = LJS.vec2(frame.width, frame.height);

function colorToRgb(color) {
  if (!color || color === 'transparent') {
    return LJS.rgba(0, 0, 0, 0);
  }

  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  return LJS.rgb(r, g, b);
}

function gameInit() {
  if (canvas) {
    LJS.mainCanvas = canvas;
  }
  LJS.tilesPixelated = true;
  LJS.setCameraPos(worldSize.scale(0.5));
  LJS.setCanvasFixedSize(LJS.vec2(frame.width * pixelSize, frame.height * pixelSize));
}

function gameUpdate() {}
function gameUpdatePost() {}

function gameRender() {
  LJS.drawRect(worldSize.scale(0.5), worldSize, LJS.rgba(0, 0, 0, 0));
  for (let y = 0; y < frame.height; y++) {
    const row = frame.pixels[y] ?? '';
    for (let x = 0; x < frame.width; x++) {
      const token = row[x] ?? '.';
      const color = frame.palette[token] ?? 'transparent';
      if (color === 'transparent') {
        continue;
      }
      const pos = LJS.vec2(x + 0.5, frame.height - y - 0.5);
      LJS.drawRect(pos, LJS.vec2(1), colorToRgb(color));
    }
  }
}

function gameRenderPost() {}

LJS.engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [], canvas?.parentElement ?? document.body);
