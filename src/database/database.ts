import { walkSync } from "https://deno.land/std@0.122.0/fs/walk.ts";
import {
  Database,
  MySQLConnector,
  Model,
  DataTypes,
} from "https://deno.land/x/denodb@v1.0.40/mod.ts";
import { database } from "./connection.ts";
import * as Models from "./tables.ts";

//const Models: Model[] = []; //new Set<Model>();

for (const entry of walkSync("./src/database/models", {
  includeFiles: false,
  maxDepth: 1,
})) {
  if (entry.name === "modules") continue;
  const Model: Model = new (await import(`./${entry.name}/mod.ts`)).default();
  this.cache.set(module.name, module);
}

database.link([]);

const account = Models.Account;

console.log(await account.select("username").all());

const db = {
  account,
};

db.account.select("username").all();
