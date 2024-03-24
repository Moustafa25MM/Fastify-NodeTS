import fastify, { FastifyInstance } from 'fastify';
import prisma from './database';

const app: FastifyInstance = fastify({ logger: true });

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

prisma.$connect().then(() => {
    console.log('Successfully Connected to Database.');
  });

const PORT = process.env.PORT

const start = async (PORT:any) => {
  try {
    await app.listen(PORT);
    console.log(`Server is listening on ${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start(PORT);