# Genesis 产品介绍 DAG

> 目标：把 Genesis 官网从“功能说明”整理为完整的客户认知闭环，并按 DAG 节点逐个定稿。

## 工作原则

- 首页优先服务：**已经想用 AI、甚至已经试过通用 AI，但发现进入真实企业业务后不好用**的业务负责人和技术负责人。
- 页面主线：**痛点 → 为什么会这样 → Genesis 补了什么 → 为什么可信 → 达成什么价值 → 怎么开始**。
- 不把 Genesis 讲成另一个大模型 / RAG / Agent / 数据平台。
- 不贬低现有技术；解释各层各自解决什么，以及 Genesis 补哪一层。
- 首页先讲客户问题和业务价值；技术概念只用于解释可信性、差异化和落地。
- 每个抽象概念必须能用真实业务 instance 解释，并至少跨多个场景验证。
- 主 DAG 只保留稳定结论和状态；复杂推导进入独立文档。

## 状态

- `DONE`：结论和表达已稳定。
- `CURRENT`：当前优先讨论。
- `DRAFT`：已有方向，待收敛。
- `TODO`：尚未正式讨论。
- `BLOCKED`：依赖前置节点。
- `OPTIONAL`：重要，但不阻塞首页主线。

## DAG

```mermaid
flowchart LR
    N00["N00 目标用户\nDONE"]
    N01["N01 通用 AI 为什么不好用\nDONE"]
    N02["N02 AI + 数据之间的业务理解断层\nDONE"]
    N03["N03 Genesis 到底是什么\nDONE"]
    N04["N04 Genesis 核心机制\nDONE"]
    N05["N05 Domain Pack\nDONE"]
    N06["N06 与现有技术边界\nDONE"]
    N07["N07 可信、可控、安全\nDONE"]
    N08["N08 与现有系统共存\nCURRENT"]
    N09["N09 最终客户价值\nDRAFT"]
    N10["N10 场景与证据\nDRAFT"]
    N11["N11 落地路径与 CTA\nDRAFT"]
    N12["N12 首页信息架构与视觉\nBLOCKED"]
    N13["N13 为什么是现在\nOPTIONAL"]

    N00 --> N01 --> N02 --> N03 --> N04 --> N05 --> N06 --> N07 --> N08
    N05 --> N09
    N06 --> N09
    N07 --> N09
    N08 --> N09
    N09 --> N10 --> N11
    N01 --> N12
    N02 --> N12
    N03 --> N12
    N05 --> N12
    N06 --> N12
    N07 --> N12
    N08 --> N12
    N09 --> N12
    N10 --> N12
    N11 --> N12
    N00 --> N13
```

## 节点总表

| 节点 | 核心问题 | 状态 | 首页作用 |
|---|---|---|---|
| N00 目标用户 | 谁会觉得 Genesis 有价值？ | DONE | 决定全站语言 |
| N01 通用 AI 为什么不好用 | 为什么模型很聪明，一进企业就不好用？ | DONE | 建立痛点共识 |
| N02 业务理解断层 | 企业已有 AI 和数据平台，为什么还不够？ | DONE | 建立 Genesis 必要性 |
| N03 Genesis 是什么 | Genesis 补的是哪一层？ | DONE | 产品定位 |
| N04 核心机制 | 怎样把企业业务世界变成 AI 可使用的 Context 与 Capability？ | DONE | 方案解释 |
| N05 Domain Pack | 如何复用领域能力，同时表达企业自己的工作方式？ | DONE | 领域化 / 企业化 |
| N06 边界比较 | 与 Data Platform、Semantic Layer、KG、RAG、Fine-tuning、Agent 的关系？ | DONE | 避免错误归类 |
| N07 可信可控 | 为什么敢让 AI 真正判断和工作？ | DONE | 建立信任 |
| N08 系统共存 | 现有 ERP、CRM、Data、KG、RAG、AI、Agent 如何复用？ | CURRENT | 降低实施顾虑 |
| N09 最终价值 | 企业专属 AI 最终带来什么？ | DRAFT | 价值闭环 |
| N10 场景与证据 | 如何证明价值？ | DRAFT | Proof |
| N11 落地路径 | 客户怎样低成本开始？ | DRAFT | CTA |
| N12 首页结构 | 如何形成低认知负担的首页？ | BLOCKED | 最终页面 |
| N13 为什么是现在 | 为什么企业化成为新的 AI 瓶颈？ | OPTIONAL | 市场背景 |

---

# N00–N03 DONE：需求与定位

目标用户：已经尝试通用 AI、希望进入真实业务的业务负责人，以及已有 Data / RAG / Agent 基础但发现业务理解被重复建设的技术负责人。

核心痛点：

> **通用 AI 很聪明，但一到你的公司就不好用了。**

原因压缩为：

> **事实 → 理解 → 行动**

即 AI 缺少企业事实、业务语义 / 上下文和企业工作方式。

业务理解断层：

> **有 AI + 有企业数据，不自动等于企业 AI。**

> **AI 缺的不是更多数据，而是知道这些数据在你的公司意味着什么。**

Genesis 产品定义：

> **Genesis 是连接企业业务世界与通用 AI 的企业业务理解平台。**

品牌表达：

> **大模型已经懂世界。Genesis 让它懂你的公司。**

---

# N04 DONE：核心机制

三部分：

1. **长期业务底座**：Business Model / Ontology、Source Binding、Rules / Methods / Boundaries、Capability Definitions；
2. **动态 Task Context**：按用户、任务和对象动态组合 Facts、Evidence、关系、历史、规则和权限；
3. **Business Capability**：把企业如何稳定完成某类判断 / 工作沉淀成可复用能力契约。

