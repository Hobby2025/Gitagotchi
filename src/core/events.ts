import { DiffStats } from './diffAnalyzer';

export type ActivityEvent =
  | {
      type: 'diff';
      stats: DiffStats;
      occurredAt: string;
    }
  | {
      type: 'commit';
      hash: string;
      message: string;
      occurredAt: string;
    }
  | {
      type: 'diagnostics';
      previous: number;
      current: number;
      occurredAt: string;
    }
  | {
      type: 'idleTick';
      now: string;
      occurredAt: string;
    };

export type ActivityType = ActivityEvent['type'];
