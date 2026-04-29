import * as fs from 'fs';
import * as path from 'path';

describe('extension packaging', () => {
  it('declares the compiled extension entrypoint', () => {
    const root = path.resolve(__dirname, '..');
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as {
      main: string;
      scripts: Record<string, string>;
    };

    expect(manifest.main).toBe('./dist/extension.js');
    expect(manifest.scripts.build).toContain('npm run clean');
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
    expect(manifest.contributes.commands.map((command) => command.command)).toContain('gitagotchi.openPet');
    expect(manifest.contributes.commands.map((command) => command.command)).toContain('gitagotchi.renamePet');
    expect(manifest.contributes.commands.map((command) => command.command)).toContain('gitagotchi.resetPet');
    expect(statusBarSource).toContain("this.item.command = 'gitagotchi.openPet'");
    expect(extensionSource).toContain('discoverCurrentPetSprite(store.load())');
    expect(extensionSource).toContain('petPanel.show(state)');
  });
});
