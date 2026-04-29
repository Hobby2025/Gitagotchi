export type SupportedLocale = 'en' | 'ko' | 'ja' | 'zh';

type TranslationKey =
  | 'ui.exp'
  | 'ui.mood'
  | 'ui.hunger'
  | 'ui.fullness'
  | 'ui.energy'
  | 'ui.health'
  | 'ui.status'
  | 'ui.stage'
  | 'ui.lineage'
  | 'ui.affinity'
  | 'ui.species'
  | 'ui.type'
  | 'ui.skills'
  | 'ui.skillsEmpty'
  | 'ui.styleScores'
  | 'ui.carePulse'
  | 'ui.carePulseEmpty'
  | 'ui.nextBoost'
  | 'ui.nextBoostBody'
  | 'ui.unlockHint'
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
  | 'guide.careTitle'
  | 'guide.careIntro'
  | 'guide.care.code'
  | 'guide.care.commit'
  | 'guide.care.diagnostics'
  | 'guide.care.refactor'
  | 'guide.care.testsDocs'
  | 'guide.care.returnIdle'
  | 'guide.care.idle'
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
  | 'breakdown.return-from-idle'
  | 'breakdown.skill.deepClean'
  | 'breakdown.skill.quickFix'
  | 'breakdown.skill.fieldGuide'
  | 'breakdown.skill.focusFlow'
  | 'breakdown.skill.commitRoar'
  | 'log.patted'
  | 'log.alreadyPatted'
  | 'log.noGrowthDead'
  | 'boost.fullness'
  | 'boost.energy'
  | 'boost.health';

type Dictionary = Record<TranslationKey, string>;

