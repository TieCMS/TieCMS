import { ReactDOMServer } from "../../../deps.ts";
import { Context } from "../../types/mod.ts";

export function render(context: Context, body: any) {
  try {
    context.response.body = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body >
                <div id="root">${body}</div>
            </body>
            </html>`;
  } catch (error) {
    console.error(error);
  }
}
