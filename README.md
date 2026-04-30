# Figma2Demo

---

[English](#english) | [中文](#中文)

<a id="english"></a>

Figma2Demo is a Codex skill for turning Figma designs into reviewed, faithful animated HTML demos and MP4 videos.

### Core Concepts

- **Templates**: reusable demo schemes for a family of designs.
- **Effect packs**: optional animation treatments, such as typewriter text or cursor send behavior.
- **Parameters**: template-only logic, timing, or export rules.

### Requirements

- A working Figma MCP connection is required for demo production.
- The skill must be able to read the target Figma file or node through MCP.
- Figma is the source of truth for layout, assets, typography, colors, shadows, masks, and states.

If Figma MCP is unavailable, the skill should stop instead of pretending to produce a 1:1 restoration.

### Structure

```text
SKILL.md                  Core workflow and quality rules
catalog.json              Template, effect, and parameter index
templates/                Reusable demo schemes
effects/                  Optional animation effect packs
parameters/               Template-only parameters
references/               Maintenance and export references
scripts/                  Frame capture and MP4 helpers
agents/openai.yaml        Codex UI metadata
```

### Usage

Provide these inputs when invoking the skill:

1. Figma design URL
2. Demo name
3. Template id
4. Animation starting module
5. Modules that should appear or react together
6. Optional effect packs

Example:

```text
Use $figma2demo to create a demo named "Agent Workflow Review" from this Figma link.
Template: ugc-agent.
Start from the composer.
Link uploaded files, knowledge search, service results, and final analysis.
Use typewriter and cursor-send effects.
```

The workflow has three review gates:

1. Visual fidelity review
2. Animation review
3. MP4 export

After animation approval, if reusable special requirements emerged during the conversation, the skill can ask whether to update the current template or create a new one before exporting.

### Fidelity Rules

- Restore the Figma design 1:1.
- Export icons, logos, and vector marks from Figma as real assets, preferably SVG.
- Do not recreate icon-like layers with CSS or approximate icon libraries.
- If a special font is unavailable and cannot be bundled, convert the affected Figma text to vector outlines.
- Do not simplify detailed artwork unless the user explicitly approves the tradeoff.

### Maintaining The Library

To add or modify reusable behavior:

- Copy `templates/_template.md` for new templates.
- Copy `effects/_effect.md` for new effect packs.
- Copy `parameters/_parameter.md` for template parameters.
- Update `catalog.json` in the same change.

Use `references/maintenance.md` for the guided maintenance flow and `references/export.md` for capture/encoding details.

### Current Built-ins

Templates:

- `ugc-agent`: agent-style workspace demo flow.

Effect packs:

- `typewriter`: character-by-character generated text reveal.
- `cursor-send`: cursor, composer, and send interaction choreography.

Parameters:

- `agentic-workflow-rhythm`: request/context/retrieval/service/synthesis timing rhythm.

---

<a id="中文"></a>

Figma2Demo 是一个 Codex 技能，用来把 Figma 设计稿还原成可审阅的动画 HTML 演示，并导出 MP4 视频。

### 核心概念

- **模板**：面向一类设计稿的可复用演示方案。
- **特效包**：普通用户可选择叠加的动画效果，例如打字机或光标发送。
- **参数**：模板内部静默启用的特殊逻辑、节奏或导出规则。

### 依赖

- 生成演示依赖可用的 Figma MCP。
- 技能必须能通过 MCP 读取目标 Figma 文件或节点。
- Figma 是布局、素材、字体、颜色、阴影、蒙版和状态的唯一视觉事实来源。

如果 Figma MCP 不可用，技能应该停止执行，而不是假装能输出 1:1 还原结果。

### 目录结构

```text
SKILL.md                  核心流程和质量规则
catalog.json              模板、特效包、参数索引
templates/                可复用演示模板
effects/                  可选动画特效包
parameters/               模板参数
references/               维护和导出细节
scripts/                  帧捕获和 MP4 导出脚本
agents/openai.yaml        Codex 界面元数据
```

### 使用方式

调用技能时提供以下信息：

1. Figma 设计稿链接
2. 演示名称
3. 模板 id
4. 动画起点模块
5. 需要联动出现或响应的模块
6. 可选特效包

示例：

```text
使用 $figma2demo 基于这个 Figma 链接创建一个名为“Agent Workflow Review”的演示。
模板：ugc-agent。
从输入框开始动画。
上传文件、知识检索、服务结果和最终分析需要联动出现。
使用 typewriter 和 cursor-send 特效包。
```

工作流包含三个确认门：

1. 视觉还原确认
2. 动画效果确认
3. MP4 导出确认

动画确认后，如果对话中产生了可复用的特殊要求，技能可以在导出前询问是否更新当前模板或新增模板。

### 还原标准

- 必须 1:1 还原 Figma 设计稿。
- 图标、logo、矢量标记必须从 Figma 导出为真实素材，优先 SVG。
- 禁止用 CSS 或近似图标库重画图标类元素。
- 如果特殊字体不可用且无法打包，相关文字应从 Figma 转为矢量轮廓。
- 未经用户明确同意，不得简化复杂设计细节。

### 维护模板库

新增或修改可复用能力时：

- 复制 `templates/_template.md` 新增模板。
- 复制 `effects/_effect.md` 新增特效包。
- 复制 `parameters/_parameter.md` 新增模板参数。
- 同步更新 `catalog.json`。

更多维护流程见 `references/maintenance.md`，导出细节见 `references/export.md`。

### 当前内置项

模板：

- `ugc-agent`：面向智能体工作台的演示流程。

特效包：

- `typewriter`：逐字显示生成内容。
- `cursor-send`：光标、输入框和发送动作编排。

参数：

- `agentic-workflow-rhythm`：请求、上下文、检索、服务和总结阶段的节奏控制。
