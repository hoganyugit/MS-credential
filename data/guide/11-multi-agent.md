---
id: 11-multi-agent
title: 多 agent 系统：编排、协议、记忆、身份、护栏与运维
short: 多 agent
intro: AI-500 考的是把多个 agent 做成能上线的系统。这一章先给一张总图，再按"要不要多 agent → 跑在哪 → 怎么编排 → 怎么调工具和别的 agent → 记住什么 → 谁能访问什么 → 怎么防护 → 怎么评估、观测和发布"的顺序讲词汇和判断规则。
exams: AI-500 | AI-103
practice:
  ai-500: Multi-agent architecture & design | Orchestration patterns & workflows | Tools, MCP & A2A | Memory, context & state | Knowledge & RAG | Identity, access & secrets | Guardrails & safety | Evaluation & testing | Observability & monitoring | Performance, caching & cost | Release & CI/CD | Prompt engineering & fine-tuning
---
第 5 章讲了单个 agent 在 [[foundry|Microsoft Foundry]] 里由什么组成（模型、instructions、工具、知识）。AI-500 往上走一层：**多个 agent 怎么分工协作，并且在生产环境里可靠、安全、可观测地运行。** 这一章是 AI-500 的"地图"，第 12 章按官方考纲逐条展开细节，第 7 章的 AI-500 部分把题库按决策规则整理。

```diagram
{"type":"layers","title":"一个生产级多 agent 方案的分层","layers":[
{"label":"入口","boxes":[{"t":"渠道","s":"Web/移动应用、Teams、Microsoft 365 Copilot、其他 agent（A2A）"}]},
{"label":"编排","boxes":[{"t":"Agent Framework workflows","s":"executors + edges、checkpoint、人工审批"},{"t":"Foundry Agent Service","s":"prompt agent、hosted agent"},{"t":"LangGraph","s":"经 langchain-azure-ai 接入 Foundry"}]},
{"label":"能力","boxes":[{"t":"工具","s":"function calling、MCP、OpenAPI、toolbox"},{"t":"其他 agent","s":"A2A、agent-as-tool"},{"t":"知识","s":"Foundry IQ、Azure AI Search"},{"t":"记忆与状态","s":"memory store、thread、Redis、Cosmos DB"}]},
{"label":"横切","boxes":[{"t":"身份","s":"Entra Agent ID、托管身份、OBO、RBAC、Key Vault"},{"t":"护栏","s":"guardrails 四个介入点、红队测试"},{"t":"运维","s":"tracing、评估、告警、成本、版本与发布"}]}
],"arrows":["请求进入编排层","编排层调用能力","每一层都受横切控制"]}
```

读题时先给题目定位到这张图的某一层，再找那一层的判断规则：问"谁先谁后"是编排，问"怎么接另一个系统"是协议，问"记住/隔离/恢复"是记忆与状态，问"谁能访问/用谁的身份"是身份，问"拦什么、在哪拦"是护栏，问"怎么发现问题/怎么上线"是运维。

## 先问要不要多 agent {#when}

微软 Azure Architecture Center 的编排模式指南第一句话就是"用能可靠满足需求的最低复杂度"。复杂度分三级：

| 级别 | 是什么 | 什么时候用 |
|---|---|---|
| Direct model call | 一次模型调用加好的提示词，没有 agent 逻辑和工具 | 分类、摘要、翻译这类一步能完成的任务 |
| Single agent with tools | 一个 agent 推理并选择工具、知识源和 API，可以多轮调用 | 一个领域内的多样请求，常常是企业场景的正确默认值；要设迭代上限防止工具调用死循环 |
| Multiagent orchestration | 多个专长 agent 由编排者或对等协议协调，负责分工、共享上下文、汇总结果 | 跨职能/跨领域的问题、每个 agent 需要**不同安全边界**、能并行专精的任务 |

多 agent 会带来协调开销、额外延迟和新的故障模式，只有当单个 agent 因为提示词太复杂、工具太多或安全要求而做不好时才值得。[[agent-framework|Microsoft Agent Framework]] 的概览给了更细的一条：开放式、对话式、需要自主规划和用工具的任务用 agent；步骤明确、需要显式控制执行顺序、多个 agent 或函数要协同的流程用 workflow；"能写成一个函数的事，就写函数，别用 AI agent"。

