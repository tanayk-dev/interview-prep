---
title: Personal & Resume
short: Personal & Resume
description: Your intro, your project, and every question your resume will trigger, with answers built from your real work.
order: 1
icon: 🙋
color: rosewater
---

> [!tip] How to use this page
> Every interviewer at Infosys starts with **"Tell me about yourself"** and then digs into **what's written on your resume**. Round 1 showed it: most questions came from your intro. Learn the **bullet points**, not the exact words, so it sounds natural. Anything in **[brackets]** is a detail only you know: fill it in once in your head.

## Your introduction

> [!question]- Q1. Tell me about yourself (90-second version) ⭐ 🔥
> **In simple words:** a short story with 4 parts: **Present → Past → Proof → Future**. In round 1 your intro was rushed and had **no numbers**. This version fixes that.
>
> > "Hi, I'm Tanay. I'm a **full-stack developer at Accenture** with about **4.5 years** of experience, since February 2022.
> >
> > **(Present)** My main strength is **Angular with TypeScript**. I build features in an **Nx monorepo** with reusable components, services and shared libraries, and I use **NgRx** for state management. These apps run the pricing and reporting workflows that several internal teams rely on. We recently upgraded from **Angular 16 to 20**.
> >
> > **(Past)** On the back end I've built **REST and OData APIs** in Node.js and .NET Core over **PostgreSQL**, used by **3+ internal applications**, which replaced manual spreadsheet work.
> >
> > **(Proof)** A few results I'm proud of: a serverless pipeline on **AWS Step Functions and Lambda** that cut processing time by **80–90%**; raising our Node.js test coverage from **20% to 78%**; and recently an **AI agent** that reads Azure DevOps stories and generates technical specs. I received the **Pinnacle Award** along with a promotion.
> >
> > **(Future)** I'm now looking for a bigger stage where I can own front-end architecture and full-stack features, which is why this role at Infosys excites me."
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   A["Present<br/>Angular + TS + NgRx<br/>Nx monorepo"] --> B["Past<br/>APIs in Node / .NET<br/>PostgreSQL"]
>   B --> C["Proof<br/>80–90% faster pipeline<br/>20% → 78% coverage<br/>AI agent, award"]
>   C --> D["Future<br/>why this role"]
> ```
>
> 💡 **Hack:** **"PPPF"** = *Present, Past, Proof, Future.* If you forget everything else, say **3 numbers**: **80–90%, 78%, 3+ apps.**

> [!question]- Q2. Give me a 30-second version
> Use this when the interviewer says "briefly" or when you're in the HR round.
>
> > "I'm a full-stack developer at Accenture with 4.5 years of experience, mainly **Angular, TypeScript and NgRx** on the front end and **Node.js / .NET Core APIs over PostgreSQL** on the back end, plus AWS serverless. I've cut a workflow's processing time by 80–90% with Step Functions and raised test coverage from 20% to 78%. I'm looking for a role with more ownership and scale, and this one matches my stack."
>
> 💡 **Hack:** **stack → 2 numbers → why here.**

> [!question]- Q3. Walk me through your resume / your career so far
> **In simple words:** tell it as a **growth story**, one step at a time, so the interviewer sees you getting bigger responsibilities.
>
> | When | What | What it shows |
> |---|---|---|
> | 2017–2021 | B.E. Computer Science, Nagpur, **CGPA 9.1** | strong basics |
> | 2022 | Joined Accenture; SQL scripts to migrate client data into **Google BigQuery** (General Mills) | data + SQL foundation |
> | 2022–2024 | Moved to full stack: **Angular + NgRx** features, **Node.js / .NET** APIs | breadth |
> | 2024–2025 | **AWS serverless pipeline** (80–90% faster), test coverage **20 → 78%**, Pinnacle Award + promotion | ownership + impact |
> | 2025–2026 | **Angular 16 → 20 upgrade**, Dynamic Targets go-live, **AI spec-generation agent (MCP)** | modern + innovative |
>
> **Diagram:**
> ```mermaid
> timeline
>   2021 : B.E. CSE (9.1 CGPA)
>   2022 : Joined Accenture : BigQuery data migration
>   2023 : Angular + NgRx features : Node.js / .NET APIs
>   2024 : AWS Step Functions pipeline : Coverage 20% → 78%
>   2025 : Pinnacle Award + promotion : Angular 16 → 20
>   2026 : Dynamic Targets go-live : AI spec agent with MCP
> ```
> ✍️ Adjust the years to match reality. The order matters more than the exact year.

## Your project

> [!question]- Q4. Explain your current project and its architecture ⭐
> **In simple words:** use **B-A-R-T**: **B**usiness (what problem), **A**rchitecture (how it's built), **R**ole (what *you* did), **T**eam (how you work). Keep it to 2 minutes, then offer to go deeper.
>
> - **Business:** internal **pricing and reporting** tools used by deal / solutioning teams. Before us, a lot of this lived in spreadsheets.
> - **Architecture:** Angular apps in an **Nx monorepo** → NgRx store → **REST / OData APIs** (Node.js and .NET Core) → **PostgreSQL**. Heavy jobs run in an **AWS serverless pipeline**. CI/CD on **Azure DevOps**.
> - **Role:** full-stack developer: Angular features + NgRx, APIs, pricing modules in C#, automated tests.
> - **Team:** ✍️ [team size, e.g. 8–10 devs], Scrum with [2-week] sprints, Azure DevOps boards.
>
> **Diagram (draw this on the whiteboard if asked):**
> ```mermaid
> flowchart LR
>   U["Users<br/>pricing / reporting teams"] --> FE
>   subgraph FE["Angular apps · Nx monorepo"]
>     direction TB
>     APPS["pricing-app · reporting-app"] --> LIBS["shared libs<br/>UI · data-access · utils"]
>     APPS --> ST["NgRx store"]
>   end
>   FE -- "HTTP + JWT" --> API["REST / OData APIs<br/>Node.js · .NET Core"]
>   API --> DB[("PostgreSQL")]
>   API -.-> DS["3+ downstream apps"]
>   subgraph AWS["AWS serverless pipeline"]
>     S3["S3"] --> SF["Step Functions"] --> L["Lambdas"] --> SNS["SNS alerts"]
>   end
>   L --> DB
> ```
>
> 💡 **Hack:** **"UI → state → API → DB, plus a pipeline on the side."** Draw boxes left to right while you talk.

> [!question]- Q5. What exactly was YOUR contribution?
> **In simple words:** interviewers want to hear **"I"**, not "we". Pick 3 things you owned end to end.
>
> 1. **I built** Angular features with NgRx (actions, reducers, effects, selectors) for the pricing and reporting screens.
> 2. **I designed and built** the OData / REST APIs that exposed PostgreSQL data to 3+ apps.
> 3. **I built** the Step Functions pipeline and **I raised** the Node.js test coverage from 20% to 78%.
> 4. **I created** the AI spec-generation agent that the team now uses in sprint planning.
>
> 💡 **Hack:** say **"I"** for what you did and **"the team"** for the rest. Never hide behind "we".

> [!question]- Q6. What was the most challenging part of your project? ⭐
> **In simple words:** tell **one** story with **STAR** (Situation, Task, Action, Result). The serverless pipeline is your strongest.
>
> - **S:** [Describe the workflow] was done manually; it took [X hours] and was error-prone.
> - **T:** Automate it reliably, with failures handled and people notified.
> - **A:** I designed an **AWS Step Functions** state machine: files land in **S3**, Lambdas validate → transform → load into PostgreSQL, **Retry / Catch** on each step, **SNS** sends success / failure alerts.
> - **R:** processing time and manual effort dropped by **~80–90%**, and failures became visible instead of silent.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   A["File uploaded to S3"] --> B["Step Functions starts"]
>   B --> C["Lambda: validate"]
>   C --> D["Lambda: transform"]
>   D --> E["Lambda: load to PostgreSQL"]
>   E --> F["SNS: success email"]
>   C -- "error after retries" --> G["SNS: failure alert"]
>   D -- "error after retries" --> G
> ```
> ✍️ Replace the steps with your real ones. The **shape** (trigger → steps → retry → alert) is what impresses.

