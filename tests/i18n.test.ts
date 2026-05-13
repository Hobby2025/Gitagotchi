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
    expect(createI18n('ko').t('ui.pat')).toBe('만져주기');
    expect(createI18n('ko').t('ui.revive')).toBe('부활');
    expect(createI18n('ko').t('ui.help')).toBe('도움말');
    expect(createI18n('en').t('guide.title')).toBe('Gitagotchi Guide');
    expect(createI18n('en').t('ui.mood')).toBe('Mood');
    expect(createI18n('ja').t('ui.mood')).toBe('気分');
    expect(createI18n('zh').t('ui.mood')).toBe('心情');
    expect(createI18n('en').t('style.builder')).toBe('Feature Throughput');
    expect(createI18n('ko').t('style.cleaner')).toBe('리팩터링 숙련도');
    expect(createI18n('ko').t('skill.deepClean')).toBe('대청소');
    expect(createI18n('ja').t('style.debugger')).toBe('バグレーダー');
    expect(createI18n('zh').t('style.streak')).toBe('提交连续性');
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
      { kind: 'style', text: '리팩터링 숙련도 +20' },
      { kind: 'unlock', text: '대청소 습득' }
    ]);
  });
});
