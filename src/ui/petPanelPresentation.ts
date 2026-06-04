import { getPetSpritePack } from "../character/evolutionSprites";
import {
  getRequiredExp,
  PetAffinity,
  DecorationId,
  DailyQuestId,
  PetClassId,
  PetLifeStatus,
  PetLineage,
  PetSkill,
  RaidBossId,
  StarTreeNodeId,
  PetStage,
  PetState,
} from "../core/petState";
import {
  canReincarnate,
  classChangeCost,
  classQuestDefinitions,
  dailyQuestDefinitions,
  petClassDefinitions,
  raidBossDefinitions,
  resolveDailyQuest,
  seasonMilestones,
  starTreeNodeDefinitions,
} from "../domain/game/gameSystem";
import { getMoodName } from "../domain/pet/petSystem";
import { getEvolutionPreview } from "../domain/pet/petSystem";
import { I18n } from "../i18n";
import { renderSpriteHtml } from "./spriteHtml";
import { renderHtmlTemplate } from "./webviewSecurity";

export type PetPanelRenderOptions = {
  cspSource: string;
  nonce: string;
  now?: Date;
};

const decorationCatalog: DecorationId[] = [
  "bugLens",
  "tidyRibbon",
  "bookmarkCape",
  "commitMedal",
  "balanceHalo",
  "releaseEmblem",
  "gardenEmblem",
  "trackerEmblem",
  "archiveEmblem",
  "balanceEmblem",
  "legacyCrown",
  "debugCrown",
  "releaseBanner",
  "dependencyCharm",
  "breakpointCrown",
  "starShard",
  "seasonRelic",
];

const lineageSkillPaths: Record<PetLineage, PetSkill[]> = {
  buildling: ["commitRoar", "focusFlow"],
  refact: ["deepClean", "focusFlow"],
  debugon: ["quickFix", "commitRoar"],
  archivox: ["fieldGuide", "focusFlow"],
};

function meterClass(value: number, inverted = false): string {
  const score = inverted ? 100 - value : value;
  if (score >= 70) {
    return "good";
  }
  if (score >= 35) {
    return "warn";
  }
  return "bad";
}

function getLineageTheme(lineage?: PetLineage): string {
  const themes: Record<
    PetLineage | "unbranched",
    { accent: string; glow: string; soft: string }
  > = {
    buildling: {
      accent: "#fb923c",
      glow: "rgba(251,146,60,.28)",
      soft: "#facc15",
    },
    refact: {
      accent: "#22d3ee",
      glow: "rgba(34,211,238,.26)",
      soft: "#14b8a6",
    },
    debugon: {
      accent: "#f87171",
      glow: "rgba(248,113,113,.28)",
      soft: "#f472b6",
    },
    archivox: {
      accent: "#60a5fa",
      glow: "rgba(96,165,250,.28)",
      soft: "#c084fc",
    },
    unbranched: {
      accent: "#86efac",
      glow: "rgba(134,239,172,.24)",
      soft: "#facc15",
    },
  };
  const theme = themes[lineage ?? "unbranched"];

  return `--lineage-accent:${theme.accent};--lineage-glow:${theme.glow};--lineage-soft:${theme.soft}`;
}

function getLocalDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function wasPattedToday(state: PetState, now: Date): boolean {
  return state.lastPattedAt
    ? getLocalDayKey(new Date(state.lastPattedAt)) === getLocalDayKey(now)
    : false;
}

function renderStatusName(status: PetLifeStatus, i18n: I18n): string {
  return i18n.t(`ui.status.${status}`);
}

function renderStageName(stage: PetStage, i18n: I18n): string {
  return i18n.t(`ui.stage.${stage}`);
}

function renderLineageName(lineage: PetLineage | undefined, i18n: I18n): string {
  return lineage ? i18n.t(`ui.lineage.${lineage}`) : i18n.t("ui.lineage.unbranched");
}

function renderAffinityName(affinity: PetAffinity | undefined, i18n: I18n): string {
  return affinity ? i18n.t(`ui.affinity.${affinity}`) : i18n.t("ui.affinity.unfocused");
}

function renderGuideCareList(i18n: I18n): string {
  const keys = [
    "guide.care.code",
    "guide.care.commit",
    "guide.care.diagnostics",
    "guide.care.refactor",
    "guide.care.testsDocs",
    "guide.care.returnIdle",
    "guide.care.idle",
  ];

  return `<ul class="guide-care-list">${keys.map((key) => `<li>${renderHtmlTemplate.escape(i18n.t(key))}</li>`).join("")}</ul>`;
}

function renderQuestTitle(id: DailyQuestId, i18n: I18n): string {
  return i18n.t(`quest.${id}.title`);
}

function renderQuestBody(id: DailyQuestId, i18n: I18n): string {
  return i18n.t(`quest.${id}.body`);
}

function renderQuestBoard(state: PetState, i18n: I18n, now: Date): string {
  const quest = resolveDailyQuest(state, now);
  const activeId = quest.activeId;

  if (!activeId) {
    const options = quest.offeredIds.map((id) => (
      `<button class="quest-option" type="button" data-command="selectQuest" data-quest-id="${id}">
        <strong>${renderHtmlTemplate.escape(renderQuestTitle(id, i18n))}</strong>
        <span>${renderHtmlTemplate.escape(renderQuestBody(id, i18n))}</span>
      </button>`
    )).join("");

    return `<section class="quest-board"><div class="section-title"><strong>${renderHtmlTemplate.escape(i18n.t("ui.dailyQuest"))}</strong><span>${renderHtmlTemplate.escape(i18n.t("ui.questPick"))}</span></div><div class="quest-options">${options}</div></section>`;
  }

  const definition = dailyQuestDefinitions[activeId];
  const progressPercent = Math.min(100, Math.round((quest.progress / definition.target) * 100));
  const status = quest.completedId
    ? i18n.t("ui.questCompleted")
    : i18n.t("ui.questProgress", { progress: quest.progress, target: definition.target });

  return `<section class="quest-board"><div class="section-title"><strong>${renderHtmlTemplate.escape(i18n.t("ui.dailyQuest"))}</strong><span>${renderHtmlTemplate.escape(status)}</span></div>
    <article class="active-quest">
      <div><strong>${renderHtmlTemplate.escape(renderQuestTitle(activeId, i18n))}</strong><span>${renderHtmlTemplate.escape(renderQuestBody(activeId, i18n))}</span></div>
      <div class="questbar" aria-label="${renderHtmlTemplate.escape(i18n.t("ui.questProgress", { progress: quest.progress, target: definition.target }))}"><i style="width:${progressPercent}%"></i></div>
      <em>${renderHtmlTemplate.escape(i18n.t("ui.questReward", { exp: definition.expReward, decoration: i18n.t(`decoration.${definition.decoration}`) }))}</em>
    </article>
  </section>`;
}

function renderDecorations(state: PetState, i18n: I18n): string {
  if (state.decorations.length === 0) {
    return `<span class="decoration-empty">${renderHtmlTemplate.escape(i18n.t("ui.decorationsEmpty"))}</span>`;
  }

  return state.decorations
    .map((decoration) => {
      const equipped = state.equippedDecorations.includes(decoration);
      const title = equipped ? i18n.t("ui.unequipDecoration") : i18n.t("ui.equipDecoration");
      return `<button class="decoration-chip${equipped ? " equipped" : ""}" type="button" data-command="toggleDecoration" data-decoration-id="${decoration}" title="${renderHtmlTemplate.escape(title)}">${renderHtmlTemplate.escape(i18n.t(`decoration.${decoration}`))}</button>`;
    })
    .join("");
}

function renderEquippedDecorations(state: PetState, i18n: I18n): string {
  if (state.equippedDecorations.length === 0) {
    return "";
  }

  const equipped = state.equippedDecorations
    .map((decoration) => `<span>${renderHtmlTemplate.escape(i18n.t(`decoration.${decoration}`))}</span>`)
    .join("");

  return `<div class="equipped-strip" aria-label="${renderHtmlTemplate.escape(i18n.t("ui.equippedDecorations"))}"><strong>${renderHtmlTemplate.escape(i18n.t("ui.equippedDecorations"))}</strong><div>${equipped}</div></div>`;
}

function renderDecorationCollection(state: PetState, i18n: I18n): string {
  const ownedCount = decorationCatalog.filter((decoration) => state.decorations.includes(decoration)).length;
  const chips = decorationCatalog
    .map((decoration) => {
      const owned = state.decorations.includes(decoration);
      const label = owned ? i18n.t(`decoration.${decoration}`) : i18n.t("ui.lockedDecoration");
      return `<span class="book-chip${owned ? " owned" : " locked"}">${renderHtmlTemplate.escape(label)}</span>`;
    })
    .join("");

  return `<section class="progress-panel decoration-book">
    <div class="section-title"><strong>${renderHtmlTemplate.escape(i18n.t("ui.decorationBook"))}</strong><span>${renderHtmlTemplate.escape(i18n.t("ui.decorationBookProgress", { owned: ownedCount, total: decorationCatalog.length }))}</span></div>
    <div class="book-grid">${chips}</div>
  </section>`;
}

