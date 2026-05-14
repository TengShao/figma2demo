# Version And Compatibility

## Current Version

Figma2Demo runtime version: `0.2.0`.

## Runtime Files

Install these files and directories when copying the skill into an agent runtime:

- `SKILL.md`
- `catalog.json`
- `templates/`
- `effects/`
- `parameters/`
- `references/`
- `prompts/`
- `scripts/`
- `assets/`

The `adapters/` directory is onboarding documentation for specific agent environments. It is not a runtime dependency.

## Agent Compatibility

Figma2Demo is designed for agents that can:

- read and follow local skill instructions
- access Figma through a working Figma MCP connection
- write demo artifacts under `output/<demo-slug>/`
- run local Node.js scripts
- preview local HTML before review checkpoints

Demo production mode requires Figma MCP access before static restoration begins. Library maintenance mode does not require Figma MCP unless the requested change must be validated against a live Figma file.

## Script Compatibility

The bundled review scripts use only Node.js built-in modules and CommonJS. No npm install is required for:

- `scripts/check_icon_fidelity.js`
- `scripts/check_layer_provenance.js`
- `scripts/check_layout_provenance.js`
- `scripts/review_static.js`

MP4 export uses:

- Node.js for deterministic frame capture
- Swift/AVFoundation on macOS as the preferred encoder
- `scripts/encode_frames_ffmpeg.js` as the fallback encoder wrapper when Swift encoding is unavailable

## Artifact Compatibility

Static review expects this structure:

```text
output/<demo-slug>/
  <demo-slug>.html
  icon-provenance.json
  layer-provenance.json
  layout-provenance.json
  review-crops/
  assets/
```

`scripts/review_static.js` accepts explicit path overrides when a demo uses a non-standard HTML name or review-crops path.

## Upgrade Notes

From `0.1.0` to `0.2.0`:

- Add `scripts/review_static.js` and use it as the one-command static review gate.
- Install the new `prompts/` directory with the runtime skill files.
- Update any agent adapter or installation checklist that listed runtime directories.
- Keep existing template, effect, parameter, and export artifacts unchanged.
