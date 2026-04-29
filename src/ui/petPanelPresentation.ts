import { getPetSpritePack } from '../character/evolutionSprites';
import { getMoodName, getRequiredExp, PetLineage, PetState } from '../core/petState';
import { I18n } from '../i18n';
import { renderSpriteHtml } from './spriteHtml';
import { renderHtmlTemplate } from './webviewSecurity';

export type PetPanelRenderOptions = {
  cspSource: string;
  nonce: string;
};

function meterClass(value: number, inverted = false): string {
  const score = inverted ? 100 - value : value;
  if (score >= 70) {
    return 'good';
  }
  if (score >= 35) {
    return 'warn';
  }
  return 'bad';
}

function getLineageTheme(lineage?: PetLineage): string {
  const themes: Record<PetLineage | 'unbranched', { accent: string; glow: string; soft: string }> = {
    buildling: { accent: '#fb923c', glow: 'rgba(251,146,60,.28)', soft: '#facc15' },
    refact: { accent: '#22d3ee', glow: 'rgba(34,211,238,.26)', soft: '#14b8a6' },
    debugon: { accent: '#f87171', glow: 'rgba(248,113,113,.28)', soft: '#f472b6' },
    archivox: { accent: '#60a5fa', glow: 'rgba(96,165,250,.28)', soft: '#c084fc' },
    unbranched: { accent: '#86efac', glow: 'rgba(134,239,172,.24)', soft: '#facc15' }
  };
  const theme = themes[lineage ?? 'unbranched'];

  return `--lineage-accent:${theme.accent};--lineage-glow:${theme.glow};--lineage-soft:${theme.soft}`;
}

