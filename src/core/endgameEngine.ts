import { ActivityEvent } from './events';
import type { GrowthResult } from './growthEngine';
import {
  ClassQuestState,
  clampStat,
  ComboId,
  DecorationId,
  EndgameState,
  getLifeStatus,
  PetClassId,
  PetState,
  RaidBossId,
  StarTreeNodeId,
  StyleScoreKey
} from './petState';
import { resolveEvolution } from './evolutionEngine';
import { resolveMonsterIdentity } from './monsterIdentity';

export type RaidBossDefinition = {
  id: RaidBossId;
  maxHp: number;
  decoration: DecorationId;
  weaknessKey: string;
  preferredClassId: PetClassId;
  seasonLimited?: boolean;
  getDamage(event: ActivityEvent, state: PetState, growth: GrowthResult): number;
};

export type PetClassDefinition = {
  id: PetClassId;
  preferredStyle: StyleScoreKey;
  titleKey: string;
};

export type ClassQuestDefinition = {
  classId: PetClassId;
  target: number;
  decoration: DecorationId;
  expReward: number;
  moodReward: number;
  titleKey: string;
  bodyKey: string;
  getProgressDelta(event: ActivityEvent, state: PetState, growth: GrowthResult): number;
};

export type EndgameApplyResult = {
  state: PetState;
  bonus: GrowthResult;
};

export type ReincarnationResult =
  | { reincarnated: true; state: PetState; starsGained: number }
  | { reincarnated: false; reason: 'notReady' | 'dead' };

const styleOrder: StyleScoreKey[] = ['builder', 'cleaner', 'debugger', 'scholar', 'streak'];
export const classChangeCost = 120;
const projectDailyExpCap = 420;
export const seasonMilestones = [100, 250, 500];
export const starTreeNodeDefinitions: Record<StarTreeNodeId, { maxRank: number; titleKey: string }> = {
  raidMight: { maxRank: 5, titleKey: 'starTree.raidMight' },
  steadyCare: { maxRank: 5, titleKey: 'starTree.steadyCare' },
  seasonMemory: { maxRank: 5, titleKey: 'starTree.seasonMemory' }
};

export const petClassDefinitions: Record<PetClassId, PetClassDefinition> = {
  releaseMaster: { id: 'releaseMaster', preferredStyle: 'builder', titleKey: 'class.releaseMaster' },
  codeGardener: { id: 'codeGardener', preferredStyle: 'cleaner', titleKey: 'class.codeGardener' },
  bugTracker: { id: 'bugTracker', preferredStyle: 'debugger', titleKey: 'class.bugTracker' },
  archivist: { id: 'archivist', preferredStyle: 'scholar', titleKey: 'class.archivist' },
  balanceArchitect: { id: 'balanceArchitect', preferredStyle: 'streak', titleKey: 'class.balanceArchitect' }
};

export const classQuestDefinitions: Record<PetClassId, ClassQuestDefinition> = {
  releaseMaster: {
    classId: 'releaseMaster',
    target: 1,
    decoration: 'releaseEmblem',
    expReward: 34,
    moodReward: 5,
    titleKey: 'classQuest.releaseMaster.title',
    bodyKey: 'classQuest.releaseMaster.body',
    getProgressDelta(event) {
      if (event.type === 'commit') {
        return 1;
      }
      return hasFile(event, /(\.test\.|\.spec\.|[\\/]tests?[\\/])/i) ? 1 : 0;
    }
  },
  codeGardener: {
    classId: 'codeGardener',
    target: 1,
    decoration: 'gardenEmblem',
    expReward: 32,
    moodReward: 5,
    titleKey: 'classQuest.codeGardener.title',
    bodyKey: 'classQuest.codeGardener.body',
    getProgressDelta(event) {
      return event.type === 'diff' && event.stats.deleted > event.stats.added ? 1 : 0;
    }
  },
  bugTracker: {
    classId: 'bugTracker',
    target: 2,
    decoration: 'trackerEmblem',
    expReward: 36,
    moodReward: 6,
    titleKey: 'classQuest.bugTracker.title',
    bodyKey: 'classQuest.bugTracker.body',
    getProgressDelta(event) {
      return event.type === 'diagnostics' ? Math.max(0, event.previous - event.current) : 0;
    }
  },
  archivist: {
    classId: 'archivist',
    target: 1,
    decoration: 'archiveEmblem',
    expReward: 32,
    moodReward: 5,
    titleKey: 'classQuest.archivist.title',
    bodyKey: 'classQuest.archivist.body',
    getProgressDelta(event) {
      return hasFile(event, /\.(md|mdx|txt)$/i) ? 1 : 0;
    }
  },
  balanceArchitect: {
    classId: 'balanceArchitect',
    target: 1,
    decoration: 'balanceEmblem',
    expReward: 38,
    moodReward: 6,
    titleKey: 'classQuest.balanceArchitect.title',
    bodyKey: 'classQuest.balanceArchitect.body',
    getProgressDelta(_event, state, growth) {
      const lowest = styleOrder.reduce((current, key) => (
        state.styleScores[key] < state.styleScores[current] ? key : current
      ), styleOrder[0]);
      return (growth.styleScoresDelta[lowest] ?? 0) > 0 ? 1 : 0;
    }
  }
};

