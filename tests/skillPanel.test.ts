import { createInitialPetState } from '../src/core/petState';
import { createI18n } from '../src/i18n';
import { renderSkillPanelHtml } from '../src/ui/skillPanelPresentation';

describe('skill panel', () => {
  it('renders owned skill details outside the pet card', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      skills: ['deepClean', 'focusFlow'] as const
    };

    const html = renderSkillPanelHtml(state, createI18n('en'), 'vscode-resource:');

    expect(html).toContain('<h1>Skills</h1>');
    expect(html).toContain('Deep Clean');
    expect(html).toContain('Focus Flow');
    expect(html).toContain('Refactor-heavy diffs');
    expect(html).not.toContain('No skills yet');
  });

  it('renders an empty owned skills state', () => {
    const state = createInitialPetState('2026-04-28T00:00:00.000Z');

    const html = renderSkillPanelHtml(state, createI18n('en'), 'vscode-resource:');

    expect(html).toContain('No skills yet');
    expect(html).toContain('Build, refactor, debug, document, and commit');
  });

  it('localizes owned skill details', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      skills: ['deepClean', 'focusFlow'] as const
    };

    const html = renderSkillPanelHtml(state, createI18n('ko'), 'vscode-resource:');

    expect(html).toContain('<h1>스킬</h1>');
    expect(html).toContain('대청소');
    expect(html).toContain('집중 흐름');
    expect(html).toContain('리팩터링 비중이 큰 변경');
    expect(html).not.toContain('Refactor-heavy diffs');
  });
});
