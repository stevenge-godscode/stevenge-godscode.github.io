# N06：Genesis 与 Data / Semantic / RAG / Agent 的边界与比较

> 目标：不是证明 Genesis “比其他技术高级”，而是准确说明企业 AI 技术栈中各层负责什么、现有架构为什么仍会反复建设业务理解，以及 Genesis 新增的核心抽象和复用价值是什么。

## 1. 最终判断：问题不是缺一个技术组件，而是缺一个共享的“业务理解与能力平面”

企业常见技术栈已经很完整：

- Data Platform 管数据；
- Semantic Layer / Knowledge Graph 管部分语义和关系；
- Knowledge Base / RAG 找资料；
- LLM 负责语言理解和推理；
- Agent / Workflow 调工具和执行流程。

但很多项目仍然不好用，原因通常不是上述能力缺失，而是**业务含义、当前事实、判断规则、上下文、权限和工作方法没有成为跨应用共享的一等资产**。

它们往往散落在：

- Prompt；
- RAG 索引与检索逻辑；
- SQL / Python；
- Agent system prompt；
- Workflow 条件；
- Tool adapter；
- 应用代码；
- 人的脑子和 SOP 文档。

结果是：每做一个新的 AI 应用，都重新“教一遍公司”。

因此 Genesis 的核心价值不应该表述为：

> “在 Data 和 AI 中间再加一层软件。”

而应该表述为：

> **把原来散落在每个 AI 应用里的企业业务理解和工作方法，抽出来形成统一、持续、可治理、可复用的 Business Context & Capability。**

技术表达可称：

> **Business Context & Capability Layer / Plane for AI**

首页仍然使用“企业业务理解平台”，不需要暴露 Plane 这一术语。

---

## 2. 传统 AI + Data 架构真正的问题：Application-local Business Glue

常见做法：

```text
Data Platform
   ├─ AI App A
   │   ├─ Prompt A
   │   ├─ RAG A
   │   ├─ Rule A
   │   └─ Tool Mapping A
   │
   ├─ AI App B
   │   ├─ Prompt B
   │   ├─ RAG B
   │   ├─ Rule B
   │   └─ Tool Mapping B
   │
   └─ AI App C
       ├─ Prompt C
       ├─ RAG C
       ├─ Rule C
       └─ Tool Mapping C
```

这类架构本身可以工作，但规模化后产生五个问题：

1. **重复建设**：同一个“客户”“合同”“风险”的定义，每个应用重新解释；
2. **语义漂移**：不同 Agent 对同一个业务对象和规则理解不一致；
3. **规则碎片化**：业务规则埋在 Prompt、代码、Workflow 中，难统一版本和治理；
4. **证据割裂**：结论、数据来源、规则版本和执行动作无法天然形成统一链路；
5. **模型 / 应用耦合**：换模型、换 Agent 或增加应用时，需要重新实现大量业务 Glue。

Genesis 要解决的是这部分 **Application-local Business Glue**。

目标架构：

```text
                     ┌─ LLM / Agent A
Enterprise Systems   ├─ LLM / Agent B
       ↓              ├─ App C
 Data Platform        │
       ↕              │
 ┌─────────────────────────────┐
 │ Genesis                    │
 │ Business Model / Facts     │
 │ Rules / Methods            │
 │ Evidence / Permission      │
 │ Task Context Runtime       │
 │ Business Capabilities      │
 └─────────────────────────────┘
```

重点不是物理部署顺序，而是：

> **多个模型、Agent 和应用，共享同一套企业业务世界。**

---

## 3. Genesis 与各层的准确边界

