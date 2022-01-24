import { helpers, httpErrors } from "../../../deps.ts";
import { Context } from "../../types/mod.ts";
import { PermissionStrings } from "../../constants/permissions.ts";
import { logger, validatePermissions } from "../../utils/mod.ts";
import { Groups } from "../../database/cache/groups.ts";

/**
 * Has user permission middleware
 * checks authorization for context user and user permissions if provided
 */
export function userGuard(types: string[], ...permissions: PermissionStrings[]) {
  const typesSet = new Set(types);
  //TODO anpassen!
  return async function (context: Context, next: () => Promise<unknown>) {
    const tokenType = context.state.tokenType;

    if (!tokenType || !typesSet.has(tokenType)) throw new httpErrors.Unauthorized("Unauthorized");
    //typeset = ["Client", "Application"]
    //typesSet.has("Client")
    if (tokenType === "Client") {
      if (!context.state.user) {
        throw new httpErrors.Unauthorized("Unauthorized");
      }

      const perms =
        context.state.user.permissions |
        context.state.user.groups.reduce((calculated, group) => calculated | (Groups.get(group) ?? 0n), 0n);

      // If permissions specified, then check logged in users permissions
      if (permissions && !validatePermissions(perms, permissions, tokenType)) {
        throw new httpErrors.Forbidden("Missing Access");
      }

      return await next();
    }

    if (tokenType === "Application") {
      //do stuff
    }

    if (tokenType === "Bearer") {
      //do stuff
      const scopes = context.state.bearer?.scopes;
      /**
       * token: {
       * scopes: {
       * user.read
       * user.write
       * }
       * }
       */
    }

    throw new httpErrors.BadRequest("Invalid access token provided");
  };
}
