import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";
import { UserRepository } from "../repositories/user-repository";
import { UserPreferenceRepository, } from "../repositories/user-preference-repository";
import { CategoryRepository } from "../repositories/category-repository";

export const createUserPreferenceSchema: FastifySchema = {
  description: 'Create a user preference',
  tags: ['UserPreference'],
  body: {
    type: 'object',
    properties: {
      userId: { type: 'number' },
      categoryId: { type: 'number' }
    },
    required: ['userId', 'categoryId']
  },
  response: {
    200: {
      description: 'User preference created',
    },
    400: {
      description: 'Bad request',
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

export interface ICreateUserPreferenceBody {
  userId: number;
  categoryId: number;
}

export async function createUserPreference(request: FastifyRequest<{ Body: ICreateUserPreferenceBody }>, reply: FastifyReply) {
  const { userId, categoryId } = request.body;

  const user = await UserRepository.findById(userId);

  if (!user) {
    return reply.status(400).send({
      error: {
        message: 'User not found'
      }
    });
  }

  const category = await CategoryRepository.findById(categoryId);

  if (!category) {
    return reply.status(400).send({
      error: {
        message: 'Category not found'
      }
    });
  }

  const userPreference = await UserPreferenceRepository.findByUserIdAndCategoryId(userId, categoryId);

  if (userPreference) {
    return reply.status(400).send({
      error: {
        message: 'User preference already exists'
      }
    });
  }

  await UserPreferenceRepository.create({
    userId,
    categoryId
  });

  return reply.status(200);
}
