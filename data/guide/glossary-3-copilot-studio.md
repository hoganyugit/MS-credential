# 术语表 · Copilot Studio

### Microsoft Copilot Studio {#copilot-studio}
- zh: 微软做 agent 的低代码图形化工具
- aliases: Copilot Studio
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio
- see: harness | knowledge-source | tool | topic | copilot-credits
- chapter: 04-copilot-studio/what

copilotstudio.microsoft.com；构件是 Agents、Workflows、Agent flows；agent 存在 Dataverse、按环境隔离、用解决方案做 ALM；管理区有 Analytics、Evaluations、Administration。按 Copilot Credits 计费。

### Harness {#harness}
- zh: agent 的运行时层（standard / GitHub Copilot / Copilot chat 三种）
- aliases: standard harness | GitHub Copilot harness | Copilot chat harness
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/harnesses-overview
- see: copilot-studio
- chapter: 04-copilot-studio/what

standard harness 跑规则型 agent（主题、工具、agent flows）；GitHub Copilot harness 跑重推理的 agent 和 workflows（文件、技能、记忆；2026-06 起 production-ready preview）；Copilot chat harness 扩展 Microsoft Copilot Chat（declarative agent）。文档现在都按 harness 标注功能适用范围。

### Instructions {#instructions}
- zh: agent 的指令：角色、规则、步骤
- aliases: agent instructions
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/generative-mode-guidance
- see: generative-orchestration | deep-reasoning
- chapter: 04-copilot-studio/instructions
- nohl: true

Copilot agent 上限 8,000 字符。建议：短；不要罗列工具，用 `/` 精确引用工具/主题/变量；有顺序就编号；写护栏和输出格式。指令改不了 fallback 消息、Adaptive Card 触发和检索行为。

### Generative orchestration {#generative-orchestration}
- zh: 生成式编排：由模型按描述选择主题、工具、知识和子 agent
- aliases: generative AI orchestration | the agent chooses
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions
- see: classic-orchestration | event-trigger | mcp | computer-use
- chapter: 04-copilot-studio/orchestration

新 agent 的默认值（Settings › Generative AI › Orchestration）。按主题描述选主题（触发节点显示 The agent chooses），按名字和描述调用工具并自动追问缺的输入，主动用知识，一次处理多个意图，Activity map 显示推理。事件触发器、computer use、MCP、连接 agent 都要求它。管理员可按环境关闭。

### Classic orchestration {#classic-orchestration}
- zh: 经典编排：按触发短语匹配主题
- aliases: classic mode | trigger phrases | trigger phrase
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions
- see: generative-orchestration | system-topic | generative-answers
- chapter: 04-copilot-studio/orchestration

内置 NLU 把用户话语和每个主题的触发短语（建议 5–10 条，上限 200）匹配；工具只能在主题里显式调用；知识只在无主题匹配时经 Conversational boosting 系统主题兜底。更可预测，但不支持多意图和自主触发。

### Deep reasoning {#deep-reasoning}
- zh: 让 agent 对复杂问题调用推理模型（预览）
- aliases: reasoning models
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-reasoning-models
- see: instructions | copilot-credits
- chapter: 04-copilot-studio/instructions

Settings › Deep reasoning (preview)：agent 自行判断，或指令里写 *reason* 强制；用 Azure OpenAI o3；Activity map 里有推理节点；按高级生成式工具费率计费。

### Knowledge source {#knowledge-source}
- zh: 知识源：agent 回答时检索的资料
- aliases: knowledge sources | Add knowledge
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio
- see: generative-answers | copilot-connectors | azure-ai-search | tenant-graph-grounding | dataverse
- chapter: 04-copilot-studio/knowledge

类型：公开网站（25）、上传文档（512 MB/个，500 个）、SharePoint（25）、Dataverse（2 源 × 15 表）、Copilot connectors、Azure AI Search、real-time 连接器（预览）。每个 agent 最多 500 个。相关设置：Allow ungrounded responses、Web search、Official source（仅 classic）、内容审核级别（Lowest–Highest，默认 High）。

### Tenant graph grounding {#tenant-graph-grounding}
- zh: 用 Microsoft 365 语义索引在整个租户的 Graph 数据上检索
- aliases: tenant graph grounding with semantic search | semantic index
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio
- see: work-iq | knowledge-source | copilot-credits
- chapter: 04-copilot-studio/knowledge

Generative AI 设置；要求生成式编排、Authenticate with Microsoft、租户内至少一个 Microsoft 365 Copilot 许可证；每次 10 Copilot Credits；把 SharePoint/连接器文件支持提高到 200 MB。较新的页面叫 Turn on Work IQ。

