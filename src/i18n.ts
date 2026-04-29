export type SupportedLocale = 'en' | 'ko' | 'ja' | 'zh';

type TranslationKey =
  | 'ui.exp'
  | 'ui.mood'
  | 'ui.hunger'
  | 'ui.energy'
  | 'ui.health'
  | 'ui.status'
  | 'ui.stage'
  | 'ui.lineage'
  | 'ui.affinity'
  | 'ui.species'
  | 'ui.type'
  | 'ui.skills'
  | 'ui.styleScores'
  | 'ui.pat'
  | 'ui.pattedToday'
  | 'ui.help'
  | 'ui.commit'
  | 'ui.viewStats'
  | 'ui.logsTitle'
  | 'ui.noActivity'
  | 'guide.title'
  | 'guide.growthTitle'
  | 'guide.growthBody'
  | 'guide.usageTitle'
  | 'guide.usageBody'
  | 'guide.patTitle'
  | 'guide.patBody'
  | 'guide.close'
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
  | 'log.patted'
  | 'log.alreadyPatted'
  | 'log.noGrowthDead';

type Dictionary = Record<TranslationKey, string>;

const dictionaries: Record<SupportedLocale, Dictionary> = {
  en: {
    'ui.exp': 'EXP',
    'ui.mood': 'Mood',
    'ui.hunger': 'Hunger',
    'ui.energy': 'Energy',
    'ui.health': 'Health',
    'ui.status': 'Status',
    'ui.stage': 'Stage',
    'ui.lineage': 'Lineage',
    'ui.affinity': 'Affinity',
    'ui.species': 'Species',
    'ui.type': 'Type',
    'ui.skills': 'Skills',
    'ui.styleScores': 'Style Scores',
    'ui.pat': 'Pat',
    'ui.pattedToday': 'Patted today',
    'ui.help': 'Help',
    'ui.commit': 'Commit',
    'ui.viewStats': 'View Stats',
    'ui.logsTitle': 'Gitagotchi Logs',
    'ui.noActivity': 'No activity yet.',
    'guide.title': 'Gitagotchi Guide',
    'guide.growthTitle': 'Growth Direction',
    'guide.growthBody': 'Gain EXP and style scores from commits, code changes, and resolved problems.',
    'guide.usageTitle': 'How to Use',
    'guide.usageBody': 'Open the pet panel from the status bar, check commits, view stats, and open Dex to track discoveries.',
    'guide.patTitle': 'Daily Pat',
    'guide.patBody': 'Pat once per day for bonus EXP and mood. Extra pats keep the pet happier without more EXP.',
    'guide.close': 'Close',
    'status.tooltip': 'Open Gitagotchi stats',
    'message.reward': '{exp} EXP from {count} bonuses',
    'message.unlock': 'Learned {skill}',
    'style.builder': 'Feature Throughput',
    'style.cleaner': 'Refactor Craft',
    'style.debugger': 'Bug Radar',
    'style.scholar': 'Docs Literacy',
    'style.streak': 'Commit Streak',
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
    'log.patted': 'Patted Gitagotchi',
    'log.alreadyPatted': 'Already patted today',
    'log.noGrowthDead': 'No growth while dead'
  },
  ko: {
    'ui.exp': 'EXP',
    'ui.mood': '기분',
    'ui.hunger': '배고픔',
    'ui.energy': '에너지',
    'ui.health': '건강',
    'ui.status': '상태',
    'ui.stage': '단계',
    'ui.lineage': '계열',
    'ui.affinity': '전문성',
    'ui.species': '종족',
    'ui.type': '타입',
    'ui.skills': '스킬',
    'ui.styleScores': '스타일 점수',
    'ui.pat': '만져주기',
    'ui.pattedToday': '오늘 만져줌',
    'ui.help': '도움말',
    'ui.commit': '커밋 확인',
    'ui.viewStats': '통계 보기',
    'ui.logsTitle': 'Gitagotchi 기록',
    'ui.noActivity': '아직 활동이 없습니다.',
    'guide.title': 'Gitagotchi 가이드',
    'guide.growthTitle': '성장 방향',
    'guide.growthBody': '커밋, 코드 변경, 문제 해결로 경험치와 스타일 점수를 얻습니다.',
    'guide.usageTitle': '사용법',
    'guide.usageBody': '상태바에서 펫 패널을 열고, 커밋 확인, 통계 보기, Dex 열기로 성장과 발견을 확인합니다.',
    'guide.patTitle': '하루 한 번 만져주기',
    'guide.patBody': '하루 한 번 만져주면 보너스 경험치와 기분을 얻습니다. 같은 날 추가로 만지면 경험치 없이 기분만 조금 오릅니다.',
    'guide.close': '닫기',
    'status.tooltip': 'Gitagotchi 통계 열기',
    'message.reward': '{exp} EXP, 보너스 {count}개',
    'message.unlock': '{skill} 습득',
    'style.builder': '기능 출하력',
    'style.cleaner': '리팩터링 숙련도',
    'style.debugger': '버그 레이더',
    'style.scholar': '문서 독해력',
    'style.streak': '커밋 연속성',
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
    'log.patted': 'Gitagotchi를 만져줬습니다',
    'log.alreadyPatted': '오늘은 이미 만져줬습니다',
    'log.noGrowthDead': '죽은 상태에서는 성장하지 않습니다'
  },
  ja: {
    'ui.exp': 'EXP',
    'ui.mood': '気分',
    'ui.hunger': '空腹',
    'ui.energy': 'エネルギー',
    'ui.health': '健康',
    'ui.status': '状態',
    'ui.stage': '段階',
    'ui.lineage': '系統',
    'ui.affinity': '専門性',
    'ui.species': '種族',
    'ui.type': 'タイプ',
    'ui.skills': 'スキル',
    'ui.styleScores': 'スタイルスコア',
    'ui.pat': 'なでる',
    'ui.pattedToday': '今日なでました',
    'ui.help': 'ヘルプ',
    'ui.commit': 'コミット確認',
    'ui.viewStats': '統計を見る',
    'ui.logsTitle': 'Gitagotchi ログ',
    'ui.noActivity': 'まだ活動がありません。',
    'guide.title': 'Gitagotchi ガイド',
    'guide.growthTitle': '成長方針',
    'guide.growthBody': 'コミット、コード変更、問題解決で EXP とスタイルスコアを獲得します。',
    'guide.usageTitle': '使い方',
    'guide.usageBody': 'ステータスバーからペットパネルを開き、コミット確認、統計、Dex で成長と発見を確認します。',
    'guide.patTitle': '1日1回なでる',
    'guide.patBody': '1日1回なでるとボーナス EXP と気分を得ます。同じ日に追加でなでると EXP なしで気分が少し上がります。',
    'guide.close': '閉じる',
    'status.tooltip': 'Gitagotchi の統計を開く',
    'message.reward': '{exp} EXP、ボーナス {count} 個',
    'message.unlock': '{skill} を習得',
    'style.builder': '機能出荷力',
    'style.cleaner': 'リファクタ熟練度',
    'style.debugger': 'バグレーダー',
    'style.scholar': 'ドキュメント読解力',
    'style.streak': 'コミット継続力',
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
    'log.patted': 'Gitagotchi をなでました',
    'log.alreadyPatted': '今日はもうなでました',
    'log.noGrowthDead': '倒れている間は成長しません'
  },
  zh: {
    'ui.exp': 'EXP',
    'ui.mood': '心情',
    'ui.hunger': '饥饿',
    'ui.energy': '能量',
    'ui.health': '健康',
    'ui.status': '状态',
    'ui.stage': '阶段',
    'ui.lineage': '谱系',
    'ui.affinity': '专长',
    'ui.species': '种族',
    'ui.type': '类型',
    'ui.skills': '技能',
    'ui.styleScores': '风格分数',
    'ui.pat': '抚摸',
    'ui.pattedToday': '今天已抚摸',
    'ui.help': '帮助',
    'ui.commit': '检查提交',
    'ui.viewStats': '查看统计',
    'ui.logsTitle': 'Gitagotchi 日志',
    'ui.noActivity': '还没有活动。',
    'guide.title': 'Gitagotchi 指南',
    'guide.growthTitle': '成长方向',
    'guide.growthBody': '通过提交、代码变更和解决问题获得 EXP 与风格分数。',
    'guide.usageTitle': '使用方法',
    'guide.usageBody': '从状态栏打开宠物面板，通过检查提交、查看统计和打开 Dex 跟踪成长与发现。',
    'guide.patTitle': '每日抚摸',
    'guide.patBody': '每天抚摸一次可获得额外 EXP 和心情。同一天再次抚摸不会增加 EXP，只会稍微提升心情。',
    'guide.close': '关闭',
    'status.tooltip': '打开 Gitagotchi 统计',
    'message.reward': '{exp} EXP，{count} 个奖励',
    'message.unlock': '学会 {skill}',
    'style.builder': '功能交付力',
    'style.cleaner': '重构熟练度',
    'style.debugger': '缺陷雷达',
    'style.scholar': '文档理解力',
    'style.streak': '提交连续性',
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
    'log.patted': '已抚摸 Gitagotchi',
    'log.alreadyPatted': '今天已经抚摸过了',
    'log.noGrowthDead': '死亡状态无法成长'
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
