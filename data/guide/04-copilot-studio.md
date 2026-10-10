---
id: 04-copilot-studio
title: Copilot Studio 词汇：agent、知识、工具、主题、流
short: Copilot Studio
intro: AB-620 整门考试、AB-100 的大半设计题都用 Copilot Studio 的词汇出题。这一章按"一个 agent 由什么组成"把这些词串起来。
exams: AB-620 | AB-100
practice:
  ab-620: Knowledge sources & grounding | Tools, connectors & HTTP | Agent flows | Multi-agent & MCP | Prompts & generative answers | Topics & conversation design | Channels & publishing | Testing, evaluation & analytics | Responsible AI & content control
  ab-100: Copilot Studio agent design | Microsoft 365 Copilot extensibility
---
**[[copilot-studio|Microsoft Copilot Studio]]** 是微软做 agent 的低代码图形化工具（copilotstudio.microsoft.com），属于 Power Platform：agent 存在 [[dataverse|Dataverse]] 里，按 [[environment|环境]]隔离，用[[solution|解决方案]]搬运，受 [[ppac|PPAC]] 的策略管控。

```diagram
{"type":"layers","title":"一个 Copilot Studio agent 由什么组成","layers":[
{"label":"大脑","boxes":[{"t":"Instructions","s":"自然语言的角色和规则"},{"t":"Model","s":"主模型（默认 GPT-5.5 Chat）"},{"t":"Orchestration","s":"generative（默认）或 classic"}]},
{"label":"它知道什么","boxes":[{"t":"Knowledge sources","s":"网站、SharePoint、文件、Dataverse、Azure AI Search、连接器…"}]},
{"label":"它能做什么","boxes":[{"t":"Tools","s":"连接器、agent flow、prompt、REST API、MCP、computer use"},{"t":"Topics","s":"预先设计的对话路径（节点）"},{"t":"Triggers","s":"事件触发 = 自主 agent"},{"t":"Connected / child agents","s":"多 agent"}]},
{"label":"它在哪里被用","boxes":[{"t":"Channels","s":"Teams、Microsoft Copilot、网站、Direct Line、电话…"},{"t":"Authentication","s":"无 / Microsoft / 手动"}]},
{"label":"运营","boxes":[{"t":"Analytics & Evaluations"},{"t":"Application Insights"},{"t":"Copilot Credits"},{"t":"Solutions / ALM"}]}
],"arrows":["grounding","执行","发布到","监控"]}
```

## Copilot Studio 是什么、分几种 harness {#what}

文档把 agent 的运行时叫 **[[harness|harness]]**（"你做的东西"和"模型"之间那一层）。现在有三种：

| Harness | 适合 | 典型构件 |
|---|---|---|
| **Standard harness** | 规则明确、可控的 agent：主题、工具、agent flows、知识 | 本章绝大部分内容；AB-620 考的就是它 |
| **GitHub Copilot harness** | 重推理、长任务的 agent 和 workflows；文件、技能、记忆 | 2026 年 6 月起"production-ready preview" |
| **Copilot chat harness** | 扩展 Microsoft Copilot Chat（即 [[declarative-agent|declarative agent]]），只加知识和指令 | 见本章末节 |

三种构件：**Agents**（指令 + 知识 + 工具 + 主题）、**Workflows**（新的拖放设计器）、**[[agent-flow|Agent flows]]**（类似 Power Automate 的确定性自动化，可作为 agent 的工具）。管理区有 **Analytics**（分析）、**Evaluations**（评估）、**Administration**（agent 清单）。

来源：[What is Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio)、[Harnesses overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/harnesses-overview)。

## 编排：generative 还是 classic {#orchestration}

Settings › Generative AI › Orchestration 里的开关 **"Use generative AI orchestration for your agent's responses?"** 决定 agent 怎么"想"：