function renderEvolutionPreview(state: PetState, i18n: I18n): string {
  const preview = getEvolutionPreview(state);
  if (!preview.nextStage) {
    return `<section class="evolution-preview"><div class="section-title"><strong>${renderHtmlTemplate.escape(i18n.t("ui.evolutionPreview"))}</strong><span>${renderHtmlTemplate.escape(i18n.t("ui.evolutionComplete"))}</span></div></section>`;
  }

  const ready = preview.requirements.every((requirement) => requirement.met);
  const chips = preview.requirements
    .map((requirement) => {
      const value = requirement.id === "alive"
        ? (requirement.met ? i18n.t("ui.met") : i18n.t("ui.notMet"))
        : `${requirement.current}/${requirement.target}`;
      return `<span class="requirement-chip${requirement.met ? " met" : ""}"><strong>${renderHtmlTemplate.escape(i18n.t(`evolution.req.${requirement.id}`))}</strong><em>${renderHtmlTemplate.escape(value)}</em></span>`;
    })
    .join("");

  return `<section class="evolution-preview">
    <div class="section-title"><strong>${renderHtmlTemplate.escape(i18n.t("ui.evolutionPreview"))}</strong><span>${renderHtmlTemplate.escape(i18n.t(ready ? "ui.evolutionReady" : "ui.evolutionNeeds", { stage: i18n.t(`ui.stage.${preview.nextStage}`) }))}</span></div>
    <div class="requirement-list">${chips}</div>
  </section>`;
}

function renderLineageSkillTree(state: PetState, i18n: I18n): string {
  if (!state.lineage) {
    return "";
  }

  const skills = lineageSkillPaths[state.lineage];
  const rows = skills
    .map((skill) => {
      const unlocked = state.skills.includes(skill);
      return `<span class="skill-path-chip${unlocked ? " unlocked" : ""}"><strong>${renderHtmlTemplate.escape(i18n.t(`skill.${skill}`))}</strong><em>${renderHtmlTemplate.escape(i18n.t(unlocked ? "ui.skillUnlocked" : "ui.skillLocked"))}</em></span>`;
    })
    .join("");

  return `<section class="lineage-skill-tree">
    <div class="section-title"><strong>${renderHtmlTemplate.escape(i18n.t("ui.lineageSkillTree"))}</strong><span>${renderHtmlTemplate.escape(renderLineageName(state.lineage, i18n))}</span></div>
    <div class="skill-path-list">${rows}</div>
  </section>`;
}

function getLatestMoment(state: PetState, i18n: I18n): { kind: string; title: string; body: string } | undefined {
  const latest = state.logs[0];
  const ids = latest?.breakdown?.map((entry) => entry.id) ?? [];
  const exp = latest?.expDelta ?? 0;

  if (ids.some((id) => id.startsWith("raid.defeat."))) {
    return { kind: "defeat", title: i18n.t("moment.raidDefeat.title"), body: i18n.t("moment.raidDefeat.body", { exp }) };
  }
  if (ids.some((id) => id.startsWith("raid.damage."))) {
    return { kind: "hit", title: i18n.t("moment.raidHit.title"), body: i18n.t("moment.raidHit.body", { exp }) };
  }
  if (ids.some((id) => id.startsWith("combo."))) {
    return { kind: "combo", title: i18n.t("moment.combo.title"), body: i18n.t("moment.combo.body", { exp }) };
  }
  if (ids.some((id) => id.startsWith("quest."))) {
    return { kind: "quest", title: i18n.t("moment.quest.title"), body: i18n.t("moment.quest.body", { exp }) };
  }
  if (ids.includes("reincarnation")) {
    return { kind: "rebirth", title: i18n.t("moment.reincarnation.title"), body: i18n.t("moment.reincarnation.body", { stars: state.endgame.stars }) };
  }
  if (exp > 0) {
    return { kind: "growth", title: i18n.t("moment.growth.title"), body: i18n.t("moment.growth.body", { exp }) };
  }

  return undefined;
}

function renderMomentBanner(state: PetState, i18n: I18n): string {
  const moment = getLatestMoment(state, i18n);
  if (!moment) {
    return "";
  }

  return `<section class="moment-banner moment-${moment.kind}">
    <div class="moment-flash"><span></span><span></span><span></span></div>
    <div><strong>${renderHtmlTemplate.escape(moment.title)}</strong><span>${renderHtmlTemplate.escape(moment.body)}</span></div>
  </section>`;
}

function renderStarOrbit(stars: number): string {
  if (stars <= 0) {
    return "";
  }

  const count = Math.min(7, stars);
  const nodes = Array.from({ length: count }, (_, index) => `<span class="star-node star-${index + 1}"></span>`).join("");

  return `<div class="star-orbit" aria-label="Reincarnation stars">${nodes}</div>`;
}

function renderBossSigil(bossId: RaidBossId): string {
  const patterns: Record<RaidBossId, string[]> = {
    legacyDragon: [
      ".xx.xx.",
      "xxxxxxx",
      "x.xxx.x",
      ".xxxxx.",
      "..xxx..",
      ".x.x.x.",
      "x.....x"
    ],
    bugLord: [
      "..xxx..",
      ".xxxxx.",
      "xx.x.xx",
      "xxxxxxx",
      ".x.x.x.",
      "x.x.x.x",
      ".x...x."
    ],
    releaseGolem: [
      ".xxxxx.",
      "xxxxxxx",
      "xx.x.xx",
      "xxxxxxx",
      ".xxxxx.",
      "..x.x..",
      ".xx.xx."
    ],
    dependencyWraith: [
      "..xxx..",
      ".xxxxx.",
      "xxxxxxx",
      "x.x.x.x",
      "..xxx..",
      ".x...x.",
      "x.....x"
    ],
    breakpointHydra: [
      "x.x.x.x",
      ".xxxxx.",
      "xxxxxxx",
      "xx.x.xx",
      "xxxxxxx",
      ".x.x.x.",
      "x..x..x"
    ]
  };
  const pixels = patterns[bossId].join("").split("").map((cell) => `<span${cell === "x" ? " class=\"on\"" : ""}></span>`).join("");

  return `<div class="boss-sigil boss-${bossId}" aria-hidden="true">${pixels}</div>`;
}

function renderRaidArena(state: PetState, i18n: I18n): string {
  const raid = state.endgame.activeRaid;
  if (!raid) {
    const defeated = state.endgame.defeatedRaidIds.length;
    return `<div class="raid-arena raid-empty"><strong>${renderHtmlTemplate.escape(i18n.t("ui.raidReady"))}</strong><span>${renderHtmlTemplate.escape(i18n.t("ui.raidDefeatedCount", { count: defeated }))}</span></div>`;
  }

  const hpPercent = Math.round((raid.hp / raid.maxHp) * 100);
  const definition = raidBossDefinitions[raid.id];
  const seasonBadge = definition.seasonLimited
    ? `<em class="season-badge">${renderHtmlTemplate.escape(i18n.t("ui.seasonLimited"))}</em>`
    : "";

  return `<div class="raid-arena raid-active">
    ${renderBossSigil(raid.id)}
    <div class="raid-readout">
      <strong>${renderHtmlTemplate.escape(i18n.t(`raid.${raid.id}`))}</strong>
      <span>${renderHtmlTemplate.escape(i18n.t("ui.raidProgress", { hp: raid.hp, max: raid.maxHp }))}</span>
      <span class="boss-weakness">${renderHtmlTemplate.escape(i18n.t("ui.bossWeakness"))}: ${renderHtmlTemplate.escape(i18n.t(definition.weaknessKey))}</span>
      ${seasonBadge}
      <div class="bossbar"><i style="width:${hpPercent}%"></i></div>
    </div>
  </div>`;
}

function renderSeasonTrack(state: PetState, i18n: I18n): string {
  const progress = state.endgame.season.progress;
  const progressPercent = Math.min(100, Math.round((progress / 500) * 100));
  const milestones = seasonMilestones
    .map((milestone) => {
      const claimed = state.endgame.season.claimedMilestones.includes(milestone);
      const reached = progress >= milestone;
      return `<span class="season-step${claimed ? " claimed" : reached ? " reached" : ""}">${renderHtmlTemplate.escape(i18n.t("ui.seasonMilestone", { milestone }))}</span>`;
    })
    .join("");

  return `<section class="progress-panel season-track">
    <div class="section-title"><strong>${renderHtmlTemplate.escape(i18n.t("ui.seasonTrack"))}</strong><span>${progress}/500</span></div>
    <div class="seasonbar" aria-label="${renderHtmlTemplate.escape(i18n.t("ui.seasonTrack"))}"><i style="width:${progressPercent}%"></i></div>
    <div class="season-steps">${milestones}</div>
  </section>`;
}

