import { renderStatusBarText, renderStatusBarTooltip } from '../src/ui/statusBarPresentation';
import { createInitialPetState } from '../src/core/petState';
import { createI18n } from '../src/i18n';

describe('status bar presentation', () => {
  it('renders the footer summary as the primary Gitagotchi entrypoint', () => {
    const state = { ...createInitialPetState('2026-04-28T00:00:00.000Z'), level: 3, exp: 42 };

    expect(renderStatusBarText(state)).toBe('$(circle-filled) Lv.3 42/225');
  });

  it('renders a rich markdown tooltip with core pet stats', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      name: 'Mochi',
      stage: 'hatchling' as const,
      lineage: 'refact' as const
    };
    const tooltip = renderStatusBarTooltip(state, createI18n('en'));

    expect(tooltip).toContain('**Mochi Lv.1**');
    expect(tooltip).toContain('Stage: hatchling');
    expect(tooltip).toContain('Lineage: refact');
    expect(tooltip).toContain('EXP: 0/100');
    expect(tooltip).toContain('Mood: 70%');
    expect(tooltip).toContain('Hunger: 20%');
    expect(tooltip).toContain('Energy: 80%');
    expect(tooltip).toContain('Health: 100%');
    expect(tooltip).toContain('Click to open Gitagotchi.');
  });
});
