import { ActivityEvent } from '../core/events';
import { getVscode } from './vscodeAdapter';

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