> **考点** 拆分题（A1.1）的标准答案方向：确定性的换算/查表 → 函数工具；同一份数据上互相依赖的分析 → 一个 agent 做完；固定步骤 → workflow；不要为每个小步骤建 agent（"Adding agents that don't provide meaningful specialization"是官方列出的反模式）。

指南列出的其他反模式也常被出成干扰项：简单顺序或并发就够时用复杂模式；并发 agent 之间共享可变状态；把确定性流程交给非确定性模式（或反过来）；选并发时忽略资源上限；上下文随交接无限增长。

来源：[AI agent orchestration patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)、[Microsoft Agent Framework overview](https://learn.microsoft.com/en-us/agent-framework/overview/)

## agent 跑在哪 {#runtime}

| 运行方式 | 是什么 | 适合 |
|---|---|---|
| **Prompt agent**（[[foundry-agent-service|Foundry Agent Service]]） | 声明式：模型 + instructions + 工具，平台托管运行 | 不想写编排代码、需要完全托管的 agent |
| **Hosted agent**（Foundry Agent Service） | 你自己的代码（Agent Framework、LangGraph 等）打成容器由 Foundry 运行；每个会话一个 VM 隔离的沙箱，会话有持久的 `$HOME`，空闲后释放算力、恢复时还原文件；部署时自动获得专属的 Microsoft Entra agent identity | 需要自定义编排逻辑，又想要托管运行时 |
| **Foundry workflows**（门户可视化） | 拖拽节点编排 agent：Invoke agent、Ask a question、Send message、if/else、go to、for each、set variable | 低代码编排；**2026 年 12 月 1 日退役**，新工作流改用 Agent Framework（声明式 YAML 或代码）或 Logic Apps |
| **Agent Framework 自托管** | 开源 SDK（Python、.NET、Go），agents、harness agent、workflows、integrations 四块，是 Semantic Kernel 和 AutoGen 的下一代 | 任何算力：Azure Container Apps（serverless 容器、自动扩缩）、AKS（细粒度隔离与网络策略）、App Service（Web/PaaS）、Functions |
| **LangGraph / LangChain** | 通过 `langchain-azure-ai` 使用 Foundry 的模型、工具和追踪 | 已有 LangGraph 资产的团队 |

Foundry 里的 agent 对象模型是考点：**agent version** 是不可变快照，任何改动（哪怕改一句提示词）都会生成新版本；**agent** 是面向消费者的稳定实体，有自己的身份和**稳定端点**；端点从创建起就可用，`version_selector` 决定流量去哪个版本——默认 "Always use latest"，生产中应**固定到某个版本**，回滚就是把选择器指回上一个版本。端点**不支持版本间流量拆分**，一次只有一个活动版本。端点可同时暴露 Responses、Activity Protocol（Teams/Microsoft 365）、Invocations、A2A 和 MCP（预览）协议；入站认证用 Microsoft Entra（调用方至少要 Foundry Agent Consumer 角色），**不支持 API key**。

> **易混** 在 playground 里改了 instructions 后要做完整评估，先 **Save** 成新版本（只在项目内可见）；**Publish** 是把 agent 分发到 Teams、Microsoft 365 Copilot 等渠道，面向更多用户。

来源：[Hosted agents in Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents)、[Configure and share your Microsoft Foundry agent](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/configure-agent)、[Build a workflow in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow)、[Microsoft Agent Framework overview](https://learn.microsoft.com/en-us/agent-framework/overview/)

## 编排模式 {#patterns}

Architecture Center 的五种基本模式（Agent Framework 都有内置实现：SequentialBuilder、ConcurrentBuilder、GroupChatBuilder、HandoffBuilder、MagenticBuilder）：

| 模式 | 协调方式 | 路由 | 最适合 | 当心 |
|---|---|---|---|---|
| Sequential | 线性流水线，每个 agent 处理上一个的输出 | 确定、预定义顺序 | 有清晰阶段依赖的逐步加工 | 前面出错会传下去；没有并行 |
| Concurrent | 并行，各 agent 独立处理同一输入 | 确定或动态选择 agent | 多视角独立分析、对延迟敏感 | 结果冲突要裁决；资源消耗大 |
| Group chat | 多个 agent 在共享线程里发言 | chat manager 控制发言顺序 | 讨论、头脑风暴、maker-checker 迭代审核 | 对话死循环；agent 多了难控制 |
| Handoff | 动态委派，同一时刻只有一个活动 agent | agent 自己决定何时转交 | 处理过程中才知道该找哪位专家 | 无限转交、路由不可预测 |
| Magentic | 计划-执行：manager agent 建立并调整任务清单（task ledger） | manager 动态分派和重排任务 | 没有预设解法的开放问题 | 收敛慢；目标模糊时停滞 |

另外三种结构在题库里很常见：**agent-as-tools**（主 agent 把专家 agent 当工具调用，所有权始终在主 agent，控制权每次返回，只给专家需要的那部分上下文，外层 agent 只看得到内层 agent 的最终文本）；**层级编排**（supervisor 之下按领域设 sub-orchestrator，每个领域的输出按结构化契约校验，冲突由 supervisor 裁决，新增专家只影响本领域）；**组合模式**（前段顺序、后段并发，不要硬把整个工作流塞进一种模式）。

在 Agent Framework 里，workflow 由 **executors**（agent 或函数）和 **edges** 组成，支持 fan-out/fan-in；**checkpoint** 在每个 superstep 结束时保存 executor 状态和待处理消息，进程重启后从最近的检查点恢复；**人工介入**用 request_info（请求-响应），审批也可以只套在敏感工具调用上，让低风险动作自动进行。

| 需求措辞 | 选择 |
|---|---|
| "independently… one aggregated result… minimize latency" | Concurrent |
| "must receive the output of the previous agent" | Sequential |
| "only one agent active at a time… transfer control" | Handoff |
| "multiple specialists discuss exceptions" | Group chat |
| "no predetermined plan… open-ended" | Magentic |
| "primary agent retains ownership… least-privilege view" | Agent-as-tools |
| "pause at predefined points… resume after restart" | Workflow + HITL gate + checkpoints |

实现上的通用要求（每条都出过题）：交接时只给下一个 agent 它需要的上下文，必要时在 agent 之间做压缩；长流程的共享状态持久化到外部存储；把 agent 输出校验后再往下传；给 agent 调用加超时、重试和熔断；按任务难度给每个 agent 选模型（分类、抽取、格式化可以用小模型）；每次运行都要能追踪。

来源：[AI agent orchestration patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)、[Agent Framework workflow orchestrations](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/concurrent)、[Checkpoints](https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints)、[Implement advanced multi-agent orchestration patterns in Microsoft Foundry](https://learn.microsoft.com/en-us/training/modules/aaai-implement-multi-agent-orchestration-azure-ai-foundry/)

## 工具与协议：function calling、MCP、A2A {#protocols}

agent 和外界打交道有三条路：

| 对象 | 协议/机制 | 关键配置 |
|---|---|---|
| 自己的代码或 API | [[function-calling|Function calling]]、OpenAPI 工具 | `tool_choice`：`auto`（模型决定）、`required`（必须调用某个工具）、指定 `{"type": "function", "function": {"name": …}}`（必须调用这一个） |
| 外部工具和数据 | [[mcp|Model Context Protocol]] | Foundry 的 MCP 工具：`server_url`、`allowed_tools`（只放行部分工具）、`require_approval`（调用前要批准）、`project_connection_id`（凭据存在项目连接里） |
| 另一个 agent | [[a2a|Agent2Agent (A2A)]] | 对方发布 **agent card**（`/.well-known/agent-card.json`）描述技能和媒体类型；Foundry 用 A2A 工具 + 项目 A2A 连接调用；任务模型支持长任务跟踪 |

**MCP 服务器放在哪**：Foundry Agent Service 只接受远程 MCP 端点，本地 stdio 服务器要先托管出去。已有 REST API 在 API Management 里 → 直接把它**暴露为 MCP server**，用策略做 JWT 校验、配额和诊断；用函数写工具 → **Azure Functions MCP 扩展**（端点 `/runtime/webhooks/mcp`，默认授权级别要求带 `x-functions-key` 系统密钥）；现成的容器镜像（例如 npx 启动的开源服务器）→ **Azure Container Apps**，需要私网时用 internal-only ingress；Logic Apps 也可以把连接器动作作为 MCP 工具提供。

**Toolbox** 把一组工具（MCP、OpenAPI、A2A、Azure AI Search 等）定义一次，通过一个 MCP 兼容端点提供给任何运行时（prompt agent、Agent Framework、LangGraph），集中管理凭据、对工具输入输出施加 guardrail、按版本发布；工具很多时打开 **tool search**（预览），模型先只看到 `tool_search` 和 `call_tool` 两个元工具，按需检索，省 token 也提高选对工具的概率。

> **易混** A2A vs MCP：题干的主语是"另一个 agent"（不同框架、自己的端点、要发现能力、要跟踪长任务、不想耦合对方实现）→ A2A；主语是"工具和数据"（结构化、可审计地访问）→ MCP。同一进程里的 agent → agent-as-tool，不需要协议。

Foundry agent 也能**接收** A2A 调用：入站 A2A 只接受 Microsoft Entra 令牌，调用方需要 Foundry Agent Consumer 或更高角色；协议版本 v1.0 已 GA、v0.3 为预览。Agent Framework 端用 `A2AAgent` 调远端 agent，长任务可设 `background=True` 并用 continuation token 轮询。

工具层的可靠性：过载超时 → 指数退避重试；服务端返回 429 带 `Retry-After` → 按它等待；工具结果当作不可信输入，执行前校验参数、使用前按 schema 校验结果（Agent Framework 的 function middleware 可以在 `call_next()` 之后检查并替换 `context.result`）。

来源：[Connect to MCP servers](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/model-context-protocol)、[Expose a REST API in API Management as an MCP server](https://learn.microsoft.com/en-us/azure/api-management/export-rest-mcp-server)、[What is a toolbox in Microsoft Foundry?](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview)、[Agent2Agent (A2A) tool](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/agent-to-agent)、[Enable an incoming A2A endpoint](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/enable-agent-to-agent-endpoint)、[Build enterprise-grade tool ecosystems with MCP and Microsoft Foundry](https://learn.microsoft.com/en-us/training/modules/aaai-build-enterprise-tool-ecosystems-mcp-azure/)

## 记忆、上下文与状态 {#memory}

先分清三样东西：**memory** 存"随交互积累的、关于用户的事实"（偏好、历史摘要）；**知识**（[[foundry-iq|Foundry IQ]] knowledge base、Azure AI Search）存"经过治理的组织内容"；**file search** 存"这次对话里用户上传的文件"。

| 层 | 用什么 | 生命周期 / 隔离 |
|---|---|---|
| 活动会话 | conversation / thread（Responses API；`previous_response_id` 只发增量） | 会话内；进程崩溃时只剩 thread ID，所以要外部持久化 |
| 共享团队状态 | Azure Managed Redis 这类低延迟缓存 | 可过期、可由持久层重建；多租户时键里必须带租户前缀 |
| 持久状态与审计 | Azure Cosmos DB（元数据与消息分容器，关 TTL 才能长期留存） | 进程重启、跨实例恢复都靠它 |
| 长期语义记忆 | Foundry Agent Service 的 **memory store**（[[agent-memory|memory]]，预览），或自建的 Cosmos DB 记忆 | 每个 agent 一个 store；memory search tool 的 scope 设 `{{$userId}}` 按用户隔离，按 scope 删除某个用户的记忆 |

上下文窗口出问题的四种症状和对策：**滑窗失忆**（早期字段被挤出窗口）→ 结构化状态快照 + 最近几轮的滑窗；**摘要漂移**（摘要越滚越大、过期内容残留）→ 从事实来源重建交接上下文，丢弃失效记忆；**只靠向量召回**（精确实体查不到）→ 混合检索或按标识符查；**实体连续性**（张冠李戴）→ 只在记忆和交接里存标识符，每次从系统里重新取当前状态。长对话的延迟问题用**压缩**（Responses API 的 `/responses/compact`），而不是简单截断。

> **考点** "跨会话记住偏好"= memory；"所有 agent 共享当前请求的客户 ID"= 编排者随调用传递 context 对象；"7 年可查询审计"= Cosmos DB 消息容器关 TTL；"多租户缓存不串"= 键带租户前缀；"同一用户删记忆不影响别人"= scope 按用户。

来源：[What is memory?](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory)、[Use memory in Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/memory-usage)、[Design session state and context management](https://learn.microsoft.com/en-us/training/modules/aaai-design-agentic-loops-azure-ai-agent-service/5-design-session-state-context-management)、[WebSocket mode for the Responses API](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/websockets)

## 身份与访问 {#identity}

多 agent 安全的总原则是 Zero Trust：**每个 agent 一个身份、最小权限、不存机密、能追溯到人或 agent**。

**[[agent-id|Microsoft Entra Agent ID]]** 的三个对象：**agent identity blueprint**（一类 agent 的模板，策略和权限可以对一个 blueprint 下的所有 agent 统一施加）、**agent identity**（每个 agent 实例的身份）、**agent's user account**（需要像员工一样拥有邮箱等资源的 agent 才用）。设计模式：按 agent 种类或 worker 组分 blueprint，按角色给每个 agent identity 下游权限；同一 agent 的多个运行副本共用一个身份（"每个副本一个身份"是微软列出的反模式）。

| 场景 | 认证方式 |
|---|---|
| 有登录用户，下游要按用户权限授权 | 委托权限：Entra Agent ID 用 **on-behalf-of (OBO)** 逐跳换取委托令牌；Foundry 工具连接用 **OAuth identity passthrough**（每个用户登录并同意，请求带用户自己的令牌） |
| 无人值守（夜间批处理、自动写库） | agent 自己的身份（agent identity 或托管身份）的应用权限 |
| 对方只认共享密钥、不收 Entra 令牌 | Key-based（密钥存在项目连接里，只放共享密钥） |
| 只让某一个 agent 能调某个 API | 用该 agent 的 agent identity 认证，只给它授权；project managed identity 会让项目里所有 agent 共享同样的访问 |

Foundry 的 RBAC 角色刚改名：Azure AI User → **Foundry User**，Azure AI Owner → **Foundry Owner**，Azure AI Account Owner → **Foundry Account Owner**，Azure AI Project Manager → **Foundry Project Manager**，权限不变；只调用 agent、不创建编辑的主体用 **Foundry Agent Consumer**。数据面权限要单独给（例如工具读写 blob → Storage Blob Data Contributor，而不是 Contributor）。机密放 [[key-vault|Key Vault]]：只把 Key Vault Secrets User 授予需要它的那个 agent 的托管身份，按名称读取最新版本，轮换不改代码；不要把机密放进代码、容器镜像或环境变量。网络上用 private endpoint 并关闭公网访问；在 AKS 上用默认拒绝的 NetworkPolicy 只放行合法路径，再用 Istio 服务网格附加组件提供 mTLS，防止被攻破的 agent 横向移动。

来源：[Agent identity in Foundry](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-identity)、[Microsoft Entra Agent ID design patterns](https://learn.microsoft.com/en-us/entra/agent-id/concept-agent-id-design-patterns)、[On-behalf-of flow for agents](https://learn.microsoft.com/en-us/entra/agent-id/agent-on-behalf-of-oauth-flow)、[MCP tool authentication](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/mcp-authentication)、[Prevent lateral movement in agent networks](https://learn.microsoft.com/en-us/training/modules/aaai-secure-multi-agent-systems-azure-zero-trust/5-prevent-lateral-movement-agent-networks)

## 护栏与安全测试 {#guardrails}

Foundry 的 [[guardrails]] 由三件事组成：**风险**（控件）、**介入点**、**动作**。

| 介入点 | 检查什么 | 典型控件 |
|---|---|---|
| User input | 用户发来的内容 | User input attacks（越狱，即 [[prompt-shields|Prompt Shields]] 的用户提示攻击）、内容分类 |
| Tool call（预览，仅 agent） | agent 准备发给工具的调用和参数 | Task Adherence（调用是否偏离用户意图，例如用户只问余额、agent 却要调用转账工具） |
| Tool response（预览，仅 agent） | 工具返回、进入 agent 之前的完整内容 | Indirect attacks（[[indirect-prompt-injection|间接提示注入]]：检索文档、邮件、网页里藏的指令） |
| Output | 最终回答 | PII、Protected material for text/code、自定义 blocklist（竞争对手名、诉讼相关名字、受制裁公司名） |

agent 上的 guardrails 以及 PII、Task Adherence 控件都还是预览；工具介入点只对支持的工具生效（Azure AI Search、Azure Functions、OpenAPI 等，MCP 不在列表里，MCP 工具靠 `allowed_tools` 和 `require_approval` 补）。参数的类型和数值范围这类业务规则由工具边界的 schema 校验负责（Agent Framework 里可以写成 function middleware），guardrail 不做数值校验。

动作分 "Annotate only"（只标记，供人工复核）和 "Annotate and block"（标记并拦截）；注意 guardrails 概览写明 agent 目前只支持 Annotate and block，而介入点页面的示例里在 Output 用了 Annotate only，题目按题干措辞（"flag for review" vs "prevent"）作答。护栏是确定性控制，**system prompt 里的"请忽略…""请不要…"不是护栏**；纵深防御还包括把外部内容标记为不可信（spotlighting / data marking）、在不带企业工具的隔离环境里规划含外部内容的请求、由编排逻辑（而不是模型判断）强制高风险动作的人工审批。

**验证护栏**：在非生产 agent 上跑带标签的良性和对抗用例，看误拦（false positive）和漏拦（false negative），不要在生产上改成只标记来"观察"。**左移安全**用 AI Red Teaming Agent：开发阶段本地扫描内容风险；发布前在云端对配置接近生产的非生产环境（purple environment）扫描，agentic 风险类别（prohibited actions、sensitive data leakage、task adherence）只能在云端跑；核心指标是攻击成功率（attack success rate），云端结果会对有害的对抗输入做脱敏；间接注入可用 IndirectJailbreak 攻击策略测。没有测试集时，云评估的合成数据生成可以按 agent 的 instructions 自动造查询。

来源：[Guardrails overview](https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview)、[Task adherence](https://learn.microsoft.com/en-us/azure/foundry/guardrails/task-adherence)、[Guardrail intervention points](https://learn.microsoft.com/en-us/azure/foundry/guardrails/intervention-points)、[Use blocklists](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/use-blocklists)、[AI Red Teaming Agent](https://learn.microsoft.com/en-us/azure/foundry/concepts/ai-red-teaming-agent)、[Defend against indirect prompt injection attacks](https://learn.microsoft.com/en-us/security/zero-trust/sfi/defend-indirect-prompt-injection)

## 评估、可观测性与成本 {#operate}

**评估器**按手里的数据选。Agent 评估器：Task Adherence（是否守住指令和边界）、Intent Resolution、Tool Selection（选对工具、没调无关工具）、Tool Call Accuracy、Tool Output Utilization（用上前一个工具的结果）、Tool Call Success（技术性失败）、Task Navigation Efficiency（调用顺序是否符合预期）、Task Completion。RAG 评估器：Retrieval（检索内容是否相关，只要 query + context）、Document Retrieval（要相关性标签，给 NDCG 等检索指标）、Groundedness（回答是否超出上下文）、Relevance（回答是否切题）、Response Completeness（要标准答案）。人工评审在 agent 的预览 Web 应用里打分，评审员需要项目上的 Foundry User 和账户上的 Reader。**Agent optimizer** 能自动改写系统提示（instruction tuning，基线里要有 `instructions.md`）。

**可观测性**的骨架是 OpenTelemetry 的 GenAI 语义约定：每次 agent 调用一个 `invoke_agent` span，下面挂 `chat`（模型调用）和 `execute_tool`（工具调用）span；提示、回答、工具参数和结果默认**不记录**（敏感数据开关默认关）。自定义维度（例如 Claim ID）作为 span **attributes** 写入，在 Application Insights 里按它筛选。跨服务关联靠 W3C trace context：在调用 MCP 服务器时 Agent Framework 会把 trace context 放进请求的 `params._meta`；Foundry SDK 的上下文传播只对插桩之后取得的客户端生效。LangGraph 用 `AzureAIOpenTelemetryTracer` 作为 callbacks 传入，`thread_id` 把一次请求的所有步骤串起来。

**监控**：Foundry 的 agent 监控面板（需连 Application Insights）看 token、延迟、成功率和评估分；**continuous evaluation** 按采样率评估线上回答；**scheduled evaluation** 用固定测试集定期评估，发现漂移；Azure Monitor 告警通过 action group 触发 Logic Apps 等自动修复；Application Insights 可用性测试从多个地点定时探测端点，Service Health 告警通知平台故障和计划维护。

**性能与成本**：完全相同的长前缀（≥1,024 token）→ **prompt caching**，不改结果、自动生效；语义相近的请求返回旧答案 → API Management 的**语义缓存**（按订阅分区以隔离租户）；按请求复杂度选模型 → [[model-router|model router]]；并发数 = 部署 TPM 上限 ÷ 每个 agent 的 TPM；按项目拆分共享资源的花费 → Cost Management 里按项目标签筛选；按业务单元做 chargeback → API Management 的 token 指标与配额策略、Cost Management 的成本分摊规则。

来源：[Agent evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/agent-evaluators)、[RAG evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/rag-evaluators)、[Human evaluation](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/human-evaluation)、[Agent Framework observability](https://learn.microsoft.com/en-us/agent-framework/agents/observability)、[Observability in generative AI](https://learn.microsoft.com/en-us/azure/foundry/concepts/observability)、[Prompt caching](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/prompt-caching)、[Plan and manage costs for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs)

## 发布与回滚 {#release}

| 需求 | 选择 |
|---|---|
| 两套完全相同的全量环境，验证后一次切换，出问题瞬间切回 | Blue-green |
| 先给一小部分用户，健康指标正常再逐步扩大 | Canary（在一套环境里用 Azure App Configuration 的 feature flag 按百分比放量，不需要重新部署） |
| 开发、测试、验收、生产逐级晋级，每级一个订阅 | DTAP（用基础设施即代码在每个环境部署相同资源） |
| Foundry agent 新版本出问题，最快恢复 | 把稳定端点的版本选择器指回上一个版本 |
| 基础设施变更前先预览 | Bicep what-if |
| agent 质量不达标就不能晋级 | 流水线里的自动化评估门禁（GitHub Action 或 Azure DevOps 扩展），必须能阻断，只记警告不算 |
| 每次提交都要跑、确定性、不调用真实模型 | 注入 mock chat client 的单元测试 |

Azure Developer CLI 管 hosted agent 的生命周期：`azd ai agent init` 初始化、`azd provision` 预配、`azd ai agent run` 本地运行并用 Agent Inspector 调试、`azd deploy` 部署、`azd ai agent invoke` 调用已部署的 agent。

> **注意** Foundry 的 agent 端点不支持版本间流量拆分，所以"把 10% 流量给新版本"要在应用层（feature flag、网关路由）做，而不是在 agent 端点上做。

来源：[Configure and share your Microsoft Foundry agent](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/configure-agent)、[Feature management in Azure App Configuration](https://learn.microsoft.com/en-us/azure/azure-app-configuration/concept-feature-management)、[Bicep what-if](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-what-if)、[Run evaluations in GitHub Actions](https://learn.microsoft.com/en-us/azure/foundry/how-to/evaluation-github-action)、[Quickstart: Deploy a hosted agent](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/quickstart-hosted-agent)、[Implement CI/CD pipelines for multi-agent systems with GitHub Actions](https://learn.microsoft.com/en-us/training/modules/aaai-implement-cicd-multi-agent-systems-github-actions/)
