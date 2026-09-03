# N12：Genesis 首页信息架构

> 目标：让业务用户在一个首页里理解：为什么通用 AI 在企业里不好用；Genesis 补的是什么；AI 如何从“看懂”走到“行动改变业务状态”；同一闭环如何进入不同真实场景；当前哪些部分已经有工程 / Demo / POC 证据。

---

# 1. 首页主线：不是“理解 + Action 两段”，而是一条完整业务闭环

首页统一使用：

> **看见 → 看懂 → 判断 → 行动 → 验证 → 沉淀**

对应：

```text
Observe
  ↓
Understand
  ↓
Decide
  ↓
Act
  ↓
Verify
  ↓
Improve
  ↺ New Facts
```

核心：

> **理解和判断改变认知；Action 改变业务状态；Verify 判断改变是否真的有效；Improve 把结果和经验沉淀为下一次可复用能力。**

Trust / Permission / Evidence / Human Approval 是横向治理，不作为第七个顺序阶段。

详细闭环定义：`docs/closed-loop-scenario-framework.md`

---

# 2. 首页建议保留 7 个主体区块

## Section 1 — Hero：为什么 Genesis 存在

主标题：

> **让 AI 真正为你的公司工作**

副标题：

> **通用 AI 已经足够聪明。Genesis 让它理解企业事实、业务语义和工作方式，在企业规则与边界内做出判断、采取行动，并根据真实结果持续工作。**

Hero 主图不展开完整技术架构，只表达：

```text
通用 AI
   ↓
缺企业业务理解
   ↓
Genesis
   ↓
理解 · 判断 · 行动
   ↺
真实业务状态
```

模型 Logo 只作为“继续使用现有通用模型”的辅助信息。

---

## Section 2 — Gap：AI 和 Data 之间缺什么

标题：

> **你已经有 AI，也有数据。中间还缺业务理解。**

只回答三个前置问题：

1. **发生了什么？** — 企业事实；
2. **这意味着什么？** — 业务语义与上下文；
3. **应该怎么办？** — 企业规则、方法、边界。

稳定表达：

> **数据平台让数据可用；Genesis 让 AI 理解数据背后的业务世界。**

这一屏只解释为什么“把数据交给 AI”仍然不够，不提前展开 Agent / RAG 对比。

---

## Section 3 — 主场景：一个真实 instance 串完 S1–S6

标题建议：

> **从看懂，到真正把事情往前推进。**

主问题：

> **“这个客户现在有风险吗？需要做什么？”**

### S1 看见

> ERP：应收逾期 18 天；CRM：战略客户；项目：尚未验收；合同：800 万。

### S2 看懂

> 应收对应当前合同 / 项目；付款条件与验收相关；历史上发生过延期。

### S3 判断

> 按公司规则：进入重点关注，但当前 Evidence 不足以认定信用风险。

### S4 行动

> 创建 CRM 跟进任务；分配客户经理；请求项目负责人补充验收状态；发起风险复核。

不允许自动：

> 修改正式信用等级 / 发违约通知。

### S5 验证

> 重新读取任务状态、验收状态、回款状态和新 Evidence；如果行动没有解决问题或出现新事实，重新判断。

### S6 沉淀

> 保存 Decision Trace、Action、Outcome、人工覆盖；重复出现的模式由业务负责人评审是否进入 Rule / Context / Capability 新版本。

主图需要表现：

```text
Facts → Meaning → Judgment → Action → State Change → New Facts ↺
```

而不是只停在 Judgment。

Domain Pack 只在这里自然带出一句：

> **专业是共性的，工作方式是你的。**

---

## Section 4 — 多场景闭环：证明这不是一个经营案例

标题建议：

> **同一套闭环，进入不同业务世界。**

使用紧凑矩阵，不展开四张大卡：

| 场景 | 看见 | 看懂 | 判断 | 行动 | 验证 / 沉淀 |
|---|---|---|---|---|---|
| **企业经营** | 应收 / 项目 / 合同 | 客户关系 / 付款条件 | 风险等级 | 跟进 / 复核 Workflow | 回款 / 验收新状态、Decision Trace |
| **智能运维** | Metrics / Trace | 服务拓扑 / 变更 | P1 / 根因 | 扩容 / Incident / 审批 | 指标是否恢复、Incident / Runbook |
| **投研** | 行情 / 成交量 | 趋势 / 策略 Context | 分歧 / 破坏 | 观察 / 提醒 / 报告 | 失效条件是否触发、策略 Outcome |
| **教育** | 测验 / 作业 | 知识依赖 | 薄弱点 | 学习任务 / 教师确认 | 下一轮掌握度、Mastery State |

目的不是宣称四个场景都已生产验证，而是让用户看到：

> **Genesis 的六阶段结构可以落到不同真实业务 instance。**

