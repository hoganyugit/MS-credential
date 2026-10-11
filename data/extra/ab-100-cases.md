---
exam: AB-100
---

## Case: Meridian Cold Chain Logistics {#meridian}
#### Background
Meridian Cold Chain Logistics is a European third-party logistics (3PL) provider that moves temperature-controlled pharmaceutical and food freight for 400 shipper customers. The company runs Microsoft Dynamics 365 Sales for its account managers and a model-driven Power Apps app named Cold Chain Operations, built on Microsoft Dataverse, for its dispatch and claims teams.

Meridian executives have approved an agentic AI program. Four workloads were selected for the first phase: a Tender Desk assistant for account managers, a Claims Desk agent for the claims team, a Dispatch Exceptions agent for the control tower, and a damage-code classifier for drivers' handheld devices. Meridian is at an early stage of its AI journey and has not built AI solutions before, but it has operated a Cloud Center of Excellence (CCoE) for Azure for three years.

#### Current environment
##### Data sources
- **Dataverse:** The Cold Chain Operations app stores shipments, lanes, temperature excursions, and carrier claims. Claims records are created manually today by supervisors who read carrier emails.
- **Dynamics 365 Sales:** Opportunities, quotes, and account records. Sellers use Copilot in Dynamics 365 Sales from the Sales Hub app.
- **SharePoint:** The Rate Cards and Contracts site holds tender templates, rate cards, and master service agreements. The Product Specifications and Price Lists folders on the Sales site hold Word, Excel, PowerPoint, and PDF documents.
- **Reefer telemetry:** Trailer temperature readings land in Microsoft Fabric every minute. An excursion event is raised when a reading leaves the configured range.
- **Carrier correspondence:** Subcontracted carriers send claim notifications, proofs of delivery, and damage reports as emails with PDF attachments to a shared mailbox.
- **Damage notes:** 3,000 historical free-text damage notes that drivers typed on handheld devices, each labeled by a supervisor with one of the 40 internal damage codes.
- **Claims-handling SOP:** A 3 MB PDF standard operating procedure that the claims team follows.

##### Apps and platforms
- **Microsoft 365:** Microsoft 365 E5 with Microsoft 365 Copilot licenses for account managers and the claims team.
- **Power Platform:** A production environment located in the Western Europe region, Copilot Studio, and Dataverse.
- **Microsoft Foundry:** A Foundry project in Sweden Central with access to Foundry Models and Foundry Agent Service.
- **Developer tooling:** The CTO's team works in Visual Studio Code with the Power Platform CLI (PAC CLI) and GitHub Copilot CLI, and deploys through an Azure DevOps pipeline.

##### Identity and access
- All employees are in a single Microsoft Entra ID tenant. Sellers hold the Salesperson security role, and claims supervisors hold a custom Claims Supervisor security role.
- Drivers use ruggedized Windows handheld devices. Cold rooms and reefer trailers have no network connectivity for long periods.
- Carriers are external parties and have no accounts in the Meridian tenant.

#### Business requirements
The following executives have specific responsibilities in the AI program:

- **Chief Executive Officer (CEO):** Prevent fragmented or ungoverned AI adoption across business units without creating unnecessary organizational complexity or standalone teams.
- **Chief Financial Officer (CFO):** Pay frontier-model prices only for the prompts that need them, and avoid per-token cloud charges on the handheld devices.
- **Chief Information Security Officer (CISO):** Maintain an approved list of AI models, and ensure that no request is ever served by a model that is not on the list.
- **Chief Operating Officer (COO):** Keep claims supervisors in control of every claim record that an agent proposes.
- **Chief Technology Officer (CTO):** Let developers build with code-first tooling in their local IDE, and automate regression testing of agents before each monthly release.

Meridian has identified the following business requirements:

