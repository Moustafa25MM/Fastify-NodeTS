import { FastifyInstance, FastifyRequest, RouteGenericInterface } from 'fastify';

export interface Category {
    id: string;
    name: string;
    picture?: string | null;
    parentId?: string | null;
    children?: Category[];
  }
  
export interface CategoryCreateBody {
  name: string;
  picture?: string;
  parentId?: string;
}

interface CategoryRouteGeneric extends RouteGenericInterface {
    Body: CategoryCreateBody;
  }
  
  export interface CategoryRequest extends FastifyRequest<CategoryRouteGeneric> {}
  
export type CategoryController = (fastify: FastifyInstance) => Promise<void>;