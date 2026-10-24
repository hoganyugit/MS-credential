# 术语表 · Azure 基础、身份与安全

### Azure {#azure}
- zh: 微软的公有云平台
- aliases: Microsoft Azure
- exams: AI-103 | AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview
- chapter: 01-maps/azure
- nohl: true

微软的云平台，提供计算、存储、网络、数据库和 AI 服务。资源按 management group → subscription → resource group → resource 四层组织，由 Azure Resource Manager 统一管理。

### Subscription {#subscription}
- zh: 订阅：Azure 里计费和配额的边界
- aliases: Azure subscription | subscriptions
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview
- see: resource-group | quota
- chapter: 01-maps/azure

一个订阅对应一份账单和一组配额，里面装资源组。Azure OpenAI 的配额按订阅、区域、模型和部署类型分配；在订阅作用域分配的角色会被下面所有资源继承。

### Resource group {#resource-group}
- zh: 资源组：装一组生命周期相同的资源的容器
- aliases: resource groups
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview
- see: subscription | arm
- chapter: 01-maps/azure

Azure 资源的逻辑容器，每个资源恰好属于一个资源组；资源组本身有一个位置（存元数据）。常用来一起部署、一起删除、一起授权。

### Azure Resource Manager {#arm}
- zh: Azure 的部署与管理层（ARM）
- aliases: ARM | ARM template | Resource Manager
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview
- see: bicep | resource-group
- chapter: 01-maps/azure

门户、CLI、SDK 对 Azure 的所有请求都经过它。ARM template 是用 JSON 声明式描述资源的模板；Bicep 是更易读的等价语言。资源提供程序（如 `Microsoft.CognitiveServices`）定义资源类型。

### Bicep {#bicep}
- zh: Azure 的基础设施即代码语言
- exams: AI-103 | AI-500
- ref: https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview
- see: arm
- chapter: 01-maps/azure

声明式地描述要创建的 Azure 资源，比 JSON 的 ARM template 简洁，部署时编译成 ARM。Foundry 资源的"with security controls"和"standard setup for agents"都有 Bicep / Terraform 快速入门。

### Region {#region}
- zh: 区域：资源所在的 Azure 数据中心地理位置
- aliases: Azure region | regions
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource
- see: data-residency | deployment-types
- chapter: 01-maps/azure
- nohl: true

创建资源时选的位置（如 East US、Sweden Central）。部分 AI 功能只在特定区域提供；Foundry 的部署类型用 Global / Data Zone / Regional 区分推理在哪里处理。

### Azure portal {#azure-portal}
- zh: Azure 门户（portal.azure.com）
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource
- see: azure-cli
- chapter: 01-maps/azure

图形化管理界面。Foundry 资源在门户里列在 Foundry 分类下，Access control (IAM) 页做角色分配，Keys and Endpoint 页看密钥。AI 开发则用 ai.azure.com 的 Foundry 门户。

### Azure CLI {#azure-cli}
- zh: Azure 命令行工具（az 命令）
- aliases: az cli | Azure PowerShell
- exams: AI-103
- ref: https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource
- see: azure-portal
- chapter: 01-maps/azure

脚本化管理 Azure 的工具。例如 `az cognitiveservices account create --kind AIServices --sku S0` 创建 Foundry 资源，`az role assignment create` 分配角色。Azure PowerShell 是等价的 PowerShell 模块。

### Microsoft Entra ID {#entra-id}
- zh: 微软的云身份与访问管理服务（原 Azure Active Directory）
- aliases: Entra ID | Azure AD | Azure Active Directory | Microsoft Entra
- exams: AB-620 | AB-100 | AI-103
- ref: https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra
- see: tenant | conditional-access | service-principal | managed-identity
- chapter: 02-identity-security/entra

登记用户、组、应用、设备和 agent 的身份，负责登录和发令牌。每个 Microsoft 365 / Azure / Dynamics 365 租户自动就是一个 Entra 租户。Entra 还是一个产品家族：ID Governance、ID Protection、External ID、Workload ID、Agent ID 等。

