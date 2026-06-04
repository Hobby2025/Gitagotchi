import { createPetLifecycleService } from '../src/application/petLifecycleService';
import { createInitialPetState } from '../src/core/petState';
import { createI18n } from '../src/i18n';

describe('pet lifecycle service', () => {
  it('exposes quest, raid, and reincarnation use cases behind one application boundary', () => {
    const service = createPetLifecycleService();
    const base = createInitialPetState('2026-06-03T00:00:00.000Z');

    const quested = service.selectQuest(base, 'shipIt', new Date('2026-06-03T09:00:00+09:00'));
    const raiding = service.startRaid(quested, 'releaseGolem', new Date('2026-06-03T10:00:00.000Z'));
    const classed = service.selectClass(raiding, 'releaseMaster');

    expect(classed.dailyQuest.activeId).toBe('shipIt');
    expect(classed.endgame.activeRaid?.id).toBe('releaseGolem');
    expect(classed.endgame.classId).toBe('releaseMaster');
  });

  it('applies activity events with localized messages through the service', () => {
    const service = createPetLifecycleService();
    const state = service.selectQuest(
      createInitialPetState('2026-06-04T00:00:00.000Z'),
      'shipIt',
      new Date('2026-06-03T09:00:00+09:00')
    );

    const next = service.applyActivityEvent(state, {
      type: 'commit',
      hash: 'abc123',
      message: 'feat: service boundary',
      occurredAt: '2026-06-03T10:00:00.000Z'
    }, createI18n('ko'));

    expect(next.dailyQuest.completedId).toBe('shipIt');
    expect(next.logs[0].breakdown?.some((entry) => entry.id === 'quest.shipIt')).toBe(true);
    expect(next.logs[0].messages?.[0]?.text).toBeTruthy();
  });
});
