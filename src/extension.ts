import * as vscode from 'vscode';
import { countWorkspaceDiagnostics, createDiagnosticsEventIfChanged } from './adapters/diagnosticsAdapter';
import { createCommitEventIfChanged, getLatestCommit, getNumstatDiff } from './adapters/gitAdapter';
import { PetStateStore } from './adapters/storageAdapter';
import { registerDebouncedSaveHandler, registerInterval } from './adapters/vscodeEventAdapter';
import { analyzeDiff } from './core/diffAnalyzer';
import { ActivityEvent } from './core/events';
import { DailyQuestId, DecorationId, PetClassId, PetState, RaidBossId, StarTreeNodeId } from './core/petState';
import { createI18n, I18n } from './i18n';
import { createPetLifecycleService, PetLifecycleService } from './application/petLifecycleService';
import { discoverCurrentPetSprite } from './character/petDex';
import { GitagotchiDexPanel } from './ui/dexPanel';
import { GitagotchiLogPanel } from './ui/logPanel';
import { GitagotchiPetPanel } from './ui/petPanel';
import { GitagotchiSkillPanel } from './ui/skillPanel';
import { GitagotchiStatusBar } from './ui/statusBar';

type Runtime = {
  store: PetStateStore;
  statusBar: GitagotchiStatusBar;
  petPanel: GitagotchiPetPanel;
  logs: GitagotchiLogPanel;
  skills: GitagotchiSkillPanel;
  dex: GitagotchiDexPanel;
  diagnosticsCount: number;
  i18n: I18n;
  lifecycle: PetLifecycleService;
};

async function persistAndRender(runtime: Runtime, state: PetState): Promise<void> {
  const discovered = discoverCurrentPetSprite(state);
  await runtime.store.save(discovered);
  runtime.statusBar.update(discovered);
  runtime.petPanel.update(discovered);
  runtime.skills.update(discovered);
  runtime.dex.update(discovered);
}

async function applyEvent(runtime: Runtime, event: ActivityEvent): Promise<void> {
  const project = getWorkspaceProjectContext();
  const next = runtime.lifecycle.applyActivityEvent(runtime.store.load(), {
    ...event,
    projectKey: project.key,
    projectLabel: project.label
  }, runtime.i18n);
  await persistAndRender(runtime, next);
}

function getWorkspaceProjectContext(): { key: string; label: string } {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    return { key: 'workspace', label: 'Workspace' };
  }

  return {
    key: folder.uri.fsPath || folder.name,
    label: folder.name
  };
}

async function checkDiff(runtime: Runtime): Promise<void> {
  try {
    const diff = await getNumstatDiff();
    const stats = analyzeDiff(diff);
    if (stats.files === 0) {
      return;
    }

    await applyEvent(runtime, {
      type: 'diff',
      stats,
      occurredAt: new Date().toISOString()
    });
  } catch {
    // Git is optional: non-repository workspaces simply do not apply diff events.
  }
}

async function checkCommit(runtime: Runtime): Promise<void> {
  try {
    const latest = await getLatestCommit();
    if (!latest) {
      return;
    }

    const event = createCommitEventIfChanged(runtime.store.load().lastCommitHash, latest.hash, latest.message);
    if (event) {
      await applyEvent(runtime, event);
    }
  } catch {
    // Ignore workspaces without a commit history.
  }
}

async function checkDiagnostics(runtime: Runtime): Promise<void> {
  const current = countWorkspaceDiagnostics();
  const event = createDiagnosticsEventIfChanged(runtime.diagnosticsCount, current);
  runtime.diagnosticsCount = current;

  if (event) {
    await applyEvent(runtime, event);
  }
}

async function applyIdle(runtime: Runtime): Promise<void> {
  await applyEvent(runtime, {
    type: 'idleTick',
    now: new Date().toISOString(),
    occurredAt: new Date().toISOString()
  });
}

async function patPet(runtime: Runtime): Promise<void> {
  const next = runtime.lifecycle.pat(runtime.store.load(), new Date(), runtime.i18n);
  await persistAndRender(runtime, next);
}

