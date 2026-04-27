import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('LittleJS-only rendering cleanup', () => {
  it('removes the CSS pixel renderer module and imports', () => {
    const root = process.cwd();

    expect(existsSync(join(root, 'src/character/pixelRenderer.ts'))).toBe(false);
    expect(readFileSync(join(root, 'src/ui/sidebarWebview.ts'), 'utf8')).not.toContain('pixelRenderer');
    expect(readFileSync(join(root, 'tests/sprite.test.ts'), 'utf8')).not.toContain('renderPixelFrame');
  });
});
