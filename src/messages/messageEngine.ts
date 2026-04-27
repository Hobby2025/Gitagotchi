import { GrowthBreakdownEntry, PetMessage, PetSkill, StyleScores } from '../core/petState';
import { createI18n, I18n } from '../i18n';

export type ActivityMessageInput = {
  occurredAt: string;
  expDelta: number;
  breakdown: GrowthBreakdownEntry[];
  styleScoresDelta: Partial<StyleScores>;
  unlockedSkills: PetSkill[];
};

type MessageBlock = {
  id: string;
  create(input: ActivityMessageInput, i18n: I18n): PetMessage[];
};

export const rewardMessageBlock: MessageBlock = {
  id: 'reward',
  create(input, i18n) {
    if (input.expDelta === 0 && input.breakdown.length === 0) {
      return [];
    }

    return [{
      kind: 'reward',
      text: i18n.t('message.reward', {
        exp: `${input.expDelta >= 0 ? '+' : ''}${input.expDelta}`,
        count: input.breakdown.length
      })
    }];
  }
};

export const styleMessageBlock: MessageBlock = {
  id: 'style',
  create(input, i18n) {
    return (Object.entries(input.styleScoresDelta) as Array<[keyof StyleScores, number]>)
      .filter(([, value]) => value > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([key, value]) => ({
        kind: 'style',
        text: `${i18n.t(`style.${key}`)} +${value}`
      }));
  }
};

export const unlockMessageBlock: MessageBlock = {
  id: 'unlock',
  create(input, i18n) {
    return input.unlockedSkills.map((skill) => ({
      kind: 'unlock',
      text: i18n.t('message.unlock', {
        skill: i18n.t(`skill.${skill}`)
      })
    }));
  }
};

export const defaultMessageBlocks: MessageBlock[] = [
  rewardMessageBlock,
  styleMessageBlock,
  unlockMessageBlock
];

export function createActivityMessages(
  input: ActivityMessageInput,
  blocksOrI18n: MessageBlock[] | I18n = defaultMessageBlocks,
  maybeI18n: I18n = createI18n('en')
): PetMessage[] {
  const blocks = Array.isArray(blocksOrI18n) ? blocksOrI18n : defaultMessageBlocks;
  const i18n = Array.isArray(blocksOrI18n) ? maybeI18n : blocksOrI18n;

  return blocks.flatMap((block) => block.create(input, i18n));
}
