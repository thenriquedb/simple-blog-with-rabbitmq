import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";
import { ArticleRepository } from "../repositories/article-repository";

export const listArticlesByCategorySchema: FastifySchema = {
  description: 'List articles by category id',
  tags: ['Category'],
  params: {
    type: 'object',
    properties: {
      categoryId: { type: 'number' },
    }
  },
  response: {
    200: {
      description: 'Articles found',
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            articles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  content: { type: 'string' },
                  category_id: { type: 'number' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }
}

export async function listArticlesByCategory(request: FastifyRequest<{ Params: { categoryId: number } }>, reply: FastifyReply) {
  const { categoryId } = request.params
  const articles = await ArticleRepository.findByCategoryId(categoryId);

  return reply.status(200).send({
    data: {
      articles
    }
  });
}