function emptyBonus(): GrowthResult {
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

function hasFile(event: ActivityEvent, pattern: RegExp): boolean {
  return event.type === 'diff' && event.stats.touchedFiles.some((file) => pattern.test(file));
}

export const raidBossDefinitions: Record<RaidBossId, RaidBossDefinition> = {
  legacyDragon: {
    id: 'legacyDragon',
    maxHp: 240,
    decoration: 'legacyCrown',
    weaknessKey: 'raid.legacyDragon.weakness',
    preferredClassId: 'codeGardener',
    getDamage(event, state, growth) {
      const refactorDamage = event.type === 'diff' && event.stats.deleted > event.stats.added ? 42 : 0;
      return Math.max(0, Math.floor(growth.expDelta / 5) + refactorDamage + Math.floor(state.styleScores.cleaner / 40));
    }
  },
  bugLord: {
    id: 'bugLord',
    maxHp: 220,
    decoration: 'debugCrown',
    weaknessKey: 'raid.bugLord.weakness',
    preferredClassId: 'bugTracker',
    getDamage(event, state, growth) {
      const resolved = event.type === 'diagnostics' ? Math.max(0, event.previous - event.current) : 0;
      return Math.max(0, Math.floor(growth.expDelta / 6) + resolved * 28 + Math.floor(state.styleScores.debugger / 40));
    }
  },
  releaseGolem: {
    id: 'releaseGolem',
    maxHp: 260,
    decoration: 'releaseBanner',
    weaknessKey: 'raid.releaseGolem.weakness',
    preferredClassId: 'releaseMaster',
    getDamage(event, state, growth) {
      const commitDamage = event.type === 'commit' ? 60 : 0;
      const testDamage = hasFile(event, /(\.test\.|\.spec\.|[\\/]tests?[\\/])/i) ? 24 : 0;
      return Math.max(0, Math.floor(growth.expDelta / 5) + commitDamage + testDamage + Math.floor(state.styleScores.builder / 40));
    }
  },
  dependencyWraith: {
    id: 'dependencyWraith',
    maxHp: 210,
    decoration: 'dependencyCharm',
    weaknessKey: 'raid.dependencyWraith.weakness',
    preferredClassId: 'balanceArchitect',
    getDamage(event, state, growth) {
      const configDamage = hasFile(event, /(package-lock\.json|package\.json|tsconfig\.json|vitest\.config|\.ya?ml|\.json)$/i) ? 52 : 0;
      return Math.max(0, Math.floor(growth.expDelta / 5) + configDamage + Math.floor(state.styleScores.streak / 45));
    }
  },
  breakpointHydra: {
    id: 'breakpointHydra',
    maxHp: 320,
    decoration: 'breakpointCrown',
    weaknessKey: 'raid.breakpointHydra.weakness',
    preferredClassId: 'archivist',
    seasonLimited: true,
    getDamage(event, state, growth) {
      const docsDamage = hasFile(event, /\.(md|mdx|txt)$/i) ? 30 : 0;
      const testDamage = hasFile(event, /(\.test\.|\.spec\.|[\\/]tests?[\\/])/i) ? 30 : 0;
      return Math.max(0, Math.floor(growth.expDelta / 4) + docsDamage + testDamage + Math.floor(state.endgame.season.progress / 80));
    }
  }
};

function getDominantStyle(state: PetState): StyleScoreKey {
  return styleOrder.reduce((best, key) => (
    state.styleScores[key] > state.styleScores[best] ? key : best
  ), styleOrder[0]);
}

function getWeekKey(date: Date): string {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const elapsedDays = Math.floor((date.getTime() - firstDay.getTime()) / 86400000);
  const week = Math.floor((elapsedDays + firstDay.getDay()) / 7) + 1;

  return `${date.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function getDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getEventToken(event: ActivityEvent): string {
  if (event.type === 'diagnostics' && event.previous > event.current) {
    return 'diagnosticsDown';
  }
  if (event.type === 'commit') {
    return 'commit';
  }
  if (event.type === 'diff' && event.stats.deleted > event.stats.added) {
    return 'cleanupDiff';
  }
  if (event.type === 'diff' && hasFile(event, /\.(md|mdx|txt)$/i)) {
    return 'docsDiff';
  }
  if (event.type === 'diff' && hasFile(event, /(\.test\.|\.spec\.|[\\/]tests?[\\/])/i)) {
    return 'testDiff';
  }
  if (event.type === 'diff') {
    return 'codeDiff';
  }
  return event.type;
}

function resolveCombo(history: string[]): ComboId | undefined {
  const recent = history.slice(-3).join('>');

  if (recent.includes('testDiff>diagnosticsDown>commit')) {
    return 'stabilizer';
  }
  if (recent.includes('cleanupDiff>docsDiff>commit')) {
    return 'cleanupComplete';
  }
  if (recent.includes('docsDiff>codeDiff>commit')) {
    return 'specDriven';
  }

  return undefined;
}

function applyClassBonus(state: PetState, growth: GrowthResult): GrowthResult {
  const classId = state.endgame.classId;
  if (!classId) {
    return emptyBonus();
  }

  const preferredStyle = petClassDefinitions[classId].preferredStyle;
  if ((growth.styleScoresDelta[preferredStyle] ?? 0) <= 0 || growth.expDelta <= 0) {
    return emptyBonus();
  }
  const classLevel = state.endgame.classLevels[classId] ?? 0;

  return {
    ...emptyBonus(),
    expDelta: 6 + state.endgame.stars + classLevel,
    moodDelta: 1,
    reasons: [`Class focus: ${classId}`],
    breakdown: [{
      id: `class.${classId}`,
      label: `Class focus: ${classId}`,
      expDelta: 6 + state.endgame.stars + classLevel,
      moodDelta: 1
    }]
  };
}

function getProjectKey(event: ActivityEvent): string {
  return event.projectKey?.trim() || 'workspace';
}

function getProjectLabel(event: ActivityEvent): string {
  return event.projectLabel?.trim() || getProjectKey(event);
}

function resolveClassQuestState(
  classQuest: ClassQuestState,
  classId: PetClassId | undefined,
  event: ActivityEvent
): ClassQuestState {
  const dayKey = getDayKey(new Date(event.occurredAt));
  if (!classId) {
    return { dayKey, progress: 0 };
  }
  if (classQuest.dayKey === dayKey && classQuest.classId === classId) {
    return classQuest;
  }

  return {
    dayKey,
    classId,
    progress: 0
  };
}

function applyClassQuestProgress(
  state: PetState,
  event: ActivityEvent,
  growth: GrowthResult,
  decorations: DecorationId[]
): { classQuest: ClassQuestState; decorations: DecorationId[]; bonus: GrowthResult } {
  const classId = state.endgame.classId;
  const classQuest = resolveClassQuestState(state.endgame.classQuest, classId, event);
  if (!classId || classQuest.completedClassId || state.lifeStatus === 'dead') {
    return { classQuest, decorations, bonus: emptyBonus() };
  }

  const definition = classQuestDefinitions[classId];
  const progress = Math.min(
    definition.target,
    classQuest.progress + definition.getProgressDelta(event, state, growth)
  );
  const nextClassQuest = {
    ...classQuest,
    progress
  };

  if (progress < definition.target) {
    return { classQuest: nextClassQuest, decorations, bonus: emptyBonus() };
  }

  return {
    classQuest: {
      ...nextClassQuest,
      completedClassId: classId
    },
    decorations: decorations.includes(definition.decoration)
      ? decorations
      : [...decorations, definition.decoration],
    bonus: {
      ...emptyBonus(),
      expDelta: definition.expReward,
      moodDelta: definition.moodReward,
      reasons: [`Class quest completed: ${classId}`],
      breakdown: [{
        id: `classQuest.${classId}`,
        label: `Class quest completed: ${classId}`,
        expDelta: definition.expReward,
        moodDelta: definition.moodReward
      }]
    }
  };
}

function getProjectDayExp(state: PetState, event: ActivityEvent): number {
  const key = getProjectKey(event);
  const current = state.endgame.projectProfiles[key];
  if (!current) {
    return 0;
  }
  const dayKey = getDayKey(new Date(event.occurredAt));

  return current.dayKey === dayKey
    ? current.dailyExp ?? 0
    : 0;
}

function applyProjectDailyCap(state: PetState, event: ActivityEvent, result: GrowthResult): GrowthResult {
  if (result.expDelta <= 0) {
    return result;
  }

  const remaining = projectDailyExpCap - getProjectDayExp(state, event);
  if (remaining >= result.expDelta) {
    return result;
  }

  const cappedExp = Math.max(0, remaining);
  return {
    ...result,
    expDelta: cappedExp,
    reasons: [...result.reasons, 'Project daily reward cap'],
    breakdown: [
      ...result.breakdown,
      {
        id: 'antiAbuse.projectCap',
        label: 'Project daily reward cap',
        expDelta: cappedExp - result.expDelta
      }
    ]
  };
}

function updateProjectProfile(
  state: PetState,
  event: ActivityEvent,
  expDelta: number,
  raidsCleared: number
): EndgameState['projectProfiles'] {
  const key = getProjectKey(event);
  const dayKey = getDayKey(new Date(event.occurredAt));
  const current = state.endgame.projectProfiles[key] ?? {
    key,
    label: getProjectLabel(event),
    exp: 0,
    dayKey,
    dailyExp: 0,
    raidsCleared: 0,
    lastActiveAt: event.occurredAt
  };
  const positiveExp = Math.max(0, expDelta);
  const dailyExp = current.dayKey === dayKey
    ? (current.dailyExp ?? 0) + positiveExp
    : positiveExp;

  return {
    ...state.endgame.projectProfiles,
    [key]: {
      ...current,
      label: getProjectLabel(event),
      exp: current.exp + positiveExp,
      dayKey,
      dailyExp,
      raidsCleared: current.raidsCleared + raidsCleared,
      lastActiveAt: event.occurredAt
    }
  };
}

function applySeasonMilestones(
  seasonProgress: number,
  claimedMilestones: number[],
  decorations: DecorationId[]
): { claimedMilestones: number[]; decorations: DecorationId[]; bonus: GrowthResult } {
  const nextClaimed = [...claimedMilestones];
  let nextDecorations = decorations;
  const bonus = emptyBonus();

  for (const milestone of seasonMilestones) {
    if (seasonProgress < milestone || nextClaimed.includes(milestone)) {
      continue;
    }

    nextClaimed.push(milestone);
    bonus.reasons.push(`Season milestone: ${milestone}`);
    bonus.breakdown.push({
      id: `season.milestone.${milestone}`,
      label: `Season milestone: ${milestone}`,
      expDelta: milestone === 500 ? 50 : 20,
      moodDelta: milestone === 500 ? 6 : 3
    });
    bonus.expDelta += milestone === 500 ? 50 : 20;
    bonus.moodDelta += milestone === 500 ? 6 : 3;

    if (milestone === 500 && !nextDecorations.includes('seasonRelic')) {
      nextDecorations = [...nextDecorations, 'seasonRelic'];
    }
  }

  return { claimedMilestones: nextClaimed, decorations: nextDecorations, bonus };
}

function applyTeamRaidProgress(
  teamRaid: EndgameState['teamRaid'],
  event: ActivityEvent,
  progressExp: number
): { teamRaid: EndgameState['teamRaid']; bonus: GrowthResult } {
  const contributionDelta = Math.max(0, Math.floor(progressExp / 4));
  if (contributionDelta <= 0) {
    return { teamRaid, bonus: emptyBonus() };
  }

  const bonus = emptyBonus();
  let contribution = teamRaid.contribution + contributionDelta;
  let clears = teamRaid.clears;

  while (contribution >= teamRaid.target) {
    contribution -= teamRaid.target;
    clears += 1;
    bonus.expDelta += 35;
    bonus.moodDelta += 4;
    bonus.reasons.push('Team raid cleared');
    bonus.breakdown.push({
      id: 'teamRaid.clear',
      label: 'Team raid cleared',
      expDelta: 35,
      moodDelta: 4
    });
  }

  return {
    teamRaid: {
      ...teamRaid,
      contribution,
      clears,
      lastContributionAt: event.occurredAt
    },
    bonus
  };
}

function getRaidDamageWithMeta(
  definition: RaidBossDefinition,
  event: ActivityEvent,
  state: PetState,
  growth: GrowthResult
): number {
  const classMatch = state.endgame.classId === definition.preferredClassId ? 18 : 0;
  const starRank = state.endgame.starTree.nodes.raidMight;
  return definition.getDamage(event, state, growth) + classMatch + starRank * 6;
}

function updateWeeklyReview(state: PetState, event: ActivityEvent): EndgameState {
  const weekKey = getWeekKey(new Date(event.occurredAt));
  if (state.endgame.weeklyReview?.weekKey === weekKey) {
    return state.endgame;
  }

  const dominantStyle = getDominantStyle(state);

  return {
    ...state.endgame,
    weeklyReview: {
      weekKey,
      dominantStyle,
      title: `review.${dominantStyle}.title`,
      summary: `review.${dominantStyle}.summary`
    }
  };
}

export function selectPetClass(state: PetState, classId: PetClassId): PetState {
  if (state.endgame.classId === classId) {
    return state;
  }

  const hasExistingClass = Boolean(state.endgame.classId);
  if (hasExistingClass && state.exp < classChangeCost) {
    return state;
  }

  return {
    ...state,
    exp: hasExistingClass ? state.exp - classChangeCost : state.exp,
    endgame: {
      ...state.endgame,
      classId,
      classQuest: {
        dayKey: '',
        classId,
        progress: 0
      }
    }
  };
}

export function startRaidBoss(state: PetState, bossId: RaidBossId, now = new Date()): PetState {
  const definition = raidBossDefinitions[bossId];

  return {
    ...state,
    endgame: {
      ...state.endgame,
      activeRaid: {
        id: bossId,
        hp: definition.maxHp,
        maxHp: definition.maxHp,
        startedAt: now.toISOString()
      }
    }
  };
}

export function craftStarShard(state: PetState): PetState {
  if (state.exp < 250 || state.decorations.includes('starShard')) {
    return state;
  }

  return {
    ...state,
    exp: state.exp - 250,
    decorations: [...state.decorations, 'starShard'],
    endgame: {
      ...state.endgame,
      labExpSpent: state.endgame.labExpSpent + 250
    }
  };
}

export function investStarTreeNode(state: PetState, nodeId: StarTreeNodeId): PetState {
  const definition = starTreeNodeDefinitions[nodeId];
  const currentRank = state.endgame.starTree.nodes[nodeId];
  if (state.endgame.starTree.unspent <= 0 || currentRank >= definition.maxRank) {
    return state;
  }

  return {
    ...state,
    endgame: {
      ...state.endgame,
      starTree: {
        ...state.endgame.starTree,
        unspent: state.endgame.starTree.unspent - 1,
        nodes: {
          ...state.endgame.starTree.nodes,
          [nodeId]: currentRank + 1
        }
      }
    }
  };
}

export function equipDecoration(state: PetState, decoration: DecorationId): PetState {
  if (!state.decorations.includes(decoration)) {
    return state;
  }

  const equipped = state.equippedDecorations.includes(decoration)
    ? state.equippedDecorations.filter((item) => item !== decoration)
    : [decoration, ...state.equippedDecorations].slice(0, 3);

  return {
    ...state,
    equippedDecorations: equipped
  };
}

export function applyEndgameProgress(
  state: PetState,
  event: ActivityEvent,
  growth: GrowthResult
): EndgameApplyResult {
  const classBonus = applyClassBonus(state, growth);
  const endgameWithReview = updateWeeklyReview(state, event);
  const token = getEventToken(event);
  const comboHistory = [...endgameWithReview.comboHistory, token].slice(-6);
  const comboId = resolveCombo(comboHistory);
  const unlockedComboIds = comboId && !endgameWithReview.unlockedComboIds.includes(comboId)
    ? [...endgameWithReview.unlockedComboIds, comboId]
    : endgameWithReview.unlockedComboIds;
  const comboBonus: GrowthResult = comboId && !endgameWithReview.unlockedComboIds.includes(comboId)
    ? {
        ...emptyBonus(),
        expDelta: 45,
        moodDelta: 5,
        reasons: [`Combo unlocked: ${comboId}`],
        breakdown: [{ id: `combo.${comboId}`, label: `Combo unlocked: ${comboId}`, expDelta: 45, moodDelta: 5 }]
      }
    : emptyBonus();
  let activeRaid = endgameWithReview.activeRaid;
  let defeatedRaidIds = endgameWithReview.defeatedRaidIds;
  let raidHistory = endgameWithReview.raidHistory;
  let decorations = state.decorations;
  const raidBonus = emptyBonus();
  let raidsCleared = 0;

  if (activeRaid) {
    const definition = raidBossDefinitions[activeRaid.id];
    const damage = getRaidDamageWithMeta(definition, event, state, growth);
    const hp = Math.max(0, activeRaid.hp - damage);
    activeRaid = { ...activeRaid, hp };

    if (damage > 0) {
      raidBonus.breakdown.push({ id: `raid.damage.${definition.id}`, label: `Raid damage: ${definition.id}`, expDelta: Math.min(20, Math.max(1, Math.floor(damage / 8))) });
      raidBonus.expDelta += Math.min(20, Math.max(1, Math.floor(damage / 8)));
      raidBonus.reasons.push(`Raid damage: ${definition.id}`);
    }

    if (hp === 0) {
      const firstClear = !defeatedRaidIds.includes(definition.id);
      if (firstClear) {
        defeatedRaidIds = [...defeatedRaidIds, definition.id];
      }
      if (!decorations.includes(definition.decoration)) {
        decorations = [...decorations, definition.decoration];
      }
      if (firstClear) {
        raidHistory = [{
          id: definition.id,
          defeatedAt: event.occurredAt,
          decoration: definition.decoration,
          maxHp: definition.maxHp
        }, ...raidHistory].slice(0, 12);
      }
      raidsCleared = 1;
      raidBonus.expDelta += 80;
      raidBonus.moodDelta += 10;
      raidBonus.reasons.push(`Raid defeated: ${definition.id}`);
      raidBonus.breakdown.push({ id: `raid.defeat.${definition.id}`, label: `Raid defeated: ${definition.id}`, expDelta: 80, moodDelta: 10 });
      activeRaid = undefined;
    }
  }

  const classQuestResult = applyClassQuestProgress(state, event, growth, decorations);
  decorations = classQuestResult.decorations;

  const seasonMemory = endgameWithReview.starTree.nodes.seasonMemory;
  const seasonProgress = endgameWithReview.season.progress +
    Math.max(0, growth.expDelta) +
    classBonus.expDelta +
    classQuestResult.bonus.expDelta +
    comboBonus.expDelta +
    raidBonus.expDelta +
    seasonMemory * 2;
  const seasonMilestoneResult = applySeasonMilestones(
    seasonProgress,
    endgameWithReview.season.claimedMilestones,
    decorations
  );
  const classLevels = state.endgame.classId && classBonus.expDelta > 0
    ? {
        ...endgameWithReview.classLevels,
        [state.endgame.classId]: (endgameWithReview.classLevels[state.endgame.classId] ?? 0) + 1
      }
    : endgameWithReview.classLevels;
  const progressExp = growth.expDelta + classBonus.expDelta + classQuestResult.bonus.expDelta + comboBonus.expDelta + raidBonus.expDelta + seasonMilestoneResult.bonus.expDelta;
  const teamRaidResult = applyTeamRaidProgress(endgameWithReview.teamRaid, event, progressExp);
  const cappedGrowth = applyProjectDailyCap(state, event, {
    ...emptyBonus(),
    expDelta: growth.expDelta + classBonus.expDelta + classQuestResult.bonus.expDelta + comboBonus.expDelta + raidBonus.expDelta + seasonMilestoneResult.bonus.expDelta + teamRaidResult.bonus.expDelta
  });
  const projectCapPenalty = cappedGrowth.expDelta - progressExp - teamRaidResult.bonus.expDelta;
  const bonusExp = classBonus.expDelta + classQuestResult.bonus.expDelta + comboBonus.expDelta + raidBonus.expDelta + seasonMilestoneResult.bonus.expDelta + teamRaidResult.bonus.expDelta + Math.min(0, projectCapPenalty);
  const projectProfiles = updateProjectProfile(state, event, Math.max(0, cappedGrowth.expDelta), raidsCleared);

  return {
    state: {
      ...state,
      decorations: seasonMilestoneResult.decorations,
      endgame: {
        ...endgameWithReview,
        classLevels,
        totalEarnedExp: endgameWithReview.totalEarnedExp + Math.max(0, growth.expDelta + bonusExp),
        masteryRank: Math.floor((endgameWithReview.totalEarnedExp + Math.max(0, growth.expDelta + bonusExp)) / 1000) + endgameWithReview.stars,
        activeRaid,
        defeatedRaidIds,
        raidHistory,
        classQuest: classQuestResult.classQuest,
        comboHistory,
        unlockedComboIds,
        activeProjectKey: getProjectKey(event),
        projectProfiles,
        teamRaid: teamRaidResult.teamRaid,
        season: {
          ...endgameWithReview.season,
          progress: seasonProgress,
          claimedMilestones: seasonMilestoneResult.claimedMilestones
        }
      }
    },
    bonus: {
      ...emptyBonus(),
      expDelta: bonusExp,
      moodDelta: classBonus.moodDelta + classQuestResult.bonus.moodDelta + comboBonus.moodDelta + raidBonus.moodDelta + seasonMilestoneResult.bonus.moodDelta + teamRaidResult.bonus.moodDelta,
      reasons: [...classBonus.reasons, ...classQuestResult.bonus.reasons, ...comboBonus.reasons, ...raidBonus.reasons, ...seasonMilestoneResult.bonus.reasons, ...teamRaidResult.bonus.reasons, ...cappedGrowth.reasons],
      breakdown: [...classBonus.breakdown, ...classQuestResult.bonus.breakdown, ...comboBonus.breakdown, ...raidBonus.breakdown, ...seasonMilestoneResult.bonus.breakdown, ...teamRaidResult.bonus.breakdown, ...cappedGrowth.breakdown]
    }
  };
}

export function canReincarnate(state: PetState): boolean {
  return state.level >= 30 && state.stage === 'ultimate' && state.lifeStatus === 'alive';
}

export function applyReincarnation(state: PetState, now = new Date()): ReincarnationResult {
  if (state.lifeStatus === 'dead') {
    return { reincarnated: false, reason: 'dead' };
  }
  if (!canReincarnate(state)) {
    return { reincarnated: false, reason: 'notReady' };
  }

  const starsGained = 1 + Math.floor(Math.max(0, state.level - 30) / 20);
  const steadyCare = state.endgame.starTree.nodes.steadyCare;
  const next = resolveMonsterIdentity(resolveEvolution({
    ...state,
    level: 1,
    exp: 0,
    hunger: 15,
    mood: clampStat(82 + starsGained + steadyCare * 2),
    energy: clampStat(86 + starsGained + steadyCare * 2),
    health: 100,
    lifeStatus: 'alive',
    evolution: 'egg',
    stage: 'egg',
    lineage: undefined,
    affinity: undefined,
    styleScores: {
      builder: Math.floor(state.styleScores.builder * 0.15),
      cleaner: Math.floor(state.styleScores.cleaner * 0.15),
      debugger: Math.floor(state.styleScores.debugger * 0.15),
      scholar: Math.floor(state.styleScores.scholar * 0.15),
      streak: Math.floor(state.styleScores.streak * 0.15)
    },
    counters: {
      refactor: 0,
      feature: 0,
      debug: 0
    },
    skills: [],
    endgame: {
      ...state.endgame,
      reincarnations: state.endgame.reincarnations + 1,
      stars: state.endgame.stars + starsGained,
      masteryRank: state.endgame.masteryRank + starsGained,
      activeRaid: undefined,
      starTree: {
        ...state.endgame.starTree,
        unspent: state.endgame.starTree.unspent + starsGained
      }
    },
    logs: [{
      message: 'Reincarnated Gitagotchi',
      expDelta: 0,
      occurredAt: now.toISOString(),
      breakdown: [{ id: 'reincarnation', label: 'Reincarnation' }]
    }, ...state.logs].slice(0, 20)
  }));

  return {
    reincarnated: true,
    state: {
      ...next,
      lifeStatus: getLifeStatus(next)
    },
    starsGained
  };
}