### Tenant {#tenant}
- zh: 租户：一个组织在微软云里的专属实例
- aliases: Entra tenant | tenants
- exams: AB-620 | AB-100 | AI-103
- ref: https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra
- see: entra-id | environment
- chapter: 02-identity-security/entra

组织的身份和订阅边界，初始域名形如 `contoso.onmicrosoft.com`。Power Platform 的环境、Copilot Credits 的汇集、Microsoft 365 Copilot 的许可都以租户为单位。

### App registration {#app-registration}
- zh: 应用注册：在 Entra 里登记一个应用，得到 client ID 和凭据
- aliases: application registration | application object | client ID
- exams: AB-620 | AI-103
- ref: https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals
- see: service-principal | oauth
- chapter: 02-identity-security/identities

注册产生一个全局的 application object（有 application/client ID），凭据是 client secret 或证书。Copilot Studio 的手动认证（Entra ID V2）、自定义连接器的 OAuth、流水线的服务主体都从这里开始。

### Service principal {#service-principal}
- zh: 服务主体：应用在某个租户里的本地身份
- aliases: service principals | enterprise application
- exams: AB-620 | AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals
- see: app-registration | managed-identity | role-assignment
- chapter: 02-identity-security/identities

角色和权限分配给它而不是给 application object。三种：Application（来自应用注册）、Managed identity、Legacy。CI/CD 流水线、脚本、agent 的身份都是服务主体。

### Managed identity {#managed-identity}
- zh: 托管标识：Azure 自动维护、无需保管密码的身份
- aliases: managed identities | system-assigned managed identity | user-assigned managed identity
- exams: AI-103 | AB-100 | AI-500
- ref: https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview
- see: service-principal | keyless-auth | rbac
- chapter: 02-identity-security/identities

给 Azure 资源用的服务主体，免费、没有需要轮换的凭据。system-assigned 随资源创建和删除、不能共享；user-assigned 是独立资源、可挂到多个资源上（官方推荐）。用 RBAC 给它授权，例如让 Foundry 资源读 Blob Storage。

### OAuth 2.0 flows {#oauth}
- zh: OAuth 2.0 授权流程（授权码、客户端凭据、代表流）
- aliases: OAuth 2.0 | OAuth | OpenID Connect | authorization code flow | client credentials flow | on-behalf-of flow | OBO
- exams: AB-620 | AI-103 | AI-500
- ref: https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow
- see: app-registration | agent-id
- chapter: 02-identity-security/identities

Microsoft identity platform 的三种常考流程：authorization code（有用户在场，建议配 PKCE）、client credentials（无用户，服务用自己的凭据，对应 application permissions，需管理员同意）、on-behalf-of（API 替用户调下游 API，只能用 delegated 权限）。

### Microsoft Entra Agent ID {#agent-id}
- zh: Entra 给 AI agent 的身份与安全框架
- aliases: Agent ID | agent identity
- exams: AB-100 | AB-620 | AI-103 | AI-500
- ref: https://learn.microsoft.com/en-us/entra/agent-id/what-is-microsoft-entra-agent-id
- see: agent-365 | entra-id | conditional-access
- chapter: 02-identity-security/identities

把身份管理、访问保护和治理延伸到 agent。agent identity 是 agent 认证用的主身份（无自有凭据、单租户、有 sponsor）；agent identity blueprint 是一个或多个 agent identity 的模板和凭据持有者。交互式 agent 用 delegated / OBO，自主 agent 用 client credentials。Agent 365 用它给每个 agent 一个独立身份。

### Azure RBAC {#rbac}
- zh: 基于角色的访问控制：谁能对哪个作用域做什么
- aliases: RBAC | role-based access control
- exams: AI-103 | AB-100 | AB-620 | AI-500
- ref: https://learn.microsoft.com/en-us/azure/role-based-access-control/overview
- see: role-assignment | foundry-roles | keyless-auth
- chapter: 02-identity-security/rbac

角色分配 = 安全主体 + 角色定义 + 作用域。内置角色 Owner / Contributor / Reader 只有控制平面权限（Actions）；读 blob、调模型这类数据平面操作要有 DataActions 的角色（如 Foundry User、Storage Blob Data Reader）。只在用 Entra ID 认证时生效。

