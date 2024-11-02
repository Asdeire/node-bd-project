const connectMongo = require('../db/mongo');
const { ObjectId } = require('mongodb');

async function mongoRoutes(fastify, options) {
  let db;
  try {
    db = await connectMongo();
  } catch (error) {
    fastify.log.error('Failed to connect to MongoDB:', error);
    throw new Error('MongoDB connection failed');
  }
  
  const collection = db.collection('resources');

  const idParamSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
    },
    required: ['id']
  };

  const resourceBodySchema = {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1 },
      description: { type: 'string', minLength: 1 },
    },
    required: ['name', 'description']
  };

  fastify.post('/api/mongo/resources', {
    schema: { body: resourceBodySchema },
  }, async (request, reply) => {
    try {
      const resource = request.body;
      const res = await collection.insertOne(resource);
      reply.send({ id: res.insertedId, ...resource });
    } catch (error) {
      reply.code(500).send({ message: 'Error creating resource', error });
    }
  });

  fastify.get('/api/mongo/resources', async (request, reply) => {
    try {
      const resources = await collection.find().toArray();
      reply.send(resources);
    } catch (error) {
      reply.code(500).send({ message: 'Error fetching resources', error });
    }
  });

  fastify.get('/api/mongo/resources/:id', {
    schema: { params: idParamSchema },
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const resource = await collection.findOne({ _id: new ObjectId(id) });
      if (!resource) {
        reply.code(404).send({ message: 'Resource not found' });
      } else {
        reply.send(resource);
      }
    } catch (error) {
      reply.code(500).send({ message: 'Error fetching resource', error });
    }
  });

  fastify.put('/api/mongo/resources/:id', {
    schema: {
      params: idParamSchema,
      body: resourceBodySchema,
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const updatedData = request.body;
      const res = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedData },
        { returnDocument: 'after' }
      );
      if (!res.value) {
        reply.code(404).send({ message: 'Resource not found' });
      } else {
        reply.send(res.value);
      }
    } catch (error) {
      reply.code(500).send({ message: 'Error updating resource', error });
    }
  });

  fastify.delete('/api/mongo/resources/:id', {
    schema: { params: idParamSchema },
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const res = await collection.findOneAndDelete({ _id: new ObjectId(id) });
      if (!res.value) {
        reply.code(404).send({ message: 'Resource not found' });
      } else {
        reply.send({ message: 'Resource deleted', resource: res.value });
      }
    } catch (error) {
      reply.code(500).send({ message: 'Error deleting resource', error });
    }
  });
}

module.exports = mongoRoutes;
