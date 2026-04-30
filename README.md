# Figma2Demo

---

[English](#english) | [中文](#中文)

<a id="english"></a>

Figma2Demo is a reusable skill package for turning Figma designs into reviewed, faithful animated HTML demos and MP4 videos. It includes adapters for Codex, Claude Code, Hermes-style agents, and OpenClaw.

### Quick Start

Copy this prompt to your agent:

```text
Read https://github.com/TengShao/figma2demo and install Figma2Demo for this agent. Decide where this agent keeps reusable skills or instructions, copy the required files there, configure the matching adapter from adapters/, and tell me how to reload the agent.
```

Then create a demo with:

```text
Use $figma2demo to create a demo named "Agent Workflow Review" from this Figma link.
Template: agent-workspace.
Start from the composer.
Link uploaded files, knowledge search, service results, and final analysis.
Use typewriter and cursor-send effects.
```

### Agent Adapters

| Agent | Adapter | Entry |
| --- | --- | --- |
| Codex | `SKILL.md`, `agents/openai.yaml` | `Use $figma2demo ...` |
| Claude Code | `adapters/claude-code.md` | `Use Figma2Demo ...` |
| Hermes / generic agents | `adapters/hermes.md` | `Use the Figma2Demo workflow.` |
| OpenClaw | `adapters/openclaw.md` | `/figma2demo create <figma-url>` |

### Workflow

1. Check Figma MCP access.
2. Restore the Figma design as a 1:1 static HTML stage.
3. Review visual fidelity with the user.
4. Animate with the selected template, effect packs, and parameters.
5. Review animation with the user.
6. Ask whether reusable changes should update or create a template.
7. Export MP4.

### Fidelity Rules

- Figma is the source of truth for layout, assets, typography, colors, shadows, masks, and states.
- Icons, logos, and vector marks must be exported from Figma as real assets, preferably SVG.
- Do not recreate icon-like layers with CSS or approximate icon libraries.
- If a special font is unavailable and cannot be bundled, convert the affected Figma text to vector outlines.
- If Figma MCP is unavailable, stop instead of pretending to produce a 1:1 restoration.

### Repository Layout

```text
SKILL.md                  Core workflow and quality rules
adapters/                 Agent-specific setup notes
catalog.json              Template, effect, and parameter index
templates/                Reusable demo schemes
effects/                  Optional animation effect packs
parameters/               Template-only parameters
references/               Maintenance and export references
scripts/                  Frame capture and MP4 helpers
agents/openai.yaml        Codex UI metadata
```

### Library Maintenance

Reusable behavior lives in:

- `templates/`: demo schemes
- `effects/`: optional animation treatments
- `parameters/`: template-only logic, timing, or export rules
- `catalog.json`: all metadata, file paths, tags, touched areas, and conflicts

Use `references/maintenance.md` for guided updates and `references/export.md` for capture/encoding details. See `catalog.json` for the current built-ins.

---

<a id="中文"></a>

Figma2Demo 是一个可复用技能包，用来把 Figma 设计稿还原成可审阅的动画 HTML 演示，并导出 MP4 视频。它包含 Codex、Claude Code、Hermes 类 Agent 和 OpenClaw 的适配说明。

### 快速开始

把这段提示词复制给你的 Agent：

```text
Read https://github.com/TengShao/figma2demo and install Figma2Demo for this agent. Decide where this agent keeps reusable skills or instructions, copy the required files there, configure the matching adapter from adapters/, and tell me how to reload the agent.
```

然后这样创建演示：

```text
使用 $figma2demo 基于这个 Figma 链接创建一个名为“Agent Workflow Review”的演示。
模板：agent-workspace。
从输入框开始动画。
上传文件、知识检索、服务结果和最终分析需要联动出现。
使用 typewriter 和 cursor-send 特效包。
```

### Agent 适配

| Agent | 适配文件 | 入口 |
| --- | --- | --- |
| Codex | `SKILL.md`, `agents/openai.yaml` | `Use $figma2demo ...` |
| Claude Code | `adapters/claude-code.md` | `Use Figma2Demo ...` |
| Hermes / 通用 Agent | `adapters/hermes.md` | `Use the Figma2Demo workflow.` |
| OpenClaw | `adapters/openclaw.md` | `/figma2demo create <figma-url>` |

### 工作流

1. 检查 Figma MCP 是否可用。
2. 将 Figma 设计稿 1:1 还原成静态 HTML。
3. 让用户确认视觉还原。
4. 按模板、特效包和参数实现动画。
5. 让用户确认动画效果。
6. 询问是否把可复用要求更新到模板或新增模板。
7. 导出 MP4。

### 还原标准

- Figma 是布局、素材、字体、颜色、阴影、蒙版和状态的唯一视觉事实来源。
- 图标、logo、矢量标记必须从 Figma 导出为真实素材，优先 SVG。
- 禁止用 CSS 或近似图标库重画图标类元素。
- 如果特殊字体不可用且无法打包，相关文字应从 Figma 转为矢量轮廓。
- 如果 Figma MCP 不可用，技能应该停止执行，而不是假装能输出 1:1 还原结果。

### 目录结构

```text
SKILL.md                  核心流程和质量规则
adapters/                 不同 Agent 的适配说明
catalog.json              模板、特效包、参数索引
templates/                可复用演示模板
effects/                  可选动画特效包
parameters/               模板参数
references/               维护和导出细节
scripts/                  帧捕获和 MP4 导出脚本
agents/openai.yaml        Codex 界面元数据
```

### 维护模板库

可复用能力放在：

- `templates/`：演示模板
- `effects/`：可选动画特效
- `parameters/`：模板内部使用的逻辑、节奏或导出规则
- `catalog.json`：所有元数据、文件路径、标签、影响区域和冲突关系

维护流程见 `references/maintenance.md`，导出细节见 `references/export.md`。当前内置项见 `catalog.json`。
