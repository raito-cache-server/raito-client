import {
  ConnectionOptions,
  ICache,
  IRaito,
  WsMessage,
  WsResult,
  RaitoOptions,
  isConnectionString,
  ConnectionString,
  connectionStringRegex,
  isConnectionOptions,
} from '@src/types';
import WebSocket from 'ws';
import { RaitoResultException } from './RaitoResultException';
import { RaitoConnectionException } from './RaitoConnectionException';

export class Raito implements IRaito {
  private static raitoInstance: Raito | null;
  private wss: WebSocket;
  private isConnected: boolean = false;
  private options: ConnectionOptions;

  constructor(options?: RaitoOptions) {
    this.options = this.parseOptions(options);
    const connectionStr = `ws://${this.options?.host || 'localhost'}:${this.options?.port || 9180}`;
    this.wss = new WebSocket(connectionStr);
    this.handleConnection();
    Raito.raitoInstance = this;
  }

  public static get instance() {
    return this.raitoInstance;
  }

  public async get(key: string): Promise<ICache | null> {
    await this.ensureConnected();

    const message: WsMessage = {
      command: 'get',
      args: [key],
    };

    this.wss.send(JSON.stringify(message));
    return await this.handleResult();
  }

  public async set(key: string, data: any, ttl?: number): Promise<void> {
    await this.ensureConnected();

    const message: WsMessage = {
      command: 'set',
      args: [key, data, (ttl ?? this.options?.ttl)?.toString()],
    };

    this.wss.send(JSON.stringify(message));
    await this.handleResult();
  }

  public async clear(key: string): Promise<void> {
    await this.ensureConnected();

    const message: WsMessage = {
      command: 'clear-cache',
      args: [key],
    };

    this.wss.send(JSON.stringify(message));
    await this.handleResult();
  }

  public shutdown(): void {
    if (
      this.wss.readyState === WebSocket.OPEN ||
      this.wss.readyState === WebSocket.CONNECTING
    ) {
      this.wss.close();
    }
  }

  private handleConnection() {
    this.wss.on('open', () => {
      this.isConnected = true;
    });

    this.wss.on('close', () => {
      this.isConnected = false;
    });
  }

  private async ensureConnected(): Promise<void> {
    if (this.wss.readyState === WebSocket.OPEN && this.isConnected) {
      return;
    }

    return await new Promise<void>((resolve, reject) => {
      this.wss.on('open', resolve);
      this.wss.on('close', reject);
    });
  }

  private async handleResult(): Promise<ICache | null> {
    return new Promise<ICache | null>((resolve, reject) => {
      this.wss.once('message', (message) => {
        const { error, success, data } = JSON.parse(
          message.toString(),
        ) as WsResult;
        if (error) {
          reject(new RaitoResultException(error));
          return;
        }

        if (success && data) {
          resolve(data);
          return;
        }
        resolve(null);
      });
    });
  }

  private parseOptions(options?: RaitoOptions): ConnectionOptions {
    if (typeof options === 'number') {
      return { port: options };
    }
    if (isConnectionString(options)) {
      return this.parseConnectionString(options);
    }
    if (isConnectionOptions(options)) {
      return options;
    }
    return {};
  }

  private parseConnectionString = (
    url: ConnectionString,
  ): ConnectionOptions => {
    const match = url.match(connectionStringRegex);
    if (!match?.[1] || !match?.[2]) {
      throw new RaitoConnectionException(`Invalid connection string format`);
    }

    return {
      host: match[1],
      port: parseInt(match[2], 10),
      ttl: match[3] ? parseInt(match[3], 10) : undefined,
    };
  };
}
