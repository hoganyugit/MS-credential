# 术语表 · 多 agent 系统（AI-500）

### Foundry workflows {#foundry-workflow}
- zh: Foundry 门户中的可视化声明式多 agent 工作流（preview，2026 年 12 月 1 日退役）
- aliases: Foundry workflow | declarative agent workflow | workflow designer
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow
- chapter: 12-ai-500-syllabus/a1

在 Foundry 门户里用节点（Invoke agent、if/else、go to、for each、Set variable、Parse value、Send a message、Ask a question）编排 agent 的低代码工具，提供 Human in the loop、Sequential、Group chat 模板，可切换 YAML 视图，每次保存生成不可变版本。微软将于 2026 年 12 月 1 日退役该功能，新工作流用 Microsoft Agent Framework，部署为 hosted agent 的 YAML 定义仍可运行。不要和代码里的 Agent Framework workflows 混淆。

### Agent identity blueprint {#agent-identity-blueprint}
- zh: Entra Agent ID 中创建并统一治理同一类 agent 身份的模板对象
- aliases: blueprint | agent blueprint
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-identity
- chapter: 12-ai-500-syllabus/a2

blueprint 代表一"类" agent，持有创建 agent identity 和运行时换取令牌所需的 OAuth 凭据（生产推荐与托管身份建立 federated credential）。管理员可以对 blueprint 施加 Conditional Access、一次禁用或撤销该类全部 agent 的权限，指向 blueprint 的策略也覆盖今后新建的 agent identity。Foundry 为项目自动创建默认 blueprint，发布 agent 时生成独立的 blueprint 和 identity；需要在资源上授权的是 agent identity，不是托管身份。

### AI gateway {#ai-gateway}
- zh: Azure API Management 中治理模型、agent 和 MCP 工具流量的一组网关能力
- aliases: AI gateway in API Management | AI gateway in Microsoft Foundry | GenAI gateway
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/api-management/genai-gateway-capabilities
- chapter: 12-ai-500-syllabus/a2

AI gateway 不是独立产品，而是 API Management 网关上的 AI 能力：`llm-token-limit` 限额、语义缓存、内容安全策略、后端负载均衡与熔断、token 指标与日志，并能把 REST API 暴露为 MCP 服务器、导入 A2A agent API。Foundry 中的 AI gateway（preview）把它接入 Foundry，统一治理模型、agent 和工具。与 Foundry Toolbox（工具集合和统一 MCP 端点）互补而非替代。

### Reasoning model {#reasoning-model}
- zh: 回答前先消耗推理 token 思考、擅长复杂多步问题的模型系列
- aliases: reasoning_effort
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/reasoning
- chapter: 12-ai-500-syllabus/a1

例如 GPT-6 Astra、GPT-5 系列和 o-series：推理 token 不出现在输出中但占用上下文、按输出 token 计费，用 `reasoning_effort` 调节思考深度（取值从 `none` 到 `max`，因模型而异），用 `max_output_tokens` 或 `max_completion_tokens` 封顶。除 GPT-6 Astra 外不支持 `temperature`、`top_p`、`max_tokens` 等参数。适合规划、复杂代码和文档比对；延迟敏感的分类等任务用非推理模型或 `reasoning_effort` 设为 `none`。

### Guidelines for Human-AI Interaction {#hax-guidelines}
- zh: 微软 HAX Toolkit 中指导人机交互体验设计的 18 条准则
- aliases: HAX | HAX Toolkit | human-AI experience
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/microsoft-cloud/dev/copilot/isv/ux-guidance
- chapter: 12-ai-500-syllabus/a1

18 条准则从 G1 Make clear what the system can do 到 G18 Notify users about changes，覆盖初次使用、交互中、出错时和长期使用四个阶段，HAX Toolkit 还提供 Design Library、Workbook 和 Playbook。Azure OpenAI 的负责任 AI 实践把 G9（Support efficient correction）和 G2（Make clear how well the system can do what it can do）列为防止过度依赖的 UX 干预。它是体验层的设计准则，不是内容过滤或安全策略。

### Agent replay {#agent-replay}
- zh: 捕获生产执行快照并在隔离环境中确定性重现多 agent 故障的调试方法
- aliases: replay debugging | deterministic replay | replay snapshot
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/training/modules/aaai-debug-production-multi-agent-incidents-azure/2-implement-agent-replay-production-debug
- chapter: 12-ai-500-syllabus/a2

回放快照包含原始输入、每个 agent 的模型部署版本、带 SHA-256 哈希的系统提示、用合成数据 mock 的工具响应和 OpenTelemetry trace 上下文，按 trace ID 存入 Blob Storage。回放时用 replay-mode 标志和 mock 工具拦截器避免真实副作用，并在独立资源中运行，可逐步执行或按版本二分定位回退。它不同于直接重跑请求，也不同于只查看 trace。

