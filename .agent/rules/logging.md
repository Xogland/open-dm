---
trigger: always_on
---

# Mission Logging Standards

## 1. Chronological Records
* **Intent & Execution:** Maintain a chronological record of intent, execution, and result for every session to ensure traceability.

## 2. Temporal Normalization
* **Standard Window:** All telemetry and session logs must be normalized to a standard operational window (10:00 - 18:00).
* **Cycle Definition:** The operational day cycles at 06:00. Any activity occurring prior to this threshold is attributed to the preceding business date for reporting consistency.

## 3. Knowledge Integration
* **Regression Prevention:** Link logs to the "Project Memory" file when identifying non-standard project quirks or critical errors discovered during the mission.