# Gitagotchi Security Notes

## Leaderboard data

Gitagotchi only publishes public leaderboard snapshots to GitHub Gist:

- GitHub login
- display name
- level
- EXP
- avatar key
- update timestamp

The extension must not publish file names, repository names, project names, raw diff data, commit messages, diagnostics counts, local activity logs, or work timestamps.

## GitHub authentication

GitHub access tokens are obtained through VSCode Authentication and kept in memory for API calls. Tokens are not written to `globalState`, workspace files, logs, or the leaderboard document.

## Webviews

Webviews use Content Security Policy headers. The sidebar allows scripts only through a generated nonce and restricts local resources to `resources/littlejs`. Log and leaderboard panels run with scripts disabled.

## Failure behavior

Leaderboard sync failures must not affect local pet growth. The extension should keep local state authoritative and treat leaderboard sync as optional.
