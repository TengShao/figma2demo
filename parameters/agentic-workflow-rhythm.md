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
- If a module is described as appearing only after another finishes, add a real delay after the preceding animation completes.
- Avoid instant all-module reveals and continuous no-pause timelines.

## Pseudocode

```text
after start action:
  hold briefly
  reveal context modules
  hold for reading
  reveal retrieval or service modules with linked indicators
  hold for result recognition
  reveal synthesis modules
  hold final state
```

## Acceptance Checks

- The demo reads as action, response, pause, next result.
- Linked modules are visibly synchronized.
- The final state is stable long enough for the audience to inspect it.
