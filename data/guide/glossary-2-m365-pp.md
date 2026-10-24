# 术语表 · Microsoft 365、Power Platform 与 ALM

### Microsoft 365 {#microsoft-365}
- zh: 微软的办公协作套件（Teams、SharePoint、Outlook…）
- aliases: M365 | Office 365
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-overview
- see: microsoft-graph | m365-copilot | teams
- chapter: 01-maps/m365

对考试重要的是它的数据层（Microsoft Graph）和 AI 层（Microsoft 365 Copilot 及其 agent）。管理门户是 Microsoft 365 admin center，agent 的审批和 Agent Registry 也在那里。

### Microsoft Teams {#teams}
- zh: 微软的协作与会议应用，也是 agent 最常见的渠道
- aliases: Teams
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams
- see: channel | m365-copilot
- chapter: 04-copilot-studio/channels

Copilot Studio 的 Teams & Microsoft Copilot 渠道要求 Authenticate with Microsoft；agent 可以共享给同事、提交管理员审批进入组织目录，或打包成 .zip。微软自带的 Teams agent 有 Facilitator、Channel Agent、Interpreter。

### SharePoint {#sharepoint}
- zh: 微软的文档与站点平台，常见的知识源
- aliases: SharePoint Online | OneDrive
- exams: AB-620 | AB-100 | AI-103
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio
- see: knowledge-source | copilot-connectors
- chapter: 04-copilot-studio/knowledge

Copilot Studio 知识源之一（按 URL 添加，最多 25 个，按用户权限过滤）；Azure AI Search 和 Foundry IQ 也能索引它（预览）。Purview 的敏感度标签加密只对 SharePoint 知识强制。

### Microsoft Graph {#microsoft-graph}
- zh: Microsoft 365 和 Entra 数据的统一 API
- aliases: Graph | Graph API | graph.microsoft.com
- exams: AB-620 | AB-100 | AI-103
- ref: https://learn.microsoft.com/en-us/graph/overview
- see: copilot-connectors | m365-copilot
- chapter: 01-maps/m365

单一 endpoint `https://graph.microsoft.com` 访问邮件、文件、聊天、用户、日历等。Copilot connectors 把外部内容索引进来，Graph Data Connect 把数据批量导出到 Azure。Microsoft 365 Copilot 的 grounding 就建在它上面。

### Microsoft 365 Copilot {#m365-copilot}
- zh: Microsoft 365 里的 AI 助手
- aliases: Copilot Chat | Microsoft Copilot | Copilot for Microsoft 365 | M365 Copilot
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-overview
- see: declarative-agent | custom-engine-agent | work-iq | agent-builder
- chapter: 01-maps/m365

由大模型 + grounding（web 和/或 Microsoft Graph、Work IQ）+ 按用户权限组成。许可分 Copilot Chat（基础）、Microsoft 365 Copilot（基础）、Microsoft 365 Copilot（高级）；高级档才有 Office 应用内 Copilot、Graph grounding、语义索引、Work IQ、Copilot Search。应用名现在是 Microsoft Copilot（copilot.cloud.microsoft）。

### Work IQ {#work-iq}
- zh: 让 agent 能推理组织数据、内容和工具的智能层
- aliases: Turn on Work IQ
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-overview
- see: m365-copilot | tenant-graph-grounding
- chapter: 01-maps/m365

Microsoft 365 Copilot（高级）的能力之一。Copilot Studio 较新的页面把"tenant graph grounding with semantic search"称为 Turn on Work IQ；Foundry 的 toolbox 里也有 Work IQ 工具。

### Microsoft 365 Copilot connectors {#copilot-connectors}
- zh: 把外部内容索引进 Microsoft Graph 的连接器（原 Graph connectors）
- aliases: Copilot connectors | Graph connectors | Microsoft Graph connectors | synced connectors | federated connectors
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/overview
- see: connector | microsoft-graph | knowledge-source
- chapter: 04-copilot-studio/knowledge

