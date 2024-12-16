export type CacheCommand = 'set' | 'get' | 'clear-cache';
export const WsCommand: Record<string, CacheCommand> = {
  SET: 'set',
  GET: 'get',
  CLEAR: 'clear-cache',
};
