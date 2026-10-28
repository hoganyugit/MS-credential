---
id: 05-azure-ai
title: Azure AI 词汇：Foundry、模型、RAG、Agent Service、Foundry Tools
short: Azure AI
intro: AI-103 的 187 道题几乎全部落在 Microsoft Foundry 和它周围的 Azure 服务上。这一章按"平台结构 → 模型与部署 → RAG → agent → 评估 → 安全 → 预训练服务"的顺序把词汇讲一遍。
exams: AI-103 | AB-100 | AB-620 | AI-500
practice:
  ai-103: Planning & managing Azure AI solutions | Generative AI & agentic solutions | Information extraction solutions | Computer vision solutions | Text analysis solutions
  ab-100: Prompt engineering & evaluation
  ai-500: Knowledge & RAG | Evaluation & testing | Observability & monitoring | Performance, caching & cost
---
```diagram
{"type":"layers","title":"Microsoft Foundry 的分层","layers":[
{"label":"你构建的","boxes":[{"t":"Agents","s":"Foundry Agent Service：prompt / hosted agents"},{"t":"Apps","s":"用 SDK 直接调模型、RAG"}]},
{"label":"知识与工具","boxes":[{"t":"Foundry IQ","s":"知识层（Azure AI Search agentic retrieval）"},{"t":"Toolbox / tools","s":"MCP、A2A、OpenAPI、函数、code interpreter…"},{"t":"Foundry Tools","s":"Speech、Language、Vision、Document Intelligence、Content Understanding、Translator、Content Safety"}]},
{"label":"模型","boxes":[{"t":"Foundry Models","s":"Azure 直售（含 Azure OpenAI）/ 合作伙伴与社区"},{"t":"Deployments","s":"serverless（Global/Data Zone/Standard/PTU/Batch）或 managed compute"}]},
{"label":"运营与治理","boxes":[{"t":"Observability","s":"评估、tracing、监控"},{"t":"Guardrails & Content Safety"},{"t":"Entra ID + RBAC + 网络"}]}
],"arrows":["使用","运行在","受控于"]}
```

## Foundry 的结构：resource、project、hub {#structure}

| 对象 | 是什么 | 备注 |
|---|---|---|
| **[[foundry-resource|Foundry resource]]** | 顶层 Azure 资源（kind `AIServices`），是管理、安全、计费和监控的边界；统一 endpoint 和 key | 旧文档叫 multi-service resource；Azure OpenAI 资源可升级 |
| **[[foundry-project|Foundry project]]** | resource 下的子作用域，用来分隔用例、组织 agent / 模型 / 评估、做访问控制 | project endpoint 形如 `https://<resource>.services.ai.azure.com/api/projects/<project>` |
| **[[hub-based-project|Hub-based project（Foundry classic）]]** | 基于 Azure Machine Learning 的旧模型，由 **hub** 集中管理连接、计算和网络；只在 classic 门户可见 | 只有它能做 **managed compute 模型（如 Hugging Face）**、**prompt flow**、**Azure Language 资源**；新投入都在 Foundry project |

开发用 **[[foundry-sdk|Foundry SDK]]**：Python `azure-ai-projects` 2.x + `openai` 3.x（1.0 是 classic），JS `@azure/ai-projects`，.NET `Azure.AI.Projects`；两个客户端——**project client**（`AIProjectClient`）和 OpenAI 兼容客户端（`project.get_openai_client()` → Responses API）；认证用 `DefaultAzureCredential`（Entra ID）。`azure-ai-inference` 包定于 2026-08-26 退役。

