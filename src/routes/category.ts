import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';
import { createCategory, getCategories, getCategoryTree } from '../controller/categories';

export const categoryRoutes = (fastify: FastifyInstance, options: FastifyPluginOptions, done: HookHandlerDoneFunction) => {
    fastify.post('/categories', {
      schema: {
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
            picture: { type: 'string', format: 'uri' }, 
            parentId: { type: 'string' }
          }
        }
      }
    }, createCategory);

    fastify.get('/categories/tree', getCategoryTree);
    fastify.get('/categories/all' , getCategories);

    done();
  };