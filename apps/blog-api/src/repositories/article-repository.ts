import { knex } from "../database/db";
import { Article } from "../entities/Article";

export class ArticleRepository {
  static async create(data: { title: string, content: string, categoryId: number }): Promise<number[]> {
    const { categoryId, content, title } = data;

    return knex('articles').insert({
      title,
      content,
      category_id: categoryId
    });
  }

  static async findAll(): Promise<Article[]> {
    return knex('articles').select('*');
  }

  static async findByCategoryId(categoryId: number): Promise<Article[]> {
    return knex('articles').where({ category_id: categoryId });
  }

  static async findById(id: number): Promise<Article> {
    return knex('articles').where({ id }).first();
  }
}