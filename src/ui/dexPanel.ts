import * as vscode from 'vscode';
import { renderDexPanelHtml } from './dexPanelPresentation';
import { renderNonce } from './webviewSecurity';

export class GitagotchiDexPanel {
  private panel: vscode.WebviewPanel | undefined;

  show(): void {
    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel(
        'gitagotchi.dex',
        'Gitagotchi Dex',
        vscode.ViewColumn.Beside,
        {
          enableScripts: false
        }
      );
      this.panel.onDidDispose(() => {
        this.panel = undefined;
      });
    }

    const nonce = renderNonce();
    this.panel.webview.html = renderDexPanelHtml({
      cspSource: this.panel.webview.cspSource,
      nonce
    });
    this.panel.reveal(vscode.ViewColumn.Beside);
  }
}
