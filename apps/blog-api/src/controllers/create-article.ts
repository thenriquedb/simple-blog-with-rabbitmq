import { FastifyReply, FastifyRequest, FastifySchema } from "fastify"
import { ArticleRepository } from '../repositories/article-repository'
import { CategoryRepository } from "../repositories/category-repository";
import { getRabbitMQInstance } from "../shared/rabbitMQ";

type ICreateArticleBody = {
  title: string;
  content: string;
  categoryId: number;
}

export const createArticleSchema: FastifySchema = {
  description: 'Create an article',
  tags: ['Article'],
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
      categoryId: { type: 'number' },
    },
    required: ['title', 'content', 'categoryId']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            article: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                title: { type: 'string' },
                content: { type: 'string' },
                category_id: { type: 'number' }
              }
            }
          }
        }
      }
    },
    400: {
      type: 'object',
      properties: {
        error: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
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

  const channel = await getRabbitMQInstance();

  channel.publishInExchange(
    'ex.blog.articles',
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
        'x-category-id': category.id
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