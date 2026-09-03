# N12：Genesis 首页信息架构

> 目标：把 N00–N11 已经定稿的产品逻辑重排成一个业务用户能自然看懂、技术负责人不会觉得虚、能够看到真实成果，并最终理解 Genesis 如何让 AI **采取行动、改变业务状态**的首页。

---

# 1. 首页只完成一条认知路径

首页不负责把 Genesis 的所有技术概念讲完。用户看完整页，应完成七次认知跳转：

```text
1. 原来我的 AI 不好用，不是因为模型不够聪明
             ↓
2. 原来 Data 和 AI 中间缺的是业务理解
             ↓
3. 原来 Genesis 能基于企业事实、语义和规则形成可靠判断
             ↓
4. 原来判断不是终点，AI 还能通过受控 Action 改变真实业务状态
             ↓
5. 原来这不是纯概念，已经有一些真实工程成果
             ↓
6. 原来它既有依据和边界，也不用推翻现有系统
             ↓
7. 原来我可以从自己的一个真实问题开始
```

因此首页采用 **7 个主体区块**。新增的 Action Loop 不是附属功能，而是“让 AI 真正为公司工作”的必要闭环。

---

# 2. Section 1 — Hero：Genesis 为什么存在

## 用户必须带走的三个信息

1. 通用 AI 已经很聪明；
2. 它缺的是对企业业务世界的理解与企业自己的工作方式；
3. Genesis 让 AI 从“能回答”进入“能判断、能行动、能持续工作”。

## 主标题

> **让 AI 真正为你的公司工作**

## 副标题

> **通用 AI 已经足够聪明。Genesis 补上企业事实、业务语义和工作方式，让现有模型真正理解你的公司，并在边界内判断、行动和完成工作。**

Hero 不堆 Ontology、Context、Evidence、Capability 等术语。

## Hero visual

整体仍采用一张统一画布和左 → 右慢刷新，但最终状态不再只写“企业专属 AI”，而应表达：

```text
通用 AI
  ↓
缺少企业业务理解
  ↓
Genesis
企业事实 · 业务语义 · 工作方式
  ↓
理解 · 判断 · 行动
  ↓
真实业务状态发生变化
```

右侧最多保留：

- **判断更可靠**；
- **行动有边界**；
- **能力可复用**。

Hero 次入口：

> **看看已经做到的场景 ›**

---

# 3. Section 2 — Gap：AI 和数据之间还缺业务理解

## 标题

> **你已经有 AI，也有数据。中间还缺业务理解。**

核心解释：

> **数据不会自动变成业务含义，业务含义也不会自动变成企业判断和工作方式。**

只回答三个问题：

### 发生了什么？
企业事实：当前数据、状态、时间、来源。

### 这意味着什么？
业务对象、关系、语义和上下文。

### 应该怎么做？
企业自己的规则、方法、权限和边界。

稳定表达：

> **数据平台让数据可用；Genesis 让 AI 理解数据背后的业务世界。**

首页不放完整 Data Platform / RAG / Agent 对比表。

---

# 4. Section 3 — Understand & Decide：用一个 instance 把判断机制讲透

## 标题

> **不是把更多数据塞给 AI，而是让它看懂当前业务。**

主场景继续使用客户重点关注 / 风险判断：

> **“这个客户现在有风险吗？”**

原始数据：应收逾期 18 天、合同 800 万、项目交付中。

Genesis 进一步知道：

- **Business Model**：客户是战略客户，合同、项目、应收之间有明确关系；
- **Facts / Context**：项目尚未验收，付款条件与验收相关，历史上曾延期；
- **Rules / Methods**：战略客户逾期 15 天进入重点关注，但未验收不得直接认定信用风险；
- **Evidence / Boundary**：判断回到 ERP、CRM、项目系统和合同；修改正式信用等级需要人工确认。

最终判断：

> **建议列入重点关注，但当前证据不足以认定信用风险。应先确认交付与验收责任。**

这一屏解释：

> **Object → Fact → Context → Rule → Evidence → Judgment**

Domain Pack 只在这里自然带出：

> **专业是共性的，工作方式是你的。**

---

# 5. Section 4 — Action Loop：判断不是终点，行动才改变业务世界

这是 V28 缺失、而 Genesis 价值闭环必须新增的一屏。

