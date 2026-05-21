# Gitagotchi

Gitagotchi is a small developer pet for VS Code. It grows from your local development activity, including code changes, commits, and resolved diagnostics. As it gains experience, it unlocks new forms, traits, species, and skills.

## Features

- Check your Gitagotchi status directly from the VS Code Status Bar.
- Open a pet panel with name, level, EXP, mood, fullness, energy, health, care pulses, and skills.
- Grow and recover from Git diffs, new commits, diagnostic improvements, refactoring, tests, docs, and returning from idle time.
- Pat your pet once per day for bonus EXP and mood.
- Unlock different lineages, affinities, species, and skills based on your work style.
- Open the Dex to review every Gitagotchi form you have discovered.
- View an activity log with recent growth events and reward reasons.
- Use the interface in English, Korean, Japanese, or Chinese.

## Getting Started

1. Open a Git repository workspace in VS Code.
2. When Gitagotchi starts for the first time, enter a pet name.
3. Click the Gitagotchi item in the Status Bar to open the pet panel.
4. Keep coding and committing as usual. Gitagotchi will react to your local activity.

You can open the pet panel outside a Git repository, but Git-based growth works best in a Git workspace.

## How Growth Works

Gitagotchi grows from local development signals.

- Code changes: unstaged Git diffs are analyzed for EXP, style score rewards, fullness, and health recovery.
- Commits: new commits trigger larger growth and care recovery rewards.
- Diagnostics: reducing VS Code diagnostic problems rewards debugging progress and restores health.
- Tests, docs, and refactoring: focused maintenance work adds care bonuses.
- Return from idle: coding again after time away restores some energy.
- Idle time: long periods without activity can lower some pet stats.
- Revive: if your pet is dead, spend 1000 earned EXP to revive it.

Style scores influence how your pet evolves. Feature work, refactoring, debugging, documentation changes, and commit rhythm can all affect its lineage and affinity.

## Pet Panel

Click the Gitagotchi Status Bar item, or run `Gitagotchi: Open Pet` from the Command Palette.

The pet panel includes these actions:

- `Pat`: pat your pet once per day for a bonus.
- `Commit`: check the latest commit and apply a growth event.
- `View Stats`: open the activity log and growth history.
- `Dex`: open the discovered-form collection.
- `Revive`: spend 1000 earned EXP to revive a dead pet.
- `Rename`: change your pet's name.
- `Reset`: reset the current pet's name, level, stats, skills, and logs.

The pet panel also shows:

- `Care Pulse`: recent coding activity that restored fullness, energy, or health.
- `Next Boost`: the kind of work most likely to help the lowest current stat.
- `Skills`: unlocked work-style skills and their trigger hints.

## Dex and Reset Behavior

The Dex tracks every Gitagotchi form you have discovered. When your pet reaches a new stage, lineage, or affinity, that form can be unlocked in the Dex.

Resetting your pet does not clear Dex discoveries. Reset starts the current pet over, but forms you have already discovered remain unlocked.

## Commands

Use these commands from the Command Palette:

- `Gitagotchi: Open Pet`
- `Gitagotchi: Rename Pet`
- `Gitagotchi: Reset Pet`
- `Gitagotchi: Pat Pet`
- `Gitagotchi: Revive Pet`
- `Gitagotchi: View Stats`
- `Gitagotchi: Open Dex`
- `Gitagotchi: Check Commit`

## Saved State

Gitagotchi stores pet state in VS Code global storage. Your pet state remains available when you reopen VS Code in the same environment.

Reset clears:

- Name
- Level and EXP
- Mood, fullness, energy, and health
- Growth stage and lineage
- Skills
- Activity logs

Reset keeps:

- Gitagotchi forms already discovered in the Dex

## Release Notes

### 0.1.9

- Prevented diagnostics spikes from killing Gitagotchi directly. Large temporary error bursts now leave the pet in critical health instead of dead.

### 0.1.8

- Added a revive action for dead pets that spends 1000 earned EXP and restores stable health, energy, mood, and fullness.
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
