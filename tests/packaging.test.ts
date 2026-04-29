import * as fs from 'fs';
import * as path from 'path';

describe('extension packaging', () => {
  it('declares the compiled extension entrypoint', () => {
    const root = path.resolve(__dirname, '..');
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as {
      main: string;
      scripts: Record<string, string>;
      repository?: { type: string; url: string };
    };

    expect(manifest.main).toBe('./dist/extension.js');
    expect(manifest.scripts.build).toContain('npm run clean');
    expect(manifest.scripts.package).toBe('vsce package');
    expect(manifest.repository).toEqual({
      type: 'git',
      url: 'https://github.com/Hobby2025/Gitagotchi.git',
    });
  });

  it('keeps tests out of the product TypeScript build', () => {
    const root = path.resolve(__dirname, '..');
    const tsconfig = JSON.parse(fs.readFileSync(path.join(root, 'tsconfig.json'), 'utf8')) as {
      compilerOptions: { rootDir: string; outDir: string };
      include: string[];
    };

    expect(tsconfig.compilerOptions.rootDir).toBe('src');
    expect(tsconfig.compilerOptions.outDir).toBe('dist');
    expect(tsconfig.include).toEqual(['src/**/*.ts']);
  });

  it('does not contribute an Activity Bar sidebar view', () => {
    const root = path.resolve(__dirname, '..');
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as {
      contributes: {
        viewsContainers?: unknown;
        views?: Record<string, unknown>;
      };
    };
    const extensionSource = fs.readFileSync(path.join(root, 'src', 'extension.ts'), 'utf8');

    expect(manifest.contributes.viewsContainers).toBeUndefined();
    expect(manifest.contributes.views).toBeUndefined();
    expect(extensionSource).not.toContain('registerWebviewViewProvider');
  });

  it('uses the status bar command to open the pet panel', () => {
    const root = path.resolve(__dirname, '..');
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as {
      activationEvents: string[];
      contributes: {
        commands: Array<{ command: string }>;
      };
    };
    const statusBarSource = fs.readFileSync(path.join(root, 'src', 'ui', 'statusBar.ts'), 'utf8');
    const extensionSource = fs.readFileSync(path.join(root, 'src', 'extension.ts'), 'utf8');

    expect(manifest.activationEvents).toContain('onCommand:gitagotchi.openPet');
    expect(manifest.activationEvents).toContain('onCommand:gitagotchi.patPet');
    expect(manifest.contributes.commands.map((command) => command.command)).toContain('gitagotchi.openPet');
    expect(manifest.contributes.commands.map((command) => command.command)).toContain('gitagotchi.renamePet');
    expect(manifest.contributes.commands.map((command) => command.command)).toContain('gitagotchi.resetPet');
    expect(manifest.contributes.commands.map((command) => command.command)).toContain('gitagotchi.patPet');
    expect(manifest.contributes.commands.map((command) => command.command)).not.toContain('gitagotchi.feedPet');
    expect(manifest.contributes.commands.map((command) => command.command)).not.toContain('gitagotchi.restPet');
    expect(manifest.contributes.commands.map((command) => command.command)).not.toContain('gitagotchi.useMedicine');
    expect(statusBarSource).toContain("this.item.command = 'gitagotchi.openPet'");
    expect(extensionSource).toContain('discoverCurrentPetSprite(store.load())');
    expect(extensionSource).toContain('petPanel.show(state)');
  });

  it('does not expose leaderboard commands or settings', () => {
    const root = path.resolve(__dirname, '..');
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as {
      activationEvents: string[];
      contributes: {
        commands: Array<{ command: string }>;
        configuration?: {
          properties?: Record<string, unknown>;
        };
      };
    };
    const extensionSource = fs.readFileSync(path.join(root, 'src', 'extension.ts'), 'utf8');
    const commandIds = manifest.contributes.commands.map((command) => command.command);
    const settingIds = Object.keys(manifest.contributes.configuration?.properties ?? {});

    expect(manifest.activationEvents).not.toContain('onCommand:gitagotchi.leaderboard');
    expect(manifest.activationEvents).not.toContain('onCommand:gitagotchi.createLeaderboard');
    expect(commandIds).not.toContain('gitagotchi.leaderboard');
    expect(commandIds).not.toContain('gitagotchi.createLeaderboard');
    expect(settingIds.some((setting) => setting.startsWith('gitagotchi.leaderboard.'))).toBe(false);
    expect(extensionSource).not.toContain('leaderboard');
    expect(extensionSource).not.toContain('Gist');
  });

  it('keeps local workspace artifacts out of the VSIX package', () => {
    const root = path.resolve(__dirname, '..');
    const ignore = fs.readFileSync(path.join(root, '.vscodeignore'), 'utf8');

    expect(ignore).toContain('.superpowers/**');
    expect(ignore).toContain('.vscode/**');
    expect(ignore).toContain('src/**');
    expect(ignore).toContain('tests/**');
  });

  it('declares a marketplace icon asset', () => {
    const root = path.resolve(__dirname, '..');
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as {
      icon?: string;
    };

    expect(manifest.icon).toBe('resources/gitagotchi-icon.png');
    expect(fs.existsSync(path.join(root, manifest.icon ?? ''))).toBe(true);
  });
});
