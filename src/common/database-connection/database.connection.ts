import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { join } from "path";

export const databaseOptions: MysqlConnectionOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "safe_cab",
  synchronize: false,
  logging: true,
  migrations: ["migration/**/*.ts"],
  cli: {
    migrationsDir: "migration",
  },
  entities: ["src/**/**.entity{.ts,.js}"],
};