> [!question]- Q7. What would you improve in your project if you could?
> **In simple words:** this tests maturity. Name 2–3 real improvements and *why*.
>
> - Move more components to **OnPush + signals** for faster screens
> - Add **E2E tests** with Playwright for the critical pricing flows
> - Better **monitoring**: CloudWatch dashboards and alarms instead of reading logs during incidents
> - **API versioning** so downstream apps don't break when we change contracts
>
> 💡 **Hack:** **"Performance, tests, monitoring, contracts."**

## Your resume, line by line

> [!question]- Q8. Tell me about the AI agent you built ⭐
> **In simple words:** an AI helper that reads a user story and writes the technical spec, so developers start with a clear plan. **This was your best answer in round 1. Lead with it again.**
>
> **How it works:**
> 1. The developer gives the agent an **Azure DevOps work item link**.
> 2. The agent uses the **Azure DevOps MCP server** to fetch the description, acceptance criteria and the parent feature.
> 3. It **analyses the brownfield codebase** (multiple repos) to find the affected parts.
> 4. It generates a **spec document** with **Mermaid flow diagrams**, and can implement code + unit tests.
> 5. **Human in the loop:** a developer reviews edge cases and tests before any PR.
> 6. **Skills** (review rules) check the AI-written code against our coding standards, locally and in the pipeline.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   D["Developer<br/>pastes work item link"] --> AG["AI agent"]
>   AG -- "MCP" --> ADO[("Azure DevOps<br/>story + acceptance criteria")]
>   AG --> CODE[("Codebase<br/>multiple repos")]
>   AG --> SPEC["Spec + Mermaid diagrams<br/>+ code + unit tests"]
>   SPEC --> H{"Developer review<br/>edge cases OK?"}
>   H -- "no" --> AG
>   H -- "yes" --> SK["Review skills<br/>coding standards"] --> PR["Pull request"]
> ```
>
> **If they ask "What is MCP?"** → *Model Context Protocol*: an open standard that lets an AI model use **tools and data sources** (like Azure DevOps, GitHub, a database) through one common interface. Think of it as **"USB-C for AI tools"**.
>
> 💡 **Hack:** **"Story in → spec out → human check → PR."**

> [!question]- Q9. How did you raise test coverage from 20% to 78%? ⭐ 🔥
> **In simple words:** you didn't test everything at once. You tested the **riskiest code first** and made the pipeline protect the gains. In round 1 you forgot to mention this story when asked about testing tools.
>
> - **Measure:** ran Jest with `--coverage` to see which files had zero tests.
> - **Prioritise:** business-critical code first (pricing calculations, API handlers, data mapping).
> - **Isolate:** mocked the database, AWS SDK and HTTP calls with `jest.fn()` / `jest.mock()` so tests run fast and offline.
> - **API tests:** used **Supertest** to call Express routes end to end.
> - **Protect:** added a **coverage threshold** in the CI pipeline so coverage can't silently drop.
> - **Bonus:** fixed **SCA** findings (vulnerable packages) along the way.
>
> **Example:**
> ```js
> // A unit test with a mocked repository
> jest.mock('../repo/price.repo');
> const repo = require('../repo/price.repo');
> const { getFinalPrice } = require('../services/price.service');
>
> test('applies 10% discount for premium deals', async () => {
>   repo.getBasePrice.mockResolvedValue(1000);
>   expect(await getFinalPrice('deal-1', 'PREMIUM')).toBe(900);
> });
>
> // jest.config.js: the pipeline fails if coverage drops
> module.exports = { coverageThreshold: { global: { lines: 75 } } };
> ```
>
> 💡 **Hack:** **"Measure → risk-first → mock → gate it in CI."**

> [!question]- Q10. Which tools do you use for testing and debugging? 🔥
> **In simple words:** in round 1 you only said Redux DevTools and Postman. Say the **full toolbox, grouped by layer**:
>
> | Layer | Tool | Used for |
> |---|---|---|
> | Unit (Angular + Node) | **Jest** | functions, services, reducers, components |
> | API / integration | **Supertest** | calling Express routes in tests |
> | End-to-end | **Playwright** | real browser flows (login → price → save) |
> | Manual API checks | **Postman** | hitting endpoints, saving collections |
> | Database | **pgAdmin / DBeaver / psql** | running SQL, checking data |
> | State debugging | **Redux DevTools**, Angular DevTools | NgRx actions and state diffs |
> | Production | **CloudWatch logs** | incidents |
> | Security | **SCA scans** in the pipeline | vulnerable packages |
>
> ⚠️ Be precise: **Postman → APIs. pgAdmin / DBeaver → database.** In round 1 the panel got confused when it sounded like you used Postman for Postgres.
>
> **Diagram:**
> ```mermaid
> flowchart TB
>   E2E["Playwright · few, slow, real browser"] --- INT["Supertest · API / integration"]
>   INT --- UNIT["Jest · many, fast unit tests"]
> ```
> 💡 **Hack:** **the test pyramid**: lots of unit tests at the bottom, few E2E at the top.

> [!question]- Q11. Do you have .NET Core experience? 🔥
> **In simple words:** in round 1 you undersold this ("the code was in .NET, but…"). **Own it** first, then be honest about depth.
>
> > "Yes. I built **OData endpoints in ASP.NET Core** over PostgreSQL that 3+ downstream apps consume: controllers, dependency injection, EF Core and Postgres functions, with `$filter`, `$select` and `$expand` support. I also implemented **pricing calculation modules in C#** in our .NET Core pricing engine, and integrated a **feature-flag framework** for controlled rollout. My deepest experience is Node.js, but I'm comfortable working in .NET Core."
>
> Then be ready for the basics: middleware, DI lifetimes, EF Core, async/await. → see the **.NET Core** page.
>
> 💡 **Hack:** **"Yes → what I built → where I'm deepest."** Never start with "not much".

> [!question]- Q12. What did you build with OData? Why OData and not plain REST?
> **In simple words:** OData is **REST with a built-in query language**. The client can filter, pick columns and sort through the URL, so you don't write a new endpoint for every screen.
>
> **Example:**
> ```http
> GET /odata/Deals?$filter=Region eq 'EMEA' and Value gt 100000
>                 &$select=Id,Name,Value
>                 &$orderby=Value desc
>                 &$top=20
>                 &$expand=Owner
> ```
> One endpoint serves the reporting screen, an Excel export and two other apps, each asking for different data.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   A["Reporting UI<br/>$filter + $top"] --> O["One OData endpoint<br/>/odata/Deals"]
>   B["Excel export<br/>$select columns"] --> O
>   C["Downstream app<br/>$expand=Owner"] --> O
>   O --> P[("PostgreSQL")]
> ```
>
> 💡 **Hack:** **OData = "SQL in the URL"**, safely controlled by the server.

