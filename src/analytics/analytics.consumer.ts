import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer } from 'kafkajs';
import { KafkaService } from '../kafka/kafka.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AnalyticsConsumer implements OnModuleInit, OnModuleDestroy {
  private consumer!: Consumer;

  constructor(
    private kafkaService: KafkaService,
    private redisService: RedisService,
  ) {}

  async onModuleInit() {
    this.consumer = this.kafkaService.createConsumer('analytics-group');
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'search-log',
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        const value = JSON.parse(message.value.toString());
        const { managerId, query } = value;
        await this.redisService.incr('analytics:queries:total');
        await this.redisService.zincrby('analytics:top-queries', query, 1);
        await this.redisService.incr(`analytics:manager:${managerId}:count`);
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}
