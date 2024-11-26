import { WebSocket } from "@fastify/websocket";
import { FastifyRequest } from "fastify";
import { RabbitMQ } from "../shared/rabbitMQ";
import { NotificationRepository } from "../repositories/notification-repository";
import env from "../constants/env";

export async function getNotificationsRealTime(socket: WebSocket, _: FastifyRequest) {
  const channel = new RabbitMQ(env.RABBITMQ_URL);
  await channel.start();

  channel.consume('client.notifications', async (consumeMessage) => {
    if (consumeMessage?.fields.routingKey.includes('new')) {
      const { userId, title, message } = JSON.parse(consumeMessage.content.toString());

      const notificationId = await NotificationRepository.create({
        userId,
        title,
        message
      });

      const notification = await NotificationRepository.findById(notificationId[0]);

      socket.send(
        JSON.stringify({
          userId,
          title,
          message,
          notificationId: notificationId[0],
          createdAt: notification.created_at
        }));
    }
  });
}