synced connectors 把内容索引进 Graph（有引用、语义索引，在 Microsoft 365 admin center 配置）；federated connectors 基于 MCP 实时取、不索引、只读。100 多个预制连接器，自定义用 Agents Toolkit 或 Graph connectors API，尊重 ACL。和 Power Platform 连接器的区别：前者搬数据进索引，后者实时调 API。

### Declarative agent {#declarative-agent}
- zh: 声明式 agent：借用 Copilot 的编排器和模型，只加指令、知识和动作
- aliases: declarative agents | agents for Microsoft Copilot
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/agents-overview
- see: custom-engine-agent | agent-builder | agents-toolkit
- chapter: 04-copilot-studio/m365-copilot

托管在 Microsoft 365 里，继承其合规、RAI 和安全；用 Agent Builder、Copilot Studio 或 Agents Toolkit 构建；运行在 Microsoft 365 Copilot、Teams、Word、Excel、Outlook；面向个人使用，不支持主动触发。Copilot Studio 里叫 "agents for Microsoft Copilot"（Copilot chat harness）。

### Custom engine agent {#custom-engine-agent}
- zh: 自带编排器和模型的 agent
- aliases: custom engine agents
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/agents-overview
- see: declarative-agent | agents-sdk | copilot-studio
- chapter: 04-copilot-studio/m365-copilot

需要自定义编排、自选模型（含小模型、微调模型）、主动消息、群组协作或对外发布时用。可托管在 Copilot Studio 或 Azure 等外部环境；用 Agents SDK / Agents Toolkit（.NET、Python、JS）和 Semantic Kernel / LangChain 等框架构建；合规由你自己负责。

### Agent Builder {#agent-builder}
- zh: Microsoft Copilot 应用里的轻量 agent 制作器
- aliases: Copilot Studio agent builder
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder
- see: declarative-agent | copilot-studio
- chapter: 04-copilot-studio/m365-copilot

面向信息工作者，做 declarative agent：知识可选 SharePoint、Copilot connectors、网页，没有动作；要加连接器、工作流或自主能力就 copy the agent to Copilot Studio。由 Copilot Studio 处理但不占 Dataverse 存储、不支持 CMK；在 Microsoft 365 admin center 的 Integrated Apps 管理。

### Microsoft 365 Agents Toolkit {#agents-toolkit}
- zh: 给开发者的 agent 脚手架工具（Teams Toolkit 的演进）
- aliases: Agents Toolkit | Teams Toolkit | Agents Playground
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/overview-agents-toolkit
- see: agents-sdk | declarative-agent | custom-engine-agent
- chapter: 04-copilot-studio/m365-copilot

VS Code、Visual Studio 和 CLI 版本，集成 Agents SDK、Foundry 和 TypeSpec；脚手架 declarative agent 和 custom engine agent、Teams/Outlook/Copilot 应用、Office 加载项；Agents Playground 可在没有开发租户时本地模拟 Teams；支持 SSO 和 CI/CD。

### Microsoft 365 Agents SDK {#agents-sdk}
- zh: 多渠道 agent 的开发框架（Bot Framework SDK 的后继）
- aliases: Agents SDK | Bot Framework SDK | Bot Framework
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agents-sdk-overview
- see: agents-toolkit | azure-bot-service | direct-line
- chapter: 04-copilot-studio/m365-copilot

C#/.NET、JavaScript、Python；把各渠道（Teams、Microsoft Copilot、网页、Slack…）的消息规范化为 Activity，管理 turn 和状态；模型无关（Foundry、OpenAI、Semantic Kernel 都可接）。Bot Framework SDK 已归档，2025-12-31 起不再受理支持。Copilot Studio 可以把 Agents SDK 写的 agent 当连接 agent，也能通过它的 connection string 把 agent 嵌进 web / 原生应用。

### Azure AI Bot Service {#azure-bot-service}
- zh: 连接 bot 与各渠道的 Azure 服务（Bot Connector）
- aliases: Bot Service | Bot Connector | Azure Bot Service skills | skill bot
- exams: AB-620
- ref: https://learn.microsoft.com/en-us/azure/bot-service/bot-overview
- see: direct-line | agents-sdk | channel
- chapter: 04-copilot-studio/channels

