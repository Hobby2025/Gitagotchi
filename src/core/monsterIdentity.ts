import { PetSkill, PetSpecies, PetState, StyleScoreKey } from './petState';

function dominantStyle(state: PetState): StyleScoreKey {
  const entries = Object.entries(state.styleScores) as Array<[StyleScoreKey, number]>;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

function speciesFor(state: PetState): PetSpecies {
  if (state.level >= 90 && state.styleScores.streak >= 300) {
    return 'architect-drake';
  }

  if (state.level < 10) {
    return 'bytepup';
  }

  const style = dominantStyle(state);

  if (style === 'builder') {
    return 'forgebeak';
  }
  if (style === 'cleaner') {
    return 'refactoraptor';
  }
  if (style === 'debugger') {
    return 'bugwyrm';
  }
  if (style === 'scholar') {
    return 'documancer';
  }

  return state.level >= 90 ? 'architect-drake' : 'bytepup';
}

function unlockSkills(state: PetState, species: PetSpecies): PetSkill[] {
  const skills = new Set<PetSkill>(state.skills);

  if (species === 'refactoraptor' && state.styleScores.cleaner >= 100) {
    skills.add('deepClean');
  }
  if (species === 'bugwyrm' && state.styleScores.debugger >= 100) {
    skills.add('quickFix');
  }
  if (species === 'documancer' && state.styleScores.scholar >= 100) {
    skills.add('fieldGuide');
  }
  if (state.mood >= 80 && state.health >= 80 && state.styleScores.streak >= 5) {
    skills.add('focusFlow');
  }
  if (state.level >= 12 && state.styleScores.streak >= 20) {
    skills.add('commitRoar');
  }

  return Array.from(skills);
}

export function resolveMonsterIdentity(state: PetState): PetState {
  const species = speciesFor(state);

  return {
    ...state,
    species,
    skills: unlockSkills(state, species)
  };
}
