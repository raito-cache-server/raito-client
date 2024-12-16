export interface ICache {
  key: string;
  data: string;
  createdAt: Date;
  ttl?: number;
}
