# N07：Genesis 可信、可控、安全框架

> 核心问题：AI 即使已经“懂公司”，企业为什么敢让它参与真正的判断、决策辅助甚至执行？

## 最终结论

企业不能把可信建立在“模型永远不会错”上。Genesis 更合理的目标是：

> **让错误更难发生、发生后更容易被发现、影响范围受到限制，并且可以安全停止、交给人和完整复盘。**

因此对外不承诺“绝不幻觉”或“完全正确”，而是建立一套 **Trust by Design** 机制。

---

# 一、先把“可信、可控、安全”拆成两层

## A. Business Trust Plane：Genesis 的核心差异

回答真实业务里的问题：

- 当前依据哪些事实？
- 这些事实来自哪里、是否仍有效、是否冲突？
- 当前用户应该看到什么？
- 哪些规则必须遵守？
- 哪些部分允许模型推理？
- 证据不够时怎么办？
- AI 可以建议什么、执行什么？
- 哪些动作必须人工确认？
- 最后能否完整回看判断和执行过程？

这是 Genesis 业务理解层必须承担的治理职责。

## B. Platform Security Baseline：企业级基础安全

包括但不限于：

- IAM / SSO / RBAC / ABAC；
- Tenant / Project Isolation；
- Encryption in transit / at rest；
- Secrets Management；
- Network / Deployment Isolation；
- Model Routing / Data Residency；
- Prompt Injection / Tool Security；
- Runtime Sandbox；
- Security Logging / SIEM Integration。

这些很重要，但不应包装成 Genesis 独有的产品差异。它们与 Genesis Business Governance 共同构成企业级 AI 控制体系。

```text
Platform Security Baseline
          +
 Genesis Business Trust Plane
          ↓
 Enterprise-grade AI Control
```

---

# 二、Business Trust Plane 的最终 Trust Chain

不再使用容易过度承诺的 `Trusted Source → Verifiable Fact`，而改为：

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

中文：

> **受治理来源 → 可追溯事实 → 授权上下文 → 受控判断 → 有边界行动 → 可审计结果**

“来源可追溯”不代表来源一定正确；系统还需要处理权威级别、时效、版本和冲突。

---

# 三、六个控制面

## 1. Source & Fact Governance：来源与事实治理

Fact 不只是一个值，还应尽可能携带：

- Source / Provenance；
- Source Authority / Priority；
- Event Time / Valid Time；
- Version；
- Verification State；
- Conflict State；
- Freshness Requirement。

关键原则：

> **有来源不等于一定正确，但没有来源的数据不能无条件升级为关键企业事实。**

多来源冲突时：

1. 按企业 Source Authority / Reconciliation Rule 处理；
2. 无法消解时，不默默选一个答案；
3. 将“存在冲突”本身进入当前 Context；
4. 必要时停止判断或请求人工确认。

---

## 2. Context Governance：授权上下文

Task Context 在组装时就必须考虑：

- 当前 User / Service Identity；
- 当前 Purpose / Task；
- Business Object Scope；
- Tenant / Department / Project Boundary；
- Data / Object Permission；
- Capability Allowed Scope。

关键原则：

> **AI 不能因为技术上检索得到，就看到业务上没有权限看到的信息。**

Permission 不是 Action 前最后一道检查，而是从 Context 形成时就开始生效。

---

## 3. Judgment Governance：受控判断

必须区分两类逻辑。

### Hard Rule / Deterministic Policy

例如：

- 金额超过 100 万必须人工审批；
- 未完成验收不得自动认定信用违约；
- P1 事件禁止自动全量重启。

这些不能交给 LLM 自由判断。

### Model Judgment

例如：

- 多个信号综合后更接近哪类风险；
- 对原因进行排序；
- 对非结构化 Evidence 做归纳；
- 在规则允许范围内给出建议。

原则：

> **规则确定边界，模型在边界内完成需要理解和推理的部分。**

---

## 4. Evidence & Uncertainty：证据与不确定性

关键判断应该尽可能回答：

- 使用了哪些 Facts；
- Facts 来自哪里；
- 使用了哪些 Rules / Methods；
- 哪些是事实，哪些是模型推断；
- 缺少什么信息；
- 是否存在冲突；
- 哪些条件变化会让判断失效。

不要把一个 `Confidence = 0.91` 当成可信性的核心证明。

更重要的是 **Evidence Sufficiency**：

```text
Evidence sufficient
      ↓
形成判断

Evidence missing / stale / conflicted
      ↓
显式表达不确定性
      ↓
补充信息 / 人工确认 / 停止判断
```

核心原则：

> **有依据才判断；依据不足，就明确说不知道。**

---

## 5. Action Governance：动作治理

必须明确：

> **AI 可以判断 ≠ AI 可以直接执行。**

建议 Capability 把 Action 至少划分为：

### L0 — Read / Analyze

查询、分析、摘要。

