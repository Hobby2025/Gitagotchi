export type SupportedLocale = 'en' | 'ko' | 'ja' | 'zh';

type TranslationKey =
  | 'ui.exp'
  | 'ui.mood'
  | 'ui.hunger'
  | 'ui.energy'
  | 'ui.health'
  | 'ui.status'
  | 'ui.species'
  | 'ui.type'
  | 'ui.skills'
  | 'ui.styleScores'
  | 'ui.feed'
  | 'ui.commit'
  | 'ui.viewStats'
  | 'ui.logsTitle'
  | 'ui.noActivity'
  | 'status.tooltip'
  | 'message.reward'
  | 'message.unlock'
  | 'style.builder'
  | 'style.cleaner'
  | 'style.debugger'
  | 'style.scholar'
  | 'style.streak'
  | 'skill.deepClean'
  | 'skill.quickFix'
  | 'skill.fieldGuide'
  | 'skill.focusFlow'
  | 'skill.commitRoar'
  | 'breakdown.base-diff'
  | 'breakdown.refactor'
  | 'breakdown.file.test'
  | 'breakdown.file.readme'
  | 'breakdown.file.config'
  | 'breakdown.commit-message'
  | 'breakdown.diagnostics.resolved'
  | 'breakdown.diagnostics.increased'
  | 'breakdown.idle-decay'
  | 'breakdown.skill.deepClean'
  | 'breakdown.skill.quickFix'
  | 'breakdown.skill.fieldGuide'
  | 'breakdown.skill.focusFlow'
  | 'breakdown.skill.commitRoar'
  | 'log.fed'
  | 'log.noGrowthDead'
  | 'ui.leaderboard'
  | 'leaderboard.title'
  | 'leaderboard.player'
  | 'leaderboard.level'
  | 'leaderboard.exp'
  | 'leaderboard.score'
  | 'leaderboard.avatar'
  | 'leaderboard.lastSync'
  | 'leaderboard.nextSync'
  | 'leaderboard.disabled'
  | 'leaderboard.missingConfig'
  | 'leaderboard.signedOut'
  | 'leaderboard.error';

type Dictionary = Record<TranslationKey, string>;

