# Effect Pack: fade-up-reveal

Reveal modules or child layers with a short deterministic opacity and upward-motion entrance.

## Purpose

- What this effect adds: a clean fade from `opacity: 0` to `1` with a small upward motion, usually 6-10px.
- When to use it: downstream cards, right-side result groups, counters, rows, media tiles, and supporting panels that appear after a workflow trigger.
- When to avoid it: elements whose Figma source is visible in the initial state, elements already moved by a template-level transform, or text that should type character by character.

## Required Inputs

- Target elements or groups.
- Start time, duration, and optional per-target stagger.
- Direction and distance, defaulting to `translateY(8px)`.
- Easing, defaulting to `ease-out` or a template-defined timeline easing.

## Application Rules

- Keep final geometry equal to the approved static Figma layout. The final keyframe must have `opacity: 1` and no residual reveal transform.
- If the target already uses a template-level transform for layout movement, apply fade-up to an inner wrapper so transforms do not overwrite each other.
- Use deterministic CSS animations, Web Animations with fixed offsets, or generated keyframes. Do not depend on scroll position, intersection observers, random delays, or wall-clock callbacks.
- Use `animation-fill-mode: both` or equivalent so seeking/capturing any timestamp is deterministic.
- Keep reveal distance small; this is a professional UI reveal, not a large entrance transition.

## Pseudocode

```text
for each target:
  at t < start: opacity = 0, transform = translateY(distance)
  from start to start + duration:
    interpolate opacity to 1
    interpolate transform to translateY(0)
  after start + duration:
    opacity = 1, transform = none
```

## Conflict Notes

- Conflicts to declare in `catalog.json`: instant or hard-cut reveal effects.
- Safe combinations: `staggered-module-reveal`, `cursor-send`, `click-ring-pulse`, and `typewriter`.

## Acceptance Checks

- Targets end exactly at their approved Figma-restored positions.
- No template-level transform is accidentally replaced.
- Frame capture is deterministic at every timestamp.
