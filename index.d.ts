export interface ICache {
  key: string;
  data: string;
  createdAt: Date;
  ttl?: number;
}

interface IRaito {
  get(key: string): Promise<ICache | null>;
  set(key: string, data: any, ttl?: number): Promise<void>;
  clear(key: string | 'all'): Promise<void>;
  shutdown(): void;
}

type ConnectionOptions = {
  host?: string;
  port?: number;
  ttl?: number;
};
type ConnectionString =
  | `raito://${string}:${number}?ttl=${number}`
  | `raito://${string}:${number}`;
type RaitoOptions = ConnectionOptions | ConnectionString | number;

export class Raito implements IRaito {
  constructor(options?: RaitoOptions);
  public get(key: string): Promise<ICache | null>;
  public set(key: string, data: any, ttl?: number): Promise<void>;
  public clear(key: string | 'all'): Promise<void>;
  public shutdown(): void;
  public static get instance(): Raito;
}

export {};
