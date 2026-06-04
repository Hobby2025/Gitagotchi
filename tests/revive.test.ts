import { applyRevivePet, getTotalEarnedExp, REVIVE_EXP_COST } from '../src/core/revive';
import { createInitialPetState, getRequiredExp } from '../src/core/petState';
import { createI18n } from '../src/i18n';

describe('revive', () => {
  it('spends earned EXP and revives a dead pet', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      level: 5,
      exp: 240,
      health: 0,
      energy: 0,
      hunger: 100,
      mood: 10,
      lifeStatus: 'dead' as const
    };
    const beforeTotal = getTotalEarnedExp(state);

    const result = applyRevivePet(state, new Date('2026-04-29T09:00:00+09:00'), createI18n('ko'));

    expect(result.revived).toBe(true);
    if (!result.revived) {
      throw new Error('expected revive to succeed');
    }
    expect(getTotalEarnedExp(result.state)).toBe(beforeTotal - REVIVE_EXP_COST);
    expect(result.state.lifeStatus).toBe('alive');
    expect(result.state.health).toBe(60);
    expect(result.state.energy).toBe(45);
    expect(result.state.hunger).toBe(60);
    expect(result.state.mood).toBe(55);
    expect(result.state.logs[0]).toMatchObject({
      message: 'Gitagotchi가 부활했습니다',
      expDelta: -REVIVE_EXP_COST,
      breakdown: [{ id: 'revive', expDelta: -REVIVE_EXP_COST }]
    });
  });

  it('can lower the level when the revive cost crosses level boundaries', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      level: 5,
      exp: 240,
      health: 0,
      lifeStatus: 'dead' as const
    };
    const expectedTotal = getTotalEarnedExp(state) - REVIVE_EXP_COST;

    const result = applyRevivePet(state, new Date('2026-04-29T09:00:00+09:00'), createI18n('en'));

    expect(result.revived).toBe(true);
    if (!result.revived) {
      throw new Error('expected revive to succeed');
    }
    expect(result.state.level).toBe(3);
    expect(result.state.exp).toBe(expectedTotal - getRequiredExp(1) - getRequiredExp(2));
  });

  it('does not revive without enough earned EXP', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      exp: REVIVE_EXP_COST - 1,
      health: 0,
      lifeStatus: 'dead' as const
    };

    const result = applyRevivePet(state, new Date('2026-04-29T09:00:00+09:00'), createI18n('en'));

    expect(result).toMatchObject({
      revived: false,
      reason: 'notEnoughExp',
      state
    });
  });

  it('does not spend EXP when the pet is not dead', () => {
    const state = {
      ...createInitialPetState('2026-04-28T00:00:00.000Z'),
      level: 6,
      exp: 200
    };

    const result = applyRevivePet(state, new Date('2026-04-29T09:00:00+09:00'), createI18n('en'));

    expect(result).toMatchObject({
      revived: false,
      reason: 'notDead',
      state
    });
  });
});
