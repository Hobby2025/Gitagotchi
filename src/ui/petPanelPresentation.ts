import { getPetSpritePack } from "../character/evolutionSprites";
import {
  getMoodName,
  getRequiredExp,
  PetAffinity,
  PetLifeStatus,
  PetLineage,
  PetStage,
  PetState,
} from "../core/petState";
import { I18n } from "../i18n";
import { renderSpriteHtml } from "./spriteHtml";
import { renderHtmlTemplate } from "./webviewSecurity";

export type PetPanelRenderOptions = {
  cspSource: string;
  nonce: string;
  now?: Date;
};

function meterClass(value: number, inverted = false): string {
  const score = inverted ? 100 - value : value;
  if (score >= 70) {
    return "good";
  }
  if (score >= 35) {
    return "warn";
  }
  return "bad";
}

function getLineageTheme(lineage?: PetLineage): string {
  const themes: Record<
    PetLineage | "unbranched",
    { accent: string; glow: string; soft: string }
  > = {
    buildling: {
      accent: "#fb923c",
      glow: "rgba(251,146,60,.28)",
      soft: "#facc15",
    },
    refact: {
      accent: "#22d3ee",
      glow: "rgba(34,211,238,.26)",
      soft: "#14b8a6",
    },
    debugon: {
      accent: "#f87171",
      glow: "rgba(248,113,113,.28)",
      soft: "#f472b6",
    },
    archivox: {
      accent: "#60a5fa",
      glow: "rgba(96,165,250,.28)",
      soft: "#c084fc",
    },
    unbranched: {
      accent: "#86efac",
      glow: "rgba(134,239,172,.24)",
      soft: "#facc15",
    },
  };
  const theme = themes[lineage ?? "unbranched"];

  return `--lineage-accent:${theme.accent};--lineage-glow:${theme.glow};--lineage-soft:${theme.soft}`;
}

function getLocalDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function wasPattedToday(state: PetState, now: Date): boolean {
  return state.lastPattedAt
    ? getLocalDayKey(new Date(state.lastPattedAt)) === getLocalDayKey(now)
    : false;
}

function renderStatusName(status: PetLifeStatus, i18n: I18n): string {
  return i18n.t(`ui.status.${status}`);
}

function renderStageName(stage: PetStage, i18n: I18n): string {
  return i18n.t(`ui.stage.${stage}`);
}

function renderLineageName(lineage: PetLineage | undefined, i18n: I18n): string {
  return lineage ? i18n.t(`ui.lineage.${lineage}`) : i18n.t("ui.lineage.unbranched");
}

function renderAffinityName(affinity: PetAffinity | undefined, i18n: I18n): string {
  return affinity ? i18n.t(`ui.affinity.${affinity}`) : i18n.t("ui.affinity.unfocused");
}

function renderGuideCareList(i18n: I18n): string {
  const keys = [
    "guide.care.code",
    "guide.care.commit",
    "guide.care.diagnostics",
    "guide.care.refactor",
    "guide.care.testsDocs",
    "guide.care.returnIdle",
    "guide.care.idle",
  ];

  return `<ul class="guide-care-list">${keys.map((key) => `<li>${renderHtmlTemplate.escape(i18n.t(key))}</li>`).join("")}</ul>`;
}

