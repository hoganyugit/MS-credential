---
id: 06-business-ai
title: AI 业务方案：agent 类型、框架、Dynamics 365 的 AI、ROI 与治理
short: 业务方案
intro: AB-100 考的是"架构师怎么把 AI 放进业务"：选哪种 agent、用什么框架、Dynamics 365 和 Microsoft 365 里现成的 AI 叫什么、怎么算 ROI、怎么监控和治理。这一章把这些词汇按题目的分布整理出来。
exams: AB-100 | AB-620
practice:
  ab-100: Dynamics 365 Copilot features | Monitoring & analytics | ROI & business value | Data preparation & grounding | Agent types & use cases | Testing & quality | Governance, security & compliance | Responsible AI | Frameworks & methodologies
---
AB-100 的题干通常是一段业务场景（"零售商想让 agent 处理退货"），选项是产品和设计选择。读题时先问三个问题：**这是哪一类 agent？在哪一层平台做（现成 Copilot / 低代码 / Foundry）？数据从哪里来？**

## 三类 agent 与设计选择 {#agent-types}

微软在 Copilot 101 页面（microsoft.com，非 Learn）把 agent 分成三类：**[[prompt-and-response-agent|prompt-and-response agents]]**（为特定任务而建、由用户输入驱动、一问一答可多轮）、**[[task-agent|task agents]]**（用户触发后完成一件具体的事）、**[[autonomous-agent|autonomous agents]]**（由事件触发、无需用户提示自行行动）。落到产品上，Learn 文档里对应的机制是：

| 类型 | Copilot Studio 里怎么做 | Microsoft 365 / Foundry 里怎么做 |
|---|---|---|
| Prompt-and-response | 知识源 + 生成式答案；declarative agent（Copilot chat harness） | declarative agent；Foundry prompt agent |
| Task | 主题 + 工具 + agent flow；用户发起 | custom engine agent；Foundry agent + function calling |
| Autonomous | **事件触发器**（Triggers）+ 生成式编排，只能用制作者凭据 | custom engine agent 的主动消息；Foundry hosted agent；Entra Agent ID 里的 autonomous agent 用 client credentials |

多 agent 设计的原则来自 Copilot Studio 的 guidance：**单一回应**、按领域 / 工具 / 治理边界拆分、child agent 共享上下文而 connected agent 独立治理、每多一跳就多一份延迟；Agent Framework 的口诀是"任务开放式就用 agent，流程步骤明确就用 workflow，能写成函数就写函数"。**[[mcp|MCP]]** 和 **[[a2a|A2A]]** 是跨平台的开放协议：MCP 让 agent 用工具和资源，A2A 让 agent 调用 agent。

