# 缩写表

tools/build_guide.py 和 tools/build_skills.py 用这张表展开缩写：每一节（章节的 ## 小节、术语表的每个词条、考纲的每个子领域）里，缩写第一次出现时自动在后面补上「（英文全称，中文意思）」。`keep:` 里的是产品名，原样保留。已经写了全称的地方（如 "Cloud Adoption Framework（CAF）"）不重复补；缩写后面本来就有括号的，把全称并进括号里。

章节或术语表里出现表里没有、也不在 ignore 里的全大写缩写，构建会报错，所以新内容里的缩写一定要先在这里登记。

格式：`- 缩写: 英文全称 | 中文意思`。英文全称可以空着（只写中文），中文部分可以带一句冒号后的说明。

keep: Cosmos DB | VS Code | Azure Cosmos DB for NoSQL | Entra ID V2 | F1 Score

ignore: AI | PC | IT | CEO | US | EU | ID | IDs | PDF | PDFs | PNG | JPEG | JPG | MP4 | TXT | MB | GB | VIP | NVIDIA | SAP | DALL | LINE | IQ | AND | NOT | MUST | NEVER | TEST | DEV | PROD | PREPROD | ENDPOINT | GET | POST | PUT | PATCH | DELETE | KEY1 | KEY2 | GENERIC | MEDICAL

## AI 与模型

- LLM: large language model | 大语言模型：GPT 这类参数量很大的通用模型
- SLM: small language model | 小语言模型：参数少、更便宜更快的模型，如 Phi 系列，适合边界清晰的专门任务
- GPT: Generative Pre-trained Transformer | OpenAI 的生成式模型系列
- ML: machine learning | 机器学习
- MLOps: machine learning operations | 机器学习模型的开发、部署、监控流程
- GenAI: generative AI | 生成式 AI
- GenAIOps: generative AI operations | 生成式 AI 应用的开发、评估、部署、监控流程
- SFT: supervised fine-tuning | 监督微调：拿「输入 → 标准答案」的示范数据训练模型，让它照样子回答
- DPO: direct preference optimization | 直接偏好优化：给同一问题的「好回答 / 差回答」成对数据，让模型学会偏向好的
- RFT: reinforcement fine-tuning | 强化微调：不给标准答案，由评分器 grader 给模型的回答打分，模型按分数改进推理
- RAG: retrieval-augmented generation | 检索增强生成：先从知识库检索相关内容，再交给模型据此作答
- RAI: responsible AI | 负责任的 AI：公平、可靠安全、隐私安全、包容、透明、问责六原则
- MCP: Model Context Protocol | 模型上下文协议：让 agent 用统一方式调用外部工具和数据的开放标准
- A2A: Agent2Agent protocol | agent 之间互相调用、协作的开放协议
- CUA: computer-using agent | 能像人一样看屏幕、点鼠标、打字操作电脑的 agent
- HITL: human in the loop | 人在回路：关键步骤由人审核或批准
- NLP: natural language processing | 自然语言处理
- NLU: natural language understanding | 自然语言理解：识别用户意图和实体
- NER: named entity recognition | 命名实体识别：从文本里找出人名、地点、日期等
- CNER: custom named entity recognition | 自定义命名实体识别：用自己标注的数据训练实体识别
- CLU: conversational language understanding | 对话语言理解：Azure Language 里训练意图和实体识别的功能
- LUIS: Language Understanding Intelligent Service | 旧的语言理解服务，已被 CLU 取代
- TA: Text Analytics | 文本分析，Azure Language 的旧名
- OCR: optical character recognition | 光学字符识别：从图片或扫描件里读出文字
- STT: speech to text | 语音转文字
- TTS: text to speech | 文字转语音
- ASR: automatic speech recognition | 自动语音识别
- NMT: neural machine translation | 神经机器翻译
- PII: personally identifiable information | 个人身份信息：姓名、电话、证件号等能认出具体人的数据
- UPIA: user prompt injection attack | 用户提示注入攻击：用户在对话里直接试图改写系统指令，也叫越狱
- XPIA: cross-domain prompt injection attack | 跨域提示注入攻击：恶意指令藏在文档、邮件、网页里，被模型读到后执行，也叫间接攻击
- C2PA: Coalition for Content Provenance and Authenticity | 内容来源与真实性联盟：给 AI 生成内容加签名元数据的标准
- CAI: Content Authenticity Initiative | 内容真实性倡议：推动 C2PA 标准、提供验证工具的组织
- CU: Content Understanding | Azure Content Understanding：从文档、图片、音视频里抽取结构化信息的服务
- DI: Document Intelligence | Azure Document Intelligence：从表单、发票等文档里抽取字段的服务
- SK: Semantic Kernel | 微软的开源 agent / AI 编排 SDK
- PTU: provisioned throughput unit | 预置吞吐量单位：预先买下固定的模型处理容量
- TPM: tokens per minute | 每分钟 token 数，模型配额的计量单位
- RPM: requests per minute | 每分钟请求数
- RPH: requests per hour | 每小时请求数
- BYOM: bring your own model | 自带模型
- BYO: bring your own | 自带：用自己的资源，如自己的虚拟网络、存储
- ROT13: rotate by 13 places | 把每个字母换成字母表后第 13 个字母的简单编码，常被用来绕过过滤

