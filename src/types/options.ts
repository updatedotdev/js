import { StorageOptions } from '../utils/storage';

export type GetToken = () =>
  | Promise<string | undefined | null>
  | string
  | undefined
  | null;

export interface UpdateClientOptions {
  getSessionToken?: GetToken;
  environment?: 'live' | 'test';
  apiUrl?: string;
  storage?: StorageOptions;
}
