import Module from "../../classes/module.ts";
import Route from "../../classes/route.ts";
import { Context } from "../../types/mod.ts";

export default class BugTracker extends Module {
  load() {
    console.log("I AM LOADED BUG");
    console.log(this.config.name);

    this.router;

    //database.connect();
  }
  unload() {
    console.log("I AM UNLODAED BUG");
    //database.close();
  }
}

const test = (context: Context) => {
  return (context.response.body = { message: "OK" });
};
