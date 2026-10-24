---
exam: AI-500
---

## Case: Woodgrove Bank {#woodgrove}
#### Overview
Woodgrove Bank is a retail bank headquartered in Chicago. The bank issues credit and debit cards to 3.2 million customers, who dispute about 25,000 card transactions each month. Today, dispute analysts gather the evidence for each dispute manually, decide whether to issue a provisional credit, and file chargebacks with the card network.

Woodgrove plans to automate the process by building a multi-agent solution named Dispute Desk on Microsoft Foundry. The risk and compliance office of the bank must approve Dispute Desk before it goes into production.

#### Existing environment
##### Microsoft Foundry
- **woodgrove-ai:** A Microsoft Foundry resource in the East US 2 region. woodgrove-ai contains a project named disputes that has gpt-4.1 and gpt-5-mini model deployments.
- **disputes-insights:** An Application Insights resource that is connected to the disputes project.
- **kv-disputes:** An Azure key vault that uses the Azure role-based access control (Azure RBAC) permission model.

##### Other systems
- **apim-core:** An Azure API Management Standard v2 instance that publishes the core banking REST APIs for card transactions, customer accounts, and credits. The APIs accept Microsoft Entra ID tokens.
- **Dispute rules:** The dispute rules of the card network and the dispute procedures of Woodgrove, stored in a SharePoint Online library and in a container of an Azure Storage account named stdisputes.
- **receipt-mcp:** An internal Model Context Protocol (MCP) server that the fraud team built and hosts in Azure Container Apps. receipt-mcp retrieves merchant receipts and delivery confirmations.
- **Proseware Card Services:** The card network partner of Woodgrove. Proseware operates a chargeback agent that exposes an Agent2Agent (A2A) version 1.0 endpoint and an agent card. Resolving a chargeback can take up to 10 days.

#### Planned changes
Dispute Desk will consist of the following agents, which a Microsoft Agent Framework workflow will orchestrate:

- **Intake:** A Foundry prompt agent that collects the dispute details from customers in the mobile app.
- **Evidence:** A Python agent that the fraud team is building by using Agent Framework. Evidence calls receipt-mcp, downloads receipts, and writes intermediate files while it works on a dispute. Evidence also calls a third-party address verification API that requires an API key.
- **Policy:** A Foundry prompt agent that answers questions about the dispute rules.
- **Decision:** A Foundry prompt agent that calculates the provisional credit and issues it by calling the credits API.

Evidence and Policy can work independently of each other. Decision requires the output of both. Each Dispute Desk agent has its own Microsoft Entra agent identity.

#### Business requirements
- Provisional credits of $100 or less must be issued automatically. Larger credits must be approved by a dispute analyst before the credit is issued, even if an agent is manipulated by injected content.
- Every chargeback must be filed with the chargeback agent of Proseware, and Dispute Desk must track the status of each chargeback until Proseware resolves it.

#### Technical requirements
- The core banking APIs must be available as MCP tools to the Foundry agents and to Evidence without writing or hosting another MCP server.
- Intake and Policy must use the dispute rules from SharePoint and Blob Storage through a single maintained knowledge layer, and their answers must include citations.
- Woodgrove plans to deploy Evidence as a hosted agent in Foundry Agent Service, which must isolate each dispute session and keep the files of a session while the session is idle.
- In disputes-insights, every Evidence run must appear in the same end-to-end trace as the receipt-mcp operations that the run triggers.
- Only Decision may call the credits API. Calls to the credits API must not use secrets or the identity of the customer.

#### Security and compliance requirements
- woodgrove-ai, kv-disputes, and stdisputes must not be reachable from the public internet.
- Secrets must not be stored in code, container images, or environment variables.
- The risk and compliance office must be able to review on a continuously updated dashboard how the Dispute Desk resources comply with the Payment Card Industry Data Security Standard (PCI DSS).

### S101 type=single kp="Orchestration patterns & workflows" sk=A1.2,B4.1,B4.2 case=woodgrove
You need to design the Dispute Desk workflow to meet the business requirements and the planned changes.

What should you include in the design?

- A. Run Intake, Evidence, Policy, and Decision sequentially. Add an instruction to the system message of Decision to ask a dispute analyst before it issues a credit of more than $100. Send a daily email to Proseware that lists the new chargebacks.
- *B. Run Intake first, then run Evidence and Policy concurrently, and run Decision after both complete. Add an approval step that the workflow enforces before the credits tool is called for credits of more than $100. File each chargeback by running an `A2AAgent` that targets the agent of Proseware with `background=True`, and poll the task by using its continuation token.
- C. Run Intake first, and then run Evidence, Policy, and Decision concurrently. Add an approval step that the workflow enforces before the credits tool is called for credits of more than $100. File each chargeback by using an `A2AAgent` that targets the agent of Proseware.
- D. Run the agents as a group chat in which a manager agent selects the next speaker and asks a dispute analyst to approve credits when it judges the risk to be high. File each chargeback by using an MCP tool that points to the agent card URL of Proseware.

