---
id: 03-alm
title: ALM：环境、解决方案、流水线
short: ALM
intro: ALM（application lifecycle management）在 Power Platform 里有一套固定的词汇：环境、解决方案、发布者、环境变量、连接引用、pipelines。AB-620 的 16 道题和 AB-100 的 11 道题都绕着它们转。
exams: AB-620 | AB-100
practice:
  ab-620: ALM & deployment
  ab-100: ALM & deployment
---
一句话版本：**在开发环境里把东西做进一个解决方案（solution），导出成托管解决方案（managed solution），用流水线（pipeline）依次部署到测试和生产环境；环境之间不同的配置用环境变量和连接引用表达。**

```diagram
{"type":"flow","title":"一条典型的 ALM 流水线","steps":[{"t":"Dev 环境","s":"Sandbox；唯一允许手工定制的地方；unmanaged solution"},{"t":"源代码控制","s":"Git / Azure Repos；导出的 unmanaged 包是源，真相所在"},{"t":"Test 环境","s":"Sandbox；导入 managed solution；环境变量取测试值"},{"t":"Prod 环境","s":"Production；只接受 managed solution；不可手工改"}]}
```

## ALM 是什么、为什么考 {#what}

ALM 覆盖三件事：**治理**（谁能改什么、怎么审批）、**应用开发**（在哪里做、怎么版本化）、**维护**（怎么升级、回滚、退役）。Power Platform 的实现前提是：每个环境都要有 [[dataverse|Dataverse]]，因为[[solution|解决方案]]存在 Dataverse 里。微软推荐的基线：

- 至少三个环境：**dev（sandbox）→ test（sandbox）→ prod（production）**。
- 几条"金规则"：只在 dev 里定制；所有定制都放进解决方案；用自己的 **[[publisher|publisher]] 和前缀**，别用默认的；环境特定的设置和机密用[[environment-variable|环境变量]]；往下游导出 **managed**；能自动化就自动化。
- 工具三选一（可组合）：[[pipelines|Power Platform pipelines]]（产品内置、无需源代码控制）、[[build-tools|Azure DevOps Build Tools]] / [[github-actions|GitHub Actions for Power Platform]] / [[pac-cli|pac CLI]]（代码优先）、以及已弃用的 ALM Accelerator。

