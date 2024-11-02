const connectMongo = require('../db/mongo'); 

const init = async () => {
  const db = await connectMongo();
  const collection = db.collection('resources');

  const initialData = [
    { name: 'Resource 1', description: 'Description for resource 1' },
    { name: 'Resource 2', description: 'Description for resource 2' },
  ];

  try {
    await collection.insertMany(initialData);
    console.log('Колекція resources успішно створена з початковими даними.');
  } catch (error) {
    console.error('Помилка при створенні колекції:', error);
  }
};

init();
