# 术语表 · Foundry、模型、RAG、agent、Foundry Tools

### Microsoft Foundry {#foundry}
- zh: Azure 上做生成式 AI 和 agent 的统一平台（原 Azure AI Foundry / Azure AI Studio）
- aliases: Foundry | Azure AI Foundry | Azure AI Studio | Foundry portal | ai.azure.com
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry
- see: foundry-resource | foundry-project | foundry-models | foundry-agent-service | foundry-tools
- chapter: 05-azure-ai/structure

门户 ai.azure.com。部件：Foundry resource 和 project、Foundry Models（模型目录）、Foundry Agent Service、Foundry Tools、Foundry IQ、toolbox、observability、guardrails、Entra/RBAC/网络治理。Foundry (classic) 指基于 hub 的旧项目模型。

### Foundry resource {#foundry-resource}
- zh: Foundry 的顶层 Azure 资源（kind AIServices）
- aliases: Foundry resources | multi-service resource | AIServices
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource
- see: foundry-project | foundry-tools | rbac
- chapter: 05-azure-ai/structure

统一 endpoint 和 key 访问 Azure OpenAI 和 Foundry Tools，下面开多个 project；创建需要 Contributor/Owner；安全选项：Network（All / Selected / Disabled）、Identity（托管标识）、Encryption（CMK）、Storage（自带 Key Vault、App Insights；standard setup for agents 自带 Cosmos DB、AI Search、Storage）。

### Foundry project {#foundry-project}
- zh: Foundry resource 下的工作单元和访问控制作用域
- aliases: Foundry projects | project endpoint
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry
- see: foundry-resource | hub-based-project | foundry-roles
- chapter: 05-azure-ai/structure

组织 agent、模型部署、评估和连接；endpoint 形如 `https://<resource>.services.ai.azure.com/api/projects/<project>`；project 的托管标识需要 Foundry User 角色。

### Hub-based project {#hub-based-project}
- zh: Foundry (classic) 的旧项目模型，由 hub 集中管理
- aliases: hub | Foundry hub | Foundry classic | AI hub
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry-classic/what-is-foundry
- see: foundry-project | managed-compute | azure-machine-learning
- chapter: 05-azure-ai/structure

基于 Azure Machine Learning，hub 集中连接、计算和网络；只在 classic 门户可见。只有它能做 managed compute 模型（如 Hugging Face）、prompt flow 和 Azure Language 资源；新投入都在 Foundry project。

### Foundry SDK {#foundry-sdk}
- zh: 调用 Foundry project 的客户端库
- aliases: azure-ai-projects | AIProjectClient | azure-ai-inference | Foundry SDKs
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/sdk-overview
- see: foundry-project | responses-api | keyless-auth
- chapter: 05-azure-ai/structure

Python `azure-ai-projects` 2.x + `openai` 3.x、JS `@azure/ai-projects`、.NET `Azure.AI.Projects`；project client 和 OpenAI 兼容客户端（Responses API）；认证用 `DefaultAzureCredential`。`azure-ai-inference` 定于 2026-08-26 退役。

### Foundry Models {#foundry-models}
- zh: Foundry 的模型目录（1 万多个模型）
- aliases: model catalog | Foundry model catalog
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/foundry/concepts/foundry-models-overview
- see: models-sold-by-azure | models-from-partners | deployment | azure-openai
- chapter: 05-azure-ai/models

分 Models sold by Azure 和 Models from partners and community；可按 collection、区域、部署选项、生命周期、行业、功能筛选，有 leaderboard 和 benchmark；模型有 deprecation / retirement 时间表。Copilot Studio 的 prompt 工具可以直接用目录里的模型。

### Models sold by Azure {#models-sold-by-azure}
- zh: 微软托管并售卖的模型（含全部 Azure OpenAI 模型）
- aliases: Models sold directly by Azure | sold by Azure
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/foundry/concepts/foundry-models-overview
- see: models-from-partners | azure-openai
- chapter: 05-azure-ai/models

Azure OpenAI + 部分 DeepSeek、xAI、Meta、Mistral、Cohere、微软模型；微软支持、企业 SLA、经微软 RAI 审查、按 Azure 计量计费，支持可互换的 provisioned throughput。

### Models from partners and community {#models-from-partners}
- zh: 合作伙伴与社区提供的模型（Anthropic Claude、Hugging Face 等）
- aliases: partner models | community models | Hugging Face
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry/concepts/foundry-models-overview
- see: models-sold-by-azure | managed-compute
- chapter: 05-azure-ai/models

由提供商支持，经 Azure Marketplace 计费；部分走 serverless，Hugging Face 这类走 managed compute（classic hub-based project）。

### Azure OpenAI {#azure-openai}
- zh: Azure 上的 OpenAI 模型（现为 Foundry Models 的一部分）
- aliases: Azure OpenAI in Foundry Models | Azure OpenAI Service | GPT | gpt-4o | GPT-5 | o-series
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure
- see: foundry-models | responses-api | deployment-types | quota
- chapter: 05-azure-ai/openai

GPT 系列、o 系列推理模型、embeddings、GPT-Image 图像模型、Sora 视频模型、音频模型等；通过 Responses API（v1 路由）或 Chat Completions 调用；配额按 TPM。

### Deployment {#deployment}
- zh: 部署：让某个模型在你的资源里可被调用
- aliases: model deployment | deployments | deploy a model
- exams: AI-103 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/foundry/concepts/deployments-overview
- see: serverless-deployment | managed-compute | deployment-types
- chapter: 05-azure-ai/models
- nohl: true

两条路：serverless API（首选）和 managed compute（预览）；instant access（预览）可以不部署直接按名调用。Copilot Studio 连接 Foundry 模型时要填 deployment name。

### Serverless deployment {#serverless-deployment}
- zh: 无服务器部署：微软托管，按 token 或预留容量计费
- aliases: serverless API | serverless deployments | standard deployment
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry/concepts/deployments-overview
- see: deployment-types | ptu | managed-compute
- chapter: 05-azure-ai/models

支持 Foundry 资源和 Azure OpenAI 资源，不需要 hub；类型有 standard、provisioned、batch、developer；自带内容过滤、Entra 认证、私有网络。

### Deployment types {#deployment-types}
- zh: 部署类型：Global / Data Zone / Standard（区域）× Standard / Provisioned / Batch
- aliases: Global Standard | Data Zone Standard | Global Batch | Data Zone | Developer deployment
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types
- see: ptu | data-residency | quota
- chapter: 05-azure-ai/models

