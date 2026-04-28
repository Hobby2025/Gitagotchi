# Gitagotchi

Gitagotchi is a VS Code pet extension that grows from local development activity:
Git diffs, commits, diagnostics improvements, and idle time.

## Features

- Status Bar entrypoint with a rich hover tooltip.
- Click-to-open Gitagotchi pet panel with the animated monster and quick actions.
- First-run pet naming prompt with a rename command.
- Growth from unstaged Git diffs and new commits.
- Diagnostics-based feedback when problems are resolved or introduced.
- Pet state, levels, evolution stages, style scores, and skill unlocks.
- Local activity log panel.
- Optional GitHub Gist leaderboard sync.
- English, Korean, Japanese, and Chinese UI strings.

## Development Setup

```bash
npm install
npm run check
```

`npm run check` builds the extension and runs the Vitest suite.

## Manual Extension Host Test

1. Open this repository in VS Code.
2. Run `npm install` if dependencies are not installed.
3. Open the Run and Debug panel.
4. Start `Run Gitagotchi Extension`.
5. In the Extension Development Host window, open a Git repository workspace.
6. Enter a pet name when the first-run prompt appears.
7. Find the Gitagotchi item in the VS Code Status Bar.
8. Hover over it and confirm the pet stats tooltip appears.
9. Click it and confirm the Gitagotchi pet panel opens with the monster sprite.
10. Exercise these quick actions from the pet panel:
   - `Gitagotchi: Feed`
   - `Gitagotchi: View Stats`
   - `Gitagotchi: Check Commit`
   - `Gitagotchi: Leaderboard`
   - `Gitagotchi: Create Leaderboard`
   - `Gitagotchi: Rename Pet`
   - `Gitagotchi: Reset Pet`

## Leaderboard Setup

Leaderboard sync is disabled by default. To use it:

1. Run `Gitagotchi: Create Leaderboard`, or create a Gist containing `leaderboard.json`.
2. Set `gitagotchi.leaderboard.enabled` to `true`.
3. Set `gitagotchi.leaderboard.gistId` if you are joining an existing room.
4. Optionally set `gitagotchi.leaderboard.displayName`.

GitHub authentication uses VS Code Authentication with `gist` and `read:user` scopes.

## Build Output

The extension entrypoint is `dist/extension.js`. The build script cleans `dist` before compiling so test files are not emitted into the product build.
