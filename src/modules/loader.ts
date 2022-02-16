import Module from "../classes/module.ts";
import { walkSync } from "https://deno.land/std@0.122.0/fs/walk.ts";
import { logger } from "../utils/mod.ts";
import { bold, brightYellow } from "../../deps.ts";
import Config from "../classes/types/config.ts";
import Metadata, { Permission } from "../classes/types/config.ts";

export default class ModuleLoader {
  static readonly cache: Map<string, Module> = new Map();
  static async load(): Promise<Map<string, Module>> {
    for (const entry of walkSync("./src/modules", {
      includeFiles: false,
      maxDepth: 1,
    })) {
      if (entry.name === "modules") continue;
      const module: Module = new (await import(`./${entry.name}/mod.ts`)).default(`./src/modules/${entry.name}`);
      logger.info(this.validateConfig(module.config));
      if (!ModuleLoader.validateConfig(module.config)) {
        logger.error(
          `module ${bold(brightYellow(module.config.name)) || bold(brightYellow("undefined"))} could not be loaded`,
        );

        continue;
      }
      this.cache.set(module.config.name, module);
    }

    for (const module of this.cache.values()) {
      if (module.loaded) continue;

      if (!(await module.depend(this.cache, new Set<string>()))) {
        logger.error(`module ${bold(brightYellow(module.config.name))} could not be loaded`);

        continue;
      }

      try {
        await module.load();
        logger.info(`module ${bold(brightYellow(module.config.name))} loaded`);
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

  static validateConfig(config: Config) {
    if (config.name === undefined || typeof config.name !== "string" || config.name === "") {
      logger.error("typeof name must be a string");
      return false;
    }

    if (config.version === undefined || typeof config.version !== "string" || config.version === "") {
      logger.error("typeof version must be a string");
      return false;
    }

    if (config.authors === undefined || typeof config.authors !== "object" || !Array.isArray(config.authors)) {
      logger.error("typeof authors must be a object array");
      return false;
    }

    for (const author of config.authors) {
      if (author === undefined || typeof author !== "string" || author === "") {
        logger.error("typeof author must be a string");
        return false;
      }
    }

    if (config.website !== undefined) {
      if (typeof config.website !== "string" || config.website === "") {
        logger.error("typeof website must be a string");
        return false;
      }
    }

    if (config.description !== undefined) {
      if (typeof config.description !== "string" || config.description === "") {
        logger.error("typeof description must be a string");
        return false;
      }
    }

    if (config.permissions !== undefined) {
      if (typeof config.permissions !== "object" || !Array.isArray(config.permissions)) {
        logger.error("typeof permissions must be a object array");
        return false;
      }

      for (const permission of config.permissions) {
        if (permission === undefined || typeof permission !== "object") {
          logger.error("typeof permission must be a object");
          return false;
        }

        if (permission[Object.keys(permission)[0]] !== undefined && permission[Object.keys(permission)[0]] !== null) {
          if (typeof permission[Object.keys(permission)[0]] !== "object") {
            logger.error(`typeof ${Object.keys(permission)[0]} must be a object`);
            return false;
          }

          if (permission[Object.keys(permission)[0]])
            if (permission[Object.keys(permission)[0]].description !== undefined) {
              if (
                typeof permission[Object.keys(permission)[0]].description !== "string" ||
                permission[Object.keys(permission)[0]].description === ""
              ) {
                logger.error(`typeof ${Object.keys(permission)[0]}.description must be a string`);
                return false;
              }
            }

          if (permission[Object.keys(permission)[0]].default !== undefined) {
            if (typeof permission[Object.keys(permission)[0]].default !== "boolean") {
              logger.error(`typeof ${Object.keys(permission)[0]}.default must be a boolean`);
              return false;
            }
          }
        }
      }
    }

    if (config.dependencies !== undefined) {
      if (typeof config.dependencies !== "object" || !Array.isArray(config.dependencies)) {
        logger.error("typeof authors must be a object array");
        return false;
      }

      for (const dependencie of config.dependencies) {
        if (dependencie === undefined || typeof dependencie !== "string" || dependencie === "") {
          logger.error("typeof dependencie must be a string");
          return false;
        }
      }
    }

    return true;
  }

  /*   static validateMetadata(...configs: Config[]): false | Metadata {
    const config: Partial<Metadata> = {};
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
        config[key] = typeof entry === "string" ? entry : defaultValue ?? null;
      }
    }

    return config as Metadata;
  } */
}

await ModuleLoader.load();
//await ModuleLoader.reload();
