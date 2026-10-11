---
id: 10-ai-103-syllabus
title: AI-103 考纲逐条：官方 skills measured 怎么考
short: AI-103 考纲
intro: 按 2026 年 4 月 16 日起生效的官方考纲，把 5 大板块、14 个子领域、64 条 bullet 逐条讲清楚考什么、怎么判断、常见陷阱，每条附 Microsoft Learn 来源。
exams: AI-103
skills: ai-103
---
AI-103（Developing AI Apps and Agents on Azure）的官方 skills measured 分五大板块：**A. Plan and manage an Azure AI solution（25–30%）**、**B. Implement generative AI and agentic solutions（30–35%）**、**C. Implement computer vision solutions（10–15%）**、**D. Implement text analysis solutions（10–15%）**、**E. Implement information extraction solutions（10–15%）**。A 和 B 合起来超过一半分值，而且几乎全部围绕 **Microsoft Foundry**（原 Azure AI Foundry / Azure AI Studio）展开：模型目录与部署类型、Foundry Agent Service、Foundry IQ、Guardrails、评估与追踪。

和旧的 AI-102 比，这版考纲有四个明显变化：第一，平台中心从单个 Azure OpenAI 资源变成 **Foundry resource + project**，SDK 变成 `azure-ai-projects` 2.x 加 OpenAI 兼容客户端（Responses API，Assistants API 已退役在途）；第二，**agent** 成为独立大题——prompt agent / hosted agent、工具（MCP、OpenAPI、A2A、Toolbox）、记忆、多 agent 编排（Microsoft Agent Framework）、审批流与治理（Foundry Control Plane）；第三，**多模态生成**（GPT-image 图像生成与编辑、Sora 2 视频生成）第一次进入考纲；第四，**Azure Content Understanding**（Foundry Tools 之一）贯穿视觉理解、文档抽取和 RAG 摄取三个板块，而老牌的 Azure AI services（现在统称 **Foundry Tools**：Vision、Speech、Language、Translator、Document Intelligence、Content Safety）更多作为"确定性、带置信度、便宜"的对照选项出现。

这一章按考纲原文逐条展开。每条先说微软期望你会什么，然后给判断规则（"需求 X → 用 Y，因为 Z"），代码类考点给出类名、方法名和关键参数，最后列出我实际核对过的 Learn 页面。建议的读法：先通读 A、B 两个板块建立 Foundry 的整体图景，再把 C、D、E 当作"同一套 Foundry 工具在不同模态上的应用"来读；做题时遇到不熟的名词，回到对应 bullet 查判断规则而不是死记选项。

## A1. Choose the appropriate Foundry services for generative AI and agents {#a1}
这一子领域考"选型"：给一个业务需求，让你在 Foundry Models、Foundry Agent Service、Foundry IQ / Azure AI Search、Foundry Tools 之间挑对的服务，并说出为什么。题目通常以 case study 里的"技术要求"句子出现（例如"必须支持 semantic 和 vector 检索"、"数据必须留在 EU"），答案往往由一个关键词决定。

记住一个总原则：**生成、推理、开放式对话 → Foundry Models（LLM）；固定任务、要置信度、要便宜稳定 → Foundry Tools；需要工具调用和多轮状态 → Foundry Agent Service；需要在自己的数据上接地 → Azure AI Search / Foundry IQ。**

#### A1.1 Choose an appropriate model for each task, including large language models (LLMs), small language models, multimodal models, and Foundry Tools
Foundry Models 目录有一万多个模型，分 **Models sold by Azure**（微软托管、SLA、经微软 Responsible AI 审查，含全部 Azure OpenAI 模型及部分 DeepSeek、Meta、Mistral、xAI 模型）和 **Models from partners and community**（Anthropic Claude、Hugging Face 等，由提供商支持，经 Marketplace 计费）。目录可按 Collections、Region、Deployment options、Lifecycle、Industry、Supported features（reasoning、tool calling）、Inference tasks 筛选，还有 leaderboard 和 model card 的 Benchmarks 页。选型规则：

| 需求 | 选择 | 原因 |
|---|---|---|
| 复杂推理、多步规划、复杂工具调用 | 推理模型：GPT-5 系列、o-series（`o3`、`o4-mini`） | 支持 `reasoning_effort`，但不支持 chain-of-thought 提示技巧 |
| 高并发、低延迟、低成本、简单分类/抽取 | 小模型：`gpt-5-nano`/`gpt-5-mini`、`gpt-4.1-nano`、Phi 系列 | 更便宜、更快；可微调让小模型专精 |
| 图片 + 文本输入 | 多模态模型：GPT-4o、GPT-4.1、GPT-5 系列（"Text and image processing"） | 单模型同时处理文本与图像 |
| 生成图像 / 视频 / 实时语音 | `gpt-image-*` / `sora-2` / `gpt-realtime` | 专用生成模型 |
| 向量检索 | `text-embedding-3-large`（3072 维，可用 `dimensions` 缩减） | 只能用于 Embeddings API |
| 代码生成 | `gpt-5-codex`、`gpt-5.1-codex`（仅 Responses API） | 针对 Codex 工具优化 |
| OCR、语音转写、PII、翻译、情感等确定性任务 | Foundry Tools（Vision、Speech、Language、Translator、Content Understanding） | 带置信度、按次计费、不需要 prompt 工程 |

**Model router** 是一个"会路由"的部署：按提示复杂度实时选底层模型，Routing mode 有 Balanced（默认）、Cost、Quality，可限定 model subset，适合"既要省钱又不想自己写路由"的题。

> **考点** 题干强调"EU 数据驻留 + 高吞吐"考的是部署类型而不是模型；强调"确定性输出、需要置信度分数"时正确答案通常是 Foundry Tools 而不是 LLM。

