import { PetArchetype, PetEvolution, PetSpecies } from '../core/petState';

export type AvatarKey = `${PetSpecies}:${PetEvolution}:${PetArchetype}`;

export type PublicLeaderboardPlayer = {
  githubLogin: string;
  displayName: string;
  level: number;
  exp: number;
  avatarKey: AvatarKey;
  updatedAt: string;
};

export type LeaderboardDocument = {
  version: 1;
  updatedAt: string;
  players: PublicLeaderboardPlayer[];
};

export type LeaderboardSyncAdapter = {
  load(): Promise<LeaderboardDocument | undefined>;
  save(document: LeaderboardDocument): Promise<void>;
};

export type LeaderboardSyncSnapshot = {
  lastSyncedAt?: string;
  lastScore?: number;
};

export type LeaderboardStatus =
  | { kind: 'disabled' }
  | { kind: 'missingConfig' }
  | { kind: 'signedOut' }
  | { kind: 'ready'; document: LeaderboardDocument; lastSyncedAt?: string; nextSyncAt?: string }
  | { kind: 'error'; message: string };
