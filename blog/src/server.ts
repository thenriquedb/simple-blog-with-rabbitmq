import Fastify, { FastifyRequest } from 'fastify'

const fastify = Fastify({ logger: false })

type Article = {
  id: string;
  title: string
  content: string
  category: string
}

const articles: Article[] = [];

type CreateArticleBody = {
  title: string
  content: string
  category: string
}

const schema = {
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
fastify.post('/article',
  { schema },
  async (request: FastifyRequest<{ Body: CreateArticleBody }>, reply) => {
    const { title, content, category } = request.body;

    const article = {
      id: Date.now().toString(),
      title, content,
      category
    }

    articles.push(article);

    return reply.status(200).send({
      data: {
        message: 'Article created',
        article
      }
    });
  });

fastify.get('/article', async (_, reply) => {
  return reply.status(200).send({
    data: {
      articles
    },
  });
});

fastify.get('/article/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
  const article = articles.find(article => article.id === request.params.id);

  if (!article) {
    return reply.status(404).send({
      error: {
        message: 'Article not found',
      },
    });
  }

  return reply.status(200).send({
    data: {
      article
    },
  });
});

fastify.listen({ port: 3000 });