关键边界：

> **Context 解决“这一次 AI 需要知道什么”；Capability 解决“这家公司如何稳定、重复地完成这类工作”。**

完整场景：`docs/product-concept-scenario-instances.md`

---

# N05 DONE：Domain Pack

> **Domain Pack = Domain Blueprint + Enterprise Overlay。**

领域复用的是专业结构和能力框架；企业必须配置自己的数据、指标口径、规则、方法、流程、权限和 Capability 扩展；当前 Facts / Context 运行时绑定。

传播表达：

> **专业是共性的，工作方式是你的。**

详细：`docs/domain-pack-scenario-mapping.md`

---

# N06 DONE：与现有技术边界

Genesis 不和 Data Platform、Semantic Layer、KG、RAG、Fine-tuning、LLM、Agent 比“谁更高级”，而是把 AI 项目中散落的 Business Glue 提升成企业共享资产：

> **Application-local Business Glue → Shared Enterprise Business Understanding**

不同技术的一等复用对象：

| 技术 | 典型复用对象 |
|---|---|
| Data Platform | Dataset / Table / Metric |
| Semantic Layer | Metric / Dimension / Business Term |
| Knowledge Graph | Entity / Relationship |
| RAG | Document / Chunk / Retrieved Context |
| Fine-tuning | Model behavior / learned pattern |
| Agent / Workflow | Tool / Task / Workflow |
| **Genesis** | **Business Context / Business Capability** |

原则：已有 Data / Semantic / KG / RAG / AI / Agent 能复用就不重建。

稳定表达：

> **Genesis 不替企业重建 AI 技术栈，而是让现有 Data、AI、Agent 共享同一个企业业务世界。**

> **过去每做一个 AI 应用，都要重新教一遍公司；Genesis 让业务理解持续维护、多处复用。**

详细：`docs/n06-platform-boundary-and-comparison.md`

---

# N07 DONE：可信、可控、安全

最终拆成两层：

## Business Trust Plane

Genesis 的核心治理能力：

```text
Governed Source
      ↓
Traceable Fact
      ↓
Authorized Context
      ↓
Governed Judgment
      ↓
Controlled Action
      ↓
Auditable Result
```

六个控制面：

- Source & Fact Governance；
- Context Governance；
- Judgment Governance；
- Evidence & Uncertainty；
- Action Governance；
- Audit / Recovery / Human Override。

Safe Failure / Abstention 是正常能力：缺事实、证据冲突、数据过期、越权或超出 Capability 边界时，应停止或升级处理。

## Platform Security Baseline

IAM、Tenant Isolation、Encryption、Secrets、Network、Data Residency、Prompt Injection / Tool Security、Sandbox、Security Logging 等属于企业级基础安全，与 Genesis Business Trust Plane 互补。

首页压缩：

> **有依据 / 有边界 / 知道什么时候不知道 / 可追溯**

> **有依据才判断；没有依据，就明确说不知道。**

> **该自动的自动，该确认的确认，该停止的停止。**

详细：`docs/n07-trust-control-framework.md`

---

# N08 CURRENT：与现有系统共存

当前核心原则：

> **Reuse, don't replace.**

现有系统继续承担各自职责：

- ERP / CRM / MES / CMDB 等继续是 System of Record；
- Data Platform 继续做集成、治理、指标与数据服务；
- Semantic Layer / MDM / KG 优先复用为 Business Model 基础；
- Knowledge Base / RAG 作为 Context / Evidence Provider；
- LLM / AI Platform 继续负责模型能力；
- Agent / Workflow 继续负责编排与执行；
- App / Copilot 继续作为用户入口。

Genesis 主要沉淀：

> **Business Model / Mapping / Domain Pack / Rules / Context / Evidence Requirements / Capability / Permission / Decision Trace**

并按场景决定实时联邦查询、复用现有服务，还是局部 Cache / Index / Materialization。

关键架构原则：

> **Source of Truth 不需要搬进 Genesis。Genesis 更重要的是知道事实在哪里、业务上是什么意思、当前任务应该怎样使用。**

业务写操作优先通过原业务系统正式 API / Workflow 完成，保留其事务、权限和审计机制。

首页候选：

> **不用替换现有系统。**

> **数据、模型、Agent 继续用；Genesis 在中间补上业务理解、规则和能力。**

> **从一个业务问题开始接入，形成的能力再复用到更多场景。**

详细：`docs/n08-system-coexistence-and-integration.md`

N08 下一步重点：进一步确认“中间层”表达不会让客户误解成所有流量必须经过 Genesis，以及如何把渐进接入与 N11 落地路径连起来。

---

# N09 DRAFT：最终客户价值

候选：判断更可靠、工作更专业、真正进入业务、业务能力可复用、减少重复建设和失控风险。

# N10 DRAFT：场景与证据

每个场景必须有：**原来怎么做 → Genesis 如何介入 → 结果变化 → Evidence / 指标**。

# N11 DRAFT：落地路径与 CTA

从一个真实、高价值业务问题开始，跑通闭环，再沉淀并复用能力。

# N12 BLOCKED：首页信息架构与视觉

关键主节点定稿后统一重构，不按内部模块顺序堆页面。

# N13 OPTIONAL：为什么是现在

模型能力已足够强，企业 AI 的瓶颈逐步从“模型够不够强”转为“有没有企业业务上下文、治理和可复用业务能力”。

---

## 更新记录

- 2026-09-03：N00–N06 定稿。
- 2026-09-03：N07 定稿。可信机制拆为 Business Trust Plane + Platform Security Baseline。
- 2026-09-03：进入 N08，采用 Reuse, don't replace / Federated Business Understanding 原则。