| 技术 / 平台 | 核心抽象 | 首要解决的问题 | Genesis 如何使用它 | Genesis 额外负责什么 |
|---|---|---|---|---|
| Data Platform | Table / Dataset / Metric / Pipeline | 数据在哪里、如何治理、计算和提供 | 作为 Facts 和指标的重要来源 | 将数据绑定到业务对象、任务、规则和能力中 |
| Semantic Layer | Metric / Dimension / Business Term | 数据和指标业务上是什么意思 | 直接复用已有语义定义 | 将语义进一步放入动态 Context、Rules、Evidence、Capability |
| Knowledge Graph | Entity / Relation / Graph | 对象和关系是什么 | 可直接作为 Business Model / Relationship 来源 | 结合当前事实、时间、规则、权限和任务形成运行时业务理解 |
| Knowledge Base / RAG | Document / Chunk / Retrieval | 当前问题相关资料在哪里 | 作为 Context 获取手段之一 | 决定“当前任务需要什么业务事实/规则/证据”，不仅检索文本 |
| Fine-tuning | Model Weights / Behavior | 改变模型行为、表达和稳定能力倾向 | 可用于稳定领域能力或行为优化 | 动态事实、规则版本、权限、Evidence 不依赖模型权重维护 |
| LLM | Token / Reasoning / Generation | 如何理解语言、推理和生成 | 使用最合适的模型 | 为模型提供企业业务世界和可执行的业务能力 |
| Agent / Workflow | Task / Tool / Step | 调哪些工具、按什么过程完成任务 | Agent 可以调用 Genesis Capability | 定义业务能力的语义、事实、规则、Evidence 和边界 |
| Rule Engine / BPM | Rule / Process | 确定性判断和流程执行 | 可复用已有规则与流程 | 把规则放进业务对象、Context、Evidence 和 AI 判断体系中 |
| Genesis | Business Object / Fact / Context / Capability | 在这家公司、当前任务里，发生了什么、意味着什么、如何判断和工作 | 组合和复用现有技术 | 提供统一、持续、可治理的企业业务理解与能力基础 |

关键原则：

> **Genesis 不以底层技术实现作为差异化，而以“业务理解与能力”作为一等产品抽象。**

Ontology、Graph、RAG、Rules、LLM 都可以是实现 Genesis 的能力或外部依赖，但都不单独等于 Genesis。

---

## 4. 最重要的区别不是“有没有语义”，而是“复用单位是什么”

传统平台通常复用：

- 数据集；
- 指标；
- 文档库；
- Prompt；
- 模型；
- Tool；
- Workflow。

Genesis 希望进一步复用：

> **Business Capability**

例如：

`CustomerRiskAssessment(customer_id)`

它不是一个普通 API 名字，而是一套业务契约：

- “客户”是什么；
- 需要哪些当前事实；
- 哪些关系和历史进入 Context；
- 使用哪套风险规则；
- 需要什么 Evidence；
- 当前用户有什么权限；
- 哪些动作可自动执行；
- 什么情况必须人工确认；
- 返回结果包含什么判断、依据和下一步动作。

于是多个应用可以共享同一个客户风险判断能力，而不是各自在 Prompt 中重写一遍。

这应成为 Genesis 技术负责人价值主张中的核心：

> **从复用数据和模型，进一步走向复用企业业务能力。**

---

## 5. 用一个实际 instance 看各技术分别做什么

用户问：

> “南桥集团现在是否有经营风险？”

### Data Platform

提供：

- 应收逾期 18 天；
- 合同金额 800 万；
- 项目状态：交付中；
- 客户等级：战略客户。

它回答：**数据是什么。**

### Semantic Layer / Knowledge Graph

定义：

- 什么是客户、合同、项目、应收；
- 南桥集团与合同、项目、应收之间的关系；
- “逾期天数”“战略客户”的业务含义。

它回答：**对象和数据意味着什么。**

### RAG

找到：

- 合同条款；
- 风险管理制度；
- 项目验收规范；
- 历史会议纪要。

它回答：**相关资料在哪里。**

### LLM

基于给定信息完成推理、解释和语言生成。

它回答：**怎么推理和表达。**

### Agent

可以：

- 查 ERP；
- 查 CRM；
- 创建跟进任务；
- 发起审批。

它回答：**怎么调用工具完成动作。**

### Genesis

运行 `CustomerRiskAssessment(南桥集团)` 时：

1. 识别当前业务对象和任务；
2. 从已有数据平台取得当前 Facts；
3. 从 Business Model 获得对象关系；
4. 获取当前任务所需合同 / 制度 Evidence；
5. 选择适用的企业风险规则；
6. 根据当前用户过滤权限；
7. 动态形成 Task Context；
8. 调用 LLM / deterministic rules 完成判断；
9. 返回判断、Evidence、失效条件和允许的下一步动作；
10. 如需执行，再交给 Agent / Workflow。

Genesis 回答的是：

> **在这家公司、这个业务对象、这个时间点、这套规则和权限下，应该如何理解和处理这件事。**

---

## 6. 为什么不能简单说“RAG 不够”

RAG 可以非常强，并且 Genesis 本身完全可以使用 RAG。

真正区别不是：

> RAG 只能找文档，Genesis 更高级。

而是：

> **RAG 是 Context 获取的一种机制；Genesis 管理的是“当前任务为什么需要这些 Context，以及这些 Context 如何与业务对象、Facts、Rules、Evidence 和 Capability 共同构成一次业务判断”。**

