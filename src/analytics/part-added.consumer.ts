import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer } from 'kafkajs';
import { KafkaService } from '../kafka/kafka.service';
import { KafkaTopics } from '../kafka/kafka.topics';
import { KafkaGroupids } from '../kafka/kafka.groupids';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class PartAddedConsumer implements OnModuleInit, OnModuleDestroy {
  private consumer!: Consumer;

  constructor(
    private kafkaService: KafkaService,
    private redisService: RedisService,
  ) {}

  async onModuleInit() {
    this.consumer = this.kafkaService.createConsumer(
      KafkaGroupids.PART_ADDED_GROUP,
    );
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: KafkaTopics.PART_ADDED,
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        try {
          if (!message.value) return;
          const value = JSON.parse(message.value.toString());

          // idempotence
          const alreadyProcessed = await this.redisService.get(
            `processed:part:${value.id}`,
          );
          if (alreadyProcessed) return;

          await this.redisService.set(`processed:part:${value.id}`, '1', 3600);
          console.log('Received message:', value);
        } catch (e) {
          const error = e as Error;
          await this.kafkaService.emit(KafkaTopics.PART_ADDED_DLQ, {
            originalMessage: JSON.parse(message.value!.toString()),
            error: error.message,
            failedAt: new Date().toISOString(),
          });
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}
