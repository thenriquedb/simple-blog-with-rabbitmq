import ampqlib, { Channel, Connection, Options } from 'amqplib';
import env from '../constants/env';

export class RabbitMQ {
  private connection: Connection;
  private channel: Channel;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async start(): Promise<void> {
    this.connection = await ampqlib.connect(this.url);
    this.channel = await this.connection.createChannel();
  }

  async sendMessage(queue: string, message: string) {
    this.channel.sendToQueue(queue, Buffer.from(message));
    console.log(" [x] Sent %s", message);
  }

  async publishInExchange(exchange: string, routingKey: string, message: string, options?: Options.Publish) {
    this.channel.assertExchange(
      exchange,
      'topic',
      { durable: true }
    );

    return this.channel.publish(exchange, routingKey, Buffer.from(message), options)
  }

  async consume(queue: string, callback: (message: ampqlib.ConsumeMessage | null) => void, options?: Options.Consume) {
    return this.channel.consume(queue, (message) => {
      callback(message);
    }, options);
  }

  ack(message: ampqlib.ConsumeMessage) {
    return this.channel.ack(message);
  }

  nack(message: ampqlib.ConsumeMessage, requeue?: boolean) {
    this.channel.nack(message, false, requeue);
  }
}

function getRabbitMQUrl(): string {
  return `amqp://${env.RABBITMQ_USERNAME}:${env.RABBITMQ_PASSWORD}@${env.RABBITMQ_HOST}:${env.RABBITMQ_PORT}`;
}

export async function getRabbitMQInstance(): Promise<RabbitMQ> {
  const url = getRabbitMQUrl();
  const channel = new RabbitMQ(url);
  await channel.start();
  return channel;
}