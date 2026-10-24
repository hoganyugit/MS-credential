---
id: 01-maps
title: 四张地图：Azure、Microsoft 365、Power Platform、Dynamics 365
short: 四张地图
intro: 四门考试的题目默认你知道微软这几块产品各管什么、彼此怎么接。这一章先把地图摊开，后面的章节再逐块放大。
exams: AB-620 | AB-100 | AI-103 | AI-500
practice:
  ab-100: Agent architecture & orchestration | Frameworks & methodologies
  ai-103: Planning & managing Azure AI solutions
---
微软的产品名经常换，考题里新旧名字混用。读这一章时记住一个原则：**先分清它属于哪张地图，再记它叫什么。** 四张地图分别是：

- **Azure**：云基础设施和开发者服务。AI 的模型、搜索、语音、视觉都在这里，入口是 [[foundry|Microsoft Foundry]]。
- **Microsoft 365**：办公套件（Teams、SharePoint、Outlook…），数据通过 [[microsoft-graph|Microsoft Graph]] 暴露，AI 入口是 [[m365-copilot|Microsoft 365 Copilot]]。
- **Power Platform**：低代码平台（Power Apps、Power Automate、[[copilot-studio|Copilot Studio]]…），数据底座是 [[dataverse|Dataverse]]，管理单位是 [[environment|environment]]。
- **Dynamics 365**：业务应用（Sales、Customer Service、Finance、Supply Chain Management…），其中一半跑在 Dataverse 上，自带 Copilot 和各种 agent。

```diagram
{"type":"columns","title":"四张地图各管什么","columns":[
{"title":"Azure","sub":"云基础设施 + AI 服务","items":["[[subscription|Subscription]] › [[resource-group|Resource group]] › 资源","[[entra-id|Microsoft Entra ID]]（身份）","[[foundry|Microsoft Foundry]]：模型、Agent Service、[[foundry-tools|Foundry Tools]]","[[azure-ai-search|Azure AI Search]]、Key Vault、Monitor、Storage…"]},
{"title":"Microsoft 365","sub":"办公协作 + Copilot","items":["Teams、SharePoint、OneDrive、Outlook","[[microsoft-graph|Microsoft Graph]]（统一数据 API）","[[m365-copilot|Microsoft 365 Copilot]] 与 [[declarative-agent|declarative agents]]","[[copilot-connectors|Copilot connectors]]、[[agent-365|Agent 365]]"]},
{"title":"Power Platform","sub":"低代码 + agent 制作","items":["Power Apps、Power Automate、Power Pages","[[copilot-studio|Copilot Studio]]（做 agent）","[[dataverse|Dataverse]]（数据）","[[environment|Environment]]、[[solution|Solution]]、[[connector|Connector]]","管理台：[[ppac|Power Platform admin center]]"]},
{"title":"Dynamics 365","sub":"业务应用 + 内置 AI","items":["客户互动类：Sales、Customer Service、Field Service…（跑在 Dataverse 上）","财务运营类：Finance、Supply Chain Management…","每个应用自带 Copilot 功能和 agent","[[contact-center|Dynamics 365 Contact Center]]"]}
]}
```

## Azure：订阅、资源组、资源 {#azure}

Azure 里的一切都是**资源（resource）**：一个 Foundry 资源、一个存储账户、一个 Key Vault 都是资源。资源放在**资源组（[[resource-group|resource group]]）**里，资源组属于**订阅（[[subscription|subscription]]）**，订阅之上还可以用**管理组（management group）**分层。设置（比如 [[azure-policy|Azure Policy]] 和 [[rbac|RBAC]] 角色）在上层指定后会向下继承，所以题目里"在订阅级别分配角色"意味着订阅下所有资源组和资源都受影响。

```diagram
{"type":"layers","title":"Azure 的四层作用域（上层设置向下继承）","layers":[
{"boxes":[{"t":"Management group","s":"管理多个订阅"}]},
{"boxes":[{"t":"Subscription","s":"计费和配额的边界"}]},
{"boxes":[{"t":"Resource group","s":"一组生命周期相同的资源；每个资源只属于一个资源组"}]},
{"boxes":[{"t":"Resource","s":"Foundry 资源、Storage、Key Vault、AI Search…"}]}
],"arrows":["包含","包含","包含"]}
```

几个必须认识的词：

