import { GithubGistLeaderboardAdapter } from '../src/leaderboard/githubGistAdapter';

describe('GitHub Gist leaderboard adapter', () => {
  it('loads leaderboard.json from a gist file', async () => {
    const adapter = new GithubGistLeaderboardAdapter({
      gistId: 'gist-id',
      token: 'token',
      fetch: async () => response(200, {
        files: {
          'leaderboard.json': {
            content: JSON.stringify({
              version: 1,
              updatedAt: '2026-04-27T00:00:00.000Z',
              players: []
            })
          }
        }
      })
    });

    await expect(adapter.load()).resolves.toEqual({
      version: 1,
      updatedAt: '2026-04-27T00:00:00.000Z',
      players: []
    });
  });

  it('saves leaderboard.json with a PATCH request', async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const adapter = new GithubGistLeaderboardAdapter({
      gistId: 'gist-id',
      token: 'token',
      fetch: async (url, init) => {
        calls.push({ url: String(url), init });
        return response(200, {});
      }
    });

    await adapter.save({
      version: 1,
      updatedAt: '2026-04-27T00:00:00.000Z',
      players: []
    });

    expect(calls[0].url).toBe('https://api.github.com/gists/gist-id');
    expect(calls[0].init?.method).toBe('PATCH');
    expect(calls[0].init?.headers).toMatchObject({
      Authorization: 'Bearer token'
    });
    expect(calls[0].init?.body).toContain('leaderboard.json');
  });

  it('returns undefined when gist id is missing', async () => {
    const adapter = new GithubGistLeaderboardAdapter({
      gistId: '',
      token: 'token',
      fetch: async () => response(200, {})
    });

    await expect(adapter.load()).resolves.toBeUndefined();
  });
});

function response(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return body;
    },
    async text() {
      return JSON.stringify(body);
    }
  } as Response;
}
