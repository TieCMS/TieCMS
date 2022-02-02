import { Database, MySQLConnector } from "../../deps.ts";

const connector = new MySQLConnector({
  database: "auth",
  host: "194.163.156.63",
  username: "newt",
  password: "1EW6taYaSonE",
  port: 3306,
  logger: { enable: false },
});

export const database = new Database(connector);
