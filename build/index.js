#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { fileURLToPath } from 'url';
// Comprehensive cognitive strategies from modern-prompting research (2026 Standards)
export const PROMPTING_STRATEGIES = {
    // Strategies 1-5
    "Cache-Augmented ReAct (CAR-ReAct)": {
        description: "Integrated 'Architectural Caching' where the ReAct loop operates atop a frozen, cached foundation of tools and protocols (Tier 1). Dynamic reasoning (Tier 2) references static knowledge without re-retrieval. Maximizes cache hit rates (>90%) and reduces latency.",
        protocol: "Treat context as tiered: Tier 1 (Static/Frozen) for rules/tools, Tier 2 (Dynamic) for conversation. DO NOT re-output Tier 1 content."
    },
    "Adaptive Reasoning Consensus (ARC)": {
        description: "Evaluates the *quality* and *pattern* of the reasoning path, not just final answer voting. Generates 3-7 parallel traces using diverse methodologies (e.g., first-principles vs. precedent) and aggregates based on logical coherence.",
        protocol: "1. Generate 3 diverse reasoning traces. 2. Evaluate coherence of each trace. 3. Weighted aggregation of the best traces."
    },
    "Substrate-Native Execution (SNE)": {
        description: "Universal Execution Delegation. Offloads *any* precise task to its native substrate (Code, SQL, API) rather than simulating it. Mandates generation of executable payloads.",
        protocol: "Identify precise subtasks (Math, Data). Delegate to native runtime (Python, SQL). DO NOT simulate execution."
    },
    "Recursive Contextual Audit (RCA)": {
        description: "Continuous integrity check against the *entire* cached context. Explicitly maps failures to deviations from Tier 1 knowledge base protocols and generates a 'Correction Vector' to prevent recurrence.",
        protocol: "On failure: 1. Map error to Tier 1 deviation. 2. Generate Correction Vector. 3. Re-attempt with constraint."
    },
    "Semantic Information Density (SID)": {
        description: "Optimizes for information entropy. Uses dynamic context assembly (CUC-N score) and Lingua-Native compression (XML/JSON) to maximize knowledge density per token.",
        protocol: "Assess CUC-N score. If high, load full context. Use XML/JSON for data structures. Summarize Tier 2 only."
    },
    // Strategies 6-10
    "Reflexion (Single-Shot)": {
        description: "Single-shot recursive critique pattern implementing a 'Draft → Reflect → Refine' loop within a single inference pass. Uses uncertainty thresholds (UTD) to trigger deep reflection only when necessary.",
        protocol: `<reflexion_protocol>
1. **DRAFT:** Generate initial solution path.
2. **REFLECTION:** Critically evaluate DRAFT against constraints (Logic, Safety, Assumptions).
3. **REFINEMENT:** Generate FINAL output incorporating fixes.
*Trigger Rule:* If Confidence > 0.9, skip DRAFT/REFLECTION and output FINAL directly.
</reflexion_protocol>`
    },
    "ToT-lite (Tree of Thoughts)": {
        description: "Bounded parallel exploration strategy generating 2-3 distinct reasoning paths (branches) within a single context window. Forces explicit comparative evaluation before converging.",
        protocol: `<tot_lite_protocol>
1. **BRANCHING:** Propose 3 distinct approaches (Idea A, B, C).
2. **EVALUATION:** Assess each for Feasibility, Risk, Efficiency.
3. **SELECTION:** Select the single best approach.
4. **CONVERGENCE:** Develop selected Idea into final solution.
</tot_lite_protocol>`
    },
    "Metacognitive Prompting (MP)": {
        description: "Systematic 'Plan-Monitor-Evaluate' cognitive architecture. Forces explicit definition of success criteria, inserts real-time coherence checks, and mandates final self-graded evaluation.",
        protocol: `<metacognitive_protocol>
1. **PLAN:** Restate goal, define success criteria.
2. **MONITOR:** Execute with checkpoints ("Am I aligned?").
3. **EVALUATE:** Final review against success criteria.
</metacognitive_protocol>`
    },
    "Automated Prompt Optimization (APO)": {
        description: "Closed-loop recursive instruction tuning. Dynamically analyzes task performance to refine prompt constraints. Evolved based on error analysis.",
        protocol: `<apo_protocol>
*System Meta-Instruction:*
"Analyze request type. If history of errors, inject specific constraints. Log 'Prompt-Outcome Pair' for future optimization."
</apo_protocol>`
    },
    // Strategies 11-15
    "Progressive-Hint Prompting (PHP-v2)": {
        description: "Iterative refinement protocol coupling Complex CoT with stability-based stopping. Uses compressed rationale hints and delta-updates.",
        protocol: "1. Question + Previous Hint. 2. Refine answer. 3. Stop if answer stabilizes."
    },
    "Cache-Augmented Generation (CAG-v2)": {
        description: "Hierarchical Semantic Caching managing Prompt, Sub-reasoning, and Retrieval layers. Uses embedding-based keys and Session/Global separation.",
        protocol: "Check Global Cache -> Check Session Cache -> Compute -> Update Caches."
    },
    "Cognitive Scaffolding Prompting (CSP-v2)": {
        description: "Deploys Task-Method-Knowledge (TMK) symbolic structures and Meta-Prompting. Defines Goal-Subtask-State architectures.",
        protocol: "Define [Task Goal]. Break into [Subtasks] with [Methods]. Maintain [State Table]."
    },
    "Internal Knowledge Synthesis (IKS-v2)": {
        description: "Two-Stage 'Build-then-Answer' protocol. Constructs verifiable Source-Tagged Knowledge Brief before reasoning.",
        protocol: "1. Build Source-Tagged Knowledge Brief (Certain/Uncertain). 2. Answer strictly from Brief."
    },
    "Multimodal Synthesis (V-CoT)": {
        description: "Visual Chain-of-Thought with explicit Intermediate Visual Artifacts (bounding boxes, scene graphs).",
        protocol: "1. Describe layout (Scene Graph). 2. Answer based on structural understanding."
    }
};
export class DeliberationEngine {
    deliberate(input, context) {
        // /// [6-stage self-prompting framework with OOReDAct integration and modern prompting strategies]
        const strategiesList = Object.entries(PROMPTING_STRATEGIES)
            .map(([name, strategy]) => `**${name}:**\n${strategy.description}\n*Protocol:*\n${strategy.protocol}`)
            .join('\n\n');
        return `You are now entering a 6-stage cognitive deliberation process with OOReDAct framework integration. Please work through each stage systematically:

## Stage 1: Scientific Investigation
**Your Task:** Analyze the following prompt using scientific methodology:
- **Prompt:** "${input}"
${context ? `- **Context:** "${context}"` : ''}

**Please identify:**
1. Core question/problem
2. Initial hypothesis about the best approach
3. What type of task this is (computational, reasoning, creative, analysis, planning, general)
4. Task complexity level (low, medium, high)
5. Required cognitive frameworks (CUC-N: Complexity, Uncertainty, Consequence, Novelty assessment)

## Stage 2: OOReDAct Process - Strategy Evaluation

### Observe
Synthesize the facts and observations from the input:
- What factual information is available?
- What patterns or relationships are evident?
- What constraints or requirements are present?

### Orient
Understand the knowledge and context:
- What domain knowledge is required?
- What are the contextual factors?
- What resources and tools are available?

### Reason (Strategy Selection)
You have access to these cognitive techniques:

${strategiesList}

**Your Evaluation Task:** 
For each technique, consider:
- How well would this technique solve the specific problem? (Solution Level 0.00-0.99)
- How efficiently can this technique be applied here? (Efficiency Level 0.00-0.99)
- Total Score = Solution Level + Efficiency Level

**Selection Rule:** Choose techniques with total scores ≥1.53 for combined effectiveness

### Decide
State your selected strategies and approach based on the evaluation.

### Act-Plan
Plan the implementation steps for your selected cognitive techniques.

## Stage 3: Critical Thinking Framework
Apply rapid validation checks:
1. **Purpose:** What outcome am I optimizing for?
2. **Question:** What specific problem needs solving?
3. **Context:** What constraints or requirements apply?
4. **Evidence:** What facts do I need vs. what do I have?
5. **Reliability:** How confident am I in my information sources?
6. **Assumptions:** What am I taking for granted that could be wrong?
7. **Implications:** What happens if I'm right? What if I'm wrong?
8. **Ethical/Cultural:** Are there ethical, legal, or cultural considerations?

## Stage 4 & 5: Review Cycles
- Review your strategy selections against the ≥1.53 threshold
- Validate your reasoning approach using consistency checks
- Apply confidence calibration (0.0-1.0 scale)
- Refine your methodology based on metacognitive assessment

## Stage 6: Final Action Synthesis
**Present your analysis in this structured format:**

### DELIBERATION SUMMARY
[Your thought process through stages 1-5, including OOReDAct analysis]

### STRATEGY EVALUATION RESULTS
**Evaluation Scale (0.00-0.99):**
[Show your evaluations like:]
- TechniqueName: solution=X.XX, efficiency=Y.YY, total=Z.ZZ ✓ (if ≥1.53)

### SELECTED COGNITIVE TECHNIQUES
[List techniques scoring ≥1.53 with rationale]

### CONFIDENCE ASSESSMENT
[Rate confidence 0.0-1.0 with justification]

### IMPLEMENTATION PLAN
[Structured approach using selected techniques and their specific protocols]

### ESTIMATED TOOLS NEEDED
[1-8 tools for implementation with specific purposes]

---

**FINAL EXECUTION:** Apply your selected cognitive technique(s) to solve the original problem "${input}" using your enhanced reasoning framework and modern prompting strategies.
Ensure you FOLLOW the protocols defined for each selected strategy.

**Memory Integration:** Use Cache-Augmented Generation principles to maintain context coherence throughout the reasoning process.

**Quality Assurance:** Apply Reflexive Analysis to ensure ethical, cultural, and technical considerations are properly addressed.`;
    }
}
// MCP Server setup with comprehensive 6-stage cognitive deliberation framework and modern prompting strategies
const server = new Server({
    name: "gikendaasowin-aabajichiganan-mcp",
    version: "11.1.0", // Updated version for Strategy 1-15 implementation
}, {
    capabilities: {
        tools: {},
    },
});
const deliberationEngine = new DeliberationEngine();
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "deliberate",
                description: "Advanced cognitive deliberation framework implementing 6-stage processing with comprehensive modern prompting strategies (1-15). Features OOReDAct integration, specific execution protocols for each strategy (including Reflexion, ToT-lite, Metacognitive, etc.), and ethical analysis (IDS/CARE).",
                inputSchema: {
                    type: "object",
                    properties: {
                        input: {
                            type: "string",
                            description: "The primary input, question, problem, or task requiring cognitive deliberation",
                        },
                        context: {
                            type: "string",
                            description: "Optional additional context, background information, or constraints",
                        },
                    },
                    required: ["input"],
                },
            },
        ],
    };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === "deliberate") {
        const { input, context } = args;
        if (!input || typeof input !== "string") {
            throw new Error("Input is required and must be a string");
        }
        try {
            const result = deliberationEngine.deliberate(input, context);
            return {
                content: [
                    {
                        type: "text",
                        text: result,
                    },
                ],
            };
        }
        catch (error) {
            throw new Error(`Deliberation failed: ${error}`);
        }
    }
    throw new Error(`Unknown tool: ${name}`);
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Gikendaasowin Aabajichiganan MCP server running with Strategies 1-15 implemented.");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
        console.error("Fatal error in main():", error);
        process.exit(1);
    });
}