Global（任意区域处理，配额最高，新模型最先上）、Data Zone（US / EU / APAC 内处理）、Standard / Regional（客户指定地理区域）；每档有按 token 的 Standard、预留容量的 Provisioned 和便宜 50% 的 Batch；Developer 类型只用于评估微调模型（24 小时，无 SLA）。数据静态存储都在指定地理区域。

### Provisioned throughput unit {#ptu}
- zh: PTU：预留的固定模型处理容量单位
- aliases: PTU | PTUs | provisioned throughput | provisioned deployment
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput
- see: deployment-types | quota
- chapter: 05-azure-ai/models

按 PTU 小时计费，可用 Azure Reservations（1 个月 / 1 年）优惠；PTU 配额（政策上限）不等于实际容量；类型 Global / Data Zone / Regional Provisioned；spillover 把溢出流量导到标准部署。适合可预测、低延迟的生产负载。

### Managed compute {#managed-compute}
- zh: 把开源 / 自定义权重模型跑在专用 GPU 上（预览）
- aliases: managed compute deployment | managed online endpoint
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry/concepts/deployments-overview
- see: serverless-deployment | models-from-partners | hub-based-project
- chapter: 05-azure-ai/models

Hugging Face 集合等模型，按加速器（A100 / H100 / MI300X）小时计费，配额独立于 VM 配额，预览期无内容过滤；classic 路线则部署到 Azure ML 的专用虚拟机按核时计费。

### Quota {#quota}
- zh: 配额：按订阅、区域、模型和部署类型分配的 TPM 上限
- aliases: TPM | tokens per minute | RPM | requests per minute | rate limit
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/quota
- see: deployment-types | ptu | subscription
- chapter: 05-azure-ai/models

TPM 分给每个部署，同区域同模型的部署共享；RPM 按比例派生；超限返回 429 和 `retry-after-ms`。2026-05-07 起 Global Standard 同模型跨区域共用一个池。看配额需要订阅作用域的 Cognitive Services Usages Reader 角色。

### Model router {#model-router}
- zh: 按提示实时选择最合适底层模型的"路由模型"
- aliases: routing mode
- exams: AB-100 | AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-router
- see: foundry-models | deployment
- chapter: 05-azure-ai/models

作为一个部署（Global Standard 或 Data Zone Standard）使用；分析复杂度、推理需求和任务类型；Routing mode 有 Balanced（默认）、Cost、Quality；可限制候选子集；按输入提示计费。AB-100 把它当成本优化手段。

### Fine-tuning {#fine-tuning}
- zh: 微调：用任务数据继续训练模型、调整权重
- aliases: fine-tune | fine-tuned model | supervised fine-tuning | SFT | DPO | reinforcement fine-tuning | RFT | distillation
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/foundry/fine-tuning/overview
- see: rag | prompt-engineering | foundry-roles
- chapter: 05-azure-ai/models

方法：SFT、DPO、RFT，以及用教师模型生成数据的 distillation；部署类型 Standard、Data Zone Standard、Global Standard、Developer、Provisioned。适合提高任务准确率、减少提示示例、统一风格；不能替代 RAG 获取最新信息或应用层安全控制。RBAC 上需要 Foundry Owner，或 Foundry User + Account Owner。

### Responses API {#responses-api}
- zh: Azure OpenAI 当前的主 API：有状态、多轮、带工具
- aliases: Responses | conversations | items | previous_response_id
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/responses
- see: assistants-api | chat-completions | foundry-agent-service
- chapter: 05-azure-ai/openai

合并了 chat completions 和 Assistants 的能力；走 v1 路由 `/openai/v1/`；状态用 `previous_response_id` 或 conversations（内含 items）；内置工具；响应默认保留 30 天。Foundry Agent Service 的临时 agent 就直接用它。

### Assistants API {#assistants-api}
- zh: 旧的 agent API（threads / messages / runs），2026-08-26 退役
- aliases: Assistants | threads | runs | thread
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/migrate
- see: responses-api
- chapter: 05-azure-ai/openai

迁移对应：Threads → Conversations、Messages → Items、Runs → Responses、Assistants → Agent Versions。题库里出现 thread/run 的题，按这个对照理解。

### Chat Completions {#chat-completions}
- zh: 经典的 messages 数组接口（system / user / assistant）
- aliases: chat completion | chat completions API | system message
- exams: AI-103 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering
- see: responses-api | prompt-engineering
- chapter: 05-azure-ai/openai

system message 放指令，few-shot 示例写成 user/assistant 轮次。Copilot Studio 连接 Foundry 模型要求 endpoint 以 `/chat/completions` 结尾。

### Embeddings {#embeddings}
- zh: 嵌入：把文本或图像变成向量
- aliases: embedding | embedding model | text-embedding | vectorization
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/search/vector-search-overview
- see: vector-search | integrated-vectorization | rag
- chapter: 05-azure-ai/rag

Azure OpenAI 的 text-embedding 模型做文本，Azure Vision 的 multimodal embeddings 做图像和文本；向量存进 AI Search 的向量字段或 Cosmos DB。

### Prompt engineering {#prompt-engineering}
- zh: 提示工程：通过提示的结构和措辞引导模型
- aliases: few-shot | zero-shot | one-shot | chain of thought | chain-of-thought | temperature | top_p | system prompt
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering
- see: chat-completions | instructions | grounding
- chapter: 05-azure-ai/openai

组成：instructions、primary content、examples（zero/one/few-shot）、cue、supporting content。技巧：指令放前并在末尾重复、清晰语法（分隔符、Markdown/XML）、拆分任务、引用来源、给模型退路、提供 grounding；temperature（0–2）和 top_p 二选一调。gpt-5 / o 系列推理模型不适用 chain-of-thought 提示。

### Voice Live API {#voice-live}
- zh: 低延迟语音对语音 agent 的统一接口
- aliases: Voice Live | Realtime API | gpt-realtime
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/voice-live
- see: speech-to-text | text-to-speech | foundry-agent-service
- chapter: 05-azure-ai/openai

一个 WebSocket 接口里合并语音识别、生成模型和语音合成（兼容 Azure OpenAI Realtime API）；降噪、回声消除、打断和话轮检测、avatar、函数调用、自定义语音；模型按 Pro / Standard / Lite 定价；可接 Foundry Agent Service 做语音 agent。

### Retrieval-augmented generation {#rag}
- zh: RAG：先检索你的数据，再让模型基于检索结果生成
- aliases: RAG | retrieval augmented generation
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search
- see: grounding | azure-ai-search | embeddings | foundry-iq | fine-tuning
- chapter: 05-azure-ai/rag

