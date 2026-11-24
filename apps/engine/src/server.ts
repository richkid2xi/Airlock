import Fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

export function buildServer() {
  const app = Fastify({ logger: false });

  app.get('/health', async () => {
    return { status: 'ok' };
  });

  return app;
}

const server = buildServer();
const port = Number(process.env.PORT) || 4000;

if (process.env.NODE_ENV !== 'test') {
  server.listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Airlock engine listening on ${address}`);
  });
}

export default server;
