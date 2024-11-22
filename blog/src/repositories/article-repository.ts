import { knex } from "../database/db";
import { Article } from "../entities/Article";

export class ArticleRepository {
  static async create(data: { title: string, content: string, category: string }): Promise<number[]> {
    const { category, content, title } = data;

    return knex('articles').insert({
      title,
      content,
      category
    });
  }

  static async findAll(): Promise<Article[]> {
    return knex('articles').select('*');
  }

  static async findById(id: number): Promise<Article> {
    return knex('articles').where({ id }).first();
  }
}