import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config({
  path:
    process.env.NODE_ENV !== undefined
      ? `.${process.env.NODE_ENV.trim()}.env`
      : '.env',
});

const port = Number(process.env.DB_PORT);

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: port || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/entities/*.entity.ts'],
  synchronize: true,
});

export default dataSource;
