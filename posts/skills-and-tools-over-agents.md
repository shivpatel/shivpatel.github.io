---
title: Skills and tools over agents
date: 2026-03-30
description: A case for native model APIs, vibe-coded simplicity, and skills over scaffolding.
---

*You need one minimalist agent, not an agent zoo.*

The AI industry is flooded with agent frameworks, orchestration platforms, and multi-agent architectures. Teams are spending months evaluating LangGraph, CrewAI, AutoGen, and a dozen other frameworks before writing a single line of business logic. They are debating A2A protocols and MCP server topologies before they have a single useful tool for their users.

This post argues that nearly all of this effort is misplaced. The winning strategy, validated by Anthropic's own engineering leaders, by OpenAI's product direction, by Andrej Karpathy's recent work, and by the economics of token-based pricing is radically simpler:

**Build one internally owned agent. Vibe code it against a native model API. Give it a sandbox to write and execute code. Then pour your energy into skills, tools, integrations, and knowledge bases that make that single agent effective at your organization's work.**

At its core, an AI agent is an LLM called in a while loop with structured output designating tool calls. For less than $100 in Claude Code usage, any team can vibe code a production-grade agent directly on any frontier model's API with no frameworks, no vendors, and no orchestration middleware. The result is cheaper than enterprise seat licenses, faster to iterate, and immune to the platform churn that has already orphaned half a dozen agent frameworks in the past eighteen months.

What follows is my full argument: technical, economic, and strategic.

---

## 1. The Agent Is a While Loop

Strip away the marketing and every agent architecture reduces to the same primitive: a loop that calls an LLM, inspects the structured output for tool-use instructions, executes those tools, appends the results, and calls the LLM again until it signals completion. Anthropic's own engineering documentation recommends exactly this pattern, advising teams to "use simple agentic loops (while-loops wrapping alternating LLM API and tool calls)" when building evaluation and production systems.

This is not an oversimplification. It is the literal architecture of Claude Code, Codex CLI, Gemini CLI, and every other terminal-based coding agent that emerged in 2025 and 2026. As one industry observer documented, all of these tools follow the same principle: the user provides a prompt, the LLM responds and may instruct the agent to carry out actions like editing files or running commands, the agent carries out the actions and appends the results to the prompt, and these steps are repeated in a loop. The principle is so simple that it immediately gave rise to dozens of alternative implementations.

When Andrej Karpathy released his autoresearch project in March 2026 (a system that ran hundreds of autonomous ML experiments overnight on a single GPU), the entire agent was a loop around a 630-line codebase. No framework. No orchestrator. No multi agent graph. Just an LLM, a file it could edit, a metric to optimize, and a loop. The results were remarkable: 700 experiments, 20 genuine improvements, and the discovery of bugs that Karpathy himself had missed after months of manual tuning.

If a loop and a native API call are sufficient for autonomous ML research, they are sufficient for your internal workflow automation.

---

## 2. The Case Against Frameworks and Platforms

### 2.1 Abstraction Is the Enemy of Agility

Every framework introduces opinions. LangGraph requires you to model your agent as a state graph with nodes, edges, and a compilation step. CrewAI requires you to decompose your problem into "crews" of role-typed agents. AutoGen requires you to design multi agent conversations. Each of these abstractions has a learning curve measured in weeks or months. Even framework advocates acknowledge that LangGraph is "not a weekend prototype tool" and that "simple workflows require significant code" and are "overkill for basic automation."

More dangerously, these abstractions sit between you and the model. When Anthropic ships a new capability like extended thinking, interleaved tool use, or a new structured output mode, you cannot use it until the framework wraps it. The same is true of services like Amazon Bedrock's Converse API or AWS AgentCore. These are abstraction layers that must be updated by their maintainers before you can access new model features. You are at the mercy of a platform provider's release cycle, and in AI, release cycles are measured in weeks, not quarters.

By contrast, code written directly against a model's native API (e.g. Anthropic's Messages API via Bedrock's invoke endpoint) gains access to new features the moment the model provider ships them. Your agent is a thin loop and a function call. Updating it to use a new model feature is often a one-line change.

### 2.2 Frameworks Become Tech Debt Overnight

The agent framework landscape moves at a pace that guarantees obsolescence. Microsoft has already shifted AutoGen into maintenance mode in favor of a broader "Microsoft Agent Framework." OpenAI deprecated its custom GPT Actions feature entirely. LangChain has undergone multiple major architectural overhauls that broke backward compatibility. Each of these transitions left teams with code that had to be rewritten; not because their business logic changed, but because their framework changed underneath them.

