const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'security_incidents_lab1',
});

async function initializeDatabase() {
  try {
    const sqlPath = path.join(__dirname, '..', 'database', 'init.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf-8');
    const client = await pool.connect();

    await client.query(sqlScript);
    const usersResult = await client.query('SELECT COUNT(*) FROM users');
    const incidentsResult = await client.query('SELECT COUNT(*) FROM incidents');

    console.log('Database initialized successfully');
    console.log(`Users created: ${usersResult.rows[0].count}`);
    console.log(`Incidents created: ${incidentsResult.rows[0].count}`);

    client.release();
    await pool.end();
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
