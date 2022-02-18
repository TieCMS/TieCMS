import { ReactDOMServer, React, Router } from "../../deps.ts";
import { sendEta } from "../helpers/send_eta.ts";
import ModuleLoader from "../modules/loader.ts";
import { Context } from "../types/context.ts";
import App from "../frontend/app/App.tsx";
import { render } from "../frontend/app/index.tsx";

export const router = new Router();
router.get("/", (context: Context) => {
  //ModuleLoader.cache.get("BugTracker")?.reload(ModuleLoader.cache);
  render(context,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

});

export default router;
