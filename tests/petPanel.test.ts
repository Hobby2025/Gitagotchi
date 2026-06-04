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
      nonce: 'abc',
      now: new Date('2026-04-29T12:00:00+09:00')
    });

    expect(html).toContain('aria-label="Gitagotchi monster sprite"');
    expect(html).toContain('class="sprite-pixel"');
    expect(html).not.toContain('<canvas');
    expect(html).toContain('Mochi');
    expect(html).toContain('Lv.1');
    expect(html).toContain('class="hud-shell"');
    expect(html).toContain('class="monster-card"');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('data-tab-target="status"');
    expect(html).toContain('data-tab-target="goals"');
    expect(html).toContain('data-tab-target="endgame"');
    expect(html).toContain('data-tab-target="collection"');
    expect(html).toContain('id="tab-panel-status"');
    expect(html).toContain('id="tab-panel-goals"');
    expect(html).toContain('id="tab-panel-endgame"');
    expect(html).toContain('id="tab-panel-collection"');
    expect(html).toContain('data-tab-panel="goals" hidden');
    expect(html).toContain('body { height: 100vh; overflow: hidden;');
    expect(html).toContain('.page-shell { width: min(1120px, 100%); height: calc(100vh - 32px); min-height: 0;');
    expect(html).toContain('.hud-shell { width: 100%; min-height: 0; flex: 1 1 auto; display: grid; grid-template-columns: minmax(250px, 280px) minmax(560px, 1fr);');
    expect(html).toContain('.systems-card { min-height: 0; padding: 14px; display: grid; grid-template-rows: auto auto auto minmax(0, 1fr);');
    expect(html).toContain('.monster-card, .systems-card { border: 1px solid var(--vscode-panel-border); background: var(--vscode-sideBar-background); border-radius: 6px; box-shadow: none;');
    expect(html).toContain('.tab-panel { display: grid; gap: 10px; min-height: 0; align-content: start; overflow-y: auto;');
    expect(html).toContain('.endgame-options { display: grid; gap: 6px; margin-top: 7px; overflow: visible;');
    expect(html).toContain('.class-compare { display: grid; gap: 5px; margin-top: 4px; overflow: visible;');
    expect(html).toContain('.book-grid { display: flex; flex-wrap: wrap; gap: 5px; overflow: visible;');
    expect(html.match(/overflow-y: auto/g) ?? []).toHaveLength(1);
    expect(html).toContain('.action-btn { height: 44px; min-height: 44px;');
    expect(html).toContain('.action-label { min-width: 0; display: block; overflow: hidden; text-overflow: clip; white-space: normal; overflow-wrap: anywhere;');
    expect(html).toContain('.tab-button.active { color: var(--vscode-foreground); border-color: transparent; background: var(--vscode-editor-background); box-shadow: inset 0 -2px 0 var(--lineage-accent);');
    expect(html).toContain('.quest-option { height: 84px; min-height: 84px;');
    expect(html).toContain('.endgame-choice, .endgame-command { height: 64px; min-height: 64px;');
    expect(html).toContain('.star-node-card { height: 96px; min-height: 96px;');
    expect(html).toContain('class="stat-deck"');
    expect(html).toContain('class="skill-matrix"');
    expect(html).toContain('Evolution Preview');
    expect(html).toContain('Daily Quest');
    expect(html).toContain('class="endgame-board"');
    expect(html).toContain('class="raid-arena raid-empty"');
    expect(html).toContain('Choose a boss to start a raid.');
    expect(html).toContain('Choose one focus for today');
    expect(html).toContain('data-command="selectQuest"');
    expect(html).toContain('data-quest-id=');
    expect(html).toContain('No quest trophies yet');
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
    expect(html).toContain('Four Tabs');
    expect(html).toContain('Use Status for stats and evolution');
    expect(html).toContain('Daily Goals');
    expect(html).toContain('Pick one daily quest before working');
    expect(html).toContain('Endgame Loop');
    expect(html).toContain('reincarnate at Ultimate level 30');
    expect(html).toContain('Collection');
    expect(html).toContain('Decorations, raid clear history, project profiles');
    expect(html).toContain('.guide-panel { width: min(560px, 100%); max-height: calc(100vh - 86px); display: flex; flex-direction: column;');
    expect(html).toContain('.guide-body { display: grid; gap: 12px; min-height: 0; padding: 14px; overflow: auto;');
    expect(html).toContain('Code changes: Fullness +3, Health +1');
    expect(html).toContain('Commits: Fullness +5, Energy +4, Health +3');
    expect(html).toContain('Diagnostics resolved: Fullness +2, Energy +1, Health +4 per issue');
    expect(html).toContain('Returning from idle: Energy +8 per day away, up to +20');
    expect(html).toContain('If Gitagotchi is dead, spend 500 earned EXP');
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
    expect(html).toContain('Gitagotchi가 죽은 상태라면 누적 경험치 500');
  });

  it('keeps care pulse, boost hints, and equipped skill details out of the card', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      name: 'Pulse',
      hunger: 65,
      energy: 34,
      health: 52,
      skills: ['deepClean', 'focusFlow'] as const,
      dailyQuest: {
        dayKey: '2026-04-29',
        offeredIds: ['shipIt', 'bugHunt', 'fieldGuide'],
        activeId: 'shipIt' as const,
        progress: 0
      },
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
      nonce: 'abc',
      now: new Date('2026-04-29T12:00:00+09:00')
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

  it('renders active quest progress and earned decorations', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      dailyQuest: {
        dayKey: '2026-04-29',
        offeredIds: ['shipIt', 'bugHunt', 'fieldGuide'],
        activeId: 'shipIt' as const,
        progress: 1,
        completedId: 'shipIt' as const
      },
      decorations: ['commitMedal']
    };

    const html = renderPetPanelHtml(state, createI18n('ko'), {
      cspSource: 'vscode-resource:',
      nonce: 'abc',
      now: new Date('2026-04-29T12:00:00+09:00')
    });

    expect(html).toContain('오늘의 퀘스트');
    expect(html).toContain('오늘 완료');
    expect(html).toContain('출하 준비');
    expect(html).toContain('+32 EXP와 커밋 메달');
    expect(html).toContain('data-command="toggleDecoration"');
    expect(html).toContain('data-decoration-id="commitMedal"');
    expect(html).toContain('>커밋 메달</button>');
    expect(html).not.toContain('오늘 집중할 목표를 하나 고르세요');
  });

  it('renders raid hit moments, boss arena, and reincarnation stars', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      endgame: {
        ...createInitialPetState('2026-04-28T00:00:00.000Z').endgame,
        stars: 3,
        activeRaid: {
          id: 'releaseGolem' as const,
          hp: 120,
          maxHp: 260,
          startedAt: '2026-04-29T00:00:00.000Z'
        }
      },
      logs: [{
        message: '+12 EXP',
        expDelta: 12,
        occurredAt: '2026-04-29T00:00:00.000Z',
        breakdown: [{ id: 'raid.damage.releaseGolem', label: 'Raid damage: releaseGolem', expDelta: 12 }]
      }]
    };

    const html = renderPetPanelHtml(state, createI18n('en'), {
      cspSource: 'vscode-resource:',
      nonce: 'abc',
      now: new Date('2026-04-29T12:00:00+09:00')
    });

    expect(html).toContain('class="moment-banner moment-hit"');
    expect(html).toContain('Raid Hit');
    expect(html).toContain('class="raid-arena raid-active"');
    expect(html).toContain('class="boss-sigil boss-releaseGolem"');
    expect(html).toContain('120/260 HP');
    expect(html).toContain('class="star-orbit"');
    expect(html).toContain('class="star-node star-3"');
  });

  it('renders high-level motivation systems for returning players', () => {
    const base = createInitialPetState('2026-04-28T00:00:00.000Z');
    const state = {
      ...base,
      lineage: 'archivox' as const,
      skills: ['fieldGuide' as const],
      decorations: ['commitMedal' as const, 'breakpointCrown' as const],
      equippedDecorations: ['breakpointCrown' as const],
      endgame: {
        ...base.endgame,
        stars: 2,
        classId: 'archivist' as const,
        classLevels: { archivist: 3 },
        classQuest: {
          dayKey: '2026-04-28',
          classId: 'archivist' as const,
          progress: 1,
          completedClassId: 'archivist' as const
        },
        season: {
          ...base.endgame.season,
          progress: 260,
          claimedMilestones: [100, 250]
        },
        starTree: {
          unspent: 1,
          nodes: {
            raidMight: 1,
            steadyCare: 0,
            seasonMemory: 0
          }
        },
        raidHistory: [{
          id: 'breakpointHydra' as const,
          defeatedAt: '2026-04-29T00:00:00.000Z',
          decoration: 'breakpointCrown' as const,
          maxHp: 320
        }],
        activeProjectKey: 'repo-a',
        projectProfiles: {
          'repo-a': {
            key: 'repo-a',
            label: 'Repo A',
            exp: 420,
            raidsCleared: 1,
            lastActiveAt: '2026-04-29T00:00:00.000Z'
          }
        },
        teamRaid: {
          ...base.endgame.teamRaid,
          contribution: 320,
          clears: 2
        },
        weeklyReview: {
          weekKey: '2026-W18',
          dominantStyle: 'scholar' as const,
          title: 'review.scholar.title',
          summary: 'review.scholar.summary'
        }
      }
    };

    const html = renderPetPanelHtml(state, createI18n('ko'), {
      cspSource: 'vscode-resource:',
      nonce: 'abc'
    });

    expect(html).toContain('장착 중');
    expect(html).toContain('브레이크포인트 왕관');
    expect(html).toContain('reincarnation-tier-1');
    expect(html).toContain('직업 Lv.3');
    expect(html).toContain('직업 훈련');
    expect(html).toContain('기록 정리');
    expect(html).toContain('빌드 비교');
    expect(html).toContain('변경 비용 120 EXP');
    expect(html).toContain('진화 미리보기');
    expect(html).toContain('계열 스킬 트리');
    expect(html).toContain('현장 가이드');
    expect(html).toContain('해금');
    expect(html).toContain('시즌 보상 트랙');
    expect(html).toContain('워크스페이스 협동 레이드');
    expect(html).toContain('기여도 320/600');
    expect(html).toContain('클리어 2회');
    expect(html).toContain('250점');
    expect(html).toContain('별 투자 트리');
    expect(html).toContain('미사용 별 1개');
    expect(html).toContain('data-command="investStar"');
    expect(html).toContain('data-star-node-id="seasonMemory"');
    expect(html).toContain('레이드 클리어 기록');
    expect(html).toContain('브레이크포인트 히드라');
    expect(html).toContain('프로젝트 프로필');
    expect(html).toContain('Repo A');
    expect(html).toContain('장식 컬렉션 북');
    expect(html).toContain('2/17 보유');
    expect(html).toContain('잠김');
    expect(html).toContain('시즌 한정');
    expect(html).toContain('data-command="copyReview"');
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
