# 术语表 · Dynamics 365 与业务 AI

### Dynamics 365 {#dynamics-365}
- zh: 微软的业务应用家族（CRM + ERP）
- aliases: D365 | customer engagement apps | finance and operations apps | F&O
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/dynamics365/copilot/ai-get-started
- see: dataverse | d365-sales | d365-customer-service | d365-finance | d365-scm | contact-center
- chapter: 01-maps/dynamics

Sales、Customer Service、Customer Insights 等是运行在 Dataverse 上的 model-driven app；Finance、Supply Chain Management、Commerce、Project Operations 是财务运营类应用（通过 Power Platform integration 连接 Dataverse）；Business Central 是独立的中小企业 ERP。每个应用都有 Copilot 和逐渐增多的自主 agent。

### Dynamics 365 Customer Service {#d365-customer-service}
- zh: 客服案例管理应用，Copilot 与自主客服 agent 的载体
- aliases: Customer Service | Copilot Service workspace | Copilot Service admin center | Customer Support agent | Case Management Agent | Customer Knowledge Management Agent | Customer Intent Agent | Quality Evaluation Agent
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/dynamics365/contact-center/use/overview-ai-agents-copilot-features
- see: contact-center | service-agent | copilot-studio
- chapter: 06-business-ai/dynamics

Copilot：提问、提示、对话/案例摘要、邮件起草、解决备注、知识草稿、Copilot analytics report；自主 agent：Customer Intent Agent、Case Management Agent、Customer Knowledge Management Agent、Quality Evaluation Agent。客服桌面叫 Copilot Service workspace，管理应用叫 Copilot Service admin center；Copilot 在 PPAC 和 admin center 两处启用。

### Dynamics 365 Contact Center {#contact-center}
- zh: Copilot 优先的云联络中心（可配任何 CRM）
- aliases: Contact Center | omnichannel | Omnichannel for Customer Service | unified routing | workstream | workstreams
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/dynamics365/contact-center/implement/overview-contact-center
- see: d365-customer-service | voice | channel
- chapter: 06-business-ai/contact-center

渠道：聊天、短信、语音（原生 PSTN）、Teams、社交；unified routing、IVR、实时转录和翻译；三种形态：嵌入版、独立版、Dynamics 365 Customer Service。Copilot Studio agent 加在 workstream 里（每个 workstream 一个，push 型才能接对话），转人工带上完整历史和变量。Copilot Studio 的电话渠道和实时语音 agent 需要它。

### Dynamics 365 Sales {#d365-sales}
- zh: 销售 CRM 应用，带 Copilot 和销售 agent
- aliases: Sales Qualification Agent | Sales Opportunity Agent | Sales Close Agent | Sales Research Agent | Recommended Actions Agent
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/dynamics365/sales/ai-agent-overview
- see: sales-agent | copilot-hub
- chapter: 06-business-ai/dynamics

Copilot：记录摘要、嵌入式摘要、最近变更、SharePoint 信息助手、会议准备、邮件助手、新闻；agent：Sales Qualification、Sales Opportunity、Sales Close、Sales Research、Recommended Actions，另有 AI 数据丰富；先部署到 sandbox；PPAC 的 Copilot 设置里有 AI Agents 和 Copilot 开关。

### Dynamics 365 Field Service {#d365-field-service}
- zh: 现场服务应用（工单、调度）
- aliases: Field Service | Scheduling Operations Agent | work order
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/dynamics365/field-service/copilot-overview
- see: dynamics-365 | agent-feed
- chapter: 06-business-ai/dynamics

Copilot：自然语言问答、工单更新（移动端）、工单摘要、巡检模板、表单填写、视图内找数据和可视化、agent feed；Scheduling Operations Agent（预览）在调度员调整排程时自动考虑现有预约和约束，credits 计费。

### Dynamics 365 Finance {#d365-finance}
- zh: 财务 ERP 应用（财务运营类）
- aliases: Account Reconciliation Agent | Lifecycle Services | Agent management | agent deployment wizard | ERP MCP
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/fin-ops/copilot/copilot-for-finance-operations
- see: d365-scm | dynamics-365 | mcp
- chapter: 06-business-ai/dynamics

