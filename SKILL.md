---
name: figma2demo-ugcagent
description: Convert Figma designs into faithful HTML demos with staged typewriter/text animation, inter-module timing/linkage, and 1920x1080 MP4 export. Use when the user asks to turn a Figma mockup into an animated demo video, HTML prototype, product walkthrough, or management-facing demo and needs Figma layer fidelity plus video export.
---

# Figma2Demo-UGCAgent

Use this skill to turn a Figma design into a faithful animated HTML demo and export it as an MP4. Preserve the successful workflow from the UGC Agent demo: read Figma layer data first, rebuild the screen in HTML, confirm visual fidelity with the user, choreograph realistic UI operation timing, confirm the animation with the user, then export video.

## Start By Asking

Before implementation, ask these three questions and wait for the user's answers:

1. Figma 设计稿的链接是什么？
2. 从哪个模块的出现作为动画起点？
3. 哪些模块需要联动出现？

If the user has not specified duration, resolution, or output format, assume 10-15 seconds, 1920x1080, MP4 unless the context says otherwise.

## Mandatory Flow Control

This workflow has three required user-confirmation gates. Do not skip them, even if the user asks for the final MP4 in the first message, unless the user explicitly says to bypass review checkpoints.

1. **Visual fidelity gate**
   - After reading Figma and generating the static HTML replica, show or open the HTML preview for the user.
   - Ask the user to confirm whether the visual restoration is accurate enough.
   - If the user gives visual corrections, patch the HTML/CSS/assets and preview again.
   - Do not start animation work until the user confirms the visual restoration.

2. **Animation gate**
   - After the user confirms the visual stage, implement the animation timeline.
   - Preview the animated HTML for the user.
   - Ask the user to confirm whether the animation timing, linkage, cursor behavior, typewriter effects, and rhythm are acceptable.
   - If the user gives animation corrections, patch the timeline and preview again.
   - Do not export the MP4 until the user confirms the animation.

3. **MP4 export gate**
   - Only after animation approval, capture and encode the final MP4.
   - Verify video metadata and report the output path.

## Workflow

1. **Read Figma before coding**
   - Extract the Figma file key and node id from the URL.
   - Use Figma tools to get metadata, design context, screenshots, and asset URLs.
   - Treat Figma layer positions, sizes, text, colors, borders, radii, shadows, and image assets as the source of truth.
   - Export or download the exact icons and bitmap assets from Figma. Do not replace them with approximate icon-library icons unless the design itself uses that library and the match is exact.

2. **Rebuild a 1:1 static HTML stage**
   - Use a fixed 1920x1080 stage for video work unless the user requests another size.
   - Use absolute positioning when fidelity matters more than responsiveness.
   - Match Figma typography, text weights, line heights, colors, borders, spacing, corner radii, and shadows.
   - Keep assets in an output-local `assets/` folder and reference them directly.
   - Build the actual interface as the first screen. Do not add marketing copy, extra slogans, or explanatory UI unless requested.

3. **Preview and confirm visual fidelity**
   - Show the static HTML preview before adding animation.
   - Invite visual diff comments only at this gate: text typos, icon mismatches, wrapping, alignment, colors, spacing, radius, shadows, missing assets, or layout scale.
   - Address visual comments precisely and preview again.
   - Stop and wait for explicit user confirmation before continuing to animation.

4. **Define the animation timeline**
   - Make a small timing table before heavy animation work:
     - `time`: when the event starts
     - `module`: the UI element or group
     - `motion`: typewriter, fade, slide, panel move, cursor click, etc.
     - `linked_to`: any module that must appear in sync
     - `pause_after`: intentional hold before the next event
   - Start from the module named by the user. If the demo begins from an input box, type the prompt in the composer, click/send, then begin the downstream panel motion.
   - Use named CSS classes or CSS variables for timing, so user feedback can be patched precisely.

5. **Use typewriter text deliberately**
   - User-visible generated text should appear with a typewriter effect when the user asks for "文字逐字出现" or "打字机".
   - Avoid vertical mask/sweep reveals for text that should type character by character.
   - Wrap typewriter text into per-character spans and animate opacity or width with staggered delay.
   - Exclude elements that should appear with their container, such as document rows, menu rows, or pills the user says should appear as one piece.
   - Keep no-wrap text as no-wrap; do not let labels like database names wrap unless Figma shows wrapping.

