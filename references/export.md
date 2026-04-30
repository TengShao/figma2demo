# Export Reference

Use this reference after the animation gate is approved and the user is ready to export an MP4.

## Output Structure

Use the user-provided `demoName` as the readable HTML title and demo label. Derive a filesystem-safe slug from it:

- lowercase
- replace non-alphanumeric runs with `-`
- trim leading and trailing `-`
- if the result is empty, ask for a different `demoName`

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

## Bundled Scripts

Copy these bundled scripts into `scratch/<demo-slug>/` before export:

- `scripts/capture_html_frames.js`
- `scripts/encode_frames.swift`
- `scripts/encode_frames_ffmpeg.js`

Patch only task-specific defaults such as HTML path, duration, fps, resolution, Chrome path, and output paths.

## Capture

```bash
node scratch/<demo-slug>/capture_html_frames.js \
  --html output/<demo-slug>/<demo-slug>.html \
  --out scratch/<demo-slug>/frames \
  --duration 12 \
  --fps 24 \
  --width 1920 \
  --height 1080
```

`capture_html_frames.js` supports deterministic seeking through `window.__seekDemoTime(seconds)`, `window.__setDemoTime(seconds)`, or the Web Animations API. Prefer adding one of those page-level seek functions when CSS/JS animations need exact frame capture.

## Encode

Prefer AVFoundation/Swift on macOS:

```bash
swift scratch/<demo-slug>/encode_frames.swift \
  --frames scratch/<demo-slug>/frames \
  --out output/<demo-slug>/<demo-slug>.mp4 \
  --fps 24 \
  --width 1920 \
  --height 1080
```

If Swift/AVFoundation fails, use the ffmpeg fallback:

```bash
node scratch/<demo-slug>/encode_frames_ffmpeg.js \
  --frames scratch/<demo-slug>/frames \
  --out output/<demo-slug>/<demo-slug>.mp4 \
  --fps 24 \
  --width 1920 \
  --height 1080
```

Verify the final file's width, height, duration, and playable container metadata.
