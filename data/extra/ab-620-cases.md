---
exam: AB-620
---

## Case: Tailspin Insurance {#tailspin}
#### Background
Tailspin Insurance is a Seattle-based property and casualty insurer that sells home and auto policies directly to consumers. The company handles first notice of loss (FNOL), claim status inquiries, and coverage questions through its website, its mobile app, and a team of 400 claims adjusters.

Tailspin Insurance is building two agents in Microsoft Copilot Studio:

- **Policy Assistant:** an external agent for policyholders and prospects that answers coverage questions, reports a loss, and shows claim status.
- **Adjuster Desk:** an internal agent for claims adjusters that looks up claims, reports claims metrics, and summarizes coverage guidance.

The project is led by a platform team that owns environments, data policies, and monitoring, and by two maker teams that own the agents. The legal and compliance team oversees privacy, retention, and eDiscovery.

#### Current environment
##### Channels
- **Public website:** Policy Assistant is embedded in pages of tailspin.com.
- **Mobile app:** The native iOS and Android app renders its own chat UI and gets a Direct Line token from the agent's token endpoint.
- **Microsoft Teams and Microsoft 365 Copilot:** Adjusters use Adjuster Desk in Teams and by @mentioning it in Microsoft 365 Copilot chat.
- **Prebuilt demo site:** Product owners try the published Policy Assistant before each release.

##### Identity and access
- Policyholders sign in with Tailspin ID, the company's consumer identity provider, which is a standard OAuth 2.0 provider.
- Adjusters sign in with Microsoft Entra ID and are members of the Claims Adjusters security group.
- Adjuster Desk is currently configured with Authenticate manually and the Generic OAuth 2 provider.
- Policy Assistant is configured with Authenticate manually and the Generic OAuth 2 provider, with Require users to sign in turned off.

##### Environments
- **Tailspin-Customer:** the Power Platform environment that hosts Policy Assistant.
- **Tailspin-Internal:** the Power Platform environment that hosts Adjuster Desk.
- Each environment has its own Dev and Test environments and a managed release process.

##### Data sources
- **ClaimsCore:** the claims system, exposed as a REST API through an approved custom connector.
- **Coverage guides:** a SharePoint library of coverage guides, exclusions, and claims handling procedures.
- **Claims Performance:** a Microsoft Fabric workspace with a semantic model used by claims leadership. A Fabric data agent named Claims Metrics is published over the model with a detailed description.
- **tailspin-agents-ai:** an Azure Application Insights resource owned by the operations team.

##### Integration mechanisms
- The custom connector must be used for ClaimsCore.
- The SharePoint library must be used as a knowledge source for coverage guidance.
- Metric questions must be delegated to the Claims Metrics Fabric data agent.
- No custom code is permitted in topics; only Copilot Studio nodes and Power Fx formulas may be used.

#### Business requirements
- Prospects must be able to ask general coverage questions on the website without signing in.
- Claim status and reporting a loss require the policyholder to sign in with Tailspin ID, and calls to ClaimsCore must use the signed-in policyholder's token.
- Only members of the Claims Adjusters security group may chat with Adjuster Desk.
- Adjuster Desk must be available in Teams and in Microsoft 365 Copilot, and must not be reachable from the website, the mobile app, or any other Direct Line channel.
- Adjuster Desk must greet each adjuster by display name without asking for it.
- Loss ratio and open claim count questions must be answered from the Claims Performance semantic model, limited to the data each adjuster is permitted to see in Fabric, and must not be answered generatively from documents.
- Product owners must be able to try the published Policy Assistant on a prebuilt page before release; that page must never be shared with customers.

#### Technical requirements
- The Report a loss topic must collect the loss date and a description on a single card, pre-fill the policy number already captured earlier in the conversation, and make the submitted values available to the topic as variables.
- The card must render in Teams and in the website chat.
- After a policyholder signs in on tailspin.com, the website already knows the policy number. Policy Assistant must use that value in every topic without asking for it, and must wait no more than three seconds for it before continuing with a default value.
- Coverage summaries on the website must use bold headings and bulleted lists.
- The Policy Assistant greeting must not read identically from one session to the next, and no extra topics may be added for it.
- Policyholders must be able to see which coverage guide an answer came from.