function renderStarTree(state: PetState, i18n: I18n): string {
  const nodes = Object.keys(starTreeNodeDefinitions) as StarTreeNodeId[];
  const content = nodes
    .map((nodeId) => {
      const definition = starTreeNodeDefinitions[nodeId];
      const rank = state.endgame.starTree.nodes[nodeId];
      const disabled = state.endgame.starTree.unspent <= 0 || rank >= definition.maxRank;
      const disabledReason = rank >= definition.maxRank
        ? i18n.t("ui.starTreeMaxed")
        : i18n.t("ui.starTreeNeedPoint");

      return `<button class="star-node-card" type="button" data-command="investStar" data-star-node-id="${nodeId}"${disabled ? " disabled" : ""} title="${renderHtmlTemplate.escape(disabled ? disabledReason : i18n.t("ui.investStar"))}">
        <strong>${renderHtmlTemplate.escape(i18n.t(definition.titleKey))}<em>${rank}/${definition.maxRank}</em></strong>
        <span>${renderHtmlTemplate.escape(i18n.t(`${definition.titleKey}.body`))}</span>
      </button>`;
    })
    .join("");

  return `<section class="progress-panel star-tree">
    <div class="section-title"><strong>${renderHtmlTemplate.escape(i18n.t("ui.starTree"))}</strong><span>${renderHtmlTemplate.escape(i18n.t("ui.starTreePoints", { points: state.endgame.starTree.unspent }))}</span></div>
    <div class="star-tree-grid">${content}</div>
  </section>`;
}

function renderRaidHistory(state: PetState, i18n: I18n): string {
  const records = state.endgame.raidHistory.slice(0, 4);
  const content = records.length === 0
    ? `<span class="muted-row">${renderHtmlTemplate.escape(i18n.t("ui.raidHistoryEmpty"))}</span>`
    : records.map((record) => {
      const defeatedAt = record.defeatedAt.split("T")[0];
      return `<div class="history-row"><strong>${renderHtmlTemplate.escape(i18n.t(`raid.${record.id}`))}</strong><span>${renderHtmlTemplate.escape(defeatedAt)} · ${renderHtmlTemplate.escape(i18n.t(`decoration.${record.decoration}`))}</span></div>`;
    }).join("");

  return `<section class="progress-panel">
    <div class="section-title"><strong>${renderHtmlTemplate.escape(i18n.t("ui.raidHistory"))}</strong></div>
    <div class="history-list">${content}</div>
  </section>`;
}

function renderProjectProfiles(state: PetState, i18n: I18n): string {
  const profiles = Object.values(state.endgame.projectProfiles)
    .sort((a, b) => b.exp - a.exp)
    .slice(0, 3);
  const content = profiles.length === 0
    ? `<span class="muted-row">${renderHtmlTemplate.escape(i18n.t("ui.projectProfilesEmpty"))}</span>`
    : profiles.map((profile) => {
      const active = profile.key === state.endgame.activeProjectKey;
      return `<div class="project-row${active ? " active" : ""}"><strong>${renderHtmlTemplate.escape(profile.label)}</strong><span>${profile.exp} EXP · ${renderHtmlTemplate.escape(i18n.t("ui.raidDefeatedCount", { count: profile.raidsCleared }))}</span></div>`;
    }).join("");

  return `<section class="progress-panel">
    <div class="section-title"><strong>${renderHtmlTemplate.escape(i18n.t("ui.projectProfiles"))}</strong></div>
    <div class="project-list">${content}</div>
  </section>`;
}

function renderTeamRaid(state: PetState, i18n: I18n): string {
  const raid = state.endgame.teamRaid;
  const percent = Math.min(100, Math.round((raid.contribution / raid.target) * 100));

  return `<section class="progress-panel team-raid">
    <div class="section-title"><strong>${renderHtmlTemplate.escape(i18n.t("ui.teamRaid"))}</strong><span>${renderHtmlTemplate.escape(i18n.t("ui.teamRaidClears", { count: raid.clears }))}</span></div>
    <div class="seasonbar" aria-label="${renderHtmlTemplate.escape(i18n.t("ui.teamRaid"))}"><i style="width:${percent}%"></i></div>
    <span>${renderHtmlTemplate.escape(i18n.t("ui.teamRaidProgress", { current: raid.contribution, target: raid.target }))}</span>
  </section>`;
}

function renderClassChoiceButton(
  classId: PetClassId,
  state: PetState,
  i18n: I18n,
  switching: boolean
): string {
  const disabled = switching && state.exp < classChangeCost;
  const title = switching
    ? (disabled ? i18n.t("ui.classChangeLocked", { cost: classChangeCost }) : i18n.t("ui.classChangeCost", { cost: classChangeCost }))
    : i18n.t(`class.${classId}.body`);

  return `<button class="endgame-choice class-choice" type="button" data-command="selectClass" data-class-id="${classId}"${disabled ? " disabled" : ""} title="${renderHtmlTemplate.escape(title)}">
    <strong>${renderHtmlTemplate.escape(i18n.t(`class.${classId}`))}</strong>
    <span>${renderHtmlTemplate.escape(i18n.t(`class.${classId}.body`))}</span>
    ${switching ? `<em>${renderHtmlTemplate.escape(i18n.t("ui.classChangeCost", { cost: classChangeCost }))}</em>` : ""}
  </button>`;
}

function renderClassQuest(state: PetState, i18n: I18n): string {
  const classId = state.endgame.classId;
  if (!classId) {
    return "";
  }

  const definition = classQuestDefinitions[classId];
  const quest = state.endgame.classQuest.classId === classId
    ? state.endgame.classQuest
    : { progress: 0, completedClassId: undefined };
  const progress = Math.min(definition.target, quest.progress);
  const completed = quest.completedClassId === classId;
  const progressText = completed
    ? i18n.t("ui.questCompleted")
    : i18n.t("ui.classQuestProgress", { progress, target: definition.target });
  const percent = Math.min(100, Math.round((progress / definition.target) * 100));

  return `<article class="class-quest-card">
    <div><strong>${renderHtmlTemplate.escape(i18n.t(definition.titleKey))}</strong><span>${renderHtmlTemplate.escape(i18n.t(definition.bodyKey))}</span></div>
    <div class="questbar" aria-label="${renderHtmlTemplate.escape(progressText)}"><i style="width:${percent}%"></i></div>
    <em>${renderHtmlTemplate.escape(i18n.t("ui.questReward", { exp: definition.expReward, decoration: i18n.t(`decoration.${definition.decoration}`) }))}</em>
  </article>`;
}

function renderClassQuestBoard(state: PetState, i18n: I18n): string {
  const classQuest = renderClassQuest(state, i18n);
  if (!classQuest) {
    return "";
  }

  return `<section class="progress-panel class-quest-panel">
    <div class="section-title"><strong>${renderHtmlTemplate.escape(i18n.t("ui.classQuest"))}</strong><span>${renderHtmlTemplate.escape(i18n.t("ui.classChangeCost", { cost: classChangeCost }))}</span></div>
    ${classQuest}
  </section>`;
}

function renderWeeklyReview(state: PetState, i18n: I18n): string {
  const review = state.endgame.weeklyReview
    ? `${i18n.t(state.endgame.weeklyReview.title)} · ${i18n.t(state.endgame.weeklyReview.summary)}`
    : i18n.t("ui.weeklyReviewEmpty");

  return `<section class="endgame-review"><strong>${renderHtmlTemplate.escape(i18n.t("ui.weeklyReview"))}</strong><span>${renderHtmlTemplate.escape(review)}</span><button type="button" class="endgame-mini-command" data-command="copyReview">${renderHtmlTemplate.escape(i18n.t("ui.copyReview"))}</button></section>`;
}

function renderEndgameBoard(state: PetState, i18n: I18n): string {
  const classIds = Object.keys(petClassDefinitions) as PetClassId[];
  const bossIds = Object.keys(raidBossDefinitions) as RaidBossId[];
  const classContent = state.endgame.classId
    ? `<article class="class-card"><strong>${renderHtmlTemplate.escape(i18n.t(`class.${state.endgame.classId}`))}<em>${renderHtmlTemplate.escape(i18n.t("ui.classLevel", { level: state.endgame.classLevels[state.endgame.classId] ?? 0 }))}</em></strong><span>${renderHtmlTemplate.escape(i18n.t(`class.${state.endgame.classId}.body`))}</span></article>
      <div class="class-compare"><strong>${renderHtmlTemplate.escape(i18n.t("ui.classCompare"))}</strong>${classIds.filter((classId) => classId !== state.endgame.classId).map((classId) => renderClassChoiceButton(classId, state, i18n, true)).join("")}</div>`
    : classIds.map((classId) => renderClassChoiceButton(classId, state, i18n, false)).join("");
  const raid = state.endgame.activeRaid;
  const raidContent = raid
    ? renderRaidArena(state, i18n)
    : `${renderRaidArena(state, i18n)}${bossIds.map((bossId) => (
      `<button class="endgame-choice boss-choice" type="button" data-command="startRaid" data-boss-id="${bossId}">
        <strong>${renderHtmlTemplate.escape(i18n.t(`raid.${bossId}`))}</strong>
        <span>${renderHtmlTemplate.escape(i18n.t("ui.bossWeakness"))}: ${renderHtmlTemplate.escape(i18n.t(raidBossDefinitions[bossId].weaknessKey))}</span>
        ${raidBossDefinitions[bossId].seasonLimited ? `<em>${renderHtmlTemplate.escape(i18n.t("ui.seasonLimited"))}</em>` : ""}
      </button>`
    )).join("")}`;
  const reincarnateDisabled = canReincarnate(state) ? "" : " disabled";
  const starDisabled = state.exp >= 250 && !state.decorations.includes("starShard") ? "" : " disabled";
  const reincarnateTitle = canReincarnate(state) ? i18n.t("ui.reincarnate") : i18n.t("ui.reincarnationLocked");
  const starTitle = starDisabled ? i18n.t("ui.starShardLocked") : i18n.t("ui.craftStarShard");

  return `<section class="endgame-board">
    <div class="endgame-top">
      <div><span>${renderHtmlTemplate.escape(i18n.t("ui.mastery"))}</span><strong>${renderHtmlTemplate.escape(i18n.t("ui.masteryValue", { rank: state.endgame.masteryRank, stars: state.endgame.stars }))}</strong></div>
      <div><span>${renderHtmlTemplate.escape(i18n.t("ui.season"))}</span><strong>${state.endgame.season.progress}/500</strong></div>
      <div><span>${renderHtmlTemplate.escape(i18n.t("ui.reincarnations"))}</span><strong>${state.endgame.reincarnations}</strong></div>
    </div>
    <div class="endgame-grid">
      <section><div class="section-title"><strong>${renderHtmlTemplate.escape(i18n.t("ui.classBuild"))}</strong></div><div class="endgame-options">${classContent}</div></section>
      <section><div class="section-title"><strong>${renderHtmlTemplate.escape(i18n.t("ui.raidBoss"))}</strong></div><div class="endgame-options">${raidContent}</div></section>
    </div>
    ${renderSeasonTrack(state, i18n)}
    ${renderStarTree(state, i18n)}
    <div class="endgame-actions">
      <button type="button" class="endgame-command" data-command="craftStarShard"${starDisabled} title="${renderHtmlTemplate.escape(starTitle)}">${renderHtmlTemplate.escape(i18n.t("ui.craftStarShard"))}</button>
      <button type="button" class="endgame-command" data-command="reincarnate"${reincarnateDisabled} title="${renderHtmlTemplate.escape(reincarnateTitle)}">${renderHtmlTemplate.escape(i18n.t("ui.reincarnate"))}</button>
    </div>
  </section>`;
}

