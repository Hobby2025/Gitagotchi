import * as vscode from 'vscode';

export type LeaderboardConfig = {
  enabled: boolean;
  gistId: string;
  displayName: string;
};

export function getLeaderboardConfig(): LeaderboardConfig {
  const config = vscode.workspace.getConfiguration('gitagotchi.leaderboard');

  return {
    enabled: config.get<boolean>('enabled', false),
    gistId: config.get<string>('gistId', ''),
    displayName: config.get<string>('displayName', '')
  };
}

export async function updateLeaderboardRoomConfig(gistId: string): Promise<void> {
  const config = vscode.workspace.getConfiguration('gitagotchi.leaderboard');

  await config.update('gistId', gistId, vscode.ConfigurationTarget.Global);
  await config.update('enabled', true, vscode.ConfigurationTarget.Global);
}
