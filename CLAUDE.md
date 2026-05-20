# html-lab — Claude 操作规则

> 每次会话开始时先读本文件，了解项目结构和工作流后再开始工作。

---

## 项目定位

html-lab 是 Teemo 与 Claude 共创的**知识输出实验室**。

- `.md` 文件是**活文档**：记录某个 topic 的研究过程和对话沉淀，持续更新
- `.html` 文件是**版本化交付物**：在合适的时间节点，从 `.md` 生成的可视化页面，供人阅读

一个 topic 的完整生命周期：
```
对话 → topic.md（持续更新）→ topic.html（v1）
                            → topic-v2.html（内容更丰富后）
                            → topic-v3.html（再次迭代）
```

---

## 文件结构

每个 topic 有自己的文件夹，`.md` 和所有版本的 `.html` 放在一起：

```
html-lab/
├── CLAUDE.md
├── README.md
├── index.html              ← 所有 topic 的导航页
│
├── topic-name/             ← 每个 topic 一个文件夹
│   ├── topic-name.md       ← 活文档（唯一，持续更新）
│   ├── topic-name.html     ← v1
│   ├── topic-name-v2.html  ← v2
│   └── topic-name-v3.html  ← v3
│
└── netease-ai-game/        ← 复杂项目（有独立 JS/CSS）
```

**当前 topic 清单：**

| 文件夹 | 活文档 | HTML 版本 | 说明 |
|--------|--------|-----------|------|
| `claude-code-guide/` | `claude-code-guide.md` ✅ | v1 ✅ | Claude Code 使用指南 |
| `tech-stack/` | `tech-stack.md` ✅ | v1 ✅ / v2 ✅ | Teemo 的技术栈介绍 |
| `vibe-coding/` | `vibe-coding.md` ✅ | *(待生成)* | Vibe Coding 操作指南 |
| `react-card-demo/` | *(待建)* | v1 / v2 / v3 ✅ | React 卡片组件演示 |
| `ghostty-tutorial/` | *(待建)* | v1 ✅ | Ghostty 终端教程 |
| `oh-my-zsh-guide/` | *(待建)* | v1 ✅ | Oh My Zsh 配置指南 |
| `didi-ba-interview/` | *(待建)* | v1 ✅ | 滴滴 BA 国际化面试准备 |
| `netease-ai-game/` | 多个 .md ✅ | v1 ✅ | 网易互娱 AI 笔试 |
| `pm-interaction-guide/` | `pm-interaction-guide.md` ✅ | v1 ✅ / v2 ✅ | PM 交互设计参考库 |
| `claude-memory-system/` | `claude-memory-system.md` ✅ | v1 ✅ | Claude Code 记忆系统操作手册（CLAUDE.md vs memory） |
| `cli-vs-mcp/` | `cli-vs-mcp.md` ✅ | v1 ✅ | API / CLI / MCP 概念拆解：用一个建文档任务对照两条路径，含交互式 step-through |

---

## 日常操作

### 操作 1：更新活文档

**触发**：用户说"更新 [topic] 的笔记"、"把这段对话加进去"。

**动作**：
1. 读取对应 `.md` 文件
2. 将新内容追加或整合进合适位置
3. 更新文件顶部的"最后更新"时间戳（如有）

### 操作 2：生成 / 更新 HTML

**触发**：用户说"出一版 HTML"、"更新 HTML"、"生成 v2"。

**动作**：
1. 读取对应 `.md` 文件，理解当前内容全貌
2. 判断是**新建**还是**新版本**：
   - 该 topic 无 HTML → 生成 `topic.html`
   - 已有 HTML → 生成 `topic-v2.html`（或 v3、v4...，以此类推）
3. HTML 要求：
   - 自包含（样式内联，无外部依赖）
   - 适合在浏览器直接打开阅读
   - 视觉质量高，不要生成平淡的纯文本页面

### 操作 3：新建 topic

**触发**：用户说"新建一个关于 [主题] 的笔记"、"开始记录 [主题]"。

**动作**：
1. 创建 `topic-name/` 文件夹
2. 在文件夹内创建 `topic-name.md`，结构：
   ```
   # 标题

   > 开始于 YYYY-MM-DD | 最后更新 YYYY-MM-DD

   ## 背景
   （一句话说明为什么研究这个）

   ## 内容
   （持续填充）
   ```
3. 在本文件的"当前 topic 清单"表格中新增一行

### 操作 4：更新 index.html

**触发**：用户说"更新导航页"，或生成了新 HTML 后用户要求同步。

**动作**：将新的 HTML 文件加入 `index.html` 的导航列表。

---

## 核心约束

1. **`.md` 是源，`.html` 是产物**：不要直接编辑 HTML 来修改内容，应先更新 `.md` 再重新生成
2. **版本只增不减**：旧版 HTML 保留，新版用 `-v2`、`-v3` 后缀区分
3. **HTML 自包含**：所有样式和脚本内联，不依赖外部 CDN（保证离线可读）
4. **活文档不设终态**：`.md` 随时可以继续更新，无需"完成"状态

---

*Schema 版本：v1.1 — 2026-05-16*
*v1.1 变更：改为 topic 文件夹结构，每个 topic 独立一个目录*
