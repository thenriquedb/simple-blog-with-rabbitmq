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

  async consume(queue: string, callback: (message: ampqlib.ConsumeMessage | null) => void) {
    return this.channel.consume(queue, (message) => {
      callback(message);

      if (message) {
        this.channel.ack(message)
      }
    });
  }

  getChannel(): Channel {
    return this.channel;
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

export async function setupRabbitMQ() {
  const channel = (await getRabbitMQInstance()).getChannel();

  // Create exchanges
  await channel.assertExchange('ex.blog.articles', 'topic', { durable: true });
  await channel.assertExchange('ex.blog.email', 'topic', { durable: true });
  await channel.assertExchange('dlx.blog.email', 'topic', { durable: true });
  await channel.assertExchange('ex.blog.notifications', 'topic', { durable: true });

  // Create queues
  await channel.assertQueue('client.events.article', { durable: true });
  await channel.assertQueue('client.notifications', { durable: true });
  await channel.assertQueue('client.email.failed', { durable: true });
  await channel.assertQueue('client.email', {
    durable: true,
    deadLetterExchange: 'dlx.blog.email',
    deadLetterRoutingKey: 'client.email.failed',
  });

  // Bind queues
  await channel.bindQueue('client.notifications', 'ex.blog.notifications', '*.notifications.*');
  await channel.bindQueue('client.events.article', 'ex.blog.articles', '*.article.*');
  await channel.bindQueue('client.email', 'ex.blog.email', '*.email.*');
  await channel.bindQueue('client.email.failed', 'dlx.blog.email', '*.email.failed');
}