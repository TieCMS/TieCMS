import { bold, brightRed, brightYellow, brightBlue } from "../../deps.ts";
import { logger } from "../utils/mod.ts";
import Metadata from "./types/metadata.ts";
import { parse } from "https://deno.land/std@0.123.0/encoding/yaml.ts";

export default abstract class Module {
  metadata: Metadata;
  constructor(path: string) {
    this.metadata = parse(
      new TextDecoder("utf-8").decode(Deno.readFileSync(`${path}/config.yml`))
    ) as Metadata;
  }

  public readonly dependencies: string[] = [];

  public loaded = false;

  public readonly requiredIn: string[] = [];

  abstract load(): Promise<void> | void;
  abstract unload(): Promise<void> | void;
  public async depend(
    cache: Map<string, Module>,
    stack: Set<string>
  ): Promise<boolean> {
    if (stack.has(this.metadata.name)) {
      logger.error(
        `detected loop in ${[...stack.values(), this.metadata.name]
          .map((mod) =>
            bold((mod === this.metadata.name ? brightBlue : brightYellow)(mod))
          )
          .join(bold(brightRed(" -> ")))}`
      );
      return false;
    }
    stack.add(this.metadata.name);
    const missingDependencies = this.dependencies.filter(
      (dependency: string) => !cache.get(dependency)
    );
    if (missingDependencies.length > 0) {
      logger.error(
        `cannot find ${
          missingDependencies.length === 1 ? "dependency" : "dependendcies"
        } ${missingDependencies
          .map((dep) => bold(brightRed(dep)))
          .join(", ")} of ${bold(brightYellow(this.metadata.name))}`
      );

      logger.info(
        `skip ${bold(brightYellow(this.metadata.name))} and continue loading...`
      );

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
          logger.error(
            `module ${bold(brightYellow(dependency))} could not be loaded`
          );

          return false;
        }

        try {
          await module.load();
          logger.info(
            `module ${bold(brightYellow(module.metadata.name))} loaded`
          );
          stack.delete(module.metadata.name);
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
        logger.info(`unloaded ${bold(brightYellow(this.metadata.name))}`);
      } catch (e) {
        logger.error(e);
        return false;
      }
    }
    if (!this.depend(cache, new Set<string>())) return false;
    try {
      await this.load();
      logger.info(`reloaded ${bold(brightYellow(this.metadata.name))}`);
      return true;
    } catch (e) {
      logger.error(e);
      return false;
    }
  }

  activate() {}

  deactivate() {}
}
