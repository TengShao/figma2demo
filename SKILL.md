---
name: figma2demo
description: Convert Figma designs into faithful reviewed HTML demos and MP4 videos using user-selected templates, optional effect packs, reusable parameters, staged animation review, and deterministic frame export.
---

# Figma2Demo

Use this skill to turn a Figma design into a faithful animated HTML demo and export it as an MP4. The core workflow is generic: read Figma first, rebuild the screen in HTML, confirm visual fidelity, apply the selected template and optional effect packs, confirm animation, then export video.

Templates define repeatable demo schemes for a family of designs. Effect packs are ordinary-user options for reusable animation treatments. Parameters are template-maintenance files for special logic, rhythm, or export rules; do not surface parameters in the ordinary run flow unless the user asks to maintain templates.

This skill has two modes:

- **Demo production mode**: create an HTML/MP4 demo from a Figma design.
- **Library maintenance mode**: add, modify, or remove reusable templates, effect packs, or parameters.

## Dependency Check

Demo production mode requires a working Figma MCP connection. Do this check before rebuilding or animating anything:

1. Confirm that Figma MCP tools are available in the current agent environment.
2. After the user provides a Figma URL, extract the file key and node id, then make a minimal Figma MCP read call to confirm the file and node are accessible.
3. Confirm that the MCP response includes enough layer data, design context, screenshot data, or export URLs to support 1:1 restoration and asset export.
4. If the Figma MCP is missing, disconnected, unauthorized, or unable to read the requested file/node, stop and tell the user exactly what dependency failed. Ask them to enable/connect Figma MCP, grant file access, or provide a reachable Figma URL.
5. Do not proceed from screenshots or manual visual guesses unless the user explicitly asks to bypass the Figma MCP dependency and accepts that the result is no longer guaranteed 1:1.

Library maintenance mode does not require Figma MCP unless the user asks to validate a template, effect, or parameter against a live Figma design.

## Non-Negotiable Fidelity Rules

- Restore the Figma design 1:1. Layer position, size, typography, colors, borders, radii, shadows, opacity, blur, images, masks, and interaction states are all source-of-truth details.
- Icons and logo-like vector marks must be exported from Figma as real vector assets, preferably whole-node SVG, and referenced from the demo-local `assets/` folder. Do not recreate icons with CSS boxes, pseudo-elements, emoji, icon fonts, approximate icon libraries, or manually reassembled child vectors.
- If a design uses a special font that is not available locally and cannot be bundled for the demo, convert the affected text to vector outlines from Figma and use those outlines for visual fidelity.
- If outlined text would conflict with requested editable or typewriter text, stop and ask the user whether to provide the font file, accept a fallback font, or keep the exact outline without text animation.
- Do not simplify detailed Figma artwork into CSS approximations unless the user explicitly approves that tradeoff.

## Icon And Vector Asset Gate

Before writing or previewing the static HTML, make an asset inventory for every icon-like layer, logo, vector mark, chart glyph, and custom illustration visible in the target Figma node:

- Record the Figma layer name or id, intended local asset path, export format, and where it appears in the demo.
- Export or download each listed item as a complete Figma node whenever possible, preferably SVG, into the demo-local `assets/` folder before using it in HTML/CSS.
- Preserve the exported node's viewBox, intrinsic size, aspect ratio, rendered bounds, inset, and internal transforms. Do not squeeze a 24px source icon into a different hand-chosen geometry such as 20px unless the Figma source itself does so.
- Do not normalize an SVG path to fill its container or rebuild the icon from the path bounding box; Figma component transforms such as inset, scaleX, rotation, masks, and nested groups are part of the source artwork.
- If whole-node export is unavailable but child vectors are available, only combine them when the original Figma geometry can be preserved exactly, including viewBox, dimensions, rendered bounds, fills, strokes, masks, nested groups, and transforms. Otherwise stop and tell the user which Figma layer is blocked.
- Do not substitute CSS, emoji, icon fonts, lucide icons, approximate library icons, or manually reassembled child vectors unless the user explicitly accepts a non-1:1 fallback for that specific layer.
- Use CSS only for layout, masks, sizing, opacity, and animation of exported assets; do not draw the source icon shape with borders, pseudo-elements, gradients, or hand-coded SVG.
- During visual review, compare icon identity as part of fidelity, not just position and size.

## Start By Asking

If the user asks to add, modify, improve, rename, remove, or review a template, effect pack, or parameter, enter **Library maintenance mode** instead of demo production mode.

For demo production mode, run the Figma MCP dependency check and collect these required inputs before implementation:

1. Figma design URL.
2. `demoName`: the user-facing demo name.
3. Main template id.
4. Which module starts the animation.
5. Which modules must appear or react together.

If the user has not specified duration, resolution, or output format, use template defaults when present, otherwise assume 10-15 seconds, 1920x1080, 24 fps, MP4.

## Template And Effect Selection

Read `catalog.json` before choosing a template or effect pack.

- If the user did not specify a template id, show the available `templates[]` entries from `catalog.json` and stop for selection.
- After a template is selected, read the template file listed in `catalog.json`.
- Silently load any parameters listed by the template's catalog entry. Parameters are not ordinary user-facing choices.
- If the user asks for effect packs, read only the selected files from `effects[]`.
- If the user asks what effect packs are available, show the `effects[]` entries from `catalog.json`.
- Do not auto-enable effect packs when the user has not selected them.

Use `touchedAreas` and `conflictsWith` from `catalog.json` to detect conflicts among the template, selected effects, and loaded parameters. If any selected items conflict, stop and ask the user to decide for this run. Do not write that decision back to the template library unless explicitly asked.

## Library Maintenance Mode

When the user asks to add, modify, improve, rename, remove, or review reusable templates, effect packs, or parameters, read `references/maintenance.md` and follow its guided flow. Make maintenance feel guided, not file-centric.

## Naming And Output Paths

Use the original `demoName` as the readable HTML title and demo label. Also derive a filesystem-safe slug from it:

- lowercase
- replace non-alphanumeric runs with `-`
- trim leading and trailing `-`
- if the result is empty, ask the user for a different `demoName`

Use the slug to isolate generated artifacts:

```text
output/<demo-slug>/
  <demo-slug>.html
  <demo-slug>.mp4
  assets/
scratch/<demo-slug>/
  capture_html_frames.js
  encode_frames.swift
  encode_frames_ffmpeg.js
  frames/
```

## HTML Preview Contract

Every generated demo HTML must separate the export stage from the browser preview shell:

- Keep the real demo stage at the requested or template-defined export size, defaulting to 1920x1080.
- Wrap the fixed stage in a preview shell that scales the stage down to fit the current browser viewport without cropping or horizontal scrolling.
- Compute the preview scale from both viewport width and height, preserve aspect ratio, and center the stage.
- Do not use CSS zoom as the only scaling mechanism; use a standards-compatible transform or equivalent layout that works in browser previews.
- Keep MP4 capture deterministic by capturing the unscaled stage at the requested export resolution. Preview-only scaling must not change export frame dimensions.
- When opening the visual or animated HTML preview, verify that the whole stage is visible in the available browser viewport and that the page does not appear as a raw 1920px-wide canvas.

## Mandatory Flow Control

This workflow has three required user-confirmation gates. Do not skip them, even if the user asks for the final MP4 in the first message, unless the user explicitly says to bypass review checkpoints.

1. **Visual fidelity gate**
   - After reading Figma and generating the static HTML replica, show or open the HTML preview for the user.
   - Confirm that all icon-like layers and vector marks are real exported assets from the Figma source, not approximations.
   - Ask the user to confirm whether the visual restoration is accurate enough.
   - If the user gives visual corrections, patch the HTML/CSS/assets and preview again.
   - Do not start animation work until the user confirms the visual restoration.

2. **Animation gate**
   - After the user confirms the visual stage, implement the template-driven animation timeline and selected effect packs.
   - Preview the animated HTML for the user.
   - Ask the user to confirm whether timing, linkage, cursor behavior, text effects, and rhythm are acceptable.
   - If the user gives animation corrections, patch the timeline and preview again.
   - Do not export the MP4 until the user confirms the animation.

3. **MP4 export gate**
   - After animation approval and before MP4 export, check whether this conversation introduced reusable special requirements that could improve the current template or become a new template.
   - If reusable requirements exist, ask whether the user wants to update the current template, create a new template, or keep the requirements only for this demo. If they choose to persist changes, read `references/maintenance.md`.
   - Only after this persistence check is resolved, capture and encode the final MP4.
   - Verify video metadata and report the output path.

## Workflow

1. **Read Figma before coding**
   - Extract the Figma file key and node id from the URL.
   - Use Figma MCP tools to get metadata, design context, screenshots, and asset URLs.
   - Treat failed MCP access as a blocker for 1:1 restoration unless the user explicitly approves a non-Figma fallback.
   - Treat Figma layer positions, sizes, text, colors, borders, radii, shadows, and image assets as the source of truth.
   - Complete the Icon And Vector Asset Gate. Export or download the exact icons, logos, vector marks, bitmap assets, and outlined special-font text from Figma. Do not replace them with CSS approximations or approximate icon-library icons.