const dictionaries: Record<SupportedLocale, Dictionary> = {
  en: {
    'ui.exp': 'EXP',
    'ui.mood': 'Mood',
    'ui.hunger': 'Hunger',
    'ui.energy': 'Energy',
    'ui.health': 'Health',
    'ui.status': 'Status',
    'ui.species': 'Species',
    'ui.type': 'Type',
    'ui.skills': 'Skills',
    'ui.styleScores': 'Style Scores',
    'ui.feed': 'Feed',
    'ui.commit': 'Commit',
    'ui.viewStats': 'View Stats',
    'ui.logsTitle': 'Gitagotchi Logs',
    'ui.noActivity': 'No activity yet.',
    'status.tooltip': 'Open Gitagotchi stats',
    'message.reward': '{exp} EXP from {count} bonuses',
    'message.unlock': 'Learned {skill}',
    'style.builder': 'Builder',
    'style.cleaner': 'Cleaner',
    'style.debugger': 'Debugger',
    'style.scholar': 'Scholar',
    'style.streak': 'Streak',
    'skill.deepClean': 'Deep Clean',
    'skill.quickFix': 'Quick Fix',
    'skill.fieldGuide': 'Field Guide',
    'skill.focusFlow': 'Focus Flow',
    'skill.commitRoar': 'Commit Roar',
    'breakdown.base-diff': 'Code changes',
    'breakdown.refactor': 'Refactoring',
    'breakdown.file.test': 'Test changes',
    'breakdown.file.readme': 'README changes',
    'breakdown.file.config': 'Config changes',
    'breakdown.commit-message': 'Commit completed',
    'breakdown.diagnostics.resolved': 'Diagnostics resolved',
    'breakdown.diagnostics.increased': 'Diagnostics increased',
    'breakdown.idle-decay': 'Idle decay',
    'breakdown.skill.deepClean': 'Deep Clean skill',
    'breakdown.skill.quickFix': 'Quick Fix skill',
    'breakdown.skill.fieldGuide': 'Field Guide skill',
    'breakdown.skill.focusFlow': 'Focus Flow skill',
    'breakdown.skill.commitRoar': 'Commit Roar skill',
    'log.fed': 'Fed Gitagotchi',
    'log.noGrowthDead': 'No growth while dead',
    'ui.leaderboard': 'Leaderboard',
    'leaderboard.title': 'Gitagotchi Leaderboard',
    'leaderboard.player': 'Player',
    'leaderboard.level': 'Level',
    'leaderboard.exp': 'EXP',
    'leaderboard.score': 'Score',
    'leaderboard.avatar': 'Avatar',
    'leaderboard.lastSync': 'Last sync',
    'leaderboard.nextSync': 'Next sync',
    'leaderboard.disabled': 'Leaderboard is disabled.',
    'leaderboard.missingConfig': 'Set a GitHub Gist ID to join a leaderboard.',
    'leaderboard.signedOut': 'Connect GitHub to sync leaderboard data.',
    'leaderboard.error': 'Leaderboard sync failed.'
  },
  ko: {
    'ui.exp': 'EXP',
    'ui.mood': '기분',
    'ui.hunger': '배고픔',
    'ui.energy': '에너지',
    'ui.health': '건강',
    'ui.status': '상태',
    'ui.species': '종족',
    'ui.type': '타입',
    'ui.skills': '스킬',
    'ui.styleScores': '스타일 점수',
    'ui.feed': '먹이 주기',
    'ui.commit': '커밋 확인',
    'ui.viewStats': '통계 보기',
    'ui.logsTitle': 'Gitagotchi 기록',
    'ui.noActivity': '아직 활동이 없습니다.',
    'status.tooltip': 'Gitagotchi 통계 열기',
    'message.reward': '{exp} EXP, 보너스 {count}개',
    'message.unlock': '{skill} 습득',
    'style.builder': '빌더형',
    'style.cleaner': '정리형',
    'style.debugger': '디버거형',
    'style.scholar': '학자형',
    'style.streak': '꾸준함',
    'skill.deepClean': 'Deep Clean',
    'skill.quickFix': 'Quick Fix',
    'skill.fieldGuide': 'Field Guide',
    'skill.focusFlow': 'Focus Flow',
    'skill.commitRoar': 'Commit Roar',
    'breakdown.base-diff': '코드 변화',
    'breakdown.refactor': '리팩토링',
    'breakdown.file.test': '테스트 변경',
    'breakdown.file.readme': 'README 변경',
    'breakdown.file.config': '설정 변경',
    'breakdown.commit-message': '커밋 완료',
    'breakdown.diagnostics.resolved': '문제 해결',
    'breakdown.diagnostics.increased': '문제 증가',
    'breakdown.idle-decay': '방치 감소',
    'breakdown.skill.deepClean': 'Deep Clean 스킬',
    'breakdown.skill.quickFix': 'Quick Fix 스킬',
    'breakdown.skill.fieldGuide': 'Field Guide 스킬',
    'breakdown.skill.focusFlow': 'Focus Flow 스킬',
    'breakdown.skill.commitRoar': 'Commit Roar 스킬',
    'log.fed': 'Gitagotchi에게 먹이를 줬습니다',
    'log.noGrowthDead': '죽은 상태에서는 성장하지 않습니다',
    'ui.leaderboard': '랭킹',
    'leaderboard.title': 'Gitagotchi 랭킹',
    'leaderboard.player': '플레이어',
    'leaderboard.level': '레벨',
    'leaderboard.exp': 'EXP',
    'leaderboard.score': '점수',
    'leaderboard.avatar': '외형',
    'leaderboard.lastSync': '최근 동기화',
    'leaderboard.nextSync': '다음 동기화',
    'leaderboard.disabled': '랭킹이 비활성화되어 있습니다.',
    'leaderboard.missingConfig': '랭킹에 참여하려면 GitHub Gist ID를 설정하세요.',
    'leaderboard.signedOut': '랭킹 동기화를 위해 GitHub를 연결하세요.',
    'leaderboard.error': '랭킹 동기화에 실패했습니다.'
  },
  ja: {
    'ui.exp': 'EXP',
    'ui.mood': '気分',
    'ui.hunger': '空腹',
    'ui.energy': 'エネルギー',
    'ui.health': '健康',
    'ui.status': '状態',
    'ui.species': '種族',
    'ui.type': 'タイプ',
    'ui.skills': 'スキル',
    'ui.styleScores': 'スタイルスコア',
    'ui.feed': 'エサをあげる',
    'ui.commit': 'コミット確認',
    'ui.viewStats': '統計を見る',
    'ui.logsTitle': 'Gitagotchi ログ',
    'ui.noActivity': 'まだ活動がありません。',
    'status.tooltip': 'Gitagotchi の統計を開く',
    'message.reward': '{exp} EXP、ボーナス {count} 個',
    'message.unlock': '{skill} を習得',
    'style.builder': 'ビルダー',
    'style.cleaner': 'クリーナー',
    'style.debugger': 'デバッガー',
    'style.scholar': 'スカラー',
    'style.streak': '継続',
    'skill.deepClean': 'Deep Clean',
    'skill.quickFix': 'Quick Fix',
    'skill.fieldGuide': 'Field Guide',
    'skill.focusFlow': 'Focus Flow',
    'skill.commitRoar': 'Commit Roar',
    'breakdown.base-diff': 'コード変更',
    'breakdown.refactor': 'リファクタリング',
    'breakdown.file.test': 'テスト変更',
    'breakdown.file.readme': 'README 変更',
    'breakdown.file.config': '設定変更',
    'breakdown.commit-message': 'コミット完了',
    'breakdown.diagnostics.resolved': '問題を解決',
    'breakdown.diagnostics.increased': '問題が増加',
    'breakdown.idle-decay': '放置による低下',
    'breakdown.skill.deepClean': 'Deep Clean スキル',
    'breakdown.skill.quickFix': 'Quick Fix スキル',
    'breakdown.skill.fieldGuide': 'Field Guide スキル',
    'breakdown.skill.focusFlow': 'Focus Flow スキル',
    'breakdown.skill.commitRoar': 'Commit Roar スキル',
    'log.fed': 'Gitagotchi にエサをあげました',
    'log.noGrowthDead': '倒れている間は成長しません',
    'ui.leaderboard': 'ランキング',
    'leaderboard.title': 'Gitagotchi ランキング',
    'leaderboard.player': 'プレイヤー',
    'leaderboard.level': 'レベル',
    'leaderboard.exp': 'EXP',
    'leaderboard.score': 'スコア',
    'leaderboard.avatar': 'アバター',
    'leaderboard.lastSync': '最終同期',
    'leaderboard.nextSync': '次の同期',
    'leaderboard.disabled': 'ランキングは無効です。',
    'leaderboard.missingConfig': 'ランキングに参加するには GitHub Gist ID を設定してください。',
    'leaderboard.signedOut': 'ランキング同期には GitHub 接続が必要です。',
    'leaderboard.error': 'ランキング同期に失敗しました。'
  },
  zh: {
    'ui.exp': 'EXP',
    'ui.mood': '心情',
    'ui.hunger': '饥饿',
    'ui.energy': '能量',
    'ui.health': '健康',
    'ui.status': '状态',
    'ui.species': '种族',
    'ui.type': '类型',
    'ui.skills': '技能',
    'ui.styleScores': '风格分数',
    'ui.feed': '喂食',
    'ui.commit': '检查提交',
    'ui.viewStats': '查看统计',
    'ui.logsTitle': 'Gitagotchi 日志',
    'ui.noActivity': '还没有活动。',
    'status.tooltip': '打开 Gitagotchi 统计',
    'message.reward': '{exp} EXP，{count} 个奖励',
    'message.unlock': '学会 {skill}',
    'style.builder': '构建型',
    'style.cleaner': '清理型',
    'style.debugger': '调试型',
    'style.scholar': '学者型',
    'style.streak': '连续',
    'skill.deepClean': 'Deep Clean',
    'skill.quickFix': 'Quick Fix',
    'skill.fieldGuide': 'Field Guide',
    'skill.focusFlow': 'Focus Flow',
    'skill.commitRoar': 'Commit Roar',
    'breakdown.base-diff': '代码变更',
    'breakdown.refactor': '重构',
    'breakdown.file.test': '测试变更',
    'breakdown.file.readme': 'README 变更',
    'breakdown.file.config': '配置变更',
    'breakdown.commit-message': '提交完成',
    'breakdown.diagnostics.resolved': '问题已解决',
    'breakdown.diagnostics.increased': '问题增加',
    'breakdown.idle-decay': '闲置衰减',
    'breakdown.skill.deepClean': 'Deep Clean 技能',
    'breakdown.skill.quickFix': 'Quick Fix 技能',
    'breakdown.skill.fieldGuide': 'Field Guide 技能',
    'breakdown.skill.focusFlow': 'Focus Flow 技能',
    'breakdown.skill.commitRoar': 'Commit Roar 技能',
    'log.fed': '已喂食 Gitagotchi',
    'log.noGrowthDead': '死亡状态无法成长',
    'ui.leaderboard': '排行榜',
    'leaderboard.title': 'Gitagotchi 排行榜',
    'leaderboard.player': '玩家',
    'leaderboard.level': '等级',
    'leaderboard.exp': 'EXP',
    'leaderboard.score': '分数',
    'leaderboard.avatar': '外观',
    'leaderboard.lastSync': '上次同步',
    'leaderboard.nextSync': '下次同步',
    'leaderboard.disabled': '排行榜已禁用。',
    'leaderboard.missingConfig': '设置 GitHub Gist ID 后即可加入排行榜。',
    'leaderboard.signedOut': '连接 GitHub 后即可同步排行榜。',
    'leaderboard.error': '排行榜同步失败。'
  }
};

export type I18n = {
  locale: SupportedLocale;
  t(key: string, values?: Record<string, string | number>): string;
};

export function normalizeLocale(locale: string | undefined): SupportedLocale {
  const normalized = locale?.toLowerCase() ?? 'en';

  if (normalized.startsWith('ko')) {
    return 'ko';
  }
  if (normalized.startsWith('ja')) {
    return 'ja';
  }
  if (normalized.startsWith('zh')) {
    return 'zh';
  }
  if (normalized.startsWith('en')) {
    return 'en';
  }

  return 'en';
}

export function createI18n(locale: string | undefined = 'en'): I18n {
  const supportedLocale = normalizeLocale(locale);
  const dictionary = dictionaries[supportedLocale];

  return {
    locale: supportedLocale,
    t(key, values = {}) {
      const translationKey = key as TranslationKey;
      const template = dictionary[translationKey] ?? dictionaries.en[translationKey] ?? key;
      return Object.entries(values).reduce(
        (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
        template
      );
    }
  };
}
