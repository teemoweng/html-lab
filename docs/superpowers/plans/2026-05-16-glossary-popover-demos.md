# 词汇表 Popover 演示 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `pm-interaction-guide-v2.html` 中为词汇表 10 个组件卡片增加 Hover Popover 迷你交互演示。

**Architecture:** 单文件 HTML，新增全局 `<div id="glossaryPopover">` 元素 + `GLOSSARY_DEMOS` 模板字典 + 智能定位/延迟显示隐藏的 JS 控制器。复用现有 demo-* 样式。

**Tech Stack:** 原生 HTML + CSS + JS（无构建工具、无外部依赖、自包含）。

**Spec:** `docs/superpowers/specs/2026-05-16-glossary-popover-demos-design.md`

---

## 文件结构

| 文件 | 操作 |
|------|------|
| `pm-interaction-guide/pm-interaction-guide-v2.html` | 新建（复制 v1 后修改） |
| `pm-interaction-guide/pm-interaction-guide.html` | **不动**（v1 保留） |
| `index.html` | 修改（导航增加 v2 入口） |
| `CLAUDE.md`（html-lab 根目录） | 修改（topic 清单表格） |
| `pm-interaction-guide/pm-interaction-guide.md` | **不动**（活文档本次不更） |

---

## Task 1: 复制 v1 为 v2 起点

**Files:**
- Create: `pm-interaction-guide/pm-interaction-guide-v2.html`

- [ ] **Step 1: 复制 v1 文件到 v2**

```bash
cp "pm-interaction-guide/pm-interaction-guide.html" "pm-interaction-guide/pm-interaction-guide-v2.html"
```

- [ ] **Step 2: 修改 v2 文件 `<title>` 标签**

将 `<title>PM 交互设计参考库</title>` 改为：
```html
<title>PM 交互设计参考库 v2</title>
```

- [ ] **Step 3: 浏览器打开 v2，确认与 v1 行为一致**

打开 `pm-interaction-guide/pm-interaction-guide-v2.html`，验证：
- 标题栏显示 v2
- 侧边栏、概念页、词汇表全部正常显示
- 各章节交互（Modal/Drawer/Toast 等）正常工作

- [ ] **Step 4: 暂不 commit（按项目规范，等用户明确要求才动 git）**

---

## Task 2: 添加 Popover 基础设施（CSS + DOM + JS）

**Files:**
- Modify: `pm-interaction-guide/pm-interaction-guide-v2.html`

- [ ] **Step 1: 在 `<style>` 末尾追加 Popover CSS（紧靠 `</style>` 前）**

```css
  /* ── Glossary Popover ── */
  .glossary-card[data-demo] { cursor: default; transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
  .glossary-card[data-demo]:hover {
    border-color: #c7d2fe;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99,102,241,0.12);
  }
  .glossary-popover {
    position: fixed;
    width: 260px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);
    padding: 14px;
    z-index: 9997;
    opacity: 0;
    transform: scale(0.96);
    pointer-events: none;
    transition: opacity 0.15s ease, transform 0.15s ease;
    color: #1e293b;
  }
  .glossary-popover.show {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }
  .glossary-popover-label {
    font-size: 10px;
    color: #6366f1;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }
  .popover-demo-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .popover-demo-col { display: flex; flex-direction: column; }
  .popover-demo-label { font-size: 11px; color: #94a3b8; margin-bottom: 6px; font-weight: 600; }
```

- [ ] **Step 2: 在 `<body>` 中、`<script>` 之前追加 Popover 全局元素**

紧跟着已有的 `<div class="demo-drawer-overlay" ...>` 块之后，添加：
```html
<div class="glossary-popover" id="glossaryPopover"></div>
```

- [ ] **Step 3: 在 `<script>` 末尾（紧靠 `</script>` 前的 init 部分前）追加 Popover 控制器 JS**

