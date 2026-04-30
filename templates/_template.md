# Template: <template-id>

Use this file as the starting point for a complete demo scheme. Keep metadata in `catalog.json`; this file should only describe how to make the demo.

## Guided Setup Questions

Ask these questions when helping a user create this template:

1. What kind of Figma designs should this template apply to?
2. What must be preserved visually for this design family?
3. What starts the demo, and what modules should react together?
4. What animation phases should the audience understand?
5. Which optional effect packs should pair well with this template?
6. Are there special logic, timing, or export rules that should become parameters?

## Applies To

- Design family:
- Typical audience:
- Expected source screens:

## Required Inputs

- Figma design URL
- `demoName`
- Animation starting module
- Linked modules that must appear or react together
- Template-specific questions:

## Visual Restoration Rules

- Stage size:
- Layout fidelity priorities:
- Asset handling: export exact Figma icons, logos, vector marks, images, masks, and other artwork into the demo-local `assets/` folder; do not recreate icon-like layers with CSS.
- Typography and wrapping rules: match Figma typography exactly; if a required font is not available locally and cannot be bundled, convert the affected text to vector outlines.
- Outline exceptions: note any text that must stay live for typing or dynamic animation and how to resolve missing fonts for it.

## Animation Scheme

Describe the preferred timeline as rules, not one-off code.

| phase | module | motion | linked modules | pause after |
| --- | --- | --- | --- | --- |
| 1 |  |  |  |  |

## Special Logic

Use rules or pseudocode for behavior that should be implemented in the concrete HTML demo.

```text
when <trigger>:
  show <module>
  synchronize <linked-module>
```

## Effect Pack Guidance

- Recommended optional effects:
- Effects to avoid:
- Notes for combining effects:

## Export Defaults

- Duration:
- Resolution:
- FPS:
- Format:

## Acceptance Checks

- Visual checks: verify 1:1 Figma restoration, exported icon assets, special-font handling, spacing, colors, borders, shadows, masks, and wrapping.
- Animation checks:
- Export checks:
