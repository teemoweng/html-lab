# 从一个建文档任务，看懂 AI 怎么用工具：API / CLI / MCP

> 开始于 2026-05-20 | 最后更新 2026-05-20

## 背景

2026 年初，整个 AI 行业对「Agent 应该怎么用工具」这件事集体换了答案——从 MCP 协议倒向 CLI。Perplexity、YC、Vercel 的 CEO 都公开站队 CLI。但对非开发者来说，「API / CLI / MCP」三个词常被混着用，真正的差别说不清。

本文档用一个具体任务（让 Claude Code 在飞书里创建文档），分别走 CLI 和 MCP 两条路径，把每一步拆开。读完应该能回答：

- API / CLI / MCP 三者本质区别是什么？
- 为什么 Claude Code 两条路都能走，Claude Desktop 只能走 MCP？
- 为什么业界从 MCP 倒戈到 CLI？

---

## 一、概念压缩成一页

三个词不在同一个层次上，这是理解一切的前提。

| 名词 | 本质 | 生活类比 |
|---|---|---|
| **API** | 飞书服务器对外开放的 HTTP 接口，等着被调用 | 飞书公司外墙上的"投递口"，按格式投纸条就能办事 |
| **CLI** | 装在你电脑上的程序，把命令翻译成 API 请求 | 你家里的打印机+信封：你说一句话它帮你寄信 |
| **MCP** | AI 和"工具盒子"之间的标准通信协议 | 国际通用的快递协议：AI 只要会说这种"黑话"就能让快递员代办 |

**关键差异**：CLI 需要终端环境才能跑，MCP 不需要。这就是为什么 Claude Code（活在终端里）两条路都能走，而 Claude Desktop（活在 GUI 沙盒里）只能走 MCP。

---

## 二、场景设定

你对 Claude Code 说：

> "帮我在飞书里创建一个文档，标题叫『本周计划』，里面写三条待办：① 写周报 ② 对接客户 ③ 准备会议"

下面看 **方案 A：CLI** 和 **方案 B：MCP** 是怎么把这件事办成的。

---

## 三、方案 A：CLI 流程

### 第 1 步：Claude Code 在脑子里想该用什么命令

Claude Code 读过飞书 CLI 的文档（或通过 Skill 加载过），知道：
- 创建文档要用 `lark docs +create`
- 更新内容要用 `lark docs +update`

它草拟一个两步计划：先建空文档拿到 ID，再写入内容。

### 第 2 步：Claude Code 在终端真的敲下第一条命令

```bash
lark docs +create --title "本周计划"
```

注意：这一步跟你自己手动敲命令**一模一样**。Claude Code 没有任何"特殊通道"，它就是用你电脑的终端跑了一条命令。

### 第 3 步：CLI 程序开始干活

`lark-cli` 是装在你电脑上的小程序，收到命令后在背后做三件事：

1. 从本地配置读出之前 `lark auth login` 存下的 token
2. 把命令翻译成 HTTP 请求
3. 把请求通过网络发到飞书服务器

```http
POST https://open.feishu.cn/open-apis/docx/v1/documents
Header: Authorization: Bearer <你的 token>
Body:   { "title": "本周计划" }
```

### 第 4 步：飞书服务器干活

飞书服务器收到请求后：验证 token → 在云空间创建空文档 → 返回 JSON。

```json
{
  "code": 0,
  "data": {
    "document_id": "doxcnAbCdEf123456",
    "url": "https://xxx.feishu.cn/docx/doxcnAbCdEf123456"
  }
}
```

### 第 5 步：CLI 把结果打印到终端

`lark-cli` 收到响应后，**直接把 JSON 打印在终端里**。

### 第 6 步：Claude Code 看到这段输出

关键的一步：**Claude Code 能看到终端打印的所有内容**，就像你能看到一样。它读到 `document_id`，决定下一步写内容。

### 第 7 步：敲下第二条命令

```bash
lark docs +update --doc doxcnAbCdEf123456 --append-markdown "
- [ ] 写周报
- [ ] 对接客户
- [ ] 准备会议
"
```

CLI 再走一遍 3~5 步。

### 第 8 步：Claude Code 回复你

> 已经在飞书里创建好了文档《本周计划》，三条待办已经写进去了。

---

## 四、方案 B：MCP 流程

### 第 0 步：一次性配置（CLI 方案没有的）

用 MCP 之前要做两件事：
1. 装一个"飞书 MCP Server"——它是一个程序文件，跟 lark-cli 类似
2. 改 Claude Code 的配置文件，告诉它"我这有个 MCP Server，启动时帮我拉起来"

```json
{
  "mcpServers": {
    "feishu": {
      "command": "feishu-mcp-server",
      "args": ["--token", "你的飞书 token"]
    }
  }
}
```