来源：[What is Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry)、[Create a Foundry resource](https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource)、[Foundry classic project types](https://learn.microsoft.com/en-us/azure/foundry-classic/what-is-foundry)、[Navigate from classic](https://learn.microsoft.com/en-us/azure/foundry/how-to/navigate-from-classic)、[Foundry SDK overview](https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/sdk-overview)。

## 模型与部署 {#models}

**[[foundry-models|Foundry Models]]** 目录有一万多个模型，分两类：**[[models-sold-by-azure|Models sold by Azure]]**（微软托管和售卖：全部 Azure OpenAI 模型 + 部分 DeepSeek、xAI、Meta、Mistral、Cohere、微软自家模型；微软支持、SLA、经微软 RAI 审查、按 Azure 计量计费）和 **[[models-from-partners|Models from partners and community]]**（Anthropic Claude、Hugging Face 等；提供商支持；经 Azure Marketplace 计费）。目录可按 collection、区域、部署选项、生命周期（Preview / GA / Deprecated）、行业、功能（reasoning、tool calling）筛选，有 leaderboard 和 benchmark。

要调用模型先做 **[[deployment|deployment]]**（部署）。两条路：

- **[[serverless-deployment|Serverless API]]**（首选）：微软托管，按 token 或预留容量计费，自带内容过滤、Entra 认证、私有网络。**[[deployment-types|部署类型]]**决定数据在哪里处理和怎么付费：

| 类型 | 处理位置 | 计费 |
|---|---|---|
| **Global Standard**（起步首选，配额最高，新模型最先上） | 任意 Azure 区域 | 按 token |
| **Data Zone Standard** | 限定数据区：US、EU 或 APAC（EU 遵循 EU Data Boundary） | 按 token |
| **Standard**（区域） | 客户指定的 Azure 地理区域 | 按 token |
| **Global / Data Zone / Regional Provisioned** | 同上三档 | 按 **[[ptu|PTU]]**（provisioned throughput unit，固定处理容量单位）小时计费，可用 Azure Reservations（1 个月 / 1 年）优惠；超量可 spillover 到标准部署 |
| **Global / Data Zone Batch** | 同上 | 异步，24 小时目标完成，**比 Global Standard 便宜 50%**，独立的 enqueued token 配额；输入 `.jsonl` |
| **Developer** | — | 只用于评估微调模型，24 小时生命周期，无 SLA、无数据驻留 |

- **[[managed-compute|Managed compute]]**（预览）：把开源 / 自定义权重模型（Hugging Face 集合：Qwen、NVIDIA Nemotron、部分 Meta/Mistral）跑在专用 GPU 上，按加速器（A100 / H100 / MI300X）小时计费；配额独立于 VM 配额；预览期无内容过滤。
- **Instant access**（预览）：部分模型可以直接按名字调用，不用部署。

**[[quota|配额（quota）]]**按订阅、区域、模型、部署类型以 **TPM（tokens per minute）**计，部署之间共享；**RPM** 按比例派生（例如较老的聊天模型每 1,000 TPM 对应 6 RPM）；超限返回 **429** 并带 `retry-after-ms`。2026-05-07 起 Global Standard 的同一模型在所有区域共用一个池。

其他模型相关的词：

- **[[model-router|Model router]]**：一个"会路由的模型"部署，按提示的复杂度、推理需求和任务类型实时把请求分给最合适的底层模型；Routing mode 有 **Balanced**（默认）、**Cost**、**Quality**；可限制候选模型子集；按输入提示计费。
- **[[fine-tuning|Fine-tuning（微调）]]**：用任务数据继续训练、调整权重；方法有 **Supervised fine-tuning (SFT)**、**Preference fine-tuning (DPO)**、**Reinforcement fine-tuning (RFT)**，以及用教师模型生成数据做 SFT 的 **distillation**；适合提高任务准确率、减少提示里的示例、统一风格或输出结构、让小模型专精；**不能替代检索（RAG）获取最新信息，也不能替代应用层的安全控制**。
- **模型生命周期**：模型会被 deprecate 和 retire，文档有退役时间表；部分模型可自动升级版本。

来源：[Foundry Models overview](https://learn.microsoft.com/en-us/azure/foundry/concepts/foundry-models-overview)、[Deployment overview](https://learn.microsoft.com/en-us/azure/foundry/concepts/deployments-overview)、[Deployment types](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types)、[Provisioned throughput](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput)、[Batch](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/batch)、[Quota](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/quota)、[Quotas and limits](https://learn.microsoft.com/en-us/azure/foundry/openai/quotas-limits)、[Model router](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-router)、[Fine-tuning overview](https://learn.microsoft.com/en-us/azure/foundry/fine-tuning/overview)。

## Azure OpenAI 的 API 词汇 {#openai}

- **[[responses-api|Responses API]]**：当前的主 API，"把 chat completions 和 Assistants API 的能力合在一个统一体验里"，有状态、多轮；走 v1 路由 `/openai/v1/`；状态用 `previous_response_id` 或 **conversations**（里面是 **items**：消息、函数调用、输出）；内置工具（code interpreter、computer-use 等）；默认保留 30 天。旧的 **[[assistants-api|Assistants API]]** 定于 **2026-08-26** 退役：Threads → Conversations、Messages → Items、Runs → Responses、Assistants → Agent Versions。
- **[[chat-completions|Chat Completions]]**：经典的 messages 数组接口（system / user / assistant 角色），仍可用。
- **[[embeddings|Embeddings]]**：把文本（或图像）变成向量，用于向量检索；RAG 的基础。
- **[[prompt-engineering|提示工程]]**（对非推理模型）：提示的组成——instructions、primary content、examples（zero-shot / one-shot / few-shot）、cue、supporting content；技巧——指令放开头并在结尾重复（recency bias）、用分隔符和 Markdown/XML 明确结构、拆分任务、让模型引用来源、给模型一个"退路"（答不出就说 not found）、提供 grounding 上下文；参数 **temperature**（0–2，越低越确定）和 **top_p** 二选一调。gpt-5 和 o 系列推理模型不适用 chain-of-thought 这类技巧。
- **图像生成**：GA 模型 **GPT-Image-2.5-Sunburst**（最强，含编辑）、**GPT-Image-2.5-Flare**（最快）、**GPT-Image-2**（4K）；`images/generations` 和 `images/edits`（inpainting 用同尺寸 PNG 蒙版）；**DALL-E 3 已于 2026-03-04 退役**。
- **视频生成**：**Sora 2**（预览）文生视频、图生视频、视频改写（Remix），带音频；异步作业轮询后下载 MP4；`seconds` 4/8/12。
- **语音**：**[[voice-live|Voice Live API]]** 把语音识别、生成模型、语音合成合成一个 WebSocket 接口，做低延迟的语音对语音 agent（兼容 Azure OpenAI Realtime API）。
- **Azure OpenAI On Your Data**：在你的数据上做 RAG 的旧功能，**2026-10-14 退役**，官方建议迁移到 Agent Service + Foundry IQ。

来源：[Responses API](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/responses)、[Migrate from Assistants](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/migrate)、[Prompt engineering](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering)、[Image generation](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/dall-e)、[Retired models](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/retired-models)、[Video generation](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/video-generation)、[Voice Live](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/voice-live)、[On Your Data (classic)](https://learn.microsoft.com/en-us/azure/foundry-classic/openai/concepts/use-your-data)。

## RAG 与 Azure AI Search {#rag}

**[[rag|RAG（retrieval-augmented generation）]]**：先从你的数据里**检索**相关片段，再把片段连同问题交给模型**生成**回答，这样模型就"[[grounding|接地（grounded）]]"在你的数据上。Azure 上做检索的核心服务是 **[[azure-ai-search|Azure AI Search]]**，它的词汇：

```diagram
{"type":"flow","title":"Azure AI Search 的 pull 式索引管道","steps":[{"t":"Data source","s":"Blob、ADLS Gen2、Cosmos DB、SQL、OneLake、SharePoint（预览）…"},{"t":"Indexer","s":"爬取 → document cracking → 字段映射"},{"t":"Skillset","s":"AI enrichment：OCR、拆分、嵌入、实体…（enrichment tree）"},{"t":"Index","s":"可搜索的字段（searchable / filterable / vector…）"},{"t":"Query","s":"关键词 / 向量 / 混合 + semantic ranker"}]}
```

- **[[index|Index]]**：搜索服务上的可搜索内容，schema 是一组字段，每个字段有属性 **searchable、filterable、sortable、facetable、key、retrievable**，向量字段有 `dimensions` 和 `vectorSearchProfile`；恰好一个 key 字段；文档相当于行。
- **[[indexer|Indexer]]**：pull 模式的爬虫，按计划（最短每 5 分钟）把数据源装进索引，阶段是 document cracking → field mappings → skillset → output field mappings；push 模式则是你自己调 API 写文档。
- **[[skillset|Skillset]] 与 [[skill|skills]]**：挂在 indexer 上的 AI 加工链，把结果写进内存中的 enrichment tree（`/document` 根）；内置技能有 Text Split、OCR、Image Analysis、Key Phrase、Language Detection、Sentiment、Entity Recognition、PII、Text Translation、Azure OpenAI Embedding、GenAI Prompt、**Document Layout**、**Azure Content Understanding** 等；自定义技能用 Web API 或 Azure ML；工具型技能 Conditional、Shaper、Text Merge。
- **[[knowledge-store|Knowledge store]]**：把 skillset 的输出持久化到 Azure Storage：**projections** 分 tables（Table storage）、objects（JSON blob）、files（图片），常配 Shaper 技能，可接 Power BI。
- **[[integrated-vectorization|Integrated vectorization]]**：indexer + skillset 自动分块（Text Split）并嵌入（Azure OpenAI Embedding / Vision Vectorize），不用自己写向量管道。
- **[[vector-search|Vector search]]**（kNN，HNSW 或穷举）、**[[hybrid-search|Hybrid search]]**（一次请求同时跑 BM25 关键词和向量查询，用 **RRF** 合并）、**[[semantic-ranker|Semantic ranker]]**（对前 50 个结果做 L2 重排，返回 `@search.rerankerScore`（0–4）、semantic captions / answers；`queryType=semantic` 时计费）。
- **[[agentic-retrieval|Agentic retrieval]] / [[foundry-iq|Foundry IQ]]**：新一代检索——**knowledge base** 把多个 **knowledge sources**（已索引的 Blob / OneLake / SharePoint / 现有索引，或远程的 SharePoint、web）组织起来，由模型做查询规划、并行子查询、语义重排，返回带引用、按权限过滤的结果；agent 通过 MCP 工具 `knowledge_base_retrieve` 使用；reasoning effort 有 minimal / low / medium。
- **[[document-level-access|文档级访问控制]]**：security filters（在索引里放用户/组字段，用 `$filter` 过滤，GA）、POSIX 风格 ACL / RBAC scopes（预览）、Purview 敏感度标签和 SharePoint ACL（预览）。

> **考点** AI-103 里"按语义相似度搜索图片和文本"用 Azure Vision 的 multimodal embeddings；"把 PDF 里的表格和版式进索引"用 Document Layout 技能或 Content Understanding；"让检索结果尊重用户权限"用 security filters 或 Foundry IQ 的 ACL 同步。

来源：[What is Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search)、[Index](https://learn.microsoft.com/en-us/azure/search/search-what-is-an-index)、[Indexer](https://learn.microsoft.com/en-us/azure/search/search-indexer-overview)、[Skillsets](https://learn.microsoft.com/en-us/azure/search/cognitive-search-working-with-skillsets)、[Built-in skills](https://learn.microsoft.com/en-us/azure/search/cognitive-search-predefined-skills)、[Knowledge store](https://learn.microsoft.com/en-us/azure/search/knowledge-store-concept-intro)、[Projections](https://learn.microsoft.com/en-us/azure/search/knowledge-store-projection-overview)、[Vector search](https://learn.microsoft.com/en-us/azure/search/vector-search-overview)、[Hybrid search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview)、[Semantic ranker](https://learn.microsoft.com/en-us/azure/search/semantic-search-overview)、[Agentic retrieval](https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-overview)、[Foundry IQ](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-foundry-iq)、[Document-level access control](https://learn.microsoft.com/en-us/azure/search/search-document-level-access-overview)。

## Foundry Agent Service 与 agent 框架 {#agents}

**[[foundry-agent-service|Foundry Agent Service]]** 是 Azure 上托管 agent 的运行时。agent 的种类：**[[prompt-agent|prompt agents]]**（声明式：指令 + 模型 + 工具，门户或 SDK 定义）、voice-based prompt agents（Voice Live）、**[[hosted-agent|hosted agents]]**（你自己的代码 / 容器，用 Agent Framework、LangGraph、OpenAI Agents SDK 等写，托管 endpoint 和专属 Entra 身份）；临时 agent 可直接用 Responses API。

工具：

| 工具 | 要点 |
|---|---|
| **[[function-calling|Function calling]]** | 你用 JSON schema 定义函数；模型返回 `function_call`（含 `call_id`、`arguments`），你的代码执行后把 `function_call_output` 作为下一次请求的 item 送回 |
| **[[file-search|File search]]** | 把上传文件放进 **vector store**（解析 → 分块（默认 800 token、重叠 400）→ 嵌入（text-embedding-3-large）→ 混合检索 → 重排）；单文件 ≤ 512 MB |
| **[[code-interpreter|Code interpreter]]** | 在微软托管的沙箱（Azure Container Apps dynamic sessions，无出站网络）里跑 Python |
| **Web search / [[bing-grounding|Grounding with Bing Search]]** | 后者需要付费的 Grounding with Bing 资源和连接，返回必须展示的 `url_citation`；**数据会离开 Azure 合规和地理边界**；新的 web search 工具不需要 Bing 资源 |
| **[[mcp|MCP]]** | `type: "mcp"`，`server_url`、`require_approval`（always / never）、`allowed_tools`；认证走 project connection：none、custom-keys、oauth2、user-entra-token（身份透传）、project-managed-identity、agentic-identity |
| **[[a2a|A2A]]** | 调用远程 Agent2Agent endpoint；`a2a`（协议 1.0）已 GA；取代 classic 的 Connected Agents；Foundry agent 也能把自己暴露成 A2A endpoint |
| OpenAPI、Azure Functions、SharePoint、Fabric data agent、Fabric IQ、Work IQ、browser automation、computer use、image generation | 各自对应 AI-103 的"集成 APIs / 知识存储 / 自定义函数"考点 |
| **[[agent-memory|Memory]]**（预览） | 托管的长期记忆存储：user profile、chat summary、procedural memory，按 scope（如 `{{$userId}}`）隔离 |

**[[toolbox|Toolbox]]** 把一组工具放在一个 MCP 兼容的 endpoint 后面统一管理：集中认证、toolbox 级 guardrails、版本（提升默认版本不用重新部署 agent）、**tool search**（预览，只暴露 `tool_search` + `call_tool` 两个元工具以节省上下文）、**skills**（预览，可版本化的多步工作流）；Agent Framework、LangGraph、GitHub Copilot 都能用它。

其他 agent 概念：agent 有 Entra 身份；发布时产生版本和稳定 endpoint，可发布到 Teams / Microsoft Copilot，登记进 Entra Agent Registry；私有网络（BYO VNet）；内容安全和 XPIA 防护。

### 三个框架怎么分 {#frameworks}

| 框架 | 定位 | 要点 |
|---|---|---|
| **[[agent-framework|Microsoft Agent Framework]]** | 开源 SDK（.NET、Python，Go 预览），**Semantic Kernel + AutoGen 的直接后继** | Agents（模型 + 工具 + MCP）、Harness Agent、**Workflows**（图式的显式多 agent 编排）、Integrations；官方口诀："能写成函数就别用 agent"；prompt flow 的迁移目标 |
| **[[semantic-kernel|Semantic Kernel]]** | 轻量开源开发套件（C#、Python、Java），用 plugins 把现有代码/API 描述给模型，由 SK 把模型的请求翻译成函数调用 | 1.0+ 承诺不破坏兼容；被 Agent Framework 继承 |
| **[[agents-sdk|Microsoft 365 Agents SDK]]** | 面向 Teams / Microsoft 365 Copilot / 网页等**渠道**的 agent 运行时（Activity、turn、state），模型无关 | Bot Framework SDK 的后继 |

来源：[Foundry Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)、[Function calling](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/function-calling)、[File search](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/file-search)、[Code interpreter](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/code-interpreter)、[Bing tools](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/bing-tools)、[MCP tool](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/model-context-protocol)、[A2A tool](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/agent-to-agent)、[Memory](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory)、[Toolbox](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview)、[Agent Framework overview](https://learn.microsoft.com/en-us/agent-framework/overview/)、[Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/overview/)、[Agents SDK](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agents-sdk-overview)。

## 评估与可观测性 {#observability}

Foundry 的 **[[observability|observability]]** 三件套：**Evaluation**（评估）、**Monitoring**（监控，接 Azure Monitor Application Insights）、**[[tracing|Tracing]]**（基于 OpenTelemetry 的分布式追踪：`invoke_agent`、`execute_tool` 等 span，记录输入输出、工具调用、token、延迟）。评估贯穿三个阶段：选基础模型（benchmark）→ 上线前评估（自己的数据 + **[[red-teaming|AI red teaming agent]]** 模拟攻击，用 **Attack Success Rate** 衡量）→ 上线后监控（持续评估抽样流量、定期评估、定期红队、Azure Monitor 告警）。

**[[evaluator|内置评估器（evaluators）]]**按组记：

| 组 | 评估器 |
|---|---|
| General purpose | Coherence、Fluency |
| Textual similarity | Similarity、F1 Score、BLEU、GLEU、ROUGE、METEOR |
| RAG | Retrieval、Document Retrieval、**[[groundedness|Groundedness]]**（1–5）、Groundedness Pro（预览，pass/fail）、Relevance、Response Completeness（预览） |
| Risk and safety | Hate and Unfairness、Sexual、Violence、Self-Harm、Protected Materials、Indirect Attack (XPIA)、Code Vulnerability、Ungrounded Attributes、Prohibited Actions、Sensitive Data Leakage |
| Agent | Task Adherence、Task Completion、Intent Resolution、Tool Call Accuracy、Tool Selection、Tool Input Accuracy、Tool Output Utilization、Tool Call Success、Task Navigation Efficiency 等 |
| 其他 | Rubric（预览）、Azure OpenAI graders（Model Labeler、String Checker、Text Similarity、Model Scorer）、自定义评估器 |

> **考点** 题目说"检测 fabrication / 幻觉"→ Groundedness；"回答是否切题"→ Relevance；"agent 有没有按指令做"→ Task Adherence；"工具调对了没"→ Tool Call Accuracy；"抵抗注入攻击"→ Indirect Attack 评估或红队。agent playground 里的评估默认开启且计费。

来源：[Observability](https://learn.microsoft.com/en-us/azure/foundry/concepts/observability)、[Built-in evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/built-in-evaluators)、[AI red teaming agent](https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/run-ai-red-teaming-cloud)、[Tracing](https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept)、[Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)。

## 内容安全、guardrails 与负责任 AI {#safety}

**[[content-safety|Azure AI Content Safety]]** 是独立的 Foundry Tool，也是 Azure OpenAI 内容过滤的底层：

- 四个危害类别 **Hate and Fairness、Sexual、Violence、Self-Harm**，每类四级严重度 **safe / low / medium / high**（文本和图像）；Azure OpenAI 的默认过滤对提示和补全都是 **Medium + High 过滤**；把补全侧的过滤关掉或改为只标注要通过 **Limited Access** 审批（"Modified content filters"）。
- **[[prompt-shields|Prompt Shields]]**：检测 **user prompt attacks**（旧名 jailbreak risk detection；子类型：改系统规则、嵌入对话模拟、角色扮演、编码攻击）和 **document attacks**（间接注入，藏在文档、网页、邮件里）；前者默认开，后者默认关且要给文档打 `<documents>` 标记；**Spotlighting**（预览）给文档内容加标记帮助模型区分指令和数据。
- **[[groundedness-detection|Groundedness detection]]**（预览）：检查模型输出是否有来源支撑，有 reasoning 模式和纠正（correction）；**[[protected-material|Protected material]]** 检测受版权保护的文本和代码（代码会给引用和许可证；和 Customer Copyright Commitment 相关）；**custom categories**、**blocklists**；**task adherence**（agent）。
- 流式输出的过滤有两种模式：默认缓冲后按块返回；**Asynchronous Filter** 逐 token 返回、信号延迟但在约 1,000 字符窗口内保证。
- **Abuse monitoring**：内容分类 → 滥用模式捕获 → 审核与决定（默认自动审核）→ 通知；可申请"modified abuse monitoring"。

**[[guardrails|Guardrails and controls]]**（门户叫 Guardrails，REST 里叫 RAI policy）：一个 **guardrail** 是一组 **controls**，每个 control = 风险（上述类别 + user prompt attacks、indirect attacks、protected material、groundedness、PII、task adherence…）× 干预点（**User input / Tool call / Tool response / Output**）× 动作（**Annotate** 或 **Annotate and block**）；默认 **Microsoft.DefaultV2**；agent 的 guardrail 完全覆盖模型的。

**[[responsible-ai|负责任 AI]]**：微软的 **Responsible AI Standard** 基于六项原则——**fairness（公平）、reliability and safety（可靠与安全）、privacy and security（隐私与安全）、inclusiveness（包容）、transparency（透明）、accountability（问责）**；标准有 6 个领域、14 个目标，每个目标分解成 requirements 和 practices，影响评估（Impact Assessment）是主要驱动。Foundry 文档把实践归纳为 **Discover → Protect → Govern**。**[[transparency-note|Transparency Note]]** 是微软为每个 AI 服务写的"它怎么工作、有什么局限、系统所有者能做哪些选择"的说明。**[[limited-access|Limited Access]]** 指必须申请审批才能用的功能（Face 识别、自定义语音的 personal voice、修改内容过滤等）。

来源：[Content Safety overview](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview)、[Harm categories and severity](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/content-filter-severity-levels)、[Default safety policies](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/default-safety-policies)、[Configure content filters (classic)](https://learn.microsoft.com/en-us/azure/foundry-classic/openai/how-to/content-filters)、[Prompt Shields](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection)、[Groundedness detection](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/groundedness)、[Content streaming](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/content-streaming)、[Abuse monitoring](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/abuse-monitoring)、[Guardrails overview](https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview)、[Responsible AI for Foundry](https://learn.microsoft.com/en-us/azure/foundry/responsible-use-of-ai-overview)、[Responsible AI principles (compliance)](https://learn.microsoft.com/en-us/compliance/assurance/assurance-artificial-intelligence)、[Responsible AI in Azure ML](https://learn.microsoft.com/en-us/azure/machine-learning/concept-responsible-ai)、[Transparency note](https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-ai/openai/transparency-note)。

## Foundry Tools 家族 {#tools}

**[[foundry-tools|Foundry Tools]]**（旧称 Azure AI services）是预训练的 AI 服务，通过 Foundry 资源的同一 endpoint 调用，也能单独建资源。逐个记：

### 文档：Document Intelligence 与 Content Understanding {#documents}

- **[[document-intelligence|Document Intelligence]]**：从文档提取文本、版式和字段。模型分三类：**文档分析**——**Read**（印刷和手写文字）、**Layout**（文字 + 表格 + 结构）、general document（键值对）；**[[prebuilt-model|预构建]]**——invoice、receipt、idDocument、contract、健康保险卡、信用卡、支票、工资单、银行对账单、各类美国税表（W-2、1040、1099…）；**自定义**——**[[custom-template-model|custom template]]**（版式固定的表单，训练几分钟）、**[[custom-neural-model|custom neural]]**（结构化 / 半结构化 / 非结构化混合，推荐先试）、composed（多个自定义模型合一）、**custom classifier**（先分类再拆分）。训练自定义模型**最少 5 个样本**。工具 **Document Intelligence Studio**（标注、训练；功能正迁入 Foundry 门户）；有容器版。
- **[[content-understanding|Azure Content Understanding]]**：用生成式 AI 统一处理文档、图像、音频、视频。核心对象 **[[analyzer|analyzer]]**（可配置的处理单元）：预构建的 base（`prebuilt-document`、`prebuilt-audio`、`prebuilt-video`、`prebuilt-image`）、RAG 用（`prebuilt-documentSearch`、`prebuilt-videoSearch`）、行业（invoice、receipt、idDocument）和自定义（`baseAnalyzerId` + `fieldSchema`）。字段方法 **extract**（原文抽取，带来源和置信度）、**classify**（固定类别）、**generate**（自由生成）；输出 Markdown 或 JSON，适合直接喂给 RAG。GA API `2025-11-01`；旧的 **pro mode 已随 `2025-05-01-preview` 退役**，后继是 **agentic mode**（预览：多步推理、跨文档计算与校验，仅文档）。

### 视觉：Azure Vision、Face、Custom Vision {#vision}

- **[[image-analysis|Image Analysis]]**（Azure Vision）：4.0 提供 read（同步 OCR）、captions、dense captions、tags、object detection、people detection、smart crop、**multimodal embeddings**（图像和文本进同一向量空间，可用文本搜图）；3.2 还有 brands、faces、celebrities、landmarks、adult content。**Image Analysis 4.0 已宣布 2028-09-25 退役**。
- **[[ocr|OCR 的选择]]**：图片里的文字（标牌、海报）用 **OCR for images（Image Analysis 4.0 Read，同步）**；文档用 **Document Intelligence 的 read 模型（异步）**；Vision 3.2 的 Read 不再更新。
- **[[face|Face]]**：检测、**verification**（1:1）、**identification**（1:N，person group）、liveness、find similar；**Limited Access**：只对微软托管客户和合作伙伴开放，须申请，不得用于美国警察部门。
- **[[custom-vision|Custom Vision]]**：自己上传图片打标签训练**图像分类**（每张图的标签）或**目标检测**（边界框）；project → tags → train → iteration → publish 到预测 endpoint，可导出 compact 模型；**已宣布退役，支持到 2028-09-25**，官方建议迁移到 Content Understanding / Foundry 模型 / AutoML。
- **[[video-indexer|Azure AI Video Indexer]]**：从视频和音频提取洞察（转录、OCR、人脸和名人（Limited Access）、场景镜头、物体、关键词、主题、情感、摘要）；有云版和 Arc 边缘版。

### 语言：Azure Language {#language}

- **[[azure-language|Azure Language]]** 的核心功能：**[[pii|PII 检测]]**（文本 / 对话 / 文档，识别并脱敏）、language detection、**[[ner|命名实体识别（NER）]]**（预构建和自定义）、Text analytics for health；"legacy（仍支持）"的功能：**[[clu|CLU]]**（自定义意图 + 实体的对话理解）、**[[question-answering|custom question answering]]**（从文档和网址建知识库）、**[[summarization|摘要]]**（抽取式 / 生成式，对话摘要，call center 摘要）、sentiment analysis 与 opinion mining、key phrase extraction、entity linking、custom text classification、orchestration workflow。**CLU、custom question answering 和 summarization 定于 2029-03-31 从 Azure Language 退役**，官方指向 Foundry 模型。还有 Language MCP server 和预构建 agent（Intent Routing、Exact Question Answering）。

### 语音：Azure Speech {#speech}

- **[[speech-to-text|Speech to text]]**：real-time（SDK / CLI / 短音频 REST）、**fast transcription**（同步）、**batch transcription**（异步 REST）；diarization（最多 35 人）、phrase lists、语言识别。
- **[[custom-speech|Custom speech]]**：基础模型是微软数据训练的 Universal Language Model；自定义模型用**文本数据**提高领域词汇识别、用**音频 + 人工转录**适应声学环境；流程 create project → upload data → train → 在 Speech Studio 听测 → 用 **WER（word error rate）**量化评估 → 部署到自定义 endpoint（batch transcription 不需要 endpoint）。
- **[[text-to-speech|Text to speech]]**：标准神经语音（100+ 地区）、HD 语音、**custom voice**（professional voice fine-tuning 和 personal voice，后者 Limited Access）、**[[ssml|SSML]]** 控制发音和语调、visemes、批量合成、text to speech **avatar**。
- **[[speech-translation|Speech translation]]**：实时语音转文字翻译和语音到语音翻译；Live Interpreter。
- **Speech SDK**：C#、C++、Go、Java、JavaScript、Objective-C/Swift、Python；Speech CLI（`spx`）；REST。

### 翻译：Azure Translator {#translator}

**[[translator|Azure Translator]]**：文本翻译（新版 API `2026-06-06` 可选 LLM 并支持 adaptive custom translation；v3 有 dynamic dictionary、prevent translation）、**文档翻译**（异步批量——源和目标都在 Blob storage 容器里，保留格式；同步单文件——不需要 Blob）、**Custom Translator**（用自己的平行语料训练领域模型，词典）、容器版。

### 容器：把 Foundry Tools 跑在本地 {#containers}

**[[containers|容器]]**让部分服务跑在你自己的 Docker / Kubernetes / Azure Container Instances / Azure Stack 环境里（数据不出本地）。镜像来自 `mcr.microsoft.com`；启动必须传 **Eula、Billing（资源 endpoint）、ApiKey** 三个参数，并能访问 Azure（`*.cognitiveservices.azure.com` 443 端口）上报计量；**disconnected containers** 完全离线，需要 commitment plan 和 license 文件。可容器化的有：Language 各功能（key phrase、language detection、sentiment、TA for health、NER、PII、custom NER、summarization、CLU）、Speech（STT、custom STT、fast transcription、neural TTS、language id）、Vision Read OCR、Document Intelligence（单独文档）、Translator（受限）、Content Safety（预览）。

来源：[Document Intelligence overview](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/overview)、[Custom models](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/train/custom-model)、[Document Intelligence Studio](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/studio-overview)、[Content Understanding overview](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview)、[Analyzer reference](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/analyzer-reference)、[Agentic mode](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/agentic-mode)、[Image Analysis](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-image-analysis)、[OCR](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-ocr)、[Face](https://learn.microsoft.com/en-us/azure/ai-services/face/overview-identity)、[Custom Vision](https://learn.microsoft.com/en-us/azure/ai-services/custom-vision-service/overview)、[Video Indexer](https://learn.microsoft.com/en-us/azure/azure-video-indexer/video-indexer-overview)、[Azure Language](https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview)、[CLU](https://learn.microsoft.com/en-us/azure/ai-services/language-service/conversational-language-understanding/overview)、[Custom question answering](https://learn.microsoft.com/en-us/azure/ai-services/language-service/question-answering/overview)、[Summarization](https://learn.microsoft.com/en-us/azure/ai-services/language-service/summarization/overview)、[PII](https://learn.microsoft.com/en-us/azure/ai-services/language-service/personally-identifiable-information/overview)、[Speech overview](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/overview)、[Speech to text](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-to-text)、[Custom speech](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/custom-speech-overview)、[Text to speech](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech)、[Speech translation](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-translation)、[Speech SDK](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-sdk)、[Translator](https://learn.microsoft.com/en-us/azure/ai-services/translator/overview)、[Container support](https://learn.microsoft.com/en-us/azure/ai-services/cognitive-services-container-support)。

## 周边 Azure 服务速记 {#azure-services}

AI-103 的架构题会点名这些服务，记住定位即可：

| 服务 | 一句话 | 常见搭配 |
|---|---|---|
| **[[azure-functions|Azure Functions]]** | 无服务器函数，靠 **triggers 和 bindings** 接事件；托管计划 Flex Consumption（推荐）、Premium、Dedicated、Container Apps、Consumption（旧） | 自定义 skill、agent 的工具、事件处理 |
| **[[logic-apps|Azure Logic Apps]]** | 低代码工作流 + 1,400 多个连接器；**Consumption**（多租户、按执行付费）vs **Standard**（单租户、有状态/无状态工作流、VNet）；现在也能做 agentic workflows 并作为 Foundry agent 的工具 | 集成、审批 |
| **[[cosmos-db|Azure Cosmos DB]]** | 全托管 NoSQL + 向量数据库，毫秒延迟、多区域写、**RU/s** 计吞吐，内置向量和混合搜索（DiskANN） | agent 线程存储、RAG 向量库、聊天历史 |
| **[[blob-storage|Azure Blob Storage]]** | 对象存储：storage account → container → blob（block / append / page blob） | 索引的数据源、文档翻译、BYO 存储 |
| **[[aks|AKS]] / [[aci|ACI]] / Container Apps** | 托管 Kubernetes（Automatic 或 Standard 模式）/ 最简单的单容器运行 / 无服务器容器平台（可缩到零） | 跑 Foundry Tools 容器、hosted agent |
| **[[azure-machine-learning|Azure Machine Learning]]** | 训练、部署、MLOps 的平台：workspace、studio、designer、**AutoML**、managed endpoints | 自定义模型；**prompt flow 定于 2027-04-20 退役** |
| **[[azure-monitor|Azure Monitor]] / [[application-insights|Application Insights]]** | 统一可观测性；App Insights 是 APM，基于 OpenTelemetry，日志进 Log Analytics 用 **KQL** 查询 | agent 遥测、告警 |
| **[[key-vault|Key Vault]]、[[private-endpoint|Private Link]]、[[managed-identity|托管标识]]** | 第 2 章 | 安全架构题 |

来源：[Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview)、[Logic Apps](https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-overview)、[Cosmos DB](https://learn.microsoft.com/en-us/azure/cosmos-db/overview)、[Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)、[AKS](https://learn.microsoft.com/en-us/azure/aks/what-is-aks)、[ACI](https://learn.microsoft.com/en-us/azure/container-instances/container-instances-overview)、[Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/overview)、[Azure Machine Learning](https://learn.microsoft.com/en-us/azure/machine-learning/overview-what-is-azure-machine-learning)、[Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview)、[Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)。

## 退役与弃用速查 {#deprecations}

题库里仍有按旧功能出的题；考试"以 GA 功能为主"，所以知道什么已经退役很重要：

| 功能 | 状态 | 替代 |
|---|---|---|
| Assistants API | 2026-08-26 退役 | Responses API / Agent Service |
| `azure-ai-inference` SDK | 2026-08-26 退役 | `azure-ai-projects` + OpenAI client |
| Azure OpenAI On Your Data | 2026-10-14 退役 | Agent Service + Foundry IQ |
| DALL-E 3 / DALL-E 2 | 2026-03-04 / 2025-01-27 退役 | GPT-Image 系列 |
| Prompt flow | 2027-04-20 退役 | Microsoft Agent Framework |
| Image Analysis 4.0 | 2028-09-25 退役 | 迁移指南（多模态模型、Content Understanding） |
| Custom Vision | 支持到 2028-09-25 | Content Understanding、Foundry 模型、AutoML |
| CLU、custom question answering、summarization（Azure Language） | 2029-03-31 退役 | Foundry 模型 |
| LUIS / QnA Maker | 已于 2025-10-01 / 2025-03-31 退役 | CLU / custom question answering（本身也将退役） |
| Content Understanding pro mode | 已随 2025-05-01-preview 退役 | agentic mode（预览） |
| Bot Framework SDK | 已归档，2025-12-31 起不受理支持 | Microsoft 365 Agents SDK |

来源：见各节来源；另见 [Retired models](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/retired-models)、[Navigate from classic](https://learn.microsoft.com/en-us/azure/foundry/how-to/navigate-from-classic)。
