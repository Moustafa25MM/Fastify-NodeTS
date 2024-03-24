import { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../database';
import { Category, CategoryCreateBody } from '../types/category';

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

  const countProductsInCategory = (category: Category, allCategories: Category[]): number => {
    let count = category.products ? category.products.length : 0;
    if (category.children && category.children.length > 0) {
        for (const child of category.children) {
            const childCategory = allCategories.find(c => c.id === child.id);
            if (childCategory) {
                count += countProductsInCategory(childCategory, allCategories);
            }
        }
    }
    return count;
};




const buildCategoryTreeWithProducts = (categories: Category[], parentId: string | null = null): Category[] => {
    return categories
        .filter(category => category.parentId === parentId)
        .map(category => ({
            ...category,
            children: buildCategoryTreeWithProducts(categories, category.id),
            productsCount: countProductsInCategory(category, categories)
        }));
};

export const getCategoryTreeWithProductsCount = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                children: true,
                products: true,
            }
        });

        const categoryTree = buildCategoryTreeWithProducts(categories);

        return reply.code(200).send(categoryTree);
    } catch (error: any) {
        request.log.error(error);
        return reply.code(500).send({ error: 'An unexpected error occurred.' });
    }
};


export const getCategoryByIdWithProductsCount = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    
    try {
        const categories = await prisma.category.findMany({
            include: {
                children: {
                    include: {
                        products: true  
                    }
                },
                products: true,
            }
        });

        const category = categories.find((cat: Category) => cat.id === id);

        if (!category) {
            return reply.code(404).send({ error: 'Category not found.' });
        }

        const allCategories = [category, ...categories];

        const productsCount = countProductsInCategory(category, allCategories);

        const categoryWithProductsCount = {
            ...category,
            productsCount,
            children: category.children.map((child: Category) => {
                const childProductsCount = countProductsInCategory(child, allCategories);
                return {
                    ...child,
                    productsCount: childProductsCount
                };
            })
        };

        return reply.code(200).send(categoryWithProductsCount);
    } catch (error: any) {
        request.log.error(error);
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

export const deleteCategory = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;

    try {
        
    const children = await prisma.category.findMany({
        where: { parentId: id },
    });
    
    if (children.length > 0) {
        return reply.code(400).send({ error: 'Category has child categories. Please delete or reassign them before deleting this category.' });
        }

    await prisma.category.delete({
    where: { id }
    });

    return reply.code(204).send({msg : 'Deleted Successfully'});
    } catch (error: any) {
      request.log.error(error);
      return reply.code(500).send({ error: 'An unexpected error occurred.' });
    }
};

export const getCategoryById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          children: true, 
          parent: true,  
          products: true 
        }
      });
  
      if (!category) {
        return reply.code(404).send({ error: 'Category not found.' });
      }
  
      return reply.code(200).send(category);
    } catch (error: any) {
      request.log.error(error);
      return reply.code(500).send({ error: 'An unexpected error occurred.' });
    }
  };