同理：

- Graph 是表示关系的方法，不等于完整业务理解层；
- Rule Engine 是规则执行机制，不等于完整业务能力；
- Agent 是执行机制，不等于企业业务认知；
- Fine-tuning 是模型优化机制，不适合成为动态企业事实和权限的唯一载体。

---

## 7. 为什么不能简单说“数据平台做不到”

这也是必须诚实说明的边界。

如果一个企业现有数据 / Ontology / Knowledge 平台已经能够统一管理：

- 业务对象与关系；
- 当前事实和时间状态；
- 企业规则和方法；
- Evidence / provenance；
- Permission / Boundary；
- 动态 Task Context；
- 可复用 Business Capability；
- AI / Agent runtime contract；

那么它实际上已经覆盖了 Genesis 所要解决的问题空间。

因此 Genesis 不应该宣称：

> “只有 Genesis 能做这些。”

更准确的产品竞争力应来自：

1. **把这些能力作为一个完整的 AI Business Understanding 产品来设计，而不是由项目团队自行拼装；**
2. **Domain Pack 提供专业领域起点，减少从零建模；**
3. **Context Runtime + Capability Contract 直接面向 AI / Agent 工作；**
4. **跨模型、跨 Agent、跨应用复用；**
5. **Evidence、Rules、Permissions 与业务语义在同一体系治理。**

这使定位更可信，也能避免技术负责人反感“重新发明 Semantic Layer / KG”。

---

## 8. Genesis 对不同成熟度客户的增量价值不同

### 客户只有 ERP / 数据库 + 通用 AI

Genesis 提供完整业务理解层，增量最大。

### 客户已有成熟 Data Platform

直接复用数据治理、指标和接口；Genesis 重点补业务 Context、Rules、Capabilities。

### 客户已有 Semantic Layer / Knowledge Graph

尽量复用现有对象、语义和关系；Genesis 重点补当前 Facts、Context Runtime、企业 Rules / Evidence / Capability。

### 客户已有 RAG / AI Platform

保留模型、Vector DB、RAG、模型网关和评测体系；Genesis 将它们纳入统一业务 Context。

### 客户已有 Agent Platform

保留 Agent 编排；让 Agent 调用 Genesis 的 Business Capability，而不是每个 Agent 自己维护企业语义与规则。

因此一个重要销售原则是：

> **客户已有能力越成熟，Genesis 越应该“复用并补缺”，而不是要求重建。**

---

## 9. 首页与技术页面应该使用不同表达

### 首页不要展示技术对比矩阵

业务用户只需要理解：

> **你已经有数据，也已经有 AI。Genesis 补上 AI 真正理解你公司业务的那一层。**

以及：

> **不替换你现有的数据平台和 AI，而是让它们共享同一个企业业务世界。**

### 技术负责人页面再解释

推荐技术表达：

> **Genesis externalizes application-local business context into a shared, governed Business Context & Capability Layer.**

中文：

> **Genesis 把原本散落在各个 Prompt、RAG、Agent 和应用代码里的企业业务上下文与工作方法，提升为统一治理、跨应用复用的业务能力。**

---

## 10. N06 最终核心表达候选

业务版首选：

> **Genesis 不替换你的数据平台和 AI，而是让它们真正理解同一个企业业务世界。**

技术版首选：

> **Genesis 把应用内重复建设的业务语义、Facts、Rules、Context 和 Capability 抽离出来，形成跨模型、跨 Agent、跨应用共享的企业业务理解与能力层。**

价值版首选：

> **过去每做一个 AI 应用，都要重新教一遍公司；Genesis 让企业业务理解只建设一次、持续维护、多处复用。**

架构版首选：

> **Data Platform 管数据，AI Platform 管模型，Agent 管执行；Genesis 管 AI 工作时必须共享的企业业务世界与业务能力。**

---

## N06 验收标准

- 不把 Genesis 说成单纯的 RAG / KG / Semantic Layer 升级版；
- 不错误宣称数据平台、KG、Agent 无法实现类似能力；
- 清楚指出传统架构的实际问题是 Business Glue 散落在应用层；
- 清楚定义 Genesis 的核心复用单位从 Dataset / Prompt / Tool 上升到 Business Capability；
- 客户已有 Data Platform、KG、RAG、Agent 时，能明确说明哪些直接复用、哪些由 Genesis 补齐；
- 能用一个真实业务 instance 说明各技术各自做什么；
- 首页能压缩成两句话，技术页面可下钻到完整职责边界。