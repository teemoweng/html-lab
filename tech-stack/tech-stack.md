# 我的工具栈

## 一、AI 核心工具

### Claude 系列（主力）

| 工具 | 使用方式 | 主要场景 |
|------|----------|----------|
| Claude macOS 客户端 | Chat | 日常轻量聊天、PDF/Word 简单编辑 |
| Claude macOS 客户端 | Co-work | 学校作业、调研整理类项目（非开发） |
| Claude Code | CLI（Ghostty） | Vibe Coding、产品设计开发 |

> Claude Code 已全面转向 CLI 模式。亮点：Remote Control 功能，可在手机上无缝衔接终端项目。

### 其他大模型

| 工具 | 状态 | 主要场景 |
|------|------|----------|
| ChatGPT（OpenAI） | 常用 | 日常备选；GPT Image 2 生图能力突出 |
| DeepSeek | 常用 | API 接入个人项目，性价比极高 |
| Gemini（Google） | 基本不用 | 暂无明确使用场景 |

---

## 二、语音输入

| 平台 | 工具 | 主要场景 |
|------|------|----------|
| 电脑端 | Typeless | 大规模使用；支持个人词库，识别准确率高 |
| 手机端 | 豆包输入法 | 日常聊天 |
| 手机端 | Typeless | 与 AI 沟通，配合 Remote Control 使用 |

---

## 三、知识库与文件管理

**核心理念：AI Native 体系 — Obsidian、飞书、GitHub 均可由 Claude Code 从终端统一管理**

| 工具 | 职责 |
|------|------|
| Obsidian | AI 工作台与中转枢纽。`.md` / HTML 天然可被 Claude Code 读写；内含 `Projects/`（工程项目，与 GitHub 完全同步）、`飞书/`（生产飞书文档的规范与中间产物暂存）、`Clippings/`（将网页转为 `.md` 的临时中转区）、`Wiki/`（Claude 自发维护的知识积累区）。所有对外平台的产出均先在 Obsidian 中转与规范化，再交付 |
| 飞书 | 交付给人阅读的内容平台；通过飞书 CLI + MCP，Claude Code 可在终端直接管理 |
| GitHub | Obsidian `Projects/` 的同步存储；有 CLI，天然接入 Claude Code |
| Typora | 本地 `.md` 阅读与编辑，界面简洁优雅；链路中唯一的纯人工工具，暂无 CLI / MCP |

> Obsidian 相当于一个大型文件管理系统：既是 Claude 的核心工作台，也是所有产出流向外部平台前的规范化中转站。

---

## 四、终端 & 编程工具

| 工具 | 定位 | 说明 |
|------|------|------|
| Ghostty | 终端模拟器（主力） | 运行 Claude Code CLI，比 Terminal 更好看 |
| Claude Code | AI 编程工具（主力） | CLI 模式，核心开发工具 |
| Codex | AI 编程工具（备选） | OpenAI 的 CLI 编程工具，最近较少使用 |
| VS Code | IDE（基本不用） | 已被 Ghostty + Claude Code 替代 |

---

## 五、创作与设计

| 类型 | 工具 | 说明 |
|------|------|------|
| 生图 | ChatGPT（GPT Image 2） | 生图能力突出，单独列出 |
| 文生视频 | 即梦 AI | 主力视频生成工具 |
| 演示 / 白板 | Excalidraw、Excalicord | 由张 Zara 部署建立 |
| Claude Design | 前端设计 / PPT | 可做前端页面设计，PPT 功能探索中；部分场景已被 Claude Code 替代 |
| CleanShot X | 截屏 / 录屏 | 截屏与录屏合一 |

---

## 六、资讯

| 工具 | 说明 |
|------|------|
| AI Hot 导航站 | 由"数字生命卡兹克"维护，用于获取 AI 行业资讯 |

---

## 七、邮件管理

| 工具 | 管理邮箱 | 状态 |
|------|----------|------|
| 网易邮箱大师 | 163、Gmail | 主力，体验最稳定 |
| Outlook | 学校邮箱 | 毕业后账号回收，临时使用 |
| Filo | Gmail | 在试用中，体验待观察 |

---

## 备注

- DeepSeek 作为 API 接入个人项目，是目前性价比最高的模型选择。
- `.md` 格式是整个工作流的核心载体，兼顾本地编辑、AI 处理、Git 存储、工具渲染四个维度。

---

## 八、工作流（Workflow）

### A. Project 工作流

适用于最终产物为可访问页面或应用的项目。

#### A1. 静态 HTML 项目

1. **启动**：在 Ghostty 终端运行 Claude Code，链接到 Obsidian 对应 Project 文件夹
2. **文档填充**：建立 `CLAUDE.md` 及各类 `.md` 文件，为 AI 提供完整项目上下文
3. **设计执行**：调用 skills 生成 spec 文档，明确需求后由 Claude Code 执行
4. **部署**：发布到 GitHub Pages，生成可分享链接

#### A2. Web / App 项目（探索阶段）

在 A1 基础上，额外涉及前后端技术栈，如：
- 前端框架（如 React）
- 后端 / 数据库（如 Supabase）
- 部署平台（如 Railway、Vercel）

相关工具均有 CLI / MCP，可由 Claude Code 在终端统一调用。

---

### B. 知识库工作流

适用于知识沉淀与内容交付场景。

#### B1. 富文本知识库 → HTML

当内容需要交互效果、复杂渲染或便捷分享时（如交互设计参考库），直接复用 **A1 工作流**，无需后端。

#### B2. 日常知识沉淀 → 飞书

**核心流程（Claude Code 介入）：**
1. 启动 Claude Code，指向 Obsidian `飞书/` 文件夹（规范与模板在此）
2. 新建 Topic 文件夹 + 对应 `.md` 文件
3. Claude Code 依据 `.md` 生成飞书产物（文档、表格等）

**轻量流程（手动）：**
- 直接在飞书上编辑或修改现有文档，无需 Claude Code 介入

涵盖范围：学习、工作、生活记录，以及所有非 Project 类内容。

---

### C. 极简工作流

- **小红书 / 抖音内容**：CleanShot X 截屏 / 录屏，直接发布