Bot Connector 在 bot 和渠道（Slack、Telegram、Twilio、Line、Direct Line Speech、Email…）之间转发消息；Copilot Studio 的 "Azure Bot Service channels" 就是它。skill bot 是给别的 bot 提供功能的 bot，Copilot Studio 的 agent 也能作为 skill。QnA Maker（2025-03-31）和 LUIS（2025-10-01）已退役。

### Direct Line {#direct-line}
- zh: 自己的客户端应用与 agent 通信的 REST API
- aliases: Direct Line API | token endpoint | Web Chat | Bot Framework Web Chat
- exams: AB-620
- ref: https://learn.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-direct-line-3-0-concepts
- see: channel | azure-bot-service
- chapter: 04-copilot-studio/channels

用 secret 或运行时 token 认证，显式打开 conversation，通过 HTTP POST 发 activity，用 WebSocket 或 HTTP GET 收。Copilot Studio 的 Mobile app / 自定义应用渠道给出 token endpoint；Settings › Security 的 Web channel security 可要求密钥（Secret 1 / Secret 2）。Bot Framework Web Chat 是现成的网页聊天控件。

### Microsoft Agent 365 {#agent-365}
- zh: 管理全公司 AI agent 的控制面
- aliases: Agent 365 | Agent Registry
- exams: AB-100 | AB-620 | AI-103
- ref: https://learn.microsoft.com/en-us/microsoft-agent-365/overview
- see: agent-id | purview | entra-id
- chapter: 02-identity-security/copilot-studio-security

观察（Microsoft 365 admin center 的 Agent Registry 和 agent map）、治理（Entra、Purview 生命周期）、保护（Entra 访问控制、Purview DLP、Defender）；用 Entra Agent ID 给每个 agent 独立身份。2026-05-01 GA，按用户许可（含于 Microsoft 365 E7）。

### Agent Store {#agent-store}
- zh: Microsoft Copilot 里用户添加 agent 的商店，需管理员审批
- aliases: Microsoft 365 Agent Store | Built for your org | AI Administrator
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-365/admin/manage/manage-copilot-agents-integrated-apps
- see: agent-365 | publish
- chapter: 04-copilot-studio/m365-copilot

agent 提交后由管理员在 Microsoft 365 admin center 的 Agents › All agents › Requests 审核：Publish（谁可安装）或 Deploy（预装给谁）；可阻止或移除；需要 AI Administrator 或 Global Administrator。Copilot Studio 里 "Show to everyone in my org → Submit for admin approval" 走的就是这条路。

### Copilot Tuning {#copilot-tuning}
- zh: 用组织的 SharePoint 数据微调模型（早期预览）
- aliases: Microsoft Copilot Tuning
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-tuning-overview
- see: fine-tuning | agent-builder
- chapter: 04-copilot-studio/m365-copilot

通过 Agent Builder 的可调模板（Document Writing、Document Summary、Expert Answers…）做 Tune Context / Tune Tool / Tune Model，尊重 ACL。

### Power Platform {#power-platform}
- zh: 微软的低代码平台
- aliases: Microsoft Power Platform
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/admin/environments-overview
- see: power-apps | power-automate | copilot-studio | dataverse | environment
- chapter: 01-maps/power-platform

Power Apps、Power Automate、Power Pages、Copilot Studio、AI Builder、Dataverse、连接器组成；按环境隔离，用解决方案做 ALM，在 Power Platform admin center 管理。

### Power Apps {#power-apps}
- zh: 低代码应用开发
- aliases: canvas app | canvas apps | model-driven app | model-driven apps
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/ai-overview
- see: power-platform | dataverse | generative-pages | agent-feed
- chapter: 06-business-ai/power-platform-ai

canvas app 是自由布局的画布应用；model-driven app 基于 Dataverse 表自动生成界面（Dynamics 365 的 Sales、Customer Service 等就是 model-driven app）。AI 功能：generative pages、agent feed、AI Builder、Copilot（旧的 canvas Copilot control 自 2026-02-02 不能加到新应用）。

### Power Automate {#power-automate}
- zh: 工作流自动化（cloud flow、desktop flow）
- aliases: cloud flow | cloud flows | desktop flow | desktop flows
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-automate/flow-types
- see: agent-flow | connector | logic-apps
- chapter: 01-maps/power-platform

