import * as vscode from 'vscode';
import { PetState } from '../core/petState';
import { createI18n, I18n } from '../i18n';
import { renderSkillPanelHtml } from './skillPanelPresentation';

export class GitagotchiSkillPanel {
  private panel: vscode.WebviewPanel | undefined;
  private state: PetState | undefined;

  constructor(private i18n: I18n = createI18n('en')) {}

  setI18n(i18n: I18n): void {
    this.i18n = i18n;
    if (this.panel && this.state) {
      this.render();
    }
  }

  show(state: PetState): void {
    this.state = state;
    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel(
        'gitagotchi.skills',
        'Gitagotchi Skills',
        vscode.ViewColumn.Beside,
        { enableScripts: false }
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

    this.panel.webview.html = renderSkillPanelHtml(
      this.state,
      this.i18n,
      this.panel.webview.cspSource
    );
  }
}
