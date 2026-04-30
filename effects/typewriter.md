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
- Support explicit per-target timing attributes such as `data-typewriter`, `data-delay`, and `data-step`, or an equivalent timeline data structure.
- If a text node lives inside a parent with an animation delay, the typewriter start may inherit that delay plus a small offset. Explicit per-target delay always wins.
- Add a ready state only after text has been split into deterministic character spans, so unprocessed full text does not flash before the first frame.
- Exclude UI rows, menu items, pills, file chips, database labels, service names, no-wrap labels, and document rows unless the user explicitly wants those labels typed.
- Preserve text frame bounds from Figma. Character wrapping may follow the browser's normal text layout only inside the approved fixed text frame.
- For generated answer blocks, allow different character steps per paragraph so short bridging lines and long answer paragraphs can be paced independently.

## Pseudocode

```text
for each typewriter target:
  split text into stable character spans
  set every character hidden at t0
  for character index i:
    reveal at target.start + i * target.characterDelay
  mark target ready after span construction
```

## Acceptance Checks

- Text appears character by character, not as a block sweep.
- Non-target UI labels still appear with their container.
- Seeking to any timestamp produces the same visible characters.
- Text does not flash fully rendered before the first animation frame.
- Excluded chips, labels, rows, and menu items remain complete objects.
