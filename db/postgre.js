const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'node_db_test',
  password: 'root',
  port: 5432,
});

client.connect();

module.exports = client;
