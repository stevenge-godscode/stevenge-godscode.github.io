# Genesis Domain Pack：定义与场景映射

> 目的：解释 Domain Pack 为什么既不是固定行业模板，也不是每个客户从零定制；并用多个真实场景验证“领域共性 + 企业特性 + 运行时事实”的边界。

## 一、最终定义

### 一句话

> **Domain Pack 是把一个专业领域的可复用业务模型与能力，按照某家企业自己的数据、规则、方法和边界完成企业化配置。**

更短的表达：

> **专业领域共性 × 企业自己的工作方式。**

因此：

> **同一个领域，不同企业，会形成不同的 Domain Pack。**

Domain Pack 不是第三套平台，也不是独立于 Genesis 的运行层。它是 Genesis 业务理解层中的**领域化 / 企业化配置与能力包**。

---

# 二、三个层次必须区分

## 1. Domain Baseline / Blueprint：领域可复用部分

这是跨企业可以复用的专业基础，回答：

> **这个领域通常有哪些对象、关系、问题和工作模式？**

典型内容：

- 常见业务对象与关系；
- 领域术语和语义；
- 标准指标 / 状态模型；
- 专业知识和判断框架；
- Evidence 类型；
- Rule / Method 的结构；
- Capability 模板；
- Context 模板。

这里强调“结构和模板”，而不是假设所有企业采用相同规则。

## 2. Enterprise Overlay：企业化部分

回答：

> **这家公司在这个领域里到底怎么做？**

典型内容：

- 企业自己的对象扩展和术语；
- 企业数据源、字段和对象映射；
- 指标口径；
- 阈值和规则；
- 专家方法 / 策略；
- 流程；
- 权限和审批边界；
- Capability 参数、覆盖和扩展。

Domain Baseline 被 Enterprise Overlay 实例化以后，才形成真正给某家企业使用的 Domain Pack。

因此更严谨地说：

```text
Domain Blueprint
      +
Enterprise Overlay
      ↓
Company-specific Domain Pack
```

## 3. Runtime Facts / Context：当前发生的事情

Domain Pack **不固化企业当前实时事实**。

订单状态、市场行情、CPU、学生成绩等持续变化的数据，由 Genesis 在运行时从企业真实来源获取，并按照当前任务动态组装 Context。

因此完整关系是：

```text
Company-specific Domain Pack
           +
 Current Facts / Task Context
           ↓
 Enterprise-specific AI Capability
```

---

# 三、Domain Pack 与 Genesis 核心概念的关系

Domain Pack 是一个**包装 / 配置 / 复用单元**，不是另一个抽象层。

它可以组织或引用：

- Domain Ontology / Business Model；
- Semantic Definitions；
- Source Mapping；
- Rules / Methods；
- Context Templates；
- Evidence Requirements；
- Capability Definitions；
- Permission / Boundary Policies。

但当前业务 Facts 与当前 Task Context 在运行时产生，不应被理解为固定塞在 Pack 里。

---

# 四、场景一：企业经营

## Domain Baseline

领域共性可能包括：

- Customer、Contract、Project、Receivable；
- 客户-合同-项目-应收关系；
- 客户风险、回款风险、项目风险等标准问题；
- `CustomerRiskAssessment` Capability 模板；
- ERP / CRM / 合同 / 项目状态作为常见 Evidence 类型。

## Enterprise Overlay

南桥集团自己的做法，例如：

- “战略客户”的定义；
- 应收超过 15 天进入重点关注；
- 未完成验收时不能直接认定为信用风险；
- 风险升级需要业务负责人确认；
- ERP、CRM、项目系统的实际字段映射。

## Runtime

当前：某战略客户应收逾期 18 天、项目尚未验收。

于是相同“客户风险”能力最终按这家企业自己的规则工作。

---

# 五、场景二：智能运维

## Domain Baseline

- Service、Pod、Database、Dependency、SLO、Incident；
- 服务拓扑关系；
- 告警、故障、影响面、根因、处置等通用问题；
- `IncidentAssessAndRecommend` Capability 模板；
- Metrics、Trace、Log、CMDB 作为常见 Evidence。