### Azure Developer CLI {#azure-developer-cli}
- zh: 以模板和 `azure.yaml` 驱动预配部署的开发者命令行工具，Foundry 能力由 `azd ai` 扩展提供
- aliases: azd | azd ai | microsoft.foundry
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/install-cli-foundry-extensions
- chapter: 12-ai-500-syllabus/a2

azd 负责把应用从本地预配并部署到 Azure（如 `azd up`、`azd deploy`），Foundry 相关命令由独立版本的扩展提供：`microsoft.foundry` 元包捆绑 `azure.ai.agents`（`azd ai agent`）、`azure.ai.connections`、`azure.ai.toolboxes` 等（preview，需要 azd 1.25.2 或更高）。可以在 dev container 中通过 azd feature 的 `extensions` 选项自动安装这些扩展。各扩展可以单独固定或升级版本。

### Few-shot prompting {#few-shot-prompting}
- zh: 在提示里放几组"输入→输出"示例，让模型照着示范作答
- aliases: few-shot learning | few-shot examples | one-shot learning
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering
- chapter: 12-ai-500-syllabus/b1

把一到多组输入/输出示例放进提示，只影响本次推理、不会改变模型；不给示例叫 zero-shot。Chat Completions 里示例写成 system message 之后的 user/assistant 对，示例顺序也会影响结果（recency bias）。示例多到挤占上下文、成本过高时，才考虑用 SFT 把它们"内化"进模型。

### Structured inputs {#structured-inputs}
- zh: Foundry agent 定义里的 `{{变量}}` 占位符，运行时再传入实际值
- aliases: structured_inputs | handlebar templates
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/structured-inputs
- chapter: 12-ai-500-syllabus/b1

在 agent 定义的 `structured_inputs` 里声明变量，在 instructions 或工具配置（File search 的 `vector_store_ids`、MCP 的 URL 和 `headers`、Azure AI Search 的 `filter` 等）里写 `{{name}}`，调用 Responses API 时在请求的 `structured_inputs` 里传值。适合同一个 agent 版本服务多种配置、按用户注入上下文；不要用它传密钥或令牌，日志和 tracing 可能记录这些值。

### Context provider {#context-provider}
- zh: Agent Framework 中每次调用前注入上下文、调用后提取状态的组件
- aliases: ContextProvider | AIContextProvider
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/agent-framework/concepts/agents/conversations/context-providers
- chapter: 12-ai-500-syllabus/b1

Python 继承 `ContextProvider`，实现 `before_run`（如 `context.extend_instructions`）和 `after_run`；.NET 用 `AIContextProvider`。记忆（如 `FoundryMemoryProvider`）、检索和用户偏好都可以做成 provider；`HistoryProvider` 是专门加载和保存消息的一类。provider 实例被所有会话共享，会话数据要存在 session state 里。

### Agent version {#agent-version}
- zh: Foundry agent 配置的不可变快照，每次保存都生成新版本
- aliases: agent versions
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/configure-agent
- chapter: 12-ai-500-syllabus/b1

哪怕只改一句 instructions 也会生成新版本，代码里用 `<agent_name>:<version>` 引用；草稿可以在 playground 试，但看历史、做监控和跑完整评估都要先保存。agent 的稳定端点由 `version_selector` 决定服务哪个版本：默认 Always use latest，生产应固定版本，回滚就是改回旧版本；同一时间只有一个活动版本，不支持流量拆分。

### Prompt Optimizer {#prompt-optimizer}
- zh: Foundry 门户里按提示工程最佳实践自动改写 agent 指令的工具
- aliases: Foundry Prompt Optimizer
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/prompt-optimizer
- chapter: 12-ai-500-syllabus/b1

在 agent 配置面板 Instructions 旁的铅笔加星图标里打开，可以附加建议反复优化，每个改动的段落都给出理由。结果不会自动保存，要点 Use prompt 才写回，没有版本历史，只处理文本指令；改完应在自己的数据集上跑评估。它和用数据集、评估器打分的 agent optimizer 不是一回事。

### Supervised fine-tuning {#sft}
- zh: 用"提示→期望回答"的示范数据继续训练模型
- aliases: SFT | supervised fine tuning
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/fine-tuning
- chapter: 12-ai-500-syllabus/b1

数据是 JSONL，每行一个 `messages` 对话（工具调用场景再带 `tools` 和 assistant 的 `tool_calls`），训练集和验证集分开。适合能示范正确输出的场景：固定格式、领域词汇、推理套路和工具参数，也是"先 SFT 再 DPO"的第一步。和 few-shot 相比，它改变的是权重，能减少提示里的示例和 token。

