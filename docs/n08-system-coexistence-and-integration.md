# N08：Genesis 与现有系统如何共存

> 核心问题：客户已经有 ERP、CRM、数据库、Data Platform、Semantic Layer、Knowledge Base、RAG、LLM Platform、Agent / Workflow 和业务 App，接入 Genesis 是否意味着推翻重来？

## 1. 核心原则：Reuse, don't replace

Genesis 的产品位置不应建立在“大迁移”上，而应建立在：

> **保留现有系统的职责和投入，把缺失的企业业务理解、Context、Capability 与 Governance 补上。**

最重要的对外表达：

> **不用推翻现有系统。Genesis 让现有数据、AI 和 Agent 开始共享同一个企业业务世界。**

---

# 2. 先明确每类现有系统仍然负责什么

| 现有能力 | 继续承担的职责 | Genesis 如何使用 |
|---|---|---|
| ERP / CRM / MES / 教务 / CMDB 等业务系统 | System of Record、业务流程、事务 | 读取当前 Facts；必要时通过受控 Action 回写 |
| Database / Lakehouse / Data Warehouse | 数据存储、加工、计算 | 复用数据与计算结果，不要求复制全部数据 |
| Data Platform | 集成、治理、指标、数据服务 | 作为主要数据能力和 Facts 来源之一 |
| Semantic Layer / MDM / KG | 指标语义、主数据、对象关系 | 优先映射 / 引用，作为 Genesis Business Model 的基础 |
| Knowledge Base / Search / RAG | 文档、检索、信息召回 | 作为 Context / Evidence 获取机制之一 |
| LLM / AI Platform | 模型路由、推理、模型治理 | Genesis 提供业务 Context / Capability，继续使用现有模型 |
| Agent / Workflow | 编排、工具调用、任务执行 | 调用 Genesis Capability；Genesis 也可调用已有 Agent / Tool |
| Business App / Copilot | 用户入口和业务体验 | 继续作为前端；通过 API / Capability 使用 Genesis |

原则：

> **谁已经把某件事做好，就继续让谁做；Genesis 不为“拥有数据”而重复造数据平台，不为“调用模型”而重复造模型平台。**

---

# 3. Genesis 自己真正需要持有什么

Genesis 不应默认复制整套企业数据。

更合理的是持有 / 管理：

- Business Model / Ontology；
- Source / Field / Object Mapping；
- Domain Pack / Enterprise Overlay；
- Rules / Methods / Policies；
- Context Templates / Assembly Logic；
- Evidence Requirements；
- Capability Definitions；
- Permission / Boundary Policy；
- Decision Trace / Audit Metadata；
- 必要的 Index / Cache / Derived Fact（按性能与场景需要）。

而大量实时业务数据仍留在原系统或 Data Platform。

因此必须区分：

> **Source of Truth ≠ Genesis 必须复制一份。**

Genesis 更像是知道：

> **事实在哪里、业务上是什么意思、当前任务应该怎样使用。**

---

# 4. 推荐架构：Federated Business Understanding

不要把架构画成必须所有数据先进入 Genesis 的中央仓库。

更准确的是：

```text
ERP / CRM / DB / Documents / Events
        ↓              ↓
 Data Platform    Search / RAG / KG
        ↘              ↙
             Genesis
   Business Model / Context / Capability
     Rules / Evidence / Permission
              ↕
        LLM / AI Platform
              ↕
      Agent / Workflow / App
              ↕
         Existing Systems
```

Genesis 负责在任务运行时联邦式地获取所需 Facts / Evidence，并按业务语义、规则和权限组装 Context。

必要时可以缓存、索引或物化部分数据，但不是要求把全企业数据迁入 Genesis。

---

# 5. Source of Truth 与回写原则

## Read

业务事实优先从权威业务系统 / Data Platform 获取，并保留 provenance。

## Derived Fact

Genesis 可以形成派生事实，例如：

> `CustomerRiskState = Attention`

但必须保留：

- 原始 Facts；
- Rule / Method 版本；
- 生成时间；
- Evidence；
- 当前有效状态。

## Write-back / Action

业务状态变更原则上通过现有系统的正式 API / Workflow 完成，而不是绕过原系统直接修改底层数据。

例如：

- 创建 CRM 跟进任务 → CRM API；
- 扩容服务 → K8s / Ops Platform；
- 调整信用等级 → 原审批系统；
- 更新教学计划 → 教务系统。

这样能够保留原系统事务、一致性、权限与审计机制。

---

# 6. 客户已有成熟 Ontology / KG 怎么办

原则：**能复用就不重建。**

如果客户已有：

- Enterprise Ontology；
- Knowledge Graph；
- Master Data Model；
- Semantic Layer；
- Business Glossary；

Genesis 应优先完成：

1. 对现有模型做映射 / 导入 / 引用；
2. 补充 AI 运行时缺少的 Facts、Rules、Context、Capability 和 Governance；
3. 只在现有模型无法表达当前场景时扩展。

因此 Genesis Ontology 不应被卖成“必须重新建一套企业本体”。

