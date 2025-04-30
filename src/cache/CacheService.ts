import { injectable } from 'tsyringe';
import Redis from 'ioredis';

@injectable()
export default class CacheService {
  private client: Redis;

  constructor() {
    this.client = new Redis();
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async set(key: string, value: unknown, ttlSeconds = 60): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }
}
