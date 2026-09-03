# Genesis 场景与成果登记表

> 目的：把“我们做过什么”持续登记成可核验资产。每个场景同时从 **Proof Level、Asset Status、Loop Coverage** 三个维度管理，避免“有代码 = 有客户价值”或“做出判断 = 完整闭环”的误解。

相关框架：

- `docs/n10-scenario-proof-framework.md` — P0–P4 Proof Ladder；
- `docs/closed-loop-scenario-framework.md` — 看见 → 看懂 → 判断 → 行动 → 验证 → 沉淀。

---

# 1. 三个独立维度

## 1.1 Proof Level：证据成熟度

- **P0 Concept Scenario**：概念场景；
- **P1 Working Demo**：可重复演示；
- **P2 Customer POC**：真实客户环境 / 数据验证；
- **P3 Production Outcome**：正式生产使用和持续结果；
- **P4 Reference Proof**：客户允许公开引用。

回答：

> **这件事到底被真实验证到什么程度？**

## 1.2 Asset Status：已有成果资产

- `CONCEPT`：只有场景定义；
- `IMPLEMENTATION`：已有实际代码 / API / Pipeline / UI；
- `RUNNABLE`：已确认可按固定步骤重复运行；
- `DEMO_ARTIFACT`：已有截图、录屏、样例输出、Decision Trace；
- `POC_ARTIFACT`：已有客户 POC 环境、验收记录、反馈；
- `PRODUCTION_ARTIFACT`：已有生产日志、真实用户、持续指标；
- `PUBLIC_REFERENCE`：已有公开授权材料。

回答：

> **我们现在手里到底已经有什么东西？**

## 1.3 Loop Coverage：闭环覆盖

- `S1 Observe` — 看见真实 Facts；
- `S2 Understand` — 看懂业务语义 / Context；
- `S3 Decide` — 按企业规则形成判断；
- `S4 Act` — 采取受控 Action；
- `S5 Verify` — 验证业务状态是否真的改变；
- `S6 Improve` — 把结果 / Trace / 反馈沉淀进下一轮。

回答：

> **这个场景实际覆盖 Genesis 闭环的哪几段？**

核心纪律：

> **Proof 成熟度高，不代表闭环一定完整；闭环设计完整，也不代表每一段都已经真实实现。**

例如：

```text
Proof Level: P2
Asset Status: POC_ARTIFACT
Loop Coverage: S1–S3 verified, S4–S6 not yet verified
```

它是一个真实客户判断 POC，但不能称“端到端闭环”。

只有 S1–S6 都有具体 instance，并在对应 Proof Level 下得到验证，才允许称：

> **端到端闭环场景 / End-to-end Closed-loop Scenario**

---

# 2. 当前场景总表

| ID | 场景 | Domain | Proof | Asset | Loop Design | 当前已核验工程覆盖 | 下一步 |
|---|---|---|---|---|---|---|---|
| `SCN-BIZ-001` | 客户重点关注 / 风险判断与跟进 | 企业经营 | P0 | CONCEPT | **S1–S6** | 无工程 Proof | 做可重复全闭环 Demo：ERP/CRM Facts → 判断 → 跟进/复核 Workflow → 新状态回流 |
| `SCN-OPS-001` | 运维事件判断、处置与恢复 | 智能运维 | P0 | CONCEPT | **S1–S6** | 无工程 Proof | 用 metrics/topology + mock/真实 K8s action 跑 S1–S5，保存 Incident Trace |
| `SCN-INV-001` | 趋势判断、观察动作与持续跟踪 | 投研 | P0 | CONCEPT | **S1–S6** | 无工程 Proof | 对接实际行情；Action 先做观察项/提醒/报告，不默认自动交易 |
| `SCN-EDU-001` | 学习诊断、任务分配与反馈 | 教育 | P0 | CONCEPT | **S1–S6** | 无工程 Proof | 用匿名学习数据 + 学习任务/教师确认 + 下一轮测验验证闭环 |
| `SCN-KNOW-001` | 复杂资料 / 企业知识图检索与分析 | 企业知识 / Research | P0 | **IMPLEMENTATION** | S1–S3 为主 | **S1–S3 有工程实现资产**；无业务 Action / Verify | 固化标准数据与问题，先升级 P1；若要闭环需增加后续业务 Action/结果验证 |
| `SCN-INV-002` | 多 Agent 投研研究与报告生成 | 投研 | P0 | **IMPLEMENTATION** | S1–S4(partial) | **S1–S3 + 工作产物生成**有工程资产；尚未形成外部业务状态闭环 | 固定研究主题升级 P1；再增加观察/审批/跟踪状态与后续验证 |
| `ENG-ACT-001` | DAG 任务编排、执行和状态更新 | 工程能力 | P0 | **IMPLEMENTATION** | S4–S5 pattern | 已存在 Airflow DAG / 任务更新型工程模式，但不是当前企业业务闭环 Proof | 作为 Action Runtime 工程参考，不作为官网客户场景直接宣传 |