export function renderPetPanelHtml(
  state: PetState,
  i18n: I18n,
  options: PetPanelRenderOptions,
): string {
  const mood = getMoodName(state);
  const sprite = getPetSpritePack(state, mood);
  const firstFrame = sprite.frames[0];
  if (!firstFrame) {
    throw new Error(
      `No frames available for evolution=${state.evolution} mood=${mood}`,
    );
  }

  const petName = renderHtmlTemplate.escape(state.name?.trim() || "Gitagotchi");
  const pet = renderSpriteHtml(
    firstFrame,
    "monster-sprite",
    "Gitagotchi monster sprite",
  );
  const status = renderHtmlTemplate.escape(renderStatusName(state.lifeStatus, i18n));
  const stage = renderHtmlTemplate.escape(renderStageName(state.stage, i18n));
  const lineage = renderHtmlTemplate.escape(renderLineageName(state.lineage, i18n));
  const affinity = renderHtmlTemplate.escape(renderAffinityName(state.affinity, i18n));
  const lineageTheme = getLineageTheme(state.lineage);
  const pattedTodayLabel = renderHtmlTemplate.escape(i18n.t("ui.pattedToday"));
  const patHeart = wasPattedToday(state, options.now ?? new Date())
    ? `<div class="pixel-heart" aria-label="${pattedTodayLabel}" title="${pattedTodayLabel}"><span class="heart-pixel heart-1"></span><span class="heart-pixel heart-2"></span><span class="heart-pixel heart-3"></span><span class="heart-pixel heart-4"></span><span class="heart-pixel heart-5"></span><span class="heart-pixel heart-6"></span><span class="heart-pixel heart-7"></span><span class="heart-pixel heart-8"></span><span class="heart-pixel heart-9"></span></div>`
    : "";
  const expPercent = Math.min(
    100,
    Math.round((state.exp / getRequiredExp(state.level)) * 100),
  );
  const fullness = 100 - state.hunger;
  const maxStyleScore = Math.max(100, ...Object.values(state.styleScores));
  const styleRows = (
    Object.entries(state.styleScores) as Array<
      [keyof typeof state.styleScores, number]
    >
  )
    .map(([key, value]) => {
      const percent = Math.min(100, Math.round((value / maxStyleScore) * 100));
      return `<div class="skill-node"><span>${i18n.t(`style.${key}`)}</span><strong>${value}</strong><i style="width:${percent}%"></i></div>`;
    })
    .join("");
  const actions = [
    { command: "pat", rune: "PT", label: i18n.t("ui.pat"), primary: state.lifeStatus !== "dead", disabled: state.lifeStatus === "dead" },
    { command: "commit", rune: "GC", label: i18n.t("ui.commit"), disabled: state.lifeStatus === "dead" },
    { command: "stats", rune: "ST", label: i18n.t("ui.viewStats") },
    { command: "skills", rune: "SK", label: i18n.t("ui.skills") },
    { command: "dex", rune: "DX", label: i18n.t("ui.dex") },
    { command: "revive", rune: "RV", label: i18n.t("ui.revive"), primary: state.lifeStatus === "dead", disabled: state.lifeStatus !== "dead" },
  ];
  const actionButtons = actions
    .map(
      (action) =>
        `<button class="action-btn${action.primary ? " action-primary" : ""}" data-command="${action.command}"${action.disabled ? " disabled" : ""}><span class="action-rune">${action.rune}</span><span class="action-label">${renderHtmlTemplate.escape(action.label)}</span></button>`,
    )
    .join("");

  const languageLabels: Record<string, string> = {
    en: "EN",
    ko: "KO",
    ja: "JA",
    zh: "ZH",
  };
  const langButtons = (["en", "ko", "ja", "zh"] as const)
    .map(
      (locale) =>
        `<button class="lang-btn ${locale === i18n.locale ? "active" : ""}" data-locale="${locale}" title="${locale.toUpperCase()}">${languageLabels[locale]}</button>`,
    )
    .join("");
  const helpLabel = renderHtmlTemplate.escape(i18n.t("ui.help"));
  const guideTitle = renderHtmlTemplate.escape(i18n.t("guide.title"));
  const guideGrowthTitle = renderHtmlTemplate.escape(i18n.t("guide.growthTitle"));
  const guideGrowthBody = renderHtmlTemplate.escape(i18n.t("guide.growthBody"));
  const guideCareTitle = renderHtmlTemplate.escape(i18n.t("guide.careTitle"));
  const guideCareIntro = renderHtmlTemplate.escape(i18n.t("guide.careIntro"));
  const guideCareList = renderGuideCareList(i18n);
  const guideUsageTitle = renderHtmlTemplate.escape(i18n.t("guide.usageTitle"));
  const guideUsageBody = renderHtmlTemplate.escape(i18n.t("guide.usageBody"));
  const guidePatTitle = renderHtmlTemplate.escape(i18n.t("guide.patTitle"));
  const guidePatBody = renderHtmlTemplate.escape(i18n.t("guide.patBody"));
  const guideReviveTitle = renderHtmlTemplate.escape(i18n.t("guide.reviveTitle"));
  const guideReviveBody = renderHtmlTemplate.escape(i18n.t("guide.reviveBody"));
  const guideClose = renderHtmlTemplate.escape(i18n.t("guide.close"));

  return `<!doctype html>
<html lang="${i18n.locale}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${options.cspSource}; style-src 'unsafe-inline' ${options.cspSource}; script-src 'nonce-${options.nonce}' ${options.cspSource};">
  <style>
    * { box-sizing: border-box; }
    body { color: var(--vscode-foreground); font-family: var(--vscode-font-family); margin: 0; padding: 20px; background: var(--vscode-editor-background); }
    .page-shell { width: min(920px, 100%); display: grid; gap: 12px; }
    .lang-bar { display: flex; justify-content: flex-end; gap: 6px; align-items: center; }
    .top-actions { display: flex; align-items: center; gap: 6px; }
    .lang-btn { min-width: 36px; min-height: 28px; padding: 4px 7px; font-family: var(--vscode-editor-font-family); font-size: 11px; font-weight: 800; line-height: 1; background: var(--vscode-editorWidget-background); color: var(--vscode-descriptionForeground); border: 1px solid var(--vscode-panel-border); border-radius: 4px; cursor: pointer; opacity: 0.74; transition: opacity .15s ease, color .15s ease, border-color .15s ease, background .15s ease; }
    .lang-btn:hover { opacity: 1; color: var(--vscode-foreground); border-color: var(--lineage-accent, var(--vscode-focusBorder)); }
    .lang-btn.active { opacity: 1; color: var(--vscode-foreground); border-color: var(--lineage-accent, var(--vscode-focusBorder)); background: color-mix(in srgb, var(--vscode-editorWidget-background) 74%, var(--lineage-accent, var(--vscode-focusBorder))); }
    .top-action-btn { min-width: 58px; min-height: 28px; height: 28px; padding: 4px 8px; border-radius: 4px; font-family: var(--vscode-editor-font-family); font-size: 11px; font-weight: 800; line-height: 1; color: var(--vscode-foreground); background: color-mix(in srgb, var(--vscode-editorWidget-background) 84%, var(--lineage-accent)); border: 1px solid color-mix(in srgb, var(--lineage-accent) 48%, var(--vscode-panel-border)); cursor: pointer; opacity: .82; }
    .top-action-btn:hover { opacity: 1; border-color: var(--lineage-accent); background: color-mix(in srgb, var(--vscode-editorWidget-background) 72%, var(--lineage-accent)); }
    .top-action-btn.danger { color: var(--vscode-errorForeground, var(--vscode-foreground)); border-color: color-mix(in srgb, var(--vscode-errorForeground, #f87171) 48%, var(--vscode-panel-border)); background: color-mix(in srgb, var(--vscode-editorWidget-background) 86%, var(--vscode-errorForeground, #f87171)); }
    .guide-btn { width: 28px; min-width: 28px; height: 28px; min-height: 28px; padding: 0; display: grid; place-items: center; border-radius: 999px; font-family: var(--vscode-editor-font-family); font-size: 13px; font-weight: 900; line-height: 1; color: var(--vscode-foreground); background: color-mix(in srgb, var(--vscode-editorWidget-background) 76%, var(--lineage-accent)); border: 1px solid color-mix(in srgb, var(--lineage-accent) 60%, var(--vscode-panel-border)); cursor: pointer; opacity: .86; }
    .guide-btn:hover { opacity: 1; border-color: var(--lineage-accent); background: color-mix(in srgb, var(--vscode-editorWidget-background) 64%, var(--lineage-accent)); }
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
    .pixel-heart { position: absolute; z-index: 2; right: 34px; top: 54px; display: grid; grid-template-columns: repeat(5, 5px); grid-template-rows: repeat(5, 5px); width: 25px; height: 25px; image-rendering: pixelated; filter: drop-shadow(0 0 7px rgba(251,113,133,.55)); animation: heart-float 1.6s ease-in-out infinite; pointer-events: none; }
    .heart-pixel { width: 5px; height: 5px; background: #fb7185; box-shadow: inset -1px -1px 0 rgba(159,18,57,.45); }
    .heart-1 { grid-column: 2; grid-row: 1; }
    .heart-2 { grid-column: 4; grid-row: 1; }
    .heart-3 { grid-column: 1; grid-row: 2; }
    .heart-4 { grid-column: 2; grid-row: 2; }
    .heart-5 { grid-column: 3; grid-row: 2; }
    .heart-6 { grid-column: 4; grid-row: 2; }
    .heart-7 { grid-column: 5; grid-row: 2; }
    .heart-8 { grid-column: 2 / span 3; grid-row: 3; width: 15px; }
    .heart-9 { grid-column: 3; grid-row: 4; }
    @keyframes heart-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
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
    .action-dock { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; padding-top: 2px; }
    button { min-height: 32px; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--vscode-button-border, transparent); color: var(--vscode-button-foreground); background: var(--vscode-button-background); font-size: 12px; white-space: nowrap; transition: transform .16s ease, background .16s ease, border-color .16s ease; }
    button:hover { background: var(--vscode-button-hoverBackground); }
    button:active { transform: translateY(1px) scale(.99); }
    button:disabled { cursor: not-allowed; opacity: .45; }
    button:disabled:hover { background: var(--vscode-button-background); }
    .action-btn { min-height: 44px; display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 7px; align-items: center; padding: 7px 8px; border-color: color-mix(in srgb, var(--lineage-accent) 48%, var(--vscode-panel-border)); background: linear-gradient(180deg, color-mix(in srgb, var(--vscode-editorWidget-background) 84%, var(--lineage-accent)), color-mix(in srgb, var(--vscode-sideBar-background) 88%, var(--lineage-accent))); color: var(--vscode-foreground); box-shadow: inset 0 1px 0 rgba(255,255,255,.07); }
    .action-btn:hover { border-color: var(--lineage-accent); background: color-mix(in srgb, var(--vscode-editorWidget-background) 74%, var(--lineage-accent)); }
    .action-btn.action-primary { border-color: var(--lineage-accent); background: linear-gradient(180deg, color-mix(in srgb, var(--lineage-accent) 38%, var(--vscode-editorWidget-background)), color-mix(in srgb, var(--vscode-sideBar-background) 72%, var(--lineage-accent))); }
    .action-rune { display: grid; place-items: center; width: 28px; height: 28px; border: 1px solid color-mix(in srgb, var(--lineage-soft) 60%, var(--vscode-panel-border)); border-radius: 4px; background: color-mix(in srgb, var(--vscode-editor-background) 76%, var(--lineage-soft)); font-family: var(--vscode-editor-font-family); font-size: 10px; font-weight: 800; letter-spacing: 0; }
    .action-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left; font-size: 12px; font-weight: 700; letter-spacing: 0; }
    .page-footer { width: min(920px, 100%); color: var(--vscode-descriptionForeground); font-size: 11px; text-align: right; }
    .guide-overlay[hidden] { display: none; }
    .guide-overlay { position: fixed; inset: 0; z-index: 20; display: grid; place-items: start center; padding: 58px 20px 20px; background: rgba(0,0,0,.32); }
    .guide-panel { width: min(520px, 100%); border: 1px solid color-mix(in srgb, var(--lineage-accent) 56%, var(--vscode-panel-border)); border-radius: 8px; background: var(--vscode-editorWidget-background); color: var(--vscode-foreground); box-shadow: 0 18px 48px rgba(0,0,0,.34), inset 0 1px 0 rgba(255,255,255,.06); overflow: hidden; }
    .guide-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 13px 14px; border-bottom: 1px solid var(--vscode-panel-border); background: color-mix(in srgb, var(--vscode-editorWidget-background) 80%, var(--lineage-accent)); }
    .guide-header h2 { margin: 0; font-size: 15px; line-height: 1.25; letter-spacing: 0; }
    .guide-close { width: 28px; min-width: 28px; height: 28px; min-height: 28px; padding: 0; border-radius: 999px; display: grid; place-items: center; font-size: 16px; line-height: 1; }
    .guide-body { display: grid; gap: 12px; padding: 14px; }
    .guide-section { display: grid; gap: 5px; padding-bottom: 11px; border-bottom: 1px solid color-mix(in srgb, var(--vscode-panel-border) 72%, transparent); }
    .guide-section:last-child { padding-bottom: 0; border-bottom: 0; }
    .guide-section h3 { margin: 0; color: var(--lineage-accent); font-size: 12px; line-height: 1.25; letter-spacing: 0; }
    .guide-section p { margin: 0; color: var(--vscode-descriptionForeground); font-size: 12px; line-height: 1.55; }
    .guide-care-list { margin: 2px 0 0; padding: 0; list-style: none; display: grid; gap: 5px; }
    .guide-care-list li { position: relative; padding: 6px 8px 6px 19px; border: 1px solid color-mix(in srgb, var(--vscode-panel-border) 72%, var(--lineage-accent)); border-radius: 6px; background: color-mix(in srgb, var(--vscode-editorWidget-background) 88%, var(--lineage-accent)); color: var(--vscode-foreground); font-size: 11px; line-height: 1.35; }
    .guide-care-list li::before { content: ""; position: absolute; left: 8px; top: 13px; width: 5px; height: 5px; border-radius: 50%; background: var(--lineage-accent); }
    @media (max-width: 680px) {
      .hud-shell { grid-template-columns: 1fr; }
      .stat-deck, .skill-matrix, .meta-strip, .action-dock { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .meta-strip div { border-right: 0; border-bottom: 1px solid var(--vscode-panel-border); }
      .page-footer { text-align: left; }
    }
  </style>
</head>
<body>
  <main class="page-shell" style="${lineageTheme}">
  <div class="lang-bar">${langButtons}<div class="top-actions"><button class="top-action-btn" data-command="rename" type="button">${renderHtmlTemplate.escape(i18n.t("ui.rename"))}</button><button class="top-action-btn danger" data-command="reset" type="button">${renderHtmlTemplate.escape(i18n.t("ui.reset"))}</button><button class="guide-btn" type="button" data-guide-open aria-label="${helpLabel}" title="${helpLabel}">?</button></div></div>
  <section id="guide-panel" class="guide-overlay" hidden aria-label="${guideTitle}">
    <div class="guide-panel" role="dialog" aria-modal="true" aria-labelledby="guide-title">
      <div class="guide-header">
        <h2 id="guide-title">${guideTitle}</h2>
        <button class="guide-close" type="button" data-guide-close aria-label="${guideClose}" title="${guideClose}">×</button>
      </div>
      <div class="guide-body">
        <section class="guide-section"><h3>${guideGrowthTitle}</h3><p>${guideGrowthBody}</p></section>
        <section class="guide-section"><h3>${guideCareTitle}</h3><p>${guideCareIntro}</p>${guideCareList}</section>
        <section class="guide-section"><h3>${guideUsageTitle}</h3><p>${guideUsageBody}</p></section>
        <section class="guide-section"><h3>${guidePatTitle}</h3><p>${guidePatBody}</p></section>
        <section class="guide-section"><h3>${guideReviveTitle}</h3><p>${guideReviveBody}</p></section>
      </div>
    </div>
  </section>
  <div class="hud-shell">
    <section class="monster-card">
      <div class="card-topline">
        <span class="card-lineage">${lineage}</span>
        <strong class="card-level">Lv.${state.level}</strong>
      </div>
      <div class="sprite-stage">${pet}${patHeart}</div>
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
    <section class="systems-card">
      <div class="topline"><strong class="level-badge">Lv.${state.level}</strong><div class="title-stack"><span>${renderHtmlTemplate.escape(i18n.t("ui.profile"))}</span><strong>${petName}</strong></div><span class="exp-readout">${state.exp}/${getRequiredExp(state.level)} ${i18n.t("ui.exp")}</span></div>
      <div class="expbar" aria-label="EXP"><span style="width:${expPercent}%"></span></div>
      <div class="stat-deck">
        <div class="stat-card ${meterClass(state.mood)}"><span class="label">${i18n.t("ui.mood")}</span><strong>${state.mood}%</strong><i style="width:${state.mood}%"></i></div>
        <div class="stat-card ${meterClass(fullness)}"><span class="label">${i18n.t("ui.fullness")}</span><strong>${fullness}%</strong><i style="width:${fullness}%"></i></div>
        <div class="stat-card ${meterClass(state.energy)}"><span class="label">${i18n.t("ui.energy")}</span><strong>${state.energy}%</strong><i style="width:${state.energy}%"></i></div>
        <div class="stat-card ${meterClass(state.health)}"><span class="label">${i18n.t("ui.health")}</span><strong>${state.health}%</strong><i style="width:${state.health}%"></i></div>
      </div>
      <div class="meta-strip">
        <div><span>${i18n.t("ui.status")}</span><strong>${status}</strong></div>
        <div><span>${i18n.t("ui.stage")}</span><strong>${stage}</strong></div>
        <div><span>${i18n.t("ui.lineage")}</span><strong>${lineage}</strong></div>
        <div><span>${i18n.t("ui.affinity")}</span><strong>${affinity}</strong></div>
      </div>
      <div class="skill-matrix">${styleRows}</div>
      <div class="action-dock">${actionButtons}</div>
    </section>
  </div>
  <footer class="page-footer">Copyright 2026 Hobby. All rights reserved.</footer>
  </main>
  <script nonce="${options.nonce}">
    const vscode = acquireVsCodeApi();
    document.querySelectorAll('button[data-command]').forEach((button) => {
      button.addEventListener('click', () => vscode.postMessage({ command: button.dataset.command }));
    });
    document.querySelectorAll('button[data-locale]').forEach((button) => {
      button.addEventListener('click', () => vscode.postMessage({ command: 'changeLanguage', locale: button.dataset.locale }));
    });
    const guidePanel = document.getElementById('guide-panel');
    const guideOpen = document.querySelector('[data-guide-open]');
    const guideCloseButtons = document.querySelectorAll('[data-guide-close]');
    guideOpen?.addEventListener('click', () => {
      guidePanel.hidden = false;
    });
    guideCloseButtons.forEach((button) => {
      button.addEventListener('click', () => {
        guidePanel.hidden = true;
      });
    });
    guidePanel?.addEventListener('click', (event) => {
      if (event.target === guidePanel) {
        guidePanel.hidden = true;
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && guidePanel && !guidePanel.hidden) {
        guidePanel.hidden = true;
      }
    });
  </script>
</body>
</html>`;
}
