import { Context } from "../types/mod.ts";
export async function timingMiddleware(
  ctx: Context,
  next: () => Promise<unknown>
) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
}
