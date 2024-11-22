import Fastify, { FastifyRequest } from 'fastify'
import { RabbitMQ } from './shared/rabbitMQ'
import { createArticle, createArticleSchema } from './controllers/create-article';
import { findArticle, findArticleSchema } from './controllers/find-article';
import { listArticles } from './controllers/list-articles';

const fastify = Fastify({ logger: false })

const channel = new RabbitMQ('amqp://guest:guest@localhost:5672');

enum Category {
  TECHNOLOGY = 'technology',
  SPORTS = 'sports',
  POLITICS = 'politics',
  ECONOMY = 'economy',
}

type User = {
  id: number;
  name: string
  email: string
}

type Subscribers = {
  userId: number;
  category: string;
}

const users: User[] = [];
const subscribers: Subscribers[] = [];

type CreateUserBody = {
  name: string
  email: string
}

fastify.post('/user', async (request: FastifyRequest<{ Body: CreateUserBody }>, reply) => {
  const { name, email } = request.body;

  const user = {
    id: users.length + 1,
    name,
    email
  };

  users.push(user);

  return reply.status(200).send({
    data: {
      message: 'User created'
    }
  });
});

fastify.post('/article', { schema: createArticleSchema }, createArticle);
fastify.get('/article/:id', { schema: findArticleSchema }, findArticle);
fastify.get('/article', listArticles);

fastify.post('/subscribe', async (request: FastifyRequest<{ Body: { userId: number; category: Category } }>, reply) => {
  const { userId, category } = request.body;

  const subscriber = {
    userId,
    category
  };

  subscribers.push(subscriber);

  return reply.status(200).send({
    data: {
      message: 'User subscribed'
    }
  });
});

(async () => {
  try {
    await channel.start();
    await fastify.listen({ port: 3000 })
    console.log('Server listening at 3000')
  } catch (error) {
    console.log('error', error);
  }
})();