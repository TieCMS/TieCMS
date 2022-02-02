import { Router } from "../modules/core/mod.ts";
import { Module } from "./mod.ts";

interface Options {
  prefix?: string;
  path: string;
}

export class Route extends Module {
  router: Router<Record<string, any>>;
  constructor(options: Options) {
    super();
    this.router = new Router({ prefix: options.prefix });
  }

  get(options: Options) {
    this.router.get(options.path, (context) => {});
  }
}
