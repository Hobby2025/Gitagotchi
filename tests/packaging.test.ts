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

  it('contributes the sidebar as a webview view', () => {
    const root = path.resolve(__dirname, '..');
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as {
      contributes: {
        views: {
          gitagotchi: Array<{ id: string; type?: string }>;
        };
      };
    };

    const sidebar = manifest.contributes.views.gitagotchi.find((view) => view.id === 'gitagotchi.sidebar');

    expect(sidebar?.type).toBe('webview');
  });
});