> why: Evidence 与 Policy 互不依赖、Decision 依赖两者的输出，应先 fan-out 并行、再 fan-in 汇合（学习路径的并行生成单元）；超过 $100 的抵扣需要分析员批准且必须抵御注入，按"deterministic human-in-the-loop"原则要由编排逻辑在调用 credits 工具前强制审批，而不是交给模型判断。Proseware 的退单可能持续 10 天：调用 Agent Framework 的 A2AAgent 时设置 background=True，如果远程 agent 返回的是 task 而不是即时消息，就会得到 continuation token，可用它轮询或重新订阅直到完成，session 中还保存 context_id、task_id 和 task_state。A 串行执行且审批只靠系统提示，邮件也无法跟踪状态；C 让 Decision 与它依赖的 agent 并行；D 由 manager agent 自行判断是否审批，不是确定性控制，而 MCP 工具也不能代替 A2A 协议与远程 agent 协作。
> ref: https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/agent-services/a2a
> ref: https://learn.microsoft.com/en-us/security/zero-trust/sfi/secure-agentic-systems
> ref: https://learn.microsoft.com/en-us/training/modules/aaai-implement-multi-agent-orchestration-azure-ai-foundry/5-design-parallel-agent-spawn-synchronization

### S102 type=match kp="Tools, MCP & A2A" sk=A1.5,A2.1,B2.4 case=woodgrove
You need to specify how the Dispute Desk agents communicate with the other components. The solution must meet the business requirements and the technical requirements.

What should you use for each component? To answer, drag the appropriate integration methods to the correct components. Each integration method may be used once, more than once, or not at all.

NOTE: Each correct selection is worth one point.

```area
{"kind":"match","poolTitle":"Integration methods","pool":["Agent2Agent (A2A)","An MCP server that apim-core exposes from the REST APIs","An MCP server that you build in Azure Functions","The OpenAPI tool","A Foundry IQ knowledge base","The file search tool"],"title":"Components","head":["Component","Integration method"],"blocks":[{"type":"row","label":"The chargeback agent of Proseware","answer":"Agent2Agent (A2A)"},{"type":"row","label":"The core banking APIs","answer":"An MCP server that apim-core exposes from the REST APIs"},{"type":"row","label":"The dispute rules in SharePoint and Blob Storage","answer":"A Foundry IQ knowledge base"}]}
```

> why: Proseware 的退单 agent 暴露 A2A v1.0 端点和 agent card，A2A 协议让 Foundry 或 Agent Framework 的 agent 通过标准协议与外部 agent 交换上下文、协作完成任务。API Management 能用内置 AI gateway 把托管的 REST API 直接暴露为远程 MCP 服务器，把选定的 API 操作变成工具并统一施加策略，Standard v2 属于支持的层级，因此无需编写或托管 MCP 服务器。Foundry IQ knowledge base 由多个 knowledge source（Blob、SharePoint、OneLake、Web 等）组成，可被多个 agent 共享，并返回带引文的结果。Azure Functions 中的 MCP 服务器需要自行编写和托管，违反技术要求；OpenAPI 工具不是 MCP 工具，Evidence 的 MCP 客户端无法复用；file search 面向会话中上传的文件，无法提供统一维护的 SharePoint 与 Blob 知识层。
> ref: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/agent-to-agent
> ref: https://learn.microsoft.com/en-us/azure/api-management/export-rest-mcp-server
> ref: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-foundry-iq

### S103 type=yesnogrid kp="Multi-agent architecture & design" sk=A2.4,A2.3 case=woodgrove
You deploy Evidence as a hosted agent in Foundry Agent Service.

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

NOTE: Each correct selection is worth one point.

```area
{"kind":"yesno","head":["Statements"],"blocks":[{"type":"row","label":"Each dispute session of Evidence runs in its own VM-isolated sandbox.","answer":"Yes"},{"type":"row","label":"Files that Evidence writes to $HOME during a dispute session are restored when the session resumes after the idle timeout.","answer":"Yes"},{"type":"row","label":"To test a new version of Evidence, you can route 10 percent of the traffic of the agent to the new version.","answer":"No"},{"type":"row","label":"At runtime, Evidence authenticates to stdisputes by using the managed identity of the disputes project.","answer":"No"}]}
```

> why: Hosted agent 在按会话划分、彼此隔离的 VM 沙箱中运行，第 1 句 Yes；每个会话有持久的 $HOME，空闲超时后平台释放计算资源但保留 $HOME 和 /files，会话恢复时自动还原，第 2 句 Yes；agent 端点一次只服务一个版本、把 100% 流量路由给它，"Traffic splitting between versions isn't supported"，第 3 句 No；每个 hosted agent 部署时自动获得专属的 Microsoft Entra 身份（agent identity），运行时用它访问模型、工具和下游 Azure 服务，项目托管身份只用于平台的基础设施操作（例如拉取容器镜像），访问 stdisputes 这类外部资源需要手动给 agent identity 授予 RBAC 角色，第 4 句 No。
> ref: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents

### S104 type=multi kp="Identity, access & secrets" sk=A2.2,D1.1,D1.3 case=woodgrove
You need to recommend Zero Trust components for Dispute Desk. The solution must meet the security and compliance requirements.

Which three actions should you recommend? Each correct answer presents part of the solution.

