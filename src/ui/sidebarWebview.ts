import * as vscode from 'vscode';
import { getSpritePack } from '../character/evolutionSprites';
import { renderLittleJsCanvas } from '../character/littleJsRenderer';
import { PixelFrame } from '../character/spriteTypes';
import { getMoodName, getRequiredExp, PetState } from '../core/petState';
import { createI18n, I18n } from '../i18n';
import { renderNonce } from './webviewSecurity';

export class GitagotchiSidebarProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'gitagotchi.sidebar';

  private view: vscode.WebviewView | undefined;
  private state: PetState | undefined;

  constructor(
    private readonly i18n: I18n = createI18n('en'),
    private readonly extensionUri?: vscode.Uri
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    this.view.webview.options = {
      enableScripts: true,
      localResourceRoots: this.extensionUri
        ? [vscode.Uri.joinPath(this.extensionUri, 'resources', 'littlejs')]
        : []
    };

    this.view.webview.onDidReceiveMessage((message: { command?: string }) => {
      if (message.command === 'feed') {
        void vscode.commands.executeCommand('gitagotchi.feed');
      }
      if (message.command === 'commit') {
        void vscode.commands.executeCommand('gitagotchi.checkCommit');
      }
      if (message.command === 'stats') {
        void vscode.commands.executeCommand('gitagotchi.viewStats');
      }
      if (message.command === 'leaderboard') {
        void vscode.commands.executeCommand('gitagotchi.leaderboard');
      }
    });

    this.render();
  }

  update(state: PetState): void {
    this.state = state;
    this.render();
  }

  private render(): void {
    if (!this.view || !this.state) {
      return;
    }

    const state = this.state;
    const nonce = renderNonce();
    const mood = getMoodName(state);
    const sprite = getSpritePack(state.evolution, mood);
    const pet = this.renderPet(sprite.frames[0], nonce);
    const expPercent = Math.min(100, Math.round((state.exp / getRequiredExp(state.level)) * 100));
    const maxStyleScore = Math.max(100, ...Object.values(state.styleScores));
    const styleRows = (Object.entries(state.styleScores) as Array<[keyof typeof state.styleScores, number]>)
      .map(([key, value]) => {
        const percent = Math.min(100, Math.round((value / maxStyleScore) * 100));
        return `<div class="style-row"><div class="row"><span>${this.i18n.t(`style.${key}`)}</span><span>${value}</span></div><div class="style-bar"><span style="width:${percent}%"></span></div></div>`;
      })
      .join('');

    this.view.webview.html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${this.view.webview.cspSource}; style-src 'unsafe-inline' ${this.view.webview.cspSource}; script-src 'nonce-${nonce}' ${this.view.webview.cspSource};">
  <style>
    body { color: var(--vscode-foreground); font-family: var(--vscode-font-family); padding: 16px; }
    .pet-wrap { display: flex; justify-content: center; margin: 12px 0 18px; image-rendering: pixelated; }
    .pixel { width: 12px; height: 12px; }
    h2 { margin: 0 0 12px; font-size: 16px; text-align: center; }
    .row { display: flex; justify-content: space-between; margin: 8px 0; }
    .bar { height: 8px; background: var(--vscode-progressBar-background); border: 1px solid var(--vscode-panel-border); }
    .bar > span { display: block; height: 100%; background: var(--vscode-charts-green); }
    .style-row { margin: 8px 0; }
    .style-row .row { margin: 2px 0; font-size: 12px; text-transform: capitalize; }
    .style-bar { height: 6px; background: var(--vscode-editorWidget-background); border: 1px solid var(--vscode-panel-border); }
    .style-bar > span { display: block; height: 100%; background: var(--vscode-charts-blue); }
    .section-title { margin-top: 14px; font-size: 12px; text-transform: uppercase; color: var(--vscode-descriptionForeground); }
    button { width: 100%; margin-top: 8px; padding: 6px; }
  </style>
</head>
<body>
  <div class="pet-wrap">${pet}</div>
  <h2>Gitagotchi Lv.${state.level}</h2>
  <div class="bar" aria-label="EXP"><span style="width:${expPercent}%"></span></div>
  <div class="row"><span>${this.i18n.t('ui.exp')}</span><span>${state.exp}/${getRequiredExp(state.level)}</span></div>
  <div class="row"><span>${this.i18n.t('ui.mood')}</span><span>${state.mood}%</span></div>
  <div class="row"><span>${this.i18n.t('ui.hunger')}</span><span>${state.hunger}%</span></div>
  <div class="row"><span>${this.i18n.t('ui.energy')}</span><span>${state.energy}%</span></div>
  <div class="row"><span>${this.i18n.t('ui.health')}</span><span>${state.health}%</span></div>
  <div class="row"><span>${this.i18n.t('ui.status')}</span><span>${state.lifeStatus}</span></div>
  <div class="row"><span>${this.i18n.t('ui.species')}</span><span>${state.species}</span></div>
  <div class="row"><span>${this.i18n.t('ui.type')}</span><span>${state.archetype}</span></div>
  <div class="row"><span>${this.i18n.t('ui.skills')}</span><span>${state.skills.length}</span></div>
  <div class="section-title">${this.i18n.t('ui.styleScores')}</div>
  ${styleRows}
  <button data-command="feed">${this.i18n.t('ui.feed')}</button>
  <button data-command="commit">${this.i18n.t('ui.commit')}</button>
  <button data-command="stats">${this.i18n.t('ui.viewStats')}</button>
  <button data-command="leaderboard">${this.i18n.t('ui.leaderboard')}</button>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    document.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => vscode.postMessage({ command: button.dataset.command }));
    });
  </script>
</body>
</html>`;
  }

  private renderPet(frame: PixelFrame, nonce: string): string {
    if (!this.view || !this.extensionUri) {
      throw new Error('LittleJS rendering requires a VSCode webview and extension URI');
    }

    const littleJsUri = this.view.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'resources', 'littlejs', 'littlejs.esm.min.js')
    ).toString();
    const runtimeUri = this.view.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'resources', 'littlejs', 'gitagotchiLittleJsRuntime.js')
    ).toString();

    return renderLittleJsCanvas(frame, {
      littleJsUri,
      runtimeUri,
      pixelSize: 12,
      nonce
    });
  }
}
