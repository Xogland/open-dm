---
trigger: always_on
---

# Nuance Logging & Observability

## Mission Logs
Before filesystem modification, initialize `.logs/missions/[TIMESTAMP]-[SLUG]/`:
1. `01_INTENT_AND_NUANCE.md`: Context and boundary decisions.
2. `02_RESEARCH_TRACE.md`: Dependency scans and codebase audits.
3. `03_EXECUTION_HEARTBEAT.json`: Sequential tool-call audit trail.
4. `04_VALIDATION_REPORT.md`: Browser traces and A11y audits.
5. `05_INTERACTION_MANIFEST.md`: Chronological log of user prompts and outcomes.

## Knowledge Management
* **Post-Mortems:** If a build fails, generate `06_POST_MORTEM.md` before retrying.
* **Project Memory:** Append project-specific findings to `.agent/knowledge/project-memory.md` upon mission completion.