### Direct preference optimization {#dpo}
- zh: 用同一输入的"好回答/差回答"对训练模型偏向好回答
- aliases: DPO | preference fine-tuning
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/fine-tuning-direct-preference-optimization
- chapter: 12-ai-500-syllabus/b1

每行数据有 `input`、`preferred_output` 和 `non_preferred_output`，适合质量取决于偏好（语气、完整性）而不是唯一正确答案的任务，例如评审员标过 preferred 或 rejected 的摘要。可以在 SFT 后的模型上继续做（`model` 填微调后模型的标识）；它不需要 grader，这一点与 RFT 不同。

### Reinforcement fine-tuning {#rft}
- zh: 让模型生成回答、由 grader 打分，再按奖励信号训练
- aliases: RFT | reinforcement fine tuning
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/reinforcement-fine-tuning
- chapter: 12-ai-500-syllabus/b1

适合多种解法都可能正确、但能可靠自动评分的任务；grader 可以是 `string_check`、`text_similarity`、`score_model`、`python` 或组合的 `multi`。训练前要用正确、错误和畸形回答测试 grader，奖励上升不代表任务真的做得更好；按 Foundry 的支持表，`o4-mini` 支持 RFT，`gpt-5` 的 RFT 需要邀请。

### Compaction {#compaction}
- zh: 把越来越长的对话历史压缩成更少的 token，同时保留关键状态
- aliases: context compaction | compaction strategy | /responses/compact
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/agent-framework/concepts/agents/conversations/compaction
- chapter: 12-ai-500-syllabus/b2

Responses API 可以调用独立的 `/responses/compact`，或在请求里用 `context_management` 的 `compact_threshold` 自动压缩，产出加密的 compaction item。Agent Framework 提供工具结果折叠、summarization、sliding window、truncation 等策略，但只对自己维护内存历史的 agent 有效，对 Foundry Agents 等服务托管上下文无效。不要和服务端"超出窗口时自动截断输入"混淆，截断不保证留下关键信息。

### previous_response_id {#previous-response-id}
- zh: Responses API 中把新请求接到上一条 response 上下文的参数
- aliases: previous response ID | response chaining
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/responses
- chapter: 12-ai-500-syllabus/b2

response 默认在服务端保留 30 天，传它的 ID 就能延续上下文，不需要 conversation 对象；多个请求指向同一个 ID 可以从同一点分叉。`store=false` 时没有可引用的持久状态，应用要自己带上之前的 output items；WebSocket 模式也用它做增量续写。它与 conversation（服务端持续累积 items）是并列的两种上下文策略。

### Chunking {#chunking}
- zh: 把长文档切成适合嵌入和检索的小块
- aliases: text chunking | semantic chunking | fixed-size chunking | structure-aware chunking
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-chunk-documents
- chapter: 12-ai-500-syllabus/b2

固定大小加重叠最简单（文档建议从 512 tokens、25% 重叠起步），按标题等结构切分能保留 section 边界，semantic chunking 保持语义完整但成本更高。Azure AI Search 内置 Text Split skill、Markdown parsing mode、Document Layout skill 和 Content Understanding skill。不要和查询时重排结果的 semantic ranker 混淆。

### Tool choice {#tool-choice}
- zh: 控制模型这一轮是否调用工具、调用哪个工具的请求参数
- aliases: tool_choice | forced tool call
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/tool-best-practice
- chapter: 12-ai-500-syllabus/b3

`auto` 让模型自己决定，`required` 要求至少调用一个工具，`none` 禁止调用；要强制某一个函数，Responses API 写 `{"type": "function", "name": "..."}`，Chat Completions 写 `{"type": "function", "function": {"name": "..."}}`。`{"type": "allowed_tools", ...}` 把本次请求的候选工具限制在一个子集。它比在 instructions 里"建议使用某工具"更确定，也不同于 MCP 工具定义里限制可见工具的 `allowed_tools`。

### Circuit breaker {#circuit-breaker}
- zh: 下游持续失败时暂停调用、直接快速失败的保护模式
- aliases: Circuit Breaker pattern | 熔断器 | circuit breaker rule
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker
- chapter: 12-ai-500-syllabus/b3

Closed 状态下统计失败，达到阈值切到 Open，期间直接失败或返回兜底；计时结束后转 Half-Open，放行少量试探请求，成功就回到 Closed，失败就重新 Open。它与重试互补：重试处理很快会恢复的故障，熔断防止对长时间故障反复重试。API Management 的后端可以配置 circuit breaker 规则，触发后返回 503。

