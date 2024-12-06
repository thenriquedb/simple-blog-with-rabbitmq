import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";
import { CategoryRepository } from "../repositories/category-repository";

export const listCategoriesSchema: FastifySchema = {
  description: 'List all categories',
  tags: ['Category'],
  response: {
    200: {
      description: 'Categories found',
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            categories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }
}

export async function listCategories(_: FastifyRequest, reply: FastifyReply) {
  const categories = await CategoryRepository.findAll();

  return reply.send({
    data: {
      categories
    }
  });
}