Adopting a framework or third-party platform is how organizations fall behind. There is always something new, and best practices are evolving at a pace that no middleware vendor can match. The better strategy is to own something minimal and native that you can vibe code a change to overnight. A 200 line agent loop written against the Claude API has no dependency risk. It has no upgrade path to manage. It is yours.

### 2.3 Nobody Has the Experience to Build a Platform (Yet)

This is not an argument against platforms in general. Kubernetes works. Terraform works. The teams who built those had accumulated years of production experience across thousands of deployments, in domains where the underlying primitives had stabilized. The abstractions they encoded were hard-won and well understood.

Agent platforms today have none of that foundation. Anthropic, OpenAI, and Google are each changing their own architectural guidance month to month. Best practices for memory, context management, and tool execution are still being debated in public. Most organizations have yet to ship an agent with meaningful business impact at scale. If the leading AI companies have not converged on a stable model, no one inside your organization is in a position to encode one.

Building an opinionated agent platform now means making architectural decisions from a position of maximum ignorance. The teams who build on top of it will inherit those decisions. When the field inevitably moves, your platform will be standing between your organization and the latest industry practices.

The right time to build platform abstractions is after you have operated multiple agents in production, learned what they have in common, and identified the patterns (if any) worth encoding. I'd bet most of us aren't there today.

### 2.4 Building Your Own Internal Platform Is the Same Trap

The natural response to framework churn is to build something in-house: an internal agent platform that the whole organization can use. Teams rationalize it as "owning our destiny." In practice, it is the same trap with a different owner.

An internal platform imposes all the same problems as a third-party one. It encodes architectural opinions about how memory works, how tools are registered, how conversations are threaded. Teams building on top of it inherit those opinions whether or not they fit their use case. The platform team becomes a dependency that other teams are blocked on. The backlog grows. Features lag model capabilities by weeks or months, exactly as with external vendors, because now you are the vendor.

Worse, internal platforms carry organizational gravity. Once multiple teams build on a shared platform, it becomes politically difficult to change. The platform team cannot deprecate things that block production workflows. The architecture calcifies around the decisions made in the first sprint, when the team knew the least about what they were building.

The instinct to "centralize agent infrastructure" is understandable but wrong. It assumes the agent framework is the scarce resource. It is not. The agent is cheap. The business logic, the integrations, and the skills are what cost time and should be shared. Share those, not the scaffolding.

---

## 3. Build Skills, Not Agents: The Emerging Consensus

In November 2025, Anthropic engineers Barry Zhang and Mahesh Murag delivered a talk at the AI Engineering Code Summit titled "Don't Build Agents, Build Skills Instead." The message was clear: the future of AI is not a zoo of bespoke agents, but rather a universal agent powered by a library of domain-specific skills. Zhang told the audience that Anthropic believes they have "converged on the architecture to build agents," and that architecture is a single agent loop coupled with modular, composable skills that package procedural knowledge.

Within five weeks of launching Skills, Anthropic reported thousands of deployments across domains from document processing to scientific research to enterprise workflows. Fortune 100 companies adopted org-wide skill libraries serving thousands of engineers. Non-technical contributors began building high-value professional skills.

OpenAI's product trajectory tells the same story. Custom GPTs, the Responses API, and the new ChatGPT Agent mode all follow a one agent + tools architecture. OpenAI's own practical guide to building agents states their recommendation as "maximize a single agent's capabilities first. More agents can provide intuitive separation of concepts, but can introduce additional complexity and overhead."

Both leading AI companies have independently concluded that the right unit of investment is the skill not the agent. The agent is commodity infrastructure. The skills are the intellectual property.

---

## 4. Why Multi Agent Orchestration Is a Trap

The pitch for multi agent systems is attractive: break complex problems into smaller problems and assign each to a specialized agent. In practice, the engineering overhead of this approach is enormous and the benefits are marginal.

### 4.1 Orchestration Complexity Compounds

Multi agent systems require solving distributed systems problems: message passing, state synchronization, failure recovery, handoff protocols, and conflict resolution. The frameworks that promise to simplify this orchestration (e.g. LangGraph, CrewAI, AutoGen) all introduce their own state models, their own debugging tools, and their own failure modes. You are trading one kind of complexity for another, and the new complexity will be less understood by you.

Orchestrating multiple agents is hard to architect, hard to test, and hard to troubleshoot. When Agent A hands off to Agent B, and Agent B's tool call fails, who retries? Who logs the error? Who decides whether to fall back? These questions have answers in a single agent loop: you write the error handling in the same code that makes the tool call. In a multi agent system, the answers depend on the framework's opinion about handoff semantics. Their opinion may not match your requirements.

