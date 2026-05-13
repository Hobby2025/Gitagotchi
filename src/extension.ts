import * as vscode from 'vscode';
import { countWorkspaceDiagnostics, createDiagnosticsEventIfChanged } from './adapters/diagnosticsAdapter';
import { createCommitEventIfChanged, getLatestCommit, getNumstatDiff } from './adapters/gitAdapter';
import { PetStateStore } from './adapters/storageAdapter';
import { registerDebouncedSaveHandler, registerInterval } from './adapters/vscodeEventAdapter';
import { analyzeDiff } from './core/diffAnalyzer';
import { ActivityEvent } from './core/events';
import { applyDailyPat } from './core/dailyPat';
import { applyActivity } from './core/growthEngine';
import { PetState } from './core/petState';
import { applyRevivePet } from './core/revive';
import { createI18n, I18n } from './i18n';
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
  const next = applyActivity(runtime.store.load(), event, undefined, runtime.i18n);
  await persistAndRender(runtime, next);
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
  const next = applyDailyPat(runtime.store.load(), new Date(), runtime.i18n);
  await persistAndRender(runtime, next);
}

async function reviveGitagotchi(runtime: Runtime): Promise<void> {
  const result = applyRevivePet(runtime.store.load(), new Date(), runtime.i18n);

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
  await renamePet(runtime, 'Name your new Gitagotchi');
}

export function activate(context: vscode.ExtensionContext): void {
  const i18n = createI18n(vscode.env.language);
  const store = new PetStateStore(context.globalState);
  const statusBar = new GitagotchiStatusBar(i18n);
  const petPanel = new GitagotchiPetPanel(i18n, context.extensionUri);
  const logs = new GitagotchiLogPanel(i18n);
  const skills = new GitagotchiSkillPanel(i18n);
  const dex = new GitagotchiDexPanel(i18n);
  const runtime: Runtime = {
    store,
    statusBar,
    petPanel,
    logs,
    skills,
    dex,
    diagnosticsCount: countWorkspaceDiagnostics(),
    i18n
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
