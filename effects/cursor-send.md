# Effect Pack: cursor-send

Animate a cursor through an input or send interaction when the demo simulates a user starting the workflow.

## Required Inputs

- Cursor start location.
- Input or composer target.
- Send button or activation target.
- Whether the composer stays visible after send.

## Default Cursor Asset

- Use `assets/cursor-pointer.svg` as the default cursor graphic for generated demos.
- Copy the asset from the skill package into the demo-local `output/<demo-slug>/assets/` folder before referencing it in HTML. Do not reference the skill installation path directly from the demo HTML.
- Render it as an `<img>` or CSS background image, not as a hand-redrawn inline cursor, unless the user explicitly asks to customize the graphic.
- Default stage size: 48px by 48px on a 1920x1080 export. Adjust proportionally for other export resolutions.
- Default hotspot: near the visual pointer tip, approximately 12px from the left and 10px from the top at 48px display size.
- Default styling: `filter: drop-shadow(0 2px 2px rgba(0,0,0,.24)); pointer-events: none;`.
- If the Figma design includes its own cursor asset or the user provides a different cursor image for the run, use that asset instead and record the override in the demo notes.

## Application Rules

- Show the cursor only while it is part of the simulated operation.
- If the cursor clicks send, fade or remove the cursor after the click unless the user explicitly wants it to remain.
- Do not remove the composer or input panel after send unless the user explicitly requests that behavior.
- If prompt text is typed, coordinate cursor motion with the prompt reveal and send action.
- Keep cursor timing in the main timeline rather than as a free-running animation.
- Define timeline beats for `inputStart`, `sendMoveStart`, `clickAt`, `cursorFadeAt`, and `downstreamStart`. Downstream module motion should begin from `downstreamStart`, not from an unrelated delay.
- Pair with `click-ring-pulse` by default when the cursor activates a visible send or primary action button.
- If the prompt is already visible in the static Figma design but simulated as typed in the animation, hide the live prompt at frame 0 and reveal it through `typewriter` or an equivalent deterministic text reveal.
- If placeholder text exists, fade it out before or as prompt text begins. Do not leave placeholder and typed prompt overlapping.
- Keep send-button feedback brief and reversible unless the Figma source includes a persistent active state.
- Use fixed cursor coordinates or Figma-derived target bounds. Do not depend on browser pointer APIs or runtime user input during capture.
- Do not substitute emoji, icon fonts, CSS triangles, system pointer screenshots, or icon-library cursors for the default cursor asset.

## Pseudocode

```text
move cursor to composer
if prompt text is simulated:
  reveal prompt text
move cursor to send target
click send target
play click-ring-pulse
fade cursor
continue downstream template timeline
```

## Acceptance Checks

- The cursor does not linger after its task is complete.
- The default cursor graphic or an explicit user/Figma override is used consistently.
- The send action visibly causes the next phase of the demo.
- Composer visibility matches the user's requested behavior.
- Placeholder, typed prompt, click feedback, cursor fade, and downstream reveal are all tied to the same timeline.
