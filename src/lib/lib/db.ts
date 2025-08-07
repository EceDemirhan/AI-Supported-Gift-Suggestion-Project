/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;