import Module from "../../classes/module.ts";
import Metadata from "../../classes/types/metadata.ts";

export default class OwO extends Module {
  load() {
    console.log("I AM LOADED OWO");
  }

  unload() {
    console.log("I AM UNLODAED OWO");
  }
}