Azure 上的典型管道：indexer + skillset 把文档分块嵌入进 AI Search 索引，查询时混合检索 + semantic ranker，把片段交给模型。Copilot Studio 的知识源和 Foundry 的 file search / Foundry IQ 都是 RAG。和微调互补：RAG 管最新信息，微调管风格和任务。

### Grounding {#grounding}
- zh: 接地：让模型的回答基于指定的数据
- aliases: grounded | grounding data | ungrounded
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering
- see: rag | groundedness | knowledge-source
- chapter: 06-business-ai/data

来源可以是提示里的上下文、RAG 检索结果、Microsoft Graph（Microsoft 365 Copilot）、Bing（web grounding）。相关词：groundedness（输出有没有来源支撑的评估指标）、Copilot Studio 的 Allow ungrounded responses 开关。

### Azure AI Search {#azure-ai-search}
- zh: Azure 的搜索与检索服务（RAG 的核心）
- aliases: AI Search | Azure Cognitive Search | search service
- exams: AI-103 | AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search
- see: index | indexer | skillset | vector-search | hybrid-search | semantic-ranker | agentic-retrieval
- chapter: 05-azure-ai/rag

索引优先的经典搜索（全文、向量、混合、多模态、semantic ranker）和 agentic retrieval（knowledge base + knowledge sources）；数据源 Blob、Cosmos DB、SQL、OneLake、SharePoint；安全有 Entra ID、Private Link、文档级访问控制、RBAC。Copilot Studio 可把它的索引当知识源（认证 Access Key / 证书 / 服务主体 / Entra ID Integrated）。

### Search index {#index}
- zh: 索引：搜索服务上的可搜索内容及其字段 schema
- aliases: search index | indexes | searchable | filterable | facetable | retrievable
- exams: AI-103 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/search/search-what-is-an-index
- see: indexer | azure-ai-search | vector-search
- chapter: 05-azure-ai/rag

字段属性 searchable、filterable、sortable、facetable、key、retrievable；向量字段有 dimensions 和 vectorSearchProfile；恰好一个 `Edm.String` key；已有字段不能改类型。push（自己写文档）或 pull（indexer）两种装载方式。

### Indexer {#indexer}
- zh: 索引器：按计划从数据源拉取并写入索引的爬虫
- aliases: indexers | pull model
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/search/search-indexer-overview
- see: index | skillset | blob-storage
- chapter: 05-azure-ai/rag

阶段：document cracking → field mappings → skillset → output field mappings；最短每 5 分钟运行；数据源 Blob、Cosmos DB、ADLS Gen2、Azure SQL、Table Storage、OneLake、SharePoint（预览）等。

### Skillset {#skillset}
- zh: 技能集：挂在 indexer 上的 AI 加工链
- aliases: skillsets | AI enrichment | enrichment | enrichment tree
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/search/cognitive-search-working-with-skillsets
- see: skill | indexer | knowledge-store | integrated-vectorization
- chapter: 05-azure-ai/rag

每个技能有 context、输入和输出，结果写进内存中的 enrichment tree（`/document` 根），再通过 output field mappings 进索引或写进 knowledge store。

### Skill {#skill}
- zh: 技能：skillset 里的一个处理步骤（内置、自定义或工具型）
- aliases: skills | built-in skill | custom skill | Web API skill | Text Split | Document Layout skill
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/search/cognitive-search-predefined-skills
- see: skillset | azure-functions | content-understanding
- chapter: 05-azure-ai/rag

内置：OCR、Image Analysis、Vision multimodal embeddings、Key Phrase、Language Detection、Sentiment、Entity Recognition、PII、Text Translation、Document Layout、Azure OpenAI Embedding、GenAI Prompt、Azure Content Understanding；自定义：Web API（常用 Azure Functions）或 Azure ML；工具型：Conditional、Shaper、Text Merge、Text Split、Document Extraction。（Foundry toolbox 里的 "skills" 是另一个概念：可版本化的多步工作流。）

### Knowledge store {#knowledge-store}
- zh: 把 skillset 输出持久化到 Azure Storage
- aliases: projections | table projection | object projection | file projection | Shaper
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/search/knowledge-store-concept-intro
- see: skillset | blob-storage
- chapter: 05-azure-ai/rag

projections 三种：tables（Table storage）、objects（JSON blob）、files（图片）；常配 Shaper 技能整形，可接 Power BI 分析。和 Foundry IQ 的 knowledge source / knowledge base 不是一回事。

### Integrated vectorization {#integrated-vectorization}
- zh: 用 indexer + skillset 自动分块和嵌入
- aliases: chunking | Text Split skill
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/search/vector-search-overview
- see: embeddings | skillset | vector-search
- chapter: 05-azure-ai/rag

Text Split 分块 + Azure OpenAI Embedding / Vision Vectorize 嵌入，省去自己写向量管道。Foundry 的 file search 默认分块 800 token、重叠 400。

### Vector search {#vector-search}
- zh: 向量搜索：按嵌入向量的相似度检索
- aliases: vector query | kNN | HNSW | vector index | vector store
- exams: AI-103 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/search/vector-search-overview
- see: embeddings | hybrid-search | azure-ai-search
- chapter: 05-azure-ai/rag

近似最近邻（HNSW）或穷举 kNN，支持过滤（pre/post filter）和多模态。Cosmos DB 也内置向量搜索（DiskANN）；Foundry file search 的 vector store 是托管的向量库。

### Hybrid search {#hybrid-search}
- zh: 混合搜索：关键词（BM25）+ 向量并行，RRF 合并
- aliases: Reciprocal Rank Fusion | RRF | BM25 | keyword search | full text search
- exams: AI-103 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview
- see: vector-search | semantic-ranker
- chapter: 05-azure-ai/rag

一次请求同时带 `search` 和 `vectorQueries`，结果用 Reciprocal Rank Fusion 合并，可再叠加 semantic ranker（此时 k 设 50）。

### Semantic ranker {#semantic-ranker}
- zh: 语义重排：对前 50 个结果做二次排序并给出 captions / answers
- aliases: semantic search | semantic ranking | semantic configuration | reranker score | semantic captions | semantic answers
- exams: AI-103 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/search/semantic-search-overview
- see: hybrid-search | azure-ai-search
- chapter: 05-azure-ai/rag

L2 重排，返回 `@search.rerankerScore`（0–4）、semantic captions、可选 semantic answers 和 query rewrite（预览）；需要 semantic configuration（title / keywords / content 字段）；`queryType=semantic` 时计费。

