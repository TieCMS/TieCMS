import Module from "../classes/module.ts";
import { walkSync } from "https://deno.land/std@0.122.0/fs/walk.ts";
import { logger } from "../utils/mod.ts";
import { bold, brightYellow } from "../../deps.ts";
import Config from "../classes/types/config.ts";
import Metadata, { Permission } from "../classes/types/metadata.ts";

export default class ModuleLoader {
  static readonly cache: Map<string, Module> = new Map();
  static async load(): Promise<Map<string, Module>> {
    for (const entry of walkSync("./src/modules", { includeFiles: false, maxDepth: 1 })) {
      if (entry.name === "modules") continue;
      const module: Module = new (await import(`./${entry.name}/mod.ts`)).default(`./src/modules/${entry.name}`);
      logger.info(module.metadata);
      this.cache.set(module.metadata.name, module);
    }

    for (const module of this.cache.values()) {
      if (module.loaded) continue;

      if (!(await module.depend(this.cache, new Set<string>()))) {
        logger.error(`module ${bold(brightYellow(module.metadata.name))} could not be loaded`);

        continue;
      }

      try {
        await module.load();
        logger.info(`module ${bold(brightYellow(module.metadata.name))} loaded`);
        module.loaded = true;
      } catch (e) {
        logger.error(e);
        continue;
      }
    }

    return this.cache;
  }

  static async reload() {
    for (const module of this.cache.values()) {
      if (!module.loaded) continue;
      module.reload(this.cache);
    }
    await this.load();
  }

  static validateMetadata(...configs: Config[]): false | Metadata {
    const metadata: Partial<Metadata> = {};
    for (const config of configs) {
      const { entry, key, required, type, defaultValue, isArray } = config;
      if (key === "permissions") {
        for (const permission of entry as Record<string, Permission>) {
        }
        continue;
      }
      if (isArray) {
        if (!Array.isArray(entry)) {
          logger.error("entry must be an Array");

          return false;
        }
      } else {
        if (required && typeof entry !== type) {
          logger.error(`${key} is expected to be ${type} but recived ${typeof entry}`);

          return false;
        }
        metadata[key] = typeof entry === "string" ? entry : defaultValue ?? null;
      }
    }

    return metadata as Metadata;
  }
}

await ModuleLoader.load();
//await ModuleLoader.reload();