> `SCN-KNOW-001` / `SCN-INV-002` 的代码存在本身不等于 P1；`ENG-ACT-001` 证明团队已有执行/状态更新型工程资产，但不能代替经营、运维等业务场景的完整 Action Proof。

---

# 3. 四个核心业务场景的 S1–S6 instance

## 3.1 `SCN-BIZ-001` 客户风险与跟进

| 阶段 | 具体 instance |
|---|---|
| **S1 看见** | ERP 应收逾期 18 天、CRM 战略客户、项目未验收、合同 800 万 |
| **S2 看懂** | 应收属于该合同 / 项目；付款条件与验收相关；历史有延期 |
| **S3 判断** | 进入重点关注，但不能直接认定信用风险 |
| **S4 行动** | 创建 CRM 跟进任务、分配客户经理、请求验收状态、发起风险复核 |
| **S5 验证** | 检查任务/请求是否成功；读取新的验收、责任、回款状态并重新判断 |
| **S6 沉淀** | 保存 Decision Trace、Outcome、人工覆盖；必要时经审批更新风险 Context / Rule |

## 3.2 `SCN-OPS-001` 支付服务故障

| 阶段 | 具体 instance |
|---|---|
| **S1 看见** | CPU 95%、P99 1.8s、Error 3.4%、交易高峰 |
| **S2 看懂** | 核心支付拓扑、最近发布、历史连接池问题 |
| **S3 判断** | 满足 P1，优先扩容并检查连接池 |
| **S4 行动** | 自动扩容、创建 Incident、通知值班、抓取 Evidence；DB 参数需审批 |
| **S5 验证** | 持续观察 P99 / Error / 成功率；未恢复则进入下一诊断步骤 |
| **S6 沉淀** | 保存 Incident Timeline / Root Cause / Effective Action；经审批更新 Runbook |

## 3.3 `SCN-INV-001` 趋势判断

| 阶段 | 具体 instance |
|---|---|
| **S1 看见** | 行情、回撤、成交量、板块强弱 |
| **S2 看懂** | 中线周期、趋势结构、策略 Context |
| **S3 判断** | 当前更接近正常分歧；定义确认 / 失效条件 |
| **S4 行动** | 创建观察项、记录判断、设置条件提醒、更新研究/持仓观察报告 |
| **S5 验证** | 后续条件触发后检查趋势位、量能、结论是否失效 |
| **S6 沉淀** | 保存当时 Context、判断与 Outcome；策略 Rule 正式修改需负责人确认 |

> 该场景默认不把“自动下单”作为必要 Action；交易执行必须是单独授权的高风险 Capability。

## 3.4 `SCN-EDU-001` 学习诊断

| 阶段 | 具体 instance |
|---|---|
| **S1 看见** | 函数题 48%、不等式 55%、错误类型、作业记录 |
| **S2 看懂** | 知识依赖、当前课程进度、错误集中在定义域 / 单调性 |
| **S3 判断** | 主要是前置不等式 + 定义域薄弱，不是“函数整体不会” |
| **S4 行动** | 生成补弱任务、分配练习、教师确认学习路径、暂缓后续知识点 |
| **S5 验证** | 下一轮测验检查正确率、错误类型和是否达到进阶条件 |
| **S6 沉淀** | 更新 Mastery State、保存路径与效果、教师反馈进入能力优化 |

