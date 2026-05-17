# Claude Code 的"记忆"系统 — 操作手册

> 开始于 2026-05-17 | 最后更新 2026-05-17
> 一份给 Teemo 自己看的、把 `CLAUDE.md` 和 `memory` 讲清楚的活文档。

---

## 0. 这份手册想解决什么

Claude Code 看似"记得"很多东西——它能叫出你的名字、知道你的项目结构、遵守你的工作规范。但这些"记忆"实际上分布在**几套独立的机制**里，新手很容易混淆：

- 为什么有时候 Claude 记得你叫 Teemo，有时候又只知道你的邮箱？
- 项目级 `CLAUDE.md` 和 `memory` 是同一个东西吗？
- 让 Claude "记一下"某件事，它到底会写到哪里？
- 怎么让一条信息**全局可见**，又不污染其他项目？

这份手册一次讲清楚。

---

## 1. 两种"记忆"机制

Claude Code 实际上有**两套独立的持久化机制**。叫"memory"会让人误以为它们是一回事，但它们完全不同。

### 1.1 `CLAUDE.md` — 你写给 Claude 的指令文件

- **作者**：你（手动编辑）
- **角色**：规则 / 规范 / 契约
- **加载**：每次会话自动注入到 system prompt
- **典型内容**：「飞书文档默认用 XML 格式」、「破坏性操作前必须确认」

### 1.2 `memory` — Claude 自动维护的事实笔记

- **作者**：Claude（基于对话自动写入）
- **角色**：事实 / 观察 / 偏好记录
- **加载**：索引（`MEMORY.md`）每次注入，正文按需读
- **典型内容**：「Margin 项目用 Vercel 部署」、「上次 hover bug 是透明遮挡层」

### 1.3 一句话区分

> **`CLAUDE.md` 告诉 Claude "你应该怎么做"**
> **`memory` 告诉 Claude "我们知道什么事实"**

---

## 2. 范围：全局 vs 项目

无论是 `CLAUDE.md` 还是 `memory`，都有"范围"概念——这条信息**在哪些会话里加载**。

### 2.1 `CLAUDE.md` 的范围

| 文件位置 | 范围 | 何时加载 |
|---|---|---|
| `~/.claude/CLAUDE.md` | **全局** | 每次启动都加载 |
| `<project>/CLAUDE.md` | **项目** | 在该项目目录下启动时加载 |
| `<project>/<sub>/CLAUDE.md` | **子目录** | 进入更深目录时叠加 |
| `<project>/CLAUDE.local.md` | **项目 + gitignored** | 同项目，不进 git |

**重要规则**：CLAUDE.md 从 cwd **向上级目录逐层叠加**，所有命中的层都会加载。所以**启动 cwd 越深，加载的层越多**。

### 2.2 `memory` 的范围

memory 按 **cwd 编码路径**严格隔离：

```
~/.claude/projects/<encoded-cwd>/memory/
```

举例：cwd 是 `/Users/teemo/Desktop/teemo-workspace/Projects/html-lab/`，对应的 memory 目录就是：

```
~/.claude/projects/-Users-teemo-Desktop-teemo-workspace-Projects-html-lab/memory/
```

(把 `/` 全部替换成 `-`)

### 2.3 ⚠️ 一个反直觉的关键事实

> **`memory` 没有真正的"全局"版本。**

它永远按 cwd 隔离。即使 `~/.claude/projects/-Users-teemo/memory/`（home 目录对应的 memory）看起来"全局"，实际上**也只在你从 `~` 启动 Claude 时才加载**。

**推论**：如果你希望某个**事实**在所有项目都被 Claude 知道，唯一办法是把它**写进全局 `CLAUDE.md`**（即使它本质是事实，不是规则）。

---

## 3. 四象限决策图

把"性质"和"范围"两个维度叉乘，得到 4 个落点：