### Tool {#tool}
- zh: 工具：agent 能执行的动作
- aliases: tools
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent
- see: connector | agent-flow | prompt-tool | rest-api-tool | mcp | computer-use
- chapter: 04-copilot-studio/tools
- nohl: true

六种机制：Connector、Agent flow、Prompt、REST API、MCP、Computer use（类工具：Azure Bot Service skills、client tools）。配置分 Details（名字和描述驱动编排；Allow agent to decide dynamically；Ask the end user before running；End user / Maker-provided 认证）、Inputs（Dynamically fill with AI / Custom value）、Completion › After running（Don't respond / Write with generative AI / Send specific response / Send an adaptive card）。上限 128 个（建议 25–30）。

### Prompt tool {#prompt-tool}
- zh: 工具形式的单轮模型调用（Prompt builder 写的提示）
- aliases: prompt | prompts | custom prompt | custom prompts
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/bring-your-own-model-prompts
- see: prompt-builder | foundry-models
- chapter: 04-copilot-studio/tools
- nohl: true

可以改用 Foundry 目录里的模型：Model › + › Connect a model from Azure AI Foundry（填部署名和基础模型，endpoint 以 `/chat/completions` 结尾；仅 chat-completion 模型，GPT-5 家族及更新的不支持；受 Azure AI Foundry 连接器的数据策略管控，费用走 Azure 而不是 Copilot Credits）。

### REST API tool {#rest-api-tool}
- zh: 用 OpenAPI 规范把 REST API 变成工具（预览）
- aliases: REST API tools
- exams: AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api
- see: tool | custom-connector | http-request-node
- chapter: 04-copilot-studio/tools

Tools › Add tool › New tool › REST API：上传 OpenAPI v2 JSON（v3 自动转换），选解决方案，认证 None / API key（Header 或 Query）/ OAuth 2.0（可限 My organization only），勾选操作、补参数描述、发布、建连接。和 HTTP request 节点的区别：工具由编排器自动调用，节点在主题里手工调用。

### Model Context Protocol {#mcp}
- zh: MCP：让 agent 使用外部工具和资源的开放协议
- aliases: MCP | MCP server | MCP servers | MCP tools
- exams: AB-620 | AB-100 | AI-103
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp
- see: a2a | tool | toolbox | custom-connector
- chapter: 04-copilot-studio/tools

Copilot Studio 支持 MCP 的 tools 和 resources（不支持 prompts），只走 Streamable 传输（SSE 已停），通过 onboarding 向导或自定义连接器添加，受数据策略管控，需要生成式编排。Foundry Agent Service 用 `type: "mcp"` 工具连接远程服务器，toolbox 本身就是一个 MCP endpoint。Dynamics 365 有 ERP MCP server 和 CX MCP Server。

### Computer use {#computer-use}
- zh: 让 agent 用虚拟鼠标键盘操作网站和 Windows 应用（2026-05 GA）
- aliases: computer-using agent | CUA
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/computer-use
- see: tool | generative-orchestration | copilot-credits
- chapter: 04-copilot-studio/tools

配置 Name、Description、Model（OpenAI CUA、Claude Sonnet 4.5 GA）、Instructions、Credentials to use（Maker-provided / End user）、Human supervision、Stored credentials（可用 Key Vault）、Access control、Enforce HTTPS。运行在 Hosted browser（预览）、Cloud PC pool（预览）或自带机器（Power Automate for desktop）。监控看 Activity map / Transcript；日志和审计在 PPAC 设置。每步 5 credits，高级模型 15。

### Agent flow {#agent-flow}
- zh: 在 Copilot Studio 里创建的确定性自动化（类 Power Automate）
- aliases: agent flows | When an agent calls the flow | Respond to the agent
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview
- see: tool | power-automate | copilot-credits
- chapter: 04-copilot-studio/agent-flows

触发器 + 动作（AI capabilities、Human in the loop、Built-in tools、Connectors）；作为工具时用 When an agent calls the flow 触发器和 Respond to the agent 动作，默认 100 秒内响应，2026-05 起支持 Asynchronous response；人工环节有 multistage approval 和 request for information；错误处理用 Flow checker、Run after、Scope、Retry policy；每 100 个动作 13 credits；cloud flow 可单向转换。

### Topic {#topic}
- zh: 主题：预先设计的一段对话路径
- aliases: topics | custom topic | custom topics
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-create-edit-topics
- see: system-topic | variables | generative-answers | http-request-node | adaptive-card
- chapter: 04-copilot-studio/topics
- nohl: true

