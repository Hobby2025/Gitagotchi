import { developerToolSpritePacks } from './developerToolSprites';
import { getDeveloperToolSpritePack } from './developerToolSprites';
import { SpritePack } from './spriteTypes';
import { PetAffinity, PetEvolution, PetLineage, PetStage, PetState } from '../core/petState';
import { getMoodName } from '../domain/pet/petSystem';

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

const EVOLUTION_UNLOCK_ORDER: PetEvolution[] = ['egg', 'junior', 'mid', 'senior', 'architect'];
const EVOLUTION_STAGE: Record<PetEvolution, PetStage> = {
  egg: 'egg',
  junior: 'hatchling',
  mid: 'toolkit',
  senior: 'specialist',
  architect: 'ultimate'
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
  const currentEvolutionIndex = EVOLUTION_UNLOCK_ORDER.indexOf(state.evolution);
  const unlockedIds = new Set(state.discoveredSpriteIds);

  for (const evolution of EVOLUTION_UNLOCK_ORDER.slice(0, currentEvolutionIndex + 1)) {
    const sprite = getDeveloperToolSpritePack({
      ...state,
      evolution,
      stage: EVOLUTION_STAGE[evolution],
      affinity: evolution === 'senior' || evolution === 'architect' ? state.affinity : undefined
    }, getMoodName(state));
    unlockedIds.add(sprite.id);
  }

  if (unlockedIds.size === state.discoveredSpriteIds.length) {
    return state;
  }

  return {
    ...state,
    discoveredSpriteIds: Array.from(unlockedIds)
  };
}

export function groupPetDexEntries(entries: PetDexEntry[]): Array<[PetStage, PetDexEntry[]]> {
  const grouped = new Map<PetStage, PetDexEntry[]>();
  for (const entry of entries) {
    grouped.set(entry.stage, [...(grouped.get(entry.stage) ?? []), entry]);
  }

  return Array.from(grouped.entries()).sort(([left], [right]) => STAGE_ORDER[left] - STAGE_ORDER[right]);
}
