# OpenClaw Adapter

Use this adapter when OpenClaw should expose Figma2Demo as a slash-command workflow.

This adapter is onboarding guidance, not a runtime skill file. Use it before installation; the installed runtime skill does not need to include `adapters/`.

## Entry Point

Recommended top-level command:

```text
/figma2demo
```

Suggested subcommands:

```text
/figma2demo create <figma-url>
/figma2demo templates
/figma2demo effects
/figma2demo add-template
/figma2demo update-template <template-id>
/figma2demo add-effect
/figma2demo add-parameter
/figma2demo help
```

## Command Semantics

### `/figma2demo create <figma-url>`

Create a reviewed animated HTML/MP4 demo from a Figma design.

Expected behavior:

- ask for `demoName`, template id, and optional effects
- verify Figma MCP access before implementation
- load the selected template, selected effects, and template parameters
- rebuild a 1:1 static HTML stage
- ask for visual approval
- after visual approval, infer likely animation start and linked modules from the approved HTML/Figma structure, recommend them, and ask the user to confirm
- implement animation
- ask for animation approval
- perform the post-animation template persistence check
- export MP4 using `references/export.md`

### `/figma2demo templates`

List available `templates[]` from `catalog.json`.

### `/figma2demo effects`

List available `effects[]` from `catalog.json`.

### `/figma2demo add-template`

Route into `references/maintenance.md` and the `templates/_template.md` scaffold.

### `/figma2demo update-template <template-id>`

Load the matching catalog entry and template file, then route into `references/maintenance.md`.

### `/figma2demo add-effect`

Route into `references/maintenance.md` and the `effects/_effect.md` scaffold.

### `/figma2demo add-parameter`

Route into `references/maintenance.md` and the `parameters/_parameter.md` scaffold.

## Rules

- Do not export before visual approval, animation approval, and the template persistence check unless the user explicitly bypasses all three.
- Do not claim 1:1 fidelity without Figma MCP or equivalent Figma API access.
- Do not recreate icons, logos, or vector marks with CSS.
- Keep reusable library metadata in `catalog.json`.
