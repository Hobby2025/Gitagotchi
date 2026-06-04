import { DiffStats } from './diffAnalyzer';

type ActivityContext = {
  projectKey?: string;
  projectLabel?: string;
};

export type ActivityEvent =
  | ({
      type: 'diff';
      stats: DiffStats;
      occurredAt: string;
    } & ActivityContext)
  | ({
      type: 'commit';
      hash: string;
      message: string;
      occurredAt: string;
    } & ActivityContext)
  | ({
      type: 'diagnostics';
      previous: number;
      current: number;
      occurredAt: string;
    } & ActivityContext)
  | ({
      type: 'idleTick';
      now: string;
      occurredAt: string;
    } & ActivityContext);

export type ActivityType = ActivityEvent['type'];
