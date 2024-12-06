import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifySwagger from '@fastify/swagger';

import { createArticle, createArticleSchema } from './controllers/create-article';
import { findArticle, findArticleSchema } from './controllers/find-article';
import { listArticlesByCategory, listArticlesByCategorySchema } from './controllers/list-articles-by-category';
import { findCategory, findCategorySchema } from './controllers/find-category';
import { listCategories, listCategoriesSchema } from './controllers/list-categories';
import { createUser, createUserSchema } from './controllers/create-user';
import { createUserPreference, createUserPreferenceSchema } from './controllers/create-user-preference';
import { articleEventsConsumer } from './consumers/articles-events';
import { getNotificationsRealTime } from './controllers/get-notifications-real-time';
import { setupRabbitMQ } from './shared/rabbitMQ';

const fastify = Fastify({ logger: false });
fastify.register(websocket);

await fastify.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Blog API',
      description: 'Blog API',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Article',
        description: 'Article related end-points'
      },
      {
        name: 'Category',
        description: 'Category related end-points'
      },
      {
        name: 'User',
        description: 'User related end-points'
      },
      {
        name: 'UserPreference',
        description: 'UserPreference related end-points'
      }
    ]
  }
});

await fastify.register(fastifySwaggerUi, { routePrefix: '/docs' });

fastify.post('/article', { schema: createArticleSchema }, createArticle);
fastify.get('/article/:id', { schema: findArticleSchema }, findArticle);

fastify.get('/category/:id', { schema: findCategorySchema }, findCategory);
fastify.get('/category', { schema: listCategoriesSchema }, listCategories);
fastify.get('/category/:categoryId/article', { schema: listArticlesByCategorySchema }, listArticlesByCategory);

fastify.post('/userPreference', { schema: createUserPreferenceSchema }, createUserPreference);

fastify.post('/user', { schema: createUserSchema }, createUser);

fastify.register(async (app) => {
  app.get(
    '/user/:userId/notifications',
    { websocket: true },
    getNotificationsRealTime
  );
});

(async () => {
  try {
    await setupRabbitMQ();
    await fastify.listen({ port: 3000 });
    await articleEventsConsumer();
    console.log('Server listening at 3000')
  } catch (error) {
    console.log('error', error);
  }
})();