画布上的节点：Trigger、Message、Question、Adaptive Card、Condition、Variable management、Topic management（redirect / transfer / end）、Tool 节点、Advanced（Generative answers、Send HTTP request、events）。有 YAML 编辑器；可声明输入/输出变量；每个 agent 最多 1,000 个。生成式编排按描述选主题，classic 按触发短语。

### System topic {#system-topic}
- zh: 系统主题：内置的、不能删除的对话处理
- aliases: system topics | Fallback | Conversational boosting | Escalate | On Error | Conversation Start
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-system-topics
- see: topic | generative-answers
- chapter: 04-copilot-studio/topics

Conversation Start、Conversational boosting（生成式答案兜底）、End of Conversation（满意度调查）、Escalate（转人工）、Fallback（无主题匹配）、Multiple Topics Matched、On Error、Reset Conversation、Sign in；开语音后加 Silence detection、Speech unrecognized、Unknown dial pad press。可以关闭但不能删除。

### Variables {#variables}
- zh: Copilot Studio 的变量：topic / global / system / environment 四种作用域
- aliases: topic variable | global variable | global variables | system variable | system variables | Parse value
- exams: AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-variables-about
- see: environment-variable | power-fx | topic
- chapter: 04-copilot-studio/topics
- nohl: true

Topic（默认）、Global（跨主题）、System（`System.User.DisplayName`、`Activity.Text`、`Conversation.Id`、`Error.Code`…）、Environment（Power Platform 环境变量，只读）。类型 String、Boolean、Number、Table、Record、DateTime、Choice、Blank，首次赋值后固定；Question 节点自动创建；Parse value 节点按示例 JSON 解析；主题可声明输入输出。

### Send HTTP request node {#http-request-node}
- zh: 在主题里直接调用 REST API 的节点
- aliases: HTTP request | Send HTTP request | HTTP node
- exams: AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-http-node
- see: topic | rest-api-tool | variables
- chapter: 04-copilot-studio/topics

URL、方法（GET / POST / PATCH / PUT / DELETE）、headers、body（No Content / JSON Content / Raw content，可用 Power Fx）、响应类型（From Sample Data 推断）、保存到变量；错误处理 Raise an error（默认，走 On Error）或 Continue on error；超时默认 30 秒。受数据策略里的 HTTP 虚拟连接器管控。

### Generative answers {#generative-answers}
- zh: 生成式答案：按知识源生成回答的节点/能力
- aliases: generative answers node | Create generative answers | Search only selected sources
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-boost-node
- see: knowledge-source | system-topic | classic-orchestration
- chapter: 04-copilot-studio/generative-answers

Add node › Advanced › Generative answers。节点上选的知识源覆盖 agent 级知识；Search only selected sources 开 = 只用节点上的源、不走 fallback；classic 数据源还有 Bing Custom Search、Azure OpenAI on your data、Custom data（自己检索的文本）；回答可存入变量自行组织输出。Conversational boosting 系统主题就靠它兜底。

### Event trigger {#event-trigger}
- zh: 事件触发器：让 agent 不等用户说话就行动
- aliases: triggers | trigger | autonomous triggers
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-triggers-about
- see: autonomous-agent | generative-orchestration | dlp
- chapter: 04-copilot-studio/triggers
- nohl: true

由 Power Automate 连接器事件（SharePoint 新建项、OneDrive 文件、Planner、Recurrence、Dataverse 行、邮件）触发，把载荷和指令交给 agent，由生成式编排决定调什么工具和主题。只能用制作者凭据（有数据暴露警告）；按 messages/credits 计费；管理员可用数据策略禁止。

### Autonomous agent {#autonomous-agent}
- zh: 自主 agent：由事件触发、无需用户提示自行行动的 agent
- aliases: autonomous agents
- exams: AB-100 | AB-620 | AI-103
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-triggers-about
- see: event-trigger | task-agent | prompt-and-response-agent | agent-id
- chapter: 06-business-ai/agent-types

Copilot Studio 里靠事件触发器实现；Microsoft 365 里对应 custom engine agent 的主动消息；Entra Agent ID 里自主 agent 用 client credentials 流程；Dynamics 365 的 Case Management Agent、Procurement Agent 等都是自主 agent。Analytics 里它们的会话叫 event-trigger sessions。

### Child agent {#child-agent}
- zh: 子 agent：主 agent 内部的轻量 agent，共享上下文
- aliases: child agents | inline agent
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-child-agent
- see: connected-agent | generative-orchestration
- chapter: 04-copilot-studio/multi-agent

