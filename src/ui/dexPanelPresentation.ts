import { PetDexEntry, createPetDexEntries, groupPetDexEntries } from '../character/petDex';
import { PetLineage } from '../core/petState';
import { renderSpriteHtml } from './spriteHtml';
import { renderHtmlTemplate } from './webviewSecurity';

export type DexPanelRenderOptions = {
  cspSource: string;
  nonce: string;
  entries?: PetDexEntry[];
};

function getLineageTheme(lineage?: PetLineage): string {
  const themes: Record<PetLineage | 'common', { accent: string; glow: string; soft: string }> = {
    buildling: { accent: '#fb923c', glow: 'rgba(251,146,60,.28)', soft: '#facc15' },
    refact: { accent: '#22d3ee', glow: 'rgba(34,211,238,.26)', soft: '#14b8a6' },
    debugon: { accent: '#f87171', glow: 'rgba(248,113,113,.28)', soft: '#f472b6' },
    archivox: { accent: '#60a5fa', glow: 'rgba(96,165,250,.28)', soft: '#c084fc' },
    common: { accent: '#86efac', glow: 'rgba(134,239,172,.24)', soft: '#facc15' }
  };
  const theme = themes[lineage ?? 'common'];

  return `--lineage-accent:${theme.accent};--lineage-glow:${theme.glow};--lineage-soft:${theme.soft}`;
}

function renderEntry(entry: PetDexEntry, index: number): string {
  const title = entry.unlocked ? entry.id.replace(/-normal$/, '') : 'Unknown pet';
  const lineage = entry.unlocked ? (entry.lineage ?? 'common') : '?';
  const affinity = entry.unlocked ? (entry.affinity ?? 'base') : '?';
  const sprite = entry.unlocked
    ? renderSpriteHtml(entry.sprite.frames[0], 'dex-sprite', `${entry.id} sprite`, { maxPixelSize: 4 })
    : '<div class="dex-unknown" aria-label="Locked Gitagotchi sprite">?</div>';

  return `<article class="dex-card${entry.unlocked ? '' : ' locked'}" style="${getLineageTheme(entry.lineage)}" data-dex-id="${renderHtmlTemplate.escape(entry.id)}" data-unlocked="${entry.unlocked}">
    <div class="dex-card-top"><span>No.${String(index + 1).padStart(2, '0')}</span><strong>${renderHtmlTemplate.escape(entry.stage)}</strong></div>
    <div class="dex-sprite-stage">${sprite}</div>
    <h3>${renderHtmlTemplate.escape(title)}</h3>
    <div class="dex-tags"><span>${renderHtmlTemplate.escape(lineage)}</span><span>${renderHtmlTemplate.escape(affinity)}</span></div>
  </article>`;
}

