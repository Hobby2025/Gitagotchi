import { getRequiredExp, PetState } from '../core/petState';
import { I18n } from '../i18n';

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

export function renderStatusBarText(state: PetState): string {
  const suffix = lifeLabels[state.lifeStatus] ? ` ${lifeLabels[state.lifeStatus]}` : '';
  return `${icons[state.evolution]} Lv.${state.level} ${state.exp}/${getRequiredExp(state.level)}${suffix}`;
}

export function renderStatusBarTooltip(state: PetState, i18n: I18n): string {
  const name = state.name?.trim() || 'Gitagotchi';
  return [
    `**${name} Lv.${state.level}**`,
    '',
    `${i18n.t('ui.stage')}: ${state.stage}`,
    `${i18n.t('ui.lineage')}: ${state.lineage ?? 'unbranched'}`,
    `${i18n.t('ui.affinity')}: ${state.affinity ?? 'unfocused'}`,
    '',
    `${i18n.t('ui.exp')}: ${state.exp}/${getRequiredExp(state.level)}`,
    `${i18n.t('ui.mood')}: ${state.mood}%`,
    `${i18n.t('ui.hunger')}: ${state.hunger}%`,
    `${i18n.t('ui.energy')}: ${state.energy}%`,
    `${i18n.t('ui.health')}: ${state.health}%`,
    '',
    'Click to open Gitagotchi.'
  ].join('\n');
}
