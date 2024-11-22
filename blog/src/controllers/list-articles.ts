import { FastifyReply, FastifyRequest } from "fastify";
import { ArticleRepository } from "../repositories/article-repository";

export async function listArticles(_: FastifyRequest, reply: FastifyReply) {
  const articles = await ArticleRepository.findAll();

  return reply.status(200).send({
    data: {
      articles
    }
  });
}