export function renderDexPanelHtml(options: DexPanelRenderOptions): string {
  const entries = options.entries ?? createPetDexEntries();
  const unlockedCount = entries.filter((entry) => entry.unlocked).length;
  const groups = groupPetDexEntries(entries);
  let renderedIndex = 0;
  const sections = groups.map(([stage, stageEntries]) => {
    const cards = stageEntries.map((entry) => renderEntry(entry, renderedIndex++)).join('');
    return `<section class="dex-section"><div class="section-heading"><h2>${renderHtmlTemplate.escape(stage)}</h2><span>${stageEntries.length}</span></div><div class="dex-grid">${cards}</div></section>`;
  }).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${options.cspSource}; style-src 'unsafe-inline' ${options.cspSource}; script-src 'nonce-${options.nonce}' ${options.cspSource};">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 22px; color: var(--vscode-foreground); background: var(--vscode-editor-background); font-family: var(--vscode-font-family); }
    .dex-shell { width: min(1120px, 100%); display: grid; gap: 18px; }
    .dex-header { display: flex; align-items: end; justify-content: space-between; gap: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--vscode-panel-border); }
    .dex-header h1 { margin: 0; font-size: 26px; line-height: 1; letter-spacing: 0; }
    .dex-header p { margin: 7px 0 0; color: var(--vscode-descriptionForeground); font-size: 12px; }
    .dex-progress { display: grid; gap: 6px; min-width: 180px; font-family: var(--vscode-editor-font-family); font-size: 12px; }
    .dex-progress strong { text-align: right; }
    .dex-progress span { display: block; height: 8px; overflow: hidden; border: 1px solid var(--vscode-panel-border); border-radius: 999px; background: var(--vscode-editorWidget-background); }
    .dex-progress i { display: block; height: 100%; background: var(--vscode-charts-green); }
    .dex-section { display: grid; gap: 10px; }
    .section-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .section-heading h2 { margin: 0; font-size: 13px; line-height: 1; text-transform: uppercase; letter-spacing: .08em; }
    .section-heading span { color: var(--vscode-descriptionForeground); font-family: var(--vscode-editor-font-family); font-size: 12px; }
    .dex-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(172px, 1fr)); gap: 10px; }
    .dex-card { position: relative; min-height: 256px; display: grid; grid-template-rows: auto 144px auto auto; gap: 9px; padding: 10px; overflow: hidden; border: 1px solid color-mix(in srgb, var(--vscode-panel-border) 74%, var(--lineage-accent)); border-radius: 8px; background: color-mix(in srgb, var(--vscode-sideBar-background) 90%, var(--lineage-accent)); box-shadow: inset 0 1px 0 rgba(255,255,255,.06); }
    .dex-card::before { content: ""; position: absolute; inset: 34px 12px auto; height: 120px; background: radial-gradient(circle, var(--lineage-glow), transparent 70%); pointer-events: none; }
    .dex-card-top, .dex-sprite-stage, .dex-card h3, .dex-tags { position: relative; z-index: 1; }
    .dex-card-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; color: var(--vscode-descriptionForeground); font-family: var(--vscode-editor-font-family); font-size: 11px; }
    .dex-card-top strong { color: var(--vscode-foreground); text-transform: uppercase; letter-spacing: .06em; }
    .dex-sprite-stage { display: grid; place-items: center; min-height: 144px; overflow: hidden; border: 1px solid color-mix(in srgb, var(--lineage-accent) 40%, var(--vscode-panel-border)); border-radius: 7px; background: color-mix(in srgb, var(--vscode-editorWidget-background) 84%, var(--lineage-accent)); }
    .dex-sprite { display: grid; grid-template-columns: repeat(var(--cols), var(--px)); grid-template-rows: repeat(var(--rows), var(--px)); image-rendering: pixelated; filter: drop-shadow(0 8px 0 rgba(0,0,0,.18)) drop-shadow(0 0 12px var(--lineage-glow)); }
    .sprite-pixel { width: var(--px); height: var(--px); }
    .dex-unknown { display: grid; place-items: center; width: 82px; height: 82px; border: 1px dashed color-mix(in srgb, var(--vscode-descriptionForeground) 64%, transparent); border-radius: 8px; color: var(--vscode-descriptionForeground); background: var(--vscode-editor-background); font-family: var(--vscode-editor-font-family); font-size: 46px; font-weight: 800; }
    .dex-card h3 { min-height: 34px; margin: 0; overflow-wrap: anywhere; font-size: 13px; line-height: 1.25; letter-spacing: 0; }
    .dex-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .dex-tags span { border: 1px solid color-mix(in srgb, var(--lineage-accent) 58%, var(--vscode-panel-border)); border-radius: 999px; padding: 4px 7px; background: color-mix(in srgb, var(--vscode-editorWidget-background) 82%, var(--lineage-accent)); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
    .dex-card.locked { filter: saturate(.72); }
    .dex-card.locked h3 { color: var(--vscode-descriptionForeground); }
    @media (max-width: 560px) {
      body { padding: 14px; }
      .dex-header { align-items: stretch; flex-direction: column; }
      .dex-progress strong { text-align: left; }
      .dex-grid { grid-template-columns: repeat(auto-fill, minmax(142px, 1fr)); }
    }
  </style>
</head>
<body>
  <main class="dex-shell">
    <header class="dex-header">
      <div><h1>Gitagotchi Dex</h1><p>All current pet designs are listed here. Locked rendering is ready for future discovery rules.</p></div>
      <div class="dex-progress"><strong>${unlockedCount}/${entries.length} unlocked</strong><span><i style="width:${entries.length === 0 ? 0 : Math.round((unlockedCount / entries.length) * 100)}%"></i></span></div>
    </header>
    ${sections}
  </main>
</body>
</html>`;
}
