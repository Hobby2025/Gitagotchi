import { ActivityEvent } from '../core/events';

type VscodeModule = typeof import('vscode');

function getVscode(): VscodeModule | undefined {
  try {
    return require('vscode') as VscodeModule;
  } catch {
    return undefined;
  }
}

export function countWorkspaceDiagnostics(): number {
  return getVscode()?.languages.getDiagnostics().reduce((total, [, diagnostics]) => total + diagnostics.length, 0) ?? 0;
}

export function createDiagnosticsEventIfChanged(
  previous: number,
  current: number,
  occurredAt = new Date().toISOString()
): ActivityEvent | undefined {
  if (previous === current) {
    return undefined;
  }

  return {
    type: 'diagnostics',
    previous,
    current,
    occurredAt
  };
}