| | [[generative-orchestration|Generative orchestration]]（默认 Yes） | [[classic-orchestration|Classic orchestration]] |
|---|---|---|
| 怎么选主题 | 模型按主题的**描述**选（触发节点显示 "The agent chooses"） | 按**触发短语（trigger phrases）**匹配 |
| 工具 | 模型按工具名和描述自动调用，还能自动生成追问来补齐输入 | 只能在主题里显式调用 |
| 知识 | 主动用知识回答 | 只在没主题匹配时，通过 **Conversational boosting** 系统主题的[[generative-answers|生成式答案]]节点兜底 |
| 其他 | 一次处理多个意图；Activity map 显示推理过程；事件触发器、计算机使用、MCP、连接 agent 都要求它 | 更可预测 |

AB-100 爱问"什么时候用标准 NLP、CLU、生成式编排"：classic 的触发短语匹配是 Copilot Studio **内置 NLU**；**[[clu|CLU]]**（conversational language understanding）是 Azure Language 的自定义 NLU 模型，可以接进 standard harness 的 agent——CLU 的 intent 映射到主题的触发器，entity 出现在 Entities 页，通过 `System.Recognizer.IntentOptions` / `ExtractedEntities` 读取，适合已经训练好意图模型、要求精确可控识别的场景；生成式编排则把意图识别交给大模型，适合开放式、多意图的对话。

> **考点** 生成式编排下还有几个开关：**Allow ungrounded responses**（关掉后，凡是没用到知识或工具的回合都走 fallback 主题）、**Use information from the web / Web search**（用 Grounding with Bing Search）、**Content moderation**（Lowest–Highest，默认 High；节点级设置优先于 agent 级）。

来源：[Generative orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions)、[Knowledge sources](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)、[CLU integration overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-clu-integration)。

## 指令与模型 {#instructions}

**[[instructions|Instructions]]** 是 agent 的角色、规则和步骤（Copilot agent 上限 8,000 字符）。官方写法建议：短；不要罗列工具（模型会看工具描述），歧义时用 `/` 精确引用工具、主题或变量；有顺序就编号；写护栏和输出格式；指令改不了 fallback 消息、Adaptive Card 触发和检索行为。

**模型**在 Overview › Model 选择：默认 **GPT-5.5 Chat**；GA 的还有 GPT-4.1、GPT-5 Chat、Claude Sonnet 4.6、Claude Opus 4.6/4.7（跨地域）；预览 GPT-5 Reasoning (Deep)、GPT-5 Auto。非微软模型需要管理员在 PPAC 打开 **Turn on external models** 并在 Microsoft 365 admin center 同意提供商条款。**[[deep-reasoning|Deep reasoning]]**（预览）让 agent 对复杂问题调用推理模型（Azure OpenAI o3），指令里写 *reason* 可强制触发，按高级生成式工具费率计费。

来源：[Generative mode guidance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/generative-mode-guidance)、[Select the agent model](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-select-agent-model)、[External response models](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-select-external-response-model)、[Reasoning models](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-reasoning-models)。

## 知识源（knowledge sources） {#knowledge}

**[[knowledge-source|知识源]]**是 agent 回答问题时检索的资料，在 Knowledge 页用 **Add knowledge** 添加，或在[[generative-answers|生成式答案节点]]里指定。类型与上限（generative 编排 / classic 节点）：

| 类型 | 说明 | 上限 |
|---|---|---|
| **Public website** | 公开网站（通过 Bing 搜索） | 25 / 4 |
| **Documents** | 上传的文件，存在 Dataverse 里 | 单文件 512 MB，最多 500 个 |
| **SharePoint** | 站点或文件夹 URL，按用户权限 | 25 / 4 |
| **Dataverse** | 表数据，需开启 Dataverse search 和 Microsoft 认证；可配 synonyms / glossary | 每源 15 张表，每个 agent 2 个源 |
| **Enterprise data using connectors**（[[copilot-connectors|Copilot connectors]]） | 管理员先在 Microsoft 365 admin center 配置连接器，内容索引进 Microsoft Graph；手动认证须含 `ExternalItem.Read.All` | 不限 / 2 |
| **Azure AI Search** | 你自己的向量索引（一个连接一个索引），支持 integrated vectorization 和 semantic ranker；认证类型 Access Key / Client Certificate / Service principal / Entra ID Integrated | |
| **Real-time connectors**（预览） | 只索引元数据，运行时用用户的连接实时查询：Salesforce、ServiceNow、Azure SQL、Dynamics 365、Snowflake、Databricks、Zendesk、Confluence、Oracle、SAP OData、Google Sheets… | |

