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

export const getProductById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;

    try {
        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return reply.code(404).send({ error: 'Product not found.' });
        }

        return reply.code(200).send(product);
    } catch (error: any) {
        request.log.error(error);
        return reply.code(500).send({ error: 'An unexpected error occurred.' });
    }
};

export const getProducts = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {

    try {
        const products = await prisma.product.findMany();

        return reply.code(200).send(products);
    } catch (error: any) {
        request.log.error(error);
        return reply.code(500).send({ error: 'An unexpected error occurred.' });
    }
};

export const updateProduct = async (request: FastifyRequest<{ Body: ProductUpdateBody; Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    const { name, picture, categoryId } = request.body;

    let updateData: any = {
        name,
        picture,
    };

    if (categoryId) {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            return reply.code(400).send({ error: 'Category ID does not exist.' });
        }
        updateData.categoryId = categoryId;
    }else {
        const currentProduct = await prisma.product.findUnique({
            where: { id },
            select: { categoryId: true }
        });

        if (!currentProduct) {
            return reply.code(404).send({ error: 'Product not found.' });
        }

        updateData.categoryId = currentProduct.categoryId;
    }


    
    try {
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: updateData,
        });

        return reply.code(200).send(updatedProduct);
    } catch (error: any) {
        request.log.error(error);

        if (error.code === 'P2002') {
            return reply.code(409).send({ error: 'Product name already exists.' });
        }

        return reply.code(500).send({ error: 'An unexpected error occurred.' });
    }
};