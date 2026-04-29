import { ActivityEvent } from '../events';
import { GrowthResult, GrowthRule } from '../growthEngine';
import { PetState } from '../petState';

function isTestFile(path: string): boolean {
  return /(^|[\\/])(__tests__|tests?)([\\/]|$)/i.test(path) || /\.(test|spec)\.[cm]?[tj]sx?$/i.test(path);
}

function isReadme(path: string): boolean {
  return /(^|[\\/])readme(\.[a-z0-9]+)?$/i.test(path);
}

function isConfig(path: string): boolean {
  return /(^|[\\/])(\.?[a-z0-9-]+rc|package\.json|tsconfig\.json|vite\.config\.[tj]s|webpack\.config\.[tj]s)$/i.test(path);
}

export const fileTypeBonusRule: GrowthRule = {
  id: 'file-type-bonus',
  appliesTo(event: ActivityEvent): boolean {
    return event.type === 'diff' && event.stats.touchedFiles.length > 0;
  },
  apply(event: ActivityEvent, _state: PetState): GrowthResult {
    if (event.type !== 'diff') {
      throw new Error('fileTypeBonusRule only accepts diff events');
    }

    let expDelta = 0;
    const reasons: string[] = [];
    const breakdown = [];

    if (event.stats.touchedFiles.some(isTestFile)) {
      expDelta += 12;
      reasons.push('Test changes');
      breakdown.push({ id: 'file.test', label: 'Test changes', expDelta: 12, healthDelta: 1 });
    }

    if (event.stats.touchedFiles.some(isReadme)) {
      expDelta += 4;
      reasons.push('README changes');
      breakdown.push({ id: 'file.readme', label: 'README changes', expDelta: 4, energyDelta: 1, healthDelta: 1 });
    }

    if (event.stats.touchedFiles.some(isConfig)) {
      expDelta += 2;
      reasons.push('Config changes');
      breakdown.push({ id: 'file.config', label: 'Config changes', expDelta: 2 });
    }

    return {
      expDelta,
      moodDelta: 0,
      hungerDelta: 0,
      energyDelta: event.stats.touchedFiles.some(isReadme) ? 1 : 0,
      healthDelta: (event.stats.touchedFiles.some(isTestFile) ? 1 : 0) + (event.stats.touchedFiles.some(isReadme) ? 1 : 0),
      styleScoresDelta: {},
      countersDelta: {},
      reasons,
      breakdown
    };
  }
};
