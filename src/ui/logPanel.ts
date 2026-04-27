import * as vscode from 'vscode';
import { PetState } from '../core/petState';
import { createI18n, I18n } from '../i18n';
import { renderHtmlTemplate } from './webviewSecurity';

export class GitagotchiLogPanel {
  private panel: vscode.WebviewPanel | undefined;

  constructor(private readonly i18n: I18n = createI18n('en')) {}

  show(state: PetState): void {
    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel(
        'gitagotchi.logs',
        'Gitagotchi Logs',
        vscode.ViewColumn.Beside,
        { enableScripts: false }
      );

      this.panel.onDidDispose(() => {
        this.panel = undefined;
      });
    }

    this.panel.webview.html = this.render(state);
    this.panel.reveal(vscode.ViewColumn.Beside);
  }

  private render(state: PetState): string {
    const logs = state.logs.length > 0
      ? state.logs.map((log) => {
        const messages = log.messages?.length
          ? `<div class="messages">${log.messages.map((message) => `<span class="message ${message.kind}">${renderHtmlTemplate.escape(message.text)}</span>`).join('')}</div>`
          : '';
        const breakdown = log.breakdown?.length
          ? `<ul class="breakdown">${log.breakdown.map((entry) => `<li><span>${this.i18n.t(`breakdown.${entry.id}`)}</span><strong>${entry.expDelta ? `${entry.expDelta > 0 ? '+' : ''}${entry.expDelta} EXP` : ''}</strong></li>`).join('')}</ul>`
          : '';

        return `<li class="log-entry"><strong>${log.expDelta >= 0 ? '+' : ''}${log.expDelta} EXP</strong> ${renderHtmlTemplate.escape(log.message)}${messages}${breakdown}</li>`;
      }).join('')
      : `<li>${this.i18n.t('ui.noActivity')}</li>`;

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' ${this.panel?.webview.cspSource};">
  <style>
    body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); padding: 16px; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
    .log-entry { margin-bottom: 16px; }
    .messages { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0; }
    .message { border: 1px solid var(--vscode-panel-border); padding: 2px 6px; border-radius: 4px; font-size: 12px; }
    .reward { color: var(--vscode-charts-green); }
    .style { color: var(--vscode-charts-blue); }
    .unlock { color: var(--vscode-charts-yellow); }
    .breakdown { list-style: none; padding: 0; margin: 8px 0 0; }
    .breakdown li { display: flex; justify-content: space-between; gap: 12px; margin: 4px 0; }
  </style>
</head>
<body>
  <h1>${this.i18n.t('ui.logsTitle')}</h1>
  <ul>${logs}</ul>
</body>
</html>`;
  }
}
