const client = require('../db/postgre');

async function pgRoutes(fastify, options) {
  const idParamSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
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

  fastify.post('/api/pg/resources', {
    schema: {
      body: resourceBodySchema,
    }
  }, async (request, reply) => {
    const { name, description } = request.body;
    const res = await client.query(
      'INSERT INTO resources (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    reply.send(res.rows[0]);
  });

  fastify.get('/api/pg/resources', async (request, reply) => {
    const res = await client.query('SELECT * FROM resources');
    reply.send(res.rows);
  });

  fastify.get('/api/pg/resources/:id', {
    schema: {
      params: idParamSchema,
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const res = await client.query('SELECT * FROM resources WHERE id = $1', [id]);
    if (res.rows.length === 0) {
      reply.code(404).send({ message: 'Resource not found' });
    } else {
      reply.send(res.rows[0]);
    }
  });

  fastify.put('/api/pg/resources/:id', {
    schema: {
      params: idParamSchema,
      body: resourceBodySchema,
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const { name, description } = request.body;
    const res = await client.query(
      'UPDATE resources SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    if (res.rows.length === 0) {
      reply.code(404).send({ message: 'Resource not found' });
    } else {
      reply.send(res.rows[0]);
    }
  });

  fastify.delete('/api/pg/resources/:id', {
    schema: {
      params: idParamSchema,
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const res = await client.query('DELETE FROM resources WHERE id = $1 RETURNING *', [id]);
    if (res.rows.length === 0) {
      reply.code(404).send({ message: 'Resource not found' });
    } else {
      reply.send({ message: 'Resource deleted', resource: res.rows[0] });
    }
  });
}

module.exports = pgRoutes;
