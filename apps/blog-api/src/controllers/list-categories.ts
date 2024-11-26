import { FastifyReply, FastifyRequest } from "fastify";
import { CategoryRepository } from "../repositories/category-repository";

export async function listCategories(_: FastifyRequest, reply: FastifyReply) {
  const categories = await CategoryRepository.findAll();

  return reply.send({
    data: {
      categories
    }
  });
}