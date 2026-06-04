import * as vscode from 'vscode';
import { PetState } from '../core/petState';
import { createI18n, I18n } from '../i18n';
import { renderPetPanelHtml } from './petPanelPresentation';
import { renderNonce } from './webviewSecurity';

export class GitagotchiPetPanel {
  private panel: vscode.WebviewPanel | undefined;
  private state: PetState | undefined;

  constructor(
    private i18n: I18n = createI18n('en'),
    private readonly extensionUri: vscode.Uri
  ) {}

  show(state: PetState): void {
    this.state = state;
    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel(
        'gitagotchi.pet',
        'Gitagotchi',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true
        }
      );

      this.panel.webview.onDidReceiveMessage((message: { command?: string; locale?: string; questId?: string; classId?: string; bossId?: string; starNodeId?: string; decorationId?: string }) => {
        if (message.command === 'pat') {
          void vscode.commands.executeCommand('gitagotchi.patPet');
        }
        if (message.command === 'commit') {
          void vscode.commands.executeCommand('gitagotchi.checkCommit');
        }
        if (message.command === 'stats') {
          void vscode.commands.executeCommand('gitagotchi.viewStats');
        }
        if (message.command === 'skills') {
          void vscode.commands.executeCommand('gitagotchi.viewSkills');
        }
        if (message.command === 'dex') {
          void vscode.commands.executeCommand('gitagotchi.openDex');
        }
        if (message.command === 'rename') {
          void vscode.commands.executeCommand('gitagotchi.renamePet');
        }
        if (message.command === 'reset') {
          void vscode.commands.executeCommand('gitagotchi.resetPet');
        }
        if (message.command === 'revive') {
          void vscode.commands.executeCommand('gitagotchi.revivePet');
        }
        if (message.command === 'selectQuest' && message.questId) {
          void vscode.commands.executeCommand('gitagotchi.selectQuest', message.questId);
        }
        if (message.command === 'selectClass' && message.classId) {
          void vscode.commands.executeCommand('gitagotchi.selectClass', message.classId);
        }
        if (message.command === 'startRaid' && message.bossId) {
          void vscode.commands.executeCommand('gitagotchi.startRaid', message.bossId);
        }
        if (message.command === 'craftStarShard') {
          void vscode.commands.executeCommand('gitagotchi.craftStarShard');
        }
        if (message.command === 'investStar' && message.starNodeId) {
          void vscode.commands.executeCommand('gitagotchi.investStar', message.starNodeId);
        }
        if (message.command === 'toggleDecoration' && message.decorationId) {
          void vscode.commands.executeCommand('gitagotchi.toggleDecoration', message.decorationId);
        }
        if (message.command === 'copyReview') {
          void vscode.commands.executeCommand('gitagotchi.copyWeeklyReview');
        }
        if (message.command === 'reincarnate') {
          void vscode.commands.executeCommand('gitagotchi.reincarnatePet');
        }
        if (message.command === 'changeLanguage' && message.locale) {
          void vscode.commands.executeCommand('gitagotchi.changeLanguage', message.locale);
        }
      });
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

  setI18n(i18n: I18n): void {
    (this as unknown as Record<string, unknown>).i18n = i18n;
    if (this.panel && this.state) {
      this.render();
    }
  }

  private render(): void {
    if (!this.panel || !this.state) {
      return;
    }

    const nonce = renderNonce();
    this.panel.webview.html = renderPetPanelHtml(this.state, this.i18n, {
      cspSource: this.panel.webview.cspSource,
      nonce
    });
  }
}
