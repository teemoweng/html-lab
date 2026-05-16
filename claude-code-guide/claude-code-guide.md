# Claude Code 命令手册

> 沉淀于 2026-05-14

## 背景

询问 Claude Code v2.1.141 中所有可用命令的完整列表，并按使用频率分类整理。

---

## 核心内容

### 标注说明

- ⭐ 最常用
- 🔧 配置类
- 🧪 进阶 / 调试类

---

### 一、CLI 启动参数

| 参数                                   | 功能                                       | 频率  |     |
| ------------------------------------ | ---------------------------------------- | --- | --- |
| `claude`                             | 直接启动交互式会话                                | ⭐   |     |
| `-p / --print`                       | 非交互模式，输出后退出，适合脚本/管道                      | ⭐   |     |
| `-c / --continue`                    | 继续当前目录最近一次对话                             | ⭐   |     |
| `-r / --resume`                      | 按 ID 恢复历史对话，或弹出选择器                       | ⭐   |     |
| `--model`                            | 指定模型，如 `opus`、`sonnet`、`haiku`           | ⭐   |     |
| `-n / --name`                        | 给本次会话起名，方便后续识别                           | 🔧  |     |
| `--effort`                           | 设置努力程度：low / medium / high / xhigh / max | 🔧  |     |
| `--worktree`                         | 自动新建 git worktree 隔离运行                   | 🧪  |     |
| `--permission-mode`                  | 设置权限模式，如 `auto`（自动允许）、`plan`（只规划不执行）     | 🔧  |     |
| **`--dangerously-skip-permissions`** | 跳过所有权限确认（仅沙箱环境）                          | 🧪  |     |
| `--allowedTools`                     | 指定本次会话允许的工具                              | 🔧  |     |
| `--disallowedTools`                  | 指定本次会话禁止的工具                              | 🔧  |     |
| `--mcp-config`                       | 加载指定 MCP 配置文件                            | 🔧  |     |
| `--system-prompt`                    | 替换默认系统提示词                                | 🧪  |     |
| `--append-system-prompt`             | 在默认系统提示词后追加内容                            | 🧪  |     |
| `--debug`                            | 开启调试模式                                   | 🧪  |     |
| `--output-format`                    | 输出格式：text / json / stream-json           | 🧪  |     |
| `--max-budget-usd`                   | 限制本次会话最多花多少钱（仅 `--print` 模式）             | 🔧  |     |
| `--bare`                             | 极简模式，跳过 hooks、LSP、插件同步等一切附加功能            | 🧪  |     |
| `--remote-control`                   | 开启远程控制模式，让另一个 agent 发送消息                 | 🧪  |     |
| `--ide`                              | 自动连接到 IDE（VS Code / JetBrains）           | 🔧  |     |
| `--from-pr`                          | 恢复与某个 GitHub PR 关联的会话                    | 🧪  |     |

---

### 二、CLI 子命令（`claude <命令>`）

#### `claude agents` ⭐
查看所有正在后台运行的 agent 会话列表，可用 `--cwd` 过滤某个目录下的。

#### `claude auth` ⭐
管理登录状态：
- `auth login` — 登录 Anthropic 账号
- `auth logout` — 退出登录
- `auth status` — 查看当前登录状态

#### `claude mcp` 🔧
管理 MCP 服务器（给 Claude 扩展外部工具）：
- `mcp add` — 添加 MCP 服务器
- `mcp add-from-claude-desktop` — 从 Claude 桌面版导入配置
- `mcp list` — 查看已配置的服务器
- `mcp get <名字>` — 查看某个服务器详情
- `mcp remove` — 删除服务器
- `mcp serve` — 把 Claude Code 自身作为 MCP 服务器启动
- `mcp reset-project-choices` — 重置项目级 MCP 授权状态

#### `claude plugin` 🔧
管理插件：
- `plugin list` — 查看已安装插件
- `plugin install / uninstall` — 安装 / 卸载
- `plugin enable / disable` — 启用 / 禁用
- `plugin update` — 更新插件
- `plugin details` — 查看详情和 token 消耗估算
- `plugin marketplace` — 管理插件市场源
- `plugin prune` — 清理不再需要的依赖
- `plugin validate` — 校验插件格式
- `plugin tag` — 给插件打版本 tag（开发者用）

#### `claude project` 🧪
- `project purge` — 删除某项目的所有 Claude 状态（对话、任务、配置），相当于重置

#### `claude update` ⭐
检查并安装最新版本。

#### `claude doctor` 🔧
检查自动更新功能是否正常，类似"自检"。

#### `claude install` 🧪
手动安装指定版本，如 `claude install stable` 或 `claude install 2.1.100`。

#### `claude setup-token` 🔧
配置长期认证 token，适合不想每次走 OAuth 流程的场景（需要 Claude 订阅）。

#### `claude auto-mode` 🧪
查看自动权限模式分类器的配置，了解 Claude 如何判断哪些操作需要确认。

#### `claude ultrareview` 🧪
调用云端多 agent 系统对当前分支或某个 PR 做代码审查，输出详细报告。

---

### 三、会话内 Slash 命令（交互时输入 `/`）

| 命令 | 功能 | 频率 |
|---|---|---|
| `/help` | 查看帮助 | ⭐ |
| `/clear` | 清空当前对话上下文 | ⭐ |
| `/compact` | 压缩对话历史，节省 token | ⭐ |
| `/config` | 打开设置配置面板 | ⭐ |
| `/model` | 切换当前模型 | ⭐ |
| `/resume` | 恢复历史会话 | ⭐ |
| `/goal` | 设定完成目标，Claude 持续工作直到达成 | ⭐ |
| `/init` | 在当前项目生成 `CLAUDE.md` | ⭐ |
| `/review` | 审查当前分支的代码改动 | ⭐ |
| `/feedback` | 提交反馈给 Anthropic | 🔧 |
| `/cost` | 查看本次会话 token 消耗和费用 | 🔧 |
| `/status` | 查看当前状态（模型、权限、上下文等） | 🔧 |
| `/permissions` | 查看和管理工具权限 | 🔧 |
| `/memory` | 查看和管理 Claude 记忆文件 | 🔧 |
| `/context` | 查看上下文占用情况 | 🔧 |
| `/scroll-speed` | 调整滚轮速度 | 🔧 |
| `/fast` | 切换 Fast 模式（Opus 更快输出） | 🔧 |
| `/vim` | 开启 / 关闭 vim 键位模式 | 🔧 |
| `/terminal-setup` | 配置终端按键（如 Option+Enter 换行） | 🔧 |
| `/doctor` | 会话内健康检查 | 🧪 |
| `/bug` | 快速报告 bug | 🧪 |

---

### 四、命令总览

| 类型 | 数量 |
|---|---|
| CLI 启动参数 | 约 30+ 个 |
| CLI 子命令（含次级子命令） | 约 25 个 |
| 会话内 `/` 命令 | 约 20 个 |
| **合计** | **约 75+ 个** |

### 五、最值得记住的核心命令

- `claude -c` — 继续上次对话
- `claude -r` — 恢复某次历史会话
- `/compact` — 压缩上下文省 token
- `/goal` — 设定目标让 Claude 自动跑完
- `/init` — 初始化项目的 CLAUDE.md 文档
- `claude mcp add` — 给 Claude 接入外部工具

---

### 六、macOS 快速操作

#### 打开家目录

| 方法 | 说明 |
|---|---|
| `open ~` | 在终端里输入，会直接打开 Finder 进入家目录 |
| `Command + Shift + H` | 在已打开的终端窗口中按这个快捷键，快速进入家目录 |
