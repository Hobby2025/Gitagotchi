import { renderLittleJsCanvas } from '../src/character/littleJsRenderer';
import { renderHtmlTemplate, renderNonce } from '../src/ui/webviewSecurity';

describe('webview security helpers', () => {
  it('escapes untrusted HTML before rendering', () => {
    expect(renderHtmlTemplate.escape('<img src=x onerror=alert(1)>')).toBe('&lt;img src=x onerror=alert(1)&gt;');
  });

  it('generates a nonce suitable for CSP script tags', () => {
    expect(renderNonce()).toMatch(/^[A-Za-z0-9]{32}$/);
  });

  it('keeps LittleJS frame JSON parseable inside the data script', () => {
    const html = renderLittleJsCanvas({
      width: 1,
      height: 1,
      palette: { x: '#ffffff' },
      pixels: ['x']
    }, {
      littleJsUri: 'vscode-resource:/littlejs.esm.min.js',
      runtimeUri: 'vscode-resource:/gitagotchiLittleJsRuntime.js',
      canvasId: 'pet',
      nonce: 'abc'
    });

    expect(html).toContain('nonce="abc"');
    expect(html).toContain('"width":1');
    expect(html).not.toContain('&quot;');
  });
});
