# Genesis 场景与成果登记表

> 目的：把“我们做过什么”持续登记成可核验资产，并与 `docs/n10-scenario-proof-framework.md` 的 P0–P4 Proof Ladder 对齐。这个文件是长期运营的 living registry，不要求一次填满。

## 1. 两个维度必须分开

### Proof Level：对外证据成熟度

- **P0 Concept Scenario**：概念场景；
- **P1 Working Demo**：可重复演示；
- **P2 Customer POC**：真实客户环境 / 数据验证；
- **P3 Production Outcome**：正式生产使用和持续结果；
- **P4 Reference Proof**：客户允许公开引用。

### Asset Status：当前已经存在什么成果资产

Proof Level 不足以表达“已经做到了哪一步”，因此另设 Asset Status：

- `CONCEPT`：只有场景定义；
- `IMPLEMENTATION`：已有实际代码 / API / Pipeline / UI 等工程实现；
- `RUNNABLE`：已确认可以按固定步骤重复运行；
- `DEMO_ARTIFACT`：已有截图、录屏、样例输出、Decision Trace 等可展示物；
- `POC_ARTIFACT`：已有客户 POC 环境、验收记录、客户反馈等；
- `PRODUCTION_ARTIFACT`：已有生产日志、真实用户、持续指标；
- `PUBLIC_REFERENCE`：已有客户公开授权材料。

核心规则：

> **可以展示“已经实现了什么”，但不能因为有代码就自动声称已经产生客户业务价值。**

例如一个场景可能是：

```text
Proof Level: P0
Asset Status: IMPLEMENTATION
```

含义是：已经有实际工程实现，但还没有登记足够的可重复 Demo 证据，因此尚未升级为 P1。

---

# 2. 当前场景登记

| ID | 场景 | Domain | Proof | Asset Status | 当前能展示的成果 | 下一步升级 |
|---|---|---|---|---|---|---|
| `SCN-BIZ-001` | 客户重点关注 / 风险判断 | 企业经营 | P0 | CONCEPT | 完整 instance：客户、合同、项目、应收、规则、Evidence、Capability | 找一个真实经营数据集做可重复 Demo |
| `SCN-OPS-001` | 运维事件判断与处置 | 智能运维 | P0 | CONCEPT | 完整 instance：服务拓扑、指标、P1 规则、动作边界 | 用实际 metrics / topology 跑通 Demo |
| `SCN-INV-001` | 趋势状态判断 | 投研 | P0 | CONCEPT | 完整策略 instance：Facts、周期、规则、确认 / 失效条件 | 对接实际行情和策略规则形成 Decision Trace |
| `SCN-EDU-001` | 学习薄弱点与下一步路径 | 教育 | P0 | CONCEPT | 完整 instance：学生、知识点依赖、测验 Facts、教学规则 | 用匿名学习数据做 Demo |
| `SCN-KNOW-001` | 复杂资料 / 企业知识的图检索与分析 | 企业知识 / Research | P0 | **IMPLEMENTATION** | 已存在 GraphRAG 查询实现资产：Basic / DRIFT / Local / Global 检索；存在 Python Package / CLI 与 API 实现 | 固化测试数据，跑一组标准问题，保存输出 / 截图 / 录屏后升级 P1 |
| `SCN-INV-002` | 多 Agent 投研研究与报告生成 | 投研 | P0 | **IMPLEMENTATION** | 已存在多 Agent 研究与结构化报告生成实现资产；包括 Research Director、技术/市场专家、报告与编辑角色，以及 GraphRAG 检索能力 | 固化一个研究主题，完成可重复运行、样例报告和运行证据后升级 P1 |

> `SCN-KNOW-001` 和 `SCN-INV-002` 已有工程实现资产，但当前登记仍保持 P0，直到完成可重复 Demo 验证。这里不把 README 或代码存在本身等同于 P1。

---

# 3. 当前可立即整理成“早期成果”的两类资产

## 3.1 复杂资料 / 企业知识图检索与分析

### 已经存在的工程资产

相关实现仓库包括：

- `stevenge-godscode/genesis-fintech-ragquery`
- `stevenge-godscode/genesis-vault-api`

当前代码资产已经覆盖：

- Basic Search；
- DRIFT Search；
- Local Search；
- Global Search；
- CLI / Python Package 调用；
- FastAPI 风格查询服务；
- GraphRAG entity / relationship / community / text-unit 等查询基础；
- 流式输出 / 报告输出等工程入口。

### 当前对外最多可以怎么说

在完成 P1 证据包前：

> **已完成 GraphRAG 图检索与复杂资料分析的工程实现，可进一步整理为标准 Demo。**

暂时不说：

> “已帮助企业把知识检索效率提升 X%”；