### Agentic retrieval {#agentic-retrieval}
- zh: 由模型做查询规划、并行子查询和重排的新一代检索
- aliases: retrieval reasoning effort
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-overview
- see: foundry-iq | azure-ai-search | semantic-ranker
- chapter: 05-azure-ai/rag

knowledge base 组织多个 knowledge sources（已索引或远程），用 Azure OpenAI 做查询规划和答案合成，semantic ranker 重排；reasoning effort 有 minimal / low / medium；按 token 计费。Foundry IQ 建在它上面。

### Foundry IQ {#foundry-iq}
- zh: Foundry 的托管知识层（基于 AI Search agentic retrieval）
- aliases: knowledge_base_retrieve
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-foundry-iq
- see: agentic-retrieval | azure-ai-search | document-level-access
- chapter: 05-azure-ai/rag

knowledge base 汇集 Blob、OneLake、SharePoint、现有索引和远程源（SharePoint 的 Copilot Retrieval API、web），返回带引用、按调用者权限过滤的结果（ACL 同步、Purview 标签）；agent 用 MCP 工具 `knowledge_base_retrieve`。Azure OpenAI On Your Data 退役后的官方替代。

### Document-level access control {#document-level-access}
- zh: 文档级访问控制：检索结果按用户权限过滤
- aliases: security filters | security trimming | ACL | permission filter
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/search/search-document-level-access-overview
- see: azure-ai-search | foundry-iq | rbac
- chapter: 05-azure-ai/rag

Security filters（索引里放用户/组字段，查询时 `$filter`，GA）、POSIX 风格 ACL / RBAC scopes（预览，`x-ms-query-source-authorization` 头）、Purview 敏感度标签和 SharePoint ACL（预览）。AB-100 "对 grounding 数据的访问控制"的主要答案之一。

### Foundry Agent Service {#foundry-agent-service}
- zh: Azure 上托管 agent 的运行时
- aliases: Agent Service | Azure AI Agent Service | Foundry agent | Foundry agents
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/overview
- see: prompt-agent | hosted-agent | toolbox | mcp | a2a | connected-agent
- chapter: 05-azure-ai/agents

agent 类型：prompt agents（声明式）、voice-based prompt agents、hosted agents（自带代码/容器）；工具 web search、file search、code interpreter、memory、函数、OpenAPI、MCP、A2A、toolbox；observability、agent 身份（Entra）、RBAC、私有网络、guardrails；发布产生版本和稳定 endpoint，可发布到 Teams / Microsoft Copilot。Copilot Studio 可把它当连接 agent（预览，需启用 Activity protocol endpoint）。

### Prompt agent {#prompt-agent}
- zh: 声明式的 Foundry agent：指令 + 模型 + 工具
- aliases: prompt agents | PromptAgentDefinition | agent version
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/overview
- see: foundry-agent-service | hosted-agent
- chapter: 05-azure-ai/agents

在门户或 SDK 定义，有版本（`create_version()`）；tracing 对它已 GA。与 Copilot Studio 的 agent 概念对应。

### Hosted agent {#hosted-agent}
- zh: 托管 agent：你自己的代码或容器由 Foundry 运行
- aliases: hosted agents | container agent
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/overview
- see: foundry-agent-service | agent-framework
- chapter: 05-azure-ai/agents

用 Agent Framework、LangGraph、OpenAI Agents SDK 等编写，Foundry 提供托管 endpoint 和专属 Entra 身份；CI/CD 用 `azd ai agent init` / `azd pipeline config` / `azd deploy`（构建容器 → ACR → 新版本）。

### Function calling {#function-calling}
- zh: 函数调用：模型请求你的代码执行某个函数并回传结果
- aliases: function call | tool calling | tool schema | function_call_output
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/function-calling
- see: foundry-agent-service | mcp
- chapter: 05-azure-ai/agents

用 JSON schema 定义 `parameters`；响应返回 `function_call`（`call_id`、`arguments`），应用执行后把 `function_call_output` item 送回下一次 `responses.create`。Copilot Studio 里对应的是工具的 Inputs 由 AI 动态填充。

### File search {#file-search}
- zh: 让 agent 在上传文件上做检索（vector store）
- aliases: vector stores
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/file-search
- see: rag | vector-search | foundry-agent-service
- chapter: 05-azure-ai/agents

解析 → 分块（800 token、重叠 400）→ 嵌入（text-embedding-3-large）→ 混合检索 → 重排；单文件 ≤ 512 MB；basic setup 用微软托管存储，standard setup 用你的 AI Search + Blob。

### Code interpreter {#code-interpreter}
- zh: 在托管沙箱里运行 Python 的工具
- aliases: code interpreter tool
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/code-interpreter
- see: foundry-agent-service | aci
- chapter: 05-azure-ai/agents

Azure Container Apps dynamic sessions（Hyper-V 隔离、无出站网络），会话 1 小时、30 分钟空闲超时，按会话额外计费；输出通过 `container_file_citation` 返回。

### Grounding with Bing Search {#bing-grounding}
- zh: 用 Bing 做 web grounding 的工具
- aliases: Bing grounding | web search tool | Bing Custom Search | url_citation
- exams: AI-103 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/bing-tools
- see: foundry-agent-service | knowledge-source
- chapter: 05-azure-ai/agents

需要付费的 Grounding with Bing 资源和 project connection，返回必须展示的 `url_citation`；数据会离开 Azure 的合规和地理边界；新的 web search 工具不需要 Bing 资源。Copilot Studio 的 Web search / 公开网站知识同样基于 Bing。

### Agent memory {#agent-memory}
- zh: Foundry Agent Service 的托管长期记忆（预览）
- aliases: memory store | memory search tool
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory
- see: foundry-agent-service
- chapter: 05-azure-ai/agents

user profile、chat summary、procedural memory 三类，按 scope（如 `{{$userId}}`）隔离；通过 memory search tool 或 Memory Store API 使用；需要 Azure OpenAI 的聊天和嵌入部署。

### Toolbox {#toolbox}
- zh: 把一组工具放在一个 MCP endpoint 后面统一管理
- aliases: toolboxes | tool search | Foundry Toolbox
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview
- see: mcp | foundry-agent-service | skill
- chapter: 05-azure-ai/agents

Build / Discover / Consume / Govern；集中认证（Entra、OAuth 透传）、toolbox 级 guardrails、版本提升；tool search（预览，只暴露 `tool_search` 和 `call_tool`）和 skills（预览）；Agent Framework、LangGraph、GitHub Copilot 都能用。

### Microsoft Agent Framework {#agent-framework}
- zh: 开源 agent SDK，Semantic Kernel 和 AutoGen 的后继
- aliases: Agent Framework | AutoGen
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/agent-framework/overview/
- see: semantic-kernel | hosted-agent | azure-machine-learning
- chapter: 05-azure-ai/agents

