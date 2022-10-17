import { NotFoundException } from 'src/exceptions';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default class Database {
  private static _instance: Database;

  public static get instance() {
    if (!this._instance) {
      this._instance = new Database();
    }

    return this._instance;
  }

  private databases: { name: string; dataSource: DataSource }[] = [
    {
      name: 'default',
      dataSource: new DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        entities: ['src/entities/*.entity.ts'],
        synchronize: true,
      }),
    },
  ];

  async initialize() {
    const initialDatabasePromises = this.databases.map(async (database) => {
      try {
        await database.dataSource.initialize();
        console.log(`Database ${database.name} initialized`);
      } catch (error) {
        console.log(error);
      }
    });

    await Promise.all(initialDatabasePromises);
  }

  async cleanDatabases() {
    const cleaningPromises = this.databases.map(async (database) => {
      const entities = database.dataSource.entityMetadatas;

      const tableNames = entities
        .map((entity) => `"${entity.tableName}"`)
        .join(', ');

      await database.dataSource.query(`TRUNCATE TABLE ${tableNames} CASCADE;`);
    });

    await Promise.all(cleaningPromises);
  }

  async close() {
    const detroyDatabasePromises = this.databases.map(async (database) =>
      database.dataSource.destroy()
    );

    await Promise.all(detroyDatabasePromises);
  }

  getDataSource(name: string) {
    const target = this.databases.find((item) => item.name === name);

    if (!target) {
      throw new NotFoundException('data_source');
    }

    return target.dataSource;
  }
}