import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { users } from "./user";
import { forms } from "./form";
import {
  organisationMembers,
  organisations,
} from "./organisation";
import { submissions } from "./submission";
import { connections } from "./connection";
import { attachments } from "./attachment";
import { subscriptions } from "./subscriptions";
import { teamInvites } from "./teamInvite";


const referrals = defineTable({
  user: v.id("users"),
  referrer: v.id("users"),
  referralCode: v.string(),
  referralCount: v.number(),
});
const reservedHandles = defineTable({
  handle: v.string(),
  type: v.string(), // "default" | "official"
}).index("by_handle", ["handle"]);

const redemptionKeys = defineTable({
  key: v.string(),
  type: v.string(), // "master" | "standard"
}).index("by_key", ["key"]);

const acquiredHandles = defineTable({
  handle: v.string(),
  keyUsed: v.string(),
  orgId: v.id("organisations"),
  userId: v.id("users"),
  acquiredAt: v.number(),
}).index("by_handle", ["handle"]);

const preregistered = defineTable({
  user: v.id("users"),
});

const dailyMetrics = defineTable({
  organisationId: v.id("organisations"),
  date: v.string(), // YYYY-MM-DD
  views: v.number(),
  submissions: v.number(),
}).index("by_org_date", ["organisationId", "date"]);

export default defineSchema({
  ...authTables,
  users,
  organisations,
  organisationMembers,
  forms,
  referrals,
  preregistered,
  submissions,
  connections,
  attachments,
  subscriptions,
  teamInvites,
  reservedHandles,
  redemptionKeys,
  acquiredHandles,
});