每个 agent 最多 500 个知识源。两个常考区分：

- **[[copilot-connectors|Copilot connectors]] vs Power Platform connectors**：前者把内容**索引**进 Microsoft Graph（有引用、语义索引、在 Microsoft 365 admin center 配置）；后者**实时调 API**、不搬数据，用作工具或实时知识。
- **[[tenant-graph-grounding|Tenant graph grounding with semantic search]]**（较新的页面叫 **Turn on Work IQ**）：让 agent 用 Microsoft 365 的语义索引在整个租户的 Graph 数据上检索；要求生成式编排、Authenticate with Microsoft、租户里至少一个 Microsoft 365 Copilot 许可证；每次 10 Copilot Credits。

> **易混** "Official source" 标记（让某个知识源优先）只在生成式编排关闭时可用。知识源的**内容审核级别**可以在 agent、主题节点或 prompt 三个层面设置，节点级优先。

来源：[Knowledge sources](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)、[Azure AI Search knowledge](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-azure-ai-search)、[Real-time connectors](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-real-time-connectors)、[Copilot connectors vs Power Platform connectors](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-graph-vs-power-platform-connectors)、[Copilot connectors as knowledge](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-connectors)、[Dataverse knowledge](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-dataverse)、[Quotas and limits](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-quotas)。

## 工具（tools） {#tools}

**[[tool|Tools]]** 是 agent 能执行的动作。六种机制：

| 机制 | 是什么 | 要点 |
|---|---|---|
| **[[connector|Connector]]** | 预制的标准/高级连接器，或你自建的 [[custom-connector|custom connector]]（需要 view + share 权限） | 受 [[dlp|数据策略]]管控 |
| **[[agent-flow|Agent flow]]** | 确定性的多步自动化（见下节） | 触发器 "When an agent calls the flow" |
| **[[prompt-tool|Prompt]]** | 单轮的模型调用（Prompt builder 写的提示，可带 Dataverse 知识） | 可换用 Foundry 目录里的模型 |
| **[[rest-api-tool|REST API]]**（预览） | 上传 OpenAPI v2 JSON（v3 自动转换），认证 None / API key / OAuth 2.0 | 自动生成工具 |
| **[[mcp|Model Context Protocol (MCP)]]** | 连接 MCP 服务器，服务器发布的 tools 和 resources 动态出现 | 只支持 Streamable 传输（2025-08 后不再支持 SSE） |
| **[[computer-use|Computer use]]** | 让 agent 用虚拟鼠标键盘操作网站和 Windows 应用 | 2026-05 GA |

类工具的东西：Azure Bot Service skills、client tools。生成式编排下每个 agent 最多 **128 个工具**（建议 25–30），子 agent 另算 128。

每个工具的配置分三块：**Details**（名字和描述——编排器就靠它们决定何时调用；**Allow agent to decide dynamically when to use the tool**；**Ask the end user before running**，默认否；认证 **End user** 还是 **Maker-provided**）、**Inputs**（每个输入 **Dynamically fill with AI** 或 **Custom value**）、**Completion › After running**（**Don't respond**（默认）/ **Write the response with generative AI** / **Send specific response** / **Send an adaptive card**）。

### MCP、REST API、computer use 的细节 {#tools-detail}

