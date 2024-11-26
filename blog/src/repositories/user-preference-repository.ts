import { knex } from "../database/db";

export interface UserPreferenceData {
  userId: number;
  categoryId: number;
  categoryName: string;
  userEmail: string;
  userName: string;
}

export class UserPreferenceRepository {
  static async create(data: { userId: number, categoryId: number }): Promise<void> {
    const { userId, categoryId } = data;
    return knex("user_preferences").insert({
      user_id: userId,
      category_id: categoryId,
    });
  }

  static async getUserPreferencesByUserId(userId: number): Promise<UserPreferenceData[]> {
    return knex("user_preferences")
      .join("users", "users.id", "=", "user_preferences.user_id")
      .join("categories", "categories.id", "=", "user_preferences.category_id")
      .where({ userId: userId })
      .select([
        "user_preferences.id",
        "category_id",
        "users.name as userName",
        "users.email as userEmail",
        "categories.name as categoryName"
      ]);
  }

  static async listUsersByCategory(categoryId: number) {
    return knex("user_preferences")
      .join("users", "users.id", "=", "user_preferences.user_id")
      .join("categories", "categories.id", "=", "user_preferences.category_id")
      .where({ category_id: categoryId })
      .select([
        "user_preferences.id",
        "category_id",
        "users.name as userName",
        "users.email as userEmail",
        "categories.name as categoryName"
      ]);
  }
}