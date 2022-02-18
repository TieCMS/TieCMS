import Module from "../../classes/module.ts";

export default class Awoo extends Module {
  load() {
    console.log("I AM LOADED AWOO");
  }
  unload() {
    console.log("I AM UNLODAED AWOO");
  }
}
