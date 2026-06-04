import { applyActivity, createDefaultGrowthEngine } from '../src/core/growthEngine';
import { createInitialPetState } from '../src/core/petState';
import { resolveDailyQuest, selectDailyQuest } from '../src/domain/game/gameSystem';
import { ActivityEvent } from '../src/core/events';

describe('daily quest engine', () => {
  it('offers three deterministic daily quests', () => {
    const state = createInitialPetState('2026-06-04T00:00:00.000Z');
    const quest = resolveDailyQuest(state, new Date('2026-06-04T09:00:00+09:00'));

    expect(quest.dayKey).toBe('2026-06-04');
    expect(quest.offeredIds).toHaveLength(3);
    expect(new Set(quest.offeredIds).size).toBe(3);
  });

  it('selects one offered quest for the current day', () => {
    const state = createInitialPetState('2026-06-04T00:00:00.000Z');
    const offeredId = resolveDailyQuest(state, new Date('2026-06-04T09:00:00+09:00')).offeredIds[0];
    const next = selectDailyQuest(state, offeredId, new Date('2026-06-04T09:00:00+09:00'));

    expect(next.dailyQuest.activeId).toBe(offeredId);
    expect(next.dailyQuest.progress).toBe(0);
  });

  it('rewards a completed commit quest once and unlocks its decoration', () => {
    const base = createInitialPetState('2026-06-04T00:00:00.000Z');
    const state = {
      ...selectDailyQuest(base, 'shipIt', new Date('2026-06-04T09:00:00+09:00')),
      dailyQuest: {
        dayKey: '2026-06-04',
        offeredIds: ['shipIt', 'bugHunt', 'fieldGuide'],
        activeId: 'shipIt' as const,
        progress: 0
      }
    };
    const event: ActivityEvent = {
      type: 'commit',
      hash: 'abc123',
      message: 'feat: add quest rewards',
      occurredAt: '2026-06-04T01:00:00.000Z'
    };

    const next = applyActivity(state, event, createDefaultGrowthEngine());
    const repeated = applyActivity(next, { ...event, hash: 'def456' }, createDefaultGrowthEngine());

    expect(next.dailyQuest.completedId).toBe('shipIt');
    expect(next.dailyQuest.progress).toBe(1);
    expect(next.decorations).toContain('commitMedal');
    expect(next.logs[0].breakdown).toContainEqual({
      id: 'quest.shipIt',
      label: 'Daily quest: shipIt',
      expDelta: 32,
      moodDelta: 5
    });
    expect(repeated.decorations.filter((decoration) => decoration === 'commitMedal')).toHaveLength(1);
    expect(repeated.logs[0].breakdown?.some((entry) => entry.id === 'quest.shipIt')).toBe(false);
  });
});
