import { createCategory, deleteCategory, getCategories, getCategoryById, getCategoryByIdWithProductsCount, getCategoryTree, getCategoryTreeWithProductsCount, updateCategory } from '../controller/categories';
import { categoryUpload } from '../middlewares/uploadImages';

export const categoryRoutes = (fastify: any, options: any, done: any) => {
    fastify.post('/categories', {
        preHandler: categoryUpload.single('picture'),
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