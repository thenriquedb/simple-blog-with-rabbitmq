import Fastify from 'fastify';
import websocket from '@fastify/websocket';

import { createArticle, createArticleSchema } from './controllers/create-article';
import { findArticle, findArticleSchema } from './controllers/find-article';
import { listArticles } from './controllers/list-articles';
import { findCategory, findACategorySchema } from './controllers/find-category';
import { listCategories } from './controllers/list-categories';
import { createUser, createUserSchema } from './controllers/create-user';
import { createUserPreference, createUserPreferenceSchema } from './controllers/create-user-preference';
import { articleEventsConsumer } from './consumers/articles-events';
import { getNotificationsRealTime } from './controllers/get-notifications-real-time';

const fastify = Fastify({ logger: false });
fastify.register(websocket);

fastify.post('/article', { schema: createArticleSchema }, createArticle);
fastify.get('/article/:id', { schema: findArticleSchema }, findArticle);
fastify.get('/article', listArticles);

fastify.get('/category/:id', { schema: findACategorySchema }, findCategory);
fastify.get('/category', listCategories);

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
    await fastify.listen({ port: 3000 });
    articleEventsConsumer();
    console.log('Server listening at 3000')
  } catch (error) {
    console.log('error', error);
  }
})();