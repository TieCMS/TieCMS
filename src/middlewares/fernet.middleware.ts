import { setTokens } from "../helpers/mod.ts";
import db from "../database/database.ts";
import * as fernet from "../constants/token.ts";
import {
  isUserPayload,
  Application,
  Bearer,
  Context,
  User,
} from "../types/mod.ts";
import { logger } from "../utils/mod.ts";
import { httpErrors } from "../../deps.ts";
import { webClient } from "../database/connection.ts";

const textDecoder = new TextDecoder();

/** Cache for sessions, mapped by sessionId, valid */
export const cachedSessions = new Map<string, boolean>();

async function validSession(
  sessionId: string,
  userId: bigint
): Promise<boolean> {
  if (cachedSessions.has(sessionId)) return cachedSessions.get(sessionId)!;

  const valid = await db
    .execute(
      db
        .query()
        .table("sessions")
        .select("sessionId")
        .where(
          db.where.and(
            db.where.field("sessionId").eq(sessionId),
            db.where.field("userId").eq(userId)
          )
        ),
      webClient
    )
    .then((res) => Boolean(res.length));

  /*   const valid = await db
    .select(db.count(db.sessions.sessionId))
    .from(db.sessions)
    .where(db.sessions.sessionId.eq(sessionId).and(db.sessions.userId.eq(userId)))
    .then((res) => Boolean(res[0]?.count)); */

  cachedSessions.set(sessionId, valid);
  return valid;
}

export async function fernetMiddleware(
  context: Context,
  next: () => Promise<unknown>
) {
  //const authorization = context.request.headers.get('Authorization');

  const accessToken =
    (await context.cookies.get("token")) ||
    context.request.headers.get("Authorization");
  // If an accessToken has been found decode it
  if (accessToken) {
    // TODO: check access token type - da wirds wichtig was fürn token du gibst entweder user oder application
    // If token type is application throw error if token is invalid
    const [type, token] = accessToken.split(" ");

    if (type !== "Client" && type !== "Application" && type !== "Bearer")
      throw new httpErrors.Unauthorized("Invalid Access Token Provided");

    // Somehow the stored token is invalid so error
    if (!token)
      throw new httpErrors.Unauthorized("Invalid Access Token Provided");

    // Get the payload of the accessToken
    const payload: User | Application | Bearer = JSON.parse(
      textDecoder.decode(fernet.Client.decode(token))
    );

    // If a payload has been returned this means the accessToken is still valid so just continue
    if (!payload)
      throw new httpErrors.Unauthorized("Invalid Access Token Provided");

    if (isUserPayload(type, payload)) {
      if (
        !payload?.sessionId ||
        !(await validSession(payload.sessionId, BigInt(payload.id)))
      ) {
        context.cookies.delete("token");
        throw new httpErrors.Unauthorized("Invalid Access Token Provided");
      }

      if (payload.expires <= Date.now()) {
        await db.execute(
          db
            .query()
            .delete("sessions")
            .where(db.where.eq("sessionId", payload.sessionId)),
          webClient
        );
        cachedSessions.delete(payload.sessionId);
        context.cookies.delete("token");
        throw new httpErrors.Unauthorized("Invalid Access Token Provided");
      }

      if (Date.now() >= payload.expires - 86400000) {
        setTokens(payload, context);
      }
      context.state.user = {
        ...payload,
        id: BigInt(payload.id),
        permissions: BigInt(payload.permissions),
      };
      context.state.tokenType = type;
      return await next();
    }

    if (type === "Application") {
      //do stuff
      return await next();
    }

    if (type === "Bearer") {
      //do stuff
      return await next();
    }

    throw new httpErrors.BadRequest("Invalid Access Token Provided");
  }

  return await next();
}

type JsonUser = ToStringObject<User>;
// Convert bigint props of interface to string type
// deno-lint-ignore ban-types
type ToStringObject<T extends {}> = {
  [K in keyof T]: T[K] extends bigint ? string : T[K];
};