## 搜索与评估

- BM25: Best Matching 25 | 经典的关键词相关性打分算法
- KNN: k-nearest neighbors | k 近邻：找出和查询向量最相近的 k 个向量
- HNSW: Hierarchical Navigable Small World | 一种近似最近邻向量搜索算法，速度快
- RRF: Reciprocal Rank Fusion | 倒数排名融合：把关键词搜索和向量搜索的结果合并排序
- L2: | 第二阶段：semantic ranker 在初次检索结果上做的二次重排
- NDCG: normalized discounted cumulative gain | 归一化折损累计增益：衡量结果排序离理想顺序有多近
- XDCG: | 微软检索评估指标：只看前 k 个结果的质量，不受索引里其他文档打分的影响
- BLEU: Bilingual Evaluation Understudy | 按词组重合度比较生成文本和参考答案的指标，常用于翻译
- GLEU: Google-BLEU | BLEU 的变体，按句子打分
- ROUGE: Recall-Oriented Understudy for Gisting Evaluation | 看参考答案的内容被覆盖了多少的指标，常用于摘要
- METEOR: Metric for Evaluation of Translation with Explicit ORdering | 考虑同义词和词序的翻译评估指标
- F1: F1 score | 精确率和召回率的调和平均
- TP: true positive | 真阳性：该检出的检出了
- FN: false negative | 假阴性：该检出的漏掉了
- AUC: area under the curve | 曲线下面积，衡量分类器区分能力的指标
- WER: word error rate | 词错误率，衡量语音识别准确度

## Azure 与基础设施

- ARM: Azure Resource Manager | Azure 资源管理器：创建和管理 Azure 资源的统一接口
- AKS: Azure Kubernetes Service | Azure 托管的 Kubernetes 容器集群
- ACI: Azure Container Instances | Azure 容器实例：不用管服务器直接跑容器
- ACR: Azure Container Registry | Azure 容器镜像仓库
- MCR: Microsoft Container Registry | 微软官方的公共容器镜像仓库
- AML: Azure Machine Learning | Azure 机器学习平台
- KEDA: Kubernetes Event-driven Autoscaling | 按事件自动伸缩 Kubernetes 容器的组件
- GCS: Google Cloud Storage | Google 云存储
- ADLS: Azure Data Lake Storage | Azure 数据湖存储
- APIM: Azure API Management | Azure API 管理：统一发布、保护、限流 API 的网关
- APM: application performance monitoring | 应用性能监控
- ACS: Azure Communication Services | Azure 通信服务：语音、短信、聊天能力
- RU: request unit | 请求单位，Cosmos DB 的吞吐量计量单位
- DB: database | 数据库
- VM: virtual machine | 虚拟机
- VNet: virtual network | Azure 虚拟网络
- NSG: network security group | 网络安全组：按规则放行或拦截网络流量
- VPN: virtual private network | 虚拟专用网络
- PNA: public network access | 公网访问开关
- CPU: central processing unit | 中央处理器
- GPU: graphics processing unit | 图形处理器，训练和运行模型主要靠它
- SKU: stock keeping unit | 定价层 / 规格档位
- SLA: service level agreement | 服务等级协议：承诺的可用性
- SLO: service level objective | 服务等级目标：内部定的可用性或性能目标
- GA: general availability | 正式发布，不再是预览
- KV: Key Vault | Azure Key Vault：存放密钥、证书、连接串的服务
- HSM: hardware security module | 硬件安全模块：用专用硬件保护密钥
- CMK: customer-managed key | 客户管理的密钥：用自己的密钥加密数据
- SaaS: software as a service | 软件即服务：直接用现成的在线软件
- PaaS: platform as a service | 平台即服务：在托管平台上部署自己的应用
- IaaS: infrastructure as a service | 基础设施即服务：租用虚拟机、网络、存储
- IoT: Internet of Things | 物联网
- EUDB: EU Data Boundary | 欧盟数据边界：欧盟客户的数据在欧盟境内存储和处理
- EFTA: European Free Trade Association | 欧洲自由贸易联盟
- GCC: Government Community Cloud | 美国政府社区云
- APAC: Asia-Pacific | 亚太地区
- UTC: Coordinated Universal Time | 协调世界时
- OTLP: OpenTelemetry Protocol | OpenTelemetry 传输遥测数据用的协议