async function reviveGitagotchi(runtime: Runtime): Promise<void> {
  const result = runtime.lifecycle.revive(runtime.store.load(), new Date(), runtime.i18n);

  if (!result.revived) {
    const message = result.reason === 'notDead'
      ? runtime.i18n.t('notice.reviveNotDead')
      : runtime.i18n.t('notice.reviveNotEnough', { exp: result.availableExp });
    await vscode.window.showInformationMessage(message);
    return;
  }

  await persistAndRender(runtime, result.state);
  await vscode.window.showInformationMessage(runtime.i18n.t('notice.revived'));
}

async function chooseDailyQuest(runtime: Runtime, questId: DailyQuestId): Promise<void> {
  const next = runtime.lifecycle.selectQuest(runtime.store.load(), questId, new Date());
  await persistAndRender(runtime, next);
}

async function choosePetClass(runtime: Runtime, classId: PetClassId): Promise<void> {
  const next = runtime.lifecycle.selectClass(runtime.store.load(), classId);
  await persistAndRender(runtime, next);
}

async function chooseRaidBoss(runtime: Runtime, bossId: RaidBossId): Promise<void> {
  const next = runtime.lifecycle.startRaid(runtime.store.load(), bossId, new Date());
  await persistAndRender(runtime, next);
}

async function craftLabStarShard(runtime: Runtime): Promise<void> {
  const before = runtime.store.load();
  const next = runtime.lifecycle.craftStarShard(before);
  await persistAndRender(runtime, next);
}

async function investStar(runtime: Runtime, nodeId: StarTreeNodeId): Promise<void> {
  const next = runtime.lifecycle.investStar(runtime.store.load(), nodeId);
  await persistAndRender(runtime, next);
}

async function toggleDecoration(runtime: Runtime, decoration: DecorationId): Promise<void> {
  const next = runtime.lifecycle.toggleDecoration(runtime.store.load(), decoration);
  await persistAndRender(runtime, next);
}

async function copyWeeklyReview(runtime: Runtime): Promise<void> {
  const state = runtime.store.load();
  const review = state.endgame.weeklyReview;
  if (!review) {
    await vscode.window.showInformationMessage(runtime.i18n.t('notice.weeklyReviewEmpty'));
    return;
  }

  const card = [
    `${state.name?.trim() || 'Gitagotchi'} · ${runtime.i18n.t('ui.weeklyReview')}`,
    `${runtime.i18n.t(review.title)}`,
    `${runtime.i18n.t(review.summary)}`,
    `${runtime.i18n.t('ui.mastery')}: ${runtime.i18n.t('ui.masteryValue', { rank: state.endgame.masteryRank, stars: state.endgame.stars })}`,
    `${runtime.i18n.t('ui.season')}: ${state.endgame.season.progress}/500`
  ].join('\n');

  await vscode.env.clipboard.writeText(card);
  await vscode.window.showInformationMessage(runtime.i18n.t('notice.weeklyReviewCopied'));
}

async function reincarnateGitagotchi(runtime: Runtime): Promise<void> {
  const state = runtime.store.load();
  const choice = await vscode.window.showWarningMessage(
    runtime.i18n.t('prompt.reincarnateConfirm'),
    { modal: true },
    runtime.i18n.t('prompt.reincarnateAction')
  );

  if (choice !== runtime.i18n.t('prompt.reincarnateAction')) {
    return;
  }

  const result = runtime.lifecycle.reincarnate(state, new Date());
  if (!result.reincarnated) {
    await vscode.window.showInformationMessage(runtime.i18n.t(`notice.reincarnate.${result.reason}`));
    return;
  }

  await persistAndRender(runtime, result.state);
  await vscode.window.showInformationMessage(runtime.i18n.t('notice.reincarnated', { stars: result.starsGained }));
}

async function renamePet(runtime: Runtime, prompt = runtime.i18n.t('prompt.rename')): Promise<void> {
  const state = runtime.store.load();
  const value = await vscode.window.showInputBox({
    prompt,
    placeHolder: 'Mochi',
    value: state.name ?? '',
    ignoreFocusOut: true,
    validateInput(input) {
      return input.trim() ? undefined : runtime.i18n.t('prompt.nameRequired');
    }
  });

  if (value === undefined) {
    return;
  }

  await persistAndRender(runtime, {
    ...state,
    name: value.trim()
  });
}