```javascript
// ── Glossary Popover Controller ──
const GLOSSARY_DEMOS = {};  // 内容在 Task 4 填充
let popoverShowTimer = null;
let popoverHideTimer = null;
let popoverActiveCard = null;

function positionGlossaryPopover(card) {
  const pop = document.getElementById('glossaryPopover');
  const rect = card.getBoundingClientRect();
  const popWidth = 260 + 28; // width + padding L+R
  const popHeight = pop.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gap = 12;

  // Horizontal: prefer right side, fall back to left
  let left;
  if (vw - rect.right >= popWidth + gap) {
    left = rect.right + gap;
  } else {
    left = rect.left - popWidth - gap;
  }
  // Vertical: center on card, clamp to viewport
  let top = rect.top + rect.height / 2 - popHeight / 2;
  top = Math.max(16, Math.min(top, vh - popHeight - 16));

  pop.style.left = left + 'px';
  pop.style.top = top + 'px';
}

function showGlossaryPopover(card) {
  clearTimeout(popoverHideTimer);
  if (popoverActiveCard === card) return;
  popoverShowTimer = setTimeout(() => {
    const demoId = card.getAttribute('data-demo');
    const html = GLOSSARY_DEMOS[demoId];
    if (!html) return;
    const pop = document.getElementById('glossaryPopover');
    pop.innerHTML = '<div class="glossary-popover-label">🎮 演示</div>' + html;
    pop.classList.add('show');
    // Position after content rendered (so height is correct)
    requestAnimationFrame(() => positionGlossaryPopover(card));
    popoverActiveCard = card;
  }, 200);
}

function hideGlossaryPopover() {
  clearTimeout(popoverShowTimer);
  popoverHideTimer = setTimeout(() => {
    const pop = document.getElementById('glossaryPopover');
    pop.classList.remove('show');
    popoverActiveCard = null;
  }, 200);
}

function bindGlossaryPopover() {
  document.querySelectorAll('.glossary-card[data-demo]').forEach(card => {
    card.addEventListener('mouseenter', () => showGlossaryPopover(card));
    card.addEventListener('mouseleave', hideGlossaryPopover);
  });
  const pop = document.getElementById('glossaryPopover');
  pop.addEventListener('mouseenter', () => clearTimeout(popoverHideTimer));
  pop.addEventListener('mouseleave', hideGlossaryPopover);
}
```

- [ ] **Step 4: 在 `renderConcept` 函数末尾（`if (c.onMount) c.onMount();` 之后）添加 glossary 绑定**

将这段：
```javascript
  if (c.onMount) c.onMount();
}
```
改为：
```javascript
  if (c.onMount) c.onMount();
  if (c.isGlossary) bindGlossaryPopover();
}
```

- [ ] **Step 5: 浏览器验证**

打开 v2 → 跳到「附录 · 组件词汇表」 → 此时 hover 任何卡片**不应**弹出 Popover（因为还没加 data-demo 属性）。**应**看到卡片 hover 时有紫色描边和轻微上移。

如果有 console 错误，停下来排查。

---

## Task 3: 为 10 个 glossary 卡片增加 `data-demo` 属性

**Files:**
- Modify: `pm-interaction-guide/pm-interaction-guide-v2.html`（修改 `CONCEPTS['glossary'].demo` 字符串内的 HTML）

- [ ] **Step 1: 用 Edit 替换 10 个卡片的开头标签**

定位到 `'glossary': { isGlossary: true, demo: ...` 这个对象的模板字符串里，逐个替换以下 10 处（每个都是唯一的，直接替换即可）：

