import { ActivityEvent } from './events';
import { resolveEvolution } from './evolutionEngine';
import { resolveMonsterIdentity } from './monsterIdentity';
import { clampStat, getLifeStatus, getRequiredExp, PetCounters, PetState, StyleScores } from './petState';
import { baseDiffRule } from './rules/baseDiffRule';
import { commitMessageRule } from './rules/commitMessageRule';
import { diagnosticsRule } from './rules/diagnosticsRule';
import { fileTypeBonusRule } from './rules/fileTypeBonusRule';
import { idleDecayRule } from './rules/idleDecayRule';
import { refactorRule } from './rules/refactorRule';
import { applySkillBonuses } from './skillEngine';
import { calculateStyleDelta, mergeStyleScores } from './styleScoring';
import { createActivityMessages } from '../messages/messageEngine';
import { createI18n, I18n } from '../i18n';

export type GrowthResult = {
  expDelta: number;
  moodDelta: number;
  hungerDelta: number;
  energyDelta: number;
  healthDelta: number;
  styleScoresDelta: Partial<StyleScores>;
  countersDelta: Partial<PetCounters>;
  reasons: string[];
  breakdown: import('./petState').GrowthBreakdownEntry[];
};

export type GrowthRule = {
  id: string;
  appliesTo(event: ActivityEvent, state: PetState): boolean;
  apply(event: ActivityEvent, state: PetState): GrowthResult;
};

export type GrowthEngine = {
  evaluate(event: ActivityEvent, state: PetState): GrowthResult;
};

export const emptyGrowthResult = (): GrowthResult => ({
  expDelta: 0,
  moodDelta: 0,
  hungerDelta: 0,
  energyDelta: 0,
  healthDelta: 0,
  styleScoresDelta: {},
  countersDelta: {},
  reasons: [],
  breakdown: []
});

export function mergeGrowthResults(results: GrowthResult[]): GrowthResult {
  return results.reduce<GrowthResult>((merged, result) => ({
    expDelta: merged.expDelta + result.expDelta,
    moodDelta: merged.moodDelta + result.moodDelta,
    hungerDelta: merged.hungerDelta + result.hungerDelta,
    energyDelta: merged.energyDelta + result.energyDelta,
    healthDelta: merged.healthDelta + result.healthDelta,
    styleScoresDelta: {
      builder: (merged.styleScoresDelta.builder ?? 0) + (result.styleScoresDelta.builder ?? 0),
      cleaner: (merged.styleScoresDelta.cleaner ?? 0) + (result.styleScoresDelta.cleaner ?? 0),
      debugger: (merged.styleScoresDelta.debugger ?? 0) + (result.styleScoresDelta.debugger ?? 0),
      scholar: (merged.styleScoresDelta.scholar ?? 0) + (result.styleScoresDelta.scholar ?? 0),
      streak: (merged.styleScoresDelta.streak ?? 0) + (result.styleScoresDelta.streak ?? 0)
    },
    countersDelta: {
      refactor: (merged.countersDelta.refactor ?? 0) + (result.countersDelta.refactor ?? 0),
      feature: (merged.countersDelta.feature ?? 0) + (result.countersDelta.feature ?? 0),
      debug: (merged.countersDelta.debug ?? 0) + (result.countersDelta.debug ?? 0)
    },
    reasons: [...merged.reasons, ...result.reasons],
    breakdown: [...merged.breakdown, ...result.breakdown]
  }), emptyGrowthResult());
}

export const defaultGrowthRules: GrowthRule[] = [
  baseDiffRule,
  refactorRule,
  fileTypeBonusRule,
  commitMessageRule,
  diagnosticsRule,
  idleDecayRule
];

export function createGrowthEngine(rules: GrowthRule[]): GrowthEngine {
  return {
    evaluate(event, state) {
      const activeResults = rules
        .filter((rule) => rule.appliesTo(event, state))
        .map((rule) => rule.apply(event, state));

      const base = mergeGrowthResults(activeResults);
      const styleScoresDelta = calculateStyleDelta(event);
      const skilledState = resolveMonsterIdentity({
        ...state,
        styleScores: mergeStyleScores(state.styleScores, styleScoresDelta)
      });
      const skillBonus = applySkillBonuses(event, skilledState, base);
      const merged = mergeGrowthResults([base, skillBonus]);

      return {
        ...merged,
        styleScoresDelta
      };
    }
  };
}

export function createDefaultGrowthEngine(): GrowthEngine {
  return createGrowthEngine(defaultGrowthRules);
}

export function applyActivity(
  state: PetState,
  event: ActivityEvent,
  engine: GrowthEngine = createDefaultGrowthEngine(),
  i18n: I18n = createI18n('en')
): PetState {
  if (state.lifeStatus === 'dead' && event.type !== 'idleTick') {
    return {
      ...state,
      logs: [{
        message: i18n.t('log.noGrowthDead'),
        expDelta: 0,
        occurredAt: event.occurredAt
      }, ...state.logs].slice(0, 20)
    };
  }

  const result = engine.evaluate(event, state);
  const previousSkills = state.skills;
  let level = state.level;
  let exp = state.exp + result.expDelta;

  while (exp >= getRequiredExp(level)) {
    exp -= getRequiredExp(level);
    level += 1;
  }

  const next = resolveEvolution({
    ...state,
    level,
    exp,
    hunger: clampStat(state.hunger + result.hungerDelta),
    mood: clampStat(state.mood + result.moodDelta),
    energy: clampStat(state.energy + result.energyDelta),
    health: clampStat(state.health + result.healthDelta),
    lastActiveAt: event.occurredAt,
    lastCommitHash: event.type === 'commit' ? event.hash : state.lastCommitHash,
    counters: {
      refactor: state.counters.refactor + (result.countersDelta.refactor ?? 0),
      feature: state.counters.feature + (result.countersDelta.feature ?? 0),
      debug: state.counters.debug + (result.countersDelta.debug ?? 0)
    },
    styleScores: mergeStyleScores(state.styleScores, result.styleScoresDelta),
    logs: [
      ...result.reasons.map((reason) => ({
        message: reason,
        expDelta: result.expDelta,
        occurredAt: event.occurredAt
      })),
      ...state.logs
    ].slice(0, 20)
  });

  const nextWithLife = {
    ...next,
    lifeStatus: getLifeStatus(next)
  };

  const resolved = resolveMonsterIdentity(resolveEvolution(nextWithLife));
  const unlockedSkills = resolved.skills.filter((skill) => !previousSkills.includes(skill));
  const messages = createActivityMessages({
    occurredAt: event.occurredAt,
    expDelta: result.expDelta,
    breakdown: result.breakdown,
    styleScoresDelta: result.styleScoresDelta,
    unlockedSkills
  }, i18n);

  return {
    ...resolved,
    logs: [
      {
        message: messages[0]?.text ?? `${result.expDelta >= 0 ? '+' : ''}${result.expDelta} EXP`,
        expDelta: result.expDelta,
        occurredAt: event.occurredAt,
        breakdown: result.breakdown,
        messages
      },
      ...state.logs
    ].slice(0, 20)
  };
}
