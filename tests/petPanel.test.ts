import { createInitialPetState } from '../src/core/petState';
import { createI18n } from '../src/i18n';
import { renderPetPanelHtml } from '../src/ui/petPanelPresentation';

describe('pet panel', () => {
  it('renders the monster webview with pet stats and actions', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      name: 'Mochi'
    };
    const html = renderPetPanelHtml(state, createI18n('en'), {
      cspSource: 'vscode-resource:',
      nonce: 'abc'
    });

    expect(html).toContain('aria-label="Gitagotchi monster sprite"');
    expect(html).toContain('class="sprite-pixel"');
    expect(html).not.toContain('<canvas');
    expect(html).toContain('Mochi');
    expect(html).toContain('Lv.1');
    expect(html).toContain('class="hud-shell"');
    expect(html).toContain('class="monster-card"');
    expect(html).toContain('class="stat-deck"');
    expect(html).toContain('class="skill-matrix"');
    expect(html).toContain('Feature Throughput');
    expect(html).toContain('Refactor Craft');
    expect(html).toContain('Bug Radar');
    expect(html).toContain('Docs Literacy');
    expect(html).toContain('Commit Streak');
    expect(html).toContain('Mood');
    expect(html).toContain('Hunger');
    expect(html).toContain('data-command="feed"');
    expect(html).toContain('data-command="commit"');
    expect(html).toContain('data-command="stats"');
    expect(html).toContain('data-command="leaderboard"');
    expect(html).toContain('data-command="createLeaderboard"');
    expect(html).toContain('data-command="rename"');
    expect(html).toContain('data-command="reset"');
  });

  it('renders action controls as themed game commands', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      name: 'Arc'
    };

    const html = renderPetPanelHtml(state, createI18n('ko'), {
      cspSource: 'vscode-resource:',
      nonce: 'abc'
    });

    expect(html).toContain('class="action-dock"');
    expect(html).toContain('class="action-btn action-primary" data-command="feed"');
    expect(html).toContain('class="action-btn" data-command="commit"');
    expect(html).toContain('class="action-rune">FD</span>');
    expect(html).toContain('class="action-rune">GC</span>');
    expect(html).toContain('<span class="action-label">먹이 주기</span>');
    expect(html).toContain('<span class="action-label">커밋 확인</span>');
  });

  it('scales ultimate pixel art into the pet stage', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      level: 30,
      evolution: 'architect' as const,
      stage: 'ultimate' as const,
      lineage: 'buildling' as const,
      styleScores: { builder: 130, cleaner: 130, debugger: 130, scholar: 130, streak: 130 }
    };
    const html = renderPetPanelHtml(state, createI18n('en'), {
      cspSource: 'vscode-resource:',
      nonce: 'abc'
    });

    expect(html).toContain('--cols:32;--rows:32;--px:5px');
    expect(html).toContain('Stage');
    expect(html).toContain('Lineage');
    expect(html).toContain('Affinity');
    expect(html).toContain('ultimate');
    expect(html).toContain('buildling');
  });

  it('renders trading-card lineage styling and affinity chips', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      name: 'Ruby',
      level: 18,
      exp: 140,
      evolution: 'senior' as const,
      stage: 'specialist' as const,
      lineage: 'debugon' as const,
      affinity: 'debugger' as const,
      styleScores: { builder: 10, cleaner: 20, debugger: 120, scholar: 5, streak: 8 }
    };

    const html = renderPetPanelHtml(state, createI18n('en'), {
      cspSource: 'vscode-resource:',
      nonce: 'abc'
    });

    expect(html).toContain('class="monster-card"');
    expect(html).toContain('--lineage-accent:#f87171');
    expect(html).toContain('--lineage-glow:rgba(248,113,113,.28)');
    expect(html).toContain('class="card-lineage">debugon</span>');
    expect(html).toContain('class="affinity-chip">debugger</span>');
    expect(html).toContain('class="card-rarity">specialist</span>');
  });
});
