# N11：Scenario-first 客户入口与落地路径

> 核心问题：客户认同 Genesis 之后，如何从一个真实业务问题开始；同时，官网如何优先展示已经做出来的场景成果，而不是先要求客户理解完整平台架构？

---

# 1. 核心结论：从场景出发，而不是从平台建设出发

Genesis 的落地不应该从：

> 建全公司 Ontology → 接全量数据 → 建完整 Domain Pack → 再找应用

开始。

更合理的是：

> **先选一件真正想交给 AI 做好的业务工作，围绕它建立最小业务理解闭环；跑通后，再把形成的 Business Context / Capability 复用到更多任务。**

因此客户第一步不是“采购一个大平台”，而是：

> **拿一个真实业务问题来验证。**

---

# 2. Scenario-first 不等于项目制堆案例

场景是入口，不是最终产品边界。

错误方式：

```text
投研项目
运维项目
教育项目
经营项目
↓
每个项目一套 Prompt / RAG / Rule / Agent
```

Genesis 方式：

```text
真实场景 A ─┐
真实场景 B ─┼─→ 发现 / 建立共享 Business Model、Facts、Rules、Capability
真实场景 C ─┘
                    ↓
              Genesis 业务能力资产
                    ↓
          后续更多 Agent / App / 场景复用
```

所以：

> **场景负责产生价值，平台负责让场景产生的业务能力不再一次性消耗。**

---

# 3. 首页采用“场景成果先露出”的原因

对目标客户来说，最自然的问题不是：

> “你的 Ontology 架构是什么？”

而是：

> “它到底能不能解决我这种问题？”

因此在首页完成核心定位后，应尽快让用户看到：

> **Genesis 已经开始在哪些真实问题上工作，以及现在做到哪一步。**

这会把产品叙事从纯 Claim 变成：

```text
我也有这个问题
      ↓
他们已经开始做出来了
      ↓
为什么这些完全不同的场景可以用同一个平台？
      ↓
Genesis 的业务理解层 / Domain Pack / Capability
```

这是场景与平台定位之间最合理的关系。

---

# 4. 首页场景成果区的标准结构

不建议用传统四张“行业解决方案卡片”。

每一个成果只回答四件事：

## 4.1 一个真实问题

例如：

> **面对大量企业资料，怎么让 AI 不只是搜到文档，而是完成复杂检索和综合分析？**

或者：

> **一个复杂投研主题，怎么从信息检索一路形成结构化研究报告？**

## 4.2 已经做到哪一步

必须用事实描述，不用营销形容词。

例如：

> 已形成 Basic / DRIFT / Local / Global GraphRAG 查询实现，并提供 CLI / API 调用入口。

> 已形成 Research Director + 专业分析角色 + Report Writer 的多 Agent 研究与报告生成实现。

## 4.3 一个看得见的结果

优先展示：

- 一次真实 query 与结果；
- Context / Evidence；
- 一个最终判断；
- 一个生成报告；
- 一个 Decision Trace；
- 一个执行动作结果。

**不要只展示架构图。**

## 4.4 当前成熟度

固定展示：

> 已实现原型 / Working Demo / Customer POC / Production

成熟度是产品可信的一部分，不需要隐藏。

---

# 5. 推荐的第一批首页 Early Results

当前先从已有工程资产中选最容易补齐证据的场景。

详细登记见：`docs/scenario-proof-registry.md`。

## 5.1 企业知识 / 复杂资料图检索与分析

场景 ID：`SCN-KNOW-001`

业务表达：

> **让 AI 在复杂资料中找到关系、理解上下文，并完成多层次分析。**

当前已经存在：

- GraphRAG 查询工程资产；
- Basic / DRIFT / Local / Global Search；
- Python / CLI 调用；
- API 查询服务；
- 图实体、关系、社区、文本单元等查询基础。

当前最适合对外称：

> **已实现原型**

下一步只需补标准数据集、代表问题、样例输出、截图 / 录屏，就可以升级成标准 P1 Working Demo。

## 5.2 多 Agent 投研研究与报告生成

场景 ID：`SCN-INV-002`

业务表达：

> **把一个复杂研究任务拆给不同专业角色，完成检索、分析、整合和结构化交付。**

当前已经存在：

- Research Director；
- Technical / Market Expert；
- Report Writer / Editor / Visualization 等角色；
- 多 Agent 协同研究流程；
- GraphRAG 查询能力；
- 结构化报告输出实现。

当前最适合对外称：

> **已实现原型**

下一步固定一个研究主题，并保存完整输入、中间结果、最终报告和 Evidence，可升级为 P1。

---

