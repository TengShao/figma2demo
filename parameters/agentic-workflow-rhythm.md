# Parameter: agentic-workflow-rhythm

Use this timing parameter for templates that show an agent-style workflow: request, context gathering, retrieval or service work, synthesis, and final hold.

## Purpose

- Prevent every module from appearing continuously with no breathing room.
- Make linked modules feel causally connected to user actions.
- Keep downstream modules hidden until the workflow reaches their trigger.

## Rules

- Add short pauses between meaningful phases: prompt sent, file upload, reading, searching, service result, analysis, and final state.
- Synchronize linked modules by trigger time, not merely by visual position.
- If a downstream panel appears because a source or service is used, reveal the source/service indicator at the same moment or slightly before the panel.
- When the screen starts focused on a central workspace and later expands to left or right result modules, animate the layout as grouped stage movement: keep the workspace/composer centered first, then return the group to its Figma-final coordinates as the downstream module fades/slides in.
- For grouped layout movement, move the common wrapper for the workspace background, main content, and composer together. Keep unrelated global chrome anchored, and ensure the final keyframe has no residual transform.
- Stagger context-section internals in source-gathering sequences: background, title/expander, document row, then file chip. Avoid revealing a full sidebar section as one instantaneous block when the design is meant to show active gathering.
- If a module is described as appearing only after another finishes, add a real delay after the preceding animation completes.
- Avoid instant all-module reveals and continuous no-pause timelines.

## Pseudocode

```text
after start action:
  hold briefly
  reveal context modules
  hold for reading
  shift grouped workspace from centered start to final layout while revealing downstream result group
  reveal retrieval or service modules with linked indicators
  hold for result recognition
  reveal synthesis modules
  hold final state
```

## Acceptance Checks

- The demo reads as action, response, pause, next result.
- Linked modules are visibly synchronized.
- Any centered-to-expanded workspace motion ends exactly on the approved static layout.
- The final state is stable long enough for the audience to inspect it.
