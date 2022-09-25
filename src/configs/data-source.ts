import { DataSource } from "typeorm";

const dataSource = new DataSource({
  type: "postgres",
  host: "127.0.0.1",
  port: 5432,
  username: "postgres",
  password: "01658205896",
  database: "chatapp",
  entities: ["src/entities/*.entity.ts"],
  synchronize: true,
});

export default dataSource;
