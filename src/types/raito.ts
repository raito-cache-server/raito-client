import { ICache } from './ICache';

export interface IRaito {
  get(key: string): Promise<ICache | null>;
  set(key: string, data: any, ttl?: number): Promise<void>;
  clear(key: string | 'all'): Promise<void>;
  shutdown(): void;
}