### Role assignment {#role-assignment}
- zh: 角色分配：把某个角色在某个作用域授予某个主体
- aliases: role assignments
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/role-based-access-control/overview
- see: rbac
- chapter: 02-identity-security/rbac

在 Azure 门户的 Access control (IAM) 或 `az role assignment create` 完成。作用域可以是管理组、订阅、资源组、资源，Foundry 还支持 project 和单个 agent。角色是叠加的，上层分配向下继承。

### Foundry roles {#foundry-roles}
- zh: Foundry 的内置角色（Foundry User / Project Manager / Account Owner / Owner / Agent Consumer）
- aliases: Foundry User | Foundry Owner | Foundry Account Owner | Foundry Project Manager | Foundry Agent Consumer | Azure AI User | Azure AI Developer
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry
- see: rbac
- chapter: 02-identity-security/rbac

Foundry User = 在 project 里开发（数据平面）+ 只读，开发者最小权限；Project Manager = 管理 project 并可把 Foundry User 分给别人，发布 agent 的最低要求；Account Owner = 建账户/project、管模型、分角色，无数据平面；Owner = 全部；Agent Consumer = 只能调 agent endpoint。旧名 Azure AI User 等，角色 ID 不变。不要用 Azure AI Developer（那是 AML / hub 的角色）。

### API key {#api-key}
- zh: 资源密钥：用请求头传的访问凭据
- aliases: API keys | subscription key | Ocp-Apim-Subscription-Key | KEY1 | local authentication
- exams: AI-103 | AB-620 | AI-500
- ref: https://learn.microsoft.com/en-us/azure/ai-services/authentication
- see: keyless-auth | key-vault
- chapter: 02-identity-security/keyless

每个 Foundry Tools 资源有两个密钥（KEY1 / KEY2，可轮换），放在 `Ocp-Apim-Subscription-Key` 头里。拿到密钥等于完全访问且绕过 RBAC，官方只建议原型使用；生产环境应改用 Entra ID 令牌并禁用本地认证。

### Keyless authentication {#keyless-auth}
- zh: 无密钥认证：用 Entra ID 令牌而不是 API key
- aliases: keyless | Entra ID authentication | bearer token | DefaultAzureCredential | disable local auth
- exams: AI-103 | AB-100 | AI-500
- ref: https://learn.microsoft.com/en-us/azure/foundry/concepts/authentication-authorization-foundry
- see: api-key | managed-identity | rbac
- chapter: 02-identity-security/keyless

请求带 `Authorization: Bearer <token>`，令牌由 Entra 签发（Foundry 作用域 `https://ai.azure.com/.default`），代码里用 `DefaultAzureCredential`。需要资源的自定义子域名。Agent Service、评估、最小权限 RBAC、托管标识都要求它；官方建议所有调用方迁移后禁用本地认证（密钥）。

### Azure Key Vault {#key-vault}
- zh: 保管 secrets、密钥和证书的服务
- aliases: Key Vault
- exams: AB-620 | AI-103 | AB-100 | AI-500
- ref: https://learn.microsoft.com/en-us/azure/key-vault/general/overview
- see: environment-variable | cmk | api-key
- chapter: 02-identity-security/keyless

三类对象：secrets（令牌、密码、API key、连接字符串）、keys（加密密钥）、certificates。Standard 层软件保护，Premium 层 HSM。Power Platform 的 secret 类型环境变量和 Copilot Studio 的 computer use 凭据可以引用它；CMK 用它保管客户管理的密钥。

### Conditional Access {#conditional-access}
- zh: 条件访问：Entra 的 Zero Trust 策略引擎
- aliases: conditional access policy | Zero Trust
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview
- see: entra-id | agent-id
- chapter: 02-identity-security/conditional-access

"if-then" 策略，在第一因素认证后执行：信号（用户/组/agent、位置、设备、应用、风险）→ 决策（阻止，或要求 MFA、合规设备、认证强度等）。需要 Entra ID P1，基于风险的策略需要 P2。Zero Trust 三原则：显式验证、最小权限、假定已被入侵。