#### Compliance and security
- Makers in Tailspin-Internal must not be able to publish agents that allow anonymous chat.
- Makers in Tailspin-Internal must not be able to publish agents to the website, the mobile app, or any other Direct Line channel.
- Both restrictions must be enforced centrally by administrators in the Power Platform admin center, not by instructions to makers.
- The compliance team must be able to preserve and export adjuster prompts and responses from Microsoft Purview.
- Transcripts of customer conversations may be viewed only by the privacy team.
- Sensitive activity properties must not be logged to Application Insights.

#### Monitoring
- The operations team must see the number of distinct adjusters per channel per day in Azure, excluding conversations from the Copilot Studio test pane.
- The operations team must see total conversations, latency, exceptions, and tool usage in Azure without writing queries.

#### Issues and constraints
- **Blocked Teams channel:** The Teams and Microsoft 365 Copilot channel for Adjuster Desk shows as blocked, and adjusters cannot install the agent.
- **Metric questions in Microsoft 365 Copilot:** When adjusters ask loss ratio questions through Microsoft 365 Copilot, the answer is generated from the coverage guides instead of coming from the Fabric data agent.
- **Repeated policy number prompts:** Policy Assistant asks for the policy number in every topic, even though the website already passed it.
- **Static intake card:** The Report a loss card shows fixed text, the policy number is not pre-filled, and the submitted loss date is not available after the card.

#### Problem statement
Tailspin Insurance must deliver one external agent and one internal agent that respect the different identity, channel, and data exposure rules of each audience. Administrators must enforce the governance rules centrally, the internal agent must answer metric questions from governed Fabric data, and operations must be able to monitor both agents in Azure. You are the solution architect responsible for correcting the configuration to meet the preceding requirements and constraints.

### S101 type=single kp="Security, authentication & governance" sk=A1.7,A1.2 case=tailspin
You need to configure authentication for Adjuster Desk to meet the identity and access requirements and resolve the blocked Teams channel.

What should you do?

- A. Select No authentication, add the Teams and Microsoft 365 Copilot channel, and rely on Teams to identify the adjuster.
- *B. Select Authenticate with Microsoft, then share the agent with the Claims Adjusters security group with the User - can use the agent permission.
- C. Keep Authenticate manually with the Generic OAuth 2 provider, turn on Require users to sign in, and share the agent with the Claims Adjusters security group.
- D. Select Authenticate with Microsoft, then share the agent with Everyone in Tailspin Insurance.

> why: 文档明确 Teams + Microsoft 365 渠道只支持 Authenticate with Microsoft，选其它选项该渠道就会 blocked——这正是 Adjuster Desk 当前用 Generic OAuth 2 导致的问题；Authenticate with Microsoft 下用户始终已登录，可以用 agent sharing 控制组织内谁能聊，所以把 agent 共享给 Claims Adjusters 安全组即满足"只有调解员能聊"。No authentication 让任何拿到链接的人都能聊且违反 Tailspin-Internal 的合规要求；Generic OAuth 2 即使开了 Require users to sign in 也无法用 sharing 限定具体用户，且渠道仍被阻止；共享给 Everyone 违反"仅安全组成员"。
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-share-bots

### S102 type=match kp="Channels & publishing" sk=A1.3,A1.7 case=tailspin
You need to connect the two agents to the channels described in the current environment and business requirements.

Which channel should you use for each requirement? To answer, drag the appropriate channel to each requirement. Each channel may be used once, more than once, or not at all.

```area
{"kind":"match","poolTitle":"Channels","pool":["Teams and Microsoft 365 Copilot","Custom website","Mobile app","Demo website","SharePoint"],"title":"Requirements","head":["Requirement","Channel"],"blocks":[{"type":"row","label":"Adjusters use Adjuster Desk in Teams and by @mentioning it in Microsoft 365 Copilot chat.","answer":"Teams and Microsoft 365 Copilot"},{"type":"row","label":"Policyholders chat with Policy Assistant inside pages of tailspin.com.","answer":"Custom website"},{"type":"row","label":"The native iOS and Android app renders its own chat UI and gets a Direct Line token from the agent's token endpoint.","answer":"Mobile app"},{"type":"row","label":"Product owners try the published Policy Assistant on a prebuilt page that is never shared with customers.","answer":"Demo website"}]}
```

