import { Options } from 'sequelize';

const config: Options = {
  dialect: "sqlite",
  storage: "./database.sqlite3",
}

export = config;