.NET、Python（Go 预览）；Agents、Harness Agent、Workflows（图式的显式多 agent 编排）、Integrations；提供模型客户端、session 状态、context providers（记忆）、middleware、MCP 客户端。官方建议：任务开放式用 agent，流程明确用 workflow，能写函数就写函数。prompt flow 的迁移目标。

### Semantic Kernel {#semantic-kernel}
- zh: 轻量开源开发套件，用 plugins 把代码描述给模型
- aliases: SK | plugins
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/semantic-kernel/overview/
- see: agent-framework
- chapter: 05-azure-ai/agents

C#、Python、Java；模型请求由 SK 翻译成函数调用（OpenAPI 规范共享）；1.0+ 承诺不破坏兼容。Agent Framework 继承了它的企业特性。

### Observability {#observability}
- zh: 可观测性：评估 + 监控 + 追踪
- aliases: continuous evaluation
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/foundry/concepts/observability
- see: evaluator | tracing | red-teaming | application-insights
- chapter: 05-azure-ai/observability

三个阶段：选基础模型（benchmark）、上线前评估（自己的数据、红队）、上线后监控（持续评估抽样、定期评估、定期红队、Azure Monitor 告警）。playground 评估默认开启并计费。

### Tracing {#tracing}
- zh: 追踪：记录每次模型和工具调用的 span
- aliases: distributed tracing | spans | invoke_agent | execute_tool
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept
- see: observability | application-insights | telemetry
- chapter: 05-azure-ai/observability

OpenTelemetry GenAI 语义约定（`invoke_agent`、`execute_tool` 等），记录输入输出、token、延迟；存到 project 连接的 Application Insights；支持 LangChain、LangGraph、OpenAI Agents SDK、Agent Framework。AB-100 "审计跟踪"的技术答案之一。

### AI red teaming {#red-teaming}
- zh: 红队：用模拟攻击找 agent 的安全漏洞
- aliases: AI red teaming agent | red team | Attack Success Rate | ASR | PyRIT
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/run-ai-red-teaming-cloud
- see: observability | prompt-shields | evaluator
- chapter: 05-azure-ai/observability

云端用 `client.evals.create(... scenario="red_team")`，目标可以是模型部署或 Foundry agent，攻击策略如 Flip、Base64、IndirectJailbreak，结果以 Attack Success Rate 衡量。建议配合人工审核，上线后定期运行。

### Evaluators {#evaluator}
- zh: 评估器：度量质量、安全和 agent 行为的内置指标
- aliases: evaluators | built-in evaluators | Relevance | Coherence | Fluency | Task Adherence | Tool Call Accuracy | Intent Resolution
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/foundry/concepts/built-in-evaluators
- see: groundedness | observability | evaluation
- chapter: 05-azure-ai/observability

分组：General purpose（Coherence、Fluency）、Textual similarity（F1、BLEU、ROUGE…）、RAG（Retrieval、Groundedness、Relevance、Response Completeness）、Risk and safety（Hate and Unfairness、Violence、Protected Materials、Indirect Attack、Code Vulnerability…）、Agent（Task Adherence、Task Completion、Intent Resolution、Tool Call Accuracy、Tool Selection…）、Rubric、Azure OpenAI graders、自定义。

### Groundedness {#groundedness}
- zh: 接地性：回答是否有来源支撑（反幻觉指标）
- aliases: Groundedness Pro | fabrication | hallucination
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/foundry/concepts/built-in-evaluators
- see: evaluator | groundedness-detection | grounding
- chapter: 05-azure-ai/observability

Foundry 评估器 Groundedness（1–5）和 Groundedness Pro（pass/fail，基于 Content Safety）；Copilot Studio 的 General quality 评估方法也含 groundedness；Content Safety 的 groundedness detection 是运行时检测。

### Azure AI Content Safety {#content-safety}
- zh: 检测有害内容和提示攻击的服务
- aliases: Content Safety | content filtering | content filter | content filters | severity levels | harm categories | blocklist | custom categories
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview
- see: prompt-shields | guardrails | groundedness-detection | protected-material | content-moderation
- chapter: 05-azure-ai/safety

四类 Hate and Fairness、Sexual、Violence、Self-Harm，各 safe / low / medium / high；Azure OpenAI 默认 Medium + High 过滤；关掉补全侧过滤需 Limited Access 审批；流式有默认和 Asynchronous Filter 两种模式；abuse monitoring 做滥用检测。还有 custom categories、blocklists、task adherence、Content Safety Studio。

### Prompt Shields {#prompt-shields}
- zh: 检测用户提示攻击和文档（间接）攻击
- aliases: Prompt Shield | user prompt attacks | document attacks | Spotlighting
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection
- see: jailbreak | indirect-prompt-injection | content-safety | guardrails
- chapter: 05-azure-ai/safety

user prompt attacks（旧名 jailbreak risk detection：改系统规则、对话模拟、角色扮演、编码攻击）默认开；document attacks（间接注入：操纵内容、访问系统、信息收集、可用性、欺诈、恶意软件）默认关，需要 `<documents>` 标记；Spotlighting（预览）给文档加标记。API 接受 `userPrompt` + 最多 5 个 `documents`。

### Jailbreak {#jailbreak}
- zh: 越狱 / 用户提示攻击：用户在输入里诱导模型违反规则
- aliases: jailbreak attack | direct attack | prompt manipulation
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection
- see: prompt-shields | indirect-prompt-injection | red-teaming
- chapter: 02-identity-security/ai-security

Prompt Shields 的 "user prompt attacks" 类别；Azure OpenAI 的 "Prompt Shields for direct attacks (jailbreak)" 过滤器默认开启；红队测试和 Indirect Attack 评估器用来验证防御。

### Indirect prompt injection {#indirect-prompt-injection}
- zh: 间接提示注入（XPIA）：攻击指令藏在模型读取的文档、网页、邮件或图片里
- aliases: XPIA | indirect attack | indirect attacks | cross prompt injection
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection
- see: prompt-shields | jailbreak | guardrails
- chapter: 02-identity-security/ai-security

Prompt Shields 的 document attacks 类别（Azure OpenAI 里默认关闭，需要给文档打标记）；Foundry Agent Service 对工具调用和返回有 XPIA 防护；评估器 Indirect Attack (XPIA)；AI-103 还考"图片里嵌入文字的注入"。