> why: Teams and Microsoft 365 Copilot 渠道加上 Make agent available in Microsoft Copilot 让 agent 同时出现在 Teams 和 Microsoft 365 Copilot（可 @ 调用）；嵌入自己网站页面用 Custom website 渠道的代码片段；原生/自定义应用走 Mobile app 渠道，从 Token Endpoint 取 Direct Line token 后用 Direct Line API 对话；Demo website 是发布后自动生成的预置测试站，文档明确"不用于生产、不要把 URL 分享给客户"。SharePoint 渠道与任何需求无关。
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-fundamentals-publish-channels
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-connect-bot-to-custom-application
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-connect-bot-to-web-channels

### S103 type=select kp="Security, authentication & governance" sk=A1.5,A1.7 case=tailspin
You need to implement the compliance and security requirements for the two environments.

Which action should you take for each requirement? To answer, select the appropriate option for each requirement.

NOTE: Each correct selection is worth one point.

```area
{"kind":"select","title":"Answer area","head":["Requirement","Action"],"blocks":[{"type":"row","label":"Prevent makers in Tailspin-Internal from publishing agents that allow anonymous chat","options":["Block the Chat without Microsoft Entra ID authentication in Copilot Studio connector in a data policy scoped to Tailspin-Internal","Turn on Require users to sign in on each agent in Tailspin-Internal","Block the Microsoft Teams + Microsoft 365 Channel in Copilot Studio connector in a data policy scoped to Tailspin-Internal"],"answer":"Block the Chat without Microsoft Entra ID authentication in Copilot Studio connector in a data policy scoped to Tailspin-Internal"},{"type":"row","label":"Prevent makers in Tailspin-Internal from publishing agents to the website, the mobile app, or any other Direct Line channel","options":["Block the Direct Line channels in Copilot Studio connector in a data policy scoped to Tailspin-Internal","Block the SharePoint channel in Copilot Studio connector in a data policy scoped to Tailspin-Internal","Ask makers to remove the Custom website and Mobile app channels before publishing"],"answer":"Block the Direct Line channels in Copilot Studio connector in a data policy scoped to Tailspin-Internal"},{"type":"row","label":"Let the compliance team preserve and export adjuster prompts and responses from Microsoft Purview","options":["Create an eDiscovery case and search for items whose ItemClass is IPM.SkypeTeams.Message.Copilot.Studio.*","Turn on Log conversation details in the agent's Application Insights settings","Assign the Bot Transcript Viewer security role to the compliance team"],"answer":"Create an eDiscovery case and search for items whose ItemClass is IPM.SkypeTeams.Message.Copilot.Studio.*"},{"type":"row","label":"Ensure that only the privacy team can view transcripts of customer conversations","options":["Keep Policy Assistant in the separate Tailspin-Customer environment and assign the Bot Transcript Viewer security role there only to the privacy team","Share Policy Assistant with the privacy team for collaborative authoring","Block the Microsoft Copilot Studio connector in a data policy scoped to Tailspin-Customer"],"answer":"Keep Policy Assistant in the separate Tailspin-Customer environment and assign the Bot Transcript Viewer security role there only to the privacy team"}]}
```

> why: 案例要求两条限制必须由管理员在 Power Platform admin center 集中强制，所以都用 data policy：阻止 "Chat without Microsoft Entra ID authentication in Copilot Studio" 连接器后 maker 只能选 Authenticate with Microsoft 或 Authenticate manually；阻止 "Direct Line channels in Copilot Studio" 连接器同时覆盖 Demo website、Custom website、Mobile app 等所有 Direct Line 渠道（SharePoint 连接器只管 SharePoint 渠道，口头要求 maker 不算集中强制）。Purview 文档给出 eDiscovery 用 ItemClass = IPM.SkypeTeams.Message.Copilot.Studio.* 检索 Copilot Studio 交互并导出；Application Insights 和 Bot Transcript Viewer 都不是 Purview。转录访问由环境级安全角色决定——Bot Transcript Viewer 能看该环境所有 agent 的转录，文档建议"为 agent 创建单独环境"来控制谁能看，这正是 Tailspin-Customer 单独环境的用途。
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-data-loss-prevention
> ref: https://learn.microsoft.com/en-us/purview/ai-copilot-studio
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-share-bots

