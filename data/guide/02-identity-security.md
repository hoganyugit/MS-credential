---
id: 02-identity-security
title: 身份与安全：Entra ID、RBAC、密钥与数据保护
short: 身份与安全
intro: "谁能访问什么"在微软世界里由 Microsoft Entra ID 回答，"怎么访问"由密钥或令牌回答，"访问时受什么约束"由 RBAC、DLP、网络隔离和合规工具回答。四门考试都会考这些。
exams: AB-620 | AB-100 | AI-103 | AI-500
practice:
  ab-620: Security, authentication & governance
  ab-100: Governance, security & compliance
  ai-103: Planning & managing Azure AI solutions
  ai-500: Identity, access & secrets | Guardrails & safety
---
先建立一张总图：**身份（identity）**是"你是谁"，**认证（authentication）**是"证明你是谁"，**授权（authorization）**是"你被允许做什么"。微软把这三件事分别交给 [[entra-id|Microsoft Entra ID]]、令牌/密钥、以及 [[rbac|RBAC]] 等授权机制。

```diagram
{"type":"layers","title":"从用户到资源的访问链","layers":[
{"label":"身份","boxes":[{"t":"用户","s":"Entra ID 里的人"},{"t":"服务主体","s":"应用注册后在租户里的身份"},{"t":"托管标识","s":"Azure 资源自带的身份，无需管密码"},{"t":"Agent 身份","s":"Entra Agent ID"}]},
{"label":"认证","boxes":[{"t":"Entra ID 令牌","s":"OAuth 2.0 / OpenID Connect（推荐）"},{"t":"API key","s":"资源的密钥，只适合原型"}]},
{"label":"授权","boxes":[{"t":"Azure RBAC","s":"角色 × 作用域"},{"t":"Conditional Access","s":"条件策略"},{"t":"DLP / 数据策略","s":"连接器能不能一起用"}]},
{"label":"资源","boxes":[{"t":"Foundry、AI Search、Key Vault、Dataverse、SharePoint…"}]}
],"arrows":["拿令牌","检查权限","访问"]}
```

## 租户与 Microsoft Entra ID {#entra}

**[[entra-id|Microsoft Entra ID]]**（旧称 Azure Active Directory、Azure AD）是微软的云身份与访问管理服务。你的组织在微软云里的"一户人家"叫 **[[tenant|租户（tenant）]]**：每个 Microsoft 365、Azure、Dynamics 365 租户自动就是一个 Entra 租户，初始域名形如 `contoso.onmicrosoft.com`。用户、组、应用、设备、agent 的身份都登记在这里；管理门户是 entra.microsoft.com；开发者通过 **Microsoft identity platform** 和 Microsoft Graph 使用它。

Entra 是一个产品家族，考试里偶尔点名的成员：

- **Entra ID Governance**：身份生命周期和访问审查。
- **Entra ID Protection**：风险检测（登录风险、用户风险），给 [[conditional-access|Conditional Access]] 提供信号。
- **Entra External ID**：对外部用户（B2B 合作伙伴、消费者 CIAM）的身份。
- **Entra Workload ID**：给应用和服务的身份。
- **[[agent-id|Entra Agent ID]]**：给 AI agent 的身份（见下节）。

来源：[What is Microsoft Entra](https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra)。

## 应用注册、服务主体、托管标识 {#identities}

程序也需要身份。这里有三个经常混淆的词：

| 词 | 是什么 | 什么时候用 |
|---|---|---|
| [[app-registration|应用注册（app registration）]] | 在 Entra 里登记一个应用，产生一个全局的 **application object**（有 application/client ID）和它的凭据（client secret 或证书） | 你写的程序要调用 Microsoft Graph、Dataverse 或自己的 API |
| [[service-principal|服务主体（service principal）]] | 应用在**某个租户**里的本地身份；在门户的 Enterprise applications 页可见；角色就分配给它 | 给 CI/CD 流水线、脚本、第三方应用授权 |
| [[managed-identity|托管标识（managed identity）]] | Azure 自动为资源创建并维护的服务主体，**没有需要保管的密码**，免费 | 让 Foundry 资源访问 Storage、Key Vault、AI Search，或让 Function 访问数据库 |

