import { defineTable } from "convex/server";
import { v } from "convex/values";

export const spam = defineTable({
  email: v.string(),
  organisation: v.id("organisations"),
  lastReportedAt: v.number(),
  reportCount: v.number(),
});