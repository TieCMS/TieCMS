import { Context, Router } from "../../core/mod.ts";

export const router = new Router({ prefix: "/setup" })
    .get("/", (context: Context) => {
        context.response.body = "Test";
    })

export default router;