### 4.2 The Token Cost Multiplier

Every agent in a multi agent system consumes tokens independently. Agent frameworks advocating for multi agent patterns acknowledge that "token costs add up fast when agents chat with each other." A single agent with the right tools and skills can accomplish the same work with a fraction of the token spend, because it does not need to explain the problem to itself across multiple personas.

### 4.3 The Governance Problem Solves Itself

A common objection to the single agent approach is that at scale, teams will create duplicate agents that do the same work, make conflicting decisions, and lack guardrails. This concern is legitimate, but the solution is not an agent platform. The solution is a shared skill library and a set of engineering principles.

When every team builds on the same single agent core, duplication is impossible by construction. Skills become the human readable and shareable lego blocks that are used standalone or together to create nifty workflows. When tools access data through the same authenticated APIs with the same access controls, conflicting decisions are prevented at the data layer. The skill-based architecture transforms what would be an agent governance crisis into an ordinary software engineering problem that organizations have already solved.

---

## 5. Protocols Like MCP and A2A: Powerful but Overprescribed

The Model Context Protocol (MCP) and Google's Agent-to-Agent (A2A) protocol solve real problems that arise when agents need to cross organizational or legal boundaries. MCP standardizes how agents discover and use tools, which is valuable when you are publishing a public API surface for third-party agents. A2A standardizes how agents from different organizations communicate, which is valuable when a Salesforce agent needs to talk to a ServiceNow agent across an enterprise boundary.

Within a single organization, these protocols are overkill. Your agent does not need to "discover" your internal APIs through a protocol server; it needs a tool definition in its system prompt and an HTTP client. Your internal agents do not need to communicate with each other through A2A; they need to call the same underlying services. MCP servers and A2A endpoints are integration overhead that adds latency, adds failure modes, and adds a dependency on protocol implementations that are still maturing.

This is not to say these protocols are worthless. They will matter enormously for cross-org interoperability. But for the 90% of enterprise use cases that operate within a single trust boundary, direct API integration is faster, simpler, and more reliable.

---

## 6. Tools Are Cheap When the Agent Writes Code

A frequently overlooked capability of frontier LLMs is their ability to write and execute code on the fly. Claude, GPT, and Gemini are all remarkably proficient at generating Python, JavaScript, SQL, and shell scripts to solve problems they have never seen before. This fundamentally changes the economics of tooling.

In the traditional agent framework model, every capability requires a pre-built tool: a search tool, a database tool, a calculation tool, a file-processing tool. Each tool must be authored, tested, documented, and maintained. The tool catalog becomes a significant engineering investment and a possible source of tech debt. When the underlying API changes, every tool that wraps it must be updated. When a new use case arises, a new tool must be built before the agent can handle it.

The alternative is to give the agent a code execution sandbox (a place to store files and run code it generates) and let it solve novel problems by writing code in real time. This is precisely how ChatGPT's Agent mode works: it has its own virtual computer and can "open a page using the text browser or visual browser, download a file from the web, manipulate it by running a command in the terminal, and then view the output back in the visual browser." The agent does not need a pre-built tool for every possible task. It needs a runtime.

This approach scales naturally. When the agent needs to generate a massive report, it writes a script to query the data, process it, and format the output. When it needs to analyze a CSV with a million rows, it writes a pandas pipeline. When it needs to call an API that has no pre-built tool, it reads the documentation and writes the HTTP request. The number of pre-built tools you actually need shrinks dramatically and with it, the maintenance burden that those tools represent.

---

## 7. Authentication and Security: Already Solved

A persistent concern with agent architectures is security: how do you ensure the agent only accesses data the user is authorized to see? The answer is the same pattern that has secured web applications for decades.

APIs have always been a natural enforcement point for authentication and authorization. OAuth 2.0, OIDC, and scoped access tokens already define exactly what a user can and cannot do. When your agent makes a tool call (like an HTTP request to an internal API), it passes the user's access token. The API validates the token, enforces the scopes, and returns only the data the user is authorized to access. All activity is limited to the user's permissions.

It's the security model your org already runs in production for every web application, every mobile app, and every M2M call. The agent adds no new attack surface because it operates through the same authenticated channels as every other client. Your existing audit logs capture every API call. Your existing rate limits prevent abuse. Your existing role-based access control determines what data flows through the agent.

This requires no special "agent security layer." The agent is simply another OAuth client. It acts on behalf of the user, within the user's scopes, through your existing APIs. Security teams can audit it with the same tools they already use.

---

## 8. The Economics: Tokens Beat Seats

