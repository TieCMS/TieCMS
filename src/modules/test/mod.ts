import Module from "../../classes/module.ts";
import Metadata from "../../classes/types/metadata.ts";

export default class Test extends Module {
  load() {
    console.log("I AM LOADED TEST");
  }
  unload() {
    console.log("I AM UNLODAED TEST");
  }
}
