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
  | 'ui.dex'
  | 'ui.rename'
  | 'ui.reset'
  | 'ui.revive'
  | 'ui.profile'
  | 'ui.help'
  | 'ui.commit'
  | 'ui.viewStats'
  | 'ui.logsTitle'
  | 'ui.noActivity'
  | 'ui.status.alive'
  | 'ui.status.sleeping'
  | 'ui.status.critical'
  | 'ui.status.dead'
  | 'ui.stage.egg'
  | 'ui.stage.hatchling'
  | 'ui.stage.toolkit'
  | 'ui.stage.specialist'
  | 'ui.stage.ultimate'
  | 'ui.lineage.unbranched'
  | 'ui.lineage.buildling'
  | 'ui.lineage.refact'
  | 'ui.lineage.debugon'
  | 'ui.lineage.archivox'
  | 'ui.affinity.unfocused'
  | 'ui.affinity.builder'
  | 'ui.affinity.cleaner'
  | 'ui.affinity.debugger'
  | 'ui.affinity.scholar'
  | 'ui.affinity.streak'
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
  | 'guide.reviveTitle'
  | 'guide.reviveBody'
  | 'guide.close'
  | 'status.tooltip'
  | 'status.open'
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
  | 'skill.deepClean.effect'
  | 'skill.quickFix.effect'
  | 'skill.fieldGuide.effect'
  | 'skill.focusFlow.effect'
  | 'skill.commitRoar.effect'
  | 'skill.deepClean.trigger'
  | 'skill.quickFix.trigger'
  | 'skill.fieldGuide.trigger'
  | 'skill.focusFlow.trigger'
  | 'skill.commitRoar.trigger'
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
  | 'breakdown.revive'
  | 'breakdown.skill.deepClean'
  | 'breakdown.skill.quickFix'
  | 'breakdown.skill.fieldGuide'
  | 'breakdown.skill.focusFlow'
  | 'breakdown.skill.commitRoar'
  | 'log.patted'
  | 'log.alreadyPatted'
  | 'log.noGrowthDead'
  | 'log.revived'
  | 'notice.reviveNotDead'
  | 'notice.reviveNotEnough'
  | 'notice.revived'
  | 'prompt.rename'
  | 'prompt.renameBegin'
  | 'prompt.nameRequired'
  | 'prompt.resetConfirm'
  | 'prompt.resetAction'
  | 'dex.title'
  | 'dex.body'
  | 'dex.unlocked'
  | 'dex.unknown'
  | 'dex.lockedSprite'
  | 'dex.common'
  | 'dex.base'
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
    'ui.dex': 'Dex',
    'ui.rename': 'Rename',
    'ui.reset': 'Reset',
    'ui.revive': 'Revive',
    'ui.profile': 'Runtime Profile',
    'ui.help': 'Help',
    'ui.commit': 'Commit',
    'ui.viewStats': 'View Stats',
    'ui.logsTitle': 'Gitagotchi Logs',
    'ui.noActivity': 'No activity yet.',
    'ui.status.alive': 'Alive',
    'ui.status.sleeping': 'Sleeping',
    'ui.status.critical': 'Critical',
    'ui.status.dead': 'Dead',
    'ui.stage.egg': 'Egg',
    'ui.stage.hatchling': 'Hatchling',
    'ui.stage.toolkit': 'Toolkit',
    'ui.stage.specialist': 'Specialist',
    'ui.stage.ultimate': 'Ultimate',
    'ui.lineage.unbranched': 'Unbranched',
    'ui.lineage.buildling': 'Buildling',
    'ui.lineage.refact': 'Refact',
    'ui.lineage.debugon': 'Debugon',
    'ui.lineage.archivox': 'Archivox',
    'ui.affinity.unfocused': 'Unfocused',
    'ui.affinity.builder': 'Builder',
    'ui.affinity.cleaner': 'Cleaner',
    'ui.affinity.debugger': 'Debugger',
    'ui.affinity.scholar': 'Scholar',
    'ui.affinity.streak': 'Streak',
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
    'guide.reviveTitle': 'Revive',
    'guide.reviveBody': 'If Gitagotchi is dead, spend 500 earned EXP to revive it with stable health, energy, and mood.',
    'guide.close': 'Close',
    'status.tooltip': 'Open Gitagotchi stats',
    'status.open': 'Click to open Gitagotchi.',
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
    'skill.deepClean.effect': 'Refactor-heavy diffs add EXP and mood.',
    'skill.quickFix.effect': 'Resolved diagnostics add extra EXP and mood.',
    'skill.fieldGuide.effect': 'Docs changes restore health and add EXP.',
    'skill.focusFlow.effect': 'High mood and health turn coding into energy.',
    'skill.commitRoar.effect': 'Commit events add bonus EXP.',
    'skill.deepClean.trigger': 'Cleaner style mastery',
    'skill.quickFix.trigger': 'Debugging style mastery',
    'skill.fieldGuide.trigger': 'Scholar style mastery',
    'skill.focusFlow.trigger': 'Strong care condition',
    'skill.commitRoar.trigger': 'Commit streak mastery',
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
    'breakdown.revive': 'Revive',
    'breakdown.skill.deepClean': 'Deep Clean skill',
    'breakdown.skill.quickFix': 'Quick Fix skill',
    'breakdown.skill.fieldGuide': 'Field Guide skill',
    'breakdown.skill.focusFlow': 'Focus Flow skill',
    'breakdown.skill.commitRoar': 'Commit Roar skill',
    'log.patted': 'Patted Gitagotchi',
    'log.alreadyPatted': 'Already patted today',
    'log.noGrowthDead': 'No growth while dead',
    'log.revived': 'Revived Gitagotchi',
    'notice.reviveNotDead': 'Gitagotchi is not dead.',
    'notice.reviveNotEnough': 'Revive needs 500 earned EXP. Available earned EXP: {exp}.',
    'notice.revived': 'Gitagotchi revived. Spent 500 EXP.',
    'prompt.rename': 'Name your Gitagotchi',
    'prompt.renameBegin': 'Name your Gitagotchi to begin',
    'prompt.nameRequired': 'Name is required.',
    'prompt.resetConfirm': 'Reset Gitagotchi? This clears the current pet name, level, stats, skills, and logs.',
    'prompt.resetAction': 'Reset',
    'dex.title': 'Gitagotchi Dex',
    'dex.body': 'All current pet designs are listed here. Locked rendering is ready for future discovery rules.',
    'dex.unlocked': '{unlocked}/{total} unlocked',
    'dex.unknown': 'Unknown pet',
    'dex.lockedSprite': 'Locked Gitagotchi sprite',
    'dex.common': 'Common',
    'dex.base': 'Base',
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
    'ui.dex': '도감',
    'ui.rename': '이름 변경',
    'ui.reset': '초기화',
    'ui.revive': '부활',
    'ui.profile': '런타임 프로필',
    'ui.help': '도움말',
    'ui.commit': '커밋 확인',
    'ui.viewStats': '통계 보기',
    'ui.logsTitle': 'Gitagotchi 기록',
    'ui.noActivity': '아직 활동이 없습니다.',
    'ui.status.alive': '생존',
    'ui.status.sleeping': '수면',
    'ui.status.critical': '위험',
    'ui.status.dead': '사망',
    'ui.stage.egg': '알',
    'ui.stage.hatchling': '유년기',
    'ui.stage.toolkit': '성장기',
    'ui.stage.specialist': '전문가',
    'ui.stage.ultimate': '궁극',
    'ui.lineage.unbranched': '미분기',
    'ui.lineage.buildling': '빌들링',
    'ui.lineage.refact': '리팩트',
    'ui.lineage.debugon': '디버곤',
    'ui.lineage.archivox': '아카이복스',
    'ui.affinity.unfocused': '미정',
    'ui.affinity.builder': '기능 출하',
    'ui.affinity.cleaner': '리팩터링',
    'ui.affinity.debugger': '디버깅',
    'ui.affinity.scholar': '문서',
    'ui.affinity.streak': '커밋 연속',
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
    'guide.reviveTitle': '부활',
    'guide.reviveBody': 'Gitagotchi가 죽은 상태라면 누적 경험치 500을 사용해 건강, 에너지, 기분이 안정된 상태로 부활시킬 수 있습니다.',
    'guide.close': '닫기',
    'status.tooltip': 'Gitagotchi 통계 열기',
    'status.open': '클릭하면 Gitagotchi를 엽니다.',
    'message.reward': '{exp} EXP, 보너스 {count}개',
    'message.unlock': '{skill} 습득',
    'style.builder': '기능 출하력',
    'style.cleaner': '리팩터링 숙련도',
    'style.debugger': '버그 레이더',
    'style.scholar': '문서 독해력',
    'style.streak': '커밋 연속성',
    'skill.deepClean': '대청소',
    'skill.quickFix': '빠른 수정',
    'skill.fieldGuide': '현장 가이드',
    'skill.focusFlow': '집중 흐름',
    'skill.commitRoar': '커밋 포효',
    'skill.deepClean.effect': '리팩터링 비중이 큰 변경은 추가 경험치와 기분을 줍니다.',
    'skill.quickFix.effect': '문제를 해결하면 추가 경험치와 기분을 줍니다.',
    'skill.fieldGuide.effect': '문서 변경은 건강을 회복하고 경험치를 줍니다.',
    'skill.focusFlow.effect': '기분과 건강이 높으면 코딩 활동이 에너지로 전환됩니다.',
    'skill.commitRoar.effect': '커밋 이벤트가 보너스 경험치를 줍니다.',
    'skill.deepClean.trigger': '리팩터링 스타일 숙련',
    'skill.quickFix.trigger': '디버깅 스타일 숙련',
    'skill.fieldGuide.trigger': '문서 스타일 숙련',
    'skill.focusFlow.trigger': '좋은 케어 상태',
    'skill.commitRoar.trigger': '커밋 연속성 숙련',
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
    'breakdown.revive': '부활',
    'breakdown.skill.deepClean': '대청소 스킬',
    'breakdown.skill.quickFix': '빠른 수정 스킬',
    'breakdown.skill.fieldGuide': '현장 가이드 스킬',
    'breakdown.skill.focusFlow': '집중 흐름 스킬',
    'breakdown.skill.commitRoar': '커밋 포효 스킬',
    'log.patted': 'Gitagotchi를 만져줬습니다',
    'log.alreadyPatted': '오늘은 이미 만져줬습니다',
    'log.noGrowthDead': '죽은 상태에서는 성장하지 않습니다',
    'log.revived': 'Gitagotchi가 부활했습니다',
    'notice.reviveNotDead': 'Gitagotchi가 죽은 상태가 아닙니다.',
    'notice.reviveNotEnough': '부활에는 누적 경험치 500이 필요합니다. 사용 가능한 누적 경험치: {exp}.',
    'notice.revived': 'Gitagotchi가 부활했습니다. 경험치 500을 사용했습니다.',
    'prompt.rename': 'Gitagotchi 이름 정하기',
    'prompt.renameBegin': '시작하려면 Gitagotchi 이름을 정해주세요',
    'prompt.nameRequired': '이름은 필수입니다.',
    'prompt.resetConfirm': 'Gitagotchi를 초기화할까요? 현재 펫 이름, 레벨, 상태, 스킬, 기록이 삭제됩니다.',
    'prompt.resetAction': '초기화',
    'dex.title': 'Gitagotchi 도감',
    'dex.body': '현재 펫 디자인이 모두 표시됩니다. 잠긴 항목은 향후 발견 규칙을 위해 준비되어 있습니다.',
    'dex.unlocked': '{unlocked}/{total} 발견',
    'dex.unknown': '알 수 없는 펫',
    'dex.lockedSprite': '잠긴 Gitagotchi 스프라이트',
    'dex.common': '공통',
    'dex.base': '기본',
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
    'ui.dex': '図鑑',
    'ui.rename': '名前変更',
    'ui.reset': 'リセット',
    'ui.revive': '復活',
    'ui.profile': 'ランタイムプロフィール',
    'ui.help': 'ヘルプ',
    'ui.commit': 'コミット確認',
    'ui.viewStats': '統計を見る',
    'ui.logsTitle': 'Gitagotchi ログ',
    'ui.noActivity': 'まだ活動がありません。',
    'ui.status.alive': '生存',
    'ui.status.sleeping': '睡眠',
    'ui.status.critical': '危険',
    'ui.status.dead': '死亡',
    'ui.stage.egg': 'たまご',
    'ui.stage.hatchling': '幼体',
    'ui.stage.toolkit': '成長体',
    'ui.stage.specialist': '専門体',
    'ui.stage.ultimate': '究極体',
    'ui.lineage.unbranched': '未分岐',
    'ui.lineage.buildling': 'ビルドリング',
    'ui.lineage.refact': 'リファクト',
    'ui.lineage.debugon': 'デバゴン',
    'ui.lineage.archivox': 'アーカイボックス',
    'ui.affinity.unfocused': '未確定',
    'ui.affinity.builder': 'ビルド',
    'ui.affinity.cleaner': 'リファクタ',
    'ui.affinity.debugger': 'デバッグ',
    'ui.affinity.scholar': 'ドキュメント',
    'ui.affinity.streak': 'コミット継続',
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
    'guide.reviveTitle': '復活',
    'guide.reviveBody': 'Gitagotchi が死亡している場合、累計 EXP 500 を使って健康、エネルギー、気分が安定した状態で復活できます。',
    'guide.close': '閉じる',
    'status.tooltip': 'Gitagotchi の統計を開く',
    'status.open': 'クリックして Gitagotchi を開きます。',
    'message.reward': '{exp} EXP、ボーナス {count} 個',
    'message.unlock': '{skill} を習得',
    'style.builder': '機能出荷力',
    'style.cleaner': 'リファクタ熟練度',
    'style.debugger': 'バグレーダー',
    'style.scholar': 'ドキュメント読解力',
    'style.streak': 'コミット継続力',
    'skill.deepClean': '大掃除',
    'skill.quickFix': '高速修正',
    'skill.fieldGuide': '現場ガイド',
    'skill.focusFlow': '集中フロー',
    'skill.commitRoar': 'コミット咆哮',
    'skill.deepClean.effect': 'リファクタリング中心の差分で追加 EXP と気分を得ます。',
    'skill.quickFix.effect': '診断問題を解決すると追加 EXP と気分を得ます。',
    'skill.fieldGuide.effect': 'ドキュメント変更で健康を回復し EXP を得ます。',
    'skill.focusFlow.effect': '高い気分と健康がコーディングをエネルギーに変えます。',
    'skill.commitRoar.effect': 'コミットイベントでボーナス EXP を得ます。',
    'skill.deepClean.trigger': 'リファクタスタイル熟練',
    'skill.quickFix.trigger': 'デバッグスタイル熟練',
    'skill.fieldGuide.trigger': 'ドキュメントスタイル熟練',
    'skill.focusFlow.trigger': '良好なケア状態',
    'skill.commitRoar.trigger': 'コミット継続熟練',
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
    'breakdown.revive': '復活',
    'breakdown.skill.deepClean': '大掃除スキル',
    'breakdown.skill.quickFix': '高速修正スキル',
    'breakdown.skill.fieldGuide': '現場ガイドスキル',
    'breakdown.skill.focusFlow': '集中フロースキル',
    'breakdown.skill.commitRoar': 'コミット咆哮スキル',
    'log.patted': 'Gitagotchi をなでました',
    'log.alreadyPatted': '今日はもうなでました',
    'log.noGrowthDead': '倒れている間は成長しません',
    'log.revived': 'Gitagotchi が復活しました',
    'notice.reviveNotDead': 'Gitagotchi は死亡していません。',
    'notice.reviveNotEnough': '復活には累計 EXP 500 が必要です。使用可能な累計 EXP: {exp}。',
    'notice.revived': 'Gitagotchi が復活しました。EXP 500 を使いました。',
    'prompt.rename': 'Gitagotchi に名前を付ける',
    'prompt.renameBegin': '始めるには Gitagotchi に名前を付けてください',
    'prompt.nameRequired': '名前は必須です。',
    'prompt.resetConfirm': 'Gitagotchi をリセットしますか？現在の名前、レベル、状態、スキル、ログが削除されます。',
    'prompt.resetAction': 'リセット',
    'dex.title': 'Gitagotchi 図鑑',
    'dex.body': '現在のペットデザインをすべて表示します。ロック中の表示は今後の発見ルール用に準備されています。',
    'dex.unlocked': '{unlocked}/{total} 発見',
    'dex.unknown': '不明なペット',
    'dex.lockedSprite': 'ロックされた Gitagotchi スプライト',
    'dex.common': '共通',
    'dex.base': '基本',
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
    'ui.dex': '图鉴',
    'ui.rename': '重命名',
    'ui.reset': '重置',
    'ui.revive': '复活',
    'ui.profile': '运行档案',
    'ui.help': '帮助',
    'ui.commit': '检查提交',
    'ui.viewStats': '查看统计',
    'ui.logsTitle': 'Gitagotchi 日志',
    'ui.noActivity': '还没有活动。',
    'ui.status.alive': '存活',
    'ui.status.sleeping': '睡眠',
    'ui.status.critical': '危急',
    'ui.status.dead': '死亡',
    'ui.stage.egg': '蛋',
    'ui.stage.hatchling': '幼体',
    'ui.stage.toolkit': '成长期',
    'ui.stage.specialist': '专家',
    'ui.stage.ultimate': '终极',
    'ui.lineage.unbranched': '未分支',
    'ui.lineage.buildling': '构建系',
    'ui.lineage.refact': '重构系',
    'ui.lineage.debugon': '调试系',
    'ui.lineage.archivox': '归档系',
    'ui.affinity.unfocused': '未确定',
    'ui.affinity.builder': '构建',
    'ui.affinity.cleaner': '重构',
    'ui.affinity.debugger': '调试',
    'ui.affinity.scholar': '文档',
    'ui.affinity.streak': '连续提交',
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
    'guide.reviveTitle': '复活',
    'guide.reviveBody': '如果 Gitagotchi 已死亡，可以消耗累计 EXP 500，让它以稳定的健康、能量和心情复活。',
    'guide.close': '关闭',
    'status.tooltip': '打开 Gitagotchi 统计',
    'status.open': '点击打开 Gitagotchi。',
    'message.reward': '{exp} EXP，{count} 个奖励',
    'message.unlock': '学会 {skill}',
    'style.builder': '功能交付力',
    'style.cleaner': '重构熟练度',
    'style.debugger': '缺陷雷达',
    'style.scholar': '文档理解力',
    'style.streak': '提交连续性',
    'skill.deepClean': '深度清理',
    'skill.quickFix': '快速修复',
    'skill.fieldGuide': '现场指南',
    'skill.focusFlow': '专注流',
    'skill.commitRoar': '提交咆哮',
    'skill.deepClean.effect': '重构占比高的差异会增加 EXP 和心情。',
    'skill.quickFix.effect': '解决诊断问题会增加额外 EXP 和心情。',
    'skill.fieldGuide.effect': '文档变更会恢复健康并增加 EXP。',
    'skill.focusFlow.effect': '高心情和健康会把编码活动转化为能量。',
    'skill.commitRoar.effect': '提交事件会增加额外 EXP。',
    'skill.deepClean.trigger': '重构风格熟练',
    'skill.quickFix.trigger': '调试风格熟练',
    'skill.fieldGuide.trigger': '文档风格熟练',
    'skill.focusFlow.trigger': '良好照护状态',
    'skill.commitRoar.trigger': '连续提交熟练',
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
    'breakdown.revive': '复活',
    'breakdown.skill.deepClean': '深度清理技能',
    'breakdown.skill.quickFix': '快速修复技能',
    'breakdown.skill.fieldGuide': '现场指南技能',
    'breakdown.skill.focusFlow': '专注流技能',
    'breakdown.skill.commitRoar': '提交咆哮技能',
    'log.patted': '已抚摸 Gitagotchi',
    'log.alreadyPatted': '今天已经抚摸过了',
    'log.noGrowthDead': '死亡状态无法成长',
    'log.revived': 'Gitagotchi 已复活',
    'notice.reviveNotDead': 'Gitagotchi 没有死亡。',
    'notice.reviveNotEnough': '复活需要累计 EXP 500。可用累计 EXP：{exp}。',
    'notice.revived': 'Gitagotchi 已复活。已消耗 EXP 500。',
    'prompt.rename': '为 Gitagotchi 命名',
    'prompt.renameBegin': '开始前请为 Gitagotchi 命名',
    'prompt.nameRequired': '名称是必填项。',
    'prompt.resetConfirm': '要重置 Gitagotchi 吗？这会清除当前名称、等级、状态、技能和日志。',
    'prompt.resetAction': '重置',
    'dex.title': 'Gitagotchi 图鉴',
    'dex.body': '这里列出当前所有宠物设计。锁定渲染已为未来发现规则准备好。',
    'dex.unlocked': '{unlocked}/{total} 已发现',
    'dex.unknown': '未知宠物',
    'dex.lockedSprite': '锁定的 Gitagotchi 精灵图',
    'dex.common': '通用',
    'dex.base': '基础',
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