- **[[arm|Azure Resource Manager (ARM)]]**：Azure 的部署和管理层。门户、CLI、SDK 的请求都经过它。用 JSON 的 ARM template 或更易读的 **[[bicep|Bicep]]** 可以"声明式"地描述要创建什么资源（基础设施即代码）。
- **资源提供程序（resource provider）**：资源类型的命名空间，例如 `Microsoft.CognitiveServices`（Foundry 资源和各 AI 服务都在这个命名空间下），`Microsoft.Compute`（虚拟机）。题目里出现 `Microsoft.CognitiveServices/accounts/write` 这类字符串，就是在说"创建 AI 资源的权限"。
- **区域（[[region|region]]）**：资源所在的数据中心地理位置（如 East US、Sweden Central）。有些 AI 功能只在部分区域提供，这是 AI-103 的常见考点。
- **[[azure-portal|Azure 门户]]** portal.azure.com、**[[azure-cli|Azure CLI]]**（`az …` 命令）、Azure PowerShell：三种管理方式，功能等价。

> **考点** Foundry 资源的 API kind 是 `AIServices`；用 CLI 创建时写 `az cognitiveservices account create --kind AIServices --sku S0`。创建资源需要订阅或资源组上的 Contributor / Owner 角色（或含 `Microsoft.CognitiveServices/accounts/write` 的自定义角色）。

来源：[Azure Resource Manager overview](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview)、[Create a Foundry resource](https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource)。

## Azure 上的 AI：Microsoft Foundry {#foundry}

**[[foundry|Microsoft Foundry]]**（旧称 Azure AI Studio、Azure AI Foundry）是 Azure 上做生成式 AI 和 agent 的统一入口，门户是 ai.azure.com。它把几样东西收在一起：

| 部件 | 是什么 | 旧名字 / 备注 |
|---|---|---|
| [[foundry-resource|Foundry resource]] | 一个 Azure 资源，提供统一的 endpoint 和 key，下面可以开多个 [[foundry-project|project]] | 旧称 Azure AI services multi-service resource；Azure OpenAI 资源可升级成它 |
| [[foundry-models|Foundry Models]] | 模型目录：1 万多个模型，分"Azure 直接售卖"和"合作伙伴与社区"两类 | 含 [[azure-openai|Azure OpenAI]] 模型 |
| [[foundry-agent-service|Foundry Agent Service]] | 托管式 agent 运行时：定义 agent 的指令、模型、工具，Azure 负责运行 | 旧 Assistants API 已被 [[responses-api|Responses API]] 取代 |
| [[foundry-tools|Foundry Tools]] | 预训练的 AI 服务家族：Speech、Language、Vision、Document Intelligence、Content Understanding、Translator、Content Safety | 旧称 Azure AI services / Cognitive Services |
| [[foundry-iq|Foundry IQ]] | 建立在 [[azure-ai-search|Azure AI Search]] 之上的知识层（agentic retrieval） | |
| 观测与治理 | tracing、evaluations、监控（Application Insights）、[[guardrails|guardrails]]、[[rbac|RBAC]]、网络隔离 | |

第 5 章会逐个展开。现在只需要记住：**Foundry = Azure 上的 AI 平台；Copilot Studio = Power Platform 上的 agent 制作工具；两者可以互相调用**（Copilot Studio 的 agent 可以把 Foundry 的 agent 当成 connected agent，也可以用 Foundry 目录里的模型写 prompt）。

> **易混** "Microsoft Foundry" 和 "Foundry (classic)"：classic 指基于 **hub** 的旧项目模型（hub-based project）。新文档默认讲 Foundry resource + project；题目里出现 "hub" 和 "prompt flow"，多半是在说 classic 路线。

