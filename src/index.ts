import fastify, { FastifyInstance } from 'fastify';

const app: FastifyInstance = fastify({ logger: true });

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log(`Server is listening on 3000`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();