## 核心定义

> **理解和判断只改变认知；Action 才改变真实业务状态。**

Genesis 的终点不应该是一段漂亮回答，而应该是在规则、权限和审批边界内，把判断转化成真实业务动作。

## 标题首选

> **判断不是终点。行动，才真正改变业务。**

备选：

> **从理解世界，到改变世界。**

后者更有品牌感，可作为副标题。

## 核心闭环

```text
Observe
看到真实 Facts
    ↓
Understand
理解业务含义与 Context
    ↓
Decide
按企业 Rules / Methods 判断
    ↓
Act
调用 Capability / Workflow / API
    ↓
State Change
真实业务状态发生变化
    ↓
Observe Again
新状态成为新的 Facts
    ↺
```

这才是完整的企业 AI 闭环：

> **Facts → Understanding → Judgment → Action → New Facts**

## Action 不等于“让 LLM 随便调用工具”

Action 必须是 Business Capability 约束下的受控状态迁移。至少区分：

### Recommend
AI 给出判断和建议，不修改业务状态。

### Prepare
生成草稿、创建待办、准备审批材料，把动作准备好。

### Execute
在规则与权限允许时，调用正式 API / Workflow 完成低风险或可逆动作。

### Escalate / Approve
高影响、不可逆动作必须交给人确认或审批。

核心原则：

> **AI 可以判断，不代表 AI 可以直接执行。**

## 用同一个客户风险 instance 继续讲 Action

判断：

> 南桥集团需要重点关注，但证据不足以认定信用风险。

允许 Action：

- 自动创建“重点关注”跟进任务；
- 请求项目负责人补充验收状态；
- 拉取合同付款条件进入复核 Context；
- 发起风险复核流程。

不允许自动 Action：

- 直接修改正式信用等级；
- 自动发出违约通知。

人工确认后，CRM / 项目系统 / 风险系统状态发生变化。

这些变化又成为新的 Facts：

> 验收完成 / 未完成、负责人反馈、风险复核结果、信用等级变化……

Genesis 下一轮判断使用的是**变化后的真实世界**，而不是上一轮静态 Prompt。

## 这屏真正说明的产品差异

普通聊天 AI：

```text
Question → Answer
```

普通 Agent 容易被理解成：

```text
Question → LLM → Tool Call
```

Genesis 要表达的是：

```text
Business World
   ↓
Context + Rules + Evidence
   ↓
Judgment
   ↓
Governed Business Capability
   ↓
Action / Approval
   ↓
Business State Change
   ↓
New Facts
   ↺
```

因此“为公司工作”的定义应升级为：

> **不仅理解和回答，而是能够在企业边界内推动业务状态向前变化。**

---

# 6. Section 5 — Early Results：已经开始做出来的东西

标题建议：

> **从真实任务开始验证。**

放在 Action Loop 后面更合理：客户先理解 Genesis 的完整目标是“理解 → 判断 → 行动”，再看当前哪些部分已经有工程实现。

第一批成果仍然保持严格证据边界：

### 复杂资料 / 企业知识分析

当前：**已实现原型 / P0 + IMPLEMENTATION**。

已有 GraphRAG Basic / DRIFT / Local / Global 查询与 CLI / Python / API 工程入口。

### 多 Agent 投研研究与报告生成

当前：**已实现原型 / P0 + IMPLEMENTATION**。

已有 Research Director、专业分析角色、Report Writer / Editor 等协同链路和 GraphRAG 查询能力。

成果卡只展示：业务问题、已经做到哪一步、看得见的成果位、成熟度。

Living Registry：`docs/scenario-proof-registry.md`

---

# 7. Section 6 — Enterprise-ready：敢用，而且接得进

把 Trust 与 System Coexistence 合并。

## 左侧：为什么敢用

标题：

> **重要判断和行动，有依据，也有边界。**

只保留：

- **有依据** — 回到真实事实、来源和规则；
- **有边界** — 谁能看、判断什么、执行什么受到控制；
- **知道什么时候不知道** — 缺失、冲突、越权时停止；
- **可追溯** — 判断、审批、Action 和结果都能复盘。

核心句：

> **该自动的自动，该确认的确认，该停止的停止。**

## 右侧：不用推翻现有系统

