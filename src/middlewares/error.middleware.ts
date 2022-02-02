import { isHttpError, Status } from "../../deps.ts";
import { Context } from "../types/mod.ts";
import { configs } from "../../configs.ts";
import { logger } from "../utils/mod.ts";

export async function errorMiddleware(
  context: Context,
  next: () => Promise<unknown>
) {
  try {
    await next();
  } catch (err) {
    let message = err.message;
    const status = err.status || err.statusCode || Status.InternalServerError;

    /**
     * considering all unhandled errors as internal server error,
     * do not want to share internal server errors to
     * end user in non "development" mode
     */
    if (!isHttpError(err)) {
      message =
        configs.general.env === "dev" || configs.general.env === "development"
          ? message
          : "Internal Server Error";
    }

    if (
      configs.general.env === "dev" ||
      configs.general.env === "development"
    ) {
      logger.error(err);
    }

    context.response.status = status;
    context.response.body = { status, message };
  }
}
