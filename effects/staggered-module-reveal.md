# Effect Pack: staggered-module-reveal

Reveal a module's internal layers in semantic order so the module reads as active work rather than a single block appearing at once.

## Purpose

- What this effect adds: ordered reveals for module parts such as shell, icon, title, count, rows, chips, media, labels, and supporting text.
- When to use it: sidebars, knowledge sections, result cards, media grids, search result lists, evidence modules, and service panels.
- When to avoid it: tiny controls, static navigation, already-visible chrome, or dense content where stagger would distract from the main flow.

## Required Inputs

- Module target and child targets.
- Semantic child order, preferably from Figma layer order and role names.
- Base start time, child gap, and per-child duration.
- Whether children use `fade-up-reveal` or a simpler opacity-only reveal.

## Application Rules

- Preserve Figma stacking order. Stagger timing may change when layers become visible, but must not reorder z-index or DOM paint order in a way that changes the final image.
- Use semantic order by default:
  `shell/background -> icon/title/controls -> count/status -> primary rows/media -> chips/badges -> secondary rows`.
- For left context sections, prefer:
  `section background -> title/expander -> document row -> file chip`.
- For result cards, prefer:
  `card shell -> header icon/title -> count/status -> media tiles or rows -> labels`.
- Keep gaps short, usually 120-300ms. Long stagger chains should be reserved for lists or grids where the sequence is meant to be noticed.
- Do not stagger typewriter characters, menu labels, file names inside chips, or no-wrap labels as separate child reveals.

## Pseudocode

```text
for each module:
  orderedChildren = semantic children from provenance/Figma layer roles
  for child index i:
    child.start = module.start + i * childGap
    apply fade-up-reveal or opacity reveal to child
```

## Conflict Notes

- Conflicts to declare in `catalog.json`: effects that reveal the whole module instantly or as a single block.
- Safe combinations: `fade-up-reveal` for each child and `timeline-linked-reveal` style template scheduling.

## Acceptance Checks

- Final module appearance matches the static Figma restoration.
- The sequence is readable but does not feel slow.
- Child reveal order matches module semantics and does not hide required context after dependent content appears.
