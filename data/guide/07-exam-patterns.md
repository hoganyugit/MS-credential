---
id: 07-exam-patterns
title: 出题规律：微软怎么出题，题库怎么用
short: 出题规律
intro: 把三门考试的 406 道题逐题拆开，归纳出"需求措辞 → 正确答案"的决策规则、干扰项套路、限定词和 case study 的出题方式，每条结论都能点开原题核对。
exams: AB-620 | AB-100 | AI-103
---

这一章回答一个问题：微软是怎么出题的。它不是泛泛的"考试技巧"，而是把题库里的 406 道题（AB-620 116 题、AB-100 129 题、AI-103 161 题）逐题拆开，按 reviewed answer 归纳出反复出现的"需求措辞 → 正确答案"规则、干扰项的套路、限定词怎么翻转答案、case study 的哪几句会被出成题。每条结论都带题号，点一下题号就能打开原题核对。

先说三件通用的事，再分考试细讲。

**微软怎么计分。** 多部分题（拖拽、匹配、hotspot、Yes/No 表格）每个格子各算一分，答对几格得几格；猜错不扣分，所以每题都要作答。卷子里有不计分的试验题，你不知道是哪几道。及格线 700 分是换算分，不等于 70% 正确率。

**题型就那几种。** 单选、多选（"Which two… Each correct answer presents part of the solution" 是互补的两半，"presents a complete solution" 是两个各自成立的方案）、Yes/No 系列（同一场景换三四个 proposed solution，各自独立判断，不能回头改）、拖拽排序、拖拽匹配、hotspot 下拉、case study（一段长背景加几道题，离开这一节就不能返回）。真实考试 40 到 60 题，associate 级 100 到 120 分钟，考试中可以打开 Microsoft Learn 查文档但不加时。

**题干的结构是固定的。** 几句场景、一组 requirement（常用 bullet 列出，每条对应正确选项的一个特征）、一个限定词（minimize development effort、without indexing、must NOT use API keys…）、最后一句 "You need to… What should you do / recommend / include?"。限定词决定了删掉哪一半选项，requirement 的名词决定了答案的名字。三门考试的规则表都按这个思路整理。

