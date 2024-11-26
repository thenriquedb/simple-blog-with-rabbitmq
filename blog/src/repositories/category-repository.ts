import { knex } from "../database/db";
import { Category } from "../entities/Category";

export class CategoryRepository {
  static async findAll(): Promise<Category[]> {
    return knex('categories').select('*');
  }

  static async findById(id: number): Promise<Category> {
    return knex('categories').where({ id }).first();
  }
}