# Intent & Nuance - Fix Service Question Visibility

## Context

The user reports that the "service question" is not visible in the message item component. This likely refers to a specific field or type in the form renderer.

## Boundary Decisions

- Focus on `src/features/form-renderer/components/message-box/message-item.tsx`.
- Investigate the data flow from Convex/JSON config to this component.
- Ensure all question types, including any related to "service", are handled correctly.
