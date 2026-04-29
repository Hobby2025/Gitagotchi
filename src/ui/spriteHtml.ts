import { PixelFrame } from '../character/spriteTypes';
import { renderHtmlTemplate } from './webviewSecurity';

function getPixelSize(frame: PixelFrame): number {
  if (frame.width >= 32 || frame.height >= 32) {
    return 5;
  }
  if (frame.width >= 24 || frame.height >= 24) {
    return 6;
  }
  if (frame.width >= 16 || frame.height >= 16) {
    return 9;
  }
  if (frame.width >= 12 || frame.height >= 12) {
    return 12;
  }
  return 15;
}

export function renderSpriteHtml(frame: PixelFrame, className: string, ariaLabel: string): string {
  const pixels = frame.pixels.flatMap((row) => Array.from({ length: frame.width }, (_, x) => {
    const token = row[x] ?? '.';
    const color = frame.palette[token] ?? 'transparent';
    const style = color === 'transparent' ? '' : ` style="background:${renderHtmlTemplate.escape(color)}"`;
    return `<span class="sprite-pixel"${style}></span>`;
  }));

  return `<div class="${className}" aria-label="${renderHtmlTemplate.escape(ariaLabel)}" style="--cols:${frame.width};--rows:${frame.height};--px:${getPixelSize(frame)}px">${pixels.join('')}</div>`;
}
