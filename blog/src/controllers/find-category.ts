import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";
import { CategoryRepository } from "../repositories/category-repository";

export const findACategorySchema: FastifySchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' }
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