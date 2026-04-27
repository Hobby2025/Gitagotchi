import { analyzeDiff } from '../src/core/diffAnalyzer';

describe('analyzeDiff', () => {
  it('sums added and deleted lines from git numstat output', () => {
    expect(analyzeDiff('12\t3\tsrc/app.ts\n40\t8\tsrc/pet.ts')).toEqual({
      added: 52,
      deleted: 11,
      files: 2,
      touchedFiles: ['src/app.ts', 'src/pet.ts']
    });
  });

  it('returns empty stats for empty diff output', () => {
    expect(analyzeDiff('')).toEqual({
      added: 0,
      deleted: 0,
      files: 0,
      touchedFiles: []
    });
  });

  it('handles binary file markers as zero line changes while counting the file', () => {
    expect(analyzeDiff('-\t-\tassets/pet.png')).toEqual({
      added: 0,
      deleted: 0,
      files: 1,
      touchedFiles: ['assets/pet.png']
    });
  });
});