| 原文（独立子串） | 改成 |
|---|---|
| `<div class="glossary-card">\n        <h3>Button</h3>` | `<div class="glossary-card" data-demo="button">\n        <h3>Button</h3>` |
| `<div class="glossary-card">\n        <h3>Chip / Tag</h3>` | `<div class="glossary-card" data-demo="chip-tag">\n        <h3>Chip / Tag</h3>` |
| `<div class="glossary-card">\n        <h3>Badge</h3>` | `<div class="glossary-card" data-demo="badge">\n        <h3>Badge</h3>` |
| `<div class="glossary-card">\n        <h3>Input / Text Field</h3>` | `<div class="glossary-card" data-demo="input">\n        <h3>Input / Text Field</h3>` |
| `<div class="glossary-card">\n        <h3>Toggle / Switch</h3>` | `<div class="glossary-card" data-demo="toggle">\n        <h3>Toggle / Switch</h3>` |
| `<div class="glossary-card">\n        <h3>Dropdown / Select</h3>` | `<div class="glossary-card" data-demo="dropdown">\n        <h3>Dropdown / Select</h3>` |
| `<div class="glossary-card">\n        <h3>Checkbox / Radio</h3>` | `<div class="glossary-card" data-demo="checkbox-radio">\n        <h3>Checkbox / Radio</h3>` |
| `<div class="glossary-card">\n        <h3>Avatar</h3>` | `<div class="glossary-card" data-demo="avatar">\n        <h3>Avatar</h3>` |
| `<div class="glossary-card">\n        <h3>Scrim / Overlay</h3>` | `<div class="glossary-card" data-demo="scrim">\n        <h3>Scrim / Overlay</h3>` |
| `<div class="glossary-card">\n        <h3>Custom Cursor</h3>` | `<div class="glossary-card" data-demo="custom-cursor">\n        <h3>Custom Cursor</h3>` |

> 注意：以上「\n        」表示真实换行 + 8 空格缩进，按文件实际内容来匹配。如果某条不能唯一定位，扩大上下文。

- [ ] **Step 2: 浏览器验证**

刷新 v2 → 跳到词汇表 → 此时 hover 卡片**仍不会**弹出（因 `GLOSSARY_DEMOS` 还是空对象），但不应报错。打开 DevTools Elements 面板，确认每张 glossary-card 都有正确的 `data-demo` 属性。

---

## Task 4: 实现 10 个 Demo 模板（核心内容任务）

**Files:**
- Modify: `pm-interaction-guide/pm-interaction-guide-v2.html`

本任务一次性填充 `GLOSSARY_DEMOS` 对象，并在 `<style>` 中追加几个需要的 Popover 内部组件 CSS，在 `<script>` 末尾追加交互辅助函数。

- [ ] **Step 1: 在 `<style>` 内（紧靠 .popover-demo-label 之后）追加 Demo 内部组件 CSS**

```css
  /* Toggle in popover */
  .pop-toggle { width: 36px; height: 20px; background: #e2e8f0; border-radius: 10px; position: relative; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
  .pop-toggle.on { background: #6366f1; }
  .pop-toggle-thumb { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: white; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
  .pop-toggle.on .pop-toggle-thumb { transform: translateX(16px); }

  /* Dropdown in popover */
  .pop-dropdown { position: relative; background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 10px; font-size: 12px; cursor: pointer; user-select: none; }
  .pop-dropdown-arrow { float: right; color: #94a3b8; font-size: 10px; }
  .pop-dropdown-menu { display: none; position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: white; border: 1px solid #e2e8f0; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); z-index: 10; max-height: 120px; overflow-y: auto; }
  .pop-dropdown.open .pop-dropdown-menu { display: block; }
  .pop-dropdown-item { padding: 6px 10px; font-size: 12px; cursor: pointer; }
  .pop-dropdown-item:hover { background: #f5f3ff; color: #6366f1; }

  /* Mini phone for scrim demo */
  .pop-phone { position: relative; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; min-height: 100px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .pop-phone-scrim { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: none; align-items: center; justify-content: center; }
  .pop-phone-scrim.show { display: flex; }
  .pop-phone-modal { background: white; border-radius: 8px; padding: 12px; width: 80%; text-align: center; }

  /* Custom cursor demo area */
  .pop-cursor-area {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border-radius: 8px;
    padding: 24px 12px;
    text-align: center;
    font-size: 12px;
    cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><text y='22' font-size='22'>✨</text></svg>") 4 4, auto;
  }

  /* Avatar circles */
  .pop-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
  .pop-avatar-img { background: linear-gradient(135deg, #f59e0b, #ec4899); color: white; font-size: 18px; }
  .pop-avatar-initials { background: #6366f1; color: white; font-size: 13px; }
  .pop-avatar-default { background: #e2e8f0; color: #94a3b8; font-size: 20px; }

  /* Badge demo */
  .pop-badge-wrap { position: relative; font-size: 22px; }
  .pop-badge-dot { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid white; }
  .pop-badge-num { position: absolute; top: -6px; right: -10px; background: #ef4444; color: white; font-size: 10px; font-weight: 700; padding: 1px 5px; border-radius: 8px; min-width: 16px; text-align: center; border: 2px solid white; }

  /* Checkbox/Radio labels */
  .pop-cr-label { font-size: 12px; color: #374151; display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 2px 0; }
  .pop-cr-label input { accent-color: #6366f1; }
```

