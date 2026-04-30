# Effect Pack: cursor-send

Animate a cursor through an input or send interaction when the demo simulates a user starting the workflow.

## Required Inputs

- Cursor start location.
- Input or composer target.
- Send button or activation target.
- Whether the composer stays visible after send.

## Application Rules

- Show the cursor only while it is part of the simulated operation.
- If the cursor clicks send, fade or remove the cursor after the click unless the user explicitly wants it to remain.
- Do not remove the composer or input panel after send unless the user explicitly requests that behavior.
- If prompt text is typed, coordinate cursor motion with the prompt reveal and send action.
- Keep cursor timing in the main timeline rather than as a free-running animation.

## Pseudocode

```text
move cursor to composer
if prompt text is simulated:
  reveal prompt text
move cursor to send target
click send target
fade cursor
continue downstream template timeline
```

## Acceptance Checks

- The cursor does not linger after its task is complete.
- The send action visibly causes the next phase of the demo.
- Composer visibility matches the user's requested behavior.
