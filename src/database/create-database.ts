// gateway/src/database/create-database.ts
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function createDatabases() {
  const adminClient = new Client({
    host: process.env.USER_DB_HOST || 'localhost',
    port: Number(process.env.USER_DB_PORT || 5432),
    user: process.env.USER_DB_USERNAME || 'postgres',
    password: process.env.USER_DB_PASSWORD || 'ips12345',
    database: 'postgres', // Connect to default postgres database
  });

  try {
    await adminClient.connect();
    console.log(' Connected to PostgreSQL');

    // Create user_doctor database
    const userDbName = process.env.USER_DB_NAME || 'microservice_db';
    const userDbExists = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [userDbName],
    );

    if (userDbExists.rows.length === 0) {
      await adminClient.query(`CREATE DATABASE "${userDbName}"`);
      console.log(` Created ${userDbName} database`);
    } else {
      console.log(` ${userDbName} database already exists`);
    }

    // Create appointment_doctor database
    const appointmentDbName = process.env.APPOINTMENT_DB_NAME || 'microservice_db';
    const appointmentDbExists = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [appointmentDbName],
    );

    if (appointmentDbExists.rows.length === 0) {
      await adminClient.query(`CREATE DATABASE "${appointmentDbName}"`);
      console.log(` Created ${appointmentDbName} database`);
    } else {
      console.log(` ${appointmentDbName} database already exists`);
    }

    await adminClient.end();
    console.log(' Database creation completed');
  } catch (error) {
    console.error('❌ Error creating databases:', error);
    await adminClient.end();
    process.exit(1);
  }
}

createDatabases().catch((error) => {
  console.error('❌ Database creation failed:', error);
  process.exit(1);
});