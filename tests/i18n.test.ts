import { createActivityMessages } from '../src/messages/messageEngine';
import { createI18n, normalizeLocale } from '../src/i18n';

describe('i18n', () => {
  it('normalizes supported locale families', () => {
    expect(normalizeLocale('ko-KR')).toBe('ko');
    expect(normalizeLocale('en-US')).toBe('en');
    expect(normalizeLocale('ja-JP')).toBe('ja');
    expect(normalizeLocale('zh-CN')).toBe('zh');
    expect(normalizeLocale('fr-FR')).toBe('en');
  });

  it('translates UI labels for Korean, English, Japanese, and Chinese', () => {
    expect(createI18n('ko').t('ui.mood')).toBe('기분');
    expect(createI18n('en').t('ui.mood')).toBe('Mood');
    expect(createI18n('ja').t('ui.mood')).toBe('気分');
    expect(createI18n('zh').t('ui.mood')).toBe('心情');
  });

  it('formats modular reward and unlock messages by locale', () => {
    const ko = createActivityMessages({
      occurredAt: '2026-04-27T00:03:00.000Z',
      expDelta: 42,
      breakdown: [
        { id: 'base-diff', label: 'Code changes', expDelta: 16 },
        { id: 'skill.deepClean', label: 'Deep Clean skill', expDelta: 12 }
      ],
      styleScoresDelta: { cleaner: 20 },
      unlockedSkills: ['deepClean']
    }, createI18n('ko'));

    expect(ko).toEqual([
      { kind: 'reward', text: '+42 EXP, 보너스 2개' },
      { kind: 'style', text: '정리형 +20' },
      { kind: 'unlock', text: 'Deep Clean 습득' }
    ]);
  });
});
