import { FastifyInstance, FastifyRequest, RouteGenericInterface } from 'fastify';

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