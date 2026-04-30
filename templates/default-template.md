# Template: default-template

Use this template for management-ready product demos that show an agent-style workspace receiving a user request, attaching context files, consulting knowledge or services, and revealing analysis modules in a staged sequence.

## Applies To

- Product screens with a central composer or conversation area.
- Sidebars or panels that represent uploaded files, knowledge bases, search results, services, or analysis output.
- Demos where the audience should understand cause and effect between the user's request and the appearing modules.

## Required Inputs

- Figma design URL.
- `demoName`.
- The user prompt or task text, if the screen includes a composer.
- Which files, knowledge sections, service modules, or analysis panels are simulated rather than already visible.

Collect the animation start module and linked modules only after the static visual restoration is approved. Before asking, infer a recommended flow from the approved HTML structure, provenance files, Figma layer names, and visible relationships among composer, file chips, databases, services, and result cards.

## Visual Restoration Rules

- Rebuild the screen as a fixed 1920x1080 stage unless the user requests another size.
- Present that fixed stage through a browser preview shell that scales it to fit the current viewport without cropping or horizontal scrolling; do not let the raw 1920px-wide stage define the preview page width.
- Keep preview scaling separate from export sizing so MP4 capture remains exactly 1920x1080 unless the user requests another resolution.
- Preserve Figma layer positions and real assets.
- Follow Static Fidelity Enforcement from `SKILL.md` before visual approval.
- For this template, the icon provenance inventory must include navigation icons, toolbar icons, connector marks, chart glyphs, arrows, and logo-like vector layers.
- The layer provenance inventory must include cards, thumbnails, pills, chips, list rows, media previews, and right-side modules.
- The layout provenance inventory must include headings, counters, pills, chips, badges, buttons, composer controls, list rows, auto-layout groups, and text-plus-icon/control pairs.
- If the design uses a font that is not available locally and cannot be bundled, convert the affected Figma text to vector outlines. If that text must be animated as live text, ask the user whether to provide the font, accept a fallback, or keep the exact outline without typewriter animation.
- Keep labels, database names, service names, pills, and short menu rows on one line unless the Figma source wraps them.
- Right-side or downstream modules that are meant to be revealed by the workflow should be hidden in the initial animation state, even if they exist in the static replica for fidelity review.

## Animation Scheme

After visual approval, recommend an animation start module and linked-module groups before asking the user to confirm. If the flow starts in a composer, type or reveal the prompt, perform the send action, then begin downstream module motion.

| phase | module | motion | linked modules | pause after |
| --- | --- | --- | --- | --- |
| request | composer or start module | type/reveal, then send or activate | user bubble, file chips | short confirmation hold |
| context | uploaded files or left knowledge sections | staggered fade/slide | matching file chips | brief reading pause |
| retrieval | search, database, or best-practice panel | reveal with count/result state | named database/source indicator | result hold |
| service | service result or external analysis panel | reveal after retrieval | named service indicator | short processing pause |
| synthesis | central or right analysis module | type/reveal generated answer and final panels | supporting evidence modules | final management hold |

## Default Motion Grammar

Use this motion grammar when the approved static screen contains a central workspace/composer and downstream left or right modules that should appear as a consequence of the request.

- Build the animation around named stage groups, not unrelated per-card animations: `workspaceGroup`, `composerGroup`, `leftContextGroup`, `rightResultGroup`, and optional `moduleChrome`.
- If the right or downstream result area is hidden at the start, keep the active workspace visually centered by translating the workspace background, main content, and composer together. Compute the offset from the final Figma layout so the centered start state still preserves internal layer geometry.
- Keep static navigation rails, global chrome, and unrelated frame background anchored unless the Figma design implies they are part of the moving workspace.
- After the send or activation beat, hold briefly, then animate the grouped workspace from the centered start offset back to its Figma-final position while revealing downstream modules. The old UGC-agent reference used this pattern: workspace and composer held at `translateX(274px)` until about 42% of a 13s timeline, then returned to `translateX(0)` by about 49%.
- Reveal the right result group at the same trigger as the workspace return, using a short fade plus 6-10px upward motion. Do not show right-side result cards before this trigger unless they are already part of the initial Figma state and the user approves it.
- Reveal left context modules as subparts, not a single block: section background first, then title or expander, then document row, then file chip. Stagger sibling sections by roughly 120-300ms so the source gathering reads as active work.
- Use one shared timeline table or CSS variable block for major beats such as `sendAt`, `contextAt`, `workspaceShiftAt`, `rightRevealAt`, `retrievalAt`, `serviceAt`, and `synthesisAt`. Per-element classes may consume those times, but the source of timing should be patchable in one place.
- Keep the final frame equal to the approved Figma-restored layout: all moved groups end at the exact static coordinates, with no residual transform drift.

## Special Logic

- File chips that simulate uploads should appear after the first sent request and align visually with that user action.
- If the center workspace begins focused, keep it centered at first. After the trigger is sent, move it to its final position and reveal downstream analysis or search areas.
- Hide downstream modules until their trigger occurs.
- Coordinate linked modules by timing rather than proximity alone. Examples:
  - A knowledge-base source indicator appears with the related search result, best-practice panel, or evidence count.
  - A service connector appears with the related service result or analysis panel.
  - Left sidebar knowledge sections appear in sync with corresponding uploaded file chips.
- If the user says one module appears only after another finishes, include an actual delay after the preceding animation completes.

## Effect Pack Guidance

- This template's default effects are `typewriter`, `cursor-send`, `fade-up-reveal`, `staggered-module-reveal`, and `click-ring-pulse`. Load them automatically from `catalog.json` unless the user explicitly disables one for the run.
- Use `fade-up-reveal` for downstream module shells, right-side result groups, count labels, media tiles, and document rows that enter after the workflow trigger.
- Use `staggered-module-reveal` when a card, sidebar section, or result module should appear as active work rather than as one block.
- Use `typewriter` when generated answers or long user-visible generated text should appear character by character.
- Use `cursor-send` when the demo shows the user typing, clicking send, or activating the composer.
- Use `click-ring-pulse` with `cursor-send` when the cursor activates a send button or primary action.
- Avoid applying typewriter behavior to rows, menu items, pills, or file chips that should appear as complete objects.

## Export Defaults

- Duration: 12 seconds.
- Resolution: 1920x1080.
- FPS: 24.
- Format: MP4.

## Acceptance Checks

- Visual restoration matches the source Figma before animation begins.
- Static fidelity is proven with provenance artifacts, passing checks, and required focused crops before visual approval is requested.
- Spacing-sensitive text groups do not rely on generic clipping and do not move or overlap sibling icons, controls, counters, or chevrons.
- Any unavailable special font is bundled or represented by vector outlines.
- Browser preview shows the whole fixed stage fitted inside the viewport, while export frames remain at the requested resolution.
- The start module, linked modules, and downstream modules follow the requested cause-and-effect order.
- No right-side or downstream module appears before its trigger.
- The final hold is clean and management-ready.