cloud flows（automated / instant / scheduled）、desktop flows（RPA）、business process flows（Dataverse）。cloud flow 可以单向转换成 Copilot Studio 的 agent flow；computer use 的自带机器靠 Power Automate for desktop。

### Power Pages {#power-pages}
- zh: 低代码对外网站
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/admin/copilot/copilot-hub
- see: power-platform
- chapter: 01-maps/power-platform

Power Platform 的网站产品。Copilot hub 里有它的产品页；pac CLI 也管理它。

### Power Fx {#power-fx}
- zh: Power Platform 的公式语言
- exams: AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-variables-about
- see: variables | adaptive-card
- chapter: 04-copilot-studio/topics

类 Excel 公式的低代码语言。Copilot Studio 里用于变量赋值、条件、HTTP 请求体和动态生成 Adaptive Card。

### Dataverse {#dataverse}
- zh: Power Platform 的安全云数据库
- aliases: Microsoft Dataverse | Dataverse table | Dataverse search
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-intro
- see: environment | solution | knowledge-source
- chapter: 01-maps/power-platform

表、行、列（旧名 entity、record、field），标准表和自定义表；角色/行/列级安全和业务部门；业务规则、业务流程、插件。Dynamics 365 的客户互动类应用和 Copilot Studio 的 agent 都存在这里；作为 Copilot Studio 知识源每个源最多 15 张表，每个 agent 2 个源。

### Environment {#environment}
- zh: 环境：Power Platform 里存放和隔离数据、应用、流、agent 的空间
- aliases: environments | Power Platform environment | sandbox environment | production environment | default environment | developer environment
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/admin/environments-overview
- see: managed-environments | dataverse | solution | ppac
- chapter: 03-alm/environments

属于一个 Entra 租户，绑定地理区域，最多一个 Dataverse 数据库；资源只能连接同一环境里的东西。类型：Production、Sandbox（可复制/重置）、Default（每租户一个，管理有限）、Trial（30 天）、Developer、Dataverse for Teams。角色 Environment Admin / Environment Maker。

### Managed Environments {#managed-environments}
- zh: 给环境加上的一组高级管理能力（不是环境类型）
- aliases: managed environment
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-overview
- see: environment | pipelines | cmk
- chapter: 03-alm/environments

环境分组、限制共享、每周使用洞察、数据策略、pipelines（目标环境必须是 Managed）、maker 欢迎内容、解决方案检查器、IP 防火墙、CMK、Lockbox、扩展备份、App Insights 导出、目录、默认环境路由、VNet 支持。需要相应的独立许可证。

### Power Platform admin center {#ppac}
- zh: Power Platform 管理中心
- aliases: PPAC | Power Platform admin center
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/admin/environments-overview
- see: environment | dlp | copilot-hub | managed-environments
- chapter: 01-maps/power-platform

管理环境、数据策略、容量、Copilot hub、Managed Environments、环境路由、Agent access channels、生成式 AI 设置（跨区域数据移动）等的门户。

### Connector {#connector}
- zh: 连接器：对某个 API 的封装，带预制的触发器和动作
- aliases: connectors | Power Platform connector | Power Platform connectors | standard connector | premium connector
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/connectors/
- see: custom-connector | connection | dlp | copilot-connectors
- chapter: 01-maps/power-platform

Copilot Studio、Power Automate、Power Apps、Logic Apps 共用；分标准和高级（premium）；受数据策略分组管控。作为 Copilot Studio 工具时实时调用 API；作为"real-time 知识连接器"时只索引元数据、运行时查询。

### Custom connector {#custom-connector}
- zh: 自定义连接器：用 OpenAPI 定义自己的 API 封装
- aliases: custom connectors
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent
- see: connector | rest-api-tool | mcp
- chapter: 04-copilot-studio/tools

在 Power Apps 里从 OpenAPI 创建；Copilot Studio 里要当工具需要组织内的 view + share 权限；MCP 服务器也可以封装成带 `x-ms-agentic-protocol: mcp-streamable-1.0` 的自定义连接器。ALM 时要先于连接引用导入。

