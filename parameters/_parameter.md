# Parameter: <parameter-id>

Use this file as the starting point for template-only behavior. Ordinary users should not need to choose parameters during a demo run. Keep metadata in `catalog.json`.

## Guided Setup Questions

Ask these questions when helping a user create this parameter:

1. Is this special behavior logic, timing, or export related?
2. Which templates should load it silently?
3. What exact repeatable rule should it enforce?
4. What behavior would conflict with it?
5. How should a finished demo prove the parameter worked?

## Type

Choose one catalog type:

- `logic`: special workflow or state rules.
- `timing`: rhythm, pauses, sequencing, or synchronization rules.
- `export`: output defaults or capture/encoding constraints.

## Purpose

- What this parameter controls:
- Which templates should load it:

## Rules

- Rule 1:
- Rule 2:
- Rule 3:

## Pseudocode

```text
when <condition>:
  apply <advanced behavior>
```

## Conflict Notes

- Conflicts to declare in `catalog.json`:
- Safe combinations:

## Acceptance Checks

- The parameter improves repeatability for its template family.
- It does not introduce ordinary user-facing choices unless explicitly requested.
