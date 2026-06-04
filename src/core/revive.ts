import { getRequiredExp, PetState } from './petState';
import { I18n } from '../i18n';
import { resolveEvolution, resolveMonsterIdentity } from '../domain/pet/petSystem';

export const REVIVE_EXP_COST = 500;

export type ReviveFailureReason = 'notDead' | 'notEnoughExp';

export type ReviveResult =
  | { revived: true; state: PetState; availableExp: number }
  | { revived: false; state: PetState; reason: ReviveFailureReason; availableExp: number };

export function getTotalEarnedExp(state: PetState): number {
  let total = state.exp;

  for (let level = 1; level < state.level; level += 1) {
    total += getRequiredExp(level);
  }

  return total;
}

function resolveLevelFromTotalExp(totalExp: number): Pick<PetState, 'level' | 'exp'> {
  let level = 1;
  let exp = Math.max(0, totalExp);

  while (exp >= getRequiredExp(level)) {
    exp -= getRequiredExp(level);
    level += 1;
  }

  return { level, exp };
}

export function applyRevivePet(state: PetState, now: Date, i18n: I18n): ReviveResult {
  const availableExp = getTotalEarnedExp(state);

  if (state.lifeStatus !== 'dead') {
    return { revived: false, state, reason: 'notDead', availableExp };
  }

  if (availableExp < REVIVE_EXP_COST) {
    return { revived: false, state, reason: 'notEnoughExp', availableExp };
  }

  const occurredAt = now.toISOString();
  const { level, exp } = resolveLevelFromTotalExp(availableExp - REVIVE_EXP_COST);
  const nextHunger = Math.min(state.hunger, 60);
  const nextMood = Math.max(state.mood, 55);
  const nextEnergy = Math.max(state.energy, 45);
  const nextHealth = Math.max(state.health, 60);
  const revived = resolveEvolution({
    ...state,
    level,
    exp,
    hunger: nextHunger,
    mood: nextMood,
    energy: nextEnergy,
    health: nextHealth,
    lifeStatus: 'alive',
    lastActiveAt: occurredAt,
    logs: [{
      message: i18n.t('log.revived'),
      expDelta: -REVIVE_EXP_COST,
      occurredAt,
      breakdown: [{
        id: 'revive',
        label: 'Revive',
        expDelta: -REVIVE_EXP_COST,
        moodDelta: nextMood - state.mood,
        hungerDelta: nextHunger - state.hunger,
        energyDelta: nextEnergy - state.energy,
        healthDelta: nextHealth - state.health
      }]
    }, ...state.logs].slice(0, 20)
  });

  return {
    revived: true,
    state: resolveMonsterIdentity(revived),
    availableExp
  };
}