> [!question]- Q13. What are feature flags and why did you use them?
> **In simple words:** an **on/off switch in config** for a feature. You deploy the code switched off, then turn it on for some users or environments, without redeploying.
>
> **Why:** safe rollout, test in production with a small group, **instant rollback** (flip the switch instead of a hotfix).
>
> **Example:**
> ```csharp
> if (await _featureManager.IsEnabledAsync("NewDiscountRules"))
>     price = _newCalculator.Calculate(deal);
> else
>     price = _legacyCalculator.Calculate(deal);
> ```
> 💡 **Hack:** **feature flag = a light switch for code.**

> [!question]- Q14. Tell me about the SCA vulnerability you fixed
> **In simple words:** SCA (**Software Composition Analysis**) scans your npm / NuGet packages for known security holes. It's a good problem-solving story because the obvious fix didn't work.
>
> - **S:** SCA flagged a **SharePoint-related npm package** as vulnerable / deprecated.
> - **T:** Remove the vulnerability without breaking the feature.
> - **A:** Upgrading wasn't enough: the new version **still pulled a vulnerable child dependency**. I traced the dependency tree (`npm ls <package>`), found we used only a small part of it, and **rewrote that part ourselves**, removing the package.
> - **R:** Scan clean, feature unchanged, one less dependency to maintain.
>
> Also mention: Angular version upgrades were partly driven by SCA findings.
>
> 💡 **Hack:** other fixes to mention: `npm audit fix`, `overrides` in `package.json` to force a safe child version.

