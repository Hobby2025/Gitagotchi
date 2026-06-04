import { ActivityEvent } from './events';
import type { GrowthResult } from './growthEngine';
import {
  DailyQuestId,
  DailyQuestState,
  DecorationId,
  PetState,
  StyleScoreKey
} from './petState';

export type DailyQuestDefinition = {
  id: DailyQuestId;
  target: number;
  decoration: DecorationId;
  expReward: number;
  moodReward: number;
  getProgressDelta(event: ActivityEvent, state: PetState, growth: GrowthResult): number;
};

export type QuestApplyResult = {
  quest: DailyQuestState;
  reward: GrowthResult;
  unlockedDecoration?: DecorationId;
};

const questOrder: DailyQuestId[] = ['bugHunt', 'deepClean', 'fieldGuide', 'shipIt', 'balanceTraining'];
const styleOrder: StyleScoreKey[] = ['builder', 'cleaner', 'debugger', 'scholar', 'streak'];

function emptyQuestReward(): GrowthResult {
  return {
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
}

function hasDocsFile(event: ActivityEvent): boolean {
  return event.type === 'diff' &&
    event.stats.touchedFiles.some((file) => /\.(md|mdx|txt)$/i.test(file) || /(^|[\\/])docs?([\\/]|$)/i.test(file));
}

function getLowestStyleKey(state: PetState): StyleScoreKey {
  return styleOrder.reduce((lowest, key) => (
    state.styleScores[key] < state.styleScores[lowest] ? key : lowest
  ), styleOrder[0]);
}

export const dailyQuestDefinitions: Record<DailyQuestId, DailyQuestDefinition> = {
  bugHunt: {
    id: 'bugHunt',
    target: 3,
    decoration: 'bugLens',
    expReward: 35,
    moodReward: 6,
    getProgressDelta(event) {
      return event.type === 'diagnostics' ? Math.max(0, event.previous - event.current) : 0;
    }
  },
  deepClean: {
    id: 'deepClean',
    target: 1,
    decoration: 'tidyRibbon',
    expReward: 30,
    moodReward: 5,
    getProgressDelta(event) {
      return event.type === 'diff' && event.stats.deleted > event.stats.added ? 1 : 0;
    }
  },
  fieldGuide: {
    id: 'fieldGuide',
    target: 1,
    decoration: 'bookmarkCape',
    expReward: 28,
    moodReward: 5,
    getProgressDelta(event) {
      return hasDocsFile(event) ? 1 : 0;
    }
  },
  shipIt: {
    id: 'shipIt',
    target: 1,
    decoration: 'commitMedal',
    expReward: 32,
    moodReward: 5,
    getProgressDelta(event) {
      return event.type === 'commit' ? 1 : 0;
    }
  },
  balanceTraining: {
    id: 'balanceTraining',
    target: 1,
    decoration: 'balanceHalo',
    expReward: 40,
    moodReward: 7,
    getProgressDelta(event, state, growth) {
      if (event.type === 'idleTick') {
        return 0;
      }

      const lowest = getLowestStyleKey(state);
      return (growth.styleScoresDelta[lowest] ?? 0) > 0 ? 1 : 0;
    }
  }
};

export function getLocalDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDaySeed(dayKey: string): number {
  return Number(dayKey.replaceAll('-', '')) || 0;
}

function createDailyQuestState(dayKey: string): DailyQuestState {
  const offset = getDaySeed(dayKey) % questOrder.length;
  const offeredIds = [0, 1, 2].map((step) => questOrder[(offset + step) % questOrder.length]);

  return {
    dayKey,
    offeredIds,
    progress: 0
  };
}

export function resolveDailyQuest(state: PetState, now: Date = new Date()): DailyQuestState {
  const dayKey = getLocalDayKey(now);

  if (state.dailyQuest.dayKey === dayKey && state.dailyQuest.offeredIds.length > 0) {
    return state.dailyQuest;
  }

  return createDailyQuestState(dayKey);
}

export function selectDailyQuest(
  state: PetState,
  questId: DailyQuestId,
  now: Date = new Date()
): PetState {
  const quest = resolveDailyQuest(state, now);

  if (!quest.offeredIds.includes(questId) || quest.completedId || quest.progress > 0) {
    return {
      ...state,
      dailyQuest: quest
    };
  }

  return {
    ...state,
    dailyQuest: {
      ...quest,
      activeId: questId,
      progress: 0
    }
  };
}

export function applyDailyQuestProgress(
  state: PetState,
  event: ActivityEvent,
  growth: GrowthResult
): QuestApplyResult {
  const quest = resolveDailyQuest(state, new Date(event.occurredAt));
  const empty = emptyQuestReward();

  if (!quest.activeId || quest.completedId || state.lifeStatus === 'dead') {
    return { quest, reward: empty };
  }

  const definition = dailyQuestDefinitions[quest.activeId];
  const progress = Math.min(
    definition.target,
    quest.progress + definition.getProgressDelta(event, state, growth)
  );

  if (progress < definition.target) {
    return {
      quest: {
        ...quest,
        progress
      },
      reward: empty
    };
  }

  const reward: GrowthResult = {
    ...empty,
    expDelta: definition.expReward,
    moodDelta: definition.moodReward,
    reasons: [`Daily quest completed: ${definition.id}`],
    breakdown: [{
      id: `quest.${definition.id}`,
      label: `Daily quest: ${definition.id}`,
      expDelta: definition.expReward,
      moodDelta: definition.moodReward
    }]
  };

  return {
    quest: {
      ...quest,
      progress,
      completedId: definition.id
    },
    reward,
    unlockedDecoration: definition.decoration
  };
}