### Groundedness detection {#groundedness-detection}
- zh: 运行时检查模型输出是否有来源支撑（预览）
- aliases: groundedness correction
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/groundedness
- see: content-safety | groundedness
- chapter: 05-azure-ai/safety

Content Safety 的功能，有 Non-Reasoning 和 Reasoning 模式，领域 MEDICAL / GENERIC，任务 Summarization / QnA，可做 correction；作为 Azure OpenAI 可选过滤器时仅流式、部分区域。

### Protected material {#protected-material}
- zh: 受版权保护的文本/代码检测
- aliases: protected material text | protected material code | Customer Copyright Commitment
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry-classic/openai/how-to/content-filters
- see: content-safety | guardrails
- chapter: 05-azure-ai/safety

Azure OpenAI 补全侧默认开启；代码检测返回引用 URL 和许可证；与 Customer Copyright Commitment 相关。

### Guardrails {#guardrails}
- zh: Foundry 的护栏：一组控制（风险 × 干预点 × 动作）
- aliases: guardrails and controls | RAI policy | Microsoft.DefaultV2 | intervention points | Annotate and block
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview
- see: content-safety | prompt-shields | toolbox
- chapter: 05-azure-ai/safety

干预点 User input、Tool call（预览）、Tool response（预览）、Output；动作 Annotate 或 Annotate and block；严重度阈值 Off/Low/Medium/High（Off 需审批）；默认 Microsoft.DefaultV2；agent 的 guardrail 覆盖模型的；REST 里叫 RAI policy（`raiPolicyName`）。

### Responsible AI {#responsible-ai}
- zh: 负责任 AI：微软的六项原则与 Responsible AI Standard
- aliases: Responsible AI Standard | RAI | AI principles | fairness | inclusiveness | accountability | reliability and safety | privacy and security
- exams: AB-100 | AI-103 | AB-620
- ref: https://learn.microsoft.com/en-us/compliance/assurance/assurance-artificial-intelligence
- see: transparency-note | limited-access | guardrails | content-safety
- chapter: 05-azure-ai/safety

原则：fairness、reliability and safety、privacy and security、inclusiveness、transparency、accountability。Standard 有 6 个领域、14 个目标，目标分解成 requirements 和 practices，Impact Assessment 是主要驱动。Foundry 文档把实践归纳为 Discover → Protect → Govern。

### Transparency Note {#transparency-note}
- zh: 微软为每个 AI 服务写的"它怎么工作、有什么局限"的说明
- aliases: transparency notes
- exams: AB-100 | AI-103
- ref: https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-ai/openai/transparency-note
- see: responsible-ai | limited-access
- chapter: 05-azure-ai/safety

帮助系统所有者理解能力、局限和影响行为的选择，是把 AI 原则落地的一部分；Azure OpenAI、Speech、Face 等都有。

### Limited Access {#limited-access}
- zh: 受限访问：必须申请审批才能使用的功能
- aliases: limited access features | Limited Access Review
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/ai-services/face/overview-identity
- see: face | text-to-speech | content-safety
- chapter: 05-azure-ai/safety

例如 Face 识别（只对微软托管客户开放）、Video Indexer 的人脸和名人识别、personal voice、修改 Azure OpenAI 内容过滤（Modified Content Filters）、modified abuse monitoring。

### Foundry Tools {#foundry-tools}
- zh: 预训练 AI 服务家族（原 Azure AI services / Cognitive Services）
- aliases: Azure AI services | Azure AI Services | Cognitive Services | AI services
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/ai-services/what-are-ai-services
- see: foundry-resource | document-intelligence | content-understanding | azure-language | speech-to-text | translator | content-safety
- chapter: 05-azure-ai/tools

Speech、Language、Vision、Face、Document Intelligence、Content Understanding、Translator、Content Safety；通过 Foundry 资源的统一 endpoint 调用，也可单独建资源；认证用 API key 或 Entra 令牌（角色 Cognitive Services User）；部分有容器版。

### Document Intelligence {#document-intelligence}
- zh: 从文档提取文本、版式和字段的服务（原 Form Recognizer 路线）
- aliases: Azure AI Document Intelligence | Document Intelligence Studio | Read model | Layout model | prebuilt-layout | prebuilt-read
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/overview
- see: prebuilt-model | custom-template-model | custom-neural-model | content-understanding | ocr
- chapter: 05-azure-ai/tools

文档分析模型 Read、Layout、general document；预构建模型（发票、收据、证件、合同、税表…）；自定义 template / neural / composed 和 custom classifier；Document Intelligence Studio 标注训练（功能正迁入 Foundry 门户）；有容器。AI Builder 的文档处理和 Business Central 的 Payables Agent 底层也用它。

### Prebuilt model {#prebuilt-model}
- zh: Document Intelligence 的预构建模型（发票、收据、证件…）
- aliases: prebuilt models | prebuilt-invoice | prebuilt-receipt | prebuilt-idDocument | prebuilt-contract
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/overview
- see: document-intelligence | custom-neural-model
- chapter: 05-azure-ai/tools

invoice、receipt、idDocument、contract、healthInsuranceCard.us、creditCard、check.us、payStub.us、bankStatement、marriageCertificate.us、mortgage.us.*、tax.us（W-2、W-4、1040、1095、1098、1099）。题目里"不用训练就能提取发票字段"选它。

### Custom template model {#custom-template-model}
- zh: 自定义模板模型：版式固定的表单
- aliases: custom template | template model | template build mode
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/train/custom-model
- see: custom-neural-model | document-intelligence
- chapter: 05-azure-ai/tools

训练 1–5 分钟，不支持重叠字段；最少 5 个样本。版式一致的表单用它。

### Custom neural model {#custom-neural-model}
- zh: 自定义神经模型：结构化、半结构化、非结构化混合文档
- aliases: custom neural | neural model | neural build mode | composed model | custom classifier
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/train/custom-model
- see: custom-template-model | document-intelligence
- chapter: 05-azure-ai/tools

训练 30 分钟到 12 小时，支持重叠字段和签名检测，官方推荐先试它；composed model 把多个自定义模型合一；custom classifier 先分类再拆分。

### Azure Content Understanding {#content-understanding}
- zh: 用生成式 AI 统一处理文档、图像、音频、视频
- aliases: Content Understanding | Content Understanding Studio | agentic mode | pro mode | standard mode
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview
- see: analyzer | document-intelligence | custom-vision | skill
- chapter: 05-azure-ai/tools

analyzer 做内容提取、分段、字段提取（extract / classify / generate）并给置信度和来源，输出 Markdown 或 JSON；GA API 2025-11-01；pro mode 已随 2025-05-01-preview 退役，后继是 agentic mode（预览，多步推理、仅文档）。AI Search 有它的技能；Custom Vision 分类的推荐替代。