### L1 — Recommend / Draft

形成建议、草稿、待办。

### L2 — Reversible Low-risk Action

创建任务、写入待处理队列、自动扩容、更新非关键状态；要求审计且通常可回滚。

### L3 — High-impact / Irreversible Action

付款、删除关键数据、生产核心配置变更、正式信用等级调整、法律效力通知等；必须配置审批 / 双人复核 / 人工确认。

Capability 因此必须描述：

- can_read；
- can_decide；
- can_recommend；
- can_execute；
- needs_approval；
- prohibited。

---

## 6. Audit, Recovery & Human Override：审计、恢复与人工覆盖

重要业务执行应形成 **Business Decision Trace**，而不只是 Prompt / Response 日志。

至少关联：

- 发起人 / Service Identity；
- Capability / Domain Pack 版本；
- 当时 Facts / Evidence；
- Rules / Methods 版本；
- Model / Runtime；
- 判断结果；
- 审批 / Human Override；
- Action；
- 最终业务结果；
- 回滚 / 恢复情况。

这样才能真正支持复盘、问责、优化和业务规则迭代。

---

# 四、Safe Failure / Abstention 是正常能力，不是异常兜底

企业级 AI 必须知道什么时候不继续。

典型停止 / 升级条件：

- 必要 Fact 缺失；
- 多来源冲突无法消解；
- 数据过期；
- 用户无权限；
- 任务超出 Capability 边界；
- Action 风险超过自动执行阈值；
- Rule 明确要求人工确认；
- Model 输出与 Hard Rule 冲突。

标准处理：

```text
STOP / ESCALATE
       ↓
说明为什么不能继续
       ↓
指出缺什么 / 冲突在哪里
       ↓
请求补充信息 / 人工确认 / 升级处理
```

原则：

> **知道什么时候不做，是企业 AI 的能力，而不是失败。**

---

# 五、实例：客户风险判断

用户问：

> 南桥集团有没有信用风险？

当前相关信息：

- ERP：应收逾期 18 天；
- CRM：战略客户；
- 项目系统：尚未验收；
- 合同：付款条件与验收相关；
- Rule：战略客户逾期 15 天进入重点关注，但未完成验收时不得直接认定信用风险。

Trust Chain：

1. **Source / Fact**：确认数据来源、更新时间和版本；
2. **Context**：当前用户有权查看该客户合同、项目和应收信息；
3. **Judgment**：Hard Rule 先限定“不能直接认定信用风险”；
4. **Evidence**：支持“重点关注”，但不足以支持“信用风险成立”；
5. **Action**：允许创建关注任务，不允许自动修改正式信用等级；
6. **Audit**：保留 Facts、Rule 版本、判断、审批和后续动作。

最终结果应类似：

> 当前建议列入重点关注，但证据不足以认定为信用风险。应收已逾期 18 天，但项目尚未验收，且付款条件与验收相关。建议先确认交付与验收责任；未经人工确认，不调整正式信用等级。

可信来自完整业务治理链，而不是模型“说得更谨慎”。

---

# 六、跨场景验证

## 运维

- Metrics / Trace 有来源和时效；
- P1 判定由 Hard Rule 约束；
- 自动扩容可执行；
- DB 参数修改需人工确认；
- 拓扑缺失时禁止自动生产变更。

## 投研

- 判断绑定具体行情窗口和策略版本；
- Evidence 与模型推断分离；
- 投研判断默认不等于交易指令；
- 若要自动交易，必须单独定义交易 Capability、权限和风险边界。

## 教育

- 学生数据按角色授权；
- AI 可以生成学习建议；
- 正式教学计划由教师确认；
- 保留建议依据与教师调整记录。

因此 Trust Plane 是所有 Domain Pack / Capability 的横向治理框架。

---

# 七、官网表达

首页不要展示六个技术控制面，只讲四件事：

> **有依据** — 关键判断回到真实业务事实和来源。

> **有边界** — 谁能看什么、AI 能判断什么、能做什么，都有明确限制。

> **知道什么时候不知道** — 信息不足、冲突或越界时，不硬给答案。

> **可追溯** — 重要判断和动作可以回看依据、规则和过程。

两句核心传播语：

> **有依据才判断；没有依据，就明确说不知道。**

> **该自动的自动，该确认的确认，该停止的停止。**

---

# 八、N07 验收结论

N07 可以定稿，原因：

- 不承诺 AI 永不出错；
- 明确 Source Traceability 不等于 Source Truth；
- Fact / Context / Judgment / Action 全链路治理；
- Hard Rule 与 Model Judgment 分离；
- Permission 从 Context 阶段生效；
- 判断与执行分权；
- Safe Failure 被定义为正常能力；
- Business Trust 与 Platform Security 分层；
- 可用经营、运维、投研、教育场景统一解释；
- 首页可压缩为“有依据 / 有边界 / 知道不知道 / 可追溯”。