## 身份与安全

- AD: Active Directory | 活动目录；Azure AD 是 Microsoft Entra ID 的旧名
- RBAC: role-based access control | 基于角色的访问控制：按角色给权限
- IAM: identity and access management | 身份与访问管理
- CNAPP: cloud-native application protection platform | 云原生应用保护平台
- CIAM: customer identity and access management | 面向外部客户的身份管理
- MFA: multifactor authentication | 多重身份验证：密码之外再要一种验证
- SSO: single sign-on | 单点登录：登录一次即可访问多个应用
- IdP: identity provider | 身份提供方：负责登录认证的系统
- OAuth: Open Authorization | 开放授权标准：让应用在不拿密码的情况下获得访问令牌
- OIDC: OpenID Connect | 建在 OAuth 2.0 上的登录认证协议
- OBO: on-behalf-of | 代表用户：服务拿用户的令牌再以该用户身份调用下游 API
- PKCE: Proof Key for Code Exchange | 授权码流程的防截获扩展
- DCR: Dynamic Client Registration | 动态客户端注册：OAuth 客户端自动向授权服务器注册自己
- MI: managed identity | 托管标识：Azure 自动管理凭据的身份，代码里不用存密钥
- SP: service principal | 服务主体：应用在租户里的身份
- SAS: shared access signature | 共享访问签名：带权限和有效期的访问链接 / 令牌
- PAT: personal access token | 个人访问令牌
- ACL: access control list | 访问控制列表：记录谁能访问哪份内容
- DLP: data loss prevention | 数据丢失防护：在 Power Platform 里指限制连接器组合的数据策略
- DSPM: Data Security Posture Management | 数据安全态势管理，Microsoft Purview 里看 AI 数据风险的功能
- SIEM: security information and event management | 安全信息与事件管理，如 Microsoft Sentinel
- SOAR: security orchestration, automation, and response | 安全编排、自动化与响应
- STRIDE: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege | 微软的威胁建模分类：仿冒、篡改、抵赖、信息泄露、拒绝服务、权限提升
- MITRE: | 美国非营利研究机构，维护 ATT&CK、ATLAS 等攻击手法知识库
- ATLAS: Adversarial Threat Landscape for Artificial-Intelligence Systems | MITRE 的 AI 系统攻击手法知识库
- OWASP: Open Worldwide Application Security Project | 开放式全球应用安全项目，发布常见安全风险清单
- SSN: Social Security Number | 美国社会安全号码

## Microsoft 产品与框架

- M365: Microsoft 365 |
- D365: Dynamics 365 |
- PPAC: Power Platform admin center | Power Platform 管理中心
- CDS: Common Data Service | Dataverse 的旧名
- ALM: application lifecycle management | 应用生命周期管理：开发、测试、发布到生产的整套流程
- CAF: Cloud Adoption Framework | 云采用框架：微软指导企业怎样规划、落地、治理云和 AI 的官方方法论
- WAF: Well-Architected Framework | 良好架构框架：微软评估工作负载设计质量的原则
- CoE: Center of Excellence | 卓越中心：推动和治理技术落地的内部专家团队
- CAT: Customer Advisory Team | 客户顾问团队；Power CAT 是 Power Platform 的产品团队
- LCS: Lifecycle Services | Dynamics 365 财务与运营应用的部署管理门户
- URS: Universal Resource Scheduling | Dynamics 365 的通用资源排程
- SCM: Supply Chain Management | Dynamics 365 供应链管理
- TFVC: Team Foundation Version Control | Azure DevOps 的集中式版本控制

## 开发与数据

