import * as vscode from 'vscode';
import { getLeaderboardScore } from '../leaderboard/leaderboardModel';
import { LeaderboardDocument, LeaderboardStatus } from '../leaderboard/leaderboardTypes';
import { createI18n, I18n } from '../i18n';

export class GitagotchiLeaderboardPanel {
  private panel: vscode.WebviewPanel | undefined;

  constructor(private readonly i18n: I18n = createI18n('en')) {}

  show(status: LeaderboardStatus): void {
    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel(
        'gitagotchi.leaderboard',
        this.i18n.t('leaderboard.title'),
        vscode.ViewColumn.Beside,
        { enableScripts: false }
      );

      this.panel.onDidDispose(() => {
        this.panel = undefined;
      });
    }

    this.panel.webview.html = this.render(status);
    this.panel.reveal(vscode.ViewColumn.Beside);
  }

  private render(status: LeaderboardStatus): string {
    const body = status.kind === 'ready'
      ? this.renderDocument(status.document, status.lastSyncedAt, status.nextSyncAt)
      : `<p class="empty">${this.i18n.t(`leaderboard.${status.kind}`)}</p>`;

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' ${this.panel?.webview.cspSource};">
  <style>
    body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); padding: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border-bottom: 1px solid var(--vscode-panel-border); padding: 6px 4px; text-align: left; }
    .meta, .empty { color: var(--vscode-descriptionForeground); }
    .avatar { font-family: var(--vscode-editor-font-family); font-size: 12px; }
  </style>
</head>
<body>
  <h1>${this.i18n.t('leaderboard.title')}</h1>
  ${body}
</body>
</html>`;
  }

  private renderDocument(document: LeaderboardDocument, lastSyncedAt?: string, nextSyncAt?: string): string {
    const rows = document.players.map((player, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(player.displayName || player.githubLogin)}</td>
        <td>${player.level}</td>
        <td>${player.exp}</td>
        <td>${getLeaderboardScore(player)}</td>
        <td class="avatar">${escapeHtml(player.avatarKey)}</td>
      </tr>
    `).join('');

    return `
      <p class="meta">${this.i18n.t('leaderboard.lastSync')}: ${escapeHtml(lastSyncedAt ?? document.updatedAt)}</p>
      <p class="meta">${this.i18n.t('leaderboard.nextSync')}: ${escapeHtml(nextSyncAt ?? '-')}</p>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>${this.i18n.t('leaderboard.player')}</th>
            <th>${this.i18n.t('leaderboard.level')}</th>
            <th>${this.i18n.t('leaderboard.exp')}</th>
            <th>${this.i18n.t('leaderboard.score')}</th>
            <th>${this.i18n.t('leaderboard.avatar')}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
