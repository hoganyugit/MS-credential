---
id: 08-ab-620-syllabus
title: AB-620 考纲逐条：官方 skills measured 怎么考
short: AB-620 考纲
intro: 按微软官方 AB-620 考纲的 44 条 skills measured 逐条说明考什么、怎么判断、常见陷阱，每条附 Microsoft Learn 来源。
exams: AB-620
skills: ab-620
---
AB-620（Designing and Building Integrated AI Agent Solutions in Copilot Studio）的官方考纲分三大板块：**A. Plan and configure agent solutions（30–35%）**、**B. Integrate and extend agents in Copilot Studio（40–45%）**、**C. Test and manage agents（20–25%）**。B 板块权重最大，而且它考的全是"把外部东西接进 agent"——知识源、工具、多 agent、Azure——这正是题目最爱出场景题的地方：给一段需求，问你选哪种集成方式。

考纲里几乎所有内容都落在 Copilot Studio 的 **standard harness**（Learn 页面顶部标注 "This article describes features used in agents or agent flows powered by the standard harness"）：主题（topics）、agent flows、生成式答案节点、连接器工具、解决方案。GitHub Copilot harness 的新东西（skills、memory、workflows 设计器）目前不在考纲里，看到时知道它是另一条线即可。

这一章按考纲原文的编号逐条展开。每条先说微软期望你会什么，再给"需求 X → 选 Y，因为 Z"式的判断规则和容易混淆的点，最后列出我实际核对过的 Learn 页面。建议的读法：先过一遍 A1 和 B3（设计类，场景题最多），再读 A2/A3/B2（操作类，考具体设置名和限制数字），最后用 C1/C2 收尾（评估与 ALM，考流程顺序）。

## A1. Plan an agent solution {#a1}

A1 是"方案设计"子领域：给你一家公司的背景、数据源、用户群和合规要求，问你该怎么选集成方式、认证方式、渠道、负责任 AI 策略、治理手段和复用策略。它不考操作步骤，考的是判断——所以每条都要记住"选项清单"和"每个选项的硬限制"。涉及的产品：Copilot Studio、Power Platform 连接器与 DLP（data policies）、Microsoft Entra ID、Microsoft Purview、Power Platform admin center（PPAC）。

#### A1.1 Plan integration with enterprise systems

微软期望你能把"要接什么系统、做什么事"映射到正确的集成模式。官方 guidance 把模式分成：**Power Platform connectors**（prebuilt / custom，低代码、内置解析与错误处理、可跨 agent 复用）、**HTTP request** 节点（开发快，但不能像自定义连接器那样共享复用，低代码作者难维护）、**agent flows**（确定性的多步动作链，可用 Key Vault 存密钥、支持 human-in-the-loop，按 Copilot Credits 计费）、**MCP**（服务器统一发布工具定义，上游 API 变更只改一处）、**computer use**（没有 API 时操作 GUI）、**Bot Framework skills**（pro-code，跑在 Azure）。知识层面还要分清 **Copilot connectors**（把外部内容索引进 Microsoft Graph，有引用、语义索引）和 **Power Platform connectors 作为实时知识**（不搬数据，运行时用用户身份查）。

| 需求 | 选 | 原因 |
|---|---|---|
| 有 prebuilt 连接器的 SaaS，读写数据 | Connector 工具 | 零开发、DLP 可管、可复用 |
| 自家 REST API，多个 agent 要用 | Custom connector / REST API 工具 | 一次定义，环境内共享，解决方案可搬 |
| 临时调一个接口，只在一个主题里用 | HTTP request 节点 | 最快，但不可复用 |
| 多步事务、要审批、要重试 | Agent flow | 确定性链、错误处理、human in the loop |
| 内部已有 MCP server，多个 agent 共用工具 | MCP 工具 | 工具描述由服务器维护、自动同步 |
| 大量 KB/工单做问答、要引用 | Copilot connectors 知识 | 索引进 Graph，语义检索与引用 |
| 数据不能复制出源系统、要最新值 | 实时连接器知识 / 连接器工具 | 运行时查询，不搬数据 |

> **考点** 题干出现"数据不得复制到 Microsoft 365"→ Power Platform connector（实时）；出现"大规模索引、要可追溯引用"→ Copilot connector；出现"没有 API 的老系统"→ computer use。

来源：[Plan and design integration strategies](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/integrations)、[Copilot connectors versus Power Platform connectors](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-graph-vs-power-platform-connectors)、[Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent)

#### A1.2 Plan identity strategy

身份策略在 **Settings › Security › Authentication**，三个选项：**No authentication**（任何拿到链接的人都能聊，agent 只能访问公开信息，工具不能用用户凭据）、**Authenticate with Microsoft**（默认；自动配置 Entra ID，Teams 里免登录；提供 `User.ID`、`User.DisplayName`，**没有** `User.AccessToken`/`User.IsLoggedIn`）、**Authenticate manually**（Entra ID、Entra ID V2 with federated credentials / certificates / client secrets、Generic OAuth 2；提供 `User.AccessToken` 和 `User.IsLoggedIn`）。硬规则：**Teams + Microsoft 365 渠道只支持 Authenticate with Microsoft**；要在其他渠道上也认证就选 Authenticate manually。**Require users to sign in** 只对手动认证可配，开了之后生成只读系统主题 Require users to sign in；只有 Entra ID 作为提供方时才能用 agent sharing 控制"谁能聊"。认证改动必须**发布**后才生效。

工具层面另有一层身份：每个工具的 **Authentication** 选 **End user credentials**（默认，用户只看到自己有权限的数据）或 **Maker-provided credentials**（共享资源、低风险场景；安全扫描会警告）。管理员可用 DLP 连接器 **Chat without Microsoft Entra ID authentication in Copilot Studio** 禁止匿名 agent。

> **易混** "需要拿 token 调 Graph/自定义 API" → 必须手动认证（才有 `User.AccessToken`）；"只发到 Teams、要知道用户是谁" → Authenticate with Microsoft 足够。Entra 手动认证的 app registration 重定向 URI 固定为 `https://token.botframework.com/.auth/web/redirect`，scope 至少 `profile openid`，SharePoint 加 `Sites.Read.All Files.Read.All`，Copilot connectors 加 `ExternalItem.Read.All`。

来源：[Configure user authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication)、[Configure user authentication with Microsoft Entra ID](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-authentication-azure-ad)、[Configure user authentication for tools](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-enduser-authentication)

#### A1.3 Plan channels and deployment

部署的基本事实：agent 必须先 **Publish** 至少一次才能接渠道；每次改动都要重新发布，发布对所有渠道生效；进行中的会话要等新 session（多数渠道 30 分钟无活动后结束），Teams 里可输入 `start over`。渠道在 **Channels** 页配置：**Teams and Microsoft Copilot**（勾选 **Make agent available in Microsoft Copilot**；分发方式有安装链接、**Show to my teammates and shared users**（Teams 商店 Built with Power Platform 区）、**Show to everyone in my org**（Submit for admin approval，进 Built for your org / Microsoft 365 Agent Store））、**Demo website**（只给干系人试用，不是生产）、**Custom website**（iframe/Web Chat 代码）、**Mobile app**（Direct Line：从 Channels › Mobile app 复制 **Token Endpoint**，GET 换 token，`expires_in` 3600）、SharePoint、WhatsApp、Facebook、Azure Bot Service 渠道（Slack、Telegram、Twilio…）、Dynamics 365 Contact Center（语音/手递手）。

判断规则：认证方式决定渠道——Authenticate with Microsoft 只有 Teams/M365/Power Apps/SharePoint 可用；Demo/Custom website 需要 No authentication 或 Authenticate manually。Web 渠道要防"知道 agent ID 就能聊"，在 **Settings › Security › Web channel security** 开 **Require secured access**，用 Secret 1/Secret 2 换 token（生效最多 2 小时）。管理员可用 DLP 按渠道封禁（如 **Direct Line channels in Copilot Studio**、**Microsoft Teams + Microsoft 365 Channel in Copilot Studio**），或在 PPAC 用 **Agent access channels** 控制。

> **注意** Teams 渠道的限制常出题：一个问题节点最多 6 个建议操作（hero card）；群聊/频道里不能用需要用户认证的知识源（如 SharePoint），只支持 1:1；自定义过的生成式答案在 Teams 不自动渲染引用。Microsoft 365 Copilot 渠道不支持 Conversation Start 主题、不支持 Adaptive Card 的 `Action.Execute`。

来源：[Key concepts - Publish and deploy your agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-fundamentals-publish-channels)、[Connect and configure an agent for Teams and Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams)、[Publish an agent to mobile or custom apps](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-connect-bot-to-custom-application)、[Configure web and Direct Line channel security](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-web-security)

#### A1.4 Plan responsible AI strategy

这条考你知道平台给了哪些"刹车"，以及作者该做什么。平台层：所有生成式请求都过内容审核，用户输入和 agent 回复**各检查一次**，覆盖 jailbreak、prompt injection、prompt exfiltration、版权；默认披露语 "Just so you are aware, I sometimes use AI to answer your questions."；租户管理员可在 PPAC 关闭"发布使用生成式 AI 的 agent"。作者可调的设置：**Content moderation** 等级 **Lowest–Highest**（默认 **High**；agent 级在 Settings › Generative AI，节点级在生成式答案节点 Properties，提示工具级在 prompt builder；**节点级优先**）；**Allow ungrounded responses**（关掉后，当轮没用知识源/工具的回答被拦截并触发 Fallback 主题；关掉后答案必须带引用才放行）；**Use information from the web**；生成式答案节点的 **prompt modification**（custom instructions，上限 8,000 字符，可用变量和 Power Fx，官方建议"给模型一条出路"如 "respond with 'not found'"）。

