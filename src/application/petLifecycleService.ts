import { applyDailyPat } from "../core/dailyPat";
import { ActivityEvent } from "../core/events";
import { applyActivity } from "../core/growthEngine";
import { DailyQuestId, DecorationId, PetClassId, PetState, RaidBossId, StarTreeNodeId } from "../core/petState";
import { applyRevivePet, ReviveResult } from "../core/revive";
import {
  applyReincarnation,
  craftStarShard as craftStarShardReward,
  equipDecoration,
  investStarTreeNode,
  selectDailyQuest,
  selectPetClass,
  startRaidBoss,
} from "../domain/game/gameSystem";
import { I18n } from "../i18n";

export type PetLifecycleService = {
  applyActivityEvent(state: PetState, event: ActivityEvent, i18n: I18n): PetState;
  pat(state: PetState, now: Date, i18n: I18n): PetState;
  revive(state: PetState, now: Date, i18n: I18n): ReviveResult;
  selectQuest(state: PetState, questId: DailyQuestId, now: Date): PetState;
  selectClass(state: PetState, classId: PetClassId): PetState;
  startRaid(state: PetState, bossId: RaidBossId, now: Date): PetState;
  craftStarShard(state: PetState): PetState;
  investStar(state: PetState, nodeId: StarTreeNodeId): PetState;
  toggleDecoration(state: PetState, decoration: DecorationId): PetState;
  reincarnate(state: PetState, now: Date): ReturnType<typeof applyReincarnation>;
};

export function createPetLifecycleService(): PetLifecycleService {
  return {
    applyActivityEvent(state, event, i18n) {
      return applyActivity(state, event, undefined, i18n);
    },
    pat(state, now, i18n) {
      return applyDailyPat(state, now, i18n);
    },
    revive(state, now, i18n) {
      return applyRevivePet(state, now, i18n);
    },
    selectQuest(state, questId, now) {
      return selectDailyQuest(state, questId, now);
    },
    selectClass(state, classId) {
      return selectPetClass(state, classId);
    },
    startRaid(state, bossId, now) {
      return startRaidBoss(state, bossId, now);
    },
    craftStarShard(state) {
      return craftStarShardReward(state);
    },
    investStar(state, nodeId) {
      return investStarTreeNode(state, nodeId);
    },
    toggleDecoration(state, decoration) {
      return equipDecoration(state, decoration);
    },
    reincarnate(state, now) {
      return applyReincarnation(state, now);
    },
  };
}
