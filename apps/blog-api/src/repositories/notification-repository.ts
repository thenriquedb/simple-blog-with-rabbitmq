import { knex } from "../database/db";
import { Notification } from "../entities/Notification";

export class NotificationRepository {
  static async create(data: { userId: number, message: string, title: string }) {
    const { userId, message, title } = data;

    return knex("notifications").insert({
      user_id: userId,
      message,
      title
    });
  }

  static async findById(id: number): Promise<Notification> {
    return knex("notifications").where({ id }).first();
  }

  static async findAllByUserId(userId: number): Promise<Notification[]> {
    return knex("notifications").where({ user_id: userId });
  }
}