Copilot：Collections coordinator 摘要、客户页摘要、workflow history 摘要、Agent management；Account Reconciliation Agent（production ready preview）对对账异常给建议。Copilot 依赖 Lifecycle Services 里启用的 Power Platform Integration；Dynamics 365 ERP MCP server 让 agent 操作数据实体、表单和业务逻辑；agent 通过 PPAC 的 agent deployment wizard 部署。

### Dynamics 365 Supply Chain Management {#d365-scm}
- zh: 供应链 ERP 应用（财务运营类）
- aliases: Supply Chain Management | SCM | Procurement Agent | Supplier Communications Agent | demand plans
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/dynamics365/supply-chain/procurement/procurement-agent-overview
- see: d365-finance | dynamics-365
- chapter: 06-business-ai/dynamics

Copilot：AI summaries（产品、采购单、销售单、供应商页）、Analyze demand plans、Workload insights；Procurement Agent（production ready preview）的 Supplier communications 把供应商邮件分成确认/变更并更新采购单，Impact analysis 评估影响。

### Business Central {#business-central}
- zh: 面向中小企业的独立 ERP，有 Payables Agent 和 Sales Order Agent
- aliases: Dynamics 365 Business Central | Payables Agent | Sales Order Agent
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/dynamics365/business-central/payables-agent
- see: dynamics-365 | document-intelligence
- chapter: 06-business-ai/dynamics

Payables Agent 监控邮箱里的供应商发票，用 Document Intelligence OCR 生成未过账的采购发票草稿供审核；Sales Order Agent 从客户邮件生成报价再转订单，每封外发邮件需审核。都消耗 Copilot Credits。

### Dynamics 365 Customer Insights {#customer-insights}
- zh: 客户数据平台（Data）和营销旅程（Journeys）
- aliases: Customer Insights | Customer Insights – Journeys | Journey Creation Agent
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/dynamics365/customer-insights/journeys/copilot-overview
- see: dynamics-365 | contact-center
- chapter: 06-business-ai/dynamics

Journeys 的 Copilot：Journey Creation Agent（预览）、query assist 分段、邮件内容和图片建议、改写；Conversational journeys 结合 Contact Center 和 Copilot Studio agent；Data 侧有 dialog with data（预览，仅美国和瑞士区域）。

### Dynamics 365 Project Operations {#project-operations}
- zh: 项目管理与核算应用（财务运营类）
- aliases: Project Operations | Time Entry Agent | Expense Agent | Approvals Agent
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/fin-ops/copilot/copilot-for-finance-operations
- see: dynamics-365 | d365-finance
- chapter: 06-business-ai/dynamics

Copilot 做时间录入和项目 WBS；Time Entry、Expense、Approvals 三个 agent（production ready preview），由 agent deployment wizard 部署。

### Sales agent (Microsoft 365 Copilot) {#sales-agent}
- zh: Microsoft 365 Copilot 里的销售 agent（原 Copilot for Sales）
- aliases: Sales in Microsoft 365 Copilot | Copilot for Sales | Microsoft 365 Copilot for Sales | Sales Chat
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-sales-copilot/introduction
- see: d365-sales | m365-copilot | service-agent
- chapter: 06-business-ai/role-agents

在 Outlook 和 Teams 里带来 CRM（Dynamics 365 Sales 或 Salesforce）的销售洞察，由 Microsoft 365 管理员安装；Sales Chat 是其对话式入口；官方称它是 Copilot in Dynamics 365 Sales 的演进方向。

### Service Agent (Microsoft 365 Copilot) {#service-agent}
- zh: Microsoft 365 Copilot 里的客服 agent（原 Copilot for Service）
- aliases: Service in Microsoft 365 Copilot | Copilot for Service | Microsoft 365 Copilot for Service
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/dynamics365/customer-service/use/use-service-agent
- see: d365-customer-service | sales-agent | m365-copilot
- chapter: 06-business-ai/role-agents

