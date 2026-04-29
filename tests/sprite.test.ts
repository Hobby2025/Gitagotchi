import { developerToolSpritePacks } from '../src/character/developerToolSprites';
import { getPetSpritePack, getSpritePack, validateSpritePack } from '../src/character/evolutionSprites';
import { createInitialPetState } from '../src/core/petState';
import { PetEvolution, PetLineage } from '../src/core/petState';

describe('sprite packs', () => {
  it('selects a mood-specific sprite for an evolution stage', () => {
    const sprite = getSpritePack('junior', 'happy');

    expect(sprite.evolution).toBe('junior');
    expect(sprite.mood).toBe('normal');
    expect(validateSpritePack(sprite)).toBe(true);
  });

  it('falls back to normal mood when a specific mood is missing', () => {
    const sprite = getSpritePack('architect', 'sleeping');

    expect(sprite.evolution).toBe('architect');
    expect(sprite.mood).toBe('normal');
  });

  it('keeps frame dimensions consistent for LittleJS rendering', () => {
    const sprite = getSpritePack('egg', 'normal');

    expect(sprite.frames[0].pixels).toHaveLength(sprite.frames[0].height);
    expect(sprite.frames[0].pixels.every((row) => row.length === sprite.frames[0].width)).toBe(true);
  });

  it('renders the starter egg as a detailed kernel sprite', () => {
    const sprite = getPetSpritePack(createInitialPetState('2026-04-28T00:00:00.000Z'), 'normal');
    const frame = sprite.frames[0];
    const usedTokens = new Set(frame.pixels.join('').replaceAll('.', '').split(''));

    expect(frame.width).toBe(12);
    expect(frame.height).toBe(12);
    expect(usedTokens.size).toBeGreaterThanOrEqual(6);
    expect(frame.pixels.join('|')).toContain('gskksg');
  });

  it('selects developer-tool creature sprites from pet state', () => {
    const base = createInitialPetState('2026-04-28T00:00:00.000Z');

    expect(getPetSpritePack(base, 'normal').id).toBe('egg-common-normal');
    expect(getPetSpritePack({
      ...base,
      level: 5,
      evolution: 'junior',
      stage: 'hatchling',
      lineage: 'buildling',
      styleScores: { builder: 30, cleaner: 5, debugger: 0, scholar: 0, streak: 0 }
    }, 'normal').id).toBe('buildling-hatchling-normal');
    expect(getPetSpritePack({
      ...base,
      level: 10,
      evolution: 'mid',
      stage: 'toolkit',
      lineage: 'refact',
      styleScores: { builder: 0, cleaner: 35, debugger: 0, scholar: 0, streak: 0 }
    }, 'normal').id).toBe('refact-toolkit-normal');
    expect(getPetSpritePack({
      ...base,
      level: 20,
      evolution: 'senior',
      stage: 'specialist',
      lineage: 'debugon',
      affinity: 'debugger',
      styleScores: { builder: 0, cleaner: 0, debugger: 80, scholar: 0, streak: 0 }
    }, 'normal').id).toBe('debugon-specialist-debugger-normal');
  });

  it('keeps every developer-tool creature sprite structurally valid', () => {
    expect(developerToolSpritePacks).toHaveLength(33);

    for (const sprite of developerToolSpritePacks) {
      expect(validateSpritePack(sprite), sprite.id).toBe(true);
    }
  });

  it('implements the complete 33 monster designs from the evolution design document', () => {
    const expectedIds = [
      'egg-common-normal',
      'buildling-hatchling-normal',
      'refact-hatchling-normal',
      'debugon-hatchling-normal',
      'archivox-hatchling-normal',
      'buildling-toolkit-normal',
      'refact-toolkit-normal',
      'debugon-toolkit-normal',
      'archivox-toolkit-normal',
      ...(['buildling', 'refact', 'debugon', 'archivox'] as const).flatMap((lineage) => (
        (['builder', 'cleaner', 'debugger', 'scholar', 'streak'] as const).map((affinity) => `${lineage}-specialist-${affinity}-normal`)
      )),
      'buildling-ultimate-normal',
      'refact-ultimate-normal',
      'debugon-ultimate-normal',
      'archivox-ultimate-normal'
    ];

    expect(developerToolSpritePacks.map((sprite) => sprite.id)).toEqual(expectedIds);
    expect(new Set(developerToolSpritePacks.map((sprite) => sprite.frames[0].pixels.join('|'))).size).toBe(33);
  });

  it('gives each lineage a distinct visual signature across growth stages', () => {
    const base = createInitialPetState('2026-04-28T00:00:00.000Z');
    const stages: Array<{ evolution: PetEvolution; stage: typeof base.stage }> = [
      { evolution: 'junior', stage: 'hatchling' },
      { evolution: 'mid', stage: 'toolkit' },
      { evolution: 'senior', stage: 'specialist' },
      { evolution: 'architect', stage: 'ultimate' }
    ];
    const lineages: PetLineage[] = ['buildling', 'refact', 'debugon', 'archivox'];

    for (const stage of stages) {
      const signatures = lineages.map((lineage) => getPetSpritePack({
        ...base,
        level: 20,
        evolution: stage.evolution,
        stage: stage.stage,
        lineage,
        affinity: lineage === 'buildling' ? 'builder' : lineage === 'refact' ? 'cleaner' : lineage === 'debugon' ? 'debugger' : 'scholar',
        styleScores: { builder: 10, cleaner: 10, debugger: 10, scholar: 10, streak: 10 }
      }, 'normal').frames[0].pixels.join('|'));

      expect(new Set(signatures).size, stage.evolution).toBe(lineages.length);
    }
  });
});
