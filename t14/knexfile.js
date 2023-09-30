import 'dotenv/config';

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'pg',
    connection: process.env.DB_URI,
    migrations: {
      directory: './db/migrations',
    },
  },
};
