import { knex } from "../database/db";
import { Article } from "../entities/Article";

export class ArticleRepository {
  static create(data: { title: string, content: string, categoryId: number }) {
    const { categoryId, content, title } = data;

    return knex<Article>('articles').insert({
      title,
      content,
      category_id: categoryId
    });
  }

  static findAll() {
    return knex<Article>('articles').select('*');
  }

  static findByCategoryId(categoryId: number) {
    return knex<Article>('articles').where({ category_id: categoryId });
  }

  static findById(id: number) {
    return knex<Article>('articles').where({ id }).first();
  }
}