- Account managers must be able to @mention the Tender Desk assistant in Microsoft Teams chats and ask it questions in Microsoft 365 Copilot Chat while they draft tender responses in Word and Outlook.
- The Tender Desk assistant must answer only from the Rate Cards and Contracts SharePoint site, must be used by individual account managers who start each interaction, and must be delivered in the shortest time with low-code tooling.
- Sellers who ask Copilot in Dynamics 365 Sales for product documents must get answers only from the Product Specifications and Price Lists SharePoint folders, not from every SharePoint folder that the seller can access.
- Claims supervisors must review, correct, and accept each claim record that the Claims Desk agent proposes from a carrier email inside the Cold Chain Operations app. Claim records must never be created without that review.
- When the Claims Desk agent cannot decide, for example when two carrier documents contradict each other, it must hand the task to a supervisor and wait for the supervisor's decision before it continues.
- Supervisors must also be able to ask the Claims Desk agent questions about the claims-handling SOP from the app.
- A lane profitability page in the Cold Chain Operations app must show margin by lane across six Dataverse tables.
- Drivers must classify a free-text damage note into one of the 40 internal damage codes on the handheld device while offline, and the output must always be exactly one code from the internal taxonomy.
- The legal team's contract clause review must always use the highest-quality model available for each prompt, regardless of cost.

#### Technical requirements
Meridian has identified the following technical requirements:

- The Tender Desk assistant must run on the orchestrator and foundation models of Microsoft 365 Copilot and must not require any additional hosting outside Microsoft 365.
- The Claims Desk agent must be built in Copilot Studio as an autonomous agent that is triggered when an email arrives in the shared mailbox, and it must be configured to Authenticate with Microsoft.
- The Dispatch Exceptions agent must be built in Foundry Agent Service, must start proactively from each excursion event without a user prompt, must use custom orchestration with tools that read carrier emails and PDF attachments, and must route each request through a single model deployment.
- For the Dispatch Exceptions agent, each request must be served by the most cost-effective model whose quality is within one to two percent of the best model for that prompt, and if a model is unavailable the request must transparently fail over to another approved model.
- All model routing must reach only the models on the CISO's approved list, and newly released models must not be used until the CISO adds them.
- The lane profitability page must be generated from natural language as TypeScript and React code that developers can edit in Visual Studio Code with IntelliSense and deploy with PAC CLI, and it must work although the Power Platform environment is in Western Europe.
- The damage-code classifier must be trained from the 3,000 labeled damage notes so that it follows the internal taxonomy consistently, must run on the handheld device, and must incur no per-token cloud cost.
- Before each monthly release, the Claims Desk agent must be regression-tested with at least 80 questions derived from the claims-handling SOP without the QA team writing the questions. The same test set must be reused release over release so that scores are comparable, and the evaluation must be triggered from the Azure DevOps pipeline.

#### Security and compliance requirements
Meridian has identified the following security and compliance requirements:

- Hidden instructions embedded in carrier emails or PDF attachments must be detected and blocked before the Dispatch Exceptions agent acts on content returned by its tools.
- Attempts by users to override the Dispatch Exceptions agent's instructions or change its persona must be detected and blocked at the user input.
- Agent-to-model and agent-to-tool communication must authenticate with non-human identities that store no credentials, and must not traverse the public internet.
- Model and dataset artifacts must be protected from theft and poisoning.
- Copilot in Dynamics 365 Sales must only show documents that the signed-in seller has permission to read in SharePoint.
- Governance policies, security standards, compliance checklists, and adoption KPIs for the AI program must be owned by a single accountable team.

#### Issues and constraints
- **Region:** The Power Platform environment is in Western Europe, where the in-browser generative page experience in the Power Apps designer is not available.
- **Connectivity:** Handheld devices lose connectivity for hours inside cold rooms and trailers.
- **Claims desk workload:** Supervisors currently spend four hours a day re-keying carrier emails into claim records, and two incorrect claims were paid last quarter because of typing errors.
- **AI maturity:** Meridian has no data scientists, and the CCoE has no AI expertise yet.
- **Adoption risk:** Two business units have started building their own agents without any governance, standards, or shared assets.

#### Problem statement
Meridian needs an architecture for the four first-phase workloads that reuses Microsoft 365 Copilot where it fits, builds custom agents only where proactive behavior or custom models are required, keeps supervisors in control of agent output, protects the agents from prompt manipulation, controls model cost and model approval, and establishes the organizational structure that stops ungoverned AI adoption.

### S101 type=single kp="Microsoft 365 Copilot extensibility" sk=A2.7 case=meridian
You need to recommend how to build the Tender Desk assistant to meet the business and technical requirements.

What should you recommend?

