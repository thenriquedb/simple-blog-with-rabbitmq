import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";
import { ArticleRepository } from "../repositories/article-repository";

export const findArticleSchema: FastifySchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' }
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