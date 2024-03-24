import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';
import { createCategory, deleteCategory, getCategories, getCategoryById, getCategoryByIdWithProductsCount, getCategoryTree, getCategoryTreeWithProductsCount, updateCategory } from '../controller/categories';

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
    fastify.get('/categories/products/tree', getCategoryTreeWithProductsCount);
    fastify.get('/categories/all' , getCategories);
    fastify.get('/categories/products/tree/:id', getCategoryByIdWithProductsCount);
    fastify.get('/category/:id', {
        schema: {
          params: {
            type: 'object',
            properties: {
              id: { type: 'string' }
            },
            required: ['id']
          }
        }
      }, getCategoryById);
      
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
      
      fastify.delete('/categories/:id', {
        schema: {
          params: {
            type: 'object',
            properties: {
              id: { type: 'string' }
            },
            required: ['id']
          }
        }
      }, deleteCategory);
      
    done();
  };