---

# 4. 已有工程资产与闭环的关系

## 4.1 GraphRAG / Vault Query

相关：

- `stevenge-godscode/genesis-fintech-ragquery`
- `stevenge-godscode/genesis-vault-api`

当前主要覆盖：

> **S1 获取 / 检索 → S2 关系 / Context → S3 分析 / 回答的一部分。**

因此它适合作为“认知前半段”的工程 Proof，但不是完整 Genesis 闭环。

## 4.2 多 Agent 投研研究

相关：

- `stevenge-godscode/genesis-fintech-agent-research`

当前主要覆盖：

> **S1–S3 + 生成研究报告这一类 Work Product。**

它有工作交付能力，但还需要“状态跟踪 / 后续验证 / 反馈沉淀”才能成为真正 S1–S6 闭环。

## 4.3 DAG / Task Update 工程模式

相关：

- `stevenge-godscode/genesis-dags`
- `stevenge-godscode/genesis-task`
- task updater / pipeline 相关仓库

这些代码证明已有：

- DAG 编排；
- 外部任务执行；
- 状态更新；
- 任务完成通知等工程模式。

它更接近 **S4 Action + S5 State Update** 的工程参考，但业务领域不同，因此当前只作为内部 Action Runtime 资产，不对外包装成经营 / 运维场景 Proof。

---

# 5. 每个新场景的强制登记字段

以后每个 Scenario 除原有字段外，必须新增：

| 字段 | 说明 |
|---|---|
| `Loop Design` | 设计上覆盖 S1–S6 哪些阶段 |
| `Verified Loop Coverage` | 当前 Proof 实际验证了哪些阶段 |
| `Action Target` | Action 改变哪个 System / Object / Workflow |
| `Action Risk Level` | Recommend / Prepare / Execute / Escalate |
| `Verification Signal` | 什么新 Fact / KPI 证明动作是否有效 |
| `Expected State Change` | 行动前后业务状态差异 |
| `Feedback Asset` | Decision Trace / Outcome / Rule feedback / Capability usage 等 |
| `Human Governance` | 哪些阶段必须人工审批 / 覆盖 |

不能只填“AI 给出建议”。

---

# 6. 首页展示规则

首页的主 instance 必须展示完整逻辑：

> **看见 → 看懂 → 判断 → 行动 → 验证 → 新事实 / 沉淀**

跨场景用紧凑矩阵证明同一闭环可复用：经营、运维、投研、教育每个都至少给出一个具体 S1–S5 instance。

同时视觉上严格区分：

- **Design Coverage** — 场景逻辑已经设计完整；
- **Verified Coverage** — 当前已经有真实工程 / Demo / POC / 生产证据。

尚未实现的 S4–S6 不能用视觉暗示成“已经生产可用”。

---

# 7. 当前 Proof 优先级调整

仅把 GraphRAG / 多 Agent 做成 P1 还不够，它们主要证明认知前半段。

建议 Proof 工作分两条线并行：

### 线 A — 快速把已有认知资产升 P1

1. `SCN-KNOW-001` GraphRAG；
2. `SCN-INV-002` 多 Agent 投研。

### 线 B — 尽快形成至少一个 S1–S6 全闭环 P1

优先候选：

1. **`SCN-OPS-001` 运维闭环**：事实、Action、Verify 天然清晰，容易用测试 / staging 环境证明；
2. **`SCN-BIZ-001` 经营闭环**：可用匿名 / 模拟 ERP、CRM、Workflow 跑客户风险 → 跟进 → 新状态回流；
3. 教育闭环；
4. 投研闭环（Action 默认以观察 / 提醒 / 报告为主）。

目标不是“所有场景一次做完”，而是先证明：

> **Genesis 不只会认知和判断，至少有一个真实可运行场景已经完成从事实到行动再到验证反馈的闭环。**