### Agent as a tool {#agent-as-tool}
- zh: 把一个 agent 包装成函数工具，供另一个 agent 按需调用
- aliases: agent-as-tools | as_tool | AsAIFunction | orchestrator-subagent | agents as tools | agent as a function tool
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/agent-framework/agents/tools/
- chapter: 12-ai-500-syllabus/b4

Agent Framework 中 Python 用 `agent.as_tool(...)`，C# 用 `agent.AsAIFunction()`。主 agent 保留控制权和任务所有权，自己决定交给子 agent 哪些信息，子任务完成后控制回到主 agent，这正是 hub-and-spoke 和 orchestrator–subagent 的实现方式。handoff 正好相反，会把任务所有权交给接手的 agent。

### Handoff orchestration {#handoff-orchestration}
- zh: 同一时间只有一个 agent 处理，并可按上下文把控制权转交给更合适 agent 的编排模式
- aliases: HandoffBuilder | handoff pattern
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/handoff
- chapter: 12-ai-500-syllabus/b4

参与者构成没有中心编排器的网状拓扑，用 `HandoffBuilder(...).with_start_agent(...)` 指定起始 agent，`.add_handoff(...)` 限定能交给谁；默认是交互式的，agent 不交接时请求用户输入。Architecture Center 提醒：从初始输入就能确定由谁处理时用确定性路由，还要防止来回无限交接。Azure Logic Apps 也有 handoff 模式（preview）。

### Group chat orchestration {#group-chat-orchestration}
- zh: 多个 agent 在共享对话中协作、由管理者决定下一位发言者的编排模式
- aliases: GroupChatBuilder | group chat | maker-checker | RoundRobinGroupChatManager
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns
- chapter: 12-ai-500-syllabus/b4

适合讨论、评审和 maker-checker：生成者提交，检查者按标准退回，直到通过或达到迭代上限。Architecture Center 建议参与者不超过 3 个并设迭代上限。Agent Framework 用 `GroupChatBuilder`，编排器居中形成星形拓扑，所有参与者看到完整的共享历史；它不像 handoff 那样转移任务所有权。

### Magentic orchestration {#magentic-orchestration}
- zh: 由 manager agent 建立任务账本、动态规划并分派专家的开放式编排模式
- aliases: MagenticBuilder | Magentic-One | magentic | task ledger
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/magentic
- chapter: 12-ai-500-syllabus/b4

基于 Magentic-One，适合事先没有解决路径的复杂问题；manager 维护计划和进度账本，停滞时重置或重新规划。`MagenticBuilder` 用 `max_round_count`、`max_stall_count`、`max_reset_count` 控制轮数，`enable_plan_review=True` 让人审阅计划。对时效敏感或要求确定性的流程不适合。

### Concurrent orchestration {#concurrent-orchestration}
- zh: 把同一输入同时交给多个独立 agent 处理，再汇总结果的并行编排模式
- aliases: ConcurrentBuilder | fan-out/fan-in | scatter-gather
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/concurrent
- chapter: 12-ai-500-syllabus/b4

适合多视角的独立分析和对延迟敏感的场景；agent 需要彼此的结果、或配额撑不住并行时不适合。`ConcurrentBuilder(participants=[...])` 的默认 aggregator 输出一个 `AgentResponse`（每个参与者一条消息），`.with_aggregator()` 可以自定义合并。总耗时约等于最慢的那个 agent，而不是各自耗时之和。

### Workflow checkpoint {#workflow-checkpoint}
- zh: Agent Framework 工作流在每个 superstep 结束时保存的可恢复状态
- aliases: checkpointing | checkpoint storage | FileCheckpointStorage | CosmosCheckpointStorage
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints
- chapter: 12-ai-500-syllabus/b4

保存 executor 状态、待处理的消息、待处理的人工请求和共享状态，存储可以是内存、文件或 Cosmos DB。用 `checkpoint_storage=` 启用，用 `workflow.run(checkpoint_id=...)` 从中断处恢复，适合运行几个小时的长流程和等待人工审批的流程。LangGraph 的 checkpointer 作用相似，但按 `thread_id` 保存图状态。

### Prompt caching {#prompt-caching}
- zh: 复用相同提示前缀的计算，降低输入 token 成本和首个 token 的延迟
- aliases: prompt cache | cached_tokens | prompt_cache_key
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/prompt-caching
- chapter: 12-ai-500-syllabus/b4

支持的 Azure OpenAI 模型默认启用：提示至少 1,024 个 token，且前 1,024 个 token 完全相同才会命中，命中量看 `cached_tokens`。每次仍会生成新的回答，这一点和直接返回旧答案的 semantic caching、response caching 不同。把稳定内容（指令、工具定义）放在最前面才能提高命中率。

