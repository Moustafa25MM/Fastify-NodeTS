import prisma from '../database';
import { Category, CategoryCreateBody } from '../types/category';
import { buildCategoryTree, buildCategoryTreeWithProducts, countProductsInCategory } from '../utils/categoryUtils';
import { cloudi } from '../middlewares/uploadImages';
import jimp from 'jimp';

export const createCategory = async (request: any, reply: any) => {
    const { name, parentId } = request.body;

    let picture = '';
    if (request.file) {
      
        try {
            const image = await jimp.read(request.file.path);
            image.resize(3200, 3200);
            
            const resizedImageBuffer = await image.getBufferAsync(jimp.MIME_PNG);
            
            const uploadResponse = await new Promise<any>((resolve, reject) => {
                cloudi.uploader.upload_stream(
                  {
                    resource_type: 'auto',
                    public_id: `${Date.now()}_category`,
                  },
                  (error:any, result:any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                  }
                ).end(resizedImageBuffer);
            });
            
            picture = uploadResponse?.url || '';
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ error: 'An unexpected error occurred during image upload.' });
        }
    }

    const err = request.fileValidationError;
    if (err) {
        return reply.status(400).send(err);
    }

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


export const getCategoryTreeWithProductsCount = async (request: any, reply: any) => {
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


export const getCategoryByIdWithProductsCount = async (request: any, reply: any) => {
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


  export const getCategoryTree = async (request: any, reply: any) => {
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

  export const getCategories = async (request: any, reply: any) => {
    try {
      const categories = await prisma.category.findMany();
      
     return reply.code(200).send(categories);
    } catch (error: any) {
      request.log.error(error);
      return reply.code(500).send({ error: 'An unexpected error occurred.' });
    }
  };

  export const updateCategory = async (request: any, reply: any) => {
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

export const deleteCategory = async (request: any, reply: any) => {
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

export const getCategoryById = async (request: any, reply: any) => {
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
