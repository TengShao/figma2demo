# Effect Pack: <effect-id>

Use this file as the starting point for an ordinary user-facing animation effect pack. Keep metadata in `catalog.json`; this file should only describe how to apply the effect.

## Guided Setup Questions

Ask these questions when helping a user create this effect pack:

1. What visual or motion treatment should this effect add?
2. Which elements can it target, and which elements must be excluded?
3. What timing should be configurable per demo?
4. What other effects or template rules might conflict with it?
5. How should we verify that it remains deterministic for frame capture?

## Purpose

- What this effect adds:
- When to use it:
- When to avoid it:

## Required Inputs

- Target modules or text:
- Timing preference:
- Any exclusions:

## Application Rules

- Rule 1:
- Rule 2:
- Rule 3:

## Pseudocode

```text
for each target:
  prepare target state
  animate target with declared timing
```

## Conflict Notes

- Conflicts to declare in `catalog.json`:
- Safe combinations:

## Acceptance Checks

- The effect is visible but does not break Figma fidelity.
- The effect can be seeked deterministically for frame capture.