```
                  全局可见                项目可见
              ┌──────────────────┬──────────────────┐
   规则/偏好  │ ~/.claude/       │ <project>/       │
              │   CLAUDE.md      │   CLAUDE.md      │
              │                  │                  │
              │ 例：默认自主执行 │ 例：飞书文档用XML│
              ├──────────────────┼──────────────────┤
   事实/观察  │ ~/.claude/       │ ~/.claude/       │
              │   CLAUDE.md      │   projects/.../  │
              │   的"用户"区     │   memory/        │
              │ （借道，无 mem） │                  │
              │ 例：翁呈轩       │ 例：Margin 用 Vercel │
              └──────────────────┴──────────────────┘
```

注意右上角和左下角的关键差异：

- **右上**（项目规则）→ 项目 CLAUDE.md，标准做法
- **左下**（全局事实）→ 借道全局 CLAUDE.md，因为没有真全局 memory

---

## 4. 实战 Playbook

### 4.1 问题一：新会话该在哪个目录启动？

**核心原则**：cwd 决定哪些 `CLAUDE.md` 被加载，所以让 cwd 等于"任务的实际所在地"。

**实战决策表**：

| 你要做的事 | 启动 cwd | 加载的 CLAUDE.md 层级 |
|---|---|---|
| 写飞书财务相关 | `飞书/人生无限公司/财务/` | 全局 + Obsidian 根 + 飞书 + KB + 财务（5 层全栈） |
| 写飞书随想（KB 内） | `飞书/人生无限公司/` | 全局 + Obsidian 根 + 飞书 + KB |
| 飞书工作流跨模块讨论 | `飞书/` | 全局 + Obsidian 根 + 飞书 |
| 处理某 GitHub 项目 | `Projects/<项目名>/` | 全局 + Obsidian 根 + 项目 |
| 跨项目 / Wiki 维护 | `~/Desktop/teemo-workspace/` | 全局 + Obsidian 根 |
| 跟项目无关 | `~` 或 `/tmp` | 只有全局 |

**关键启发**：宁深勿浅。CLAUDE.md 向上叠加，启动得越深越不会"漏加载"。

**配合 shell alias**：已有 `feishu` alias，可以为其他常用入口加 alias（`obs`、`margin` 等）。

---

### 4.2 问题二：怎么更新 CLAUDE.md（全局 vs 项目）？

**推荐策略**：用**显式提示词**，不要让 Claude 猜，**不建议**做 skill。

#### 推荐固定句式

| 想做的事 | 提示词 |
|---|---|
| 更新项目 CLAUDE.md | "把 X 加到项目 CLAUDE.md" |
| 更新全局 CLAUDE.md | "把 X 加到全局 CLAUDE.md" |
| 删 / 改某条 | "把 [全局/项目] CLAUDE.md 里关于 Y 的那条改成 ..." |

#### 为什么不让 Claude 猜？

代价**不对称**：

- 写到项目 CLAUDE.md（窄）→ 在其他项目失效，损失小
- 写到全局 CLAUDE.md（宽）→ 污染所有项目 + 浪费 token + 影响判断，**损失大**

所以"猜错偏宽" >> "猜错偏窄"，**默认行为应该是不猜**。

#### 为什么不做 skill？

- "加到全局 / 加到项目" 已经是 5 字提示词，做 `/remember-global` 反而更长
- skill 的价值在于封装**多步流程**，单步操作做 skill 是过度工程
- 等真的烦了再考虑

---

### 4.3 问题三：memory 还是 CLAUDE.md？

#### 底层区分

| 维度 | CLAUDE.md | Memory |
|---|---|---|
| 性质 | 规则、指令、契约 | 事实、观察、记忆 |
| 谁写 | 你（显式） | Claude（自动 / 半自动） |
| 加载 | 每次会话注入 | 索引注入，正文按需读 |
| 改动 | 你 edit 文件 | Claude Write，你也能改 |

#### 判断流程

```
是规则 / 偏好 / 契约吗？
├─ 是 → CLAUDE.md
│       ├─ 跨项目？ → 全局
│       └─ 不跨？ → 项目
└─ 否（是事实）
    ├─ 跨项目？ → 全局 CLAUDE.md 的"用户"区（借道）
    └─ 不跨？ → 项目 memory
```

#### 具体例子