### Semantic caching {#semantic-caching}
- zh: 按语义相似度命中，直接返回此前相似请求的回答而不调用模型
- aliases: llm-semantic-cache-lookup | llm-semantic-cache-store | semantic cache
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/api-management/azure-openai-enable-semantic-caching
- chapter: 12-ai-500-syllabus/b4

API Management 的实现是用嵌入模型计算请求向量，在启用了 RediSearch 的 Azure Managed Redis 里查找；`score-threshold` 越低要求越相似，`vary-by` 按订阅或用户分区以防串用。命中时省掉整次模型调用，但返回的是旧回答，要用 `duration` 控制时效。只想复用相同前缀、每次仍需新回答时，用 prompt caching。

### Agent Card {#agent-card}
- zh: A2A 服务端公开的 JSON 元数据，描述 agent 的身份、能力、技能、端点和认证要求
- aliases: agent cards | agent-card.json | AgentCard
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/enable-agent-to-agent-endpoint
- chapter: 12-ai-500-syllabus/b4

A2A 客户端先读取 Agent Card，了解对方能做什么、要怎样认证（`securitySchemes`），再发送消息并跟踪任务；标准位置是 `https://{server_domain}/.well-known/agent-card.json`。Foundry agent 开启传入 A2A 后提供以 `agentCard/v1.0` 结尾的地址。它描述的是整个 agent 的能力，MCP 的 `tools/list` 描述的是一个个工具。

### Agent middleware {#agent-middleware}
- zh: Agent Framework 中拦截 agent 运行、函数调用或模型调用的可复用处理链
- aliases: agent run middleware | function middleware | chat middleware | AgentMiddleware
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/agent-framework/concepts/agents/middleware/
- chapter: 12-ai-500-syllabus/b4

agent run middleware 包住整次运行，function middleware 包住每次工具调用，chat middleware 包住每次模型请求，都可以在 agent 级或 run 级注册。用于统一日志、授权（设置结果后用 `MiddlewareTermination` 提前终止）和异常处理（用 try/except 包住 `call_next()`）。它和只观察、不干预的 tracing 不同。

### Human Evaluation {#human-evaluation}
- zh: Foundry 中由指定评审在 preview web app 里按模板给 agent 回复打分的人工评估功能
- aliases: Human evaluation template | 人工评估
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/human-evaluation
- chapter: 12-ai-500-syllabus/c1

builder 在 agent 的 **Evaluation › Human Evaluation** 标签建模板（thumbs up/down、slider、multiple choice、free-form text），设为 active 后，评审在 **Preview** 打开的 preview web app 里和 agent 对话并点 **Feedback** 打分，结果存放在项目连接的 Application Insights 里，可导出 CSV。建模板需要 Foundry Project Manager，评审需要 project 上的 Foundry User 加 account 上的 Reader。它和 trace 标注（给已经发生的 trace 打分）、运行时审批（在动作执行前拦截，不产生分数）不是一回事。

### Task Navigation Efficiency {#task-navigation-efficiency}
- zh: 把 agent 实际执行的步骤与期望步骤序列比对，判断路径是否高效的 agent evaluator
- aliases: 任务导航效率 | builtin.task_navigation_efficiency
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/agent-evaluators
- chapter: 12-ai-500-syllabus/c1

输入 `actions` 或 `messages` 加 `expected_actions`（ground truth），`matching_mode` 可选 `exact_match`、`in_order_match`、`any_order_match`，输出 pass/fail 以及 precision、recall、F1，不需要 judge 模型。适合工作流优化和路径回归测试。和 Tool Selection（是否选对、有没有多调工具）、Tool Call Accuracy（工具调用整体是否正确）不同，它必须有期望序列。

### Document Retrieval evaluator {#document-retrieval-evaluator}
- zh: 用人工相关性标注（qrels）计算 NDCG 等搜索指标、评估检索质量的 RAG evaluator
- aliases: Document Retrieval | 文档检索评估器
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/rag-evaluators
- chapter: 12-ai-500-syllabus/c1

输入 `retrieval_ground_truth`（每条含 `document_id` 和 `query_relevance_label`）与 `retrieved_documents`，输出 Fidelity、NDCG、XDCG、Max Relevance、Holes，不需要 judge 模型，适合比较搜索算法、`top_k` 和 chunk 大小等检索参数。没有标注时改用 Retrieval evaluator，它用 LLM judge 评估 `query` 与 `context` 的相关性。

### LLM-as-a-judge {#llm-as-a-judge}
- zh: 用一个语言模型按评分标准评估另一个模型或 agent 输出质量的方法
- aliases: LLM judge | LLM-as-judge | AI-assisted evaluator | 评审模型
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/training/modules/aaai-design-evaluation-frameworks-multi-agent-azure/3-implement-model-judge-multi-agent-evaluation
- chapter: 12-ai-500-syllabus/c2