托管标识分两种：**system-assigned**（跟随资源创建和删除，不能共享，名字等于资源名）和 **user-assigned**（独立的 Azure 资源，可以同时挂到多个资源上，官方更推荐）。无论哪种，给它授权的方法都是 Azure RBAC 角色分配。

### OAuth 2.0 三种常见流程 {#oauth}

Microsoft identity platform 实现 OAuth 2.0 和 OpenID Connect。题目里会用流程名区分场景：

- **[[oauth|Authorization code flow]]**：有用户在场（网页、移动应用、SPA），用户登录后应用拿到 access token，建议搭配 PKCE。
- **Client credentials flow**：没有用户，服务用自己的凭据（secret、证书或联合凭据）登录——守护进程、流水线、自动化 agent 用这个；对应 **application permissions**，需要管理员同意。
- **On-behalf-of (OBO) flow**：API 替用户去调另一个 API，用用户的令牌换下游令牌；只能用 delegated 权限。

### Agent 的身份 {#agent-identity}

**[[agent-id|Microsoft Entra Agent ID]]** 把 Entra 的身份管理、访问保护、治理延伸到 AI agent。核心对象：**agent identity**（agent 用来认证和访问资源的主身份，没有自己的凭据，单租户，有一个 sponsor）和 **agent identity blueprint**（一个或多个 agent identity 的模板和认证基础，持有凭据，可以多租户）。交互式 agent 用 delegated 权限 / OBO，自主 agent 用 client credentials。[[agent-365|Microsoft Agent 365]] 就是用 Entra Agent ID 给每个 agent 一个独立身份（service principal 类型为 ServiceIdentity），再叠加 Conditional Access、Purview 和 Defender。