| 你说 | 性质 | 范围 | 落点 |
|---|---|---|---|
| "默认回答中文" | 规则 | 全局 | `~/.claude/CLAUDE.md` |
| "飞书文档默认用 XML" | 规则 | 项目 | `飞书/CLAUDE.md` |
| "我女朋友叫小明" | 事实 | 全局 | `~/.claude/CLAUDE.md` 用户区 |
| "Margin 部署在 Vercel" | 事实 | 项目 | `Margin` 项目 memory |
| "我喜欢用 Tailwind" | 偏好 | 全局 | `~/.claude/CLAUDE.md` |

---

### 4.4 "记一下 X" 协议（模糊时的处理）

如果只说 "记一下 X" 而没指定落点，Claude 应该：

1. **不要默写**，先问两个问题：
   - 这是**规则 / 偏好**，还是**事实 / 观察**？
   - 是**全局**通用，还是**项目**专用？
2. 按回答落到对应象限
3. **改全局 CLAUDE.md 前必须告知用户**
4. **项目 memory 可以自主写**，写完报备

这条协议已经写进 `~/.claude/CLAUDE.md` v1.1。

---

## 5. 一个意外发现：memory 实际上很稀疏

很多用户（包括 Teemo）会发现一个反直觉的事实：**项目文件夹里从来看不到 memory 文件**，而且 memory 整体上累积得很少。

### 5.1 为什么项目里看不到？

Memory **从不**存在项目目录里，而是存在 `~/.claude/projects/<encoded-cwd>/memory/` 这个**镜像目录树**里——跟你的项目代码完全分离。

**为什么这么设计？**

- 不污染项目（不进 git）
- 不增加 `.gitignore` 负担
- 个人记忆不该跟项目代码绑

### 5.2 为什么累积得少？

几个原因叠加：

1. **Auto-memory 是相对新功能**，早期会话没这机制
2. **维护良好的 `CLAUDE.md` 体系会"抢走"memory 的活**——规则化沉淀已经在 CLAUDE.md 里完成了
3. **讨论型 / 决策型对话**不容易触发自动保存（auto-memory 主要靠"明确的偏好声明"和"纠正"触发）
4. **大部分 cwd 是一次性任务**，做完就走，没留下"以后应该…"的指令

### 5.3 这意味着什么？

如果你像 Teemo 一样是**主动维护 `CLAUDE.md` 文档体系**的用户，**memory 的重要性其实没那么高**——你的体系已经在 CLAUDE.md 层完成了沉淀。

**结论**：
- 继续以 `CLAUDE.md` 为主的体系
- 不用主动管 memory，让 Claude 在合适的时候自动写
- 看到 memory 累积少不用焦虑，这是 CLAUDE.md 体系成熟的副作用

---

## 6. 备忘卡

```
启动会话：
  cwd 尽量深 → 自动叠加所有上层 CLAUDE.md
  alias 帮你省事

更新规则：
  "加到全局 CLAUDE.md：X"  → ~/.claude/CLAUDE.md
  "加到项目 CLAUDE.md：X"  → <project>/CLAUDE.md
  "记一下 X"（模糊）       → Claude 先问

更新事实：
  跨项目事实 → 全局 CLAUDE.md（借道）
  项目事实   → 让 Claude 自动写 memory，报备即可

不要做的事：
  ❌ 让 Claude 猜该写全局还是项目
  ❌ 把事实写进 CLAUDE.md（除非要跨项目）
  ❌ 把规则写进 memory（不保证加载）
  ❌ 在项目文件夹里找 memory（找不到，它在 ~/.claude/）
```

---

## 7. 验证你的全局 CLAUDE.md 是否生效

随时可以验证：

```bash
cd /tmp
claude
```

然后问：「我叫什么？你现在加载了哪些 CLAUDE.md？」

预期回答：
- 知道你叫**翁呈轩（Teemo Weng）**
- 列出加载了 `~/.claude/CLAUDE.md`
- 没加载任何项目 CLAUDE.md（`/tmp` 不在任何项目下）

如果不符合预期，说明全局 CLAUDE.md 出了问题（被改坏、被删、路径不对等），需要排查。

---

*本手册整合自 2026-05-17 与 Claude 关于"memory 系统"的深度讨论，包括 4 轮主问题 + 多轮追问澄清。*
