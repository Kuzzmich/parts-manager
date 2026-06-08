import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private client!: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      return this.client.setex(key, ttl, value);
    }
    return this.client.set(key, value);
  }

  async del(key: string) {
    return this.client.del(key);
  }

  async setJson(key: string, value: unknown, ttl?: number) {
    const str = JSON.stringify(value);
    return this.set(key, str, ttl);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async zincrby(
    key: string,
    member: string,
    increment: number,
  ): Promise<number> {
    const result = await this.client.zincrby(key, increment, member);
    return Number(result);
  }

  async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.zrevrange(key, start, stop);
  }
}
