import { knex } from "../database/db";
import { Category } from "../entities/Category";

export class CategoryRepository {
  static findAll() {
    return knex<Category>('categories').select('*');
  }

  static findById(id: number) {
    return knex<Category>('categories').where({ id }).first();
  }
}