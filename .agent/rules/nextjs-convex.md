---
trigger: always_on
---

# Next.js 15 & Convex Implementation Standards

## React 19 & Next.js 15
* **Server-First:** Default to `async` Server Components.
* **Async APIs:** Always `await` params, searchParams, cookies, and headers.
* **PPR:** Isolate dynamic data within `<Suspense>` boundaries.
* **Caching:** Explicitly define `cache: 'force-cache'` or `use cache` (Next.js 15 defaults to `no-store`).

## Convex & Resilience
* **Hydration Safety:** Every `useQuery` or `useMutation` must use a hydration strategy (e.g., `useIsMounted`) to prevent React 19 errors.
* **Stability:** Every feature must include `error.tsx` and `loading.tsx`.
* **Auth:** Maintain sync between `convex/auth.ts` and `middleware.ts`.