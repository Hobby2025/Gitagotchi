import { renderStatusBarText, renderStatusBarTooltip } from '../src/ui/statusBarPresentation';
import { createInitialPetState, getRequiredExp } from '../src/core/petState';
import { createI18n } from '../src/i18n';

describe('status bar presentation', () => {
  it('renders the footer summary as the primary Gitagotchi entrypoint', () => {
    const state = { ...createInitialPetState('2026-04-28T00:00:00.000Z'), level: 3, exp: 42 };

    expect(renderStatusBarText(state)).toBe(`$(circle-filled) Lv.3 42/${getRequiredExp(3)}`);
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
    expect(tooltip).toContain('Stage: Hatchling');
    expect(tooltip).toContain('Lineage: Refact');
    expect(tooltip).toContain(`EXP: 0/${getRequiredExp(1)}`);
    expect(tooltip).toContain('Mood: 70%');
    expect(tooltip).toContain('Fullness: 80%');
    expect(tooltip).toContain('Energy: 80%');
    expect(tooltip).toContain('Health: 100%');
    expect(tooltip).toContain('Click to open Gitagotchi.');
  });

  it('localizes tooltip enum values', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      stage: 'hatchling' as const,
      lineage: 'refact' as const,
      affinity: 'cleaner' as const
    };
    const tooltip = renderStatusBarTooltip(state, createI18n('ko'));

    expect(tooltip).toContain('단계: 유년기');
    expect(tooltip).toContain('계열: 리팩트');
    expect(tooltip).toContain('전문성: 리팩터링');
    expect(tooltip).toContain('클릭하면 Gitagotchi를 엽니다.');
  });
});
