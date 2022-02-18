import { parse } from "https://deno.land/std@0.123.0/encoding/yaml.ts";
import { bold, brightBlue, brightRed, brightYellow, Router } from "../../deps.ts";
import { Context } from "../types/mod.ts";
import { logger } from "../utils/mod.ts";
import Config from "./types/config.ts";

interface Options {
  prefix?: string;
  path: string;
}

export default abstract class Module {
  router: Router<Record<string, any>>;
  config: Config;
  constructor(path: string, router: Options) {
    this.config = parse(new TextDecoder("utf-8").decode(Deno.readFileSync(`${path}/config.yml`))) as Config;
    this.router = new Router({ prefix: router.prefix });
  }
  //public readonly router = new Router({ prefix: "router.prefix" })
  public readonly dependencies: string[] = [];

  public loaded = false;

  public readonly requiredIn: string[] = [];

  abstract load(): Promise<void> | void;
  abstract unload(): Promise<void> | void;
  public async depend(cache: Map<string, Module>, stack: Set<string>): Promise<boolean> {
    if (stack.has(this.config.name)) {
      logger.error(
        `detected loop in ${[...stack.values(), this.config.name]
          .map((mod) => bold((mod === this.config.name ? brightBlue : brightYellow)(mod)))
          .join(bold(brightRed(" -> ")))}`,
      );
      return false;
    }
    stack.add(this.config.name);
    const missingDependencies = this.dependencies.filter((dependency: string) => !cache.get(dependency));
    if (missingDependencies.length > 0) {
      logger.error(
        `cannot find ${missingDependencies.length === 1 ? "dependency" : "dependendcies"} ${missingDependencies
          .map((dep) => bold(brightRed(dep)))
          .join(", ")} of ${bold(brightYellow(this.config.name))}`,
      );

      logger.info(`skip ${bold(brightYellow(this.config.name))} and continue loading...`);

      return false;
    }

    for (const dependency of this.dependencies) {
      const module = cache.get(dependency);

      if (!module) {
        // if that happens then I do not know any more lg Newt
        logger.error("you somehow fucked your system, congrats!");

        return false;
      }

      if (!module.loaded) {
        if (!(await module.depend(cache, stack))) {
          logger.error(`module ${bold(brightYellow(dependency))} could not be loaded`);

          return false;
        }

        try {
          await module.load();
          logger.info(`module ${bold(brightYellow(module.config.name))} loaded`);
          stack.delete(module.config.name);
        } catch (e) {
          logger.error(e);
          return false;
        }
      }
    }
    return true;
  }
  async reload(cache: Map<string, Module>): Promise<boolean> {
    if (this.loaded) {
      try {
        await this.unload();
        logger.info(`unloaded ${bold(brightYellow(this.config.name))}`);
      } catch (e) {
        logger.error(e);
        return false;
      }
    }
    if (!this.depend(cache, new Set<string>())) return false;
    try {
      await this.load();
      logger.info(`reloaded ${bold(brightYellow(this.config.name))}`);
      return true;
    } catch (e) {
      logger.error(e);
      return false;
    }
  }

  activate() {}

  deactivate() {}

  route(route: (context: Context) => void) {}
}