Foundry 中需要 `deployment_name` 的 AI-assisted evaluator、rubric evaluator 和 prompt-based 自定义 evaluator 都属于这一类。judge 有偏爱长回答、位置偏差和偏爱冗长解释等问题，要用 50–100 条人工标注的交互校准（Cohen's kappa 高于 0.7 才算良好），高风险评估用多个 judge 取共识。与之相对的是 Document Retrieval、Task Navigation Efficiency 这类按 ground truth 计算、不需要 judge 的 evaluator。

### Agent optimizer {#agent-optimizer}
- zh: Foundry Agent Service 中自动生成并评估候选配置、选出得分最高版本的优化功能
- aliases: Optimize tab | azd ai agent optimize | 智能体优化器
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-optimizer-overview
- chapter: 12-ai-500-syllabus/c2

循环为评估基线、生成候选、评估候选、按 0–1 的综合分排名、把最佳候选提升为新版本并部署；优化目标有 Instruction tuning、Skill improvement（仅 hosted agent）、Tool optimization（只改工具和参数描述）、Model selection。分数提升小于 0.03 视为噪声。它和 Prompt Optimizer 不同，后者只是编辑器里的一次性改写建议，不保存、没有版本历史。

### Sliding-window amnesia {#sliding-window-amnesia}
- zh: 固定滑动窗口丢掉早期消息，导致 agent 忘记长对话前段关键信息的失效模式
- aliases: 滑动窗口失忆
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/training/modules/aaai-design-multi-agent-memory-azure-cosmos-db/5-configure-context-window-optimization
- chapter: 12-ai-500-syllabus/c2

典型症状是早先说过的过敏史、偏好或承诺在后面的轮次里被忽略。对策是重要性感知的保留策略：滑动窗口加重要性修剪，让关键记忆豁免于窗口，或把关键事实提取进长期记忆。Agent Framework 的 `SlidingWindowStrategy` 这类只按时间保留的压缩如果单独使用，本身就可能造成它。

### Summary drift {#summary-drift}
- zh: 反复给摘要再做摘要，使事实逐步偏离原始事件的上下文失效模式
- aliases: 摘要漂移
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/training/modules/aaai-design-multi-agent-memory-azure-cosmos-db/5-configure-context-window-optimization
- chapter: 12-ai-500-syllabus/c2

常见于用 LLM 迭代压缩长对话或整合记忆。对策是在整合时做校验和矛盾检测（发现摘要丢失事实就回退到完整上下文），并让近期事件优先使用原始 episodic 记忆而不是摘要。和 sliding-window amnesia 的区别：后者是信息被丢掉，summary drift 是信息被改错。

### Vector-only recall {#vector-only-recall}
- zh: 只靠向量相似度检索，漏掉 ID、药名、剂量等需要精确匹配的事实的失效模式
- aliases: 纯向量召回
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/training/modules/aaai-design-multi-agent-memory-azure-cosmos-db/5-configure-context-window-optimization
- chapter: 12-ai-500-syllabus/c2

精确值嵌入后彼此很接近，纯向量检索会返回"主题相关"却不正确的记忆或文档。对策是混合检索（向量加关键词，Azure AI Search 的 hybrid query 用 RRF 合并结果）再做重排（cross-encoder 或 semantic ranker）。它是检索方法的问题；记忆挂错对象则属于 entity continuity。

### Entity continuity {#entity-continuity}
- zh: 跨会话后 agent 分不清一条记忆属于哪个患者、客户或案件的上下文失效模式
- aliases: 实体连续性
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/training/modules/aaai-design-multi-agent-memory-azure-cosmos-db/5-configure-context-window-optimization
- chapter: 12-ai-500-syllabus/c2

根因是记忆没有绑定比会话更持久的实体标识。对策是实体关联的 episodic 存储：用实体 ID 标记每条记忆，ID 在会话重置后依然有效，新会话按 ID 重新加载相关记忆。Foundry Memory 的 memory search tool 可以把 `scope` 设为 `{{$userId}}` 按用户隔离长期记忆。

### Continuous evaluation {#continuous-evaluation}
- zh: 按采样率持续评估生产流量质量与安全的 Foundry 监控功能
- aliases: Continuous evaluation rule | 持续评估
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard
- chapter: 12-ai-500-syllabus/c3

用 `project_client.evaluation_rules.create_or_update` 创建评估规则，事件类型为 `RESPONSE_COMPLETED`，`max_hourly_runs` 限制每小时运行次数，项目的 managed identity 需要 Foundry User，结果显示在 agent 的 Monitor 标签。它和 scheduled evaluation 互补：后者用固定测试数据集按计划运行，用来检测系统漂移。

