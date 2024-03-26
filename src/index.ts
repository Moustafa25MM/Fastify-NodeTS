import fastify, { FastifyInstance } from 'fastify';
import prisma from './database';
import { categoryRoutes } from './routes/category';
import { productRoutes } from './routes/product';
import multer from 'fastify-multer';
import cors from '@fastify/cors'

prisma.$connect().then(() => {
    console.log('Successfully Connected to Database.');
  });

  
const build = async () => {
    const app = fastify({ logger: true });
    
    app.register(cors);
    app.register(multer.contentParser); 

    app.register(categoryRoutes);
    app.register(productRoutes);
    
    return app;
};
    
const PORT = process.env.PORT

const start = async (PORT:any) => {
    const app = await build();
    app.listen({ port: PORT, host: '127.0.0.1' })
    .then(()=>{
        console.log(`Server is listening on ${PORT}`)})
    .catch((err)=>{
        console.error('Error starting server:', err);
        process.exit(1);
    })
};

start(PORT);
