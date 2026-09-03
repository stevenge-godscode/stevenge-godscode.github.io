# N07：Genesis 可信、可控、安全框架

> 核心问题：AI 即使已经“懂公司”，企业为什么敢让它参与真正的判断、决策辅助甚至执行？

## 1. 核心判断：企业需要的不是“AI 永远不会错”，而是错误可被限制、发现、解释和接管

企业生产环境中，无法把可信建立在“模型绝不出错”上。更合理的目标是：

- 关键事实有来源；
- 当前上下文有权限边界；
- 判断有规则和依据；
- 证据不足时允许拒答 / 暂停判断；
- 高风险动作有审批和执行边界；
- 整个过程可追溯、可审计、可复盘。

因此 Genesis 的 Trust 目标不是保证 AI 永远正确，而是：

> **让 AI 的错误更难发生、发生后更容易被发现、影响范围受到限制，并且可以安全退出或交给人。**

对外不使用“绝不幻觉”“完全可信”等绝对承诺。

---

## 2. Trust 不是输出之后再做一个过滤器，而是贯穿完整业务链

建议统一为一条 Trust Chain：

```text
Trusted Source
     ↓
Verifiable Fact
     ↓
Authorized Task Context
     ↓
Governed Judgment
     ↓
Controlled Action
     ↓
Auditable Result
```

中文表达：

> **可信来源 → 可验证事实 → 授权上下文 → 受控判断 → 有边界行动 → 可审计结果**

这比单独强调“模型安全”更符合 Genesis 的产品位置。

---

# 3. 六个核心控制面

## 3.1 Fact Integrity：事实可信

回答：

> **AI 正在依据什么事实工作？这些事实是真的吗？是否仍然有效？**

Fact 不只是一个值，还应该携带必要的治理信息，例如：

- Source / Provenance：来自哪个系统、文档、事件或人工输入；
- Timestamp / Valid Time：什么时候发生、当前是否仍有效；
- Version：规则、文档、记录属于哪个版本；
- Confidence / Verification State：是否经过确认；
- Conflict State：是否存在多个互相冲突的来源；
- Freshness：当前任务对数据新鲜度有什么要求。

关键原则：

> **没有来源的数据，不自动升级为企业事实。**

当两个来源冲突时，系统不能默默挑一个最“像真的”交给模型，而应按企业定义的 Source Priority / Reconciliation Rule 处理；仍不能消解时，应把冲突本身作为 Context 告诉 AI。

---

## 3.2 Context Governance：上下文正确且授权

回答：

> **这一次任务，AI 应该看到什么；不应该看到什么？**

Task Context 的动态组装必须同时考虑：

- 当前用户 / Service Identity；
- 当前任务与业务对象；
- Data / Object Permission；
- Tenant / Department / Project Boundary；
- Purpose / Use Policy；
- 当前 Capability 所允许访问的数据范围。

因此 Permission 不是最后执行动作时才检查，而是在 **Context 构建阶段就必须生效**。

关键原则：

> **AI 不能因为“技术上能检索到”就看到不该看到的数据。**

---

## 3.3 Governed Judgment：判断受到企业规则约束

回答：

> **哪些事情由企业规则决定，哪些事情允许模型推理？**

需要明确区分：

### Hard Constraints / Deterministic Rules

例如：

- 金额超过 100 万必须人工审批；
- 未完成验收时不得自动认定信用违约；
- P1 事件禁止自动全量重启；
- 未成年人数据不得跨指定权限域使用。

这些不应该由 LLM 自由发挥。

### Model Judgment

例如：

- 多个信号综合后更像哪一种风险类型；
- 对事件原因进行排序；
- 在已有规则范围内生成处置建议；
- 对自然语言证据做归纳。

因此更准确的原则是：

> **规则确定边界，模型在边界内完成需要认知和推理的部分。**

---

## 3.4 Evidence & Uncertainty：有依据，也允许说“不知道”

回答：

> **为什么这么判断？证据够不够？**

一个企业级判断至少应该能够回答：

