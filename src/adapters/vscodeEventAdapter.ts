import * as vscode from 'vscode';

export function registerDebouncedSaveHandler(
  context: vscode.ExtensionContext,
  callback: () => void | Promise<void>,
  delayMs = 5000
): void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(() => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      void callback();
    }, delayMs);
  }));
}

export function registerInterval(
  context: vscode.ExtensionContext,
  callback: () => void | Promise<void>,
  intervalMs: number
): void {
  const timer = setInterval(() => {
    void callback();
  }, intervalMs);

  context.subscriptions.push({ dispose: () => clearInterval(timer) });
}
