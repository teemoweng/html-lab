# PM 交互指南 · 词汇表 Popover 演示 — 设计文档

**日期**: 2026-05-16
**目标产物**: `pm-interaction-guide/pm-interaction-guide-v2.html`
**保留**: `pm-interaction-guide/pm-interaction-guide.html`（v1 不动）

---

## 背景

`pm-interaction-guide.html` 的附录「组件词汇表」每个词条目前只有文字（名称、中文名、解释、PM 话术示例），缺乏可视化实例。PM 看到「Toggle」「Chip」这些词时仍需脑补外观。本次迭代为每个词条增加 **Hover Popover 演示**，让 PM 在不离开词汇表的情况下直观感受组件外观和行为。

## 用户故事

PM 浏览词汇表 → hover 到任一组件卡片 → 旁边弹出迷你交互演示卡片 → 鼠标离开后自动收起。

---

## 设计决策

### 交互
| 项 | 决策 |
|----|-----|
| 触发 | Hover 200ms 延迟（防误触） |
| 关闭 | 鼠标离开卡片或 Popover 200ms 延迟（允许鼠标在两者之间移动） |
| 定位 | 智能：默认右侧弹出；卡片右侧空间不足时改为左侧 |
| 进入动画 | `opacity` + `scale(0.96 → 1)`，150ms |
| 卡片 hover 态 | 增加紫色描边 + 轻微上移，作为焦点提示 |

### 视觉
- Popover 宽度 ~240px
- 白底，圆角 12px，深阴影 `0 12px 32px rgba(0,0,0,0.12)`
- 顶部小标签「🎮 演示」
- Demo 元素复用现有 `.demo-btn` / `.demo-chip` / `.demo-input` 等样式

### 实现
- 新增单个全局 `<div id="glossaryPopover">`（参考已有 `globalToast` / `globalModal` / `globalDrawer` 全局元素模式）
- 每个 glossary 卡片增加 `data-demo="<id>"` 属性
- JS 监听卡片的 mouseenter / mouseleave，查表渲染对应 demo 模板
- demo 模板存储在 `GLOSSARY_DEMOS` 对象中（与 `CONCEPTS` 平级）

---

## Demo 内容清单（10 个，全部可交互）

| # | 词条 | `data-demo` | Demo 内容 |
|---|------|-------------|----------|
| 1 | Button | `button` | Primary / Secondary / Ghost / Danger 四种按钮，可点击有 active 反馈 |
| 2 | Chip / Tag | `chip-tag` | 上：3 个可点选 Chip（点击切换 selected）；下：3 个静态分类 Tag |
| 3 | Badge | `badge` | 🔔 图标三种 Badge：红点 / 数字 3 / 99+ 并列展示 |
| 4 | Input / Text Field | `input` | 单行 / 搜索 / 密码 / Textarea 四种，全部可真实输入 |
| 5 | Toggle / Switch | `toggle` | 真实可点击开关，状态文字「通知 开启/关闭」实时同步 |
| 6 | Dropdown / Select | `dropdown` | 城市下拉框，点击展开 4 个选项，可选中并回显 |
| 7 | Checkbox / Radio | `checkbox-radio` | 上：3 个 Checkbox（多选）；下：3 个 Radio（互斥单选） |
| 8 | Avatar | `avatar` | 图片头像 + 缩写「TM」 + 默认 👤 三种回退方式并列 |
| 9 | Scrim / Overlay | `scrim` | 迷你「手机屏」，按钮点击后内部弹小 Modal + 半透明遮罩 |
| 10 | Custom Cursor | `custom-cursor` | 真实自定义光标 hover 区域，鼠标进入后光标变 ✨ 图形 |

---

## 输出与配套更新

- 新文件：`pm-interaction-guide/pm-interaction-guide-v2.html`
- `index.html` 导航：增加 v2 入口
- `html-lab/CLAUDE.md` topic 清单表格：`pm-interaction-guide` 行的 HTML 列改为 `v1 ✅ / v2 ✅`

## 范围外（不在本次做）

- 不修改其他章节（导言、四章正文）的演示
- 不调整侧边栏 / 整体布局 / 配色
- 不做移动端适配（hover 在移动端无意义，该工具定位桌面端）
- 不修改活文档 `.md`（本次迭代是 HTML 增量，活文档之后再补）