来源：[ALM overview](https://learn.microsoft.com/en-us/power-platform/alm/overview-alm)、[Copilot Studio ALM guidance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/alm)、[ALM Accelerator](https://learn.microsoft.com/en-us/power-platform/guidance/alm-accelerator/overview)。

## 环境策略 {#environments}

[[environment|环境]]的类型决定它能扮演的角色：

| 类型 | 用途 | 备注 |
|---|---|---|
| **Production** | 生产；也是 pipelines 的 host 环境所要求的类型 | 需要容量 |
| **Sandbox** | 开发和测试；可以复制（copy）和重置（reset） | 从生产复制一份做 UAT 很常见 |
| **Default** | 每个租户自动一个；所有人默认都是 maker；管理能力有限 | 不要在这里做正式项目；可用"环境路由"把新 maker 自动导向个人开发环境 |
| **Trial** | 30 天试用 | |
| **Developer** | 个人开发（Developer Plan） | |
| **Dataverse for Teams** | Teams 内嵌的轻量环境 | 容量和功能受限 |

**[[managed-environments|Managed Environments]]** 给环境加上一组管理能力：环境分组（environment groups，可以批量套规则）、限制共享、每周使用洞察、数据策略、pipelines（目标环境必须是 Managed）、解决方案检查器强制执行、IP 防火墙、CMK、Lockbox、扩展备份、默认环境路由、VNet 支持等。它不是环境类型，是开关；用户需要相应的独立许可证。

来源：[Environments overview](https://learn.microsoft.com/en-us/power-platform/admin/environments-overview)、[Managed Environments overview](https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-overview)。

## 解决方案：unmanaged 与 managed {#solutions}

**[[solution|解决方案（solution）]]**是 Dataverse 里打包定制内容的容器：表、列、应用、流、Copilot Studio agent、环境变量、连接引用、插件……都可以是它的组件。两种形态：

| | [[unmanaged-solution|Unmanaged（非托管）]] | [[managed-solution|Managed（托管）]] |
|---|---|---|
| 身份 | 开发中的源；在 dev 环境里编辑 | 已完成的**构建产物**；部署到 test/UAT/prod |
| 能否直接编辑 | 能 | 不能（只能在上面加 unmanaged 层） |
| 导出 | 可以导出成 unmanaged（进源代码控制）或 managed | **不能再导出** |
| 删除 | 只删容器，组件留在环境里 | 删除会一并移除它带来的定制**和数据** |
| 限制 | — | 不能导入到还存在同名 unmanaged 源的环境里 |

其他要点：

- **[[publisher|Publisher]]** 和**前缀（prefix）**：每个解决方案属于一个发布者，组件的架构名带发布者前缀（如 `contoso_`），用来避免命名冲突。考题里"创建自定义发布者"几乎总是正确做法。
- **依赖（dependencies）**：组件引用了别的组件就产生依赖；导出时用 **Add required objects** 把流、环境变量、连接引用一起带上，否则导入会失败。
- **[[solution-layers|层（layers）]]**：同一组件可以被多个 managed 解决方案和一个 unmanaged 层叠加，**unmanaged 层永远在最上面生效**；"Remove unmanaged layer" 用来让 managed 更新重新显现。
- 生命周期操作：Create、Update、**Upgrade**（替换旧版本，可删除被移除的组件）、Patch；pipelines 默认用 Upgrade 导入。
- 大小上限 95 MB；**[[solution-checker|Solution checker]]** 做静态检查，Managed Environments 可强制执行。
- Copilot Studio 里每个 agent 都住在某个解决方案里（可设 preferred solution）。

来源：[Solution concepts](https://learn.microsoft.com/en-us/power-platform/alm/solution-concepts-alm)、[Copilot Studio solutions overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-overview)、[Pipelines](https://learn.microsoft.com/en-us/power-platform/alm/pipelines)。

## 环境变量与连接引用 {#env-vars}

同一个解决方案要在 dev/test/prod 里连接不同的系统，靠两类组件：

- **[[environment-variable|环境变量（environment variable）]]**：有定义（名字、类型、默认值）和每个环境里的当前值。类型有 Decimal number、JSON、Text、Yes/No、Data source、**Secret**。Copilot Studio 里只读；值在**发布时**被捕获，只有 **secret 类型在运行时读取**。Secret 类型可以指向 Azure Key Vault（权限要求见第 2 章）。
- **[[connection-reference|连接引用（connection reference）]]**：指向某个[[connection|连接]]（即保存好的连接器凭据）的解决方案组件。导入或 pipeline 部署时在目标环境里绑定到那里的连接，流和 agent 就不用改。自定义连接器要**先于**连接引用导入。

> **考点** 题目问"把 agent 部署到生产后，让它连接生产的 Azure AI Search / Key Vault / SharePoint 站点"，答案几乎总是环境变量 + 连接引用，而不是在生产环境里手改。

来源：[Environment variables](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-variables-about)、[Key Vault secrets in environment variables](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables-azure-key-vault-secrets)、[Connection references](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-connection-reference)、[Copilot Studio export and import](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-import-export)。

## Power Platform pipelines {#pipelines}

**[[pipelines|Pipelines]]** 是产品内置的部署流水线，不需要源代码控制：

- 管理员在一个 **host 环境**（生产类型，本身不必是 Managed）里配置 pipeline，定义阶段（如 Test → Prod）；**目标环境必须是 Managed Environments**。
- maker 在 dev 环境的 unmanaged 解决方案里点部署，提交一个**部署请求（deployment request）**；系统导出 managed 包，预先验证连接、连接引用和环境变量，同一个产物在各阶段复用；导入方式为 Upgrade。
- 可以用 Power Automate 扩展：触发器 **When an action is performed**（类别 Power Platform Pipelines），动作有 `OnDeploymentRequested`、`OnApprovalStarted`、`OnApprovalCompleted`、`OnPreDeploymentStarted/Completed`、`OnDeploymentStarted/Completed`；开关 **Pre-export Step Required**、**Is Delegated Deployment**（由服务主体或阶段负责人代为部署，需要审批）、**Pre-deployment Step Required**；用 `UpdateApprovalStatus` 等动作回写状态（10 待处理、20 完成、30 拒绝）。
- 命令行：`pac pipeline`。2026 年 10 月起，非 Managed 的目标环境有 30 天宽限期后被阻止。

来源：[Pipelines overview](https://learn.microsoft.com/en-us/power-platform/alm/pipelines)、[Extend pipelines](https://learn.microsoft.com/en-us/power-platform/alm/extend-pipelines)。

## 代码优先：pac CLI、Build Tools、GitHub Actions {#code-first}

- **[[pac-cli|Power Platform CLI (pac)]]**：开发者命令行，管认证配置文件、环境、Dataverse、解决方案打包/解包、Power Pages、代码组件；`pac auth create`、`pac admin create-service-principal` 等。
- **[[build-tools|Power Platform Build Tools]]**（Azure DevOps 扩展，v2.0 基于 pac CLI）：任务分四类——Helper、Quality check（solution checker）、Solution（export/import/pack/unpack）、Environment management；服务连接用服务主体 + application user，推荐 Workload Identity Federation。
- **[[github-actions|GitHub Actions for Power Platform]]**（marketplace 的 `powerplatform-actions`）：同样的四类能力（解决方案导入导出、环境创建删除、解决方案检查）；认证用用户名密码（不能开 MFA）或服务主体 + client secret。
- **Azure DevOps** 本身：Boards、Repos（Git 或 TFVC）、Pipelines、Test Plans、Artifacts。
- 状态提醒：**ALM Accelerator 已弃用**（它是建在 Azure Pipelines + Git 上的 canvas app，属于 CoE kit），**CoE Starter Kit 不再积极维护**，核心能力已进入 PPAC（Managed Environments、租户级分析）。

来源：[pac CLI introduction](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction)、[Build Tools](https://learn.microsoft.com/en-us/power-platform/alm/devops-build-tools)、[GitHub Actions](https://learn.microsoft.com/en-us/power-platform/alm/devops-github-actions)、[What is Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/user-guide/what-is-azure-devops)、[ALM Accelerator](https://learn.microsoft.com/en-us/power-platform/guidance/alm-accelerator/overview)、[CoE Starter Kit](https://learn.microsoft.com/en-us/power-platform/guidance/coe/overview)。

## Copilot Studio agent 的 ALM 细节 {#copilot-studio-alm}

agent 是解决方案组件，但有几样东西**不随解决方案走**，部署后要手工补：

- 不导出的：Conversation ID、CDS Bot ID、Environment ID、评论；图标和渠道详情导入后为空；**用户认证设置要重新配置并重新发布**。
- 非 solution-aware 的配置（guidance 列表）：Application Insights 设置、手动认证设置、Direct Line / web 安全设置、已部署的渠道、共享。
- 导出要求：System Customizer 角色；主题名字里有句点会阻止导出；非结构化数据（上传文档）类知识不支持 ALM；用 **Add existing › Agent**，再 **Advanced › Add required objects** 把流和环境变量带上。
- 流程建议：component collections 复用组件；测试用 [[copilot-agent-kit|Copilot Agent Kit]] 的自动化测试做流水线门禁；用环境变量区分 dev/test/prod 的知识源、连接和 App Insights。

来源：[Copilot Studio ALM guidance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/alm)、[Export and import agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-import-export)、[Copilot Agent Kit](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/kit-overview)。

## Foundry 与自定义模型的 ALM {#foundry-alm}

Azure 这边没有"解决方案"，ALM 由基础设施即代码 + agent 版本 + CI/CD 组成：

- **基础设施**：Foundry 资源和 project 用 Bicep / Terraform 模板创建，包括网络、CMK、BYO 存储等安全设置。
- **Agent 版本与发布**：[[foundry-agent-service|Foundry Agent Service]] 的 agent 有版本（agent versions）和稳定的 endpoint；发布 agent 至少需要 Foundry Project Manager 角色。
- **CI/CD**：hosted agent 用 Azure Developer CLI——`azd ai agent init` 搭脚手架，`azd pipeline config` 自动创建服务主体、写入 GitHub / Azure DevOps 的机密和 `azure-dev.yml` / `azure-pipelines.yml`，流水线里跑 `azd provision` 和 `azd deploy`（构建容器 → ACR → 新的 agent 版本）；多环境用 `azd env new staging`，分支触发（main → prod，develop → staging）；用 `azd ai agent eval run` 做评估门禁；生产先固定版本再提升。
- **自定义模型**：微调后的模型是新的可部署对象，部署类型有 Standard、Data Zone Standard、Global Standard、Developer（24 小时、无 SLA，只用于评估）、Provisioned 等；评估用 Foundry 的评估运行和 GitHub Action。

来源：[Create a Foundry resource](https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource)、[Foundry Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)、[Set up CI/CD with the CLI](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/set-up-ci-cd-cli)、[Fine-tuning overview](https://learn.microsoft.com/en-us/azure/foundry/fine-tuning/overview)、[Role-based access control for Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry)。
