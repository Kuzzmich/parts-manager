import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { IGetStats } from './interfaces/get-stats.interface';

@Injectable()
export class AnalyticsService {
  constructor(private redisService: RedisService) {}

  async getStats(): Promise<IGetStats> {
    const totalQueries = Number(
      (await this.redisService.get('analytics:queries:total')) ?? 0,
    );
    const topQueries = await this.redisService.zrevrange(
      'analytics:top-queries',
      0,
      9,
    );
    return { totalQueries, topQueries };
  }
}
