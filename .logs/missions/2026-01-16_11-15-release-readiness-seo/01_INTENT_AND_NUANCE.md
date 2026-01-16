# Intent & Nuance - Release Readiness & SEO

## Context

The application is nearing release. The user wants to:

1. Verify release readiness.
2. Add `sitemap.xml` and `robots.txt` based on the current app structure.
3. Handle release stages (Preregistration vs Live) based on `src/constants/platform.ts`.
4. Add a custom `not-found` page.

## Boundary Decisions

- **SEO Strategy**: Use dynamic `sitemap.ts` and `robots.ts` to adapt to the platform status.
- **Preregistration Logic**: If in `PREREGISTRATION` mode, certain routes might be hidden or should redirect to a landing page.
- **Visuals**: The `not-found` page must be high-end, matching the "premium" aesthetic mentioned in the user rules.

## Research Notes

- `CURRENT_PLATFORM_STATUS` is currently set to `LIVE` in `src/constants/platform.ts` (contrary to user's mention of preregistration first, I should probably respect the constant but make it dynamic).
- Next.js 15 requires awaiting params/searchParams. I should check root layout for SEO metadata.
