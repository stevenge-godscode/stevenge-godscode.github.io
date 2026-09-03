# N08：Genesis 与现有系统如何共存

> 核心问题：客户已经有 ERP、CRM、Database、Data Platform、Semantic Layer、KG、RAG、LLM Platform、Agent / Workflow 和业务 App，接入 Genesis 是否意味着推翻重来？

## 最终方向：Reuse, don't replace

Genesis 不应该要求客户先完成“大迁移”。

> **保留已有系统的职责与投入，只补上缺失的企业业务理解、Context、Capability 与 Governance。**

对外表达：

> **不用推翻现有系统。Genesis 让现有数据、AI 和 Agent 开始共享同一个企业业务世界。**

---

# 一、不要把 Genesis 说成“所有流量必须经过的中间件”

“中间层”作为认知解释可以使用，但架构图如果画成：

```text
Everything → Genesis → Everything
```

会产生三个错误印象：

1. 所有数据必须搬进 Genesis；
2. 所有 AI 请求必须经过 Genesis；
3. Genesis 会成为新的性能 / 可用性单点。

更准确的架构角色是：

> **Shared Business Context & Capability Plane**

即企业共享的业务理解与能力平面。

它可以：

- 被 Agent / App 调用；
- 主动访问 Data / KG / RAG / API；
- 给 LLM 组装 Task Context；
- 调用已有 Agent / Workflow 完成 Action；
- 在某些场景只提供 Capability API，而不进入其他业务链路。

所以架构是“按需参与”，不是“强制穿透”。

---

# 二、现有系统继续负责什么

| 现有能力 | 继续承担的职责 | Genesis 如何复用 |
|---|---|---|
| ERP / CRM / MES / 教务 / CMDB | System of Record、事务、业务流程 | 获取 Facts；受控 Action 通过其正式接口回写 |
| Database / Lakehouse / Warehouse | 数据存储、加工、计算 | 查询或复用已有数据结果 |
| Data Platform | 集成、治理、指标、数据服务 | 作为主要 Facts / Metric Provider |
| Semantic Layer / MDM / KG | 指标语义、主数据、对象关系 | 作为 Business Model / Ontology 基础，能映射就不重建 |
| Knowledge Base / RAG | 文档、搜索、召回 | 作为 Context / Evidence Provider |
| LLM / AI Platform | 模型路由、推理、模型治理 | 继续使用已有模型与 Gateway |
| Agent / Workflow | 工具编排、流程与任务执行 | 调用 Genesis Capability，或被 Genesis 作为 Action Provider 调用 |
| Business App / Copilot | 用户入口与体验 | 继续保留，通过 API / Capability 使用 Genesis |

原则：

> **谁已经把某件事做好，就继续让谁做。**

---

# 三、Genesis 自己应该主要管理什么

Genesis 的一等资产不是企业全部原始数据，而是：

- Business Model / Ontology；
- Source / Object / Field Mapping；
- Domain Pack / Enterprise Overlay；
- Rules / Methods / Policies；
- Context Templates / Assembly Logic；
- Evidence Requirements；
- Business Capability Definitions；
- Permission / Boundary Policy；
- Decision Trace / Audit Metadata。

根据性能和场景需要，可以持有：

- Search Index；
- Cache；
- Derived Fact；
- Materialized Relationship / View。

但原则是：

> **Source of Truth 不需要为了 Genesis 再复制一份。**

Genesis 更重要的是知道：

> **事实在哪里、在业务里是什么意思、什么情况下应该使用、如何进入当前 Context。**

---

# 四、推荐架构：Federated Business Understanding

```text
      ERP / CRM / DB / Events
          ↕          ↕
     Data Platform   KG / RAG / Search
           ↘         ↙
      ┌─────────────────────┐
      │       Genesis       │
      │ Business Context    │
      │ Business Capability │
      │ Rules / Governance  │
      └─────────────────────┘
          ↕          ↕
      LLM / AI     Agent / Workflow
          ↘          ↙
             Apps
```

这里所有箭头都不是“必须经过”，而是按 Capability 和 Task Context 的需要调用。

运行时可以混合：

- SQL / Data API；
- Graph Query；
- Search / RAG；
- Business API；
- Event；
- Cached / Materialized Fact。

因此 Genesis 更接近一个 **federated business understanding plane**，而不是新的中央数据仓库。

---

# 五、Source of Truth、Derived Fact 与 Write-back

## Source Fact

原业务系统 / Data Platform 保持权威来源，并记录 provenance、时间和版本。

## Derived Fact

Genesis 可以形成业务派生状态，例如：

`CustomerRiskState = Attention`

