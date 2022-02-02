import { DataTypes, Model } from "../../deps.ts";

export class Account extends Model {
  static table = "account";
  static timestamps = true;

  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    username: DataTypes.string(32),
    salt: DataTypes.BINARY,
  };
}

export class Test extends Model {}