- [ ] **Step 2: 在 `<script>` 内，将原本 `const GLOSSARY_DEMOS = {};` 替换为完整对象**

```javascript
const GLOSSARY_DEMOS = {
  'button': `
    <div class="popover-demo-row">
      <button class="demo-btn demo-btn-primary" style="font-size:11px;padding:5px 12px">Primary</button>
      <button class="demo-btn demo-btn-secondary" style="font-size:11px;padding:5px 12px">Secondary</button>
    </div>
    <div class="popover-demo-row" style="margin-top:6px">
      <button class="demo-btn" style="font-size:11px;padding:5px 12px;background:transparent;border:1px solid #6366f1;color:#6366f1">Ghost</button>
      <button class="demo-btn demo-btn-danger" style="font-size:11px;padding:5px 12px">Danger</button>
    </div>
    <p style="font-size:10px;color:#94a3b8;margin-top:8px">点击有按压反馈</p>
  `,

  'chip-tag': `
    <div class="popover-demo-label">Chip（可点选）</div>
    <div class="popover-demo-row">
      <span class="demo-chip" style="font-size:11px;padding:3px 10px" onclick="this.classList.toggle('selected')">设计</span>
      <span class="demo-chip selected" style="font-size:11px;padding:3px 10px" onclick="this.classList.toggle('selected')">研究</span>
      <span class="demo-chip" style="font-size:11px;padding:3px 10px" onclick="this.classList.toggle('selected')">数据</span>
    </div>
    <div class="popover-demo-label" style="margin-top:10px">Tag（只读分类）</div>
    <div class="popover-demo-row">
      <span style="background:#fee2e2;color:#dc2626;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600">热门</span>
      <span style="background:#dcfce7;color:#16a34a;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600">新品</span>
      <span style="background:#dbeafe;color:#2563eb;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600">推荐</span>
    </div>
  `,

  'badge': `
    <div class="popover-demo-row" style="gap:28px;justify-content:center;padding:16px 0">
      <div class="pop-badge-wrap">🔔<span class="pop-badge-dot"></span></div>
      <div class="pop-badge-wrap">🔔<span class="pop-badge-num">3</span></div>
      <div class="pop-badge-wrap">🔔<span class="pop-badge-num">99+</span></div>
    </div>
    <p style="font-size:10px;color:#94a3b8;text-align:center">红点 / 数字 / 上限值</p>
  `,

  'input': `
    <div class="popover-demo-col" style="gap:6px">
      <input class="demo-input" placeholder="单行输入" style="width:100%;font-size:11px;padding:6px 10px">
      <input class="demo-input" placeholder="🔍 搜索" style="width:100%;font-size:11px;padding:6px 10px">
      <input class="demo-input" type="password" placeholder="密码" value="secret" style="width:100%;font-size:11px;padding:6px 10px">
      <textarea class="demo-input" placeholder="多行 Textarea" rows="2" style="width:100%;font-size:11px;padding:6px 10px;resize:none;font-family:inherit"></textarea>
    </div>
  `,

  'toggle': `
    <div class="popover-demo-row" style="gap:10px;padding:14px 0;justify-content:center">
      <div class="pop-toggle" onclick="popToggleSwitch(this)"><div class="pop-toggle-thumb"></div></div>
      <span class="pop-toggle-label" style="font-size:12px;color:#475569">通知 关闭</span>
    </div>
    <p style="font-size:10px;color:#94a3b8;text-align:center">点击切换，立即生效</p>
  `,

  'dropdown': `
    <div class="popover-demo-label">选择城市</div>
    <div class="pop-dropdown" id="popDropdown1" onclick="popToggleDropdown(this, event)">
      <span class="pop-dropdown-current">请选择</span>
      <span class="pop-dropdown-arrow">▾</span>
      <div class="pop-dropdown-menu">
        <div class="pop-dropdown-item" onclick="popSelectDropdown(this, event)">北京</div>
        <div class="pop-dropdown-item" onclick="popSelectDropdown(this, event)">上海</div>
        <div class="pop-dropdown-item" onclick="popSelectDropdown(this, event)">广州</div>
        <div class="pop-dropdown-item" onclick="popSelectDropdown(this, event)">深圳</div>
      </div>
    </div>
  `,

  'checkbox-radio': `
    <div class="popover-demo-label">Checkbox（多选）</div>
    <div class="popover-demo-col">
      <label class="pop-cr-label"><input type="checkbox" checked> 邮件通知</label>
      <label class="pop-cr-label"><input type="checkbox"> 短信通知</label>
      <label class="pop-cr-label"><input type="checkbox" checked> Push 通知</label>
    </div>
    <div class="popover-demo-label" style="margin-top:10px">Radio（单选）</div>
    <div class="popover-demo-col">
      <label class="pop-cr-label"><input type="radio" name="popGender" checked> 男</label>
      <label class="pop-cr-label"><input type="radio" name="popGender"> 女</label>
      <label class="pop-cr-label"><input type="radio" name="popGender"> 不愿透露</label>
    </div>
  `,

  'avatar': `
    <div class="popover-demo-row" style="gap:14px;justify-content:center;padding:12px 0">
      <div class="pop-avatar pop-avatar-img">😊</div>
      <div class="pop-avatar pop-avatar-initials">TM</div>
      <div class="pop-avatar pop-avatar-default">👤</div>
    </div>
    <p style="font-size:10px;color:#94a3b8;text-align:center">图片 / 缩写 / 默认</p>
  `,

  'scrim': `
    <div class="pop-phone" id="popScrimPhone">
      <button class="demo-btn demo-btn-primary" style="font-size:11px;padding:5px 12px" onclick="popShowScrim(this)">打开 Modal</button>
      <div class="pop-phone-scrim" onclick="popHideScrim(this)">
        <div class="pop-phone-modal" onclick="event.stopPropagation()">
          <div style="font-size:12px;font-weight:700;margin-bottom:4px">这是 Modal</div>
          <div style="font-size:10px;color:#94a3b8">点击灰色遮罩关闭</div>
        </div>
      </div>
    </div>
  `,

  'custom-cursor': `
    <div class="pop-cursor-area">
      鼠标移到这里<br>
      <span style="font-size:10px;opacity:0.85">光标变成 ✨</span>
    </div>
  `,
};
```