### Virtual Network {#vnet}
- zh: 虚拟网络：Azure 里的私有网络
- aliases: VNet | virtual networks | subnet | network security group | NSG
- exams: AI-103 | AB-100 | AI-500
- ref: https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview
- see: private-endpoint
- chapter: 02-identity-security/network

Azure 私有网络的基本单位：子网、网络安全组、路由表、VPN / ExpressRoute 连本地、对等互连。Foundry 的 Selected networks 选项和 Agent Service 的 BYO VNet 都基于它。

### Private endpoint {#private-endpoint}
- zh: 私有终结点：通过 Private Link 在 VNet 里访问 PaaS 服务
- aliases: Private Link | private endpoints | Azure Private Link
- exams: AI-103 | AB-100 | AI-500
- ref: https://learn.microsoft.com/en-us/azure/private-link/private-link-overview
- see: vnet
- chapter: 02-identity-security/network

给某个 PaaS 实例（Storage、AI Search、Foundry 资源…）在你的 VNet 里分配私有 IP，流量走微软骨干网不经公网；一个 endpoint 只映射到一个实例，顺带防止数据流向别的账户。Foundry 资源的 Network 选 Disabled 后只能这样访问。

### Azure Policy {#azure-policy}
- zh: 约束资源状态的策略服务
- aliases: policy definition | policy assignment | allowed locations
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/governance/policy/overview
- see: rbac
- chapter: 02-identity-security/data-protection

策略定义（JSON）组成 initiative，分配到管理组/订阅/资源组/资源；效果 deny、audit、modify、deployIfNotExists；内置如 Allowed Locations。和 RBAC 的区别：Policy 管资源能长什么样，RBAC 管谁能做什么。

### Microsoft Purview {#purview}
- zh: 数据安全、治理与合规平台（含 AI 治理）
- aliases: Purview | DSPM for AI | sensitivity labels | Information Protection | eDiscovery
- exams: AB-100 | AB-620 | AI-103
- ref: https://learn.microsoft.com/en-us/purview/purview
- see: dlp | data-residency
- chapter: 02-identity-security/data-protection

DLP、敏感度标签（Information Protection）、Insider Risk、Audit（统一审计日志，含 Copilot 的提示和回答）、eDiscovery、Data Lifecycle、Compliance Manager、Data Map / Unified Catalog。DSPM for AI 是 AI 应用和 agent 治理的入口；Copilot Studio 属于 "Copilot experiences and agents" 一类，只对 SharePoint 知识强制标签加密。

### Data policy (DLP) {#dlp}
- zh: Power Platform 数据策略：按连接器分组限制数据流动
- aliases: DLP | data loss prevention | data policies | DLP policy | business connectors | non-business connectors | blocked connectors
- exams: AB-620 | AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention
- see: connector | ppac | purview
- chapter: 02-identity-security/data-protection

在 PPAC 定义：连接器分 Business / Non-business / Blocked，同一个应用、流或 agent 不能混用不同组；设计时和运行时都强制，违规的被挂起。"虚拟连接器"用来管 Copilot Studio 的功能（HTTP 请求、知识、渠道、Application Insights、触发器…），MCP 连接器同样受管。Purview 里也有自己的 DLP，别混淆。

### Customer-managed key {#cmk}
- zh: 客户管理的密钥：用自己的 Key Vault 密钥加密 Power Platform 数据
- aliases: CMK | customer-managed keys | Microsoft-managed key
- exams: AB-100 | AB-620
- ref: https://learn.microsoft.com/en-us/power-platform/admin/customer-managed-key
- see: key-vault | managed-environments | lockbox
- chapter: 02-identity-security/data-protection

默认用微软管理的密钥；CMK 需要 Power Platform enterprise policy + 托管标识 + Key Vault Crypto Service Encryption User，只支持 Managed Environments，吊销密钥即可锁住环境；复制/还原只能在同一 CMK 环境之间。Copilot in canvas apps 在 CMK / Lockbox 环境里不可用。Foundry 资源也有 CMK（Encryption 选项卡）。

