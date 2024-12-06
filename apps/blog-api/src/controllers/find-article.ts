import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";
import { ArticleRepository } from "../repositories/article-repository";

export const findArticleSchema: FastifySchema = {
  description: 'Find an article by id',
  tags: ['Article'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' }
    }
  },
  response: {
    200: {
      description: 'Article found',
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            article: {
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
    },
    404: {
      description: 'Article not found',
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }
}

export async function findArticle(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
  const { id } = request.params;
  const article = await ArticleRepository.findById(id);

  if (!article) {
    return reply.status(404).send({
      data: {
        message: 'Article not found'
      }
    });
  }

  return reply.status(200).send({
    data: {
      article
    }
  });
}