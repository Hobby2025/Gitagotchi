import { developerToolSpritePacks } from './developerToolSprites';
import { getDeveloperToolSpritePack } from './developerToolSprites';
import { SpritePack } from './spriteTypes';
import { getMoodName, PetAffinity, PetLineage, PetStage, PetState } from '../core/petState';

export type PetDexEntry = {
  id: string;
  stage: PetStage;
  lineage?: PetLineage;
  affinity?: PetAffinity;
  sprite: SpritePack;
  unlocked: boolean;
};

export type PetDexOptions = {
  state?: PetState;
  unlockedIds?: ReadonlySet<string>;
};

const STAGE_ORDER: Record<PetStage, number> = {
  egg: 0,
  hatchling: 1,
  toolkit: 2,
  specialist: 3,
  ultimate: 4
};

function parseSpriteId(id: string): Omit<PetDexEntry, 'id' | 'sprite' | 'unlocked'> {
  const parts = id.replace(/-normal$/, '').split('-');
  if (parts[0] === 'egg') {
    return { stage: 'egg' };
  }

  const lineage = parts[0] as PetLineage;
  const stageToken = parts[1];
  if (stageToken === 'hatchling' || stageToken === 'toolkit') {
    return { lineage, stage: stageToken };
  }
  if (stageToken === 'specialist') {
    return { lineage, stage: 'specialist', affinity: parts[2] as PetAffinity };
  }
  if (stageToken === 'ultimate') {
    return { lineage, stage: 'ultimate' };
  }

  throw new Error(`Unsupported pet dex sprite id: ${id}`);
}

export function createPetDexEntries(options: PetDexOptions = {}): PetDexEntry[] {
  const unlockedIds = options.unlockedIds ?? (options.state ? new Set(options.state.discoveredSpriteIds) : undefined);

  return developerToolSpritePacks.map((sprite) => {
    const metadata = parseSpriteId(sprite.id);

    return {
      id: sprite.id,
      sprite,
      ...metadata,
      unlocked: unlockedIds ? unlockedIds.has(sprite.id) : true
    };
  });
}

export function discoverCurrentPetSprite(state: PetState): PetState {
  const sprite = getDeveloperToolSpritePack(state, getMoodName(state));
  if (state.discoveredSpriteIds.includes(sprite.id)) {
    return state;
  }

  return {
    ...state,
    discoveredSpriteIds: [...state.discoveredSpriteIds, sprite.id]
  };
}

export function groupPetDexEntries(entries: PetDexEntry[]): Array<[PetStage, PetDexEntry[]]> {
  const grouped = new Map<PetStage, PetDexEntry[]>();
  for (const entry of entries) {
    grouped.set(entry.stage, [...(grouped.get(entry.stage) ?? []), entry]);
  }

  return Array.from(grouped.entries()).sort(([left], [right]) => STAGE_ORDER[left] - STAGE_ORDER[right]);
}
