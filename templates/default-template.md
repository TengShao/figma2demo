# Template: default-template

Use this template for management-ready product demos that show an agent-style workspace receiving a user request, attaching context files, consulting knowledge or services, and revealing analysis modules in a staged sequence.

## Applies To

- Product screens with a central composer or conversation area.
- Sidebars or panels that represent uploaded files, knowledge bases, search results, services, or analysis output.
- Demos where the audience should understand cause and effect between the user's request and the appearing modules.

## Required Inputs

- Figma design URL.
- `demoName`.
- The module that starts the animation.
- The modules that must appear together.
- The user prompt or task text, if the screen includes a composer.
- Which files, knowledge sections, service modules, or analysis panels are simulated rather than already visible.

## Visual Restoration Rules

- Rebuild the screen as a fixed 1920x1080 stage unless the user requests another size.
- Present that fixed stage through a browser preview shell that scales it to fit the current viewport without cropping or horizontal scrolling; do not let the raw 1920px-wide stage define the preview page width.
- Keep preview scaling separate from export sizing so MP4 capture remains exactly 1920x1080 unless the user requests another resolution.
- Preserve Figma layer positions and real assets.
- Before coding icon-bearing areas, inventory every navigation icon, toolbar icon, connector mark, chart glyph, and logo-like vector layer; export each visible instance node from Figma into `assets/` as a complete node whenever possible.
- Track icon provenance in `output/<demo-slug>/icon-provenance.json`: page location, actual Figma instance node id, exported asset path, export format, whole-node status, and fallback reason if any.
- Track complex-region layer provenance in `output/<demo-slug>/layer-provenance.json` for cards, thumbnails, pills, chips, list rows, media previews, and right-side modules. Include child node ids, bounds, opacity, blend/mask/clipping state, fill/overlay role, z-order, and implementation selector or asset path.
- Export exact icon, logo, and vector-mark layers from Figma as assets, preferably whole-node SVG, and reference them from the demo-local `assets/` folder. Do not substitute similar-looking icon library icons, recreate icons with CSS, or manually reassemble child vectors.
- Preserve each exported icon's original viewBox, intrinsic size, aspect ratio, rendered bounds, inset, fills, strokes, masks, nested groups, and transforms; do not shrink, stretch, rotate, flip, or path-normalize a Figma icon into another hand-chosen geometry.
- Do not use a same-named component asset from another Figma instance; instance-specific color, direction, scale, flip, inset, and overrides must come from the actual visible node.
- Do not use global icon/arrow transforms or shared component fixes that alter all same-named instances. Instance-specific transforms, colors, insets, and orientation must be encoded in the exported asset or an instance-scoped selector tied to provenance.
- Explicitly implement Figma overlay fills, opacity layers, masks, clipping groups, and blend layers; preserve their stacking order instead of flattening a complex thumbnail or card to only the largest visible image and foreground text.
- If any icon-like layer cannot be exported, stop for user direction instead of drawing an approximate placeholder.
- If the design uses a font that is not available locally and cannot be bundled, convert the affected Figma text to vector outlines. If that text must be animated as live text, ask the user whether to provide the font, accept a fallback, or keep the exact outline without typewriter animation.
- Keep labels, database names, service names, pills, and short menu rows on one line unless the Figma source wraps them.
- Right-side or downstream modules that are meant to be revealed by the workflow should be hidden in the initial animation state, even if they exist in the static replica for fidelity review.

## Animation Scheme

Start from the module named by the user. If the flow starts in a composer, type or reveal the prompt, perform the send action, then begin downstream module motion.

| phase | module | motion | linked modules | pause after |
| --- | --- | --- | --- | --- |
| request | composer or start module | type/reveal, then send or activate | user bubble, file chips | short confirmation hold |
| context | uploaded files or left knowledge sections | staggered fade/slide | matching file chips | brief reading pause |
| retrieval | search, database, or best-practice panel | reveal with count/result state | named database/source indicator | result hold |
| service | service result or external analysis panel | reveal after retrieval | named service indicator | short processing pause |
| synthesis | central or right analysis module | type/reveal generated answer and final panels | supporting evidence modules | final management hold |

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

- Use `typewriter` when generated answers or long user-visible generated text should appear character by character.
- Use `cursor-send` when the demo shows the user typing, clicking send, or activating the composer.
- Avoid applying typewriter behavior to rows, menu items, pills, or file chips that should appear as complete objects.

## Export Defaults

- Duration: 12 seconds.
- Resolution: 1920x1080.
- FPS: 24.
- Format: MP4.

## Acceptance Checks

- Visual restoration matches the source Figma before animation begins.
- `scripts/check_icon_fidelity.js` passes against the HTML and `icon-provenance.json` before the visual gate.
- `scripts/check_layer_provenance.js` passes against `layer-provenance.json` before the visual gate, and the file accounts for all overlay, mask, opacity, fill, blend, and z-order layers in complex regions.
- All icon-like layers come from exported Figma assets, preferably whole-node SVG, rather than CSS approximations or hand-reassembled child vectors.
- No visible navigation icon, toolbar icon, connector mark, chart glyph, or logo-like vector layer is replaced by a hand-coded CSS shape or approximate library icon.
- No global selector change for a shared icon/component is accepted until every affected instance has a focused crop review.
- Directional icons preserve Figma orientation, scale, visual inset, stroke/weight, and rendered bounds; their paths are not simply stretched to fill the target container.
- Any unavailable special font is bundled or represented by vector outlines.
- Browser preview shows the whole fixed stage fitted inside the viewport, while export frames remain at the requested resolution.
- The start module, linked modules, and downstream modules follow the requested cause-and-effect order.
- No right-side or downstream module appears before its trigger.
- The final hold is clean and management-ready.
