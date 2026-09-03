# N10：Genesis 场景与 Proof 分级框架

> 目标：建立一套可持续维护的场景与证据体系。场景用于解释 Genesis，Proof 用于证明 Genesis。框架一次定稿，具体场景与证据长期逐步填充和升级。

---

## 1. 基本原则：Scenario 与 Proof 必须分开

### Scenario / Instance

回答：

> **Genesis 在一个真实业务问题里到底怎么工作？**

它可以是设计出来的示例，用于解释 Object、Fact、Context、Rule、Evidence、Capability、Action 等抽象概念。

### Proof / Evidence

回答：

> **Genesis 是否已经在真实环境中把这件事做出来，并产生了什么可验证结果？**

Proof 必须来自可核验的 Demo、POC、生产运行、客户确认、指标或可公开引用材料。

核心纪律：

> **不能把一个设计得很真实的 Scenario 写成一个已经发生的客户案例。**

> **没有 Proof 的价值只能作为“预期价值 / 设计目标”，不能写成“已经提升 / 已经降低 / 已经实现”。**

---

# 2. Proof Ladder：五级证据等级

| 等级 | 名称 | 定义 | 最低证据要求 | 允许的对外表述 |
|---|---|---|---|---|
| **P0** | Concept Scenario | 设计的业务实例，用于解释产品逻辑 | 完整 Scenario Card；逻辑自洽；概念映射完整 | “例如…”、“可以用于…”、“典型场景是…” |
| **P1** | Working Demo | 产品在受控 Demo / 测试环境中实际跑通 | 可重复演示；输入输出可检查；关键链路真实执行 | “产品已可演示…”、“当前版本支持…” |
| **P2** | Customer POC | 在真实客户数据、规则或环境中完成验证 | 明确客户场景；真实数据/接口；验收记录或 POC 结果 | “已在真实企业环境验证…”；若未授权，不公开客户名 |
| **P3** | Production Outcome | 已进入正式生产/业务使用并有持续结果 | 生产运行记录；实际用户；持续指标；业务结果 | “已在生产业务中运行…”、“实际结果显示…” |
| **P4** | Reference Proof | 客户允许公开名称、场景、数据或评价 | 客户授权；公开案例材料；可引用指标/评价 | 可公开客户名、Logo、指标、testimonial / case study |

## 2.1 升级原则

Proof Level 只升不“猜”。每一级必须有独立证据。

```text
P0 Concept
    ↓ 实际可运行
P1 Demo
    ↓ 真实客户环境 / 数据验证
P2 POC
    ↓ 正式生产持续运行
P3 Production
    ↓ 获得公开授权
P4 Reference
```

P4 不是“技术更强”，而是**公开可引用程度更高**。一个很强的生产案例，如果客户不允许公开，仍然应保持 P3。

---

# 3. Scenario Card：每个场景统一使用同一套结构

每个场景必须回答下面这些问题，缺失项允许暂时标 `TBD`，但不能用模糊营销语句代替。

## A. Identity

- **Scenario ID**：唯一编号，例如 `SCN-BIZ-001`；
- **Domain**：经营 / 运维 / 投研 / 教育 / 医疗 / 其他；
- **Scenario Name**：客户语言描述；
- **Primary Persona**：谁最在意这个问题；
- **Proof Level**：P0–P4；
- **Lifecycle Status**：Draft / Ready / Validating / Active / Archived；
- **Disclosure**：Internal / Anonymized / Public。

## B. Business Problem

### 1. Trigger / User Question

用户什么时候会提出什么问题？

> 例：哪些客户最近需要重点关注？为什么？

### 2. Current Way / Baseline

没有 Genesis 时怎么做？

- 人工查哪些系统；
- 需要谁参与；
- 需要多长时间；
- 哪些判断依赖个人经验；
- 哪些信息容易遗漏或不一致。

### 3. Why Existing AI Is Not Enough

明确指出通用 AI / RAG / Agent 在这个具体场景中缺的是什么，而不是泛泛说“不懂业务”。

## C. Genesis Business World

### 4. Business Objects / Relationships

具体 instance 是什么？

### 5. Facts / Sources

当前事实是什么，分别来自哪些 System of Record / 文档 / 事件？

