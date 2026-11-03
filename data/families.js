// One question that ExamTopics lists several times with different choice sets: a family. Hand-maintained.
//
// Every listing stays a question of its own, graded on its own reviewed answer (data/reviewed.js); this file says how
// the answers of a family relate, so the app can show it once you have answered (and guide chapter 7 can print it).
//   kind    "ladder": the sets have different answers; "same": every set has the same answer.
//   rungs   the options that are ever the answer, best first. A set's answer is its highest-ranked offered option,
//           its two highest for a "Which two" question. Options in one rung are interchangeable: no set offers two
//           of them, so whichever one a set offers is its answer. Each ladder rung has a one-line why and the
//           Microsoft Learn page (ref) it rests on.
//   never   the options that are never the answer, in any set.
//   short   shorter labels for long options, used by the choice-set table and the guide.
//   topic   what the question asks, in Chinese, for the guide; note: anything else the reader should know.
// Option texts match a choice after trimming, lowercasing and straightening quotes. tools/check_families.py checks
// every family against data/bank.js and data/reviewed.js; run it after editing this file or rebuilding the bank.
window.FAMILIES = [
  {
    "exam": "AB-100",
    "n": [25, 33, 39, 44],
    "ids": [994142, 999649, 1012339, 1012344],
    "kind": "ladder",
    "topic": "清洗 agent 摄入的数据",
    "rungs": [
      {"options": ["Identify and address biased data", "Identify and address missing or inconsistent data"], "why": "Biased or incomplete data makes AI output misleading; each option is a fix that makes the data clean.", "ref": "https://learn.microsoft.com/en-us/training/modules/build-effective-generative-ai-solutions-organization/4-build-trustworthy-ai-data-security-considerations"}
    ],
    "never": ["Create a workflow in Microsoft Power Automate", "Create an agent flow in Microsoft Copilot Studio", "Sort the database by customer last name", "Ensure that the size of the database does not exceed 100 GB", "Translate the data into a single language", "Verify data privacy and security compliance"],
    "short": {"Identify and address biased data": "Address biased data", "Identify and address missing or inconsistent data": "Address missing or inconsistent data", "Sort the database by customer last name": "Sort by last name", "Ensure that the size of the database does not exceed 100 GB": "Keep it under 100 GB", "Translate the data into a single language": "Translate to one language", "Verify data privacy and security compliance": "Verify privacy compliance", "Create a workflow in Microsoft Power Automate": "Power Automate workflow", "Create an agent flow in Microsoft Copilot Studio": "Copilot Studio agent flow"}
  },
  {
    "exam": "AB-100",
    "n": [28, 34, 35, 36, 37, 38],
    "ids": [994145, 999650, 999651, 999652, 1012337, 1012338],
    "kind": "ladder",
    "topic": "部署前估算方案成本（ROAI）",
    "rungs": [
      {"options": ["Azure pricing calculator"], "why": "Estimates the cost of planned Azure services before anything is deployed.", "ref": "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/pricing-calculator"},
      {"options": ["Total Cost of Ownership (TCO) Calculator"], "why": "Compared on-premises costs with Azure, a migration estimate. Learn now lists it as retired, and #28's vote is split with Cost Management + Billing.", "ref": "https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/3-compare-pricing-total-cost-of-ownership-calculators"},
      {"options": ["Cost Management + Billing"], "why": "Analyzes, monitors and forecasts the Azure costs you are already incurring, so it measures rather than estimates.", "ref": "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/overview-cost-management"}
    ],
    "never": ["Microsoft Fabric SKU Estimator", "Azure Reservations", "Azure Monitor", "Azure savings plans", "Anomaly Detection in Azure Cost Management"],
    "short": {"Total Cost of Ownership (TCO) Calculator": "TCO Calculator", "Anomaly Detection in Azure Cost Management": "Anomaly Detection", "Microsoft Fabric SKU Estimator": "Fabric SKU Estimator"}
  },
  {
    "exam": "AB-100",
    "n": [40, 41, 42, 43, 104, 116, 126],
    "ids": [1012340, 1012341, 1012342, 1012343, 984487, 994172, 999657],
    "kind": "ladder",
    "topic": "多 channel Copilot Studio agent 的全面遥测",
    "rungs": [
      {"options": ["Application Insights"], "why": "Copilot Studio logs every conversation's events, custom events included, to Application Insights.", "ref": "https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-bot-framework-composer-capture-telemetry"},
      {"options": ["Log Analytics"], "why": "The workspace where Application Insights stores that telemetry for queries; it holds the data rather than collecting it.", "ref": "https://learn.microsoft.com/en-us/azure/azure-monitor/app/create-workspace-resource"},
      {"options": ["the Analytics tab in Copilot Studio"], "why": "Now the Monitor page: built-in agent metrics such as sessions, outcomes and satisfaction, not raw telemetry.", "ref": "https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-overview"}
    ],
    "never": ["Azure DevOps", "Microsoft Power BI", "Microsoft Dynamics 365 Customer Voice", "Microsoft Purview", "Azure Advisor"],
    "short": {"the Analytics tab in Copilot Studio": "Analytics tab (Copilot Studio)", "Microsoft Dynamics 365 Customer Voice": "Customer Voice"}
  },
  {
    "exam": "AB-620",
    "n": [2, 52],
    "ids": [1020430, 1007812],
    "kind": "ladder",
    "topic": "让 prompt 驱动的回复用 approved model（选两项）",
    "rungs": [
      {"options": ["Ensure the reusable instruction template is the one applied to the agent that generates the structured response"], "why": "The reusable prompt's instructions are what the agent runs to generate the structured response.", "ref": "https://learn.microsoft.com/en-us/microsoft-copilot-studio/create-custom-prompt"},
      {"options": ["Select an approved model from the Microsoft Foundry model catalog in the configuration that is used for prompt-driven response generation"], "why": "The prompt's Model field picks the model it runs, Microsoft Foundry models included.", "ref": "https://learn.microsoft.com/en-us/microsoft-copilot-studio/bring-your-own-model-prompts"},
      {"options": ["Add a line to the instruction template that requires the agent to use only approved models when generating responses"], "why": "Instruction text does not select the model, which is set in the Model field; the fallback when that option is missing.", "ref": "https://learn.microsoft.com/en-us/microsoft-copilot-studio/prompt-model-settings"}
    ],
    "never": ["Configure Azure AI Search as the grounding source so the approved model requirement is enforced during response generation", "Publish the agent so that the model used by prompt-driven responses is updated automatically", "Enable citations so generated responses can be traced and comply with governance requirements"],
    "short": {"Ensure the reusable instruction template is the one applied to the agent that generates the structured response": "Apply the reusable instruction template", "Select an approved model from the Microsoft Foundry model catalog in the configuration that is used for prompt-driven response generation": "Select an approved catalog model", "Add a line to the instruction template that requires the agent to use only approved models when generating responses": "Add an 'approved models only' line", "Configure Azure AI Search as the grounding source so the approved model requirement is enforced during response generation": "Azure AI Search as grounding", "Publish the agent so that the model used by prompt-driven responses is updated automatically": "Publish to update the model", "Enable citations so generated responses can be traced and comply with governance requirements": "Enable citations"}
  },
  {
    "exam": "AB-620",
    "n": [54, 66, 73, 79],
    "ids": [1007814, 1007826, 1021110, 1021116],
    "kind": "ladder",
    "topic": "让 agent 调用外部 MCP server 的工具",
    "rungs": [
      {"options": ["Add the MCP server to the agent's tool configuration", "Configure authentication for the MCP server connection used by the agent"], "why": "Both are steps of adding the MCP server as a tool, whose connection carries the API key or OAuth 2.0 sign-in.", "ref": "https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-add-existing-server-to-agent"}
    ],
    "never": ["Upload documentation about the MCP server so the agent can answer questions about it", "Enable generative answers so the model can automatically invoke MCP tools", "Publish the agent and rely on default settings for tool availability", "Add a Power Platform connector as real-time knowledge to replace MCP tools", "Add the MCP server output as an indexed knowledge source", "Develop a custom connector and migrate the MCP server functionality to connector actions"],
    "short": {"Add the MCP server to the agent's tool configuration": "Add the MCP server as a tool", "Configure authentication for the MCP server connection used by the agent": "Configure the connection's authentication", "Enable generative answers so the model can automatically invoke MCP tools": "Generative answers invoke MCP", "Add a Power Platform connector as real-time knowledge to replace MCP tools": "Connector as real-time knowledge", "Publish the agent and rely on default settings for tool availability": "Publish with default settings", "Upload documentation about the MCP server so the agent can answer questions about it": "Upload MCP documentation", "Add the MCP server output as an indexed knowledge source": "MCP output as indexed knowledge", "Develop a custom connector and migrate the MCP server functionality to connector actions": "Rewrite as a custom connector"}
  },
  {
    "exam": "AB-620",
    "n": [90, 111],
    "ids": [1007839, 1021123],
    "kind": "ladder",
    "topic": "用 ALM 方式把现有 agent 移到目标位置",
    "rungs": [
      {"options": ["Create a custom solution, add the existing agent to the solution, export the solution with the agent, and import the solution into the target environment", "If the agent is built and managed in Copilot Studio in Teams, export the agent from the source team and import it into the target team using the Teams-based export/import approach"], "why": "The supported export and import for where the agent lives: a custom solution between environments, or the Power Apps app between teams. The Teams route runs on Dataverse for Teams, which is being retired.", "ref": "https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-import-export"}
    ],
    "never": ["Remove agent components directly from the solution so that export and import will succeed", "Duplicate the agent in the source and manually recreate the changes in the target to avoid solution dependencies", "Publish the agent to a channel and use the channel configuration as the transport mechanism to the target environment", "Configure pipeline settings first and rely on pipelines to discover and package the agent automatically without adding it to a solution"],
    "short": {"Create a custom solution, add the existing agent to the solution, export the solution with the agent, and import the solution into the target environment": "Custom solution: export, then import", "If the agent is built and managed in Copilot Studio in Teams, export the agent from the source team and import it into the target team using the Teams-based export/import approach": "Teams agent: Teams export/import", "Remove agent components directly from the solution so that export and import will succeed": "Remove components from the solution", "Duplicate the agent in the source and manually recreate the changes in the target to avoid solution dependencies": "Duplicate and rebuild by hand", "Publish the agent to a channel and use the channel configuration as the transport mechanism to the target environment": "Channel configuration as transport", "Configure pipeline settings first and rely on pipelines to discover and package the agent automatically without adding it to a solution": "Pipelines without a solution"}
  },
  {
    "exam": "AI-103",
    "n": [38, 100, 153, 166, 167],
    "ids": [1000666, 1009457, 1018737, 1022722, 1022723],
    "kind": "ladder",
    "topic": "在应用代码里提升回复完整性",
    "rungs": [
      {"options": ["Add a retry evaluation before the responses are returned", "Add a reflection pass before the responses are returned"], "why": "Both check the draft for gaps and revise it before it is returned: a reflection, or maker-checker, loop.", "ref": "https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns"}
    ],
    "never": ["Decrease the value of the max_tokens parameter", "Switch to Retrieval Augmented Generation (RAG)", "Replace the model with a smaller deployment", "Decrease the value of the temperature parameter", "Increase the value of the presence_penalty parameter", "Enable response streaming"],
    "short": {"Add a retry evaluation before the responses are returned": "Retry evaluation", "Add a reflection pass before the responses are returned": "Reflection pass", "Decrease the value of the max_tokens parameter": "Lower max_tokens", "Replace the model with a smaller deployment": "Smaller model deployment", "Increase the value of the presence_penalty parameter": "Raise presence_penalty", "Enable response streaming": "Response streaming", "Switch to Retrieval Augmented Generation (RAG)": "Switch to RAG", "Decrease the value of the temperature parameter": "Lower temperature"}
  },
  {
    "exam": "AB-620",
    "n": [74, 75],
    "ids": [1021111, 1021112],
    "kind": "same",
    "topic": "让 agent 调用另一个 agent",
    "rungs": [
      {"options": ["Provide A2A endpoint information for the target agent"]}
    ]
  },
  {
    "exam": "AB-620",
    "n": [104, 115],
    "ids": [1007853, 1021127],
    "kind": "same",
    "topic": "按需、可重复的 agent 评估",
    "rungs": [],
    "note": "#115 asks for “a predefined set of inputs” where #104 says “a predefined source”."
  },
  {
    "exam": "AI-103",
    "n": [27, 187],
    "ids": [1000655, 1022743],
    "kind": "same",
    "topic": "评估 RAG 回复的相关、完整、准确",
    "rungs": [
      {"options": ["a Retrieval Augmented Generation (RAG) evaluator"]}
    ]
  },
  {
    "exam": "AI-103",
    "n": [54, 182],
    "ids": [1000682, 1022738],
    "kind": "same",
    "topic": "扫描 PDF 的结构化摄入",
    "rungs": [
      {"options": ["Use advanced data parsing to reingest the documents"]}
    ],
    "note": "#182 says the job “extracts the contents from” the scanned PDFs where #54 says it “performs optical character recognition (OCR) on” them."
  },
  {
    "exam": "AI-103",
    "n": [67, 146],
    "ids": [1009424, 1018730],
    "kind": "same",
    "topic": "个性化用户交互",
    "rungs": [
      {"options": ["memory"]}
    ],
    "note": "#146 asks for interactions “based on the business requirements” where #67 says the solution “must meet” them."
  },
  {
    "exam": "AI-103",
    "n": [84, 116],
    "ids": [1009441, 1009473],
    "kind": "same",
    "topic": "多页表格的多模态抽取技能",
    "rungs": [
      {"options": ["Azure Content Understanding in Foundry Tools", "Azure Content Understanding"]}
    ],
    "note": "#116 names the product “Azure Content Understanding”, without “in Foundry Tools”."
  }
];