2. **Rebuild a 1:1 static HTML stage**
   - Use the requested or template-defined stage size, defaulting to 1920x1080.
   - Implement the HTML preview shell from the HTML Preview Contract before the first preview.
   - Use absolute positioning when fidelity matters more than responsiveness.
   - Match Figma typography, text weights, line heights, colors, borders, spacing, corner radii, and shadows.
   - Use exported vector assets for icon-like layers; never draw them with CSS for convenience.
   - Keep assets in the demo-local `assets/` folder and reference them directly.
   - Build the actual interface as the first screen. Do not add marketing copy, extra slogans, or explanatory UI unless requested.

3. **Preview and confirm visual fidelity**
   - Show the static HTML preview before adding animation.
   - Confirm the preview viewport fits the full fixed stage without cropping, browser-level horizontal scroll, or raw 1920px overflow.
   - Confirm that every visible icon-like layer matches the Figma source asset; icon mismatches are fidelity failures, not acceptable approximations.
   - For directional or transformed icons, verify orientation, stroke/weight, visual inset, and rendered bounds against Figma; do not accept icons that only have the right general shape.
   - Invite visual diff comments only at this gate: text typos, icon mismatches, wrapping, alignment, colors, spacing, radius, shadows, missing assets, or layout scale.
   - Address visual comments precisely and preview again.
   - Stop and wait for explicit user confirmation before continuing to animation.

4. **Define the animation timeline**
   - Follow the selected template and loaded parameters.
   - Apply selected effect packs only where they fit the user's requested module flow and the Figma design.
   - Make a small timing table before heavy animation work:
     - `time`: when the event starts
     - `module`: the UI element or group
     - `motion`: typewriter, fade, slide, panel move, cursor click, etc.
     - `linked_to`: any module that must appear in sync
     - `pause_after`: intentional hold before the next event
   - Start from the module named by the user.
   - Use named CSS classes or CSS variables for timing, so user feedback can be patched precisely.

5. **Preview and confirm animation before video export**
   - Show the animated HTML preview after the timeline is implemented.
   - Invite animation comments at this gate: timing, sequencing, linked appearances, text effects, cursor behavior, motion direction, pauses, and total duration.
   - Address browser diff comments precisely.
   - After significant timing changes, inspect screenshots or browser frames at key timestamps.
   - Once animation is approved, perform the reusable requirement persistence check before exporting.
   - Stop and wait for explicit user confirmation before exporting the final MP4. Only skip the persistence check if the user explicitly says to bypass review checkpoints and the template persistence check.

6. **Export MP4**
   - Read `references/export.md`.
   - Copy the bundled export templates from this skill before writing new capture/encode code.
   - Place the copied scripts in `scratch/<demo-slug>/` and patch only task-specific defaults.
   - Capture frames at the requested or template-defined resolution.
   - Use 24 fps unless the user or template requests another frame rate.
   - Seek animations deterministically by time when possible, rather than relying only on realtime screen recording.
   - Encode MP4/H.264 with AVFoundation/Swift by default on macOS.
   - If Swift/AVFoundation fails, or the environment is not macOS, fall back to ffmpeg with H.264 (`libx264`, then `h264_videotoolbox` on macOS if available).
   - Verify the final file's width, height, duration, and playable container metadata.

## Manual Library Editing

For guided library changes, read `references/maintenance.md`.

- Add complete demo schemes to `templates/` by copying `templates/_template.md`.
- Add ordinary user-facing animation treatments to `effects/` by copying `effects/_effect.md`.
- Add template parameters for logic, timing, or export behavior to `parameters/` by copying `parameters/_parameter.md`.
- Update `catalog.json` whenever a template, effect, or parameter is added, renamed, moved, or removed.
- Keep all metadata in `catalog.json`; do not duplicate ids, summaries, tags, or conflict keys in Markdown frontmatter.
- Prefer rules and pseudocode over reusable JS/CSS snippets unless the user explicitly asks for implementation code.

## Bundled Export Scripts

Use the bundled scripts as the default MP4 export path after the animation gate is approved. Read `references/export.md` for the exact copy, capture, encode, and verification commands.

## Quality Bar

- The demo should look like the Figma design, not like a redesigned approximation.
- Icons, logos, and vector marks must be exported assets from Figma, not CSS recreations.
- Missing special fonts must be bundled or converted to vector outlines.
- Text should not wrap, overlap, or be clipped unless the source design does so.
- Timing should feel like a real product operation: action, response, pause, next result.
- Linked modules should be visibly synchronized.
- The final MP4 should be management-ready: no debug outlines, no comment markers, no unintended cursor, no browser chrome.
