# Research Trace - Fix Service Question Visibility

## Codebase Audit

- `src/features/form-renderer/components/message-box/message-item.tsx`: Found `ServiceSelectionMessage` component was accepting `question` as a prop but not rendering it.
- `src/lib/message-types.ts`: Verified `ServiceSelectionMessage` interface includes `question: string`.
- `src/features/form-renderer/components/chat-form-view.tsx`: Verified the initial message of type `service_selection` includes the question "Hey, How can I help you?".

## Findings

- All other question types in `message-item.tsx` either use `SystemMessageBubble` or render the `question` prop.
- `ServiceSelectionMessage` was only rendering the buttons, leaving the question invisible.

## Fix

- Updated `ServiceSelectionMessage` to render the question using `SystemMessageBubble` for consistency with other question types.
