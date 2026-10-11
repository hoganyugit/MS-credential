---
id: 09-ab-100-syllabus
title: AB-100 考纲逐条：官方 skills measured 怎么考
short: AB-100 考纲
intro: 这一章按 2026 年 10 月 14 日起生效的官方考纲 74 条逐条说明考什么、怎么判断、常见陷阱，每条附 Learn 来源。
exams: AB-100
skills: ab-100
---
AB-100 的官方考纲分三大板块：**Plan AI-powered business solutions（25–30%）**、**Design AI-powered business solutions（25–30%）**、**Deploy AI-powered business solutions（40–45%）**。Deploy 板块最重——监控调优、测试、ALM、负责任 AI 与安全治理四个子领域合计接近一半分值，备考时间也应该这样分配。通过线 700 分；官方说明"多数题目考 GA 功能，常用的 Preview 功能也可能出现"，所以 deep reasoning、Computer use、agent feed 这类预览功能照样要会。

2026 年 10 月 14 日这一版是 **Minor 更新**：变更日志只标了 A2（Design overall AI strategy）、B1（Design AI and agents）、C3（Design the ALM process）三个子领域为 Minor，其余无变化，权重不变。实质变化有两类。一是产品改名——考纲里的 Azure AI Foundry 现在叫 **Microsoft Foundry**，Azure AI services 叫 **Foundry Tools**，Azure OpenAI 的模型归入 **Foundry Models**；读题时见到旧名新名要能对上。二是近几版累计加进来的新考点：**model router**（A3.4）、**code-first generative pages 与 agent feed**（B1.9）、**Model Context Protocol**（B2.4）、**Computer use**（B2.5）、**deep reasoning 与 voice mode**（B2.6）、**Foundry Agent Service 的 ALM**（C3.3）。这些条目对应的 Learn 文档大多是 2025–2026 年新写的，老题库覆盖不到，本章会多花笔墨。

读法建议：每条 bullet 一个小节，标题是官方英文原文。正文先说微软在这条里期望架构师会什么，再给"需求 X → 推荐 Y，因为 Z"的判断规则，最后点出容易混淆的邻居产品；**考点** 框是最可能出题的角度。来源全部是本章写作时核对过的 Learn 页面——官方学习路径 *Architect AI solutions for business productivity* 的 11 个模块与考纲 10 个子领域一一对应，想系统学就按模块顺序读。

## A1. Analyze requirements for AI-powered business solutions {#a1}

这一子领域考"需求分析"：先判断 agent 在业务里到底能做什么（自动化、分析、决策），再审查给它用的数据合不合格，最后把数据组织成别的 AI 系统也能用的形态。题目通常给一段业务场景，问你第一步该做什么或该选哪类数据平台。

#### A1.1 Assess the use of agents in task automation, data analytics, and decision-making

官方模块把 agent 的价值分三块：**任务自动化**（起草文档邮件、总结会议聊天、用 Copilot Studio / Power Automate 触发多步流程）、**数据分析**（自然语言提问得到洞察、趋势、异常和可视化）、**决策支持**（基于历史数据的方案推荐、风险识别、企业知识支撑的建议）。CAF 的 AI strategy 给了架构师真正要用的判断框架：先把用例分成 **Individual work**（提升个人效率，对应 Microsoft 365 Copilot）和 **Business automation**（改变流程、需要系统集成，对应 Copilot Studio / Foundry）；再判断需要 **generative AI（非确定性）** 还是 **nongenerative AI（确定性）**——预测、异常检测这类"同样输入必须同样输出"的任务不要硬上生成式。

| 需求信号 | 推荐 | 原因 |
|---|---|---|
| 重复的手工起草、总结 | Microsoft 365 Copilot / 预置 Copilot | 个人效率型，无需开发 |
| 跨系统多步流程、事件驱动 | Copilot Studio agent + agent flow | 业务自动化型，需连接器与触发器 |
| 输出必须可重复、可审计（预测、分类） | AI Builder / Fabric / Azure ML 的判别式模型 | 确定性任务 |

> **考点** 题干描述"同样输入必须得到同样结果"或"预测需求量"时，正确答案是非生成式模型，而不是 Copilot Studio 的生成式回答。

