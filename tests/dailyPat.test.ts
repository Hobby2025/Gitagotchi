import { applyDailyPat } from '../src/core/dailyPat';
import { createInitialPetState, getRequiredExp } from '../src/core/petState';
import { createI18n } from '../src/i18n';

describe('daily pat bonus', () => {
  it('grants daily EXP and mood bonus on the first pat of the local day', () => {
    const state = { ...createInitialPetState('2026-04-28T00:00:00.000Z'), mood: 70 };

    const next = applyDailyPat(state, new Date('2026-04-29T09:00:00+09:00'), createI18n('en'));

    expect(next.exp).toBe(10);
    expect(next.mood).toBe(78);
    expect(next.lastPattedAt).toBe('2026-04-29T00:00:00.000Z');
    expect(next.logs[0]).toMatchObject({
      message: 'Patted Gitagotchi',
      expDelta: 10,
      occurredAt: '2026-04-29T00:00:00.000Z',
    });
  });

  it('does not grant repeat EXP or add noisy logs on the same local day', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      exp: 10,
      mood: 78,
      lastPattedAt: '2026-04-29T00:00:00.000Z',
      logs: [{
        message: 'Important commit',
        expDelta: 30,
        occurredAt: '2026-04-29T13:00:00.000Z'
      }]
    };

    const next = applyDailyPat(state, new Date('2026-04-29T23:30:00+09:00'), createI18n('en'));

    expect(next.exp).toBe(10);
    expect(next.mood).toBe(79);
    expect(next.lastPattedAt).toBe('2026-04-29T14:30:00.000Z');
    expect(next.logs).toEqual(state.logs);
  });

  it('grants another bonus on a new local day', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      exp: 10,
      mood: 78,
      lastPattedAt: '2026-04-29T14:30:00.000Z',
    };

    const next = applyDailyPat(state, new Date('2026-04-30T00:05:00+09:00'), createI18n('en'));

    expect(next.exp).toBe(20);
    expect(next.mood).toBe(86);
    expect(next.lastPattedAt).toBe('2026-04-29T15:05:00.000Z');
    expect(next.logs[0]?.expDelta).toBe(10);
  });

  it('applies level ups from the daily EXP bonus', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      exp: getRequiredExp(1) - 5,
      mood: 70,
    };

    const next = applyDailyPat(state, new Date('2026-04-29T09:00:00+09:00'), createI18n('en'));

    expect(next.level).toBe(2);
    expect(next.exp).toBe(5);
  });
});