来源：[Application and service principal objects](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals)、[Managed identities overview](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview)、[Authorization code flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)、[Client credentials flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-client-creds-grant-flow)、[On-behalf-of flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-on-behalf-of-flow)、[What is Microsoft Entra Agent ID](https://learn.microsoft.com/en-us/entra/agent-id/what-is-microsoft-entra-agent-id)、[Agent ID key concepts](https://learn.microsoft.com/en-us/entra/agent-id/key-concepts)、[Agent 365 identity](https://learn.microsoft.com/en-us/microsoft-agent-365/developer/identity)。

## Azure RBAC 与 Foundry 的角色 {#rbac}

**[[rbac|Azure RBAC]]**（role-based access control）回答"谁能对哪个资源做什么"。一次**角色分配（[[role-assignment|role assignment]]）**= 安全主体（用户、组、服务主体、托管标识）+ 角色定义 + 作用域（管理组 / 订阅 / 资源组 / 资源）。角色是叠加的；上层分配向下继承。内置角色里最常见的三个：**Owner**（全部权限 + 能分配角色）、**Contributor**（能创建和管理资源，不能分配角色）、**Reader**（只读）。

> **考点** 角色定义里有两类权限：**Actions**（控制平面：创建、配置、删除资源）和 **DataActions**（数据平面：读 blob、调模型、在 project 里构建 agent）。Azure 的 Owner / Contributor **只有控制平面权限**，所以光有 Contributor 并不能在 Foundry project 里开发，必须再加 Foundry 的角色。

Foundry 的内置角色（2026 年改名，旧名 Azure AI …，角色 ID 不变）：

| 角色 | 能做什么 | 典型人 |
|---|---|---|
| **Foundry Agent Consumer** | 只能调用 agent 的 endpoint | 最终用户、调用 agent 的服务 |
| **Foundry User** | 在 project 里构建和开发（数据平面）+ 只读 | 开发者（最小权限） |
| **Foundry Project Manager** | 管理 project、构建、把 Foundry User 分给别人；**发布 agent 的最低要求** | 团队负责人 |
| **Foundry Account Owner** | 创建账户和 project、管理模型、分配 Foundry User 等角色；**没有数据平面权限** | 平台管理者 |
| **Foundry Owner** | 以上全部 | 自助式团队 |

几条规则常被考：RBAC 只在用 Entra ID 认证时生效，**用 API key 等于绕过 RBAC**；project 的托管标识也要被分配 Foundry User；看配额要在**订阅**作用域分配 **Cognitive Services Usages Reader**；微调模型同时需要数据平面和控制平面权限，所以要 Foundry Owner，或 Foundry User + Foundry Account Owner；不要给 Foundry 工作分配其他 Cognitive Services 开头的角色或 Azure AI Developer（后者是 Azure Machine Learning 工作区 / hub 的角色）；Foundry 要访问你自己的存储账户时，给 Foundry 的托管标识分配 **Storage Blob Data Reader**。作用域可以细到单个 agent（只影响 endpoint 访问）。

来源：[Azure RBAC overview](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview)、[Role-based access control for Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry)。

## 密钥、令牌与 keyless 认证 {#keyless}

调用 Foundry Tools / Azure OpenAI 有两种认证方式：

- **[[api-key|API key]]**：资源自带的两个密钥（KEY1 / KEY2，可以轮换），放在请求头 `Ocp-Apim-Subscription-Key` 里。简单，但密钥一泄露就等于完全访问，且不受 RBAC 约束。官方定位：只适合原型。
- **Entra ID 令牌（[[keyless-auth|keyless / 无密钥认证]]）**：用 `Authorization: Bearer <token>`，令牌由 Entra 签发（Foundry 的作用域是 `https://ai.azure.com/.default`）。代码里通常用 `DefaultAzureCredential`，它会按顺序尝试托管标识、开发者登录等凭据。需要资源有**自定义子域名（custom subdomain）**。生产环境官方要求用这种方式；Agent Service、评估、最小权限 RBAC、托管标识都依赖它。做法是先让所有调用方改用令牌，再**禁用本地认证（disable local auth）**，把密钥彻底关掉。
- Translator 和 Speech 还有一种用密钥换短期令牌的方式（`/sts/v1.0/issueToken`）。

**[[key-vault|Azure Key Vault]]** 用来保管三类东西：**secrets**（令牌、密码、API key、连接字符串）、**keys**（加密密钥）、**certificates**。Standard 层用软件保护，Premium 层用 HSM。对它的访问也走 Entra 认证 + Azure RBAC（或旧的 access policy）。Power Platform 的 [[environment-variable|secret 类型环境变量]]可以直接引用 Key Vault 里的 secret：需要注册 `Microsoft.PowerPlatform` 资源提供程序，给使用者和 Dataverse 服务主体分配 **Key Vault Secrets User**；Copilot Studio 的 agent 要用它，还得在 secret 上打 `AllowedBots`（或 `AllowedEnvironments`）标签。

来源：[Authenticate requests to Foundry Tools](https://learn.microsoft.com/en-us/azure/ai-services/authentication)、[Authentication and authorization in Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/authentication-authorization-foundry)、[Azure Key Vault overview](https://learn.microsoft.com/en-us/azure/key-vault/general/overview)、[Use Key Vault secrets in environment variables](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables-azure-key-vault-secrets)。

## Conditional Access 与 Zero Trust {#conditional-access}

**[[conditional-access|Conditional Access]]** 是 Entra 的策略引擎，微软称之为 Zero Trust 策略引擎："if-then" 规则，在第一因素认证之后执行。输入信号：用户/组/agent（agent 为预览）、IP 位置、设备、应用、实时风险（来自 Entra ID Protection）、Defender for Cloud Apps。决策：阻止，或"允许但要求"——MFA、认证强度、合规设备、Entra 混合加入设备、批准的客户端应用、应用保护策略、改密码、接受使用条款。需要 Entra ID P1；基于风险的策略需要 P2。Zero Trust 三原则：显式验证、最小权限、假定已被入侵。

来源：[Conditional Access overview](https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview)。

## 网络隔离 {#network}

AI-103 和 AB-100 都会考"让 AI 资源不暴露在公网"的手段：

- **[[vnet|Virtual Network (VNet)]]**：Azure 里的私有网络基本单位；子网、NSG（网络安全组）、路由表、VPN / ExpressRoute 连本地。
- **[[private-endpoint|Private endpoint / Private Link]]**：在你的 VNet 里给某个 PaaS 实例（Storage、AI Search、Foundry 资源…）分配一个私有 IP，流量走微软骨干网不出公网；一个 endpoint 只映射到一个实例，所以也防止数据外泄到别的账户。
- Foundry 资源的 **Network** 选项卡：**All networks**（公网开放，只适合原型）、**Selected networks**（指定 VNet 和 IP 段）、**Disabled**（只能通过 private endpoint 访问）。serverless 部署的 endpoint 跟随资源的公网访问（PNA）标志；Agent Service 支持 BYO VNet 的私有网络。
- [[azure-ai-search|Azure AI Search]] 支持 Private Link，以及**文档级访问控制**（按用户权限过滤检索结果）。

来源：[Virtual Network overview](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview)、[Private Link overview](https://learn.microsoft.com/en-us/azure/private-link/private-link-overview)、[Create a Foundry resource](https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource)、[Foundry Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)、[What is Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search)。

## 数据保护、合规与治理工具 {#data-protection}

这些产品名在 AB-100 的"治理"题里反复出现，记住各自管哪一段：

| 产品 | 管什么 | 关键词 |
|---|---|---|
| **[[purview|Microsoft Purview]]** | 数据安全、治理与合规（含 AI）：DLP、Information Protection（敏感度标签）、Insider Risk、Audit、eDiscovery、Data Lifecycle、Compliance Manager；DSPM（预览）覆盖 AI 应用和 agent；Data Map / Unified Catalog 做数据治理 | 门户 purview.microsoft.com；Copilot Studio 的审计日志可送到 Purview |
| **[[dlp|Power Platform 数据策略（DLP）]]** | 在 PPAC 里把连接器分成 Business / Non-business / Blocked，同一个应用、流或 agent 里不能混用不同组的连接器；设计时和运行时都强制；"虚拟连接器"用来管控 Copilot Studio 的功能（如 HTTP 请求、知识、渠道、Application Insights、触发器）；MCP 连接器也受管 | 违规的 app/flow/agent 会被挂起 |
| **[[cmk|客户管理的密钥（CMK）]]** | 默认用微软管理的密钥加密；企业可用自己的 Key Vault 密钥（需要 Power Platform enterprise policy + 托管标识 + Key Vault Crypto Service Encryption User），只支持 Managed Environments；吊销密钥即可锁住环境 | Copilot in canvas apps 在 CMK / Lockbox 环境里不支持 |
| **Lockbox** | 微软工程师访问你的数据前必须经你批准 | Managed Environments 功能 |
| **[[azure-policy|Azure Policy]]** | 用策略定义约束资源**状态**（如 Allowed Locations 拒绝在某些区域创建资源）；效果 deny / audit / modify / deployIfNotExists；合规仪表板与修复 | 和 RBAC 的区别：Policy 管"资源能长什么样"，RBAC 管"谁能做什么" |
| **[[defender-for-cloud|Microsoft Defender for Cloud]]** | 云安全态势管理 + 工作负载保护；AI 安全态势（AI 物料清单）和 AI 威胁保护；Foundry 门户的 **Risks + alerts** 页就显示它的告警 | Defender for Cloud Apps 是另一个产品（SaaS 应用防护） |
| **[[sentinel|Microsoft Sentinel]]** | 云原生 SIEM + SOAR：数据连接器、分析规则生成事件、自动化规则和 playbook（Logic Apps） | 已并入 Defender 门户 |
| **[[data-residency|数据驻留]]** | Power Platform 环境绑定地理区域；Copilot Studio 有"跨地理区域移动数据"的管理员设置；Foundry 的部署类型分 Global / Data Zone（US、EU、APAC）/ Regional 处理；Microsoft 365 Copilot 有 EU Data Boundary | 题目问"数据能不能离开欧洲"时找这些词 |

来源：[Microsoft Purview](https://learn.microsoft.com/en-us/purview/purview)、[Data loss prevention policies](https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention)、[Customer-managed key](https://learn.microsoft.com/en-us/power-platform/admin/customer-managed-key)、[Add Copilot to canvas apps](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/add-ai-copilot)、[Managed Environments](https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-overview)、[Azure Policy overview](https://learn.microsoft.com/en-us/azure/governance/policy/overview)、[Defender for Cloud introduction](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction)、[Responsible AI for Foundry](https://learn.microsoft.com/en-us/azure/foundry/responsible-use-of-ai-overview)、[Microsoft Sentinel overview](https://learn.microsoft.com/en-us/azure/sentinel/overview)、[Copilot Studio security and governance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance)、[Deployment types](https://learn.microsoft.com/en-us/azure/foundry/concepts/deployments-overview)、[Microsoft 365 Copilot overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-overview)。

## Copilot Studio 里的认证与安全设置 {#copilot-studio-security}

一个 agent 对"最终用户"的认证有三档（Settings › Security › Authentication），改完要**重新发布**才生效：

| 选项 | 含义 | 影响 |
|---|---|---|
| **No authentication** | 任何拿到链接的人都能聊 | 工具不能用用户凭据；Demo website 渠道要求这一档 |
| **Authenticate with Microsoft**（默认） | 用 Entra ID 登录；**Teams 和 Microsoft 365 Copilot 渠道只支持这一档** | 能拿到 `User.ID`、`User.DisplayName`，拿不到 `User.AccessToken` |
| **Authenticate manually** | 自己配 Entra ID V2（联合凭据 / 证书 / client secret）、Entra ID 或 Generic OAuth 2 | 能拿到 `User.AccessToken` 去调其他 API；可勾选"Require users to sign in"；支持 SSO |

工具层面另有一组选择：**End user authentication**（让用户自己登录连接器）还是 **Maker-provided credentials**（用制作者的连接，所有用户共用——方便但有数据暴露风险）。自主 agent 的事件触发器只能用制作者的凭据。

安全相关的其他设置和工具：

- **Web channel security**：自定义网站 / Direct Line 渠道可打开 **Require secured access**，用 Secret 1 / Secret 2 换令牌。
- **[[security-scan|安全扫描]]**：发布前自动警告三种高风险配置——无认证、工具用 maker-provided credentials、把 agent 共享给全组织。Agents 页还有 **Protection status**（Protected / Needs review / Unknown），按认证、策略、内容审核三类评估。
- 管理员侧：PPAC 的数据策略（管知识、工具、HTTP、渠道、App Insights、触发器）、**Agent access channels**（允许哪些渠道）、Copilot hub（用量与额度）、审计日志进 Purview / Sentinel、环境路由、SharePoint 知识的敏感度标签、禁止发布生成式 AI agent 的开关；全公司层面由 [[agent-365|Agent 365]] 做控制面。

来源：[Configure user authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication)、[Publish and channels](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-fundamentals-publish-channels)、[Add tools](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent)、[Triggers](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-triggers-about)、[Web channel security](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-web-security)、[Security scan](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-scan)、[Protection status](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-agent-runtime-view)、[Security and governance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance)。

## AI 特有的安全面 {#ai-security}

传统安全之外，生成式 AI 多出一类风险：**提示词操纵（prompt manipulation）**。相关术语在第 5 章详述，这里先认识名字：

- **[[jailbreak|Jailbreak / 用户提示攻击]]**：用户在输入里诱导模型违反规则。
- **[[indirect-prompt-injection|间接提示注入（indirect prompt injection, XPIA）]]**：攻击指令藏在模型读取的文档、网页、邮件或图片里。
- **[[prompt-shields|Prompt Shields]]**：Azure AI Content Safety 里同时检测以上两类攻击的功能；Foundry Agent Service 对工具调用和工具返回也有防护。
- **[[guardrails|Guardrails]]**：Foundry 里把多种控制（风险类别 × 干预点 × 动作）打包成一个可复用的策略，干预点包括用户输入、工具调用、工具响应、模型输出。
- Defender for Cloud 的 AI 告警、Purview 的 DSPM for AI、Copilot Studio 的内容审核（content moderation）级别，都属于这个安全面。

来源：[Content Safety overview](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview)、[Prompt Shields](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection)、[Guardrails overview](https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview)、[Foundry Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)。
