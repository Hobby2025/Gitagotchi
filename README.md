# Gitagotchi

Gitagotchi is a VS Code developer pet that grows from your local development activity. Code changes, commits, diagnostics, documentation, tests, refactoring, quests, raids, seasons, and reincarnation all feed into one long-running pet progression loop.

The extension is designed to stay close to your normal workflow. You do not need to play a separate game. Keep working in VS Code, then open Gitagotchi to see what your activity changed.

Korean user guide: [docs/user-guide-ko.md](https://github.com/Hobby2025/Gitagotchi/blob/main/docs/user-guide-ko.md)

## Quick Start

1. Open a Git repository workspace in VS Code.
2. When Gitagotchi starts for the first time, enter a pet name.
3. Click the Gitagotchi item in the Status Bar, or run `Gitagotchi: Open Pet`.
4. Choose a daily quest from the Goals tab.
5. Keep coding, fixing diagnostics, writing docs, adding tests, and committing as usual.
6. Open the panel again to review growth, quest progress, raid damage, rewards, and collection progress.

Gitagotchi can open outside a Git repository, but Git-based growth works best in a Git workspace.

## Main Panel

The pet panel is split into a pet card and a system card.

The pet card shows:

- Pet sprite, name, level, stage, lineage, and affinity.
- Equipped decorations.
- Reincarnation stars, if earned.
- Card EXP progress.

The system card is organized into four tabs:

- `Status`: core stats, EXP, evolution preview, lineage skills, and style scores.
- `Goals`: daily quest, class quest, and workspace team raid progress.
- `Endgame`: mastery, season, class build, raid boss, season track, star tree, crafting, and reincarnation.
- `Collection`: decoration book, raid clear history, project profiles, and weekly review.

Only the active tab scrolls on desktop. Nested scroll areas are avoided so the panel stays predictable in the VS Code webview.

## Panel Actions

The top action dock includes:

- `Pat`: pat your pet once per day for bonus EXP and mood.
- `Commit`: check the latest commit and apply commit growth.
- `View Stats`: open the activity log and reward history.
- `Skills`: open the skill panel.
- `Dex`: open the discovered-form collection.
- `Revive`: spend earned EXP to revive a dead pet.

The header actions include:

- `Rename`: change your pet's name.
- `Reset`: reset the current pet while keeping discovered Dex forms.
- `?`: open the in-panel guide.
- Language buttons: switch between English, Korean, Japanese, and Chinese.

## Growth

Gitagotchi grows from local development signals.

- Code changes grant EXP based on changed lines and touched files.
- Commits grant larger growth, with extra rewards for messages such as `feat`, `fix`, `hotfix`, and `refactor`.
- Diagnostics rewards are based on reducing VS Code diagnostic problems.
- Refactoring rewards cleanup-heavy diffs.
- Test files, README changes, and config changes add focused bonuses.
- Returning after idle time restores energy.
- Long idle periods can reduce pet stats.

Repeated identical activity can be dampened, and each project has a daily reward cap. This keeps the system focused on real development rather than repetitive farming.

## Stats And Evolution

Gitagotchi tracks these care stats:

- `Mood`
- `Fullness`
- `Energy`
- `Health`

It also tracks five style scores:

- `Feature Throughput`
- `Refactor Craft`
- `Bug Radar`
- `Docs Literacy`
- `Commit Streak`

Style scores influence lineage, affinity, skills, and final identity.

Evolution stages:

- `Egg`: starting form.
- `Hatchling`: begins at level 2.
- `Toolkit`: requires level 5 and stable care stats.
- `Specialist`: requires level 15, stronger care stats, and alive status.
- `Ultimate`: requires level 30, balanced style mastery, enough total activity, and strong care stats.

The Status tab shows the next evolution requirements so you can see what is blocking the next form.

## Daily Quests

Each day offers three quest options. Pick one before starting your work. A selected quest progresses from normal development activity.

Daily quest types include:

- `Bug Hunt`: reduce diagnostics.
- `Deep Clean`: make a cleanup-heavy diff.
- `Field Guide`: edit docs or text files.
- `Ship It`: complete a commit.
- `Balance Training`: work on the currently weakest style area.

Completing a daily quest grants EXP, mood, and a decoration.

## Classes

Classes let high-level users choose a development focus.

Available classes:

- `Release Master`: builder and release-focused work.
- `Code Gardener`: cleanup and refactoring.
- `Bug Tracker`: diagnostics and bug fixing.
- `Archivist`: docs and knowledge capture.
- `Balance Architect`: balanced style growth.

Selecting a class starts class-specific progress and unlocks class quest rewards. Changing class costs EXP.

## Raids

Raids are long-running endgame goals. Choose a boss from the Endgame tab, then keep working. Relevant activity deals damage to the active boss.

Raid bosses:

- `Legacy Dragon`: weak to refactoring and cleanup.
- `Bug Lord`: weak to resolved diagnostics.
- `Release Golem`: weak to commits and test work.
- `Dependency Wraith`: weak to config and dependency work.
- `Breakpoint Hydra`: season-limited, weak to docs, tests, and season progress.

Defeating a boss records the clear and unlocks a boss decoration.

## Seasons, Team Raid, And Project Profiles

Season progress increases from ongoing activity and unlocks milestones at 100, 250, and 500 points. The 500-point milestone can unlock a season relic.

The Goals tab also shows workspace team raid progress. Your development activity contributes to the shared target and grants rewards when the target is cleared.

Project profiles track EXP and raid clears per workspace or project key. This helps long-term users see where their Gitagotchi history came from.

## Star Shards, Reincarnation, And Star Tree

The Endgame tab includes long-term progression systems:

- `Craft Star Shard`: spend EXP to craft a star shard when eligible.
- `Reincarnate`: available after reaching level 30 Ultimate while alive.
- `Star Tree`: spend reincarnation stars on permanent bonuses.

Reincarnation resets the current life loop, including current level and active raid, but keeps long-term records such as stars, discoveries, and collection progress.

Star tree nodes:

- `Raid Might`: improves raid-oriented progression.
- `Steady Care`: supports care stability.
- `Season Memory`: supports season-oriented progress.

## Decorations And Collection

Decorations are collectible reminders of what your Gitagotchi has achieved. They can come from:

- Daily quests.
- Class quests.
- Raid clears.
- Season milestones.
- Long-term endgame actions.

Use the Collection tab to review the decoration book, raid history, project profiles, and weekly review. Click owned decorations on the pet card to equip or unequip them.

## Dex

The Dex tracks every Gitagotchi form you have discovered. Forms are discovered as your pet reaches new stages, lineages, affinities, and ultimate forms.

Resetting your current pet does not clear Dex discoveries.

## Commands

Use these commands from the Command Palette:

- `Gitagotchi: Open Pet`
- `Gitagotchi: Rename Pet`
- `Gitagotchi: Reset Pet`
- `Gitagotchi: Pat Pet`
- `Gitagotchi: Revive Pet`
- `Gitagotchi: View Stats`
- `Gitagotchi: View Skills`
- `Gitagotchi: Open Dex`
- `Gitagotchi: Check Commit`

Some advanced actions, such as selecting quests, choosing classes, starting raids, investing stars, toggling decorations, copying weekly review text, and reincarnating, are available from the pet panel instead of the Command Palette.

## Saved State

Gitagotchi stores pet state in VS Code global storage. Your pet state remains available when you reopen VS Code in the same environment.

Reset clears the current pet loop:

- Name
- Level and current EXP
- Care stats
- Current stage and current identity
- Skills
- Recent activity logs

Reset keeps long-term discoveries:

- Dex forms already discovered

Reincarnation keeps more long-term progression than reset:

- Reincarnation stars
- Dex discoveries
- Decorations and collection progress
- Long-term endgame records

## Release Notes

### 1.0.0

- Added the tabbed pet panel: Status, Goals, Endgame, and Collection.
- Added daily quests with EXP, mood, and decoration rewards.
- Added class builds, class quests, and class-specific rewards.
- Added raid bosses, raid damage, raid clear records, and boss decorations.
- Added season progress, milestones, workspace team raid progress, project profiles, and weekly review cards.
- Added decoration collection and equip/unequip controls.
- Added reincarnation stars, star shard crafting, and star tree investment.
- Added evolution preview requirements and lineage skill tree display.
- Rebalanced level EXP and evolution gates so Gitagotchi reaches visible growth stages sooner.
- Changed the VS Code Status Bar summary to show a compact EXP percentage.
- Backfilled skipped Dex forms when a large EXP reward jumps across multiple evolution stages.
- Lowered revive cost to match the new growth curve.

### 0.1.9

- Prevented diagnostics spikes from killing Gitagotchi directly. Large temporary error bursts now leave the pet in critical health instead of dead.

### 0.1.8

- Added a revive action for dead pets that spends earned EXP and restores stable health, energy, mood, and fullness.
- Added the Revive button, command, and guide text to the pet panel.
- Prevented idle decay from killing pets directly and migrated pets that were previously killed by idle decay back to critical health.
- Improved Korean, Japanese, and Chinese localization across commands, buttons, status text, logs, skills, Dex, and tooltips.

## Developer Notes

To build and test this repository locally:

```bash
npm install
npm run check
```

`npm run check` builds the extension and runs the Vitest suite.
