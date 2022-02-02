/* import { Database, MySQLConnector, Model, DataTypes } from "https://deno.land/x/denodb@v1.0.40/mod.ts";

const connector = new MySQLConnector({
  database: "auth",
  host: "194.163.156.63",
  username: "newt",
  password: "1EW6taYaSonE",
  port: 3306,
  logger: { enable: false },
});

const db = new Database(connector);

class Account extends Model {
  static table = "account";
  static timestamps = true;

  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    username: DataTypes.string(32),
    salt: DataTypes.BINARY,
  };
}

db.link([Account]);

const account = Account;

console.log(await account.select("username").all());
 */
const test = [];
import { Model } from "./deps.ts";
import { database } from "./src/database/connection.ts";
import * as Models from "./src/database/tables.ts";
for (const model of Object.entries(Models)) {
  //console.log(...model);
  test.push(...model);
}

database.link(test);

console.log(...test);