export function renderPetPanelHtml(state: PetState, i18n: I18n, options: PetPanelRenderOptions): string {
  const mood = getMoodName(state);
  const sprite = getPetSpritePack(state, mood);
  const firstFrame = sprite.frames[0];
  if (!firstFrame) {
    throw new Error(`No frames available for evolution=${state.evolution} mood=${mood}`);
  }

  const petName = renderHtmlTemplate.escape(state.name?.trim() || 'Gitagotchi');
  const pet = renderSpriteHtml(firstFrame, 'monster-sprite', 'Gitagotchi monster sprite');
  const stage = renderHtmlTemplate.escape(state.stage);
  const lineage = renderHtmlTemplate.escape(state.lineage ?? 'unbranched');
  const affinity = renderHtmlTemplate.escape(state.affinity ?? 'unfocused');
  const lineageTheme = getLineageTheme(state.lineage);
  const expPercent = Math.min(100, Math.round((state.exp / getRequiredExp(state.level)) * 100));
  const maxStyleScore = Math.max(100, ...Object.values(state.styleScores));
  const styleRows = (Object.entries(state.styleScores) as Array<[keyof typeof state.styleScores, number]>)
    .map(([key, value]) => {
      const percent = Math.min(100, Math.round((value / maxStyleScore) * 100));
      return `<div class="skill-node"><span>${i18n.t(`style.${key}`)}</span><strong>${value}</strong><i style="width:${percent}%"></i></div>`;
    })
    .join('');
  const actions = [
    { command: 'feed', rune: 'FD', label: i18n.t('ui.feed'), primary: true },
    { command: 'commit', rune: 'GC', label: i18n.t('ui.commit') },
    { command: 'stats', rune: 'ST', label: i18n.t('ui.viewStats') },
    { command: 'leaderboard', rune: 'LB', label: i18n.t('ui.leaderboard') },
    { command: 'createLeaderboard', rune: 'RM', label: i18n.t('ui.createLeaderboard') },
    { command: 'rename', rune: 'RN', label: 'Rename' },
    { command: 'reset', rune: 'RS', label: 'Reset' }
  ];
  const actionButtons = actions
    .map((action) => `<button class="action-btn${action.primary ? ' action-primary' : ''}" data-command="${action.command}"><span class="action-rune">${action.rune}</span><span class="action-label">${action.label}</span></button>`)
    .join('');

  const flags: Record<string, string> = { en: '🇺🇸', ko: '🇰🇷', ja: '🇯🇵', zh: '🇨🇳' };
  const langButtons = (['en', 'ko', 'ja', 'zh'] as const)
    .map((locale) => `<button class="lang-btn ${locale === i18n.locale ? 'active' : ''}" data-locale="${locale}" title="${locale.toUpperCase()}">${flags[locale]}</button>`)
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${options.cspSource}; style-src 'unsafe-inline' ${options.cspSource}; script-src 'nonce-${options.nonce}' ${options.cspSource};">
  <style>
    * { box-sizing: border-box; }
    body { color: var(--vscode-foreground); font-family: var(--vscode-font-family); margin: 0; padding: 20px; background: var(--vscode-editor-background); }
    .lang-bar { display: flex; justify-content: flex-end; gap: 6px; margin-bottom: 12px; }
    .lang-btn { padding: 4px 6px; font-size: 18px; line-height: 1; background: transparent; border: 1px solid transparent; border-radius: 4px; cursor: pointer; opacity: 0.5; transition: opacity .15s ease, border-color .15s ease; }
    .lang-btn:hover { opacity: 1; border-color: var(--vscode-panel-border); }
    .lang-btn.active { opacity: 1; border-color: var(--vscode-panel-border); background: var(--vscode-editorWidget-background); }
    .hud-shell { width: min(920px, 100%); display: grid; grid-template-columns: minmax(260px, 300px) minmax(360px, 1fr); gap: 16px; align-items: stretch; }
    .monster-card, .systems-card { border: 1px solid color-mix(in srgb, var(--vscode-panel-border) 78%, var(--lineage-accent)); background: color-mix(in srgb, var(--vscode-sideBar-background) 91%, var(--lineage-accent)); border-radius: 8px; box-shadow: inset 0 1px 0 rgba(255,255,255,.06), 0 14px 34px rgba(0,0,0,.18); }
    .monster-card { position: relative; min-height: 420px; display: grid; grid-template-rows: auto 1fr auto auto; gap: 13px; padding: 14px; overflow: hidden; }
    .monster-card::before { content: ""; position: absolute; inset: 10px; border: 1px solid color-mix(in srgb, var(--lineage-accent) 68%, transparent); border-radius: 6px; pointer-events: none; box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--lineage-soft) 30%, transparent); }
    .monster-card::after { content: ""; position: absolute; inset: 38px 18px auto; height: 150px; background: radial-gradient(circle, var(--lineage-glow), transparent 68%); pointer-events: none; }
    .card-topline, .card-footer, .nameplate, .sprite-stage { position: relative; z-index: 1; }
    .card-topline { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; }
    .card-lineage, .card-rarity, .affinity-chip { border: 1px solid color-mix(in srgb, var(--lineage-accent) 62%, var(--vscode-panel-border)); border-radius: 999px; background: color-mix(in srgb, var(--vscode-editorWidget-background) 80%, var(--lineage-accent)); color: var(--vscode-foreground); font-size: 10px; font-weight: 800; letter-spacing: .08em; line-height: 1; padding: 6px 8px; text-transform: uppercase; }
    .card-level { display: inline-grid; place-items: center; min-width: 48px; min-height: 34px; border: 1px solid var(--lineage-accent); border-radius: 6px; background: color-mix(in srgb, var(--vscode-editor-background) 74%, var(--lineage-accent)); font-family: var(--vscode-editor-font-family); font-weight: 800; }
    .sprite-stage { align-self: center; justify-self: center; display: grid; place-items: center; width: 190px; height: 190px; border: 1px solid color-mix(in srgb, var(--lineage-accent) 42%, transparent); border-radius: 8px; background: radial-gradient(circle at 50% 58%, var(--lineage-glow), transparent 66%), linear-gradient(180deg, color-mix(in srgb, var(--vscode-editorWidget-background) 78%, var(--lineage-accent)), transparent); }
    .monster-sprite { display: grid; grid-template-columns: repeat(var(--cols), var(--px)); grid-template-rows: repeat(var(--rows), var(--px)); gap: 0; image-rendering: pixelated; filter: drop-shadow(0 12px 0 rgba(0,0,0,.26)) drop-shadow(0 0 16px var(--lineage-glow)); animation: bob 1.8s ease-in-out infinite; }
    .sprite-pixel { width: var(--px); height: var(--px); }
    @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    .nameplate { width: 100%; display: grid; gap: 7px; justify-items: center; padding: 10px 8px; border-top: 1px solid color-mix(in srgb, var(--lineage-accent) 40%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--lineage-accent) 40%, transparent); background: color-mix(in srgb, var(--vscode-editorWidget-background) 74%, transparent); }
    .name { margin: 0; max-width: 100%; overflow-wrap: anywhere; font-size: 25px; line-height: 1.05; text-align: center; letter-spacing: 0; }
    .callsign { color: var(--vscode-descriptionForeground); font-size: 11px; text-transform: uppercase; letter-spacing: .12em; }
    .card-footer { display: grid; gap: 9px; }
    .trait-row { display: flex; flex-wrap: wrap; gap: 7px; justify-content: center; }
    .systems-card { padding: 16px; display: grid; gap: 13px; }
    .topline { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center; }
    .level-badge { padding: 7px 10px; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editorWidget-background); font-weight: 800; }
    .title-stack span { display: block; color: var(--vscode-descriptionForeground); font-size: 11px; text-transform: uppercase; letter-spacing: .08em; }
    .title-stack strong { display: block; margin-top: 2px; font-size: 15px; }
    .exp-readout { font-family: var(--vscode-editor-font-family); font-size: 12px; }
    .expbar, .stat-card, .skill-node { position: relative; overflow: hidden; border: 1px solid var(--vscode-panel-border); background: color-mix(in srgb, var(--vscode-editorWidget-background) 92%, var(--lineage-accent)); border-radius: 7px; }
    .expbar { height: 12px; }
    .expbar span, .stat-card i, .skill-node i { display: block; height: 100%; background: var(--lineage-accent); }
    .stat-deck { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .stat-card { min-height: 66px; padding: 9px; }
    .stat-card .label, .skill-node span { position: relative; z-index: 1; display: block; color: var(--vscode-descriptionForeground); font-size: 10px; text-transform: uppercase; letter-spacing: .06em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .stat-card strong, .skill-node strong { position: relative; z-index: 1; display: block; margin-top: 7px; font-family: var(--vscode-editor-font-family); font-size: 18px; }
    .stat-card i, .skill-node i { position: absolute; left: 0; bottom: 0; height: 4px; }
    .stat-card.good i { background: var(--vscode-charts-green); }
    .stat-card.warn i { background: var(--vscode-charts-yellow); }
    .stat-card.bad i { background: var(--vscode-charts-red); }
    .meta-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border: 1px solid var(--vscode-panel-border); border-radius: 7px; overflow: hidden; background: var(--vscode-editorWidget-background); }
    .meta-strip div { padding: 9px 10px; border-right: 1px solid var(--vscode-panel-border); }
    .meta-strip div:last-child { border-right: 0; }
    .meta-strip span { display: block; color: var(--vscode-descriptionForeground); font-size: 10px; text-transform: uppercase; letter-spacing: .07em; }
    .meta-strip strong { display: block; margin-top: 4px; overflow-wrap: anywhere; font-family: var(--vscode-editor-font-family); font-size: 12px; }
    .skill-matrix { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
    .skill-node { min-height: 58px; padding: 8px; }
    .skill-node i { background: var(--lineage-soft); }
    .action-dock { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; padding-top: 2px; }
    button { min-height: 32px; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--vscode-button-border, transparent); color: var(--vscode-button-foreground); background: var(--vscode-button-background); font-size: 12px; white-space: nowrap; transition: transform .16s ease, background .16s ease, border-color .16s ease; }
    button:hover { background: var(--vscode-button-hoverBackground); }
    button:active { transform: translateY(1px) scale(.99); }
    .action-btn { min-height: 44px; display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 7px; align-items: center; padding: 7px 8px; border-color: color-mix(in srgb, var(--lineage-accent) 48%, var(--vscode-panel-border)); background: linear-gradient(180deg, color-mix(in srgb, var(--vscode-editorWidget-background) 84%, var(--lineage-accent)), color-mix(in srgb, var(--vscode-sideBar-background) 88%, var(--lineage-accent))); color: var(--vscode-foreground); box-shadow: inset 0 1px 0 rgba(255,255,255,.07); }
    .action-btn:hover { border-color: var(--lineage-accent); background: color-mix(in srgb, var(--vscode-editorWidget-background) 74%, var(--lineage-accent)); }
    .action-btn.action-primary { border-color: var(--lineage-accent); background: linear-gradient(180deg, color-mix(in srgb, var(--lineage-accent) 38%, var(--vscode-editorWidget-background)), color-mix(in srgb, var(--vscode-sideBar-background) 72%, var(--lineage-accent))); }
    .action-rune { display: grid; place-items: center; width: 28px; height: 28px; border: 1px solid color-mix(in srgb, var(--lineage-soft) 60%, var(--vscode-panel-border)); border-radius: 4px; background: color-mix(in srgb, var(--vscode-editor-background) 76%, var(--lineage-soft)); font-family: var(--vscode-editor-font-family); font-size: 10px; font-weight: 800; letter-spacing: 0; }
    .action-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left; font-size: 12px; font-weight: 700; letter-spacing: 0; }
    @media (max-width: 680px) {
      .hud-shell { grid-template-columns: 1fr; }
      .stat-deck, .skill-matrix, .meta-strip, .action-dock { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .meta-strip div { border-right: 0; border-bottom: 1px solid var(--vscode-panel-border); }
    }
  </style>
</head>
<body>
  <div class="lang-bar">${langButtons}</div>
  <div class="hud-shell">
    <section class="monster-card" style="${lineageTheme}">
      <div class="card-topline">
        <span class="card-lineage">${lineage}</span>
        <strong class="card-level">Lv.${state.level}</strong>
      </div>
      <div class="sprite-stage">${pet}</div>
      <div class="nameplate">
        <h1 class="name">${petName}</h1>
        <div class="callsign">Gitagotchi Lv.${state.level}</div>
      </div>
      <div class="card-footer">
        <div class="trait-row">
          <span class="card-rarity">${stage}</span>
          <span class="affinity-chip">${affinity}</span>
        </div>
        <div class="expbar" aria-label="Card EXP"><span style="width:${expPercent}%"></span></div>
      </div>
    </section>
    <section class="systems-card" style="${lineageTheme}">
      <div class="topline"><strong class="level-badge">Lv.${state.level}</strong><div class="title-stack"><span>Runtime Profile</span><strong>${petName}</strong></div><span class="exp-readout">${state.exp}/${getRequiredExp(state.level)} ${i18n.t('ui.exp')}</span></div>
      <div class="expbar" aria-label="EXP"><span style="width:${expPercent}%"></span></div>
      <div class="stat-deck">
        <div class="stat-card ${meterClass(state.mood)}"><span class="label">${i18n.t('ui.mood')}</span><strong>${state.mood}%</strong><i style="width:${state.mood}%"></i></div>
        <div class="stat-card ${meterClass(state.hunger, true)}"><span class="label">${i18n.t('ui.hunger')}</span><strong>${state.hunger}%</strong><i style="width:${state.hunger}%"></i></div>
        <div class="stat-card ${meterClass(state.energy)}"><span class="label">${i18n.t('ui.energy')}</span><strong>${state.energy}%</strong><i style="width:${state.energy}%"></i></div>
        <div class="stat-card ${meterClass(state.health)}"><span class="label">${i18n.t('ui.health')}</span><strong>${state.health}%</strong><i style="width:${state.health}%"></i></div>
      </div>
      <div class="meta-strip">
        <div><span>${i18n.t('ui.status')}</span><strong>${renderHtmlTemplate.escape(state.lifeStatus)}</strong></div>
        <div><span>${i18n.t('ui.stage')}</span><strong>${stage}</strong></div>
        <div><span>${i18n.t('ui.lineage')}</span><strong>${lineage}</strong></div>
        <div><span>${i18n.t('ui.affinity')}</span><strong>${affinity}</strong></div>
      </div>
      <div class="skill-matrix">${styleRows}</div>
      <div class="action-dock">${actionButtons}</div>
    </section>
  </div>
  <script nonce="${options.nonce}">
    const vscode = acquireVsCodeApi();
    document.querySelectorAll('button[data-command]').forEach((button) => {
      button.addEventListener('click', () => vscode.postMessage({ command: button.dataset.command }));
    });
    document.querySelectorAll('button[data-locale]').forEach((button) => {
      button.addEventListener('click', () => vscode.postMessage({ command: 'changeLanguage', locale: button.dataset.locale }));
    });
  </script>
</body>
</html>`;
}
