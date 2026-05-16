---
tags:
  - vibe-coding
  - claude-code
---

# Vibe Coding 实用操作手册

记录在 Vibe Coding 过程中，觉得有用的命令、想法或操作。

## 目录

- [[#命令类型速查]]
- [[#换行输入]]
- [[#常用别名]]
- [[#会话的结束与恢复]]
- [[#/rewind]]
- [[#/btw — 临时提问不入历史]]
- [[#Shift + Tab — 权限模式切换]]
- [[#/init — 初始化 CLAUDE.md]]
- [[#! — 临时终端命令]]
- [[#上下文管理]]
- [[#/agents — 自定义子 Agent]]
- [[#/plugin — 插件管理]]

---

## 命令类型速查

| 前缀   | 例子                                    | 时机                | 作用对象        |
| ---- | ------------------------------------- | ----------------- | ----------- |
| `/`  | `/rewind`、`/plan`                     | 对话进行中输入           | Claude 应用本身 |
| `--` | `--continue`、`--permission-mode plan` | 启动时加在 `claude` 后面 | 程序启动参数      |
| `!`  | `! git status`                        | 对话进行中输入           | 直接执行终端命令    |

**关于 `--` 开头的东西（flag）**：

- `--continue`、`--dangerously-skip-permissions` 这种有就生效、没有就不生效的开关，叫 **flag**
- `--permission-mode plan` 这种需要跟一个值的，更准确叫 **option**，但日常混叫 flag 也没问题
- 多个 flag 之间**顺序可以任意调换**，效果完全一样：
  ```bash
  claude --continue --dangerously-skip-permissions
  claude --dangerously-skip-permissions --continue  # 等价
  ```

---

## 换行输入

在对话框中换行而不提交的两种方式：

- `Option + Enter` — 直接换行
- `\` 结尾后按 Enter — 反斜杠换行，下一行继续输入

---

## /rewind

**作用**：把对话上下文回滚到之前某个节点，从那个时间点重新开始对话。

**影响范围**：
- ✅ 仅回滚 Claude 的对话记忆——它不再知道 rewind 之后发生的事
- ❌ 不会撤销已写入磁盘的文件——之前生成的 HTML、代码文件等照常保留

**适合用来**：觉得某个回答方向走偏了，退回去换一个角度重新问。

**注意**：rewind 之后如果继续让 Claude 修改文件，它会基于"旧的认知"操作，可能不知道后来生成的版本，有覆盖风险。

---

## /btw — 临时提问不入历史

**作用**：问一个"顺带一提"的问题——Claude 能看到当前完整上下文，但这条 Q&A **不会写入对话历史**，也复用当前缓存，几乎不消耗额外 token。

**适合用来**：临时确认一个小问题（"这个函数是干嘛的？"、"这个词怎么翻译？"），不想让这条无关紧要的问答污染主对话线。

---

## Shift + Tab — 权限模式切换

**作用**：在 Claude Code CLI 中循环切换权限模式，控制 Claude 执行操作时是否需要逐一询问确认。

**默认循环顺序**：

```
default → acceptEdits → plan
```

| 模式 | 行为 |
| --- | --- |
| `default` | 每次读写、执行命令都需要确认 |
| `acceptEdits` | 文件编辑自动通过，命令仍需确认 |
| `plan` | 只读探索，不执行任何修改，写出计划后再决定 |

**扩展模式**（需要额外条件才会出现在循环中）：

- `bypassPermissions`：跳过所有权限检查，完全无需确认。**必须在启动时加 flag 才会进入循环**：
  ```bash
  claude --dangerously-skip-permissions
  # 或
  claude --allow-dangerously-skip-permissions  ← 加入循环但不立即激活
  ```

- `auto`：由 AI 分类器后台审查每个操作，自动决定是否放行，无需手动确认。需要 Max/Team/Enterprise 账户且满足模型要求才会出现。

> [!warning] bypassPermissions 的关键限制
> 如果启动会话时没有带对应 flag，**中途无法通过 Shift+Tab 切换到 bypassPermissions**，必须重新启动。

**实用场景**：

- `plan` → 让 Claude 先研究代码、写出方案，确认后再执行
- `bypassPermissions` → 完全信任 Claude、不想被打断时用（适合在隔离环境/容器中跑）
- 两者结合：先用 `plan` 看方案，满意了再切到 `bypassPermissions` 一气呵成执行

> [!tip] 启动时直接指定模式
> ```bash
> claude --permission-mode plan
> ```
> 也可以在 `.claude/settings.json` 里设置默认模式，这样每次打开都是你想要的状态。

---

## 常用别名

配置在 `~/.zshrc` 里的快捷启动命令：

| 别名 | 等价命令 | 用途 |
| --- | --- | --- |
| `claudep` | `claude --dangerously-skip-permissions` | 启动 Claude，直接进入 bypass 模式 |
| `ob` | `cd Teemo Obsidian && claude` | 进入 Obsidian vault 并启动 Claude（普通模式）|
| `obx` | `cd Teemo Obsidian && claude --dangerously-skip-permissions` | 进入 Obsidian vault 并启动 Claude（bypass 模式）|

---

## 会话的结束与恢复

**结束会话**：在对话框输入 `exit`，结束当前 session。

**恢复会话**：重新打开终端后，用以下任一命令恢复最近的会话：

```bash
claude --continue
claude --resume
```

两者效果相同，恢复的是**对话上下文**（聊天记录）。如果你是在已经打开 Claude 之后的前提下去操作，也可以用 /continue 或者 /resume 来执行命令，效果是一样的。

> [!warning] Bypass 权限不会随会话保留
> `--continue` / `--resume` 只恢复对话内容，不恢复启动时的 flag。
> 如果原来的会话是 bypass 模式，退出后重新 `claude --continue`，**bypass 不再生效**，会回到默认模式。
>
> 想同时恢复上下文 + bypass，需要显式加上 flag：
> ```bash
> claude --continue --dangerously-skip-permissions
> ```

---

## /init — 初始化 CLAUDE.md

**作用**：扫描当前代码项目，自动生成 `CLAUDE.md` 文件，让 Claude 了解项目背景。

> `CLAUDE.md` 是给 Claude 看的指令文件（不是 `README.md`）。每次新会话启动时 Claude 会自动读取它，免去每次重新解释项目背景。

**适合的场景**：拿到一个已有的代码项目，还没有 `CLAUDE.md`，用 `/init` 一键生成。

**如果已有 `CLAUDE.md`**：再跑 `/init` 会在现有基础上补充更新，不会清空。但通常不需要——已有文件直接手动编辑更精准。

**不适合的场景**：Obsidian vault 这类非代码项目，`/init` 是为代码库设计的，扫出来的内容没什么用。

---

## ! — 临时终端命令

**作用**：在 Claude Code 对话框里，输入 `!` 开头即可直接执行终端命令，无需退出对话。

**用法**：

```
! ls
! git status
! open .
```

**实用场景**：
- 快速查看文件、目录结构
- 执行 Claude 需要你手动完成的命令（如 `gcloud auth login` 这类需要交互登录的操作）
- 命令的输出会直接出现在对话里，Claude 可以看到并据此继续工作

---

## 上下文管理

### 什么是上下文？

上下文是模型当前的"工作记忆"——包括本次会话中所有的对话、Claude 读取的文件内容、工具执行结果、系统提示等，全部打包在一起送给模型处理。单位是 **token**（约 3/4 个英文单词，或半个汉字）。

Claude Code 默认的上下文窗口是 **200k tokens**。使用 `/context` 可以随时查看当前占用比例。

**上下文高低的影响**：

| 情况 | 影响 |
| --- | --- |
| 上下文较低 | 响应更快，成本更低，有充足空间继续工作 |
| 上下文较高 | 响应变慢，成本上升，早期细节可能被"淡化" |
| 上下文快满 | 必须压缩或清空，否则无法继续对话 |

### 管理命令

| 命令 | 作用 |
| --- | --- |
| `/context` | 查看当前上下文占用（已用 / 总量 / 百分比） |
| `/compact` | 压缩上下文——把历史对话总结成摘要，释放空间但保留关键信息 |
| `/clear` | 清空上下文——完全重置，Claude 忘记本次会话的一切内容 |
| `/skills` | 查看当前已安装的所有 skill |

> [!tip] compact vs clear
> - `/compact`：保留"记忆精华"，适合长会话中途释放空间、继续工作
> - `/clear`：彻底清零，适合换一个完全不相关的新任务时用

---

## /agents — 自定义子 Agent

**作用**：创建和管理自定义子 Agent——每个 Agent 是一个有独立系统提示、独立工具权限、独立上下文的"专家分身"。

**首次推出**：v1.0.60

### 和普通对话的核心区别

子 Agent 运行在**完全隔离的 context window** 里，主对话不会被它的中间过程污染——任务完成后只把摘要回传给主对话。

| 维度 | 普通主对话 | 子 Agent |
| --- | --- | --- |
| 上下文 | 共享，持续累积 | 独立隔离 |
| 系统提示 | Claude Code 默认 | Agent `.md` 文件内容 |
| 工具权限 | 继承全部 | 可单独限制 |
| 模型 | 主会话模型 | 可单独指定 |
| 输出 | 直接展示 | 只回传摘要 |

### Agent 配置文件

存放路径：
- `~/.claude/agents/`（用户级，全局生效）
- `.claude/agents/`（项目级，仅当前项目）

格式为 `.md` 文件，frontmatter 定义配置，正文是系统提示：

```markdown
---
name: code-reviewer
description: 代码审查专家，修改代码后自动触发
model: sonnet
tools: Read, Grep, Glob
---

你是一个资深代码审查专家...
```

### 调用方式

1. **自然语言**：直接描述任务，Claude 自动判断是否派 Agent
2. **@ 提及**：`@"code-reviewer (agent)"` 强制指定
3. **启动时指定**：`claude --agent code-reviewer`（整个会话用该 Agent 的配置）

### Claude Code 内置三个 Agent

| Agent | 模型 | 工具限制 | 用途 |
| --- | --- | --- | --- |
| `Explore` | Haiku | 只读 | 代码库搜索 |
| `Plan` | - | 只读 | 规划方案 |
| `General-purpose` | - | 全部 | 复杂多步任务 |

> [!warning] 关键限制
> 子 Agent 不能再派生其他子 Agent（防止无限递归）。另外，手动编辑 `.claude/agents/` 文件后需重启 session 才能加载；通过 `/agents` 界面创建则即时生效。

---

## /plugin — 插件管理

**作用**：安装和管理插件。插件是可以打包 slash 命令、子 Agent、MCP server、hook 的扩展包，从插件市场一键安装即可扩展 Claude Code 的能力。

**常用操作**：

```bash
/plugin install {插件名}   # 安装插件
/plugin                    # 打开插件管理界面
```

**和 skill 的区别**：skill 是单个 `.md` 文件（一项能力），plugin 是一个打包好的扩展，可以同时带多个 skill、agent、MCP server。