# 6. 已做客户场景如何放到首页

真实 POC / 客户项目应优先于纯概念场景，但必须先登记证据边界。

对于尚未获得公开授权的客户：

不要写：

> 某某公司已经使用 Genesis……

而写：

> **某消费企业 · 经营分析 POC**

或者：

> **某教育机构 · 学习诊断验证**

卡片重点不是客户 Logo，而是：

1. 客户原问题；
2. 实际接入了什么；
3. 哪条业务链已经跑通；
4. 当前仍有什么限制；
5. POC 证明了什么；
6. 尚未证明什么。

当客户允许公开后，再升级为 P4 Reference。

---

# 7. 一个场景的落地路径

建议统一为六步，而不是先做大平台建设。

## Step 1 — Pick the Work

选一件：

- 有真实业务价值；
- 今天主要依赖人工判断 / 跨系统查询；
- 可以定义“做得好不好”；
- 数据和业务负责人可触达；
- 4–8 周内有机会形成闭环。

重点不是选“最宏大的 AI 战略”，而是选一个值得验证的工作单元。

## Step 2 — Define the Decision / Deliverable

明确 AI 最终交付什么：

- 判断；
- 建议；
- 报告；
- 工作产物；
- Action；
- 人工审批请求。

以及：

> 什么叫正确？什么情况下应该说不知道？

## Step 3 — Build Minimum Business World

只围绕当前场景建立最小必要业务世界：

- Objects / Relationships；
- Facts / Sources；
- Rules / Methods；
- Permission / Boundary；
- Evidence Requirements。

> **不先建“全公司 Ontology”。**

## Step 4 — Run the Capability

形成一个明确 Business Capability，例如：

`CustomerRiskAssessment(customer_id)`

并跑通：

```text
真实用户 / 任务
      ↓
真实 Facts
      ↓
Task Context
      ↓
Rules / Methods / Evidence
      ↓
AI Judgment
      ↓
Action / Human Approval
```

## Step 5 — Prove It

进入 N10 Proof Framework：

- 先做到 P1 Demo；
- 再用真实客户数据做 P2 POC；
- 有生产指标再进入 P3。

POC 验收重点优先是：

- 是否解决真实问题；
- 关键判断是否能回到 Evidence；
- 与业务专家的一致程度；
- 时间 / 人工步骤是否减少；
- 错误时是否安全退出。

## Step 6 — Reuse and Expand

第一个场景跑通后，不是重新做第二个项目，而是检查哪些已经形成的资产可以直接复用：

- Ontology / Business Objects；
- Source Mapping；
- Facts；
- Rules / Methods；
- Context Templates；
- Evidence Policies；
- Capability；
- Domain Pack。

这样第二个场景应该比第一个更快。

> **这是 Genesis 从“项目”变成“平台”的时刻。**

---

# 8. 首个场景选择标准

不要选：

- 依赖全公司数据才能启动；
- 业务结果半年后才知道；
- 完全没有明确负责人；
- 只为了展示 AI 很酷；
- AI 对最终工作几乎没有增量价值。

优先选：

| 维度 | 好的首场景 |
|---|---|
| Pain | 用户已经明显觉得麻烦 |
| Frequency | 经常发生，不是半年一次 |
| Judgment | 存在真实业务判断，而不是简单查数据 |
| Context | 需要跨数据、规则、关系和历史理解 |
| Evidence | 判断可以定义依据 |
| Boundary | 能明确什么由 AI 做、什么由人确认 |
| Measurement | 4–8 周能看到效率 / 质量 / 复用变化 |
| Expansion | 跑通后资产可以延展到相邻场景 |

这里“4–8 周”是场景筛选目标，不是对所有项目工期的承诺。

---

# 9. CTA 不应该只是“联系我们”

Genesis 首页的 CTA 应该与产品方法一致。

主 CTA 候选：

> **拿一个真实业务问题来验证**

辅助解释：

> 从一件最希望 AI 做好的工作开始。我们一起梳理事实、业务规则和判断边界，先跑通一个可验证闭环。

次级 CTA：

> **看看已经跑过的场景**

这样 CTA 本身就在解释 Genesis 的落地方式。

---

# 10. N11 最终结论

> **Genesis 应该从场景进入，但不止于场景。**

完整商业路径：

```text
真实业务问题
      ↓
最小业务世界
      ↓
可验证 Capability
      ↓
Demo / POC / Production
      ↓
沉淀共享业务理解与能力
      ↓
更多场景更快复用
```

首页成果表达：

> **先让客户看到我们已经开始把哪些工作做出来，再告诉他为什么这些看似不同的场景背后其实是一套 Genesis。**