### S104 type=multi kp="Topics & conversation design" sk=A3.8,A3.9 case=tailspin
You need to fix the static intake card in the Report a loss topic so that it meets the technical requirements. The policy number is already stored in a variable named Topic.PolicyNumber earlier in the topic.

Which two actions should you perform? Each correct answer presents part of the solution.

NOTE: Each correct selection is worth one point.

- *A. Add an Ask with Adaptive Card node whose card contains Input.Date and Input.Text fields and an Action.Submit button, so that Copilot Studio creates output variables from the inputs.
- B. Add an Adaptive card to a Message node, then add a Question node that identifies the user's entire response.
- *C. In the Adaptive Card node properties, switch from JSON to Formula and set the policy number field's value to Topic.PolicyNumber.
- D. In the card payload editor, type {Topic.PolicyNumber} as the value of the policy number field in the JSON literal.
- E. Set the card schema version to 1.6 and use Action.Execute so that the card renders in Teams and in the website chat.

> why: 交互式卡片（用户要提交数据）必须用 Ask with Adaptive Card 节点，至少含一个 submit 按钮，Copilot Studio 会根据卡片里的 input 自动创建输出变量，所以提交的 loss date 之后在主题里可用；Message 节点上的卡片只用于展示，不能收集输入。要把已有变量放进卡片，需在节点属性里切到 Formula，JSON 会被转换成 Power Fx 公式后直接引用 Topic.PolicyNumber——JSON 字面量里写 {Topic.PolicyNumber} 只是字符串。Teams 只支持 1.5 版 schema，Web Chat 不支持 Action.Execute，E 反而让卡片在两个渠道都无法正常渲染。
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-ask-with-adaptive-card
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/adaptive-cards-overview

### S105 type=select kp="Topics & conversation design" sk=A3.2,A3.9 case=tailspin
You need to configure the responses of Policy Assistant and Adjuster Desk to meet the business and technical requirements.

Which action should you take for each requirement? To answer, select the appropriate option for each requirement.

NOTE: Each correct selection is worth one point.

```area
{"kind":"select","title":"Answer area","head":["Requirement","Action"],"blocks":[{"type":"row","label":"The Policy Assistant greeting must not read identically from one session to the next, without adding topics","options":["Add message variations to the greeting Message node","Add quick replies to the greeting Message node","Add a speech override to the greeting Message node"],"answer":"Add message variations to the greeting Message node"},{"type":"row","label":"Coverage summaries on the website must use bold headings and bulleted lists","options":["Use Markdown formatting in the Message node","Insert HTML heading and list tags in the Message node","Add the summary as an image in the Message node"],"answer":"Use Markdown formatting in the Message node"},{"type":"row","label":"Policyholders must be able to see which coverage guide an answer came from","options":["Answer from the SharePoint knowledge source with a standard generative answers node so that citations are included","Paste the SharePoint library URL at the end of every Message node","Add a basic card that names the library"],"answer":"Answer from the SharePoint knowledge source with a standard generative answers node so that citations are included"},{"type":"row","label":"Adjuster Desk must greet each adjuster by display name without asking for it","options":["Insert the User.DisplayName variable into the greeting Message node","Insert the User.AccessToken variable into the greeting Message node","Add a Question node that identifies a Person name before the greeting"],"answer":"Insert the User.DisplayName variable into the greeting Message node"}]}
```

> why: Message 节点加 message variations 后每次触发随机选一条，不需要新主题；Message 节点工具栏提供 Markdown 式基本格式（bold、bullet、numbered），渠道对照表里 Website 对 Markdown 是 Supported，案例也禁止 HTML/自定义代码；标准（未自定义）的 generative answers 回答会自动附带 citations 指向来源文档，手工贴链接或 basic card 不是来源引用。Authenticate with Microsoft 下 User.DisplayName 可用、User.AccessToken 不可用，而且文档警告不要把 AccessToken 放进 Message 节点；再问一次名字违反"不询问"要求。
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-send-message
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-fundamentals-publish-channels
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-end-user-authentication