- **MCP**：Tools › Add a tool › New tool › Model Context Protocol 走 onboarding 向导（Server name / description / URL；认证 None、API key（Header 或 Query）、OAuth 2.0 的 Dynamic discovery / Dynamic / Manual），或者用带 `x-ms-agentic-protocol: mcp-streamable-1.0` 的自定义连接器。MCP 跑在连接器上，所以数据策略照样生效；工具页可 **Allow all** 或逐个开关；支持 tools 和 resources，不支持 prompts。
- **REST API 工具**：选 Solution、上传规范、配认证（OAuth 2.0 可限 **My organization only** 或 **Any Microsoft 365 organizations**）、勾选要暴露的操作、补全参数描述、发布、创建连接。
- **Computer use**：需要生成式编排；配置 Name、Description、Model（OpenAI CUA、Claude Sonnet 4.5 为 GA；Sonnet 4.6 / Opus 4.6 实验性，外部模型要管理员开启）、Instructions、可选 Inputs、Machine、**Credentials to use**（Maker-provided 默认 / End user）、**Human supervision**（邮件审核人、响应时限）、Stored credentials（内部或 Key Vault）、Access control 允许列表、Enforce HTTPS。运行位置：Hosted browser（预览）、Cloud PC pool（预览，Windows 365 for Agents）或自带机器（Power Automate for desktop ≥ 2.61，机器设置里 **Enable for computer use**）。监控：Activity › Activity map / Transcript（含截图）；PPAC 环境功能里设 Store logs in Dataverse、日志详细度（All data / Data without screenshots / Minimal）、保留期（默认 7 天）、审计送 Purview。计费每步 5 Copilot Credits，高级模型 15。

