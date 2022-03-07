import { Router } from "./deps.ts";
import { walk } from "https://deno.land/std@0.99.0/fs/walk.ts";
import { formatTime, logger } from "./src/utils/mod.ts";
import ModuleLoader from "./src/modules/loader.ts";

const start = Date.now();
logger.info("Starting to Register all Routes");

export const router = new Router();

const walkEntries = walk("./src/routes", { includeDirs: false });

for await (const walkEntry of walkEntries) {
  const start = Date.now();
  const im = await import(`./${walkEntry.path}`);
  router.use(im.default.routes());
  logger.info(`Register Route ${walkEntry.name} || ${formatTime(Date.now() - start)}`);
}

ModuleLoader.cache.forEach((module) => {
  if (module.config.router === undefined) return;
  router.use(module.router.routes());
});

logger.info(`All Routes Registerd || ${formatTime(Date.now() - start)}`);
