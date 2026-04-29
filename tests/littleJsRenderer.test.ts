import { getSpritePack } from '../src/character/evolutionSprites';
import { renderLittleJsCanvas, renderLittleJsRuntimeModule } from '../src/character/littleJsRenderer';

describe('LittleJS renderer', () => {
  it('renders a canvas mount and module script for a pixel frame', () => {
    const sprite = getSpritePack('egg', 'normal');
    const html = renderLittleJsCanvas(sprite.frames[0], {
      littleJsUri: 'vscode-resource:/littlejs.esm.min.js',
      runtimeUri: 'vscode-resource:/gitagotchiLittleJsRuntime.js',
      canvasId: 'gitagotchi-littlejs'
    });

    expect(html).toContain('id="gitagotchi-littlejs"');
    expect(html).toContain('type="application/json"');
    expect(html).toContain('"width":12');
    expect(html).toContain('vscode-resource:/gitagotchiLittleJsRuntime.js');
  });

  it('creates a LittleJS runtime module that draws pixel frames with drawRect', () => {
    const script = renderLittleJsRuntimeModule('vscode-resource:/littlejs.esm.min.js');

    expect(script).toContain("import * as LJS from 'vscode-resource:/littlejs.esm.min.js'");
    expect(script).toContain('LJS.engineInit');
    expect(script).toContain('LJS.drawRect');
    expect(script).toContain('LJS.setCanvasFixedSize');
  });
});