### Customer Lockbox {#lockbox}
- zh: 微软工程师访问你的数据前必须经你批准
- aliases: Lockbox
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-overview
- see: cmk | managed-environments
- chapter: 02-identity-security/data-protection

Managed Environments 的功能之一。和 CMK 一样，开启后 canvas app 里的旧版 Copilot control 不可用。

### Microsoft Defender for Cloud {#defender-for-cloud}
- zh: 云安全态势管理与工作负载保护
- aliases: Defender for Cloud | Microsoft Defender | AI threat protection
- exams: AB-100 | AI-103
- ref: https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction
- see: sentinel | purview
- chapter: 02-identity-security/data-protection

CNAPP：态势管理（secure score、合规）+ DevSecOps + 工作负载保护；有 AI 安全态势（AI 物料清单）和 AI 威胁保护。Foundry 门户的 Risks + alerts 页显示它的告警。Defender for Cloud Apps 是另一个产品（SaaS 应用安全，也是 Conditional Access 的信号源）。

### Microsoft Sentinel {#sentinel}
- zh: 云原生 SIEM + SOAR
- aliases: Sentinel
- exams: AB-100
- ref: https://learn.microsoft.com/en-us/azure/sentinel/overview
- see: defender-for-cloud
- chapter: 02-identity-security/data-protection

收集安全数据（数据连接器），分析规则生成事件，自动化规则和 playbook（基于 Logic Apps）响应。Copilot Studio 的审计日志可以送到它。已并入 Defender 门户。

### Data residency {#data-residency}
- zh: 数据驻留：数据存储和处理所在的地理范围
- aliases: data movement across regions | EU Data Boundary | data zone | cross-region
- exams: AB-100 | AI-103 | AB-620
- ref: https://learn.microsoft.com/en-us/power-platform/admin/geographical-availability-copilot
- see: deployment-types | region | cmk
- chapter: 06-business-ai/data

Power Platform 环境绑定区域；"Move data across regions for Copilots, AI agents, and generative AI features" 允许提示和结果在本地无模型、容量溢出或故障时送到托管区域（不持久化、不可逆）。Foundry 的部署类型分 Global / Data Zone（US、EU、APAC）/ Regional；Microsoft 365 Copilot 有 EU Data Boundary。

### Azure Monitor {#azure-monitor}
- zh: Azure 的统一可观测性服务
- aliases: Log Analytics | Log Analytics workspace | KQL | Kusto Query Language
- exams: AI-103 | AB-620 | AB-100 | AI-500
- ref: https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview
- see: application-insights
- chapter: 05-azure-ai/azure-services

指标、日志、追踪；日志和追踪存在 Log Analytics workspace，用 KQL 查询；告警和 action groups；workbooks / Grafana 可视化。Application Insights 是其中的 APM 功能。

### Application Insights {#application-insights}
- zh: Azure Monitor 的应用性能监控（APM），agent 遥测的落点
- aliases: App Insights | connection string | customEvents | OpenTelemetry
- exams: AB-620 | AI-103 | AB-100 | AI-500
- ref: https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview
- see: azure-monitor | tracing | telemetry
- chapter: 04-copilot-studio/analytics

基于 OpenTelemetry 的 APM；Copilot Studio 的 agent 级遥测通过 connection string 写入 `customEvents` 表，Foundry 的 tracing 和监控仪表板也存在这里。用 KQL 查询，可设告警。

### Azure Functions {#azure-functions}
- zh: 无服务器函数计算
- aliases: Functions | Azure Function | Durable Functions
- exams: AI-103 | AB-100 | AI-500
- ref: https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview
- see: logic-apps | skill
- chapter: 05-azure-ai/azure-services

事件驱动的代码，通过 triggers 和 bindings 连接服务；托管计划 Flex Consumption（推荐）、Premium、Dedicated、Container Apps、Consumption（旧）。AI-103 里常作为 Azure AI Search 的自定义技能（Web API）或 Foundry agent 的工具。

