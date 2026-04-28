import * as vscode from 'vscode';
import { PetState } from '../core/petState';
import { createI18n, I18n } from '../i18n';
import { renderStatusBarText, renderStatusBarTooltip } from './statusBarPresentation';

export class GitagotchiStatusBar {
  private readonly item: vscode.StatusBarItem;

  constructor(private i18n: I18n = createI18n('en')) {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    this.item.command = 'gitagotchi.openPet';
    this.item.show();
  }

  update(state: PetState): void {
    this.item.text = renderStatusBarText(state);
    const tooltip = new vscode.MarkdownString(renderStatusBarTooltip(state, this.i18n));
    tooltip.supportThemeIcons = true;
    this.item.tooltip = tooltip;
  }

  setI18n(i18n: I18n): void {
    (this as unknown as Record<string, unknown>).i18n = i18n;
  }

  dispose(): void {
    this.item.dispose();
  }
}
