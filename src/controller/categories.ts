import { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../database';
import { CategoryCreateBody, CategoryRequest } from '../types';

export const createCategory = async (request: FastifyRequest<{ Body: CategoryCreateBody }>, reply: FastifyReply) => {
    const { name, picture, parentId } = request.body;
    try {
      const newCategory = await prisma.category.create({
        data: {
          name,
          picture,
          parentId
        }
      });
      return reply.code(201).send(newCategory);
    } catch (error:any) {
      request.log.error(error);
  
    if (error.code === 'P2002') {
    return reply.code(409).send({ error: 'Category name already exists.' });
    }
  
      return reply.code(500).send({ error: 'An unexpected error occurred.' });
    }
  };