因为目前没有登记对应的客户 / 生产指标。

### P1 最小证据包

只需要补齐：

1. 固定一份可公开 / 匿名数据集；
2. 固定 5–10 个代表问题；
3. 一键运行或固定 Demo 步骤；
4. 保存 query → context → answer 的样例；
5. 截图或 1–3 分钟录屏；
6. 记录哪些回答有 Evidence、哪些应拒答。

完成后即可升级为 P1，并直接成为官网“已经开始做到的事情”。

---

## 3.2 多 Agent 投研研究与报告生成

### 已经存在的工程资产

相关实现仓库：

- `stevenge-godscode/genesis-fintech-agent-research`

当前工程资产包含：

- Research Director Agent；
- Technical Expert / Market Expert 等专业角色；
- Report Writer / Editor / Visualization 等报告角色；
- 多 Agent 分工与汇总；
- 结构化研究报告生成；
- GraphRAG Basic / DRIFT / Local / Global 查询能力；
- 测试入口与基本运行说明。

### 当前对外最多可以怎么说

在完成 P1 证据包前：

> **已经形成多 Agent 协同的投研研究与报告生成实现，可进一步固化为标准演示场景。**

不要直接说：

> “已经显著提升投研效率 / 研究质量”；

除非后续有真实对照指标。

### P1 最小证据包

建议固定一个容易理解的主题，例如某行业 / 某公司研究，保存：

```text
研究问题
  ↓
检索 / 数据来源
  ↓
各专业 Agent 中间产物
  ↓
整合后的判断
  ↓
结构化最终报告
  ↓
引用 / Evidence
```

重点不是报告写得多漂亮，而是让客户看到：

> **一个复杂专业任务如何被拆解、理解、检索、判断并交付。**

---

# 4. 真实客户 POC / 已做项目如何补进来

已有客户项目不要另建一套逻辑，直接登记到本表。

最小登记字段：

| 字段 | 说明 |
|---|---|
| Scenario ID | 唯一编号 |
| 客户 / 行业 | 默认匿名，只有明确授权才公开 |
| 业务问题 | 客户真正想解决的问题 |
| 已做范围 | 已接哪些数据 / 系统 / 规则 / Agent |
| 当前结果 | 实际跑通了什么 |
| 当前限制 | 性能、数据质量、流程、模型等已知限制 |
| Proof Level | P0–P4 |
| Asset Status | 当前有什么可核验材料 |
| Proof Artifact | 截图、录屏、测试、POC 文档、验收、日志等 |
| Claim Boundary | 能对外说什么 / 不能说什么 |
| Next Upgrade | 升级到下一 Proof Level 缺什么 |

只要把已有 POC 的截图、结果、验收或运行记录逐步登记进来，就能从“我们做过一些项目”转成真正的 Genesis Proof Library。

---

# 5. 首页如何使用这些成果

首页不需要等到 P3/P4 才能展示成果，但展示方式必须与成熟度一致。

## P0 + IMPLEMENTATION

标签可以是：

> **已实现原型 / Engineering Prototype**

展示：

- 问题；
- 已经实现的链路；
- 一个真实输出 / 截图；
- 下一步正在验证什么。

## P1

标签：

> **可演示 / Working Demo**

可以展示真实运行过程和输出。

## P2

标签：

> **真实企业环境验证 / Customer POC**

未授权时匿名行业和场景。

## P3 / P4

才把重点转向：

- 生产规模；
- 真实业务结果；
- ROI；
- 客户评价；
- 公开 Logo / Case Study。

---

# 6. 首页“场景先行”推荐卡片结构

每张成果卡只回答四件事：

### 业务问题

> **客户 / 用户真正想解决什么？**

### Genesis 已经做到哪一步

例如：

> 已完成多 Agent 研究、图检索和结构化报告生成链路。

### 看得见的成果

- 一个判断结果；
- 一张 Evidence / Context 截图；
- 一个报告片段；
- 一个 Action / Decision Trace。

### 当前成熟度

> 已实现原型 / Working Demo / Customer POC / Production

不要在卡片里放底层技术模块清单。

---

# 7. 当前建议的优先顺序

第一批优先把已有工程资产整理成两个 P1：

1. `SCN-KNOW-001`：GraphRAG 复杂资料 / 企业知识分析；
2. `SCN-INV-002`：多 Agent 投研研究与报告生成。

原因不是它们一定是 Genesis 最终最重要的两个商业场景，而是：**它们已经有实际工程资产，补齐 Proof Package 的成本最低，最快可以让官网从“概念说明”变成“有东西可看”。**

经营、运维、教育等场景继续按业务价值准备；一旦有真实 Demo / POC 资产，就直接进入相同的升级体系。
