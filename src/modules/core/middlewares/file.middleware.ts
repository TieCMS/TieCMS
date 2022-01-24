import { send } from "../../../../deps.ts";
import { Context } from "../../../types/mod.ts";

export async function fileMiddleware(context: Context) {
  // FAVICON IS SOO COOL SO IT GETS ITS OWN SPECIAL PATH
  if (/^\/favicon.(png|ico)$/.test(context.request.url.pathname)) {
    return await send(context, "/images/favicon.png", { root: "./src/frontend/public" });
  }

  // NON ETA FILES SHOULD NOT BE RENDERED
  if (/\.(css|js|png|jpg|ico|woff2|woff|ttf|wasm|svg|map)$/.test(context.request.url.pathname)) {
    return await send(context, context.request.url.pathname, { root: "./src/frontend/public" });
  }
}