> [!question]- Q15. Tell me about the BigQuery data migration
> **In simple words:** your first project: moving a client's (General Mills) enterprise data into **Google BigQuery** using SQL scripts.
>
> - Wrote **SQL transformation scripts** to map old tables to the new schema.
> - **Validated** by comparing **row counts** and **schema mappings** between source and target.
> - Taught you careful, data-first thinking, which helped later with PostgreSQL APIs.
>
> 💡 **Hack:** **"Extract → transform → load → verify counts."**

> [!question]- Q16. Which Angular version did you use and what did the upgrade involve? 🔥
> **In simple words:** you joined on **Angular 16** and the app was upgraded to **20**. Show that you know *what changed*.
>
> - Used `ng update` step by step (16 → 17 → 18 → 19 → 20), fixing breaking changes each step.
> - Adopted **standalone components** (no NgModules needed), the new **`@if` / `@for` control flow**, **signals**, `inject()`, and **`@defer`** for lazy sections.
> - New **esbuild / Vite builder** → much faster builds.
> - Checked third-party libs (AG Grid, NgRx) for compatible versions.
>
> 💡 **Hack:** **"S-S-C-D"**: Standalone, Signals, Control flow, Defer. Details are on the **Angular** page.

> [!question]- Q17. Which Angular features have you used? 🔥
> **In simple words:** in round 1 you gave a short list (components, NgRx, directives, pipes, DI). Give a **rich, grouped** answer instead:
>
> > "**Standalone components and signals** after the v20 upgrade. **NgRx** store, effects and selectors. **RxJS** operators like `switchMap`, `debounceTime` and `takeUntil`. **Reactive forms** with custom validators. **Lazy-loaded routes with guards**, **HTTP interceptors** for auth and errors, custom **pipes and directives**, **OnPush** change detection, and **AG Grid** with virtual scrolling for large tables."
>
> 💡 **Hack:** group it: **UI · state · data · routing · performance.**