guidance 层的策略：透明（告知用户在和 AI 对话）、人工监督（prompts 输出进业务前人工复核；approvals 里 AI stage 后接人工 stage）、对抗测试（评估里的 **Content safety** 方法覆盖 hate/unfairness、sexual、violence、self-harm，严重度阈值 0–7）、反馈循环、审计。

> **考点** "回答必须只来自公司文档，否则拒答" → 关 Allow ungrounded responses；"减少被拦的合法回答" → 调低 moderation 等级（代价是更多有害内容风险）；"统一的免责声明/语气" → 指令或 prompt modification，而不是改模型。

来源：[FAQ for generative answers](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faqs-generative-answers)、[Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)、[Use prompt modification to provide custom instructions](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-generative-answers-prompt-modification)、[Apply responsible AI principles](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/responsible-ai)

#### A1.5 Evaluate security and governance considerations

治理的主工具是 PPAC 的 **data policies**（DLP）：把连接器分到 Business / Non-business / Blocked 组，2019 年后新增的 Copilot Studio 连接器默认落在 Non-business，组间不能互通；违规时 **Publish** 按钮不可用，Channels 页可 Download 违规明细。自 2025 年起对所有租户强制执行，不再有豁免。常用连接器名要记：

| 要阻止 | DLP 连接器名 |
|---|---|
| 匿名 agent | Chat without Microsoft Entra ID authentication in Copilot Studio |
| HTTP request 节点 | HTTP（支持 endpoint filtering） |
| 本地上传文件知识 | Knowledge source with documents in Copilot Studio |
| SharePoint/OneDrive 知识 | Knowledge source with SharePoint and OneDrive in Copilot Studio |
| 公共网站知识 | Knowledge source with public websites and data in Copilot Studio |
| 事件触发器 / 认证评估 | Microsoft Copilot Studio |
| Application Insights | Application Insights in Copilot Studio |
| 某渠道 | Direct Line channels / Microsoft Teams + Microsoft 365 Channel / Facebook / SharePoint / WhatsApp / Omnichannel in Copilot Studio |

其他考点：封禁 Power Platform 连接器会同时封掉 MCP 工具（MCP 走连接器通道）；**Automatic security scan** 在发布前对 No authentication、Maker-provided credentials、Share with everyone 三类改动给出警告；**Microsoft Purview** 审计 Copilot Studio 的管理/作者事件（`BotCreate`、`BotUpdateOperation-BotPublish`、`BotUpdateOperation-BotShare`、`EnvironmentVariableCreate`…）和用户事件 `CopilotInteraction`（审计日志不含对话文本，文本在 DSPM for AI 看）；**Managed Environments** 的 sharing limits（限制 Editor/Viewer、只允许共享给个人、限人数）；环境分区策略（个人开发环境严、测试/生产宽）；CMK、VNet、IP firewall、Customer Lockbox。

来源：[Configure data policies for agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-data-loss-prevention)、[Security and governance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance)、[View Copilot Studio audit logs in Purview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-logging-copilot-studio)、[Secure your Copilot Studio projects](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/sec-gov-phase3)

#### A1.6 Plan reuseable agent components

复用有三个层次。**Component collections**：在 agent 的 **Settings › Component collections** 或侧栏 **Component collections** 页创建，可装 topics、knowledge、tools、child agents、MCP、connectors、flows、entities；加入集合的组件**从原 agent 移走**，agent 改为引用；同环境内连接给其他 agent（**Connected agents › Add agent**），跨环境用 **Export**（导出即变 **managed**）再在目标 agent 的 Settings 里 **Import solution**；只有集合创建者或 System Customizer/System Administrator 能编辑，所有作者都能使用但改不了内容——这正是"只有平台组能改、所有人能用"题的答案。可设 **primary agent** 以排除依赖。**Tools 页**：环境级共享工具（prompt、agent flow、MCP、custom connector、REST API、computer use），一次创建加到多个 agent，每个 agent 拿到一层 wrapper 配置自己的输入输出。**Solutions**：复杂集合（含连接器、环境变量）用解决方案承载，支持版本、managed/unmanaged、pipelines。

> **考点** 题干"三个 agent 共用升级主题 + MCP 工具 + 标准免责声明，且只有一个团队可编辑" → component collection（managed 导出）；"同一个 prompt 在多个 agent 复用" → Tools 页；"跨环境、含环境变量" → solution。

