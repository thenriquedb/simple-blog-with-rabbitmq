import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";
import { UserRepository } from "../repositories/user-repository";

export const createUserSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['name', 'email'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string' }
    }
  }
}

export interface ICreateUserBody {
  name: string;
  email: string;
}

export async function createUser(request: FastifyRequest<{ Body: ICreateUserBody }>, reply: FastifyReply) {
  const { name, email } = request.body;

  const createUserId = await UserRepository.create({ name, email });

  const user = await UserRepository.findById(createUserId[0]);

  return reply.code(201).send({
    data: {
      user
    }
  });
}