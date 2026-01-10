/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as attachment from "../attachment.js";
import type * as auth from "../auth.js";
import type * as connection from "../connection.js";
import type * as dashboard from "../dashboard.js";
import type * as form from "../form.js";
import type * as http from "../http.js";
import type * as maintenance from "../maintenance.js";
import type * as organisation from "../organisation.js";
import type * as planLimitConfig from "../planLimitConfig.js";
import type * as preregistration from "../preregistration.js";
import type * as reserved_handles from "../reserved_handles.js";
import type * as spam from "../spam.js";
import type * as submission from "../submission.js";
import type * as subscription from "../subscription.js";
import type * as subscriptions from "../subscriptions.js";
import type * as teamInvite from "../teamInvite.js";
import type * as user from "../user.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  attachment: typeof attachment;
  auth: typeof auth;
  connection: typeof connection;
  dashboard: typeof dashboard;
  form: typeof form;
  http: typeof http;
  maintenance: typeof maintenance;
  organisation: typeof organisation;
  planLimitConfig: typeof planLimitConfig;
  preregistration: typeof preregistration;
  reserved_handles: typeof reserved_handles;
  spam: typeof spam;
  submission: typeof submission;
  subscription: typeof subscription;
  subscriptions: typeof subscriptions;
  teamInvite: typeof teamInvite;
  user: typeof user;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
