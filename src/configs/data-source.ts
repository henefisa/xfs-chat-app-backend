import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: ['src/entities/*.entity.ts'],
  synchronize: true,
});

export default dataSource;
