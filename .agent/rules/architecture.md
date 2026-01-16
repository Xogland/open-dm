---
trigger: always_on
---

# Architecture & Structural Integrity

## Clean Architecture Mandate
* **Source Isolation:** All application logic must reside in `src/`.
* **Migration Policy:** Upon initialization, any root-level # Architecture & Structural Integrity

## Clean Architecture Mandate
* **Source Isolation:** All application logic must reside in `src/`.
* **Migration Policy:** Upon initialization, any root-level directories (`app/`, `lib/`, `hooks/`, etc.) must be migrated into `src/`.
* **Directory Isolation:**
    * `src/components/ui/`: Logic-free primitive components.
    * `src/components/shared/`: Global layout and cross-feature components.
    * `src/features/[feature]/`: Domain-specific logic, including hooks, schemas, and types.
    * `backend/` or `convex/`: Single source of truth for server-side structures.

## Design Principles
* **SOLID Compliance:** Strictly adhere to SOLID principles.
* **Decoupling:** Business logic must remain independent of low-level implementation details (framework-specific APIs).
* **Anti-Guesstimation:** Always run `ls -R src/` to verify paths; never assume a file exists.directories (`app/`, `lib/`, `hooks/`, etc.) must be migrated into `src/`.
* **Directory Isolation:**
    * `src/components/ui/`: Logic-free primitive components.
    * `src/components/shared/`: Global layout and cross-feature components.
    * `src/features/[feature]/`: Domain-specific logic, including hooks, schemas, and types.
    * `backend/` or `convex/`: Single source of truth for server-side structures.

## Design Principles
* **SOLID Compliance:** Strictly adhere to SOLID principles.
* **Decoupling:** Business logic must remain independent of low-level implementation details (framework-specific APIs).
* **Anti-Guesstimation:** Always run `ls -R src/` to verify paths; never assume a file exists.