### Connection {#connection}
- zh: 连接：保存好的连接器认证凭据
- aliases: connections
- exams: AB-620
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-clu-integration
- see: connection-reference | connector
- chapter: 03-alm/env-vars
- nohl: true

例如 SharePoint 连接器的 OAuth 凭据。连接是环境特定的，所以导入 agent 后必须重新建立；解决方案里用连接引用来指向它。

### Connection reference {#connection-reference}
- zh: 连接引用：解决方案里指向某个连接的组件
- aliases: connection references
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-connection-reference
- see: connection | solution | environment-variable
- chapter: 03-alm/env-vars

导入或 pipeline 部署时在目标环境绑定到那里的连接，流和 agent 就不必改。自定义连接器要先导入。

### Environment variable {#environment-variable}
- zh: 环境变量：定义一次、每个环境取不同值的配置
- aliases: environment variables | secret environment variable
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-variables-about
- see: connection-reference | key-vault | solution
- chapter: 03-alm/env-vars

类型 Decimal number、JSON、Text、Yes/No、Data source、Secret（可引用 Azure Key Vault 的 secret，需要 Key Vault Secrets User 和 AllowedBots 标签）。Copilot Studio 里只读；值在发布时捕获，只有 secret 在运行时读取。

### Solution {#solution}
- zh: 解决方案：打包和搬运 Power Platform 定制内容的容器
- aliases: solutions | Dataverse solution
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/alm/solution-concepts-alm
- see: managed-solution | unmanaged-solution | publisher | solution-layers | pipelines
- chapter: 03-alm/solutions

ALM 的基本单位，组件包括表、列、应用、流、Copilot Studio agent、环境变量、连接引用、插件等；上限 95 MB；生命周期操作 Create、Update、Upgrade、Patch。每个 Copilot Studio agent 都住在某个解决方案里。

### Managed solution {#managed-solution}
- zh: 托管解决方案：部署到测试/生产的构建产物
- aliases: managed solutions
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/alm/solution-concepts-alm
- see: unmanaged-solution | solution-layers
- chapter: 03-alm/solutions

不能直接编辑，不能再导出，删除时连同它带来的定制和数据一起移除；不能导入到还有同名 unmanaged 源的环境。pipelines 和 Build Tools 导出的就是它。

### Unmanaged solution {#unmanaged-solution}
- zh: 非托管解决方案：开发中的源
- aliases: unmanaged solutions
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/alm/solution-concepts-alm
- see: managed-solution | solution
- chapter: 03-alm/solutions

在 dev 环境里编辑；导出成 unmanaged 进源代码控制，或导出成 managed 部署。删除它只删容器，组件留在环境里。

### Publisher {#publisher}
- zh: 发布者：解决方案的所有者，决定组件的前缀
- aliases: solution publisher | publisher prefix
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/alm/solution-concepts-alm
- see: solution
- chapter: 03-alm/solutions

组件架构名带发布者前缀（如 `contoso_`），用来避免命名冲突。ALM 金规则之一：用自己的发布者，别用默认的。

### Solution layers {#solution-layers}
- zh: 解决方案层：同一组件被多个解决方案叠加时的生效顺序
- aliases: unmanaged layer | remove unmanaged layer
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/alm/solution-concepts-alm
- see: managed-solution | solution
- chapter: 03-alm/solutions

多个 managed 层之上可以有一个 unmanaged 层，unmanaged 层永远在最上面生效。Copilot Studio 的解决方案页有 See solution layers › Remove unmanaged layer，用来让 managed 更新重新显现。

### Solution checker {#solution-checker}
- zh: 解决方案静态检查器
- aliases: Power Apps solution checker | quality check
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/alm/devops-build-tools
- see: solution | managed-environments
- chapter: 03-alm/solutions

Build Tools 和 GitHub Actions 的 Quality check 任务调用它；Managed Environments 可以强制执行。

### Application lifecycle management {#alm}
- zh: ALM：应用的治理、开发与维护全流程
- aliases: ALM
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/alm/overview-alm
- see: solution | pipelines | environment | build-tools
- chapter: 03-alm/what