```text
ERP · CRM · DB · Data Platform · KG · Knowledge Base
                         ↕
                      Genesis
            Context · Capability · Governance
                         ↕
             LLM · Agent · Workflow · App
```

Genesis 不应被画成所有请求必须经过的中央 chokepoint。

一句话：

> **数据、模型、Agent 和业务系统继续用；Genesis 让它们共享同一个业务世界，并通过正式接口推动业务变化。**

---

# 8. Section 7 — Value + Start：价值与 CTA

主标题：

> **不是让 AI 回答更多，而是让更多工作真正可以交给 AI。**

三个价值调整为：

### 判断更可靠
基于当前企业事实、规则与 Evidence。

### 行动真正发生
不止生成建议，而是在权限和审批边界内推动任务、流程和业务状态变化。

### 能力持续复用
一次形成的 Context / Capability / Rules 被更多模型、Agent、App 和场景继续使用。

落地三步：

```text
选一个真实问题
      ↓
跑通“理解 → 判断 → 行动”的可验证闭环
      ↓
把形成的能力复用到更多场景
```

主 CTA：

> **拿一个真实业务问题来验证 ›**

辅助说明：

> 不需要先治理整个公司的数据，也不需要先建立巨大的 Ontology。从一件最希望 AI 真正做好的工作开始。

---

# 9. 当前首页迁移决策

| 当前内容 | 新首页处理 |
|---|---|
| Hero 主标题 | 保留 |
| V27 / V28 Hero canvas | 继续重构，最终必须出现“理解 · 判断 · 行动” |
| 8 个模型 Logo | 弱化，只表达 model-agnostic |
| 四张业务理解卡 | 删除独立区，合并进 Gap / Instance |
| 四张泛场景卡 | 替换为 Early Results |
| 四个 Domain Pack 卡 | 删除独立大区，嵌入 Instance |
| Trust 原则 | 保留并扩展到 Judgment + Action |
| 系统共存 | 保留，强调正式 API / Workflow / Write-back |
| 技术 chips | 首页删除，下沉技术页 |
| Closing | 改成“理解 → 判断 → 行动”闭环 + Scenario-first CTA |
| 固定右侧 section-nav | 删除 |

---

# 10. 导航建议

推荐最多：

- **原理** → Gap / Instance；
- **场景** → Early Results；
- **开始** → CTA。

或者更克制：Genesis + 场景 + 联系。

---

# 11. 视觉原则

- 白 / 浅灰 / 黑 / Genesis 蓝；
- 少量大画面，不做 icon wall；
- 外层圆角 14–18px，内部 6–10px；
- Genesis Logo 使用真实 `src/assets/images/logo_256.png`；
- Hero 保留一个整体左 → 右慢刷新；
- Action Loop 可以使用一个非常克制的闭环线，不使用大量飞线、移动点和科技感粒子；
- Action 的视觉重点应该是 **Business State Before → Governed Action → Business State After**，而不是工具 Logo；
- Early Results 后续优先使用真实截图 / 输出 / Decision Trace。

---

# 12. 首页内容预算

建议完整首页控制在：

- **7 个主体 Section**；
- 1 个 Hero 主图；
- 1 个业务判断 instance；
- **1 个 Action Loop 主图**；
- 2 个 Early Result 卡；
- 1 个 Enterprise-ready 双栏；
- 1 个 Closing CTA。

新增 Action 是必要内容，不再用其他冗余卡片换取“6 屏”形式上的简洁。

---

# 13. N12 当前验收条件

- [x] Hero 只承担定位；
- [x] Business Understanding Gap 有独立解释位置；
- [x] 抽象定义使用真实 instance；
- [x] **明确加入 Judgment → Action → State Change → New Facts 闭环**；
- [x] Action 与 Agent Tool Call 区分清楚；
- [x] 高风险 Action 具有人审 / Boundary；
- [x] Early Results 与 Proof Level / Asset Status 对齐；
- [x] Domain Pack 不独立占大屏；
- [x] Trust 与 System Coexistence 合并；
- [x] 技术组件清单退出首页；
- [ ] 根据本 IA 形成 V29 HTML Preview；
- [ ] 桌面 / 移动端视觉检查；
- [ ] 用户确认后同步 `index.html`。

N12 仍为 `CURRENT`。下一阶段：V29 重点验证 Action Loop 是否真正把“让 AI 工作”讲完整。