import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controller/products';
import { productUpload } from '../middlewares/uploadImages';

export const productRoutes = (fastify: FastifyInstance, options: FastifyPluginOptions, done: HookHandlerDoneFunction) => {
    fastify.post('/products', {
        preHandler: productUpload.single('picture'),
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

    fastify.put('/products/:id', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' }
                },
                required: ['id']
            },
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    picture: { type: 'string', format: 'uri' },
                    categoryId: { type: 'string' },
                    price:{type : 'number'}
                }
            }
        }
    }, updateProduct);
    
    fastify.delete('/products/:id', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' }
                },
                required: ['id']
            }
        }
    }, deleteProduct);
    
    done();
};