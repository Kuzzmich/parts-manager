import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer } from 'kafkajs';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class SearchLogConsumer implements OnModuleInit, OnModuleDestroy {
  private consumer!: Consumer;

  constructor(private kafkaService: KafkaService) {}

  async onModuleInit() {
    this.consumer = this.kafkaService.createConsumer('search-log-group');
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'search-log',
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        const value = JSON.parse(message.value.toString());
        console.log('Received message:', value);
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}
