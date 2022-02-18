import Module from "../../classes/module.ts";

export default class Test extends Module {
  load() {
    console.log("I AM LOADED TEST");
  }
  unload() {
    console.log("I AM UNLODAED TEST");
  }
}
