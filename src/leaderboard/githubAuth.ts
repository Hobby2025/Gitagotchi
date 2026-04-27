import * as vscode from 'vscode';

export type GithubIdentity = {
  token: string;
  login: string;
};

export async function getGithubIdentity(createIfNone: boolean): Promise<GithubIdentity | undefined> {
  const session = await vscode.authentication.getSession('github', ['gist', 'read:user'], { createIfNone });
  if (!session) {
    return undefined;
  }

  const response = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${session.accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  if (!response.ok) {
    return undefined;
  }

  const profile = await response.json() as { login?: string };
  if (!profile.login) {
    return undefined;
  }

  return {
    token: session.accessToken,
    login: profile.login
  };
}