来源：[Copilot 101: AI agents (microsoft.com)](https://www.microsoft.com/en-us/copilot/copilot-101/copilot-ai-agents)、[Triggers](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-triggers-about)、[Declarative vs custom engine agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/agents-overview)、[Agent ID key concepts](https://learn.microsoft.com/en-us/entra/agent-id/key-concepts)、[Multi-agent patterns](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns)、[Agent Framework overview](https://learn.microsoft.com/en-us/agent-framework/overview/)。

## 框架与方法论 {#frameworks}

| 框架 | 是什么 | 考点 |
|---|---|---|
| **[[caf|Cloud Adoption Framework (CAF) 的 AI adoption]]** | 六个阶段 **Strategy → Plan → Ready → Govern → Secure → Manage**；AI Strategy 里有四种技术路线：**ready-to-use Copilots**（Microsoft 365 Copilot 和角色型 Copilot）、**low-code SaaS 开发**（Copilot Studio、M365 Copilot 扩展）、**managed PaaS 开发**（Foundry Agent Service、Foundry、Foundry Tools、Azure ML / Fabric）、**Azure 基础设施（IaaS）**（自己的模型跑在 VM / AKS 上） | "build / buy / extend" 决策就是在这四条路线里选 |
| **[[ai-coe|AI Center of Excellence]]** | 推动 AI 落地的内部专家团队，防止碎片化、无治理的采用；职责：定义 AI 战略、培养技能、领导试点、制定并执行标准、建立需求收集与优先级流程、开发可复用资产、度量并汇报结果、（可选）管理 AI 服务；建议拿到高管支持、指定负责人、组建跨职能团队，早期集中、后期转为顾问式 | 原 Power Platform 的 CoE Starter Kit 已不再维护 |
| **[[well-architected|Azure Well-Architected Framework]]** | 五支柱：Reliability、Security、Cost Optimization、Operational Excellence、Performance Efficiency；有 AI 工作负载指南 | |
| **[[pp-well-architected|Power Platform Well-Architected]]** | 支柱 Reliability、Security、Operational Excellence、Performance Efficiency、**Experience Optimization**；"intelligent application workload"（Copilot Studio）的设计域：Responsible AI、安全合规、性能、部署测试、集成、意图识别 | 注意它比 Azure WAF 少 Cost、多 Experience |
| **[[success-by-design|Success by Design]]** | 微软 FastTrack 的 Dynamics 365 / Power Platform 实施框架：Discover → Initiate → Implement → Prepare → Operate；评审有 Solution Blueprint Review（必做）、Implementation Reviews、Go-live Readiness Review；结论分 assertions / risks / issues | |
| **[[responsible-ai|Responsible AI Standard]]** | 六原则 + 14 个目标，见第 5 章 | AB-100 "审查方案是否符合 RAI 原则" |

来源：[CAF AI strategy](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/strategy)、[AI Center of Excellence](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/center-of-excellence)、[Azure Well-Architected](https://learn.microsoft.com/en-us/azure/well-architected/)、[Power Platform Well-Architected](https://learn.microsoft.com/en-us/power-platform/well-architected/)、[Success by Design](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/success-by-design)、[Responsible AI principles](https://learn.microsoft.com/en-us/compliance/assurance/assurance-artificial-intelligence)。

## Dynamics 365 里的 AI：按应用记 {#dynamics}

| 应用 | Copilot 功能 | 自主 agent |
|---|---|---|
| **[[d365-customer-service|Customer Service]] / [[contact-center|Contact Center]]** | Ask a question、auto / proactive prompts、对话和案例摘要、起草邮件、生成解决备注、生成知识草稿、Copilot analytics report；Copilot 功能由 Microsoft 365 Copilot 驱动 | **Customer Intent Agent**（从历史案例和对话自动发现意图；有语音版和 intent-driven routing）、**Case Management Agent**（自动创建 / 更新 / 解决 / 关闭案例，仅 Customer Service）、**Customer Knowledge Management Agent**（案例关闭后补知识缺口）、**Quality Evaluation Agent**（按主管定义的框架评估互动质量）；用 Rollout manager 分阶段上线，Agent insights dashboard 看效果；消耗 Copilot credits |
| **[[d365-sales|Sales]]** | 记录摘要（lead / opportunity / account）、嵌入式摘要、最近变更、SharePoint 信息助手、会议准备、邮件助手、新闻 | **Sales Qualification Agent**（研究线索并外联）、**Sales Opportunity Agent**（研究商机、标风险）、**Sales Close Agent**、**Sales Research Agent**（用自然语言问销售数据）、**Recommended Actions Agent**、AI 数据丰富；先部署到 sandbox；PPAC › Copilot › Settings › Dynamics 365 Sales 里有 AI Agents 和 Copilot 两个开关 |
| **[[d365-field-service|Field Service]]** | 自然语言问答、工单更新（移动端，文字或语音）、工单摘要、巡检模板生成、表单填写、视图内找数据和可视化 | **Scheduling Operations Agent**（预览）：调度员调整技师排程时自动考虑现有预约和约束；需要 Field Service 8.8+、URS 3.12+、地图；以应用用户身份运行；credits 计费 |
| **[[d365-finance|Finance]]** | Collections coordinator 摘要、客户页摘要、workflow history 摘要、Agent management | **Account Reconciliation Agent**（production ready preview）：对账工作区的异常给出建议动作（如 Create journal entry） |
| **[[d365-scm|Supply Chain Management]]** | AI summaries（产品、采购单、销售单、供应商页）、Analyze demand plans、Workload insights | **Procurement Agent**（production ready preview）：Supplier communications（把供应商邮件分成确认 / 变更请求并更新采购单）和 Impact analysis |
| **Project Operations** | Copilot 做时间录入、项目 WBS | Time Entry、Expense、Approvals 三个 agent（production ready preview） |
| **Customer Insights – Journeys / Data** | Journey Creation Agent（预览）、query assist 分段、邮件内容和图片建议；Data 侧 dialog with data（预览） | |
| **Business Central** | — | **Payables Agent**（监控邮箱里的供应商发票，用 Document Intelligence OCR 生成未过账的采购发票草稿）、**Sales Order Agent**（从客户邮件生成报价再转订单，每封外发邮件需审核） |

财务运营类应用的 Copilot 基础：AI 服务是"托管在 Azure、通过 Dataverse 连接的 LLM（由 Power Platform Integration 提供）"，所以要在 **Lifecycle Services** 启用 Power Platform Integration（不需要 dual-write），安装 Dataverse 应用 "Copilot for finance and operations apps" 等；**sidecar**（侧边栏）的生成式帮助是 Copilot Studio 的 agent + 生成式答案，默认知识是已发布的产品文档，**要加自己的知识就在 Copilot Studio 里给 "Copilot for finance and operations apps" agent 上传 PDF / Word 并发布**；**Agent management**（Feature management 开启；Immersive Home › Agents 页，Library / Manage；Agent activity 保留 90 天；按已部署 agent 计费）；**Dynamics 365 ERP MCP server** 让 agent 不写代码就操作数据实体、表单和业务逻辑（Data / Form / Action 三类工具，按用户安全角色过滤；旧的"static ERP MCP"定于 2026-10-01 退役）。

**部署 agent**：PPAC › Copilot › Dynamics 365 的 **agent deployment wizard** 五步——检查先决条件、设置 agent 身份（agent 用户、许可证、角色）、连接（连接与流）、配置邮箱、启用（在 Copilot Studio 发布 + Feature management）。Customer Service 的 Copilot 在 PPAC › Copilot › Settings 里打开 "Enable AI-powered Copilot features"，再在 **Copilot Service admin center**（统一了 Customer Service Hub 和 Omnichannel admin center 的管理应用）里 opt in；客服人员用的桌面叫 **Copilot Service workspace**。

来源：[AI and Copilot in Dynamics 365](https://learn.microsoft.com/en-us/dynamics365/copilot/ai-get-started)、[Customer Service AI features](https://learn.microsoft.com/en-us/dynamics365/contact-center/use/overview-ai-agents-copilot-features)、[Autonomous agents overview](https://learn.microsoft.com/en-us/dynamics365/contact-center/administer/autonomous-agents-overview)、[Configure Copilot features](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-copilot-features)、[Copilot in Sales](https://learn.microsoft.com/en-us/dynamics365/sales/copilot-overview)、[Sales AI agents](https://learn.microsoft.com/en-us/dynamics365/sales/ai-agent-overview)、[Copilot in Field Service](https://learn.microsoft.com/en-us/dynamics365/field-service/copilot-overview)、[Scheduling Operations Agent](https://learn.microsoft.com/en-us/dynamics365/field-service/soa-setup)、[Copilot in finance and operations apps](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/fin-ops/copilot/copilot-for-finance-operations)、[Enable Copilot (F&O)](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/copilot/enable-copilot)、[Extend generative help](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/copilot/extend-copilot-generative-help)、[Agent management](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/fin-ops/copilot/agent-mgmt)、[ERP MCP server](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/copilot/copilot-mcp)、[Agent deployment wizard](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/copilot/agent-deployment)、[Account Reconciliation Agent](https://learn.microsoft.com/en-us/dynamics365/finance/general-ledger/acct-rec-agent)、[Procurement Agent](https://learn.microsoft.com/en-us/dynamics365/supply-chain/procurement/procurement-agent-overview)、[Payables Agent](https://learn.microsoft.com/en-us/dynamics365/business-central/payables-agent)、[Sales Order Agent](https://learn.microsoft.com/en-us/dynamics365/business-central/sales-order-agent)、[Copilot in Customer Insights – Journeys](https://learn.microsoft.com/en-us/dynamics365/customer-insights/journeys/copilot-overview)、[Copilot Service workspace](https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/csw-overview)。

## Contact Center 与 Copilot Studio agent 的接法 {#contact-center}

**[[contact-center|Dynamics 365 Contact Center]]** 是"Copilot 优先的云产品，给你选择的 CRM 的每个互动渠道带来智能、自动化和效率"，也是 Customer Service 的延伸；渠道有聊天、短信、语音（原生 PSTN，转录、情感、咨询）、Teams、社交（Facebook、LINE、自定义）；提供 **unified routing**、IVR、实时转录和翻译。三种形态：Contact Center 嵌入版、独立版、Dynamics 365 Customer Service 本身。

把 Copilot Studio agent 接进来：在 Copilot Service admin center 的 **workstream** 里添加 agent（**每个 workstream 只能加一个 agent**，且只有 push 型 workstream 能把对话交给 agent）；agent 侧在 Copilot Studio › Channels › **Customer engagement hub** › Dynamics 365 Customer Service 连接（同一环境；需要 Copilot Studio 许可证和 Chat Add-in 许可证）；转人工用 Escalate 系统主题里的 **Transfer conversation** 节点，交接时会带上完整对话历史和已收集的变量；语音动作靠 "Dynamics 365 Copilot Studio extension" 解决方案。文档里 "Copilot Studio bot" 已改叫 "Copilot agent"，"human agent" 改叫 "customer service representative"。另有 **Dynamics 365 CX MCP Server – Service**，通过 Agent 365 Tooling Gateway 把案例、知识、时间线等工具暴露给 Copilot Studio agent。

来源：[Contact Center overview](https://learn.microsoft.com/en-us/dynamics365/contact-center/implement/overview-contact-center)、[Introduction to Contact Center (omnichannel)](https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/introduction-omnichannel)、[Configure a Copilot Studio agent](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-bot-virtual-agent)、[Hand off to Customer Service](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-hand-off-omnichannel)、[Customer Service MCP server](https://learn.microsoft.com/en-us/dynamics365/customer-service/develop/connect-agent-model-context-protocol)。

## Microsoft 365 Copilot 里的角色型 agent {#role-agents}

- **[[sales-agent|Sales agent]]**（文档路径仍是 microsoft-sales-copilot；hub 里叫 "Sales in Microsoft 365 Copilot"）：在 Outlook 和 Teams 里带来 CRM 的销售洞察，CRM 可以是 Dynamics 365 Sales 或 Salesforce；由 Microsoft 365 管理员安装；也是"Copilot in Dynamics 365 Sales 的演进方向"。
- **[[service-agent|Service Agent]]**（GA；hub 里叫 "Service in Microsoft 365 Copilot"，旧称 Microsoft 365 Copilot for Service 的文档已重定向到它）：帮客服在 Microsoft 365 Copilot 或 Copilot Service workspace 里查找、总结、更新 Customer Service 的信息，起草邮件和知识。
- 微软自带的其他 agent：Researcher、Analyst（预装）、Facilitator、Channel Agent、Interpreter、Planner Agent、Employee Self-Service、Finance agent。
- **何时自建、何时扩展 Microsoft 365 Copilot**：用户的工作流在 Microsoft 365 应用内、只需加知识和简单动作、要继承 M365 合规 → declarative agent；需要自定义编排、自选模型、主动触发、群组协作、对外发布 → custom engine agent 或独立的 Copilot Studio / Foundry agent（第 4 章表格）。

来源：[Sales agent](https://learn.microsoft.com/en-us/microsoft-sales-copilot/introduction)、[Sales chat](https://learn.microsoft.com/en-us/microsoft-sales-copilot/sales-chat-overview)、[Service Agent](https://learn.microsoft.com/en-us/dynamics365/customer-service/use/use-service-agent)、[Microsoft 365 agents admin guide](https://learn.microsoft.com/en-us/microsoft-365/copilot/agent-essentials/m365-agents-admin-guide)、[Declarative vs custom engine agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/agents-overview)。

## Power Platform 的 AI 功能 {#power-platform-ai}

- **[[ai-builder|AI Builder]]**：低代码 AI 模型。**预构建**：business card reader、文字识别（OCR）、收据、发票、身份证件、合同处理、text generation（GPT prompts）、实体抽取、关键短语、语言检测、情感分析、文本翻译、图像描述；**自定义**（用自己的数据训练）：document processing、category classification、entity extraction、prediction、object detection。用 AI Builder credits。
- **[[prompt-builder|Prompts]]**：可复用的自然语言指令 + 输入变量 + Dataverse 知识，模型来自 Foundry；在 Copilot Studio 当工具、在流里当动作、在应用里调用。
- **[[copilot-hub|Copilot hub]]**（PPAC › Copilot；文档正式名是 "Copilot area"）：用量与成本洞察、新功能、按产品分组的设置（可按环境组设规则）、产品页——Copilot Studio（credit 消耗、活跃 agent、会话成功率）、Power Apps、Power Pages、Dynamics 365 Sales（AI Agents / Copilot 开关）、Dynamics 365（agent deployment wizard）。
- **[[generative-pages|Generative pages]]**：model-driven app 里用自然语言描述页面（可引用最多 6 张 Dataverse 表、连接器或自定义 API，可附图），生成 **React 代码**（前端 + 业务逻辑），solution-aware，可嵌入表单；"code-first" 指推荐用 AI 编码工具 + pac CLI 的作者流程。
- **[[agent-feed|Agent feed]]**（预览）：model-driven app 站点地图顶部的任务流，把 agent 生成的待办（Needs Attention / Completed）交给人审核、验证和完成；2026-05-01 起只支持使用 **Power Apps MCP server** 的 agent。
- **Canvas app 里的 Copilot**：旧的 Copilot control（对单张 Dataverse 表聊天）自 2026-02-02 起不能再加到新应用，且在 CMK / Lockbox 环境不可用；替代是 **Microsoft 365 Copilot in canvas apps**（预览，按钮式，对 Dataverse 表或 SharePoint 列表只读问答，需要每用户 Microsoft 365 Copilot 许可证和租户设置）。

来源：[AI Builder model types](https://learn.microsoft.com/en-us/ai-builder/model-types)、[Prompts overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/prompts-overview)、[Copilot hub](https://learn.microsoft.com/en-us/power-platform/admin/copilot/copilot-hub)、[Generative pages](https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/generative-pages)、[Agent feed](https://learn.microsoft.com/en-us/power-apps/user/supervise-agents-with-agent-feed)、[Copilot control in canvas apps](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/add-ai-copilot)、[Microsoft 365 Copilot in canvas apps](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/microsoft-365-copilot-canvas-app)。

## 数据与 grounding {#data}

AI 方案的质量取决于 [[grounding|grounding]] 数据。可选的数据通道（按"数据搬不搬"分）：

| 通道 | 搬数据吗 | 适合 |
|---|---|---|
| Dataverse 表（Copilot Studio 知识 / Dynamics 365 数据） | 不搬，按安全角色过滤 | 业务记录 |
| SharePoint / 上传文件 | 文件在 SharePoint 或 Dataverse | 政策文档、手册 |
| [[copilot-connectors|Copilot connectors]] | **索引**进 Microsoft Graph | 外部系统的内容要被 Copilot 和搜索找到 |
| Power Platform connectors / real-time 知识连接器 | 实时调 API | 最新交易数据 |
| [[azure-ai-search|Azure AI Search]] / [[foundry-iq|Foundry IQ]] | 建自己的索引 | 大量非结构化数据、需要向量/混合检索和权限过滤 |
| [[fabric-data-agent|Fabric data agent]] | 不搬，在 Fabric 里查 | 分析型数据、语义模型 |

**数据跨区域移动**：Power Platform 环境有 "Move data across regions for Copilots, AI agents, and generative AI features" 设置——允许后，提示和结果可能被送到托管该生成式功能的区域（只在本地没部署模型、容量溢出或本地故障时），不持久化，**打开后不可逆**；路径 PPAC › Environments › 环境 › Generative AI features（还有 Bing search、Microsoft 365 services、EU Data Boundary 的 flex routing 开关，可按环境组设规则）；文档里有环境区域 → Azure OpenAI 区域的对照表（如 Europe → EU Data Boundary；Brazil / Canada / Japan / Korea 等 → United States；Bing Search 总在美国）。Copilot Studio 的生成式功能依赖 Azure OpenAI 和 Bing Search，美国以外访问就意味着跨区域。Microsoft Purview 把 AI 应用分成 "Copilot experiences and agents"（含 Copilot Studio）、"Enterprise AI apps"（含 Foundry）和其他，DSPM for AI 是入口。

来源：[Knowledge sources](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)、[Copilot connectors vs Power Platform connectors](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-graph-vs-power-platform-connectors)、[Fabric data agent](https://learn.microsoft.com/en-us/fabric/data-science/concept-data-agent)、[Geographical availability of Copilot](https://learn.microsoft.com/en-us/power-platform/admin/geographical-availability-copilot)、[Data movement outside the US](https://learn.microsoft.com/en-us/microsoft-copilot-studio/manage-data-movement-outside-us)、[Purview for AI](https://learn.microsoft.com/en-us/purview/ai-microsoft-purview)。

## ROI 与业务价值 {#roi}

官方的度量框架按**四个价值驱动（[[value-drivers|value drivers]]）**组织：

| 驱动 | 衡量 | 怎么折算成钱 |
|---|---|---|
| **Efficiency** | 省回来的生产工时 | 工时 × 每工时的全口径成本 |
| **Quality** | 错误率、一致性、合规 | (之前错误率 − 之后错误率) × 量 × 每个错误的成本 |
| **Revenue** | 留存、扩展、新业务 | 转化率或 deflection 的增量 × 量 × 单位收入 × 归因折扣 |
| **Strategic** | 决策速度、员工信心、韧性 | 能力期权 + 人才留存 + 韧性价值 |

每个驱动要同时有**[[leading-indicator|领先指标]]**（30 天采用率、问题主题覆盖、测试中的 groundedness 分数、containment 趋势）和**滞后指标**（年化 ROI、每笔交易成本、错误率变化、留存变化）。量化指标的来源：Copilot Studio 的 **Savings calculator**、Viva Insights 的 Copilot Studio agents report（**[[agent-assisted-hours|Agent Assisted Hours]]**、Agent Assisted Value）、Copilot Studio Analytics（解决率、首次联系解决率、升级率、放弃率、groundedness）。

公式（对话型 agent）：**Agent Assisted Hours = (知识引用次数 + 加权的无知识引用会话数) × 时间节省乘数 ÷ 60**，其中每次知识引用算 1，无引用的会话按结果加权（resolved 1.0，escalated / abandoned 0.7），默认乘数 6 分钟；自主 agent：(知识引用 × 检索节省 + 动作时间节省 + 无动作的成功会话 × 通用节省) ÷ 60；**Agent Assisted Value = Agent Assisted Hours × 小时成本**（默认 72 美元）。例子：1 万个会话 → 1,440 小时 / 月 → 103,680 美元 / 月。三个会削弱价值故事的陷阱：度量只做到试点、活动量不等于结果、只讲"理论上省的时间"。

**TCO 与成本工具**（Azure 侧）：Azure pricing calculator 用于规划新部署；Cost Management 做成本分析、预算与告警、异常检测、按标签分摊；savings plans（最高 65%）和 reservations（最高 72%）是承诺折扣。Copilot Studio 的 usage estimator 和 Copilot Credits 费率在第 4 章。**[[model-router|Model router]]** 用 Cost / Balanced / Quality 模式控制推理成本。

来源：[Measure the impact of your agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-business-value-measure-impact)、[Agent business value overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-business-value-overview)、[Savings calculator / effectiveness](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-improve-agent-effectiveness)、[Cost Management overview](https://learn.microsoft.com/en-us/azure/cost-management-billing/cost-management-billing-overview)、[Model router](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-router)。

## 监控、测试与持续改进 {#operate}

| 层 | 工具 | 看什么 |
|---|---|---|
| Copilot Studio | Analytics（Effectiveness / Use、themes、CSAT、outcomes）、Evaluations（test sets、八种评估方法）、Application Insights（`customEvents`、OpenTelemetry 导出）、Copilot Agent Kit（测试自动化、Conversation KPIs、rubrics） | 会话结果、生成答案率、知识命中、工具使用 |
| Foundry | Observability：评估器（质量 / RAG / 安全 / agent）、tracing、监控仪表板、持续评估、红队 | 幻觉、相关性、安全事件、token 和延迟 |
| Dynamics 365 | Copilot analytics report（Customer Service）、Agent insights dashboard、F&O 的 Agent activity 页（90 天） | agent 采用与效果 |
| Power Platform | Copilot hub 的用量与成本、Managed Environments 的使用洞察 | 全租户视角 |

测试策略的词：**test set / evaluation**（Copilot Studio，≤100 条单轮或 ≤20 条多轮）、**validation criteria**（自定义模型：Document Intelligence 用测试文档验证字段；custom speech 用 **WER**；Foundry 用 held-out 数据评估微调模型）、**Copilot 生成测试用例**（Copilot Studio 可从知识源或主题自动生成问题集，或从 Analytics 的 themes 直接 Evaluate）、用户反馈（thumbs up / down 和评论进 Analytics）。

来源：[Analytics overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-overview)、[Create test sets](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-create)、[Copilot Agent Kit](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/kit-overview)、[Observability](https://learn.microsoft.com/en-us/azure/foundry/concepts/observability)、[Agent management (F&O)](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/fin-ops/copilot/agent-mgmt)、[Copilot hub](https://learn.microsoft.com/en-us/power-platform/admin/copilot/copilot-hub)、[Custom speech](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/custom-speech-overview)、[Fine-tuning overview](https://learn.microsoft.com/en-us/azure/foundry/fine-tuning/overview)。

## 治理、安全与合规清单 {#governance}

AB-100 的"设计治理"题，答案通常是下面这些名词的组合（细节在第 2 章）：

- **agent 的身份与控制面**：[[agent-365|Microsoft Agent 365]]（Agent Registry、Entra 身份、Purview、Defender）、[[agent-id|Entra Agent ID]]、Conditional Access。
- **数据策略**：PPAC 的 [[dlp|DLP / 数据策略]]（连接器分组、虚拟连接器管 Copilot Studio 功能、MCP 连接器）、Agent access channels、禁止发布生成式 AI agent。
- **信息保护与审计**：[[purview|Purview]] 的敏感度标签（Copilot Studio 只对 SharePoint 知识强制标签加密）、DLP、Insider Risk、**Audit**（提示和回答进统一审计日志）、eDiscovery、DSPM for AI；Copilot Studio 的 computer use 审计（`CUAOperation`）；Foundry 的 tracing 记录每次模型和工具调用。
- **接地数据的访问控制**：Dataverse 安全角色、SharePoint 权限、Azure AI Search 的文档级访问控制、Foundry IQ 的 ACL 同步、工具的 End user authentication。
- **模型与调优的访问控制**：Foundry RBAC（微调需要 Foundry Owner 或 User + Account Owner）、禁用本地认证、Key Vault 管密钥、guardrails 和 Prompt Shields 防提示操纵、Limited Access 审批。
- **数据驻留**：环境区域、跨区域数据移动开关、Foundry 部署类型（Global / Data Zone / Regional）、EU Data Boundary、CMK、Lockbox。
- **变更追踪**：解决方案与 pipelines 的部署历史、Foundry agent 版本、Copilot Studio 的 Version history（agent flows）。

来源：第 2 章各节来源；[Purview and Copilot Studio](https://learn.microsoft.com/en-us/purview/ai-copilot-studio)、[Monitor computer use](https://learn.microsoft.com/en-us/microsoft-copilot-studio/monitor-computer-use)、[Role-based access control for Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry)、[Security and governance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance)。