Power Platform 的实现：每个环境都有 Dataverse，定制放进解决方案，源代码控制是真相，dev → test → prod，用 pipelines 或 Azure DevOps / GitHub 自动化。Copilot Studio 的 guidance 补充了几条金规则和"非 solution-aware 配置要手工补"的清单。

### Power Platform pipelines {#pipelines}
- zh: 产品内置的解决方案部署流水线
- aliases: pipelines | Power Platform Pipelines | deployment request | pipelines host
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/alm/pipelines
- see: solution | managed-environments | build-tools
- chapter: 03-alm/pipelines

管理员在 host 环境配置阶段；目标环境必须是 Managed Environments；maker 提交部署请求，系统导出 managed 包并预验证连接、连接引用和环境变量；可用 Power Automate 扩展（审批、委托部署、前置步骤）；命令行 `pac pipeline`。

### Power Platform CLI {#pac-cli}
- zh: pac：Power Platform 的开发者命令行
- aliases: pac CLI | pac
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction
- see: build-tools | github-actions
- chapter: 03-alm/code-first

管认证配置文件、环境、Dataverse、解决方案打包/解包、Power Pages、代码组件；`pac auth create`、`pac admin create-service-principal`、`pac pipeline`。Build Tools v2 建在它上面。

### Power Platform Build Tools {#build-tools}
- zh: Azure DevOps 里的 Power Platform 任务扩展
- aliases: Build Tools | Azure DevOps Build Tools
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/alm/devops-build-tools
- see: pac-cli | github-actions | azure-devops
- chapter: 03-alm/code-first

v2.0 基于 pac CLI；任务分 Helper、Quality check、Solution（export/import/pack/unpack）、Environment management；服务连接用服务主体 + application user，推荐 Workload Identity Federation。

### GitHub Actions for Power Platform {#github-actions}
- zh: GitHub 上的 Power Platform 自动化动作集
- aliases: GitHub Actions | powerplatform-actions
- exams: AB-620 | AB-100 | AI-500
- ref: https://learn.microsoft.com/en-us/power-platform/alm/devops-github-actions
- see: build-tools | pac-cli
- chapter: 03-alm/code-first

导入导出解决方案（含 Copilot Studio agent、AI Builder 模型、连接器）、创建删除环境、解决方案检查；认证用用户名密码（不能开 MFA）或服务主体 + client secret。

### AI Builder {#ai-builder}
- zh: Power Platform 的低代码 AI 模型
- aliases: AI Builder credits | prebuilt model | document processing model
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/ai-builder/model-types
- see: prompt-builder | document-intelligence
- chapter: 06-business-ai/power-platform-ai

预构建模型（名片、OCR、收据、发票、身份证件、合同、text generation、实体抽取、关键短语、语言检测、情感、翻译、图像描述）和自定义模型（document processing、category classification、entity extraction、prediction、object detection）；在 Power Apps 和 Power Automate 里使用，消耗 AI Builder credits。

### Prompts (Prompt builder) {#prompt-builder}
- zh: 可复用的自然语言提示，带输入变量和 Dataverse 知识
- aliases: Prompt builder | prompt action | prompt actions
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/prompts-overview
- see: prompt-tool | ai-builder
- chapter: 04-copilot-studio/tools

模型来自 Foundry；在 Copilot Studio 当工具、在流里当节点、在应用里调用；需要 Copilot Credits 和 Dataverse。AB-100 的 "prompt actions" 指的就是它。

### Copilot hub {#copilot-hub}
- zh: PPAC 里的 Copilot 区域：用量、成本、设置与 agent 部署
- aliases: Copilot area | AI hub
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/admin/copilot/copilot-hub
- see: ppac | copilot-credits
- chapter: 06-business-ai/power-platform-ai

Get started、What's new、Settings（按产品分组，可按环境组设规则）、产品页：Copilot Studio（credit 消耗、活跃 agent、会话成功率）、Power Apps、Power Pages、Dynamics 365 Sales（AI Agents / Copilot 开关）、Dynamics 365（agent deployment wizard）。AB-100 题目里的 "AI hub" 指它。