Agents › Add an agent › New child agent，把一组工具、指令、知识归拢，配置 When will this be used、输入输出、After running；有自己的 128 个工具额度。guidance 里叫 inline agent。

### Connected agent {#connected-agent}
- zh: 连接 agent：同一环境里另一个已发布的 Copilot Studio agent
- aliases: connected agents | Connect to an external agent | Let other agents connect to and use this one
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-copilot-studio-agent
- see: child-agent | a2a | fabric-data-agent | foundry-agent-service
- chapter: 04-copilot-studio/multi-agent

目标 agent 要打开 Settings › Let other agents connect to and use this one；可选 Pass conversation history；各自独立的设置、ALM 和渠道。外部选项还有 A2A（GA）、Microsoft Foundry（预览）、Microsoft Fabric（预览）、Microsoft 365 Agents SDK（预览）。带连接 agent 的主 agent 不能再被别人连接。

### Agent2Agent protocol {#a2a}
- zh: A2A：agent 调用 agent 的开放协议
- aliases: A2A | Agent2Agent | agent-to-agent | agent.json
- exams: AB-620 | AB-100 | AI-103
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-agent-to-agent
- see: mcp | connected-agent | foundry-agent-service
- chapter: 04-copilot-studio/multi-agent

Copilot Studio（2026-04 GA）填消息 Endpoint URL，名字和描述从 `/.well-known/agent.json` 读取，认证 None / API key / OAuth 2.0。Foundry Agent Service 的 `a2a` 工具（协议 1.0）已 GA，取代 classic 的 Connected Agents，Foundry agent 也可以把自己暴露为 A2A endpoint。

### Publish {#publish}
- zh: 发布：让 agent 的更改对所有渠道生效
- aliases: publishing
- exams: AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-fundamentals-publish-channels
- see: channel | agent-store
- chapter: 04-copilot-studio/channels
- nohl: true

一次发布对所有渠道生效；进行中的会话要等新会话（30 分钟不活动）才看到新内容；认证设置改动后也要重新发布。

### Channel {#channel}
- zh: 渠道：用户和 agent 对话的地方
- aliases: channels | demo website | custom website | Telephony | WhatsApp | customer engagement hub
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-fundamentals-publish-channels
- see: teams | direct-line | azure-bot-service | voice | publish
- chapter: 04-copilot-studio/channels
- nohl: true

Teams & Microsoft Copilot（要求 Authenticate with Microsoft）、SharePoint、WhatsApp、Demo website（要求 No authentication）、Custom website（Web Chat）、Mobile app / 自定义应用（Direct Line）、Web app / Native app（Agents SDK）、Facebook、Azure Bot Service 渠道、Telephony、Customer engagement hub（转 Dynamics 365 Customer Service）。管理员在 PPAC 的 Agent access channels 控制可用渠道。

### Voice {#voice}
- zh: Copilot Studio 的语音 agent（Basic / Real-time voice）
- aliases: voice agents | voice mode | real-time voice | DTMF
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/voice-configuration
- see: contact-center | voice-live | copilot-credits
- chapter: 04-copilot-studio/channels
- nohl: true

Settings › Voice › Enable voice：Basic（classic 编排）或 Real-time voice（生成式编排，GPT-Realtime 等模型，DTMF、打断、语音活动检测）；增加三个语音系统主题；电话渠道需要 Dynamics 365 Contact Center；按分钟计费（Classic 10 / GenAI 35 / Premium GenAI 75 credits）。

### Evaluations {#evaluation}
- zh: Copilot Studio 的 agent 评估（test set + 评估方法）
- aliases: evaluations | test set | test sets | evaluation method | General quality | Compare meaning | Keyword match | Exact match
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-overview
- see: copilot-agent-kit | evaluator | analytics
- chapter: 04-copilot-studio/analytics
- nohl: true

2026-03 GA。单轮 test set（Quick / Full question set、测试对话、CSV/TXT 导入，≤100 条）和多轮 conversation set（≤20 个用例 × 12 条消息）；方法 General quality（默认）、Content safety、Compare meaning、Tool use、Keyword match、Text similarity、Exact match、Custom；结果保留 89 天。

### Analytics {#analytics}
- zh: Copilot Studio 的分析页：效果、用量、会话结果
- aliases: Monitor page | conversational sessions | event-trigger sessions | Resolved | Escalated | Abandoned | Unengaged | CSAT | themes | transcripts
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-overview
- see: evaluation | application-insights | savings-calculator
- chapter: 04-copilot-studio/analytics
- nohl: true