const dictionaries: Record<SupportedLocale, Dictionary> = {
  en: {
    'ui.exp': 'EXP',
    'ui.mood': 'Mood',
    'ui.hunger': 'Hunger',
    'ui.fullness': 'Fullness',
    'ui.energy': 'Energy',
    'ui.health': 'Health',
    'ui.status': 'Status',
    'ui.stage': 'Stage',
    'ui.lineage': 'Lineage',
    'ui.affinity': 'Affinity',
    'ui.species': 'Species',
    'ui.type': 'Type',
    'ui.skills': 'Skills',
    'ui.skillsEmpty': 'No skills yet',
    'ui.styleScores': 'Style Scores',
    'ui.carePulse': 'Care Pulse',
    'ui.carePulseEmpty': 'Care will pulse here as coding restores fullness, energy, or health.',
    'ui.nextBoost': 'Next Boost',
    'ui.nextBoostBody': 'Gitagotchi responds best to the activity your lowest stat needs now.',
    'ui.unlockHint': 'Build, refactor, debug, document, and commit to unlock work-style skills.',
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
    'guide.careTitle': 'Care Recovery',
    'guide.careIntro': 'Stats recover automatically from development activity. Fullness is shown as 100 minus hunger.',
    'guide.care.code': 'Code changes: Fullness +3, Health +1',
    'guide.care.commit': 'Commits: Fullness +5, Energy +4, Health +3',
    'guide.care.diagnostics': 'Diagnostics resolved: Fullness +2, Energy +1, Health +4 per issue',
    'guide.care.refactor': 'Refactoring: Energy +1, Health +2',
    'guide.care.testsDocs': 'Tests and README/docs: Health +1 each; docs also Energy +1',
    'guide.care.returnIdle': 'Returning from idle: Energy +8 per day away, up to +20',
    'guide.care.idle': 'Idle time: Hunger rises while mood, energy, and health fall',
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
    'breakdown.return-from-idle': 'Return from idle',
    'breakdown.skill.deepClean': 'Deep Clean skill',
    'breakdown.skill.quickFix': 'Quick Fix skill',
    'breakdown.skill.fieldGuide': 'Field Guide skill',
    'breakdown.skill.focusFlow': 'Focus Flow skill',
    'breakdown.skill.commitRoar': 'Commit Roar skill',
    'log.patted': 'Patted Gitagotchi',
    'log.alreadyPatted': 'Already patted today',
    'log.noGrowthDead': 'No growth while dead',
    'boost.fullness': 'Make code changes to restore fullness.',
    'boost.energy': 'Commit finished work or return from idle to recover energy.',
    'boost.health': 'Resolve diagnostics, refactor, or add tests to restore health.'
  },
  ko: {
    'ui.exp': 'EXP',
    'ui.mood': '기분',
    'ui.hunger': '배고픔',
    'ui.fullness': '포만감',
    'ui.energy': '에너지',
    'ui.health': '건강',
    'ui.status': '상태',
    'ui.stage': '단계',
    'ui.lineage': '계열',
    'ui.affinity': '전문성',
    'ui.species': '종족',
    'ui.type': '타입',
    'ui.skills': '스킬',
    'ui.skillsEmpty': '아직 스킬 없음',
    'ui.styleScores': '스타일 점수',
    'ui.carePulse': '케어 펄스',
    'ui.carePulseEmpty': '코딩으로 포만감, 에너지, 건강이 회복되면 여기에 표시됩니다.',
    'ui.nextBoost': '다음 부스트',
    'ui.nextBoostBody': '가장 낮은 상태에 맞는 활동을 하면 Gitagotchi가 더 빠르게 회복합니다.',
    'ui.unlockHint': '기능 개발, 리팩터링, 디버깅, 문서화, 커밋을 쌓으면 작업 스타일 스킬이 열립니다.',
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
    'guide.careTitle': '케어 회복',
    'guide.careIntro': '개발 활동을 하면 상태가 자동으로 회복됩니다. 포만감은 100에서 배고픔을 뺀 값입니다.',
    'guide.care.code': '코드 변경: 포만감 +3, 건강 +1',
    'guide.care.commit': '커밋: 포만감 +5, 에너지 +4, 건강 +3',
    'guide.care.diagnostics': '문제 해결: 문제 1개마다 포만감 +2, 에너지 +1, 건강 +4',
    'guide.care.refactor': '리팩터링: 에너지 +1, 건강 +2',
    'guide.care.testsDocs': '테스트와 README/문서: 각각 건강 +1, 문서는 에너지 +1 추가',
    'guide.care.returnIdle': '방치 후 복귀: 떠나 있던 하루마다 에너지 +8, 최대 +20',
    'guide.care.idle': '방치 시간: 배고픔은 오르고 기분, 에너지, 건강은 내려갑니다',
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
    'breakdown.return-from-idle': '복귀 회복',
    'breakdown.skill.deepClean': 'Deep Clean 스킬',
    'breakdown.skill.quickFix': 'Quick Fix 스킬',
    'breakdown.skill.fieldGuide': 'Field Guide 스킬',
    'breakdown.skill.focusFlow': 'Focus Flow 스킬',
    'breakdown.skill.commitRoar': 'Commit Roar 스킬',
    'log.patted': 'Gitagotchi를 만져줬습니다',
    'log.alreadyPatted': '오늘은 이미 만져줬습니다',
    'log.noGrowthDead': '죽은 상태에서는 성장하지 않습니다',
    'boost.fullness': '코드를 변경하면 포만감이 회복됩니다.',
    'boost.energy': '완성한 작업을 커밋하거나 방치 후 복귀하면 에너지가 회복됩니다.',
    'boost.health': '문제 해결, 리팩터링, 테스트 추가로 건강이 회복됩니다.'
  },
  ja: {
    'ui.exp': 'EXP',
    'ui.mood': '気分',
    'ui.hunger': '空腹',
    'ui.fullness': '満腹度',
    'ui.energy': 'エネルギー',
    'ui.health': '健康',
    'ui.status': '状態',
    'ui.stage': '段階',
    'ui.lineage': '系統',
    'ui.affinity': '専門性',
    'ui.species': '種族',
    'ui.type': 'タイプ',
    'ui.skills': 'スキル',
    'ui.skillsEmpty': 'まだスキルはありません',
    'ui.styleScores': 'スタイルスコア',
    'ui.carePulse': 'ケアパルス',
    'ui.carePulseEmpty': 'コーディングで満腹度、エネルギー、健康が回復するとここに表示されます。',
    'ui.nextBoost': '次のブースト',
    'ui.nextBoostBody': '一番低い状態に合う活動ほど Gitagotchi はよく回復します。',
    'ui.unlockHint': '開発、リファクタリング、デバッグ、文書化、コミットで作業スタイルスキルを解放します。',
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
    'guide.careTitle': 'ケア回復',
    'guide.careIntro': '開発活動で状態が自動回復します。満腹度は 100 から空腹を引いた値です。',
    'guide.care.code': 'コード変更: 満腹度 +3、健康 +1',
    'guide.care.commit': 'コミット: 満腹度 +5、エネルギー +4、健康 +3',
    'guide.care.diagnostics': '問題解決: 1 件ごとに満腹度 +2、エネルギー +1、健康 +4',
    'guide.care.refactor': 'リファクタリング: エネルギー +1、健康 +2',
    'guide.care.testsDocs': 'テストと README/文書: それぞれ健康 +1、文書はさらにエネルギー +1',
    'guide.care.returnIdle': '放置後の復帰: 離れていた 1 日ごとにエネルギー +8、最大 +20',
    'guide.care.idle': '放置時間: 空腹が増え、気分、エネルギー、健康が下がります',
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
    'breakdown.return-from-idle': '復帰回復',
    'breakdown.skill.deepClean': 'Deep Clean スキル',
    'breakdown.skill.quickFix': 'Quick Fix スキル',
    'breakdown.skill.fieldGuide': 'Field Guide スキル',
    'breakdown.skill.focusFlow': 'Focus Flow スキル',
    'breakdown.skill.commitRoar': 'Commit Roar スキル',
    'log.patted': 'Gitagotchi をなでました',
    'log.alreadyPatted': '今日はもうなでました',
    'log.noGrowthDead': '倒れている間は成長しません',
    'boost.fullness': 'コード変更で満腹度が回復します。',
    'boost.energy': '作業をコミットするか、放置後に戻るとエネルギーが回復します。',
    'boost.health': '問題解決、リファクタリング、テスト追加で健康が回復します。'
  },
  zh: {
    'ui.exp': 'EXP',
    'ui.mood': '心情',
    'ui.hunger': '饥饿',
    'ui.fullness': '饱足',
    'ui.energy': '能量',
    'ui.health': '健康',
    'ui.status': '状态',
    'ui.stage': '阶段',
    'ui.lineage': '谱系',
    'ui.affinity': '专长',
    'ui.species': '种族',
    'ui.type': '类型',
    'ui.skills': '技能',
    'ui.skillsEmpty': '还没有技能',
    'ui.styleScores': '风格分数',
    'ui.carePulse': '照护脉冲',
    'ui.carePulseEmpty': '编码恢复饱足、能量或健康时会显示在这里。',
    'ui.nextBoost': '下一次提升',
    'ui.nextBoostBody': '根据当前最低状态行动，Gitagotchi 会恢复得更好。',
    'ui.unlockHint': '通过开发、重构、调试、写文档和提交解锁工作风格技能。',
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
    'guide.careTitle': '照护恢复',
    'guide.careIntro': '开发活动会自动恢复状态。饱足显示为 100 减去饥饿。',
    'guide.care.code': '代码变更：饱足 +3，健康 +1',
    'guide.care.commit': '提交：饱足 +5，能量 +4，健康 +3',
    'guide.care.diagnostics': '问题解决：每个问题饱足 +2，能量 +1，健康 +4',
    'guide.care.refactor': '重构：能量 +1，健康 +2',
    'guide.care.testsDocs': '测试和 README/文档：各健康 +1；文档另加能量 +1',
    'guide.care.returnIdle': '闲置后回归：离开每一天能量 +8，最多 +20',
    'guide.care.idle': '闲置时间：饥饿上升，心情、能量和健康下降',
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
    'breakdown.return-from-idle': '回归恢复',
    'breakdown.skill.deepClean': 'Deep Clean 技能',
    'breakdown.skill.quickFix': 'Quick Fix 技能',
    'breakdown.skill.fieldGuide': 'Field Guide 技能',
    'breakdown.skill.focusFlow': 'Focus Flow 技能',
    'breakdown.skill.commitRoar': 'Commit Roar 技能',
    'log.patted': '已抚摸 Gitagotchi',
    'log.alreadyPatted': '今天已经抚摸过了',
    'log.noGrowthDead': '死亡状态无法成长',
    'boost.fullness': '进行代码变更可恢复饱足。',
    'boost.energy': '提交完成的工作或闲置后回归可恢复能量。',
    'boost.health': '解决问题、重构或添加测试可恢复健康。'
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
