import Module from "../../classes/module.ts";
import Metadata from "../../classes/types/metadata.ts";

export default class Awoo extends Module {
  load() {
    console.log("I AM LOADED AWOO");
  }
  unload() {
    console.log("I AM UNLODAED AWOO");
  }
}
