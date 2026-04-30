# Claude Code Adapter

Use this adapter when Claude Code should use Figma2Demo to produce reviewed HTML/MP4 demos from Figma designs.

## Context To Load

Point Claude Code at these files:

- `SKILL.md`
- `catalog.json`
- the selected `templates/*.md`
- any selected `effects/*.md`
- template-listed `parameters/*.md`
- `references/maintenance.md`
- `references/export.md`

## Required Setup

- Figma MCP must be available and authorized for the target file.
- Node.js must be available for frame capture.
- Swift/AVFoundation should be available on macOS for MP4 encoding; use the ffmpeg fallback if needed.

## Recommended Project Instruction

Create or update a project-level `CLAUDE.md` with:

```markdown
# Figma2Demo Instructions

Use Figma2Demo to convert Figma designs into reviewed animated HTML demos and MP4 videos.

Before implementation:

- Read SKILL.md and catalog.json.
- Verify Figma MCP access to the provided file/node.
- Load only the selected template, selected effect packs, template parameters, and needed references.
- Treat Figma as the source of truth.
- Export icons, logos, and vector marks from Figma; do not recreate them with CSS.
- Convert unavailable special fonts to vector outlines unless the user chooses another option.

Flow:

1. Ask for Figma URL, demoName, template id, animation start module, linked modules, and optional effects.
2. Build a 1:1 static HTML stage and ask for visual approval.
3. Implement animation and ask for animation approval.
4. Before MP4 export, ask whether reusable special requirements should update the current template or become a new template.
5. Export using references/export.md.
```

## Recommended Prompts

```text
Use Figma2Demo to create a demo from this Figma link.
Template: agent-workspace.
Demo name: <name>.
Start from <module>.
Use <effect ids> effects.
```

```text
Use Figma2Demo to add a new template for <design family>.
```

## Operating Rules

- Do not bypass Figma MCP unless the user explicitly accepts a non-1:1 fallback.
- Keep generated output under `output/<demo-slug>/` and scratch files under `scratch/<demo-slug>/`.
- Do not export MP4 before visual and animation approval unless the user explicitly bypasses review checkpoints and template persistence.
- Preserve reusable changes through templates, effect packs, or parameters only after user confirmation.
