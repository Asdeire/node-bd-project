const { MongoClient } = require('mongodb');

const url = 'mongodb://host.docker.internal:27017';
const client = new MongoClient(url);

async function connectMongo() {
  await client.connect();
  console.log('Connected to MongoDB');
  return client.db('mydatabase');
}

module.exports = connectMongo;
