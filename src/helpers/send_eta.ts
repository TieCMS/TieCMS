import { CallbackFn, renderFile } from "../../deps.ts";
import { Context } from "../types/mod.ts";
import { configs } from "../../configs.ts";

export async function sendEta(
  context: Context,
  fileName: string,
  // deno-lint-ignore no-explicit-any
  data?: { settings?: { [key: string]: any }; [key: string]: any },
  cb?: CallbackFn
) {
  try {
    const mode = context.request.url.pathname.split("/")[1];
    const rendered = await renderFile(
      `index.html`,
      data ?? {},
      {
        views: "./src/frontend/build/",
        cache: configs.general.env !== "dev" ? true : false,
        //parse: { raw: "-" },
      },
      cb
    );
    if (!rendered) {
      context.response.status = 404;
      return (context.response.body = {
        status: 404,
        message: `cannot ${context.request.method} ${context.request.url.pathname}`,
      });
    }

    context.response.body = rendered;
    context.response.type = "text/html";
  } catch (error) {
    if (error.message.startsWith("Could not find the template")) {
      context.response.status = 404;
      return (context.response.body = {
        status: 404,
        message: `cannot ${context.request.method} ${context.request.url.pathname}`,
      });
    }

    throw error;
  }
}