GA；帮客服在 Microsoft 365 Copilot、Copilot Service workspace 或任何支持 Copilot 的应用里查找、总结和更新 Customer Service 的信息，起草邮件和知识，建议下一步。旧的 "Microsoft 365 Copilot for Service" 文档已重定向到它。

### Prompt-and-response agent {#prompt-and-response-agent}
- zh: 一问一答型 agent：由用户输入驱动、为特定任务而建
- aliases: prompt and response agent | prompt-and-response agents
- exams: AB-100
- ref: https://www.microsoft.com/en-us/copilot/copilot-101/copilot-ai-agents
- see: task-agent | autonomous-agent | declarative-agent
- chapter: 06-business-ai/agent-types

微软 Copilot 101（microsoft.com）的三分法之一。产品上对应知识源 + 生成式答案的 Copilot Studio agent、declarative agent、Foundry prompt agent。

### Task agent {#task-agent}
- zh: 任务型 agent：用户触发后完成一件具体的事
- aliases: task agents | task-oriented agent
- exams: AB-100
- ref: https://www.microsoft.com/en-us/copilot/copilot-101/copilot-ai-agents
- see: prompt-and-response-agent | autonomous-agent | agent-flow
- chapter: 06-business-ai/agent-types

产品上对应主题 + 工具 + agent flow 的 Copilot Studio agent、custom engine agent、带 function calling 的 Foundry agent。与自主 agent 的区别在于由用户发起而不是事件触发。

### Cloud Adoption Framework {#caf}
- zh: CAF：微软的云（与 AI）采用方法论
- aliases: CAF | AI adoption | AI strategy | AI Plan | AI Ready | Govern AI | Secure AI | Manage AI
- exams: AB-100 | AI-103
- ref: https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/strategy
- see: ai-coe | well-architected
- chapter: 06-business-ai/frameworks

AI adoption 六阶段 Strategy → Plan → Ready → Govern → Secure → Manage；AI Strategy 的四条技术路线：ready-to-use Copilots、low-code SaaS（Copilot Studio、M365 Copilot 扩展）、managed PaaS（Foundry 系列、Azure ML、Fabric）、Azure IaaS（自管模型）。整体 CAF 阶段是 Strategy、Plan、Ready、Adopt、Govern、Secure、Manage。

### AI Center of Excellence {#ai-coe}
- zh: AI 卓越中心：推动 AI 落地与治理的内部专家团队
- aliases: AI CoE | Center of Excellence | CoE | CoE Starter Kit
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/center-of-excellence
- see: caf
- chapter: 06-business-ai/frameworks

职责：定义 AI 战略、培养技能、领导试点、制定并执行标准、需求收集与优先级、可复用资产、度量汇报、（可选）管理 AI 服务；建议高管支持、指定负责人、跨职能团队、可并入现有 Cloud CoE，早期集中后期顾问式。Power Platform 的 CoE Starter Kit 已不再维护。

### Azure Well-Architected Framework {#well-architected}
- zh: Azure 工作负载设计的五支柱框架
- aliases: WAF | Well-Architected | Well-Architected Framework
- exams: AB-100 | AI-103
- ref: https://learn.microsoft.com/en-us/azure/well-architected/
- see: pp-well-architected | caf
- chapter: 06-business-ai/frameworks

Reliability、Security、Cost Optimization、Operational Excellence、Performance Efficiency；有 AI 工作负载指南。

### Power Platform Well-Architected {#pp-well-architected}
- zh: Power Platform 工作负载的设计框架（含 intelligent application）
- aliases: Power Platform Well-Architected Framework | Experience Optimization | intelligent application workload
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/power-platform/well-architected/
- see: well-architected | copilot-studio
- chapter: 06-business-ai/frameworks

支柱 Reliability、Security、Operational Excellence、Performance Efficiency、Experience Optimization（没有 Cost）；intelligent application workload（Copilot Studio）的设计域：Responsible AI、安全合规、性能、部署测试、集成、意图识别。

