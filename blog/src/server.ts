import Fastify from 'fastify';
import { createArticle, createArticleSchema } from './controllers/create-article';
import { findArticle, findArticleSchema } from './controllers/find-article';
import { listArticles } from './controllers/list-articles';
import { findCategory, findACategorySchema } from './controllers/find-category';
import { listCategories } from './controllers/list-categories';
import { createUser, createUserSchema } from './controllers/create-user';

const fastify = Fastify({ logger: false });

fastify.post('/article', { schema: createArticleSchema }, createArticle);
fastify.get('/article/:id', { schema: findArticleSchema }, findArticle);
fastify.get('/article', listArticles);

fastify.get('/category/:id', { schema: findACategorySchema }, findCategory);
fastify.get('/category', listCategories);

fastify.post('/user', { schema: createUserSchema }, createUser);

(async () => {
  try {
    await fastify.listen({ port: 3000 })
    console.log('Server listening at 3000')
  } catch (error) {
    console.log('error', error);
  }
})();