来源：[Microsoft Foundry Models overview](https://learn.microsoft.com/en-us/azure/foundry/concepts/foundry-models-overview)、[Foundry Models sold by Azure](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure)、[Model router concepts](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-router)

#### A1.2 Choose the appropriate Foundry services for generative tasks, grounding, vector search, agent workflows, or multimodal processing
Foundry 把能力分成几层，题目要你按需求对号入座：

| 需求 | Foundry 服务 | 关键事实 |
|---|---|---|
| 生成任务（聊天、摘要、改写） | **Foundry Models** 部署 + Responses API（`/openai/v1/`） | 一个 project endpoint 调所有模型 |
| Grounding（在企业数据上接地） | **Foundry IQ** knowledge base（底层是 Azure AI Search agentic retrieval）；小规模用户上传文件用 **File search** 工具 | 权限感知、带引用 |
| 向量搜索 | **Azure AI Search**（vector / hybrid / semantic ranker） | 独立资源 `Microsoft.Search` |
| Agent 工作流 | **Foundry Agent Service**：声明式 **prompt agent**、**voice-based prompt agent**、自带代码的 **hosted agent**；多 agent 编排用 **Microsoft Agent Framework** | 工具通过 **Toolbox**（统一 MCP 端点）集中管理 |
| 多模态处理（文档/图像/音频/视频 → 结构化） | **Azure Content Understanding**（Foundry Tools） | 输出 Markdown + 带置信度的字段 |
| 单一模态的经典任务 | Foundry Tools：Vision、Speech、Language、Translator、Content Safety | 可作为 agent 工具（如 Azure Language MCP server） |

旧名字对照：Azure AI Studio / Azure AI Foundry → Microsoft Foundry；Azure AI Services → Foundry Tools；Assistants API → Responses API（Threads/Messages/Runs/Assistants → Conversations/Items/Responses/Agent Versions）；Hub + Azure OpenAI + AI Services 三种资源 → 单一 Foundry resource 加 projects。

> **易混** "只需要给模型发一个提示、不用工具和编排"时，官方建议直接做 model call，不要建 agent；"要在自己的 PDF 上问答"时答案是 RAG/知识库，不是微调。

来源：[What is Microsoft Foundry?](https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry)、[What is Microsoft Foundry Agent Service?](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)、[What is Azure Content Understanding in Foundry Tools?](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview)

#### A1.3 Choose an appropriate method for retrieval and indexing
Azure AI Search 给 RAG 提供两条路：**Agentic retrieval**（新实现首选）——LLM 做 query planning，把复杂问题拆成多个子查询并行执行，内置 semantic ranking，返回带引用和执行元数据的结构化结果；对象是 **knowledge source → knowledge base → retrieve action**，也就是 Foundry IQ。**Classic RAG**——应用发一次查询（hybrid + semantic ranker），自己把结果交给 LLM；适合只要 GA 功能、要求简单快速、已有编排代码的场景。

索引方法：**pull**（indexer 从 Blob、ADLS Gen2、Cosmos DB、SQL、OneLake、SharePoint 等十余种数据源拉取，配 skillset 做 chunking、vectorization、image verbalization，增量刷新）；**push**（应用自己预处理后调 push API 写入）；Foundry IQ 的 indexed knowledge source 会自动生成 chunking + embedding 管道。相关性手段：hybrid query 提高召回、semantic ranker 重排、scoring profile 加权、vector weighting 和最低分阈值。

判断规则：客户是 agent/chatbot、问题复杂多轮、要最高相关性 → agentic retrieval；只要 GA、要细粒度控制查询管道 → classic；用户临时上传少量文档 → agent 的 File search 向量库，不必建索引。

来源：[RAG and Generative AI - Azure AI Search](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview)、[Retrieval augmented generation (RAG) and indexes in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/retrieval-augmented-generation)、[What is Foundry IQ?](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-foundry-iq)

#### A1.4 Choose appropriate memory, tool, and knowledge integration services for agent solutions
三类集成要分清：

- **记忆**：短期记忆就是 **conversation**（Responses API 的对话对象，由 Agent Service 管理）；长期记忆用 **Memory（preview）**——托管的 memory store，自动做 Extraction → Consolidation → Retrieval，三种类型：**User profile memory**（偏好、无障碍需求）、**Chat summary memory**（历史话题摘要）、**Procedural memory**（可复用的操作套路）。用法一是给 prompt agent 挂 **memory search tool**（`scope` 设 `{{$userId}}` 自动按用户隔离），二是直接调 Memory Store API（CRUD、默认 TTL、显式 remember/forget）。
- **知识**：组织内容用 **Foundry IQ** knowledge base；用户文档用 **File search**；现有索引用 **Azure AI Search** 工具；SharePoint、Fabric IQ、Work IQ、Web search / Grounding with Bing 各有专门工具。
- **工具**：**Function calling**（客户端执行）、**OpenAPI**、**MCP**、**A2A**、**Code interpreter**、**Azure Functions**、**Logic Apps**；推荐用 **Toolbox** 把它们打包成一个 MCP 端点，集中做认证、版本和 guardrails，还有 tool search（`tool_search` / `call_tool` 两个元工具）。

> **考点** "记住用户上次说过自己过敏"是 Memory；"回答公司产品手册里的问题"是知识库；两者文档明确区分：Memory 用于跨会话学到的用户/agent 上下文，Foundry IQ 用于策展的组织内容，File search 用于交互中用户提供的文档。

来源：[What is Memory?](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory)、[What is Toolbox in Microsoft Foundry?](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview)、[What is Foundry IQ?](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-foundry-iq)

## A2. Set up AI solutions in Foundry {#a2}
这一子领域考 Foundry 的资源模型和部署决策：resource / project 怎么分、agent 的状态存在哪、哪种部署类型满足"数据驻留 + 吞吐"要求、以及怎么把部署和 agent 定义纳入流水线。

#### A2.1 Design Azure infrastructure for AI apps and agent-based solutions
Foundry 的分层：**Foundry resource**（`Microsoft.CognitiveServices/accounts`，kind `AIServices`）是治理边界——网络、安全、模型部署、连接都在这里；**project**（`accounts/projects` 子资源）是开发隔离边界——agent、评估、文件按 project 隔离并可单独做 RBAC。连接的资源（Storage、Key Vault、Azure AI Search、Cosmos DB、Application Insights）是独立资源，各有自己的网络和访问策略。单开发者建一个 resource 加一个 project；多团队共用模型部署时一个 resource 多个 project。

Agent 状态有两种设置：**Basic**（微软托管多租户存储）和 **Standard**（BYO：Cosmos DB for NoSQL 存对话/消息/agent 元数据，至少 3000 RU/s；Azure Storage 存文件；Azure AI Search 存向量库；Key Vault 存密钥），数据按 project 隔离，满足数据主权要求。网络隔离：inbound 用 private endpoint + 关闭 public network access；outbound 用 **VNet injection**——子网委派给 `Microsoft.App/environments`、至少 /27，或用 managed VNet。Foundry 不做自动跨区域故障转移，多区域要各建 resource。

> **注意** project 的 managed identity 要在依赖资源上拿到角色（Cosmos DB Operator、Storage Blob Data Contributor/Owner、Search Index Data Contributor、Search Service Contributor），这与部署人员的权限是两回事。

来源：[Microsoft Foundry architecture](https://learn.microsoft.com/en-us/azure/foundry/concepts/architecture)、[Set up standard agent resources for Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/standard-agent-setup)、[How to configure network isolation for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/how-to/configure-private-link)

#### A2.2 Choose appropriate deployment options
两个层次。第一层：**Serverless API**（首选，微软托管、按 token 或 PTU 计费、内置内容过滤、Entra 认证、专用网络）vs **Managed compute（preview）**（开源/自定义权重模型跑在专用 GPU，按加速器小时计费，预览期无内容过滤）；还有 **instant access（preview）**：直接按模型名调用、不建部署。第二层是 Serverless 的**部署类型**，由"数据在哪处理"和"怎么付费"两个维度决定：

| 部署类型 | SKU | 数据处理位置 | 计费 | 适用 |
|---|---|---|---|---|
| Global Standard | `GlobalStandard` | 任意 Azure 区域 | 按 token | 默认起点：新模型最先上、价格最低、配额最高 |
| Data Zone Standard | `DataZoneStandard` | US / EU / APAC 数据区内 | 按 token | 数据区合规（EU 遵循 EU Data Boundary） |
| Standard | `Standard` | 客户指定 geography | 按 token | 地理合规、低到中等量、突发 |
| Global / Data Zone / Regional Provisioned | `GlobalProvisionedManaged` 等 | 同上三档 | 预留 PTU | 可预测高吞吐、低延迟方差 |
| Global / Data Zone Batch | `GlobalBatch` 等 | 同上 | 比 Global Standard 便宜 50%，24 小时目标 | 大批量异步任务，独立 enqueued token 配额 |
| Developer | `DeveloperTier` | 任意区域 | 按 token | 仅评估微调模型，24 小时生命周期，无 SLA |

判断规则：没有驻留要求 → Global Standard；"数据必须留在 EU 且流量可变、不想预留容量" → Data Zone Standard；"稳定高流量、要低延迟方差" → Provisioned；"不急、要省钱" → Batch。Azure Policy 可按 `sku.name` 禁止某类部署。

来源：[Understanding deployment types in Microsoft Foundry Models](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types)、[Deployment overview for Microsoft Foundry Models](https://learn.microsoft.com/en-us/azure/foundry/concepts/deployments-overview)

#### A2.3 Configure model and agent deployments
模型部署的可配项：部署名（代码里 `model=` 传的是部署名而不是模型名）、模型版本与是否 **Auto-update**（锁定版本才能保证响应稳定）、部署类型、TPM 配额分配、guardrail（内容过滤）配置。部署可在 Foundry portal、Azure CLI、Bicep 完成，也可用 Usages / Model Capacities API 先查容量。

Agent 部署：**prompt agent** 用 `project.agents.create_version(agent_name, definition=PromptAgentDefinition(model, instructions, tools))`，每次保存生成不可变的 **agent version**；调用时 `project.get_openai_client(agent_name=...)` 然后 `responses.create(conversation=..., input=...)`。**Hosted agent** 把自己的代码打成容器镜像推到 Azure Container Registry，部署时自动获得专属 **Entra agent identity** 和端点；协议选 **Responses**（平台管会话、流式、后台执行）或 **Invocations**（任意 JSON、webhook）；每个 version 固化镜像、CPU/内存（0.5–2 vCPU）、环境变量，端点一次只指向一个 version，不支持流量拆分。发布（agent applications）后得到稳定端点，可分发到 Teams / Microsoft 365 Copilot。

> **考点** "标准化模型版本以保证响应一致"→ 关闭自动升级、固定版本；"需要自定义编排代码/非 OpenAI 协议"→ hosted agent 而不是 prompt agent。

来源：[Quickstart: Get started with Microsoft Foundry SDK](https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code)、[Hosted agents in Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents)、[Manage Azure OpenAI in Microsoft Foundry Models quota](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/quota)

#### A2.4 Integrate Foundry projects with continuous integration and continuous deployment (CI/CD) pipelines
Foundry 的 CI/CD 由三部分组成：**基础设施即代码**（Bicep / Terraform / ARM 创建 resource、project、部署与 capability settings，官方 foundry-samples 仓库有模板；hosted agent 用 **Azure Developer CLI（azd）** 的 `azure.yaml` 定义并 `azd deploy`）；**agent 定义即代码**（prompt agent 用 SDK / REST 在流水线里创建版本，纳入版本控制与代码评审）；**评估质量门**。评估门的官方做法是 GitHub Action **`microsoft/ai-agent-evals`**：输入 `azure-ai-project-endpoint`、`deployment-name`（判分模型）、`agent-ids`（`name:version`，可多个做对比，可选 `baseline-agent-id`）、`data-path`（JSON：`evaluators` 列表如 `builtin.fluency`、`builtin.task_adherence`、`builtin.violence`，加 `data` 查询数组）；输出带置信区间和统计显著性检验的报告；认证推荐 `azure/login@v2` 的联邦身份（OIDC），需要 `permissions: id-token: write`。Azure DevOps 有对应文档。建议不要每次提交都跑评估以控制成本。

来源：[How to run an evaluation in GitHub Action](https://learn.microsoft.com/en-us/azure/foundry/how-to/evaluation-github-action)、[Observability in Generative AI](https://learn.microsoft.com/en-us/azure/foundry/concepts/observability)、[Hosted agents in Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents)

## A3. Manage, monitor, and secure AI systems {#a3}
运营题：配额与 429、监控什么指标、索引健不健康、以及无密钥和最小权限怎么落地。这里的名词要记准（TPM、PTU、Foundry User、Cognitive Services Usages Reader、private endpoint）。

#### A3.1 Manage quotas, scaling, rate limits, and cost footprints for model and agent workloads
**配额**按订阅 × 区域 × 模型 × 部署类型以 **TPM** 分配，建部署时把 TPM 分给部署，多个部署共享池；**RPM** 按比例派生（旧聊天模型 1 单位 = 1,000 TPM / 6 RPM）。超限返回 **429**，带 `retry-after-ms`；每个响应都有 `x-ratelimit-remaining-tokens` / `x-ratelimit-remaining-requests` 等头，可提前节流。速率估算用 prompt + `max_tokens` + `best_of`，所以 `max_tokens` 设太大会白白吃配额；突发在 1–10 秒窗口内也会触发 429。处理手段：SDK 内置重试（`max_retries`）或指数退避；把 `max_tokens` 调到合理值；跨部署/区域分流；不急的任务走 Batch；稳定高流量上 PTU（可 spillover 到标准部署）。查看配额需要订阅范围的 **Cognitive Services Usages Reader**；程序化用 **Usages API**（已用/上限）和 **Model Capacities API**（哪里还能部署）。

成本控制：Global Standard 最便宜、Batch 再省 50%、model router 的 Cost 模式；**AI Gateway**（Azure API Management）在 project 级别设 TPM 上限和 token 配额（超 TPM 返回 429、超总配额返回 403），防止一个项目吃光容量。

来源：[Manage Azure OpenAI in Microsoft Foundry Models quota](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/quota)、[Configure AI Gateway in your Foundry resources](https://learn.microsoft.com/en-us/azure/foundry/configuration/enable-ai-api-management-gateway-portal)、[Understanding deployment types](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types)

#### A3.2 Monitor model performance, drift, safety events, and grounding quality
生产监控的入口是 agent 的 **Monitor** 标签（Agent Monitoring Dashboard），前提是 project 连接了 **Application Insights**。它显示 **Token usage**、**Latency**、**Run success rate**、**Evaluation metrics**（对采样流量跑评估器的得分）和 **Red teaming results**。设置面板里三件事：**Continuous evaluation**（对实时流量采样评估，SDK 用 `project_client.evaluation_rules.create_or_update(EvaluationRule(action=ContinuousEvaluationRuleAction(eval_id, max_hourly_runs=100), event_type=EvaluationRuleEventType.RESPONSE_COMPLETED, filter=EvaluationRuleFilter(agent_name=...)))`，默认每小时最多 100 次）；**Scheduled evaluation**（用固定测试集按计划跑，专门用来发现系统**漂移**；`Schedule` + `RecurrenceTrigger` + `EvaluationScheduleTask`）；**Red team scans** 和 **Alerts**（延迟、token、评估分、红队发现）。project 的 managed identity 需要 Foundry User 角色才能跑连续评估。

安全事件来自 guardrail 注解（`detected` / `filtered`）和安全评估器；grounding 质量用 **Groundedness**（1–5，判分模型）或 **Groundedness Pro**（Content Safety 服务，二值）评估器。资源级指标（token 消耗、模型延迟、请求数、错误率）在 Azure Monitor，diagnostic settings 可路由到 Log Analytics。

来源：[Monitor agents with the Agent Monitoring Dashboard](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard)、[Observability in Generative AI](https://learn.microsoft.com/en-us/azure/foundry/concepts/observability)、[RAG evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/rag-evaluators)

#### A3.3 Monitor data ingestion quality, search index health, and relevance performance
三个层面。**摄取**：indexer 的状态分两层——indexer 本身的 `status`（`running` 只表示配置正确可运行）和每次执行的结果（`running` / `success` / `transientFailure` / `persistentFailure`，重置后多一条 `reset`）；`lastResult` 和 `executionHistory`（最近 50 次）给出 `itemsProcessed`、`itemsFailed`、`errors`、`warnings`；错误数超过 **Max failed items** 则运行标为 Failed。Foundry Tools 技能对无文字的图片/PDF 报 warning 是正常现象。REST 用 `GET /indexers/{name}/status`，.NET 用 `SearchIndexerClient.GetIndexerStatus`。**索引健康**：Azure Monitor 平台指标（查询延迟、每秒查询数、被限流查询百分比、Document processed count、Skill execution invocation count，可按 indexer 名拆分），推荐告警：Search Latency、Throttled search queries percentage、Storage Usage；resource logs 要先建 diagnostic setting 才会保存。**相关性**：用 **Document Retrieval** 评估器（需要 qrels 真值）算 NDCG、XDCG、Fidelity、Holes，做 parameter sweep 调 top_k、chunk 大小、向量/语义算法；没有真值用 **Retrieval** 评估器（LLM 判上下文相关性）。

来源：[Monitor Indexer Status and Results](https://learn.microsoft.com/en-us/azure/search/search-monitor-indexers)、[Monitor Your Search Service](https://learn.microsoft.com/en-us/azure/search/monitor-azure-cognitive-search)、[RAG evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/rag-evaluators)

#### A3.4 Configure security, including managed identity, private networking, keyless credentials, and role policies
**认证**：Microsoft Entra ID（OAuth 2.0 bearer token，scope `https://ai.azure.com/.default`）vs API key。生产用 Entra：条件访问、按用户审计、managed identity；key 是资源级全权限、不能追溯用户。Agents、Evaluations、Toolbox **只支持 Entra**。代码里用 `DefaultAzureCredential()`，OpenAI SDK 用 `get_bearer_token_provider(DefaultAzureCredential(), "https://ai.azure.com/.default")` 传给 `api_key`。禁用密钥：`Set-AzCognitiveServicesAccount -DisableLocalAuth $true`（或模板里 `disableLocalAuth`）。Entra 认证要求资源有 **custom subdomain**。

**角色**（2026 年改名，旧名 Azure AI *）：**Foundry User**（原 Azure AI User，开发者建 agent 的最小权限，也要给 project 的 managed identity）、**Foundry Project Manager**（建 project、管部署、可授 Foundry User）、**Foundry Account Owner**（管资源、不能在 project 内开发）、**Foundry Owner**（全部）、**Foundry Agent Consumer**（只调用 agent 端点，可在 agent 范围授权）。推理调用还可用 **Cognitive Services User**。不要用 Azure AI Developer（面向 hub/AML）。用安全组授权、按 project 范围分配即最小权限。

**网络**：Foundry resource 上建 private endpoint（目标 sub-resource 是 account）、PNA 设 Disabled 或 Selected networks；依赖资源（Search、Storage、Cosmos DB）的 private endpoint 不会自动创建；agent 出站用 VNet injection；私网下 indexer 要设 `executionEnvironment: "Private"`。

> **考点** "API 密钥不得用于访问模型 + 开发者用 Entra + 按安全组最小权限"三句话对应：禁用 local auth、`DefaultAzureCredential`、给安全组在 project 范围授 Foundry User。

来源：[Authentication and authorization in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/authentication-authorization-foundry)、[Role-based access control for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry)、[Configure keyless authentication with Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/configure-entra-id)、[How to configure network isolation for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/how-to/configure-private-link)

## A4. Implement responsible AI across generative AI and agentic systems {#a4}
负责任 AI 在这版考纲里是工程题而不是概念题：Guardrails 的三要素（risk、intervention point、action）、评估器的名字和量表、追踪和内容凭据、以及 agent 的审批与工具访问控制。

#### A4.1 Configure safety filters, guardrails, risk detection, and content moderation
Foundry 的 **Guardrails** 是一组 **controls**，每个 control = 要检测的 **risk** + 扫描的 **intervention point** + 命中后的 **action**。Risk：Hate、Sexual、Self-harm、Violence（按 **severity threshold** Low / Medium / High 过滤，Off 需获批）、User prompt attacks（jailbreak）、Indirect attacks（文档中的注入）、Spotlighting（preview，仅模型）、Protected material text / code、Groundedness（preview，仅模型）、PII（preview）、Task Adherence（preview）。Intervention point：**User input**、**Output**（模型和 agent 都有），**Tool call**、**Tool response**（仅 agent，preview）。Action：**Annotate**（仅模型）或 **Annotate and block**。模型默认挂 **Microsoft.DefaultV2**；agent 若未显式指定则继承其模型部署的 guardrail，一旦指定就**完全覆盖**模型的设置。底层分类模型来自 **Azure AI Content Safety**，独立调用时有 Analyze text / Analyze image / 多模态 API、Prompt Shields、Groundedness detection、Protected material、**blocklists**（精确匹配）和 **Custom categories**（standard 需训练、rapid 用少量样本应急，standard 版 2026-09-01 退役）。

> **易混** 误报多时把 action 从 block 改成 annotate 先观察；"agent 工具返回的内容也要扫"要在 guardrail 里显式加 tool response 控制，模型级 guardrail 不会扫工具。

来源：[Guardrails and controls overview in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview)、[Prompt Shields in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/content-filter-prompt-shields)、[What is Azure AI Content Safety?](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview)

#### A4.2 Apply responsible AI instrumentation, including evaluators, safety evaluations, and explanation tooling
内置评估器分五类：**General purpose**（Coherence、Fluency）、**Textual similarity**（Similarity、F1、BLEU、GLEU、ROUGE、METEOR）、**RAG**（Retrieval、Document Retrieval、Groundedness、Groundedness Pro、Relevance、Response Completeness）、**Risk and safety**（Hate and Unfairness、Sexual、Violence、Self-Harm、Protected Materials、Indirect Attack、Code Vulnerability、Ungrounded Attributes、Prohibited Actions、Sensitive Data Leakage）、**Agent**（Intent Resolution、Task Adherence、Tool Call Accuracy 等），另有 Azure OpenAI graders、Rubric、Custom。质量类评估器是 LLM-as-judge，需要 `deployment_name`，1–5 分、默认阈值 3；安全类评估器由 Foundry 评估服务的托管模型打分，**不需要部署判分模型**，内容风险用 **0–7 severity**（阈值默认 3，≤3 为 pass），汇总成 **defect rate**。每条结果带 `score`、`label`、`reason`（解释字段，就是"explanation tooling"的落点）。**AI Red Teaming Agent** 用 PyRIT 的攻击策略（Base64、ROT13、Jailbreak、Crescendo、Multi turn…）自动探测，核心指标 **Attack Success Rate（ASR）**，agent 专属风险（prohibited actions、sensitive data leakage、task adherence、XPIA）只在云端红队中支持。配置写法：`{"type": "azure_ai_evaluator", "evaluator_name": "builtin.violence", "data_mapping": {...}}`。

来源：[Built-in Evaluators Reference](https://learn.microsoft.com/en-us/azure/foundry/concepts/built-in-evaluators)、[Risk and Safety Evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/risk-safety-evaluators)、[AI Red Teaming Agent](https://learn.microsoft.com/en-us/azure/foundry/concepts/ai-red-teaming-agent)

#### A4.3 Implement auditing through trace logging, provenance metadata, and approval workflows
**追踪**：基于 OpenTelemetry 的 GenAI semantic conventions，span 包括 `invoke_agent`、`invoke_workflow`、`execute_tool`、`plan`、`search_memory` 等，属性如 `gen_ai.tool.definitions`、`gen_ai.tool.call.arguments`、`gen_ai.tool.call.result`；存入 Application Insights，Foundry portal 的 **Traces** 页可查 90 天，并按 Conversation ID 回看每一轮的输入、输出、工具调用和 token。连接 App Insights 后 prompt / hosted agent 的服务端追踪自动开启；客户端追踪装 `azure-core-tracing-opentelemetry`。审计时要脱敏，不要把密钥放进 prompt 或 span。Entra 认证本身提供每请求的用户归属（token 含 tenant 和 object ID），API key 做不到。

**来源元数据**：Azure OpenAI 生成的所有图像自动带 **Content Credentials**（C2PA manifest，微软证书签名），字段 `description` = "AI Generated Image"、`softwareAgent` = "Azure OpenAI DALL-E" 或 "Azure OpenAI ImageGen"、`when` 时间戳；用 contentcredentials.org/verify 或 CAI 开源工具验证。

**审批流**：MCP 工具 `require_approval="always"` 时，响应里出现 `mcp_approval_request` 项，客户端用 `{"type": "mcp_approval_response", "approval_request_id": ..., "approve": true}` 回传；Agent Framework 用 `@tool(approval_mode="always_require")`；工作流用 request/response 暂停等人。

来源：[Agent tracing overview](https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept)、[Set Up Tracing for AI Agents in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-setup)、[Content Credentials in Azure OpenAI](https://learn.microsoft.com/en-us/azure/foundry-classic/openai/concepts/content-credentials)、[Connect agents to MCP server endpoints](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/model-context-protocol)

#### A4.4 Govern agent behavior with oversight modes, constraints, and tool-access controls
四个控制面：

1. **Foundry Control Plane**（portal 的 **Operate** 菜单）：Overview（fleet 健康、成本、run completion、prevented behaviors）、Assets（跨 project 的 agent / 模型 / 工具清单，可直接改 guardrail）、Compliance（Azure Policy、Defender、Purview 集成，版本化策略与批量修复），也能注册 Foundry 外的自定义 agent（经 AI Gateway）。
2. **约束**：agent 级 guardrail（可扫 tool call / tool response），Task Adherence 风险；指令里的角色与禁令；网络 egress controls（hosted agent，preview）。
3. **工具访问控制**：MCP 的 `allowed_tools` 白名单与 `require_approval`（`always` / `never` / 按工具）；Toolbox 集中认证、版本和 guardrail；OpenAPI / A2A 的 managed identity 或 OAuth 身份透传；agent 自己的 **Entra agent identity** 只授最小 RBAC；调用方用 **Foundry Agent Consumer** 并可把范围缩到单个 agent。
4. **监督模式**：人工审批（`always_require`）、Agent Framework 工作流的 human-in-the-loop 节点、红队文档里的三级分类——Prohibited Actions 永不允许、High-Risk 需人工确认、Irreversible 需披露加确认。

来源：[What is Microsoft Foundry Control Plane?](https://learn.microsoft.com/en-us/azure/foundry/control-plane/overview)、[Guardrails and controls overview](https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview)、[Role-based access control for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry)、[Connect agents to MCP server endpoints](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/model-context-protocol)

## B1. Build generative applications by using Foundry {#b1}
最重的子领域之一：用 Foundry SDK 调模型、做 RAG、设计工具调用流程、评估结果、把流程接进应用。代码题集中在 `AIProjectClient`、`get_openai_client()`、`responses.create()`、工具调用循环和评估器配置。

#### B1.1 Deploy and consume LLMs, small models, code models, and multimodal models
部署完成后，所有 Serverless 模型都走同一个 **project endpoint**。Python 推荐路径：

```python
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient
project = AIProjectClient(endpoint=ENDPOINT, credential=DefaultAzureCredential())
openai = project.get_openai_client()
r = openai.responses.create(model="gpt-5-mini", input="...")   # model = 部署名
print(r.output_text)
```

也可以直接用 OpenAI SDK：`OpenAI(base_url="https://<res>.openai.azure.com/openai/v1/", api_key=token_provider)`，适合追求最低延迟、Embeddings 或 Chat Completions。各类模型的差异：**小模型**（`gpt-5-nano`、`gpt-4.1-nano`、Phi）用法相同，只是部署名不同；**代码模型** `gpt-5-codex` / `gpt-5.1-codex` 只支持 Responses API；**推理模型**用 `max_output_tokens`（Responses）或 `max_completion_tokens`（Chat Completions），不用 `temperature`；**多模态输入**在 Chat Completions 里用 content 数组（`{"type": "text"}` + `{"type": "image_url", "image_url": {"url": "...", "detail": "high"}}`，URL 或 `data:image/jpeg;base64,...`，每请求最多 10 张图），Responses API 用 `input_image`。.NET 用 `Azure.AI.Projects` + `Azure.AI.Extensions.OpenAI`（`GetProjectResponsesClientForModel`），JS 用 `@azure/ai-projects` 的 `project.getOpenAIClient()`。

来源：[Quickstart: Get started with Microsoft Foundry SDK](https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code)、[Get started with Microsoft Foundry SDKs and endpoints](https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/sdk-overview)、[Foundry Models sold by Azure](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure)、[How to use vision-enabled chat models](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/gpt-with-vision)

#### B1.2 Implement retrieval-augmented generation (RAG) in an application
RAG 三步：**Retrieve**（查索引）→ **Augment**（把检索片段和问题拼成提示）→ **Generate**（模型基于 grounding data 回答并给引用）。Foundry 里的实现路径按控制程度排序：

1. **Agent + 知识工具**（最少代码）：`AzureAISearchTool`（`index_connection_id`、`index_name`、`query_type` 取 `simple` / `semantic` / `vector` / `vector_simple_hybrid` / `vector_semantic_hybrid`，默认 `vector_semantic_hybrid`，`top_k` 默认 5，可加 `filter`）；索引需要可检索的 `Collection(Edm.Single)` 向量字段和含 URL/标题的字段，回答里以 `url_citation` 注解给引用。或者连接 **Foundry IQ** knowledge base（agentic retrieval、权限感知）。用户临时文档用 **File search**：上传文件 → 建 vector store → `FileSearchTool(vector_store_ids=[...])`。
2. **自建 RAG 应用**（完全控制）：用 Azure AI Search SDK 查询（hybrid + semantic ranker），自己拼 prompt，用 Foundry SDK 调模型。

要点：检索内容当作**不可信输入**（system message 里限定只用检索内容回答、要求引用）；检索加嵌入会增加延迟和 token；用 Groundedness / Relevance / Retrieval 评估器验证质量；"需要新知识或私有数据 → RAG，需要改风格或任务表现 → 微调"。

来源：[Retrieval augmented generation (RAG) and indexes in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/retrieval-augmented-generation)、[Connect an Azure AI Search index to Foundry agents](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/ai-search)、[File search tool for Microsoft Foundry agents](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/file-search)

#### B1.3 Design workflows, tool-augmented flows, and multistep reasoning pipelines
**工具增强流程**的基本循环（Chat Completions）：请求带 `tools`（每个是 `{"type": "function", "function": {"name", "description", "parameters": JSON Schema}}`）和 `tool_choice`（`auto` 默认 / `none` 强制回文本 / 指定函数名强制调用）；模型返回 `tool_calls`，应用执行函数后把结果以 `role: "tool"` 消息附上 `tool_call_id` 回传，再请求一次得到最终答案；支持 **parallel function calling**（一次返回多个 `tool_calls`）。Responses API 的对应是 `function_call` 输出项与 `function_call_output` 输入项。描述上限 1,024 字符，好的 description 比 prompt 更能提升调用准确率。

**工作流**用 Microsoft Agent Framework：**executors** 通过 **edges** 组成图（`WorkflowBuilder`），支持条件边、fan-out / fan-in、checkpoint 与恢复、human-in-the-loop（request/response）、工作流本身可当作 agent；内置编排模式 Sequential、Concurrent、Handoff、Group Chat、Magentic。选择规则：开放式对话、需要自主规划 → agent；步骤明确、要控制执行顺序、多 agent/函数协同 → workflow；"能写成普通函数就别用 AI agent"。**多步推理**优先交给推理模型（`reasoning_effort`），非推理模型才用"分解任务、step by step"的提示技巧。

来源：[How to use function calling with Microsoft Foundry Models](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/function-calling)、[Microsoft Agent Framework Overview](https://learn.microsoft.com/en-us/agent-framework/overview/)、[Workflow capabilities](https://learn.microsoft.com/en-us/agent-framework/workflows/)、[Azure OpenAI reasoning models](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/reasoning)

#### B1.4 Evaluate models and apps, including detecting fabrications, relevance, quality, and safety
按考纲四个词对应评估器：

| 要测什么 | 评估器 | 输入 / 量表 |
|---|---|---|
| 幻觉（fabrication） | **Groundedness**（判分模型，1–5，阈值 3，看回答是否超出 context）、**Groundedness Pro**（Content Safety 服务，True/False，更严格、不需部署判分模型）、**Ungrounded Attributes**（对人物属性的无依据推断） | `response` + `context`（+ `query`） |
| 相关性 | **Relevance**（1–5）、**Retrieval**（检索片段是否相关，无需真值）、**Document Retrieval**（有 qrels 时算 NDCG / XDCG / Fidelity / Holes） | `query` + `response` / `context` |
| 质量 | **Coherence**、**Fluency**、**Response Completeness**（对照 ground truth 的召回面）、Similarity、F1 / BLEU / ROUGE / METEOR | 多数需 `ground_truth` |
| 安全 | Hate and Unfairness、Sexual、Violence、Self-Harm（0–7 严重度）、Protected Materials、Indirect Attack、Code Vulnerability | `query` + `response`，由 Foundry 评估服务打分 |

Groundedness 看**精确率**（没编造），Response Completeness 看**召回率**（没漏掉）。配置示例：`{"type": "azure_ai_evaluator", "name": "groundedness", "evaluator_name": "builtin.groundedness", "initialization_parameters": {"deployment_name": ...}, "data_mapping": {"context": "{{item.context}}", "response": "{{item.response}}"}}`；评估 agent 响应时用 `{{sample.output_items}}`。`evaluation_level` 可选 `turn`（默认）或 `conversation`（需要 `messages` 格式）。评估可在 portal 向导、SDK 云端运行或 CI/CD 里跑，结果在 portal 查看并可做 cluster analysis。

来源：[RAG evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/rag-evaluators)、[Built-in Evaluators Reference](https://learn.microsoft.com/en-us/azure/foundry/concepts/built-in-evaluators)、[Risk and Safety Evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/risk-safety-evaluators)

#### B1.5 Integrate generative workflows into applications by using Foundry SDKs and connectors
**Foundry SDK** 是薄客户端，所有 project API 走一个端点：Python `azure-ai-projects>=2.3.0` + `openai>=3.0.0`（1.x 对应 Foundry classic，不兼容）；.NET `Azure.AI.Projects` + `Azure.AI.Projects.Agents` + `Azure.AI.Extensions.OpenAI`（不要和预览包 `Azure.AI.Projects.OpenAI` 混装）；JS `@azure/ai-projects` 2.x；Java `azure-ai-projects` + `azure-ai-agents`。两个客户端分工：**project client** 做 Foundry 原生操作（connections、deployments、telemetry、evaluation rules），**OpenAI 兼容客户端** 跑 Responses、agents、evaluations、fine-tuning。更高层的 **Microsoft Agent Framework**（Python `agent-framework` 的 `FoundryChatClient`，.NET `Microsoft.Agents.AI.Foundry` 的 `AIProjectClient.AsAIAgent(...)`）依赖 Foundry SDK，用于 hosted agent 和多 agent 系统。

**连接器**就是 project **connections**：把 Azure AI Search、Application Insights、OpenAPI 服务的 API key、MCP 服务器、A2A 端点、Storage 等外部资源注册到 project，代码里 `project.connections.get(name).id` 拿到 `project_connection_id` 传给工具（`OpenAPITool(auth={"type": "connection", "security_scheme": {"project_connection_id": ...}})`、`MCPTool(project_connection_id=...)`、`A2ATool(project_connection_id=...)`），密钥不进代码。

来源：[Get started with Microsoft Foundry SDKs and endpoints](https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/sdk-overview)、[Microsoft Agent Framework Overview](https://learn.microsoft.com/en-us/agent-framework/overview/)、[Connect OpenAPI tools to Microsoft Foundry agents](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/openapi)

#### B1.6 Configure an application to connect to a Foundry project
连接三要素：**端点**——project endpoint 格式 `https://<resource-name>.services.ai.azure.com/api/projects/<project-name>`（portal 的 project Overview 页复制；有自定义子域名时替换 resource 名）；OpenAI 直连端点是 `https://<resource-name>.openai.azure.com/openai/v1`，Azure OpenAI 资源只有后者。**凭据**——`DefaultAzureCredential()`（本地 `az login`，云上自动用 managed identity）；REST 用 `az account get-access-token --scope https://ai.azure.com/.default` 的 Bearer token；OpenAI SDK 用 `get_bearer_token_provider(credential, "https://ai.azure.com/.default")`；API key 只在 `/openai/v1` 可用且不建议生产。**角色**——调用方（用户或应用的 managed identity）在 project 或 resource 上要有 **Foundry User**；只调用已发布 agent 端点用 **Foundry Agent Consumer**。常见排错：401 → token scope 不对或 key 失效；403 → 缺角色；"custom subdomain required" → 资源用的是区域端点。配置通常放环境变量（如 `AZURE_AI_PROJECT_ENDPOINT`、`AZURE_AI_MODEL_DEPLOYMENT_NAME`）。

来源：[Quickstart: Get started with Microsoft Foundry SDK](https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code)、[Get started with Microsoft Foundry SDKs and endpoints](https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/sdk-overview)、[Authentication and authorization in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/authentication-authorization-foundry)

## B2. Build agents by using Foundry {#b2}
Agent 板块的核心词汇：prompt agent / hosted agent、agent version、conversation、tool schema、FileSearchTool / AzureAISearchTool / FunctionTool / MCP / OpenAPI / A2A、Toolbox、Memory、Agent Framework 的编排模式与审批、agent 评估器。

#### B2.1 Define agent roles, goals, conversation-tracking approach, and tool schemas
**角色与目标**写在 `PromptAgentDefinition` 的 `instructions` 里（模型 + 指令 + 工具 = 一个 agent），每次 `project.agents.create_version()` 产生新版本，可回滚和对比。**对话跟踪**三种：无状态（每次 `responses.create(input=...)` 自带全部上下文）、`previous_response_id` 链式、**conversation**（`openai.conversations.create()` 后每次传 `conversation=conversation.id`，服务端保存 items；hosted agent 的 Responses 协议也由平台管理 conversation，Invocations 协议则自己管 session）。**工具 schema**：`FunctionTool(name, description, parameters={...JSON Schema...}, strict=True)`，`parameters` 要有 `type: object`、`properties`、`required`，严格模式还要 `additionalProperties: False`；OpenAPI 工具要求每个操作有 `operationId`（只能含字母、`-`、`_`）。工具描述决定模型会不会调、调得准不准，模糊描述是常见错因；portal 不执行 function tool，要用 SDK/REST 测试。多 agent 时每个 agent 一个明确职责，由 workflow 或 A2A 连接。

来源：[Quickstart: Get started with Microsoft Foundry SDK](https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code)、[Use function calling with Microsoft Foundry agents](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/function-calling)、[What is Microsoft Foundry Agent Service?](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)

#### B2.2 Build agents that integrate retrieval, function-calling, and conversation memory
三个能力各有标准写法：

- **检索**：`FileSearchTool(vector_store_ids=[vector_store.id])`——先 `openai.vector_stores.create()` 并上传文件（文件和向量库操作走 `{project_endpoint}/openai/v1`）；企业索引用 `AzureAISearchTool`；组织知识用 Foundry IQ。
- **函数调用**：agent 带 `FunctionTool`；`responses.create(..., extra_body={"agent_reference": {"name": agent.name, "type": "agent_reference"}})` 后遍历 `response.output`，对 `item.type == "function_call"` 的项执行本地函数，再以 `FunctionCallOutput(type="function_call_output", call_id=item.call_id, output=json.dumps(...))` 回传同一个 conversation。**run 10 分钟过期**，慢操作要先返回状态再轮询。工具参数和输出都当不可信输入，不要在输出里带密钥。
- **对话记忆**：会话内用 conversation；跨会话用 **Memory** 的 memory search tool（自动抽取用户画像、聊天摘要、流程记忆，`scope` 用 `{{$userId}}`），配额每 store 100 个 scope、每 scope 10,000 条记忆，不支持 VNet。

Agent Framework 路径：`@tool` 装饰的 Python 函数直接放进 `Agent(client=FoundryChatClient(...), tools=[...])`，框架自动完成调用循环。

来源：[File search tool for Microsoft Foundry agents](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/file-search)、[Use function calling with Microsoft Foundry agents](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/function-calling)、[What is Memory?](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory)

#### B2.3 Integrate agent tools, including APIs, knowledge stores, search, content understanding, and custom functions
| 工具 | 类 / 配置 | 认证 | 备注 |
|---|---|---|---|
| 外部 REST API | `OpenAPITool(spec, auth={"type": "anonymous" / "connection" / "managed_identity"})` | 匿名、project connection 里的 key/token、project managed identity（需在目标资源授最小角色，否则 401） | OpenAPI 3.0/3.1，必须有 `operationId` |
| MCP 服务器 | `MCPTool(server_label, server_url, require_approval, allowed_tools, project_connection_id)` | key、Entra、OAuth 身份透传 | Azure DevOps MCP、Azure Functions MCP webhook、Toolbox 端点都走 MCP |
| 另一个 agent | `A2ATool(a2a_version=A2AProtocolVersion.V1_0, project_connection_id)` | 连接类型 `RemoteA2A` | 调用 Foundry agent 需对方启用 incoming A2A 并授 Foundry Agent Consumer |
| 搜索与知识库 | `AzureAISearchTool`、`FileSearchTool`、Foundry IQ、SharePoint、Fabric IQ、Web search / Grounding with Bing | 连接 | 私网下 Bing / Web search / SharePoint 走公网端点 |
| Content Understanding 等 Foundry Tools | Foundry portal 的 Content Understanding Tool、Azure Language MCP server（Tool Catalog）、或用 OpenAPI/函数包装 REST API | 连接 / managed identity | 把文档 / 图片 / 音视频变成结构化字段喂给 agent |
| 自定义函数 | `FunctionTool`（客户端执行，不能进 Toolbox） | — | 适合内部逻辑、数据库查询 |

推荐把可共享的工具放进 **Toolbox**：一个 MCP 端点、集中凭据、版本提升不改 agent 代码、tool search 避免几百个工具撑爆上下文。

来源：[What is Toolbox in Microsoft Foundry?](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview)、[Connect OpenAPI tools to Microsoft Foundry agents](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/openapi)、[Connect agents to MCP server endpoints](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/model-context-protocol)、[What is Azure Content Understanding in Foundry Tools?](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview)

#### B2.4 Implement orchestrated multi-agent solutions
三条路：

1. **Microsoft Agent Framework 编排**（推荐）：**Sequential**（依次传递）、**Concurrent**（并行后聚合）、**Handoff**（按上下文转交控制权，默认可与用户多轮交互）、**Group Chat**（共享对话协作）、**Magentic**（manager agent 动态调度专家 agent）；底层是 workflow 图，支持 checkpoint 和 HITL；打包成 hosted agent 部署到 Foundry。
2. **Foundry workflows（preview）**：portal 可视化/YAML 的声明式编排，模板 Human in the loop、Sequential、Group chat，节点有 Agent、if/else、go to、for each、设变量（Power Fx）、问问题；不支持 hosted agent 节点。官方已宣布 **2026-12-01 退役**，迁移到 Agent Framework（YAML 可导出复用）、Azure Logic Apps（纯可视化）或 A2A（轻量两 agent 互调）。
3. **A2A 协议**：把一个 Foundry agent 暴露为 A2A 端点，另一个 agent 用 `A2ATool` 调用；A2A v1.0 GA（JSON-RPC，仅文本、不支持流式）。

旧的 **Connected Agents**（classic Agents API 的 `agent.as_tool`）在新 Agent Service 中不可用，替代就是上面三条。

> **考点** "manager 根据任务动态挑选专家 agent" → Magentic；"按固定顺序一步步处理" → Sequential；"客服先分流再转给专科 agent 并继续对话" → Handoff。

来源：[Workflow orchestrations in Agent Framework](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/)、[Build a workflow in Microsoft Foundry (Preview)](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow)、[Connect to an A2A agent endpoint from Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/agent-to-agent)

#### B2.5 Build autonomous or semiautonomous workflows with safeguards and approval flow controls
半自主 = 关键动作前停下来等人。实现层级：

- **工具级审批（Agent Framework）**：Python `@tool(approval_mode="always_require")`；运行后检查 `result.user_input_requests`，每项带 `function_call.name` / `arguments`，用 `user_input_needed.to_function_approval_response(True/False)` 包成 user `Message` 连同同一个 `AgentSession` 再 `run`，循环直到没有待审批项；.NET 用 `ApprovalRequiredAIFunction` 包装 `AIFunction`，检查 `ToolApprovalRequestContent` 并 `CreateResponse(true)`。默认审批响应必须绑定到同一 session 里的待审批请求，防止伪造。
- **工作流级暂停**：executor 用 `ctx.request_info()` 发出 `request_info` 事件，外部拿到 `request_id` 后 `workflow.run(responses={...})` 恢复；.NET 用 `RequestPort` 和 `RequestInfoEvent`；checkpoint 会保存待处理请求，可跨进程恢复。编排里的审批工具同样触发暂停。
- **服务级**：MCP 工具 `require_approval="always"` 与 `mcp_approval_response`；agent guardrail 扫 tool call / tool response；Foundry workflow 的 Human in the loop 节点。

设计规则：会改数据、花钱、不可逆的动作必须审批；只读查询可 `never_require`；红队文档的分级——禁止动作永不允许、高风险需人工确认、不可逆需披露加确认。

来源：[Using function tools with human in the loop approvals](https://learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval)、[Microsoft Agent Framework Workflows - Human-in-the-loop](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop)、[Connect agents to MCP server endpoints](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/model-context-protocol)、[AI Red Teaming Agent](https://learn.microsoft.com/en-us/azure/foundry/concepts/ai-red-teaming-agent)

#### B2.6 Integrate monitoring into deployed agents, evaluate agent behavior, and perform error analysis
**监控**：连接 Application Insights 后服务端追踪自动开启；Monitor 标签看 token、延迟（>10 秒要查限流或工具）、run success rate（<95% 要排查）、评估分；配置 continuous evaluation / scheduled evaluation / red team scans / alerts。**评估 agent 行为**用 agent 评估器，分**系统评估**（结果）和**过程评估**（步骤）：

| 评估器 | 问题 |
|---|---|
| Intent Resolution（1–5） | 听懂用户意图了吗 |
| Task Adherence（pass/fail） | 遵守指令和约束了吗 |
| Task Completion（pass/fail） | 任务端到端完成了吗 |
| Task Navigation Efficiency | 步骤是否符合预期路径（需 `expected_actions`，`exact_match` / `in_order_match` / `any_order_match`） |
| Tool Call Accuracy（1–5）、Tool Selection、Tool Input Accuracy、Tool Output Utilization、Tool Call Success | 选对工具、参数对、用了结果、没报错 |
| Output Quality / Tool Use Quality（composite） | 一次 LLM 调用打包多项，省成本 |

输入用 `query` + `response` + `tool_definitions`，或 `messages` 数组（含 tool_call / tool_result）。Azure AI Search、Bing、Code Interpreter 等工具对 tool 类评估器支持有限。**错误分析**：对完成的评估运行做 **cluster analysis**（按语义相似把失败样本分簇，给出簇描述与改进建议，结果不保存需下载）；再按 trace ID 回到 Traces 看是哪一步出错。Agent Framework 里 `evaluate_agent(agent, queries, evaluators=FoundryEvals(...), num_repetitions=3)` 可测稳定性。

来源：[Agent Evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/agent-evaluators)、[Evaluation Cluster Analysis](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/cluster-analysis)、[Monitor agents with the Agent Monitoring Dashboard](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard)、[Evaluation in Agent Framework](https://learn.microsoft.com/en-us/agent-framework/agents/evaluation)

## B3. Optimize and operationalize generative AI systems {#b3}
优化题：提示与参数、反思/自评循环、可观测性、多模型与规则引擎的混合编排。注意推理模型（GPT-5、o-series）和非推理模型的技巧不通用。

#### B3.1 Tune generation behavior, such as prompt engineering and adjusting model parameters
提示的组成：**instructions**（放开头，必要时结尾重复——recency bias）、**primary content**、**examples**（zero / one / few-shot，Chat Completions 里用 user/assistant 示例对）、**cue**（引导输出开头）、**supporting content**。技巧：明确具体、用分隔符或 Markdown/XML 划清结构、分解任务、要求引用来源、给模型"退路"（答不出就说 not found）、提供 grounding 数据、指定输出结构（structured outputs 更可靠）。参数：**temperature**（0–2，低更确定）与 **top_p** 二选一调；`max_tokens` / `max_output_tokens` 控制长度也影响速率估算；`stop` 序列。推理模型例外：不支持 temperature 等采样参数，用 `reasoning_effort`（`none` / `minimal` / `low` / `medium` / `high` / `xhigh` / `max`，各模型支持不同；`gpt-5.1` 默认 `none`），`developer` 消息等同 system 消息但不要同时给两者，chain-of-thought 提示技巧不适用且文档明确说"不推荐"。

来源：[Prompt engineering techniques](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering)、[Azure OpenAI reasoning models](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/reasoning)、[How to use structured outputs](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/structured-outputs)

#### B3.2 Implement model reflection, chain-of-thought evaluations, and self-critique loops
这条 Learn 上没有单独的页面，考点散落在三处。**Chain-of-thought**：对非推理模型，可要求"step by step、先给推理再给 `ANSWER is: <name>`"来提高准确率并便于评估；对推理模型，chain of thought 由模型内部完成，只能通过 Responses API 的 **reasoning summary**（`summary: auto / concise / detailed`，GPT-5 系列不支持 concise）查看摘要，用其他手段抽取原始推理违反 Acceptable Use Policy。**反思 / 自评循环**的工程化形态是"评估器驱动的闭环"：**Agent optimizer**（evaluate baseline → generate candidates → evaluate candidates → rank）——eval model 按评估标准给二值分，optimization model（`gpt-5` 等）重写 instructions、skills、工具描述或换模型，综合分 0–1，提升 <0.03 视为噪声、0.03–0.10 值得部署；也可以自己用 LLM-as-judge 评估器（Groundedness、Relevance、Task Adherence）做"生成 → 评审 → 修正"的工作流（Sequential 或 Group Chat 编排里放一个 reviewer agent）。Agent Framework 的 `evaluate_agent(..., num_repetitions=3)` 可检测非确定性。注意 LLM 判分本身非确定、可能误报，结果要人工复核。

> **提示** 不要把"让模型自己说出推理过程"写进对推理模型的 system prompt——文档明确说这不受支持。

来源：[Prompt engineering techniques](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering)、[Azure OpenAI reasoning models](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/reasoning)、[Agent optimizer in Foundry Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-optimizer-overview)、[Evaluation in Agent Framework](https://learn.microsoft.com/en-us/agent-framework/agents/evaluation)

#### B3.3 Set up observability by implementing tracing, token analytics, safety signals, and latency breakdowns
Foundry 可观测性三件套：**Evaluation**、**Monitoring**、**Tracing**，全部落到 **Azure Monitor Application Insights**。设置顺序：在 project 的 Agents → Traces 页 **Connect** 一个 App Insights 资源（或 Manage → Project details → Connected resources 添加）；prompt / hosted agent 的服务端追踪随即自动记录，90 天可查；自己的应用代码要加客户端追踪（Python `pip install azure-ai-projects azure-identity opentelemetry-sdk azure-core-tracing-opentelemetry`；.NET 先 `AppContext.SetSwitch("Azure.Experimental.EnableGenAITracing", true)`）；本地开发可用 VS Code 的 Foundry Toolkit 本地 OTLP collector。查看者需要 **Log Analytics Reader**。**Token 分析**：每个 span 记录 token 消耗，dashboard 汇总 token usage，Azure Monitor 资源级指标看 token consumption；**延迟分解**：span 的开始/结束时间天然给出每个模型调用、工具调用的耗时，trace 视图按调用顺序展开，可定位延迟尖峰；**安全信号**：guardrail 注解、安全评估器得分、红队结果都进 dashboard，可设 alert。追踪可能含敏感内容，要脱敏并按生产日志同等管控。

来源：[Set Up Tracing for AI Agents in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-setup)、[Agent tracing overview](https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept)、[Monitor agents with the Agent Monitoring Dashboard](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard)

#### B3.4 Orchestrate multiple models, flows, or hybrid LLM and rules engines
**多模型**：最省事的是 **model router**——一个部署、按请求路由到 OpenAI / Anthropic / xAI / DeepSeek / Meta 等底层模型，Routing mode Balanced / Cost / Quality，**model subset** 限定候选并兼作故障转移集合（至少选两个），上下文窗口受最小底层模型限制，按输入提示计费，只影响文本路由（图像输入可过但不参与决策，不支持音频）。更细的控制用 Agent Framework workflow：不同 executor 绑定不同模型（便宜模型分类、强模型生成）。**流程混合规则引擎**：workflow 的条件边和普通函数 executor 就是规则——官方原则"能用函数解决就不要用 agent"；Foundry workflow（preview）用 if/else 节点和 Power Fx 表达式做分支；Azure Language 的 Intent Routing agent 提供确定性的意图路由。**治理层**：AI Gateway（APIM）在模型前统一限流和配额；Azure Policy 约束可部署模型。

来源：[Model router for Microsoft Foundry concepts](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-router)、[Microsoft Agent Framework Overview](https://learn.microsoft.com/en-us/agent-framework/overview/)、[Build a workflow in Microsoft Foundry (Preview)](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow)、[Configure AI Gateway in your Foundry resources](https://learn.microsoft.com/en-us/azure/foundry/configuration/enable-ai-api-management-gateway-portal)

## C1. Design and implement image- and video-generation solutions {#c1}
新板块：GPT-image 系列和 Sora 2。考的是端点、参数、编辑方式（mask / 参考图 / remix）和平台控制（尺寸、质量、内容过滤、C2PA）。DALL-E 3 已于 2026-03-04 退役，题目里出现它基本是干扰项。

#### C1.1 Implement a solution that generates images from text prompts and reference media
模型：GA 的 **GPT-Image-2.5-Sunburst**（最强，编辑精度最好）、**GPT-Image-2.5-Flare**（最快）、**GPT-Image-2**（高分辨率 / 4K、宽比例）；`gpt-image-1`、`gpt-image-1.5`、`gpt-image-1-mini` 为受限访问预览。**文生图**走 `POST .../openai/v1/images/generations`（或 `/openai/deployments/<deployment>/images/generations`），SDK `client.images.generate(model=<部署名>, prompt, size, quality, n, output_format)`；GPT-image 模型只返回 `b64_json`，不支持 `response_format`。**参考媒体**走 `images/edits`（`multipart/form-data`），`image[]` 最多 16 张 PNG/JPG（每张 <50 MB）加 `prompt`，可带 `input_fidelity` 保持人脸和风格。在 agent 里用 **image generation tool**：`ImageGenTool(model="gpt-image-1", quality, size)` 挂到 `PromptAgentDefinition`，调用 Responses 时加请求头 `x-ms-oai-image-generation-deployment: <部署名>`，输出项 `type == "image_generation_call"` 的 `result` 是 base64。默认速率 5 张/分钟/部署。

来源：[Image generation and editing with Azure OpenAI](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/dall-e)、[Use the image generation tool in Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/image-generation)、[Foundry Models sold by Azure](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure)

#### C1.2 Implement a solution that generates videos from text prompts and reference media
**Sora 2（preview）**从文本、图像或视频生成带音频的视频。调用是**异步作业**：`POST {endpoint}/openai/v1/video/generations/jobs` 带 `prompt`、`model`、`height`/`width`、`n_seconds`、`n_variants`（1–4 个变体）；然后轮询 `GET .../video/generations/jobs/{job_id}`，`status` 到 `succeeded` / `failed` / `cancelled` 为止；成功后从 `generations` 里取 ID 下载 MP4。**参考媒体**用 multipart 上传并在 `inpaint_items` 里以 `file_name` 引用——传图片即图生视频、传视频即视频生视频。Azure 对输入和输出都做内容过滤与滥用监控。要点：不要在同步请求里等结果；视频不是 Responses API 的一部分。

来源：[Sora 2 video generation overview (preview)](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/video-generation)

#### C1.3 Configure image-editing workflows, including inpainting, mask-based edits, and prompt-driven modifications
三种编辑都走 `images/edits`（multipart）：

- **Prompt 驱动修改**：只给 `image[]` 和 `prompt`（"Add a beach ball in the center"），模型按文字改整图；多张参考图可合成。
- **Mask / inpainting**：加 `mask` 文件——必须是 **PNG、与输入图同尺寸**，**alpha = 0（全透明）的像素**就是要重绘的区域，其余保留；配合 prompt 描述要填进去的内容。
- **保真度控制**：`input_fidelity` 决定输出多贴近原图风格和人脸（`gpt-image-1-mini` 不支持）；要求编辑精度时选 GPT-Image-2.5-Sunburst。

Agent 的 image generation tool 只做生成；需要 mask、编辑或 partial image 流式输出时，文档明确说用 Image API 直接调用。

> **考点** "只替换图中某个区域、其他不变" → mask 的透明像素标记编辑区；"换成 JPEG 格式会怎样" → mask 必须 PNG 才能携带透明通道。

来源：[Image generation and editing with Azure OpenAI](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/dall-e)、[Use the image generation tool in Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/image-generation)

#### C1.4 Implement workflows to edit generated videos
Sora 2 文档给了两条编辑路径：**Remix**——对已有视频做"针对性调整"而不是整段重生成；**video-to-video**——把源视频作为 `inpaint_items` 之一上传，用新 prompt 生成变体（`n_variants` 控制数量）。流程仍是异步作业：提交 → 轮询 → 下载。Learn 上关于视频编辑的细节比图像少得多（没有逐帧 mask、裁剪或拼接 API 的说明），考试层面掌握"remix / 以视频为输入再生成 + 异步作业 + 内容过滤同样适用"即可；精细剪辑属于视频编辑软件的工作，不在 Foundry 范围内。

来源：[Sora 2 video generation overview (preview)](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/video-generation)

#### C1.5 Select and apply appropriate generation and editing controls provided by the platform
| 控制 | 取值 / 行为 |
|---|---|
| `size` | GPT-image-1 系列 `1024x1024` / `1024x1536` / `1536x1024`；GPT-image-2 可自定 `WIDTHxHEIGHT`（两边为 16 的倍数、长边 ≤ 3840、比例 ≤ 3:1）；`auto` |
| `quality` | `low` / `medium` / `high`（多数默认 high，mini 默认 medium），新模型还有 `xhigh` / `max` / `auto`；低质量更快更便宜 |
| `n` | 每请求 1–10 张 |
| `output_format` / `output_compression` | `png`（默认）或 `jpeg`，压缩 0–100 仅 JPEG；agent 工具另支持 `webp` |
| `background` | `transparent` 需 PNG 输出 |
| `moderation` | agent 工具里 `auto` / `low` |
| `stream` + `partial_images` | 1–3 张中间图，事件 `image_generation.partial_image` |
| 视频 | `n_seconds`、`height`/`width`、`n_variants` |

安全与来源：图像 API 自带内容审核，命中时报 `content_policy_violation` 或作业 `error.code: contentFilter`（"Your task failed as a result of our safety system" 是提示被拦，"Generated image was filtered" 是输出被拦）；未成年人写实图默认屏蔽；所有生成图自动嵌入 **Content Credentials（C2PA）**。配额默认 5 张/分钟，可在 Quota 页申请提高。

来源：[Image generation and editing with Azure OpenAI](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/dall-e)、[Use the image generation tool in Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/image-generation)、[Content Credentials in Azure OpenAI](https://learn.microsoft.com/en-us/azure/foundry-classic/openai/concepts/content-credentials)

## C2. Design and implement multimodal understanding workflows {#c2}
三套工具要分清：**多模态 LLM**（GPT-4o / 4.1 / 5 看图回答，灵活但无置信度）、**Azure Vision Image Analysis 4.0**（caption、dense captions、objects、people、OCR，便宜确定，但已宣布 2028-09-25 退役）、**Content Understanding**（按 schema 输出字段 + 置信度 + grounding，支持图像和视频）。

#### C2.1 Build a solution that analyzes visual context by using multimodal models
Chat Completions 里把图片作为 user 消息的 content 数组元素：`{"type": "image_url", "image_url": {"url": "<https URL 或 data:image/jpeg;base64,...>", "detail": "high"}}`，与 `{"type": "text", "text": "Describe this picture:"}` 并列；每次请求最多 10 张图。`detail` 控制成本与精度：`low` 只看 512×512 低分辨率版本（快、省 token），`high` 先看低分辨率再切成多个 512×512 片段细看（每片翻倍 token），`auto` 由模型决定。Responses API 对应 `input_image`。模型要选 "Text and image processing" 能力的（GPT-4o、GPT-4.1 系列、GPT-5 系列、o3/o4-mini）。选型：开放式理解、推理、多轮追问 → 多模态 LLM；固定字段 + 置信度 + 可追溯 → Content Understanding；只要标签/OCR/人物框 → Image Analysis。本地文件先 base64 编码再放进 data URI。

来源：[How to use vision-enabled chat models](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/gpt-with-vision)、[What is Image Analysis?](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-image-analysis)、[Azure Content Understanding image overview](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/image/overview)

#### C2.2 Configure apps to produce concise or detailed captions for single or multiple images
**简短**：Image Analysis 4.0 的 **Caption** 返回一句话描述 + `confidence`（`features=caption`，响应在 `captionResult`）；**详细**：**Dense Captions** 对整图加最多 10 个区域各给一句话并返回 `boundingBox`（`features=denseCaptions`，响应在 `denseCaptionsResult`）。两者仅英文、仅部分区域可用（East US、West US、France Central、North Europe、West Europe、Southeast Asia、East Asia、Korea Central），`gender-neutral-caption=true` 把 man/woman/boy/girl 换成 person；输入 ≤20 MB、50×50 到 16000×16000。**多张图或可控长度**用多模态 LLM：一次请求放多个 `image_url`（≤10），prompt 指定"一句话"或"分段详细描述"，`detail` 按需求调；Content Understanding 的 `prebuilt-imageSearch` 产出一段话描述用于检索。

来源：[Image captions - Image Analysis 4.0](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/concept-describe-images-40)、[How to use vision-enabled chat models](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/gpt-with-vision)、[Azure Content Understanding prebuilt analyzers](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/prebuilt-analyzers)

#### C2.3 Implement a solution that enables question-answering grounded in visual evidence
视觉问答就是"图 + 问题"的多模态调用，"接地于视觉证据"靠两件事：**提示约束**——system message 要求只根据图中可见内容回答、引用图中位置或文字、看不到就回答 "not found"（prompt engineering 文档的"给模型退路"和"要求引用"）；**结构化输出**——用 `response_format` / `text.format` 的 JSON schema 让模型返回 `answer` + `evidence` 字段，便于校验。需要可审计的证据时用 **Content Understanding**：图像 analyzer 用 `generate` / `classify` 方法的字段按 schema 作答，文档 analyzer 更能给 `confidence` 和 `source`（页码 + 多边形坐标）；文字为主的图片应走 document analyzer 而非 image analyzer。多轮追问用 conversation 保留图像上下文。

来源：[How to use vision-enabled chat models](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/gpt-with-vision)、[Prompt engineering techniques](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering)、[Azure Content Understanding image overview](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/image/overview)

#### C2.4 Configure generation of alt-text and extended image descriptions aligned to accessibility guidelines
Learn 的官方用例页把 **Image Analysis caption 直接当 alt text**（`<img alt="An elephant in a grassland.">`），供 Narrator、JAWS、NVDA 等读屏器使用，也有利于 SEO。最佳实践：设**置信度阈值**（3.2 版建议 0.4，4.0 版建议 0.0）低于阈值的交人工；用 4.0 的 **gender-neutral captions** 避免性别误判这类"尴尬错误"；注意语言限制（4.0 仅英文，3.2 支持英、中、葡、日、西）。**扩展描述**（长描述）用多模态 LLM：prompt 里要求"先一句简短 alt text，再一段描述图表数据/场景细节/文字内容"，或用 Dense Captions 的区域描述拼装。微软自家 PowerPoint、Word、Edge 就是用 Image Analysis 生成 alt text。

来源：[Overview: Generate alt text of images with Image Analysis](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/use-case-alt-text)、[Image captions - Image Analysis 4.0](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/concept-describe-images-40)、[How to use vision-enabled chat models](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/gpt-with-vision)

#### C2.5 Implement visual understanding by configuring Azure Content Understanding in Foundry Tools to extract visual characteristics
Content Understanding 把图像变成**按你定义的 schema 输出的结构化数据**。做法：创建 analyzer（`baseAnalyzerId: "prebuilt-image"`），在 `fieldSchema.fields` 里定义字段——`type`（string / number / array / object…）、`method`（图像只支持 `generate` 和 `classify`，`extract` 仅文档）、`description`、`enum`，例如 `ChartType: {type: string, method: classify, enum: [bar, line, pie]}`；分析时 `POST /analyzers/{id}:analyze` 返回 202，轮询 `Operation-Location`。典型场景：图表与趋势分析、制造缺陷检测（划痕、裂纹、错位）、货架商品检测与计数、RAG 索引。现成的 `prebuilt-imageSearch` 产出一段描述。注意：图像 analyzer 不适合以文字为主的图片——这类用 document schema。模型由你在 Foundry 的部署提供（`models.completion`）。

来源：[Azure Content Understanding image overview](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/image/overview)、[Build a RAG solution with Azure Content Understanding](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/tutorial/build-rag-solution)、[Azure Content Understanding prebuilt analyzers](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/prebuilt-analyzers)

#### C2.6 Implement video analysis workflows to process and interpret video segments
视频分两阶段。**Content extraction**：转写（WEBVTT，含 diarization 和多语言；`returnDetails: true` 给句级时间戳）、关键帧抽取、镜头检测（`cameraShotTimesMs`）。**Field extraction**：生成模型按 `fieldSchema` 为每个片段填字段（如 `brandLogo` generate、`Sentiment` classify）。**分段**用 `enableSegment`：`false` 把整段视频当一个 segment（合规检查、全片摘要）；`true` 加 `contentCategories` 用自然语言描述切分逻辑（如"按新闻故事切分、忽略广告"）。现成的 `prebuilt-videoSearch` 直接输出可入向量库的 Markdown：每段的描述、转写、关键帧。限制：约 1 FPS 采样、帧缩到 512×512（小字/远处物体可能丢）、只转写语音不处理音乐音效。

来源：[Azure Content Understanding video overview](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/video/overview)、[Azure Content Understanding prebuilt analyzers](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/prebuilt-analyzers)

#### C2.7 Configure single-task and pro-mode Content Understanding pipelines
考纲用的还是旧词。**Standard（单任务）模式**：默认，一个 analyzer 对一个文件做内容抽取 + 字段抽取，可开 `estimateFieldSourceAndConfidence` 拿置信度和 grounding，成本低、延迟低，是生产主力（GA API `2025-11-01`）。**Pro mode** 只存在于已退役的 `2025-05-01-preview`（多文档输入 + 参考数据做推理），它的继任者是 **agentic mode**（`2026-06-01-preview`）：在 document analyzer 的 `config.workflow` 设 `"agentic"`（创建后解析为 `agentic.2026-06-01-preview`），用于**答案必须从证据推导**的场景——多步推理、计算（合计、对账）、按条件验证、复杂表格/图形分析，输出仍符合 schema。限制：仅文档、每次一个输入文件（文件内可含多份逻辑相关文档，如合同 + 附录）、不支持 `extract` 字段和标注样本、更多 token（建议 ≥400K TPM）和更高的 contextualization 费率。分类/路由用 composed analyzer（如 `prebuilt-procurement` 先分类再路由）。

> **考点** "发票要与合同条款核对一致" → agentic（原 pro）模式；"大批量发票抽字段、要置信度" → standard 模式。

来源：[Agentic mode overview for document analysis (preview)](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/agentic-mode)、[What is Azure Content Understanding in Foundry Tools?](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview)、[Azure Content Understanding document overview](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/document/overview)

#### C2.8 Implement solutions that identify objects, components, or regions within images or video
按精度和定制需求选：

- **Image Analysis 4.0 Objects**（`features=objects`）：返回 `name`、`confidence`、`boundingBox`（像素）；限制——小于图像 5% 的物体、紧密堆叠的物体通常检测不到，不区分品牌/型号。**People**（`features=people`）返回人物框。
- **品牌 / logo**：Image Analysis 3.2 的 **Brands**（`visualFeatures=Brands`，数千个全球 logo，返回名称 + 矩形）；自有 logo 或零件用 **Azure AI Custom Vision** 训练对象检测模型（Image Analysis 4.0 的 model customization 已于 2025-03-31 退役）。
- **语义级识别**：Content Understanding 图像 analyzer 用 `generate`/`classify` 字段描述部件、缺陷；文档 analyzer 的字段带 `source` 多边形坐标；视频按 segment 识别品牌出现。
- **多模态 LLM** 擅长描述"图里有什么"，但不保证可靠的坐标。

来源：[Object detection using Image Analysis 4.0](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/concept-object-detection-40)、[What is Image Analysis?](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-image-analysis)、[Brand detection](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/concept-brand-detection)、[Azure Content Understanding image overview](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/image/overview)

## C3. Implement responsible AI for multimodal content {#c3}
视觉内容的安全：Content Safety 的图像与多模态 API、Foundry guardrails 对图像的覆盖、图中文字造成的间接注入、以及水印 / 禁止符号 / 品牌 / 不当内容四类策略。

#### C3.1 Implement filters to classify unsafe or disallowed visual content
**Azure AI Content Safety** 的 **Analyze image** API 对图像按 Hate、Sexual、Violence、SelfHarm 四类给严重度，图像模型用**裁剪量表 0 / 2 / 4 / 6**（文本是 0–7）；**Multimodal（image with text）** API `POST {endpoint}/contentsafety/imageWithText:analyze` 同时分析图像、图中文字（`enableOcr: true`，最多识别 1000 字符）和附带 `text`，输入 base64 或 blob URL、≤4 MB、50×50 到 7200×7200，动图取第一帧。Foundry **guardrails** 对模型的图像输入/输出同样生效，图像用裁剪量表、图文多模态用完整 0–7。图像生成 API 内置过滤。旧方案：Image Analysis 3.2 的 `visualFeatures=Adult` 返回 `isAdultContent` / `isRacyContent` / `isGoryContent` 和 0–1 分数（文档提示新项目用 Content Safety）。Content Safety Studio 可先试阈值再导出代码。

来源：[What is Azure AI Content Safety?](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview)、[Quickstart: Analyze multimodal content](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/quickstart-multimodal)、[Harm categories and severity levels in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/content-filter-severity-levels)、[Detect adult, racy, or gory content](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/concept-detecting-adult-content)

#### C3.2 Detect and mitigate indirect prompt injection by using embedded text in images
风险：产品单页、截图里藏着"忽略之前的指令并…"，被多模态模型或 RAG 当成指令执行。**Prompt Shields** 把这类攻击归为 **document attacks（indirect attacks）**，子类有 manipulated content、access to system infrastructure、information gathering、availability、fraud、malware 等，在 Foundry guardrail 里于 **user input** 和 **tool response** 两个 intervention point 扫描（后者正好覆盖检索/工具带回的文档）。图中文字的处理链：先 OCR（多模态 Content Safety 的 `enableOcr`、Vision Read、Content Understanding），再把文字作为 `documents` 交给 Content Safety 的 **shieldPrompt**（一次 `userPrompt` + 最多 5 个 `documents`，返回 `attackDetected`）或让 guardrail 的 document attack 控制扫描；**Spotlighting（preview）**把文档内容 base64 标记为低信任（仅 Chat Completions，会增加 token）。系统提示把检索内容声明为不可信数据；评估阶段用 **Indirect Attack（XPIA）** 评估器和红队的 Indirect Jailbreak 策略验证。Learn 没有专门写"图像内嵌文字注入"的页面，以上是把 OCR 与 Prompt Shields 组合的推导。

> **考点** case study 里"产品图片可能含嵌入文字、agent 要防恶意指令"→ 对图中文字做 OCR 后过 Prompt Shields / indirect attack 控制，而不是只开 hate/violence 过滤。

来源：[Prompt Shields in Azure AI Content Safety](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection)、[Prompt Shields in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/content-filter-prompt-shields)、[Quickstart: Analyze multimodal content](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/quickstart-multimodal)、[Risk and Safety Evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/risk-safety-evaluators)

#### C3.3 Enforce visual policy rules, such as applying watermarks, flagging prohibited symbols, upholding brand usage requirements, and detecting potentially inappropriate content
| 策略 | 做法 |
|---|---|
| 水印 / 来源标识 | Azure OpenAI 生成图自动带 **Content Credentials（C2PA manifest）**，不需配置；用 contentcredentials.org/verify 或 CAI 开源工具校验；这是密码学签名的元数据而不是可见水印 |
| 禁止符号 | Content Safety 图像 Hate 类别本身覆盖纳粹旗、三 K 党符号等（Medium/High）；自定义符号用 **Custom categories (rapid)**——建 incident、上传少量图片样本、无需训练，即可在图像分析请求中匹配（standard 版仅文本且 2026-09-01 退役；blocklist 只做文本精确匹配） |
| 品牌使用规范 | Image Analysis 3.2 **Brands** 检测数千个商业 logo 并给位置；自家 logo 用 Custom Vision；Content Understanding 视频 analyzer 用 `brandLogo` 字段统计品牌露出以核对合规 |
| 不当内容 | Content Safety Analyze image / imageWithText（四类严重度）；模型侧 guardrail 对图像输入输出过滤；旧 Vision 3.2 Adult/Racy/Gory |

来源：[Content Credentials in Azure OpenAI](https://learn.microsoft.com/en-us/azure/foundry-classic/openai/concepts/content-credentials)、[Custom categories in Azure AI Content Safety (preview)](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/custom-categories)、[Brand detection](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/concept-brand-detection)、[Harm categories and severity levels in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/content-filter-severity-levels)

## D1. Apply language model text analysis {#d1}
文本板块的主线是"Azure Language（Foundry Tools）的预构建能力 vs 用 LLM 加 structured outputs 自己做"。注意 Language 的 legacy 功能（summarization、sentiment、key phrase 等）已公布 2029-03-31 退役并建议迁到 Foundry models，但考试里它们仍是正确答案的常见候选。

#### D1.1 Implement solutions to extract entities, topics, summaries, and structured JSON outputs by using generative prompting and Foundry Tools
两条路线：

- **Foundry Tools（Azure Language）**：**NER**（核心能力，预设类别 Person、Location、Organization、DateTime、Quantity、Event、Product、Address、PhoneNumber、Email、URL、IP 等，带置信度）；**Key phrase extraction**（主题/关键短语，legacy）；**Summarization**（legacy）——文本 **extractive**（挑原句 + rank score + 位置）/ **abstractive**（生成新句）、会话摘要（recap、issue/resolution、chapter title、narrative）、原生文档摘要（.pdf/.docx/.txt）。调用方式是 Language 资源的 analyze-text REST 或 `TextAnalyticsClient`，确定性、按文本量计费。
- **生成式提示 + Structured outputs**：Chat Completions 用 `response_format: {type: "json_schema", json_schema: {strict: true, schema}}`，Responses API 用 `text.format`；Python 用 `client.beta.chat.completions.parse(response_format=PydanticModel)` 或 `responses.parse(text_format=...)` 直接得到 `output_parsed`。Schema 限制：所有字段 `required`、每个对象 `additionalProperties: false`、≤100 个属性、≤5 层嵌套，不支持 minLength / pattern / minimum 等约束，可选字段用 `["string", "null"]`。与旧 **JSON mode** 的区别：JSON mode 只保证合法 JSON，不保证符合 schema。

判断：类别固定、量大、要置信度 → Language；类别自定义、要上下文理解、输出要嵌进应用对象 → LLM + structured outputs。

来源：[What is Azure Language in Foundry Tools](https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview)、[What is the named entity recognition (NER) feature](https://learn.microsoft.com/en-us/azure/ai-services/language-service/named-entity-recognition/overview)、[What is summarization?](https://learn.microsoft.com/en-us/azure/ai-services/language-service/summarization/overview)、[How to use structured outputs](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/structured-outputs)

#### D1.2 Configure detection of sentiment, tone, safety issues, and sensitive content
| 需求 | 服务 | 要点 |
|---|---|---|
| 情感 | Azure Language **Sentiment analysis** | 文档级和句子级标签 positive / neutral / negative（混合时 mixed），每类 0–1 置信度；**opinion mining** 把情感绑到具体 target（如"房间"）和 assessment（"很脏"） |
| 语气 / 风格 | LLM 分类提示 + structured outputs（enum 字段） | Language 没有"tone"功能，只能用模型做 |
| 安全问题 | **Azure AI Content Safety** Analyze text（Hate / Sexual / Violence / SelfHarm，0–7 严重度）、Prompt Shields、Protected material；Foundry guardrails | 文本和图像都支持，blocklist 做精确词匹配 |
| 敏感内容 / PII | Azure Language **PII detection**：Text PII（同步）、Conversation PII（异步、按轮次）、Document PII（.pdf/.docx/.txt，保留版式输出脱敏文件 + JSON）；返回实体类别、置信度和 `redactedText`，可指定类别和掩码方式 | Foundry guardrail 也有 PII 风险（preview） |

Content Understanding 的音频 analyzer 也能对通话转写做 `Sentiment` classify 字段。

> **易混** "判断客户评论是否负面"是 Sentiment；"判断文本是否含暴力威胁"是 Content Safety；"隐藏身份证号"是 PII detection 的 redaction。

来源：[What is sentiment analysis and opinion mining](https://learn.microsoft.com/en-us/azure/ai-services/language-service/sentiment-opinion-mining/overview)、[What is the PII detection feature in Azure Language?](https://learn.microsoft.com/en-us/azure/ai-services/language-service/personally-identifiable-information/overview)、[What is Azure AI Content Safety?](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview)

#### D1.3 Build solutions that translate text by using Azure Translator in Foundry Tools or LLM-powered translation flows
**Azure Translator** text translation 最新 GA 版 `2026-06-06`（相对 v3.0 有破坏性变更：请求用 `inputs`、响应用 `value`）：操作 **Languages**（无需认证）、**Translate**（一次译到多个目标语言）、**Transliterate**；端点 `api.cognitive.microsofttranslator.com`，可选全局 / 地理 / 资源专用端点决定 NMT 处理位置；认证用资源 key（`Ocp-Apim-Subscription-Key`）、bearer token 或 Entra。同一 API 可选模型：**NMT**（标准神经翻译，按源字符计费，单次最多 1,000 个元素、每个 50,000 字符）或 **LLM**（如 GPT-5.1，需要 Foundry 资源，按 token 计费，最多 50 个元素、每个 5,000 字符），LLM 路径支持 **tone**（formal / informal / neutral）、**gender** 控制和 **adaptive custom translation**（最多 5 条参考译文或自适应数据集影响术语风格）。**LLM 翻译流**也可以直接用 Responses API 写提示（带上下文、术语表），适合需要语境和风格的场景。路由建议：高量基线流量走 NMT，需要自适应/语气/上下文的走 LLM。

来源：[What is Azure text translation in Microsoft Foundry?](https://learn.microsoft.com/en-us/azure/ai-services/translator/text-translation/overview)、[Prompt engineering techniques](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering)

#### D1.4 Customize language model outputs for domain tasks, such as compliance summarization and domain extraction
定制手段按投入从低到高：

1. **提示工程**：system message 定义领域角色、术语和输出格式，few-shot 示例，grounding 上下文；合规摘要可要求"按条款逐条列出、引用原文、缺失项标 not found"。
2. **Structured outputs**：用 JSON schema 固化领域对象（字段名、枚举），抽取结果直接进系统。
3. **Azure Language 自定义模型**：**Custom NER**（定义 schema → 标注 → 训练 → 评估 precision/recall/F1 → 部署 → Analyze API 调用；标注要精确、一致、完整）用于合同、财务文档的领域实体；**Custom text classification** 做文档分类。
4. **Fine-tuning**（Foundry）：SFT（示范输出）、DPO（偏好对比）、RFT（grader 打分）、蒸馏；适合改风格/格式/schema、提升工具调用、让小模型专精；**不能代替 RAG 提供新知识，也不代替应用级安全控制**；需要留出验证集对比基线；部署可用 Developer（评估用，24 小时）、Global Standard、Standard、PTU。
5. **Content Understanding agentic mode** 用于合规核对类文档推理。

来源：[Fine-tuning in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/fine-tuning/overview)、[What is the custom named entity recognition (CNER) feature](https://learn.microsoft.com/en-us/azure/ai-services/language-service/custom-named-entity-recognition/overview)、[Prompt engineering techniques](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering)

## D2. Implement speech solutions {#d2}
语音在这版考纲里围绕 agent：Speech SDK 的 STT/TTS、Voice Live API（语音 agent 的一站式接口）、GPT Realtime API、Content Understanding 音频、以及语音翻译。

#### D2.1 Implement workflows to convert speech to text and text to speech for agentic interactions
**语音转文本**（Azure Speech in Foundry Tools）：**Real-time**（Speech SDK `SpeechRecognizer`，`SpeechConfig` + `AudioConfig`，单句 `recognize_once_async()` 或连续识别 `start_continuous_recognition()`，带中间结果；REST 短音频）、**Fast transcription**（同步、比实时更快，适合会议纪要、字幕）、**Batch transcription**（REST，大量文件异步）、**Custom speech**（领域词汇/声学条件）。附加能力：diarization（最多 35 个说话人）、phrase lists（即时加专有名词）、语言检测、双声道转写。**文本转语音**：`SpeechSynthesizer` 的 `speak_text_async()` / `speak_ssml_async()`，100+ 语言的标准神经声、HD 声、Azure OpenAI 声；**SSML** 调音高、停顿、语速、发音、多声；batch synthesis 处理 >10 分钟长音频；按字符计费（中文每字按 2 计）。Agent 场景两种架构：**级联**（STT → 文本模型 → TTS，模型和声音选择多、可控转写和断句，但每段都加延迟）或 **原生 speech-to-speech**（见 D2.2/D2.3）。

来源：[Speech to Text Overview](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-to-text)、[Text to speech overview](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech)、[What is Microsoft Foundry Agent Service?](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)

#### D2.2 Integrate speech as an agent modality, including custom speech models
**Voice Live API** 把语音识别、生成模型和语音合成合成一个 WebSocket 接口，全托管、不用自己部署模型：模型可选 `gpt-realtime*`（原生 speech-to-speech）、GPT-5 / 4.1 / 4o 系列（走 Azure STT + TTS）、`phi4-mm-realtime`；内置噪声抑制、回声消除、打断检测、end-of-turn 检测、avatar、function calling（VoiceRAG）；事件与 Azure OpenAI Realtime API 基本兼容；定价按模型分 Pro / Standard / Lite。**定制**：输入侧用 **phrase list**（轻量）或 **custom speech 模型**（上传文本/音频 + 人工转写 → 训练 → 用 WER 评估 → 部署到自定义端点，SDK 里指定 endpoint；只做 batch 可不部署端点），输出侧用 **custom voice**（受限访问）；自定义模型训练与托管另计费。**Foundry Agent Service 的 voice-based prompt agent**：在 portal/SDK 配置模型、指令、音频设置、问候语和工具，通过 Voice Live 的实时 WebSocket 连接，可接 Teams Phone / Twilio 电话渠道。

来源：[Voice Live API Overview](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/voice-live)、[Custom speech overview](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/custom-speech-overview)、[What is Microsoft Foundry Agent Service?](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)

#### D2.3 Enable multimodal reasoning from audio inputs
原生音频推理用 **GPT Realtime API**（`gpt-realtime`、`gpt-realtime-mini`、`gpt-realtime-2.1` 等，Global 部署，GA 路径 `/openai/v1/realtime`，不用 api-version）：连接方式 **WebRTC**（客户端，~100 ms）、**WebSocket**（服务端到服务端，~200 ms）、**SIP**（电话）；首个事件 `session.update` 配置 `voice`、`instructions`、`input_audio_transcription`、`turn_detection`（`server_vad` 按静音切分 / `semantic_vad` 按语义判断说完 / `none` 推按键说话，`create_response: false` 可先审核再回复）、`tools`，还支持 **image input** 和 **MCP** 工具；音频格式 pcm16、单声道、24 kHz；会话最长 60 分钟；输出以 `response.audio.delta` / `response.audio_transcript.delta` 流式返回。专用模型 `gpt-realtime-translate`、`gpt-realtime-whisper`、`gpt-live-transcribe` 按时长计费。**离线批量洞察**用 Content Understanding 音频 analyzer（`prebuilt-audioSearch`、`prebuilt-callCenter`：转写 + 摘要/情感/话题字段）。选型：实时对话 → Realtime / Voice Live；录音分析 → Content Understanding；只要文字 → STT。

来源：[Use the GPT Realtime API for speech and audio](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/realtime-audio)、[Azure Content Understanding prebuilt analyzers](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/prebuilt-analyzers)、[Voice Live API Overview](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/voice-live)

#### D2.4 Translate speech into other languages by using language models and Foundry Tools
**Speech 服务的语音翻译**（Speech SDK `TranslationRecognizer` + `SpeechTranslationConfig`：设置源语言、`add_target_language()`）实时返回源转写和译文，可合成语音做 speech-to-speech；一次调用最多 **2 个目标语言**，更多语言要用 Foundry 资源并按 Translator 字符计费；可用 custom speech 模型提升源识别。**Live Interpreter** 是增强版：不设输入语言、会话中可切换语言、用 personal voice 保留说话人风格、输出目标语言转写。**语言模型路径**：Realtime API 的 **translation session**（`/openai/v1/realtime/translations`，模型 `gpt-realtime-translate`，可传 ISO-639-1 语言提示）做持续语音翻译；或级联 STT → LLM（Translator 的 LLM 模式带 tone/gender 控制，或 Responses API 自定提示）→ TTS，适合需要语境和风格的翻译。Voice Live 可把翻译后的回复用标准或自定义声音播出。

来源：[Speech translation overview](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-translation)、[Use the GPT Realtime API for speech and audio](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/realtime-audio)、[What is Azure text translation in Microsoft Foundry?](https://learn.microsoft.com/en-us/azure/ai-services/translator/text-translation/overview)

## E1. Build retrieval and grounding pipelines {#e1}
Azure AI Search 的索引管线：indexer 四个阶段、skillset 与 enrichment tree、内置/自定义技能、OCR 和版面抽取、integrated vectorization、三种查询方式，以及如何把检索接到 agent。记住 Foundry IQ / agentic retrieval 是推荐的新路径，classic 管线是你要"看懂配置"的旧路径。

#### E1.1 Ingest and index content, such as documents, images, audio, and video
**Pull 模型**：**indexer** 从数据源（Blob、ADLS Gen2、Cosmos DB、Azure SQL、Table、OneLake、SharePoint 预览等）爬取，四个阶段——**document cracking**（打开文件抽文本；`imageAction: generateNormalizedImages` 才会抽图，另收费）→ **field mappings** → **skillset execution** → **output field mappings**；一个 indexer 只对一个数据源、一个索引；可按计划（最短 5 分钟）增量运行，Blob 自动变更检测。**Push 模型**：应用自己预处理后调 Index Documents API，适合更高频率。**Foundry IQ knowledge source** 自动生成整套管线：Blob、Azure SQL、OneLake、indexed SharePoint 等自动建 data source + skillset + indexer + 分块索引，`file` 类型直接上传文件；remote 类型（SharePoint、Bing web、Fabric、MCP server）不入库、查询时实时取。**多模态内容**：图像在管线中有两条路——**image verbalization**（GenAI Prompt skill 用 LLM 写描述再做文本嵌入，适合图表、流程图，便于引用）或 **直接多模态嵌入**（Azure Vision multimodal embeddings / AML skill，适合"找相似图"）；抽取用 Document Extraction skill 或 **Azure Content Understanding skill**（表格跨页、语义分块、位置元数据）。**音频 / 视频**不在 indexer 原生数据源里：先用 Content Understanding 的 `prebuilt-audioSearch` / `prebuilt-videoSearch` 产出转写 + 分段描述 Markdown，再嵌入并 push 进索引（官方 RAG 教程就是这样做的）。

来源：[Indexer Overview - Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-indexer-overview)、[Multimodal Search Concepts and Guidance](https://learn.microsoft.com/en-us/azure/search/multimodal-search-overview)、[What is a Knowledge Source?](https://learn.microsoft.com/en-us/azure/search/agentic-knowledge-source-overview)、[Build a RAG solution with Azure Content Understanding](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/tutorial/build-rag-solution)

#### E1.2 Configure semantic search, hybrid search, and vector search for grounding
| 方式 | 配置 | 什么时候用 |
|---|---|---|
| **Vector search** | 索引里 `Collection(Edm.Single)` 向量字段 + vector search profile（算法 **HNSW** 或 exhaustive KNN）+ **vectorizer**（查询时自动把文本转向量，须与索引用同一嵌入模型）；查询 `vectorQueries`（`kind: vector`/`text`、`k`、`fields`、`exhaustive`）；可加 `filter`（pre/post） | 语义相近、跨语言、图文同空间匹配 |
| **Hybrid search** | 同一请求同时给 `search`（关键词，BM25）和 `vectorQueries`，结果用 **Reciprocal Rank Fusion（RRF）** 合并；保留 filter、facet、scoring profile | RAG 默认选择：向量找概念、关键词保证产品编号、人名、术语的精确匹配 |
| **Semantic ranker** | 索引建 **semantic configuration**（title / content / keywords 字段，按优先级）；查询 `queryType=semantic` + `semanticConfiguration`；对 BM25 或 RRF 的 **前 50 条**做 L2 重排，输出 `@search.rerankerScore`（0–4）、semantic **captions**、可选 **answers**（原文摘录，不生成新内容） | 信息密集的散文类内容；按量计费、有免费额度；agentic retrieval 内置 |

组合建议：hybrid + semantic ranker 相关性最好，`k` 设 50 给重排器足够输入，不要加 `orderby`（会覆盖相关性排序）。Agent 的 `AzureAISearchTool.query_type` 对应 `simple` / `vector` / `semantic` / `vector_simple_hybrid` / `vector_semantic_hybrid`。Agentic retrieval 的子查询也是 keyword / vector / hybrid 并自带语义重排。调参用 Document Retrieval 评估器做 parameter sweep。

来源：[Vector Search Overview](https://learn.microsoft.com/en-us/azure/search/vector-search-overview)、[Hybrid Search Overview](https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview)、[Semantic Ranking Overview](https://learn.microsoft.com/en-us/azure/search/semantic-search-overview)

#### E1.3 Implement enrichment by using custom or built-in skills for text, images, and layout
**Skillset** 是挂在 indexer 上的技能数组，每个 skill 有 `context`（`/document` 或 `/document/pages/*`，决定执行次数）、`inputs`（来自 enrichment tree 节点）、`outputs`（写回树的新节点，可 `targetName` 改名）；树从 `/document`（Blob 是 `/document/content` + `/document/normalized_images/*`）开始增长，最后用 **outputFieldMappings** 选节点进索引，或经 Shaper skill 投影到 knowledge store。

- **内置技能（计费挂 Foundry 资源，处理由搜索服务内部完成）**：文本——Entity Recognition、Key Phrase Extraction、Language Detection、PII Detection、Sentiment、Text Translation、Entity Linking、Custom Entity Lookup；图像——**OCR**、**Image Analysis**、Azure Vision multimodal embeddings（preview）。
- **调用你自己部署的资源**：**Azure Content Understanding skill**（版面分析 + 语义分块）、**Azure OpenAI Embedding**、**GenAI Prompt**（用聊天模型做图像描述、摘要等）。
- **版面**：**Document Layout skill**（`Microsoft.Skills.Util.DocumentIntelligenceLayoutSkill`，用 Document Intelligence layout 模型输出 Markdown 或 text，`outputMode: oneToMany`、`markdownHeaderDepth`、`extractionOptions: ["images","locationMetadata"]`、`chunkingProperties`），新项目官方推荐改用 Content Understanding skill。
- **工具类技能**（不计费）：Text Split、Text Merge、Shaper、Conditional、Document Extraction。
- **自定义技能**：`Microsoft.Skills.Custom.WebApiSkill` 指向你的 HTTPS 端点（常用 Azure Functions），请求/响应都是 `values` 数组，每条带 `recordId` 和 `data`（可回 `errors`/`warnings`）；`timeout` 默认 30 秒最多 230 秒；`batchSize`；用 `authResourceId` 走 managed identity。另有 AML skill 调 Foundry 模型目录。

来源：[Skillset Concepts](https://learn.microsoft.com/en-us/azure/search/cognitive-search-working-with-skillsets)、[Skills Reference](https://learn.microsoft.com/en-us/azure/search/cognitive-search-predefined-skills)、[Custom Skill Interface](https://learn.microsoft.com/en-us/azure/search/cognitive-search-custom-skill-interface)、[Document Layout Skill](https://learn.microsoft.com/en-us/azure/search/cognitive-search-skill-document-intelligence-layout)

#### E1.4 Configure RAG ingestion flow, including documents and using optical character recognition (OCR)
标准的 RAG 摄取流（**integrated vectorization**，portal 的 **Import data** 向导可一键生成）：数据源 → indexer（`dataToExtract: contentAndMetadata`，扫描件/含图 PDF 设 `imageAction: generateNormalizedImages`）→ skillset：**OCR skill**（`Microsoft.Skills.Vision.OcrSkill`，输入 `/document/normalized_images/*`，输出 `text` 和带坐标的 `layoutText`，参数 `defaultLanguageCode`、`detectOrientation`、`lineEnding`；支持手写）→ **Text Merge skill** 把 OCR 文字按 `contentOffset` 插回 `merged_text` → 分块（**Text Split skill** 按 pages/sentences，或 Document Layout / Content Understanding skill 按标题语义分块）→ **Azure OpenAI Embedding skill**（`text-embedding-3-large/small`、`ada-002`）→ **index projections** 做一对多的 chunk 索引（父文档一条、chunk 多条）；索引里同一模型配 **vectorizer** 供查询时向量化。Foundry IQ 的 indexed knowledge source 把这一整套自动生成。嵌入调用受 Azure OpenAI TPM 限制，indexer 有内置重试，建议按计划运行补漏。替代方案：Content Understanding `prebuilt-documentSearch` 直接给出带图像描述、摘要和分块的 Markdown，再嵌入入库。

> **考点** "扫描 PDF 里的文字没有进索引" → 没开 `imageAction` 或没加 OCR + Text Merge；"图表里的信息检索不到" → 需要 image verbalization（GenAI Prompt skill）或 Content Understanding 的 figure description。

来源：[OCR Skill](https://learn.microsoft.com/en-us/azure/search/cognitive-search-skill-ocr)、[Integrated Vectorization Overview](https://learn.microsoft.com/en-us/azure/search/vector-search-integrated-vectorization)、[Multimodal Search Concepts and Guidance](https://learn.microsoft.com/en-us/azure/search/multimodal-search-overview)、[Azure Content Understanding prebuilt analyzers](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/prebuilt-analyzers)

#### E1.5 Connect retrieval pipelines directly to workflows and agent tools
三种接法：

1. **Foundry IQ knowledge base → agent**（推荐）：knowledge base 暴露 MCP 端点 `{search_endpoint}/knowledgebases/{kb}/mcp?api-version=2026-08-01-preview`；在 project 建 `RemoteTool` 类别、`ProjectManagedIdentity` 认证的 connection（audience `https://search.azure.com/`），agent 加 `MCPTool(server_label="knowledge-base", server_url=..., allowed_tools=["knowledge_base_retrieve"], require_approval="never", project_connection_id=...)`；project 的 managed identity 要有 **Search Index Data Reader**，知识库用 LLM 做 query planning 时搜索服务的 identity 要有 **Cognitive Services User**；按用户过滤权限用 `x-ms-query-source-authorization` 头（structured input 每次传用户 token）。指令里明确"必须用知识库、答不出说 I don't know、给引用"。
2. **Azure AI Search tool**：直接挂已有索引（`AzureAISearchTool`，见 B1.2），适合你自己管理索引结构的场景。
3. **代码中调用 retrieve action**：应用或 workflow executor 直接调 knowledge base 的 retrieve（query + 对话历史 → 子查询并行 → 语义重排 → 合并结果 + `references` + `activity` 日志），把 grounding data 交给模型或下一个 executor；Agent Framework 的 hosted agent 可通过 `FoundryToolbox` 连接含检索工具的 Toolbox。

Agentic retrieval 的计费是 token 制（Azure AI Search 收重排 token，Azure OpenAI 收 query planning / answer synthesis token）；GA API `2026-04-01` 只含 minimal 推理与抽取式结果，LLM 规划、answer synthesis 等在 `2026-08-01-preview`。

来源：[Connect Agents to Foundry IQ Knowledge Bases](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/foundry-iq-connect)、[Agentic Retrieval Overview](https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-overview)、[Connect an Azure AI Search index to Foundry agents](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/ai-search)

## E2. Extract content from documents {#e2}
文档抽取在这版考纲里以 **Content Understanding** 为中心（它把 Document Intelligence 作为确定性抽取层包含在内）。考点是：OCR / 版面 / 字段三层、Markdown 与结构化输出、置信度与 grounding、analyzer 的配置方式。

#### E2.1 Extract information by using multimodal pipelines that combine OCR, layout analysis, and field extraction
三层能力对应三类 analyzer / 模型：

| 层 | Content Understanding | Document Intelligence（v4.0，2024-11-30 GA） |
|---|---|---|
| OCR | `prebuilt-read`：文字、段落、公式、条码；数字原生文件用 `prebuilt-digitalParse` 直接读内部结构 | **Read** 模型：印刷 + 手写文本 |
| 版面 | `prebuilt-layout`：段落、表格（含跨页、合并单元格）、章节层级、选择标记、图形、超链接、批注、签名（preview） | **Layout** 模型：文本、表格、选择标记、图形，可输出 Markdown |
| 字段 | 自定义 `fieldSchema`（`extract` 原样抽取 / `classify` 分类 / `generate` 生成），或领域预构建（`prebuilt-invoice`、`prebuilt-receipt`、`prebuilt-idDocument`、`prebuilt-contract`、`prebuilt-tax.us.*`、`prebuilt-mortgage.us.*` 等），composed analyzer 先分类再路由 | 预构建模型（invoice、receipt、ID、W-2、contract…）、自定义抽取模型（neural / template）、自定义分类模型、composed 模型 |

Content Understanding 的输出同时含 **Markdown**（供阅读/RAG）和 **fields**（供自动化），字段带 `confidence` 和 `source`（如 `D(1,x1,y1,…)` 页码 + 多边形）——需在 analyzer 上开 `estimateFieldSourceAndConfidence`；类型化字段（日期、金额）自动归一化。选型：确定性高精度表单抽取、已有 Document Intelligence 代码 → Document Intelligence；复杂非结构化、多模态、需要生成/分类字段或跨文档推理（agentic mode）→ Content Understanding。Azure AI Search 里对应 Document Layout skill 与 Content Understanding skill。

来源：[Azure Content Understanding document overview](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/document/overview)、[Azure Content Understanding prebuilt analyzers](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/prebuilt-analyzers)、[What is Azure Document Intelligence in Foundry Tools?](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/overview)

#### E2.2 Produce clean, grounded representations to use with agents and RAG by using Content Understanding
"干净"指 **Markdown**：`extractionMode` 可选版面感知（表格、章节、阅读顺序重要时）或更快的纯文本（给 RAG 摄取干净文本）；`prebuilt-documentSearch` 专为 RAG 调优——保留段落/表格/图形，给图表和示意图生成文字描述（图表输出 chart.js、示意图输出 mermaid 语法），捕获手写批注，生成一段全文摘要，并输出**已分块**（固定大小或版面感知的语义分块）的结果，可直接嵌入向量索引；支持 PDF、图片、Office、文本文件。"接地"指每个字段的 `confidence`（0–1）和 `source` 定位，用于路由：高置信且有依据 → 直通自动化；低置信 → 人工复核（human-in-the-loop）。给 agent 用时，Content Understanding 把杂乱的多模态输入变成可预测的标准输入——需要推理时给 Markdown，需要结构时给 schema 对齐的 JSON；它继承 Foundry 的 guardrails，命中时字段可能缺失但源内容保留，响应里带 warnings，自动化前要检查。官方 RAG 教程的流程：建 analyzer → 分析得 Markdown + fields → 转字符串 → Azure OpenAI 嵌入 → 写入 Azure AI Search → hybrid 检索 → 聊天模型回答。

来源：[Azure Content Understanding document overview](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/document/overview)、[Azure Content Understanding prebuilt analyzers](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/prebuilt-analyzers)、[Build a RAG solution with Azure Content Understanding](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/tutorial/build-rag-solution)

#### E2.3 Implement analyzers for generating structured or markdown outputs for downstream reasoning by using Content Understanding
**Analyzer** 是可复用的处理蓝图，JSON 定义包含：`baseAnalyzerId`（`prebuilt-document` / `prebuilt-image` / `prebuilt-audio` / `prebuilt-video`，目前只能从这四个派生）、`config`（`returnDetails`、`enableSegment` + `contentCategories`、`estimateFieldSourceAndConfidence`、`locales`、`workflow: "agentic"`）、`models`（你部署的 completion / embedding 模型）、`fieldSchema.fields`（每个字段 `type`、`method: extract | classify | generate`、`description`、`enum`，支持 `array` / `object` 嵌套）。生命周期：`PUT /analyzers/{id}` 创建（可先 `GET /analyzers/prebuilt-invoice` 拿预构建定义改一份——生产环境建议复制而不是直接依赖预构建，因为预构建定义会随 API 版本变）；`POST /analyzers/{id}:analyze` 返回 **202** 和 `Operation-Location`，轮询到 `status: Succeeded`；结果 `result.contents[]` 每项有 `markdown`、`fields`（`valueString` / `valueNumber` / `valueArray`…、`confidence`、`source`、`spans`）、`kind`、页/时间范围。GA 版本 `2025-11-01`，`2026-06-01-preview` 加 agentic mode、签名检测、元数据。`prebuilt-documentFieldSchema` 可以帮你从样本文档**自动提议 schema**。Python 样例用 `AzureContentUnderstandingClient.begin_create_analyzer()` / `begin_analyze()` / `poll_result()`，认证 `get_bearer_token_provider(credential, "https://cognitiveservices.azure.com/.default")`。

> **提示** 要 Markdown 给 LLM 推理 → 用内容抽取（可不定义 fieldSchema）；要 JSON 给代码 → 定义 fieldSchema；两者在同一次分析里都会返回。

来源：[Azure Content Understanding prebuilt analyzers](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/prebuilt-analyzers)、[Build a RAG solution with Azure Content Understanding](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/tutorial/build-rag-solution)、[What is Azure Content Understanding in Foundry Tools?](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview)、[Agentic mode overview for document analysis (preview)](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/agentic-mode)
