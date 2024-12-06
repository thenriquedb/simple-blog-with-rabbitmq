import { knex } from "../database/db";
import { UserPreference } from "../entities/UserPreference";

export interface UserPreferenceData {
  userId: number;
  categoryId: number;
  categoryName: string;
  userEmail: string;
  userName: string;
}

export class UserPreferenceRepository {
  static create(data: { userId: number, categoryId: number }) {
    const { userId, categoryId } = data;
    return knex("user_preferences").insert({
      user_id: userId,
      category_id: categoryId,
    });
  }

  static findByUserIdAndCategoryId(userId: number, categoryId: number) {
    return knex("user_preferences")
      .where({ user_id: userId, category_id: categoryId })
      .first();
  }

  static listUserPreferences(userId: number) {
    return knex<UserPreference>("user_preferences")
      .where({ user_id: userId })
      .select();
  }

  static listUsersByCategory(categoryId: number) {
    return knex<UserPreference>("user_preferences")
      .join("users", "users.id", "=", "user_preferences.user_id")
      .join("categories", "categories.id", "=", "user_preferences.category_id")
      .where({ category_id: categoryId })
      .select<UserPreferenceData>([
        "user_preferences.id",
        "category_id",
        "users.name as userName",
        "users.id as userId",
        "users.email as userEmail",
        "categories.name as categoryName"
      ]);
  }
}