### 6. Rules / Methods / Boundaries

企业自己的判断规则、专家方法、权限和执行边界是什么？

### 7. Dynamic Task Context

当前任务需要从整个业务世界中动态选取什么，而不是把什么都交给模型？

## D. Capability & Work

### 8. Business Capability

这个场景最终沉淀成什么可复用能力？

例如：

`CustomerRiskAssessment(customer_id)`

需要明确：

- Input；
- Output；
- Context Requirements；
- Rules / Methods；
- Evidence Requirements；
- Permissions；
- Allowed Actions；
- Human Approval Conditions。

### 9. AI / Agent Role

- LLM 做什么推理；
- Genesis 负责什么业务理解与约束；
- Agent / Workflow 做什么执行；
- 人仍然负责什么。

### 10. Result / Action

最后到底产生：

- 判断；
- 建议；
- 工作产物；
- 业务动作；
- 人工确认 / 升级。

## E. Trust

### 11. Evidence

结论能追溯到哪些 Facts、来源和规则？

### 12. Safe Failure

什么情况下必须：

- 说不知道；
- 补充信息；
- 停止判断；
- 请求人工确认；
- 禁止动作。

## F. Value & Measurement

### 13. Expected Value

P0/P1 阶段只能写“预期价值”，例如：

- 减少跨系统人工查询；
- 减少重复判断；
- 缩短形成结论的时间；
- 降低漏看关键事实的概率；
- 让同一判断能力跨 Agent / App 复用。

### 14. Metrics

按场景选择，不要求所有指标都用：

**效率**
- Decision Lead Time；
- Task Completion Time；
- Human Touches；
- Cross-system Queries；
- Time-to-Value。

**质量**
- Decision Agreement / Expert Agreement；
- Evidence Coverage；
- Rework Rate；
- False Positive / False Negative；
- Abstention Quality。

**自动化**
- Task Completion Rate；
- Auto vs Human Approval Ratio；
- Safe Failure Rate；
- Action Success / Rollback Rate。

**平台复用**
- Capability Reuse Count；
- Number of Apps / Agents Reusing Capability；
- New Scenario Build Time；
- Reused Context / Rule / Ontology Assets。

**业务结果**
- 仅在能建立合理因果关系时使用，例如损失减少、回款改善、MTTR 降低、转化提升等。

不要因为有业务指标变化，就自动归因给 Genesis。

## G. Proof Package

### 15. Evidence Artifacts

记录实际存在的证据：

- Demo URL / recording；
- Screenshot；
- Test result；
- POC 验收文档；
- 客户反馈；
- Metric dashboard；
- Production logs；
- Decision trace；
- Customer authorization；
- Public reference URL。

### 16. Claim Boundary

明确这一场景现在**能说什么 / 不能说什么**。

例如：

> 能说：已在真实客户数据环境验证客户经营风险判断链路。

> 不能说：帮助客户回款率提升 30% —— 尚无生产指标支持。

---

# 4. 场景登记表 Scenario Registry

> 这是持续维护的索引，不在这里重复完整场景内容。每个场景可后续拆成独立文件。

| ID | 场景 | Domain | 当前 Proof | 状态 | 主要用途 | 详细文档 |
|---|---|---|---|---|---|---|
| `SCN-BIZ-001` | 哪些客户最近需要重点关注？ | 企业经营 | **P0** | Ready | 首页主案例候选 / 产品解释 | `docs/product-concept-scenario-instances.md` |
| `SCN-OPS-001` | 支付服务异常是否严重，应该怎么处理？ | 智能运维 | **P0** | Ready | 行业页 / 技术解释 | `docs/product-concept-scenario-instances.md` |
| `SCN-INV-001` | 当前回调是正常分歧还是趋势破坏？ | 投研 | **P0** | Ready | Domain Pack 解释 / 方法差异 | `docs/product-concept-scenario-instances.md` |
| `SCN-EDU-001` | 学生哪里没掌握，下一步应该学什么？ | 教育 | **P0** | Ready | 行业页 / 业务理解解释 | `docs/product-concept-scenario-instances.md` |

当前这四个场景全部明确标记为 **P0 Concept Scenario**。除非后续有真实 Demo、POC 或生产证据，否则不升级、不写成真实客户案例。

