import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('LittleJS-only rendering cleanup', () => {
  it('removes unused sidebar and CSS pixel renderer modules', () => {
    const root = process.cwd();

    expect(existsSync(join(root, 'src/character/pixelRenderer.ts'))).toBe(false);
    expect(existsSync(join(root, 'src/ui/sidebarWebview.ts'))).toBe(false);
    expect(readFileSync(join(root, 'tests/sprite.test.ts'), 'utf8')).not.toContain('renderPixelFrame');
  });
});
