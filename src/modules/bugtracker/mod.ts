import Module from "../../classes/module.ts";

export default class BugTracker extends Module {
  load() {
    console.log("I AM LOADED BUG");
    //database.connect();
  }
  unload() {
    console.log("I AM UNLODAED BUG");
    //database.close();
  }
}