> [!question]- Q18. What is your cloud experience? 🔥
> **In simple words:** in round 1 this answer rambled. **Group it** and finish with an honest learning plan.
>
> | Area | Services you've used |
> |---|---|
> | Compute | **Lambda**, **Step Functions** |
> | Data | **DynamoDB**, **RDS PostgreSQL**, **S3**, Google **BigQuery** |
> | Messaging | **SNS**, **SQS** |
> | Ops | **CloudWatch** logs for production incidents |
> | CI/CD | **Azure Pipelines** |
>
> > "Deployments go through our pipelines. I haven't provisioned infrastructure from scratch yet, but I understand IAM roles, environment config and rollback, and I'm learning **AWS CDK / SAM** to close that gap."
>
> 💡 **Hack:** **"Compute, Data, Messaging, Ops, CI/CD"** and end with a learning step.

> [!question]- Q19. Have you created CI/CD pipelines yourself? 🔥
> **In simple words:** be honest, but show you understand the whole flow.
>
> > "Not from scratch. Our Azure Pipelines were set up by DevOps, but I work with them daily: I read pipeline logs, update environment variables, handle secret rotations, add test and coverage steps, and roll back when needed."
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   PR["Pull request"] --> B["Build<br/>npm ci · ng build"]
>   B --> T["Test<br/>Jest + coverage gate"]
>   T --> S["Scan<br/>SCA / lint"]
>   S --> D1["Deploy to DEV"]
>   D1 --> D2["QA / UAT<br/>approval"]
>   D2 --> P["PROD"]
> ```
> 💡 **Hack:** **"Build → Test → Scan → Deploy → Approve → Prod."**

> [!question]- Q20. What was the Dynamic Targets go-live?
> **In simple words:** a feature you helped take to production across **two platforms (MMP DCTA and Phoenix)**, which needed coordination between Pricing and Solutioning teams. It earned a go-live recognition in 2026.
>
> Use it for **teamwork, cross-team delivery, deadlines and stakeholder management** questions.
> ✍️ Prepare: what Dynamic Targets does in one line, what your part was, one problem you hit during go-live.

> [!question]- Q21. What did you get the Pinnacle Award for?
> **In simple words:** recognition for **backend engineering and cross-team delivery impact**, given together with your **promotion to Analyst**.
>
> > "It was for my backend work and cross-team delivery: the serverless pipeline and the APIs that several teams depend on. It came with a promotion, which told me my work had real business impact."

## About you

> [!question]- Q22. What are your strengths?
> **In simple words:** pick 2–3 strengths and **prove each with a fact**. A strength without proof is just an opinion.
>
> - **Ownership:** built the serverless pipeline end to end → 80–90% faster
> - **Quality mindset:** coverage 20% → 78%, fixed SCA vulnerabilities
> - **Initiative / quick learner:** built the AI spec agent with MCP on my own
>
> 💡 **Hack:** **strength + proof + result.**

> [!question]- Q23. What is your weakness?
> **In simple words:** a **real but harmless** weakness + **what you're doing about it**. Never "I'm a perfectionist".
>
> > "I used to take on too much myself instead of asking for help early, because I like solving things end to end. Now I raise blockers in stand-up sooner and break work into smaller tickets, and my estimates have become more reliable."
>
> Round-1 bonus: *"I'm also working on giving crisper answers in meetings: point first, details after."*
>
> 💡 **Hack:** **weakness → action → improvement.**

> [!question]- Q24. What is your biggest achievement?
> **In simple words:** one STAR story with a number. Use the **serverless pipeline (80–90%)**. Backup: **coverage 20% → 78%** or the **AI agent**.
>
> 💡 **Hack:** the **number** is the hook. Say it in the first 10 seconds.

> [!question]- Q25. Tell me about a mistake or failure
> **In simple words:** interviewers grade the **lesson**, not the mistake. Own it, fix it, show what changed.
>
> Template: *"In [situation], I [mistake, e.g. pushed a change without testing an edge case / misread a requirement]. I [owned it, informed my lead, fixed it quickly]. Since then I [always add a test for that case / confirm acceptance criteria before coding]."*
>
> ✍️ Prepare one real example: a bug that reached QA or prod, a missed estimate, or a misunderstood requirement.
>
> 💡 **Hack:** **"Own → Fix → Learn → Prevent."**

> [!question]- Q26. Where do you see yourself in 5 years?
> > "As a **senior engineer or tech lead**: owning front-end architecture, mentoring juniors, and delivering features end to end. I'd like to grow into that here at Infosys, adding deeper cloud and architecture skills."
>
> 💡 **Hack:** **ambition + loyalty**: grow *here*.

> [!question]- Q27. How do you keep your skills up to date?
> Angular release notes and blog, building real tools (**the MCP agent**), hands-on upgrades (**Angular 16 → 20**), AI-assisted development, ✍️ [a course or newsletter you actually follow].
>
> 💡 **Hack:** **learn by building**: always give one thing you *built*, not just read.

> [!question]- Q28. Why have you stayed 4.5 years at one company?
> **In simple words:** turn it into **stability + growth**.
>
> > "Because I kept growing there: I moved from data migration into front-end, then full stack and cloud, got promoted with the Pinnacle Award, and built new things like the AI agent. It never felt stagnant. Now I want a bigger stage."
