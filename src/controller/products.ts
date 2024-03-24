import { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../database';
import { Product, ProductCreateBody, ProductUpdateBody, ProductRequest } from '../types/product';

export const createProduct = async (request: FastifyRequest<{ Body: ProductCreateBody }>, reply: FastifyReply) => {
    const { name, picture, categoryId } = request.body;

    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });

    if (!category) {
        return reply.code(400).send({ error: 'Category ID does not exist.' });
    }
    
    try {
        const newProduct = await prisma.product.create({
            data: {
                name,
                picture,
                categoryId
            }
        });
        return reply.code(201).send(newProduct);
    } catch (error: any) {
        request.log.error(error);

        if (error.code === 'P2002') {
            return reply.code(409).send({ error: 'Product name already exists.' });
        }

        return reply.code(500).send({ error: 'An unexpected error occurred.' });
    }
};