### Generative pages {#generative-pages}
- zh: 用自然语言生成 model-driven app 页面（React 代码）
- aliases: generative page | code-first pages
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/generative-pages
- see: power-apps | agent-feed
- chapter: 06-business-ai/power-platform-ai

描述页面、引用最多 6 张 Dataverse 表（连接器和自定义 API 为预览）、可附图，生成前端和业务逻辑的 React 代码；solution-aware，可嵌入表单；推荐用 AI 编码工具 + pac CLI 的 code-first 流程。

### Agent feed {#agent-feed}
- zh: model-driven app 里让人审核 agent 任务的信息流（预览）
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/power-apps/user/supervise-agents-with-agent-feed
- see: generative-pages | mcp
- chapter: 06-business-ai/power-platform-ai

站点地图顶部，Needs Attention / Completed 两区，展示 agent 生成的可操作任务供人验证和完成；2026-05-01 起只支持使用 Power Apps MCP server 的 agent。

### Adaptive Card {#adaptive-card}
- zh: 用 JSON 描述、由宿主应用渲染的卡片式 UI
- aliases: Adaptive Cards | adaptive cards
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/adaptive-cards/
- see: topic | power-fx
- chapter: 04-copilot-studio/topics

开放的卡片交换格式：作者管内容，宿主（Teams、Outlook、Web Chat…）管外观。Copilot Studio 的 Message/Question 节点可发卡片，Ask with Adaptive Card 节点用卡片收集输入（schema 最高 1.6，Teams 1.5），工具的 After running 也可以 Send an adaptive card。

### Microsoft Fabric {#fabric}
- zh: SaaS 形式的端到端数据分析平台
- aliases: Fabric | Fabric IQ
- exams: AB-100 | AB-620 | AI-103
- ref: https://learn.microsoft.com/en-us/fabric/fundamentals/microsoft-fabric-overview
- see: onelake | lakehouse | fabric-data-agent
- chapter: 01-maps/fabric

数据接入、转换、实时流、分析和报表在一个产品里；工作负载 Power BI、Databases（镜像）、Data Factory、Real-Time Intelligence、Data Engineering、Data Science、Data Warehouse，以及预览中的 Fabric IQ（本体、Fabric Graph、data agent）。

### OneLake {#onelake}
- zh: Fabric 里每个租户一个的统一逻辑数据湖
- exams: AB-100 | AI-103
- ref: https://learn.microsoft.com/en-us/fabric/fundamentals/microsoft-fabric-overview
- see: fabric | lakehouse
- chapter: 01-maps/fabric

建在 Azure Data Lake Storage Gen2 上，支持 shortcuts 零拷贝引用 ADLS、S3、GCS 的数据。Azure AI Search 的 indexer 可以把它当数据源。

### Lakehouse {#lakehouse}
- zh: Fabric 工作区里像数据库一样组织文件和表的对象
- aliases: lakehouses | warehouse
- exams: AB-100 | AI-103
- ref: https://learn.microsoft.com/en-us/fabric/fundamentals/microsoft-fabric-overview
- see: fabric | onelake | fabric-data-agent
- chapter: 01-maps/fabric

"一组文件、文件夹和表，作为数据湖之上的数据库"。Fabric data agent 可以查询 lakehouse、warehouse、Power BI 语义模型和 KQL 数据库。

### Fabric data agent {#fabric-data-agent}
- zh: 用自然语言查询 Fabric 数据的 agent
- aliases: Fabric Data agent | data agent
- exams: AB-620 | AB-100 | AI-103
- ref: https://learn.microsoft.com/en-us/fabric/data-science/concept-data-agent
- see: fabric | lakehouse | connected-agent
- chapter: 04-copilot-studio/multi-agent

把问题翻译成 SQL / DAX / KQL（只读），最多 5 个数据源，可配指令和示例查询；可被 Copilot Studio（预览，连接 agent）、Foundry、Microsoft 365 Copilot、Teams 调用；在 Copilot Studio 里不能从主题 redirect 到它，Microsoft Copilot 渠道不可用。
