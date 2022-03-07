import Module from "../classes/module.ts";
import { walkSync } from "https://deno.land/std@0.122.0/fs/walk.ts";
import { logger } from "../utils/mod.ts";
import { bold, brightYellow } from "../../deps.ts";
import Config from "../classes/types/config.ts";
import Metadata, { Permission } from "../classes/types/config.ts";
import Validation from "../classes/types/validation.ts";

export default class ModuleLoader {
  static readonly cache: Map<string, Module> = new Map();
  static async load(): Promise<Map<string, Module>> {
    for (const entry of walkSync("./src/modules", {
      includeFiles: false,
      maxDepth: 1,
    })) {
      if (entry.name === "modules") continue;
<<<<<<< Updated upstream
      const module: Module = new (
        await import(`./${entry.name}/mod.ts`)
      ).default(`./src/modules/${entry.name}`);
      logger.info(this.validateConfig(module.config));
=======
      const module: Module = new (await import(`./${entry.name}/mod.ts`)).default(`./src/modules/${entry.name}`);
      //logger.info(this.validateConfig(module.config));
>>>>>>> Stashed changes
      if (!ModuleLoader.validateConfig(module.config)) {
        logger.error(
          `module ${
            bold(brightYellow(module.config.name)) ||
            bold(brightYellow("undefined"))
          } could not be loaded`
        );

        continue;
      }
      this.cache.set(module.config.name, module);
    }

    for (const module of this.cache.values()) {
      if (module.loaded) continue;

      if (!(await module.depend(this.cache, new Set<string>()))) {
        logger.error(
          `module ${bold(brightYellow(module.config.name))} could not be loaded`
        );

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
<<<<<<< Updated upstream
    if (
      config.name === undefined ||
      typeof config.name !== "string" ||
      config.name === ""
    ) {
      logger.error("typeof name must be a string");
      return false;
    }

    if (
      config.version === undefined ||
      typeof config.version !== "string" ||
      config.version === ""
    ) {
      logger.error("typeof version must be a string");
      return false;
    }

    if (
      config.authors === undefined ||
      typeof config.authors !== "object" ||
      !Array.isArray(config.authors)
    ) {
      logger.error("typeof authors must be a object array");
      return false;
    }
=======
    return this.validateConfigs(config, [
      {
        key: "name",
        type: "string",
        isArray: false,
        required: true,
        defaultValue: "ModuleName",
      },
      {
        key: "version",
        type: "string",
        isArray: false,
        required: true,
        defaultValue: "1.0.0",
      },
      {
        key: "authors",
        type: "string",
        isArray: true,
        required: false,
        defaultValue: "TieCMS",
      },
      {
        key: "website",
        type: "string",
        isArray: false,
        required: false,
        defaultValue: "tiecms.dev",
      },
      {
        key: "description",
        type: "string",
        isArray: false,
        required: false,
        defaultValue: "Default Module Description",
      },
      {
        key: "permissions",
        type: "object",
        isArray: true,
        required: false,
        nested: {
          key: "[permission]",
          type: "object",
          isArray: false,
          required: false,
          nested: [
            {
              key: "description",
              type: "string",
              isArray: false,
              required: false,
            },
            {
              key: "default",
              type: "string",
              isArray: false,
              required: false,
            },
          ],
        },
      },
      {
        key: "dependencies",
        type: "string",
        isArray: true,
        required: false,
        defaultValue: "tiecms.dev",
      },
    ]);
  }

  static validateConfigs(configs: Config, validations: Validation[]) {
    //logger.info(configs);
    for (const validation of validations) {
      const { key, required, type, defaultValue, isArray, nested } = validation;

      const config = configs[key as keyof Config];
>>>>>>> Stashed changes

      //if (key === "permissions") continue;

      if (required && config === undefined) {
        logger.error(`config.${key} is required!`);
        return false;
      }

<<<<<<< Updated upstream
    if (config.permissions !== undefined) {
      if (
        typeof config.permissions !== "object" ||
        !Array.isArray(config.permissions)
      ) {
        logger.error("typeof permissions must be a object array");
        return false;
      }
=======
      if (config !== undefined) {
        if (isArray) {
          if (!Array.isArray(config)) {
            logger.error(`config.${key} must be a ${type} array`);
            return false;
          }
        }
>>>>>>> Stashed changes

        if (typeof config !== (isArray ? "object" : type)) {
          logger.error(`typeof config.${key} must be a ${isArray ? type : `${type} array`}`);
          return false;
        }

<<<<<<< Updated upstream
        if (
          permission[Object.keys(permission)[0]] !== undefined &&
          permission[Object.keys(permission)[0]] !== null
        ) {
          if (typeof permission[Object.keys(permission)[0]] !== "object") {
            logger.error(
              `typeof ${Object.keys(permission)[0]} must be a object`
            );
            return false;
          }

          if (permission[Object.keys(permission)[0]])
            if (
              permission[Object.keys(permission)[0]].description !== undefined
            ) {
              if (
                typeof permission[Object.keys(permission)[0]].description !==
                  "string" ||
                permission[Object.keys(permission)[0]].description === ""
              ) {
                logger.error(
                  `typeof ${
                    Object.keys(permission)[0]
                  }.description must be a string`
                );
                return false;
              }
            }

          if (permission[Object.keys(permission)[0]].default !== undefined) {
            if (
              typeof permission[Object.keys(permission)[0]].default !==
              "boolean"
            ) {
              logger.error(
                `typeof ${Object.keys(permission)[0]}.default must be a boolean`
              );
=======
        if (isArray && Array.isArray(config)) {
          for (const value of config) {
            if (typeof value !== type) {
              logger.error(`typeof config.${key} must be a ${type} array`);
              return false;
            }
          }

          if (nested !== undefined) {
            if (!Array.isArray(nested)) {
              if (/^\[\w+\]$/.test(nested.key)) {
                //config.permissions
                for (const data of config) {
                  logger.info("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2");
                  logger.info(config[data]);
                  //this.validateConfigs()
                }
              } else {
                /* if(config[nested.key as Object.keys(permission)])
                this.validateConfigs((configs as Permission)[nested.key as keyof Permission], nested); */
              }
            }

            /*             for (const idk of config) {
              logger.info("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
              logger.info(idk);
            } */
            //if(config[nested as Record<string, Permission>])
          }

          //! permissions atm hardcoded!
          for (const permission of configs.permissions!) {
            if (permission === undefined || typeof permission !== "object") {
              logger.error("typeof permission must be a object");
>>>>>>> Stashed changes
              return false;
            }

<<<<<<< Updated upstream
    if (config.dependencies !== undefined) {
      if (
        typeof config.dependencies !== "object" ||
        !Array.isArray(config.dependencies)
      ) {
        logger.error("typeof authors must be a object array");
        return false;
      }

      for (const dependencie of config.dependencies) {
        if (
          dependencie === undefined ||
          typeof dependencie !== "string" ||
          dependencie === ""
        ) {
          logger.error("typeof dependencie must be a string");
          return false;
=======
            if (
              permission[Object.keys(permission)[0]] !== undefined &&
              permission[Object.keys(permission)[0]] !== null
            ) {
              if (typeof permission[Object.keys(permission)[0]] !== "object") {
                logger.error(`typeof config.permissions.${Object.keys(permission)[0]} must be a object`);
                return false;
              }

              if (permission[Object.keys(permission)[0]])
                if (permission[Object.keys(permission)[0]].description !== undefined) {
                  if (
                    typeof permission[Object.keys(permission)[0]].description !== "string" ||
                    permission[Object.keys(permission)[0]].description === ""
                  ) {
                    logger.error(
                      `typeof config.permissions.${Object.keys(permission)[0]}.description must be a string`,
                    );
                    return false;
                  }
                }

              if (permission[Object.keys(permission)[0]].default !== undefined) {
                if (typeof permission[Object.keys(permission)[0]].default !== "boolean") {
                  logger.error(`typeof config.permissions.${Object.keys(permission)[0]}.default must be a boolean`);
                  return false;
                }
              }
            }
          }
>>>>>>> Stashed changes
        }
      }
    }

    return true;
  }

  /*   static validateConfig2(...validations: Validation[]): false | Metadata {
    const config: Partial<Metadata> = {};
    for (const validation of validations) {
      logger.info();
      const { entry, key, required, type, defaultValue, isArray } = validation;
      logger.info(validation);
      if (key === "name") {
        if (config[key] === undefined || typeof config.name !== "string" || config.name === "") {
          logger.error("typeof name must be a string");
          return false;
        }
      }
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

interface Test {
  a: boolean;
  b: string;
}

/**
 * @overload
 */
interface Test {
  a: false;
  b: "HAHA";
}

await ModuleLoader.load();
//await ModuleLoader.reload();
