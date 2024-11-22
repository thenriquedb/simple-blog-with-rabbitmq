import { FastifyReply, FastifyRequest, FastifySchema } from "fastify"
import { ArticleRepository } from '../repositories/article-repository'
import { channel } from '../shared/rabbitMQ';

type ICreateArticleBody = {
  title: string
  content: string
  category: string
}

export const createArticleSchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
      category: { type: 'string' },
    },
    required: ['title', 'content', 'category']
  }
}

export async function createArticle(request: FastifyRequest<{ Body: ICreateArticleBody }>, reply: FastifyReply) {
  const { title, content, category } = request.body;

  const article = {
    title,
    content,
    category
  }

  const createdArticleId = await ArticleRepository.create(article);

  channel.publishInExchange(
    'articles',
    `events.article.created`,
    JSON.stringify(article),
    {
      headers: {
        'x-match': 'any',
        category
      }
    }
  );

  const createdArticle = await ArticleRepository.findById(createdArticleId[0]);

  return reply.status(200).send({
    data: {
      message: 'Article created',
      article: createdArticle
    }
  });
}