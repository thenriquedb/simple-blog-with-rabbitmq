import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";
import { UserRepository } from "../repositories/user-repository";

export const createUserSchema: FastifySchema = {
  description: 'Create a user',
  tags: ['User'],
  body: {
    type: 'object',
    required: ['name', 'email'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string' }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                email: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
}

export interface ICreateUserBody {
  name: string;
  email: string;
}

export async function createUser(request: FastifyRequest<{ Body: ICreateUserBody }>, reply: FastifyReply) {
  const { name, email } = request.body;

  const userExists = await UserRepository.findByEmail(email);
  if (userExists) {
    return reply.code(409).send({
      error: 'A user with this email already exists'
    });
  }

  const createUserId = await UserRepository.create({ name, email });

  const user = await UserRepository.findById(createUserId[0]);

  return reply.code(201).send({
    data: {
      user
    }
  });
}