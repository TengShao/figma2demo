# Figma2Demo

[English](#english) | [中文](#中文)

<a id="english"></a>

Figma2Demo is a multi-agent skill for turning Figma files into reviewed, high-fidelity HTML. Once the HTML is approved, it can go in two directions: Demo Mode creates a customizable animated product walkthrough and exports it as MP4; Frontend Mode turns the same HTML into a React/Vite/TypeScript starter that can serve as a practical handoff into frontend work.

It includes adapters for Codex, Claude Code, Hermes-style agents, and OpenClaw.

### Quick Start

To install, send this to your agent:

```text
Read https://github.com/TengShao/figma2demo and install Figma2Demo for this agent. Use the matching adapter in adapters/ as onboarding guidance, but do not treat adapters/ as a runtime dependency. Copy the runtime skill files only, then tell me how to reload the agent.
```

After installation, start with Codex:

```text
Use $figma2demo with this Figma link:
```

For agents that support slash commands:

```text
/figma2demo with this Figma link:
```

### Agent Adapters

Adapters are setup notes for different agent environments. They are not runtime files; the installed skill only needs `SKILL.md`, `catalog.json`, `templates/`, `effects/`, `parameters/`, `references/`, `scripts/`, and `assets/`.

| Agent | Adapter | Trigger |
| --- | --- | --- |
| Codex | `SKILL.md`, `agents/openai.yaml` | `Use $figma2demo ...` |
| Claude Code | `adapters/claude-code.md` | `/figma2demo ...` |
| Hermes / generic agents | `adapters/hermes.md` | `/figma2demo ...` |
| OpenClaw | `adapters/openclaw.md` | `/figma2demo create <figma-url>` |

### Workflow

Everything starts from the same reviewed HTML foundation:

```text
Figma -> reviewed HTML restoration
```

Then choose one output, or generate both:

```text
Figma -> HTML -> animated MP4
Figma -> HTML -> frontend starter
```

**Demo Mode**

1. Check Figma MCP access.
2. Restore the Figma design as a 1:1 static HTML stage.
3. Review visual fidelity with the user.
4. Animate with the selected template, effect packs, and parameters.
5. Review animation with the user.
6. Ask whether reusable changes should update or create a template.
7. Export MP4.
8. After MP4 export, optionally generate the frontend project as well.

**Frontend Mode**

1. Check Figma MCP access.
2. Restore the Figma design as a 1:1 static HTML stage.
3. Review visual fidelity with the user.
4. Export a React/Vite/TypeScript frontend project from the approved HTML.

### Demo Mode

Demo Mode is for communication. It uses templates, effect packs, and parameters to turn approved HTML into a product story with controllable timing, motion, and sequencing, then exports the result as MP4 through deterministic frame capture and encoding.

Use it for product updates, design reviews, sales conversations, launch previews, or any moment where a static design needs to feel like a working product story.

### Frontend Mode

Frontend Mode is for development handoff. It starts from the approved HTML, keeps the Figma-exported assets, and reorganizes the obvious UI structure into a self-contained React/Vite/TypeScript project with components, mock data, and CSS tokens.

The first version is intentionally a buildable starting point, not a production app. Real APIs, auth, routing, analytics, responsive breakpoints, and integration with an existing codebase are left for the actual frontend implementation.

### Fidelity Features

Figma2Demo treats Figma as the source of truth. The HTML is built from Figma metadata and exported assets, so layout, type, colors, shadows, masks, icon geometry, and layer order remain anchored to the original design instead of being guessed from a screenshot.

It also records provenance for icons, complex layers, and text/layout regions before review. That makes the HTML easier to inspect, fix, and reuse as a trusted intermediate artifact for both MP4 export and frontend work.

### Repository Layout

```text
README.md                 Overview, install prompt, and agent trigger examples
SKILL.md                  Core workflow, gates, and quality rules
catalog.json              Template, effect, and parameter registry
templates/                Reusable demo schemes and template scaffold
effects/                  Animation effect packs and effect scaffold
parameters/               Rules for further customizing animation details, rhythm, and logic
references/               Maintenance, frontend mode, and MP4 export details
scripts/                  Visual fidelity checks, frame capture, and encoding scripts
assets/                   Shared runtime assets, such as the default cursor
adapters/                 Agent-specific onboarding notes, not runtime files
agents/openai.yaml        Codex UI metadata
```

### Library Maintenance

Reusable behavior lives in:

- `templates/`: demo schemes
- `effects/`: optional animation treatments
- `parameters/`: template-only logic, timing, or export rules
- `catalog.json`: all metadata, file paths, tags, touched areas, and conflicts

Use `references/maintenance.md` for guided updates, `references/frontend-mode.md` for frontend starter export, and `references/export.md` for capture/encoding details. See `catalog.json` for the current built-ins.

---

<a id="中文"></a>

Figma2Demo 是一个适配多种 agent 的 skill，可以把 Figma 设计稿还原成经过审阅的高保真 HTML。HTML 确认后可以继续走两条路：演示模式把它做成可自定义节奏和动效的产品演示，并导出 MP4；前端模式则把它整理成 React/Vite/TypeScript 前端项目，作为后续开发的起点。

支持 Codex、Claude Code、Hermes 类 Agent 和 OpenClaw 接入。

### 快速开始

安装时，把下面这段发给你的 agent：

```text
Read https://github.com/TengShao/figma2demo and install Figma2Demo for this agent. Use the matching adapter in adapters/ as onboarding guidance, but do not treat adapters/ as a runtime dependency. Copy the runtime skill files only, then tell me how to reload the agent.
```

安装后，Codex 这样触发：

```text
使用 $figma2demo 处理这个 Figma 链接:
```

支持 slash command 的 agent 这样触发：

```text
/figma2demo 处理这个 Figma 链接:
```

### Agent 适配

`adapters/` 只是不同 agent 的接入说明，不是运行时文件。真正安装 skill 时，只需要 `SKILL.md`、`catalog.json`、`templates/`、`effects/`、`parameters/`、`references/`、`scripts/` 和 `assets/`。

| Agent | 适配文件 | 触发方式 |
| --- | --- | --- |
| Codex | `SKILL.md`, `agents/openai.yaml` | `Use $figma2demo ...` |
| Claude Code | `adapters/claude-code.md` | `/figma2demo ...` |
| Hermes / 通用 Agent | `adapters/hermes.md` | `/figma2demo ...` |
| OpenClaw | `adapters/openclaw.md` | `/figma2demo create <figma-url>` |

### 工作流

两种工作流都从同一个基础开始：

```text
Figma -> 已确认的 HTML 还原稿
```

之后可以只选一种，也可以两种都生成：

```text
Figma -> HTML -> 动画 MP4
Figma -> HTML -> 前端项目
```

**演示模式**

1. 检查 Figma MCP 是否可用。
2. 将 Figma 设计稿 1:1 还原成静态 HTML。
3. 让用户确认视觉还原。
4. 按模板、特效包和参数实现动画。
5. 让用户确认动画效果。
6. 询问是否把可复用要求更新到模板或新增模板。
7. 导出 MP4。
8. MP4 导出成功后，还可以继续生成前端项目。

**前端模式**

1. 检查 Figma MCP 是否可用。
2. 将 Figma 设计稿 1:1 还原成静态 HTML。
3. 让用户确认视觉还原。
4. 基于已确认 HTML 导出 React/Vite/TypeScript 前端项目。

### 演示模式

演示模式适合拿来讲产品。它会基于已确认的 HTML，通过模板、特效包和参数控制动画节奏、模块衔接和呈现方式，最后用确定性的截帧和编码流程导出 MP4。

适合产品汇报、方案评审、销售演示、发布预告，或者任何需要把静态设计讲成一段产品故事的场景。

### 前端模式

前端模式适合接着往开发走。它会从已确认的 HTML 出发，保留 Figma 导出的真实素材，并把明显的界面结构整理成一个自包含的 React/Vite/TypeScript 项目，包括组件、mock data 和 CSS tokens。

第一版定位是“能跑、能构建、能继续改”的前端起点，不是直接上线的生产应用。移动端断点、真实 API、权限、路由、埋点，以及接入现有代码库，都留给正式前端开发阶段处理。

### 视觉还原特色

Figma2Demo 的核心是先把视觉还原做扎实。HTML 会基于 Figma 元数据和导出的真实素材生成，布局、字体、颜色、阴影、蒙版、图标几何和图层顺序都尽量贴住源设计，而不是靠截图或肉眼猜。

它还会在审阅前记录图标、复杂图层、文字和布局区域的 provenance 信息。这样生成的 HTML 更容易检查和修正，也更适合作为导出 MP4 或继续做前端开发的可信中间产物。

### 目录结构

```text
README.md                 项目介绍、安装提示词和触发示例
SKILL.md                  核心流程、审阅节点和质量规则
catalog.json              模板、特效包和参数注册表
templates/                可复用演示模板和模板脚手架
effects/                  动画特效包和特效脚手架
parameters/               可进一步自定义动画细节、节奏和逻辑规则
references/               维护、前端模式和 MP4 导出细节
scripts/                  视觉还原检查、帧捕获和编码脚本
assets/                   默认鼠标等共享运行时素材
adapters/                 不同 Agent 的接入说明，不是运行时文件
agents/openai.yaml        Codex 界面元数据
```

### 维护模板库

可复用能力放在：

- `templates/`：演示模板
- `effects/`：可选动画特效
- `parameters/`：模板内部使用的逻辑、节奏或导出规则
- `catalog.json`：所有元数据、文件路径、标签、影响区域和冲突关系

维护流程见 `references/maintenance.md`，前端项目导出见 `references/frontend-mode.md`，MP4 导出细节见 `references/export.md`。当前内置项见 `catalog.json`。
