import { Router } from "../../deps.ts";
import { Context } from "../types/mod.ts";
import Module from "./module.ts";

interface Options {
  prefix?: string;
  path: string;
}

export default class Route {
  router: Router<Record<string, any>>;
  path: string;
  constructor(options: Options) {
    this.path = options.path;
    this.router = new Router({ prefix: options.prefix });
  }

  get(route: (context: Context) => void) {
    this.router.get(this.path, route);
  }
}