- A. Build a custom engine agent in Foundry Agent Service and publish it to Microsoft 365 Copilot.
- *B. Extend Microsoft 365 Copilot with a declarative agent that adds the Rate Cards and Contracts SharePoint site as knowledge.
- C. Build a custom engine agent in Copilot Studio that uses a fine-tuned model and publish it to the Microsoft Teams channel.
- D. Configure the Rate Cards and Contracts SharePoint folders as knowledge sources for Copilot in Dynamics 365 Sales.

> why: 决定性的需求是"必须运行在 Microsoft 365 Copilot 的 orchestrator 和 foundation models 上、不需要额外 hosting、个人发起、Teams @mention 和 Copilot Chat 中使用、低代码最快交付"，这正是 Learn 上 declarative agent 的适用条件（复用 Copilot 的编排与模型，继承 Microsoft 365 的合规与 RAI，用 Agent Builder 或 Copilot Studio 低代码构建，在 Teams/Word/Outlook 中运行）。A 和 C 都是 custom engine agent：需要自带 orchestrator/模型、额外 hosting，并自行负责合规，只有在需要主动触发、自定义模型或复杂编排时才值得（那是 Dispatch Exceptions agent 的情况）。D 只在 Dynamics 365 Sales 应用内生效，账户经理无法在 Teams 或 Copilot Chat 中使用。
> ref: https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agents-overview
> ref: https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/strategy

### S102 type=multi kp="Governance, security & compliance" sk=C4.4,C4.3 case=meridian
You need to design the security of the Dispatch Exceptions agent to meet the security and compliance requirements. Which two actions should you include in the design? Each correct answer presents part of the solution.

NOTE: Each correct selection is worth one point.

- *A. Create a Foundry guardrail that adds the user prompt attack control at the user input intervention point and the document attack control at the tool response intervention point, and assign the guardrail to the agent.
- B. Enable Spotlighting in the guardrail of the agent so that tool responses are tagged as lower-trust content.
- *C. Use managed identities for the agent's connections to its model deployment and tools, and deploy Foundry Agent Service with private networking in a virtual network.
- D. Apply Microsoft Purview sensitivity labels to the carrier PDF attachments before the agent reads them.
- E. Set the Violence and Hate controls to Low in the guardrail of the underlying model deployment so that the agent inherits stricter filtering.

> why: 两条需求分别对应两类控制。(1) 隐藏在 carrier 邮件/PDF 里的指令是 indirect prompt injection（document attack），用户改写指令是 user prompt attack；Prompt Shields 在 Foundry 中以 guardrail control 的形式配置，document attack 扫描 user input 和 tool response 两个 intervention point，而且 agent 的风险检测以分配给 agent 的 guardrail 为准（会完全覆盖模型的 guardrail），所以必须把 guardrail 分配到 agent 上。(2) "非人类身份、不存凭据、不走公网"对应 CAF Secure AI 的 managed identities 和 Foundry Agent Service 的 private networking。B 错：Spotlighting 只适用于 Chat Completions 的模型，对 agent 不生效（Learn 的适用表标为不支持）。D 错：敏感度标签做数据分类与 DLP，不能检测注入指令。E 错：Violence/Hate 是内容伤害类别而非注入检测，且 agent 不继承模型部署的 guardrail。
> ref: https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection
> ref: https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview
> ref: https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/secure

### S103 type=select kp="Dynamics 365 Copilot features" sk=B1.9,B1.3 case=meridian
You need to design the in-app experiences for the claims team and the sellers to meet the business and technical requirements.

What should you include in the design for each requirement? To answer, select the appropriate options in the answer area.

NOTE: Each correct selection is worth one point.

```area
{"kind":"select","title":"Answer area","head":["Requirement","Design element"],"blocks":[{"type":"row","label":"Supervisors review and accept the claim records that the Claims Desk agent proposes, inside the Cold Chain Operations app, and the agent waits for a supervisor when it cannot decide","options":["Add the Power Apps MCP server as a tool of the agent and add the agent to the agent feed of the app","Configure the agent as the app assistant agent of the app","Embed the agent in a canvas app by using the Copilot control"],"answer":"Add the Power Apps MCP server as a tool of the agent and add the agent to the agent feed of the app"},{"type":"row","label":"The lane profitability page is generated as TypeScript and React code that developers edit in Visual Studio Code and deploy with PAC CLI, in the Western Europe environment","options":["A generative page created with AI code generation tools","A generative page created in the Power Apps designer at make.powerapps.com","A custom page created in the canvas app designer"],"answer":"A generative page created with AI code generation tools"},{"type":"row","label":"Copilot in Dynamics 365 Sales answers sellers' document questions only from the Product Specifications and Price Lists folders","options":["Configure SharePoint locations under Knowledge sources in the Copilot settings of the Sales Hub app","Add a Microsoft 365 Copilot connector for SharePoint","Add the folders as a knowledge source of a Copilot Studio agent"],"answer":"Configure SharePoint locations under Knowledge sources in the Copilot settings of the Sales Hub app"}]}
```