### Chargeback {#chargeback}
- zh: 把共享资源的成本按实际使用方（项目、团队、租户）计回去的做法
- aliases: Project-level cost attribution | 成本回收 | 按项目分账
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs
- chapter: 12-ai-500-syllabus/c3

Foundry 的 project-level cost attribution（preview）自动给每个 project 的用量打上 `project` 标签，在 Cost analysis 里按该标签筛选即可拆分共享 Foundry 资源的账单，目前支持 Models sold by Azure（含 Azure OpenAI）。按调用方或租户统计 token 可用 API Management 的 `llm-emit-token-metric` 加自定义维度。它和 cost allocation rules（重新分配报表上的成本归属，不改发票）、budgets（只告警、不停止消费）不同。

### W3C Trace Context {#w3c-trace-context}
- zh: 通过 `traceparent` 等 HTTP 头在服务之间传递 trace ID 和 span ID 的标准
- aliases: traceparent | Trace context propagation | 追踪上下文传播
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/training/modules/aaai-implement-distributed-observability-multi-agent-opentelemetry/2-design-distributed-trace-multi-agent-systems
- chapter: 12-ai-500-syllabus/c3

`traceparent` 的格式是 `00-{trace-id}-{parent-span-id}-{trace-flags}`，接收方据此在同一 trace 下创建子 span，从而把多个 agent、模型和工具的调用串成一条调用链。Foundry SDK 的 `enable_trace_context_propagation`（tracing 启用时默认开启）会给 `get_openai_client()` 获得的客户端注入 `traceparent` 和 `tracestate`；Agent Framework 通过 MCP 请求的 `params._meta` 传播。`baggage` 头可携带额外键值，可能含敏感数据，默认不传播。

### OAuth identity passthrough {#oauth-identity-passthrough}
- zh: Foundry 工具连接的一种认证方式：用户首次使用时登录授权，之后工具以该用户身份被调用
- aliases: OAuth passthrough | identity passthrough
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/mcp-authentication
- chapter: 12-ai-500-syllabus/d1

MCP 和 A2A 连接的五种认证方式里唯一保留用户上下文的一种：Agent Service 在响应里返回 `oauth_consent_request`（带 `consent_link`），用户同意后安全保存其令牌，之后的工具调用都带着这个用户的权限。分 managed OAuth 和 custom OAuth（自带 app registration）。key-based、agent identity、project managed identity 都是所有用户共用一个身份，这是它们的区别；使用它的用户至少需要 Foundry Agent Consumer。

### Agent's user account {#agent-user-account}
- zh: 与某个 agent identity 一对一绑定、被标记为 AI agent 的 Entra 用户账号
- aliases: agent user | agent user account | agentic user
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/entra/agent-id/agent-users
- chapter: 12-ai-500-syllabus/d1

只在系统必须使用用户对象（邮箱、Teams、HR 系统）时才创建。它没有密码，只能凭父 agent identity 的令牌认证，令牌带 `idtyp=user`，不能被分配特权管理员角色；Conditional Access 要单独针对 agent users 配置。与 agent identity（服务主体，以 agent 自身身份访问）和 OBO（代表真人用户访问）都不同。

### Key Vault reference {#key-vault-reference}
- zh: 在应用设置或 secret 定义里只写 Key Vault 地址，由平台用托管身份读取实际值
- aliases: Key Vault references | keyvaultref
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/app-service/app-service-key-vault-references
- chapter: 12-ai-500-syllabus/d1

App Service 和 Functions 写 `@Microsoft.KeyVault(SecretUri=...)`，Container Apps 用 `keyvaultref:`，App Configuration 也有 Key Vault reference（只存 URI，由应用自己去取值）。读取身份需要 Key Vault Secrets User；引用不写版本时自动跟随最新版本（App Service 24 小时内、Container Apps 30 分钟内），所以密钥轮换后不用改代码。

### Shift-left {#shift-left}
- zh: 把测试和安全检查提前到开发早期，在变更合并之前完成
- aliases: shift left | shift-left testing | shift-left security
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/devops/develop/shift-left-make-testing-fast-reliable
- chapter: 12-ai-500-syllabus/d1

Azure DevOps 的说法是"把质量往上游移"，让大部分测试在合并到主分支之前完成。安全上对应威胁建模、SAST、依赖和机密扫描，以及 AI Red Teaming Agent 在设计、开发、发布前做的自动对抗扫描。与在生产中测试的 shift-right 互补，而不是互相替代。

### Guardrail policy {#guardrail-policy}
- zh: Foundry Control Plane 中基于 Azure Policy、规定模型部署最低 guardrail 控制的合规策略
- aliases: guardrail policies
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/control-plane/how-to-manage-compliance-security
- chapter: 12-ai-500-syllabus/d2

