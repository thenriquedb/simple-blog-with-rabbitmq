import { WebSocket } from "@fastify/websocket";
import { FastifyRequest } from "fastify";
import { getRabbitMQInstance } from "../shared/rabbitMQ";
import { NotificationRepository } from "../repositories/notification-repository";

export async function getNotificationsRealTime(socket: WebSocket, _: FastifyRequest) {
  const channel = await getRabbitMQInstance();

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