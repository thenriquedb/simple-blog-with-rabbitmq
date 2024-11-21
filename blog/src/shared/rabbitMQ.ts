import ampqlib, { Channel, Connection, ConsumeMessage, Message } from 'amqplib';

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

  async publishInExchange(exchange: string, routingKey: string, message: string) {
    return this.channel.publish(exchange, routingKey, Buffer.from(message))
  }

  async consume(queue: string, callback: (message: ampqlib.ConsumeMessage | null) => void) {
    return this.channel.consume(queue, (message) => {
      callback(message);

      if (message) {
        this.channel.ack(message)
      }
    });
  }
}