但必须保留：

- 输入 Facts；
- Rule / Method 版本；
- Evidence；
- 生成时间；
- 有效性 / 失效条件。

## Write-back

业务修改尽量通过原系统的正式 API / Workflow：

- CRM 任务 → CRM API；
- K8s 扩容 → Ops / K8s API；
- 信用等级 → 审批系统；
- 教学计划 → 教务系统。

避免绕过业务系统直接修改底层数据库，从而继续复用原系统事务、一致性、权限和审计机制。

---

# 六、已有 KG / Semantic Layer / RAG / Agent 如何接入

## 已有 KG / Ontology / Semantic Layer

优先映射、引用和扩展，而不是重建。

Genesis 重点补：

> Facts + Runtime Context + Rules / Methods + Evidence + Permission + Capability

## 已有 RAG

注册为 Context / Evidence Provider：

```text
Existing RAG
    ↓
Contract Evidence
    ↓
Genesis Context Assembly
```

## 已有 Agent

两种方向都成立：

```text
Existing Agent → Genesis Capability
```

或：

```text
Genesis → Existing Agent / Workflow → Business System
```

## 已有 AI Platform

Genesis 保持 model-agnostic / runtime-agnostic，复用已有 Model Gateway、私有模型和治理策略。

---

# 七、四种典型接入方式

## 1. Capability API

已有 App / Agent 直接调用 Genesis 的业务能力。

## 2. Context Provider

已有 AI / Agent 保留自己的 Runtime，只向 Genesis 获取当前 Business Context / Evidence。

## 3. Orchestrated Capability

Genesis 组装 Context、完成业务判断，再调用已有 Agent / Workflow 执行动作。

## 4. Event-driven Capability

业务事件触发 Genesis Capability，例如：新告警、合同变化、应收逾期、学生测验完成。

客户不需要一次性采用全部模式。

---

# 八、场景驱动，而不是平台驱动的大改造

不建议实施路径变成：

> 先统一全公司数据 → 建完整本体 → 迁移全部知识 → 改造所有 Agent → 最后再上线应用。

更合理：

```text
一个真实、高价值业务问题
       ↓
连接场景需要的已有系统
       ↓
映射最小业务模型
       ↓
定义 Rules / Evidence / Capability
       ↓
跑通 Context → Judgment → Action
       ↓
沉淀并复用到下一个场景
```

这意味着 Genesis 的平台建设与业务应用不是先后两件事，而是：

> **业务闭环不断反哺平台能力，平台能力又降低下一个闭环的建设成本。**

---

# 九、完整实例：已有 CRM + Data Platform + RAG + Agent

客户已有：

- CRM；
- Data Platform；
- 合同 RAG；
- Agent Platform；
- DeepSeek。

目标：

> 哪些客户需要重点关注？

Genesis 新增的不是这五套系统的替代品，而是：

- 客户—合同—项目—应收业务关系；
- 企业风险 Rules / Methods；
- Evidence Requirements；
- Permission / Action Boundary；
- `CustomerRiskAssessment` Capability；
- Task Context Assembly。

运行：

```text
Data Platform → 应收 Facts
CRM → 客户 / 项目状态
RAG → 合同 Evidence
          ↓
       Genesis
 CustomerRiskAssessment
          ↕
      Existing LLM
          ↓
判断 + Evidence + Allowed Actions
          ↓
 Existing Agent → CRM 创建跟进任务
```

客户已有投资全部继续发挥价值。

---

# 十、官网表达

不要写“Genesis 位于所有系统中间”。

推荐：

> **现有系统继续用。Genesis 把它们背后的业务语义、事实、规则和能力组织起来，供 AI 和 Agent 按需使用。**

更短：

> **不用替换现有系统。**

> **数据、模型、Agent 继续用；Genesis 补上共享的业务理解与能力。**

> **从一个业务问题开始，形成的能力再复用到更多场景。**

视觉建议：使用双向连接 / 共享平面，而不是单向 ETL 漏斗。

---

# 十一、N08 验收标准

- ERP / CRM / Data / KG / RAG / AI / Agent / App 均可保留；
- Genesis 不要求复制全部企业数据；
- Source of Truth、Derived Fact、Write-back 边界清楚；
- 已有 Semantic / KG / RAG / Agent 可以成为 Provider / Runtime；
- 支持联邦查询与按需物化；
- Genesis 不被画成所有请求必须经过的 chokepoint；
- 可以从单一场景渐进接入；
- 与 N11 “业务闭环反哺平台”的落地逻辑一致；
- 官网可以用“Reuse existing stack + Shared Business Understanding & Capability”简单表达。
