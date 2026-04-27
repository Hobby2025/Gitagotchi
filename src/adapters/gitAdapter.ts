import * as cp from 'child_process';
import { ActivityEvent } from '../core/events';

type VscodeModule = typeof import('vscode');

function getVscode(): VscodeModule | undefined {
  try {
    return require('vscode') as VscodeModule;
  } catch {
    return undefined;
  }
}

function getWorkspaceCwd(): string | undefined {
  return getVscode()?.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

export function runGit(args: string[], cwd = getWorkspaceCwd()): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!cwd) {
      resolve('');
      return;
    }

    cp.execFile('git', args, { cwd }, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

export async function getNumstatDiff(): Promise<string> {
  return runGit(['diff', '--numstat']);
}

export async function getLatestCommit(): Promise<{ hash: string; message: string } | undefined> {
  const output = await runGit(['log', '-1', '--pretty=format:%H%x00%s']);
  if (!output) {
    return undefined;
  }

  const [hash, message = ''] = output.split(String.fromCharCode(0));
  return { hash, message };
}

export function createCommitEventIfChanged(
  previousHash: string | undefined,
  currentHash: string,
  message: string,
  occurredAt = new Date().toISOString()
): ActivityEvent | undefined {
  if (!currentHash || previousHash === currentHash) {
    return undefined;
  }

  return {
    type: 'commit',
    hash: currentHash,
    message,
    occurredAt
  };
}
