import * as vscode from 'vscode';
import { createPetDexEntries } from '../character/petDex';
import { PetState } from '../core/petState';
import { renderDexPanelHtml } from './dexPanelPresentation';
import { renderNonce } from './webviewSecurity';

export class GitagotchiDexPanel {
  private panel: vscode.WebviewPanel | undefined;
  private state: PetState | undefined;

  show(state: PetState): void {
    this.state = state;
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

    this.render();
    this.panel.reveal(vscode.ViewColumn.Beside);
  }

  update(state: PetState): void {
    this.state = state;
    if (this.panel) {
      this.render();
    }
  }

  private render(): void {
    if (!this.panel || !this.state) {
      return;
    }

    const nonce = renderNonce();
    this.panel.webview.html = renderDexPanelHtml({
      cspSource: this.panel.webview.cspSource,
      nonce,
      entries: createPetDexEntries({ state: this.state })
    });
  }
}
