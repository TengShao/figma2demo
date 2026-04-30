# Library Maintenance

Use this reference when the user asks to add, modify, improve, rename, remove, or review reusable templates, effect packs, or parameters.

## Triggers

Enter library maintenance mode when the user says anything like:

- "add/create a template"
- "modify/update this template"
- "add/create an effect pack"
- "change the typewriter effect"
- "add special logic/rhythm/export rules"
- "maintain the template library"

Start by reading `catalog.json`, then summarize the current templates, effect packs, or parameters relevant to the request. Ask only for missing information that changes reusable behavior.

## Adding A Template

Guide the user through:

1. Template id and human title.
2. What family of Figma designs it applies to.
3. Required inputs beyond the global demo inputs.
4. 1:1 visual restoration requirements, including icon asset export and special font handling.
5. Animation phases, linked modules, and rhythm.
6. Optional effect packs that work well with it.
7. Parameters to load silently, if any.
8. Conflict keys and touched areas for `catalog.json`.
9. Export defaults.

Copy `templates/_template.md` for the new file, then update `catalog.json`.

## Modifying A Template

First show the matching catalog entry and a short summary of the template file. Ask what should change:

- applicability
- visual rules
- animation scheme
- special logic
- effect guidance
- parameters
- conflicts
- export defaults

Preserve unrelated rules.

## Post-Animation Persistence Check

After animation approval and before MP4 export, review the conversation for reusable special requirements. This check is only needed when the user introduced behavior that could help future demos; skip it when all changes are one-off content, visual fixes, or file-specific corrections.

Reusable requirements include:

- repeated animation timing or sequencing rules
- special module-linkage logic
- reusable interaction behavior
- effect-pack-worthy visual treatments
- export defaults that should apply to a design family
- Figma restoration rules that apply beyond the current file

Non-reusable requirements include:

- typo fixes
- one screen's exact copy
- one-off asset replacements
- corrections that only repair this Figma file
- user choices explicitly described as temporary

If reusable requirements exist, ask the user before export in the user's current language.

English prompt:

```text
Some reusable requirements came up during animation review. Do you want to save them to the template library before exporting the MP4?

1. Update the current template: future demos of this type should follow these rules.
2. Create a new template: this run has become a distinct demo type.
3. Use only for this demo: do not modify the template library; export the MP4 now.
```

Chinese prompt:

```text
这次动画确认过程中有一些可复用要求。要不要在导出 MP4 前把它沉淀到模板库？

1. 更新当前模板：适合同一类 demo 以后都遵循这些规则。
2. 新增一个模板：适合这次已经形成了一个新的 demo 类型。
3. 只用于本次 demo：不修改模板库，直接导出 MP4。
```

If the user chooses to update the current template, modify the selected template and `catalog.json` only where needed. If they choose to create a new template, follow the "Adding A Template" flow. If they choose one-off, do not write library changes; continue to export.

## Adding Or Modifying An Effect Pack

Guide the user through:

1. Effect id and human title.
2. What visual or animation treatment it adds.
3. When to use it and when to avoid it.
4. Required target inputs.
5. Deterministic application rules and pseudocode.
6. Conflict keys and touched areas for `catalog.json`.
7. Acceptance checks.

Copy `effects/_effect.md` for new effect packs, then update `catalog.json`.

## Adding Or Modifying A Parameter

Guide the user through:

1. Parameter id and human title.
2. Type: `logic`, `timing`, or `export`.
3. Which templates should load it silently.
4. Rules, pseudocode, touched areas, and conflicts.
5. Acceptance checks.

Copy `parameters/_parameter.md` for new parameters, then update `catalog.json`.

## Writing Rules

- Update `catalog.json` in the same change as any new, renamed, moved, or removed reusable file.
- Keep metadata only in `catalog.json`.
- Prefer user-friendly summaries in chat, but write precise reusable rules in files.
- Prefer rules and pseudocode over reusable JS/CSS snippets unless the user explicitly asks for implementation code.
- If a requested change conflicts with an existing catalog item, explain the conflict and ask whether to adjust the new item, modify the old item, or keep both with an explicit `conflictsWith` relationship.
