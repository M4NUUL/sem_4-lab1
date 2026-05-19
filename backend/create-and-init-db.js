const fs = require('fs');
const path = require('path');
const { Client, Pool } = require('pg');
require('dotenv').config();

async function createAndInitializeDatabase() {
  const dbName = process.env.DB_NAME || 'security_incidents_lab1';
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: 'postgres',
  });

  try {
    await adminClient.connect();

    try {
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database ${dbName} created`);
    } catch (error) {
      if (error.code !== '42P04') {
        throw error;
      }
      console.log(`Database ${dbName} already exists`);
    }

    await adminClient.end();

    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
    });

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
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createAndInitializeDatabase();