### Analyzer {#analyzer}
- zh: Content Understanding 的可配置处理单元
- aliases: analyzers | prebuilt-document | prebuilt-documentSearch | field schema | fieldSchema
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/analyzer-reference
- see: content-understanding
- chapter: 05-azure-ai/tools

类型：base（prebuilt-document / audio / video / image）、RAG（prebuilt-documentSearch、prebuilt-videoSearch）、行业（prebuilt-invoice、receipt、idDocument）、自定义（baseAnalyzerId + fieldSchema + models + config）；字段方法 extract（原文，仅文档）、classify（固定集）、generate（自由）。

### Image Analysis {#image-analysis}
- zh: Azure Vision 的图像分析（4.0 已宣布 2028-09-25 退役）
- aliases: Azure Vision | Azure AI Vision | Computer Vision | Image Analysis 4.0 | dense captions | people detection | smart crop | multimodal embeddings
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-image-analysis
- see: ocr | face | custom-vision | embeddings
- chapter: 05-azure-ai/tools

4.0：read（同步 OCR）、captions、dense captions、tags、object detection、people detection、smart crop、multimodal embeddings（文搜图）；3.2 另有 brands、faces、celebrities、landmarks、adult content；model customization、product recognition、background removal 已于 2025-03-31 退役。

### OCR {#ocr}
- zh: 光学字符识别：从图片或文档提取文字
- aliases: Read API | Read OCR | OCR for images | text recognition
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-ocr
- see: image-analysis | document-intelligence
- chapter: 05-azure-ai/tools

图片（标牌、海报）用 Image Analysis 4.0 的 OCR for images（同步）；文档用 Document Intelligence 的 read 模型（异步，最多 2,000 页、500 MB）；Vision 3.2 Read 不再更新；Read 有容器版。AI Search 里是 OCR 技能，AI Builder 里是 text recognition 模型。

### Face {#face}
- zh: Azure Face 服务：人脸检测、验证、识别、活体（Limited Access）
- aliases: Face API | Face service | face detection | face verification | face identification | liveness detection | person group
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/ai-services/face/overview-identity
- see: limited-access | image-analysis | video-indexer
- chapter: 05-azure-ai/tools

Detect（情绪/性别属性已退役）、Liveness（门控 SDK）、Verification（1:1）、Identification（1:N，person group 最多 100 万人）、Find Similar、Group。只对微软托管客户和合作伙伴开放，须申请，不得用于美国警察部门。

### Custom Vision {#custom-vision}
- zh: 自己训练图像分类或目标检测模型（已宣布退役，支持到 2028-09-25）
- aliases: Azure AI Custom Vision | image classification | object detection model | customvision.ai | prediction endpoint
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/ai-services/custom-vision-service/overview
- see: content-understanding | image-analysis | ai-builder
- chapter: 05-azure-ai/tools

image classification（每张图的标签）vs object detection（边界框）；project → tags → train → iteration → publish 到 prediction endpoint，可导出 compact 模型。官方迁移建议：Content Understanding、Foundry 模型、AutoML。

### Azure AI Video Indexer {#video-indexer}
- zh: 从视频和音频提取洞察的服务
- aliases: Video Indexer
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/azure-video-indexer/video-indexer-overview
- see: face | speech-to-text | content-understanding
- chapter: 05-azure-ai/tools

转录（50 多种语言）、OCR、人脸和名人识别（Limited Access）、场景/镜头/关键帧、物体、标签、关键词、命名实体、主题、情感、摘要；云版和 Azure Arc 边缘版。

### Azure Language {#azure-language}
- zh: Azure 的自然语言处理服务家族
- aliases: Azure AI Language | Language service | Text Analytics | sentiment analysis | key phrase extraction | entity linking | language detection | Text analytics for health
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview
- see: pii | ner | clu | question-answering | summarization | containers
- chapter: 05-azure-ai/tools

核心：PII 检测、language detection、NER、Text analytics for health；legacy（仍支持）：CLU、custom text classification、entity linking、key phrase extraction、orchestration workflow、custom question answering、sentiment analysis / opinion mining、summarization。有 Language MCP server 和预构建 agent；多数功能有容器。

### PII detection {#pii}
- zh: 识别并脱敏个人身份信息
- aliases: PII | personally identifiable information | PII redaction
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/ai-services/language-service/personally-identifiable-information/overview
- see: azure-language | content-safety | purview
- chapter: 05-azure-ai/tools

Text PII（同步）、Conversation PII（异步转录）、Document PII（异步，返回脱敏后的 .pdf/.docx/.txt）；有实体类别、置信度和掩码选项；AI Search 里是 PII Detection 技能；Foundry guardrails 也有 PII 控制（预览）。

### Named entity recognition {#ner}
- zh: NER：识别文本中的人名、地点、组织、日期等实体
- aliases: NER | entity recognition | custom NER | entity extraction
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview
- see: azure-language | pii | clu
- chapter: 05-azure-ai/tools

预构建和自定义（用自己的标签训练）两种；AI Search 里是 Entity Recognition 技能，AI Builder 里是 entity extraction 模型。

### Conversational language understanding {#clu}
- zh: CLU：自定义的意图 + 实体对话理解模型（2029-03-31 退役）
- aliases: CLU | intent | intents | utterance | utterances | orchestration workflow | LUIS
- exams: AB-100 | AB-620 | AI-103
- ref: https://learn.microsoft.com/en-us/azure/ai-services/language-service/conversational-language-understanding/overview
- see: azure-language | classic-orchestration | question-answering
- chapter: 04-copilot-studio/orchestration

从 utterance 预测 intent、抽取 entity；LLM 快速部署或标注训练；orchestration workflow 在多个 CLU / 问答项目间路由。可接进 Copilot Studio（standard harness）：CLU intent 映射为主题触发器，entity 出现在 Entities 页，通过 `System.Recognizer.IntentOptions` 读取。LUIS 已于 2025-10-01 退役。

### Custom question answering {#question-answering}
- zh: 从文档和网址建问答知识库（2029-03-31 退役）
- aliases: CQA | QnA Maker
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/ai-services/language-service/question-answering/overview
- see: azure-language | clu | generative-answers
- chapter: 05-azure-ai/tools

多轮提示、元数据过滤、主动学习、chit-chat，底层用 Azure AI Search 排序；QnA Maker 已于 2025-03-31 退役。现在做 FAQ 更常用 Copilot Studio 的知识源或 RAG。

