import { Router } from "../../deps.ts";
import { sendEta } from "../helpers/send_eta.ts";
import ModuleLoader from "../modules/loader.ts";
import { Context } from "../types/context.ts";

export const router = new Router();
router.get("/", async (context: Context) => {
  ModuleLoader.cache.get("BugTracker")?.reload(ModuleLoader.cache);
  return await sendEta(context, "");
});

export default router;
