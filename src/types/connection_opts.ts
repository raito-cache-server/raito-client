export type ConnectionOptions = {
  host?: string;
  port?: number;
  ttl?: number;
};

export type ConnectionString =
  | `raito://${string}:${number}?ttl=${number}`
  | `raito://${string}:${number}`;

export const connectionStringRegex =
  /^raito:\/\/([a-zA-Z0-9.-]+)(?::(\d+))?(?:\?ttl=(\d+))?$/;

export type RaitoOptions = ConnectionOptions | ConnectionString | number;

export const isConnectionString = (url: any): url is ConnectionString => {
  return connectionStringRegex.test(url);
};

export const isConnectionOptions = (
  options: any,
): options is ConnectionOptions => {
  if (typeof options !== 'object' || options === null) return false;
  const keys = Object.keys(options);
  return keys.every((key) => ['host', 'port', 'ttl'].includes(key));
};
