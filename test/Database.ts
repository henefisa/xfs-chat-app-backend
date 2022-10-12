import { DataSource } from 'typeorm';

export default class Database {
  private static _instance: Database;

  public static get instance() {
    if (!this._instance) {
      this._instance = new Database();
    }

    return this._instance;
  }

  private dataSource!: DataSource;

  async initialize() {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['src/entities/*.entity.ts'],
      synchronize: true,
    });

    await this.dataSource
      .initialize()
      .then(() => console.log('Test database initialized'))
      .catch((error) => console.log(error));
  }

  async close() {
    this.dataSource.destroy();
  }
}
