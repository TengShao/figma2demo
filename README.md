# Figma2Demo

[English](#english) | [中文](#中文)

<a id="english"></a>

Figma2Demo is a multi-agent adapted skill for turning Figma designs into reviewed, faithful HTML demos, then branching into two useful outputs: animated MP4 videos for communication, or React/Vite/TypeScript frontend starter projects for development. Demo Mode turns the approved HTML into a highly customizable animated product walkthrough and deterministic MP4 export. Frontend Mode gives teams a practical bridge from Figma review to real frontend work by converting an approved HTML restoration into a buildable app starter.

It includes adapters for Codex, Claude Code, Hermes-style agents, and OpenClaw.

### Quick Start

Ask your agent to install the skill:

```text
Read https://github.com/TengShao/figma2demo and install Figma2Demo for this agent. Use the matching adapter in adapters/ as onboarding guidance, but do not treat adapters/ as a runtime dependency. Copy the runtime skill files only, then tell me how to reload the agent.
```

After installation, trigger it directly:

```text
Use $figma2demo with this Figma link.
```

### Agent Adapters

Adapters explain how Figma2Demo is used in each agent. They are onboarding references, not runtime dependencies; the installed skill only needs `SKILL.md`, `catalog.json`, `templates/`, `effects/`, `parameters/`, `references/`, `scripts/`, and `assets/`.

| Agent | Adapter | Entry |
| --- | --- | --- |
| Codex | `SKILL.md`, `agents/openai.yaml` | `Use $figma2demo ...` |
| Claude Code | `adapters/claude-code.md` | `/figma2demo ...` |
| Hermes / generic agents | `adapters/hermes.md` | `/figma2demo ...` |
| OpenClaw | `adapters/openclaw.md` | `/figma2demo create <figma-url>` |

### Two Output Paths

Both paths start with the same fidelity-first foundation:

```text
Figma -> reviewed 1:1 HTML restoration
```

From there, the user can choose either or both outputs:

```text
Figma -> HTML -> animated MP4
Figma -> HTML -> frontend starter
```

**Video Demo Path**

1. Check Figma MCP access.
2. Restore the Figma design as a 1:1 static HTML stage.
3. Review visual fidelity with the user.
4. Animate with the selected template, effect packs, and parameters.
5. Review animation with the user.
6. Ask whether reusable changes should update or create a template.
7. Export MP4.
8. After MP4 export, offer Frontend Mode again if it was not already generated.

**Frontend Starter Path**

1. Check Figma MCP access.
2. Restore the Figma design as a 1:1 static HTML stage.
3. Review visual fidelity with the user.
4. Export a Frontend Mode React/Vite/TypeScript starter project from the approved HTML.

### Demo Mode

Demo Mode is the communication-focused output. It turns the approved HTML restoration into a highly customizable animated product walkthrough using templates, effect packs, and parameters, then exports MP4 through deterministic frame capture and encoding.

It is useful for product updates, design reviews, sales demos, launch previews, or any situation where a static design needs to become a playable product narrative.

### Frontend Mode

Frontend Mode is an optional output after visual fidelity approval. It generates a self-contained React/Vite/TypeScript frontend starter from the approved HTML restoration, preserving Figma-exported assets while converting obvious structure into components, mock data, and CSS tokens.

The first version is intentionally scoped as a buildable frontend starting point, not a production-ready app. Responsive production breakpoints, real APIs, auth, routing, analytics, and integration into an existing codebase are deferred to formal frontend development.

### Fidelity Rules

- Figma is the source of truth for layout, assets, typography, colors, shadows, masks, and states.
- Icons, logos, and vector marks must be exported from Figma as real assets, preferably SVG.
- Do not recreate icon-like layers with CSS or approximate icon libraries.
- If a special font is unavailable and cannot be bundled, convert the affected Figma text to vector outlines.
- If Figma MCP is unavailable, stop instead of pretending to produce a 1:1 restoration.

### Repository Layout

```text
SKILL.md                  Core workflow and quality rules
adapters/                 Agent-specific onboarding notes, not runtime files
catalog.json              Template, effect, and parameter index
templates/                Reusable demo schemes
effects/                  Optional animation effect packs
parameters/               Template-only parameters
references/               Maintenance, frontend export, and MP4 export references
scripts/                  Frame capture and MP4 helpers
assets/                   Shared runtime assets such as the default cursor
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

Figma2Demo 是一个多 agent 适配的 skill，用来把 Figma 设计稿还原成可审阅的高保真 HTML，然后分成两条有价值的输出线：用于沟通展示的动画 MP4，或用于继续开发的 React/Vite/TypeScript 前端项目。演示模式会把已确认的 HTML 还原稿转换成可以高度自定义的产品演示动画，并确定性导出 MP4。前端模式会把已确认的 HTML 还原稿转换成可构建的应用起点，让团队从 Figma 审阅自然过渡到真实前端开发。

支持 Codex、Claude Code、Hermes 类 Agent 和 OpenClaw 接入。

### 快速开始

让你的 Agent 安装这个 skill：

```text
Read https://github.com/TengShao/figma2demo and install Figma2Demo for this agent. Use the matching adapter in adapters/ as onboarding guidance, but do not treat adapters/ as a runtime dependency. Copy the runtime skill files only, then tell me how to reload the agent.
```

安装后直接触发：

```text
使用 $figma2demo 处理这个 Figma 链接。
```

### Agent 适配

`adapters/` 用来说明 Figma2Demo 在不同 agent 里的接入方式，不是运行时依赖；最终安装的 skill 只需要 `SKILL.md`、`catalog.json`、`templates/`、`effects/`、`parameters/`、`references/`、`scripts/` 和 `assets/`。

| Agent | 适配文件 | 入口 |
| --- | --- | --- |
| Codex | `SKILL.md`, `agents/openai.yaml` | `Use $figma2demo ...` |
| Claude Code | `adapters/claude-code.md` | `/figma2demo ...` |
| Hermes / 通用 Agent | `adapters/hermes.md` | `/figma2demo ...` |
| OpenClaw | `adapters/openclaw.md` | `/figma2demo create <figma-url>` |

### 两条输出线

两条线都从同一个高保真基础开始：

```text
Figma -> 已确认的 1:1 HTML 还原稿
```

然后用户可以选择其中一条，或者两条都要：

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
8. MP4 导出成功后，如果还未生成前端模式，则再次询问是否需要。

**前端模式**

1. 检查 Figma MCP 是否可用。
2. 将 Figma 设计稿 1:1 还原成静态 HTML。
3. 让用户确认视觉还原。
4. 基于已确认 HTML 导出前端模式 React/Vite/TypeScript 前端项目。

### 演示模式

演示模式是面向沟通展示的输出。它会基于已确认的 HTML 还原稿，按模板、特效包和参数生成可以高度自定义的产品演示动画，并通过确定性的帧捕获和编码流程导出 MP4。

适合产品汇报、方案评审、销售演示、发布预告，或任何需要把静态设计转成可播放产品叙事的场景。

### 前端模式

前端模式是视觉还原确认后的可选输出。它会基于已确认的 HTML 还原稿生成一个自包含的 React/Vite/TypeScript 前端项目，保留从 Figma 导出的真实素材，并把明显的结构转换为组件、mock data 和 CSS tokens。

第一版刻意定位为可运行、可构建、可继续开发的前端起点，而不是生产可上线应用。移动端断点、真实 API、权限、路由、埋点，以及接入现有代码库，都留到正式前端开发阶段处理。

### 还原标准

- Figma 是布局、素材、字体、颜色、阴影、蒙版和状态的唯一视觉事实来源。
- 图标、logo、矢量标记必须从 Figma 导出为真实素材，优先 SVG。
- 禁止用 CSS 或近似图标库重画图标类元素。
- 如果特殊字体不可用且无法打包，相关文字应从 Figma 转为矢量轮廓。
- 如果 Figma MCP 不可用，技能应该停止执行，而不是假装能输出 1:1 还原结果。

### 目录结构

```text
SKILL.md                  核心流程和质量规则
adapters/                 不同 Agent 的接入说明，不是运行时文件
catalog.json              模板、特效包、参数索引
templates/                可复用演示模板
effects/                  可选动画特效包
parameters/               模板参数
references/               维护、前端导出和 MP4 导出细节
scripts/                  帧捕获和 MP4 导出脚本
assets/                   默认鼠标等共享运行时素材
agents/openai.yaml        Codex 界面元数据
```

### 维护模板库

可复用能力放在：

- `templates/`：演示模板
- `effects/`：可选动画特效
- `parameters/`：模板内部使用的逻辑、节奏或导出规则
- `catalog.json`：所有元数据、文件路径、标签、影响区域和冲突关系

维护流程见 `references/maintenance.md`，前端项目导出见 `references/frontend-mode.md`，MP4 导出细节见 `references/export.md`。当前内置项见 `catalog.json`。