来源：[Exam scoring and score reports](https://learn.microsoft.com/en-us/credentials/certifications/exam-scoring-reports)、[Exam duration and exam experience](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience)、[Exam frequently asked questions](https://learn.microsoft.com/en-us/credentials/certifications/frequently-asked-questions)。

> **注意** 题库是 ExamTopics 的回忆版，题目措辞和真题有出入，拖拽与 hotspot 的答案错得多（本章各考试第一节都列出了社区答案与 reviewed answer 不一致的题）。规则是从 reviewed answer 归纳的；凡是规则推不出的题，去读 Learn 原文，不要背答案。


## AB-620 · 题型、问法与限定词 {#ab620-formats}

### 题型与问法

#### 题型统计（116 题）

| 题型 | 题数 | 占比 | 题号 |
|---|---|---|---|
| Drag-and-drop 匹配（requirement → configuration） | 36 | 31% | [Q6](#/q/ab-620/6) [Q7](#/q/ab-620/7) [Q13](#/q/ab-620/13) [Q16](#/q/ab-620/16) [Q24](#/q/ab-620/24) [Q29](#/q/ab-620/29) [Q31](#/q/ab-620/31) [Q33](#/q/ab-620/33) [Q35](#/q/ab-620/35) [Q36](#/q/ab-620/36) [Q38](#/q/ab-620/38) [Q40](#/q/ab-620/40) [Q41](#/q/ab-620/41) [Q43](#/q/ab-620/43) [Q44](#/q/ab-620/44) [Q46](#/q/ab-620/46) [Q47](#/q/ab-620/47) [Q48](#/q/ab-620/48) [Q50](#/q/ab-620/50) [Q55](#/q/ab-620/55) [Q57](#/q/ab-620/57) [Q58](#/q/ab-620/58) [Q59](#/q/ab-620/59) [Q60](#/q/ab-620/60) [Q62](#/q/ab-620/62) [Q64](#/q/ab-620/64) [Q67](#/q/ab-620/67) [Q70](#/q/ab-620/70) [Q80](#/q/ab-620/80) [Q81](#/q/ab-620/81) [Q84](#/q/ab-620/84) [Q87](#/q/ab-620/87) [Q96](#/q/ab-620/96) [Q99](#/q/ab-620/99) [Q104](#/q/ab-620/104) [Q115](#/q/ab-620/115) |
| Hotspot 下拉（本质也是 requirement → option 匹配） | 12 | 10% | [Q9](#/q/ab-620/9) [Q11](#/q/ab-620/11) [Q12](#/q/ab-620/12) [Q20](#/q/ab-620/20) [Q32](#/q/ab-620/32) [Q78](#/q/ab-620/78) [Q88](#/q/ab-620/88) [Q91](#/q/ab-620/91) [Q92](#/q/ab-620/92) [Q94](#/q/ab-620/94) [Q102](#/q/ab-620/102) [Q105](#/q/ab-620/105) |
| Drag-and-drop 排序（In which order / in sequence） | 14 | 12% | [Q1](#/q/ab-620/1) [Q3](#/q/ab-620/3) [Q8](#/q/ab-620/8) [Q10](#/q/ab-620/10) [Q18](#/q/ab-620/18) [Q49](#/q/ab-620/49) [Q69](#/q/ab-620/69) [Q76](#/q/ab-620/76) [Q77](#/q/ab-620/77) [Q97](#/q/ab-620/97) [Q103](#/q/ab-620/103) [Q106](#/q/ab-620/106) [Q114](#/q/ab-620/114) [Q116](#/q/ab-620/116) |
| 多选（Which two / three actions） | 19 | 16% | [Q2](#/q/ab-620/2) [Q4](#/q/ab-620/4) [Q5](#/q/ab-620/5) [Q19](#/q/ab-620/19) [Q25](#/q/ab-620/25) [Q26](#/q/ab-620/26) [Q37](#/q/ab-620/37) [Q45](#/q/ab-620/45) [Q52](#/q/ab-620/52) [Q53](#/q/ab-620/53) [Q61](#/q/ab-620/61) [Q63](#/q/ab-620/63) [Q65](#/q/ab-620/65) [Q83](#/q/ab-620/83) [Q93](#/q/ab-620/93) [Q98](#/q/ab-620/98) [Q100](#/q/ab-620/100) [Q101](#/q/ab-620/101) [Q110](#/q/ab-620/110) |
| 单选 | 24 | 21% | [Q14](#/q/ab-620/14) [Q15](#/q/ab-620/15) [Q17](#/q/ab-620/17) [Q28](#/q/ab-620/28) [Q30](#/q/ab-620/30) [Q34](#/q/ab-620/34) [Q42](#/q/ab-620/42) [Q51](#/q/ab-620/51) [Q54](#/q/ab-620/54) [Q56](#/q/ab-620/56) [Q66](#/q/ab-620/66) [Q68](#/q/ab-620/68) [Q73](#/q/ab-620/73) [Q74](#/q/ab-620/74) [Q75](#/q/ab-620/75) [Q79](#/q/ab-620/79) [Q82](#/q/ab-620/82) [Q86](#/q/ab-620/86) [Q89](#/q/ab-620/89) [Q90](#/q/ab-620/90) [Q95](#/q/ab-620/95) [Q111](#/q/ab-620/111) [Q112](#/q/ab-620/112) [Q113](#/q/ab-620/113) |
| Yes/No 系列（Does the solution meet the goal?） | 11 | 9% | 系列 1：[Q21](#/q/ab-620/21) [Q22](#/q/ab-620/22) [Q23](#/q/ab-620/23) [Q27](#/q/ab-620/27)；系列 2：[Q39](#/q/ab-620/39) [Q71](#/q/ab-620/71) [Q72](#/q/ab-620/72) [Q85](#/q/ab-620/85)；系列 3：[Q107](#/q/ab-620/107) [Q108](#/q/ab-620/108) [Q109](#/q/ab-620/109) |
| 其中 Case study 题（跨以上题型） | 20 | 17% | Blue Yonder 10 题：[Q1](#/q/ab-620/1) [Q4](#/q/ab-620/4) [Q5](#/q/ab-620/5) [Q6](#/q/ab-620/6) [Q24](#/q/ab-620/24) [Q25](#/q/ab-620/25) [Q26](#/q/ab-620/26) [Q38](#/q/ab-620/38) [Q40](#/q/ab-620/40) [Q41](#/q/ab-620/41)；Fabrikam 10 题：[Q42](#/q/ab-620/42) [Q43](#/q/ab-620/43) [Q44](#/q/ab-620/44) [Q45](#/q/ab-620/45) [Q46](#/q/ab-620/46) [Q80](#/q/ab-620/80) [Q81](#/q/ab-620/81) [Q82](#/q/ab-620/82) [Q83](#/q/ab-620/83) [Q84](#/q/ab-620/84) |

要点：
- 匹配类（拖放匹配 + hotspot）共 48 题，占 41%。这门考试的主体是"把一句需求翻译成一个配置名"。
- 排序题 14 道全部考"依赖顺序"，其中 [Q1](#/q/ab-620/1)、[Q77](#/q/ab-620/77)、[Q106](#/q/ab-620/106) 是"从 6 个 tile 里选 3/4 个排序"、[Q114](#/q/ab-620/114) 是"4 选 3"，含多余干扰 tile。
- 多选 19 题中 18 题为 "Which two"（15 题 "part of the solution"：[Q2](#/q/ab-620/2) [Q4](#/q/ab-620/4) [Q5](#/q/ab-620/5) [Q19](#/q/ab-620/19) [Q25](#/q/ab-620/25) [Q26](#/q/ab-620/26) [Q37](#/q/ab-620/37) [Q45](#/q/ab-620/45) [Q52](#/q/ab-620/52) [Q53](#/q/ab-620/53) [Q61](#/q/ab-620/61) [Q63](#/q/ab-620/63) [Q83](#/q/ab-620/83) [Q98](#/q/ab-620/98) [Q110](#/q/ab-620/110)；3 题 "complete solution"：[Q65](#/q/ab-620/65) [Q100](#/q/ab-620/100) [Q101](#/q/ab-620/101)），1 题 "Which three"（[Q93](#/q/ab-620/93)）。
- Yes/No 三个系列共 11 题，同一场景换 3–4 个 proposed solution。Yes 5 题（[Q22](#/q/ab-620/22) [Q23](#/q/ab-620/23) [Q72](#/q/ab-620/72) [Q85](#/q/ab-620/85) [Q107](#/q/ab-620/107)），No 6 题（[Q21](#/q/ab-620/21) [Q27](#/q/ab-620/27) [Q39](#/q/ab-620/39) [Q71](#/q/ab-620/71) [Q108](#/q/ab-620/108) [Q109](#/q/ab-620/109)）。
- 匹配题中同一 tile 被重复使用很常见：[Q13](#/q/ab-620/13)（connector ×2）、[Q31](#/q/ab-620/31)（environment variables ×3）、[Q38](#/q/ab-620/38)（tool node ×2）、[Q41](#/q/ab-620/41)（tool node ×2）、[Q50](#/q/ab-620/50)（Add the connected agent ×2）、[Q55](#/q/ab-620/55)（real-time knowledge ×2）、[Q94](#/q/ab-620/94)（Managed solution ×2）。

#### 问法公式与真实考点

| 问法公式 | 题号 | 实际在考什么 |
|---|---|---|
| "To meet the business needs, the X must meet the following requirements: • … • … • …  You need to … What/Which … should you configure for each requirement?" | [Q7](#/q/ab-620/7) [Q16](#/q/ab-620/16) [Q29](#/q/ab-620/29) [Q31](#/q/ab-620/31) [Q36](#/q/ab-620/36) [Q44](#/q/ab-620/44) [Q46](#/q/ab-620/46) [Q48](#/q/ab-620/48) [Q55](#/q/ab-620/55) [Q57](#/q/ab-620/57) [Q58](#/q/ab-620/58) [Q62](#/q/ab-620/62) [Q67](#/q/ab-620/67) [Q70](#/q/ab-620/70) [Q87](#/q/ab-620/87) [Q99](#/q/ab-620/99) [Q78](#/q/ab-620/78) [Q80](#/q/ab-620/80) [Q81](#/q/ab-620/81) [Q84](#/q/ab-620/84) [Q115](#/q/ab-620/115) | 匹配题。每条 requirement 是某个 tile 的同义改写；考"同义词识别 + 机制分类"（知识 / 工具 / agent / ALM）。 |
| "You need to … What should you do?" | [Q14](#/q/ab-620/14) [Q17](#/q/ab-620/17) [Q30](#/q/ab-620/30) [Q34](#/q/ab-620/34) [Q51](#/q/ab-620/51) [Q54](#/q/ab-620/54) [Q66](#/q/ab-620/66) [Q68](#/q/ab-620/68) [Q73](#/q/ab-620/73) [Q74](#/q/ab-620/74) [Q75](#/q/ab-620/75) [Q79](#/q/ab-620/79) [Q86](#/q/ab-620/86) [Q90](#/q/ab-620/90) [Q95](#/q/ab-620/95) [Q111](#/q/ab-620/111) [Q112](#/q/ab-620/112) | 单一机制定位。四个选项通常来自四个不同类别（知识源 / 工具 / 发布 / 观察类），只有一类对应需求动词。 |
| "What should you use? / Which integration approach should you use?" / "Which capability should … use?" | [Q28](#/q/ab-620/28) [Q42](#/q/ab-620/42) [Q56](#/q/ab-620/56) [Q82](#/q/ab-620/82) [Q113](#/q/ab-620/113) | 集成类型选择（Copilot connector / A2A / Fabric Data Agent）；[Q113](#/q/ab-620/113) 是评估方法选择（test set）。 |
| "Which two actions should you perform? Each correct answer presents part of the solution." | 15 题（见 1.1） | 两个互补半步，通常是"机制本身 + 机制内的一项配置"：[Q2](#/q/ab-620/2)（选 Foundry 模型 + 套用模板）、[Q19](#/q/ab-620/19)（建 solution + 导出）、[Q53](#/q/ab-620/53)（Add external agent + project endpoint URL）、[Q63](#/q/ab-620/63)/Q98（Enable computer use + 看 runtime view）、[Q37](#/q/ab-620/37)（Ask with Adaptive Card node + Action.Submit）、[Q83](#/q/ab-620/83)（Publish 被调用的 agent + 打开允许其他 agent 连接）、[Q110](#/q/ab-620/110)（run after + scope）。 |
| "Which two … Each correct answer presents a complete solution." | [Q65](#/q/ab-620/65) [Q100](#/q/ab-620/100) [Q101](#/q/ab-620/101) | 两个彼此独立、各自成立的方案：[Q65](#/q/ab-620/65)（HTTP action 或 REST API tool）、[Q100](#/q/ab-620/100)（run history 或 failed run details）、[Q101](#/q/ab-620/101)（接受结果 或 确认知识源正常）。 |
| "In which order should you perform the actions?" / "Which three/four actions should you perform in sequence?" | [Q3](#/q/ab-620/3) [Q8](#/q/ab-620/8) [Q10](#/q/ab-620/10) [Q49](#/q/ab-620/49) [Q69](#/q/ab-620/69) [Q76](#/q/ab-620/76) [Q97](#/q/ab-620/97) [Q103](#/q/ab-620/103) [Q116](#/q/ab-620/116) / [Q1](#/q/ab-620/1) [Q77](#/q/ab-620/77) [Q106](#/q/ab-620/106) [Q114](#/q/ab-620/114) | 依赖顺序："先有容器再有内容，认证紧随容器，验证紧挨发布前"。 |
| "Proposed solution: … Does the solution meet the goal?" | [Q21](#/q/ab-620/21) [Q22](#/q/ab-620/22) [Q23](#/q/ab-620/23) [Q27](#/q/ab-620/27) [Q39](#/q/ab-620/39) [Q71](#/q/ab-620/71) [Q72](#/q/ab-620/72) [Q85](#/q/ab-620/85) [Q107](#/q/ab-620/107) [Q108](#/q/ab-620/108) [Q109](#/q/ab-620/109) | 把 proposed solution 逐条对照题干 requirement；漏任意一条即 No（[Q21](#/q/ab-620/21) 只重试、[Q27](#/q/ab-620/27) 直接终止、[Q39](#/q/ab-620/39) 删掉 generative answers node、[Q71](#/q/ab-620/71) 用 prompt 限制 connector）。 |
| "What should you conclude … / Which conclusions should you make" | [Q88](#/q/ab-620/88) [Q89](#/q/ab-620/89) [Q96](#/q/ab-620/96) [Q105](#/q/ab-620/105) | 按字面解读 evaluation 输出，不做推断。 |
| "Which compliance status should you assign" | [Q24](#/q/ab-620/24) | 逐条对照 case 的 must / must not。 |
| Case："You need to configure the agent … to meet Blue Yonder's / Fabrikam Inc.'s … requirements" | [Q1](#/q/ab-620/1) [Q4](#/q/ab-620/4) [Q5](#/q/ab-620/5) [Q6](#/q/ab-620/6) [Q24](#/q/ab-620/24) [Q25](#/q/ab-620/25) [Q26](#/q/ab-620/26) [Q38](#/q/ab-620/38) [Q40](#/q/ab-620/40) [Q41](#/q/ab-620/41) [Q42](#/q/ab-620/42)–[Q46](#/q/ab-620/46) [Q80](#/q/ab-620/80)–[Q84](#/q/ab-620/84) | 答案是 case 里某句 requirement 的改写（见第 6 节）。 |

#### 题库重复度与噪声（写章节时要提醒读者）

- 同一决策反复出题（近似孪生题）：[Q3](#/q/ab-620/3)≈[Q8](#/q/ab-620/8)；[Q2](#/q/ab-620/2)≈[Q52](#/q/ab-620/52)；[Q54](#/q/ab-620/54)≈[Q66](#/q/ab-620/66)≈[Q73](#/q/ab-620/73)≈[Q79](#/q/ab-620/79)；[Q63](#/q/ab-620/63)≈[Q70](#/q/ab-620/70)≈[Q98](#/q/ab-620/98)；[Q88](#/q/ab-620/88)=[Q105](#/q/ab-620/105)；[Q32](#/q/ab-620/32)≈[Q91](#/q/ab-620/91)；[Q7](#/q/ab-620/7)≈[Q48](#/q/ab-620/48)；[Q43](#/q/ab-620/43)≈[Q53](#/q/ab-620/53)；[Q55](#/q/ab-620/55)≈[Q57](#/q/ab-620/57)；[Q45](#/q/ab-620/45)≈[Q61](#/q/ab-620/61)≈[Q2](#/q/ab-620/2)；[Q42](#/q/ab-620/42)≈[Q51](#/q/ab-620/51)；[Q74](#/q/ab-620/74)≈[Q75](#/q/ab-620/75)；[Q47](#/q/ab-620/47)≈[Q80](#/q/ab-620/80)；[Q50](#/q/ab-620/50)≈[Q83](#/q/ab-620/83)；[Q56](#/q/ab-620/56)≈[Q82](#/q/ab-620/82)；[Q18](#/q/ab-620/18)≈[Q77](#/q/ab-620/77)；[Q65](#/q/ab-620/65)≈[Q67](#/q/ab-620/67)；[Q86](#/q/ab-620/86)≈[Q92](#/q/ab-620/92)≈[Q104](#/q/ab-620/104)≈[Q115](#/q/ab-620/115)；[Q19](#/q/ab-620/19)≈[Q90](#/q/ab-620/90)≈[Q95](#/q/ab-620/95)≈[Q107](#/q/ab-620/107)≈[Q111](#/q/ab-620/111)。说明考点池很小，同一规则会换 2–3 种题型再考，背规则比背题有效。
- 62 道拖放/hotspot 题里有 13 道 ExamTopics 社区答案与 reviewed answer 不一致：[Q1](#/q/ab-620/1) [Q18](#/q/ab-620/18) [Q29](#/q/ab-620/29) [Q32](#/q/ab-620/32) [Q38](#/q/ab-620/38) [Q41](#/q/ab-620/41) [Q46](#/q/ab-620/46) [Q47](#/q/ab-620/47) [Q55](#/q/ab-620/55) [Q59](#/q/ab-620/59) [Q69](#/q/ab-620/69) [Q96](#/q/ab-620/96) [Q102](#/q/ab-620/102)。另外 [Q52](#/q/ab-620/52) 的选项里根本没有正确项（Foundry model catalog），reviewed answer 只能退而选 C+E；[Q91](#/q/ab-620/91) 题干被拼接坏了（evaluation 开头 + 环境变量场景）。这些题应按规则理解，不要背社区答案。

---


### 限定词与陷阱词

| 限定词（原文） | 把答案翻到 | 反例 / 对立项 | 例题 |
|---|---|---|---|
| "indexed" / "searchable" / "from a centralized data index" | Copilot connector knowledge source；Azure AI Search | real-time connector | [Q20](#/q/ab-620/20) [Q28](#/q/ab-620/28) [Q30](#/q/ab-620/30) [Q57](#/q/ab-620/57) [Q58](#/q/ab-620/58) [Q60](#/q/ab-620/60) [Q81](#/q/ab-620/81) |
| "without indexing" / "avoid copying enterprise data into an index" / "live" / "real-time" / "updates throughout the day" | Power Platform connector as real-time knowledge | Copilot connector、Azure AI Search、上传文件 | [Q13](#/q/ab-620/13) [Q29](#/q/ab-620/29) [Q55](#/q/ab-620/55) [Q57](#/q/ab-620/57) |
| "static PDF" / "does NOT depend on enterprise data" | 上传文件知识 / 主题里的手写消息 | connector | [Q13](#/q/ab-620/13) |
| "reusable" / "across three different agents" / "without copying" | component collection；agent flow 调 tool node；reusable custom prompt template | duplicate、manually rebuild、export 后复制 | [Q41](#/q/ab-620/41) [Q44](#/q/ab-620/44) [Q45](#/q/ab-620/45) [Q61](#/q/ab-620/61) [Q99](#/q/ab-620/99) |
| "only within a specific topic" / "in a topic" / "scope the topic node" | topic-level custom prompt；主题里的 generative answers node + Search only selected sources | agent 级 SharePoint 知识 | [Q15](#/q/ab-620/15) [Q36](#/q/ab-620/36) [Q72](#/q/ab-620/72) [Q85](#/q/ab-620/85) |
| "every AI-generated response" / "consistently across all generative responses" | agent 级 prompt modifications | 逐 topic、greeting、逐 channel | [Q5](#/q/ab-620/5) [Q25](#/q/ab-620/25) [Q26](#/q/ab-620/26) |
| "before making the agent available on both channels" | agent 级 prompt modifications + DLP（发布前） | "Publish … then enable RAI filters per channel" | [Q25](#/q/ab-620/25) |
| "without republishing" + "sensitive" | secret environment variable | republish | [Q32](#/q/ab-620/32) [Q91](#/q/ab-620/91) |
| "non-secret" + "used by the published agent at runtime" | 必须 republish | "agent automatically pulls the updated value"（社区误选） | [Q32](#/q/ab-620/32) [Q93](#/q/ab-620/93) |
| "confirm … but must not be able to modify it from Copilot Studio" | 环境变量在 Copilot Studio 只读 | "can be edited by any builder" | [Q32](#/q/ab-620/32) [Q91](#/q/ab-620/91) [Q93](#/q/ab-620/93) [Q109](#/q/ab-620/109) |
| "locked-down" / "prevents direct modification" / "deployment-ready" | managed solution | unmanaged | [Q87](#/q/ab-620/87) [Q94](#/q/ab-620/94) |
| "continue modifying" / "ongoing development" | unmanaged solution | managed | [Q94](#/q/ab-620/94) |
| "without modifying the solution contents" / "not hard-coded" / "set during import" | environment variables（+ connection references） | hardcode、distinct agent versions | [Q31](#/q/ab-620/31) [Q87](#/q/ab-620/87) [Q93](#/q/ab-620/93) [Q99](#/q/ab-620/99) |
| "limited to a defined set of users who are responsible for that stage" | pipeline stage access | managed solution | [Q87](#/q/ab-620/87) |
| "controlled, repeatable" / "multi-stage approvals" / "in order" | Power Platform Pipelines（sequential stage progression） | direct target environment selection | [Q97](#/q/ab-620/97) [Q99](#/q/ab-620/99) [Q102](#/q/ab-620/102) |
| "repeatable" / "consistent across multiple test runs" / "before expanding access" | test set（curated prompt list + expected outcomes） | analytics、live conversations | [Q86](#/q/ab-620/86) [Q92](#/q/ab-620/92) [Q103](#/q/ab-620/103) [Q104](#/q/ab-620/104) [Q112](#/q/ab-620/112) [Q113](#/q/ab-620/113) [Q115](#/q/ab-620/115) |
| "fail in every run" / "repeatedly" | consistent outcomes → isolate scope to remediate | intermittent、redesign、model at fault | [Q88](#/q/ab-620/88) [Q89](#/q/ab-620/89) [Q105](#/q/ab-620/105) |
| "Pass, Score 0.92, semantically matches" | 接受结果 | rerun、改 test case | [Q101](#/q/ab-620/101) |
| "anonymous" + "general inquiries（baggage policy）" | Allow anonymous access → Compliant | sign-in | [Q6](#/q/ab-620/6) [Q24](#/q/ab-620/24) |
| "personal data（upcoming trips, bookings, loyalty）" | Require customer sign-in | anonymous | [Q6](#/q/ab-620/6) |
| "internal staff / employees only" / "from Microsoft Teams" | Authenticate with Microsoft Entra ID | Require Secure Access、public website、personal account | [Q6](#/q/ab-620/6) [Q17](#/q/ab-620/17) |
| "user identity must be used" / "traceable to the requesting user" | 用户身份（per-user auth；MCP server 选 OAuth 2.0） | author / shared / admin credential；同一认证类型套用到所有 MCP server | [Q6](#/q/ab-620/6) [Q24](#/q/ab-620/24) [Q84](#/q/ab-620/84) |
| "at the service level, not per user" | connection（服务账号） | per-user | [Q48](#/q/ab-620/48) |
| "governance requirement for authenticated access"（Azure AI Search） | service principal | access key | [Q46](#/q/ab-620/46) |
| "internal API, no prebuilt connector" vs "lightweight external API with API key" | custom connector vs HTTP request node | 互换 | [Q40](#/q/ab-620/40) |
| "no custom code; only built-in tools" / "all backend logic must be implemented using agent flows" | tool node 调 agent flow | manually rebuild logic | [Q38](#/q/ab-620/38) [Q41](#/q/ab-620/41) |
| "HTML is not supported" | Markdown | HTML | [Q26](#/q/ab-620/26) |
| "legacy desktop application that does not use APIs" | Computer use | custom connector、desktop flow | [Q63](#/q/ab-620/63) [Q70](#/q/ab-620/70) [Q98](#/q/ab-620/98) |
| "standardized tool interface" / "external MCP server … publishes callable tools and requires authentication" | MCP server（加到 agent 的 tools，并在 connection 上配认证） | REST、connector、real-time knowledge、enable generative answers | [Q58](#/q/ab-620/58) [Q73](#/q/ab-620/73) [Q79](#/q/ab-620/79) |
| "standardized agent-to-agent endpoint" / "standard Copilot Studio interface" / "connect to an external agent" | A2A endpoint information | MCP tool、knowledge source、Power Platform connector tool | [Q42](#/q/ab-620/42) [Q51](#/q/ab-620/51) [Q74](#/q/ab-620/74) [Q75](#/q/ab-620/75) |
| "governed business data" / "semantic model" / "structured analytical data" | Fabric Data Agent | REST 直查、flow、索引 | [Q47](#/q/ab-620/47) [Q56](#/q/ab-620/56) [Q80](#/q/ab-620/80) [Q82](#/q/ab-620/82) |
| "existing Microsoft Foundry agent" | Add external agent（type Microsoft Foundry）+ project endpoint URL | Copilot Studio endpoint URL | [Q43](#/q/ab-620/43) [Q53](#/q/ab-620/53) |
| "another Copilot Studio agent that already exists" | publish 它 + Add the connected agent（被调用方打开允许其他 agent 连接） | configure connections、indexed knowledge、publish 主 agent | [Q50](#/q/ab-620/50) [Q83](#/q/ab-620/83) |
| "must not terminate silently" / "handle failure and timeout outcomes explicitly" | run after + notification（可加 scope 分组） | retry only、terminate、increase timeout、concurrency control | [Q21](#/q/ab-620/21)–[Q23](#/q/ab-620/23) [Q27](#/q/ab-620/27) [Q110](#/q/ab-620/110) |
| "within the same flow run" | approval action 等待并返回；input/output parameters | trigger a new run | [Q11](#/q/ab-620/11) [Q12](#/q/ab-620/12) |
| "unexpected or empty values" | validate parameter definitions | Parse JSON、republish | [Q14](#/q/ab-620/14) |
| "stop additional failed executions" / "immediately after resolution" | Disable the flow / Review Activity history | Delete、Analytics summary | [Q9](#/q/ab-620/9) |
| "only generate responses when relevant indexed content is retrieved" | require grounding | citations、boosting | [Q68](#/q/ab-620/68) |
| "tenant administrator configures" / "avoid duplicating or manually uploading" | 直接 add 已配置的 Copilot connector 知识源 | upload documents、custom connector | [Q30](#/q/ab-620/30) [Q59](#/q/ab-620/59) |

---


## AB-620 · 决策规则（核心） {#ab620-rules}

### 决策规则（核心）

按出现题数排序。"题数"统计的是该规则决定了至少一个答案元素（一行 / 一个选项）的题。

| # | 题干触发词 | 正确答案 | 典型错误项 | 题数 | 例题 |
|---|---|---|---|---|---|
| 1 | 需求动词分类：answer / ground / searchable / reference → 知识；update / create / execute / invoke / write / "transactional" / "authenticated update" → 工具；delegate / call another agent → agent | 知识源（Copilot connector、real-time connector、上传文件）；工具（Power Platform connector tool、MCP tool、REST API tool、HTTP node）；connected / external agent | 把执行需求选成 "add as knowledge source / upload documentation"；把 grounding 需求选成 "add as tool and call from topic" | 26 | [Q7](#/q/ab-620/7) [Q13](#/q/ab-620/13) [Q20](#/q/ab-620/20) [Q28](#/q/ab-620/28) [Q30](#/q/ab-620/30) [Q41](#/q/ab-620/41) [Q42](#/q/ab-620/42) [Q47](#/q/ab-620/47) [Q48](#/q/ab-620/48) [Q50](#/q/ab-620/50) [Q51](#/q/ab-620/51) [Q53](#/q/ab-620/53) [Q54](#/q/ab-620/54) [Q55](#/q/ab-620/55) [Q57](#/q/ab-620/57) [Q58](#/q/ab-620/58) [Q63](#/q/ab-620/63) [Q65](#/q/ab-620/65) [Q66](#/q/ab-620/66) [Q67](#/q/ab-620/67) [Q73](#/q/ab-620/73) [Q74](#/q/ab-620/74) [Q75](#/q/ab-620/75) [Q79](#/q/ab-620/79) [Q80](#/q/ab-620/80) [Q83](#/q/ab-620/83) |
| 2 | "Publish the agent so that … is applied / updated / enforced automatically" | 绝大多数是错误项。只有"发布本身就是功能生效条件"时才是正确步骤：connected agent 必须已 published（[Q50](#/q/ab-620/50)）、App Insights 配置改后要 publish（[Q106](#/q/ab-620/106) 末步）、Agents SDK 集成先 publish（[Q18](#/q/ab-620/18) 首步）、非 secret 环境变量改后要 republish（[Q32](#/q/ab-620/32) [Q93](#/q/ab-620/93)）、flow 验证后再 make available（[Q10](#/q/ab-620/10) 末步）、Agents SDK 集成先 publish（[Q77](#/q/ab-620/77) 首步）、被委派的 Service Desk Agent 必须已 published（[Q83](#/q/ab-620/83)） | 作为错误项出现 14 次 | 21 | 错：[Q2](#/q/ab-620/2) [Q14](#/q/ab-620/14) [Q25](#/q/ab-620/25) [Q43](#/q/ab-620/43) [Q45](#/q/ab-620/45) [Q52](#/q/ab-620/52) [Q53](#/q/ab-620/53) [Q54](#/q/ab-620/54) [Q61](#/q/ab-620/61) [Q63](#/q/ab-620/63) [Q79](#/q/ab-620/79) [Q83](#/q/ab-620/83) [Q98](#/q/ab-620/98) [Q108](#/q/ab-620/108)；对：[Q10](#/q/ab-620/10) [Q18](#/q/ab-620/18) [Q32](#/q/ab-620/32) [Q50](#/q/ab-620/50) [Q77](#/q/ab-620/77) [Q83](#/q/ab-620/83) [Q93](#/q/ab-620/93) [Q106](#/q/ab-620/106) |
| 3 | "indexed"、"searchable"、"non-Microsoft / third-party system"、"tenant administrator configures"、"avoid duplicating or manually uploading"、"existing access controls"、"read-only" | Copilot connector（Microsoft Graph connector）knowledge source；管理员在 Microsoft 365 admin center 配好，builder 只需 add 到 agent knowledge | Power Platform real-time connector；上传文档到 agent；custom connector / tool；Azure AI Search；"call the third-party API from a topic for each question" | 7 | [Q4](#/q/ab-620/4) [Q20](#/q/ab-620/20) [Q28](#/q/ab-620/28) [Q30](#/q/ab-620/30) [Q57](#/q/ab-620/57) [Q58](#/q/ab-620/58) [Q59](#/q/ab-620/59) |
| 4 | "real-time"、"live"、"up-to-date"、"updates throughout the day"、"at runtime"、"without indexing"、"avoid copying enterprise data into an index"、"keep source-system access controls" | Power Platform connector as real-time knowledge。配置顺序：Add knowledge → 在对话框选 real-time connector → Sign in 建/复用 connection → 选 tables → Add to agent | Copilot connector（索引型）；Azure AI Search；上传文件；"generative answer without enterprise data" | 6 | [Q3](#/q/ab-620/3) [Q8](#/q/ab-620/8) [Q13](#/q/ab-620/13) [Q29](#/q/ab-620/29) [Q55](#/q/ab-620/55) [Q57](#/q/ab-620/57) |
| 5 | "configuration values vary by environment"、"set during import"、"exclude values from the agent definition"、"not hard-coded"、"without modifying the solution contents"。子规则：sensitive + "without republishing" → secret 类型运行时解析；"confirm but must not modify from Copilot Studio" → 环境变量在 Copilot Studio 只读；non-secret 更新 → 必须 republish 才生效 | Environment variables（+ connection references） | Hardcode；channel-specific settings；"publish distinct agent versions per environment"；builder 在 Copilot Studio 里改值；"所有类型立即生效" | 7 | [Q31](#/q/ab-620/31) [Q32](#/q/ab-620/32) [Q87](#/q/ab-620/87) [Q91](#/q/ab-620/91) [Q93](#/q/ab-620/93) [Q99](#/q/ab-620/99) [Q109](#/q/ab-620/109) |
| 6 | 委派对象按措辞：existing Copilot Studio agent → Publish 它（并打开 "Let other agents connect to and use this one"）+ Add the connected agent；existing Foundry agent → Add external agent（type Microsoft Foundry）+ Foundry project endpoint URL；"only available through a standardized agent-to-agent endpoint" → A2A endpoint information；"governed business data / semantic model / structured analytical data" → Fabric Data Agent；多专家分工 → data-access / knowledge-focused / tools-first agent | 见左 | 把目标 agent 加为 indexed knowledge source；upload documentation about the agent；publish 主 agent；"Copilot Studio endpoint URL"（应为 project endpoint URL）；REST 直查 Fabric tables；用 Power Automate flow 代替 data agent；Power Platform connector tool 调另一个 agent；把 Service Desk Agent 换成 MCP server | 12 | [Q42](#/q/ab-620/42) [Q43](#/q/ab-620/43) [Q47](#/q/ab-620/47) [Q50](#/q/ab-620/50) [Q51](#/q/ab-620/51) [Q53](#/q/ab-620/53) [Q56](#/q/ab-620/56) [Q74](#/q/ab-620/74) [Q75](#/q/ab-620/75) [Q80](#/q/ab-620/80) [Q82](#/q/ab-620/82) [Q83](#/q/ab-620/83) |
| 7 | 主题内局部约束："in a topic"、"only within a specific topic"、"scope the topic node to designated data"、"approved enterprise data only"、"only generate when relevant indexed content is retrieved"、"executive summary format" | 主题里的 generative answers node：Input 选 Activity.Text、Search only selected sources、清除 Allow the AI to use its own general knowledge、require grounding；格式需求用 topic-level custom prompt tool，并保留 generative answers node | 只在 agent 级加 SharePoint 知识；加一句 prompt "只答公司数据"；删除 generative answers node；用 prompt 限制 connector 访问；enable citations / conversational boosting；增大 response length | 7 | [Q15](#/q/ab-620/15) [Q36](#/q/ab-620/36) [Q39](#/q/ab-620/39) [Q68](#/q/ab-620/68) [Q71](#/q/ab-620/71) [Q72](#/q/ab-620/72) [Q85](#/q/ab-620/85) |
| 8 | "move / transport agent between environments"、"exportable package"、"ALM"、"without rebuilding"、"consistent way to manage agent assets" | 从 Solutions 区 create a custom solution → add the existing agent → export（dev 导 unmanaged）→ import 到目标环境（prod 用 managed）。建 solution 本身：打开 Solutions 区 → 定义名称与 publisher → 保存（[Q114](#/q/ab-620/114)）。在 Copilot Studio in Teams 里建的 agent 用 Teams 的 export/import（[Q111](#/q/ab-620/111)） | Publish to a channel 当容器 / 传输机制；直接 export agent；先 convert to managed 才能导出；remove topics/components；duplicate 并手工重建；"pipelines 自动发现未放进 solution 的 agent" | 8 | [Q19](#/q/ab-620/19) [Q90](#/q/ab-620/90) [Q94](#/q/ab-620/94) [Q95](#/q/ab-620/95) [Q107](#/q/ab-620/107) [Q108](#/q/ab-620/108) [Q111](#/q/ab-620/111) [Q114](#/q/ab-620/114) |
| 9 | "REST API"、"external API with API key"、"lightweight external API"、"structured JSON"、"authentication header"、"call during a conversation" | Send HTTP request node（headers 放认证、GET 取数、JSON data type + 存到变量）或 REST API tool（OpenAPI）。REST tool 顺序：Add the REST API tool → Configure endpoint details → Configure authentication → Test | Add API as knowledge source；enable generative answers 让模型自己取数；Formula / Redirect node / global variable 拼 URL；Parse JSON | 6 | [Q16](#/q/ab-620/16) [Q40](#/q/ab-620/40) [Q64](#/q/ab-620/64) [Q65](#/q/ab-620/65) [Q67](#/q/ab-620/67) [Q69](#/q/ab-620/69) |
| 10 | "reusable instruction template"、"approved model"、"not on the approved list"、"enterprise-approved foundation model"、"governance requirements" | 在 custom prompt（AI Builder prompt tool）或 generative answers 配置里从 Microsoft Foundry model catalog 选模型 + 继续套用那个 reusable prompt template（[Q60](#/q/ab-620/60) 的说法："Deploy a model in Foundry … and connect to Copilot Studio"） | Publish；enable citations；把 Azure AI Search 当 grounding 来"enforce model"；在 instructions 里写一句"只用批准模型"（唯一例外是 [Q52](#/q/ab-620/52)：那份抄本没给选模型的选项，只能退而选这一句）；让 topic 作者各自定义 tone | 6 | [Q2](#/q/ab-620/2) [Q45](#/q/ab-620/45) [Q52](#/q/ab-620/52) [Q60](#/q/ab-620/60) [Q61](#/q/ab-620/61) [Q81](#/q/ab-620/81) |
| 11 | "every AI-generated response"、"disclaimer … consistently"、"tone, disclaimers, and refusal behavior"、"manual edits to individual topics must be avoided"、"before making the agent available on both channels" | Prompt modifications / prompt instructions（agent 级 或 generative answers node settings）；辅以一个总是先运行的 disclaimer topic（[Q5](#/q/ab-620/5)） | 逐 topic 加 disclaimer；greeting 里放一次；disable generative answers；publish 后逐 channel 开 RAI；"duplicate disclaimer across reusable topics" | 5 | [Q1](#/q/ab-620/1) [Q5](#/q/ab-620/5) [Q24](#/q/ab-620/24) [Q25](#/q/ab-620/25) [Q26](#/q/ab-620/26) |
| 12 | Evaluation 结果解读："reported as meeting or missing expected"、"fail repeatedly across several runs"、"displays expected and generated response"、"semantically matches / Score 0.92 / Pass" | 字面结论：Pass or fail status；Consistent outcomes，且"isolate which portions of scope require remediation"；Expected and generated responses；evaluation 的局限 = 给不出 specific underlying cause；语义匹配即 Pass，接受并确认知识源正常 | "full redesign"、"underlying language model issue"、"should not be deployed"、"Production readiness"、"Root cause of failures"、"rerun because score below 1.00"、"modify the test case for exact match"、"investigate tools"（Tools invoked: None） | 5 | [Q88](#/q/ab-620/88) [Q89](#/q/ab-620/89) [Q96](#/q/ab-620/96) [Q101](#/q/ab-620/101) [Q105](#/q/ab-620/105) |
| 13 | 身份："anonymous for general inquiries"、"personal data requires sign-in"、"internal staff / employees only"、"user identity must be used"、"shared or builder credentials must not be used"、"authentication at service level, not per user" | 匿名 / 客户账号登录 / Authenticate with Microsoft Entra ID；数据访问绝不用 author / shared credentials；明确 service-level 时才用 connection（服务账号，[Q48](#/q/ab-620/48)）或 service principal（[Q46](#/q/ab-620/46)） | Use agent author credentials；one shared admin credential；Require Secure Access（只管 web channel）；publish as public website；Authenticate with personal account | 5 | [Q6](#/q/ab-620/6) [Q17](#/q/ab-620/17) [Q24](#/q/ab-620/24) [Q46](#/q/ab-620/46) [Q48](#/q/ab-620/48) |
| 14 | "repeatable"、"consistent across multiple test runs"、"predefined / prepared interactions rather than impromptu"、"before expanding access"、"baseline" | Test set：curated prompt list + predefined expected outcomes + consistent scoring matrix，on demand 触发。创建顺序：identify high-value intents → author representative prompts → define expected outcomes → baseline；整体评估顺序：define success criteria → select method and metrics → collect data → review results（[Q116](#/q/ab-620/116)） | Telemetry / analytics；live conversations / production scores；expand to more channels；qualitative；user feedback after rollout；manual transcript review、Test your agent pane 手工测、channel usage metrics；scheduled runs | 8 | [Q86](#/q/ab-620/86) [Q92](#/q/ab-620/92) [Q103](#/q/ab-620/103) [Q104](#/q/ab-620/104) [Q112](#/q/ab-620/112) [Q113](#/q/ab-620/113) [Q115](#/q/ab-620/115) [Q116](#/q/ab-620/116) |
| 15 | "MCP server"、"standardized tool interface"、"callable tools"、"requires authentication"、"only the allowed capabilities"、"without embedding credentials in topic steps" | 在 Tools 里 Add the MCP server；认证配在 connection（如 API key header X-API-Key）；勾选允许的 tools（CreateTicket…）；Server URL 指向后端；认证类型按 requirement 选：per-user → OAuth 2.0、共享 key → API key；Server description 写清服务器职责，供编排器判断何时调用（[Q84](#/q/ab-620/84)） | Upload documentation about the MCP server；enable generative answers 自动调用；indexed knowledge source；用 real-time knowledge 替代；用 custom connector 重写 MCP server；publish 后依赖默认设置；所有 server 用同一认证类型 | 7 | [Q54](#/q/ab-620/54) [Q58](#/q/ab-620/58) [Q62](#/q/ab-620/62) [Q66](#/q/ab-620/66) [Q73](#/q/ab-620/73) [Q79](#/q/ab-620/79) [Q84](#/q/ab-620/84) |
| 16 | Flow 失败处理："must not terminate silently"、"notification containing the error details"、"can occasionally fail or time out"、"handle failure and timeout outcomes explicitly … avoid retrying" | Configure run after conditions（失败 / 超时分支）+ Send a notification with error details；需要整组处理时加 Scope（try-catch） | 只 retry；Terminate the flow immediately on error；Increase the timeout；concurrency control | 5 | [Q21](#/q/ab-620/21) [Q22](#/q/ab-620/22) [Q23](#/q/ab-620/23) [Q27](#/q/ab-620/27) [Q110](#/q/ab-620/110) |
| 17 | "Azure AI Search"、"vector index"、"centralized data index"、"authenticated access / governance" | Add knowledge → Create a new Azure AI Search connection → 选 authentication type（governed 场景选 service principal）+ Endpoint URL → 填 index name → 加入 agent | Upload documents into the agent；先选 index 再认证；把 Enable citations 当连接配置 | 5 | [Q46](#/q/ab-620/46) [Q49](#/q/ab-620/49) [Q60](#/q/ab-620/60) [Q68](#/q/ab-620/68) [Q81](#/q/ab-620/81) |
| 18 | "Power Platform Pipelines"、"controlled, repeatable deployments"、"multi-stage approvals"、"limited to a defined set of users"、"deploy in order"、"identify missing connection references before deployment"、"single unified location" | 顺序：Enable pipelines for the tenant → Assign environments to stages → Trigger a run → Review results；stage access 限人；sequential stage progression；deployment input validation；centralized pipeline configuration | Direct target environment selection；environment-specific deployment packages；environment-level customization；builder-defined settings | 4 | [Q87](#/q/ab-620/87) [Q97](#/q/ab-620/97) [Q99](#/q/ab-620/99) [Q102](#/q/ab-620/102) |
| 19 | "existing custom connector"、"internal API that lacks a prebuilt connector"、"valid connection"、"input values at runtime"、"surface returned data" | 顺序：Add the connector as a tool → Create or reuse a connection → Map topic variables to tool inputs → Parse JSON response into a topic variable；内部无连接器 API → custom connector | Add as knowledge source；Dataverse connector；Generative AI knowledge | 3 | [Q7](#/q/ab-620/7) [Q40](#/q/ab-620/40) [Q48](#/q/ab-620/48) |
| 20 | "prevent disallowed connectors / insecure data flows"、"enforce governance controls"、"block unauthorized data flows / connectors" | Data policies（Power Platform DLP） | Application Insights；agent analytics；security FAQs；Purview（[Q1](#/q/ab-620/1) 多余 tile） | 3 | [Q1](#/q/ab-620/1) [Q25](#/q/ab-620/25) [Q34](#/q/ab-620/34) |
| 21 | "legacy desktop application that does not use APIs"、"interact with the UI"、"supported execution context"、"inspect how each automation step executes" | Enable Computer use；platform-hosted execution environment；在 agent runtime view / testing pane 的 remote session 看运行细节 | Custom connector 模拟 UI；Desktop flow；加为 knowledge source；publish | 3 | [Q63](#/q/ab-620/63) [Q70](#/q/ab-620/70) [Q98](#/q/ab-620/98) |
| 22 | "locked-down version"、"prevents direct modification"、"deployment-ready" vs "developers continue modifying" | Managed solution（prod）/ Unmanaged solution（dev） | Default solution；standalone agent outside a solution；"先 convert to managed 才能 export" | 3 | [Q19](#/q/ab-620/19) [Q87](#/q/ab-620/87) [Q94](#/q/ab-620/94) |
| 23 | Flow 监控："stop additional failed executions"、"process a failed execution"、"validate most recent executions immediately"、"intermittently produces unexpected results" | Disable the flow；Resubmit the run；Review run / Activity history；Inspect failed run details | Delete the flow；cancel the most recent run；modify trigger；Analytics summary（聚合、非即时）；"Error column in the Activity tab"（不存在）；increase connector timeout | 2 | [Q9](#/q/ab-620/9) [Q100](#/q/ab-620/100) |
| 24 | Agent ↔ flow 数据交换："send data into the flow"、"receive structured results back from the same run"、"unexpected or empty values" | Trigger（When an agent calls the flow）加 input parameters；Respond to the agent 加 output parameters；排错先 Validate parameter definitions。建 flow 顺序：Create agent flow → 定义 inputs → 加 connector action 并配 connection → 定义 outputs → Test（[Q76](#/q/ab-620/76)） | Internal variable；store only in topic / flow；log to run history；change trigger schema；Parse JSON；republish | 3 | [Q12](#/q/ab-620/12) [Q14](#/q/ab-620/14) [Q76](#/q/ab-620/76) |
| 25 | "human input before continuing"、"wait for a manual decision"、"collect information and then continue"、"same flow run" | Human approval action：等待并返回响应、输出供后续步骤使用、按决定分支；信息收集 = wait for a response and capture inputs | Send notification and continue immediately；manual trigger；trigger a new flow run；republish after decision | 2 | [Q11](#/q/ab-620/11) [Q35](#/q/ab-620/35) |
| 26 | "reuse the same set of components across agents without copying"、"limit who can edit shared assets"、"share authored topics and prompts across environments" | Component collection；share with teammates while controlling edit access；可 restrict 给单一 agent | Export solution and copy assets；manually rebuild；duplicate | 2 | [Q44](#/q/ab-620/44) [Q99](#/q/ab-620/99) |
| 27 | 主题里的节点选择："let the agent decide when to run a tool" / "run a specific flow at a defined step" / "replicates logic already in another flow" / "explains a process but does not execute it" | Enable generative orchestration / tool node / tool node / generative answers node | Question node 让用户选工具；Adaptive Card 当调用方式；Go to another topic；manually rebuild the logic；display a static message | 2 | [Q38](#/q/ab-620/38) [Q41](#/q/ab-620/41) |
| 28 | 职责分离：Copilot connector 的 "tenant administration" / "builder configuration" / "agent runtime behavior"；"a tenant administrator configures a Copilot connector" | 管理员在 Microsoft 365 admin center 配置；builder 只 Add the Copilot connector as a knowledge source；运行时 agent 调用该知识源 | 在 Power Platform Admin Center 配置；在 Copilot Studio 里 create a new Copilot connector；新建 custom connector | 2 | [Q30](#/q/ab-620/30) [Q59](#/q/ab-620/59) |
| 29 | 回复细节："collect structured input in a single step + store values" → Ask with Adaptive Card node + input fields + Action.Submit；"HTML is not supported" → Markdown | 见左 | Paste card JSON into a Message node；Action.Execute；"latest schema version in all channels"；Insert HTML | 2 | [Q26](#/q/ab-620/26) [Q37](#/q/ab-620/37) |
| 30 | "centralized monitoring"、"Application Insights"、"agent activity is not included in the monitoring data"、"investigate why responses are filtered" | 顺序：Create / identify the Application Insights resource → Configure the monitoring destination（connection string）→ Enable monitoring → Publish；查 RAI 拦截原因 → Review Application Insights telemetry，查是哪句输入触发 → conversation transcripts，拦截强度 → content filtering level（[Q78](#/q/ab-620/78)） | 配置 generative answers / model catalog（无关 tile）；disable generative responses、换 region、publishing history、connector run history | 2 | [Q78](#/q/ab-620/78) [Q106](#/q/ab-620/106) |

补充说明（最常被考反的三条）：
- 规则 2（Publish）的判断口诀：被问的是"如何改变配置"→ publish 错；被问的是"如何让已改的配置生效 / 让别的 agent 调得到"→ publish 对。
- 规则 5 的三种环境变量行为（[Q32](#/q/ab-620/32) [Q91](#/q/ab-620/91) [Q93](#/q/ab-620/93) [Q109](#/q/ab-620/109)）：secret → 运行时取、不用 republish；任何类型在 Copilot Studio 都只读、由管理员在 Power Apps 改；非 secret 改后必须 republish。社区在 [Q32](#/q/ab-620/32) 第三行选了"自动拉取"，与 Learn 文档相反。
- 规则 3/4 的分界词只有一个："index"。题干出现 indexed / searchable → Copilot connector 或 Azure AI Search；出现 without indexing / live / real-time → Power Platform real-time connector；出现 static PDF → 上传文件（[Q13](#/q/ab-620/13)）。

---


## AB-620 · 干扰项、热区冷区、case study 与答题策略 {#ab620-tactics}

### 干扰项套路

| # | 套路 | 长相（原文片段） | 出现题 | 识别方法 |
|---|---|---|---|---|
| 1 | "Publish 万能药" | "Publish the agent so that the model … is updated automatically"、"Publish the agent so automation settings are applied at runtime"、"Publish the agent and rely on default settings" | [Q2](#/q/ab-620/2) [Q14](#/q/ab-620/14) [Q25](#/q/ab-620/25) [Q43](#/q/ab-620/43) [Q45](#/q/ab-620/45) [Q52](#/q/ab-620/52) [Q53](#/q/ab-620/53) [Q54](#/q/ab-620/54) [Q61](#/q/ab-620/61) [Q63](#/q/ab-620/63) [Q79](#/q/ab-620/79) [Q83](#/q/ab-620/83) [Q98](#/q/ab-620/98) [Q108](#/q/ab-620/108) | 发布不会改变任何配置。只在 [Q10](#/q/ab-620/10) [Q18](#/q/ab-620/18) [Q32](#/q/ab-620/32) [Q50](#/q/ab-620/50) [Q77](#/q/ab-620/77) [Q83](#/q/ab-620/83) [Q93](#/q/ab-620/93) [Q106](#/q/ab-620/106) 这类"让配置生效 / 让 agent 可被调用"的语境下才是正确步骤。 |
| 2 | 逐 topic 手工改 | "Edit every topic's first message"、"Add required disclaimer text inside each individual topic"、"Write individual Q&A pairs for each document as separate topics"、"Manually rebuild the logic in the topic"、"Allow topic authors to define tone … in topic steps" | [Q4](#/q/ab-620/4) [Q5](#/q/ab-620/5) [Q25](#/q/ab-620/25) [Q26](#/q/ab-620/26) [Q41](#/q/ab-620/41) [Q61](#/q/ab-620/61) | 题干 / case 出现 consistent、scalable、reusable、avoid manual edits 时，逐 topic 方案必错；正确答案在 agent 级（prompt modifications、knowledge source、tool node 调 flow）。 |
| 3 | 知识 ↔ 工具混淆 | 需要执行却给 "Add the target agent as an indexed knowledge source"、"Upload documentation about the MCP server"、"Add the desktop application as a knowledge source"；需要 grounding 却给 "Add the connector as a tool and invoke it from a topic" | [Q7](#/q/ab-620/7) [Q28](#/q/ab-620/28) [Q30](#/q/ab-620/30) [Q42](#/q/ab-620/42) [Q43](#/q/ab-620/43) [Q50](#/q/ab-620/50) [Q51](#/q/ab-620/51) [Q53](#/q/ab-620/53) [Q54](#/q/ab-620/54) [Q63](#/q/ab-620/63) [Q65](#/q/ab-620/65) [Q66](#/q/ab-620/66) [Q67](#/q/ab-620/67) [Q73](#/q/ab-620/73) [Q74](#/q/ab-620/74) [Q75](#/q/ab-620/75) [Q79](#/q/ab-620/79) [Q83](#/q/ab-620/83) | 先定需求动词（规则 1）。"indexed knowledge source" 是几乎所有 multi-agent / MCP 题的固定错误 tile（[Q42](#/q/ab-620/42) [Q43](#/q/ab-620/43) [Q50](#/q/ab-620/50) [Q51](#/q/ab-620/51) [Q53](#/q/ab-620/53) [Q54](#/q/ab-620/54) [Q66](#/q/ab-620/66) [Q75](#/q/ab-620/75) [Q83](#/q/ab-620/83)）。 |
| 4 | 索引型 vs 实时型 | Copilot connector / Azure AI Search / "Add Dataverse tables as a structured data knowledge source" 与 Power Platform real-time connector 并列 | [Q13](#/q/ab-620/13) [Q29](#/q/ab-620/29) [Q55](#/q/ab-620/55) [Q57](#/q/ab-620/57) [Q58](#/q/ab-620/58) | 找 "index" 这个词：有 "without indexing / live / real-time" → real-time connector；有 "indexed / searchable" → Copilot connector。 |
| 5 | 假治理控件 | "Enable citations so … comply with governance"、"Configure Azure AI Search as the grounding source so the approved model requirement is enforced"、"Enable conversational boosting and select a Foundry-approved model"、"Add a line to the instruction template that requires … approved models" | [Q2](#/q/ab-620/2) [Q45](#/q/ab-620/45) [Q52](#/q/ab-620/52) [Q61](#/q/ab-620/61) [Q68](#/q/ab-620/68) | 模型选择只能在 prompt 配置里选 Foundry model catalog；citations 只解决 traceability（[Q60](#/q/ab-620/60) [Q81](#/q/ab-620/81) 是它正确的地方）。[Q52](#/q/ab-620/52) 是例外：那份抄本缺了选模型的选项，"Add a line …" 只是排除法剩下的一项，完整版见 [Q2](#/q/ab-620/2)。 |
| 6 | 观察 ≠ 执行 | 用 Application Insights / analytics / telemetry / security FAQs 去 "enforce"；用 analytics summary 去 "diagnose" | [Q34](#/q/ab-620/34) [Q86](#/q/ab-620/86) [Q100](#/q/ab-620/100) [Q104](#/q/ab-620/104) [Q112](#/q/ab-620/112) [Q113](#/q/ab-620/113) | enforce → DLP / data policies；diagnose → run history + failed run details；evaluate → test set。 |
| 7 | Prompt 当安全控件 | "Add instructions in the custom prompt tool to restrict connector access"、"Add a custom prompt that tells the agent to answer only from company data" | [Q15](#/q/ab-620/15) [Q71](#/q/ab-620/71) | 安全靠 connection / DLP / permissions；grounding 靠 generative answers node 的知识源配置，不靠一句话。 |
| 8 | 共享 / 作者凭据 | "Use agent author credentials for authenticated data calls"、"one shared admin credential for all internal data access"、"Bypass permissions for faster retrieval"、"Respect existing permissions from agent authors" | [Q6](#/q/ab-620/6) [Q20](#/q/ab-620/20) [Q24](#/q/ab-620/24) | 出现 user identity / traceable → 用户身份；只有明确 "service level, not per user" 才用服务连接（[Q48](#/q/ab-620/48)）或 service principal（[Q46](#/q/ab-620/46)）。 |
| 9 | 错的管理中心 | "Configure the Copilot connector in Power Platform Admin Center"、"Create a new Copilot connector directly in Copilot Studio"、"Create a new custom connector inside the agent configuration" | [Q30](#/q/ab-620/30) [Q59](#/q/ab-620/59) | Copilot connector 归 Microsoft 365 admin center；DLP 归 Power Platform admin center。 |
| 10 | 过度推断的结论 | "overall design is flawed and requires a full redesign"、"caused by an issue in the underlying language model"、"should not be deployed"、"Production readiness"、"Root cause of failures"、"Rerun because the score is below 1.00"、"Modify the test case because not an exact match" | [Q88](#/q/ab-620/88) [Q89](#/q/ab-620/89) [Q96](#/q/ab-620/96) [Q101](#/q/ab-620/101) [Q105](#/q/ab-620/105) | 选最字面、最保守的结论。 |
| 11 | 排序陷阱 | 认证放在 tool / endpoint 之前（[Q69](#/q/ab-620/69) 社区答案）；选 tables / index 放在建 connection 之前（[Q3](#/q/ab-620/3) [Q8](#/q/ab-620/8) [Q49](#/q/ab-620/49)）；publish 放在 channel / 配置之后（[Q18](#/q/ab-620/18)）；make available 放在 test 之前（[Q10](#/q/ab-620/10)）；assign environments 放在 enable pipelines 之前（[Q97](#/q/ab-620/97)）；enable monitoring 放在建资源之前（[Q106](#/q/ab-620/106)）；collect data 放在 define success criteria 之前（[Q116](#/q/ab-620/116)）；把 Entra app registration、channel 配置、review solution details 这类非依赖步骤塞进序列（[Q77](#/q/ab-620/77) [Q114](#/q/ab-620/114)）；用 adversarial testing 替代 moderation filters 当"配置步骤"（[Q1](#/q/ab-620/1) 社区答案） | 见左 | 口诀：容器（tool / connection / resource / solution / pipeline）→ 内容（endpoint / tables / index / stages）→ 认证紧随容器 → 验证 → 发布 / 加入 agent。 |
| 12 | Channel 当 ALM 容器 | "Publish the agent to a channel and export the channel configuration"、"use that channel configuration as the ALM container"、"channel … as the transport mechanism" | [Q19](#/q/ab-620/19) [Q90](#/q/ab-620/90) [Q95](#/q/ab-620/95) [Q108](#/q/ab-620/108) | ALM 容器永远是 solution。 |
| 13 | 近义 tile 配对 | "Use real-time connector" vs "Retrieve data without indexing"（[Q29](#/q/ab-620/29)）；"Retrieve indexed content" vs "Retrieve live data at runtime"（[Q20](#/q/ab-620/20)）；"Configure the Copilot Studio endpoint URL" vs "Configure the project endpoint URL"（[Q53](#/q/ab-620/53)）；"Disable the flow" vs "Delete the flow" vs "Cancel the most recent run"（[Q9](#/q/ab-620/9)）；"Consistent outcomes" vs "Intermittent outcomes"（[Q88](#/q/ab-620/88) [Q105](#/q/ab-620/105)） | 见左 | 用需求里的关键词逐字对应（"avoid copying into an index" ↔ "without indexing"；"same three fail in every run" ↔ consistent）。 |
| 14 | 相邻机制替代 | Desktop flow / custom connector 模拟 UI（[Q63](#/q/ab-620/63) [Q98](#/q/ab-620/98)）；Go to another topic 当调 flow（[Q41](#/q/ab-620/41)）；Question node 让用户选工具、Adaptive Card 当调用（[Q38](#/q/ab-620/38)）；Power Automate flow 代替 Fabric Data Agent（[Q56](#/q/ab-620/56)）；Require Secure Access 代替 Entra ID 认证（[Q17](#/q/ab-620/17)）；Parse JSON 代替修 parameter（[Q14](#/q/ab-620/14)）；Power Platform connector tool 代替 A2A（[Q74](#/q/ab-620/74) [Q75](#/q/ab-620/75)）；custom connector 重写 MCP server（[Q73](#/q/ab-620/73)）；加大 timeout / concurrency control 代替 run after（[Q110](#/q/ab-620/110)） | 见左 | 每个需求只有一个"正名"机制；相邻机制是为了测你是否知道正名。 |
| 15 | 环境变量三连错 | "Replace environment variables with hard-coded values"、"Allow builders to change environment variable values directly in Copilot Studio"、"Assume all updates take effect immediately … without republishing" | [Q31](#/q/ab-620/31) [Q32](#/q/ab-620/32) [Q93](#/q/ab-620/93) [Q109](#/q/ab-620/109) | 环境变量在 Copilot Studio 只读；只有 secret 运行时解析；非 secret 要 republish。 |

---


### 考纲热区与冷区

#### 三大领域分布（按每题主考点归属）

| 领域 | 官方权重 | 题库题数 | 题库占比 | 结论 |
|---|---|---|---|---|
| A. Plan and configure agent solutions | 30–35% | 37 | 32% | 吻合 |
| B. Integrate and extend agents | 40–45% | 49 | 42% | 吻合 |
| C. Test and manage agents | 20–25% | 30 | 26% | 略高 |

题库分布与官方权重几乎一致，可作为"考试权重 = 题库权重"的依据。

A 域题：[Q1](#/q/ab-620/1) [Q5](#/q/ab-620/5) [Q6](#/q/ab-620/6) [Q9](#/q/ab-620/9) [Q10](#/q/ab-620/10) [Q11](#/q/ab-620/11) [Q12](#/q/ab-620/12) [Q14](#/q/ab-620/14) [Q15](#/q/ab-620/15) [Q16](#/q/ab-620/16) [Q17](#/q/ab-620/17) [Q18](#/q/ab-620/18) [Q21](#/q/ab-620/21) [Q22](#/q/ab-620/22) [Q23](#/q/ab-620/23) [Q24](#/q/ab-620/24) [Q25](#/q/ab-620/25) [Q26](#/q/ab-620/26) [Q27](#/q/ab-620/27) [Q33](#/q/ab-620/33) [Q34](#/q/ab-620/34) [Q35](#/q/ab-620/35) [Q36](#/q/ab-620/36) [Q37](#/q/ab-620/37) [Q38](#/q/ab-620/38) [Q39](#/q/ab-620/39) [Q41](#/q/ab-620/41) [Q44](#/q/ab-620/44) [Q64](#/q/ab-620/64) [Q71](#/q/ab-620/71) [Q72](#/q/ab-620/72) [Q76](#/q/ab-620/76) [Q77](#/q/ab-620/77) [Q78](#/q/ab-620/78) [Q85](#/q/ab-620/85) [Q100](#/q/ab-620/100) [Q110](#/q/ab-620/110)
B 域题：[Q2](#/q/ab-620/2) [Q3](#/q/ab-620/3) [Q4](#/q/ab-620/4) [Q7](#/q/ab-620/7) [Q8](#/q/ab-620/8) [Q13](#/q/ab-620/13) [Q20](#/q/ab-620/20) [Q28](#/q/ab-620/28) [Q29](#/q/ab-620/29) [Q30](#/q/ab-620/30) [Q40](#/q/ab-620/40) [Q42](#/q/ab-620/42) [Q43](#/q/ab-620/43) [Q45](#/q/ab-620/45) [Q46](#/q/ab-620/46) [Q47](#/q/ab-620/47) [Q48](#/q/ab-620/48) [Q49](#/q/ab-620/49) [Q50](#/q/ab-620/50) [Q51](#/q/ab-620/51) [Q52](#/q/ab-620/52) [Q53](#/q/ab-620/53) [Q54](#/q/ab-620/54) [Q55](#/q/ab-620/55) [Q56](#/q/ab-620/56) [Q57](#/q/ab-620/57) [Q58](#/q/ab-620/58) [Q59](#/q/ab-620/59) [Q60](#/q/ab-620/60) [Q61](#/q/ab-620/61) [Q62](#/q/ab-620/62) [Q63](#/q/ab-620/63) [Q65](#/q/ab-620/65) [Q66](#/q/ab-620/66) [Q67](#/q/ab-620/67) [Q68](#/q/ab-620/68) [Q69](#/q/ab-620/69) [Q70](#/q/ab-620/70) [Q73](#/q/ab-620/73) [Q74](#/q/ab-620/74) [Q75](#/q/ab-620/75) [Q79](#/q/ab-620/79) [Q80](#/q/ab-620/80) [Q81](#/q/ab-620/81) [Q82](#/q/ab-620/82) [Q83](#/q/ab-620/83) [Q84](#/q/ab-620/84) [Q98](#/q/ab-620/98) [Q106](#/q/ab-620/106)
C 域题：[Q19](#/q/ab-620/19) [Q31](#/q/ab-620/31) [Q32](#/q/ab-620/32) [Q86](#/q/ab-620/86) [Q87](#/q/ab-620/87) [Q88](#/q/ab-620/88) [Q89](#/q/ab-620/89) [Q90](#/q/ab-620/90) [Q91](#/q/ab-620/91) [Q92](#/q/ab-620/92) [Q93](#/q/ab-620/93) [Q94](#/q/ab-620/94) [Q95](#/q/ab-620/95) [Q96](#/q/ab-620/96) [Q97](#/q/ab-620/97) [Q99](#/q/ab-620/99) [Q101](#/q/ab-620/101) [Q102](#/q/ab-620/102) [Q103](#/q/ab-620/103) [Q104](#/q/ab-620/104) [Q105](#/q/ab-620/105) [Q107](#/q/ab-620/107) [Q108](#/q/ab-620/108) [Q109](#/q/ab-620/109) [Q111](#/q/ab-620/111) [Q112](#/q/ab-620/112) [Q113](#/q/ab-620/113) [Q114](#/q/ab-620/114) [Q115](#/q/ab-620/115) [Q116](#/q/ab-620/116)

#### 子项命中次数（一题可计入多个子项；按命中数排序）

| 子项 | 命中 | 题号 | 热/冷 |
|---|---|---|---|
| B1.1 Copilot connectors | 8 | [Q4](#/q/ab-620/4) [Q20](#/q/ab-620/20) [Q28](#/q/ab-620/28) [Q30](#/q/ab-620/30) [Q55](#/q/ab-620/55) [Q57](#/q/ab-620/57) [Q58](#/q/ab-620/58) [Q59](#/q/ab-620/59) | 热 |
| C2.1 Create a solution | 8 | [Q19](#/q/ab-620/19) [Q90](#/q/ab-620/90) [Q94](#/q/ab-620/94) [Q95](#/q/ab-620/95) [Q107](#/q/ab-620/107) [Q108](#/q/ab-620/108) [Q111](#/q/ab-620/111) [Q114](#/q/ab-620/114) | 热 |
| B2.2 MCP tools | 7 | [Q54](#/q/ab-620/54) [Q58](#/q/ab-620/58) [Q62](#/q/ab-620/62) [Q66](#/q/ab-620/66) [Q73](#/q/ab-620/73) [Q79](#/q/ab-620/79) [Q84](#/q/ab-620/84) | 热 |
| C1.2 Choose an evaluation method | 7 | [Q92](#/q/ab-620/92) [Q101](#/q/ab-620/101) [Q104](#/q/ab-620/104) [Q112](#/q/ab-620/112) [Q113](#/q/ab-620/113) [Q115](#/q/ab-620/115) [Q116](#/q/ab-620/116) | 热 |
| C1.3 Review test results | 7 | [Q88](#/q/ab-620/88) [Q89](#/q/ab-620/89) [Q96](#/q/ab-620/96) [Q101](#/q/ab-620/101) [Q105](#/q/ab-620/105) [Q113](#/q/ab-620/113) [Q116](#/q/ab-620/116) | 热 |
| C2.3 Environment variables | 7 | [Q31](#/q/ab-620/31) [Q32](#/q/ab-620/32) [Q87](#/q/ab-620/87) [Q91](#/q/ab-620/91) [Q93](#/q/ab-620/93) [Q99](#/q/ab-620/99) [Q109](#/q/ab-620/109) | 热 |
| A1.1 Plan integration with enterprise systems | 6 | [Q13](#/q/ab-620/13) [Q40](#/q/ab-620/40) [Q47](#/q/ab-620/47) [Q55](#/q/ab-620/55) [Q57](#/q/ab-620/57) [Q58](#/q/ab-620/58) | 热 |
| A1.2 Plan identity strategy | 6 | [Q6](#/q/ab-620/6) [Q17](#/q/ab-620/17) [Q24](#/q/ab-620/24) [Q46](#/q/ab-620/46) [Q48](#/q/ab-620/48) [Q62](#/q/ab-620/62) | 热 |
| A1.4 Responsible AI strategy | 6 | [Q1](#/q/ab-620/1) [Q5](#/q/ab-620/5) [Q24](#/q/ab-620/24) [Q25](#/q/ab-620/25) [Q26](#/q/ab-620/26) [Q78](#/q/ab-620/78) | 热 |
| B1.2 Power Platform connectors（real-time） | 6 | [Q3](#/q/ab-620/3) [Q8](#/q/ab-620/8) [Q13](#/q/ab-620/13) [Q29](#/q/ab-620/29) [Q55](#/q/ab-620/55) [Q57](#/q/ab-620/57) | 热 |
| B3.1 Design multi-agent solutions | 6 | [Q47](#/q/ab-620/47) [Q74](#/q/ab-620/74) [Q75](#/q/ab-620/75) [Q80](#/q/ab-620/80) [Q82](#/q/ab-620/82) [Q83](#/q/ab-620/83) | 热 |
| C1.1 Create a test set | 6 | [Q86](#/q/ab-620/86) [Q103](#/q/ab-620/103) [Q104](#/q/ab-620/104) [Q112](#/q/ab-620/112) [Q113](#/q/ab-620/113) [Q115](#/q/ab-620/115) | 热 |
| A2.6 Error handling in agent flows | 5 | [Q21](#/q/ab-620/21) [Q22](#/q/ab-620/22) [Q23](#/q/ab-620/23) [Q27](#/q/ab-620/27) [Q110](#/q/ab-620/110) | 热（Yes/No 4 题 + 多选 1 题） |
| A3.3 Add tools to a topic | 5 | [Q7](#/q/ab-620/7) [Q38](#/q/ab-620/38) [Q48](#/q/ab-620/48) [Q65](#/q/ab-620/65) [Q67](#/q/ab-620/67) | 热 |
| A3.7 Generative answers node | 5 | [Q5](#/q/ab-620/5) [Q15](#/q/ab-620/15) [Q36](#/q/ab-620/36) [Q39](#/q/ab-620/39) [Q68](#/q/ab-620/68) | 热 |
| B1.3 Azure AI Search | 5 | [Q46](#/q/ab-620/46) [Q49](#/q/ab-620/49) [Q60](#/q/ab-620/60) [Q68](#/q/ab-620/68) [Q81](#/q/ab-620/81) | 热 |
| B4.2 Custom prompts + Foundry model catalog | 5 | [Q2](#/q/ab-620/2) [Q45](#/q/ab-620/45) [Q52](#/q/ab-620/52) [Q61](#/q/ab-620/61) [Q81](#/q/ab-620/81) | 热 |
| A1.5 Security and governance | 4 | [Q1](#/q/ab-620/1) [Q24](#/q/ab-620/24) [Q25](#/q/ab-620/25) [Q34](#/q/ab-620/34) | 中 |
| A3.4 Custom prompts in topics | 4 | [Q39](#/q/ab-620/39) [Q71](#/q/ab-620/71) [Q72](#/q/ab-620/72) [Q85](#/q/ab-620/85) | 中（全部是 Yes/No） |
| B3.4 Fabric data agent | 4 | [Q47](#/q/ab-620/47) [Q56](#/q/ab-620/56) [Q80](#/q/ab-620/80) [Q82](#/q/ab-620/82) | 中 |
| B3.5 A2A protocol | 4 | [Q42](#/q/ab-620/42) [Q51](#/q/ab-620/51) [Q74](#/q/ab-620/74) [Q75](#/q/ab-620/75) | 中 |
| C2.4 Power Platform Pipelines | 4 | [Q87](#/q/ab-620/87) [Q97](#/q/ab-620/97) [Q99](#/q/ab-620/99) [Q102](#/q/ab-620/102) | 中 |
| A1.3 Channels and deployment | 3 | [Q18](#/q/ab-620/18) [Q25](#/q/ab-620/25) [Q77](#/q/ab-620/77) | 中 |
| A1.6 Reusable components | 3 | [Q41](#/q/ab-620/41) [Q44](#/q/ab-620/44) [Q99](#/q/ab-620/99) | 中 |
| A1.7 Internal vs external audiences | 3 | [Q6](#/q/ab-620/6) [Q17](#/q/ab-620/17) [Q24](#/q/ab-620/24) | 中 |
| A2.3 Actions and connectors in flows | 3 | [Q33](#/q/ab-620/33) [Q64](#/q/ab-620/64) [Q76](#/q/ab-620/76) | 中 |
| A2.5 Input / output parameters | 3 | [Q12](#/q/ab-620/12) [Q14](#/q/ab-620/14) [Q76](#/q/ab-620/76) | 中 |
| A3.6 HTTP request / API in topics | 3 | [Q16](#/q/ab-620/16) [Q65](#/q/ab-620/65) [Q67](#/q/ab-620/67) | 中 |
| B2.1 Computer use | 3 | [Q63](#/q/ab-620/63) [Q70](#/q/ab-620/70) [Q98](#/q/ab-620/98) | 中 |
| B2.3 Custom connector as tool | 3 | [Q7](#/q/ab-620/7) [Q40](#/q/ab-620/40) [Q48](#/q/ab-620/48) | 中 |
| B2.4 REST APIs | 3 | [Q65](#/q/ab-620/65) [Q67](#/q/ab-620/67) [Q69](#/q/ab-620/69) | 中 |
| B4.1 Generative answers via Azure AI Search + Foundry | 3 | [Q60](#/q/ab-620/60) [Q68](#/q/ab-620/68) [Q81](#/q/ab-620/81) | 中 |
| C2.2 Add existing agents to a solution | 3 | [Q19](#/q/ab-620/19) [Q90](#/q/ab-620/90) [Q111](#/q/ab-620/111) | 中 |
| A2.1 Create an agent flow | 2 | [Q10](#/q/ab-620/10) [Q76](#/q/ab-620/76) | 冷 |
| A2.2 Human-in-the-loop | 2 | [Q11](#/q/ab-620/11) [Q35](#/q/ab-620/35) | 冷 |
| A2.4 Monitor agent flows | 2 | [Q9](#/q/ab-620/9) [Q100](#/q/ab-620/100) | 冷 |
| A3.1 Add agent flows to a topic | 2 | [Q38](#/q/ab-620/38) [Q41](#/q/ab-620/41) | 冷 |
| A3.5 Custom knowledge sources in topics | 2 | [Q15](#/q/ab-620/15) [Q36](#/q/ab-620/36) | 冷 |
| B3.2 Foundry agent | 2 | [Q43](#/q/ab-620/43) [Q53](#/q/ab-620/53) | 冷 |
| B3.3 Integrate existing Copilot Studio agent | 2 | [Q50](#/q/ab-620/50) [Q83](#/q/ab-620/83) | 冷 |
| B4.3 Application Insights | 2 | [Q78](#/q/ab-620/78) [Q106](#/q/ab-620/106) | 冷 |
| A3.2 Response formatting | 1 | [Q26](#/q/ab-620/26)（只考了 Markdown vs HTML） | 冷 |
| A3.8 Adaptive cards | 1 | [Q37](#/q/ab-620/37) | 冷 |
| A3.9 Manage variables | 0 | 无专题题；仅作为 [Q16](#/q/ab-620/16) [Q48](#/q/ab-620/48) [Q67](#/q/ab-620/67) 的一行（"save response to a variable"） | 未独立考 |

#### 考纲里有、题库里没出现的内容

- A1.3：Teams / Microsoft 365 Copilot channel 配置、Direct Line / 自定义渠道、电话渠道——只有 [Q18](#/q/ab-620/18) 及其孪生题 [Q77](#/q/ab-620/77) 考了 Microsoft 365 Agents SDK 集成顺序。
- A1.5：Purview、PPAC 管控、agent sharing / 权限——Purview 只在 [Q1](#/q/ab-620/1) 作多余 tile 出现；DLP 以外的治理没考。
- A1.2：手动 OAuth（generic OAuth2）配置细节没考，只考"选哪种认证"。
- A2.1：除 "When an agent calls the flow" 外的触发器类型没考。
- A3.2：消息变体、语音模式、引用格式没考。
- A3.9：变量作用域（topic / global / system）、Power Fx 没考。
- B1.1/B1.2：Dataverse 结构化知识源只作 [Q58](#/q/ab-620/58) 的错误 tile；知识源数量 / 大小限制（Blue Yonder case 提到）没出题。
- B3.1：orchestration 指令如何保证"metric questions 被路由到 Fabric Data Agent 而不是生成式回答"（Fabrikam issue 第 3 条）没出题；新增的 [Q80](#/q/ab-620/80) [Q82](#/q/ab-620/82) 只考到"按职责拆给 data-access agent / Fabric data agent"这一层。
- B4.3：Kusto 查询 / 遥测字段没考，只考启用顺序（[Q106](#/q/ab-620/106)）和"查拦截原因去看 Application Insights 遥测"（[Q78](#/q/ab-620/78)）。
- C1.2：evaluation method 的具体类型（exact match / AI 判分 / 工具调用）只在 [Q101](#/q/ab-620/101) 以"semantic match"间接出现；[Q112](#/q/ab-620/112) [Q113](#/q/ab-620/113) [Q115](#/q/ab-620/115) 只考"固定 test set vs 线上数据"。
- C2.2：connection references 只作 [Q99](#/q/ab-620/99) 一行出现，没有专题。
- Blue Yonder case 的 human escalation / 转录 / 脱敏、API rate limits（retry + caching）、varied trigger phrases / fallback、authentication UX 全部没出题。

---


### Case study 怎么读

两个 case 的共同写法：Background → Current environment（含数据源清单、集成机制清单）→ Business requirements → Technical requirements → Issues and constraints。几乎每道题的答案都是 requirement 段里某一句的改写；错误项则违反 "must not / must be avoided / not supported / may be used" 这类句子。

#### Blue Yonder Airlines（10 题：[Q1](#/q/ab-620/1) [Q4](#/q/ab-620/4) [Q5](#/q/ab-620/5) [Q6](#/q/ab-620/6) [Q24](#/q/ab-620/24) [Q25](#/q/ab-620/25) [Q26](#/q/ab-620/26) [Q38](#/q/ab-620/38) [Q40](#/q/ab-620/40) [Q41](#/q/ab-620/41)）

| Case 原句（被出题的 requirement 行） | 题号 | 怎么被用 |
|---|---|---|
| "Power Platform DLP policies must be enforced to block unauthorized data flows." | [Q1](#/q/ab-620/1) [Q25](#/q/ab-620/25) | 正确动作 Define / Configure DLP policies；[Q1](#/q/ab-620/1) 排第一（tenant 级治理最先）。 |
| "Responsible AI content moderation filters must be enabled." | [Q1](#/q/ab-620/1) | 正确 tile；社区误选 adversarial testing（那是验证，不是配置）。 |
| "Prompt modifications must be added to enforce tone, disclaimers, and refusal behavior." | [Q1](#/q/ab-620/1) [Q5](#/q/ab-620/5) [Q24](#/q/ab-620/24) [Q25](#/q/ab-620/25) [Q26](#/q/ab-620/26) | 正确项 prompt modifications / prompt instructions；[Q24](#/q/ab-620/24) "relies only on default content filters without custom RAI instructions" → Non-compliant。 |
| "Disclaimers must be applied consistently across all generative responses. Manual edits to individual topics must be avoided." | [Q5](#/q/ab-620/5) [Q25](#/q/ab-620/25) [Q26](#/q/ab-620/26) | 否定一切 "edit every topic / each individual topic / duplicate across topics" 选项。 |
| "must not rely on manually authored Q&A topics for each document" + "Knowledge sources must be used for unstructured content" | [Q4](#/q/ab-620/4) | 正确 "Add the internal policy documents as a knowledge source"；错误 "Write individual Q&A pairs for each document"。 |
| "Travel Advisory Content: Uses REST API with partner services" | [Q4](#/q/ab-620/4) | partner 内容 → Microsoft Graph connector 索引（而非 unrestricted web search）。 |
| "Generative responses must be constrained to avoid policy violations." | [Q4](#/q/ab-620/4) [Q24](#/q/ab-620/24) | "unrestricted / open web search" → 错误 / Non-compliant。 |
| "Customers: Anonymous access for general inquiries (e.g., flight status, baggage policy). Authentication is required for personal data access (e.g., bookings, loyalty points). Internal staff: Authenticate via Microsoft Entra ID." | [Q6](#/q/ab-620/6) [Q24](#/q/ab-620/24) | 三个场景各配一种认证：baggage allowance → anonymous（[Q6](#/q/ab-620/6) 行 1，[Q24](#/q/ab-620/24) 行 1 Compliant）；upcoming trips → customer sign-in；Teams 内部员工查 loyalty profile → Entra ID。 |
| "User identity must be used for data access; shared or builder credentials must not be used." | [Q6](#/q/ab-620/6) [Q24](#/q/ab-620/24) | [Q6](#/q/ab-620/6) 的 "Use agent author credentials" 是故意不该用的 tile；[Q24](#/q/ab-620/24) "one shared admin credential" → Non-compliant。 |
| "Markdown must be used for formatting; HTML is not supported." | [Q26](#/q/ab-620/26) | 正确 "Use Markdown syntax"；错误 "Insert HTML formatting"。 |
| "Custom connectors must be used for internal APIs that lack prebuilt connectors. HTTP request nodes may be used for lightweight external APIs." + 数据源清单（Reservation = 内部 REST 无连接器；Flight Status/Weather = 外部 API key） | [Q40](#/q/ab-620/40) | Internal Reservation → Custom connector；Flight Status and Weather → HTTP request。Dataverse connector、Generative AI knowledge 是多余 tile。 |
| "Agent flows must be used to encapsulate reusable logic (e.g., rebooking)." + "All backend logic must be implemented using agent flows." | [Q38](#/q/ab-620/38) [Q41](#/q/ab-620/41) | "step that triggers a reusable process to update booking details" → tool node；"replicates logic already defined in another flow" → tool node 调 flow，而非 Go to another topic / 重建。 |
| "Deploy the agent across web, mobile, and Teams with a consistent user experience." | [Q25](#/q/ab-620/25) | "before making the agent available on both channels" → agent 级 prompt modifications + DLP，而非逐 channel 设置。 |

没被出题的 Blue Yonder 行：Human escalation（转录、上下文、脱敏）；Performance metrics 五项指标；API rate limits（retries + caching）；Knowledge base limits（大文件拆分 / 摘要）；User input variability（trigger phrases / fallback）；Authentication UX；日志与 weekly reviews；Loyalty Program Data in Dynamics 365 / Dataverse（Dataverse connector 只作 [Q40](#/q/ab-620/40) 多余 tile）；Mobile app in-app chatbot。

#### Fabrikam Inc.（10 题：[Q42](#/q/ab-620/42) [Q43](#/q/ab-620/43) [Q44](#/q/ab-620/44) [Q45](#/q/ab-620/45) [Q46](#/q/ab-620/46) [Q80](#/q/ab-620/80) [Q81](#/q/ab-620/81) [Q82](#/q/ab-620/82) [Q83](#/q/ab-620/83) [Q84](#/q/ab-620/84)）

| Case 原句 | 题号 | 怎么被用 |
|---|---|---|
| "For shipment tracking inquiries, Fabrikam Inc. will delegate to a partner-provided agent that is only available through a standardized agent-to-agent endpoint." | [Q42](#/q/ab-620/42) | → "Configure the partner capability as an A2A integration and supply its endpoint information"。 |
| "Delegate summarization and classification requests to an existing Microsoft Foundry agent." | [Q43](#/q/ab-620/43) [Q45](#/q/ab-620/45) | [Q43](#/q/ab-620/43)：Add an external agent of type Microsoft Foundry + Enter the Foundry project endpoint URL；[Q45](#/q/ab-620/45)：prompt-driven summarization → reusable custom prompt template + 从 Foundry model catalog 选模型。 |
| "The team must reuse the same set of escalation topics, MCP tool definitions, and a standard safety disclaimer across three different agents." + "Only the platform engineering group is allowed to edit shared assets. However, all agent authors must be able to use them." + Issue "Makers are copying and modifying the same components" | [Q44](#/q/ab-620/44) | component collection；share with teammates while controlling edit access；restrict collection to the primary agent。 |
| "A set of indexed documents and procedures in an Azure AI Search service that supports vector search" + "Use an enterprise knowledge source that supports indexed retrieval" + 认证 / 治理要求 | [Q46](#/q/ab-620/46) | service principal 认证；index name；Endpoint URL。 |
| "Traceability requirement: users must be able to see where the answer came from." | [Q46](#/q/ab-620/46)（"Enable citations" 是多余 tile）；[Q81](#/q/ab-620/81) 行 1；非 case 的 [Q60](#/q/ab-620/60) 把 citations 作为正确项 | 同一需求在 [Q46](#/q/ab-620/46) 里是干扰项、在 [Q81](#/q/ab-620/81) "trace each answer back to its source" 和 [Q60](#/q/ab-620/60) 里是答案；要看该行问的是"连接配置"还是"可追溯"。[Q81](#/q/ab-620/81) 另两行：centralized index → Configure Azure AI Search as the grounding data source；enterprise-approved foundation model → Select a model from the Foundry model catalog（"Upload documents directly into the agent" 是干扰 tile）。 |
| "Policy and procedure Q&A … Operational metrics … Authenticated updates"（三项 specialist capability） | [Q80](#/q/ab-620/80) | 每行一个委派对象：policy questions → knowledge-focused agent；metric requirements → data-access agent；transaction requirements → tools-first agent；"Add all logic directly into a single agent and its child agents" 是干扰 tile。 |
| "Metrics requirement: When users ask about service performance … up-to-date metrics" + "Delegate metric queries to a Fabric Data Agent" | [Q82](#/q/ab-620/82) | → "A data agent integrated into the multi-agent solution"；Foundry agent（摘要分类）、MCP tool（事务）、Azure AI Search（policy）各有其主，都是干扰项。 |
| "The primary agent must delegate IT-specific requests to the existing Service Desk Agent rather than reimplement ticket creation logic." | [Q83](#/q/ab-620/83) | Publish the Service Desk Agent + Enable allow connections from other agents on the Service Desk Agent；"Publish Operations Concierge"、indexed knowledge source、换成 MCP server 都错。 |
| "PartsOps MCP server … requires per-user authentication because actions must be traceable to the requesting user. WarrantyRules MCP server … uses an API key shared by the agent team." | [Q84](#/q/ab-620/84) | PartsOps → OAuth 2.0；WarrantyRules → API key；"enough server context to decide when to call" → server description；"Use the same authentication type for the MCP servers" 是干扰 tile。 |

Fabrikam 架构行原先只有"去掉公司名"的孪生题，新增的 [Q80](#/q/ab-620/80)–[Q84](#/q/ab-620/84) 把其中几行直接出成了 case 题（见上表）：
- "Delegate metric queries to a Fabric Data Agent that reads governed business data through the Fabric semantic model" → [Q56](#/q/ab-620/56)、[Q47](#/q/ab-620/47)；case 题 [Q82](#/q/ab-620/82)。
- "delegate IT-specific requests to the existing Service Desk Agent" → [Q50](#/q/ab-620/50)（publish + Add the connected agent）；case 题 [Q83](#/q/ab-620/83)。
- "PartsOps MCP server requires per-user authentication / WarrantyRules MCP server uses an API key" → [Q62](#/q/ab-620/62)（API key header 放 connection）、[Q54](#/q/ab-620/54)、[Q66](#/q/ab-620/66)；case 题 [Q84](#/q/ab-620/84)。
- "Policy Q&A + Operational metrics + Authenticated updates" 三件事 → [Q47](#/q/ab-620/47) 原文照搬（data-access / knowledge-focused / tools-first agent）；case 题 [Q80](#/q/ab-620/80)。
- "Dev, Test, Prod … controlled release process that supports repeatable deployments" → [Q87](#/q/ab-620/87) [Q97](#/q/ab-620/97) [Q102](#/q/ab-620/102)。
- Issue "some metric questions are answered generatively instead of being routed to the Fabric Data Agent" → 没有直接考"怎么修路由"的题；[Q80](#/q/ab-620/80) [Q82](#/q/ab-620/82) 只考到"metric 请求应委派给 data agent"（仍属冷区）。

读 case 的方法：先读 Technical requirements 和 Issues and constraints（答案密度最高），把每句 must / must not 标出来；题目出现时只需找对应句。Background 和 Performance metrics 段在 20 道 case 题中一次都没用到。

---


### 答题策略（由上述规律直接推出）

1. 三步定位法（覆盖规则 1、3、4、7）：先看需求动词（answer / ground → 知识；update / execute / invoke → 工具；delegate → agent），再看新鲜度词（indexed → Copilot connector 或 Azure AI Search；live / without indexing → real-time connector；static file → 上传），最后看范围词（agent 级 vs "only within a specific topic"）。[Q13](#/q/ab-620/13) [Q55](#/q/ab-620/55) [Q57](#/q/ab-620/57) [Q58](#/q/ab-620/58) 四题用这三步即可全对。
2. 匹配题允许重复用同一 tile：[Q13](#/q/ab-620/13) [Q31](#/q/ab-620/31) [Q38](#/q/ab-620/38) [Q41](#/q/ab-620/41) [Q50](#/q/ab-620/50) [Q55](#/q/ab-620/55) [Q94](#/q/ab-620/94) 都有 tile 用 2–3 次。两条 requirement 若是同一件事的两种说法（"avoid copying into an index" 和 "access data at runtime"），就放同一个 tile，不要为了"用完所有 tile"去凑。
3. 看到 "Publish …" 选项先问一句：题目问的是"如何改变配置"还是"如何让已改的配置生效 / 让 agent 可被调用"？前者 publish 必错（[Q2](#/q/ab-620/2) [Q45](#/q/ab-620/45) [Q52](#/q/ab-620/52) [Q53](#/q/ab-620/53) [Q54](#/q/ab-620/54) [Q61](#/q/ab-620/61) [Q63](#/q/ab-620/63) [Q79](#/q/ab-620/79) [Q98](#/q/ab-620/98)），后者才对（[Q50](#/q/ab-620/50) [Q83](#/q/ab-620/83) [Q106](#/q/ab-620/106) [Q18](#/q/ab-620/18) [Q77](#/q/ab-620/77) [Q32](#/q/ab-620/32) [Q93](#/q/ab-620/93)）。[Q83](#/q/ab-620/83) 两种都有：publish 被调用的 Service Desk Agent 对，publish 主 agent 错。
4. "Which two … part of the solution"：先删 publish、citations、"Azure AI Search 当治理"、逐 topic 项，剩下的通常刚好两项，且是"机制 + 机制内配置"的一对（[Q2](#/q/ab-620/2) [Q19](#/q/ab-620/19) [Q45](#/q/ab-620/45) [Q53](#/q/ab-620/53) [Q61](#/q/ab-620/61) [Q63](#/q/ab-620/63) [Q83](#/q/ab-620/83) [Q98](#/q/ab-620/98) [Q110](#/q/ab-620/110)）。"complete solution" 则找两个各自成立的机制（[Q65](#/q/ab-620/65) [Q100](#/q/ab-620/100) [Q101](#/q/ab-620/101)）。
5. Yes/No 系列：把 proposed solution 对照题干每一条 requirement 打勾，缺任意一条就是 No（[Q21](#/q/ab-620/21) [Q27](#/q/ab-620/27) [Q39](#/q/ab-620/39) [Q71](#/q/ab-620/71)）。Yes 的方案都直接点名了机制（run after、notification、topic-level custom prompt、custom solution）。同一系列里 Yes 可以不止一个（[Q22](#/q/ab-620/22) 和 [Q23](#/q/ab-620/23) 都是 Yes，[Q72](#/q/ab-620/72) 和 [Q85](#/q/ab-620/85) 都是 Yes）。
6. 排序题口诀：容器 → 内容 → 认证 → 验证 → 发布 / 加入 agent。五套必背顺序：Add knowledge → 选 connector → Sign in 建连接 → 选 tables / index → Add to agent（[Q3](#/q/ab-620/3) [Q8](#/q/ab-620/8) [Q49](#/q/ab-620/49)）；Add REST API tool → endpoint details → authentication → test（[Q69](#/q/ab-620/69)）；Create resource / Enable 功能 → 配置 → 运行 / publish（[Q97](#/q/ab-620/97) [Q106](#/q/ab-620/106)）；Create agent flow → inputs → connector action → outputs → test（[Q76](#/q/ab-620/76)）；define success criteria → select method → collect data → review（[Q116](#/q/ab-620/116)）。[Q1](#/q/ab-620/1) [Q77](#/q/ab-620/77) [Q106](#/q/ab-620/106) [Q114](#/q/ab-620/114) 这类"从多个 tile 选 3/4 个"的题，先剔除"验证类"（adversarial testing）、"无关功能"（generative answers、model catalog）和"非依赖步骤"（Entra app registration、review solution details page）tile。
7. Case 题：答案是 case 里某句 must / may / not supported 的改写，错误项违反其中某句（[Q4](#/q/ab-620/4) [Q5](#/q/ab-620/5) [Q24](#/q/ab-620/24) [Q25](#/q/ab-620/25) [Q26](#/q/ab-620/26) [Q40](#/q/ab-620/40) [Q41](#/q/ab-620/41) [Q80](#/q/ab-620/80) [Q83](#/q/ab-620/83) [Q84](#/q/ab-620/84)）。读 case 时直接跳到 Technical requirements 和 Issues and constraints。
8. Evaluation 题：只选不带推断的字面结论（pass/fail、consistent、expected vs generated）；任何含 cause / redesign / deploy / model 的结论都错（[Q88](#/q/ab-620/88) [Q89](#/q/ab-620/89) [Q96](#/q/ab-620/96) [Q105](#/q/ab-620/105)）；Pass + 语义匹配 = 接受结果，不重跑、不改 test case（[Q101](#/q/ab-620/101)）。
9. ALM 词汇表一次背完：solution = 容器（[Q19](#/q/ab-620/19) [Q90](#/q/ab-620/90) [Q95](#/q/ab-620/95) [Q107](#/q/ab-620/107) [Q114](#/q/ab-620/114)；Copilot Studio in Teams 里的 agent 例外，用 Teams export/import，[Q111](#/q/ab-620/111)）；unmanaged = dev，managed = prod / 锁定（[Q87](#/q/ab-620/87) [Q94](#/q/ab-620/94)）；environment variables = 跨环境配置，secret 运行时取、其他要 republish、Copilot Studio 里只读（[Q31](#/q/ab-620/31) [Q32](#/q/ab-620/32) [Q91](#/q/ab-620/91) [Q93](#/q/ab-620/93) [Q109](#/q/ab-620/109)）；connection references = 连接随解决方案走（[Q99](#/q/ab-620/99)）；pipelines = 受控多阶段部署 + stage access（[Q87](#/q/ab-620/87) [Q97](#/q/ab-620/97) [Q102](#/q/ab-620/102)）；component collection = 跨 agent 复用（[Q44](#/q/ab-620/44) [Q99](#/q/ab-620/99)）。
10. 职责归位：Copilot connector 由管理员在 Microsoft 365 admin center 配，builder 只 add（[Q30](#/q/ab-620/30) [Q59](#/q/ab-620/59)）；DLP 在 Power Platform admin center（[Q34](#/q/ab-620/34)）；环境变量值由管理员在 Power Apps 改（[Q32](#/q/ab-620/32) [Q93](#/q/ab-620/93) [Q109](#/q/ab-620/109)）。题干里出现 "administrator" 和 "builder" 两个角色时，builder 的动作一定是 add / consume，不是 create / configure。
11. 多 agent 题四选一：看目标 agent 的"出身"——existing Copilot Studio agent（[Q50](#/q/ab-620/50) [Q83](#/q/ab-620/83)）、Foundry agent（[Q43](#/q/ab-620/43) [Q53](#/q/ab-620/53)）、"standardized agent-to-agent endpoint" / "external agent"（[Q42](#/q/ab-620/42) [Q51](#/q/ab-620/51) [Q74](#/q/ab-620/74) [Q75](#/q/ab-620/75)）、Fabric semantic model（[Q56](#/q/ab-620/56) [Q82](#/q/ab-620/82)）。无论哪种，"add as indexed knowledge source" 和 "upload documentation" 都是错误项。
12. 把 1.3 节列的 13 道社区答案与 reviewed answer 不一致的题（[Q1](#/q/ab-620/1) [Q18](#/q/ab-620/18) [Q29](#/q/ab-620/29) [Q32](#/q/ab-620/32) [Q38](#/q/ab-620/38) [Q41](#/q/ab-620/41) [Q46](#/q/ab-620/46) [Q47](#/q/ab-620/47) [Q55](#/q/ab-620/55) [Q59](#/q/ab-620/59) [Q69](#/q/ab-620/69) [Q96](#/q/ab-620/96) [Q102](#/q/ab-620/102)）当作规则练习题：用本章规则推一遍，能推出 reviewed answer 才算掌握。


## AB-100 · 题型、问法与限定词 {#ab100-formats}

### 题型与问法

#### 题型分布

| 题型 | 题数 | 占比 | 结构特征 | 题号 |
|---|---|---|---|---|
| 单选 single | 70 | 54% | 63 题 4 选项；5 题 5 选项（[Q57](#/q/ab-100/57)、[Q81](#/q/ab-100/81)、[Q83](#/q/ab-100/83)、[Q100](#/q/ab-100/100)、[Q121](#/q/ab-100/121)）；2 题 3 选项（[Q6](#/q/ab-100/6)、[Q85](#/q/ab-100/85)）。正确字母分布 A15 / B16 / C20 / D17 / E2，无可利用偏向 | 其余 |
| Hotspot（下拉框） | 25 | 19% | 23 题为 2 行下拉，每行 3–5 个选项；两行可共用一组选项（[Q1](#/q/ab-100/1)、[Q27](#/q/ab-100/27)、[Q99](#/q/ab-100/99)）或各用一组；2 题为 3 行 Yes/No 陈述（[Q77](#/q/ab-100/77)、[Q128](#/q/ab-100/128)） | [Q1](#/q/ab-100/1),7,17,18,27,29,30,45,49,53,54,59,60,75,77,82,90,91,93,96,99,101,107,110,128 |
| 多选 multi（"Which two"） | 13 | 10% | 固定选 2，4–6 个选项，"Each correct answer presents part of the solution" | [Q31](#/q/ab-100/31),52,69,78,80,86,92,97,98,105,113,115,119 |
| 拖放 dragdrop | 11 | 9% | 10 题 2 行、1 题 3 行（[Q95](#/q/ab-100/95)）；3–6 个 tile，可重复使用 | [Q4](#/q/ab-100/4),8,15,24,55,68,95,102,114,120,122 |
| Yes/No 系列 | 10 | 8% | 3 个系列（3+4+3 题），同题干换 "Proposed solution"；3 Yes / 7 No | [Q61](#/q/ab-100/61)–63；[Q71](#/q/ab-100/71)–73+[Q76](#/q/ab-100/76)；[Q123](#/q/ab-100/123)–125 |
| Case study 题（已含于上述题型） | 16 | 12% | Fabrikam 8 题（[Q1](#/q/ab-100/1),2,47,48,49,81,82,83）、Contoso 8 题（[Q31](#/q/ab-100/31),32,74,75,119,120,121,122）；格式含单选、hotspot、multi、dragdrop | — |

#### 题干公式

| 公式 | 题数 | 实际在问什么 | 题号 |
|---|---|---|---|
| "You need to …"（任何形式） | 111 | 几乎所有题都是"需求 → 选 Microsoft 指定产品"；其中 "You need to recommend" 49 题、"You need to design" 15 题、"You need to ensure" 13 题、"You need to identify" 5 题 | — |
| "The solution must …" / "must meet the following requirements" | 34 / 33 | 需求以 2–4 条 bullet 列出，每条 bullet 对应一个产品关键词；hotspot/dragdrop 直接按 bullet 分行 | 如 [Q7](#/q/ab-100/7),58,66,90,107,114,128 |
| "What should you recommend?" | 22 | 选一个产品/功能/做法；选项是产品名或动作句 | [Q4](#/q/ab-100/4),7,9,11,21,30,51,53,56,57,59,68,74,89,94,96,103,106,111,112,117,121 |
| "What should you include in the recommendation?" | 20 | 同上，"include" 暗示答案是方案里的一个组件 | [Q8](#/q/ab-100/8),12,13,29,40,41,42,43,46,65,79,85,88,99,100,104,116,118,126,127 |
| "What should you include in the design?" | 10 | 机制级组件（connector、Graph access、topic、flow、RBAC） | [Q22](#/q/ab-100/22),50,54,55,58,60,64,67,84,101 |
| "What should you include in the solution?" | 4 | 同上 | [Q6](#/q/ab-100/6),10,66,70 |
| "What should you use?" | 11 | 工具名（计算器、门户、Analytics 页） | [Q26](#/q/ab-100/26),27,28,34,35,36,37,38,95,108,114 |
| "What should you do?" | 10 | 一个动作（清洗、配置、启用、导入），多配 minimize 限定 | [Q14](#/q/ab-100/14),16,17,19,20,23,25,33,39,44 |
| "… for each requirement / for each agent" | 18 | hotspot/dragdrop：每行一个需求 → 一个产品，行间互不依赖 | [Q4](#/q/ab-100/4),7,15,24,29,30,53,54,55,60,68,90,91,95,96,99,110,114 |
| "Which two … should you include" | 13 | 两个互补组件（平台 + 落地点；solution + pipeline；Purview + Defender） | [Q31](#/q/ab-100/31),52,69,78,80,86,92,97,98,105,113,115,119 |
| "Does this meet the goal?" | 10 | 只有"原生、开箱即用覆盖全部 bullet"的产品才 Yes | [Q61](#/q/ab-100/61)–63,71–73,76,123–125 |
| "What should you do first?" | 1 | 顺序题：先建成本基线 | [Q14](#/q/ab-100/14) |
| "Which framework / template / tool / type / metric / knowledge source should you …" | ~30 | 名词化的 recommend，名词本身就在缩小范围（framework→CAF/WAF；template→Voice；metric→Analytics 指标名） | [Q1](#/q/ab-100/1),2,5,15,24,47,48,81,82,83,87,91,102,109,122,129 |

#### "推荐题"的内在逻辑

考的不是"什么能做到"，而是"Microsoft 为这个角色/场景指定了哪个产品"：

- [Q58](#/q/ab-100/58)：Logic Apps、Semantic Kernel、Foundry Agent Service 都能实现四个任务，但题干 "minimize development effort" + 全是 connector 级操作 → Copilot Studio + Power Automate。
- [Q88](#/q/ab-100/88)：Purview 与数据治理相关，但"资源部署到哪些 region"是 Azure Policy 的职责。
- [Q90](#/q/ab-100/90)：Bicep 能声明基础设施，但"fully automated / NOT require manual intervention"要的是跑它的 pipeline（Azure DevOps）。
- [Q51](#/q/ab-100/51)：AP 的 Copilot 功能已内置于 Dynamics 365 Finance，"前置条件"是分配 Finance and Operations AI security role，而不是去 Copilot Studio 或 Foundry 建东西。

判定顺序：先定人格（Power Platform maker vs Azure 开发者 vs D365 功能用户）→ 再在该人格的产品栈里找"开箱即用"的那一层。


### 限定词与陷阱词

| 限定词（原文） | 作用 | 对应答案 | 题号 |
|---|---|---|---|
| "minimize administrative effort" | 选步骤最少、内置的做法 | 映射 display names；导入 managed solution；Purview（而非自配 Monitor/Policy） | [Q3](#/q/ab-100/3),19,100；[Q7](#/q/ab-100/7) |
| "minimize development effort / custom development" | 排除 pro-code（Foundry、SDK、Functions、Logic Apps） | Copilot Studio + Power Automate / AI Builder / custom connector；Azure OpenAI 场景选部署自带的 content filters 而非自己集成 Content Safety API | [Q58](#/q/ab-100/58),66,67,79,123,124,125 |
| "minimizes development effort" + "Azure-native" | 排除自建，选托管 Azure 服务 | Azure Monitor + Microsoft Purview | [Q114](#/q/ab-100/114) |
| "minimize changes to the agent" | UI 变化时不改 agent | Computer Use | [Q65](#/q/ab-100/65) |
| "minimize the risk of generating inaccurate responses" | 反直觉：关掉 AI general knowledge | Must be disabled | [Q59](#/q/ab-100/59) |
| "minimize ongoing costs" | 低成本的版本控制 | Git repository | [Q7](#/q/ab-100/7) |
| "minimizes downtime, handles credentials and endpoints securely" | 包里不放数据与凭据 | Agent1 + references；导入后重设 connections | [Q107](#/q/ab-100/107) |
| "without degrading the quality" | 排除所有"删信息"的选项 | Chunk documents during indexing | [Q106](#/q/ab-100/106) |
| "without updating the agent" | 运行时发现工具 | MCP server | [Q70](#/q/ab-100/70) |
| "without requiring additional training or coding" | 预置 prompt 而非预置 model | AI Builder prebuilt prompt | [Q29](#/q/ab-100/29) |
| "must NOT use generative orchestration" + "standard model" | 排除 CLU / Azure OpenAI | NLU / NLU+ | [Q4](#/q/ab-100/4) |
| "must NOT add new topics" | 唯一不需要加 topic 的知识源 | file upload | [Q5](#/q/ab-100/5) |
| "must NOT require manual intervention" / "repeatable and fully automated" | 排除手工导入与只声明不执行 | Power Platform deployment pipeline；Azure DevOps pipeline（非 Bicep） | [Q90](#/q/ab-100/90) |
| "must NOT modify the current security or encryption configurations" | 不动环境，动应用 | Move App1 to an environment with Microsoft-managed keys | [Q118](#/q/ab-100/118) |
| "NOT on a trigger phrase, but on a description" | 编排模式信号 | generative orchestration | [Q32](#/q/ab-100/32)（Contoso） |
| "What should you do first?" | 顺序题 | 先量化全部成本 | [Q14](#/q/ab-100/14) |
| "only"（edited only in dev / only approved regions / only assigned roles / only the AI engineering team / only approved connectors） | 指向强制型控制 | managed solution；Azure Policy；Purview access policies；RBAC in Foundry；DLP；Data Zone deployment（"only be processed within the United States"） | [Q64](#/q/ab-100/64),99,101,112,128 |
| "existing"（existing tool / existing technologies / existing AI capabilities） | 复用已有，不新建 | Copilot Studio Savings calculator（非 Foundry）；已有 MCP server；ROAI 含 extend | [Q82](#/q/ab-100/82),75,22 |
| "potential cost"（部署前）vs 已运行 | 估算器 vs 账单 | pricing calculator / TCO Calculator；Cost Management + Billing 只在前两者缺席时 | [Q28](#/q/ab-100/28),34–38 |
| "comprehensive telemetry" vs "performance insights" vs "near-real-time" vs "usage and performance" vs "full conversations" | 名词决定工具 | App Insights；Analytics tab；App Insights；Copilot Studio；Power Apps（Dataverse transcript） | [Q40](#/q/ab-100/40),41,95 |
| "human analyst for final decision making" | 排除 autonomous | Task agent | [Q9](#/q/ab-100/9) |
| "across different channels" / "both apps" / "same agent in Microsoft Teams and SharePoint" | 要跨渠道/跨应用的视角 | App Insights；跨 app 任务场景；每个 channel 都要发布（只发布到 Microsoft 365 Copilot 不覆盖 SharePoint） | [Q40](#/q/ab-100/40),77,93 |
| "securely" | 走 connector/connection，不走 scraping/skill | custom connector；connection to Foundry；connection references | [Q67](#/q/ab-100/67),84,107 |
| "deployed to the production environment"（模型已上线） | 排除重训/改训练集 | Modify the system instructions | [Q117](#/q/ab-100/117) |
| "Each agent must …"（dragdrop 两行） | 两行可同 tile，也可不同 | [Q4](#/q/ab-100/4) NLU/NLU+；[Q27](#/q/ab-100/27) Foundry/Copilot Studio | [Q4](#/q/ab-100/4),27 |
| Yes/No 的 "Proposed solution" | 只有字面覆盖全部 bullet 的产品 Yes | Copilot for Sales、添加 summary 字段、Copilot Studio 为 Yes；其余 7 个方案 No | [Q61](#/q/ab-100/61),71,125 vs [Q62](#/q/ab-100/62),63,72,73,76,123,124 |


## AB-100 · 决策规则（核心） {#ab100-rules}

### 决策规则（按出现频次排序）

#### 总表

| # | 触发词（题干原文） | 正确答案 | 典型错误选项 | 题数 | 题号 |
|---|---|---|---|---|---|
| R1 | "comprehensive telemetry data and performance insights"、"detailed telemetry"、"near-real-time"、Copilot Studio agents "across different channels" | Application Insights（首选）→ 没有它时选 Log Analytics → 两者都没有时选 the Analytics tab in Copilot Studio | Power BI、Dynamics 365 Customer Voice、Azure DevOps、Azure Advisor、Microsoft Purview、Foundry Tracing/Monitoring | 9 | [Q40](#/q/ab-100/40),42,104,116（App Insights）；[Q43](#/q/ab-100/43),126（Log Analytics）；[Q41](#/q/ab-100/41)（Analytics tab）；[Q95](#/q/ab-100/95)；[Q81](#/q/ab-100/81) |
| R2 | "ALM"、"deployed consistently across environments"、"edited only in development"、"prevent direct editing in production"、"package the components … as a group" | 放进 Power Platform solution；prod 导入 managed solution；用 Power Platform pipelines / deployment pipeline；包里放 connection references，导入后重设 connections；Dynamics 365 Finance（finance and operations）扩展配 Azure DevOps → Lifecycle Services（LCS，[Q127](#/q/ab-100/127)） | unmanaged in production、Share、rebuild per environment、data export/import、default solution、GitHub/Azure DevOps 单独作答、environment variables 存 connector 定义、Azure Functions；F&O 题里的 Power Platform pipelines / solutions / Azure DevOps test plans | 11 | [Q19](#/q/ab-100/19),64,77(r2),85,89,90(r1),92,107,115,119,127 |
| R3 | "low-code"、"minimize development effort / custom development"、"without requiring additional training or coding"、"embeddable in a Power Apps canvas app"、"Dataverse as its core" | Microsoft Copilot Studio（配 Power Automate flows、AI Builder、custom connector、AI Builder prebuilt prompt） | Microsoft Foundry、Semantic Kernel SDK、Foundry Agent Service、Azure Logic Apps、Azure OpenAI + Azure Functions、Document Intelligence + Logic Apps、GitHub Copilot、Security Copilot、SharePoint agent | 10 | [Q27](#/q/ab-100/27)(r2),29(r2),45,47,56,64,65,117,118,119 |
| R4 | 要"看指标"：unanswered questions / knowledge source error / quality；abandoned vs resolved；"% of engaged sessions escalated"；"user feedback on quality"；"adoption month over month"；"low resolution rate and high escalation rate" | Generated answer rate and quality（= Answer quality）；Conversation outcomes / Topics by outcome / Effectiveness；Escalation rate；Satisfaction；the Analytics tab in Copilot Studio；排查原因用 session information and outcomes + quality of generated answers；"user feedback to the agent responses" 且选项已拆到 Satisfaction 下一级 → Reactions（[Q129](#/q/ab-100/129)） | Reactions（[Q129](#/q/ab-100/129) 除外）、Survey results、Tool use、Use、Engagement rate、CSAT；Customer Service historical analytics、M365 admin center Insights、Copilot hub in PPAC；Foundry Evaluations、Cost workbook、DPO | 9 | [Q41](#/q/ab-100/41),83,91,97,102,108,110,122,129 |
| R5 | "evaluate the potential cost … to support ROAI analysis"（部署前估算） | Azure pricing calculator（首选）→ 没有时 Total Cost of Ownership (TCO) Calculator → 两者都没有时 Cost Management + Billing | Azure Reservations、Azure savings plans、Microsoft Fabric SKU Estimator、Azure Monitor、Anomaly Detection in Azure Cost Management | 6 | [Q34](#/q/ab-100/34),36,37（pricing calculator）；[Q28](#/q/ab-100/28)（TCO）；[Q35](#/q/ab-100/35),38（Cost Mgmt） |
| R6 | Dynamics 365 Sales / Outlook：“summarize email threads, suggested replies in Outlook, meeting preparation with CRM data”；“correspond with prospects more quickly”；“tailor how opportunity summaries are generated”；“business terms … non-standard terminology” | Microsoft 365 Copilot for Sales（Yes）；Copilot email assist；在 Sales 的 Copilot 设置里给 opportunity summary 添加字段（Yes）；把 display names 映射为 business terms | classic Dataverse workflow（No）、M365 Copilot agent template（No）、Power Automate 触发摘要（No）、AI Builder lead scoring（No）、summary widget 放表单（No）、schema names、每字段新建 term、合并字段 | 9 | [Q3](#/q/ab-100/3),48,61,62,63,71,72,73,76 |
| R7 | Dynamics 365 Finance / SCM / finance and operations / Field Service 的预置 Copilot：“overdue vendor invoices”、“overdue invoices and payment history”、“anticipate future product needs”、“key information from customer orders”、“prerequisites … prebuilt copilot for accounts payable”、“view available agent templates”、“in-app help … knowledge source … NOT add new topics”、“work orders / frontline workers” | AI Summaries with Copilot；Collections coordinator summary；Generative insights for Demand planning；assign the Finance and Operations AI security role；Agent management；file upload + 关闭 AI general knowledge；Copilot in Field Service + Field Service mobile app | Account Reconciliation agent、Supplier Communication agent、Analyze demand plans、Workload insights、Product information management、Power BI；Copilot Studio 建 AP agent、Copilot for Sales、Foundry；Immersive Home、Lifecycle Services、Copilot Studio；Dataverse / public website / Azure AI Search 作知识源；Copilot in Customer Service、Copilot Service workspace、Copilot in Outlook | 7 | [Q5](#/q/ab-100/5),30,51,53,59,69,74 |
| R8 | grounding 数据放哪：“centralized source for multiple AI systems … classification and protection policies”；“Azure SQL, flat files, APIs, logs … knowledge source”；“ServiceNow, D365 Finance, SCM, Excel in SharePoint … accurate and timely”；“Power BI semantic model … subset of corporate data”；“10,000 policy PDFs in SharePoint + Department column”；“token usage limit … without degrading quality” | Microsoft Dataverse；Azure AI Search 索引；Microsoft Power Platform connectors；Endorse the semantic model；add SharePoint as a knowledge source + configure the SharePoint tool；Chunk documents during indexing | Azure Data Lake Storage、Azure Cosmos DB、Power BI semantic model（作中心源）、Translator；每 agent 一张表、抓 SharePoint、读供应商 PDF；model router、custom prompts、incremental indexing；Share WS1、Export；Foundry custom model、导入 Dataverse、AI Builder、sensitivity labels、SharePoint Premium；减少知识源、限制检索量、降低 token 上限 | 7 | [Q10](#/q/ab-100/10),11,13,21,23,54,106 |
| R9 | ROAI 方法学：“early indicators of value” + “complete accounting of lifecycle costs”；“portfolio … different stages … balance immediate results with long-term”；“ensure the analysis is accurate … do first”；“TCO, expected savings, whether to extend”；“metadata and telemetry of the Power Platform solution”；“measurable business drivers”；“Copilot Studio agent usage estimator”；“existing tool … metrics for stakeholder signoff” | Time-based ROI + TCO 选 Ongoing operations（[Q45](#/q/ab-100/45)）；a horizon-based framework；Identify and quantify all costs；a ROAI analysis；the Business value toolkit；reduced case resolution time + increased employee productivity；GPT models used + orchestration method；Copilot Studio（Savings calculator）+ current time to complete the task per instance | Financial / Strategic ROI、Infrastructure / Data quality and preparation 作 TCO 驱动；cost/benefit analysis、IRR、prioritization grid；establish metrics / benchmarking first；break-even only、prebuilt agents、custom model；PPAC、Success by Design、CAF；market capitalization、brand awareness、market predictability；average characters / session time；Foundry、ARM、license cost、cumulative past time | 8 | [Q12](#/q/ab-100/12),14,22,26,31,45,82,105 |
| R10 | 数据清洗：“ensure that the data ingested … is clean and suitable”；“fails to return relevant or accurate results … improve data grounding” | Identify and address biased data；Identify and address missing or inconsistent data；Verify and cleanse the Dataverse data | Sort by last name、database ≤ 100 GB、translate to one language、verify privacy compliance、Power Automate workflow、agent flow、Retrain、adaptive card、training examples | 5 | [Q20](#/q/ab-100/20),25,33,39,44 |
| R11 | Foundry 的触发词：“Semantic Kernel”、“Microsoft Foundry project/agent/model”、“custom Microsoft Foundry model”、“fine-tuned”、“GPT-4o as a judge”、“dynamically use external tools at runtime without updating the agent”、“model registry / prior versions”；pro-code 专用 agent 连第三方数据源且要在 Microsoft 365 Copilot / Teams 里可发现 | Microsoft Foundry（建 agent）；Foundry Agent Service + Microsoft 365 Agents SDK（[Q80](#/q/ab-100/80)）；Create a connection to Microsoft Foundry in the agent；MCP server；Move to a multi-agent architecture（性能）+ Add a grounding data source（准确）；AI quality (AI assisted)；Observability in Foundry Control Plane；Blob Storage with versioning + associate storage to fine-tuning job；central model registry with version history；Azure DevOps pipeline | Copilot Studio skill、custom engine agent、classic orchestration；Foundry hub、Azure AI Search；larger model、prebuilt connector；AI quality (NLP)、Groundedness、risk and safety；GitHub Actions、直接上 prod、App Insights；Azure Files、content filter、ad-hoc data files；quality gate alone、generic version control；Bicep file；Assistants API、Foundry SDK、Copilot Studio（[Q80](#/q/ab-100/80)） | 9 | [Q8](#/q/ab-100/8),27(r1),70,80,84,94,98,109,111 |
| R12 | Purview 触发：“security labels / sensitivity labels”；“monitors and audits changes to model configurations and data usage … minimize administrative effort”；“restricts access to the grounding data（Fabric）to only assigned roles”；“monitors AI apps and agents for compliance”；“retaining and logging interactions, detecting policy violations” | Microsoft Purview（[Q86](#/q/ab-100/86) 与 Microsoft Defender 配对；[Q101](#/q/ab-100/101) 为 Purview access policies） | Azure Monitor、Azure Policy、Stream Analytics、API Management；Azure AI Content Safety、RBAC in Foundry（在 [Q86](#/q/ab-100/86) 中）；Copilot Studio、Blob Storage | 5 | [Q86](#/q/ab-100/86),100,101(r1),114,120(CIO)；反例：[Q88](#/q/ab-100/88)/99 region、[Q41](#/q/ab-100/41)/43/116/126 telemetry 中 Purview 是干扰项 |
| R13 | 数据驻留：“data residency and data movement policies”、“connector to an Azure OpenAI instance in the United States”（跨 region）；“agents deployed to both the United States and Europe”、“only approved Azure regions”；“continuous compliance verification”；“Prompts and responses must only be processed within the United States” | Ensure cross-region data movement is enabled for the environment and connector dependencies；Azure Policy；Microsoft Defender for Cloud；美国 Foundry 资源上的 Data Zone deployment（[Q128](#/q/ab-100/128) r1 Yes） | Migrate the tenant、把数据存在美国、Purview DLP 设置；Purview、Azure Monitor、Sentinel、Defender for Cloud（在 [Q88](#/q/ab-100/88) 中） | 4 | [Q16](#/q/ab-100/16),88,99,128 |
| R14 | 转人工/异常：“escalation to a live representative … after two failed attempts”、“unexpected AI agent actions”、“default help message when input is unclear”；“hand off … when the customer requests an escalation”（Contact Center chat）；“transfer the conversation to a live customer service representative”（Contact Center agent） | a Fallback topic；the Escalate topic；Copilot Studio + Customer engagement hub | custom connector、event trigger、REST API；agent flow、Conversation Start topic、skill、Power Automate connector；Foundry、M365 Agents Toolkit、Bot Service skill | 4 | [Q49](#/q/ab-100/49),52,57,68 |
| R15 | 编排模式与语言模型：“topics selected NOT on a trigger phrase but on a description”、“connect to other agents selected by their description”、“business logic stored outside”；“Generative orchestration will be enabled” + 外部动作；“standard model” + “NOT use generative orchestration” + “simple and short phrases”；+ “Contact Center voice channel” | generative orchestration；a tool (connector)；NLU；NLU+ | classic orchestration、AI-assisted evaluators、reasoning models；trigger phrase、skill；CLU、Azure OpenAI、Azure Language | 3 | [Q4](#/q/ab-100/4),32,68 |
| R16 | Prompt 工程与评估：“help the customer as best you can”（模糊）；“retrieve product information from a knowledge base”；“validate prompt engineering best practices … techniques and metrics”；“shared prompt library … consistency / governance and version control”；“appropriate and meaningful for the business reports”；“improve the effectiveness of agent interactions”；“information outside the requested task scope” + “do NOT consistently use the required layout” | Rewrite with clear, task-specific instructions；responses with only reference sources + limit scope；varied phrasing + response relevance and accuracy；standardized prompt templates + Git repository；alignment of the output to domain-specific tasks；clear and specific instructions + regularly test and refine based on user input；Relevance + Format Compliance（[Q78](#/q/ab-100/78)） | filler words、keep vague、open-ended questions、remove knowledge source；exclude domain terms、one-word prompts、word count、generation time；department-specific templates、prompt history、categorize；active users、resource usage、training duration；session duration、prompt length distribution；Tone Alignment、Consistency、Accuracy（[Q78](#/q/ab-100/78)，Accuracy 已达标） | 7 | [Q7](#/q/ab-100/7),17,18,78,87,109,113 |
| R17 | 测试：“exchanges data between the Dynamics 365 apps” / “aligns with user workflows”；“coordinate tasks across both apps”；“validate the most recent changes before release” + “flow validated as part of orchestration”；“evaluates effectiveness during active sessions … measurable insights” | Integration / User acceptance；task-based scenarios spanning both apps + successful completion of cross-app tasks；test the latest unpublished version + add the flow to the agent as a tool；dashboards for resolution/deflection/accuracy + scripts | Drift、Exploratory、Performance；isolated per-app tests、visual consistency、response time、click rate；publish to channel/live users、production version、canvas app、desktop console；load testing、uptime、historical tickets | 4 | [Q15](#/q/ab-100/15),93,96,103 |
| R18 | 扩展连接：“securely retrieve … from a REST API … minimize development”；“Microsoft 365 Copilot can invoke external logic hosted in Azure”；“custom MCP server … product specifications”；“query content in a subset of SharePoint sites and Teams” for M365 Copilot | Create a custom connector；Microsoft Power Platform connectors；a custom connector + add the MCP server；Configure Microsoft Graph access | desktop flow screen scrape、managed solution export、Fallback topic；Copilot Studio skills、custom engine agents；OData entity、Bot Service channel、Semantic Kernel、REST API、event trigger；Power Automate desktop flow、custom REST crawler、SharePoint settings | 4 | [Q6](#/q/ab-100/6),50,67,75 |
| R19 | 安全控制：“use only approved connectors … prevent accessing sensitive data”；“restricts model fine-tuning to only the AI engineering team”；“discover and inventory AI resources”（多 subscription）；“identify and mitigate risks … protect AI apps and data”；“malicious prompts … hidden instructions” + “minimize development effort” | DLP policies in Power Platform；RBAC in Microsoft Foundry；Azure Resource Graph Explorer；Microsoft Defender（与 Purview 配对）；Azure OpenAI 部署的 content filters（含 Prompt Shields，[Q79](#/q/ab-100/79)） | Azure Monitor connector logs、Dataverse audit、customer-managed keys；Azure Policy、ARM locks、Conditional Access；Purview、Blob Storage；Content Safety、Foundry RBAC（[Q86](#/q/ab-100/86)）；Azure AI Content Safety policy、DLP policy、Content Understanding（[Q79](#/q/ab-100/79)） | 5 | [Q79](#/q/ab-100/79),86,101(r2),112,120(CISO) |
| R20 | Agent 类型：“escalations reach a human analyst for final decision”；“orchestrate the sales order fulfillment and shipping”（端到端、事件驱动）；“analyze historical data and trends to replenish stock”（有边界的分析任务） | Task agent（人做最终决定）；Autonomous；Task | autonomous agent that closes cases、Copilot in Word、Power BI export；Prompt-and-response | 2 | [Q9](#/q/ab-100/9),24 |
| R21 | 语音与推理：“handsfree headsets”；“interactive speech responses”；“optimizes decision-making and the accuracy of responses”；“Contact Center voice channel” + standard model | Voice template in Copilot Studio；Copilot Studio voice features；A deep reasoning model；NLU+ | IT Helpdesk 模板、Foundry 模板；Azure AI Speech、SSML、Azure Language；CLU、Azure OpenAI | 3 | [Q4](#/q/ab-100/4),47,55 |
| R22 | Computer Use：“simulating user interactions across third-party apps and websites, such as clicking buttons, entering text, and extracting information from screens”；“automation fails because of frequent changes to the app's user interface … minimize changes to the agent” | Computer Use in Copilot Studio | MCP、NLU+、Copilot skills；custom models、conversation topics、agent flow | 2 | [Q56](#/q/ab-100/56),65 |
| R23 | Responsible AI：“creates different emails depending on the customers' traits”（生产中的 Azure OpenAI 模型）；“verify reliability, interpretability, fairness, and compliance … Microsoft-recommended”；“updated only after a specialist reviews and accepts a recommendation”（accountability） | Modify the system instructions；the Responsible AI dashboard；专员接受后才写回 Dataverse（[Q77](#/q/ab-100/77) r3：收到回复就直接写 approval fields → No） | random generation、retrain with larger dataset、modify training data（托管模型做不到）；Service Trust Portal、Compliance Center、Purview、Foundry Tools | 3 | [Q77](#/q/ab-100/77)(r3),117,121 |
| R24 | 框架：“on-premises → Azure … Microsoft-recommended methodologies for infrastructure migration”；“Copilot Studio best practices / compliant deployment checklist”；“conversational user experience”（D365 实施）；“process that supports the adoption of AI solutions … managing, securing, and governing AI workloads” | Microsoft Cloud Adoption Framework for Azure（迁移与 AI adoption 都是它）；Power Platform Well-Architected framework；Success by Design | Success by Design（用于基础设施迁移或 AI adoption 时）、Power Platform CoE、Project Setup Wizard；ALM Accelerator；Foundry Control Plane | 3 | [Q1](#/q/ab-100/1),2,46 |
| R25 | 规则 vs 后台：“define the rules and constraints the agent must follow” / “backend process … data movement … independently of the agent's reasoning” | Conversation topics / Power Automate cloud flow | Agent flows（跟随 agent 推理）、Power Pages | 1 | [Q60](#/q/ab-100/60) |
| R26 | “environment uses a customer-managed key” + “add Copilot components” + “must NOT modify the current security or encryption configurations” | Move App1 to a new environment that uses Microsoft-managed keys | Enable Copilot for Env1、duplicate app、modify data sources | 1 | [Q118](#/q/ab-100/118) |

#### "阶梯"规则：同一题干，答案随选项集变化

考试不是记"唯一答案"，而是记"偏好顺序"，同一题干出现多次、每次只给阶梯中的部分选项：

| 题干 | 阶梯（高 → 低） | 证据 |
|---|---|---|
| Copilot Studio 多 channel 遥测 | Application Insights > Log Analytics > the Analytics tab in Copilot Studio；Power BI / Customer Voice / Advisor / DevOps / Purview 永远不选 | [Q40](#/q/ab-100/40)、[Q42](#/q/ab-100/42)、[Q104](#/q/ab-100/104)、[Q116](#/q/ab-100/116) 给了 App Insights → 选它；[Q43](#/q/ab-100/43)、[Q126](#/q/ab-100/126) 没有 App Insights 但有 Log Analytics 和 Analytics tab → 选 Log Analytics；[Q41](#/q/ab-100/41) 两者都没有 → Analytics tab |
| 部署前成本估算 | Azure pricing calculator > TCO Calculator > Cost Management + Billing；Reservations / savings plans / Fabric SKU Estimator / Monitor / Anomaly Detection 永远不选 | [Q34](#/q/ab-100/34)、[Q36](#/q/ab-100/36)、[Q37](#/q/ab-100/37) 有 pricing calculator → 选它（[Q34](#/q/ab-100/34) 中 TCO Calculator 同时在场仍选 pricing calculator）；[Q28](#/q/ab-100/28) 没有 pricing calculator → TCO；[Q35](#/q/ab-100/35)、[Q38](#/q/ab-100/38) 只剩 Cost Management + Billing |
| 数据清洗 | biased data ≈ missing or inconsistent data（都对，看哪个在场）；排序 / 大小 / 翻译 / 隐私合规永远不选 | [Q25](#/q/ab-100/25)、[Q33](#/q/ab-100/33)、[Q44](#/q/ab-100/44) → biased；[Q39](#/q/ab-100/39)（无 biased 选项）→ missing or inconsistent |

#### 产品-人格对照（决定用哪个栈作答）

| 题干给出的信号 | 作答产品栈 | 题号 |
|---|---|---|
| Copilot Studio / Power Platform / canvas app / Dataverse / low-code / minimize development | Copilot Studio、Power Automate、AI Builder、custom connector、Power Platform solutions & pipelines、Analytics tab、Application Insights | [Q19](#/q/ab-100/19),27(r2),29,47,49,54,58,66,67,68,77,85,89,95,107,115,123–125,129 |
| Semantic Kernel / Foundry project / fine-tuned model / Azure OpenAI resources / GPT-4o judge | Microsoft Foundry、Foundry Agent Service、MCP server、Blob versioning、model registry、Azure DevOps pipeline、Observability、AI-assisted metrics、Data Zone deployment | [Q8](#/q/ab-100/8),27(r1),70,80,84,90(r2),94,98,109,111,128 |
| Azure 资源层治理（regions、subscriptions、resources） | Azure Policy、Defender for Cloud、Azure Resource Graph Explorer、Azure Monitor | [Q88](#/q/ab-100/88),99,114,120 |
| 数据/合规层治理（labels、audit、sensitive data、AI usage compliance） | Microsoft Purview（M365 agents 场景再加 Microsoft Defender） | [Q86](#/q/ab-100/86),100,101,114,120 |
| Dynamics 365 某个 app 名 | 该 app 自带的 Copilot 功能名（见 R6、R7），不是 Copilot Studio，不是 Foundry；F&O 的 ALM 用 Lifecycle Services | [Q3](#/q/ab-100/3),5,30,48,51,53,59,61,69,71,74,127 |
| Microsoft 365 Copilot | Power Platform connectors、Microsoft Graph access、Copilot for Sales、Purview + Defender；pro-code agent 经 Microsoft 365 Agents SDK 接入 | [Q6](#/q/ab-100/6),50,61,80,86 |


## AB-100 · 干扰项、热区冷区、case study 与答题策略 {#ab100-tactics}

### 干扰项套路

| 套路 | 典型例子 | 识别方法 |
|---|---|---|
| 相邻产品"听起来对" | Purview 放在 region 题里（[Q88](#/q/ab-100/88)、[Q99](#/q/ab-100/99)）；Log Analytics 与 Application Insights 同列（[Q42](#/q/ab-100/42)、[Q116](#/q/ab-100/116)，选 App Insights）；Success by Design 放在基础设施迁移题里（[Q2](#/q/ab-100/2)）；TCO Calculator 与 pricing calculator 同列（[Q34](#/q/ab-100/34)）；Fabric SKU Estimator 出现在 6 道成本题（[Q28](#/q/ab-100/28)、[Q34](#/q/ab-100/34)–38）；Dynamics 365 Customer Service / Copilot Service workspace 对 Field Service 题（[Q69](#/q/ab-100/69)）；Immersive Home、Lifecycle Services 对 Agent management（[Q74](#/q/ab-100/74)）；Service Trust Portal、Compliance Center 对 Responsible AI dashboard（[Q121](#/q/ab-100/121)）；Foundry Tracing/Monitoring 对 Copilot Studio agent（[Q81](#/q/ab-100/81)）；Success by Design、Power Platform CoE、Foundry Control Plane 对 CAF 的 AI adoption 流程（[Q46](#/q/ab-100/46)）；Power Platform pipelines / solutions 对 F&O 的 Lifecycle Services（[Q127](#/q/ab-100/127)）；Survey results、Conversation outcomes 对 Reactions（[Q129](#/q/ab-100/129)） | 问"这个产品服务的对象是谁"：资源 vs 数据；Azure 开发者 vs Power Platform maker；人工坐席 vs AI agent |
| 过度工程 / pro-code | Semantic Kernel SDK、Foundry Agent Service、Logic Apps（[Q58](#/q/ab-100/58)）；Azure OpenAI + Functions、Document Intelligence + Logic Apps（[Q66](#/q/ab-100/66)）；custom REST API crawler、desktop flow（[Q50](#/q/ab-100/50)）；Build a custom model in Foundry、AI Builder 处理 SharePoint（[Q54](#/q/ab-100/54)）；custom engine agent（[Q6](#/q/ab-100/6)、[Q84](#/q/ab-100/84)）；Export the data to a data lake for Power BI（[Q9](#/q/ab-100/9)）；自己集成 Azure AI Content Safety policy（[Q79](#/q/ab-100/79)，部署自带的 content filters 即可） | 题干有 low-code / minimize development / Copilot Studio 时，一律排除 |
| 已退役或错代的机制 | Copilot Studio skills / Bot Framework skill / Azure AI Bot Service skill 出现 6 次全错（[Q6](#/q/ab-100/6)、[Q52](#/q/ab-100/52)、[Q56](#/q/ab-100/56)、[Q57](#/q/ab-100/57)、[Q68](#/q/ab-100/68)、[Q84](#/q/ab-100/84)）；classic Dataverse workflow（[Q62](#/q/ab-100/62)）；trigger phrase 配 generative orchestration（[Q68](#/q/ab-100/68)）；unmanaged solution in production（[Q19](#/q/ab-100/19)、[Q92](#/q/ab-100/92)、[Q115](#/q/ab-100/115)）；Azure AI Studio（[Q65](#/q/ab-100/65)） | "skill"、"classic"、"unmanaged" 见到即排除 |
| 错误层级的动作 | Migrate the tenant（[Q16](#/q/ab-100/16)）；Duplicate App1、Enable Copilot for Env1（[Q118](#/q/ab-100/118)）；Retrain Agent1、adaptive card、training data（[Q20](#/q/ab-100/20)）；Store agent transcripts in source control（[Q92](#/q/ab-100/92)）；Sort by last name、≤ 100 GB、translate（[Q25](#/q/ab-100/25)/33/39/44）；Lower the max token limit（[Q106](#/q/ab-100/106)） | 动作与问题不在同一层（租户 vs 环境；展示 vs 数据；症状 vs 原因） |
| 错误的 Dynamics 365 / Copilot 产品 | Copilot for Sales 做 AP（[Q51](#/q/ab-100/51)）；Copilot in Word 做欺诈审查（[Q9](#/q/ab-100/9)）；GitHub Copilot、Security Copilot 建客户分析 agent（[Q123](#/q/ab-100/123)、[Q124](#/q/ab-100/124)）；AI Builder lead scoring 改 opportunity summary（[Q73](#/q/ab-100/73)）；Account Reconciliation / Supplier Communication agent 答 overdue invoices（[Q30](#/q/ab-100/30)）；M365 Copilot agent template 替代 Copilot for Sales（[Q63](#/q/ab-100/63)） | 核对该产品官方功能清单是否字面包含题干 bullet |
| 测量别的东西的指标 | word count、generation time（[Q18](#/q/ab-100/18)）；active users、resource usage、training duration（[Q87](#/q/ab-100/87)）；session duration、prompt length（[Q113](#/q/ab-100/113)）；market capitalization、brand awareness（[Q105](#/q/ab-100/105)）；Satisfaction / Reactions / Survey 当作 outcome（[Q91](#/q/ab-100/91)、[Q102](#/q/ab-100/102)）；uptime、load test、ticket history（[Q103](#/q/ab-100/103)）；average characters、session time（[Q31](#/q/ab-100/31)）；Tone Alignment、Consistency、Accuracy 当作"跑题 + 格式不符"的指标（[Q78](#/q/ab-100/78)） | 问"这个指标能否回答题干里的那个名词（质量/结果/成本/采用）" |
| "半对"选项 | a Bicep file（声明但不执行，[Q90](#/q/ab-100/90)）；a break-even analysis only（[Q22](#/q/ab-100/22)）；a quality gate alone（[Q94](#/q/ab-100/94)）；Azure Files（无版本，[Q98](#/q/ab-100/98)）；Agent flows（跟随推理，[Q60](#/q/ab-100/60)）；Agent1 only / data sources 也打包（[Q107](#/q/ab-100/107)）；Copilot Studio 下载会话（截断，[Q95](#/q/ab-100/95) 选 Power Apps 取完整 transcript）；只发布到 Microsoft 365 Copilot（覆盖不到 SharePoint，[Q77](#/q/ab-100/77)）；审计日志存完整 grounding 文档（要求只记 metadata，[Q128](#/q/ab-100/128)） | 看是否满足题干里的每一个限定词（automated、prior versions、versioned、independently、full） |


### 考纲热区与冷区

#### 按子领域计数（以主归属计，部分题跨两个子领域，合计略多于 129）

| 子领域 | 题数 | 主要命中 bullet | 题号 |
|---|---|---|---|
| A1 Analyze requirements | 10 | A1.2 数据质量 ×5；A1.3 数据组织 ×4；A1.2/A1.3 跨系统连接 ×1（[Q21](#/q/ab-100/21)） | [Q10](#/q/ab-100/10),11,13,20,21,23,25,33,39,44 |
| A2 AI strategy | 12 | A2.1 CAF ×3；A2.2/A2.7 平台选择 ×4；A2.3 多 agent ×3；A2.6 知识源 ×1；A2.9 prompt 库 ×1 | [Q1](#/q/ab-100/1),2,7,8,27,46,54,58,80,123,124,125 |
| A3 Costs & benefits | 14 | A3.1 ROI 标准/TCO ×9（含 6 道成本工具变体）；A3.2 ROI 分析 ×5；A3.3 build/buy/extend 仅作为 [Q22](#/q/ab-100/22) 的一部分；A3.4 model router 0 | [Q12](#/q/ab-100/12),14,22,26,28,31,34,35,36,37,38,45,82,105 |
| **A 合计** | **36（27.9%）** | 官方权重 25–30% | |
| B1 Design AI & agents | 18 | B1.2 Sales Copilot 自定义 ×5；B1.10 topics/fallback ×2；B1.4 Contact Center ×2；B1.5/B1.6 agent 类型 ×2；B1.15 agent/voice 设计 ×2；B1.14 编排/模型 ×1；B1.1 ×1；B1.11 ×1；B1.12 ×1；B1.13 ×1 | [Q1](#/q/ab-100/1),3,4,9,24,47,48,49,52,57,60,68,71,72,73,76,106,118 |
| B2 Extensibility | 10 | B2.5 Computer Use ×2；B2.4 MCP ×2；B2.2 M365 Copilot ×2；B2.6 reasoning/voice ×1；B2.3 custom connector ×1；B2.1 custom model ×1；B2.7 Teams/SharePoint ×1 | [Q6](#/q/ab-100/6),50,55,56,65,67,70,75,77,84 |
| B3 Prebuilt agents & apps | 12 | B3.1 Finance/SCM ×4；B3.4 Copilot for Sales ×3；B3.7 F&O in-app help ×2；B3.5 AI Builder/AI hub ×2；B3.2 Field Service ×1 | [Q5](#/q/ab-100/5),29,30,51,53,59,61,62,63,66,69,74 |
| **B 合计** | **40（31.0%）** | 官方权重 25–30%（题库略偏重） | |
| C1 Monitor & tune | 18 | C1.1 监控工具 ×10（含 7 道变体）；C1.4 指标 ×5；C1.3 ×2；C1.2 用户反馈 ×1 | [Q40](#/q/ab-100/40),41,42,43,81,83,91,95,97,102,104,108,110,114,116,122,126,129 |
| C2 Testing | 10 | C2.3 prompt 最佳实践 ×4；C2.4 跨 D365 测试 ×2；C2.1 测试流程 ×2；C2.2 模型验证 ×2 | [Q15](#/q/ab-100/15),17,18,78,87,93,96,103,109,113 |
| C3 ALM | 13 | C3.2 Copilot Studio/connector ALM ×7；C3.4 模型 ALM ×2；C3.6 ×2；C3.1 ×1（[Q107](#/q/ab-100/107)）；C3.3 Foundry ×2（[Q90](#/q/ab-100/90) r2、[Q111](#/q/ab-100/111)）；C3.5 ×2（[Q119](#/q/ab-100/119)、[Q127](#/q/ab-100/127)） | [Q19](#/q/ab-100/19),64,85,89,90,92,94,98,107,111,115,119,127 |
| C4 RAI/security/governance | 12 | C4.6 数据驻留 ×4；C4.2 治理 ×3；C4.5 RAI ×2；C4.8 审计 ×2；C4.7 ×1；C4.1 ×2；C4.4 prompt injection ×1 | [Q16](#/q/ab-100/16),79,86,88,99,100,101,112,117,120,121,128 |
| **C 合计** | **53（41.1%）** | 官方权重 40–45% | |

#### 最热的 10 个 bullet（按题数）

| bullet | 题数 | 题号 |
|---|---|---|
| C1.1 监控 agent 的流程与工具（Application Insights / Log Analytics / Analytics tab） | 10 | [Q40](#/q/ab-100/40),41,42,43,81,95,104,114,116,126 |
| A3.1 ROI 标准与 TCO（成本估算工具、horizon framework） | 9 | [Q12](#/q/ab-100/12),22,28,34,35,36,37,38,45 |
| C3.2 Copilot Studio agent / connector / action 的 ALM | 8 | [Q19](#/q/ab-100/19),64,77,85,89,90,107,115 |
| C1.4 agent 性能与指标 | 6 | [Q83](#/q/ab-100/83),91,102,110,122,129 |
| A3.2 ROI 分析 | 6 | [Q14](#/q/ab-100/14),26,31,45,82,105 |
| A1.2 grounding 数据质量 | 5 | [Q20](#/q/ab-100/20),25,33,39,44 |
| B1.2 Dynamics 365 Sales Copilot 自定义（opportunity summary、email assist） | 5 | [Q48](#/q/ab-100/48),71,72,73,76 |
| A2.2/A2.7 平台选择（Copilot Studio vs 其他） | 5 | [Q58](#/q/ab-100/58),80,123,124,125 |
| A1.3 组织数据供其他 AI 系统使用 | 4 | [Q10](#/q/ab-100/10),11,13,23 |
| B3.1 Finance / SCM 的 AI 功能 | 4 | [Q30](#/q/ab-100/30),51,53,74 |

#### 冷区：考纲 bullet 在题库中为零或仅作干扰项

| bullet | 题库状态 | 证据 |
|---|---|---|
| A3.4 model router | 0 正确；仅作干扰项 | [Q21](#/q/ab-100/21) 选项 A |
| A2.8 何时建自定义模型；A2.10 自定义 SLM | 0 | [Q84](#/q/ab-100/84) 用到 custom model 但问的是如何连接 |
| A2.12 AI Center of Excellence | 0；Power Platform CoE 仅作干扰项 | [Q2](#/q/ab-100/2) 选项 C、[Q46](#/q/ab-100/46) 选项 A |
| A2.13 跨多个 D365 app 的 AI 设计 | 仅通过测试题侧面涉及 | [Q15](#/q/ab-100/15),93 |
| B1.3 Copilot in Dynamics 365 Sales 的 connector | 0 | — |
| B1.7 prompt and response agent | 仅作 tile/背景 | [Q24](#/q/ab-100/24) tile、[Q91](#/q/ab-100/91) 题干 |
| B1.8 推荐 Foundry Tools（Azure AI services） | 0 正确；Azure AI Speech、Language、Translator、Document Intelligence 全部是干扰项 | [Q4](#/q/ab-100/4),10,55,66 |
| B1.9 code-first generative pages / agent feed | 0 | — |
| B1.16 Copilot Studio prompt actions | 0 直接题；最近的是 AI Builder prebuilt prompt | [Q29](#/q/ab-100/29) |
| B2.7 Teams / SharePoint agents | SharePoint agent 仅作干扰项；[Q50](#/q/ab-100/50) 考的是 Graph access；[Q77](#/q/ab-100/77) 行 1 只考"同一 agent 要进 Teams 和 SharePoint，单发 Microsoft 365 Copilot 不够" | [Q66](#/q/ab-100/66) 选项 B、[Q77](#/q/ab-100/77) |
| B3.3 为业务场景推荐 Microsoft 365 agents | 0；agent template 仅作干扰项 | [Q63](#/q/ab-100/63) |
| B3.6 finance and operations agent chat 的额外知识源 | 由 B3.7 的两题侧面覆盖 | [Q5](#/q/ab-100/5),59 |
| C1.2 分析 backlog 与用户反馈 | 仅 Satisfaction 一行与 Reactions 一题；backlog 没考 | [Q122](#/q/ab-100/122)、[Q129](#/q/ab-100/129) |
| C2.5 用 Copilot 生成测试用例 | 0 | — |
| C3.3 Foundry Agent Service 的 ALM | 轻度：Azure DevOps pipeline、Observability | [Q90](#/q/ab-100/90)(r2),105 |
| C4.3 模型安全 | 0 直接题；[Q79](#/q/ab-100/79) 侧面涉及 | [Q79](#/q/ab-100/79) |
| C4.4 漏洞与 prompt manipulation / prompt injection | 1（[Q79](#/q/ab-100/79)：隐藏指令 → 部署自带的 content filters）；Azure AI Content Safety 三次出现均为干扰项 | [Q79](#/q/ab-100/79),[Q86](#/q/ab-100/86),[Q101](#/q/ab-100/101) |
| B2.4 MCP、B2.5 Computer Use、B2.6 reasoning/voice | 已考（各 2–3 题），不是冷区 | [Q70](#/q/ab-100/70),75；[Q56](#/q/ab-100/56),65；[Q4](#/q/ab-100/4),47,55 |

注意：题库里 prompt injection 只有 [Q79](#/q/ab-100/79) 一题（答案是 Azure OpenAI 部署自带的 content filters），"jailbreak"、"Content Safety" 从未作为正确答案出现；但 C4.4 与 C4.3 是官方 bullet，正式考试仍可能出现，备考时不能因题库题少而跳过。


### Case study 怎么读

两个 case 各 8 题。每题的答案几乎都由 Requirements 段里的一到两句话决定，Background / Problem Statements 只提供人格（low-code、Dataverse、D365 app 名）。需求句里的关键词与独立题完全同源（telemetry → Application Insights；adoption → Analytics tab；ROI → Savings calculator；low-code → Copilot Studio；labels → Purview）。

#### Fabrikam, Inc.（Dynamics 365 Sales、低代码单 agent、Dataverse SSOT）

| 需求原句 | 转成的题 | 答案 |
|---|---|---|
| "must follow Microsoft-recommended methodologies for infrastructure migration to the cloud" + "Azure must be used" | [Q2](#/q/ab-100/2) Which framework for the infrastructure migration | Cloud Adoption Framework for Azure |
| "final AI agent must follow Microsoft recommendations for a conversational user experience" + "designated checklist … compliant solution" | [Q1](#/q/ab-100/1) Which framework（两行） | Power Platform Well-Architected framework；Success by Design |
| "Use low-code development to create a single AI agent that has Dataverse as its core component" | [Q49](#/q/ab-100/49) r1 For AI agent creation；[Q82](#/q/ab-100/82) r1 Tool；[Q47](#/q/ab-100/47) 背景 | Microsoft Copilot Studio |
| "use handsfree headsets to interact with an AI agent" | [Q47](#/q/ab-100/47) Which template | Voice in Microsoft Copilot Studio |
| "Unexpected AI agent actions must end in an escalation to a live representative … after two failed attempts" | [Q49](#/q/ab-100/49) r2 For unexpected AI agent actions | a Fallback topic |
| "sales team must use Dynamics 365 Sales to correspond with prospects more quickly and efficiently" | [Q48](#/q/ab-100/48) Which tool for prospect communication | Copilot email assist |
| "Detailed telemetry must be logged for the first created AI agent" + "sensitive information … must be tracked for future auditing" | [Q81](#/q/ab-100/81) Which tool for sensitive information concerns | Application Insights |
| "ROI … required for stakeholder sign off" + "Any created AI agents must have their ROI calculated" | [Q82](#/q/ab-100/82) existing tool and data for stakeholder signoff | Copilot Studio（Savings calculator）；current time to complete the task per instance |
| "funding for future AI initiatives will depend on demonstrating an increase in AI adoption month over month" + "Sales managers must report on the adoption … monthly" | [Q83](#/q/ab-100/83) Which tool to help secure funding | the Analytics tab in Copilot Studio |
| 未出题的句子 | "sales managers can access unanswered correspondence from prospects and intervene"；"user authentication, the security framework"；"track interactions for open opportunities" | — |

#### Contoso, Ltd.（D365 Finance / SCM / Commerce、多 subscription、已有 MCP server）

| 需求原句 | 转成的题 | 答案 |
|---|---|---|
| CTO "Select one … prebuilt AI agent" + "wants to view available agent templates to identify which agent will add the most business value" | [Q74](#/q/ab-100/74) assist the CTO with the prebuilt agent selection | Agent management |
| CIO "appropriate security labels are assigned to the data" | [Q120](#/q/ab-100/120) CIO | Microsoft Purview |
| CISO "Discover and inventory AI resources for auditing" + "multiple legal entities and Azure subscriptions" | [Q120](#/q/ab-100/120) CISO | Azure Resource Graph Explorer |
| CFO "Analyze the ROI" + "will use the Copilot Studio agent usage estimator" | [Q31](#/q/ab-100/31) Which two components the CFO should evaluate | GPT models used；agent orchestration method |
| CFO "how many interactions … are abandoned … compared to resolved … Copilot Studio credits" | [Q122](#/q/ab-100/122) CFO | Effectiveness |
| CTO "track user feedback on the quality of the AI agent responses" | [Q122](#/q/ab-100/122) CTO | Satisfaction |
| CEO "verify reliability, interpretability, fairness, and compliance … Microsoft-recommended" | [Q121](#/q/ab-100/121) assist the CEO | the Responsible AI dashboard |
| "topics … selected based NOT on a trigger phrase, but on a description" + "connect to other agents that can be selected based on their description" + "business logic that is stored outside of the application" | [Q32](#/q/ab-100/32) What should you configure | generative orchestration |
| "R&D department already has a custom MCP server" + "answer questions about product specifications by using existing technologies" | [Q75](#/q/ab-100/75) 两行 | a custom connector；the MCP server |
| "low-code solution" + "Supply Chain Management business logic that is stored outside of the application" | [Q119](#/q/ab-100/119) Which two components in the ALM process | Power Platform solution；X++ model |
| 未出题的句子 | "accessible from within Microsoft Teams"；"integrated with and accessible from Dynamics 365 Supply Chain Management"；"CISO will audit … monthly"；"how much sensitive data was accessed … who accessed"；"agent capabilities must be previewed in a discovery meeting"；Dynamics 365 Commerce | — |

#### 读法

1. 先读题干的问句，确定是哪个角色（CTO/CFO/CISO/CIO/CEO）或哪段需求（Infrastructure Migration vs Sales Cycle Enablement），再回 case 找那一段，不通读。
2. 需求句里的名词就是触发词：telemetry、adoption、ROI、labels、inventory、templates、headsets、escalation、description、MCP server、low-code、Dataverse。按 §2 的规则直接映射。
3. "NOT"（NOT on a trigger phrase）、"already has"（already has a custom MCP server）、"existing"（existing technologies）这类词决定了"复用/生成式编排"方向。
4. Case 的 Background 决定人格：Fabrikam 全程 Copilot Studio（[Q47](#/q/ab-100/47)/49/81/82/83 都不选 Foundry）；Contoso 全程 "D365 F&O 预置 + Copilot Studio 自定义"（[Q74](#/q/ab-100/74) Agent management、[Q119](#/q/ab-100/119) X++ model）。


### 答题策略

#### 读题顺序
1. 先读最后一问（recommend / include in the design / use / do），确定答案是"产品名"还是"动作"。
2. 找限定词：minimize …、NOT …、only、first、existing、without …、securely、Azure-native、low-code（§5）。它们各自删掉半数选项。
3. 找名词触发词（telemetry、ROI、residency、labels、Semantic Kernel、某 D365 app 名、headsets、REST API、MCP），按 §2.1 映射。
4. 定人格栈（§2.3）：Power Platform maker 题里不选 Foundry/Azure 开发工具；Foundry 题里不选 Copilot Studio skill；Azure 资源题选 Policy/Defender；数据题选 Purview。

#### 必背阶梯（同题干多次出现，分数最密集）
- 监控：Application Insights > Log Analytics > Analytics tab（[Q40](#/q/ab-100/40)–43, [Q104](#/q/ab-100/104), [Q116](#/q/ab-100/116), [Q126](#/q/ab-100/126), [Q95](#/q/ab-100/95), [Q81](#/q/ab-100/81)）。
- 成本估算：Azure pricing calculator > TCO Calculator > Cost Management + Billing（[Q28](#/q/ab-100/28), [Q34](#/q/ab-100/34)–38）。
- ALM 三连：Power Platform solution → managed solution to prod → Power Platform pipelines；包里放 connection references（[Q19](#/q/ab-100/19), [Q64](#/q/ab-100/64), [Q85](#/q/ab-100/85), [Q89](#/q/ab-100/89), [Q90](#/q/ab-100/90), [Q92](#/q/ab-100/92), [Q107](#/q/ab-100/107), [Q115](#/q/ab-100/115)）。
- 数据清洗：biased / missing / inconsistent / cleanse，其余全错（[Q20](#/q/ab-100/20), [Q25](#/q/ab-100/25), [Q33](#/q/ab-100/33), [Q39](#/q/ab-100/39), [Q44](#/q/ab-100/44)）。

#### Analytics 指标词典（Copilot Studio Monitor 页）
- unanswered、knowledge source error、quality → Generated answer rate and quality / Answer quality（[Q91](#/q/ab-100/91), [Q97](#/q/ab-100/97), [Q102](#/q/ab-100/102), [Q110](#/q/ab-100/110)）。
- abandoned / resolved / escalated 计数 → Conversation outcomes / Topics by outcome / Effectiveness（[Q91](#/q/ab-100/91), [Q102](#/q/ab-100/102), [Q122](#/q/ab-100/122)）。
- escalated 百分比 → Escalation rate（[Q110](#/q/ab-100/110)）。
- 用户反馈、差评 → Satisfaction（[Q122](#/q/ab-100/122)）；针对单条回复的 thumbs up / down → Reactions（[Q129](#/q/ab-100/129)）。
- 采用趋势、低 resolution 排查 → the Analytics tab（[Q83](#/q/ab-100/83), [Q108](#/q/ab-100/108)）。
- 完整 transcript → Power Apps 读 Dataverse 的 conversation transcript 表（[Q95](#/q/ab-100/95)）。

#### Dynamics 365 对号表（见到 app 名就只在该 app 功能里选）
- Sales：Copilot email assist（[Q48](#/q/ab-100/48)）、opportunity summary 字段配置（[Q71](#/q/ab-100/71)）、business terms = display names（[Q3](#/q/ab-100/3)）；Outlook + CRM → Copilot for Sales（[Q61](#/q/ab-100/61)）。
- Finance：AI Summaries with Copilot、Collections coordinator summary（[Q30](#/q/ab-100/30)）；AP 预置 Copilot 前置 = Finance and Operations AI security role（[Q51](#/q/ab-100/51)）；扩展 Finance 的 ALM（配 Azure DevOps）→ Lifecycle Services（[Q127](#/q/ab-100/127)）。
- Supply Chain Management：AI Summaries、Generative insights for Demand planning（[Q53](#/q/ab-100/53)）；浏览预置 agent → Agent management（[Q74](#/q/ab-100/74)）。
- finance and operations in-app help：file upload，不开 AI general knowledge（[Q5](#/q/ab-100/5), [Q59](#/q/ab-100/59)）。
- Field Service：Copilot in Field Service + Field Service mobile app（[Q69](#/q/ab-100/69)）。
- Contact Center：Copilot Studio + Customer engagement hub（[Q52](#/q/ab-100/52)）、Escalate topic（[Q57](#/q/ab-100/57)）、voice channel 标准模型 NLU+（[Q4](#/q/ab-100/4)）。

#### 多选与 Yes/No
- "Which two"：答案是互补的一对，不是两个同类（平台 + 落地点 [Q52](#/q/ab-100/52)、[Q69](#/q/ab-100/69)；solution + pipelines [Q92](#/q/ab-100/92)、[Q115](#/q/ab-100/115)；Purview + Defender [Q86](#/q/ab-100/86)；Blob versioning + associate storage [Q98](#/q/ab-100/98)；GPT models + orchestration [Q31](#/q/ab-100/31)；solution + X++ model [Q119](#/q/ab-100/119)；Foundry Agent Service + Microsoft 365 Agents SDK [Q80](#/q/ab-100/80)；Relevance + Format Compliance [Q78](#/q/ab-100/78)）。两个选项若功能重叠，至多对一个。
- Yes/No 系列：只有"产品功能清单字面覆盖全部 bullet"才 Yes（[Q61](#/q/ab-100/61) Copilot for Sales、[Q71](#/q/ab-100/71) 添加 summary 字段、[Q125](#/q/ab-100/125) Copilot Studio）。凡是"用 flow / template / lead scoring / classic workflow / 开发者 Copilot / Security Copilot 来凑"的一律 No（7/10）。
- Yes/No 陈述 hotspot（[Q77](#/q/ab-100/77)、[Q128](#/q/ab-100/128)）：每行陈述对照题干的一条 requirement 独立判断；陈述只覆盖部分 requirement（只发 Microsoft 365 Copilot 却要求 SharePoint）或违反限定词（未经专员接受就写回、审计日志存全文）即 No。

#### Hotspot / dragdrop 的风险提示
- 两行独立判断，tile 可重复；但当两行是"对比式"需求（Semantic Kernel vs Dataverse；标准模型 vs voice）时，两行通常不同（[Q4](#/q/ab-100/4), [Q27](#/q/ab-100/27), [Q24](#/q/ab-100/24)）。
- 36 道 hotspot/dragdrop 中有 14 道 ExamTopics 原标记与复核答案不一致（[Q1](#/q/ab-100/1), [Q24](#/q/ab-100/24), [Q27](#/q/ab-100/27), [Q29](#/q/ab-100/29), [Q30](#/q/ab-100/30), [Q59](#/q/ab-100/59), [Q75](#/q/ab-100/75), [Q82](#/q/ab-100/82), [Q90](#/q/ab-100/90), [Q91](#/q/ab-100/91), [Q96](#/q/ab-100/96), [Q99](#/q/ab-100/99), [Q107](#/q/ab-100/107), [Q120](#/q/ab-100/120)），另有 [Q88](#/q/ab-100/88) 的解释自述"opinion is split"，[Q77](#/q/ab-100/77) 唯一一条社区评论把第 1 行答成 Yes（认为 Teams and Microsoft 365 Copilot channel 已覆盖 SharePoint）。这些题的共同点是"相邻产品之争"（Purview vs Defender for Cloud；Bicep vs DevOps pipeline；AI Builder prebuilt model vs prompt；Satisfaction vs Topics by outcome）。复习时以复核答案与 Learn 文档为准，并把这 16 题列为重点。

#### 排除法顺序（单选）
1. 退役/错代机制：skill、classic workflow、trigger phrase + generative orchestration、unmanaged in prod。
2. 层级错位：租户/环境级动作答应用级问题；Azure 资源工具答 Power Platform 问题；可视化工具（Power BI）答遥测问题。
3. 低代码题里的 pro-code 选项。
4. 测量别的东西的指标。
5. 剩下两个时，选"开箱即用、Microsoft 文档里有专名"的那个，而不是"也能做到"的那个。


## AI-103 · 题型、问法与限定词 {#ai103-formats}

### 题型与问法

#### 题型分布

| 题型 | 数量 | 占比 | 细分 / 题号 |
|---|---|---|---|
| 单选 single | 88 | 55% | 其中 case study 单选 9 题（[Q2](#/q/ai-103/2) [Q27](#/q/ai-103/27) [Q28](#/q/ai-103/28) [Q56](#/q/ai-103/56) [Q62](#/q/ai-103/62) [Q67](#/q/ai-103/67) [Q145](#/q/ai-103/145) [Q146](#/q/ai-103/146) 及 [Q61](#/q/ai-103/61) 为多选） |
| Hotspot 下拉/是非/代码补全 | 39 | 24% | 代码补全 12（[Q6](#/q/ai-103/6) [Q11](#/q/ai-103/11) [Q35](#/q/ai-103/35) [Q66](#/q/ai-103/66) [Q68](#/q/ai-103/68) [Q98](#/q/ai-103/98) [Q103](#/q/ai-103/103) [Q104](#/q/ai-103/104) [Q113](#/q/ai-103/113) [Q134](#/q/ai-103/134) [Q148](#/q/ai-103/148) [Q161](#/q/ai-103/161)）；是非陈述 7（[Q4](#/q/ai-103/4) [Q93](#/q/ai-103/93) [Q101](#/q/ai-103/101) [Q107](#/q/ai-103/107) [Q121](#/q/ai-103/121) [Q124](#/q/ai-103/124) [Q130](#/q/ai-103/130)）；配置下拉 20（[Q1](#/q/ai-103/1) [Q7](#/q/ai-103/7) [Q8](#/q/ai-103/8) [Q18](#/q/ai-103/18) [Q20](#/q/ai-103/20) [Q37](#/q/ai-103/37) [Q40](#/q/ai-103/40) [Q49](#/q/ai-103/49) [Q71](#/q/ai-103/71) [Q79](#/q/ai-103/79) [Q92](#/q/ai-103/92) [Q99](#/q/ai-103/99) [Q114](#/q/ai-103/114) [Q117](#/q/ai-103/117) [Q118](#/q/ai-103/118) [Q122](#/q/ai-103/122) [Q128](#/q/ai-103/128) [Q154](#/q/ai-103/154) [Q156](#/q/ai-103/156) [Q160](#/q/ai-103/160)） |
| 拖放 dragdrop | 14 | 9% | 匹配 7（[Q5](#/q/ai-103/5) [Q15](#/q/ai-103/15) [Q32](#/q/ai-103/32) [Q86](#/q/ai-103/86) [Q94](#/q/ai-103/94) [Q95](#/q/ai-103/95) [Q150](#/q/ai-103/150)）；排序 5（[Q108](#/q/ai-103/108) [Q112](#/q/ai-103/112) [Q133](#/q/ai-103/133) [Q152](#/q/ai-103/152) [Q158](#/q/ai-103/158)）；代码拖放 2（[Q30](#/q/ai-103/30) [Q77](#/q/ai-103/77)） |
| Yes/No 系列 | 12 | 7% | 3 组 × 4 题，同一场景换"Proposed solution"：[Q23](#/q/ai-103/23)–26、[Q41](#/q/ai-103/41)–44、[Q137](#/q/ai-103/137)–140 |
| 多选 multi | 8 | 5% | [Q33](#/q/ai-103/33) [Q61](#/q/ai-103/61) [Q69](#/q/ai-103/69) [Q72](#/q/ai-103/72) [Q115](#/q/ai-103/115) [Q127](#/q/ai-103/127) [Q135](#/q/ai-103/135) [Q144](#/q/ai-103/144) |
| Case study（含在以上各类中） | 12 | 7% | [Q1](#/q/ai-103/1) [Q2](#/q/ai-103/2) [Q27](#/q/ai-103/27) [Q28](#/q/ai-103/28) [Q56](#/q/ai-103/56) [Q61](#/q/ai-103/61) [Q62](#/q/ai-103/62) [Q66](#/q/ai-103/66) [Q67](#/q/ai-103/67) [Q68](#/q/ai-103/68) [Q145](#/q/ai-103/145) [Q146](#/q/ai-103/146)（2 题 hotspot 代码补全 [Q66](#/q/ai-103/66) [Q68](#/q/ai-103/68)，1 题 hotspot 配置 [Q1](#/q/ai-103/1)，1 题多选 [Q61](#/q/ai-103/61)，其余单选） |

代码补全合计 14 题（12 hotspot + 2 dragdrop），占 9%，语言/格式分布：Python SDK 8（[Q6](#/q/ai-103/6) [Q30](#/q/ai-103/30) [Q35](#/q/ai-103/35) [Q66](#/q/ai-103/66) [Q68](#/q/ai-103/68) [Q77](#/q/ai-103/77) [Q104](#/q/ai-103/104) [Q148](#/q/ai-103/148)）、YAML 1（[Q11](#/q/ai-103/11)）、Bicep 1（[Q98](#/q/ai-103/98)）、az CLI 1（[Q103](#/q/ai-103/103)）、ARM REST 1（[Q113](#/q/ai-103/113)）、Vision REST 1（[Q134](#/q/ai-103/134)）、docker run 1（[Q161](#/q/ai-103/161)）。另有 6 题"读代码判断输出"（[Q101](#/q/ai-103/101) [Q107](#/q/ai-103/107) [Q120](#/q/ai-103/120) [Q121](#/q/ai-103/121) [Q124](#/q/ai-103/124) [Q130](#/q/ai-103/130)）。

#### 题干公式及其真实考点

| 题干公式 | 数量 | 实际在问什么 | 例题 |
|---|---|---|---|
| "You have a Microsoft Foundry project that contains an agent…" 开头 | 62 | 新版 Foundry/agent 题的标志；考 Foundry Agent Service、workflow、evaluation、observability | [Q9](#/q/ai-103/9) [Q14](#/q/ai-103/14) [Q22](#/q/ai-103/22) [Q37](#/q/ai-103/37) [Q77](#/q/ai-103/77) |
| "You have an Azure subscription…" 开头 | 13 | 几乎全是 AI-102 旧题换名（Custom Vision、容器、VNet、Content Safety Studio） | [Q102](#/q/ai-103/102) [Q103](#/q/ai-103/103) [Q111](#/q/ai-103/111) [Q127](#/q/ai-103/127) [Q136](#/q/ai-103/136) [Q137](#/q/ai-103/137)–140 [Q149](#/q/ai-103/149) [Q155](#/q/ai-103/155) [Q158](#/q/ai-103/158) |
| "You need to… " | 144/161 | 需求句本身就是答案的别名（见第 2 节规则） | 全部 |
| "The solution must meet the following requirements:" + 2–3 条 bullet | 18 | 每条 bullet 对应正确选项的一个特征，或 hotspot 的一个槽位 | [Q5](#/q/ai-103/5) [Q20](#/q/ai-103/20) [Q29](#/q/ai-103/29) [Q31](#/q/ai-103/31) [Q32](#/q/ai-103/32) [Q37](#/q/ai-103/37) [Q45](#/q/ai-103/45) [Q59](#/q/ai-103/59) [Q84](#/q/ai-103/84) [Q87](#/q/ai-103/87) [Q97](#/q/ai-103/97) [Q113](#/q/ai-103/113) [Q116](#/q/ai-103/116) [Q123](#/q/ai-103/123) [Q127](#/q/ai-103/127) [Q152](#/q/ai-103/152) [Q156](#/q/ai-103/156) [Q157](#/q/ai-103/157) |
| "What should you do?" | 27 | 一个动作或一个参数（tool_choice、temperature、retry、inpainting…） | [Q17](#/q/ai-103/17) [Q39](#/q/ai-103/39) [Q46](#/q/ai-103/46) [Q74](#/q/ai-103/74) [Q89](#/q/ai-103/89) |
| "Which … should you use?" | 19 | 从同族里挑一个（analyzer、evaluator、signal、model type、tool） | [Q47](#/q/ai-103/47) [Q65](#/q/ai-103/65) [Q81](#/q/ai-103/81) [Q96](#/q/ai-103/96) [Q147](#/q/ai-103/147) |
| "What should you configure?" | 10 | 模式/选项（standard vs pro、hybrid、security scheme、MI 作用域） | [Q1](#/q/ai-103/1) [Q16](#/q/ai-103/16) [Q83](#/q/ai-103/83) [Q87](#/q/ai-103/87) [Q92](#/q/ai-103/92) |
| "What should you include in the solution / recommendation?" "What should you recommend?" | 13 | 服务选型（CU vs Document Intelligence vs Language vs AI Search） | [Q53](#/q/ai-103/53) [Q56](#/q/ai-103/56) [Q62](#/q/ai-103/62) [Q129](#/q/ai-103/129) [Q143](#/q/ai-103/143) |
| "Which type of …" | 4 | 类别级选择：LLM/SLM/embedding、serverless、multi-service 资源 | [Q29](#/q/ai-103/29) [Q96](#/q/ai-103/96) [Q97](#/q/ai-103/97) [Q131](#/q/ai-103/131) |
| "To what should you set …" | 3 | 单个参数值 | [Q10](#/q/ai-103/10) [Q73](#/q/ai-103/73) [Q76](#/q/ai-103/76) |
| "How should you complete the Python code / command / request / Bicep / workflow definition?" | 14 | SDK 类名、方法名、参数值（见 2.30 速查表） | [Q6](#/q/ai-103/6) [Q66](#/q/ai-103/66) [Q68](#/q/ai-103/68) [Q98](#/q/ai-103/98) [Q103](#/q/ai-103/103) |
| "How should you configure …?" | 10 | 模板/模式/节点类型 | [Q5](#/q/ai-103/5) [Q40](#/q/ai-103/40) [Q49](#/q/ai-103/49) [Q79](#/q/ai-103/79) [Q118](#/q/ai-103/118) |
| "Does this meet the goal / requirement?" | 12 | 提议方案是否覆盖问题的全部组成部分；一组里通常只有 0 或 1 个 Yes | [Q23](#/q/ai-103/23)–26（全 No）[Q41](#/q/ai-103/41)–44（[Q42](#/q/ai-103/42) Yes）[Q137](#/q/ai-103/137)–140（[Q137](#/q/ai-103/137) Yes） |
| "select Yes if the statement is true" | 7 | 读代码/读配置：参数名含义、返回字段、默认行为 | [Q4](#/q/ai-103/4) [Q93](#/q/ai-103/93) [Q101](#/q/ai-103/101) [Q107](#/q/ai-103/107) [Q121](#/q/ai-103/121) [Q124](#/q/ai-103/124) [Q130](#/q/ai-103/130) |
| "Which three/five actions should you perform in sequence?" | 5 | 既考顺序也考选项真伪（多出 2–4 个错误选项） | [Q108](#/q/ai-103/108) [Q112](#/q/ai-103/112) [Q133](#/q/ai-103/133) [Q152](#/q/ai-103/152) [Q158](#/q/ai-103/158) |
| "Which two … Each correct answer presents a complete solution" | 3 | 两个各自独立成立的方案 | [Q33](#/q/ai-103/33) [Q72](#/q/ai-103/72) [Q135](#/q/ai-103/135) |
| "Which two/three … Each correct answer presents part of the solution" | 5 | 组合方案，缺一不可 | [Q61](#/q/ai-103/61) [Q69](#/q/ai-103/69) [Q115](#/q/ai-103/115) [Q127](#/q/ai-103/127) [Q144](#/q/ai-103/144) |

---


### 限定词与陷阱词

| 限定词 | 出现 | 把答案推向 | 例题 |
|---|---|---|---|
| "minimize development effort" | 13 | 预建/内置/托管方案，几行配置（workflow、SSML phonemes、prebuilt 服务、portal 操作） | [Q9](#/q/ai-103/9) [Q63](#/q/ai-103/63) [Q106](#/q/ai-103/106) [Q110](#/q/ai-103/110) [Q123](#/q/ai-103/123) [Q129](#/q/ai-103/129) [Q132](#/q/ai-103/132) [Q142](#/q/ai-103/142) [Q143](#/q/ai-103/143) [Q152](#/q/ai-103/152) [Q157](#/q/ai-103/157) [Q159](#/q/ai-103/159) [Q160](#/q/ai-103/160) |
| "minimize administrative effort" | 5 | 一个共享配置（connection）、不训模型（CU）、资源自带设置（VNet rules）；**无安全条款时选 key**（[Q111](#/q/ai-103/111)） | [Q31](#/q/ai-103/31) [Q53](#/q/ai-103/53) [Q111](#/q/ai-103/111) [Q126](#/q/ai-103/126) [Q127](#/q/ai-103/127) |
| "principle of least privilege" | 3 | 最窄的数据面角色、project 级 MI | [Q8](#/q/ai-103/8) [Q13](#/q/ai-103/13) [Q92](#/q/ai-103/92) |
| "minimize costs" / "reduce costs and latency" | 2 | 不换大模型（加注释）、model cascade | [Q151](#/q/ai-103/151) [Q17](#/q/ai-103/17) |
| "without requiring reserved throughput capacity" + "must remain within the EU" | 1 | Standard，而非 Global Standard | [Q1](#/q/ai-103/1) |
| "NOT consume the vCPU quota" / "Prevents hosting model weights" | 2 | serverless | [Q97](#/q/ai-103/97) [Q122](#/q/ai-103/122) |
| "must remain within the service and model limits" | 2 | backoff + jitter / 拆文件，排除提额 | [Q39](#/q/ai-103/39) [Q95](#/q/ai-103/95) |
| "without modifying the prompt" | 1 | 调 temperature，不是改 prompt | [Q74](#/q/ai-103/74) |
| "without retraining the model or storing knowledge permanently" | 1 | few-shot | [Q75](#/q/ai-103/75) |
| "without regenerating" / "remove only… preserving the rest" / "exclusively inside the masked area" | 3 | mask-based inpainting | [Q45](#/q/ai-103/45) [Q46](#/q/ai-103/46) [Q88](#/q/ai-103/88) |
| "without requiring a language model deployment" | 1 | prebuilt-layout | [Q47](#/q/ai-103/47) |
| "must NOT require training a custom model" / "NOT a custom model" | 2 | CU / 内置编辑控制 | [Q53](#/q/ai-103/53) [Q45](#/q/ai-103/45) |
| "in the logic of the application code before responses are returned" | 3 | reflection / retry evaluation | [Q38](#/q/ai-103/38) [Q100](#/q/ai-103/100) [Q153](#/q/ai-103/153) |
| "deterministically" / "deterministic, step-based" | 4 | tool_choice required 或指定 type / workflow | [Q14](#/q/ai-103/14) [Q73](#/q/ai-103/73) [Q119](#/q/ai-103/119) [Q9](#/q/ai-103/9) |
| "only"（范围限制） | 16 | system message（只答 Contoso 产品 [Q28](#/q/ai-103/28)）、tool_choice type（只查互联网 [Q73](#/q/ai-103/73)）、VNet settings（只允许 vnet1 [Q136](#/q/ai-103/136)）、scope session（不跨会话 [Q76](#/q/ai-103/76)）、query key（只读 [Q112](#/q/ai-103/112)） | [Q28](#/q/ai-103/28) [Q73](#/q/ai-103/73) [Q76](#/q/ai-103/76) [Q112](#/q/ai-103/112) [Q136](#/q/ai-103/136) [Q154](#/q/ai-103/154) |
| "across separate sessions / conversations" vs "same case… days later… full history" | 8 | memory（persistent, {{$userId}}） vs conversation ID | [Q34](#/q/ai-103/34) [Q37](#/q/ai-103/37) [Q70](#/q/ai-103/70) [Q76](#/q/ai-103/76) [Q77](#/q/ai-103/77) [Q99](#/q/ai-103/99) |
| "single analyzer / single built-in skill / single key and endpoint / single structured output" | 9 | 一个资源/技能解决：CU skill（[Q84](#/q/ai-103/84) [Q116](#/q/ai-103/116)）、custom CU analyzer（[Q64](#/q/ai-103/64)）、pro mode（[Q87](#/q/ai-103/87)）、多服务资源（[Q113](#/q/ai-103/113) [Q131](#/q/ai-103/131)） | [Q64](#/q/ai-103/64) [Q84](#/q/ai-103/84) [Q87](#/q/ai-103/87) [Q113](#/q/ai-103/113) [Q116](#/q/ai-103/116) [Q131](#/q/ai-103/131) |
| "real-time / live / streaming / within a few seconds / approximately 100 ms" | 6 | real-time STT、WebRTC、serverless real-time | [Q58](#/q/ai-103/58) [Q59](#/q/ai-103/59) [Q90](#/q/ai-103/90) [Q97](#/q/ai-103/97) |
| "scanned" | 9 | 需要 OCR：CU、Document Intelligence、OCR skill、advanced parsing | [Q47](#/q/ai-103/47) [Q52](#/q/ai-103/52) [Q53](#/q/ai-103/53) [Q54](#/q/ai-103/54) [Q57](#/q/ai-103/57) [Q64](#/q/ai-103/64) [Q85](#/q/ai-103/85) [Q117](#/q/ai-103/117) [Q132](#/q/ai-103/132) |
| "varied layouts / template-generalizing / across varying templates" | 3 | CU（不是训练自定义模型） | [Q53](#/q/ai-103/53) [Q56](#/q/ai-103/56) [Q64](#/q/ai-103/64) |
| "citations" | 5 | 必须经过检索/提取：tool_choice required、normalized_images、CU skill 位置元数据 | [Q14](#/q/ai-103/14) [Q55](#/q/ai-103/55) [Q84](#/q/ai-103/84) [Q116](#/q/ai-103/116) [Q119](#/q/ai-103/119) |
| "confidence… routed for review" | 3 | CU 置信度（estimateFieldSourceAndConfidence / custom analyzer） | [Q57](#/q/ai-103/57) [Q64](#/q/ai-103/64) [Q87](#/q/ai-103/87) |
| "on-premises" / "intermittent internet connectivity" / "iOS app" | 3 | 容器（仍需联网计费）/ compact 域可导出 | [Q133](#/q/ai-103/133) [Q150](#/q/ai-103/150) [Q118](#/q/ai-103/118) |
| "Each correct answer presents a complete solution" vs "part of the solution" | 3 vs 5 | 两个独立方案 vs 组合方案 | [Q33](#/q/ai-103/33) [Q72](#/q/ai-103/72) [Q135](#/q/ai-103/135) vs [Q61](#/q/ai-103/61) [Q69](#/q/ai-103/69) [Q115](#/q/ai-103/115) [Q127](#/q/ai-103/127) [Q144](#/q/ai-103/144) |
| "medium severity" vs "high severity" | 1 | 阈值越低越严 | [Q93](#/q/ai-103/93) |
| "even after running az login" | 1 | 不是认证问题，是 RBAC 角色 | [Q13](#/q/ai-103/13) |
| "even when the clauses are present in the retrieved content" | 4 | 不是检索/截断问题，是生成选择问题 | [Q41](#/q/ai-103/41)–44 |
| "even when the knowledge API returns the expected data" | 1 | 看 tracing 的调用顺序 | [Q22](#/q/ai-103/22) |
| "volume of user traffic remains unchanged" | 1 | 排除流量，看 token usage | [Q19](#/q/ai-103/19) |
| "configure first" / "before sending" | 2 | 预处理步骤：先 CU 提取 / 先拆语言 | [Q52](#/q/ai-103/52) [Q60](#/q/ai-103/60) |

---


## AI-103 · 决策规则（核心） {#ai103-rules}

### 决策规则（核心）

按出现题数排序。"题数"为该规则决定答案的题目数（一题可落在多条规则下）。

#### R1 · 文档/多模态提取 → Azure Content Understanding in Foundry Tools（12 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "tables, logos, varied layouts" + "both the visual layout and the textual content" + "verified against vendor contract terms" | Azure Content Understanding in Foundry Tools | Azure Document Intelligence in Foundry Tools、Image Analysis、chat completions | [Q56](#/q/ai-103/56) |
| "OCR, layout analysis, and template-generalizing field extraction" + "must NOT require training a custom model" | Content Understanding | Azure Language、Azure Machine Learning model | [Q53](#/q/ai-103/53) |
| "mixed-format documents… preserve the document structure… converted into the Markdown format" + "configure first" | a Content Understanding analyzer（先提取再推理） | Responses API multimodal call、chat completion、Language text analysis | [Q52](#/q/ai-103/52) |
| "cost-effective, high-volume processing of standalone PDF invoices" | Single-file task in standard mode | pro mode | [Q5](#/q/ai-103/5) |
| "cross-document validation", "multi-step reasoning and reference data", "compare invoice to purchase order", "validate against static vendor contract documents", "single structured output that includes discrepancy findings" | Multi-file task in pro mode（合同作 reference data） | multi-file standard mode、single-file + additional document | [Q5](#/q/ai-103/5) [Q87](#/q/ai-103/87) |
| "preserve the PDF layout… sections and tables… detect QR codes… without requiring a language model deployment" | prebuilt-layout | prebuilt-read（纯 OCR）、prebuilt-documentSearch、prebuilt-documentFieldSchema | [Q47](#/q/ai-103/47) |
| "Markdown output… layout and semantic structure optimized for RAG" | prebuilt-documentSearch | prebuilt-layout、prebuilt-read | [Q81](#/q/ai-103/81) |
| "Extracts invoice number… across varying templates" + "Returns confidence scores… below 0.80 routed for supervisor review" + "single analyzer" | custom Content Understanding analyzer（自定义字段 + 置信度） | prebuilt-layout、documentSearch + search.score、groundedness guardrails | [Q64](#/q/ai-103/64) |
| "per-field confidence score and source grounding to locations within the source document" | Enable estimateFieldSourceAndConfidence | enableSegment、labeled samples、generative extraction for all fields | [Q57](#/q/ai-103/57) |
| AI Search skillset："single built-in multimodal content extraction skill" + "text and image location metadata" + "tables that span multiple pages" | Azure Content Understanding skill | Document Layout（有位置但不跨页合表）、Document Extraction、GenAI Prompt | [Q84](#/q/ai-103/84) [Q116](#/q/ai-103/116) |
| CU 视频分析："generated JSON field that describes the color scheme of each video segment" | Field value type = string，Field method = generate | classify（固定类别）、group/table | [Q86](#/q/ai-103/86) |
| 例外：题干**明确点名** Document Intelligence 且要 Markdown | output_content_format=ContentFormat.MARKDOWN | content=markdown、output=figures、confidence threshold | [Q63](#/q/ai-103/63) |

判别口诀：题干出现"varied layouts / template-generalizing / pro mode / reference data / Markdown for downstream reasoning / confidence for routing"任一者选 CU；Document Intelligence 只在题干点名它（[Q63](#/q/ai-103/63)）或旧题"extract text from PDF/scanned articles"（[Q128](#/q/ai-103/128) [Q132](#/q/ai-103/132)）时为正确答案。

#### R2 · 图像内嵌文字的恶意指令 → Prompt Shields for documents（8 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "images that include embedded text… malicious instructions hidden within the images"（case） | prompt shields | self-harm / violence content filtering、PII Detection、protected material detection | [Q2](#/q/ai-103/2) [Q145](#/q/ai-103/145) |
| "OCR output appended to the prompt… embedded text… prevent malicious instructions" | prompt shields for documents | prompt shields for user prompts（只管用户敲入的 jailbreak）、image moderation、protected material text | [Q51](#/q/ai-103/51) |
| "screenshots contain potentially malicious embedded text… third-party content treated as lower trust" | Set action to block + Enable Spotlighting | annotate、custom blocklist、"OCR first" | [Q49](#/q/ai-103/49) |
| Yes/No 系列："users can upload unsafe images AND embed hidden instructions" | 四个单项方案全部 No：user-prompt shield（[Q23](#/q/ai-103/23)）、image moderation（[Q24](#/q/ai-103/24)）、document shield（[Q25](#/q/ai-103/25)）、protected material（[Q26](#/q/ai-103/26)）各只覆盖一半 | — | [Q23](#/q/ai-103/23)–26 |
| 对照："classify uploaded images for harmful content… block based on severity levels" | image moderation（Content Safety 图像审核） | prompt shields、blocklists、OCR keyword scanning | [Q50](#/q/ai-103/50) |

记忆点：user prompt shield = 用户直接输入的 jailbreak；document shield = 第三方内容（文档、邮件、网页、OCR 文本）里的 indirect attack；image moderation = 不安全画面；protected material = 版权文本/代码（[Q26](#/q/ai-103/26) [Q71](#/q/ai-103/71) [Q93](#/q/ai-103/93) [Q139](#/q/ai-103/139)）。

#### R3 · "API keys must NOT be used / Entra / managed identity / least privilege" → DefaultAzureCredential + 最小角色（8 题，含 2 题反向）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "Authenticates by using a Microsoft Entra managed identity"（Python） | credential = DefaultAzureCredential() | AzureKeyCredential、ClientSecretCredential、None | [Q6](#/q/ai-103/6) [Q68](#/q/ai-103/68) |
| "HTTP 403 … even after running az login" + "least privilege" + model inference | Cognitive Services OpenAI User | Contributor（控制面、过权）、Cognitive Services User、Cognitive Services Data Reader | [Q13](#/q/ai-103/13) |
| "stored access key… violates a keyless-credentials requirement" + Key Vault + least privilege | system-assigned managed identity at the **project** level + Key Vault Secrets User role | Foundry 级 MI、service principal + client secret、access policy、API key in app settings | [Q92](#/q/ai-103/92) |
| Bicep 连接 Key Vault | category 'AzureKeyVault' + authType 'AccountManagedIdentity' | 'AccountKey'、'ApiKey' | [Q98](#/q/ai-103/98) |
| GitHub Actions 对 Azure 认证 | Azure Login action with OpenID Connect (OIDC) | PAT、user-assigned managed identity（GitHub 托管 runner 不可用） | [Q40](#/q/ai-103/40) |
| Content Safety 读 blob URL + least privilege | system-assigned managed identity + Storage Blob Data **Contributor**（reviewed；题库展示为 Reader，争议） | access keys、user-assigned + Storage Queue Data Contributor | [Q8](#/q/ai-103/8) |
| "Tool calls must authenticate by using the published agent's own identity… isolated… audit tracing" | a distinct agent identity bound to the client application | shared project agent identity、API keys in prompts | [Q20](#/q/ai-103/20) |
| **反向**："minimize administrative effort"，题干无任何安全/keyless 要求 | endpoint URI + subscription key（[Q111](#/q/ai-103/111)）；API key + deployment name（[Q154](#/q/ai-103/154)） | OAuth token、SAS token、MI + X.509、bearer token | [Q111](#/q/ai-103/111) [Q154](#/q/ai-103/154) |

#### R4 · 记忆 vs 对话：跨会话 → memory，同一案件续聊 → conversation（8 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "personalized experience in future interactions… retain conversation context and recall… previous interactions"（case） | memory | knowledge、tools、guardrails、instructions | [Q67](#/q/ai-103/67) [Q146](#/q/ai-103/146) |
| "Retain user preferences across multiple/separate conversations (chat sessions)" | Agent memory that uses persistent storage | Conversation history、Orchestration-managed session context、client application state | [Q37](#/q/ai-103/37) [Q99](#/q/ai-103/99) |
| "recall user preferences across separate conversations… isolated per authenticated user without the client manually generating user IDs" | MemorySearchTool(memory_store_name=…, scope="{{$userId}}")；PromptAgentDefinition(tools=[memory_tool]) | "{{$conversationId}}"、"session"、[mem_store_name] | [Q77](#/q/ai-103/77) |
| "conversation history does NOT persist across separate sessions" | scope = session | {{$userId}}、global、{{$conversationId}} | [Q76](#/q/ai-103/76) |
| "return days later to continue the same support case… full interaction history, including tool calls and tool outputs… automatically reloads" | store and reuse the conversation ID（conversation/thread 是服务端持久状态） | persist only final response、memory summarization、response、output item、agent | [Q34](#/q/ai-103/34) [Q70](#/q/ai-103/70) |

#### R5 · 可观测性信号三分法：tracing / token usage / evaluation（8 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "inspect individual agent runs… ordered sequence of LLM calls, tool invocations, and timing" | tracing | token usage、monitoring、safety metrics | [Q22](#/q/ai-103/22) |
| "end-to-end visibility into each step of the request workflow"（Responses API + Content Safety tool） | Enable application tracing in the project | Content Safety SDK logging、Foundry Local、route through Azure OpenAI endpoint | [Q78](#/q/ai-103/78) |
| "costs increase… traffic unchanged… input size, output size, or expanded tool usage" | token usage | latency、evaluation metrics、run success rate | [Q19](#/q/ai-103/19) |
| "Foundry Control Plane does NOT display error rates, runs, token usage… Traces tab is empty" | Enable Application Insights | Log Analytics workspace、restart、new version | [Q80](#/q/ai-103/80) |
| "Python service that does NOT run in the Foundry portal… end-to-end tracing" | OpenTelemetry + Application Insights（两个完整方案） | Log Analytics、Azure Monitor Agent、Sentinel | [Q33](#/q/ai-103/33) |
| LangChain 与 Foundry 共用一个 App Insights | 需各自配 tracer；OTEL_SERVICE_NAME 区分服务；enable_content_recording=False 不记录 prompts/tool data | — | [Q4](#/q/ai-103/4) |
| "Capture all the nested operations across the entire agent run" / "Record tool invocation arguments and returned results" | Hierarchical spans / Tool call attributes | Sampling、Trace sampling policy、KQL query filter | [Q94](#/q/ai-103/94) |
| "Unsupported responses" / "policy violations" 对应信号 | Groundedness evaluation metrics / Risk and safety metrics | Latency breakdown traces、Token usage analytics | [Q15](#/q/ai-103/15) |

#### R6 · 评估器映射：不被检索内容支持 → Groundedness（7 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "relevant, complete, and accurate" 基于 storage1 产品表（case）/ "assess the responses" | groundedness evaluator | RAG evaluator（含检索指标，过宽）、custom guardrail、fine-tuning | [Q27](#/q/ai-103/27) |
| "retrieved content is negatively influencing the model's generated responses" | groundedness evaluation metrics | indexer status、latency traces、prediction drift | [Q65](#/q/ai-103/65) |
| "claims not supported by the retrieved source content" + "retrieved content does not align with the labeled expected context" | Groundedness + Retrieval | Fluency、Coherence、Response Completeness | [Q69](#/q/ai-103/69) |
| "address the user query" + "supported by the provided context" / "sensitive or proprietary information" | Groundedness and Relevance / Protected material | GPT similarity、F1、ROUGE（需 ground truth）；Hateful、Indirect attack、Violent | [Q71](#/q/ai-103/71) |
| "groundedness, relevance, and harmful content categories" 两类 | AI quality (AI assisted) metrics + risk and safety metrics | AI quality (NLP) metrics、fluency、similarity | [Q72](#/q/ai-103/72) |
| "Some answers are unsupported by retrieved documents" | Groundedness evaluation metrics | — | [Q15](#/q/ai-103/15) |
| 阈值语义："medium severity threshold" 12% vs "high" 4%；protected material 无阈值；改成 low 不会让 RAI 检查通过 | No / Yes / Yes | — | [Q93](#/q/ai-103/93) |

#### R7 · 完整性（completeness）→ reflection pass / retry evaluation，不是调参（7 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "improve response completeness… implemented in the logic of the application code before responses are returned" | Add a retry evaluation / a reflection pass before responses are returned | decrease max_tokens、decrease temperature、increase presence_penalty、smaller model、enable streaming、"switch to RAG"（已在用） | [Q38](#/q/ai-103/38) [Q100](#/q/ai-103/100) [Q153](#/q/ai-103/153) |
| Yes/No："omit required regulatory clauses, even when present in the retrieved content" | 增大 max_tokens → No（[Q41](#/q/ai-103/41)，不是截断问题）；reflection pass regenerates → **Yes**（[Q42](#/q/ai-103/42)）；增大 temperature → No（[Q43](#/q/ai-103/43)）；评分低于阈值就 block → No（[Q44](#/q/ai-103/44)，阻断不等于改进） | — | [Q41](#/q/ai-103/41)–44 |

#### R8 · 网络隔离与容器：资源自身的 virtual network 设置；容器需联网计费（7 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "only specific Azure processes can access the Language service… minimize administrative effort" | virtual network rules（资源 Networking 设置） | Application Gateway、virtual network gateway、IPsec | [Q126](#/q/ai-103/126) |
| "only resources in vnet1 can access ta1" | the virtual network settings for ta1 | NSG、Azure Firewall、container | [Q136](#/q/ai-103/136) |
| "Prevent external access… Minimize administrative effort"（两步） | In CSAccount1 modify the virtual network settings + In VNet1 enable a service endpoint | IAM、create subnet、modify VNet1 settings | [Q127](#/q/ai-103/127) |
| AI Search "Prevent access from the internet" / "Limit each app to query specific indexes" | Create a private endpoint / Use Azure roles（reviewed；题库展示为 key authentication，争议） | IP firewall、key authentication（key 对所有索引有效） | [Q156](#/q/ai-103/156) |
| "confidential documents remain on-premises"（顺序题） | 有互联网连接的 on-prem Kubernetes → 从 MCR 拉镜像 → 运行容器并给 API key + Endpoint URL | Docker Hub、isolated from the internet、AKS、App ID + Client Secret | [Q133](#/q/ai-103/133) |
| docker run 参数 | 镜像 mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment；Billing=资源 endpoint URI；ApiKey；Eula=accept | blob URL、keyphrase 镜像 | [Q161](#/q/ai-103/161) |
| 容器 /status 不调用 Azure 端点验证 key；默认 console 日志；/swagger 有文档 | No / Yes / Yes | — | [Q130](#/q/ai-103/130) |

#### R9 · Custom Vision（旧题）：分类 vs 目标检测、compact 域、流程、指标（7 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "detect whether the image is of a cat or a dog" + "iOS app" | Classification → Multiclass (Single tag per image) → General (compact) | Object Detection、Multilabel、General/Retail 非 compact | [Q118](#/q/ai-103/118) |
| "identify defects… provide the location of the defects… ensure each package contains the four products" + "intermittent internet connectivity" | Object detection + General (compact) | Image classification、Food、Logo | [Q150](#/q/ai-103/150) |
| "detect faulty components… common faults"（顺序） | Create a project → Upload and tag images → Train the classifier model（reviewed；展示为 object detection，争议） | Initialize the training dataset | [Q108](#/q/ai-103/108) |
| "add new products to the classifier… minimize time and development effort"（五步） | Custom Vision portal 打开项目 → 上传 → 标注 → Retrain → Publish | Vision Studio、Azure Machine Learning studio | [Q152](#/q/ai-103/152) |
| "real-time video feed + image library of approved/rejected… train a new model… minimize development effort" | Azure AI Custom Vision | Azure Vision（预建，不能学你的产品）、Video Indexer、Azure ML | [Q129](#/q/ai-103/129) |
| 分类器评估指标 | precision + recall | F-score、AUC、weighted accuracy | [Q135](#/q/ai-103/135) |
| 目标检测图表读数 | precision 100% → false positives 0；TP/(TP+FN) = recall = 25 | — | [Q114](#/q/ai-103/114) |

#### R10 · 检索方式选择：语义 → vector，精确码 + 自然语言 → hybrid，多轮多块并行 → agentic（7 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "semantic similarity matching… different wording than the product manuals" | vector search | semantic ranking（只重排关键词结果）、suggesters、analyzers | [Q82](#/q/ai-103/82) |
| "Exact product names or codes" + "Natural language descriptions" | hybrid search | vector only、keyword only、semantic only | [Q83](#/q/ai-103/83) |
| "retrieve information from multiple chunks" + "Multi-turn conversations must influence retrieval planning" + "run in parallel" | agentic Retrieval Augmented Generation (RAG)（Azure AI Search agentic retrieval） | classic RAG、iterative retrieval、chain of thought | [Q36](#/q/ai-103/36) |
| "generate vector representations of the text… and of user queries" / "numeric vectors… semantic similarity" | an embedding model / embeddings | LLM、SLM、image generation、GPT-4、DALL-E | [Q96](#/q/ai-103/96) [Q123](#/q/ai-103/123) |
| case "indexing pipeline that enables semantic and vector search"：两个 built-in skills | Text Split + Azure OpenAI Embedding | Entity Recognition、Merge、Language Detection、key phrase extraction | [Q61](#/q/ai-103/61) |
| case 检索层选型 | Azure AI Search | Translator、Grounding with Bing Search、Document Intelligence | [Q62](#/q/ai-103/62) |

#### R11 · 输出稳定性与 prompt 调节：一致 → temperature 降到 0；范围限制 → system message（7 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "small wording differences are causing validation mismatches" + "maximize reasoning quality" | temperature=0 + output_config={"effort": "high"} | temperature 1/2、effort low/medium | [Q35](#/q/ai-103/35) |
| "Identical prompts must return consistent response… without modifying the prompt or reducing factual accuracy" | Decrease the temperature parameter | increase temperature、increase max_tokens、remove stop sequences | [Q74](#/q/ai-103/74) |
| "answer questions only about the Contoso products"（case business requirement） | Modify the system message instructions | few-shot examples、top-p、temperature | [Q28](#/q/ai-103/28) |
| "showing the model how correct classifications look, without retraining… or storing knowledge permanently" | few-shot learning | zero-shot、chain of thought、RAG | [Q75](#/q/ai-103/75) |
| "The model version used by Agent1 must remain consistent" | Opt out of automatic model version upgrades | Once current version expires、Upgrade once new default available | [Q1](#/q/ai-103/1) |
| "What is an LLM?" 歧义 | 加语境到问题或 system message 提高命中；generic system message 不保证确定性 | — | [Q124](#/q/ai-103/124) |
| "create an explanation of the code… minimize costs" | 在 prompt 末尾加 "// what does function F do?" | 换 GPT-4-32k、temperature=1、加函数桩 | [Q151](#/q/ai-103/151) |

#### R12 · 实时语音："live / streaming / within seconds / turn-taking" → real-time；自定义语音模型细节（6 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "transcribe live phone calls… continuous stream… within only a few seconds" | real-time speech to text | batch transcription（录音文件）、text to speech、speech translation | [Q58](#/q/ai-103/58) |
| "continuous audio input… spoken responses… turn-taking… low latency" | real-time speech to text + text to speech | batch、embeddings、speech translation | [Q59](#/q/ai-103/59) |
| "GPT realtime model… streaming audio… approximately 100 ms latency… client application" | WebRTC | WebSocket（TCP，延迟更高）、RTMP、SIP | [Q90](#/q/ai-103/90) |
| "fine-tune a baseline speech to text model… error: project ID is invalid" | the custom speech project ID | Foundry project ID、project URL、custom speech endpoint URL | [Q10](#/q/ai-103/10) |
| "custom speech to text model… expiration" + real-time endpoint | 自动回退到同 locale 最新 base model | 4xx error（那是 batch 的行为）、继续用过期模型、自动删除 | [Q12](#/q/ai-103/12) |
| "pronounces technical terms incorrectly… minimize development effort" | SSML phonemes | say-as、prosody、custom neural voice、Whisper | [Q106](#/q/ai-103/106) |

#### R13 · "deterministically force the agent to invoke a tool" → tool_choice（5 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "answers from the base model without invoking the knowledge base… deterministically force… on each run" | tool_choice="required"（加到 runs.create_and_process） | "auto"、{"type":"knowledge_base"}、{"type":"mcp"}、toolset、response_format、换 create_thread_and_process_run | [Q14](#/q/ai-103/14) [Q119](#/q/ai-103/119) |
| "responds without calling any tools, even when a tool is required"（拖放） | "tool_choice": "required" | "auto"、"tools"、"type"、"response_format" | [Q30](#/q/ai-103/30) |
| "Each workflow run must include a retrieval step before generating a response" | tool_choice = required | auto、none | [Q20](#/q/ai-103/20) |
| "deterministically retrieves information only from the internet"（两个工具） | tool_choice={"type": "bing_grounding"}（指定具体工具） | "required"（只保证调某个工具）、"auto"、azure_ai_search | [Q73](#/q/ai-103/73) |

#### R14 · 凭据集中管理 → project connection（5 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "centrally manage the Azure AI Search credentials… across all the agents" | Add a connection to the Azure AI Search resource | enable RBAC、disable key-based access、managed private endpoint（都是加固/隔离，不是集中管理） | [Q3](#/q/ai-103/3) |
| "Multiple client applications must use the same search configuration" + "prevent key-based authentication" + "Administrative effort must be minimized" | Configure an Azure AI Search connection in Project1 and reference it in each app | per-app endpoints、direct calls with Entra、per-app managed identity | [Q31](#/q/ai-103/31) |
| OpenAPI tool "401… API key header is NOT being sent… key stored in Connection1" | Connect the tool to Connection1 | identity passthrough、hard-code header in spec、default connection | [Q21](#/q/ai-103/21) |
| OpenAPI spec "key value from the connection included automatically" | an API key security scheme（apiKey, in: header） | per-operation header parameter、Bearer scheme、Key Vault connection | [Q16](#/q/ai-103/16) |
| Bicep "connection from Project1 to KV1" | category 'AzureKeyVault' + 'AccountManagedIdentity' | 'AzureAIService'、'AzureOpenAI'、'AccountKey'、'ApiKey' | [Q98](#/q/ai-103/98) |

#### R15 · AI Search 摄取/技能集：扫描 PDF 保结构 → advanced parsing；OCR 技能的输入是 normalized_images（5 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "OCR on scanned PDFs, preserves tables and headings as structure-aware chunks, stores page-number metadata" | Use advanced data parsing to reingest | OCR + page-level chunking、one page per chunk、basic parsing + fixed-size chunking | [Q54](#/q/ai-103/54) |
| "images are extracted into a structure that can be used as input for the built-in OCR skill" | an indexer to extract image data into a normalized_images collection | Shaper skill、OCR against content field、outputFieldMappings | [Q55](#/q/ai-103/55) |
| "invoices stored as scanned images… search invoice data" | OCR skill | Text Split、Text Translation、Image Analysis | [Q85](#/q/ai-103/85) |
| "document-level filtering"（三步） | Add allowed groups to each index entry + Retrieve the group memberships of the user + Supply the groups as a filter | one index per group、send Entra tokens with request、retrieve all groups | [Q115](#/q/ai-103/115) |
| knowledge store："unstructured JSON data" / "text from scanned PDF" | Object projection / Object projection（reviewed；展示为 File projection，争议） | Table projection、File projection（用于二进制图像） | [Q117](#/q/ai-103/117) |

#### R16 · HTTP 状态码 → 对策（5 题）

| 状态码 + 触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| 429 "rate limit exceeded… remain within the service and model limits" | retry policy with exponential backoff and jitter | retry immediately、reduce tools、split files、increase tenant-wide quotas | [Q39](#/q/ai-103/39) [Q95](#/q/ai-103/95) |
| 400 "file size exceeded" | Split content into smaller files before uploading | move content to file search、more tools | [Q95](#/q/ai-103/95) |
| 429 at peak + "No relevant information found" 诊断 | Metrics：Model Availability Rate + Provisioned Utilization；Diagnostic log：RequestResponse | Tokens Cache Match Rate、Total Requests 200、Time To Response；AllMetrics、audit、trace | [Q18](#/q/ai-103/18) |
| 403 after az login | RBAC 角色 Cognitive Services OpenAI User | Contributor | [Q13](#/q/ai-103/13) |
| 401 "API key header is NOT being sent" | Connect the tool to the connection | identity passthrough | [Q21](#/q/ai-103/21) |

#### R17 · Content Safety：SDK 调用、guardrail 介入点、Studio 功能（9 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "send a text comment… return the self-harm severity" | AnalyzeTextOptions(text=comment) + client.analyze_text(request) | AnalyzeTextOptions(text=[comment])、categories=comment、client.moderate_text、client.path("/text:analyze").post | [Q104](#/q/ai-103/104) |
| "analyze input_text by using the existing blocklist" | AnalyzeTextOptions(text=…, blocklist_names=[…], halt_on_blocklist_hit=False) + client.analyze_text | AddOrUpdateTextBlocklistItemsOptions、TextBlocklist、list_text_blocklists | [Q148](#/q/ai-103/148) |
| "cannot send any content tagged as Violence to the MCP server" | intervention point = tool call | user input、tool response、output | [Q147](#/q/ai-103/147) |
| "prevent harmful content from being returned during runs"（图像经 blob URL） | User input + Output + Tool response + Tool call 全选，Action = Block | Annotate（只标注不拦截）、只选部分点 | [Q8](#/q/ai-103/8) |
| "optimize the content filter configurations by running tests on sample questions" | Content Safety Studio → Moderate text content（Yes） | Safety metaprompt、Protected material detection、Monitor online activity（均 No） | [Q137](#/q/ai-103/137)–140 |
| severity 阈值方向 | 阈值越低越严格，拦得越多；protected material 不受阈值影响 | — | [Q93](#/q/ai-103/93) |

#### R18 · 多 agent 编排："deterministic, step-based, branching, shared state" → workflow；审批 → Ask a question（4 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "deterministic, step-based process… conditional branching and shared state… minimize development effort" | a workflow | threads and runs、multi-agent group chat（非确定性）、app-code coordination | [Q9](#/q/ai-103/9) |
| YAML "pauses for human approval and continues… only after approval" | type: ask_question；condition: approval == "approved" | basic_chat、data_transformation；condition true、propose_refund.output != null | [Q11](#/q/ai-103/11) |
| 可视化生成器 "predictable execution across the agents" / "Requires user approval for high-risk updates" | sequential template / Add an Ask a question node（reviewed；展示为 human-in-the-loop template + Condition statement，争议） | group chat template、Basic chat node | [Q79](#/q/ai-103/79) |
| Power Fx "ensures Var01 contains a value" / "uppercase" | Not(IsBlank(Local.Var01)) / {Upper(Local.Var01)} | IsEmpty（用于表）、IsBlank 不取反、{Upper(Var01)} 缺 Local 作用域 | [Q7](#/q/ai-103/7) |

#### R19 · 局部修改图像/视频 → mask-based inpainting；保持产品身份 → input_fidelity=high（4 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "remove only the logo, while preserving the rest of the image" | mask-based inpainting edit on the logo region | increase guidance strength、modify prompt、different seed（都重生整图） | [Q46](#/q/ai-103/46) |
| "edits apply exclusively inside the masked area… preserve lighting and style… built-in controls, NOT a custom model" | Enable mask_inpainting + input image + mask | image_variation、text_to_image、image_to_image high strength | [Q45](#/q/ai-103/45) |
| "remove the watermark without regenerating the videos" | mask-based inpainting edit to the affected part of the video | modify prompt、crop by size、increase guidance scale | [Q88](#/q/ai-103/88) |
| "maintain the product identity and visual characteristics of the provided photo" | Set input_fidelity to high | groundedness filter、decrease temperature、"include prompt and image" | [Q48](#/q/ai-103/48) |

#### R20 · 部署类型（4 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "dynamically scale… without requiring reserved throughput capacity" + "data… must remain within the EU" | Deployment type = Standard（区域型，不是 Global Standard） | Global Standard（可能路由到其他地域）、Global Provisioned | [Q1](#/q/ai-103/1) |
| "key-based authentication + real-time REST + NOT consume the vCPU quota" | serverless API | batch、self-hosted container、standard（managed compute） | [Q97](#/q/ai-103/97) |
| "Prevents hosting model weights in the Azure subscription" / "Compares candidate models by quality, cost, and throughput" | serverless deployment / model catalog leaderboards and model cards | managed compute、bring your own model、deployment lists and license tabs | [Q122](#/q/ai-103/122) |
| "deploy the DALL-E model" | Microsoft Foundry + Azure CLI | SDK + PowerShell、Azure ML studio、portal + Graph API | [Q102](#/q/ai-103/102) |

#### R21 · CI/CD 评估门禁（4 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "prevent branches from merging if evaluation results do NOT meet thresholds" | 工作流步骤 Fail（+ OIDC 登录） | Send an alert、Lock the target branch | [Q40](#/q/ai-103/40) |
| "YAML file File1 that defines the evaluation settings" | Set evaluation-config to the path of the YAML file | project-endpoint、model-deployment-name、tenant-id | [Q91](#/q/ai-103/91) |
| "Pipeline1 fails if unsupported content or a retrieval mismatch exceeds a threshold" | Retrieval + Groundedness evaluators | Fluency、Coherence、Response Completeness | [Q69](#/q/ai-103/69) |
| "identify the created Azure AI services account… minimize development effort" | az cognitiveservices account show | network-rule、az account list、az resource link | [Q142](#/q/ai-103/142) |

#### R22 · 模型类型选择（5 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "deep, multi-step reasoning across long contexts… detailed natural language responses" | large language model (LLM) | SLM、multimodal、key phrase extraction | [Q29](#/q/ai-103/29) |
| "Most requests are simple FAQs, but some require advanced reasoning… reduce costs and latency without degrading quality" | model cascade that routes requests to different models | all to smaller model、all to most capable、increase max_tokens | [Q17](#/q/ai-103/17) |
| "vector representations" | embedding model | LLM、SLM、DALL-E | [Q96](#/q/ai-103/96) [Q123](#/q/ai-103/123) |
| "suggest product names from a given product description" | GPT-4（文本生成） | Whisper、DALL-E、embeddings | [Q149](#/q/ai-103/149) |

#### R23 · Agent 工具对号入座（3 题）

| 需求 | 工具 | 题号 |
|---|---|---|
| "perform calculations during conversations" | Code interpreter | [Q32](#/q/ai-103/32) |
| "up-to-date information from public websites" / "only from the internet" | Grounding with Bing Search / tool_choice type bing_grounding | [Q32](#/q/ai-103/32) [Q73](#/q/ai-103/73) |
| "documents uploaded directly to the agent" / "uploading documents during a chat" | File search | [Q32](#/q/ai-103/32) [Q37](#/q/ai-103/37) |
| "prebuilt index / curated repositories / approved data sources" | Azure AI Search tool / retrieval from approved data sources | [Q37](#/q/ai-103/37) [Q99](#/q/ai-103/99) |
| 干扰项 | Computer use、Microsoft Fabric、Code interpreter（用于上传文档，错） | [Q32](#/q/ai-103/32) [Q37](#/q/ai-103/37) |

#### R24 · Vision（旧题）：场景文字 → Vision OCR，文档 → Document Intelligence；Image Analysis 带语言参数（8 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "road signs in the images and extract the text" / "identify well-known locations" | Azure Vision in Foundry Tools / Azure Language in Foundry Tools（NER + entity linking；reviewed，展示为 AI Search，争议） | Document Intelligence、AI Search | [Q160](#/q/ai-103/160) |
| "one million scanned magazine articles… extract text… minimize development effort" | Azure Document Intelligence in Foundry Tools（文本密集型文档用 DI read） | Vision Read API、Image Analysis、Language | [Q132](#/q/ai-103/132) |
| "press releases stored as PDF… extract text" / "sentiment analysis" | Document Intelligence / Azure Language | AI Search、Vision | [Q128](#/q/ai-103/128) |
| "tags in a user's preferred language… English, French, Spanish" | Azure Vision Image Analysis（language 参数） | Custom Vision、Content Safety、Custom Translator | [Q157](#/q/ai-103/157) |
| "verify that the user is alone… video stream… minimize development effort" | Spatial Analysis in Azure Vision | Video Indexer moderation、speech to text、Custom Vision object detection | [Q143](#/q/ai-103/143) |
| "identify whether an image is clipart or a line drawing" | POST …/vision/v3.2/analyze?visualFeatures=imageType | GET、description、objects、tags | [Q134](#/q/ai-103/134) |
| Read API "get_read_result occurs before the read operation is complete" | 循环 + 延迟轮询 get_read_result，并检查 read_result.status | 去掉 operation_id、检查 Operation-Location | [Q144](#/q/ai-103/144) |
| brands 代码：rectangle.x/y 是左上角，w/h 是宽高 | Yes / Yes / No | — | [Q101](#/q/ai-103/101) |

#### R25 · Language 与 Translator（旧题为主）（7 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| PII 代码：piiCategories=["Person","PhoneNumber"] + entityMask | 只检测/遮蔽 Person 和 PhoneNumber；email、SSN 原样送给模型 | — | [Q107](#/q/ai-103/107) |
| recognize_entities("Our tour of London included a visit to Buckingham Palace") | 输出 London 与 Buckingham Palace | tour、visit | [Q120](#/q/ai-103/120) |
| recognize_linked_entities | 不检测语言；url 指向数据源页（Wikipedia），不是 Bing 搜索（reviewed No，展示 Yes，争议）；matches 给出位置 | — | [Q121](#/q/ai-103/121) |
| custom NER "low precision… false positives… ContactInfo 混用电话/邮箱/社交账号" | 拆成 Phone、Email、SocialMedia 三个实体并重标 | lower threshold、auto-labeling、加更多同样混标的数据 | [Q105](#/q/ai-103/105) |
| "identical answer to a specific question is returned every time… minimize development effort" | Azure Language（question answering） | Azure OpenAI（每次措辞不同）、Document Intelligence、Azure ML | [Q159](#/q/ai-103/159) |
| "mixed-language segments… incomplete translations… entire transcript translated" | 先按语言拆分片段再逐段翻译 | document translation、auto language detection、强制 English | [Q60](#/q/ai-103/60) |
| "reduced comprehension… dyslexia… minimize development effort" | Azure AI Immersive Reader | Document Intelligence、Language、Translator | [Q110](#/q/ai-103/110) |

#### R26 · 资源创建与连接信息（7 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "single key and endpoint… multiple services… consolidated billing" | ARM PUT + "kind": "CognitiveServices"（多服务） | PATCH/POST、ComputerVision、TextAnalytics | [Q113](#/q/ai-103/113) |
| "Speech and Language APIs… single endpoint and credential" | Microsoft Foundry service（多服务资源） | 单服务 Language/Speech、Content Safety | [Q131](#/q/ai-103/131) |
| "generate fictional stories… customer-managed key" | az cognitiveservices account create --kind OpenAI … --encryption '{…keyVaultProperties…}' | AIServices、LanguageAuthoring；--assign-identity（无值）、--api-properties | [Q103](#/q/ai-103/103) |
| "configure App1 to connect to AI1"（Azure OpenAI SDK） | deployment name + endpoint + key | model name、model type | [Q125](#/q/ai-103/125) |
| 三个 deployment 三个 app，"only the apps can access AI1" | API key / deployment name（reviewed；展示 bearer token / deployment endpoint，争议） | SAS token、deployment type | [Q154](#/q/ai-103/154) |
| "identify the URL of the REST interface" | Keys and Endpoint blade | Networking、Identity、Properties | [Q155](#/q/ai-103/155) |
| Bicep 连接 KV | 见 R14 | — | [Q98](#/q/ai-103/98) |

#### R27 · Responsible AI 原则（2 题）

| 题干触发词 | 正确答案 | 题号 |
|---|---|---|
| "notify users that their data has been processed" | transparency | [Q109](#/q/ai-103/109) |
| "Sentiment Analysis results… calculate bonuses for staff" | 加入人工复核与审批步骤（accountability/fairness） | [Q141](#/q/ai-103/141) |

#### R28 · 多模态请求格式与异步生成（2 题）

| 题干触发词 | 正确答案 | 典型干扰项 | 题号 |
|---|---|---|---|
| "image URLs as plain text… model cannot recognize them as images" | content 数组：{type: text} + {type: image_url} | base64 塞进字符串、metadata、system message | [Q89](#/q/ai-103/89) |
| 视频生成（case，Project2） | client.videos.create(...) 启动；循环 client.videos.retrieve(video.id) 轮询直到 completed/failed/cancelled | list、download_content | [Q66](#/q/ai-103/66) |

#### R29 · 密钥轮换顺序（1 题）

"query key is compromised… minimize app downtime" → Add a new query key → Change the app to use the new key → Delete the compromised key（reviewed；展示为先删除，争议）。admin key 与只读访问无关（[Q112](#/q/ai-103/112)）。

#### R30 · 代码补全速查表（14 题 + 读代码 6 题）

| 场景 | 考试期望的类/方法/参数 | 干扰写法 | 题号 |
|---|---|---|---|
| 建 project client（Entra/MI） | AIProjectClient(endpoint="https://….services.ai.azure.com/api/projects/…", credential=DefaultAzureCredential()) | AzureKeyCredential、ClientSecretCredential、None | [Q6](#/q/ai-103/6) [Q68](#/q/ai-103/68) |
| 用 Responses API 发 prompt | project_client.get_openai_client() → responses.create(...) | retrieve、compact | [Q6](#/q/ai-103/6) |
| 取已存在的 agent | project_client.agents.get(name) | create_version、get_version | [Q68](#/q/ai-103/68) |
| 强制调用工具（run payload / runs.create_and_process） | "tool_choice": "required" | "auto"、response_format、toolset | [Q30](#/q/ai-103/30) [Q14](#/q/ai-103/14) [Q119](#/q/ai-103/119) |
| 长期记忆工具 | MemorySearchTool(memory_store_name=…, scope="{{$userId}}")；PromptAgentDefinition(model=…, instructions=…, tools=[memory_tool]) | "{{$conversationId}}"、"session"、[mem_store_name] | [Q77](#/q/ai-103/77) |
| 稳定输出 + 最高推理 | temperature=0；thinking={"type":"enabled"}；output_config={"effort": "high"} | 1/2；"low"/"medium" | [Q35](#/q/ai-103/35) |
| 视频生成 | client.videos.create(model=…, prompt=…) → client.videos.retrieve(id) 轮询 | list、download_content | [Q66](#/q/ai-103/66) |
| YAML workflow 人工审批 | type: ask_question；condition: approval == "approved" | basic_chat、true | [Q11](#/q/ai-103/11) |
| Power Fx | Not(IsBlank(Local.Var01))；{Upper(Local.Var01)} | IsEmpty、{Upper(Var01)} | [Q7](#/q/ai-103/7) |
| Bicep 连接 | Microsoft.CognitiveServices/accounts/connections；category: 'AzureKeyVault'；authType: 'AccountManagedIdentity' | 'AccountKey'、'ApiKey' | [Q98](#/q/ai-103/98) |
| az CLI 建 OpenAI 资源 + CMK | --kind OpenAI；--encryption '{"keySource":"Microsoft.KeyVault",…}' | --assign-identity、--api-properties | [Q103](#/q/ai-103/103) |
| ARM 建多服务资源 | PUT …/Microsoft.CognitiveServices/accounts/CS1；"kind": "CognitiveServices" | PATCH、ComputerVision | [Q113](#/q/ai-103/113) |
| Content Safety 文本 | AnalyzeTextOptions(text=…, blocklist_names=[…], halt_on_blocklist_hit=False)；client.analyze_text(request) | moderate_text、analyze_image、path().post | [Q104](#/q/ai-103/104) [Q148](#/q/ai-103/148) |
| Vision v3.2 分析 | POST …/vision/v3.2/analyze?visualFeatures=imageType | GET、tags | [Q134](#/q/ai-103/134) |
| docker run Language 容器 | mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment Eula=accept Billing={endpoint} ApiKey={key} | blob URL 作镜像、keyphrase 镜像 | [Q161](#/q/ai-103/161) [Q130](#/q/ai-103/130) |
| Document Intelligence Markdown | output_content_format=ContentFormat.MARKDOWN | content=markdown | [Q63](#/q/ai-103/63) |
| CU 置信度与来源 | estimateFieldSourceAndConfidence=true | enableSegment | [Q57](#/q/ai-103/57) |
| CU 视频字段 | type: string；method: generate | classify、table | [Q86](#/q/ai-103/86) |
| 多模态消息 | content=[{"type":"text",…},{"type":"image_url",…}] | base64 in string | [Q89](#/q/ai-103/89) |
| 图像生成保真 / 局部编辑 | input_fidelity="high"；mode mask_inpainting + image + mask | image_variation、image_to_image | [Q48](#/q/ai-103/48) [Q45](#/q/ai-103/45) |
| 遥测 | configure_azure_monitor(connection_string=…)；AzureAIOpenTelemetryTracer(enable_content_recording=False)；OTEL_SERVICE_NAME | — | [Q4](#/q/ai-103/4) |
| 读代码题 | brands.rectangle x/y/w/h（[Q101](#/q/ai-103/101)）；piiCategories 限定检测（[Q107](#/q/ai-103/107)）；recognize_entities 只出实体（[Q120](#/q/ai-103/120)）；linked entity url ≠ Bing（[Q121](#/q/ai-103/121)）；ChatCompletion 歧义 prompt（[Q124](#/q/ai-103/124)）；容器 /status /swagger（[Q130](#/q/ai-103/130)） | — | — |

---


## AI-103 · 干扰项、热区冷区、case study 与答题策略 {#ai103-tactics}

### 干扰项套路

| 套路 | 做法 | 例题（正确 vs 干扰） |
|---|---|---|
| 相邻服务 | 把同一大类里功能重叠的服务并列 | [Q56](#/q/ai-103/56) CU vs Document Intelligence；[Q52](#/q/ai-103/52)/Q53 CU vs Azure Language；[Q128](#/q/ai-103/128)/Q132/Q160 Document Intelligence vs Vision vs AI Search；[Q62](#/q/ai-103/62) AI Search vs Translator/Bing/DI；[Q143](#/q/ai-103/143) Spatial Analysis vs Video Indexer/Custom Vision；[Q129](#/q/ai-103/129) Custom Vision vs Vision vs Azure ML；[Q131](#/q/ai-103/131) 多服务 vs 单服务 |
| 对的功能，错的模式/层级 | 服务对了，但 mode、tier、template、shield 类型错 | [Q5](#/q/ai-103/5)/Q87 standard vs pro；[Q47](#/q/ai-103/47)/Q81 prebuilt-layout vs documentSearch vs read；[Q1](#/q/ai-103/1) Standard vs Global Standard；[Q97](#/q/ai-103/97)/Q122 serverless vs managed compute；[Q23](#/q/ai-103/23)/Q25/Q51 user-prompt shield vs document shield；[Q8](#/q/ai-103/8)/Q49 Annotate vs Block；[Q118](#/q/ai-103/118)/Q150 Classification vs Object detection、compact vs 非 compact；[Q79](#/q/ai-103/79) sequential vs group chat |
| 对的方法，错的参数 | 方法名对，值或键错 | [Q14](#/q/ai-103/14)/Q73 tool_choice auto/required/{type}；[Q43](#/q/ai-103/43)/Q74 temperature 升 vs 降；[Q41](#/q/ai-103/41) max_tokens；[Q68](#/q/ai-103/68) get vs get_version vs create_version；[Q66](#/q/ai-103/66) create/retrieve/list/download_content；[Q76](#/q/ai-103/76)/Q77 {{$userId}} vs {{$conversationId}} vs session；[Q7](#/q/ai-103/7) IsBlank vs IsEmpty、Local.Var01 vs Var01；[Q92](#/q/ai-103/92) Secrets User vs access policy；[Q104](#/q/ai-103/104) analyze_text vs moderate_text；[Q103](#/q/ai-103/103) --encryption vs --assign-identity；[Q113](#/q/ai-103/113) PUT vs POST/PATCH |
| 新旧名称混排 | 题干统一改成 "Azure X in Foundry Tools" / "Content Safety in Foundry Control Plane" / "Microsoft Foundry Service resource"，但选项里仍出现旧工具名当干扰 | [Q152](#/q/ai-103/152) Vision Studio、Azure ML studio vs Custom Vision portal；[Q102](#/q/ai-103/102) Azure ML studio；[Q106](#/q/ai-103/106) Speech Studio（此处反而是过度方案）；[Q78](#/q/ai-103/78) Foundry Local；[Q113](#/q/ai-103/113) kind 仍叫 CognitiveServices；[Q133](#/q/ai-103/133) Docker Hub vs MCR |
| 安全加固代替所问 | 问"集中管理/联通"，给 RBAC、禁 key、私有端点等加固项 | [Q3](#/q/ai-103/3)（connection vs RBAC/disable keys/private endpoint）；[Q127](#/q/ai-103/127)（IAM vs VNet 设置） |
| 过度方案 | 需要训练/自定义/更大模型的选项，在"minimize effort/cost"题里必错 | [Q106](#/q/ai-103/106) custom neural voice；[Q53](#/q/ai-103/53)/Q129 Azure ML；[Q27](#/q/ai-103/27) fine-tuning；[Q45](#/q/ai-103/45) custom model；[Q151](#/q/ai-103/151) GPT-4-32k；[Q111](#/q/ai-103/111) MI + X.509 |
| "调大数字"诱惑 | 增大 max_tokens / temperature / quota 作为万能药 | [Q17](#/q/ai-103/17) [Q41](#/q/ai-103/41) [Q43](#/q/ai-103/43) [Q95](#/q/ai-103/95)（increase tenant-wide quotas 被"remain within limits"排除） |
| 只解决一半 | Yes/No 系列里每个方案只覆盖问题的一个组成部分 | [Q23](#/q/ai-103/23)–26 四个全 No；[Q44](#/q/ai-103/44) 阻断 ≠ 改进 |
| 看似合理的运维动作 | 重启、升版本、加 Log Analytics、发告警、锁分支 | [Q80](#/q/ai-103/80)（restart/new version/Log Analytics vs enable App Insights）；[Q40](#/q/ai-103/40)（alert/lock vs Fail） |
| 顺序题里的假步骤 | 列表里混入不存在或不必要的步骤 | [Q108](#/q/ai-103/108) "Initialize the training dataset"；[Q158](#/q/ai-103/158) "Retrain the model"、"Configure disk logging"；[Q133](#/q/ai-103/133) "isolated from the internet"、"App ID and Client Secret" |

---


### 考纲热区与冷区

#### 按考纲大类（主归属，每题计一次）

| 大类 | 题数 | 占比 | 官方权重 | 偏差 |
|---|---|---|---|---|
| A. Plan and manage | 53 | 33% | 25–30% | 偏多（A3.4 安全 11 题、A2.1 资源/容器 7 题、A4.1 Content Safety 8 题拉高） |
| B. Generative AI & agents | 47 | 29% | 30–35% | 略少 |
| C. Computer vision | 28 | 17% | 10–15% | 偏多（C2.8 Custom Vision 旧题 7 题、C3.2 prompt shields 7 题） |
| D. Text analysis | 15 | 9% | 10–15% | 偏少 |
| E. Information extraction | 18 | 11% | 10–15% | 符合 |

题库自带的 kp 标签分布（供对照）：Planning & managing 44、Generative AI & agentic 48、Computer vision 27、Information extraction 24、Text analysis 18。

#### 按子领域

| 子领域 | 题数 | 题号 | 判断 |
|---|---|---|---|
| A3.4 安全（MI、private networking、keyless、RBAC） | 11 | [Q3](#/q/ai-103/3) [Q13](#/q/ai-103/13) [Q31](#/q/ai-103/31) [Q92](#/q/ai-103/92) [Q111](#/q/ai-103/111) [Q112](#/q/ai-103/112) [Q115](#/q/ai-103/115) [Q126](#/q/ai-103/126) [Q127](#/q/ai-103/127) [Q136](#/q/ai-103/136) [Q156](#/q/ai-103/156) | 最热 |
| A4.1 安全过滤/护栏/内容审核 | 8 | [Q8](#/q/ai-103/8) [Q93](#/q/ai-103/93) [Q104](#/q/ai-103/104) [Q137](#/q/ai-103/137) [Q138](#/q/ai-103/138) [Q139](#/q/ai-103/139) [Q140](#/q/ai-103/140) [Q148](#/q/ai-103/148) | 热 |
| A2.1 基础设施（资源创建、Bicep、容器） | 7 | [Q98](#/q/ai-103/98) [Q103](#/q/ai-103/103) [Q113](#/q/ai-103/113) [Q130](#/q/ai-103/130) [Q131](#/q/ai-103/131) [Q133](#/q/ai-103/133) [Q161](#/q/ai-103/161) | 热（多为旧题） |
| B3.2 reflection / self-critique | 7 | [Q38](#/q/ai-103/38) [Q41](#/q/ai-103/41) [Q42](#/q/ai-103/42) [Q43](#/q/ai-103/43) [Q44](#/q/ai-103/44) [Q100](#/q/ai-103/100) [Q153](#/q/ai-103/153) | 热（同一场景反复出） |
| C2.8 识别对象/部件（Custom Vision 为主） | 7 | [Q101](#/q/ai-103/101) [Q108](#/q/ai-103/108) [Q118](#/q/ai-103/118) [Q129](#/q/ai-103/129) [Q144](#/q/ai-103/144) [Q150](#/q/ai-103/150) [Q152](#/q/ai-103/152) | 热（旧题） |
| C3.2 图像内嵌文字的间接注入 | 7 | [Q2](#/q/ai-103/2) [Q23](#/q/ai-103/23) [Q25](#/q/ai-103/25) [Q26](#/q/ai-103/26) [Q49](#/q/ai-103/49) [Q51](#/q/ai-103/51) [Q145](#/q/ai-103/145) | 热 |
| B1.4 评估（幻觉、相关性、安全） | 6 | [Q27](#/q/ai-103/27) [Q69](#/q/ai-103/69) [Q71](#/q/ai-103/71) [Q72](#/q/ai-103/72) [Q114](#/q/ai-103/114) [Q135](#/q/ai-103/135) | 热 |
| B2.2 检索 + 函数调用 + 记忆 | 6 | [Q14](#/q/ai-103/14) [Q30](#/q/ai-103/30) [Q76](#/q/ai-103/76) [Q77](#/q/ai-103/77) [Q99](#/q/ai-103/99) [Q119](#/q/ai-103/119) | 热 |
| B3.1 prompt 工程与参数 | 6 | [Q28](#/q/ai-103/28) [Q35](#/q/ai-103/35) [Q74](#/q/ai-103/74) [Q75](#/q/ai-103/75) [Q124](#/q/ai-103/124) [Q151](#/q/ai-103/151) | 热 |
| B3.3 可观测性 | 6 | [Q4](#/q/ai-103/4) [Q15](#/q/ai-103/15) [Q19](#/q/ai-103/19) [Q22](#/q/ai-103/22) [Q33](#/q/ai-103/33) [Q78](#/q/ai-103/78) | 热 |
| E1.3 enrichment skills | 6 | [Q55](#/q/ai-103/55) [Q61](#/q/ai-103/61) [Q84](#/q/ai-103/84) [Q85](#/q/ai-103/85) [Q116](#/q/ai-103/116) [Q117](#/q/ai-103/117) | 热 |
| A1.1 选模型 | 5 | [Q29](#/q/ai-103/29) [Q96](#/q/ai-103/96) [Q122](#/q/ai-103/122) [Q123](#/q/ai-103/123) [Q149](#/q/ai-103/149) | 中 |
| A1.4 记忆/工具/知识集成 | 4 | [Q32](#/q/ai-103/32) [Q37](#/q/ai-103/37) [Q67](#/q/ai-103/67) [Q146](#/q/ai-103/146) | 中 |
| D2.1 STT/TTS | 4 | [Q58](#/q/ai-103/58) [Q59](#/q/ai-103/59) [Q90](#/q/ai-103/90) [Q106](#/q/ai-103/106) | 中 |
| E2.1 OCR + 版面 + 字段提取 | 4 | [Q53](#/q/ai-103/53) [Q56](#/q/ai-103/56) [Q63](#/q/ai-103/63) [Q132](#/q/ai-103/132) | 中 |
| E2.3 CU analyzer 结构化/Markdown 输出 | 4 | [Q47](#/q/ai-103/47) [Q52](#/q/ai-103/52) [Q64](#/q/ai-103/64) [Q81](#/q/ai-103/81) | 中 |
| A2.2 部署选项 | 3 | [Q1](#/q/ai-103/1) [Q97](#/q/ai-103/97) [Q102](#/q/ai-103/102) | 中 |
| A2.4 CI/CD | 3 | [Q40](#/q/ai-103/40) [Q91](#/q/ai-103/91) [Q142](#/q/ai-103/142) | 中 |
| A3.1 配额/限流/成本 | 3 | [Q18](#/q/ai-103/18) [Q39](#/q/ai-103/39) [Q95](#/q/ai-103/95) | 中 |
| B1.6 连接 Foundry 项目 | 3 | [Q125](#/q/ai-103/125) [Q154](#/q/ai-103/154) [Q155](#/q/ai-103/155) | 中（旧题） |
| B2.3 agent 工具集成 | 3 | [Q16](#/q/ai-103/16) [Q21](#/q/ai-103/21) [Q73](#/q/ai-103/73) | 中 |
| D1.1 实体/摘要/结构化 JSON | 3 | [Q120](#/q/ai-103/120) [Q121](#/q/ai-103/121) [Q160](#/q/ai-103/160) | 中（旧题） |
| D2.2 自定义语音模型 | 3 | [Q10](#/q/ai-103/10) [Q12](#/q/ai-103/12) [Q158](#/q/ai-103/158) | 中 |
| A1.2 / A4.2 / A4.4 / B1.5 / B2.1 / B2.4 / C1.3 / C2.1 / C2.6 / C2.7 / C3.1 / D1.2 / D1.4 / E1.2 | 各 2 | [Q62](#/q/ai-103/62) [Q110](#/q/ai-103/110) / [Q109](#/q/ai-103/109) [Q141](#/q/ai-103/141) / [Q20](#/q/ai-103/20) [Q147](#/q/ai-103/147) / [Q6](#/q/ai-103/6) [Q68](#/q/ai-103/68) / [Q34](#/q/ai-103/34) [Q70](#/q/ai-103/70) / [Q9](#/q/ai-103/9) [Q79](#/q/ai-103/79) / [Q45](#/q/ai-103/45) [Q46](#/q/ai-103/46) / [Q89](#/q/ai-103/89) [Q134](#/q/ai-103/134) / [Q86](#/q/ai-103/86) [Q143](#/q/ai-103/143) / [Q5](#/q/ai-103/5) [Q87](#/q/ai-103/87) / [Q24](#/q/ai-103/24) [Q50](#/q/ai-103/50) / [Q107](#/q/ai-103/107) [Q128](#/q/ai-103/128) / [Q105](#/q/ai-103/105) [Q159](#/q/ai-103/159) / [Q82](#/q/ai-103/82) [Q83](#/q/ai-103/83) | 温 |
| A1.3 / A3.2 / A4.3 / B1.3 / B2.5 / B2.6 / B3.4 / C1.1 / C1.2 / C1.4 / C2.2 / D1.3 / E1.4 / E2.2 | 各 1 | [Q36](#/q/ai-103/36) / [Q65](#/q/ai-103/65) / [Q94](#/q/ai-103/94) / [Q7](#/q/ai-103/7) / [Q11](#/q/ai-103/11) / [Q80](#/q/ai-103/80) / [Q17](#/q/ai-103/17) / [Q48](#/q/ai-103/48) / [Q66](#/q/ai-103/66) / [Q88](#/q/ai-103/88) / [Q157](#/q/ai-103/157) / [Q60](#/q/ai-103/60) / [Q54](#/q/ai-103/54) / [Q57](#/q/ai-103/57) | 冷 |

#### 考纲中未被命中的 bullet（0 题）

| bullet | 内容 | 备注 |
|---|---|---|
| A2.3 | Configure model and agent deployments | [Q1](#/q/ai-103/1) 的版本升级策略勉强相关，无独立题 |
| A3.3 | Monitor data ingestion quality, search index health, relevance performance | 仅作为干扰项出现（[Q65](#/q/ai-103/65) "indexer status and failure history"） |
| B1.1 | Deploy and consume LLMs, SLMs, code models, multimodal models | 被 [Q6](#/q/ai-103/6)/Q66/Q89 间接覆盖，无直接题 |
| B1.2 | Implement RAG in an application | 全部通过 AI Search/CU/评估题间接考，无"在应用中实现 RAG"的直接题 |
| C1.5 | Generation and editing controls | 仅 [Q48](#/q/ai-103/48) input_fidelity 擦边 |
| C2.3 | Visual question-answering grounded in visual evidence | 无 |
| C2.4 | Alt-text / extended descriptions aligned to accessibility | 无 |
| C2.5 | Content Understanding 提取视觉特征 | 仅 [Q86](#/q/ai-103/86)（视频）擦边 |
| C3.3 | Watermarks, prohibited symbols, brand usage | [Q46](#/q/ai-103/46)/Q88 是"去掉 logo/水印"的编辑题，[Q101](#/q/ai-103/101) 是旧版品牌检测；无策略执行题 |
| D2.3 | Multimodal reasoning from audio inputs | [Q90](#/q/ai-103/90) GPT realtime 擦边 |
| D2.4 | Speech translation | 仅作 [Q58](#/q/ai-103/58)/Q59 的干扰项 |
| E1.1 | Ingest and index documents, images, audio, video | 音频/视频索引无题 |
| E1.5 | Connect retrieval pipelines to workflows and agent tools | [Q14](#/q/ai-103/14)/Q119 的 MCP knowledge base、[Q73](#/q/ai-103/73) azure_ai_search 工具擦边 |

#### 旧题比例

52 题（32%）是 AI-102 时代的题目换了产品名（[Q101](#/q/ai-103/101)–[Q115](#/q/ai-103/115)、[Q117](#/q/ai-103/117)、[Q118](#/q/ai-103/118)、[Q120](#/q/ai-103/120)、[Q121](#/q/ai-103/121)、[Q123](#/q/ai-103/123)–[Q144](#/q/ai-103/144)、[Q149](#/q/ai-103/149)–[Q152](#/q/ai-103/152)、[Q154](#/q/ai-103/154)、[Q155](#/q/ai-103/155)、[Q157](#/q/ai-103/157)–[Q161](#/q/ai-103/161)）：Custom Vision、Language 容器、TextAnalyticsClient、Vision v3.2 REST、QnA、Immersive Reader、az cognitiveservices、VNet 规则、Content Safety Studio。其余 109 题（[Q1](#/q/ai-103/1)–[Q100](#/q/ai-103/100)、[Q116](#/q/ai-103/116)、[Q119](#/q/ai-103/119)、[Q122](#/q/ai-103/122)、[Q145](#/q/ai-103/145)–[Q148](#/q/ai-103/148)、[Q153](#/q/ai-103/153)、[Q156](#/q/ai-103/156)）是以 "You have a Microsoft Foundry project" 开头的新版题。两类题的知识体系不同，需分别复习。

---


### Case study 怎么读（Contoso, Ltd，12 题）

每道 case 题的题干会点名需求块（"meet the technical requirements" / "security and compliance requirements" / "business requirements" / "planned changes" / "issue reported by the finance department"），答案就是该块里某一行的功能别名。整个题库对需求行的复用如下：

| 案例原文（需求行） | 对应功能 | 题号 |
|---|---|---|
| Technical："scalable, high-throughput… dynamically scale… **without requiring reserved throughput capacity**" + "data processed by the model must remain **within the EU**" | Deployment type = Standard（不选 Global Standard） | [Q1](#/q/ai-103/1) |
| Technical："model version… must remain **consistent**" / Planned："standardize the model version" | Opt out of automatic model version upgrades | [Q1](#/q/ai-103/1) |
| Security："product sheets might contain **images that include embedded text**… protected from **malicious instructions hidden within the images**" | prompt shields | [Q2](#/q/ai-103/2) [Q145](#/q/ai-103/145)（同题换干扰项） |
| Technical："Responses… must be **relevant, complete, and accurate**" | groundedness evaluator | [Q27](#/q/ai-103/27) |
| Business："answer questions **only about the products sold by Contoso**" | Modify the system message instructions | [Q28](#/q/ai-103/28) |
| Problem："invoices contain **tables, logos, and varied layouts**" / Planned："evaluating **both the visual layout and the textual content**… verified against the vendor **contract terms**" | Azure Content Understanding in Foundry Tools | [Q56](#/q/ai-103/56) |
| Technical："indexing pipeline that enables **semantic and vector search**" | Text Split + Azure OpenAI Embedding skills；Azure AI Search | [Q61](#/q/ai-103/61) [Q62](#/q/ai-103/62) |
| Project2 "deployed **video generation model**" / Planned："Complete the development of the video creation solution" | client.videos.create → client.videos.retrieve | [Q66](#/q/ai-103/66) |
| Business："**personalized experience**… retain conversation context and **recall relevant information from previous interactions**" | memory | [Q67](#/q/ai-103/67) [Q146](#/q/ai-103/146)（同题换干扰项） |
| Security："**API keys must NOT be used**" + "authenticate… by using **Microsoft Entra** authentication" + "Access to Project1… **SC_Agent1_Dev**" | AIProjectClient(credential=DefaultAzureCredential()) + agents.get | [Q68](#/q/ai-103/68) |

未被任何题使用的行（可能是未来题或红鲱鱼）："A recent chat interaction… analyzed for sentiment… NOT processed yet"；"never reveal customer information, even if a document that contains customer data is added erroneously"（在 [Q2](#/q/ai-103/2) 里作为 PII Detection 干扰项出现）；"SC_Agent1_Test"；Agent1 的三条 "NOT enabled/NOT configured"（safety evaluation pipeline、tool invocation approval workflows、conversation memory constraints）——这三条明确指向 A4.2 安全评估、B2.5 审批流、B2.2 记忆约束，是可预期的新题方向。

读法：
1. 先读题干点名的需求块名，只回到那一块找行。
2. 找带加粗感的"硬词"（EU、NOT、only、consistent、embedded text、semantic and vector、personalized）——每个硬词固定对应一个功能。
3. 同一行会被出两次（[Q2](#/q/ai-103/2)/Q145、[Q67](#/q/ai-103/67)/Q146），干扰项换了但答案不变；这说明每条需求行只映射一个"官方答案"。
4. hotspot 两个槽位往往来自同一块的两行（[Q1](#/q/ai-103/1)：吞吐 + 版本；[Q68](#/q/ai-103/68)：Entra + 取 agent）。

---


### 答题策略

1. **先找 "You need to… must…" 的那一句，把它翻译成功能名**，再看选项。第 2 节的 29 条规则覆盖了 161 题中约 150 题的决定因素；题干的名词几乎就是答案的同义词（"supported by retrieved documents" = groundedness；"embedded text" = prompt shields for documents；"across separate conversations" = memory；"same case days later" = conversation；"deterministically" = tool_choice）。
2. **数需求 bullet，逐条对应选项特征。** 18 题带 2–3 条 "must meet the following requirements"；正确选项必须同时满足全部条，干扰项通常只满足一条（[Q31](#/q/ai-103/31)、[Q97](#/q/ai-103/97)、[Q116](#/q/ai-103/116)）。hotspot 里每条 bullet 对应一个槽位（[Q1](#/q/ai-103/1)、[Q20](#/q/ai-103/20)、[Q37](#/q/ai-103/37)、[Q92](#/q/ai-103/92)、[Q99](#/q/ai-103/99)、[Q122](#/q/ai-103/122)、[Q156](#/q/ai-103/156)）。
3. **看到 NOT / without / only / even when 先停一下，它们是在排除默认答案**：without reserved capacity 排除 Provisioned；NOT vCPU quota 排除 managed compute；without modifying the prompt 排除 system message；even when clauses are present 排除 max_tokens；without regenerating 排除改 prompt/seed。
4. **"minimize development effort" 选托管/预建；"minimize administrative effort" 且题干无安全要求时选 key**（[Q111](#/q/ai-103/111)、[Q154](#/q/ai-103/154) 都是 key 胜出）；一旦出现 "API keys must NOT / keyless / Entra / least privilege"，立刻切到 DefaultAzureCredential + system-assigned MI + 最窄角色（Cognitive Services OpenAI User、Key Vault Secrets User、Storage Blob Data Reader/Contributor）。
5. **Yes/No 系列：先判断问题有几个组成部分，再看提议方案覆盖了几个。** 全覆盖才 Yes；"阻断"不等于"改进"（[Q44](#/q/ai-103/44)）；一组四题通常 0–1 个 Yes（[Q23](#/q/ai-103/23)–26 全 No；[Q41](#/q/ai-103/41)–44 只 [Q42](#/q/ai-103/42)；[Q137](#/q/ai-103/137)–140 只 [Q137](#/q/ai-103/137)）。
6. **排序题先剔除假步骤再排序。** 固定模板：Custom Vision = 建项目 → 上传标注 → 训练 → 发布（[Q108](#/q/ai-103/108) [Q152](#/q/ai-103/152)）；密钥轮换 = 新建 → 切换 → 删除（[Q112](#/q/ai-103/112)）；容器 = 有网集群 → MCR 拉镜像 → 带 key + endpoint 运行（[Q133](#/q/ai-103/133)）；语音容器 = 申请批准 → 导出模型 → 运行（[Q158](#/q/ai-103/158)）。
7. **代码补全看动词：** create = 发送/启动（responses.create、videos.create），retrieve = 轮询结果（videos.retrieve），get = 取已存在对象（agents.get）；凭据类只要题干提 Entra/MI 就是 DefaultAzureCredential；强制工具就是 "tool_choice": "required"；记忆作用域跨会话就是 "{{$userId}}"。
8. **观测类题三分法：** 要看单次运行的调用顺序和耗时 → tracing；要拆成本构成 → token usage；要判断回答质量 → evaluation（groundedness / relevance / retrieval / protected material / risk and safety）；控制面空白 → Enable Application Insights。
9. **文档类题默认 Content Understanding**，只有题干点名 Document Intelligence（[Q63](#/q/ai-103/63)）或旧题"从 PDF/扫描件提取文字"（[Q128](#/q/ai-103/128)、[Q132](#/q/ai-103/132)）才选 Document Intelligence；CU 内部再按 standalone/高量 → standard、跨文档/参考数据 → pro、保版面 + 二维码 → prebuilt-layout、RAG Markdown → prebuilt-documentSearch、自定义字段 + 置信度 → custom analyzer 细分。
10. **三分之一是旧 AI-102 题换名**（[Q101](#/q/ai-103/101)–[Q161](#/q/ai-103/161) 为主）：看到 "Azure Vision/Language/Speech in Foundry Tools"、"Content Safety in Foundry Control Plane"、"Microsoft Foundry Service resource"、kind CognitiveServices、Custom Vision、docker run，就切换到 AI-102 知识（Custom Vision 域、容器计费、VNet 规则、TextAnalyticsClient、Content Safety Studio）。
11. **争议题（题库展示答案 ≠ reviewed answer）复习时以 reviewed 为准并核对 Learn：** [Q8](#/q/ai-103/8)（Storage Blob Data Reader vs Contributor）、[Q79](#/q/ai-103/79)（human-in-the-loop template + Condition vs sequential + Ask a question）、[Q108](#/q/ai-103/108)（object detection vs classifier）、[Q112](#/q/ai-103/112)（删除顺序）、[Q117](#/q/ai-103/117)（File vs Object projection）、[Q121](#/q/ai-103/121)（linked entity url 是否 Bing）、[Q130](#/q/ai-103/130)（/status 是否调 Azure）、[Q133](#/q/ai-103/133)（Docker Hub/隔离集群 vs MCR/联网集群）、[Q152](#/q/ai-103/152)（Vision Studio vs Custom Vision portal）、[Q154](#/q/ai-103/154)（bearer token/deployment endpoint vs API key/deployment name）、[Q156](#/q/ai-103/156)（key authentication vs Azure roles）、[Q158](#/q/ai-103/158)（Retrain vs Export）、[Q160](#/q/ai-103/160)（AI Search vs Language）。另 [Q76](#/q/ai-103/76) 的 "session" 作用域在 Learn 中未见记载，题库按选项集作答。