- 引用了哪些 Facts；
- Facts 来自哪里；
- 使用了哪些 Rule / Method；
- 哪些是确定事实，哪些是模型推断；
- 哪些信息仍然缺失；
- 哪些证据存在冲突；
- 哪些条件变化会让当前判断失效。

这里不建议把“Confidence Score”作为唯一可信机制，因为一个 0.91 的数字本身并不能证明结论可靠。

更重要的是 Evidence Sufficiency：

```text
Evidence sufficient
      ↓
允许形成判断

Evidence insufficient / conflicted / stale
      ↓
明确不确定性
      ↓
补充信息 / 请求人工确认 / 暂停
```

首页可使用的原则：

> **有依据才判断；依据不足，就明确说不知道。**

更严谨的技术表达：

> **不是要求模型“永不出错”，而是要求重要判断知道自己依据什么、缺什么，以及什么时候应该停止。**

---

## 3.5 Controlled Action：动作分级、权限校验与人工接管

回答：

> **AI 判断以后，到底允许它做什么？**

建议 Capability 将 Action 按风险至少分为三类：

### Read / Recommend

- 查询；
- 分析；
- 生成建议；
- 创建草稿。

通常可自动完成。

### Reversible / Low-risk Action

- 创建任务；
- 写入待处理队列；
- 自动扩容；
- 更新非关键标签。

可以在规则和权限满足时自动执行，同时保留回滚和审计能力。

### High-impact / Irreversible Action

- 付款；
- 删除数据；
- 修改关键生产配置；
- 调整客户信用等级；
- 发送具有法律效力的正式通知。

必须明确审批、双人复核或人工确认策略。

关键原则：

> **“AI 可以判断”不等于“AI 可以直接执行”。**

Genesis 的 Capability 应同时定义：

- What can be decided；
- What can be recommended；
- What can be executed；
- What needs approval；
- What is prohibited。

---

## 3.6 Audit & Recovery：可追溯、可复盘、可恢复

回答：

> **出了问题以后，能不能知道当时发生了什么？**

关键业务执行建议记录：

- 谁发起；
- 使用了哪个 Capability / Domain Pack 版本；
- 当时有哪些 Facts / Evidence；
- 使用哪些 Rules / Methods；
- 使用了哪个模型 / Runtime；
- 形成了什么判断；
- 用户 / 人工是否确认；
- 调用了什么 Action；
- 最终业务结果；
- 是否发生人工覆盖 / 回滚。

因此 Audit 不是只记录一条 Prompt 和 Response，而是记录完整的 **Business Decision Trace**。

---

# 4. 最重要的安全机制：Safe Failure / Abstention

传统 AI 很容易被训练成“无论如何都给一个答案”。企业 AI 更需要一种相反的能力：

> **知道什么时候不应该继续。**

典型停止条件：

- 必要 Fact 缺失；
- Evidence 冲突无法消解；
- 数据过期；
- 当前用户无权限；
- 当前任务超出 Capability 边界；
- 当前动作超过自动执行风险阈值；
- 规则明确要求人工审批；
- 模型输出违反确定性 Rule。

处理方式可以是：

```text
STOP
  ↓
说明为什么不能继续
  ↓
指出缺什么 / 冲突在哪里
  ↓
请求补充信息 / 人工确认 / 升级处理
```

这不是系统失败，而是企业级 AI 正常工作机制的一部分。

---

# 5. 场景化实例：客户风险判断

用户问：

> 南桥集团有没有信用风险？

当前数据：

- ERP：应收逾期 18 天；
- CRM：战略客户；
- 项目系统：项目尚未验收；
- 合同：付款条件与验收相关；
- 企业规则：战略客户逾期 15 天进入重点关注，但未完成验收时不得直接认定信用风险。

Genesis 的 Trust Chain：

### 1. Fact Integrity

确认 18 天逾期来自当前 ERP，应收记录更新时间为今天；项目状态来自项目系统；客户等级来自 CRM。

### 2. Context Governance

当前用户为该客户所属经营团队负责人，有权查看合同、项目和应收信息；其他客户数据不进入当前 Context。

### 3. Governed Judgment

