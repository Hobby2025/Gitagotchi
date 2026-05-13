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
    expect(html).toContain('Fullness');
    expect(html).toContain('<strong>80%</strong>');
    expect(html).toContain('Skills');
    expect(html).not.toContain('Care Pulse');
    expect(html).not.toContain('Next Boost');
    expect(html).not.toContain('No skills yet');
    expect(html).toContain('data-command="pat"');
    expect(html).toContain('data-command="commit"');
    expect(html).toContain('data-command="stats"');
    expect(html).toContain('data-command="skills"');
    expect(html).toContain('data-command="dex"');
    expect(html).toContain('data-command="revive" disabled');
    expect(html).not.toContain('data-command="feed"');
    expect(html).not.toContain('data-command="rest"');
    expect(html).not.toContain('data-command="medicine"');
    expect(html).toContain('data-command="rename"');
    expect(html).toContain('data-command="reset"');
    expect(html).toMatch(/<div class="top-actions">[\s\S]*data-command="rename"[\s\S]*data-command="reset"[\s\S]*data-guide-open/);
    expect(html).toContain('Care Recovery');
    expect(html).toContain('Code changes: Fullness +3, Health +1');
    expect(html).toContain('Commits: Fullness +5, Energy +4, Health +3');
    expect(html).toContain('Diagnostics resolved: Fullness +2, Energy +1, Health +4 per issue');
    expect(html).toContain('Returning from idle: Energy +8 per day away, up to +20');
    expect(html).toContain('If Gitagotchi is dead, spend 1000 earned EXP');
    expect(html).not.toMatch(/<div class="action-dock">[\s\S]*data-command="rename"[\s\S]*<\/div>/);
    expect(html).not.toMatch(/<div class="action-dock">[\s\S]*data-command="reset"[\s\S]*<\/div>/);
    expect(html).not.toContain('data-command="leaderboard"');
    expect(html).not.toContain('data-command="createLeaderboard"');
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
    expect(html).toContain('class="action-btn action-primary" data-command="pat"');
    expect(html).toContain('class="action-btn" data-command="commit"');
    expect(html).toContain('class="action-rune">PT</span>');
    expect(html).toContain('class="action-rune">GC</span>');
    expect(html).toContain('class="action-rune">SK</span>');
    expect(html).toContain('class="action-rune">DX</span>');
    expect(html).toContain('class="action-rune">RV</span>');
    expect(html).not.toContain('class="action-rune">RN</span>');
    expect(html).not.toContain('class="action-rune">FD</span>');
    expect(html).not.toContain('class="action-rune">RS</span>');
    expect(html).not.toContain('class="action-rune">MD</span>');
    expect(html).toContain('<span class="action-label">만져주기</span>');
    expect(html).toContain('<span class="action-label">커밋 확인</span>');
    expect(html).toContain('<span class="action-label">도감</span>');
    expect(html).toContain('<span class="action-label">부활</span>');
    expect(html).toContain('>이름 변경</button>');
    expect(html).toContain('>초기화</button>');
    expect(html).toContain('Gitagotchi가 죽은 상태라면 누적 경험치 1000');
  });

  it('keeps care pulse, boost hints, and equipped skill details out of the card', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      name: 'Pulse',
      hunger: 65,
      energy: 34,
      health: 52,
      skills: ['deepClean', 'focusFlow'] as const,
      logs: [{
        message: '+24 EXP from 2 bonuses',
        expDelta: 24,
        occurredAt: '2026-04-29T00:00:00.000Z',
        breakdown: [
          { id: 'base-diff', label: 'Code changes', expDelta: 12, hungerDelta: -3, healthDelta: 1 },
          { id: 'return-from-idle', label: 'Return from idle', energyDelta: 20, moodDelta: 2 }
        ]
      }]
    };

    const html = renderPetPanelHtml(state, createI18n('en'), {
      cspSource: 'vscode-resource:',
      nonce: 'abc'
    });

    expect(html).toContain('Fullness');
    expect(html).toContain('<strong>35%</strong>');
    expect(html).not.toContain('class="care-grid"');
    expect(html).not.toContain('class="care-panel"');
    expect(html).not.toContain('Fullness +3</span>');
    expect(html).not.toContain('Health +1</span>');
    expect(html).not.toContain('Energy +20</span>');
    expect(html).not.toContain('Deep Clean');
    expect(html).not.toContain('Focus Flow');
    expect(html).not.toContain('Refactor-heavy diffs');
    expect(html).not.toContain('No skills yet');
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
    expect(html).toContain('Ultimate');
    expect(html).toContain('Buildling');
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
    expect(html).toContain('class="card-lineage">Debugon</span>');
    expect(html).toContain('class="affinity-chip">Debugger</span>');
    expect(html).toContain('class="card-rarity">Specialist</span>');
  });

  it('enables the revive action for dead pets', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      health: 0,
      lifeStatus: 'dead' as const
    };

    const html = renderPetPanelHtml(state, createI18n('ko'), {
      cspSource: 'vscode-resource:',
      nonce: 'abc'
    });

    expect(html).toContain('class="action-btn action-primary" data-command="revive"');
    expect(html).not.toContain('data-command="revive" disabled');
    expect(html).toContain('<strong>사망</strong>');
  });

  it('shows a dotted heart next to the character on the day the pet was patted', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      lastPattedAt: '2026-04-29T00:00:00.000Z'
    };

    const html = renderPetPanelHtml(state, createI18n('en'), {
      cspSource: 'vscode-resource:',
      nonce: 'abc',
      now: new Date('2026-04-29T12:00:00+09:00')
    });

    expect(html).toContain('<div class="sprite-stage">');
    expect(html).toContain('class="pixel-heart"');
    expect(html).toContain('class="heart-pixel heart-1"');
    expect(html).toMatch(/<div class="sprite-stage">[\s\S]*monster-sprite[\s\S]*pixel-heart[\s\S]*<\/div>/);
    expect(html).toContain('aria-label="Patted today"');
    expect(html).not.toContain('class="pat-heart"');
  });

  it('does not show the floating heart after the pat day passes', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      lastPattedAt: '2026-04-29T00:00:00.000Z'
    };

    const html = renderPetPanelHtml(state, createI18n('en'), {
      cspSource: 'vscode-resource:',
      nonce: 'abc',
      now: new Date('2026-04-30T12:00:00+09:00')
    });

    expect(html).not.toContain('class="pixel-heart"');
  });
});
