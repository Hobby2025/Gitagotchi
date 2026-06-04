import { ActivityEvent } from './events';
import { clampStat, getRequiredExp, PetCounters, PetState, StyleScores } from './petState';
import { baseDiffRule } from './rules/baseDiffRule';
import { commitMessageRule } from './rules/commitMessageRule';
import { diagnosticsRule } from './rules/diagnosticsRule';
import { fileTypeBonusRule } from './rules/fileTypeBonusRule';
import { idleDecayRule } from './rules/idleDecayRule';
import { refactorRule } from './rules/refactorRule';
import { returnFromIdleRule } from './rules/returnFromIdleRule';
import { applySkillBonuses } from './skillEngine';
import { balanceStyleDelta, calculateStyleDelta, mergeStyleScores } from './styleScoring';
import { createActivityMessages } from '../messages/messageEngine';
import { createI18n, I18n } from '../i18n';
import { applyDailyQuestProgress, applyEndgameProgress, resolveDailyQuest } from '../domain/game/gameSystem';
import { getLifeStatus, resolveEvolution, resolveMonsterIdentity } from '../domain/pet/petSystem';

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
  returnFromIdleRule,
  idleDecayRule
];

export function createGrowthEngine(rules: GrowthRule[]): GrowthEngine {
  return {
    evaluate(event, state) {
      const activeResults = rules
        .filter((rule) => rule.appliesTo(event, state))
        .map((rule) => rule.apply(event, state));

      const base = mergeGrowthResults(activeResults);
      const styleScoresDelta = balanceStyleDelta(state.styleScores, calculateStyleDelta(event));
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

function getActivityFingerprint(event: ActivityEvent): string | undefined {
  if (event.type === 'diff') {
    const files = event.stats.touchedFiles
      .map((file) => file.toLowerCase())
      .sort()
      .join('|');
    return files ? `diff:${files}` : undefined;
  }

  if (event.type === 'commit') {
    return `commit:${event.message.trim().toLowerCase()}`;
  }

  if (event.type === 'diagnostics') {
    return `diagnostics:${event.previous > event.current ? 'down' : 'up'}:${Math.abs(event.previous - event.current)}`;
  }

  return undefined;
}

function updateRecentActivityFingerprints(state: PetState, event: ActivityEvent): string[] {
  const fingerprint = getActivityFingerprint(event);
  if (!fingerprint) {
    return state.endgame.recentActivityFingerprints;
  }

  return [
    fingerprint,
    ...state.endgame.recentActivityFingerprints.filter((item) => item !== fingerprint)
  ].slice(0, 8);
}

function applyRepeatRewardDampening(state: PetState, event: ActivityEvent, result: GrowthResult): GrowthResult {
  const fingerprint = getActivityFingerprint(event);
  if (!fingerprint || result.expDelta <= 0 || !state.endgame.recentActivityFingerprints.includes(fingerprint)) {
    return result;
  }

  const dampenedExp = Math.max(0, Math.floor(result.expDelta * 0.5));

  return {
    ...result,
    expDelta: dampenedExp,
    reasons: [...result.reasons, 'Repeated activity dampened'],
    breakdown: [
      ...result.breakdown,
      {
        id: 'antiAbuse.repeat',
        label: 'Repeated activity dampened',
        expDelta: dampenedExp - result.expDelta
      }
    ]
  };
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

  const baseResult = applyRepeatRewardDampening(state, event, engine.evaluate(event, state));
  const questResult = applyDailyQuestProgress(state, event, baseResult);
  const resultBeforeEndgame = mergeGrowthResults([baseResult, questResult.reward]);
  const stateBeforeEndgame = {
    ...state,
    dailyQuest: questResult.quest,
    decorations: questResult.unlockedDecoration && !state.decorations.includes(questResult.unlockedDecoration)
      ? [...state.decorations, questResult.unlockedDecoration]
      : state.decorations,
    endgame: {
      ...state.endgame,
      recentActivityFingerprints: updateRecentActivityFingerprints(state, event)
    }
  };
  const endgameResult = applyEndgameProgress(stateBeforeEndgame, event, resultBeforeEndgame);
  const result = mergeGrowthResults([resultBeforeEndgame, endgameResult.bonus]);
  const sourceState = endgameResult.state;
  const previousSkills = state.skills;
  let level = state.level;
  let exp = sourceState.exp + result.expDelta;

  while (exp >= getRequiredExp(level)) {
    exp -= getRequiredExp(level);
    level += 1;
  }

  const next = resolveEvolution({
    ...sourceState,
    level,
    exp,
    hunger: clampStat(sourceState.hunger + result.hungerDelta),
    mood: clampStat(sourceState.mood + result.moodDelta),
    energy: clampStat(sourceState.energy + result.energyDelta),
    health: clampStat(sourceState.health + result.healthDelta),
    lastActiveAt: event.occurredAt,
    lastCommitHash: event.type === 'commit' ? event.hash : sourceState.lastCommitHash,
    counters: {
      refactor: sourceState.counters.refactor + (result.countersDelta.refactor ?? 0),
      feature: sourceState.counters.feature + (result.countersDelta.feature ?? 0),
      debug: sourceState.counters.debug + (result.countersDelta.debug ?? 0)
    },
    styleScores: mergeStyleScores(sourceState.styleScores, result.styleScoresDelta),
    logs: [
      ...result.reasons.map((reason) => ({
        message: reason,
        expDelta: result.expDelta,
        occurredAt: event.occurredAt
      })),
      ...sourceState.logs
    ].slice(0, 20)
  });

  const nextWithLife = {
    ...next,
    lifeStatus: getLifeStatus(next)
  };

  const resolved = resolveMonsterIdentity(nextWithLife);
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
    dailyQuest: resolveDailyQuest(resolved, new Date(event.occurredAt)),
    logs: [
      {
        message: messages[0]?.text ?? `${result.expDelta >= 0 ? '+' : ''}${result.expDelta} EXP`,
        expDelta: result.expDelta,
        occurredAt: event.occurredAt,
        breakdown: result.breakdown,
        messages
      },
      ...sourceState.logs
    ].slice(0, 20)
  };
}
