import { createPetDexEntries } from '../src/character/petDex';
import { renderDexPanelHtml } from '../src/ui/dexPanelPresentation';

describe('dex panel', () => {
  it('renders all 33 current pet designs in grouped trading cards', () => {
    const html = renderDexPanelHtml({
      cspSource: 'vscode-resource:',
      nonce: 'abc'
    });

    expect(html).toContain('Gitagotchi Dex');
    expect(html).toContain('33/33 unlocked');
    expect(html).toContain('class="dex-grid"');
    expect(html).toContain('data-dex-id="egg-common-normal"');
    expect(html).toContain('data-dex-id="buildling-hatchling-normal"');
    expect(html).toContain('data-dex-id="refact-toolkit-normal"');
    expect(html).toContain('data-dex-id="debugon-specialist-debugger-normal"');
    expect(html).toContain('data-dex-id="archivox-ultimate-normal"');
    expect((html.match(/data-dex-id="/g) ?? []).length).toBe(33);
    expect(html).toContain('aria-label="egg-common-normal sprite"');
  });

  it('renders locked entries as question-mark placeholders for future discovery rules', () => {
    const entries = createPetDexEntries({ unlockedIds: new Set(['egg-common-normal']) });
    const html = renderDexPanelHtml({
      cspSource: 'vscode-resource:',
      nonce: 'abc',
      entries
    });

    expect(html).toContain('1/33 unlocked');
    expect(html).toContain('data-dex-id="buildling-hatchling-normal" data-unlocked="false"');
    expect(html).toContain('class="dex-unknown" aria-label="Locked Gitagotchi sprite">?</div>');
    expect(html).toContain('<h3>Unknown pet</h3>');
  });
});