6. **Choreograph realistic rhythm**
   - Avoid making every component appear continuously with no breathing room.
   - Add short pauses between meaningful phases: prompt sent, file upload, reading, searching, service result, analysis module.
   - If file chips simulate user upload, delay them after the first sent message and align them with that user bubble.
   - If a center workspace starts focused, keep it centered initially; after the trigger is sent, move it to its final position and reveal the right-side analysis/search area.
   - Hide right-side modules until their trigger occurs.
   - Coordinate linked modules by timing, not just by visual proximity. Examples:
     - `UGC白皮书 Database` appears with the "最佳实践" panel/search count.
     - `竞品分析 Service` appears with the "竞品分析" panel.
     - Left sidebar knowledge sections appear in sync with corresponding uploaded file chips.
   - If the user says a module should appear only after another finishes, add an actual delay after the preceding animation completes.

7. **Handle cursor and send behavior**
   - If a cursor is shown, animate it only while it is part of the simulated operation.
   - After clicking send, fade or remove the cursor if the user expects the mouse to disappear.
   - Do not remove the composer/input panel after send unless the user explicitly requests that; often only the cursor should disappear.

8. **Preview and confirm animation before video export**
   - Show the animated HTML preview after the timeline is implemented.
   - Invite animation comments at this gate: timing, sequencing, linked appearances, typewriter behavior, cursor behavior, motion direction, pauses, and total duration.
   - Address browser diff comments precisely.
   - After significant timing changes, inspect screenshots or browser frames at key timestamps.
   - Stop and wait for explicit user confirmation before exporting the final MP4, unless the user asks to export anyway.

9. **Export MP4**
   - Copy the bundled export templates from this skill before writing new capture/encode code:
     - `scripts/capture_html_frames.js`
     - `scripts/encode_frames.swift`
     - `scripts/encode_frames_ffmpeg.js`
   - Place the copied scripts in the task-local scratch folder, usually `scratch/demo-video/`, and patch only task-specific defaults such as HTML path, duration, fps, resolution, Chrome path, and output paths.
   - Capture frames at the requested resolution, defaulting to 1920x1080.
   - Use 24 fps unless the user requests another frame rate.
   - Seek animations deterministically by time when possible, rather than relying only on realtime screen recording.
   - Encode MP4/H.264 with AVFoundation/Swift by default on macOS.
   - If Swift/AVFoundation fails, or the environment is not macOS, fall back to ffmpeg with H.264 (`libx264`, then `h264_videotoolbox` on macOS if available).
   - Verify the final file's width, height, duration, and playable container metadata.

## Bundled Export Scripts

Use the bundled scripts as the default MP4 export path after the animation gate is approved. The preferred encoding path is AVFoundation first, ffmpeg fallback second.

```bash
node scratch/demo-video/capture_html_frames.js \
  --html output/demo-video/figma-replica.html \
  --out scratch/demo-video/frames \
  --duration 12 \
  --fps 24 \
  --width 1920 \
  --height 1080

swift scratch/demo-video/encode_frames.swift \
  --frames scratch/demo-video/frames \
  --out output/demo-video/ugc-agent-demo.mp4 \
  --fps 24 \
  --width 1920 \
  --height 1080
```

If Swift/AVFoundation fails, use the ffmpeg fallback:

```bash
node scratch/demo-video/encode_frames_ffmpeg.js \
  --frames scratch/demo-video/frames \
  --out output/demo-video/ugc-agent-demo.mp4 \
  --fps 24 \
  --width 1920 \
  --height 1080
```

`capture_html_frames.js` supports deterministic seeking through either `window.__seekDemoTime(seconds)`, `window.__setDemoTime(seconds)`, or the Web Animations API. Prefer adding one of those page-level seek functions when CSS/JS animations need exact frame capture.

## Quality Bar

- The demo should look like the Figma design, not like a redesigned approximation.
- Icons must match the Figma source.
- Text should not wrap, overlap, or be clipped unless the source design does so.
- Timing should feel like a real product operation: action, response, pause, next result.
- Linked modules should be visibly synchronized.
- The final MP4 should be management-ready: no debug outlines, no comment markers, no unintended cursor, no browser chrome.

## Preferred Output Structure

Use task-specific names when appropriate, but this structure works well:

```text
output/demo-video/
  figma-replica.html
  ugc-agent-demo.mp4
  assets/
scratch/demo-video/
  capture_html_frames.js
  encode_frames.swift
  encode_frames_ffmpeg.js
  frames/
```

Keep scripts task-local unless they become genuinely reusable across multiple demos.