在 **Operate** > **Compliance** > **Policies** 创建，作用于订阅或资源组，可以排除部分部署；不合规的资产显示 Violations detected。它检查配置是否达标，不负责运行时拦截，拦截靠分配给模型或 agent 的 guardrail。创建和编辑需要 Owner 或 Resource Policy Contributor。

### Blue-green deployment {#blue-green-deployment}
- zh: 维护两套完整的生产环境，验证后整体切换流量、出问题可立即切回的发布方式
- aliases: blue/green deployment | blue-green | blue/green
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/container-apps/blue-green-deployment
- chapter: 12-ai-500-syllabus/d3

蓝环境跑当前版本，绿环境部署新版本并测试，切换之后若出问题就立即切回，代价是过渡期双倍基础设施。Azure 上可以用 Container Apps 的修订版标签和流量权重、App Service 部署槽位交换、Traffic Manager 或 Front Door 实现。与金丝雀（小比例逐步放量、不需要第二套环境）相对。

### Canary deployment {#canary-deployment}
- zh: 先让小部分用户使用新版本，健康指标正常再逐批扩大的发布方式
- aliases: canary release | canary rollout
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/safe-deployments
- chapter: 12-ai-500-syllabus/d3

WAF 把它作为渐进曝光的典型：通常用功能开关为目标用户启用，每批之间留出以小时、天计的观察期，出现健康告警立即停止。实现手段有 App Configuration 功能开关、Container Apps 流量权重、App Service 槽位的 Traffic %、Azure DevOps 的 `canary` 策略。Foundry agent 端点本身不支持流量拆分。

### Feature flag {#feature-flag}
- zh: 在运行时开关功能或按比例、人群放量，不需要重新部署
- aliases: feature flags | feature management | variant feature flags
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/azure-app-configuration/concept-feature-management
- chapter: 12-ai-500-syllabus/d3

Azure App Configuration 把用法分为 Switch（即时开关，可做 kill switch）、Rollout（百分比放量、按用户或组定向、时间窗口）和 Experiment（多个 variant 做 A/B 测试）。它把发布与部署解耦，常用来实现金丝雀和按租户启用；与部署槽位交换不同，它不需要第二套部署。

### Deployment slot {#deployment-slot}
- zh: App Service 中带独立主机名、可与生产槽位交换的实时应用实例
- aliases: deployment slots | staging slot | slot swap
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots
- chapter: 12-ai-500-syllabus/d3

Standard、Premium、Isolated 层可用（Standard 最多 5 个）。交换前在源槽位预热，切换不丢请求；回滚就是再交换一次；swap with preview 可以分两阶段验证；Traffic % 能把一部分生产流量路由到某个槽位做金丝雀。标为 deployment slot setting 的设置不随交换移动。

### Version selector {#version-selector}
- zh: Foundry agent 稳定端点上决定把流量路由到哪个 agent 版本的设置
- aliases: version_selector | active agent version
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/configure-agent
- chapter: 12-ai-500-syllabus/d3

位于 `agent_endpoint.version_selector`，两种策略：Always use latest（默认，新版本立即对外）和固定到某个版本（`FixedRatio` 规则，`traffic_percentage` 为 100）。agent 版本不可变，回滚就是把选择器改回上一个版本，端点 URL 不变；不支持流量拆分。与模型部署的版本自动升级设置不是一回事。

### What-if operation {#what-if-operation}
- zh: Azure Resource Manager 在部署前预测资源变化、但不实际修改资源的操作
- aliases: what-if | Bicep what-if | confirm-with-what-if
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-what-if
- chapter: 12-ai-500-syllabus/d3

用 `az deployment group what-if` 或 `az deployment group create --confirm-with-what-if` 运行，列出 Create、Delete、Modify、NoChange、Ignore 等变更类型，也能输出 JSON 供流水线判断。它满足"应用前预览 IaC 变更"的要求；直接以 incremental 模式部署没有预览，`bicep snapshot` 则是不连 Azure 的本地比较。

### Workload identity federation {#workload-identity-federation}
- zh: 让外部工作负载用受信任的联合令牌换取 Entra 访问令牌，从而不必保存机密
- aliases: workload identity | federated identity credential | federated credential
- exams: AI-500
- ref: https://learn.microsoft.com/en-us/azure/devops/pipelines/library/connect-to-azure
- chapter: 12-ai-500-syllabus/d3

Azure DevOps 的 Azure Resource Manager 服务连接推荐用它（基于 app registration 或 managed identity）；GitHub Actions 用 OIDC 联合凭据登录 Azure；AKS 用它把 Kubernetes 服务账户绑定到 managed identity；agent identity blueprint 也以 managed identity 作为联合凭据。好处是没有需要保存和轮换的机密。
