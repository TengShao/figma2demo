# Effect Pack: click-ring-pulse

Show an expanding ring and optional button pulse at a cursor click or activation point.

## Purpose

- What this effect adds: visible click feedback for send buttons, primary actions, toggles, or activation controls.
- When to use it: paired with `cursor-send` or any action where the audience must understand the trigger.
- When to avoid it: passive reveals, background processing, or controls that are not visibly activated by a cursor.

## Required Inputs

- Activation target bounds or explicit click coordinates.
- Click time.
- Ring color, defaulting to the product accent or a subtle blue.
- Optional target highlight duration.

## Application Rules

- Position the ring from the target's Figma-restored bounds or the cursor click point. Do not hand-place the ring if target geometry is available.
- The ring should start slightly smaller than the control, expand outward, and fade to `opacity: 0`.
- Keep the ring above the target but below the cursor unless the target design requires otherwise.
- Coordinate with `cursor-send`: the ring begins at the click beat, while the cursor remains visible briefly and then fades.
- Button highlight should be brief and should return to the Figma-final state unless the design includes an active state.
- Use deterministic animation timing with fill mode, not runtime event listeners.

## Pseudocode

```text
at clickTime:
  ring.opacity = 1
  ring.scale = 1
from clickTime to clickTime + pulseDuration:
  ring.scale -> 2.0-2.2
  ring.opacity -> 0
if targetHighlight:
  target background/border enters active state briefly, then returns
```

## Conflict Notes

- Conflicts to declare in `catalog.json`: no-click-feedback and static cursor effects.
- Safe combinations: `cursor-send`, `fade-up-reveal`, and `typewriter`.

## Acceptance Checks

- The click feedback is visible at normal playback speed.
- The target returns to its expected final visual state.
- The ring location matches the actual activation target.
