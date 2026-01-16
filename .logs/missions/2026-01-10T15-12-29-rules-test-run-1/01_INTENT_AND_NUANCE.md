# Mission: Rules Test Run #1

## Intent
Demonstrate compliance with the Lead Autonomy Architect Protocol. This includes initializing the mission log, migrating the project to a `src/` directory structure, and ensuring type-safety and architectural integrity.

## Nuance & Boundary Decisions
- **Migration Strategy**: Move `app`, `components`, `features`, `hooks`, `lib`, `providers`, `types`, `wrappers` to `src/`. 
- **Convex Root**: `convex/` remains at the root as the "single source of truth for backend structures and functions".
- **Environment**: Validate environment variables if any are found/required during the test run.
- **Verification**: Use `npm run build` or similar to verify the migration doesn't break the build (though `next.config.ts` might need adjustments for the new `src` layout, although Next.js usually handles `src/` automatically).

## Implicit Constraints
- Must follow SOLID principles.
- No `any` types.
- Strict directory isolation.
