import Module from "../../classes/module.ts";

export default class OwO extends Module {
  load() {
    console.log("I AM LOADED OWO");
  }

  unload() {
    console.log("I AM UNLODAED OWO");
  }
}
