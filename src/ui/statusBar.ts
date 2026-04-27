import * as vscode from 'vscode';
import { getRequiredExp, PetState } from '../core/petState';
import { createI18n, I18n } from '../i18n';

const icons: Record<PetState['evolution'], string> = {
  egg: '$(circle-filled)',
  junior: '$(github-alt)',
  mid: '$(hubot)',
  senior: '$(mortar-board)',
  architect: '$(rocket)'
};

const lifeLabels: Record<PetState['lifeStatus'], string> = {
  alive: '',
  sleeping: 'Zzz',
  critical: '!',
  dead: 'RIP'
};

export class GitagotchiStatusBar {
  private readonly item: vscode.StatusBarItem;

  constructor(private readonly i18n: I18n = createI18n('en')) {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    this.item.command = 'gitagotchi.viewStats';
    this.item.tooltip = this.i18n.t('status.tooltip');
    this.item.show();
  }

  update(state: PetState): void {
    const suffix = lifeLabels[state.lifeStatus] ? ` ${lifeLabels[state.lifeStatus]}` : '';
    this.item.text = `${icons[state.evolution]} Lv.${state.level} ${state.exp}/${getRequiredExp(state.level)}${suffix}`;
  }

  dispose(): void {
    this.item.dispose();
  }
}
