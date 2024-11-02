const fastify = require('fastify')({ logger: true });
const pgRoutes = require('./routes/pgRoutes');
const mongoRoutes = require('./routes/mongoRoutes');
const connectMongo = require('./db/mongo');
const pgClient = require('./db/postgre');

pgClient.connect()
  .then(() => fastify.log.info('Connected to PostgreSQL'))
  .catch((err) => fastify.log.error('Failed to connect to PostgreSQL:', err));

connectMongo()
  .then((db) => {
    fastify.decorate('mongo', { db });
    fastify.log.info('Connected to MongoDB');
  })
  .catch((err) => fastify.log.error('Failed to connect to MongoDB:', err));

fastify.register(pgRoutes);
fastify.register(mongoRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`Server is running at http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};


start();
