import { httpErrors } from "../../deps.ts";
import { Context } from "../types/mod.ts";

const rateLimits = new Map<string, { requests: number; startedAt: number }>();

// TODO: Erroring requests limits
// TODO: 50 requests per second
/**
 * Easy rate limit management
 * Global ratelimit of 50/s applies if this middleware is being used (NOT YET IMPLEMENTED)
 * @param timeout After the first request has been made how long to wait until reset (seconds)
 * @param maxRequests How many requests are allowed to be send after the first request in timeout time until rate limit
 * @param bucket If this path shares a rate limit bucket
 *
 * Note: The rate limits are per IP
 */
export function ratelimit(
  timeout: number,
  maxRequests: number,
  options?: { bucket?: string }
) {
  return async function (context: Context, next: () => Promise<unknown>) {
    const id = `${context.request.ip}-${
      options?.bucket ?? context.request.url.pathname
    }`;
    const rateLimit = rateLimits.get(id);

    const now = Date.now();

    // TODO: better way of setting headers
    context.response.headers.set("X-Rate-Limit-Limit", maxRequests.toString());
    context.response.headers.set(
      "X-Rate-Limit-Remaining",
      (maxRequests - (rateLimit?.requests ?? 1) < 0
        ? 0
        : maxRequests - (rateLimit?.requests ?? 1)
      ).toString()
    );
    context.response.headers.set(
      "X-Rate-Limit-Reset",
      (((rateLimit?.startedAt ?? now) + timeout * 1000 - now) / 1000).toString()
    );

    // The user has already made a request to this path so increment the rate limit
    if (rateLimit) {
      if (rateLimit.requests > maxRequests)
        throw new httpErrors.TooManyRequests("You are being rate limited");

      rateLimits.set(id, {
        requests: rateLimit.requests + 1,
        startedAt: rateLimit.startedAt,
      });
    } else {
      // TODO: maybe don't use setTimeout as they can be bad on large scale?
      // The user has never made a request to this bucket before or the rate limit has run out
      setTimeout(() => {
        rateLimits.delete(id);
      }, timeout * 1000);

      rateLimits.set(id, {
        // Using 2 here so the headers can be calculated correctly
        requests: 2,
        startedAt: now,
      });
    }

    return await next();
  };
}