> why: 第 1 行：COO 要求"人工审核后才能建记录、agent 卡住时等待主管"，这是 agent feed 的两种 human-in-the-loop 模式——Copilot Studio 自主 agent 通过 Power Apps MCP server 的 invoke_data_entry（记录绝不自动创建，主管在 feed 中 Accept and complete）和 request_assistance（任务进入 Needs attention，agent 等待回调）把任务发到模型驱动应用的 agent feed；app assistant agent 只提供聊天主题，Copilot control 是画布应用的聊天控件，都没有审批任务流。第 2 行：Learn 明确 in-browser generative page 只在美国、英国、澳大利亚、新加坡可用，而 AI code generation tools（GitHub Copilot CLI/Claude Code + PAC CLI）的 code-first 方式全球公有云可用、生成 TypeScript/React 并支持 npm install 与 IntelliSense；custom page 是画布设计器，不是生成式页面。第 3 行：Copilot in Dynamics 365 Sales 默认搜索卖家能访问的所有 SharePoint 文件夹，要限定范围需在 Sales Hub 的 App Settings > Copilot > Knowledge sources 配置 SharePoint locations；Microsoft 365 Copilot connector 和 Copilot Studio 知识源都不影响 Sales 应用内的 Copilot。
> ref: https://learn.microsoft.com/en-us/power-apps/user/supervise-agents-with-agent-feed
> ref: https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/generative-page-external-tools
> ref: https://learn.microsoft.com/en-us/dynamics365/sales/copilot-sharepoint-config

### S104 type=match kp="Agent architecture & orchestration" sk=A3.4,A2.8,A2.10 case=meridian
You need to recommend a model strategy for each workload to meet the business, technical, and CISO requirements.

Which model strategy should you recommend for each workload? To answer, drag the appropriate model strategy to the correct workload. Each model strategy may be used once, more than once, or not at all.

NOTE: Each correct selection is worth one point.

```area
{"kind":"match","poolTitle":"Model strategies","pool":["A model router deployment in Balanced mode with a model subset","A model router deployment in Quality mode with a model subset","A model router deployment in Cost mode with a model subset","A small language model fine-tuned on the labeled damage notes and run on the device with Foundry Local","The orchestrator and foundation models of Microsoft 365 Copilot","Retrieval-augmented generation over Azure AI Search with a general-purpose model"],"title":"Workloads","head":["Workload","Model strategy"],"blocks":[{"type":"row","label":"Dispatch Exceptions agent: one deployment, the most cost-effective model within one to two percent of the best quality for each prompt, automatic failover, only approved models","answer":"A model router deployment in Balanced mode with a model subset"},{"type":"row","label":"Damage-code classifier: offline on the handheld, always exactly one of the 40 internal codes, trained from 3,000 labeled notes, no per-token cost","answer":"A small language model fine-tuned on the labeled damage notes and run on the device with Foundry Local"},{"type":"row","label":"Tender Desk assistant: answers from the Rate Cards and Contracts site with no additional hosting","answer":"The orchestrator and foundation models of Microsoft 365 Copilot"},{"type":"row","label":"Legal contract clause review: the highest-quality model for each prompt regardless of cost, only approved models","answer":"A model router deployment in Quality mode with a model subset"}]}
```