### Success by Design {#success-by-design}
- zh: 微软 FastTrack 的 Dynamics 365 / Power Platform 实施框架
- aliases: FastTrack | Solution Blueprint Review | Go-live Readiness Review
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/success-by-design
- see: caf
- chapter: 06-business-ai/frameworks

阶段 Discover → Initiate → Implement → Prepare → Operate；评审：Solution Blueprint Review（必做）、Implementation Reviews、Go-live Readiness Review；结论分 assertions / risks / issues；现为"agent 辅助"的 AI-first 版本。

### Value drivers {#value-drivers}
- zh: 四个价值驱动：Efficiency、Quality、Revenue、Strategic
- aliases: four value drivers | value driver | ROI | return on investment | TCO | total cost of ownership
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-business-value-measure-impact
- see: agent-assisted-hours | leading-indicator | savings-calculator
- chapter: 06-business-ai/roi

Efficiency（工时 × 工时成本）、Quality（错误率差 × 量 × 单错成本）、Revenue（转化/deflection 增量 × 量 × 单位收入 × 归因折扣）、Strategic（能力期权 + 人才留存 + 韧性）。每个驱动配量化指标、定性信号、领先和滞后指标。TCO 侧用 Azure pricing calculator 和 Cost Management。

### Leading and lagging indicators {#leading-indicator}
- zh: 领先指标（早期信号）与滞后指标（结果确认）
- aliases: leading indicators | lagging indicators | lagging indicator
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-business-value-measure-impact
- see: value-drivers | analytics
- chapter: 06-business-ai/roi

领先：30 天采用率、问题主题覆盖、测试中的 groundedness、containment / 首次联系解决趋势、员工情绪；滞后：年化 ROI、每笔交易成本、错误率变化、留存变化、新能力数。每个价值驱动在季度回顾里至少各一个。

### Agent Assisted Hours {#agent-assisted-hours}
- zh: 微软发布的 agent 节省工时公式
- aliases: AAH | Agent Assisted Value | time savings multiplier
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-business-value-measure-impact
- see: value-drivers | savings-calculator
- chapter: 06-business-ai/roi

对话型：(知识引用次数 + 加权的无引用会话数) × 时间节省乘数 ÷ 60，resolved 权重 1.0、escalated/abandoned 0.7，默认乘数 6 分钟；自主型：(知识引用 × 检索节省 + 动作时间节省 + 无动作成功会话 × 通用节省) ÷ 60；Agent Assisted Value = AAH × 小时成本（默认 72 美元）。来自 Viva Insights 的 Copilot Studio agents report。

### Savings calculator {#savings-calculator}
- zh: Copilot Studio Analytics 里的节省估算器
- aliases: cost savings | usage estimator
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-improve-agent-effectiveness
- see: analytics | agent-assisted-hours | copilot-credits
- chapter: 06-business-ai/roi

按会话结果估算 agent 带来的节省，是 Efficiency 指标（hours saved、cost per transaction）的数据来源之一；usage estimator 则用于预估 Copilot Credits 消耗。

### ALM Accelerator {#alm-accelerator}
- zh: 已弃用的 Power Platform ALM 工具（CoE kit 的一部分）
- aliases: ALM Accelerator for Power Platform
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/guidance/alm-accelerator/overview
- see: pipelines | ai-coe
- chapter: 03-alm/code-first

建在 Azure Pipelines + Git 上的 canvas app；官方建议改用 Power Platform pipelines 或 Build Tools / GitHub Actions / pac CLI。

### Prompt library {#prompt-library}
- zh: 组织内共享和维护的提示集合
- aliases: shared prompt libraries
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-business-value-measure-impact
- see: prompt-engineering | prompt-builder
- chapter: 06-business-ai/roi

官方采用建议之一：建立共享提示库并按 Analytics 里观察到的主题每月更新。技术上可用 Copilot Studio 的 Prompts（Prompt builder）落地可复用提示。