### Summarization {#summarization}
- zh: Azure Language 的摘要功能（2029-03-31 退役）
- aliases: text summarization | conversation summarization | extractive summarization | abstractive summarization
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/ai-services/language-service/summarization/overview
- see: azure-language
- chapter: 05-azure-ai/tools
- nohl: true

文本摘要（extractive 带排名分、abstractive 生成式）、对话摘要（recap、问题/解决、章节标题、叙述）、原生文档摘要（预览）。大模型提示也能做同样的事，这是它退役的背景。

### Speech to text {#speech-to-text}
- zh: 语音转文字（实时、快速、批量）
- aliases: Azure Speech | Azure AI Speech | Speech service | STT | real-time transcription | fast transcription | batch transcription | diarization | Speech SDK | Speech Studio | Speech CLI
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-to-text
- see: custom-speech | text-to-speech | speech-translation | voice-live | containers
- chapter: 05-azure-ai/tools

real-time（SDK/CLI/短音频 REST）、fast transcription（同步）、batch transcription（异步 REST）；diarization（最多 35 人）、phrase lists、语言识别、发音评估。Speech SDK 支持 C#、C++、Go、Java、JavaScript、Objective-C/Swift、Python；Speech CLI 是 `spx`。

### Custom speech {#custom-speech}
- zh: 自定义语音识别模型：领域词汇和声学环境
- aliases: custom speech model | word error rate | WER
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/custom-speech-overview
- see: speech-to-text
- chapter: 05-azure-ai/tools

基础模型是 Universal Language Model；用文本数据提高领域词汇、用音频 + 人工转录适应声学条件；流程 create project → upload data → train → 听测 → WER 量化评估 → 部署自定义 endpoint（batch transcription 不需要）。部署后的模型固定直到你更新。

### Text to speech {#text-to-speech}
- zh: 文字转语音（神经语音、自定义语音、avatar）
- aliases: TTS | neural voice | neural voices | custom neural voice | custom voice | personal voice | HD voices | avatar
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech
- see: ssml | speech-to-text | limited-access
- chapter: 05-azure-ai/tools

标准神经语音（100+ 地区）、HD 语音、Azure OpenAI 语音、custom voice（professional voice fine-tuning 和 personal voice，后者 Limited Access）、visemes、批量合成（>10 分钟）、text to speech avatar。

### SSML {#ssml}
- zh: 语音合成标记语言：控制发音、语速、语调
- aliases: Speech Synthesis Markup Language
- exams: AI-103 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech
- see: text-to-speech | voice
- chapter: 05-azure-ai/tools

XML 格式；Copilot Studio 的语音 agent 消息里也能用它。

### Speech translation {#speech-translation}
- zh: 实时语音翻译（语音转文字翻译、语音到语音）
- aliases: Live Interpreter
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-translation
- see: speech-to-text | translator
- chapter: 05-azure-ai/tools

Speech SDK 的功能；Live Interpreter 自动识别并切换语言；原生支持两个目标语言。

### Azure Translator {#translator}
- zh: 神经机器翻译（文本、文档、自定义）
- aliases: Translator | text translation | document translation | Custom Translator | adaptive custom translation
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/ai-services/translator/overview
- see: speech-translation | foundry-tools | containers
- chapter: 05-azure-ai/tools

文本翻译（API 2026-06-06 可选 LLM；v3 有 dynamic dictionary、prevent translation）、文档翻译（异步批量需 Blob 容器；同步单文件不需要）、adaptive custom translation（5–10,000 对句对）、Custom Translator 门户（领域模型、词典）、容器。AI Search 的 Text Translation 技能和 AI Builder 的文本翻译模型基于它。

### Containers {#containers}
- zh: 把 Foundry Tools 跑在本地或边缘的 Docker 容器
- aliases: container | Docker | disconnected containers | commitment plan | mcr.microsoft.com
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/ai-services/cognitive-services-container-support
- see: aks | aci | foundry-tools
- chapter: 05-azure-ai/tools
- nohl: true

启动必须传 Eula、Billing（资源 endpoint）、ApiKey，并能访问 Azure 上报计量；disconnected containers 完全离线，需要 commitment plan 和 license 文件；默认容器 API 无安全防护。可容器化：Language 各功能、Speech（STT、custom STT、fast transcription、neural TTS、language id）、Vision Read、Document Intelligence、Translator（受限）、Content Safety（预览）。

### Large / small language model {#llm}
- zh: 大语言模型与小语言模型
- aliases: LLM | SLM | small language model | large language model | foundation model | multimodal model
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/foundry/concepts/foundry-models-overview
- see: foundry-models | fine-tuning | model-router
- chapter: 05-azure-ai/models

Foundry 目录按 foundation、reasoning、small language、multimodal、domain-specific、industry 等类别分。AB-100 的 "customized small language models" 指对小模型做微调以专精某个领域（成本和延迟更低）。

### Token {#token}
- zh: 模型处理文本的基本单位，也是计费和配额单位
- aliases: tokens | context window | max tokens
- exams: AI-103 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering
- see: quota | prompt-engineering | embeddings
- chapter: 05-azure-ai/openai
- nohl: true

常见词一个 token，生僻词拆成多个；配额按 TPM，serverless 按 token 计费，file search 分块按 token 计。

### Azure OpenAI On Your Data {#on-your-data}
- zh: 旧的"在自己数据上做 RAG"功能，2026-10-14 退役
- aliases: On Your Data | use your data | Azure OpenAI on your data
- exams: AI-103 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/foundry-classic/openai/concepts/use-your-data
- see: foundry-iq | rag | generative-answers
- chapter: 05-azure-ai/openai

Ingest（分块嵌入进 AI Search）→ 推理（意图生成、检索、重排、生成）；数据源 AI Search、Cosmos DB for MongoDB vCore、上传文件、URL、Blob 等；支持 keyword / semantic / vector / hybrid 搜索和基于 Entra 组的文档级过滤。官方替代：Agent Service + Foundry IQ。Copilot Studio 的 classic 生成式答案节点里也有它。

### Image and video generation {#image-generation}
- zh: 文生图（GPT-Image）与文生视频（Sora 2）
- aliases: GPT-Image | gpt-image-1 | DALL-E | DALL-E 3 | Sora | Sora 2 | inpainting | image edits
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/dall-e
- see: azure-openai
- chapter: 05-azure-ai/openai

GA 图像模型 GPT-Image-2.5-Sunburst / 2.5-Flare / GPT-Image-2；`images/generations` 和 `images/edits`（蒙版 inpainting）；DALL-E 3 已于 2026-03-04 退役。Sora 2（预览）做文生视频、图生视频、Remix，带音频，异步作业。