- [ ] **Step 3: 在 `<script>` 末尾（init 之前）追加 Demo 交互辅助函数**

```javascript
// ── Popover demo interactions ──
window.popToggleSwitch = function(el) {
  el.classList.toggle('on');
  const label = el.parentElement.querySelector('.pop-toggle-label');
  if (label) label.textContent = el.classList.contains('on') ? '通知 开启' : '通知 关闭';
};

window.popToggleDropdown = function(el, e) {
  e.stopPropagation();
  el.classList.toggle('open');
};

window.popSelectDropdown = function(el, e) {
  e.stopPropagation();
  const dd = el.closest('.pop-dropdown');
  dd.querySelector('.pop-dropdown-current').textContent = el.textContent;
  dd.classList.remove('open');
};

window.popShowScrim = function(btn) {
  const phone = btn.closest('.pop-phone');
  phone.querySelector('.pop-phone-scrim').classList.add('show');
};

window.popHideScrim = function(scrim) {
  scrim.classList.remove('show');
};
```

- [ ] **Step 4: 浏览器验证（核心 QA）**

刷新 v2 → 跳到附录词汇表 → 依次 hover 每个卡片，逐一确认：

| 卡片 | 应看到 |
|------|--------|
| Button | 4 个按钮（Primary/Secondary/Ghost/Danger），点击有压感 |
| Chip / Tag | 上排可点选 Chip（点击变紫底白字）；下排彩色 Tag |
| Badge | 3 个 🔔 图标分别带 红点 / 数字 3 / 99+ |
| Input | 4 个输入框，全部能真正输入字符 |
| Toggle | 开关能点击，文字「通知 关闭/开启」同步切换 |
| Dropdown | 点击展开 4 个城市，选中后回显 |
| Checkbox / Radio | Checkbox 可独立勾选；Radio 互斥单选 |
| Avatar | 3 个 40px 头像并排 |
| Scrim | 「打开 Modal」点击后内部弹遮罩 + 小弹窗，点遮罩关闭 |
| Custom Cursor | 鼠标进入紫色区域，光标变成 ✨ |

