import { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../database';
import { Category, CategoryCreateBody, CategoryRequest } from '../types';

export const createCategory = async (request: FastifyRequest<{ Body: CategoryCreateBody }>, reply: FastifyReply) => {
    const { name, picture, parentId } = request.body;

    if (parentId) {
        const parentCategory = await prisma.category.findUnique({
          where: { id: parentId },
        });
    
        if (!parentCategory) {
          return reply.code(400).send({ error: 'Provided parentId does not exist.' });
        }
      }

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


  const buildCategoryTree = (categories: Category[], parentId: string | null = null): Category[] => {
    return categories
      .filter(category => category.parentId === parentId)
      .map(category => ({
        ...category,
        children: buildCategoryTree(categories, category.id)
      }));
  };
  export const getCategoryTree = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const categories = await prisma.category.findMany({
        include: {
          children: true, 
        }
      });
      
      const categoryTree = buildCategoryTree(categories);
      
      return reply.code(200).send(categoryTree);
    } catch (error: any) {
      request.log.error(error);
      return reply.code(500).send({ error: 'An unexpected error occurred.' });
    }
  };

  export const getCategories = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const categories = await prisma.category.findMany();
      
     return reply.code(200).send(categories);
    } catch (error: any) {
      request.log.error(error);
      return reply.code(500).send({ error: 'An unexpected error occurred.' });
    }
  };

  export const updateCategory = async (request: FastifyRequest<{ Params: { id: string }, Body: CategoryCreateBody }>, reply: FastifyReply) => {
    const { id } = request.params;
    const { name, picture, parentId } = request.body;
    try {
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
          name,
          picture,
          parentId
        }
      });
      return reply.code(200).send(updatedCategory);
    } catch (error: any) {
      request.log.error(error);
      if (error.code === 'P2002') {
        return reply.code(409).send({ error: 'Category name already exists.' });
      }
    }
      return reply.code(500).send({ error: 'An unexpected error occurred.' });
};