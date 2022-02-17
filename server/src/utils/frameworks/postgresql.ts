import { Pool } from "pg";

/**
 * Connection config to connect to PostgreSQL server from environment variables.
 */
export const pool = new Pool({
  user: process.env.TASKS_PG_USER,
  host: process.env.TASKS_PG_HOST,
  database: process.env.TASKS_PG_DB,
  password: process.env.TASKS_PG_PASSWORD,
  port: Number(process.env.TASKS_PG_PORT),
});

/**
 * Initializes the pool for first run before express requests come in.
 */
export const initPostgres = async () => {
  const client = await pool.connect();
  await client.query("BEGIN");
  await client.query("SELECT 1 + 1");
  await client.query("COMMIT");
  client.release();
};

export const transaction = async (query: string, params?: Array<any>) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(query, params);
    await client.query("COMMIT");
    return rows;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