每个场景旁必须显示当前 Proof / Loop Coverage，避免概念覆盖与已验证覆盖混淆。

---

## Section 5 — Early Results / Proof：哪些已经实际做出来

标题：

> **哪些已经做出来，哪些正在补闭环。**

这里严格引用 `docs/scenario-proof-registry.md`。

当前可以展示：

### GraphRAG / Vault Query

- GraphRAG Basic / DRIFT / Local / Global；
- CLI / Python / API；
- 当前主要工程覆盖 S1–S3；
- 标签：**P0 + IMPLEMENTATION**，待固化 Demo 升 P1。

### 多 Agent 投研研究

- Research Director / 专业 Agent / Report Writer 等；
- 当前主要覆盖 S1–S3 + 工作产物生成；
- 尚未形成 S1–S6 外部业务状态闭环；
- 标签：**P0 + IMPLEMENTATION**。

同时可以很克制地说明：已有 DAG / Task Update 类工程资产证明团队具备 S4/S5 编排 / 状态更新模式，但不能用它替代业务场景 Proof。

首页以后优先替换成：

> **至少一个 S1–S6 的 P1/P2 完整闭环场景。**

建议优先做运维闭环或经营闭环。

---

## Section 6 — Enterprise-ready：为什么敢行动，为什么接得进

左右双栏。

### 左：Trust & Governance

只保留：

- **有依据**；
- **有边界**；
- **知道什么时候不知道**；
- **可追溯**。

Action 增加一句：

> **该自动的自动，该确认的确认，该禁止的禁止。**

### 右：Reuse, don't replace

表达：

```text
ERP · CRM · DB · Data Platform · KG
                    ↕
                 Genesis
       Context · Capability · Governance
                    ↕
        LLM · Agent · Workflow · App
```

强调：

> **Action 可以通过现有 Agent、Workflow、API 和业务系统执行；Genesis 负责业务判断、Capability 契约和行动边界。**

不要把 Genesis 画成所有流量必须经过的 chokepoint。

---

## Section 7 — Value + Start

主标题：

> **不是让 AI 回答更多，而是让更多工作真正可以交给 AI。**

价值从三项调整为闭环后的三项：

1. **判断更可靠** — 当前 Facts + 企业 Rules + Evidence；
2. **行动真正落地** — 受控改变业务状态，并验证结果；
3. **能力持续复用** — Context / Capability / Outcome 沉淀给更多场景。

落地路径：

```text
选一个真实工作
      ↓
跑通一个 S1–S6 可验证闭环
      ↓
沉淀并复用到相邻场景
```

主 CTA：

> **拿一个真实业务问题来验证 ›**

---

# 3. 首页视觉原则新增要求

## 主场景必须有“状态变化”

不能只展示：

> Input → AI → Answer

必须展示：

```text
Before State
    ↓
Judgment
    ↓
Governed Action
    ↓
After State
    ↓
Verification / Feedback
```

## 多场景必须展示真实 instance

不能只写：

> 经营 / 运维 / 投研 / 教育

必须出现具体东西：

> 应收 18 天 / P99 1.8s / 趋势位 / 函数正确率 48% 等。

## Proof 与设计覆盖视觉分离

- `Design Loop S1–S6` 可以表达场景逻辑完整；
- `Verified S1–S3 / P0 + IMPLEMENTATION` 必须明确显示真实成熟度。

不能用一张漂亮闭环图让用户误以为全部已经生产运行。

---

# 4. V30 方向

V29 的 Action 区应进一步合并回主 instance，形成一个完整的 S1–S6 主场景。

V30 建议新增 / 调整：

1. Hero：从“Business Understanding”升级为 **Understand · Decide · Act · Feedback**；
2. 主 instance：从原来的 S1–S3 + 独立 Action 区，合并成 S1–S6 一体图；
3. 新增紧凑“多场景闭环矩阵”；
4. Early Results 卡增加 `Verified Loop Coverage`；
5. Closing 从“跑通一个可验证闭环”明确为 **跑通一个 S1–S6 闭环**；
6. 保持正式首页不动，先做 V30 Preview。

---

# 5. N12 当前验收条件

- [x] Hero 解释为什么需要 Genesis；
- [x] Business Understanding Gap 独立讲清；
- [x] 主场景覆盖 S1–S6，而不是止于认知 / 判断；
- [x] Action 包含真实 System / Workflow / State Change；
- [x] Verify / Improve 被定义为闭环必需阶段；
- [x] 四类场景都有具体闭环 instance；
- [x] Proof Level / Asset Status / Loop Coverage 三维分开；
- [x] Trust / System Coexistence 支撑 Action；
- [ ] 创建 V30 Preview；
- [ ] 桌面 / 移动端检查；
- [ ] 用户确认后同步正式 `index.html`。