来源：[Create and share reusable component collections](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-export-import-copilot-components)、[Use shared tools from the Tools page](https://learn.microsoft.com/en-us/microsoft-copilot-studio/library-add-actions)、[Establish an ALM strategy](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/alm)

#### A1.7 Design agents for internal or external audiences

内外部的差别集中在认证、渠道、数据暴露面和共享控制：

| 维度 | 内部员工 agent | 外部客户 agent |
|---|---|---|
| 认证 | Authenticate with Microsoft（默认） | No authentication，或 Authenticate manually + Generic OAuth 2 / 自家 IdP |
| 渠道 | Teams、Microsoft 365 Copilot、SharePoint、Power Apps | Custom website、Mobile app（Direct Line）、WhatsApp、Facebook、Contact Center |
| 知识 | SharePoint、Dataverse、Copilot connectors（按用户权限） | 公共网站、上传文件、Azure AI Search；不能用需要 Entra 用户认证的源 |
| 工具凭据 | End user credentials | 多用 Maker-provided credentials（用户没有内部系统账号） |
| 谁能用 | agent sharing（个人/安全组/Everyone in org），需 Entra 认证 + Require users to sign in | 不能用 sharing 控制；靠 Web channel security 的 secret/token 限制嵌入位置 |
| 治理 | Sharing limits、Teams admin 审批上架 | DLP 允许 Chat without Entra ID；Demo website 不给客户 |

额外规则：匿名 agent 的 prompt 工具不能用 Dataverse 表作知识；无认证时所有需要用户凭据的工具失效；外部场景要把手递手（hand off）到 Dynamics 365 Contact Center 或通用 engagement hub 纳入设计。

来源：[Configure user authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication)、[Publish an agent to a live or demo website](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-connect-bot-to-web-channels)、[Share agents with other users](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-share-bots)、[Configure web and Direct Line channel security](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-web-security)

## A2. Create and monitor agent flows in Copilot Studio {#a2}

Agent flows 是 standard harness 里的确定性自动化：同样的输入永远得到同样的输出，适合"业务流程"，而 topics 适合"对话流程"。它用 Power Automate 的经典设计器，在 Copilot Studio 的 **Flows** 页管理，按 Copilot Studio 容量（每个 action 计费）而不是 Power Automate 许可计费，可以用 premium 连接器，不能调 desktop flows。这一子领域考的是：怎么建一个能被 agent 调用的 flow、human-in-the-loop 动作、动作与连接的配置、监控、输入输出参数、错误处理。

#### A2.1 Create an agent flow

两种建法：**自然语言**（描述需求，Copilot Studio 生成 flow）和**设计器**（Flows 页 › **New flow › Agent flow**，模板已带 **When an agent calls the flow** 触发器和 **Respond to the agent** 动作）。从 agent 的 Tools 页 **Add a tool › New tool › Agent flow** 也会自动加好这两个节点。flow 由一个 trigger（instant / scheduled / event）加至少一个 action 组成；action 分 AI capabilities（Run a prompt、调 agent）、Human in the loop、Built-in tools（循环、分支、子流）、Connectors。必须 **Publish** 才能用，有错误时不能发布（**Flow checker** 列出全部错误）；**Version history** 存在 Dataverse。flow 是 solution-aware 的（草稿、版本、导入导出）。已有的 Power Automate cloud flow 可在 make.powerautomate.com 把 plan 改成 **Copilot Studio** 转成 agent flow——单向、不可逆、需在解决方案里且环境有 Copilot Studio 容量。

> **考点** 计费：从主题调 flow 消耗一个 Classic answer + flow actions；生成式编排调用消耗一个 Autonomous action + flow actions；设计器和 test chat 里测试不计费；预付容量耗尽后新运行被阻止。"为什么 Copilot Studio 的 Flows 页看不到我的流" → 它是在 Power Automate 建的，需转换。

来源：[Agent flows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview)、[Create an agent flow as a tool](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-flow-create)、[Edit and manage your agent flow in the designer](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flow-designer)、[Agent flows FAQ](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-faqs)

#### A2.2 Create a human-in-the-loop agent flow

两个 **Human review** 连接器动作。**Run a multistage approval**（预览）：在弹窗里按 **stage** 搭审批链——**Manual stage**（approval type 为 First to respond 或 Everyone must approve；字段 Title、Assigned to、Details；**同一审批人不能出现在多个 stage**，否则流失败）、**AI stage**（写 Instructions，用 `/` 或 Add content 加文档/图片输入，选模型，AI 给出 Approve/Reject 及理由；需要环境有 Copilot Credits；输出可配 **Next step based on decision** 让人工最终把关）、**Condition**（左侧只能用 input，按金额等条件跳转/直接批准/拒绝）。默认：批准进下一 stage，拒绝则结束。审批人在 Teams Approvals 应用、Outlook 或 Power Automate 门户响应。已知限制：文件要 base64、不支持附件、**不支持 ALM 和共享**（导入后要重建）。**Request for information**：暂停流向指定邮箱（仅 Outlook，仅本租户）发送表单，字段 Title、Message、Assigned to；5 种输入类型 Text、Yes/No、Email、Number、Date，可选填/单选/多选；**第一个回复者**的答案生效，后续忽略；回复后参数变成后续动作的动态内容。

> **注意** 审批通常远超 agent 工具的 100 秒同步限制。方案是把 **Respond to the agent** 放在审批之前（后续动作继续跑最多 30 天），或在环境支持时打开 **Asynchronous response**。

来源：[Multistage and AI approvals in agent flows](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-advanced-approvals)、[Request information from human review in agent flows](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-request-for-information)、[Create an agent flow as a tool](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-flow-create)

#### A2.3 Configure actions and connectors

在设计器里选 **Insert a new action**，搜索连接器动作，点卡片在 **Parameters** 标签填值（下拉或表达式/动态内容）。连接器凭据分两层：flow 自身的 connection（Overview 标签可看 connection references），以及 agent 调用时的身份——在支持的认证 agent 里，flow 可配置为使用**用户凭据**（run-only 设置 **Provided by run-only user**）；用 **customer-managed keys（CMK）** 的环境目前不支持，要指定具体连接。agent 侧在 **Settings › Connection Settings** 管理所有连接，状态有 Connected / Not Connected / Deactivated / Expired / Stale，可为支持 SSO 的连接开 **Allow permission to share parameters**（OBO）。注意 agent flow **不能复制、共享、设共同所有者或给 run-only 权限**（与 cloud flow 的区别）。设计器最多 8 层嵌套（scope、条件、循环都算）。

> **易混** 连接器工具加在 agent 上时 **Credentials to use** 默认 **End user credentials**；想用 maker 身份要在工具 Details › Additional details 改成 Maker-provided credentials 并先把 agent 配成认证渠道。第三方连接器会让用户先授权连接，用户不懂时考虑 maker 凭据。

来源：[Edit and manage your agent flow in the designer](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flow-designer)、[Create and manage connections](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-connections)、[Use connectors in Copilot Studio agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-connectors)、[Agent flows FAQ](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-faqs)

#### A2.4 Monitor agent flows

每个 agent flow 有四个标签：**Designer**（画布）、**Overview**（名称、描述、连接、所有者、最近运行，可 **Turn off** 防止触发或删除，配 savings rules）、**Activity**（运行历史、状态、耗时；点进单次运行逐步排错；可多选 **Resubmit** 或 **Cancel** 进行中的运行）、**Analytics**（运行次数、失败率、趋势）。Analytics 的限制常考：数据最多延迟 30 分钟出现，"Actions performed trend" 约 24 小时刷新，**只对 solution flows 有运行分析**，共同拥有/共享的 flow 不计入。容量监控在 PPAC › **Licensing › Copilot Studio** 看每个 flow 的 **Agent flow actions**；预付容量用完后新运行被阻止（已在跑的完成；Microsoft 365 Copilot 许可用户和测试运行不受影响），建议开 pay-as-you-go。agent 调用失败时在 agent 侧表现为错误消息，多数 flow 问题在 **Flow checker** 里能看到。

来源：[Monitor your agent flows](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flow-manage-monitor)、[Agent flows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview)、[Call an agent flow from an agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-use-flow)

#### A2.5 Add input and output parameters

输入加在 **When an agent calls the flow** 触发器上，输出加在 **Respond to the agent** 动作上；Respond 可以出现在多个分支，但**每处的输出必须一致**。能被 agent 当工具用的 flow 必须：有这两个节点、已发布、在同一环境的解决方案里、**Asynchronous response** 为 Off（在 Respond to the agent › Settings › Networking），并在 **100 秒**内回应（更长的动作放在 Respond 之后，最长跑 30 天）。否则 agent 报 "Error code: 3000"。加成工具后，在工具配置页 **Inputs** 为每个输入选填充方式：**Dynamically fill with AI**（默认，从上下文抽取或自动追问）或 **Custom value**（字面值/变量/Power Fx，不再问用户）；**Completion › After running** 选 Don't respond / Write the response with generative AI / Send specific response / Send an adaptive card。新基础设施的环境支持 **Asynchronous response** 开启：flow 超过 2 分钟继续跑并回调 agent（Teams 完整支持，Microsoft 365 Copilot 和电话渠道不支持）；若想 agent 立即回应，直接删掉 Respond 动作。

来源：[Modify an existing flow to use with an agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flow-modify-use-with-agent)、[Call an agent flow from an agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-use-flow)、[Asynchronous response support for agent flows](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flow-asynchronous-response)

#### A2.6 Implement error handling in agent flows

agent flow 用的是 cloud flow 的错误处理机制。**Configure run after**：每个动作可按上一步结果 **is successful / has failed / is skipped / has timed out** 决定是否执行，用它做"失败就通知/记录"的旁路。**Scope** 做 try/catch：主逻辑放 Try scope，Catch scope 的 run after 设为 Try "has failed"（可加 timed out），scope 整体只报一个 Failed 状态，要展开才知道哪一步失败；用 `result('Try')` 配合 **Filter array** 取出失败动作的信息；`workflow()` 取运行 ID 拼出运行链接。**Retry policy** 在动作 Settings 里设，推荐 **Exponential**（间隔递增）而非 Fixed，设首次间隔和最大次数，只用于瞬时故障。**Terminate** 动作把运行标为 Failed 并写状态和消息。触发器和 Respond 动作保持在 scope 外。agent 侧：工具异常触发 **On Error** 系统主题（含错误码、会话 ID、时间戳），HTTP request 节点另有 Continue on error 选项（见 A3.6）。

> **考点** "flow 偶发超时导致 agent 报错，要自动重试" → Retry policy（exponential）；"失败要发邮件并继续" → run after has failed 或 Catch scope；"失败后必须停止并标记失败" → Terminate。

来源：[Employ robust error handling](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling)、[Use scopes to organize actions in cloud flows](https://learn.microsoft.com/en-us/power-automate/scopes)、[Use system topics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-system-topics)

## A3. Configure topics {#a3}

Topics 是预先设计好的对话路径（节点）。generative orchestration 下模型按主题**描述**选主题并自动填输入；classic 下按触发短语。这一子领域考节点级操作：在主题里调 flow 和工具、消息格式、prompt 工具、生成式答案节点及其数据源、HTTP 请求、Adaptive Card、变量。记住每个节点的确切菜单路径和属性名——题目常直接问"在哪个设置里"。

#### A3.1 Add agent flows to a topic

在主题画布点 **Add node (+) › Add a tool**，面板分三个标签 **Basic tools / Connector / Tool**，选目标 flow 后生成一个 **Action** 节点。加在主题里的 flow **只对该主题可用**；加在 agent 的 Tools 页则由编排器在运行时自行调用。节点上把输入映射为字面值、变量或 Power Fx（字面值会被解释为数字/布尔，想当字符串要加引号 `"123"`），flow 的输出自动变成主题变量供后续节点使用。要求与 A2.5 一致：flow 已发布、同环境解决方案、有 When an agent calls the flow + Respond to the agent、同步回应 100 秒内。调用失败由 **On Error** 系统主题处理。

> **易混** "只有一个主题需要这个流、不想编排器乱调" → 主题级 Action 节点；"让 agent 自己判断什么时候跑" → agent 级 Tool，并写好 Description。

来源：[Add an agent flow as a tool to an agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flow-agent)、[Call an agent flow from an agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-use-flow)、[Work with variables](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-variables)

#### A3.2 Configure agent response formatting

**Send a message**（Message 节点；Question 节点有同样能力）支持基本格式（粗体、斜体、项目/编号列表）、插入变量 **{x}**、**Message variation**（随机选一条）、Image、Video（MP4 直链或 YouTube）、Basic card、Adaptive card、**Quick reply**（类型 Send a message / Open URL（必须 https）/ Make a call（`PhoneNumber:`）/ Send a hidden message to the agent）；多张卡片可 **Carousel**（默认）或 **List**。语音渠道可切到 **Speech** 模式写不同的朗读文本并加 SSML 标签（Audio、Break、Emphasis、Prosody）。工具/子 agent 完成后的回复由 **After running** 控制：Don't respond（默认，交给编排器组合）、Write the response with generative AI、Send specific response、Send an adaptive card。渠道差异：Markdown 在网站完整支持、Teams/Facebook 部分支持；Teams 多选项最多 6 个、Facebook 13 个；Teams 一条回复最多 20 条引用，标题约 80 字符、片段约 480 字符；自定义过的生成式答案在 Teams 不自动带引用。

来源：[Send a message](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-send-message)、[Key concepts - Publish and deploy your agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-fundamentals-publish-channels)、[Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)

#### A3.3 Add tools to a topic

路径同 A3.1：**Add node › Add a tool**，从 Basic tools / Connector / Tool 三个标签选连接器动作、prompt、REST API、MCP 等。工具的详情页有三段：**Details**（Name、Description——编排器靠它决定何时调用；Additional details 里 **Allow agent to decide dynamically when to use the tool**、**Ask the end user before running**（默认 No）、**Authentication** End user / Maker-provided）、**Inputs**（**Fill using**：Dynamically fill with AI 或 Custom value；**Identify as** 选实体；Retry logic；Input validation）、**Completion**。把 Allow agent to decide dynamically 取消勾选，工具就只能被主题（或子 agent 指令）显式调用——这是避免编排器把相似工具搞混的标准做法。限制：生成式编排每个 agent 最多 **128** 个工具，建议 **25–30**；子 agent 有自己独立的 128 上限。被 DLP 封禁的工具在 Add tool 面板中显示为禁用并带信息图标。工具可用 **Enabled** 开关临时停用，删除只能在 agent 的 Tools 页做。

来源：[Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent)、[Use connectors in Copilot Studio agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-connectors)

#### A3.4 Configure advanced agent responses with custom prompts

Prompt 工具（prompt builder，原 AI Builder）是单轮的模型调用：主题里 **Add a tool › New prompt**，agent 级 **Tools › New tool › Prompt**，flow 里 **AI capabilities › Run a prompt**。编辑器里写 Instructions（可让 Copilot 生成或用 prompt library 模板），用 `/` 或 **Add content** 加输入（**Text**、**Image or document**）并填样例值，加 **Knowledge**（Dataverse 表等），选模型（含 Foundry 模型，见 B4.2）、temperature、输出格式（文本或 JSON）、code interpreter，**Test** 后 **Save**。前提：环境在支持区域、有 Copilot Credits、装了 Dataverse。何时用 prompt 而不是直接靠编排器：需要精确控制输出格式/结构（JSON、固定模板）、复杂抽取、特定模型、Dataverse grounding 或文件输入时用 prompt；简单推理和工具选择交给编排器。官方写法建议：具体、给例子、简短（太长导致延迟/超时）、给"出路"。

> **注意** No authentication 的 agent 不能在 prompt 里用 Dataverse 表作知识。在 Power Apps/Power Automate 或主题里建的 prompt 不会出现在 Tools 页（没有被 wrap 成 plugin）。

来源：[Use prompts to make your agent or agent flow perform specific tasks](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-prompt-node)、[Create a prompt](https://learn.microsoft.com/en-us/microsoft-copilot-studio/create-custom-prompt)、[Use agent tools to extend, automate, and enhance your agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-tools)

#### A3.5 Configure advanced agent responses with custom knowledge sources

生成式答案节点的 **Knowledge sources** 段有 **Search only selected sources** 开关：关（默认）= 搜 agent 全部知识源；开 = 只搜勾选的源，**替代**而非追加 agent 级源，且不回退。节点里定义的源优先于 agent 级源。Bing Custom Search、Azure OpenAI、**Custom data** 不能作为知识源勾选，要在 **Classic data** 段配置。Custom data 接受一个 Table 变量，字段 **Content**（必填）、**ContentLocation**（引用 URL）、**Title**；**只用前 3 条记录**生成答案——数据通常来自 flow 或 HTTP 请求返回的 JSON，用 Parse value 转成表。只用自定义数据回答：开 Search only selected sources 但不勾任何源、Custom data 指向变量、关闭 Web search 和 general knowledge。SharePoint 源可在 URL 里插变量动态限定范围（如 `https://.../{GlobalProductURL}`）。更高级的做法是 **OnKnowledgeRequested** 触发器（只能在 YAML 代码视图配）：拿 `System.SearchQuery` / `System.KeywordSearchQuery`（已按多轮上下文重写）调自家搜索 API，把结果整理成 Content/ContentLocation/Title 写入 `System.SearchResults`，最多采用 15 条片段。

来源：[Add a generative answers node](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-boost-node)、[Use a custom data source for generative answers nodes](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-generative-answers-custom-data)、[Connect to custom knowledge sources](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/custom-knowledge-sources)

#### A3.6 Configure advanced agent responses with API and Send HTTP requests

**Add node › Advanced › Send HTTP request**：填 **URL**、**Method**（GET/POST/PATCH/PUT/DELETE），在 **Headers and body › Edit** 加 headers（如 `Authorization: Bearer YOUR_TOKEN`，可用 `User.AccessToken` 变量）和 **Body**（No Content / JSON Content（可切 Formula 用 Power Fx 对象动态生成）/ Raw content）。**Response data type** 选 **From Sample Data › Get schema from sample JSON** 得到带 IntelliSense 的 record 变量，**Save user response as** 存到变量。**Error handling** 默认 **Raise an error**（触发 On Error 系统主题），可改 **Continue on error** 并把 HTTP 状态码和错误体存进变量（错误体类型 Any，用 Parse value 转 record）；**Request timeout** 默认 30 秒（毫秒单位）。DLP 用 **HTTP** 连接器封禁，支持 endpoint filtering。对比 REST API 工具：后者从 OpenAPI v2 规范生成（v3 自动转换）、自带认证配置、生成自定义连接器、可被编排器自动选用并跨 agent 复用；HTTP 节点只在主题里、按步执行、不可复用。

> **考点** "先取数再回答" 的组合是 HTTP request → Parse value → 生成式答案节点 Custom data，或 → Send a message 插变量。"要用用户 token 调 API" 需要 Authenticate manually。

来源：[Make HTTP requests](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-http-node)、[Extend your agent with tools from a REST API](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api)、[Configure data policies for agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-data-loss-prevention)

#### A3.7 Configure generative answers node

**Add node › Advanced › Generative answers** 生成 **Create generative answers** 节点。**Input** 通常选系统变量 `Activity.Text`（也可用别的变量）。**Properties** 面板：**Data sources / Knowledge sources**（Search only selected sources，见 A3.5）、**Classic data**（Bing Custom Search、Azure OpenAI、Custom data）、**Content moderation**（Lowest–Highest，默认 High，节点级优先于 agent 级）、自定义指令字段（prompt modification，8,000 字符）、**Advanced**：取消 **Send a message** 并把答案存到变量（之后用 Adaptive Card 等自定义渲染，Teams 需自己渲染引用），**Save LLM response** 选 **Complete (Recommended)** 可拿到引用元数据（`Topic.Answer.Text.CitationSources`）。classic 编排下每节点限制：4 个网站、4 个 SharePoint URL、2 个 Dataverse 源（各 15 表）、5 个 Azure OpenAI 连接、3 个自定义数据源；生成式编排下 25 个网站/URL，超过 25 个知识源时会先用模型筛选。SharePoint/Dataverse/Copilot connectors 源需用户认证（手动认证时 Microsoft Graph 委托权限 `Files.Read.All`、`Sites.Read.All`）。系统主题 **Conversational boosting** 里的生成式答案节点是没匹配主题时的兜底，agent 级知识源默认都挂在那里。

来源：[Add a generative answers node](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-boost-node)、[Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)、[Use prompt modification to provide custom instructions](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-generative-answers-prompt-modification)

#### A3.8 Configure adaptive cards

两种用法要分清：**展示**信息 → 在 Message/Question 节点 **Add › Adaptive card**；**收集**输入 → **Ask with Adaptive Card** 节点（卡片必须至少有一个 Submit 按钮，Copilot Studio 按卡片里输入控件的 `id` 自动创建输出变量，不对时用 **Edit Schema** 手改）。两处都有内置设计器和 **Card payload editor**（直接贴 JSON）。要绑定变量就在属性面板切到 **Formula**，JSON 自动转成 Power Fx 对象（如 `text: Topic.Title`）——**切换后不能再回 JSON**，先备份。Ask 节点属性：**How many reprompts**（默认 Repeat up to 2 times）、**Retry prompt**、**Allow switching to another topic**（默认允许中断，中断主题结束后重发卡片）。版本：Copilot Studio 支持 schema 1.6 及以下，但 Web Chat 1.6 不支持 `Action.Execute`，Teams 和 Omnichannel 限 1.5，1.6 卡片只在测试聊天渲染；Microsoft 365 Copilot 渠道不支持 `Action.Execute`。连续多张卡片时给每个 `Action.Submit` 的 `data` 加唯一标识（如 `actionSubmitId`）防止旧卡片误提交。

来源：[Adaptive Cards overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/adaptive-cards-overview)、[Ask with Adaptive Cards](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-ask-with-adaptive-card)、[Send a message](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-send-message)

#### A3.9 Manage variables

四个作用域：**Topic**（默认，仅本主题）、**Global**（全部主题，前缀 `Global.`，名字全 agent 唯一，会话结束或 **Clear variable values** 节点/Reset Conversation 系统主题时清空）、**System**（`System.` 前缀，如 `Activity.Text`、`Conversation.Id`、`User.DisplayName`、`Error.Message`、`Recognizer.TriggeringMessage.Text`）、**Environment**（Power Platform 环境变量，Copilot Studio 里**只读**，发布时固化值——改了值要**重新发布**，唯一例外是 **Secret** 类型在运行时读取）。类型 String、Boolean、Number、Table、Record、DateTime、Choice、Blank，首次赋值后类型固定。设值用 **Variable management › Set a variable value**（字面值/变量/Power Fx），**Parse value** 把 JSON 字符串或 `Activity.ChannelData` 这类 untyped 值转成 record（From Sample Data）。跨主题传值：变量属性面板勾 **Receive values from other topics**（目标主题跳过提问）/ **Return values to original topics**，在 Redirect 节点 **Add input** 映射；或在 Topic details 的 Inputs/Outputs 定义主题参数，生成式编排按 **How will the agent fill this input?**（Dynamically fill with the best option / Set as a value）自动填充。全局变量可由外部设值：勾 **External sources can set values**，网页用 `?UserName=Ana` 查询串（不带 `Global.` 前缀），自定义画布发 `pvaSetContext` 事件，可设超时和默认值。

> **易混** 变量名以 `Global.` 开头 → 全局；`Topic.` → 主题；`System.` → 系统；`Env.` → 环境变量。Key Vault 密钥环境变量需给 Microsoft Copilot Studio Service 应用 **Key Vault Secrets User** 角色并打 `AllowedEnvironments` / `AllowedAgents` 标签。

来源：[Variables overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-variables-about)、[Work with variables](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-variables)、[Work with global variables](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-variables-bot)、[Manage topic inputs and outputs](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-managing-topic-inputs-outputs)

## B1. Connect to enterprise knowledge sources {#b1}

B 板块权重最高（40–45%），B1 考三类企业知识源：Copilot connectors（索引型）、Power Platform 连接器实时知识（不搬数据）、Azure AI Search（你自己的向量索引）。三者的核心区别是"数据在哪里、谁来认证、有没有引用"。都在 **Knowledge › Add knowledge** 添加（找不到时点 **Advanced**），也可在生成式答案节点 Properties 里添加。

#### B1.1 Connect to Copilot connectors

Copilot connectors（原 Microsoft Graph connectors）由**租户管理员在 Microsoft 365 admin center** 配置：选预置或自定义连接器、定义 schema、打 **semantic labels**、完成索引，把 ServiceNow、Jira、Confluence、GitHub、Azure DevOps 等外部内容索引进 Microsoft Graph；它尊重源系统 ACL，用户只看到自己有权限的内容。作者在 Copilot Studio **Add knowledge › Advanced** 选该连接 › **Add to agent**。要点：建议租户里有 **Microsoft 365 Copilot 许可证**并开启 **Tenant graph grounding with semantic search**（新界面叫 Turn on Work IQ；要求 Authenticate with Microsoft，按 Copilot Credits 计费）；发布到渠道并使用**手动认证**时 scope 必须含 `ExternalItem.Read.All`；classic 编排每 agent 2 个，生成式不限。适合"大体量、长期不变的知识，要语义检索和引用"。排查：连接器不显示 → 管理员未创建或要点 Advanced；Teams 里能用 Copilot Studio 不能 → 多半是 scope/认证配置。

来源：[Add Copilot connectors as a knowledge source](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-connectors)、[Copilot connectors versus Power Platform connectors](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-graph-vs-power-platform-connectors)、[Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)

#### B1.2 Connect to Microsoft Power Platform connectors

**Add Power Platform connectors as knowledge（预览）**：Copilot Studio 只索引**元数据**（表名、列名），不移动数据；每个问题在运行时用**用户自己的认证令牌**对源系统执行，源系统的访问控制原样保留。支持的实时连接器：Salesforce、ServiceNow、Azure SQL、Azure AI Search、SharePoint、Dataverse、Dynamics 365、Snowflake、Databricks、Zendesk、Confluence（仅 Cloud）、Oracle Database、SAP OData、Google Sheets。步骤：Add knowledge › 选连接器（不在 Featured 就点 **Advanced**）› **Sign in** › 选目标位置 › 选表 › 命名和描述 › 可加 synonyms/glossary（目前只有 ServiceNow 和 Zendesk 支持）› **Add to agent**；状态 **In progress**（索引元数据）→ **Ready**。因为复用 Power Platform 连接，它受同一套 **DLP 策略**管辖。选它的信号：数据"不能复制""必须最新""要做交易"；要大规模语义检索和引用时仍选 Copilot connectors；两者可以在同一个 agent 混用。

> **考点** 共享 agent 时连接是按用户绑定的（如 Databricks Genie），"我能用别人不能用"的原因是对方没有连接——解法：服务主体、环境级连接或让用户各自认证。

来源：[Add Power Platform connectors as knowledge (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-real-time-connectors)、[Copilot connectors versus Power Platform connectors](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-graph-vs-power-platform-connectors)、[Share agents with other users](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-share-bots)

#### B1.3 Connect to Azure AI Search

Add knowledge › **Featured › Azure AI Search › Create new connection**，**Authentication type** 四选一：**Access Key**（填 Azure AI Search Endpoint URL + Admin Key）、**Client Certificate Auth**、**Service principal (Microsoft Entra ID application)**、**Microsoft Entra ID Integrated**；然后选**一个向量索引**（一个连接只能一个索引）› Add to agent。必须通过正式的 data connection 添加，不要手填 endpoint/API key——建错的连接是环境级的，会让对话框打不开且没有删除界面（官方建议重建时用 Entra ID 认证）。索引侧要求：用 Azure AI Search 的 **Import and vectorize data** 做 **integrated vectorization**（这样运行时用同一嵌入模型向量化问题），可开 **semantic ranker**。引用：索引里有 `metadata_storage_path` 字段就当引用 URL，否则取任一完整 URL 字段；用户必须对引用指向的位置有权限。支持 VNet 私有终结点。与 B4.1 的区别：这里是 Copilot Studio 原生检索你的索引；B4.1 是经由 Azure OpenAI "on your data" 连接（Classic data），由 Azure 侧模型检索并回答。

来源：[Add Azure AI Search as a knowledge source](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-azure-ai-search)、[Connect your data to Azure OpenAI for generative answers (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-generative-answers-azure-openai)

## B2. Add tools to agents {#b2}

B2 考四种"非 prebuilt 连接器"的工具：computer use、MCP、自定义连接器、REST API。入口都是 agent 的 **Tools › Add a tool › New tool**（或环境级 **Tools** 页）。考点集中在前提条件（多数要求 generative orchestration）、认证选项的确切名字、背后生成了什么（MCP 和 REST API 都会生成 custom connector，所以都受 DLP 管）以及限制数字。

#### B2.1 Configure and monitor computer use for an agent

Computer use 让 agent 用虚拟鼠标键盘操作 Windows 上的网站和桌面应用（CUA 模型：截图→推理→动作循环），**只在 generative orchestration 开启时可用**。添加：Tools › Add tool › New tool › **Computer use**，必填 **Name**、**Description**、**Model**（OpenAI Computer-Using Agent、Claude Sonnet 4.5 为 GA；用 Anthropic 模型需管理员开 external models）、**Instructions**（写全 URL/应用名，明确"提交、无需确认"）。可选：**Inputs**（每次运行变化的值）、**Machine**（见下）、**Credentials to use**（默认 **Maker-provided credentials**，适合自主 agent；End user credentials 需每个用户有机器权限）、**Human supervision**（检测到可疑指令时邮件通知审核人，超时则停止）、**Stored credentials**（内部加密存储或 Azure Key Vault，按 Login domain / desktop app name 自动登录）、**Access control**（允许列表，只阻止在非允许站点/应用上的操作，不阻止打开）、**Enforce HTTPS**。运行位置：**Hosted browser（预览）**——无需配置但不加入租户、不建议生产、可能限流；**Cloud PC pool（预览）**——Entra joined、Intune 管理、自动扩缩；**Bring-your-own-machine**——装 Power Automate for desktop ≥ 2.61.132.25266 并在 Power Automate › Machines › Settings 开 **Enable for computer use**，同机运行排队执行。监控：agent 的 **Activity** 页选运行，**Transcript** 视图看逐步推理和截图；PPAC 环境 Settings › Features 里 **Store logs in Dataverse**（默认开，保留默认 7 天，详细度 All data / Data without screenshots / Minimal，可选 **Send audit logs to Microsoft Purview**，活动名 `CUAOperation`）。计费：每步 5 Copilot Credits，premium 模型 15。

> **考点** 生产场景选 BYO machine 或 Cloud PC pool，不选 hosted browser；RPA（desktop flows）vs CUA：界面稳定、规则明确、高吞吐选 RPA；界面多变、需要视觉判断选 CUA。

来源：[Automate web and desktop apps with computer use](https://learn.microsoft.com/en-us/microsoft-copilot-studio/computer-use)、[Configure where computer use runs](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-where-computer-use-runs)、[Monitor computer use](https://learn.microsoft.com/en-us/microsoft-copilot-studio/monitor-computer-use)

#### B2.2 Configure MCP tools

MCP server 向 agent 暴露 **tools** 和 **resources**（prompts 暂不支持），服务器提供名称、描述、输入输出，服务器端增删工具会**自动同步**到 Copilot Studio；**需要 generative orchestration**；传输只支持 **Streamable**（SSE 自 2025 年 8 月起不再支持）。推荐用 **MCP onboarding wizard**：Tools › Add a tool › New tool › **Model Context Protocol**，填 **Server name / Server description / Server URL**，认证三选一：**None**；**API key**（Type 为 Header 或 Query，填参数名；由 agent 用户提供 key）；**OAuth 2.0**（**Dynamic discovery**——服务器支持 DCR 且有发现端点、最简单；**Dynamic**——填 Authorization URL、Token URL template；**Manual**——Client ID、Client secret、Authorization URL、Token URL template、Refresh URL、Scopes，并把生成的 callback URL 加到 IdP 应用注册）。随后 **Create a new connection › Add to agent**。另一条路是在 Power Apps 用 OpenAPI YAML 建 custom connector，关键是在 POST `/mcp` 路径上标注 `x-ms-agentic-protocol: mcp-streamable-1.0`。治理：MCP 走 Power Platform 连接器通道，**封禁连接器的 DLP 同样封掉 MCP 工具**。限制：不能给 MCP 工具描述追加"何时调用"的上下文；主题不能直接调 MCP 服务器。还可以用 Microsoft 提供的内置 MCP 连接器（Dataverse、SharePoint、Outlook 等）。

> **考点** 案例里"MCP 服务器要求按用户追溯" → OAuth 2.0；"团队共享一把 key 的只读服务器" → API key。"上游 API 常变、多个 agent 共用" → MCP 而非 REST API 工具。

来源：[Extend your agent with Model Context Protocol](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp)、[Connect your agent to an existing MCP server](https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-add-existing-server-to-agent)、[Use agent tools to extend, automate, and enhance your agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-tools)

#### B2.3 Add a tool by using an existing custom connector

自定义连接器是围绕 REST（或 SOAP）API 的包装，在 Power Apps/Power Automate 用 OpenAPI 定义、Postman 集合或从空白创建，认证支持 No auth、Basic、API Key、Generic OAuth 2.0、Microsoft Entra ID 等；在 Power Automate/Power Apps 建的连接器在 Copilot Studio 都可用，Logic Apps 的不行。在 agent 里：Tools › Add a tool › **Connector** 标签搜到自定义连接器的动作 › 如无连接则 **Create new connection** › **Add and configure**；主题里走 Add node › Add a tool › Connector。要求：**连接器对组织有 view 和 share 权限**才能被 agent 使用；共享连接在 make.powerapps.com › Connections › Share，给 **Can use + share**。凭据默认 **End user credentials**，可在工具 Details › Additional details › **Credentials to use** 改为 Maker-provided（agent 需先是认证渠道）。进阶：Entra ID 自定义连接器可开 **On-Behalf-Of**——连接器 app registration 设 Delegated permissions、Expose an API 加 scope 并授权 Azure API Connections 服务主体（`fe053c5f-3692-4f14-aef2-ee34fc081cae`），Security 页 **Enable on-behalf-of login = true**，用户只需同意一次。ALM：自定义连接器要**先于**含 connection reference 的 agent 解决方案导入。

来源：[Use connectors in Copilot Studio agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-connectors)、[Custom connectors overview](https://learn.microsoft.com/en-us/connectors/custom-connectors/)、[Configure OBO Authentication for custom connectors](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-custom-connector-on-behalf-of)

#### B2.4 Add REST APIs to an agent

**Add tool › New tool › REST API**（预览）五步：上传 **OpenAPI 规范**（必须是 **v2 JSON**，v3 会自动转换）→ 在 **API plugin details** 改写 **Description**（编排器据此决定何时调用，要具体、含同义词）并选 **Solution**（留空会自动建一个）→ **Authentication**：**None** / **API key**（Parameter label、Parameter name、Parameter location Header 或 Query；运行时用户提供 key）/ **OAuth 2.0**（Client ID、Client secret、Authorization URL、Token URL、Refresh URL、Scope，以及 "Which Microsoft 365 organization accesses the endpoints"：My organization only 或 Any Microsoft 365 organizations）→ **Select tools from the API**：只勾需要暴露的 endpoint+method 组合（比如只允许 create 不允许 delete），逐个改 Tool name/description，输入输出的描述为空时必须补全 → **Review** 发布。发布后回到 Add tool › REST API，每个工具一条，分别 **Create connection › Add and configure**。幕后它创建了一个 **custom connector**（Tools 页会同时出现），因此受 DLP 管、可在解决方案里搬运。

> **易混** HTTP request 节点：主题内、无规范、不可复用；REST API 工具：从 OpenAPI 生成、编排器可自动调用、跨 agent 复用；MCP：工具由服务器定义并自动同步。

来源：[Extend your agent with tools from a REST API (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api)、[Use shared tools from the Tools page](https://learn.microsoft.com/en-us/microsoft-copilot-studio/library-add-actions)、[Make HTTP requests](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-http-node)

## B3. Configure multi-agent collaboration from Copilot Studio {#b3}

多 agent 是 B 板块的场景题重灾区。主 agent 的 **Agents** 页可以加两类东西：**child agents**（主 agent 内部的轻量子 agent）和 **connected agents**（独立的外部 agent：同环境的 Copilot Studio agent、Microsoft Foundry agent、Fabric data agent、Microsoft 365 Agents SDK agent、任何支持 A2A 协议的 agent）。编排器按**描述**决定委派给谁，所以每道题的隐藏考点都是"描述要具体且互不重叠"。Foundry、Fabric、Agents SDK 接入目前是 public preview。

#### B3.1 Design multi-agent solutions in Copilot Studio

官方判断标准：**child agent** 用于单一意图/单一任务、一个小团队维护、只是想把工具+指令+知识分组、不需要独立发布/认证/ALM、不需要跨 agent 复用；**connected agents** 用于多个团队独立维护、需要单独发布到渠道、各自的模型等设置、独立 ALM、要被多个主 agent 复用。触发拆分的信号：主 agent 的可选动作（工具+主题+agent）超过 **30–40 个**后选择精度下降，或描述相近导致混淆。代价：每多一层编排就多一跳延迟，测试和治理面扩大。child agent 的配置：**When will this be used?**（默认 The agent chooses – Based on description，也可绑 A message is received、It's redirected to、The user is inactive for a while、A plan completes、An AI-generated response is about to be sent 等事件）、Condition、Priority、Inputs/Outputs、**After running**；每个 child agent 有**独立的 128 工具上限**。主题里可用 **Add an agent** 节点显式重定向到子/连接 agent（Fabric data agent 除外），指令里用 `/` 引用 agent。模式最佳实践：只有父 agent 对用户发话（"single response principle"），子 agent 指令里写明 "You're a subagent. Do NOT reply to the user directly"，每个子 agent 一个不重叠的知识源，描述具体，用 MUST/NEVER 之类强指令。限制：已有 connected agents 的主 agent **不能再作为别人的 connected agent**；没有 connected agents 的 agent 可被多个主 agent 连接。

> **考点** "专家能力没有被稳定委派、主 agent 自己生成回答" → 改子 agent/连接 agent 的 Description 使其具体、互斥，必要时把相似工具设为仅可被 agent 显式调用；"IT 团队已有独立 agent、要复用、要独立发布" → connected agent；"只是想把 5 个相关工具分组" → child agent。

来源：[Add other agents overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents)、[Add a child agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-child-agent)、[Multi-agent orchestration patterns and best practices](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns)

#### B3.2 Integrate a Foundry agent

**Agents › Add an agent › Connect to an external agent › Microsoft Foundry**（预览）：选择或新建到 Foundry 的连接（需要 **Foundry project endpoint URL**）› Next › 填 **Name** 和 **Description**（主 agent 据此判断何时调用）› 填 **Agent Id** › **Add Agent**。前提常考：Foundry agent 必须启用 **Activity protocol** 端点——新建的 Foundry agent 默认只暴露 Responses 和 A2A 端点，Activity 端点目前只能用 REST API 或 Python SDK 以编程方式开启，门户的 Endpoints 列表不会显示它；没开会在运行时报 400（"endpoint does not support activity"）。只能连接**新版 Microsoft Foundry 门户**创建的 agent，旧门户的会报 `404 - Version not found`。连接通过 **Azure AI Foundry Agent Service** 连接器建立。之后可直接在测试面板测试，Agent Id 可在详情页改。微软在页面里强调：连接外部 agent 时数据流、权限边界、可观测性和人工监督由你负责。

来源：[Connect to a Microsoft Foundry agent (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-foundry-agent)、[Add other agents overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents)

#### B3.3 Integrate an existing agent in Copilot Studio

把已有的 Copilot Studio agent 连进来的四个前提：**同一环境**；对方**已发布**；对方的 Settings 里开着 **Let other agents connect to and use this one**（默认开）；你是对方的所有者或对方已共享给你。步骤：Agents › **Add an agent › Connect to an external agent › Copilot Studio** › 选 agent（显示名称、指令、描述）› 调整 **Description**（本地副本，之后对方改描述**不会同步**，需手动更新）› 决定是否勾 **Pass conversation history to this agent**（取消则只传显式任务，减少信息暴露）。连接后主 agent 只使用对方**已发布**的版本——对方改动后必须重新发布。按认证配置不同，可能还要把连接 agent **共享给主 agent 的最终用户**才能在运行时正常工作。Agents 页可用 **Enabled** 开关临时停用，或 **Disconnect agent** 移除。

> **注意** 一个 agent 一旦有了自己的 connected agents，就不能再被另一个主 agent 当作 connected agent（不能多层嵌套 connected）；child agents 嵌套没有这个限制。

来源：[Connect to an existing Copilot Studio agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-copilot-studio-agent)、[Add other agents overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents)

#### B3.4 Integrate a Fabric data agent

Fabric data agent 让用户用自然语言问 Fabric 里的数据（lakehouse、warehouse、semantic model、KQL 数据库），由 Fabric 侧负责查询生成和执行。接入：Agents › **Add an agent › Connect to an external agent › Microsoft Fabric**（预览）› 选择或新建到 Fabric 的连接 › Next › 从你有权访问的 Fabric data agents 列表里选 › 调整 Description 使其具体（例如"回答服务积压、SLA 风险、配件短缺等运营指标问题"），否则主 agent 可能用生成式答案自己回答而不委派。限制要背：**不能**用主题里的 Redirect 节点显式重定向到 Fabric data agent，**不能**在指令里用 `/` 引用它；主 agent 发布到 **Microsoft 365 Copilot** 时 Fabric data agent 不工作；**agent evaluation 不支持** Fabric data agents。治理数据、行级安全由 Fabric 侧的语义模型/工作区权限决定，用户需要在 Fabric 有相应权限。

> **考点** 题干"按治理过的 Fabric 语义模型返回最新运营指标、结构化输出" → Fabric data agent（connected），而不是把数据再索引进知识源。

来源：[Connect to a Microsoft Fabric Data agent (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-fabric-data-agent)、[Add other agents overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents)、[About agent evaluation](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-intro)

#### B3.5 Create a multi-agent solution by using A2A protocol

**Agent2Agent (A2A)** 是跨框架的开放标准：主 agent 可以把**任务**委派给外部 agent（不只是调 API），支持多轮、携带结构化元数据。适用场景：对方 agent 在别的框架/别的宿主、有自己的领域推理，并且已经实现 A2A；如果只是普通 API 用 custom connector/HTTP 工具，MCP 工具用 MCP，Agents SDK agent 用 Activity Protocol。步骤：Agents › **Add agent › A2A agent** › 填 **Endpoint URL**（是消息端点，不是 agent card 的 URL；若 端点 URL 后加 `/.well-known/agent.json` 有有效 agent card，Name 和 Description 会自动填充，否则手填）› **Authentication**：**None** / **API key**（header 或 query 参数名）/ **OAuth 2.0**（client ID、client secret、authorization URL、token URL、refresh URL）› Save › 选或建连接 › **Add and configure**。A2A 消息的 `metadata` 里带 `copilotstudio.microsoft.com/a2a/chathistory`（完整对话历史）、`contextId`、locale。因为底层是 custom connector 基础设施，也能连本地或 VNet 内的 A2A agent。反向地，Copilot Studio agent 也可以通过 MCP/A2A 渠道被其他客户端调用。

来源：[Connect to an agent over the Agent2Agent (A2A) protocol](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-agent-to-agent)、[Add other agents overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents)

## B4. Integrate agents with Azure {#b4}

B4 三条都是"Copilot Studio 之外的 Azure 资源怎么接"：Azure OpenAI/Foundry + Azure AI Search 做生成式答案、Foundry 模型目录给 prompt 工具用、Application Insights 做遥测。考点在于区分"原生知识源 vs Classic data 的 Azure OpenAI 连接""内置模型 vs 自带模型""agent 级 vs 环境级遥测"。

#### B4.1 Configure generative answers by using Azure AI Search with Foundry

这是 **Azure OpenAI on your data**（预览）路径：在 Microsoft Foundry 的 Azure OpenAI Service 里把数据源（Azure AI Search 索引）连到模型，然后 **Deploy to › A new Microsoft Copilot Studio bot**，会在默认环境创建一个 agent 并自动连接 Azure 资源，同时生成 **Conversational boosting** 系统主题。在任意主题的生成式答案节点里：Properties › Data source › **Classic data** › **Add connection** 建到 Azure OpenAI Service 的连接 › **Connection properties** 配模型和数据参数 › Save。节点里的源优先于 agent 级源。classic 编排的 Conversational boosting 最多 5 个 Azure OpenAI 连接；生成式编排下 Azure OpenAI 不能作为 agent 级知识源勾选，只能在节点 Classic data 里用。与 B1.3 的原生 Azure AI Search 知识源对比：原生方式由 Copilot Studio 直接查你的向量索引并生成引用，支持四种认证和 VNet；Azure OpenAI 路径把检索+生成交给 Azure 侧部署的模型，适合已经在 Foundry 里调好 "on your data" 配置、想复用的团队。

> **易混** 题目说"Azure AI Search 索引 + Copilot Studio 原生检索" → Add knowledge › Azure AI Search（B1.3）；说"通过 Azure OpenAI/Foundry 的 on your data 连接" → 生成式答案节点 Classic data（本条）。

来源：[Connect your data to Azure OpenAI for generative answers (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-generative-answers-azure-openai)、[Add Azure AI Search as a knowledge source](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-azure-ai-search)、[Add a generative answers node](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-boost-node)

#### B4.2 Configure custom prompts to use the Foundry model catalog

Prompt 工具默认带一组托管模型，也可"自带模型"：在 prompt 编辑器右侧 **Model** 下拉点 **+** › **Connect a model from Azure AI Foundry**，填 **Model deployment name** 和 **Base model name**（必须与 Foundry 中完全一致）以及端点和密钥 › **Connect**；之后该模型出现在 Model 下拉，每次运行此 prompt 都用它。支持范围：Foundry 模型目录中 **chat completion** 类型的模型（Llama、DeepSeek、Phi、GPT-4.5 等 1,800+），**Azure model endpoint URL 必须是 `/chat/completions` 端点**（用 `/openai/v1/responses` 会报 Resource not found）；**GPT-5 系列及更新的模型目前不支持** BYOM。有图片/文档输入时下拉只显示支持图像的模型（Phi-3.5-vision-instruct、Phi-4-multimodal-instruct、o1、GPT-4o、GPT-4o-mini、GPT-4、GPT-4.5-preview 等）。治理：这些模型通过连接器接入，PPAC 数据策略里的连接器名为 **Azure AI Foundry**，可单独设策略；RAI 策略建议在 Foundry 侧配置。Copilot Studio 不原生支持图像生成，需把 Foundry 模型（如 DALL·E 3）包成 REST API 调用。

来源：[Bring your own model for your prompts](https://learn.microsoft.com/en-us/microsoft-copilot-studio/bring-your-own-model-prompts)、[Use prompts to make your agent or agent flow perform specific tasks](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-prompt-node)、[Use agent tools to extend, automate, and enhance your agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-tools)

#### B4.3 Monitor agents by using Application Insights

**Agent 级遥测**（standard harness）：agent 的 **Settings › Advanced › Application Insights** 填 **Connection string**，可选 **Enable logging**、**Log conversation details**（用户 ID、名称、消息文本）、**Log sensitive Activity properties**、**Node execution events**（每个节点执行记一条）。数据进 `customEvents` 表，用 KQL 查询，`customDimensions` 含 `type`、`channelId`（directline、msteams、webchat）、`text`、`designMode`（排除测试面板会话：`where customDimensions['designMode'] == "False"`）。Application Insights 的 **Workbooks › Copilot Studio Dashboard** 提供总会话、延迟、异常、工具使用、主题分析的内置视图。禁止 maker 启用：DLP 封禁 **Application Insights in Copilot Studio** 连接器。**环境级遥测**（预览）：管理员在 PPAC 为 **Managed Environment** 建 **Copilot Studio** 类型的 export package，所有 agent 的 `InvokeAgent`、`ExecuteTool`、`OutputMessages` span 写入 `dependencies` 表，遵循 OpenTelemetry GenAI 语义约定（`gen_ai.conversation.id`、`gen_ai.tool.name` 等），支持 GitHub Copilot harness；不记录 TopicStart/TopicEnd 这类主题事件，不支持匿名/多租户 agent。ALM 注意：Application Insights 设置**不是 solution-aware**，部署后要在目标环境重配。

> **考点** "单个 agent 排错、要看主题/节点事件" → agent 级（customEvents）；"平台团队统一观测全环境、要工具调用链路" → 环境级（dependencies，需 Managed Environment）；官方建议别把两者送进同一个 Application Insights 实例。

来源：[Agent-level telemetry with Application Insights](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-bot-framework-composer-capture-telemetry)、[Telemetry with Application Insights overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/telemetry-overview)、[Environment-level telemetry with Application Insights (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-environment-level-agent-telemetry)

## C1. Evaluate agent performance {#c1}

Agent evaluation 在 agent 的 **Evaluation** 页：用 **test set**（一组 test case）批量跑问题、对比预期、打分。它和 test chat 互补——test chat 一次一问、能走完整多轮会话；evaluation 可重复、可批量、可对比两次运行。评估**以当前登录用户的身份运行**（要换用户就登出重登），只支持 **No authentication** 或 **Authenticate with Microsoft** 的 agent（Authenticate manually 不支持），不支持 Fabric data agents。结果保留 **89 天**，要长期保存就导出 CSV。也可通过 Power Platform API 或 **Microsoft Copilot Studio** 连接器把评估放进 CI/CD。

#### C1.1 Create a test set

**Evaluation › New evaluation**，先选类型：**Single responses**（每个 case 一个独立问题，最多 **100** 个 case，适合测具体问题、调用了哪些能力、措辞）或 **Conversation**（多轮，最多 **20** 个 case，每个最多 **12** 条消息即 6 对问答，测上下文保持、追问、多步任务）。生成方式：**Quick question set**（按 agent 描述/指令/能力自动生成 10 个问题）、**Full question set**（基于 **Knowledge sources**——适合生成式编排，或 **Topics**——适合 classic，自定数量）、**Use your test chat conversation**、从 Monitor 的 **Themes** 生成（真实用户问题）、**Import** CSV/TXT（表头 **Question**、**Expected response**；≤100 行，每问 ≤1,000 字符；Expected response 可选但 match/similarity/compare meaning 方法必须有）、手写。生成用的文件 ≤5 MB，SharePoint 只支持单个文件不支持文件夹。然后命名、**Add test method**（除 General quality 外都需要预期答案或关键词）、**Additional configuration › Manage** 检查当前用户的连接。**Save** 只保存，**Run/Evaluate** 立即运行。生成失败常见原因是问题触发了 agent 的内容审核。

来源：[Create a single response test set](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-create)、[Create a conversational test set](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-multi-turn)、[About agent evaluation](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-intro)

#### C1.2 Choose an evaluation method

一个 test set 可同时用多种方法；带分数的方法要设 **pass score**。

| 方法 | 测什么 | 适用 | 评分 | 需要配置 |
|---|---|---|---|---|
| **General quality** | 相关性、groundedness、完整性、是否作答（abstention） | 单轮/多轮 | 0–100% | 无（默认方法） |
| **Content safety** | hate/unfairness、sexual、violence、self-harm | 单轮/多轮 | 通过/失败 | 内容类型、允许严重度 0–7，每类单独加 |
| **Compare meaning** | 语义是否与预期一致（措辞可不同） | 单轮 | 0–100%，默认 pass 50 | 预期答案 |
| **Tool use** | 是否调用了预期工具/主题 | 单轮 | 通过/失败 | 预期工具 |
| **Keyword match** | 是否含关键词（Any / All） | 单轮/多轮 | 通过/失败 | 关键词 |
| **Text similarity** | 措辞/结构相似度（余弦） | 单轮 | 0–1 分数设阈值 | 预期答案 |
| **Exact match** | 逐字完全一致 | 单轮 | 通过/失败 | 预期答案 |
| **Custom** | 你写的评估指令 + 标签 | 单轮/多轮 | 标签映射通过/失败 | 名称、指令、≥2 个标签 |

选法：没有标准答案、开放问答 → General quality；有答案但可换说法 → Compare meaning；法律/合规文本必须措辞一致 → Text similarity；短编码/数字/固定短语 → Exact match；"必须走某个 flow/主题" → Tool use；"应当拒答"的 case 用 Custom（General quality 会因为 abstention 把拒答判低）；合规/语气/品牌检查 → Custom。GCC 环境不支持 Text similarity 和 user profile。

来源：[Choose evaluation methods](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-overview)、[About agent evaluation](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-intro)

#### C1.3 Review test results

运行时结果**逐条实时**出现，可随时停止；一次只能跑一个评估。每个 case 得到 **Pass / Fail / Invalid**（该方法缺预期答案）/ **Error**，test set 得到 **Pass rate**（按 Pass/Fail 计算）。在 **Recent results** 打开一次运行：按 All/Pass/Fail 过滤，点 case 看预期 vs 实际回复、判定理由、使用的知识/主题/工具，**Show activity map** 查看编排过程；每个交互还显示 **Response time**（端到端秒数，仅度量不影响通过率）。**Compare with** 下拉选同一 test set 的另一次运行，箭头标出由败转胜或由胜转败的 case，Evaluation summary 并排显示分数。**Export test results** 导出 CSV（问题、预期、方法、pass score、实际回复、结果、分析）。顶栏 **Review** 面板会在没有评估或模型变更后提醒重新评估（不阻止发布）。权限：只有发起运行的 maker 能看回复和解释，其他 maker 看状态和指标；用 **Agent viewer** 共享角色让 SME 只访问 Evaluation 页（可运行/重命名/取消/删除，不能改 test set 或 agent）；使用用户认证的评估依赖 **Microsoft Copilot Studio** 连接器，被 DLP 封禁则无法运行。改完 agent 后用同一 test set 重跑并对比——这就是题目里"迭代"的标准答案。

来源：[Run evaluations and view results](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-results)、[Share agents with other users](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-share-bots)、[Design a testing strategy for your agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/sec-gov-phase4)

## C2. Implement application lifecycle management (ALM) for agents in Copilot Studio {#c2}

ALM 的黄金规则：只在开发环境改东西；永远在解决方案上下文里工作；用自定义 publisher 和前缀；环境间变化的设置用环境变量；向非开发环境部署 **managed** 解决方案；尽量自动化。Copilot Studio 里几样东西**不是 solution-aware**，部署后要在目标环境手动补：Application Insights 设置、手动认证设置、Direct Line/Web channel security、已连接的渠道、共享。考纲四条：建解决方案、把 agent 加进去、环境变量、pipelines（含扩展）。

#### C2.1 Create a solution

Copilot Studio 侧栏 **… › Solutions** 打开解决方案资源管理器（新标签页，权限继承自用户的安全角色，至少 **System Customizer**）。**New solution** 填 **Display name**、**Name**（保存后不可改）、**Publisher**（建议新建自己的：Display name、Name、**Prefix**、Choice value prefix；默认 publisher 的前缀是随机的如 `cr8a3`，且组件进了 managed 解决方案后不能换 publisher）、**Version**，可勾 **Set as your preferred solution**——之后新建的 agent 自动落到这个解决方案而不是 Common Data Services Default Solution。agent 默认在 default solution 里，要跨环境搬运就必须用自定义解决方案。managed vs unmanaged：开发环境用 **unmanaged**（源码），导出时选 **Managed** 作为部署产物；managed 组件不能直接编辑、卸载时连同数据一起删除；**managed 解决方案不能再导出**；同一环境不能既有 unmanaged 源又导入它的 managed 版本。大小上限 95 MB。更新方式 Update / Upgrade（升级会删除新版本中不再包含的组件）/ Patch。

来源：[Create and manage custom solutions](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-overview)、[Create a solution in Power Apps](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-solution)、[Solution concepts with Power Platform](https://learn.microsoft.com/en-us/power-platform/alm/solution-concepts-alm)

#### C2.2 Add existing agents to a solution

打开自定义解决方案 › **Add existing › Agent › Agent** › 勾选 agent › **Add**。之后每次给 agent 新增主题、flow 等，都要在解决方案里对 agent **… › Advanced › Add required objects** 把依赖补齐；flows 和环境变量也各自 Add required objects；环境变量不在时 **Add existing › More › Environment variable**。自定义连接器要按 [Create custom connectors in solutions] 的方式加入，并且**先导入自定义连接器，再导入含 connection reference 的 agent 解决方案**。导出 **Export solution** 选 Managed/Unmanaged 和版本号；导入在目标环境 **Import solution**，过程中会提示填 connection references 和环境变量值；失败时 **Download log file**，最常见原因是缺依赖。导入后：在解决方案 Objects › Agents 打开 agent，**重新配置用户认证**，必须**重新发布**才能共享，图标最多 24 小时后显示，渠道需重接。不会迁移的：Conversation ID、CDS Bot ID、Environment ID、主题/节点注释、图标与渠道详情。禁忌：不要直接从解决方案里删 agent 的组件（导致导入导出失败）；主题名含句点 `.` 的 agent 无法导出；从解决方案移除 agent 不会移除其组件。组件超多（>250 主题或 >100 实体）用经典导出。

来源：[Export and import agents using solutions](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-import-export)、[Create and manage custom solutions](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-overview)、[Establish an ALM strategy](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/alm)

#### C2.3 Create and use environment variables

环境变量是解决方案组件，由 **definition**（含 **Default Value**）和 **value**（**Current Value**，每个定义一个）组成，在 Power Apps 解决方案里 **New › More › Environment variable** 创建，类型 **Decimal number、Text、JSON、Two options（Yes/No）、Data source、Secret**（Secret 需配置 Azure Key Vault）。ALM 用法：定义随 managed 解决方案走，值在目标环境提供——导入解决方案或跑 pipeline 时会提示填值（已有值时标注来源：solution value / target environment value / default value）；导出前对 Current Value 选 **… › Remove from this solution**，这样开发环境保留值、目标环境可以填新值。在 Copilot Studio 里环境变量**只读**（`Env.` 前缀），可在 Variables 面板查看并跳转到 Power Apps 编辑；发布时值被固化，管理员改值后必须**重新发布** agent，**Secret 类型例外**（运行时读取）。Key Vault 密钥要把 **Key Vault Secrets User** 角色给 *Microsoft Copilot Studio Service*，并在密钥上打 `AllowedEnvironments`（环境 ID）或 `AllowedAgents`（`{envId}/{schemaName}`）标签，值缓存 5 分钟。其他限制：值最长 2,000 字符；`$authentication`、`$connection` 是 flow 保留名；更新后 apps/flows 最多 1 小时生效；Data source 类型（SharePoint site/list、SQL server/database）与 connection reference 不同——连接存凭据，数据源变量存参数。

> **考点** "Dev/Test/Prod 的 SharePoint 站点 URL 不同" → Data source/Text 环境变量 + 知识源 URL 里插变量；"API key 不能出现在解决方案里" → Secret 环境变量（Key Vault）。

来源：[Use environment variables in Power Platform solutions](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables)、[Variables overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-variables-about)、[Work with variables](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-variables)

#### C2.4 Implement and extend Microsoft Power Platform Pipelines

**Pipelines** 是 Power Platform 内置的 CI/CD：管理员在 **host** 环境安装 **Power Platform Pipelines** 应用，用 **Deployment Pipeline Configuration** 应用（需 **Deployment Pipeline Administrator** 角色）建 pipeline、按顺序加 **stages**（如 Test → Prod），关联 **Development Environment** 和 **Target Environment**；目标环境必须是 **Managed Environments**（host 不必；开发/QA 可用 Developer 类型），2026 年 10 月起向非托管目标部署会被提醒并在期限后阻止。maker 体验：在开发环境的 **unmanaged** 解决方案里选 **Pipelines › Deploy here**（或 Overview › Deploy），选 **Now** 或 **Later**，系统做预检（缺依赖等），提示填 connection references 和环境变量值，加 deployment notes，**Deploy**。规则：pipeline 只在开发环境、unmanaged 解决方案里可见；部署的是 **managed** 产物；同一产物必须按 stage 顺序走，不能跳过 QA；每次部署自动把 managed/unmanaged 包存在 host；默认导入行为是 Upgrade；不能跨租户。Copilot Studio 的解决方案资源管理器里 **Pipelines** 入口可直接用。

**扩展**（gated extensions，在 stage 上勾选）：**Pre-export step required**（提交部署请求后、导出前插入自定义校验，只对第一个 stage 启用）、**Is delegated deployment**（以 **Service Principal** 或 **Stage Owner** 身份部署，需审批；maker 不需要目标环境权限；SP 需在 host 有 Deployment Pipeline Administrator、在目标环境有 System Administrator，且配置者必须是该企业应用的 owner）、**Pre-deployment step required**（审批后、部署前再插一步）。实现用 host 环境里的 Power Automate 云流：触发器 Dataverse **When an action is performed**（Catalog: Microsoft Dataverse Common，Category: Power Platform Pipelines），动作名 `OnDeploymentRequested`（所有部署都触发）、`OnApprovalStarted`、`OnApprovalCompleted`、`OnPreDeploymentStarted`、`OnPreDeploymentCompleted`、`OnDeploymentStarted`、`OnDeploymentCompleted`；处理完后用 **Perform an unbound action** 调 `UpdatePreExportStepStatus` / `UpdateApprovalStatus` / `UpdatePreDeploymentStepStatus`，状态 **20 = 完成/批准、30 = 拒绝**（10 是系统的 pending），可附 ApprovalComments 给 maker 看；`UpdateApprovalStatus` 必须用被委派的服务主体/所有者的连接调用，否则报错。用 trigger conditions 按 `DeploymentPipelineName` / `DeploymentStageName` 过滤。

> **考点** "部署到生产前必须经审批、maker 不能有生产权限" → Is delegated deployment + OnApprovalStarted 审批流；"部署前跑 solution checker 之类校验" → Pre-export step required + UpdatePreExportStepStatus；"需要跨租户或更复杂的源码管理" → Azure DevOps / GitHub Actions（pipelines 可与之集成）。

来源：[Overview of pipelines in Power Platform](https://learn.microsoft.com/en-us/power-platform/alm/pipelines)、[Extend pipelines in Power Platform](https://learn.microsoft.com/en-us/power-platform/alm/extend-pipelines)、[Deploy pipelines as a service principal or pipeline owner](https://learn.microsoft.com/en-us/power-platform/alm/delegated-deployments-setup)、[Run pipelines in Power Platform](https://learn.microsoft.com/en-us/power-platform/alm/run-pipeline)
