# Frontend Mode

Use this reference when the user selects Frontend Mode after visual fidelity approval or after MP4 export. Frontend Mode turns the approved static HTML restoration into a standalone frontend starter project.

Frontend Mode is an implementation starter, not a production-ready application. It should be runnable, buildable, componentized, data-driven where obvious, and visually close to the approved desktop HTML. Do not invent business logic, backend behavior, authentication, routing, analytics, or production breakpoint systems.

## Scope

MVP target stack:

- React
- Vite
- TypeScript
- CSS variables plus plain CSS or CSS Modules
- Local Figma-exported assets
- Typed mock data

Do not support multiple frameworks in the MVP unless the user explicitly asks for a custom implementation. Do not generate Next.js, Vue, Svelte, Tailwind-first output, backend code, or real API integration by default.

## Trigger Points

Offer Frontend Mode after the Visual Fidelity Review is approved:

```text
Visual fidelity is approved. What would you like to do next?

1. Continue with animation and MP4 export.
2. Export a Frontend Mode project.
3. Do both.
```

If the user chooses animation/MP4 first, offer Frontend Mode again after MP4 export succeeds:

```text
The MP4 is exported. Do you want to generate a Frontend Mode project from the approved HTML as well?
```

Do not generate frontend code unless the user explicitly selects it.

## Output Structure

Create a self-contained project under the demo output folder:

```text
output/<demo-slug>/frontend/
  package.json
  index.html
  tsconfig.json
  vite.config.ts
  src/
    main.tsx
    App.tsx
    components/
    data/
      mock.ts
    styles/
      tokens.css
      global.css
    assets/
  README.md
```

The generated README must explain:

- The project was generated from the approved HTML demo.
- It is a frontend starter, not a production-ready application.
- How to install, run, and build it.
- What was componentized.
- What remains static or mocked.
- Which production concerns are intentionally deferred.

## Conversion Rules

Use the approved HTML, local assets, and provenance files as source material:

- `output/<demo-slug>/<demo-slug>.html`
- `output/<demo-slug>/icon-provenance.json`
- `output/<demo-slug>/layer-provenance.json`
- `output/<demo-slug>/layout-provenance.json`
- `output/<demo-slug>/assets/`

Convert structural layout into maintainable frontend code:

- Use semantic containers, React components, and reusable props.
- Prefer flex/grid for page structure, panels, lists, cards, rows, chips, controls, and repeated UI.
- Preserve local absolute positioning only for complex artwork, diagram connectors, masks, overlays, precise layered compositions, or regions where converting to flow layout would reduce fidelity.
- Do not wrap the original HTML wholesale inside React.
- Do not carry over the demo preview shell, fixed export-stage scaling, MP4 capture hooks, deterministic seek functions, or timeline-only CSS/JS.

Good component candidates include:

- Navigation rails and items
- Headers and toolbars
- Composer/input areas
- Cards and result panels
- File chips, tags, badges, and pills
- List rows and repeated modules
- Service, database, source, or evidence blocks

## Data Extraction

Extract repeated or content-like data into `src/data/mock.ts` with TypeScript types.

Extract:

- Card lists
- File lists
- Service, database, module, or source lists
- Result items
- Table rows, metrics, and evidence entries
- User messages and generated answers
- Menu items when they clearly behave like configurable product data

Inline only stable component-owned UI labels and microcopy, such as button labels, aria labels, empty-state labels, or short control text.

Do not invent real backend schemas. Use conservative types that match the visible screen content.

## Asset Rules

Copy all frontend-required assets into the frontend project so it is portable. Prefer `src/assets/` for assets imported by React components.

- Do not reference sibling demo asset paths from the frontend project.
- Preserve Figma-exported SVG, PNG, and bitmap assets.
- Do not redraw icons, logos, or vector marks with CSS, emoji, icon fonts, lucide, or approximate icon libraries.
- Keep asset names stable and readable when possible.

## Animation Policy

Default policy: production-like app behavior only.

Remove demo-only animation behavior:

- Cursor-send animation
- Click rings that only serve the video demo
- Typewriter effects used only for presentation
- Timeline reveal sequences
- Fixed preview scaling
- MP4 capture and seek hooks

Allowed lightweight app interactions:

- Hover, focus, and pressed states
- Loading or processing state styles when visibly implied by the screen
- Panel expand/collapse transitions
- Result entry transitions
- Reduced-motion-friendly CSS transitions

If the user explicitly asks to preserve presentation animation in the frontend project, treat that as a custom request and document it in the generated README.

## Responsive Policy

MVP targets a desktop implementation derived from the approved HTML.

- Do not ask the user to choose breakpoints during export.
- Do not invent production responsive behavior unless explicitly requested.
- Keep basic viewport safety, such as avoiding uncontrolled horizontal overflow where practical.
- Defer mobile, tablet, and production breakpoint design to formal frontend development.

## Validation

Before reporting success:

- Install dependencies if needed and permitted.
- Run `npm run build`.
- Confirm TypeScript compiles.
- Confirm asset paths resolve.
- Confirm the generated app has no MP4 capture code, preview shell, or deterministic timeline hooks.
- If a local browser check is practical, inspect the desktop page for obvious missing assets, broken layout, or severe text overflow.

If dependency installation or build verification cannot be run, report that clearly with the reason.