### 第 1 步：Claude Code 启动时，先把 MCP Server 拉起来

Claude Code 按配置在后台启动 `feishu-mcp-server`。这个 Server 进程**一直常驻**，跟 Claude Code 之间架起一根"对讲机"。

### 第 2 步：Server 一启动，立刻"自报家门"

MCP 协议规定：Server 启动后第一件事是告诉 AI"我有哪些工具"。

```json
{
  "tools": [
    { "name": "feishu_create_document",  "parameters": { "title": "..." } },
    { "name": "feishu_update_document",  "parameters": { "..." } },
    { "name": "feishu_send_message",     "parameters": { "..." } }
    // ... 还有 200 多个工具
  ]
}
```

**关键代价**：这份清单**整个**被塞进 Claude Code 的上下文里。哪怕只想建一个文档，全部 200+ 个能力的说明书都被装进它脑子里。这就是"光加载 schema 就吃掉 55K tokens"的来源。

### 第 3 步：Claude Code 决定调用哪个工具

它**不在终端敲命令**，而是生成一段结构化的工具调用指令：

```json
{
  "tool_call": {
    "name": "feishu_create_document",
    "arguments": { "title": "本周计划" }
  }
}
```

通过对讲机发给 MCP Server。

### 第 4 步：MCP Server 收到调用，翻译成 API 请求

跟 CLI 几乎一样：读 token → 拼 HTTP → 发飞书。

### 第 5 步：飞书服务器干活（跟 CLI 完全一样）

飞书服务器**根本不知道**是 MCP 还是 CLI 在调它。

### 第 6 步：MCP Server 不打印，而是用协议格式回传

关键分叉：
- **CLI**：结果打印到终端，Claude 看屏读到
- **MCP**：结果包装成 MCP 协议响应，通过对讲机回给 Claude

```json
{
  "tool_result": {
    "name": "feishu_create_document",
    "content": {
      "document_id": "doxcnAbCdEf123456",
      "url": "https://xxx.feishu.cn/docx/doxcnAbCdEf123456"
    }
  }
}
```

### 第 7 步：决定下一步，再发一次工具调用

Claude Code 看到 document_id，再发一段 JSON 调用 `feishu_update_document`。

### 第 8 步：回复你

跟 CLI 版本一模一样的最终输出。

---

## 五、两条路径对照

| 环节 | CLI | MCP |
|---|---|---|
| 配置成本 | 装好 lark-cli，登录一次 | 装 Server + 改配置文件 + Claude Code 拉起进程 |
| 启动时 | 啥也不发生 | Server 把所有工具说明书塞进 Claude 脑子（吃 token） |
| Claude 怎么调用 | 在终端打命令 | 生成结构化 JSON |
| 谁来执行 | 终端启动 lark-cli，跑一次就结束 | 常驻的 mcp-server 进程接收调用 |
| 结果怎么回来 | 打印到终端，Claude 看屏读到 | 协议响应，Claude 直接拿到结构化数据 |
| 出错时 | 错误直接打印，Claude 像人一样改 | 错误被包装在协议里，Claude 不一定知道怎么调整 |
| 你能不能围观 | 能。每条命令、每段输出你都看得到 | 看不到。中间通信全在对讲机里 |
| 飞书服务器视角 | 带 token 的 HTTP 请求 | 带 token 的 HTTP 请求（完全一样） |

---

## 六、核心结论

- **CLI** 是 Claude Code 用"人类操作电脑的方式"（敲命令、看屏幕）来调飞书
- **MCP** 是 Claude Code 用"专门给 AI 设计的协议"（对讲机通话）来调飞书

两者最底层都落到同一个飞书 API 上，但**怎么把请求送过去**走的是两条完全不同的路。

### 为什么 CLI 在 2026 年实战中胜出？

MCP 的代价集中在两个地方：
1. 启动就要吃几万 token 装工具清单 → 还没干活就贵
2. 黑盒：你和 Claude 都看不到中间过程 → 出错难调试，成功率低

CLI 的优势：
1. 按需查文档 → Claude 用啥才学啥，不浪费 token
2. 过程透明 → 你和 Claude 都能看到每条命令，错了立刻能改

**ScaleKit 2026 年 3 月基准测试**：同一批任务，MCP 的 token 成本是 CLI 的 10~32 倍，成功率 72% vs CLI 的 100%。

下次再有人争"该用 MCP 还是 CLI"——他们争的是**用哪种方式把 API 喂给 AI**，而不是某个东西要不要存在。**API 永远在最下面。**

---

## 关联

- 飞书文档版本：https://my.feishu.cn/docx/SyC5dc6Y1ob9wxxIhOTcaNJEnLb
- 文章触发源：「飞书 CLI 被开发者热捧的背后，我们看到了这几点」