数据 360 天，会话详情和转录 28 天；Summary、Overview KPI、会话类型（conversational 30 分钟超时 / event-trigger / hybrid）、Effectiveness（Resolved / Escalated / Abandoned / Unengaged、反应、CSAT、情感）、Use（themes、generated answer rate、工具和知识使用）、Savings calculator。需要 Analytics Viewer 角色，看转录还要 Bot Transcript Viewer。

### Telemetry {#telemetry}
- zh: 遥测：把 agent 的运行事件送到 Application Insights
- aliases: agent-level telemetry | environment-level telemetry
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/telemetry-overview
- see: application-insights | tracing
- chapter: 04-copilot-studio/analytics

agent 级：Settings › Advanced › Application Insights 填 connection string，事件进 `customEvents`（可选记录对话内容和节点事件；可用数据策略禁止）；环境级（预览）：PPAC 的 OpenTelemetry 导出，GenAI span 进 `dependencies`，仅 Managed Environments。

### Copilot Agent Kit {#copilot-agent-kit}
- zh: Power CAT 的 Copilot Studio 工具包（旧称 Copilot Studio Kit）
- aliases: Copilot Studio Kit | Power CAT | Conversation Analyzer | rubrics
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/kit-overview
- see: evaluation | analytics
- chapter: 04-copilot-studio/analytics

基于 Direct Line 的测试自动化（Response match、Topic match、Generative answers、Multi-turn、Plan validation；rubrics）、Conversation KPIs、Conversation Analyzer、Agent Inventory、Compliance Hub、Prompt Advisor、Webchat Playground 等；可做 pipeline 门禁。

### Copilot Credits {#copilot-credits}
- zh: Copilot Studio 的计费单位（原 messages）
- aliases: Copilot Credit | pay-as-you-go | Copilot Credit pack
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management
- see: copilot-hub | agent-flow | computer-use
- chapter: 04-copilot-studio/billing

2025-09-01 起取代 messages，按租户汇集。费率：classic answer 1、generative answer 2、agent action 5、tenant graph grounding 10、agent flow actions 13/100、生成式工具 basic/standard/premium 1/15/100 每 10 次、content processing 8/页。预付 pack、pay-as-you-go（Azure 订阅）或 prepurchase plan；Microsoft 365 Copilot 用户在 M365 内免费；超用 125% 禁用自定义 agent。

### Security scan {#security-scan}
- zh: 发布前的自动安全扫描与 Protection status
- aliases: protection status | Protected | Needs review
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-scan
- see: dlp | agent-365
- chapter: 02-identity-security/copilot-studio-security

三种配置会触发警告：No authentication、工具用 Maker-provided credentials、把 agent 共享给全组织。Agents 页的 Protection status（Protected / Needs review / Unknown）按认证、策略、内容审核评估，并有被拦截消息的安全分析。

### Single sign-on {#sso}
- zh: 单点登录：用户在渠道里已登录则 agent 不再要求登录
- aliases: SSO
- exams: AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication
- see: channel
- chapter: 02-identity-security/copilot-studio-security

Authenticate manually 支持 SSO（配置 token exchange URL）。Teams 和 Microsoft Copilot 渠道用 Authenticate with Microsoft 天然免登录。

### Agent template {#agent-template}
- zh: Copilot Studio 的 agent 模板
- aliases: agent templates | managed agents
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/template-fundamentals
- see: copilot-studio
- chapter: 04-copilot-studio/what

Agents 页 › Start with an agent template：IT Helpdesk、Safe Travels、Weather、Website Q&A、Sustainability Insights、Benefits 等。Managed agents 是自主、由触发器驱动并接收发布者更新的 agent。

### Suggested prompts {#suggested-prompts}
- zh: 建议提示：Teams / Copilot Chat 欢迎页上的示例问题
- aliases: starter prompts | conversation starters
- exams: AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-starter-prompts
- see: channel
- chapter: 04-copilot-studio/channels

最多 10 条，在 Overview 的 Suggested prompts 编辑，测试面板不显示。"Conversation starters" 是 declarative agent（Agents Toolkit）和 Demo website 里的叫法。

### Content moderation {#content-moderation}
- zh: 内容审核级别（Lowest–Highest）
- aliases: moderation level
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio
- see: knowledge-source | generative-answers | content-safety
- chapter: 04-copilot-studio/knowledge

默认 High；可在 agent、主题节点（优先）或 prompt 层设置。Evaluations 的 Content safety 方法则用 0–7 的严重度阈值。