export function renderPetPanelHtml(
  state: PetState,
  i18n: I18n,
  options: PetPanelRenderOptions,
): string {
  const mood = getMoodName(state);
  const sprite = getPetSpritePack(state, mood);
  const firstFrame = sprite.frames[0];
  if (!firstFrame) {
    throw new Error(
      `No frames available for evolution=${state.evolution} mood=${mood}`,
    );
  }

  const petName = renderHtmlTemplate.escape(state.name?.trim() || "Gitagotchi");
  const pet = renderSpriteHtml(
    firstFrame,
    "monster-sprite",
    "Gitagotchi monster sprite",
  );
  const status = renderHtmlTemplate.escape(renderStatusName(state.lifeStatus, i18n));
  const stage = renderHtmlTemplate.escape(renderStageName(state.stage, i18n));
  const lineage = renderHtmlTemplate.escape(renderLineageName(state.lineage, i18n));
  const affinity = renderHtmlTemplate.escape(renderAffinityName(state.affinity, i18n));
  const lineageTheme = getLineageTheme(state.lineage);
  const pattedTodayLabel = renderHtmlTemplate.escape(i18n.t("ui.pattedToday"));
  const now = options.now ?? new Date();
  const patHeart = wasPattedToday(state, options.now ?? new Date())
    ? `<div class="pixel-heart" aria-label="${pattedTodayLabel}" title="${pattedTodayLabel}"><span class="heart-pixel heart-1"></span><span class="heart-pixel heart-2"></span><span class="heart-pixel heart-3"></span><span class="heart-pixel heart-4"></span><span class="heart-pixel heart-5"></span><span class="heart-pixel heart-6"></span><span class="heart-pixel heart-7"></span><span class="heart-pixel heart-8"></span><span class="heart-pixel heart-9"></span></div>`
    : "";
  const expPercent = Math.min(
    100,
    Math.round((state.exp / getRequiredExp(state.level)) * 100),
  );
  const fullness = 100 - state.hunger;
  const maxStyleScore = Math.max(100, ...Object.values(state.styleScores));
  const styleRows = (
    Object.entries(state.styleScores) as Array<
      [keyof typeof state.styleScores, number]
    >
  )
    .map(([key, value]) => {
      const percent = Math.min(100, Math.round((value / maxStyleScore) * 100));
      return `<div class="skill-node"><span>${i18n.t(`style.${key}`)}</span><strong>${value}</strong><i style="width:${percent}%"></i></div>`;
    })
    .join("");
  const actions = [
    { command: "pat", rune: "PT", label: i18n.t("ui.pat"), primary: state.lifeStatus !== "dead", disabled: state.lifeStatus === "dead" },
    { command: "commit", rune: "GC", label: i18n.t("ui.commit"), disabled: state.lifeStatus === "dead" },
    { command: "stats", rune: "ST", label: i18n.t("ui.viewStats") },
    { command: "skills", rune: "SK", label: i18n.t("ui.skills") },
    { command: "dex", rune: "DX", label: i18n.t("ui.dex") },
    { command: "revive", rune: "RV", label: i18n.t("ui.revive"), primary: state.lifeStatus === "dead", disabled: state.lifeStatus !== "dead" },
  ];
  const actionButtons = actions
    .map(
      (action) =>
        `<button class="action-btn${action.primary ? " action-primary" : ""}" data-command="${action.command}"${action.disabled ? " disabled" : ""}><span class="action-rune">${action.rune}</span><span class="action-label">${renderHtmlTemplate.escape(action.label)}</span></button>`,
    )
    .join("");
  const questBoard = renderQuestBoard(state, i18n, now);
  const classQuestBoard = renderClassQuestBoard(state, i18n);
  const decorations = renderDecorations(state, i18n);
  const equippedDecorations = renderEquippedDecorations(state, i18n);
  const endgameBoard = renderEndgameBoard(state, i18n);
  const momentBanner = renderMomentBanner(state, i18n);
  const starOrbit = renderStarOrbit(state.endgame.stars);
  const reincarnationTier = state.endgame.stars > 0
    ? ` reincarnation-tier-${Math.min(3, Math.ceil(state.endgame.stars / 3))}`
    : "";
  const evolutionPreview = renderEvolutionPreview(state, i18n);
  const lineageSkillTree = renderLineageSkillTree(state, i18n);
  const decorationBook = renderDecorationCollection(state, i18n);
  const collectionBoard = `${decorationBook}<div class="endgame-columns">${renderRaidHistory(state, i18n)}${renderProjectProfiles(state, i18n)}</div>${renderWeeklyReview(state, i18n)}`;
  const tabIds = ["status", "goals", "endgame", "collection"] as const;
  const tabNav = tabIds
    .map((tabId, index) => {
      const active = index === 0;
      return `<button class="tab-button${active ? " active" : ""}" type="button" role="tab" id="tab-${tabId}" aria-selected="${active}" aria-controls="tab-panel-${tabId}" data-tab-target="${tabId}">${renderHtmlTemplate.escape(i18n.t(`ui.tab.${tabId}`))}</button>`;
    })
    .join("");

  const languageLabels: Record<string, string> = {
    en: "EN",
    ko: "KO",
    ja: "JA",
    zh: "ZH",
  };
  const langButtons = (["en", "ko", "ja", "zh"] as const)
    .map(
      (locale) =>
        `<button class="lang-btn ${locale === i18n.locale ? "active" : ""}" data-locale="${locale}" title="${locale.toUpperCase()}">${languageLabels[locale]}</button>`,
    )
    .join("");
  const helpLabel = renderHtmlTemplate.escape(i18n.t("ui.help"));
  const guideTitle = renderHtmlTemplate.escape(i18n.t("guide.title"));
  const guideGrowthTitle = renderHtmlTemplate.escape(i18n.t("guide.growthTitle"));
  const guideGrowthBody = renderHtmlTemplate.escape(i18n.t("guide.growthBody"));
  const guideCareTitle = renderHtmlTemplate.escape(i18n.t("guide.careTitle"));
  const guideCareIntro = renderHtmlTemplate.escape(i18n.t("guide.careIntro"));
  const guideCareList = renderGuideCareList(i18n);
  const guideUsageTitle = renderHtmlTemplate.escape(i18n.t("guide.usageTitle"));
  const guideUsageBody = renderHtmlTemplate.escape(i18n.t("guide.usageBody"));
  const guidePatTitle = renderHtmlTemplate.escape(i18n.t("guide.patTitle"));
  const guidePatBody = renderHtmlTemplate.escape(i18n.t("guide.patBody"));
  const guideReviveTitle = renderHtmlTemplate.escape(i18n.t("guide.reviveTitle"));
  const guideReviveBody = renderHtmlTemplate.escape(i18n.t("guide.reviveBody"));
  const guideClose = renderHtmlTemplate.escape(i18n.t("guide.close"));
  const guideTabsTitle = renderHtmlTemplate.escape(i18n.t("guide.tabsTitle"));
  const guideTabsBody = renderHtmlTemplate.escape(i18n.t("guide.tabsBody"));
  const guideGoalsTitle = renderHtmlTemplate.escape(i18n.t("guide.goalsTitle"));
  const guideGoalsBody = renderHtmlTemplate.escape(i18n.t("guide.goalsBody"));
  const guideEndgameTitle = renderHtmlTemplate.escape(i18n.t("guide.endgameTitle"));
  const guideEndgameBody = renderHtmlTemplate.escape(i18n.t("guide.endgameBody"));
  const guideCollectionTitle = renderHtmlTemplate.escape(i18n.t("guide.collectionTitle"));
  const guideCollectionBody = renderHtmlTemplate.escape(i18n.t("guide.collectionBody"));

  return `<!doctype html>
<html lang="${i18n.locale}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${options.cspSource}; style-src 'unsafe-inline' ${options.cspSource}; script-src 'nonce-${options.nonce}' ${options.cspSource};">
  <style>
    * { box-sizing: border-box; }
    body { height: 100vh; overflow: hidden; color: var(--vscode-foreground); font-family: var(--vscode-font-family); margin: 0; padding: 16px; background: var(--vscode-editor-background); }
    .page-shell { width: min(1120px, 100%); height: calc(100vh - 32px); min-height: 0; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }
    .lang-bar { display: flex; justify-content: flex-end; gap: 6px; align-items: center; }
    .top-actions { display: flex; align-items: center; gap: 6px; }
    .lang-btn { min-width: 36px; min-height: 28px; padding: 4px 7px; font-family: var(--vscode-editor-font-family); font-size: 11px; font-weight: 800; line-height: 1; background: var(--vscode-editorWidget-background); color: var(--vscode-descriptionForeground); border: 1px solid var(--vscode-panel-border); border-radius: 4px; cursor: pointer; opacity: 0.74; transition: opacity .15s ease, color .15s ease, border-color .15s ease, background .15s ease; }
    .lang-btn:hover { opacity: 1; color: var(--vscode-foreground); border-color: var(--lineage-accent, var(--vscode-focusBorder)); }
    .lang-btn.active { opacity: 1; color: var(--vscode-foreground); border-color: var(--lineage-accent, var(--vscode-focusBorder)); background: var(--vscode-editorWidget-background); box-shadow: inset 0 -2px 0 var(--lineage-accent, var(--vscode-focusBorder)); }
    .top-action-btn { min-width: 58px; min-height: 28px; height: 28px; padding: 4px 8px; border-radius: 4px; font-family: var(--vscode-editor-font-family); font-size: 11px; font-weight: 800; line-height: 1; color: var(--vscode-foreground); background: var(--vscode-editorWidget-background); border: 1px solid var(--vscode-panel-border); cursor: pointer; opacity: .86; }
    .top-action-btn:hover { opacity: 1; border-color: var(--lineage-accent); background: var(--vscode-list-hoverBackground, var(--vscode-editorWidget-background)); }
    .top-action-btn.danger { color: var(--vscode-errorForeground, var(--vscode-foreground)); border-color: color-mix(in srgb, var(--vscode-errorForeground, #f87171) 48%, var(--vscode-panel-border)); background: var(--vscode-editorWidget-background); }
    .guide-btn { width: 28px; min-width: 28px; height: 28px; min-height: 28px; padding: 0; display: grid; place-items: center; border-radius: 999px; font-family: var(--vscode-editor-font-family); font-size: 13px; font-weight: 900; line-height: 1; color: var(--vscode-foreground); background: var(--vscode-editorWidget-background); border: 1px solid var(--vscode-panel-border); cursor: pointer; opacity: .86; }
    .guide-btn:hover { opacity: 1; border-color: var(--lineage-accent); background: var(--vscode-list-hoverBackground, var(--vscode-editorWidget-background)); }
    .hud-shell { width: 100%; min-height: 0; flex: 1 1 auto; display: grid; grid-template-columns: minmax(250px, 280px) minmax(560px, 1fr); gap: 14px; align-items: stretch; }
    .monster-card, .systems-card { border: 1px solid var(--vscode-panel-border); background: var(--vscode-sideBar-background); border-radius: 6px; box-shadow: none; }
    .monster-card { position: relative; min-height: 0; display: grid; grid-template-rows: auto 1fr auto auto; gap: 12px; padding: 12px; overflow: hidden; }
    .monster-card.reincarnation-tier-1 { box-shadow: inset 3px 0 0 color-mix(in srgb, var(--lineage-soft) 70%, transparent); }
    .monster-card.reincarnation-tier-2 { box-shadow: inset 3px 0 0 color-mix(in srgb, var(--lineage-soft) 78%, transparent); }
    .monster-card.reincarnation-tier-3 { box-shadow: inset 3px 0 0 var(--lineage-accent); }
    .moment-banner { position: relative; width: 100%; display: grid; grid-template-columns: 34px 1fr; gap: 9px; align-items: center; padding: 8px 10px; overflow: hidden; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editorWidget-background); box-shadow: inset 3px 0 0 var(--lineage-accent); animation: moment-pop .7s ease-out both; }
    .moment-banner strong { display: block; font-size: 13px; line-height: 1.2; }
    .moment-banner span { color: var(--vscode-descriptionForeground); font-size: 12px; line-height: 1.35; }
    .moment-flash { position: relative; width: 28px; height: 28px; display: grid; place-items: center; border: 1px solid var(--vscode-panel-border); border-radius: 4px; background: var(--vscode-editor-background); }
    .moment-flash span { position: absolute; width: 5px; height: 5px; background: var(--lineage-accent); }
    .moment-flash span:nth-child(1) { transform: translate(-8px, -5px); }
    .moment-flash span:nth-child(2) { transform: translate(7px, 0); background: var(--lineage-soft); }
    .moment-flash span:nth-child(3) { transform: translate(-1px, 8px); }
    .moment-defeat, .moment-rebirth { box-shadow: inset 3px 0 0 var(--lineage-soft); }
    @keyframes moment-pop { from { transform: translateY(-6px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .card-topline, .card-footer, .nameplate, .sprite-stage { position: relative; z-index: 1; }
    .card-topline { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; }
    .card-lineage, .card-rarity, .affinity-chip { border: 1px solid var(--vscode-panel-border); border-radius: 999px; background: var(--vscode-editorWidget-background); color: var(--vscode-foreground); font-size: 10px; font-weight: 800; letter-spacing: 0; line-height: 1; padding: 6px 8px; }
    .card-level { display: inline-grid; place-items: center; min-width: 48px; min-height: 34px; border: 1px solid var(--vscode-panel-border); border-radius: 5px; background: var(--vscode-editorWidget-background); font-family: var(--vscode-editor-font-family); font-weight: 800; box-shadow: inset 0 -2px 0 var(--lineage-accent); }
    .sprite-stage { align-self: center; justify-self: center; display: grid; place-items: center; width: 188px; height: 188px; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editor-background); box-shadow: inset 0 -3px 0 color-mix(in srgb, var(--lineage-accent) 62%, transparent); }
    .monster-sprite { display: grid; grid-template-columns: repeat(var(--cols), var(--px)); grid-template-rows: repeat(var(--rows), var(--px)); gap: 0; image-rendering: pixelated; filter: drop-shadow(0 9px 0 rgba(0,0,0,.24)); animation: bob 1.8s ease-in-out infinite; }
    .sprite-pixel { width: var(--px); height: var(--px); }
    .pixel-heart { position: absolute; z-index: 2; right: 34px; top: 54px; display: grid; grid-template-columns: repeat(5, 5px); grid-template-rows: repeat(5, 5px); width: 25px; height: 25px; image-rendering: pixelated; filter: drop-shadow(0 0 7px rgba(251,113,133,.55)); animation: heart-float 1.6s ease-in-out infinite; pointer-events: none; }
    .star-orbit { position: absolute; z-index: 3; inset: 16px; pointer-events: none; animation: star-spin 8s linear infinite; }
    .star-node { position: absolute; left: 50%; top: 50%; width: 6px; height: 6px; background: var(--lineage-soft); box-shadow: 0 0 6px var(--lineage-soft); }
    .star-1 { transform: rotate(0deg) translateX(92px); }
    .star-2 { transform: rotate(52deg) translateX(92px); }
    .star-3 { transform: rotate(104deg) translateX(92px); }
    .star-4 { transform: rotate(156deg) translateX(92px); }
    .star-5 { transform: rotate(208deg) translateX(92px); }
    .star-6 { transform: rotate(260deg) translateX(92px); }
    .star-7 { transform: rotate(312deg) translateX(92px); }
    @keyframes star-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .heart-pixel { width: 5px; height: 5px; background: #fb7185; box-shadow: inset -1px -1px 0 rgba(159,18,57,.45); }
    .heart-1 { grid-column: 2; grid-row: 1; }
    .heart-2 { grid-column: 4; grid-row: 1; }
    .heart-3 { grid-column: 1; grid-row: 2; }
    .heart-4 { grid-column: 2; grid-row: 2; }
    .heart-5 { grid-column: 3; grid-row: 2; }
    .heart-6 { grid-column: 4; grid-row: 2; }
    .heart-7 { grid-column: 5; grid-row: 2; }
    .heart-8 { grid-column: 2 / span 3; grid-row: 3; width: 15px; }
    .heart-9 { grid-column: 3; grid-row: 4; }
    @keyframes heart-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    .nameplate { width: 100%; display: grid; gap: 7px; justify-items: center; padding: 10px 8px; border-top: 1px solid var(--vscode-panel-border); border-bottom: 1px solid var(--vscode-panel-border); background: var(--vscode-editorWidget-background); }
    .name { margin: 0; max-width: 100%; overflow-wrap: anywhere; font-size: 25px; line-height: 1.05; text-align: center; letter-spacing: 0; }
    .callsign { color: var(--vscode-descriptionForeground); font-size: 11px; text-transform: uppercase; letter-spacing: .12em; }
    .card-footer { display: grid; gap: 9px; }
    .trait-row { display: flex; flex-wrap: wrap; gap: 7px; justify-content: center; }
    .systems-card { min-height: 0; padding: 14px; display: grid; grid-template-rows: auto auto auto minmax(0, 1fr); gap: 10px; overflow: hidden; }
    .topline { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center; }
    .level-badge { padding: 7px 10px; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editorWidget-background); font-weight: 800; }
    .title-stack span { display: block; color: var(--vscode-descriptionForeground); font-size: 11px; text-transform: uppercase; letter-spacing: .08em; }
    .title-stack strong { display: block; margin-top: 2px; font-size: 15px; }
    .exp-readout { font-family: var(--vscode-editor-font-family); font-size: 12px; }
    .expbar, .stat-card, .skill-node { position: relative; overflow: hidden; border: 1px solid var(--vscode-panel-border); background: var(--vscode-editorWidget-background); border-radius: 6px; }
    .expbar { height: 12px; }
    .expbar span, .stat-card i, .skill-node i { display: block; height: 100%; background: var(--lineage-accent); }
    .stat-deck { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .stat-card { height: 66px; min-height: 66px; padding: 9px; }
    .stat-card .label, .skill-node span { position: relative; z-index: 1; display: block; color: var(--vscode-descriptionForeground); font-size: 10px; text-transform: uppercase; letter-spacing: .06em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .stat-card strong, .skill-node strong { position: relative; z-index: 1; display: block; margin-top: 7px; font-family: var(--vscode-editor-font-family); font-size: 18px; }
    .stat-card i, .skill-node i { position: absolute; left: 0; bottom: 0; height: 4px; }
    .stat-card.good i { background: var(--vscode-charts-green); }
    .stat-card.warn i { background: var(--vscode-charts-yellow); }
    .stat-card.bad i { background: var(--vscode-charts-red); }
    .section-title { display: flex; align-items: end; justify-content: space-between; gap: 12px; }
    .section-title strong { font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
    .section-title span { color: var(--vscode-descriptionForeground); font-size: 11px; text-align: right; }
    .meta-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border: 1px solid var(--vscode-panel-border); border-radius: 7px; overflow: hidden; background: var(--vscode-editorWidget-background); }
    .meta-strip div { padding: 9px 10px; border-right: 1px solid var(--vscode-panel-border); }
    .meta-strip div:last-child { border-right: 0; }
    .meta-strip span { display: block; color: var(--vscode-descriptionForeground); font-size: 10px; text-transform: uppercase; letter-spacing: .07em; }
    .meta-strip strong { display: block; margin-top: 4px; overflow-wrap: anywhere; font-family: var(--vscode-editor-font-family); font-size: 12px; }
    .evolution-preview { display: grid; gap: 7px; padding: 9px; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editorWidget-background); }
    .requirement-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .requirement-chip { display: inline-grid; grid-template-columns: auto auto; gap: 5px; align-items: center; padding: 4px 6px; border: 1px solid var(--vscode-panel-border); border-radius: 999px; background: var(--vscode-editor-background); }
    .requirement-chip strong, .requirement-chip em { font-size: 10px; line-height: 1; font-style: normal; }
    .requirement-chip strong { color: var(--vscode-descriptionForeground); }
    .requirement-chip.met { border-color: var(--lineage-accent); background: var(--vscode-editor-background); box-shadow: inset 2px 0 0 var(--lineage-accent); }
    .lineage-skill-tree { display: grid; gap: 7px; padding: 9px; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editorWidget-background); }
    .skill-path-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-path-chip { display: inline-grid; gap: 3px; padding: 5px 7px; border: 1px dashed color-mix(in srgb, var(--vscode-panel-border) 72%, var(--lineage-soft)); border-radius: 6px; background: var(--vscode-editor-background); }
    .skill-path-chip.unlocked { border-style: solid; border-color: var(--lineage-accent); background: var(--vscode-editor-background); box-shadow: inset 2px 0 0 var(--lineage-accent); }
    .skill-path-chip strong { font-size: 10px; line-height: 1.1; }
    .skill-path-chip em { color: var(--vscode-descriptionForeground); font-size: 9px; line-height: 1.1; font-style: normal; text-transform: uppercase; }
    .skill-matrix { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
    .skill-node { height: 58px; min-height: 58px; padding: 8px; }
    .skill-node i { background: var(--lineage-soft); }
    .quest-board { display: grid; gap: 9px; padding: 10px; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editorWidget-background); }
    .quest-options { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .quest-option { height: 84px; min-height: 84px; display: grid; gap: 5px; align-content: start; padding: 9px; overflow: hidden; text-align: left; white-space: normal; color: var(--vscode-foreground); border-color: var(--vscode-panel-border); background: var(--vscode-editor-background); }
    .quest-option strong, .active-quest strong { font-size: 12px; line-height: 1.25; }
    .quest-option span, .active-quest span, .active-quest em { color: var(--vscode-descriptionForeground); font-size: 11px; line-height: 1.35; font-style: normal; }
    .active-quest { display: grid; gap: 8px; }
    .active-quest div:first-child { display: grid; gap: 4px; }
    .questbar { height: 9px; overflow: hidden; border: 1px solid var(--vscode-panel-border); border-radius: 999px; background: var(--vscode-editor-background); }
    .questbar i { display: block; height: 100%; background: var(--lineage-accent); }
    .decoration-row { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; min-height: 24px; }
    .decoration-chip, .decoration-empty { border: 1px solid var(--vscode-panel-border); border-radius: 999px; padding: 4px 7px; background: var(--vscode-editorWidget-background); color: var(--vscode-foreground); font-size: 10px; font-weight: 700; line-height: 1; }
    .decoration-chip { min-height: 24px; cursor: pointer; }
    .decoration-chip.equipped { border-color: var(--lineage-accent); background: var(--vscode-editor-background); box-shadow: inset 2px 0 0 var(--lineage-accent); }
    .decoration-empty { color: var(--vscode-descriptionForeground); font-weight: 600; }
    .equipped-strip { display: grid; gap: 5px; padding: 7px; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editorWidget-background); }
    .equipped-strip strong { color: var(--vscode-descriptionForeground); font-size: 10px; line-height: 1.2; text-align: center; text-transform: uppercase; }
    .equipped-strip div { display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; }
    .equipped-strip span { padding: 3px 6px; border: 1px solid var(--vscode-panel-border); border-radius: 999px; font-size: 10px; font-weight: 700; }
    .tab-nav { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px; padding: 3px; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editorWidget-background); }
    .tab-button { height: 34px; min-height: 34px; padding: 6px 7px; color: var(--vscode-descriptionForeground); border-color: transparent; background: transparent; text-align: center; overflow-wrap: anywhere; white-space: normal; }
    .tab-button.active { color: var(--vscode-foreground); border-color: transparent; background: var(--vscode-editor-background); box-shadow: inset 0 -2px 0 var(--lineage-accent); }
    .tab-panel { display: grid; gap: 10px; min-height: 0; align-content: start; overflow-y: auto; padding: 2px 2px 4px; scrollbar-width: thin; }
    .tab-panel[hidden] { display: none; }
    .endgame-board { display: grid; gap: 10px; padding: 10px; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editorWidget-background); }
    .endgame-top { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .endgame-top div, .endgame-review, .progress-panel { display: grid; gap: 4px; padding: 8px; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editor-background); }
    .endgame-top span, .endgame-review span, .progress-panel span { color: var(--vscode-descriptionForeground); font-size: 11px; line-height: 1.35; }
    .endgame-top strong, .endgame-review strong, .progress-panel strong { font-size: 12px; line-height: 1.25; }
    .endgame-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
    .endgame-options { display: grid; gap: 6px; margin-top: 7px; overflow: visible; }
    .raid-arena { display: grid; grid-template-columns: 48px 1fr; gap: 8px; align-items: center; padding: 8px; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editor-background); }
    .raid-empty { grid-template-columns: 1fr; }
    .raid-empty span, .raid-readout span, .raid-readout em { color: var(--vscode-descriptionForeground); font-size: 11px; line-height: 1.35; font-style: normal; }
    .boss-sigil { display: grid; grid-template-columns: repeat(7, 5px); grid-template-rows: repeat(7, 5px); gap: 1px; place-content: center; width: 42px; height: 42px; image-rendering: pixelated; filter: drop-shadow(0 0 10px var(--lineage-glow)); animation: boss-pulse 1.8s ease-in-out infinite; }
    .boss-sigil span { width: 5px; height: 5px; }
    .boss-sigil .on { background: var(--lineage-accent); box-shadow: inset -1px -1px 0 rgba(0,0,0,.28); }
    .raid-readout { display: grid; gap: 4px; }
    .bossbar { height: 8px; overflow: hidden; border: 1px solid var(--vscode-panel-border); border-radius: 999px; background: var(--vscode-editor-background); }
    .bossbar i { display: block; height: 100%; background: var(--vscode-charts-red); }
    @keyframes boss-pulse { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-2px) scale(1.05); } }
    .endgame-choice, .endgame-command { height: 64px; min-height: 64px; padding: 7px 8px; overflow: hidden; color: var(--vscode-foreground); border-color: var(--vscode-panel-border); background: var(--vscode-editor-background); text-align: left; }
    .endgame-command { height: 40px; min-height: 40px; text-align: center; }
    .endgame-choice strong { font-size: 11px; line-height: 1.2; }
    .endgame-choice span, .endgame-choice em, .class-card span, .class-card em { display: block; margin-top: 4px; color: var(--vscode-descriptionForeground); font-size: 10px; line-height: 1.35; font-style: normal; }
    .class-card { display: grid; gap: 4px; padding: 8px; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editor-background); }
    .class-card strong { display: block; font-size: 12px; }
    .section-title.compact { margin-top: 4px; }
    .class-choice { white-space: normal; }
    .class-quest-card { display: grid; gap: 7px; padding: 8px; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editor-background); }
    .class-quest-card div:first-child { display: grid; gap: 3px; }
    .class-quest-card strong, .class-compare strong { font-size: 11px; line-height: 1.25; }
    .class-quest-card span, .class-quest-card em { color: var(--vscode-descriptionForeground); font-size: 10px; line-height: 1.35; font-style: normal; }
    .class-compare { display: grid; gap: 5px; margin-top: 4px; overflow: visible; }
    .season-badge, .boss-choice em { color: var(--lineage-soft); font-weight: 800; }
    .seasonbar { height: 9px; overflow: hidden; border: 1px solid var(--vscode-panel-border); border-radius: 999px; background: var(--vscode-editor-background); }
    .seasonbar i { display: block; height: 100%; background: linear-gradient(90deg, var(--lineage-accent), var(--lineage-soft)); }
    .season-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5px; }
    .season-step { padding: 5px 6px; border: 1px solid var(--vscode-panel-border); border-radius: 5px; text-align: center; background: var(--vscode-editor-background); }
    .season-step.reached { color: var(--vscode-foreground); border-color: color-mix(in srgb, var(--lineage-accent) 58%, var(--vscode-panel-border)); }
    .season-step.claimed { color: var(--vscode-foreground); border-color: var(--lineage-accent); background: var(--vscode-editorWidget-background); box-shadow: inset 0 -2px 0 var(--lineage-accent); }
    .team-raid { border-color: var(--vscode-panel-border); background: var(--vscode-editor-background); }
    .star-tree-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
    .star-node-card { height: 96px; min-height: 96px; display: grid; align-content: start; gap: 5px; padding: 7px; overflow: hidden; white-space: normal; color: var(--vscode-foreground); border-color: var(--vscode-panel-border); background: var(--vscode-editor-background); }
    .star-node-card strong { display: flex; justify-content: space-between; gap: 6px; font-size: 11px; }
    .star-node-card strong em { color: var(--lineage-soft); font-style: normal; }
    .star-node-card span { color: var(--vscode-descriptionForeground); font-size: 10px; line-height: 1.35; }
    .endgame-columns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .history-list, .project-list { display: grid; gap: 5px; }
    .history-row, .project-row, .muted-row { display: grid; gap: 2px; padding: 6px 7px; border: 1px solid var(--vscode-panel-border); border-radius: 5px; background: var(--vscode-editorWidget-background); }
    .history-row span, .project-row span, .muted-row { color: var(--vscode-descriptionForeground); font-size: 10px; line-height: 1.35; }
    .project-row.active { border-color: var(--lineage-accent); }
    .decoration-book { gap: 7px; }
    .book-grid { display: flex; flex-wrap: wrap; gap: 5px; overflow: visible; }
    .book-chip { padding: 4px 6px; border: 1px solid var(--vscode-panel-border); border-radius: 999px; font-size: 10px; font-weight: 700; line-height: 1; }
    .book-chip.locked { color: var(--vscode-descriptionForeground); border-style: dashed; opacity: .68; }
    .book-chip.owned { border-color: var(--lineage-accent); background: var(--vscode-editorWidget-background); box-shadow: inset 2px 0 0 var(--lineage-accent); }
    .endgame-mini-command { justify-self: start; height: 28px; min-height: 28px; padding: 4px 7px; font-size: 10px; }
    .endgame-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .action-dock { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; padding-top: 0; }
    button { min-height: 32px; padding: 6px 10px; border-radius: 5px; border: 1px solid var(--vscode-panel-border); color: var(--vscode-button-secondaryForeground, var(--vscode-foreground)); background: var(--vscode-button-secondaryBackground, var(--vscode-editorWidget-background)); font-size: 12px; line-height: 1.2; white-space: nowrap; transition: transform .16s ease, background .16s ease, border-color .16s ease; }
    button:focus-visible { outline: 1px solid var(--vscode-focusBorder); outline-offset: 2px; }
    button:hover { background: var(--vscode-button-secondaryHoverBackground, var(--vscode-list-hoverBackground)); }
    button:active { transform: translateY(1px) scale(.99); }
    button:disabled { cursor: not-allowed; opacity: .45; }
    button:disabled:hover { background: var(--vscode-button-secondaryBackground, var(--vscode-editorWidget-background)); }
    .action-btn { height: 44px; min-height: 44px; display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 6px; align-items: center; padding: 7px 8px; border-color: var(--vscode-panel-border); background: var(--vscode-editorWidget-background); color: var(--vscode-foreground); }
    .action-btn:hover { border-color: var(--lineage-accent); background: var(--vscode-list-hoverBackground, var(--vscode-editorWidget-background)); }
    .action-btn.action-primary { border-color: var(--lineage-accent); background: var(--vscode-editorWidget-background); box-shadow: inset 0 -2px 0 var(--lineage-accent); }
    .action-rune { display: grid; place-items: center; width: 26px; height: 26px; border: 1px solid var(--vscode-panel-border); border-radius: 4px; background: var(--vscode-editor-background); color: var(--vscode-descriptionForeground); font-family: var(--vscode-editor-font-family); font-size: 9px; font-weight: 800; letter-spacing: 0; }
    .action-label { min-width: 0; display: block; overflow: hidden; text-overflow: clip; white-space: normal; overflow-wrap: anywhere; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 0; line-height: 1.12; }
    .page-footer { width: 100%; color: var(--vscode-descriptionForeground); font-size: 11px; text-align: right; }
    .guide-overlay[hidden] { display: none; }
    .guide-overlay { position: fixed; inset: 0; z-index: 20; display: grid; place-items: start center; padding: 58px 20px 20px; background: rgba(0,0,0,.32); }
    .guide-panel { width: min(560px, 100%); max-height: calc(100vh - 86px); display: flex; flex-direction: column; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editorWidget-background); color: var(--vscode-foreground); box-shadow: 0 18px 48px rgba(0,0,0,.34); overflow: hidden; }
    .guide-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 13px 14px; border-bottom: 1px solid var(--vscode-panel-border); background: var(--vscode-editorWidget-background); box-shadow: inset 0 -2px 0 var(--lineage-accent); }
    .guide-header h2 { margin: 0; font-size: 15px; line-height: 1.25; letter-spacing: 0; }
    .guide-close { width: 28px; min-width: 28px; height: 28px; min-height: 28px; padding: 0; border-radius: 999px; display: grid; place-items: center; font-size: 16px; line-height: 1; }
    .guide-body { display: grid; gap: 12px; min-height: 0; padding: 14px; overflow: auto; }
    .guide-section { display: grid; gap: 5px; padding-bottom: 11px; border-bottom: 1px solid color-mix(in srgb, var(--vscode-panel-border) 72%, transparent); }
    .guide-section:last-child { padding-bottom: 0; border-bottom: 0; }
    .guide-section h3 { margin: 0; color: var(--lineage-accent); font-size: 12px; line-height: 1.25; letter-spacing: 0; }
    .guide-section p { margin: 0; color: var(--vscode-descriptionForeground); font-size: 12px; line-height: 1.55; }
    .guide-care-list { margin: 2px 0 0; padding: 0; list-style: none; display: grid; gap: 5px; }
    .guide-care-list li { position: relative; padding: 6px 8px 6px 19px; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-editor-background); color: var(--vscode-foreground); font-size: 11px; line-height: 1.35; }
    .guide-care-list li::before { content: ""; position: absolute; left: 8px; top: 13px; width: 5px; height: 5px; border-radius: 50%; background: var(--lineage-accent); }
    @media (max-width: 680px) {
      body { height: auto; min-height: 100vh; overflow: auto; }
      .page-shell { height: auto; }
      .hud-shell { grid-template-columns: 1fr; }
      .monster-card, .systems-card { height: auto; min-height: 520px; }
      .stat-deck, .skill-matrix, .meta-strip, .action-dock, .quest-options, .endgame-grid, .endgame-top, .star-tree-grid, .endgame-columns, .tab-nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .meta-strip div { border-right: 0; border-bottom: 1px solid var(--vscode-panel-border); }
      .page-footer { text-align: left; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .001ms !important; }
      .monster-sprite, .star-orbit, .boss-sigil, .pixel-heart, .moment-banner { animation: none !important; }
    }
  </style>
</head>
<body>
  <main class="page-shell" style="${lineageTheme}">
  ${momentBanner}
  <div class="lang-bar">${langButtons}<div class="top-actions"><button class="top-action-btn" data-command="rename" type="button">${renderHtmlTemplate.escape(i18n.t("ui.rename"))}</button><button class="top-action-btn danger" data-command="reset" type="button">${renderHtmlTemplate.escape(i18n.t("ui.reset"))}</button><button class="guide-btn" type="button" data-guide-open aria-label="${helpLabel}" title="${helpLabel}">?</button></div></div>
  <section id="guide-panel" class="guide-overlay" hidden aria-label="${guideTitle}">
    <div class="guide-panel" role="dialog" aria-modal="true" aria-labelledby="guide-title">
      <div class="guide-header">
        <h2 id="guide-title">${guideTitle}</h2>
        <button class="guide-close" type="button" data-guide-close aria-label="${guideClose}" title="${guideClose}">×</button>
      </div>
      <div class="guide-body">
        <section class="guide-section"><h3>${guideTabsTitle}</h3><p>${guideTabsBody}</p></section>
        <section class="guide-section"><h3>${guideGoalsTitle}</h3><p>${guideGoalsBody}</p></section>
        <section class="guide-section"><h3>${guideEndgameTitle}</h3><p>${guideEndgameBody}</p></section>
        <section class="guide-section"><h3>${guideCollectionTitle}</h3><p>${guideCollectionBody}</p></section>
        <section class="guide-section"><h3>${guideGrowthTitle}</h3><p>${guideGrowthBody}</p></section>
        <section class="guide-section"><h3>${guideCareTitle}</h3><p>${guideCareIntro}</p>${guideCareList}</section>
        <section class="guide-section"><h3>${guideUsageTitle}</h3><p>${guideUsageBody}</p></section>
        <section class="guide-section"><h3>${guidePatTitle}</h3><p>${guidePatBody}</p></section>
        <section class="guide-section"><h3>${guideReviveTitle}</h3><p>${guideReviveBody}</p></section>
      </div>
    </div>
  </section>
  <div class="hud-shell">
    <section class="monster-card${reincarnationTier}">
      <div class="card-topline">
        <span class="card-lineage">${lineage}</span>
        <strong class="card-level">Lv.${state.level}</strong>
      </div>
      <div class="sprite-stage">${pet}${patHeart}${starOrbit}</div>
      <div class="nameplate">
        <h1 class="name">${petName}</h1>
        <div class="callsign">Gitagotchi Lv.${state.level}</div>
      </div>
      <div class="card-footer">
        <div class="trait-row">
          <span class="card-rarity">${stage}</span>
          <span class="affinity-chip">${affinity}</span>
        </div>
        <div class="decoration-row" aria-label="${renderHtmlTemplate.escape(i18n.t("ui.decorations"))}">${decorations}</div>
        ${equippedDecorations}
        <div class="expbar" aria-label="Card EXP"><span style="width:${expPercent}%"></span></div>
      </div>
    </section>
    <section class="systems-card">
      <div class="topline"><strong class="level-badge">Lv.${state.level}</strong><div class="title-stack"><span>${renderHtmlTemplate.escape(i18n.t("ui.profile"))}</span><strong>${petName}</strong></div><span class="exp-readout">${state.exp}/${getRequiredExp(state.level)} ${i18n.t("ui.exp")}</span></div>
      <nav class="tab-nav" role="tablist" aria-label="${renderHtmlTemplate.escape(i18n.t("ui.tab.sections"))}">${tabNav}</nav>
      <div class="action-dock">${actionButtons}</div>
      <section class="tab-panel active" role="tabpanel" id="tab-panel-status" aria-labelledby="tab-status" data-tab-panel="status">
        <div class="expbar" aria-label="EXP"><span style="width:${expPercent}%"></span></div>
        <div class="stat-deck">
          <div class="stat-card ${meterClass(state.mood)}"><span class="label">${i18n.t("ui.mood")}</span><strong>${state.mood}%</strong><i style="width:${state.mood}%"></i></div>
          <div class="stat-card ${meterClass(fullness)}"><span class="label">${i18n.t("ui.fullness")}</span><strong>${fullness}%</strong><i style="width:${fullness}%"></i></div>
          <div class="stat-card ${meterClass(state.energy)}"><span class="label">${i18n.t("ui.energy")}</span><strong>${state.energy}%</strong><i style="width:${state.energy}%"></i></div>
          <div class="stat-card ${meterClass(state.health)}"><span class="label">${i18n.t("ui.health")}</span><strong>${state.health}%</strong><i style="width:${state.health}%"></i></div>
        </div>
        <div class="meta-strip">
          <div><span>${i18n.t("ui.status")}</span><strong>${status}</strong></div>
          <div><span>${i18n.t("ui.stage")}</span><strong>${stage}</strong></div>
          <div><span>${i18n.t("ui.lineage")}</span><strong>${lineage}</strong></div>
          <div><span>${i18n.t("ui.affinity")}</span><strong>${affinity}</strong></div>
        </div>
        ${evolutionPreview}
        ${lineageSkillTree}
        <div class="skill-matrix">${styleRows}</div>
      </section>
      <section class="tab-panel" role="tabpanel" id="tab-panel-goals" aria-labelledby="tab-goals" data-tab-panel="goals" hidden>
        ${questBoard}
        ${classQuestBoard}
        ${renderTeamRaid(state, i18n)}
      </section>
      <section class="tab-panel" role="tabpanel" id="tab-panel-endgame" aria-labelledby="tab-endgame" data-tab-panel="endgame" hidden>
        ${endgameBoard}
      </section>
      <section class="tab-panel" role="tabpanel" id="tab-panel-collection" aria-labelledby="tab-collection" data-tab-panel="collection" hidden>
        ${collectionBoard}
      </section>
    </section>
  </div>
  <footer class="page-footer">Copyright 2026 Hobby. All rights reserved.</footer>
  </main>
  <script nonce="${options.nonce}">
    const vscode = acquireVsCodeApi();
    document.querySelectorAll('button[data-command]').forEach((button) => {
      button.addEventListener('click', () => vscode.postMessage({ command: button.dataset.command, questId: button.dataset.questId, classId: button.dataset.classId, bossId: button.dataset.bossId, starNodeId: button.dataset.starNodeId, decorationId: button.dataset.decorationId }));
    });
    document.querySelectorAll('button[data-locale]').forEach((button) => {
      button.addEventListener('click', () => vscode.postMessage({ command: 'changeLanguage', locale: button.dataset.locale }));
    });
    const tabButtons = Array.from(document.querySelectorAll('[data-tab-target]'));
    const tabPanels = Array.from(document.querySelectorAll('[data-tab-panel]'));
    const activateTab = (target) => {
      tabButtons.forEach((button) => {
        const active = button.dataset.tabTarget === target;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
      });
      tabPanels.forEach((panel) => {
        panel.hidden = panel.dataset.tabPanel !== target;
        panel.classList.toggle('active', panel.dataset.tabPanel === target);
      });
    };
    tabButtons.forEach((button, index) => {
      button.tabIndex = index === 0 ? 0 : -1;
      button.addEventListener('click', () => activateTab(button.dataset.tabTarget));
      button.addEventListener('keydown', (event) => {
        const current = tabButtons.indexOf(button);
        const offset = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
        if (event.key === 'Home' || event.key === 'End' || offset !== 0) {
          event.preventDefault();
          const next = event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? tabButtons.length - 1
              : (current + offset + tabButtons.length) % tabButtons.length;
          const nextButton = tabButtons[next];
          activateTab(nextButton.dataset.tabTarget);
          nextButton.focus();
        }
      });
    });
    const guidePanel = document.getElementById('guide-panel');
    const guideOpen = document.querySelector('[data-guide-open]');
    const guideCloseButtons = document.querySelectorAll('[data-guide-close]');
    let guideReturnFocus = null;
    const getGuideFocusable = () => Array.from(guidePanel?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? [])
      .filter((item) => !item.disabled && item.offsetParent !== null);
    const closeGuide = () => {
      if (!guidePanel || guidePanel.hidden) {
        return;
      }
      guidePanel.hidden = true;
      guideReturnFocus?.focus?.();
    };
    guideOpen?.addEventListener('click', () => {
      guideReturnFocus = document.activeElement;
      guidePanel.hidden = false;
      getGuideFocusable()[0]?.focus?.();
    });
    guideCloseButtons.forEach((button) => {
      button.addEventListener('click', closeGuide);
    });
    guidePanel?.addEventListener('click', (event) => {
      if (event.target === guidePanel) {
        closeGuide();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && guidePanel && !guidePanel.hidden) {
        closeGuide();
      }
      if (event.key === 'Tab' && guidePanel && !guidePanel.hidden) {
        const focusable = getGuideFocusable();
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) {
          return;
        }
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  </script>
</body>
</html>`;
}
