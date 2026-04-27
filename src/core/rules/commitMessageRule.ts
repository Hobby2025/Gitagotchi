import { ActivityEvent } from '../events';
import { GrowthResult, GrowthRule } from '../growthEngine';
import { PetState } from '../petState';

const bonuses: Array<[RegExp, number, string]> = [
  [/\bhotfix\b/i, 20, 'Hotfix commit'],
  [/\brefactor\b/i, 15, 'Refactor commit'],
  [/\bfeat\b/i, 10, 'Feature commit'],
  [/\bfix\b/i, 5, 'Fix commit']
];

export const commitMessageRule: GrowthRule = {
  id: 'commit-message',
  appliesTo(event: ActivityEvent): boolean {
    return event.type === 'commit';
  },
  apply(event: ActivityEvent, _state: PetState): GrowthResult {
    if (event.type !== 'commit') {
      throw new Error('commitMessageRule only accepts commit events');
    }

    const matched = bonuses.find(([pattern]) => pattern.test(event.message));
    const bonus = matched?.[1] ?? 0;
    const reason = matched?.[2] ?? 'Commit completed';

    return {
      expDelta: 20 + bonus,
      moodDelta: 5,
      hungerDelta: -3,
      energyDelta: -2,
      healthDelta: 2,
      styleScoresDelta: {},
      countersDelta: {
        feature: /\bfeat\b/i.test(event.message) ? 1 : 0,
        refactor: /\brefactor\b/i.test(event.message) ? 1 : 0,
        debug: /\b(fix|hotfix)\b/i.test(event.message) ? 1 : 0
      },
      reasons: [reason],
      breakdown: [{ id: 'commit-message', label: reason, expDelta: 20 + bonus, moodDelta: 5, healthDelta: 2 }]
    };
  }
};