> why: Model router 是单一部署内按每个请求实时选模型的 optimization layer：Balanced（默认）在与最优模型相差 1–2% 的质量带内选最省钱的模型，Cost 把质量带放宽到 5–6%，Quality 不计成本选最高质量；model subset 是 Learn 推荐的 compliance gate——只路由到 CISO 批准的模型、新模型不显式加入就不会被用，同时 subset 也是 failover 集合（至少两个模型）。手持设备的分类任务满足"何时该做自定义模型"的条件：有 3,000 条标注数据、要求输出严格遵循内部 taxonomy、需要低成本低延迟，fine-tuning overview 列出的收益正是 specialize a smaller model、align style and structure、reduce prompt overhead；而离线、零 per-token 成本、数据不离设备是 Foundry Local 的典型场景（用 Olive 编译的 ONNX 模型可在 Foundry Local 运行）。Tender Desk assistant 是 declarative agent，直接用 Microsoft 365 Copilot 的 orchestrator 和模型，不需要自定义模型；RAG over Azure AI Search 需要联网且不满足"无额外 hosting"。
> ref: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-router-how-it-works
> ref: https://learn.microsoft.com/en-us/azure/foundry/fine-tuning/overview
> ref: https://learn.microsoft.com/en-us/azure/foundry-local/what-is-foundry-local

### S105 type=single kp="Frameworks & methodologies" sk=A2.12 case=meridian
You need to recommend an organizational structure that meets the CEO's requirement and the governance requirement for the AI program.

What should you recommend?

- A. Create a standalone AI Center of Excellence that reports to the CISO and operates from the start as an advisory group that only publishes guardrails.
- *B. Integrate AI expertise and practices into the existing Cloud Center of Excellence, run it as a centralized AI Center of Excellence during the initial phase, and move it to an advisory model as adoption matures.
- C. Deploy the Microsoft Power Platform Center of Excellence Starter Kit and assign its dashboards to the two business units that are already building agents.
- D. Distribute AI experts into each business unit's product team immediately and let the frontline teams own the AI standards.

> why: CAF 的 AI Center of Excellence 指南与案例需求逐条对应：AI CoE 的目的就是防止 fragmented or ungoverned AI adoption；如果已经有 Cloud Center of Excellence，应把 AI 实践与专家融入该团队，只有现有团队无法支撑时才建独立团队（CEO 的"不要不必要的复杂度与独立团队"）；处于 AI 早期阶段的公司应先 centralized 以集中专业能力与基础实践，成熟后再转为 advisory；其职责表（define and enforce AI standards、develop reusable assets 如 compliance checklists、measure and report outcomes 如 adoption KPIs）正是"由单一团队负责治理策略、安全标准、合规清单和采用 KPI"。A 和 D 都是成熟阶段的 advisory/分散模式，过早采用会让刚起步的组织失去控制与一致性。C 是 Power Platform 环境与应用治理的工具包，不是组织级 AI CoE。
> ref: https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/center-of-excellence
> ref: https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/plan

### S106 type=single kp="Testing & quality" sk=C2.5 case=meridian
You need to recommend a test strategy for the Claims Desk agent that meets the CTO's requirement and the technical requirements for regression testing.

What should you recommend?

- A. On the Evaluation page of the agent, create a Quick question set and run it from the pipeline before each release.
- *B. On the Evaluation page of the agent, generate a Full question set from the claims-handling SOP knowledge source, save the test set, and trigger the evaluation runs from the pipeline by using the Power Platform REST API.
- C. Have the QA team export the latest test chat conversation to a test set before each release and run it manually in Copilot Studio.
- D. On the Monitor page of the agent, create a test set from a theme in the analytics and run it before each release.

> why: 需求是"至少 80 个源自 SOP 的问题、QA 不手写、同一测试集跨版本复用、从 pipeline 触发"。Copilot Studio agent evaluation 的 Full question set 用 agent 的 knowledge source（支持 Text、Word、Excel、PDF、单个 SharePoint 文件，≤5 MB）或 topics 生成测试用例并可选择数量（一个 test set 最多 100 条），保存后同一 test set 可反复运行以得到可比的分数，并且评估可通过 Power Platform REST API 或连接器在 CI/CD pipeline 中触发；案例中 agent 使用 Authenticate with Microsoft，正好满足评估只支持 No authentication 或 Authenticate with Microsoft 的限制。A 错：Quick question set 只根据 agent 的 description/instructions 生成 10 个问题，不基于 SOP 且不足 80 条。C 错：test chat 来源于人工对话、无法复用且是手动运行。D 错：Themes 来自生产用户的真实提问，发布前不存在、也不源自 SOP。
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-create
> ref: https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-intro
