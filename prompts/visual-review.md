# Visual Fidelity Review Prompt

Use this prompt after the static HTML restoration, provenance files, focused review crops, and `scripts/review_static.js` all pass.

## English

```text
The static restoration is ready for visual review.

I checked:
- icon/vector provenance against exported Figma assets
- complex layer provenance for masks, overlays, opacity, blend, and z-order
- text and auto-layout bounds for spacing-sensitive regions
- focused review crops

Please review the HTML preview against the Figma source. Are the layout, typography, icons, colors, shadows, radius, spacing, assets, and visible text accurate enough to approve the visual restoration?
```

## Chinese

```text
静态还原稿可以进入视觉确认了。

我已经检查：
- 图标/矢量 provenance 与 Figma 导出素材
- 复杂图层 provenance，包括蒙版、叠层、透明度、混合模式和层级
- 文字与 auto-layout 边界，包括间距敏感区域
- 局部 review crops

请对照 Figma 源稿检查 HTML 预览。布局、字体、图标、颜色、阴影、圆角、间距、素材和可见文案是否已经准确到可以确认视觉还原？
```