**还要验证：**
- 鼠标移到卡片上 200ms 后才弹出（防误触）
- 鼠标从卡片移动到 Popover 内（中间短暂悬空）不会消失
- 鼠标完全离开 200ms 后关闭
- 词汇表右侧的卡片 hover 时，Popover 出现在**左侧**（智能定位）
- 滚动页面或拉伸窗口后再 hover，Popover 位置正确

---

## Task 5: 更新 `index.html` 增加 v2 入口

**Files:**
- Modify: `index.html`（项目根目录）

- [ ] **Step 1: 先读 index.html 找到 pm-interaction-guide 的现有入口**

```bash
grep -n "pm-interaction-guide" index.html
```

- [ ] **Step 2: 在该入口附近以同样格式增加 v2 链接**

参照已有同 topic 多版本的写法（例如 react-card-demo 的 v1/v2/v3，或 tech-stack 的 v1/v2）。如果项目用的是「PM 交互设计参考库 v1 / v2」并排链接的模式，照搬即可。

- [ ] **Step 3: 浏览器打开 index.html，确认新增的 v2 链接可点击进入**

---

## Task 6: 更新 `CLAUDE.md` topic 清单表格

**Files:**
- Modify: `CLAUDE.md`（html-lab 根目录）

- [ ] **Step 1: 用 Edit 替换 pm-interaction-guide 行**

将：
```markdown
| `pm-interaction-guide/` | `pm-interaction-guide.md` ✅ | v1 ✅ | PM 交互设计参考库 |
```
改为：
```markdown
| `pm-interaction-guide/` | `pm-interaction-guide.md` ✅ | v1 ✅ / v2 ✅ | PM 交互设计参考库 |
```

---

## Task 7: 最终交付确认

- [ ] **Step 1: 全量回归测试**

在浏览器中：
1. 打开 `index.html`，确认 v2 入口存在并可点击
2. 进入 v2，从「导言」依次浏览到「附录」
3. 抽查每章节至少 1 个概念页（保证 v1 已有功能没被破坏）
4. 词汇表全部 10 个卡片再过一遍 Popover

- [ ] **Step 2: 把变更告诉用户**

输出一段简短总结：
- 新建：`pm-interaction-guide/pm-interaction-guide-v2.html`
- 修改：`index.html`、`CLAUDE.md`
- 询问用户是否需要 commit 到 git

---

## 自查 Checklist

- [x] Spec 全部要求都有对应 task（10 个 demo 内容、智能定位、200ms 延迟、复用样式、单全局元素、index.html 更新、CLAUDE.md 更新）
- [x] 无 TBD / TODO / 占位符
- [x] 每个 demo 的 HTML 全部具体写出
- [x] 类型/函数名一致：`positionGlossaryPopover`、`showGlossaryPopover`、`hideGlossaryPopover`、`bindGlossaryPopover`、`GLOSSARY_DEMOS` 在所有出现处一致；交互函数 `popToggleSwitch` / `popToggleDropdown` / `popSelectDropdown` / `popShowScrim` / `popHideScrim` 名字与 onclick 处一致
- [x] 范围聚焦单一 feature
