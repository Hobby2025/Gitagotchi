import * as vscode from 'vscode';
import { createPetDexEntries } from '../character/petDex';
import { PetState } from '../core/petState';
import { createI18n, I18n } from '../i18n';
import { renderDexPanelHtml } from './dexPanelPresentation';
import { renderNonce } from './webviewSecurity';

export class GitagotchiDexPanel {
  private panel: vscode.WebviewPanel | undefined;
  private state: PetState | undefined;

  constructor(private i18n: I18n = createI18n('en')) {}

  setI18n(i18n: I18n): void {
    this.i18n = i18n;
    if (this.panel) {
      this.panel.title = this.i18n.t('dex.title');
    }
    if (this.panel && this.state) {
      this.render();
    }
  }

  show(state: PetState): void {
    this.state = state;
    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel(
        'gitagotchi.dex',
        this.i18n.t('dex.title'),
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
      i18n: this.i18n,
      entries: createPetDexEntries({ state: this.state })
    });
  }
}
