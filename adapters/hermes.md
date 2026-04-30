# Hermes / Generic Agent Adapter

Use this adapter when Hermes or another non-Codex agent should use Figma2Demo.

This adapter is onboarding guidance, not a runtime skill file. Use it before installation; the installed runtime skill does not need to include `adapters/`.

## Context To Load

Load the minimum files needed for the requested task:

- Always: `SKILL.md`, `catalog.json`
- Demo production: selected template, selected effects, template parameters, `references/export.md`
- Library maintenance: `references/maintenance.md` and the relevant template/effect/parameter files

## Required Capabilities

- Access to Figma MCP or an equivalent Figma file API.
- Ability to write HTML/CSS/JS assets.
- Ability to run Node.js frame capture.
- Ability to encode MP4 with Swift/AVFoundation or ffmpeg.

## Prompt Template

```text
Use the Figma2Demo workflow.

Read:
- SKILL.md
- catalog.json
- the selected template
- selected effects, if any
- template parameters
- references/export.md when exporting
- references/maintenance.md when changing the reusable library

Requirements:
- Verify Figma MCP/file API access before rebuilding the design.
- Restore the Figma design 1:1.
- Export icons and vector marks as assets; do not draw them with CSS.
- Ask for visual approval, then animation approval, then perform the template-persistence check before MP4 export.
```

## Operating Rules

- If Figma access fails, stop and report the dependency failure.
- Do not use screenshots or visual guessing as a 1:1 source unless the user explicitly accepts the limitation.
- Load only the reusable files needed for the selected template and effects.
- Keep template/effect/parameter metadata in `catalog.json`.