---

# 7. 客户已有 RAG / Agent 平台怎么办

## 已有 RAG

继续使用。Genesis 可以把它注册为 Evidence / Context Provider。

例如：

```text
合同条款 Evidence
    ↓
Existing RAG Search
    ↓
Genesis Context Assembly
```

## 已有 Agent / Workflow

继续使用。两种典型关系：

### Agent 调 Genesis

```text
Agent
  ↓
CustomerRiskAssessment Capability
  ↓
Genesis
```

### Genesis 调已有 Agent / Tool

```text
Genesis 判断需要创建任务
       ↓
Existing CRM Agent / Workflow
       ↓
CRM
```

因此 Genesis 不要求客户放弃已经投入的 Agent Framework。

---

# 8. 客户已有自己的 AI Platform 怎么办

Genesis 应保持 Model-agnostic / Runtime-agnostic：

- DeepSeek；
- Qwen；
- GPT；
- Claude；
- Gemini；
- 私有模型；
- 企业已有 Model Gateway / AI Platform。

Genesis 提供的是企业业务 Context、Capability 和 Governance，不要求控制所有模型基础设施。

如果企业已有模型路由、Token 管理、推理网关、安全策略，应优先集成。

---

# 9. 部署与集成不应该只有一种形态

从产品介绍角度，不必承诺某个具体技术协议，但架构上应支持几种模式：

## API / Service Integration

Genesis 通过 API 查询 Data / AI / Agent，并向 App 提供 Capability API。

## Event-driven Integration

业务事件触发 Fact 更新、Context / Capability 执行。

## Query Federation

运行时按需要访问 SQL、Graph、Search、API，而不是全部预复制。

## Materialized / Cached

对高频、低延迟、复杂计算场景，按需缓存 / 索引 / 物化部分 Facts 或关系。

核心不是技术协议，而是：

> **按场景决定哪些实时查询、哪些复用现有服务、哪些需要局部物化。**

---

# 10. 为什么这种共存方式很重要

如果 Genesis 要求企业先：

- 搬完所有数据；
- 重建全部 Ontology；
- 替换 RAG；
- 替换 Agent；
- 替换模型平台；

那么项目会迅速变成多年期基础设施改造，和目标用户“想把 AI 先用起来”的需求冲突。

更合理的落地是：

```text
一个真实业务问题
      ↓
只连接这个场景需要的数据 / 系统
      ↓
建立最小 Business Model / Domain Overlay
      ↓
定义一个或几个 Capability
      ↓
跑通 Context → Judgment → Action → Evidence
      ↓
把沉淀能力复用到下一场景
```

因此系统共存原则和 N11 的落地策略是一致的：**场景驱动、渐进建设、持续复用。**

---

# 11. 场景实例：已有 CRM + Data Platform + RAG + Agent

客户已有：

- CRM：客户 / 合同；
- Data Platform：应收与收入指标；
- RAG：合同 / 制度文档；
- Agent Platform：CRM 工具调用；
- DeepSeek：模型。

目标：回答并处理“哪些客户需要重点关注”。

Genesis 不重建这些系统，而是增加：

- Customer / Contract / Project / Receivable 的业务关系映射；
- 客户风险 Rules / Methods；
- `CustomerRiskAssessment` Capability；
- Evidence Requirements；
- Permission / Action Boundary；
- Task Context Assembly。

运行时：

```text
Data Platform → 当前应收 Facts
CRM → 客户 / 项目状态
RAG → 合同条款 Evidence
         ↓
      Genesis
CustomerRiskAssessment
         ↓
      DeepSeek
         ↓
风险判断 + Evidence
         ↓
Existing Agent → CRM 创建跟进任务
```

客户已有的五类技术全部继续使用，但第一次拥有一套可以跨 App / Agent 复用的业务理解与判断能力。

---

# 12. 官网表达

首页 / 产品页只需要讲三句话：

> **不用替换现有系统。**

> **数据、模型、Agent 继续用；Genesis 在中间补上业务理解、规则和能力。**

> **从一个业务问题开始接入，形成的能力再复用到更多场景。**

可以配一张非常简单的图：

```text
继续使用                    新增                      继续使用
ERP / CRM / Data  ↔        Genesis         ↔    AI / Agent / App
                         业务理解与能力
```

注意使用双向关系，而不是把 Genesis 画成所有流量必须通过的强制 ETL 管道。

---

# 13. N08 验收标准

- 明确现有 ERP / CRM / Data / KG / RAG / AI / Agent / App 可以继续使用；
- 不要求复制整个数据平台；
- Source of Truth 原则清楚；
- Derived Fact 和原始 Fact 边界清楚；
- 写操作优先通过现有业务系统 / Workflow；
- 已有 Semantic / KG / RAG / Agent 能成为 Genesis Provider / Runtime；
- 架构允许联邦查询与按需物化，而不是大迁移；
- 与“从一个场景开始”的实施路径一致；
- 官网可压缩成“保留现有系统 + 中间新增 Genesis + 渐进接入”。
