export type DiffStats = {
  added: number;
  deleted: number;
  files: number;
  touchedFiles: string[];
};

function parseCount(value: string): number {
  if (value === '-' || value.trim() === '') {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function analyzeDiff(diff: string): DiffStats {
  const stats: DiffStats = {
    added: 0,
    deleted: 0,
    files: 0,
    touchedFiles: []
  };

  for (const line of diff.trim().split(/\r?\n/)) {
    if (!line.trim()) {
      continue;
    }

    const [added, deleted, file] = line.split('\t');
    stats.added += parseCount(added ?? '0');
    stats.deleted += parseCount(deleted ?? '0');
    stats.files += 1;
    stats.touchedFiles.push(file ?? '');
  }

  return stats;
}
