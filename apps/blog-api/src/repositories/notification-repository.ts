import { knex } from "../database/db";
import { Notification } from "../entities/Notification";

export class NotificationRepository {
  static create(data: { userId: number, message: string, title: string }) {
    const { userId, message, title } = data;

    return knex<Notification>("notifications").insert({
      user_id: userId,
      message,
      title
    });
  }

  static findById(id: number) {
    return knex<Notification>("notifications").where({ id }).first();
  }

  static findAllByUserId(userId: number) {
    return knex<Notification>("notifications").where({ user_id: userId });
  }
}