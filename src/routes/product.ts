import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';
import { createProduct, getProductById, getProducts } from '../controller/products';

export const productRoutes = (fastify: FastifyInstance, options: FastifyPluginOptions, done: HookHandlerDoneFunction) => {
    fastify.post('/products', {
        schema: {
            body: {
                type: 'object',
                required: ['name', 'categoryId'],
                properties: {
                    name: { type: 'string' },
                    picture: { type: 'string', format: 'uri' },
                    categoryId: { type: 'string' }
                }
            }
        }
    }, createProduct);

    fastify.get('/products/all',getProducts);
    fastify.get('/product/:id', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' }
                },
                required: ['id']
            }
        }
    }, getProductById);

    done();
};