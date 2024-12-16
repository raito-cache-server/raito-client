import { CacheCommand } from './wsCommand';
import { ICache } from './ICache';

export type WsResult = {
  error?: string;
  command?: CacheCommand;
  key?: string;
  success?: boolean;
  data?: ICache | null;
};