async function ensurePetName(runtime: Runtime): Promise<void> {
  if (!runtime.store.load().name?.trim()) {
    await renamePet(runtime, runtime.i18n.t('prompt.renameBegin'));
  }
}

async function resetPet(runtime: Runtime): Promise<void> {
  const choice = await vscode.window.showWarningMessage(
    runtime.i18n.t('prompt.resetConfirm'),
    { modal: true },
    runtime.i18n.t('prompt.resetAction')
  );

  if (choice !== runtime.i18n.t('prompt.resetAction')) {
    return;
  }

  const reset = await runtime.store.reset();
  runtime.statusBar.update(reset);
  runtime.petPanel.update(reset);
  await renamePet(runtime, runtime.i18n.t('prompt.renameBegin'));
}

export function activate(context: vscode.ExtensionContext): void {
  const i18n = createI18n(vscode.env.language);
  const store = new PetStateStore(context.globalState);
  const statusBar = new GitagotchiStatusBar(i18n);
  const petPanel = new GitagotchiPetPanel(i18n, context.extensionUri);
  const logs = new GitagotchiLogPanel(i18n);
  const skills = new GitagotchiSkillPanel(i18n);
  const dex = new GitagotchiDexPanel(i18n);
  const lifecycle = createPetLifecycleService();
  const runtime: Runtime = {
    store,
    statusBar,
    petPanel,
    logs,
    skills,
    dex,
    diagnosticsCount: countWorkspaceDiagnostics(),
    i18n,
    lifecycle
  };

  context.subscriptions.push(statusBar);
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.openPet', async () => {
    const state = discoverCurrentPetSprite(store.load());
    await store.save(state);
    petPanel.show(state);
  }));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.renamePet', () => renamePet(runtime)));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.resetPet', () => resetPet(runtime)));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.patPet', () => patPet(runtime)));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.revivePet', () => reviveGitagotchi(runtime)));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.viewStats', () => logs.show(store.load())));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.viewSkills', () => skills.show(store.load())));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.openDex', async () => {
    const state = discoverCurrentPetSprite(store.load());
    await store.save(state);
    dex.show(state);
  }));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.checkCommit', () => checkCommit(runtime)));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.selectQuest', (questId?: DailyQuestId) => {
    if (!questId) {
      return;
    }
    void chooseDailyQuest(runtime, questId);
  }));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.selectClass', (classId?: PetClassId) => {
    if (!classId) {
      return;
    }
    void choosePetClass(runtime, classId);
  }));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.startRaid', (bossId?: RaidBossId) => {
    if (!bossId) {
      return;
    }
    void chooseRaidBoss(runtime, bossId);
  }));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.craftStarShard', () => craftLabStarShard(runtime)));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.investStar', (nodeId?: StarTreeNodeId) => {
    if (!nodeId) {
      return;
    }
    void investStar(runtime, nodeId);
  }));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.toggleDecoration', (decoration?: DecorationId) => {
    if (!decoration) {
      return;
    }
    void toggleDecoration(runtime, decoration);
  }));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.copyWeeklyReview', () => copyWeeklyReview(runtime)));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.reincarnatePet', () => reincarnateGitagotchi(runtime)));
  context.subscriptions.push(vscode.commands.registerCommand('gitagotchi.changeLanguage', (locale?: string) => {
    if (!locale) {
      return;
    }
    const newI18n = createI18n(locale);
    runtime.i18n = newI18n;
    statusBar.setI18n(newI18n);
    statusBar.update(store.load());
    petPanel.setI18n(newI18n);
    logs.setI18n(newI18n);
    skills.setI18n(newI18n);
    dex.setI18n(newI18n);
  }));
  context.subscriptions.push(vscode.languages.onDidChangeDiagnostics(() => {
    void checkDiagnostics(runtime);
  }));

  registerDebouncedSaveHandler(context, () => checkDiff(runtime), 5000);
  registerInterval(context, () => checkDiff(runtime), 30000);
  registerInterval(context, () => checkCommit(runtime), 30000);
  registerInterval(context, () => applyIdle(runtime), 60 * 60 * 1000);

  const initial = store.load();
  statusBar.update(initial);
  void ensurePetName(runtime);
}

export function deactivate(): void {}