### Azure Logic Apps {#logic-apps}
- zh: 低代码集成工作流服务
- aliases: Logic Apps | logic app
- exams: AI-103 | AB-100 | AI-500
- ref: https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-overview
- see: azure-functions | power-automate
- chapter: 05-azure-ai/azure-services

触发器 + 动作 + 1,400 多个连接器。Consumption（多租户、按执行付费）vs Standard（单租户、有状态/无状态工作流、VNet）。现在也能做 agentic workflows，并作为 Foundry agent 的工具；Power Automate 是面向公民开发者的同类产品。

### Azure Cosmos DB {#cosmos-db}
- zh: 全托管 NoSQL + 向量数据库
- aliases: Cosmos DB
- exams: AI-103 | AI-500
- ref: https://learn.microsoft.com/en-us/azure/cosmos-db/overview
- see: blob-storage | vector-search
- chapter: 05-azure-ai/azure-services

毫秒级延迟、多区域写、吞吐按 RU/s（可自动扩缩或无服务器），内置向量和混合相似度搜索（DiskANN）。Foundry 的 "standard setup for agents" 用它存 agent 线程。

### Azure Blob Storage {#blob-storage}
- zh: 对象存储：storage account → container → blob
- aliases: Blob Storage | blob | storage account | Azure Storage
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction
- see: indexer | cosmos-db
- chapter: 05-azure-ai/azure-services

存放非结构化数据：block blob（一般文件）、append blob（日志）、page blob（随机访问）。AI Search 的 indexer 数据源、文档翻译的输入输出、Foundry 的 BYO 存储都用它；访问权限常用 Storage Blob Data Reader 角色。

### Azure Kubernetes Service {#aks}
- zh: 托管的 Kubernetes 服务
- aliases: AKS
- exams: AI-103 | AI-500
- ref: https://learn.microsoft.com/en-us/azure/aks/what-is-aks
- see: aci | containers
- chapter: 05-azure-ai/azure-services

Azure 管控制平面（免费），你付节点费用；AKS Automatic（推荐，大量自动化）或 AKS Standard（完全控制）。跑 Foundry Tools 容器的常见选项。

### Azure Container Instances {#aci}
- zh: 不管虚拟机、直接运行容器的最简单方式
- aliases: ACI | Container Instances | Azure Container Apps | Container Apps
- exams: AI-103 | AI-500
- ref: https://learn.microsoft.com/en-us/azure/container-instances/container-instances-overview
- see: aks | containers
- chapter: 05-azure-ai/azure-services

按秒计费的容器组，适合单个容器或突发任务。Azure Container Apps 则是无服务器容器平台（可缩到零，KEDA 扩缩，支持 Dapr 和 jobs）；Foundry 的 code interpreter 沙箱就是 Container Apps dynamic sessions。

### Azure Machine Learning {#azure-machine-learning}
- zh: 训练、部署和管理机器学习模型的平台
- aliases: Azure ML | AML | AutoML | automated machine learning | prompt flow
- exams: AI-103 | AB-100
- ref: https://learn.microsoft.com/en-us/azure/machine-learning/overview-what-is-azure-machine-learning
- see: hub-based-project | fine-tuning
- chapter: 05-azure-ai/azure-services

workspace、studio、designer（无代码）、Automated ML、managed endpoints、MLOps。AB-100 "自定义 AI 模型"的传统答案；Foundry 的 hub-based project 就建在它上面。Prompt flow 定于 2027-04-20 退役，迁移目标是 Microsoft Agent Framework。

### Azure DevOps {#azure-devops}
- zh: 微软的开发协作平台（Boards、Repos、Pipelines…）
- aliases: Azure Pipelines | Azure Repos | Azure Boards
- exams: AB-620 | AB-100 | AI-103 | AI-500
- ref: https://learn.microsoft.com/en-us/azure/devops/user-guide/what-is-azure-devops
- see: build-tools | github-actions
- chapter: 03-alm/code-first

Boards、Repos（Git 或 TFVC）、Pipelines（CI/CD）、Test Plans、Artifacts。Power Platform Build Tools 是它的扩展；Foundry 的 `azd pipeline config` 也能生成 Azure Pipelines 定义。