硬规则首先限制：未验收不得直接认定信用风险。

### 4. Evidence & Uncertainty

Evidence 支持“需要重点关注”，但不足以支持“信用风险已经成立”。

### 5. Controlled Action

允许自动：

- 创建重点关注任务；
- 请求项目负责人补充验收状态。

不允许自动：

- 修改正式信用等级；
- 发出违约通知。

### 6. Auditable Result

记录所用 Facts、规则版本、结论、任务创建和后续人工确认。

最终 AI 输出应该类似：

> 当前建议列入重点关注，但证据不足以认定为信用风险。应收已逾期 18 天，但项目尚未验收，且合同付款条件与验收相关。建议先确认交付与验收责任；未经人工确认，不调整正式信用等级。

这里的“可信”不是因为模型说话更谨慎，而是因为整个判断链受到业务事实、规则、证据、权限和动作边界共同约束。

---

# 6. 跨场景验证

## 智能运维

- Fact：P99 1.8s、Error Rate 3.4%；
- Rule：核心支付服务满足 P1 条件；
- Boundary：允许自动扩容，不允许自动修改 DB 参数；
- Safe Failure：拓扑或指标数据缺失时，不执行生产变更；
- Audit：记录指标、规则、变更和审批。

## 投研

- Fact：行情、成交量、板块状态；
- Method：企业自己的中线策略；
- Evidence：对应时间窗口和市场数据；
- Boundary：可以形成策略判断，不直接变成交易指令，除非另外配置交易 Capability 和授权；
- Uncertainty：关键数据冲突 / 缺失时明确判断失效。

## 教育

- Fact：测验和作业记录；
- Rule：教学路径规则；
- Permission：学生数据仅授权教师 / 指定角色；
- Boundary：AI 可提出学习建议，正式教学计划由教师确认；
- Audit：保留建议依据和教师调整记录。

这说明 Trust Framework 与行业无关，可以成为 Genesis 所有 Domain Pack 和 Capability 的横向治理框架。

---

# 7. 对外表达分层

## 首页：只讲四件事

> **有依据** — 关键判断回到真实事实和来源。

> **有边界** — 数据权限、判断范围和可执行动作受到控制。

> **知道什么时候不知道** — 信息不足、冲突或越界时停止判断并交给人。

> **可追溯** — 重要判断和动作都可以回看依据与过程。

核心传播句：

> **有依据才判断；没有依据，就明确说不知道。**

可补一句：

> **该自动的自动，该确认的确认，该停止的停止。**

## 产品 / 技术页面

再展开：

- Fact Provenance；
- Evidence Sufficiency；
- Rule / Policy Enforcement；
- Context-level Permission；
- Action Risk Tier；
- Human-in-the-loop；
- Decision Trace；
- Version / Audit / Recovery。

---

# 8. 与普通“安全护栏”的区别

Genesis Trust 不应只理解为 LLM Guardrail：过滤敏感词、检测有害输出、Prompt Injection 防护等仍然重要，但属于模型 / Runtime Security 的一部分。

Genesis 更核心的是 **Business Governance**：

> **在真实企业业务里，什么事实可用、谁能看到什么、应该按什么规则判断、哪些动作允许自动做、什么情况下必须交给人。**

因此可以区分：

```text
Model / Runtime Safety
        +
Genesis Business Governance
        ↓
Enterprise-grade AI Control
```

两者互补，不互相替代。

---

# 9. N07 验收标准

- 不承诺 AI 永不出错，而是建立“可限制、可发现、可退出、可审计”的可信机制；
- Evidence 不等于简单引用来源，而是与 Fact provenance、冲突、时效和规则共同构成判断依据；
- Permission 在 Context 构建阶段就生效，而不只在 Action 阶段检查；
- 明确 Hard Rule 与 Model Judgment 的边界；
- 明确“判断”和“执行”不是同一权限；
- Safe Failure / Abstention 被定义为正常能力；
- Trust Framework 能跨经营、运维、投研、教育等 Domain Pack 复用；
- 首页最终可以压缩为：**有依据 / 有边界 / 知道不知道 / 可追溯**。