## Enterprise Overlay

企业自己的：

- 哪些服务属于核心支付；
- P1 / P2 / P3 定义；
- P99 与错误率阈值；
- 自动扩容是否允许；
- 哪些操作必须人工确认；
- CMDB / K8s / 监控平台映射。

## Runtime

当前 payment-service CPU 95%、P99 1.8 秒、错误率 3.4%，并处于高峰期。

通用运维知识没有变，但企业规则决定它如何判断和处置。

---

# 六、场景三：投研

这个场景最能说明为什么 Domain Pack 不能只是固定行业模板。

## Domain Baseline

- Asset、Index、Portfolio、Factor、Market State、Strategy；
- 趋势、波动、风险、仓位等专业概念；
- 行情、成交量、行业 / 风格数据等 Evidence 类型；
- `TrendStateAssessment`、`RiskAssessment` 等 Capability 模板。

## Enterprise Overlay

某机构 / 某策略自己的：

- 中线周期 4–12 周；
- 第一波回调处理原则；
- 缩量 / 放量定义；
- 趋势确认与失效条件；
- 最大风险和仓位规则；
- 使用哪些数据源。

同一批市场数据，两个机构可能得到不同判断，不是因为谁“专业知识错了”，而是因为它们采用不同的方法、周期和风险体系。

因此：

> **领域知识只告诉 AI“金融通常是什么”；Enterprise Overlay 才告诉 AI“我们这家机构是怎么做金融的”。**

---

# 七、场景四：教育

## Domain Baseline

- Student、Course、Knowledge Point、Assessment、Learning Goal；
- 知识点依赖；
- 掌握度、薄弱点、学习路径等通用问题；
- `LearningGapAndNextStep` Capability 模板。

## Enterprise Overlay

学校 / 教师自己的：

- 课程体系和知识点映射；
- “掌握”的评分阈值；
- 学习路径规则；
- 是否必须教师确认；
- 学情、作业、测验系统的数据映射。

## Runtime

王同学当前函数题正确率 48%，不等式 55%，集合 92%。

Domain Pack 提供“怎么理解和判断”，当前学生状态则由运行时事实提供。

---

# 八、跨场景统一验证

| 层 | 企业经营 | 运维 | 投研 | 教育 |
|---|---|---|---|---|
| Domain Baseline | 客户/合同/应收模型 | 服务/拓扑/Incident 模型 | 标的/策略/市场模型 | 学生/知识点模型 |
| Capability Template | 客户风险判断 | 故障判断与处置 | 趋势/风险判断 | 学习诊断 |
| Enterprise Overlay | 客户等级、逾期规则 | P1 阈值、操作规则 | 周期、策略、失效条件 | 掌握阈值、教学规则 |
| Source Mapping | ERP/CRM/项目 | CMDB/K8s/Metrics | 行情/研究数据 | 测验/作业/课程 |
| Runtime Fact | 逾期18天 | CPU 95% | 回撤6% | 正确率48% |
| Task Context | 当前客户和合同 | 当前服务和高峰状态 | 当前市场和策略 | 当前学生和课程进度 |

四个场景证明同一个结论：

> **领域共性可以复用，企业方法必须企业化，当前事实必须运行时绑定。**

---

# 九、首页怎么讲

首页不要展示 Domain Pack 的完整技术结构。

建议一句标题：

> **同一个领域，每家公司都有自己的工作方式。**

解释：

> **Domain Pack 把专业领域的通用模型和能力，与企业自己的数据、规则、方法和边界结合，让 AI 不只懂这个行业，更懂你们公司是怎么做这个行业的。**

再用两个对照 instance 即可：

- **金融**：大家都看行情，但不同机构有不同策略周期、风险规则和判断方法；
- **运维**：大家都有告警，但不同企业对 P1、自动处置和审批边界定义不同。

最后落一句：

> **专业是共性的，工作方式是你的。**

这句话可以作为 Domain Pack 的核心传播表达候选。