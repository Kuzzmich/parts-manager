import { Injectable } from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService {
  private kafka!: Kafka;
  private producer!: Producer;

  async onModuleInit() {
    this.kafka = new Kafka({
      clientId: 'parts-app',
      brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
    });

    this.producer = this.kafka.producer();
    await this.producer.connect();

    const admin = this.kafka.admin();
    await admin.connect();
    const existingTopics = await admin.listTopics();
    if (!existingTopics.includes('search-log')) {
      await admin.createTopics({
        topics: [
          {
            topic: 'search-log',
            numPartitions: 1,
          },
        ],
        waitForLeaders: true,
      });
    }
    await admin.disconnect();
  }

  onModuleDestroy() {
    this.producer.disconnect();
  }

  async emit(topic: string, message: unknown) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  createConsumer(groupId: string): Consumer {
    return this.kafka.consumer({
      groupId,
      sessionTimeout: 6000, // dev sped up need
      heartbeatInterval: 1000,
      rebalanceTimeout: 1000,
    });
  }
}
