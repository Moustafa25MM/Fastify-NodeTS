import { Category } from "../types/category";


export const countProductsInCategory = (category: Category, allCategories: Category[]): number => {
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

export const buildCategoryTreeWithProducts = (categories: Category[], parentId: string | null = null): Category[] => {
    return categories
        .filter(category => category.parentId === parentId)
        .map(category => ({
            ...category,
            children: buildCategoryTreeWithProducts(categories, category.id),
            productsCount: countProductsInCategory(category, categories)
        }));
};

export const buildCategoryTree = (categories: Category[], parentId: string | null = null): Category[] => {
    return categories
      .filter(category => category.parentId === parentId)
      .map(category => ({
        ...category,
        children: buildCategoryTree(categories, category.id)
      }));
  };