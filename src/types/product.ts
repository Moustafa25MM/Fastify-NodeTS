import { FastifyInstance, FastifyRequest, RouteGenericInterface } from 'fastify';

export interface Product {
id: string;
name: string;
picture?: string | null;
categoryId: string;
price:number;
}

export interface ProductCreateBody {
name: string;
picture?: string;
categoryId: string;
price:number;
}

export interface ProductUpdateBody {
name?: string;
picture?: string;
categoryId?: string;
price?: any;
}

interface ProductRouteGeneric extends RouteGenericInterface {
Body: ProductCreateBody | ProductUpdateBody;
Params: {
id: string;
};
}

export interface ProductRequest extends FastifyRequest<ProductRouteGeneric> {}

export type ProductController = (fastify: FastifyInstance) => Promise<void>;