const db = require('../db/postgre');

const init = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS resources (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertDataQuery = `
    INSERT INTO resources (name, description)
    VALUES 
      ('Resource 1', 'Description for resource 1'),
      ('Resource 2', 'Description for resource 2');
  `;

  try {
    await db.query(createTableQuery);
    console.log('Таблиця resources успішно створена.');

    await db.query(insertDataQuery);
    console.log('Два об\'єкти успішно додані в таблицю resources.');
  } catch (error) {
    console.error('Помилка при ініціалізації бази даних:', error);
  }
};

init();
