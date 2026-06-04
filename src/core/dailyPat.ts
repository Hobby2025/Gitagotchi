import { clampStat, getRequiredExp, PetState } from './petState';
import { I18n } from '../i18n';
import { getLifeStatus, resolveEvolution, resolveMonsterIdentity } from '../domain/pet/petSystem';

const DAILY_PAT_EXP = 10;
const DAILY_PAT_MOOD = 8;
const REPEAT_PAT_MOOD = 1;

function getLocalDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addExp(state: PetState, expDelta: number): Pick<PetState, 'level' | 'exp'> {
  let level = state.level;
  let exp = state.exp + expDelta;

  while (exp >= getRequiredExp(level)) {
    exp -= getRequiredExp(level);
    level += 1;
  }

  return { level, exp };
}

export function applyDailyPat(state: PetState, now: Date, i18n: I18n): PetState {
  const occurredAt = now.toISOString();
  const alreadyPattedToday = state.lastPattedAt
    ? getLocalDayKey(new Date(state.lastPattedAt)) === getLocalDayKey(now)
    : false;
  const expDelta = alreadyPattedToday ? 0 : DAILY_PAT_EXP;
  const moodDelta = alreadyPattedToday ? REPEAT_PAT_MOOD : DAILY_PAT_MOOD;
  const message = i18n.t('log.patted');
  const { level, exp } = addExp(state, expDelta);

  const next = resolveEvolution({
    ...state,
    level,
    exp,
    mood: clampStat(state.mood + moodDelta),
    lastActiveAt: occurredAt,
    lastPattedAt: occurredAt,
    logs: alreadyPattedToday
      ? state.logs
      : [{
        message,
        expDelta,
        occurredAt,
      }, ...state.logs].slice(0, 20),
  });
  const withLife = {
    ...next,
    lifeStatus: getLifeStatus(next),
  };

  return resolveMonsterIdentity(withLife);
}
