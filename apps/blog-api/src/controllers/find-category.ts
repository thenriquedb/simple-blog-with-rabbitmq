import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";
import { CategoryRepository } from "../repositories/category-repository";

export const findCategorySchema: FastifySchema = {
  description: 'Find a category by id',
  tags: ['Category'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' }
    }
  },
  response: {
    200: {
      description: 'Category found',
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            category: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' }
              }
            }
          }
        }
      }
    },
    404: {
      description: 'Category not found',
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

export async function findCategory(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
  const { id } = request.params;
  const category = await CategoryRepository.findById(id);

  if (!category) {
    return reply.status(404).send({
      data: {
        message: 'Category not found'
      }
    });
  }

  return reply.status(200).send({
    data: {
      category
    }
  });
}