来源：[Add tools](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent)、[MCP overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp)、[Add an MCP server](https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-add-existing-server-to-agent)、[REST API tool](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api)、[Computer use](https://learn.microsoft.com/en-us/microsoft-copilot-studio/computer-use)、[Where computer use runs](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-where-computer-use-runs)、[Monitor computer use](https://learn.microsoft.com/en-us/microsoft-copilot-studio/monitor-computer-use)、[Prompts overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/prompts-overview)、[Foundry models in prompts](https://learn.microsoft.com/en-us/microsoft-copilot-studio/bring-your-own-model-prompts)。

## Agent flows {#agent-flows}

**[[agent-flow|Agent flow]]** 是在 Copilot Studio 里创建和管理的**确定性、基于规则**的自动化：一个触发器加一串动作，动作分 **AI capabilities**、**Human in the loop**、**Built-in tools**、**Connectors** 四组；用自然语言或设计器创建；Power Automate 的 cloud flow 可以**单向**转换成 agent flow；住在解决方案里；按 **Agent flow actions** 计费（每 100 个动作 13 credits），测试运行免费。

让 agent 调用它：触发器 **When an agent calls the flow** + 动作 **Respond to the agent**（每个分支都要有相同的输出），发布后在同一环境的解决方案里，通过 Tools › Add a tool › Flow 加进 agent，或在主题里 Add a tool。默认必须在 **100 秒**内响应（Asynchronous response 为 Off）；2026 年 5 月起新基础设施环境支持 **Asynchronous response = On**，流可以超过两分钟后再回调 agent（Teams 完整支持，Microsoft Copilot 和电话渠道不支持）。

**Human in the loop**：**Run a multistage approval**（Human review 连接器，预览）——Manual stage（First to respond / Everyone must approve）、AI stage（按指令由模型批准或拒绝并给理由，消耗 credits）、stage 之间可加 Condition；**Request for information**（预览）向某人收集 Text / Yes-No / Email / Number / Date 输入。

**错误处理**：设计器里的 **Flow checker**（有错不能发布）、Version history、Test；Power Automate 的 **Run after**（某动作失败 / 超时 / 跳过 / 成功后运行）、用 **Scope** 做 try/catch、**Retry policy**、**Terminate** 指定状态。

来源：[Agent flows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview)、[Use flows with agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flow-agent)、[Asynchronous response](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flow-asynchronous-response)、[Multistage approvals](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-advanced-approvals)、[Request for information](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-request-for-information)、[Flow designer](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flow-designer)、[Error handling guidance](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling)。

## 主题、节点与变量 {#topics}

**[[topic|Topic（主题）]]**是一段预先设计好的对话路径，在画布上用节点连接：Trigger、Message、Question、Adaptive Card、Condition、Variable management（设置 / 解析 / 清除）、Topic management（redirect / transfer / end）、Tool 节点（流、连接器、prompt…）、Advanced（[[generative-answers|Generative answers]]、[[http-request-node|Send HTTP request]]、events）。有 YAML 代码编辑器；classic 模式每个主题建议 5–10 条触发短语（上限 200）；每个 agent 最多 1,000 个主题。

**[[system-topic|系统主题]]**（不能删，可以关）：Conversation Start、Conversational boosting（生成式答案兜底）、End of Conversation（满意度调查）、Escalate（"找人工"）、**Fallback**（没有主题匹配时）、Multiple Topics Matched（"你是指…"）、On Error、Reset Conversation、Sign in；开语音后再加 Silence detection、Speech unrecognized、Unknown dial pad press。

**[[variables|变量]]**：**Topic** 作用域（默认）、**Global**（跨主题，`Global.` 前缀）、**System**（`System.User.DisplayName`、`Activity.Text`、`Conversation.Id`、`Error.Code`…）、**Environment**（Power Platform 环境变量，只读）。类型 String、Boolean、Number、Table、Record、DateTime、Choice、Blank，首次赋值后固定。Question 节点自动生成变量；**Parse value** 节点用示例 JSON 推断结构；主题可以声明输入 / 输出变量；表达式用 **[[power-fx|Power Fx]]**。

两个常考节点：

- **[[http-request-node|Send HTTP request]]**：URL、方法（GET / POST / PATCH / PUT / DELETE）、headers、body（No Content / JSON Content，可用 Power Fx 公式 / Raw content）、响应类型（可 **From Sample Data** 推断）、保存到变量；错误处理 **Raise an error**（默认，走 On Error 主题）或 **Continue on error**（拿到状态码和错误体自己处理）；超时默认 30 秒。
- **[[adaptive-card|Adaptive Card]]**：Message / Question 节点里加 Adaptive card（设计器或 JSON）；**Ask with Adaptive Card** 节点收集输入（自动生成输出变量，可 Edit Schema；重试次数默认 2）；JSON 可一次性转换成 Power Fx 公式动态生成；schema 最高 1.6（Teams 1.5）。

来源：[Create and edit topics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-create-edit-topics)、[System topics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-system-topics)、[Variables overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-variables-about)、[Work with variables](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-variables)、[HTTP request node](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-http-node)、[Send a message](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-send-message)、[Ask with Adaptive Card](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-ask-with-adaptive-card)、[Voice configuration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/voice-configuration)、[Quotas and limits](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-quotas)。

## 生成式答案节点 {#generative-answers}

**[[generative-answers|Generative answers]]** 节点（Add node › Advanced › Generative answers，节点名 "Create generative answers"）在主题里按指定知识源生成回答。节点上选的知识源覆盖 agent 级知识；**Search only selected sources** 关 = 用 agent 的全部知识，开 = 只用节点上选的（不走 fallback）。classic 时代的数据源还有 Bing Custom Search、Azure OpenAI on your data、**Custom data**（把自己检索到的文本放进变量再让模型总结）。输入通常是 `Activity.Text`；高级设置可把回答存进变量并取消 Send a message 自行组织输出（Teams 里要手动加引用；Save LLM response 选 Complete）。

来源：[Generative answers node](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-boost-node)。

## 自主 agent：事件触发器 {#triggers}

**[[event-trigger|Triggers（事件触发器）]]**让 agent 不等人说话就行动——这就是 Copilot Studio 语境下的"[[autonomous-agent|自主 agent]]"：由 Power Automate 连接器事件（SharePoint 新建项、OneDrive 新文件、Planner、Recurrence 定时、Dataverse 行变更、邮件到达…）触发，把事件载荷（JSON 或文本）连同指令交给 agent，由生成式编排决定调哪些工具和主题。要求：生成式编排；只能用**制作者的凭据**（因此有数据暴露警告）；按 messages/credits 计费；管理员可用数据策略禁止；需要开启 solution-aware cloud flow 共享。

来源：[Triggers](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-triggers-about)。

## 多 agent：child、connected、A2A、Foundry、Fabric {#multi-agent}

Agents 页 › **Add an agent**：

| 选项 | 是什么 | 要点 |
|---|---|---|
| **[[child-agent|New child agent]]** | 主 agent 内部的轻量 agent，把一组工具、指令、知识归拢；共享上下文 | 配置 When will this be used、输入输出、After running |
| **[[connected-agent|Connect to an external agent › Copilot Studio]]** | 同一环境里**另一个已发布的** agent；目标要开 Settings › Let other agents connect to and use this one；可选 Pass conversation history | 各自独立的设置、ALM、渠道；可复用 |
| **[[a2a|A2A agent]]**（GA 2026-04） | 任何实现 Agent2Agent 协议的 agent：填消息 Endpoint URL，名字和描述从 `/.well-known/agent.json` 读取；认证 None / API key / OAuth 2.0 | |
| **Microsoft Foundry**（预览） | Foundry project endpoint + Agent Id；Foundry 侧要启用 Activity protocol endpoint（REST / Python SDK），且来自新版门户 | |
| **Microsoft Fabric**（预览） | 连接 [[fabric-data-agent|Fabric data agent]]；不能从主题 redirect、不能在指令里引用；Microsoft Copilot 渠道不可用 | |
| **Microsoft 365 Agents SDK**（预览） | 以 `/api/messages` 结尾的消息 endpoint + connection string | |

设计原则（guidance）：**单一回应**（最终只由一个 agent 答用户）；工具/选择超过 30–40 个、领域不同、治理要求不同或要复用时才拆；connected agent 多一跳会增加延迟；带 connected agents 的主 agent 自己不能再被别人连接。

来源：[Add other agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents)、[Child agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-child-agent)、[Copilot Studio agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-copilot-studio-agent)、[A2A agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-agent-to-agent)、[Foundry agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-foundry-agent)、[Fabric data agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-fabric-data-agent)、[Agents SDK agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-microsoft-365-agents-sdk-agent)、[Multi-agent patterns](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns)。

## 发布、渠道与语音 {#channels}

**[[publish|Publish]]** 一次对所有渠道生效；正在进行的会话要等新会话（30 分钟不活动）才看到新内容。**[[channel|渠道]]**：**Teams & Microsoft Copilot**（先发布，勾选 Make agent available in Microsoft Copilot；要求 Authenticate with Microsoft；可用性选项：复制链接 / 给同事 / **Show to everyone in my org → Submit for admin approval**（进入 Microsoft 365 Agent Store 的 Built for your org）/ 下载 .zip / 允许加到团队）、**SharePoint**、**WhatsApp**、**Demo website**（要求 No authentication；设置欢迎语和 conversation starters）、**Custom website**（Bot Framework Web Chat + token endpoint）、**Mobile app / 自定义应用**（[[direct-line|Direct Line]] API；Settings › Security 里的 Web channel security 可要求密钥）、**Web app / Native app**（Agents SDK connection string）、**Facebook**、**Azure Bot Service 渠道**（Slack、Telegram、Twilio、Line、Direct Line Speech、Email…）、**Telephony**（电话）、**Customer engagement hub**（交给 Dynamics 365 Customer Service 的人工客服，见第 6 章）。管理员在 PPAC 的 **Agent access channels** 里决定哪些渠道可用。

**[[voice|语音]]**：Settings › Voice › Enable voice，**Basic**（classic 编排）或 **Real-time voice**（生成式编排，模型 GPT-Realtime / GPT-Realtime-Mini 等，支持 DTMF、打断、语音活动检测）；电话渠道需要 Dynamics 365 Contact Center；按分钟计费（Classic Voice 10、GenAI Voice 35、Premium GenAI Voice 75 credits）。

来源：[Publish and channels](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-fundamentals-publish-channels)、[Teams and Microsoft Copilot channel](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams)、[Demo and custom websites](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-connect-bot-to-web-channels)、[Custom apps (Direct Line)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-connect-bot-to-custom-application)、[Agents SDK channel](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-integrate-web-or-native-app-m365-agents-sdk)、[Voice configuration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/voice-configuration)、[Real-time voice agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/voice-realtime-voice-agents)。

## 监控、分析、评估与遥测 {#analytics}

- **Analytics / Monitor 页**：数据保留 360 天，会话详情和转录 28 天；**Summary**（AI 摘要）、**Overview** KPI、按会话类型分：**conversational sessions**（30 分钟超时）/ **event-trigger sessions**（自主 agent 健康）/ hybrid；**Effectiveness**（结果 Resolved / Escalated / Abandoned / Unengaged、用户反应、CSAT、情感）和 **Use**（themes、generated answer rate 与质量、工具使用、知识源使用）；**Savings calculator** 估算节省（第 6 章 ROI）。需要 Analytics Viewer 共享角色；看转录还要 Bot Transcript Viewer 安全角色。
- **[[evaluation|Evaluations]]**（GA 2026-03）：**test set** 分单轮（Quick / Full question set、从测试对话、CSV/TXT 导入 Question + Expected response，≤100 条）和多轮 conversation set（≤20 个用例，每个 ≤12 条消息）；**评估方法**：General quality（相关性、groundedness、完整性、abstention；默认）、Content safety（四类严重度 0–7）、Compare meaning、Tool use、Keyword match、Text similarity、Exact match、Custom（自写指令和标签）；结果保留 89 天；以登录用户身份运行。
- **[[application-insights|Application Insights]]**：agent 级——Settings › Advanced › Application Insights 填 connection string，开 Enable logging，可选 Log conversation details（否则不记录消息文本）、节点执行事件；事件进 `customEvents` 表（`customDimensions` 里有 type、channelId、text…），可用 KQL 查询；环境级（预览）——PPAC 的 OpenTelemetry 导出，GenAI span（InvokeAgent、ExecuteTool、OutputMessages）进 `dependencies` 表。
- **[[copilot-agent-kit|Copilot Agent Kit]]**（Power CAT，旧称 Copilot Studio Kit）：基于 Direct Line 的测试自动化（Response match、Topic match、Generative answers、Multi-turn、Plan validation；rubrics）、Conversation KPIs、Conversation Analyzer、Agent Inventory、Compliance Hub、Prompt Advisor 等。

来源：[Analytics overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-overview)、[Improve effectiveness](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-improve-agent-effectiveness)、[Evaluations overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-overview)、[Create test sets](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-create)、[Conversation test sets](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-multi-turn)、[Application Insights](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-bot-framework-composer-capture-telemetry)、[Telemetry overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/telemetry-overview)、[Copilot Agent Kit](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/kit-overview)。

## 计费：Copilot Credits {#billing}

**[[copilot-credits|Copilot Credits]]**（2025-09-01 起取代 "messages"，数量不变）按租户汇集。费率：

| 用量 | Credits |
|---|---|
| Classic answer | 1 |
| Generative answer | 2 |
| Agent action（工具调用） | 5 |
| Tenant graph grounding | 10 |
| Agent flow actions | 13 / 100 个动作 |
| Text and generative AI tools basic / standard / premium | 1 / 15 / 100 每 10 次响应 |
| Content processing | 8 / 页 |
| Computer use | 5 / 步（高级模型 15） |
| 语音 Classic / GenAI / Premium GenAI | 10 / 35 / 75 每分钟 |

购买方式：预付 **Copilot Credit pack**（租户许可证 Copilot Studio + 每用户 Copilot Studio User License）、**pay-as-you-go**（按环境绑定 Azure 订阅计费策略）、一年期 **prepurchase plan**；不结转。持有 **Microsoft 365 Copilot 许可证的用户**在 Microsoft 365 内使用这些 agent 不计费（agent flow 只限 When an agent calls the flow 触发的；computer use 除外）。超用到预付容量的 **125%** 时自定义 agent 被禁用；agent flow 的强制只阻止新运行。

来源：[Copilot Credits and billing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)、[Billing and licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing)。

## 扩展 Microsoft 365 Copilot {#m365-copilot}

两种扩展方式（第 1 章提过）：**[[declarative-agent|Declarative agent]]** 用 Copilot 自己的编排器和模型，只加指令、知识（Teams 消息、Copilot connectors、SharePoint、OneDrive）和动作（API），托管在 Microsoft 365 里，继承其合规与 RAI，不能主动触发；**[[custom-engine-agent|Custom engine agent]]** 自带编排器和模型，可托管在 Copilot Studio 或 Azure，支持群聊协作、主动消息、agent 间协作，自己负责合规。

| 工具 | 给谁 | 做什么 |
|---|---|---|
| **[[agent-builder|Agent Builder]]**（Microsoft Copilot 应用内） | 信息工作者 | 只有知识（SharePoint、Copilot connectors、网页）没有动作；要加动作就 **copy the agent to Copilot Studio**；在 Microsoft 365 admin center 管理 |
| **Copilot Studio** 的 Agents › Microsoft Copilot | maker | 做 declarative agent：知识选 SharePoint、Teams 聊天和会议、邮件、网站、Copilot connectors；能力 Create code, graphs, and documents / Create images；发布后选可用性 |
| **[[agents-toolkit|Microsoft 365 Agents Toolkit]]**（VS Code / Visual Studio / CLI，Teams Toolkit 的演进） | 开发者 | 脚手架 declarative agent 和 custom engine agent（基于 [[agents-sdk|Agents SDK]]），本地 Agents Playground 调试，CI/CD |
| **[[agents-sdk|Microsoft 365 Agents SDK]]** | 开发者 | 多渠道 agent 运行时（Activity、turn、state），模型无关；Bot Framework SDK 的后继 |

管理员侧：用户从 Microsoft Copilot 的 **Agent Store** 添加 agent，但 agent 要经过提交和审批；管理员在 Microsoft 365 admin center 的 Agents › All agents › Requests 审核，**Publish**（谁可安装）或 **Deploy**（预装给谁），可阻止 / 移除；需要 AI Administrator 或 Global Administrator 角色；**Agent Registry** 是全组织 agent 的集中视图。微软自带的 agent：Researcher、Analyst（预装并固定）、Teams 里的 Facilitator 和 Channel Agent、Interpreter、Planner Agent、Employee Self-Service、角色型的 Sales agent / Service Agent / Finance agent。**Copilot Tuning**（早期预览）让组织用 SharePoint 数据微调模型（Tune Context / Tune Tool / Tune Model）。

来源：[Declarative vs custom engine agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/agents-overview)、[Agent Builder](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder)、[Copilot Studio vs Agent Builder](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/copilot-studio-experience)、[Agents for Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-copilot-studio/microsoft-365-copilot-extend-with-agents)、[Agents Toolkit](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/overview-agents-toolkit)、[Agents SDK](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agents-sdk-overview)、[Manage agents in Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/manage-copilot-agents-integrated-apps)、[Agent Registry](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/agent-registry)、[Microsoft 365 agents admin guide](https://learn.microsoft.com/en-us/microsoft-365/copilot/agent-essentials/m365-agents-admin-guide)、[Copilot Tuning](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-tuning-overview)。
