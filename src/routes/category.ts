// src/routes/categoryRoutes.ts
import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';
import { createCategory } from '../controller/categories';

export const categoryRoutes = (fastify: FastifyInstance, options: FastifyPluginOptions, done: HookHandlerDoneFunction) => {
    fastify.post('/categories', {
      // Define JSON schema for validation
      schema: {
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
            picture: { type: 'string', format: 'uri' }, // Ensure picture is a valid URI, if provided
            parentId: { type: 'string' } // You may want to add format validation for parentId if it has a specific format
          }
        }
      }
    }, createCategory);

    done();
  };