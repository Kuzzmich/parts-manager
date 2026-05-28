import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

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
}
