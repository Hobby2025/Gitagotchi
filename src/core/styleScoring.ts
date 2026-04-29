import { ActivityEvent } from './events';
import { StyleScoreKey, StyleScores } from './petState';

const styleKeys: StyleScoreKey[] = ['builder', 'cleaner', 'debugger', 'scholar', 'streak'];
const BALANCE_GAP_THRESHOLD = 100;

export function emptyStyleScores(): StyleScores {
  return {
    builder: 0,
    cleaner: 0,
    debugger: 0,
    scholar: 0,
    streak: 0
  };
}

function touchesTest(path: string): boolean {
  return /(^|[\\/])(__tests__|tests?)([\\/]|$)/i.test(path) || /\.(test|spec)\.[cm]?[tj]sx?$/i.test(path);
}

function touchesDocs(path: string): boolean {
  return /(^|[\\/])(readme|docs?)([\\/.]|$)/i.test(path) || /\.(md|mdx|txt)$/i.test(path);
}

function touchesConfig(path: string): boolean {
  return /(^|[\\/])(\.?[a-z0-9-]+rc|package\.json|tsconfig\.json|vite\.config\.[tj]s|webpack\.config\.[tj]s)$/i.test(path);
}

export function calculateStyleDelta(event: ActivityEvent): StyleScores {
  const delta = emptyStyleScores();

  if (event.type === 'diff') {
    delta.builder += Math.floor(event.stats.added / 5);
    delta.cleaner += Math.floor(event.stats.deleted / 5);

    if (event.stats.deleted > event.stats.added) {
      delta.cleaner += 4;
    }

    for (const file of event.stats.touchedFiles) {
      if (touchesTest(file)) {
        delta.scholar += 20;
      }
      if (touchesDocs(file)) {
        delta.scholar += 5;
      }
      if (touchesConfig(file)) {
        delta.scholar += 3;
      }
    }
  }

  if (event.type === 'commit') {
    if (/\bfeat\b/i.test(event.message)) {
      delta.builder += 12;
    }
    if (/\brefactor\b/i.test(event.message)) {
      delta.cleaner += 12;
    }
    if (/\b(fix|hotfix)\b/i.test(event.message)) {
      delta.debugger += 12;
    }
    delta.streak += 2;
  }

  if (event.type === 'diagnostics') {
    const resolved = Math.max(0, event.previous - event.current);
    delta.debugger += resolved * 10;
  }

  return delta;
}

export function balanceStyleDelta(base: StyleScores, delta: StyleScores): StyleScores {
  const values = Object.values(base);
  const minScore = Math.min(...values);
  const maxScore = Math.max(...values);

  if (maxScore - minScore < BALANCE_GAP_THRESHOLD || styleKeys.every((key) => delta[key] === 0)) {
    return delta;
  }

  return styleKeys.reduce<StyleScores>((balanced, key) => {
    const isDominant = base[key] === maxScore;
    const isLagging = base[key] <= minScore + 20;
    const dominantRate = key === 'streak' ? 0.8 : 0.65;
    const catchUpBonus = key === 'streak' ? 1 : 2;
    const softened = isDominant && delta[key] > 0
      ? Math.max(1, Math.floor(delta[key] * dominantRate))
      : delta[key];

    balanced[key] = softened + (isLagging ? catchUpBonus : 0);
    return balanced;
  }, emptyStyleScores());
}

export function mergeStyleScores(base: StyleScores, delta: Partial<StyleScores>): StyleScores {
  return {
    builder: base.builder + (delta.builder ?? 0),
    cleaner: base.cleaner + (delta.cleaner ?? 0),
    debugger: base.debugger + (delta.debugger ?? 0),
    scholar: base.scholar + (delta.scholar ?? 0),
    streak: base.streak + (delta.streak ?? 0)
  };
}