来源：[What is Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry)、[Foundry Models overview](https://learn.microsoft.com/en-us/azure/foundry/concepts/foundry-models-overview)。

## Microsoft 365 与 Microsoft Graph {#m365}

**Microsoft 365** 是 Teams、SharePoint、OneDrive、Outlook、Word/Excel 这些办公应用的总称。对考试来说，重要的是它的**数据层**和 **AI 层**：

- **[[microsoft-graph|Microsoft Graph]]**：一个统一的 API endpoint（`https://graph.microsoft.com`），能访问 Microsoft 365 和 Entra 里的数据（邮件、文件、聊天、用户、日历…）。AI 要"读你的公司数据"，走的就是 Graph。
- **[[copilot-connectors|Microsoft 365 Copilot connectors]]**（旧称 Microsoft Graph connectors）：把外部系统（ServiceNow、Jira、文件共享、自定义数据源）的内容接进 Microsoft Graph，让 Copilot、Microsoft Search 和 Copilot Studio 的 agent 都能搜到。分两种：**synced connectors** 把内容索引进 Graph；**federated connectors** 基于 [[mcp|MCP]] 实时去取，不做索引、只读。
- **[[m365-copilot|Microsoft 365 Copilot]]**：Microsoft 365 里的 AI 助手，工作在 Copilot Chat、Teams、Outlook、Word 等应用里，用 Graph 里的企业数据做回答。许可分 Copilot Chat（基础）、Microsoft 365 Copilot（基础）和 Microsoft 365 Copilot（高级）三档；高级档才有 Word/Excel 里的 Copilot、Microsoft Graph grounding、语义索引和 **[[work-iq|Work IQ]]**（让 agent 能推理组织数据、内容和工具的智能层）。应用本身现在叫 Microsoft Copilot。可以用 **agent** 扩展它：[[declarative-agent|declarative agent]]（借用 Copilot 自己的编排器和模型，只加指令、知识和动作）或 [[custom-engine-agent|custom engine agent]]（自带编排器和模型）。
- 制作工具：[[agent-builder|Copilot Studio agent builder]]（Microsoft 365 Copilot 里的轻量版）、完整版 [[copilot-studio|Copilot Studio]]、给开发者的 [[agents-toolkit|Microsoft 365 Agents Toolkit]] 和 [[agents-sdk|Microsoft 365 Agents SDK]]。
- **[[agent-365|Microsoft Agent 365]]**：管理全公司 agent 的控制面——Microsoft 365 admin center 里的 Agent Registry（全组织 agent 的集中视图）、给每个 agent 发一个 [[agent-id|Microsoft Entra Agent ID]] 身份、用 Purview 和 Defender 治理和保护。2026 年 5 月 1 日 GA，按用户许可。

```diagram
{"type":"layers","title":"Microsoft 365 里的 AI 分层","layers":[
{"label":"用户看到的","boxes":[{"t":"Microsoft 365 Copilot / Copilot Chat"},{"t":"Teams、Outlook、Word、SharePoint 里的 agent"}]},
{"label":"扩展方式","boxes":[{"t":"Declarative agent","s":"指令 + 知识 + 动作，用 Copilot 的编排器"},{"t":"Custom engine agent","s":"自带编排器/模型（Copilot Studio 或 Azure）"}]},
{"label":"数据","boxes":[{"t":"Microsoft Graph","s":"邮件、文件、聊天、用户"},{"t":"Copilot connectors","s":"外部系统接入 Graph"}]}
],"arrows":["由…扩展","读取"]}
```

来源：[Microsoft 365 Copilot overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-overview)、[Microsoft Graph overview](https://learn.microsoft.com/en-us/graph/overview)、[Copilot connectors overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/overview)、[Declarative vs custom engine agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/agents-overview)、[Agent 365 overview](https://learn.microsoft.com/en-us/microsoft-agent-365/overview)。

## Power Platform：环境、Dataverse、连接器 {#power-platform}

**Power Platform** 是微软的低代码平台。AB-620 和 AB-100 里大量"管理类"题目其实都在考它的几个基本单位：

| 单位 | 一句话 | 常见考点 |
|---|---|---|
| [[environment|Environment（环境）]] | 存放和隔离数据、应用、流、agent 的空间；属于一个 Entra 租户，绑定一个地理区域，最多有一个 Dataverse 数据库 | 类型：Production、Sandbox、Default、Trial、Developer、Dataverse for Teams；资源只能连接**同一环境**里的东西 |
| [[dataverse|Dataverse]] | 安全的云数据库：表（table）、行（row）、列（column）；带角色/行/列级安全、业务规则、业务流程 | Dynamics 365 客户互动类应用的数据就存在这里；Copilot Studio 的 agent 也存在这里 |
| [[connector|Connector（连接器）]] | 对某个 API 的封装，带预制的触发器和动作；标准 vs 高级（premium）；可以自建 [[custom-connector|custom connector]] | Copilot Studio 的 tool、Power Automate 的动作都靠它；[[dlp|DLP 策略]]按连接器分类管控 |
| [[solution|Solution（解决方案）]] | 打包和搬运定制内容的容器，ALM 的基本单位 | 第 3 章专门讲 |
| [[ppac|Power Platform admin center (PPAC)]] | 管理员门户：环境、DLP、容量、Copilot hub、Managed Environments | 大多数"管理员在哪里设置"的答案 |

产品家族：**Power Apps**（canvas app 自由画布、model-driven app 基于 Dataverse 表自动生成界面）、**Power Automate**（cloud flow 自动化、desktop flow 做 RPA）、**Power Pages**（对外网站）、**[[copilot-studio|Copilot Studio]]**（做 agent，详见第 4 章）、**[[ai-builder|AI Builder]]**（低代码 AI 模型：文档处理、预测、prompts）。

> **考点** "Managed Environments" 不是一种环境类型，而是给环境加上的一组高级管理能力（环境分组、共享限制、使用洞察、DLP、[[pipelines|pipelines]]、解决方案检查、IP 防火墙、[[cmk|客户管理的密钥]]、Lockbox…），需要相应的独立许可证。

来源：[Environments overview](https://learn.microsoft.com/en-us/power-platform/admin/environments-overview)、[What is Dataverse](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-intro)、[Connectors overview](https://learn.microsoft.com/en-us/connectors/)、[Managed Environments overview](https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-overview)、[AI Builder overview](https://learn.microsoft.com/en-us/ai-builder/overview)。

## Dynamics 365：两大家族 {#dynamics}

**[[dynamics-365|Dynamics 365]]** 是微软的业务应用（CRM + ERP）家族。考试不要求你会用它，但要求你知道**哪个应用管什么、它的 AI 叫什么**（第 6 章详述）。先分两家：

- **跑在 Dataverse 上的应用**（文档里常叫 customer engagement apps）：Sales、Customer Service、Customer Insights、Field Service 等。官方原话：它们"是用 Power Apps 构建、运行在 Microsoft Dataverse 上的 model-driven app"——所以和 Power Platform 同一套环境、解决方案、安全模型，Copilot Studio 的 agent 可以直接读写它们的数据。
- **财务运营类（finance and operations apps）**：Finance、Supply Chain Management、Commerce、Project Operations。它们有自己的数据库，通过 **Power Platform integration**（在 Lifecycle Services 里启用）连接 Dataverse，Copilot 功能依赖这个集成；需要同步数据时可以用 dual-write。
- **Business Central** 是面向中小企业的独立 ERP，有自己的 agent（Payables Agent、Sales Order Agent）。

每个应用都带 **Copilot**（摘要、起草邮件、问答）和逐渐增多的**自主 agent**，例如 Customer Service 的 Case Management Agent、Sales 的 Sales Qualification Agent、Finance 的 Account Reconciliation Agent、Supply Chain Management 的 Procurement Agent（含 Supplier communications 能力）。**[[contact-center|Dynamics 365 Contact Center]]** 是"Copilot 优先"的云联络中心产品（语音、聊天、短信、社交渠道），可以配任何 CRM，也是 Customer Service 的延伸。

来源：[Dynamics 365 documentation hub](https://learn.microsoft.com/en-us/dynamics365/)、[Dynamics 365 AI and Copilot hub](https://learn.microsoft.com/en-us/dynamics365/copilot/ai-get-started)、[Enable Copilot in finance and operations apps](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/copilot/enable-copilot)、[Dual-write overview](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/data-entities/dual-write/dual-write-overview)、[Contact Center overview](https://learn.microsoft.com/en-us/dynamics365/contact-center/implement/overview-contact-center)。

## Fabric：数据平台 {#fabric}

**[[fabric|Microsoft Fabric]]** 是 SaaS 形式的端到端数据分析平台：数据接入、转换、实时流处理、分析和报表都在一个产品里，数据统一存在 **[[onelake|OneLake]]**（每个租户一个的逻辑数据湖，建在 Azure Data Lake Storage Gen2 上）。工作负载包括 Power BI、Databases（含从 Azure SQL、Cosmos DB、Databricks、Snowflake 镜像）、Data Factory、Real-Time Intelligence、Data Engineering（Spark）、Data Science、Data Warehouse，以及预览中的 Fabric IQ（本体、Fabric Graph、data agent）。**[[lakehouse|Lakehouse]]** 是工作区里"像数据库一样"组织文件、文件夹和表的对象。

考试里 Fabric 主要以两种身份出现：

- 作为 **grounding 数据源**：[[fabric-data-agent|Fabric data agent]] 能用自然语言查 lakehouse、warehouse、Power BI 语义模型、KQL 数据库（只读，最多 5 个数据源），Copilot Studio、Foundry、Microsoft 365 Copilot 都能把它当作一个 agent 来调用。
- 作为 Foundry agent 的工具：Fabric IQ 工具、Fabric data agent 工具。

来源：[Microsoft Fabric overview](https://learn.microsoft.com/en-us/fabric/fundamentals/microsoft-fabric-overview)、[Fabric data agent concept](https://learn.microsoft.com/en-us/fabric/data-science/concept-data-agent)。

## 名字变了：新旧对照 {#renames}

题库里新旧名字都会出现。对照表（新名在前；"退役"表示官方已宣布停止服务的日期）：

| 现在叫 | 以前叫 / 状态 | 备注 |
|---|---|---|
| Microsoft Foundry | Azure AI Foundry、Azure AI Studio | 门户 ai.azure.com |
| Foundry Tools | Azure AI services | 资源类型仍在 `Microsoft.CognitiveServices` 命名空间下，角色名里也还能看到 Cognitive Services 字样 |
| Foundry resource | 旧文档叫 multi-service resource | kind = AIServices |
| Azure OpenAI in Foundry Models | Azure OpenAI | 现在是 Foundry Models 的一部分 |
| Responses API（conversations / items / responses） | Assistants API（threads / messages / runs） | Assistants API 定于 2026-08-26 退役 |
| Microsoft Agent Framework | Semantic Kernel + AutoGen 的后继 | Prompt flow 定于 2027-04-20 退役，官方建议迁移到 Agent Framework |
| Foundry User / Owner / Account Owner / Project Manager | Azure AI User / Owner / Account Owner / Project Manager | 角色 ID 不变 |
| Microsoft Entra ID | Azure Active Directory (Azure AD) | |
| Microsoft 365 Copilot connectors | Microsoft Graph connectors | |
| Microsoft Copilot（应用名） | Microsoft 365 Copilot app | 网址 copilot.cloud.microsoft；许可仍叫 Microsoft 365 Copilot |
| Microsoft 365 Agents SDK | Bot Framework SDK 的"演进版" | Bot Framework SDK 已归档，2025-12-31 起不再受理支持 |
| Microsoft 365 Agents Toolkit | Teams Toolkit | |
| Copilot Credits | messages（Copilot Studio 计费单位） | 2025-09-01 起改名，数量不变 |
| Copilot Agent Kit | Copilot Studio Kit | Power CAT 团队的工具包 |
| Azure Language 的 CLU / 自定义问答 | LUIS、QnA Maker | LUIS 2025-10-01 退役，QnA Maker 2025-03-31 退役 |
| Azure Vision Image Analysis | Computer Vision | Image Analysis 4.0 已宣布 2028-09-25 退役 |
| Custom Vision | — | 已宣布退役，支持到 2028-09-25 |
| Power Platform pipelines | ALM Accelerator（已弃用）、CoE Starter Kit（不再维护） | 核心能力已进入 Power Platform admin center |

来源：[What is Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry)、[Authentication and authorization in Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/authentication-authorization-foundry)、[Role-based access control for Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry)、[What is Microsoft Entra](https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra)、[Copilot connectors overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/overview)、[Microsoft 365 Copilot overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-overview)、[Agents SDK overview](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agents-sdk-overview)、[Bot Framework what's new](https://learn.microsoft.com/en-us/azure/bot-service/what-is-new)、[Agents Toolkit overview](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/overview-agents-toolkit)、[Copilot Studio billing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)、[Copilot Agent Kit](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/kit-overview)、[Bot Service FAQ](https://learn.microsoft.com/en-us/azure/bot-service/bot-service-resources-faq-availability)、[Image Analysis overview](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-image-analysis)、[Custom Vision overview](https://learn.microsoft.com/en-us/azure/ai-services/custom-vision-service/overview)、[What is Azure Machine Learning](https://learn.microsoft.com/en-us/azure/machine-learning/overview-what-is-azure-machine-learning)、[ALM Accelerator](https://learn.microsoft.com/en-us/power-platform/guidance/alm-accelerator/overview)、[CoE Starter Kit](https://learn.microsoft.com/en-us/power-platform/guidance/coe/overview)。