- API: application programming interface | 应用程序接口：程序之间互相调用的约定
- SDK: software development kit | 软件开发工具包：调用某个服务的代码库
- CLI: command-line interface | 命令行工具
- IDE: integrated development environment | 集成开发环境，写代码的软件
- REST: Representational State Transfer | 用 HTTP 请求读写资源的 API 风格
- HTTP: Hypertext Transfer Protocol | 网页和 API 用的传输协议
- HTTPS: HTTP Secure | 加密的 HTTP
- URL: Uniform Resource Locator | 网址
- URI: Uniform Resource Identifier | 统一资源标识符，网址的通称
- JSON: JavaScript Object Notation | 常用的结构化数据格式
- YAML: YAML Ain't Markup Language | 用缩进表示结构的配置文件格式
- XML: Extensible Markup Language | 可扩展标记语言，用标签表示结构的数据格式
- HTML: Hypertext Markup Language | 网页标记语言
- CSV: comma-separated values | 逗号分隔的表格文本
- RTF: Rich Text Format | 富文本格式
- SQL: Structured Query Language | 结构化查询语言，查询关系数据库
- NoSQL: | 非关系型数据库
- DAX: Data Analysis Expressions | Power BI 里写度量和计算的公式语言
- KQL: Kusto Query Language | 查询日志和遥测数据的语言，Azure Monitor、Sentinel 用它
- OData: Open Data Protocol | 开放数据协议：用 URL 查询和筛选数据的 REST 标准
- SOAP: Simple Object Access Protocol | 基于 XML 的老式 Web 服务协议
- RPC: remote procedure call | 远程过程调用
- CRUD: create, read, update, delete | 增删改查
- JS: JavaScript |
- TCP: Transmission Control Protocol | 传输控制协议
- SSE: server-sent events | 服务器推送事件：服务器单向持续推送数据的流式传输方式
- RTMP: Real-Time Messaging Protocol | 实时消息协议，常用于直播推流
- SIP: Session Initiation Protocol | 会话初始协议，建立网络电话呼叫
- PSTN: public switched telephone network | 公共交换电话网，即普通电话网络
- IVR: interactive voice response | 交互式语音应答：电话里的「按 1 查询…」自动语音菜单
- DTMF: dual-tone multi-frequency | 双音多频：电话按键发出的信号
- SSML: Speech Synthesis Markup Language | 语音合成标记语言：控制朗读的语速、停顿、发音
- WEBVTT: Web Video Text Tracks | 网页视频字幕文件格式
- TTL: time to live | 存活时间：缓存或数据多久后过期
- ETL: extract, transform, load | 抽取、转换、加载：把数据从源系统搬进数据仓库的流程
- CI: continuous integration | 持续集成：代码一提交就自动构建和测试
- CD: continuous delivery / deployment | 持续交付 / 部署：自动把通过测试的版本发布出去
- POSIX: Portable Operating System Interface | 类 Unix 系统的接口标准
- SPA: single-page application | 单页应用：整个网页应用只有一个页面，用脚本切换内容
- GUI: graphical user interface | 图形用户界面
- UI: user interface | 用户界面
- UX: user experience | 用户体验
- FPS: frames per second | 每秒帧数
- HD: high definition | 高清
- SEO: search engine optimization | 搜索引擎优化
- QR: | 二维码
- JAWS: Job Access With Speech | 一款 Windows 读屏软件
- NVDA: NonVisual Desktop Access | 一款免费的 Windows 读屏软件
- IP: Internet Protocol | 互联网协议，IP 地址就是网络地址

## 业务与项目管理

- AAH: agent-assisted hours | agent 协助完成的工作小时数
- ROI: return on investment | 投资回报率
- ROAI: return on AI investment | AI 投资回报
- TCO: total cost of ownership | 总拥有成本：买、建、运维加起来的全部成本
- IRR: internal rate of return | 内部收益率
- KPI: key performance indicator | 关键绩效指标
- CSAT: customer satisfaction score | 客户满意度评分
- MAU: monthly active users | 月活跃用户数
- DAU: daily active users | 日活跃用户数
- CX: customer experience | 客户体验
- CRM: customer relationship management | 客户关系管理：销售、客服、营销系统
- ERP: enterprise resource planning | 企业资源计划：财务、供应链、生产等核心业务系统
- BI: business intelligence | 商业智能：报表和数据分析
- AP: accounts payable | 应付账款
- B2B: business-to-business | 企业对企业
- SME: subject matter expert | 业务领域专家
- SOP: standard operating procedure | 标准作业程序
- SSOT: single source of truth | 唯一可信数据源
- PoC: proof of concept | 概念验证：先做小样验证方案可行
- UAT: user acceptance testing | 用户验收测试：业务用户确认系统符合需求
- QA: quality assurance | 质量保证 / 测试
- CAB: change advisory board | 变更咨询委员会：评审高风险变更的小组
- WBS: work breakdown structure | 工作分解结构：把项目拆成可管理的任务
- FAQ: frequently asked questions | 常见问题
- KB: knowledge base | 知识库
- HR: human resources | 人力资源
- CFO: chief financial officer | 首席财务官
- CIO: chief information officer | 首席信息官
- CTO: chief technology officer | 首席技术官
- CISO: chief information security officer | 首席信息安全官
- RPA: robotic process automation | 机器人流程自动化：用软件模拟人点界面完成重复操作