来源：[Assess the use of agents in task automation, data analytics, and decision-making](https://learn.microsoft.com/en-us/training/modules/analyze-requirements-ai-powered-business-solutions/2-assess-use-agents-task-automation-data-analytics-decision-making)、[AI strategy (Cloud Adoption Framework)](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/strategy)

#### A1.2 Review data for grounding, including accuracy, relevance, timeliness, cleanliness, and availability

Grounding 是让 agent 用"可信的、领域内的组织数据"回答，而不是靠模型记忆。模块定义了五个维度：**Accuracy**（经 SME 验证、与权威来源一致）、**Relevance**（匹配 agent 的用例，否则语义检索会取回"概念相近但场景错误"的内容）、**Timeliness**（Microsoft 365 的 semantic index 随内容变化持续更新；要看修改日期和刷新计划）、**Cleanliness**（结构清晰、无重复、格式稳定，直接影响 embedding 质量）、**Availability**（agent 只能用用户有权限的数据——Copilot Retrieval API 和 Copilot Studio 的 SharePoint / Dataverse / connector 知识源都按用户的 Microsoft Entra ID 做权限裁剪）。Copilot Studio 里对应的设置是 **Allow ungrounded responses**：关掉后没有引用知识源或工具的回合会被拦截并触发 Fallback 主题，适合"只能用公司资料回答"的合规场景；标记 **Official source** 的知识源可直接采用（仅 classic orchestration 支持）。

> **考点** 问"为什么 agent 回答过时"→ 数据 timeliness；问"怎样保证 agent 不用模型常识瞎编"→ 关闭 Allow ungrounded responses。

来源：[Review data for grounding accuracy, relevance, timeliness, cleanliness, and availability](https://learn.microsoft.com/en-us/training/modules/analyze-requirements-ai-powered-business-solutions/3-review-data-grounding-accuracy-relevance-timeliness-cleanliness-availability)、[Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)

#### A1.3 Organize business solution data to be available for other AI systems

考的是数据架构：把业务数据集中、规范化、建索引、开放多条访问路径（API、搜索索引、RAG 管道、Copilot connectors、SQL endpoint），并尽早用 Purview 做分类与标签。落到产品上，最常考的是 **Dataverse 的 Link to Microsoft Fabric**：把 Dynamics 365 / Power Apps 数据（含 finance and operations apps）以 Delta Parquet 副本放进 OneLake，通过 shortcut 让 Fabric 的 Lakehouse、SQL endpoint、Power BI 数据集直接用，**无需导出、无 ETL**，数据仍由 Dataverse 治理并留在同一区域，但会消耗 Dataverse 存储；对照 **Azure Synapse Link for Dataverse** 则是导出到你自己的存储账户、由你管权限。一个环境目前只能链接一个 Fabric 工作区。Fabric 里的洞察又可以作为 virtual table 回到 Dataverse 供低代码应用使用。

> **考点** "让数据科学团队用 Fabric 分析 Dynamics 365 数据且不复制数据、不建 ETL" → Link to Fabric；"需要落到自己的 Data Lake 并自建管道" → Synapse Link。

来源：[Organize business solution data for AI systems](https://learn.microsoft.com/en-us/training/modules/analyze-requirements-ai-powered-business-solutions/4-organize-business-solution-data-available-other-ai-systems)、[Link your Dataverse environment to Microsoft Fabric](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/azure-synapse-link-view-in-fabric)

## A2. Design overall AI strategy for business solutions {#a2}

13 条 bullet，是 Plan 板块的主体。核心是 CAF 的 AI adoption 框架（怎么推进）、四条技术路线（怎么选平台）、多 agent 与预置 agent（怎么组合）、模型层面的决策（自定义模型、SLM、prompt 库与 prompt 工程）以及 AI CoE。这里的题几乎全是"场景 → 选路线"。

#### A2.1 Implement the AI adoption process from the Cloud Adoption Framework for Azure

CAF 的 AI adoption 有六个阶段：**Strategy → Plan → Ready → Govern → Secure → Manage**。Strategy 定用例、技术路线、负责任 AI 与数据策略；**Plan** 做技能评估与获取、取用 AI 资源、按优先级排用例、做 PoC、落实负责任 AI；**Ready** 只针对 Azure 路线（AI landing zone、选架构、网络与可靠性设计）；**Govern**（评估组织风险→记录策略→执行→监控）、**Secure**（发现风险→保护资源与数据→检测威胁）、**Manage** 是持续迭代的过程。每个阶段都给了 **startup checklist** 和 **enterprise checklist** 两版，题目若说"小团队快速起步"就是前者。

> **考点** 把阶段顺序和各阶段里的 checklist 项配对；"要迁移本地基础设施到 Azure 应该用什么框架"答 CAF，而不是 Success by Design 或 Power Platform Well-Architected。

来源：[AI strategy (Cloud Adoption Framework)](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/strategy)、[Govern AI](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/govern)、[Secure AI](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/secure)

#### A2.2 Design the strategy for building AI and agents in business solutions

CAF 的 AI technology strategy 给四条采用路线，控制力递增、速度递减：**ready-to-use Copilots**（Microsoft 365 Copilot、角色型 Sales / Service / Finance agent、Dynamics 365 与 Power Platform 内置 Copilot）→ **low-code SaaS**（Copilot Studio、Microsoft 365 Copilot 的扩展工具）→ **managed PaaS**（Foundry Agent Service 建 agent、Foundry 做 RAG 与 fine-tuning、Fabric / Azure ML 训练模型、Foundry Tools 预置模型）→ **Azure infrastructure**（自带模型跑在 VM / AKS）。选择时权衡四个因素：**Capabilities、Data needed、Skills required、Cost**。学习模块把它压缩成 **"SaaS agent first"** 原则：先问现成 agent 是否满足需求，不满足再看低代码，最后才 pro-code。

| 方案 | 形态 | agent 类型 | 适合 |
|---|---|---|---|
| SaaS agents | 现成 | Retrieval、Task | 个人效率 |
| Copilot Studio | 低代码 SaaS | Retrieval、Task、Autonomous | 流程转型 |
| Microsoft Foundry | pro-code / PaaS | Retrieval、Task、Autonomous | 深度集成、自定义逻辑 |
| GPUs and containers | PaaS / IaaS | 全部 | 合规敏感、私有网络、自带模型 |

来源：[AI strategy (Cloud Adoption Framework)](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/strategy)、[Design AI agents for business solutions](https://learn.microsoft.com/en-us/training/modules/design-overall-ai-strategy-business-solutions/3-design-strategy-building-ai-agents-business-solutions)

#### A2.3 Design a multi-agent solution by using platforms such as Microsoft 365 Copilot, Copilot Studio, and Microsoft Foundry

Copilot Studio 里有两种拆法：**child agent**（同一 agent 内的轻量子 agent，共享上下文，无独立设置与发布，适合单一用例、小团队）和 **connected agent**（独立 agent，自己的编排、工具、知识、模型设置和 ALM，可复用、可独立发布，但多一跳编排带来延迟并扩大治理面）。拆分信号：主 agent 的工具 / 主题 / 子 agent 超过 **30–40 个**选项时选择精度开始下降；需要不同的治理边界或访问权限；要被多个主 agent 复用。可以连接的外部 agent 包括其他 Copilot Studio agent、**A2A 协议** agent、**Microsoft Foundry agent**、**Fabric Data agent**、**Microsoft 365 Agents SDK** agent（后三者预览）。最佳实践：**单一回应原则**（只有父 agent 对用户说话）、子 agent 指令里明示"你是子 agent，不要直接回复用户"、每个子 agent 用不重叠的知识源、描述要精确独特。在 Microsoft 365 Copilot 侧，只有 **custom engine agent** 支持 agent 间协作，declarative agent 不支持。

> **考点** "按描述选择要调用的 agent" "每个 agent 由不同团队独立维护和发布" → connected agents；"同一团队、单一用例、要共享对话上下文" → child agents。

来源：[Add other agents overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents)、[Multi-agent orchestration patterns and best practices](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns)、[Compare declarative and custom engine agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agents-overview)

#### A2.4 Develop the use cases for prebuilt agents in the solution

先盘点现成的，再决定自建。Microsoft 365 侧有 Researcher、Analyst、Facilitator 等通用 agent 和 Sales agent、Service Agent 等角色型 agent；Dynamics 365 侧按应用有 Sales Qualification / Opportunity / Research Agent（Sales）、Customer Intent / Case Management / Customer Knowledge Management / Quality Evaluation Agent（Customer Service 与 Contact Center）、Account Reconciliation Agent（Finance）、Supplier Communications Agent（Supply Chain Management）、Time Entry / Expense / Approvals Agent（Project Operations）等，多数标为 production ready preview。模块给的用例筛选标准：**任务重复频率**、**知识密集度**、**痛点**（延迟、错误、瓶颈）、**可影响的 ROI KPI**（节省工时、工单量下降、周期缩短），并确认数据已在 Microsoft 365 / Dynamics 365 中、不需要复杂多 agent 编排、对准确度的期望与"检索优先"的回答方式相符。

> **考点** 题目先列预置 agent 的能力再问"选哪一个"——记住每个 agent 属于哪个应用；"CTO 想先看看有哪些 agent 模板"对应 finance and operations 的 Agent management 库。

来源：[Develop use cases for prebuilt Microsoft 365 Copilot agents](https://learn.microsoft.com/en-us/training/modules/design-overall-ai-strategy-business-solutions/5-develop-use-cases-prebuilt-agents-solution)、[Overview of Copilot capabilities in finance and operations apps](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/fin-ops/copilot/copilot-for-finance-operations)、[Agents, Copilot, and AI capabilities in Dynamics 365 apps](https://learn.microsoft.com/en-us/dynamics365/copilot/ai-get-started)

#### A2.5 Define the solution rules and constraints when building AI components with Copilot Studio, Microsoft Foundry and Microsoft Foundry Tools

模块要求架构师先定一套统一规则，再按平台落地：**Copilot Studio** 适合流程边界明确的任务型和检索型 agent，约束来自托管连接器、内置安全过滤和 Microsoft SaaS 边界，规则是严格限定连接器范围、不让 agent 做高影响决策；**Foundry** 适合复杂推理和多 agent，但要自己负责模型选择、评估管道、工具权限、VNet / 私有端点和运维；**Foundry Tools** 要求对每个工具最小权限、定义升级到人的规则、记录所有集成。平台硬性限制也要记：Copilot Studio 每个 agent 最多 **500 个知识源**、**1,000 个主题**、每主题 **200 条 trigger phrase**、Copilot agent 指令 **8,000 字符**、文件 **512 MB**、生成式编排最多 **128 个工具**（建议 25–30）；生成式 AI 消息按预付消息包有 RPM / RPH 配额，触发器过频会被限流。

| 规则类别 | Copilot Studio | Foundry |
|---|---|---|
| 数据访问 | 连接器严格限定范围 | 完全可控，需自定边界 |
| 治理 | 平台强制 | 架构师主导、可定制 |
| 评估 | 内置安全 | 需要评估管道 |

来源：[Define solution rules and constraints for AI components](https://learn.microsoft.com/en-us/training/modules/design-overall-ai-strategy-business-solutions/6-define-solution-rules-constraints-building-ai-components)、[Quotas and limits (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-quotas)、[Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent)

#### A2.6 Determine the use of generative AI and knowledge sources in agents built with Copilot Studio

Copilot Studio 的知识源五类：**Public website**（Bing 检索，生成式模式最多 25 个站点）、**Documents**（上传到 Dataverse）、**SharePoint**（Graph 检索，生成式模式 25 个 URL）、**Dataverse**（生成式模式不限数量；classic 模式 2 个来源 × 15 张表，支持 glossary 与 synonyms）、**连接器中的企业数据**（经 Microsoft Search 索引）。SharePoint、Dataverse、连接器都要求用户用 Microsoft Entra ID 认证，结果按用户权限裁剪。生成式编排超过 25 个知识源时由内部模型先筛选；Bing Custom Search 与 custom data 只能放在主题里的 generative answers 节点。关键开关：**Allow ungrounded responses**、**Use information from the web**（基于 Grounding with Bing Search）、**内容审核级别**（Lowest–Highest，默认 High，主题级覆盖 agent 级）、**Tenant graph grounding with semantic search**（需租户内有 Microsoft 365 Copilot 许可，额外计费，可支持 200 MB SharePoint 文件）。

> **考点** "答案必须全部来自公司文档" → 关 Allow ungrounded responses；"要问 Dataverse 表里的结构化数据" → Dataverse 知识源而不是上传文件；"需要实时公网信息" → Web search。

来源：[Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)、[Orchestrate agent behavior with generative AI](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions)

#### A2.7 Determine when to build custom agents or extend Microsoft 365 Copilot

两条路：**declarative agent**（用 Copilot 自己的编排器和模型，只加指令、知识、动作；无需额外托管；继承 Microsoft 365 的合规与 RAI；面向个人使用；不支持主动触发；用 Agent Builder 或 Copilot Studio、Agents Toolkit 构建）与 **custom engine agent**（自带编排器和模型，可选 SLM / fine-tuned / 行业模型；支持主动消息、群组协作、Microsoft 365 之外的渠道、agent 间协作；需在 Copilot Studio 或 Azure 等外部托管，并自负合规与 RAI）。CAF 的决策树补一条：已经有 Microsoft 365 Copilot 且只需领域知识 → 用扩展工具；目标是自动化业务功能 → Copilot Studio；需要 API 级访问与自定义编排 → Foundry。

| 需求 | 选择 |
|---|---|
| 工作流在 Teams / SharePoint / Outlook 内，加知识和简单动作 | declarative agent |
| 自选模型、复杂业务规则、多系统集成 | custom engine agent |
| 事件触发、无用户输入 | custom engine agent（或 Copilot Studio autonomous agent） |
| 整合已有的外部对话助手 | custom engine agent |

来源：[Compare declarative and custom engine agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agents-overview)、[AI strategy (Cloud Adoption Framework)](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/strategy)

#### A2.8 Determine when custom AI models should be created

模块的原则：只有在 prompt 工程、检索调优、fine-tuning 和更强的目录模型都试过仍达不到精度，或领域专有、合规要求完全可控、超高用量下每次查询的成本优化价值巨大时，才自建模型；否则先用目录模型或扩展 Microsoft 365 Copilot。Foundry 的 fine-tuning 文档给了中间路线：**SFT**（大多数场景起点）、**DPO**（有"偏好 / 非偏好"对比数据，调风格与安全）、**RFT**（数学、化学等有明确对错的领域，用 o4-mini）；**serverless**（按 token 计费、无需 GPU 配额、含 OpenAI 模型）对比 **managed compute**（自备 VM、更多模型与超参、不含 OpenAI）；数据从 50–100 条高质量样本起步，生产 500+。低代码侧的"自定义模型"是 **AI Builder** 的 document processing、分类、实体抽取、预测等。

> **考点** "通用模型总结能力够用但不知道公司术语" → 先 RAG / 知识源，不是 fine-tune；"要模型以特定格式稳定输出、风格统一" → fine-tune（SFT）。

来源：[Determine when custom AI models should be created](https://learn.microsoft.com/en-us/training/modules/design-overall-ai-strategy-business-solutions/9-determine-custom-ai-models-created)、[Fine-tune models with Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/fine-tuning-overview)

#### A2.9 Provide guidelines for creating a prompt library

Prompt 库是"经治理的可复用 prompt 集合"，目的是一致性、治理、效率、质量与可扩展性，通常由 AI CoE 维护。规范要点：每条 prompt 遵循 **Clarity / Context / Constraints / Output format** 四要素；标准化模式（instruction + context + output、few-shot、role prompting、multi-step）；按领域（HR、Finance、IT、Sales）分类；每条带**治理元数据**——用途、负责人、版本、更新日期、适用系统、风险分级、要求的 grounding 来源；存放在 SharePoint、GitHub Enterprise 或 Azure DevOps 仓库；审批流程要有领域专家、负责任 AI 评审和安全合规；跨多种输入、边界情况和**不同模型版本**测试；过期即退役。Copilot Studio 的 prompt 工具自带模板和 Prompt assistant，Copilot Agent Kit 的 **Prompt Advisor** 能给 prompt 打信心分并建议优化版本。

来源：[Provide guidelines for creating a prompt library](https://learn.microsoft.com/en-us/training/modules/design-overall-ai-strategy-business-solutions/10-provide-guidelines-creating-prompt-library)、[Copilot Agent Kit overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/kit-overview)

#### A2.10 Develop the use cases for customized small language models for the solution

SLM（如 Phi 系列）的优势是**成本、延迟、可控**，适合：领域知识密集且边界清晰的工作流（合规分析、合同风险、制造故障手册）、**受限环境**（移动、IoT、边缘、高并发、断网）、要求完全掌控训练数据和评估管道的安全场景、按企业写作风格定制的生产力任务，以及多 agent 架构里的低成本规划 / 路由 agent。模块特别强调反模式：**对通用模型做 RAG 就够的场景却去定制 SLM**、低估数据整理与评估工作量、把 SLM 当作消除幻觉的银弹、用 SLM 做开放式创意推理。成功指标：任务准确率、延迟目标、每千次请求成本、安全事件率、随时间的漂移。Foundry 的 fine-tuning 目录里 Phi-4 支持 SFT，是"简单任务的低成本选项"。

| 因素 | 定制 SLM | 通用 LLM |
|---|---|---|
| 领域专一性 / 延迟敏感 / 成本约束 | 高 | 低到中 |
| 部署位置 | 边缘 / IoT / 本地 | 云 |
| 任务复杂度 | 中高且专门 | 高且泛化 |

来源：[Develop use cases for customized small language models](https://learn.microsoft.com/en-us/training/modules/design-overall-ai-strategy-business-solutions/11-develop-use-cases-customized-small-language-models-solution)、[Fine-tune models with Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/fine-tuning-overview)

#### A2.11 Provide prompt engineering guidelines and techniques for AI-powered business solutions

Foundry 的 prompt 工程文档是出题蓝本：prompt 由 **instructions、primary content、examples（zero / few-shot）、cue、supporting content** 组成；技巧包括任务说明放开头、因 **recency bias** 在末尾重复指令、用 cue **prime the output**、用 `---` 或 Markdown / XML 加清晰语法、**把任务拆步**、chain-of-thought（仅非推理模型；对 gpt-5 / o 系列推理模型不建议这些技巧）、给 **grounding context**、要求**带引用**以减少编造、指定输出结构、**给模型一个"出口"**（"找不到就回答 not found"）、temperature 与 top_p 只调一个。Copilot Studio 的 agent 指令与工具 / 主题描述另有一套写法：简洁直接、主动语态、关键词相关、名称独特、说明"不能做什么"以消除歧义。

> **考点** "模型忽略了开头的要求" → 末尾重复指令（recency bias）；"输出格式不稳定" → prime the output / 指定结构；"编造答案" → 要求引用 + 给出口。

来源：[Prompt engineering techniques (Microsoft Foundry)](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/prompt-engineering)、[Orchestrate agent behavior with generative AI](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions)

#### A2.12 Include the elements of the Microsoft AI Center of Excellence

CAF 定义 AI CoE 是"推动 AI 落地、防止碎片化与无治理采用的内部专家团队"。组建五步：**争取高管支持**（steering committee、月度评审、直达 C-level）、**指定 CoE 负责人**、**组建跨学科团队**（业务负责人找用例与数据，技术专家负责数据、模型、治理、安全、运维）、**确定组织位置**（优先并入已有的 Cloud CoE，只在现有团队无法支撑时单设）、**定义运营模式**（早期集中式，成熟后转为顾问式）。八项职责：定义 AI 战略、培养技能、领导试点、**定义并执行标准**、建立需求收集与优先级流程、开发可复用资产、度量并汇报结果、（可选）管理 AI 服务。成熟后要识别"审批延迟、知识瓶颈"等拐点，把交付嵌入平台团队，CoE 退到设定护栏的顾问角色。

> **考点** 问 CoE 的职责归属（谁维护 prompt 库、谁定 KPI）或"集中式还是顾问式"的演进时机。

来源：[Establish an AI Center of Excellence](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/center-of-excellence)

#### A2.13 Design AI solutions that use multiple Dynamics 365 apps

跨 Sales、Customer Service、Finance、Field Service 的 AI 方案要解决三件事：**共享业务上下文**（统一客户 / 产品 / 运营视图）、**流程连续性**（Sales → Customer Service → Finance → Field Service 的接力，用户能"从上次离开处继续"，多会话应用支持长时任务）、**数据互操作**（统一的 Dataverse 表、一致的实体 schema、事件驱动的数据流，只基于权威受治理的数据 grounding）。架构模式是 **intent-driven**：解析意图 → 路由到正确的应用与实体 → 按业务规则调整下一步 → 用 Dataverse 事件代替点对点集成；复杂跨域流程用 planner / worker / reviewer 的多 agent 结构。数据层面，Link to Fabric 可以把包括 finance and operations apps 在内的所有 Dynamics 365 数据汇到 OneLake；F&O 侧的 Dynamics 365 ERP MCP server 让 agent 不写代码就能操作数据实体与业务逻辑。安全上要尊重各应用的行级安全并保留 lineage。

来源：[Design AI solutions using multiple Dynamics 365 apps](https://learn.microsoft.com/en-us/training/modules/design-overall-ai-strategy-business-solutions/16-design-ai-solutions-use-multiple-dynamics-365-apps)、[Link your Dataverse environment to Microsoft Fabric](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/azure-synapse-link-view-in-fabric)、[Overview of Copilot capabilities in finance and operations apps](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/fin-ops/copilot/copilot-for-finance-operations)

## A3. Evaluate the costs and benefits of an AI-powered business solution {#a3}

四条 bullet：ROI 标准与 TCO、ROI 分析、build / buy / extend、model router。前三条偏方法论，题目会给数字让你算或让你选成本类别；model router 是新加的产品题。

#### A3.1 Select ROI criteria for AI-powered business solutions, including the total cost of ownership

ROI 维度分五类：**生产力**（每任务节省时间、人工录入减少、案例解决更快）、**成本节约**（人工时数、支持工单量、合规审核负担）、**收入**（转化率、线索资格、留存、交叉销售）、**风险降低**（合规违规、错误率）、**战略价值**。TCO 和 ROI "并排放但回答不同问题"，TCO 覆盖整个生命周期：**开发**（数据准备、prompt 工程、agent 设计测试、集成）、**部署**（基础设施、许可、安全合规、API 用量）、**运营**（监控评估、模型重训、prompt 库维护、支持、用户培训）、**变更管理**（技能、沟通、流程重设计）、**退役**。CAF 另给每条技术路线的主要成本因素：Copilot 是按用户许可，Copilot Studio 是许可与消耗，Foundry 是 token、存储、计算与 grounding 连接。Copilot Studio 的 **Monitor › Savings** 能按 per-run 或 per-tool 配置节省时间 / 金额并追踪趋势。

来源：[Evaluate ROI criteria for AI-powered solutions](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/2-roi-criteria-ai-powered-business-solution-including-total-cost-ownership)、[Monitor conversational agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-improve-agent-effectiveness)、[AI strategy (Cloud Adoption Framework)](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/strategy)

#### A3.2 Create an ROI analysis for the proposed AI solution for a business process

模块给出可直接套用的流程：1. **框定范围**到单一流程，建立"无 AI"基线（任务量、平均处理时长、错误率、积压）；2. 把 AI 价值映射到三个杠杆——**节省时间、质量提升、吞吐 / 产能**；3. 用 Copilot Studio 的 **Savings** 功能量化：输入每次运行节省分钟数、成功运行次数（只算已解决的）、完全加载人工时薪；4. 换算成财务收益：`Annual_Benefit = (Minutes_Saved_per_Run / 60) × Runs_per_Year × Labor_Rate` 再加错误成本避免；5. 建 TCO 五项（基础设施、开发集成、数据质量、专家人力、运营与许可）；6. 算 `Net_Benefit = Annual_Benefit − Annual_TCO`、`ROI % = Net_Benefit / Annual_TCO × 100`、`Payback = 一次性成本 / 月净收益`，并做乐观 / 预期 / 保守三档敏感性分析；7. 用一页纸给高管：问题、干预、实测影响、财务、置信度与风险、决策（如"8 周试点，达标后推广"）。

> **考点** 给出分钟数、运行量、时薪、TCO 让你算年收益或 ROI%；或问"哪个指标代表回本时间"→ payback period。

来源：[Create ROI analysis for a proposed AI solution](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/3-create-roi-analysis-proposed-ai-solution-business-process)、[Monitor conversational agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-improve-agent-effectiveness)

#### A3.3 Analyze whether to build, buy, or extend AI components for business solutions

**Build**：深度定制、掌控数据与 IP、独特流程、有强 AI/ML 工程能力，但前期成本高、周期长。**Buy**：时间优先、工程能力有限、流程标准化，风险是厂商锁定和功能缺口。**Extend**：在 Microsoft 365 Copilot、Copilot Studio、Foundry 等平台上加领域知识（grounding 数据、连接器、插件、自定义动作），兼顾速度与定制。五个成本域对比：基础设施 Build 高 / Buy 低 / Extend 中，数据准备 Build 高 / Buy 低 / **Extend 高**（因为 grounding 数据仍要自己准备）。决策流程：定义需求 → 判断战略重要性（差异化 vs 商品化）→ 评估厂商方案 → 评估扩展可行性 → 评估完全自建 → 估算 TCO → 预测 ROI → 加权打分。

> **考点** "Dynamics 365 预置 agent 已覆盖 80% 需求" → Buy / Extend；"流程是核心竞争力且有数据科学团队" → Build。注意 Extend 的数据准备成本并不低。

来源：[Analyze whether to build, buy, or extend AI components](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/4-analyze-whether-build-buy-extend-ai-components-business-solutions)、[AI strategy (Cloud Adoption Framework)](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/strategy)

#### A3.4 Implement a model router to intelligently route requests to the most suitable model

**Model router** 是 Foundry Models 里一个经训练的语言模型，按 prompt 的复杂度、推理需求、任务类型实时把每次请求路由到最合适的底层 LLM，对外只是**一个模型部署**。三种 **routing mode**：**Balanced**（默认，在与最佳质量相差约 1–2% 的模型中选最便宜）、**Cost**（质量带放宽到 5–6%）、**Quality**（只看质量）。**Model subset** 让你限定可路由的模型集合（也是故障转移的备选集，建议至少两个）；底层模型不需单独部署，**Claude 模型例外**。支持 Global Standard 与 Data Zone Standard 部署，可被 Azure Policy 治理；当前版本 `2025-11-18` 会原地加入新模型。限制：**上下文窗口按最小的底层模型算**、不处理音频、路由决策只看文本、按输入 token 计费。

> **考点** "既要控成本又不想为每类问题手工选模型" → model router；"大上下文请求失败" → 用 model subset 选支持大窗口的模型；"合规要求数据不出区域" → Data Zone Standard。

来源：[Model router for Microsoft Foundry concepts](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/model-router)

## B1. Design AI and agents for business solutions {#b1}

16 条 bullet，是整个考纲最长的子领域。前四条围绕 Dynamics 365 客户体验类应用的 Copilot（业务术语、自定义、Sales 连接器、Contact Center 渠道），中间三条是三类 agent 的设计，后面是 Foundry Tools、generative pages 与 agent feed、Copilot Studio 的主题 / 编排 / agent flow / prompt，以及 Power Platform Well-Architected。

#### B1.1 Design business terms for Copilot in Dynamics 365 apps for customer experience and service

"业务术语"指让 Copilot 听懂你组织的词汇。**Dynamics 365 Sales**：在 Copilot Studio 打开环境里的 **Copilot in Dynamics 365 Sales** agent（旧名 Sales Copilot Power Virtual Agents Bot）→ Knowledge 里的 **SalesSpecificQnA** → **Glossary** 把业务术语映射到表的列，**Synonyms** 给列加别名（例如把 opportunity 表的自定义列 *custom revenue* 加同义词 *opportunity revenue*），然后 Publish；需要 **Copilot Studio Author** 角色，目前仅英文。**Dynamics 365 Customer Service**：在 Copilot Service admin center 的 **Summaries** 里为 case / 自定义记录摘要指定记录类型的**自然语言描述**、选择 Copilot 要用的字段（1-to-1 最多 10 个、1-to-many 最多 6 个且最多 3 个相关实体）、设置结构化摘要的自定义标题——这是让摘要用你的案例分类和解决词汇的方式。

> **考点** "销售人员用公司术语提问 Copilot 却查不到自定义列" → Sales 的 glossary / synonyms；"案例摘要没有引用自定义字段 Issue Type" → Summaries 里映射字段。

来源：[Customize Copilot in Dynamics 365 Sales](https://learn.microsoft.com/en-us/dynamics365/sales/extend-copilot-chat)、[Manage case and custom record summary](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/copilot-map-custom-fields)、[Design business terms for Copilot in Dynamics 365 Customer Service](https://learn.microsoft.com/en-us/training/modules/design-ai-agents-business-solutions/3-design-business-terms-copilot-dynamics-365-apps-customer-experience-service)

#### B1.2 Design customizations of Copilot in Dynamics 365 apps for customer experience and service

可自定义的四个面：**业务术语与领域语言**、**prompt 与输出**（语气、结构、必含字段、禁用词）、**数据范围**（摘要用哪些字段与相关记录、知识源）、**呈现位置**（表单、对话窗、时间线、仪表板）。Customer Service 的具体入口：Copilot Service admin center 里 **Customer Support** agent 的 Overview / Immersive settings / Email settings / **Prompts** / **Extend agent** 页签；摘要格式选 **Paragraph** 或 **Structured**（最多 5 个自定义标题，默认 Issue、Troubleshooting steps、Outcome、Error code、Root cause），可包含相关记录摘要（如案例下的工单）。Sales 的自定义走 Copilot Studio：给 Copilot in Dynamics 365 Sales agent 加自定义主题、知识源和动作，编辑 **SalesSparks** 主题定制 prompt guide；自定义主题按 Copilot Studio credits 计费，图片 / 视频消息不支持（用 Adaptive Card）。两边都建议**用 solution 承载自定义**便于跨环境部署。

来源：[Manage case and custom record summary](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/copilot-map-custom-fields)、[Manage Copilot features in Customer Service](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-copilot-features)、[Customize Copilot in Dynamics 365 Sales](https://learn.microsoft.com/en-us/dynamics365/sales/extend-copilot-chat)

#### B1.3 Design connectors for Copilot in Dynamics 365 Sales

这里的"连接器"是让 Sales 的 Copilot（含 Outlook / Teams 里的 **Sales agent**）读取第三方系统数据的 **custom connector + connector action**。设计要点：连接器必须建在**启用了 Dynamics 365 应用的环境**（默认环境不支持）；在 Power Apps 或 Power Automate 用 OpenAPI 定义创建；认证用 **OAuth 2.0 + Microsoft Entra ID**，后端与连接器各一个 app registration，需要自动化认证时设置 `Enable onbehalfoflogin = true`（OBO token）；然后在 Copilot Studio 创建使用该连接器的 **action**、发布，并请管理员为销售用户启用；动作最多 **7 天**后才出现在 Sales 体验中（重新登录可加速）。治理上管理员要审查第三方数据的条款与隐私，连接器与插件可选认证以供全租户使用。Sales agent 本身支持 Dynamics 365 Sales 或 Salesforce 作为 CRM，由 Microsoft 365 管理员安装。

来源：[Design connectors for Copilot in Dynamics 365 Sales](https://learn.microsoft.com/en-us/training/modules/design-ai-agents-business-solutions/5-design-connectors-copilot-dynamics-365-sales)、[Welcome to Sales agent](https://learn.microsoft.com/en-us/microsoft-sales-copilot/introduction)

#### B1.4 Design agents for integration with Dynamics 365 Contact Center channels

把 Copilot Studio agent 接进 Dynamics 365 Contact Center（嵌入版、独立版）或 Customer Service 的规则：agent 与 Customer Service 必须在**同一环境**；在 Copilot Studio › Channels › **Customer engagement hub** › Dynamics 365 Customer Service 连接（agent 名称需少于 30 字符，需 Copilot Studio 与 Chat Add-in 许可）；在 Copilot Service admin center 把 agent 加入 **workstream**——**每个 workstream 只能一个 agent，且只有 push 型 workstream 能把对话交给 agent**；可加入队列、用 context variables 做路由。转人工用 **Transfer conversation** 节点，会带上完整对话历史和所有变量（共享变量总大小受 28 KB 的 ACS 消息限制）；要配置 Session Timeout 主题，未升级的对话 30 分钟无活动自动关闭。语音渠道用 **real-time voice agents**（支持 barge-in、会话内切换语言、DTMF 回退），只能配合 enhanced voice workstream；NLU 在 Copilot Studio 内处理、**NLU+** 在 Dynamics 365 内处理。预置的 Customer Assist Agent 也在这里管理。

> **考点** "一个 workstream 想加两个 agent" 不可行；"用 Copilot Studio 的 embed 代码测试转人工" 不工作——必须用 Customer Service 聊天小组件的 embed 代码。

来源：[Integrate a Copilot agent in Dynamics 365 Contact Center](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-bot-virtual-agent)、[Configure handoff to Dynamics 365 Customer Service](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-hand-off-omnichannel)

#### B1.5 Design task agents

Task agent 是"替用户完成一件具体事"的 agent：创建记录、更新线索、提交审批、查库存。模块把它拆成六个组件——**Goals**（可执行、可观测、可测试的目标）、**Skills**（语言理解、数据解读、规划、执行）、**Actions**（Power Platform 连接器、自定义连接器、API、Dataverse 操作、流；每个动作要有输入、输出 schema、认证和错误处理）、**Knowledge**、**Context**、**Safety & rules**（"下单前必须确认""永不覆盖客户信用额度"）。在 Copilot Studio 里动作就是 **Tools**：生成式编排按名称和描述自动选择并用 AI 生成追问来填输入；高影响工具可打开 **Ask the end user before running**；认证选 End user 还是 Maker-provided 决定了数据访问边界。最佳实践：从一个高价值流程起步、目标小而聚焦、权限最小化、真实场景和边界用例测试。

来源：[Design task agents in Microsoft Copilot Studio](https://learn.microsoft.com/en-us/training/modules/design-ai-agents-business-solutions/7-design-task-agents)、[Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent)

#### B1.6 Design autonomous agents

自主 agent 由**事件触发器**驱动而不是用户输入：Dataverse 行增改删、SharePoint 新项、OneDrive 新文件、Planner 任务完成、Recurrence 定时等，触发器通过连接器把 **trigger payload**（JSON 或文本，可附指令）发给 agent，agent 按自身指令和 payload 指令选择动作或主题。硬性规则：**只支持生成式编排**；触发器**只能用制作者凭据**认证，发布后用户可能借 agent 用制作者权限访问数据，发布前会有警告；每次 payload 算一条消息计费，过频触发会撞配额；环境需开启 solution-aware cloud flow sharing；管理员可用数据策略屏蔽触发器。设计建议：多触发器时把具体指令放进各自的 payload 而不是堆在 agent 总指令里；连续调用的动作 / 主题少于 15 个；发布前用 Activity 页测试。

> **考点** "每天凌晨自动汇总并发邮件" → Recurrence 触发器的 autonomous agent；"触发器 agent 用谁的身份跑" → 制作者凭据。

来源：[Event triggers overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-triggers-about)、[Design autonomous agents in Copilot Studio](https://learn.microsoft.com/en-us/training/modules/design-ai-agents-business-solutions/8-design-autonomous-agents)

#### B1.7 Design prompt and response agents

Prompt-and-response agent 是"一问一答（可多轮）、以知识为主"的会话 agent。Copilot Studio 里的构件：**Generative answers 节点**（在主题中对知识源检索生成回答，可作为主题未命中时的 fallback，也可存入变量后用 Adaptive Card 呈现）、**系统主题**（Greeting、Escalate、Fallback、End of Conversation、Multiple Topics Matched、错误处理，提供可预测的对话骨架）、**Condition 节点**（按变量和 Power Fx 分支，例如 VIP 与普通客户不同回答）、以及需要时的事件触发器。设计原则：知识源要准确、最新、经治理；对合规场景关闭 Allow ungrounded responses；明确升级到人的条件。这类 agent 也是 Microsoft 365 Copilot 里 declarative agent 的典型形态。

| 机制 | 何时使用 |
|---|---|
| Generative answers | 问题没有对应主题，需要从知识库回答 |
| System topics | 问候、fallback、升级、错误、歧义消解 |
| Condition nodes | 按变量分支对话 |
| Event triggers | 需要对事件而非用户提问做出反应 |

来源：[Design prompt-driven agents using Copilot Studio](https://learn.microsoft.com/en-us/training/modules/design-ai-agents-business-solutions/9-design-prompt-response-agents)、[Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)

#### B1.8 Propose Microsoft Foundry Tools for a given requirement

Foundry Tools（原 Azure AI services）是预置、可定制的 API 与模型。按需求对号：

| 需求 | Foundry Tool |
|---|---|
| 语音转文字、文字转语音、说话人识别 | Speech |
| 100 多种语言的文本翻译 | Translator |
| 意图 / 实体识别（CLU）、情感、关键短语、PII | Language |
| 发票、收据、表单、合同抽取结构化数据 | Document Intelligence |
| 跨文档 / 音频 / 视频等多模态内容理解 | Content Understanding |
| 图像与视频分析、OCR | Vision；按自己的图片训练用 Custom Vision |
| 为 RAG 建向量 / 混合检索索引 | Azure AI Search |
| 检测有害内容、Prompt Shields | Content Safety |

已退役、不要选的：LUIS、QnA Maker、Anomaly Detector、Personalizer、Metrics Advisor、Content Moderator。多数服务有免费层（F0 SKU），很多可以用容器部署到本地满足合规。

> **考点** 题干出现 LUIS 或 QnA Maker 一律是干扰项；"从供应商发票 PDF 抽字段" → Document Intelligence，不是 Vision OCR。

来源：[What are Foundry Tools?](https://learn.microsoft.com/en-us/azure/ai-services/what-are-ai-services)

#### B1.9 Propose code-first generative pages and the use of an agent feed for apps

**Generative pages** 是 model-driven app 里用自然语言生成的页面：描述需求、指定最多 **6 张 Dataverse 表**（连接器与自定义 API 为预览）、可附参考图，系统生成 **React 代码**（UI 与业务逻辑）并可查看、对比迭代、手改；页面 **solution-aware**，可嵌入表单接收 `recordId`；只支持 model-driven app，不消耗 AI credits。"**code-first**"指微软推荐的做法——用 GitHub Copilot CLI 等 AI 编码工具在本地 IDE 配合 Power Platform CLI 创建和编辑生成式页面，能用最新前沿模型、全球可用、一次生成多页面与表；浏览器内体验目前只在美国、英国、澳大利亚、新加坡。**Agent feed** 是 model-driven app 里供人监督 agent 的任务流：自主 agent 通过 **Power Apps MCP server** 的 `request_assistance`、`invoke_data_entry`、`request_review` 工具记录任务，用户在 **Needs attention / Completed** 两栏里完成、接受或忽略，并有 Insights 面板看人机协作比例；2026 年 5 月 1 日起只支持用 Power Apps MCP server 的 agent，预览且仅英文。

> **考点** "需要在应用内让业务用户审核 agent 自动创建的记录" → agent feed；"快速生成企业级自定义页面且要用最新模型" → code-first generative pages。

来源：[Generate a page using natural language with model-driven apps](https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/generative-pages)、[Supervise agents in model-driven apps with agent feed](https://learn.microsoft.com/en-us/power-apps/user/supervise-agents-with-agent-feed)

#### B1.10 Design topics for Copilot Studio, including fallback

主题设计的 Learn 最佳实践：区分**入口主题**（trigger phrase 触发）与**可复用的小主题**（被 redirect 调用、可带输入输出变量），多做"bite-size"主题、用 **entities** 代替重复主题（一个 Order 主题 + FoodType 实体，而不是三个点餐主题）、用**消歧主题**和 slot filling 处理重叠意图、监控 Multiple Topics Matched（"did you mean"）的触发频率来发现重叠。**Fallback** 系统主题在 **On Unknown Intent** 时触发：默认让用户重述**最多两次**，仍不懂就 redirect 到 **Escalate** 主题；可以用 `UnrecognizedTriggerPhrase` 变量把原话传给流或后端，也可以 Reset to default；Teams 版没有默认 fallback 主题需自建。生成式编排下主题按**描述**而非 trigger phrase 选择，Conversational boosting 和 Multiple Topics Matched 系统主题不再被调用，关闭 Allow ungrounded responses 后无依据的回答也走 Fallback。

> **考点** "两次没听懂就转人工" 正是默认 Fallback → Escalate 行为；"把用户没识别的话记录下来分析" → UnrecognizedTriggerPhrase。

来源：[Configure the system fallback topic](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-system-fallback-topic)、[Follow topic authoring best practices](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/topic-authoring-best-practices)、[Orchestrate agent behavior with generative AI](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions)

#### B1.11 Design data processing for AI models and grounding

Azure Well-Architected 的 grounding data design 是这条的教材：**预判用户查询**；把 grounding 数据**外置到搜索索引**（Azure AI Search 等）而不是每轮查源系统；制定**摄取策略**（去噪去重、统一 schema、保留敏感标签、不索引不需要的个人数据、enrichment 如生成问答对与元数据、保留 lineage）；**chunking** 按模型上下文窗口与语义边界切分（整篇 grounding 精度高但 token 贵）、生成 embeddings；索引字段只在需要时标 searchable / filterable / retrievable；用 **hybrid search**（向量 + 关键词 + 语义重排）；用 filterable 字段做 **security trimming**；索引更新优先 **side-by-side 重建**，按新鲜度 SLO 刷新，并为"被遗忘权"预留删除路径。Copilot Studio 的 RAG 管道是托管好的：查询重写（带最近 10 轮上下文）→ 每个知识源取前 3 条 → 带引用的摘要 → 审核校验；注意 Azure AI Search 知识源**不做权限裁剪**，上传文件最多 500 个 / 512 MB。

来源：[Grounding Data Design for AI Workloads on Azure](https://learn.microsoft.com/en-us/azure/well-architected/ai/grounding-data-design)、[Enhance AI responses with Retrieval Augmented Generation](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/retrieval-augmented-generation)

#### B1.12 Design a business process to include AI components in a Power Apps canvas app

画布应用里的 AI 分两层。**制作者侧**：Copilot in Power Apps 用自然语言生成应用与数据模型、改逻辑和表、生成界面；GA 功能默认开启且只能由微软支持关闭，预览功能可由管理员按环境（Settings › Features › Copilot）或租户关闭——关闭的只是制作者 Copilot，不影响终端用户的 Copilot control 与 model-driven app 的 Copilot。**终端用户侧**：Copilot control 让用户用自然语言问应用数据、嵌入 Copilot Studio agent、调用 AI Builder 模型和 prompts。模块给的设计步骤：画出当前流程（角色、输入、决策、易错步骤）→ 找 AI 机会（重复更新、需要解读汇总的数据、需要指导的环节）→ 决定 Copilot 的交互形式（聊天面板、建议条、自动生成文本、自然语言建记录）→ 集成 → 校验 DLP 与治理边界。

| 流程步骤 | 放入的 AI 组件 |
|---|---|
| 数据采集 | AI 生成表单字段 / 文档抽取 |
| 评估决策 | Copilot 建议 |
| 记录创建 | AI 生成文本 |
| 导航帮助 | Copilot 助手面板 |

来源：[Copilot in Power Apps overview](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/ai-overview)、[Design business processes with AI in Power Apps canvas apps](https://learn.microsoft.com/en-us/training/modules/design-ai-agents-business-solutions/14-design-business-process-include-ai-components-power-apps-canvas-app)

#### B1.13 Apply the Microsoft Power Platform Well-Architected Framework to intelligent application workloads

Power Platform Well-Architected 有五个支柱：**Reliability、Security、Operational Excellence、Performance Efficiency、Experience Optimization**——比 Azure Well-Architected 少了 Cost Optimization、多了 Experience Optimization，这是最常见的辨析题。它提供设计原则、设计评审清单、建议指南、权衡说明和在线 **Assessment** 工具；"intelligent application workload"就是 Copilot Studio 这类生成式 AI 工作负载，设计域覆盖负责任 AI、安全合规、性能、部署与测试、集成、意图识别与实体抽取。Copilot Studio 的实施指南把它定位为"从'让 agent 上线'走向'健壮、可维护、可成长'"的参照，并补充微软的 **Architecting agent solutions** 框架（fit for purpose、operability、trust / traceability / transparency）。

> **考点** "Copilot Studio 最佳实践与会话体验设计该用什么框架" → Power Platform Well-Architected；"基础设施迁移" → CAF；"Dynamics 365 实施方法论" → Success by Design；ALM Accelerator 是工具不是框架。

来源：[Power Platform Well-Architected](https://learn.microsoft.com/en-us/power-platform/well-architected/)、[Define your solution architecture (Copilot Studio guidance)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/architecture-overview)、[Apply the Power Platform Well-Architected Framework](https://learn.microsoft.com/en-us/training/modules/design-ai-agents-business-solutions/15-apply-power-platform-well-architected-framework)

#### B1.14 Determine when to use standard natural language processing, conversational language understanding, or generative AI orchestration in Copilot Studio

三种语言理解方式：**生成式编排**（默认；LLM 识别多意图、链式调用主题 / 工具 / 知识、自动生成追问、统一回答；限制 128 个主题与动作、每条链最多 5 条消息）；**内置 NLU**（classic 编排的 trigger phrase 与预置 / 自定义实体；单意图、不可扩展、同类型多实体需消歧；大规模或语音场景用 **NLU+**）；**Azure CLU**（Azure AI Language 的自定义模型：更多语言、行业词汇、复杂实体抽取如多个 from 实体；需把 CLU 意图映射到主题并保持同步，Azure 侧单独计费与限额）。

| 需求 | 选择 |
|---|---|
| 固定短语、受监管流程、结果必须可预测 | 内置 NLU（classic） |
| 同一问题几十种说法、要抽结构化实体、多语言、持续重训 | Azure CLU |
| 开放式、需要知识 grounding、汇总生成、多步对话 | 生成式编排 |

> **考点** "主题按用途描述而非 trigger phrase 触发，让对话更自然" → 生成式编排；"非英语行业词汇、要自己训练意图模型" → CLU。

来源：[Design effective language understanding](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/language-understanding)、[Conversational language understanding integration overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-clu-integration)、[Determine the use of standard natural language processing](https://learn.microsoft.com/en-us/training/modules/design-ai-agents-business-solutions/16-determine-use-standard-natural-language-processing)

#### B1.15 Design agents and agent flows with Copilot Studio

**Agent flow** 是 Copilot Studio 原生的、**确定性**的自动化（同样输入同样输出），由一个 **trigger**（手动、定时、事件，或 *When an agent calls the flow* 以作为工具挂到 agent）加动作组成；动作类型有 **AI capabilities**（生成文本、处理文档、运行 prompt、调用 agent）、**Human in the loop**（审批）、内置控制与数据操作、**Connectors**。可用自然语言或可视化设计器创建，放在 solution 里支持版本与导入导出。计费按**每个动作消耗 Copilot Studio 容量**：从主题调用算一条 Classic answer + 流动作，生成式编排调用算一条 Autonomous action + 流动作；测试运行不计费；预付容量耗尽后新运行被阻止。已有 Power Automate 云流可一次性转换为 agent flow（改为消耗 Copilot Studio 容量，不可逆）。设计口诀：步骤明确、必须可重复的流程用 agent flow；开放式判断交给 agent。

来源：[Agent flows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview)、[Microsoft Copilot Studio overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio)

#### B1.16 Design prompt actions in Copilot Studio

Prompt 工具（旧称 prompt action）是**单轮、基于模型的 prompt**，可引用你提供的知识（如 Dataverse 数据）并能生成代码分析数据；在 Tools › Add a tool › Prompt 里写指令、选模型、用 **+ Add content** 定义输入参数，也可从 prompt 模板起步或用 Prompt assistant 帮写；内容审核级别可在 prompt 级单独设置。设计方法（模块以 Prompt Coach 模板为例）：按 **Goal / Context / Instructions-Rules / Examples / Output format** 分段，任务单一（转换、摘要、抽取、生成、分类各做一个 prompt 而不混合）、用祈使动词、加字数与必含字段等约束、禁止推测、少量但有效的示例、多种措辞测试、为治理留档。Prompt 可以嵌入主题、agent flow（作为动作前的推理步骤）、fallback 逻辑和业务流程。

> **考点** "需要在流程中把客户邮件分类为 billing / onboarding / support" → prompt 工具（classify）；"需要多步确定性操作" → agent flow 而不是 prompt。

来源：[Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent)、[Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)、[Design prompt actions in Copilot Studio](https://learn.microsoft.com/en-us/training/modules/design-ai-agents-business-solutions/18-design-prompt-actions-copilot-studio)

## B2. Design extensibility of AI solutions {#b2}

7 条 bullet，讲"怎么把 agent 做得可扩展"：Foundry 的自定义模型、Microsoft 365 Copilot 的 agent、Copilot Studio 的工具体系，以及三项新能力——MCP、Computer use、deep reasoning 与 voice——最后是 Teams 与 SharePoint 里的 agent。新考点集中在这里。

#### B2.1 Design AI solutions by using custom models in Microsoft Foundry

Foundry 为自定义模型提供端到端平台：**model catalog**（OpenAI、Anthropic、Meta、Mistral 等基础模型可 fine-tune）、训练与 fine-tuning 管道、嵌入 Foundry agent 与编排、负责任 AI 控制（内容过滤、安全评估、透明度）、部署拓扑（托管、私有网络、AKS）。设计步骤：定义可度量目标 → 评估专有数据集与治理许可 → 选路径（fine-tune 基础模型 / 训练领域小模型 / 与预置 Copilot 混合）→ 集成 Dynamics 365、Azure Functions、Azure AI Search、Foundry agent 工作流 → 场景化评估、安全与偏见分析、压力与延迟测试、ROI 验证。运营要素：监控漂移、**版本与回滚**、MLOps / GenAIOps 自动化、模型退役。权限细节常考：在 Foundry 里 **fine-tune 需要数据面与控制面权限**——只有 **Foundry Owner** 同时具备，或者 Foundry User（数据面）+ Foundry Account Owner（控制面）组合；Contributor 可以部署模型。

来源：[Design AI solutions with custom models in Microsoft Foundry](https://learn.microsoft.com/en-us/training/modules/design-extensibility-ai-solutions/2-design-ai-solutions-custom-models-microsoft-foundry)、[Fine-tune models with Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/fine-tuning-overview)、[Role-based access control for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/rbac-azure-ai-foundry)

#### B2.2 Design agents in Microsoft 365 Copilot

Microsoft 365 Copilot 的 agent 在 Teams、Outlook、Loop、SharePoint 和 Copilot Chat 里工作，设计框架是"定义核心问题 → 定义行为（角色、允许与禁止、护栏、升级条件）→ 连接数据与工具（Microsoft Graph、SharePoint / OneDrive / Teams 内容、Copilot connectors、自定义 API）→ 运营（监控、更新指令、访问控制、审计、版本化）"。**Agent Builder** 是最轻的构建方式：在 Copilot 应用（Work 与 Web 均可，不支持移动端）里用指令 + 知识源（SharePoint、Copilot connectors、网页）+ Code interpreter / Image generator 能力做 declarative agent，可先试用再分享或发布；**不支持集成外部服务的动作**——需要连接器、流或低代码动作时要把 agent **复制到 Copilot Studio**；不占用 Dataverse 存储、不支持 Customer Managed Keys、**不能用在 Teams 群聊或 1:1 聊天**；管理员在 Microsoft 365 admin center 的 Integrated Apps 控制可用性。pro-code 用 **Microsoft 365 Agents Toolkit**（declarative 或 custom engine）。

> **考点** "业务用户自己做一个按公司标准指导写作的助手" → Agent Builder；"该助手还要在 ServiceNow 开工单" → 复制到 Copilot Studio 加动作。

来源：[Compare declarative and custom engine agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agents-overview)、[Agent Builder overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder)、[Design agents in Microsoft 365 Copilot](https://learn.microsoft.com/en-us/training/modules/design-extensibility-ai-solutions/3-design-agents-microsoft-365-copilot)

#### B2.3 Design agent extensibility in Copilot Studio

Copilot Studio 的扩展点就是 **Tools**：**prebuilt connector**（上千个 Microsoft 与第三方 API）、**custom connector**（需对组织有 view 与 share 权限）、**agent flow**、**prompt**、**REST API**（选端点与方法）、**Model Context Protocol**、**Computer use**；类工具机制还有 Azure Bot Service skills 和 client tools（发事件让客户端执行）。生成式编排按工具的**名称与描述**决定何时调用并用 AI 填输入（可改为 Custom value 或 Power Fx），classic 模式只能从主题显式调用。每个工具可设置 **Allow agent to decide dynamically**、**Ask the end user before running**、认证（End user / Maker-provided）、完成后的回应方式（Don't respond / 生成式回应 / 固定回应 / Adaptive Card）。限制：生成式编排最多 **128 个工具**，建议 25–30，child agent 各自再有 128；被 DLP 屏蔽的工具在 Add tool 面板中灰显。模块把扩展分四层：指令级、技能级、集成级、以及 Visual Studio Code 的 pro-code 扩展。

来源：[Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent)、[Design extensible agents in Microsoft Copilot Studio](https://learn.microsoft.com/en-us/training/modules/design-extensibility-ai-solutions/4-design-agent-extensibility-copilot-studio)

#### B2.4 Design agent extensibility with Model Context Protocol in Copilot Studio

MCP 让 agent 直接连接已有的知识服务器与数据源。MCP 服务器发布三类东西：**Resources**（agent 可读的文件类数据）、**Tools**（可调用的函数）、**Prompts**（模板）——Copilot Studio 目前**支持 tools 和 resources**。服务器提供名称、描述、输入输出，服务器端增删工具时 Copilot Studio **动态同步**，一个服务器可承载多个工具。流程：用 MCP onboarding 向导连接现有服务器（没有就先创建）→ 把工具与资源加到 agent → 可选地把 MCP 连接器提交认证供跨租户使用。约束与治理：**必须开启生成式编排**；MCP 连接依赖 Power Platform 连接器，所以 **DLP 屏蔽 Power Platform 连接器也会屏蔽 MCP 工具**；连接到非微软 MCP 服务器时你对其工具负责。微软自家的 MCP 服务器（如 Dynamics 365 ERP MCP、Power Apps MCP server、Customer Service 的 CX MCP）也是通过这个入口接入。

> **考点** "研发部门已有一台包含产品规格的 MCP 服务器，低代码 agent 要回答规格问题" → 把 MCP 服务器作为工具加入 Copilot Studio agent，而不是重建知识库。

来源：[Extend your agent with Model Context Protocol](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp)、[Configure data policies for agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-data-loss-prevention)

#### B2.5 Design agents to automate tasks in apps and websites by using Computer Use in Copilot Studio

**Computer use** 是一个工具：agent 用虚拟鼠标键盘在一台 Windows 机器上操作网站和桌面应用（点按钮、选菜单、填字段），**没有 API 的系统也能自动化**，典型场景是数据录入、发票处理、数据抽取。底层是 Computer-Using Agent 类模型（OpenAI CUA、Claude Sonnet 4.5 等；Anthropic 模型需管理员开启外部模型访问），界面变化也能适应。配置项：名称、描述、模型、**自然语言指令**（写明完整 URL 与应用名、显式说明"提交无需确认"、复杂界面分步）、**Inputs**（每次运行不同的值）、**Machine**（在 Power Automate 管理）、**Credentials**（Maker-provided 适合自主 agent但共享 agent 时他人将以制作者身份操作；End user 要求每个用户有机器凭据）、**Human supervision**（检测到可能改变模型行为的有害指令时邮件通知审核人，超时停止）、**Stored credentials**（内部加密存储或 Azure Key Vault）、**Access control** 允许列表（只拦截操作、不拦截打开）、**Enforce HTTPS**。需生成式编排；最适合自主 agent，会话 agent 中会把推理与截图发到聊天。计费：每步 **5 Copilot Credits**，高级模型 15。安全建议：专用隔离机器、最小权限账号、Intune 限制网站、应用控制策略。

来源：[Automate web and desktop apps with computer use](https://learn.microsoft.com/en-us/microsoft-copilot-studio/computer-use)

#### B2.6 Design agent behaviors in Copilot Studio, including reasoning and voice mode

**Deep reasoning（preview）**：在 Settings 打开后，agent 自行判断哪些步骤值得用推理模型，或在指令里用关键词 **reason** 指定某一步（例如"use reason 给出最终推荐"）；用 **Azure OpenAI o3**，**只在美国和欧盟（不含英国）可用**，预览期**不承诺数据驻留**，响应更慢、消耗计费 Copilot Credits，Activity 页的活动图会显示 reasoning 节点。适用于多步分析、复杂业务规则、约束权衡；高频简单问答用标准推理即可。**Voice**：Copilot Studio 支持两类语音 agent——**basic voice agents**（classic 编排，NLU 做意图与实体、语音优化，可控）和 **real-time voice agents**（生成式编排，speech-to-speech 实时模型，低延迟、自然、支持打断与会话内切换语言）；都支持语音与 **DTMF** 输入、上下文变量、呼叫转接、语音定制；需要 Azure Communication Services 的电话号码，通常与 Dynamics 365 Contact Center 集成。语音设计原则：短句、确认步骤、处理打断、执行动作前做置信确认。

> **考点** "需要复杂的供应商评估推荐" → 开 deep reasoning 并在那一步写 reason；"数据必须留在英国" → 不能用 deep reasoning。

来源：[Add a deep reasoning model for complex tasks (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-reasoning-models)、[Use interactive voice response in your agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/voice-overview)、[Integrate a Copilot agent in Dynamics 365 Contact Center](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-bot-virtual-agent)

#### B2.7 Optimize solution design by using agents in Microsoft 365, including Teams and SharePoint

**SharePoint agents**：组织成员可直接在 SharePoint 站点、文件夹或文件上创建 agent，查询该范围内容，在 SharePoint 和 Teams 聊天中使用，按现有权限共享（只能分享到 Teams）；适合"站点知识助手""政策助手""站点管理员助手"模式，agent 自动知道所在站点并以其内容为主要 grounding。**Teams agents**：在频道与群聊中回答、总结、触发工作流，支持多人协作——注意 Agent Builder 做的 declarative agent 不能用于 Teams 群聊或 1:1 聊天，群组场景要用 Copilot Studio 发布到 Teams + Microsoft 365 渠道或 custom engine agent。优化要点：以 SharePoint 为主知识源并保持内容结构化、依赖 Microsoft Graph 的权限继承（agent 看不到用户看不到的内容）、提示简洁并善用元数据、把版本控制与 AI CoE 治理接上。管理员在 Microsoft 365 admin center 的 Copilot controls 设置 agent 访问、共享与发布策略（Agent Builder、SharePoint、Copilot Studio、Agents Toolkit 各有开关），Power Platform 侧可用 DLP 屏蔽 **Microsoft Teams + Microsoft 365 Channel** 或 **SharePoint channel** 连接器。

来源：[Optimize solution design for agents in Microsoft 365](https://learn.microsoft.com/en-us/training/modules/design-extensibility-ai-solutions/8-optimize-solution-design-agents-microsoft-365-teams-sharepoint)、[Agents admin guide for Microsoft 365](https://learn.microsoft.com/en-us/microsoft-365/copilot/agent-essentials/m365-agents-admin-guide)、[Agent Builder overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder)

## B3. Orchestrate configuration for prebuilt agents and apps {#b3}

7 条 bullet，考"现成的 AI 功能怎么开、怎么配、怎么组合"：Dynamics 365 财务供应链与客户体验两条线、Microsoft 365 的 agent、Copilot for Sales / Service、Power Platform 的 AI 功能，以及 finance and operations 应用内帮助的知识源扩展。题目爱考"在哪个管理中心、哪个开关"。

#### B3.1 Orchestrate AI features in Dynamics 365 apps for finance and supply chain

finance and operations apps 的 Copilot 有三种形态：**Sidecar**（侧边栏聊天，是主要界面，如 generative help and guidance、workflow history summary、Chat with finance and operations data）、**Embedded**（嵌在页面里，如 Confirmed purchase orders with changes 工作区、AI summaries、Collections coordinator summary、Customer page summary、Analyze demand plans、Workload insights）、**Outside**（外部 agent 跨应用编排）。共享能力包括 Immersive Home、**Agent management**（发现、配置、管理自主 agent，Finance 的 Account Reconciliation Agent、SCM 的 Supplier Communications Agent、Project Operations 的 Time Entry / Expense / Approvals Agent 多为 production ready preview）和 **Dynamics 365 ERP MCP server**（agent 不写代码就能做数据操作与业务逻辑）。编排要点：先启用 Power Platform Integration 让 Dataverse 承载 AI 服务；扩展走 client plugins（X++）、application context、自定义知识源；所有扩展保持模块化并遵守负责任 AI。

来源：[Overview of Copilot capabilities in finance and operations apps](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/fin-ops/copilot/copilot-for-finance-operations)、[Orchestrate AI features in Dynamics 365 Finance and Supply Chain](https://learn.microsoft.com/en-us/training/modules/orchestrate-configuration-prebuilt-agents-apps/2-orchestrate-ai-features-dynamics-365-apps-finance-supply-chain)

#### B3.2 Orchestrate AI features in Dynamics 365 apps for customer experience and service

Customer Service / Contact Center 的 AI 分三类：**Agent hub**（管理员与主管安全采用自主 agent、监控影响）、**自主服务 agent**（Customer Intent、Case Management、Customer Knowledge Management、Quality Evaluation）、**Copilot**（问答、写邮件、总结案例与对话，由 Microsoft 365 Copilot 驱动，含 Service Agent）。配置顺序：1. **Power Platform admin center › Copilot › Settings › Dynamics 365 Customer Service** 勾选 **Enable AI-powered Copilot features**；2. 若 Azure OpenAI 容量在租户区域外需先**允许跨区域数据移动**（美、澳、印、英、政府云默认 in-region，欧洲默认启用移动）；3. **Copilot Service admin center** 的 Copilot settings / Summaries 页 **Opt in**；4. 通过 **experience profiles** 控制哪些客服能用哪些功能（Customer Service Hub 则对所有人开放）；5. 在 **Customer Support** agent 设置里配置 Immersive、Email、Prompts、Extend agent，可选 **Admin Management** agent；6. 自定义角色需 `prvIntelligenceUsage` 和 Copilot 相关表的权限。可开启翻译、记录客服与 Copilot 的互动转录用于分析。

> **考点** 先 PPAC 开总开关、再 admin center opt in，顺序颠倒就不工作；"只让一部分客服用 Copilot" → 自定义 experience profile。

来源：[Manage Copilot features in Customer Service](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-copilot-features)、[Design AI solutions for Dynamics 365 Customer Service](https://learn.microsoft.com/en-us/training/modules/orchestrate-configuration-prebuilt-agents-apps/3-design-ai-solutions-dynamics-365-apps-customer-experience-service)

#### B3.3 Propose Microsoft 365 agents for business scenarios

模块的方法论是"把 agent 当产品而不是 prompt"：有明确任务与边界、grounding 数据与工具、运营护栏（身份、授权、DLP、可审查）、可遥测的结果。提案前过**准备清单**：业务价值与负责人、运行身份（用户 / 应用 / 服务）、数据范围与敏感标签、工具与审批点、DLP 与审计、版本与回滚、遥测、支持与伦理评审；设计五步：框定要完成的工作 → 映射输入知识动作 → 定义护栏 → 原型关键路径 → 运营化。要引用 **Agent Management Essentials**（Prerequisites、Blueprint、Checklist、Visual Guide、Admin Guide、FAQ）和许可成本。管理面：Microsoft 365 admin center 的 Copilot controls 设置 agent 访问、共享与发布；Researcher 与 Analyst 预装；三种许可场景——Copilot Chat 无计费 agent、Copilot Chat 按用量计费（需 Copilot Studio 订阅）、Microsoft 365 Copilot 授权。起始 KPI：周活 ≥30% 目标人群、首次输出人工接受率 ≥70%、每任务时间节省 ≥25%、每千次运行策略违规 ≤1。

来源：[Propose Microsoft 365 agents for business scenarios](https://learn.microsoft.com/en-us/training/modules/orchestrate-configuration-prebuilt-agents-apps/4-propose-microsoft-365-agents-business-scenarios)、[Agents admin guide for Microsoft 365](https://learn.microsoft.com/en-us/microsoft-365/copilot/agent-essentials/m365-agents-admin-guide)

#### B3.4 Orchestrate the configuration of Microsoft 365 Copilot for Sales and Microsoft 365 Copilot for Service

两者现在都是 Microsoft 365 Copilot 里的角色型 agent。**Sales agent**（文档仍在 microsoft-sales-copilot 路径）：把 CRM 洞察带进 Outlook 与 Teams（邮件起草、会议洞察、下一步建议），CRM 可以是 **Dynamics 365 Sales 或 Salesforce**；由 **Microsoft 365 管理员**安装与设置，Dynamics 365 侧管理员需 System Administrator / System Customizer，用户需 Sales Manager / Salesperson 角色（自定义角色要补权限）；不支持 on-premises，也不支持 GCC。**Service Agent**（GA；旧称 Copilot for Service 的文档已重定向）：在 Microsoft 365 Copilot、**Copilot Service workspace** 以及任何启用 Copilot 的 Dynamics 365 / Power Apps 应用中帮客服查、总结、更新 Customer Service 的案例与客户信息，可做案例写操作、起草知识文章与邮件、给出 SLA 风险与下一步；配置是两个独立任务——**Microsoft 365 管理员**安装并分配 Service app（有 Customer Service 许可时自动安装），**Dynamics 365 管理员**把 Microsoft Copilot 加到 Customer Service 环境；工具可用性受 Dataverse 权限约束，可用 Copilot Studio agent 与 MCP 工具扩展；数据可能流出 Dynamics 365 合规边界需自行评估。

来源：[Welcome to Sales agent](https://learn.microsoft.com/en-us/microsoft-sales-copilot/introduction)、[Use Service Agent in Customer Service](https://learn.microsoft.com/en-us/dynamics365/customer-service/use/use-service-agent)、[Enable Service Agent in Microsoft Copilot](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-service-agent)

#### B3.5 Propose Microsoft Power Platform AI features, including AI hub

Power Platform 的 AI 功能四块：**AI hub**（Power Apps 与 Power Automate 左侧导航里的统一入口，集中管理 AI prompts、AI models 和 document automation，目的是在受治理的环境里集中发现与编排 AI）、**AI Builder**（预置模型：文档处理、物体检测、分类、情感、名片、收据 / 发票；自定义模型：预测、分类、实体抽取；用 AI Builder credits，要规划训练验证、漂移监控与重训）、**Copilot in Power Apps / Power Automate / Power Pages**（自然语言生成应用、表、流、页面）、**Copilot Studio**（会话 agent）。治理面在 Power Platform admin center 的 **Copilot hub**：用量与 Copilot 采用趋势、按产品的设置、**pay-as-you-go Copilot credit 上限**。

| 场景 | 推荐 |
|---|---|
| 从邮件附件抽取结构化数据、预测流失 | AI Builder（AI hub 里管理） |
| 生成可复用的文本处理 prompt 给流与 agent 用 | AI prompts |
| 用自然语言生成流或应用 | Copilot in Power Automate / Power Apps |
| 多轮对话、知识问答、自动化 | Copilot Studio |

来源：[Propose Microsoft Power Platform AI features](https://learn.microsoft.com/en-us/training/modules/orchestrate-configuration-prebuilt-agents-apps/6-propose-microsoft-power-platform-ai-features-ai-hub)、[Security and governance (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance)、[Copilot in Power Apps overview](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/ai-overview)

#### B3.6 Design interoperability of the finance and operations agent chats to use additional knowledge sources

F&O 的侧边栏帮助由 Copilot Studio 里名为 **Copilot for finance and operations apps** 的 agent 提供，内置的 **conversational boosting** 主题用 generative answers 回答，默认知识**仅限已发布的产品文档**（并尊重用户语言）。要让它回答公司自己的流程问题，有两条路：**上传 PDF / RTF / Word 文件**作为知识源（最简单）；若要 SharePoint 等其他类型，必须在该 agent 里**自建主题**。限制：**不支持从 F&O 发布的 Dataverse virtual entities 作知识源**；boosting 主题假定所有知识都与产品使用相关，加无关内容会污染回答；知识量受知识源类型的上限约束。可选打开 **AI general knowledge**（默认关闭）让它在用尽自定义知识后用模型常识与 Bing 回答，但会增加错误内容风险。更深的互操作用 **Copilot client plugins**（自定义动作、外部系统、业务逻辑）和 application context；设计时把业务问题映射到知识源：信用额度 → F&O 数据，合规证书 → SharePoint，更新付款条件 → plugin 动作。

来源：[Add knowledge to generative help and guidance with Copilot](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/copilot/extend-copilot-generative-help)、[Design interoperable agent experiences for Finance and Operations](https://learn.microsoft.com/en-us/training/modules/orchestrate-configuration-prebuilt-agents-apps/7-design-interoperability-finance-operations-agent-chats-sources)

#### B3.7 Recommend the process of adding knowledge sources to in-app help and guidance for Dynamics 365 Finance or Dynamics 365 Supply Chain Management apps

推荐流程五步：1. **准备知识**——验证准确性与业务流程一致、内容只与 Finance / SCM 任务相关、统一术语、加敏感标签；2. **在 Copilot Studio 摄取**——选择与 F&O 环境关联的 Dataverse 环境 → Agents → 打开 *Copilot for finance and operations apps* → Knowledge 页 **Add knowledge** → Upload files → 等状态变为 **Ready**；3. **测试**——用场景化问题验证回答来自新知识且无关知识不干扰；4. **发布**——选择 **Publish**，用户需关闭并重开 Copilot 会话才看到新知识；5. **治理维护**——版本控制与退役、标签与 DLP、季度或随发布波次复审、每个 release wave 后回归测试。是否开启 general knowledge：对监管或财务精度要求高的场景保持关闭。

> **考点** 题目问"在哪里给 F&O 的应用内帮助加公司 SOP" → Copilot Studio 里的 Copilot for finance and operations apps agent 上传文件并发布，不是 LCS 也不是 Feature management。

来源：[Add knowledge to generative help and guidance with Copilot](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/copilot/extend-copilot-generative-help)、[Recommend process knowledge sources for in-app help in Dynamics 365](https://learn.microsoft.com/en-us/training/modules/orchestrate-configuration-prebuilt-agents-apps/8-process-knowledge-sources-dynamics-365-finance-supply-chain-management)

## C1. Analyze, monitor, and tune AI-powered business solutions {#c1}

Deploy 板块从这里开始。五条 bullet 围绕一个闭环：选监控工具 → 分析积压与反馈 → 用 AI 工具找问题 → 看指标 → 读遥测调优。产品面是 Copilot Studio 的 Monitor 页、Application Insights、Foundry 的 observability 与 Control Plane，以及 Power Platform admin center 的 Copilot hub。

#### C1.1 Recommend the process and tools required for monitoring agents

流程上，模块要求先建**监控运营模型**（角色、事件响应流程、标准化指标基线、日志复查节奏、变更与版本追踪）、设**阈值告警**（延迟、异常量、异常 prompt 激增）、做**定期质量评估**（人工抽检、低置信输出复查）并把洞察回流到 prompt 与知识改进。工具按层选：**Copilot Studio Monitor 页**（指标保留 360 天，会话详情与转录 28 天，UTC 时间，可用 Analytics Viewer 角色只读共享）；**Azure Application Insights**（在 agent Settings › Advanced 填连接字符串，可选记录对话详情、敏感属性、节点执行事件；内置 **Copilot Studio Dashboard** workbook 汇总会话量、延迟、异常、工具用量；管理员可用 DLP 屏蔽该连接器）；**Microsoft Foundry observability**（evaluation、monitoring、tracing 三件套，基于 OpenTelemetry 与 Application Insights）与 **Foundry Control Plane**（跨项目的 agent 清单、错误率、token 成本、运行数、trace，可启停或屏蔽 agent）；**Power Platform admin center Copilot hub**（用量、credits）；Purview 审计。

> **考点** "需要跨多个 Foundry 项目统一看 agent 健康与成本" → Foundry Control Plane；"要做 KQL 自定义诊断" → Application Insights。

来源：[Monitor overview (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-overview)、[Agent-level telemetry with Application Insights](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-bot-framework-composer-capture-telemetry)、[Observability in Generative AI (Microsoft Foundry)](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/observability)、[Manage agents at scale in Microsoft Foundry Control Plane](https://learn.microsoft.com/en-us/azure/ai-foundry/control-plane/how-to-manage-agents)

#### C1.2 Analyze backlog and user feedback of AI and agent usage

反馈来源：**Reactions**（用户对每条回复的 thumbs up / down 和评论，默认所有渠道开启，Monitor 页保留 28 天；查看评论需 **Bot Transcript Viewer** 角色；发布到 Microsoft Copilot 渠道的 agent 需要在 Microsoft 365 admin center 同意共享反馈）、**Customer satisfaction**（会话结束调查的 CSAT，1–2 不满意、3 中立、4–5 满意）、**Sentiment**（预览，AI 分析负面会话比例）、**customer comments summary** 与 AI **Summary** 卡、**Themes**（把触发生成式回答的问题聚类）、Dataverse 中的对话转录（29 天内可下载）。积压分析框架：按**领域分类**（准确性与推理、知识、性能、UX、集成、治理）→ 用**影响 / 工作量矩阵**排优先级 → 看反馈的频率、严重度、情感与期望落差 → 从转录中提取失败路径并映射根因 → 形成改进发布并在上线后验证。向利益相关方汇报主题、计划、用量变化与风险。

来源：[Monitor conversational agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-improve-agent-effectiveness)、[Measure and improve agent performance with KPIs and analytics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/analytics)、[Analyze backlog and user feedback for AI agent usage](https://learn.microsoft.com/en-us/training/modules/analyze-monitor-tune-ai-powered-business-solutions/3-analyze-backlog-user-feedback-ai-agent-usage)

#### C1.3 Apply AI-based tools to analyze and identify issues and perform tuning

"AI 分析 AI"的工具：Copilot Studio Monitor 页的 **Summary**（AI 生成的关键洞察）、**Themes**、**Generated answer rate and quality**（AI 对样本回答按完整性、相关性、groundedness 标 Good / Poor 并给出 Poor 的原因分布，可下钻到问题）、**Custom metrics**（用自然语言定义最多 3 个业务指标，AI 对抽样会话判定并给理由）；**Copilot Agent Kit** 的 Conversation Analyzer（用自定义 prompt 分析转录）、Agent Debugger（逐步诊断回复如何产生）、Agent Review Tool（扫描反模式）、Agent Insights Hub；**Foundry** 的 evaluations 加 **cluster analysis**（把失败用例聚类）与 **AI Red Teaming Agent**。调优分层：**知识调优**（补缺、删旧、重构）、**行为调优**（改指令与编排、加 fallback）、**性能调优**（精简连接器调用与步骤）、**治理对齐调优**（DLP、标签、角色）。Copilot Studio 的 evaluation-driven triage 框架专门处理"评估集低于阈值 / 单个用例失败 / 一处改进另一处回退"的情况。

| 问题主题 | 可能原因 | 调优 |
|---|---|---|
| 回答错误 | 知识缺口 | 增补 / 更新内容 |
| 执行慢 | 工作流过于复杂 | 精简步骤 |
| 动作被阻止 | 治理策略 | 调整角色 / 标签 |
| 行为异常 | 模型逻辑 | 细化指令 |

来源：[Monitor conversational agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-improve-agent-effectiveness)、[Copilot Agent Kit overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/kit-overview)、[Improve agents using evaluation-driven triage and remediation](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/evaluation-triage-overview)、[Observability in Generative AI (Microsoft Foundry)](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/observability)

#### C1.4 Monitor agent performance and metrics

必须背的定义来自 Copilot Studio 的 Monitor 页。会话先是 **Unengaged**，触发自定义主题、Escalate、Fallback、Conversational boosting（classic）或知识源 / 工具 / 非系统主题（生成式）后变为 **Engaged**；**Engagement rate** 低说明主题覆盖不足。结果三类：**Resolved**（*confirmed*：End of Conversation 主题触发且用户确认；*implied*：超时但逻辑判定已解决）、**Escalated**（*System intended* 业务规则自动升级、*System unintended* 超过失败阈值、*User requested* 用户要求转人工）、**Abandoned**（engaged 会话 30 分钟超时且未解决未升级）。其他指标：**CSAT** 五分制、**DAU / MAU**（需 agent 要求认证）、**Tool use** 调用量与成功率、**Knowledge source use** 与错误率、子 / 连接 agent 的调用量与成功率、**Savings**、计费 credits。自主 agent 另有基于触发运行的健康分析。月度优化关注 **deflection rate、resolution rate、engagement rate、低解决率主题、未识别话语、按渠道差异**。

> **考点** "想知道多少会话被放弃 vs 已解决以判断 credits 是否浪费" → Conversation outcomes；"用户主动说转人工算哪类" → Escalated – User requested。

来源：[Monitor conversational agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-improve-agent-effectiveness)、[Measure and improve agent performance with KPIs and analytics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/analytics)

#### C1.5 Interpret telemetry data for performance and model tuning

遥测分四类信号：**运营**（延迟、吞吐、错误率、限流）、**模型级**（token 用量与成本、回答一致性、漂移）、**行为**（完成率、放弃率、prompt 模式）、**治理**（护栏触发、被阻止的动作、标签冲突）。Application Insights 里 Copilot Studio 事件在 `customEvents` 表，`customDimensions` 带 `type`、`channelId`、`text`、`designMode` 等字段——用 `designMode == "False"` 排除测试会话，`dcount(user_Id)` 统计活跃用户（只在认证场景准确）；开启 node execution events 可追到主题节点级。Foundry 的 tracing 用 OpenTelemetry 记录 LLM 调用、工具调用、agent 决策和跨服务依赖，用于定位延迟热点与多步推理链。解读规则（模块的信号图）：**延迟上升** → 模型过载或连接器慢，优化流程或缓存；**token 激增** → 输出冗长或 prompt 不清，改 prompt 模式；**错误尖峰** → 集成 / API 故障，核对依赖；**质量下降** → 模型漂移或缺上下文，更新知识源；**护栏频繁触发** → 策略冲突，调治理规则。诊断流程：看基线 → 找异常 → 关联信号 → 定根因（模型 / 集成 / prompt）→ 定向调优 → 前后对比验证。

来源：[Agent-level telemetry with Application Insights](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-bot-framework-composer-capture-telemetry)、[Observability in Generative AI (Microsoft Foundry)](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/observability)、[Interpret telemetry data to tune AI performance](https://learn.microsoft.com/en-us/training/modules/analyze-monitor-tune-ai-powered-business-solutions/6-interpret-telemetry-data-performance-model-tuning)

## C2. Manage the testing of AI-powered business solutions {#c2}

五条 bullet：agent 测试流程与指标、自定义模型验证标准、Copilot prompt 最佳实践验证、跨 Dynamics 365 应用的端到端测试、用 Copilot 生成测试用例。工具名要记准：Copilot Studio 的 evaluations（test sets）、Copilot Agent Kit、Foundry 的 built-in evaluators、Dynamics 365 实施指南的测试策略。

#### C2.1 Recommend the process and metrics to test agents

Copilot Studio 实施指南的测试类型表：**development time**（组件单元测试）、**core scenario**（happy path）、**knowledge**（领域问题）、**regression**、**adversarial**（边界、未知意图、虚假信息）、**performance and load**、**security and compliance**（RBAC、条件访问、敏感标签、无数据泄露）、**accessibility and UX**；原则是 shift-left、持续迭代、上线前在 staging 验证、尽量自动化进 CI/CD。工具：Copilot Studio 内置 **evaluations**——建 **test set**（手工写、从指令 / 能力 / 知识生成、或从过去测试对话填充），评估方法有 **Text match**、**Similarity**、**Quality**（相关性、groundedness、完整性、abstention，或与期望答案的意图相似度）；**Copilot Agent Kit** 批量测试（response match、topic match、multi-turn，支持 rubrics），并可借 Power Platform pipelines 在部署前自动跑测试。Foundry 侧用 **built-in evaluators**：质量（coherence、fluency）、RAG（groundedness、relevance、retrieval）、安全（hate、violence、indirect attack）、agent 专用（intent resolution、tool call accuracy、task adherence、task completion）。指标：准确率 / 相关性、响应时间、成功率、失败率、token 效率、满意度、知识覆盖、稳定性、护栏合规。

来源：[Design a testing strategy for your agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/sec-gov-phase4)、[Copilot Agent Kit overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/kit-overview)、[Built-in evaluators reference (Microsoft Foundry)](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/built-in-evaluators)

#### C2.2 Create validation criteria of custom AI models

验证标准分五类并给出可量化阈值：**性能**（延迟如 <2 秒、吞吐 p95 稳定）、**质量**（准确率 ≥90%、错误信息率 ≤3%、相关性与完整性、推理一致性、grounding 完整性）、**安全合规**（护栏违规 0、敏感输出 100% 拦截、RBAC 与 DLP 生效、可审计、高风险流程人工复核）、**成本效率**（token 用量不高于基线）、**用户体验**（满意度 ≥4.5/5）；再加漂移指标与运营验证（可扩展、韧性、集成可靠、遥测充足）。Foundry 把这些变成可执行的 evaluator：**Groundedness**（1–5 分，模型判定）与 **Groundedness Pro**（Content Safety 二值通过 / 失败，不需模型部署）、**Relevance**、**Response Completeness**、文本相似度（Similarity、F1、BLEU、ROUGE、METEOR）、风险与安全（Hate and Unfairness、Sexual、Violence、Self-Harm、Protected Materials、Indirect Attack、Code Vulnerability、Ungrounded Attributes）、agent 类（Task Adherence、Tool Call Accuracy、Intent Resolution），以及 Rubric 与自定义 evaluator。模型选型阶段用 Foundry benchmark 比较基础模型，预生产跑评估集与红队，生产后持续评估抽样流量。

> **考点** "没有模型部署也要判断回答是否有依据" → Groundedness Pro；"检验翻译 / 摘要与参考答案的 n-gram 重合" → BLEU / ROUGE。

来源：[Create validation criteria for custom AI models](https://learn.microsoft.com/en-us/training/modules/manage-testing-ai-powered-business-solutions/3-create-validation-criteria-custom-ai-models)、[Built-in evaluators reference (Microsoft Foundry)](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/built-in-evaluators)、[Observability in Generative AI (Microsoft Foundry)](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/observability)

#### C2.3 Validate effective Copilot prompt best practices

把 prompt 当"可重复的系统组件"而不是一次性指令来验证。核心要素：**Goal、Context、Instructions（格式、语气、约束）、Examples（只在增加清晰度时用）**。验证步骤：定义"好结果"长什么样 → 检查清晰度（"两个不同用户会不会理解成同一件事"）→ 检查 grounding（是否明确指向来源、域、文件）→ 检查约束（语气、长度、格式、排除项、角色、受众）→ 安全（不会误触敏感操作）→ 多场景多措辞测试。方法：**A/B 测试**两版 prompt 比准确性、清晰度、相关性和后续追问次数；按用户类型与任务复杂度做场景测试；结构化清单。指标：准确性、一致性（重复运行稳定）、相关性、格式合规、语气匹配，以及用户重新提问次数与澄清请求的下降。推荐模式：goal + context + constraints 顺序、动作动词、结构化指令、避免多任务混合、必要时写"不要包含什么"。Foundry 的通用原则（具体、顺序、给出口、带引用）同样适用；Copilot Agent Kit 的 Prompt Advisor 可自动给出优化建议。

来源：[Validate effective Copilot prompt best practices](https://learn.microsoft.com/en-us/training/modules/manage-testing-ai-powered-business-solutions/4-validate-effective-copilot-prompt-best-practices)、[Prompt engineering techniques (Microsoft Foundry)](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/prompt-engineering)、[Copilot Agent Kit overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/kit-overview)

#### C2.4 Design end-to-end test scenarios of AI solutions that use multiple Dynamics 365 apps

端到端测试要验证**整条业务流程**而不是单个模块，典型是 **Order-to-Cash**（Sales → Finance → Customer Service）和 **Case-to-Resolution**（Customer Service → Field Service）。设计：定义触发事件、应用交互顺序、每阶段预期结果与 AI 动作；盘点**集成点**（实体同步如 Account / Order / Case / Journal、依赖多应用数据的 AI 预测、Power Automate 与插件自动化、外部连接器、安全角色与数据边界）；写出前置条件、步骤、AI 触发、跨应用数据流、后置校验和异常路径；用例要含结构化与非结构化数据、多种措辞、正常与压力负载、监管约束。指标分功能（AI 正确触发、取自正确应用、流程不中断）、非功能（跨应用延迟、错误恢复、推荐一致性）与结果（相关性、评分正确、摘要准确、任务时间缩短）。Dynamics 365 实施指南补充：测试范围要覆盖功能与非功能需求（性能、可用性、灾备），类型有单元、集成、系统、UAT、回归，用例始终挂到业务流程，最后一轮含 **mock cutover** 并由业务签字。注意 **Power Apps Test Engine 已于 2026 年 4 月弃用**，UI 自动化建议直接用 Playwright（Power Platform Playwright samples）。

来源：[Design end-to-end test scenarios for AI solutions using multiple Dynamics 365 apps](https://learn.microsoft.com/en-us/training/modules/manage-testing-ai-powered-business-solutions/5-design-test-scenarios-ai-solutions-multiple-dynamics-365-apps)、[Test your Dynamics 365 solution before deployment](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/testing-strategy)、[Power Apps Test Engine overview](https://learn.microsoft.com/en-us/power-apps/developer/test-engine/overview)

#### C2.5 Build the strategy for creating test cases by using Copilot

策略先于工具：先定测试目标（单元、集成、回归、场景；要验证的业务规则与合规要求），再建**测试用例蓝图**（Test ID、目的、前置条件、输入、步骤、预期结果、边界变体、依赖），把蓝图放进 prompt 让 Copilot 产出结构一致的用例；prompt 模式是 Goal + Context（业务规则、代码、流程）+ Constraints（格式、粒度、"每场景至少两个负向测试"）+ Quality expectations。生成后由架构师审查**完整性**（覆盖所有验收标准与失败条件）、**准确性**（符合业务规则）、**清晰度**、**可维护性**，再把 prompt 与模板纳入版本控制、接进 CI/CD、需求变更时触发重新生成。产品侧的 Copilot 能力：Copilot Studio 的 evaluations 可**从 agent 的指令、能力、知识自动生成测试问题**，或从过去的测试对话填充；Copilot Agent Kit 用 rubrics 迭代评分标准；GitHub Copilot 写单元测试。成熟度从临时 prompt → 标准模板 → 自动化 pipeline → 风险驱动的持续再生成 → 企业级 prompt 治理。

来源：[Build a strategy for creating test cases using Copilot](https://learn.microsoft.com/en-us/training/modules/manage-testing-ai-powered-business-solutions/6-build-strategy-creating-test-cases-using-copilot)、[Design a testing strategy for your agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/sec-gov-phase4)、[Copilot Agent Kit overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/kit-overview)

## C3. Design the ALM process for AI-powered business solutions {#c3}

六条 bullet，本次 Minor 更新的变更点之一（新增 Foundry Agent Service 的 ALM）。考法是"某组件怎么从 Dev 推到 Prod、哪些东西不随 solution 走、门禁放在哪"。记住 Power Platform 的 ALM 三件套：solution、environment variable、connection reference，再加 pipelines / Azure DevOps / GitHub。

#### C3.1 Design the ALM process for data used in AI models and agents

把"数据"当成可版本化、可晋级的 ALM 工件：训练与 fine-tuning 数据集、评估用的 **golden set**、grounding 语料（SharePoint、Dataverse、知识库）、prompt 资产、策略与护栏（DLP、标签、允许的连接器）、运行遥测与反馈。环境策略 Dev → Test → PreProd → Prod 各有独立数据面，用 **red（可变实验）/ gold（冻结已晋级）** 数据集模式；每个晋级门禁要证据：目录与负责人、质量与 lineage 报告、评估阈值与安全报告、驻留与 DLP 合规、可监控可回滚。两条产品级事实常被忽略：**Power Platform pipelines 只部署 solution、连接、connection reference 与 environment variable，不搬 Dataverse 表里的数据**；Copilot Studio 里 OneDrive / SharePoint 上传、Salesforce、ServiceNow 等**非结构化知识源不支持 ALM**，导入 agent 后不会自动处理知识，需在目标环境重新添加。跨区域数据移动要在门禁里显式记录决策。

来源：[Design an ALM process for data used in AI models and agents](https://learn.microsoft.com/en-us/training/modules/design-alm-process-ai-powered-business-solutions/2-design-alm-process-data-used-ai-models-agents)、[Overview of pipelines in Power Platform](https://learn.microsoft.com/en-us/power-platform/alm/pipelines)、[Quotas and limits (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-quotas)

#### C3.2 Design the ALM process for Copilot Studio agents, connectors, and actions

Copilot Studio agent 创建时落在默认 solution，要跨环境必须建**自定义 solution**（Copilot Studio 内置 solution explorer，权限随用户的安全角色）；至少三套环境（Dev 为 sandbox 且唯一可定制处，Test / Prod 用**managed solution**，Prod 设为 production 类型并用 Entra 安全组限制访问）。黄金规则：只在 Dev 定制、始终在 solution 上下文工作、自定义 publisher 前缀、**environment variables** 放跨环境变化的设置与机密、**connection references** 放连接、非 Dev 一律 managed、尽量自动化。部署工具三选一：**Pipelines in Power Platform**（分钟级配置、审批式 delegated deployment、自动保存 managed 与 unmanaged 包、可重新部署旧版本、同一工件顺序经过各阶段不可绕过 QA）、**Azure DevOps**（Build Tools、Git 集成）、**GitHub Actions**。**不随 solution 走的项**要在下游补做：Application Insights 设置、手动认证设置、Direct Line / Web 渠道安全、已部署的渠道、共享。**component collections** 让多个 agent 复用主题 / 知识 / 动作并独立发布节奏；连接到 Customer Service 的 managed agent 若出现"无法判断 Dynamics 365 集成是否启用"的提示，重新导入最新版本并**移除 unmanaged layer**。

> **考点** "Dev1 的 agent 导入 Prod1 后连接器要重新授权" → connection references；"每次改设置都要改导出包" → environment variables；"想让业务人员自己点几下就部署" → pipelines。

来源：[Establish an Application Lifecycle Management (ALM) strategy](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/alm)、[Create and manage custom solutions (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-overview)、[Overview of pipelines in Power Platform](https://learn.microsoft.com/en-us/power-platform/alm/pipelines)

#### C3.3 Design the ALM process for Microsoft Foundry Agents Service

Foundry 的 agent 生命周期：选 agent 类型（**prompt-based**、voice-based prompt、**hosted** 容器化 agent）→ 在 playground 或代码里创建测试 → 加工具与数据（工具必须配置成功才能保存）→ **保存为版本** → 用 **tracing** 调试 → **evaluation** 做质量与安全门禁 → 发布为 **agent application**（稳定端点）→ 监控迭代。版本机制是 ALM 核心：每个版本**不可变**，代码里用 `<agent_name>:<version>` 引用，可把请求定向到特定版本实现受控发布与回滚，版本历史可对比**配置、聊天输出、YAML 定义**；用 get-or-create 模式缓存 agent ID，404 视为已删除。发布后**项目身份的权限不会自动转移到 agent application 身份**，要重新授权且遵循最小权限，机密放 Key Vault connection。**Foundry Control Plane** 提供跨项目 agent 清单（版本、是否已发布、错误率、token 成本、Entra Agent ID）、start / stop（hosted 与已发布 agent）、block（自定义 agent）。模块把它映射到 Dev → Test → Prod 环境、版本化工件与两道晋级门禁（功能与安全校验；回归、合规、性能成本、人工验证）。

> **考点** "需要在不影响生产的情况下测试新指令" → 保存新版本并评估，生产继续指向旧版本；"发布后 agent 调工具 403" → 给 agent application 身份重新授权。

来源：[Agent development lifecycle in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/development-lifecycle)、[Manage agents at scale in Microsoft Foundry Control Plane](https://learn.microsoft.com/en-us/azure/ai-foundry/control-plane/how-to-manage-agents)、[Design ALM processes for Microsoft Foundry agents](https://learn.microsoft.com/en-us/training/modules/design-alm-process-ai-powered-business-solutions/4-design-alm-process-microsoft-foundry-agents)

#### C3.4 Design the ALM process for custom AI models

自定义模型的生命周期：Plan & Design（用例、成功标准、限制与失败路径）→ Data Preparation（数据契约、curated 训练集、golden 评估集、版本化管道）→ Model Development（fine-tune 或 BYOM，记录超参、训练数据版本、环境快照）→ Evaluation & Approval（准确性、安全、成本 token、延迟；产出 **Model Card**）→ Deployment（模型注册表版本锁定与回滚、访问控制、运行审计）→ Monitor & Optimize（延迟、错误、安全拦截、满意度、漂移 → 触发重训）→ Retirement（归档数据与评估日志、过渡计划）。两道门禁：Dev → Test 要数据质量、安全偏见测试、文档；Test → Prod 要性能超基线、成本延迟达标、安全合规审批、回滚方案。Foundry 侧的现实约束：fine-tuning 数据从 50–100 条到生产 500+ 并切分训练 / 验证；部署 fine-tuned 模型是控制面权限（Foundry Owner 或 User + Account Owner）；基础模型有自己的退役节奏，选择 **Auto-update** 的部署（包括 model router）会随新版本变化影响表现与成本，生产应锁定版本并在重训后重新评估。

来源：[Design an ALM process for custom AI models](https://learn.microsoft.com/en-us/training/modules/design-alm-process-ai-powered-business-solutions/5-design-alm-process-custom-ai-models)、[Fine-tune models with Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/fine-tuning-overview)、[Model router for Microsoft Foundry concepts](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/model-router)

#### C3.5 Design the ALM process for AI in Dynamics 365 apps for finance and supply chain

F&O 的 AI 资产分三类，ALM 路径不同：**应用内 AI 功能与 agent**（Copilot 功能、Agent management 里的 agent）靠 Feature management 与 Power Platform Integration 在各环境开启；**X++ 扩展**（client plugins、application context、自定义动作）走 F&O 的版本控制与 deployable package；**Copilot Studio 里的 agent 配置**（Copilot for finance and operations apps 的知识源、general knowledge 开关、自定义主题）在与 F&O 环境关联的 Dataverse 环境里编辑并**发布**，知识文件要按环境分别上传与发布。模块的要求：Dev / Test / Prod 分离且禁止直接改生产、用 environment variables 放端点与模型名、Test 用匿名化或合成数据、数据契约定义财务实体与敏感标签、prompt 使用 ERP 术语（vendor、ledger、work order）并做场景测试；门禁含准确性与稳定性阈值、无偏见输出、ERP 负载下性能、安全合规与数据驻留审查；发布包含模型 / prompt 版本、环境变量配置、评估结果、回退计划、监控仪表板；对过账日记账、审批采购单等关键流程设护栏。

来源：[Design an ALM process for AI in Dynamics 365 Finance and Supply Chain](https://learn.microsoft.com/en-us/training/modules/design-alm-process-ai-powered-business-solutions/6-design-alm-process-ai-dynamics-365-apps-finance-supply-chain)、[Overview of Copilot capabilities in finance and operations apps](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/fin-ops/copilot/copilot-for-finance-operations)、[Add knowledge to generative help and guidance with Copilot](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/copilot/extend-copilot-generative-help)

#### C3.6 Design the ALM process for AI in Dynamics 365 apps for customer experience and service

客户体验类应用的 AI 资产：Copilot prompt 与 agent 行为、知识源与索引配置、摘要字段映射、AI 动作用的 Power Automate 流与插件、路由与上下文规则、环境变量（端点、索引引用）。推荐四级环境 DEV → TEST → UAT/PREPROD → PROD，七步流程：定义用例与数据边界 → 准备数据与知识（与 Customer Service 知识库实体对齐）→ 配置 AI 逻辑 → **把 agent、prompt、流、数据契约打进 solution 并语义化版本** → 跨环境验证（多轮场景、匿名化真实案例、泄露与偏见测试）→ 用 Azure DevOps / GitHub Actions 部署 managed solution → 监控调优。产品侧对应：Sales 的 Copilot 自定义（主题、glossary、prompt guide）在 Copilot Studio 中做并**用 solution 管理以便跨环境部署**；接入 Customer Service 的 Copilot Studio agent 必须与 Customer Service 在同一环境，导入 managed 版本后若有 unmanaged layer 要移除；Customer Service 的 Copilot 开关、experience profile、摘要配置属于管理中心配置，需在每个环境重新开启与 opt in。治理上要有 CAB 评审高风险发布、prompt 版本与决策日志、DLP 与标签跨环境一致。

来源：[Design ALM processes for AI in Dynamics 365 apps](https://learn.microsoft.com/en-us/training/modules/design-alm-process-ai-powered-business-solutions/7-design-alm-process-ai-dynamics-365-apps-customer-experience-service)、[Customize Copilot in Dynamics 365 Sales](https://learn.microsoft.com/en-us/dynamics365/sales/extend-copilot-chat)、[Configure handoff to Dynamics 365 Customer Service](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-hand-off-omnichannel)

## C4. Design responsible AI, security, governance, risk management, and compliance {#c4}

八条 bullet，Deploy 板块的另一半。按"身份与安全 → 治理 → 模型安全 → 漏洞与 prompt 操纵 → 负责任 AI → 数据驻留 → 访问控制 → 审计"排列。产品词：Microsoft Entra Agent ID、Power Platform 数据策略（DLP）、Purview、Prompt Shields、AI Red Teaming Agent、Move data across regions、Foundry RBAC。

#### C4.1 Design security for agents

纵深防御从**身份**开始：**Microsoft Entra Agent ID** 给每个 agent 独立身份——**agent identity** 本身无凭据，由 **agent identity blueprint**（持凭据、承载 Conditional Access 等策略的模板）签发令牌；**interactive agent** 用 on-behalf-of 流继承用户权限，**autonomous agent** 用自身身份的 client credentials 流；必要时配 1:1 的 agent 用户账户访问邮箱等资源；传统 service principal 与普通用户账户都**不推荐**；职责分 **owner**（技术）与 **sponsor**（业务）。Copilot Studio 的安全控件：默认 **Authenticate with Microsoft**、工具默认以**用户凭据**运行、发布前的自动安全扫描与实时风险评估、agent runtime protection 状态、证书认证、CMK、SharePoint 知识的敏感标签显示；接入 **Microsoft Agent 365** 后 agent 成为 Entra 身份，可用 Conditional Access 与网络出入控制。Foundry 侧：用 managed identity 与最小权限角色、机密放 Key Vault connection、发布后复核 agent application 身份权限。模块补充：每个环境独立身份、Maker / Publisher / Environment Admin / Security Admin 职责分离、集中日志与成本标签、红队与事件响应演练、用 MCP / A2A 做受控的工具与 agent 访问。

来源：[Fundamental concepts in Microsoft Entra Agent ID](https://learn.microsoft.com/en-us/entra/agent-id/key-concepts)、[Security and governance (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance)、[Agent development lifecycle in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/development-lifecycle)

#### C4.2 Design governance for agents

治理落点在 Power Platform admin center 的**数据策略（DLP）**：连接器分 Business / Non-business / Blocked 三组，自 2025 年初起对所有租户强制执行；用它可以**要求用户认证**（屏蔽 *Chat without Microsoft Entra ID authentication in Copilot Studio*）、屏蔽知识源（文档、SharePoint / OneDrive、公网站点，支持 endpoint filtering）、屏蔽 Power Platform 连接器作工具（同时屏蔽 MCP）、屏蔽 HTTP 请求、技能、特定发布渠道（Teams + M365、Direct Line、Omnichannel、SharePoint、WhatsApp、Facebook）、**事件触发器**（屏蔽 *Microsoft Copilot Studio* 连接器）和 Application Insights；违规时 Publish 按钮不可用。其他控件：**environment routing** 与 maker welcome message、禁止发布使用生成式 AI 的 agent、Copilot hub 的用量可见性与 **pay-as-you-go credit 上限**、环境组规则、Customer Lockbox。清单工具：Copilot Agent Kit 的 **Agent Inventory** 与 **Compliance Hub**（阈值、风险级、SLA、隔离 / 删除等强制动作）、Foundry Control Plane、Agent 365、Microsoft 365 admin center 的 agent 策略。CAF Govern 的流程：按负责任 AI 原则评估风险 → 记录策略（模型选型、第三方数据、重训频率、区域合规、用户行为）→ 用 Azure Policy 与 Purview 自动执行 → 持续监控并独立复审。

来源：[Configure data policies for agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-data-loss-prevention)、[Security and governance (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance)、[Govern AI (Cloud Adoption Framework)](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/govern)

#### C4.3 Design model security

CAF Secure AI 三步：**发现**（用 STRIDE 加 MITRE ATLAS、OWASP GenAI 做威胁建模；Purview Insider Risk Management 评估数据风险；红队测试模型；定期复评）、**保护**（用 Azure Resource Graph 与 **Defender for Cloud AI security posture management** 建完整 AI 资产清单；managed identity 消除凭据；VNet 与 **Foundry Agent Service 的私有网络**隔离通信；Purview 分类与 RBAC 定数据边界；Private Link 访问 PaaS；Purview DLP 阻止敏感数据出现在输出；模型与数据集放带私有端点的 Blob 并加密）、**检测**（Defender for Cloud 自动检测生成式 AI 风险，AI 专属事件响应）。Foundry 产品内：**guardrails** 系统挂 Prompt Shields 与内容过滤到模型部署或 agent；**RBAC** 用 Microsoft Entra ID 认证才生效——**key 认证会绕过角色限制**；最小权限用 **Foundry Agent Consumer**（只调端点）、**Foundry User**（开发）、**Foundry Project Manager**（可发布）；模型管理权在 Account Owner / Owner；Risks + alerts 页面显示 Defender 告警。模块的加固蓝图：安全计算 → 私有端点 → 威胁防护 → 验证管道 → 监控与漂移检测，加上数据最小化、脱敏、训练数据 lineage 与投毒防护、模型更新多级审批。

来源：[Secure AI (Cloud Adoption Framework)](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/secure)、[Role-based access control for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/rbac-azure-ai-foundry)、[Responsible AI for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-use-of-ai-overview)

#### C4.4 Analyze solution and AI vulnerabilities and mitigations, including prompt manipulation

Prompt 操纵分两类。**User prompt attacks**（jailbreak / UPIA）：用户试图覆盖系统指令——改系统规则、嵌入伪造对话、角色扮演、编码攻击。**Document attacks**（indirect prompt injection / XPIA）：第三方内容（文档、邮件、网页、工具返回）里藏指令，让模型执行篡改内容、访问基础设施、窃取信息、拒绝服务、欺诈、传播恶意软件等。**Prompt Shields**（Azure AI Content Safety，在 Foundry 的 guardrails 里配置）在 **user input** 与 **tool response** 两个干预点检测，返回 `detected` / `filtered`；**Spotlighting**（预览）把文档 base64 标记为低信任内容，代价是 token 增加。**AI Red Teaming Agent**（基于 PyRIT）自动化对抗探测，输出 **Attack Success Rate**，覆盖内容风险和 agent 专属风险（**prohibited actions**、**sensitive data leakage**、**task adherence**、XPIA），支持编码、Crescendo、多轮等攻击策略，应在设计、开发、预生产和生产后定期运行。其他漏洞与缓解：过度权限（最小权限、managed identity、环境隔离）、日志与转录泄露（数据最小化、保留策略）、autonomous 工具无护栏（capability 边界、审批、回滚）、connected agent 权限高于父 agent（视为敏感动作并加审批）、Computer use 的 human supervision 与允许列表。分层防御：身份边界 → 数据治理 → 评估测试 → 监控异常 → 事件响应。

来源：[Prompt Shields in Azure AI Content Safety](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection)、[AI Red Teaming Agent (Microsoft Foundry)](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/ai-red-teaming-agent)、[Multi-agent orchestration patterns and best practices](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns)

#### C4.5 Review solution for adherence to responsible AI principles

六项原则是评审的镜头：**Fairness、Reliability and Safety、Privacy and Security、Inclusiveness、Transparency、Accountability**；CAF Govern 给每条配了风险评估问题（例如 Transparency："AI 决策的哪些方面用户难以理解或解释？"）。微软自己的工程团队遵循 **Responsible AI Standard**，Foundry 把实践归为 **Discover**（部署前后发现质量、安全与安全风险，如用对抗 prompt 测 jailbreak）、**Protect**（模型输出与 agent 运行时的内容过滤与 guardrails）、**Govern**（tracing、监控与合规集成）。结构化评审清单：用途与预期用途（业务理由、用户画像、数据、向用户传达的限制）→ 数据隐私与安全（敏感度分类、数据最小化、保留、PII 保护、最小权限）→ 模型与 agent 行为（编造模式、指令遵循、边界安全、未知请求的 fallback）→ 公平与偏见（群体差异影响、训练数据代表性、合成与真实场景测试）→ 透明与体验（明示 AI 参与、说明限制、升级路径、反馈记录）→ 运营监督（事件响应、日志与漂移复查、治理委员会、模型退役标准）。Microsoft 365 Copilot 的 declarative agent 还有 RAI validation checks。

> **考点** "CEO 要用微软推荐的工具季度评估可靠性、可解释性、公平性与合规" → Foundry evaluations 与 Responsible AI 工具链；"用户不知道在和 AI 对话" → Transparency 违规。

来源：[Responsible AI for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-use-of-ai-overview)、[Govern AI (Cloud Adoption Framework)](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/govern)、[Review solution adherence to Responsible AI principles](https://learn.microsoft.com/en-us/training/modules/design-responsible-ai-security-governance-risk-management-compliance/6-review-solution-adherence-responsible-ai-principles)

#### C4.6 Validate data residency and movement compliance

Copilot Studio 的数据按环境所在 geo 存储与处理，支持 **EU Data Boundary**（租户账单地址在 EU/EFTA 且所有环境建在 EUDB 区域内），连接到外部系统（如 Salesforce）的驻留责任在制作者。生成式 AI 功能可能需要**跨区域处理**：在 Power Platform admin center 环境的 **Generative AI features** 卡里勾选 **Move data across regions**（美国与政府云不显示该选项；欧洲环境使用 EUDB 内的 Azure OpenAI 端点；巴西、加拿大、日本、韩国、南非、阿联酋的推理在**美国**；亚洲、新加坡、澳大利亚、印度为 in-region 或美国；英国为 in-region 或 EUDB；**Bing Search 一律在美国处理**），再勾选 Bing search 与 Microsoft 365 services，EUDB 租户另有 **flex routing** 允许高峰期推理出境；不允许移动时部分功能受限但不会全部关闭，微软不保留这些数据；可用环境组规则批量设置。Customer Service 的 Copilot 还给出判定表：Azure OpenAI 容量在租户区域内不需移动、在区域外必须开启、有回退则可选。Foundry 侧用部署类型控制：**Data Zone Standard** 把处理限定在数据区（model router 两者都支持）。Deep reasoning 预览**不做驻留承诺**。验证清单：记录 prompt、输出、日志、转录各自的处理与存储位置；确认连接器与自定义插件不绕过区域边界；保留审批记录。

来源：[Move data across regions for Copilots, AI agents, and generative AI features](https://learn.microsoft.com/en-us/power-platform/admin/geographical-availability-copilot)、[Geographic data residency in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/geo-data-residency)、[Manage Copilot features in Customer Service](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-copilot-features)

#### C4.7 Design access controls on grounding data and model tuning

Grounding 数据的访问控制靠**用户上下文传递**：Copilot Studio 的 SharePoint、Dataverse 与连接器知识源要求 agent 用户的 Microsoft Entra ID 认证，只返回该用户可见的内容；Dataverse 表需制作者有读权限；标为 confidential / highly confidential 或加密码的文档不会被索引；**Azure AI Search 知识源不做权限裁剪**，要靠索引侧的 security trimming 字段；工具可选以用户凭据运行。Dynamics 365 侧用安全角色与权限（Customer Service 的 Copilot 需 `prvIntelligenceUsage`，带产品字段的摘要需 `prvReadProduct`，相关实体需读权限）。模型调优的访问控制在 Foundry **RBAC**：fine-tune 需要数据面与控制面权限（**Foundry Owner**，或 Foundry User + Foundry Account Owner），只调用 agent 的主体给 **Foundry Agent Consumer**（可到单个 agent 范围），quota 查看给 Cognitive Services Usages Reader；Entra ID 认证才受 RBAC 约束。模块的原则：最小权限、按职能分区 grounding 数据、每个数据域有负责人、检索流程"prompt → 策略检查 → 搜索索引 → 清洗层 → 注入上下文"、调优环境与生产隔离、新训练数据集需审批与 lineage、禁止文档类型的 block list、异常访问告警、定期 RBAC 复查。

来源：[Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)、[Role-based access control for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/rbac-azure-ai-foundry)、[Manage Copilot features in Customer Service](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-copilot-features)、[Design access controls for grounding data and model tuning](https://learn.microsoft.com/en-us/training/modules/design-responsible-ai-security-governance-risk-management-compliance/8-design-access-controls-ground-data-model-tune)

#### C4.8 Design audit trails for changes to models and data

**Copilot Studio → Microsoft Purview Audit**：默认对所有租户记录，不能关闭采集但可用保留策略控制；制作者事件包括 `BotCreate`、`BotDelete`、`BotUpdateOperation-BotPublish`、`BotUpdateOperation-BotShare`、`BotUpdateOperation-BotAuthUpdate`、`BotComponentCreate/Update/Delete`（主题、技能等）、`AIPluginOperation*`、`EnvironmentVariable*`；用户事件 `CopilotInteraction` 只含元数据与转录线程 ID，完整聊天文本在 **DSPM for AI** 中查看，可用 0 天保留策略不留存文本；Sentinel 可接入告警；有 Entra Agent ID 的 agent 其认证活动还在 Entra 日志里。**Dataverse auditing**：记录创建、更新、删除、共享、安全角色变更与用户访问，按环境 → 表 → 列三级开启，保留期默认 Forever、最长 24,855 天，Audit History（单记录）与 Audit Summary（全环境）查看，读取 / 导出操作需另开 activity logging 送 Purview；审计配置应放在 solution 里随部署走。**Power Platform pipelines** 自动保存每次部署的 managed / unmanaged 工件与审计日志，可重新部署旧版本。**Foundry**：agent 版本不可变、可对比 YAML 定义；Control Plane 的 trace 记录每次调用（Trace ID、Conversation ID）。模块要求审计记录**元数据而非内容**、不可变、带时间戳与身份归属、JSON 结构化、覆盖模型注册 / 调优 / 晋级 / 回滚 / 部署与数据摄取 / schema / 标签 / 跨区域移动，保留期按风险 90 天到 12–24 个月。

来源：[View Copilot Studio audit logs in Purview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-logging-copilot-studio)、[Manage Dataverse auditing](https://learn.microsoft.com/en-us/power-platform/admin/manage-dataverse-auditing)、[Overview of pipelines in Power Platform](https://learn.microsoft.com/en-us/power-platform/alm/pipelines)、[Agent development lifecycle in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/development-lifecycle)
