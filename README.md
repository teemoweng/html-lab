# html-lab

Teemo 的 HTML 实验室——用可交互页面学习和呈现知识。

每个 topic 是一个独立文件夹，包含一份持续更新的活文档（`.md`）和一或多个版本化的 HTML 交付物（`.html`）。所有 HTML 页面完全自包含，无外部依赖，可离线打开。

---

## 当前项目

| 项目 | 说明 |
|------|------|
| [PM 交互设计参考库](pm-interaction-guide/pm-interaction-guide.html) | 可交互的 UI/UX 教学演示页，涵盖状态、反馈、导航、交互模式等概念，附 PM 沟通话术 |
| [Claude Code 使用指南](claude-code-guide/claude-code-guide.html) | Claude Code CLI 工具的使用说明 |
| [Claude 的"记忆"系统](claude-memory-system/claude-memory-system.html) | CLAUDE.md 与 memory 操作手册：两种机制、四象限决策、实战协议 |
| [CLI vs MCP · AI 怎么用工具](cli-vs-mcp/cli-vs-mcp.html) | 用一个建文档任务对照 CLI / MCP 两条路径，交互式 step-through 展现差异 |
| [Teemo 的技术栈](tech-stack/tech-stack.html) | 个人技术栈介绍 |
| [Ghostty 终端教程](ghostty-tutorial/ghostty-tutorial.html) | Ghostty 终端配置与使用 |
| [Oh My Zsh 配置指南](oh-my-zsh-guide/oh-my-zsh-guide.html) | Zsh 环境配置 |
| [网易互娱 AI 笔试](netease-ai-game/index.html) | 《金铲铲之战》AI 个性化活动推送方案 |

导航页：[index.html](index.html)

---

## 约定

- `.md` 是源，`.html` 是产物，不直接编辑 HTML 来修改内容
- 版本只增不减，新版用 `-v2`、`-v3` 后缀
- HTML 自包含，不依赖任何 CDN