Enterprise AI pricing today follows two models: per-seat subscriptions and per-token API usage. The per-seat model is what you pay when you buy ChatGPT Enterprise at roughly $60 per user per month (with a 150-seat minimum and annual contract) or Claude's enterprise tiers at similar price points. The per-token model is what you pay when you call the API directly via AWS Bedrock, GCP Vertex AI, etc..

The math favors tokens at organizational scale. Consider a 500-person organization paying $60 per seat per month for ChatGPT Enterprise: that is $360,000 per year. With per-token API pricing, the same organization running a custom agent built on a frontier model will typically spend a fraction of that amount; assuming most employees do not use AI continuously throughout the day. Token costs are strictly proportional to actual usage. Seat costs are proportional to headcount regardless of usage.

There is a deeper strategic risk with per-seat pricing. Today's enterprise AI products like ChatGPT, Claude, and Gemini are operating at prices subsidized by venture capital. These companies are spending far more on compute than they collect in subscription fees. The unit economics will correct. When they do, per-seat prices will rise, and organizations locked into seat-based agreements with deeply integrated workflows will face painful renewal negotiations. Token pricing, by contrast, is tied to the underlying cost of compute, which is falling. Paying by the token means your costs decrease as models become more efficient.

Building your own agent on the API is an insurance policy against the inevitable repricing of enterprise AI seats.

---

## 9. Observability and Tracing: Simpler Than You Think

A common argument for agent platforms is that they provide built-in observability. LangGraph has LangSmith. OpenAI has its dashboard tracing. It's value, but it's not value that requires a platform.

Because your agent is a simple loop, every iteration of that loop can emit a structured log entry: the input, the model's response, any tool calls made, their results, and the model's next action. This is a straightforward engineering task that any team can implement. Open-source tools like MLflow's GenAI module provide out-of-the-box tracing for LLM applications, and can be hosted on Databricks or any other infra you already operate. Alternatives like Braintrust also offer LLM observability with little integration effort.

The point is a simple agent is a simple system to observe. You do not need distributed tracing across multiple agent handoffs. You do not need to debug race conditions between concurrent agents. You do not need to reconstruct the state graph that led to a particular output. You need a linear trace of a single loop which is the easiest kind of system to monitor, debug, and optimize.

---

## 10. My Playbook: What to Actually Build

My prescription is simple:

- **One agent.** A while loop that calls a frontier model's native API. Structured output tells the loop when to call a tool, when to execute code, and when to respond to the user. This is 100–300 lines of code. You can vibe code it with Claude Code in a single afternoon.
- **A code execution sandbox.** Give the agent a filesystem and a runtime. This is how it handles scale problems like generating reports, processing data, and building artifacts without requiring a pre-built tool for every task.
- **Authenticated tool calls.** Each tool call passes the user's OAuth token. Your existing APIs enforce authorization. No new security layer required.
- **A growing library of skills.** Composable, versionable, shareable folders of instructions, scripts, and domain knowledge. Skills are your competitive advantage. They encode your organization's expertise in a format that any agent can consume. Share them across teams.
- **A growing library of integrations.** Not MCP servers; just tool definitions and HTTP calls. Add them as needed, retire them when the agent can write the integration code itself.
- **Knowledge bases.** Your documents, policies, and procedures in a format the agent can retrieve and reference. Used good ole RAG or vector search if needed. Keep it simple.
- **Lightweight observability.** Structured logging of every loop iteration. Route it to MLflow, Braintrust, or your existing logging infrastructure. Monitor token spend, latency, and tool-call success rates.

This is the entire architecture. It has no framework dependency. It has no platform vendor. It has no multi agent orchestration layer. It is cheap, fast, agile, and flexible. And because every component is simple, every component can be changed overnight when the landscape shifts (which it will).

---

## The Bottom Line

**Organizations do not need to build lots of agents. They need to build lots of skills and tools for as few internal agents as possible.**

The evidence is clear. Anthropic's engineers are on stage telling the industry to stop building agents and start building skills. OpenAI's product architecture centers on a single agent with composable capabilities. Karpathy's most celebrated recent work is a while loop and a 630-line script.

Vibe coding has made this the best path forward. A team with Claude Code or a comparable AI coding assistant can stand up a production-grade agent in a day, for less than $100 in API usage. That agent, running against native model APIs, will have access to every new model capability the moment it ships. It will cost a fraction of enterprise seat licenses. It will be observable with lightweight open-source tooling. It will be secure through the same OAuth-based authentication your organization already uses. And it will improve through the steady accumulation of skills, tools, and knowledge that encode your organization's expertise.

The frameworks will keep churning. The platforms will keep launching. The protocols will keep proliferating. Let them. Your agent is a while loop and a growing library of skills. That is all it needs to be.