NOTE: Each correct selection is worth one point.

- *A. Create private endpoints for woodgrove-ai, kv-disputes, and stdisputes, and disable public network access on the three resources.
- *B. In Microsoft Defender for Cloud, turn on the PCI DSS v4.0.1 standard for the subscription that contains the Dispute Desk resources, and use the regulatory compliance dashboard.
- *C. Store the API key of the address verification service as a secret in kv-disputes, assign the Key Vault Secrets User role to the agent identity of Evidence, and retrieve the secret at runtime.
- D. Store the API key of the address verification service in an environment variable of the Evidence agent version.
- E. Allow public network access to kv-disputes and stdisputes only from the IP addresses of the developers and the agents.
- F. Rely on the Microsoft cloud security benchmark that Defender for Cloud enables by default to report PCI DSS compliance.

> why: 为三个资源创建 private endpoint 并禁用公共网络访问后，它们只能从虚拟网络内访问，学习路径的"防止横向移动"单元把这种做法应用到 Foundry 项目、Key Vault、存储等所有 agent 依赖项上。Defender for Cloud 的法规遵从标准基于 Azure Policy initiative，在 Regulatory compliance > Manage compliance policies 中为订阅打开 PCI DSS v4.0.1 后会持续评估资源并在仪表板显示合规状态；默认只启用 Microsoft Cloud Security Benchmark，它不是 PCI DSS 的控制映射。Hosted agent 文档要求"Don't put secrets in container images or environment variables"，应使用托管身份和受管的机密存储；Key Vault Secrets User 角色只允许读取机密内容，符合最小权限。D 违反了不在环境变量中保存机密的要求；E 仍然把资源暴露在公网上。
> ref: https://learn.microsoft.com/en-us/training/modules/aaai-secure-multi-agent-systems-azure-zero-trust/5-prevent-lateral-movement-agent-networks
> ref: https://learn.microsoft.com/en-us/azure/defender-for-cloud/assign-regulatory-compliance-standards
> ref: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents

### S105 type=single kp="Observability & monitoring" sk=A2.5,C3.5 case=woodgrove
You need to configure the connection between Evidence and receipt-mcp to meet the technical requirements.

What should you do?

- A. Add receipt-mcp to a Foundry toolbox, and connect Evidence to the toolbox by using `FoundryToolbox`.
- *B. Connect Evidence to receipt-mcp by using `MCPStreamableHTTPTool`, and configure receipt-mcp to continue the W3C trace context that it receives in `params._meta` and to export its spans to disputes-insights.
- C. Set the `ENABLE_SENSITIVE_DATA` environment variable to `true` for Evidence.
- D. Set the `OTEL_SERVICE_NAME` environment variable to the same value for Evidence and receipt-mcp.

> why: 只要存在活动 span，Agent Framework 就会通过 tools/call 请求的 params._meta 字段向 MCP 服务器自动传播 trace context（默认为 W3C Trace Context 的 traceparent 与 tracestate），实现跨 agent 与 MCP 服务器边界的分布式追踪；但这只适用于 agent 进程自己打开的 MCP 会话（MCPStreamableHTTPTool、MCPStdioTool、MCPWebsocketTool），不适用于 FoundryChatClient.get_mcp_tool(...) 等托管 MCP 配置或 Foundry hosted-agent toolbox，因为那时 tools/call 由服务运行时发出。文档明确指出需要到下游 MCP 服务器的端到端追踪时应改用客户端打开的 MCP 传输，receipt-mcp 也要接续该上下文并把 span 发送到同一个 Application Insights。C 只决定是否记录提示、工具参数和结果；D 的服务名只用于标识服务，不会把两边的 span 关联到同一个 trace。
> ref: https://learn.microsoft.com/en-us/agent-framework/agents/observability

### S106 type=single kp="Identity, access & secrets" sk=A1.4,D1.2 case=woodgrove
You need to configure the authentication of the MCP connection that Decision uses to call the credits API through apim-core. The solution must meet the technical requirements.

Which authentication method should you use?

- A. Key-based authentication that uses an API Management subscription key stored in the project connection
- B. Microsoft Entra authentication that uses the project managed identity
- *C. Microsoft Entra authentication that uses the agent identity
- D. OAuth identity passthrough

> why: Foundry 的 MCP 认证分为共享认证和个人认证：key-based 与 Microsoft Entra 认证（agent identity 或 project managed identity）使用同一个身份、不保留用户上下文，OAuth identity passthrough 则让每个用户登录并同意、保留用户上下文。文档建议在希望"authentication scoped to a specific agent"、多个 agent 对同一 MCP 服务器需要不同访问级别时使用 agent identity，并在底层服务上给该身份分配角色，无需管理机密；Woodgrove 的每个 agent 都有自己的 agent identity，只给 Decision 的身份授权即可满足"只有 Decision 能调用"。B 的 project managed identity 让项目中所有 agent 共享相同访问级别；A 需要在项目连接中存放共享密钥，项目成员都能获取，违反不使用机密的要求；D 以客户身份调用并要求用户同意，违反不使用客户身份的要求。
> ref: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/mcp-authentication
