import { CacheCommand } from './wsCommand';

export type WsMessage = {
  command: CacheCommand;
  args: [string, string?, string?];
};
