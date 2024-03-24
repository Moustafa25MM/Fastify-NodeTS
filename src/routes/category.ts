import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';
import { createCategory, getCategories, getCategoryTree, updateCategory } from '../controller/categories';

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

    fastify.patch('/categories/:id', {
        schema: {
          body: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              picture: { type: 'string', format: 'uri', nullable: true },
              parentId: { type: 'string', nullable: true },
            }
          },
          params: {
            type: 'object',
            properties: {
              id: { type: 'string' }
            },
            required: ['id']
          }
        }
      }, updateCategory);
      
    done();
  };