### S106 type=select kp="Testing, evaluation & analytics" sk=B4.3,B3.4 case=tailspin
You need to configure Adjuster Desk so that metric questions and monitoring meet the technical, compliance, and monitoring requirements.

Which action should you take for each requirement? To answer, select the appropriate option for each requirement.

NOTE: Each correct selection is worth one point.

```area
{"kind":"select","title":"Answer area","head":["Requirement","Action"],"blocks":[{"type":"row","label":"Answer loss ratio and open claim questions from the Claims Performance semantic model, limited to the data each adjuster may see in Fabric","options":["On the Agents page add the Claims Metrics Fabric data agent as a connected agent and set its authentication to User authentication","On the Agents page add the Claims Metrics Fabric data agent as a connected agent and set its authentication to Agent author authentication","Add the Claims Performance semantic model as a knowledge source"],"answer":"On the Agents page add the Claims Metrics Fabric data agent as a connected agent and set its authentication to User authentication"},{"type":"row","label":"Loss ratio questions asked through Microsoft 365 Copilot are answered from the coverage guides instead of by the Fabric data agent","options":["Have adjusters ask metric questions in Teams, because a connected Fabric data agent is not supported in Microsoft 365 Copilot","Add a Redirect node in a topic that points to the Fabric data agent","Switch Adjuster Desk to classic orchestration"],"answer":"Have adjusters ask metric questions in Teams, because a connected Fabric data agent is not supported in Microsoft 365 Copilot"},{"type":"row","label":"Send Adjuster Desk telemetry to tailspin-agents-ai without logging sensitive activity properties","options":["In Settings > Advanced > Application Insights, enter the connection string and turn on Enable logging","In Settings > Advanced > Application Insights, enter the connection string and turn on Log sensitive Activity properties","Block the Application Insights in Copilot Studio connector in a data policy scoped to Tailspin-Internal"],"answer":"In Settings > Advanced > Application Insights, enter the connection string and turn on Enable logging"},{"type":"row","label":"Count distinct adjusters per channel per day, excluding test pane conversations","options":["customEvents | where customDimensions['designMode'] == 'False' | summarize dcount(user_Id) by bin(timestamp, 1d), tostring(customDimensions['channelId'])","dependencies | summarize count() by bin(timestamp, 1d)","customEvents | where customDimensions['channelId'] == 'emulator' | summarize dcount(user_Id) by bin(timestamp, 1d)"],"answer":"customEvents | where customDimensions['designMode'] == 'False' | summarize dcount(user_Id) by bin(timestamp, 1d), tostring(customDimensions['channelId'])"},{"type":"row","label":"Show total conversations, latency, exceptions, and tool usage in Azure without writing queries","options":["Open the Copilot Studio Dashboard workbook under Monitoring > Workbooks in the Application Insights resource","Open the Analytics page of the agent in Copilot Studio","Create a Power BI report over the Dataverse conversation transcript table"],"answer":"Open the Copilot Studio Dashboard workbook under Monitoring > Workbooks in the Application Insights resource"}]}
```

> why: Fabric data agent 以 connected agent 形式从 Agents 页 Add an agent → Microsoft Fabric 接入，连接后可在 additional details 里选 User authentication（按每个用户在 Fabric 的权限查询）或 Agent author authentication（人人看到作者能看的数据，违反"限于各自权限"），语义模型不能作为知识源；Fabric 文档明确"带 connected Fabric data agent 的自定义 agent 目前不支持 Microsoft 365 Copilot，仅在 Teams 验证过"，而 Redirect 节点不能指向 agent、classic orchestration 根本不会调用连接的 agent。Application Insights 在 Settings > Advanced 填 Connection string 并打开 Enable logging 即记录进出消息和事件，Log sensitive Activity properties 违反合规要求，阻止连接器则完全无法发遥测。所有事件都在 customEvents 表且带 designMode 自定义维度，用 where 排除测试面板再按 channelId 分组 dcount(user_Id)；Copilot Studio Dashboard workbook 直接提供总会话、延迟、异常、工具使用等视图，Copilot Studio 自带 Analytics 页不在 Azure 里。
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-fabric-data-agent
> ref: https://learn.microsoft.com/en-us/fabric/data-science/data-agent-microsoft-copilot-studio
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-bot-framework-composer-capture-telemetry
