import config from './config';
import knexO from 'knex';

const knex = knexO({
  client: 'mysql2',
  connection: {
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.database,
  }
});

export { knex };