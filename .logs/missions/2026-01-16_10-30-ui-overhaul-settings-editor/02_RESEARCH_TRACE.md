# Research Trace: Settings & Editor UI/UX

## Project Audit

- **Tech Stack**: Next.js 15, Convex, Shadcn UI, Tailwind CSS.
- **Current Settings**: Basic grids in `PageShell`. Little use of internal navigation within settings.
- **Current Editor**: Large `chat-flow-editor.tsx` file managing complex state. Properties panel is a simple vertical list.
- **Payment Implementation**: Basic `amount`, `currency`, `description`. Stripe keys are checked but the UI is a simple warning.

## Competitive/Industry Analysis

- **Intercom/Typeform Settings**: Usually use a left-hand navigation to separate "General", "People", "Billing", "Developer" stuff.
- **Editor UX**: Tools like Framer or Webflow use a thick properties panel with collapsible sections and visual representations (sliders, color pickers, etc.).
- **Payment UX**: Stripe's own dashboard uses clean dividers, centered layouts, and clear "Status" badges.

## Design Inspiration Components

- **Sidebar**: Collapsible or fixed width, using icons + text labels.
- **Cards**: Soft shadows (`shadow-sm` or `shadow-md`), rounded corners (`rounded-2xl`).
- **Typography**: `Typography` component from `@/components/ui/typography`.
- **Animations**: `AnimatePresence` and `motion.div` from Framer Motion.

## Proposed "Payment Type" Options

- **Fixed**: A single charge amount.
- **Dynamic (Selection)**: The amount depends on the selected option from a previous multiple-choice step.
- **User-Defined**: (Donation/Variable) - if allowed by business logic.
