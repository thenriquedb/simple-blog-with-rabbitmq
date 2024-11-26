import { FastifyReply, FastifyRequest, FastifySchema } from "fastify"
import { ArticleRepository } from '../repositories/article-repository'
import { channel } from '../shared/rabbitMQ';
import { CategoryRepository } from "../repositories/category-repository";

type ICreateArticleBody = {
  title: string;
  content: string;
  categoryId: number;
}

export const createArticleSchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
      categoryId: { type: 'number' },
    },
    required: ['title', 'content', 'categoryId']
  }
}

export async function createArticle(request: FastifyRequest<{ Body: ICreateArticleBody }>, reply: FastifyReply) {
  const { title, content, categoryId } = request.body;

  const category = await CategoryRepository.findById(categoryId);

  if (!category) {
    return reply.status(400).send({
      error: {
        message: 'Category not found'
      }
    });
  }

  const createdArticleId = await ArticleRepository.create({
    title,
    content,
    categoryId,
  });

  channel.publishInExchange(
    'articles',
    `events.article.created`,
    JSON.stringify({
      id: createdArticleId[0],
      title,
      preview: content.length > 100 ? `${content.slice(0, 100)}...` : content,
      category_id: category.id
    }),
    {
      headers: {
        'x-match': 'any',
        category_id: category.id
      }
    }
  );

  const createdArticle = await ArticleRepository.findById(createdArticleId[0]);

  return reply.status(200).send({
    data: {
      message: 'Article created',
      article: createdArticle
    }
  });
}