---

# 5. 页面与材料如何使用不同 Proof Level

## 首页

首页的目标是**快速理解产品 + 建立基本可信度**。

建议：

- P0：可以用作单一主场景解释产品，但必须写成“例如 / 典型场景”；
- P1：可写“当前产品可支持 / 已可演示”；
- P2：开始具备较强说服力，适合匿名 Proof；
- P3/P4：优先作为首页正式客户证据。

首页不要做场景大全。

## 行业 / Domain Pack 页面

允许组合：

- P0：解释行业逻辑；
- P1/P2：证明可行性；
- P3/P4：形成真正行业案例。

## 销售 / POC 材料

可以展示更多内部 P1/P2 证据，但必须遵守 Disclosure 和客户保密要求。

## 技术文档

重点展示：

- Context；
- Capability；
- Evidence；
- Permission；
- Integration；
- Decision Trace。

不需要强求客户营销式案例表达。

---

# 6. 如何选择“首页主场景”

不是 Proof Level 最高就一定最适合首页。建议用五个维度筛选：

| 维度 | 问题 |
|---|---|
| **共鸣度 Resonance** | 目标客户是否一眼能理解痛点？ |
| **解释力 Explanatory Power** | 能否自然串起 Fact → Context → Rule → Evidence → Capability？ |
| **差异化 Differentiation** | 能否明显看出“不是普通 RAG / Chatbot”？ |
| **可信度 Proof Strength** | 当前有多强的实际证据？ |
| **迁移性 Transferability** | 用户能否把这个例子类比到自己的业务？ |

当前 P0 阶段，`SCN-BIZ-001 客户重点关注 / 风险判断` 仍是首页主案例首选，因为业务语言最通用，也容易解释“为什么数据不等于业务理解”。后续如出现更高等级且同样易懂的 P2/P3 场景，可以替换。

---

# 7. Proof 升级 Checklist

## P0 → P1

- [ ] 场景实际在产品中可运行；
- [ ] Object / Fact / Context / Rule / Capability 不是 PPT 模拟；
- [ ] 关键输入输出可重复；
- [ ] Evidence / Boundary 至少有基本实现；
- [ ] 有 Demo 记录。

## P1 → P2

- [ ] 使用真实客户数据 / 接口 / 规则；
- [ ] 客户业务负责人确认场景合理；
- [ ] 明确 POC 验收条件；
- [ ] 保存验收证据和结果；
- [ ] 明确哪些结果可对外匿名引用。

## P2 → P3

- [ ] 进入生产业务；
- [ ] 有真实用户和持续运行周期；
- [ ] 有 baseline；
- [ ] 指标持续采集；
- [ ] 能区分系统效果与其他业务因素；
- [ ] 有异常 / 人工接管 / audit 记录。

## P3 → P4

- [ ] 客户确认可以公开；
- [ ] 客户名称、Logo、数据、引用范围明确；
- [ ] 对外文字得到确认；
- [ ] 指标口径可解释；
- [ ] 有可长期引用的公开材料。

---

# 8. 场景资产的组织方式

建议后续目录逐渐演进为：

```text
docs/
  scenarios/
    registry.md
    business/
      SCN-BIZ-001-customer-risk.md
    operations/
      SCN-OPS-001-incident-assessment.md
    investment/
      SCN-INV-001-trend-assessment.md
    education/
      SCN-EDU-001-learning-gap.md
  proofs/
    POC-xxx.md
    PROD-xxx.md
```

当前不急于一次拆完。先用本文件作为总框架，等某个场景进入 P1/P2 时再建立独立场景文件和 Proof Package。

---

# 9. N10 完成标准

N10 的“框架节点”完成，不等于所有场景都有真实客户证据。

完成标准是：

- Scenario 与 Proof 已明确区分；
- P0–P4 分级规则固定；
- Scenario Card 模板固定；
- Claim Boundary 固定；
- Registry 已建立；
- 已有四个概念场景按 P0 登记；
- 后续证据可以独立逐级升级，而不需要重新设计方法论。

从此以后，场景与 Proof 进入**持续运营**，不阻塞 N11 / 首页信息架构推进。
