import { NotificationRepository } from '../repositories/notification-repository';
import { getRabbitMQInstance } from '../shared/rabbitMQ';

export async function notificationConsumer() {
  const channel = await getRabbitMQInstance();

  channel.consume('client.notifications', async (consumeMessage) => {
    if (consumeMessage?.fields.routingKey.includes('new')) {
      const { userId, title, message } = JSON.parse(consumeMessage.content.toString());

      await NotificationRepository.create({
        userId,
        title,
        message
      });
    }
  });
}