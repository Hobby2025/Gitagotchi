import { LeaderboardDocument, LeaderboardSyncAdapter } from './leaderboardTypes';

type FetchLike = (url: string | URL, init?: RequestInit) => Promise<Response>;

export type GithubGistLeaderboardAdapterOptions = {
  gistId: string;
  token: string;
  fetch?: FetchLike;
};

export class GithubGistLeaderboardAdapter implements LeaderboardSyncAdapter {
  private readonly fetch: FetchLike;

  constructor(private readonly options: GithubGistLeaderboardAdapterOptions) {
    this.fetch = options.fetch ?? fetch;
  }

  async load(): Promise<LeaderboardDocument | undefined> {
    if (!this.options.gistId) {
      return undefined;
    }

    const response = await this.fetch(`https://api.github.com/gists/${this.options.gistId}`, {
      method: 'GET',
      headers: this.headers()
    });

    if (response.status === 404) {
      return undefined;
    }

    await assertOk(response);
    const gist = await response.json() as { files?: Record<string, { content?: string }> };
    const content = gist.files?.['leaderboard.json']?.content;

    return content ? JSON.parse(content) as LeaderboardDocument : undefined;
  }

  async save(document: LeaderboardDocument): Promise<void> {
    if (!this.options.gistId) {
      return;
    }

    const response = await this.fetch(`https://api.github.com/gists/${this.options.gistId}`, {
      method: 'PATCH',
      headers: this.headers(),
      body: JSON.stringify({
        files: {
          'leaderboard.json': {
            content: JSON.stringify(document, null, 2)
          }
        }
      })
    });

    await assertOk(response);
  }

  private headers(): Record<string, string> {
    return {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${this.options.token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
  }
}

async function assertOk(response: Response): Promise<void> {
  if (response.ok) {
    return;
  }

  const error = new Error(await response.text()) as Error & { status?: number };
  error.status = response.status;
  throw error;
}
