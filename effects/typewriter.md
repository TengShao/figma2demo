# Effect Pack: typewriter

Reveal selected user-visible generated text character by character. Use this only when the user asks for typewriter behavior or when the selected template recommends generated content appearing progressively.

## Required Inputs

- Target text blocks.
- Start time for each block.
- Character or word pacing.
- Exclusions: rows, menu items, pills, file chips, database labels, service names, and any no-wrap labels.

## Application Rules

- Wrap only target text in per-character spans or another deterministic character-level structure.
- Animate opacity, width, or a stable mask in character order.
- Do not use a vertical sweep reveal for text that should type character by character.
- Preserve original line breaks and no-wrap constraints from Figma.
- Keep timing controlled by named variables or a timeline table so user feedback can be patched precisely.

## Pseudocode

```text
for each typewriter target:
  split text into stable character spans
  set every character hidden at t0
  for character index i:
    reveal at target.start + i * target.characterDelay
```

## Acceptance Checks

- Text appears character by character, not as a block sweep.
- Non-target UI labels still appear with their container.
- Seeking to any timestamp produces the same visible characters.
