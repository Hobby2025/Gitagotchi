import { ActivityEvent } from './events';
import { GrowthResult } from './growthEngine';
import { PetState } from './petState';

export function applySkillBonuses(event: ActivityEvent, state: PetState, base: GrowthResult): GrowthResult {
  const result: GrowthResult = {
    expDelta: 0,
    moodDelta: 0,
    hungerDelta: 0,
    energyDelta: 0,
    healthDelta: 0,
    styleScoresDelta: {},
    countersDelta: {},
    reasons: [],
    breakdown: []
  };

  if (
    state.skills.includes('deepClean') &&
    event.type === 'diff' &&
    event.stats.deleted > event.stats.added
  ) {
    result.expDelta += 12;
    result.moodDelta += 2;
    result.reasons.push('Deep Clean skill');
    result.breakdown.push({ id: 'skill.deepClean', label: 'Deep Clean skill', expDelta: 12, moodDelta: 2 });
  }

  if (
    state.skills.includes('quickFix') &&
    event.type === 'diagnostics' &&
    event.previous > event.current
  ) {
    result.expDelta += 15;
    result.moodDelta += 3;
    result.reasons.push('Quick Fix skill');
    result.breakdown.push({ id: 'skill.quickFix', label: 'Quick Fix skill', expDelta: 15, moodDelta: 3 });
  }

  if (
    state.skills.includes('fieldGuide') &&
    event.type === 'diff' &&
    event.stats.touchedFiles.some((file) => /\.(md|mdx|txt)$/i.test(file) || /(^|[\\/])docs?([\\/]|$)/i.test(file))
  ) {
    result.expDelta += 8;
    result.healthDelta += 1;
    result.reasons.push('Field Guide skill');
    result.breakdown.push({ id: 'skill.fieldGuide', label: 'Field Guide skill', expDelta: 8, healthDelta: 1 });
  }

  if (state.skills.includes('focusFlow') && state.mood >= 80 && state.health >= 80 && base.expDelta > 0) {
    result.expDelta += 4;
    result.energyDelta += 1;
    result.reasons.push('Focus Flow skill');
    result.breakdown.push({ id: 'skill.focusFlow', label: 'Focus Flow skill', expDelta: 4, energyDelta: 1 });
  }

  if (state.skills.includes('commitRoar') && event.type === 'commit' && base.expDelta > 0) {
    result.expDelta += 10;
    result.reasons.push('Commit Roar skill');
    result.breakdown.push({ id: 'skill.commitRoar', label: 'Commit Roar skill', expDelta: 10 });
  }

  return result;
}
