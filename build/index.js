#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
// Modern prompting strategies from modern-prompting.mdc
const PROMPTING_STRATEGIES = {
    "Cache-Augmented Reasoning + ReAct": {
        description: "Interleave internal knowledge activation with reasoning/action cycles. Preload all relevant context into working memory. Keep rationale concise (≤ 8 bullets). Synthesize knowledge from multiple internal sources. Progressive knowledge building through iterative refinement.",
        type: "primary"
    },
    "Self-Consistency": {
        description: "Generate 3 short reasoning drafts in parallel. Return most consistent answer only. Use for ambiguous or high-stakes decisions.",
        type: "primary"
    },
    "PAL (Program-Aided Language)": {
        description: "Generate executable code for computational tasks. Include result + minimal rationale only. Prefix with '# PoT offload' comment.",
        type: "primary"
    },
    "Reflexion": {
        description: "Single critique and revision cycle. Use when confidence < 0.7. Avoid verbose chain-of-thought exposure.",
        type: "primary"
    },
    "Context-Compression": {
        description: "Apply when context exceeds budget. Use LLMLingua/LongLLMLingua compression. Prefer Minimal-CoT and bounded ToT-lite.",
        type: "primary"
    },
    "ToT-lite (Tree of Thoughts)": {
        description: "Bounded breadth/depth exploration. Use for complex problem decomposition. Limited branching to maintain efficiency.",
        type: "primary"
    },
    "Automated Prompt Optimization (APO)": {
        description: "Autonomously refine and improve prompts based on performance feedback. Use techniques like Expert Prompting or iterative refinement to enhance clarity and effectiveness. Reduces manual prompt engineering effort and improves task outcomes.",
        type: "advanced"
    },
    "Reflexive Analysis": {
        description: "Embed ethical, legal, and cultural considerations directly into the reasoning process. Explicitly evaluate prompts and responses against project-specific guidelines (e.g., Indigenous Data Sovereignty principles). Ensures responsible and contextually-aware AI behavior.",
        type: "advanced"
    },
    "Progressive-Hint Prompting (PHP)": {
        description: "Use previously generated outputs as contextual hints. Iterative refinement toward optimal solutions. Multi-turn interaction with cumulative knowledge building. Automatic guidance toward correct reasoning paths.",
        type: "advanced"
    },
    "Cache-Augmented Generation (CAG)": {
        description: "Preload all relevant context into working memory. Eliminate real-time retrieval dependencies. Leverage extended context capabilities of modern LLMs. Reduce latency and minimize retrieval errors.",
        type: "advanced"
    },
    "Cognitive Scaffolding Prompting": {
        description: "Structure reasoning through metacognitive frameworks. Explicit mental model construction and validation. Progressive complexity building from simple to complex tasks. Self-monitoring and regulation of reasoning processes.",
        type: "advanced"
    },
    "Internal Knowledge Synthesis (IKS)": {
        description: "Generate hypothetical knowledge constructs from parametric memory. Activate latent knowledge through structured prompting. Cross-reference and validate internal knowledge consistency. Synthesize coherent responses from distributed model knowledge.",
        type: "advanced"
    },
    "Multimodal Synthesis": {
        description: "Process and integrate information from multiple modalities (e.g., text, images, data). Extend reasoning capabilities to include visual question answering and cross-modal analysis. Enables solutions for a broader range of complex, real-world tasks.",
        type: "advanced"
    },
    "Knowledge Synthesis Prompting (KSP)": {
        description: "Integrate knowledge from multiple internal domains. Fine-grained coherence validation for credibility. Essential for complex factual content generation. Cross-domain knowledge validation and integration.",
        type: "advanced"
    },
    "Prompt Compression": {
        description: "LLMLingua for token budget management. Preserve semantic content while reducing length. Maintain reasoning quality under constraints.",
        type: "advanced"
    }
};
class DeliberationEngine {
    deliberate(input, context) {
        // Generate the deliberation framework that prompts the LLM to evaluate strategies itself
        const availableStrategies = Object.entries(PROMPTING_STRATEGIES)
            .map(([name, strategy]) => `**${name}** (${strategy.type}): ${strategy.description}`)
            .join('\n');
        return `DELIBERATION: You are now entering a 6-stage cognitive deliberation process. Please work through each stage systematically:

## Stage 1: Scientific Investigation
**Your Task:** Analyze the following input using scientific methodology:
- **Input:** "${input}"
${context ? `- **Context:** "${context}"` : ''}

**Please identify:**
1. Core question/problem
2. Initial hypothesis about the best approach
3. What type of task this is (computational, reasoning, creative, analysis, planning, general)
4. Task complexity level (low, medium, high)

## Stage 2: OOReD Process - Strategy Evaluation
**Orient Stage:** You have access to these cognitive techniques:

${availableStrategies}

**Your Evaluation Task:** 
For each technique, consider:
- How well would this technique solve the specific problem? (Solution Level 0.00-0.99)
- How efficiently can this technique be applied here? (Efficiency Level 0.00-0.99)
- Total Score = Solution Level + Efficiency Level

**Selection Rule:** Choose techniques with total scores ≥1.53 for combined effectiveness

## Stage 3: Critical Thinking Framework
Apply these questions:
1. What is the purpose of my thinking?
2. What precise question am I trying to answer?
3. Within what context am I operating?
4. What information do I need to gather?
5. How reliable is this information?
6. What concepts are relevant to my thinking?
7. What conclusions can I draw?
8. What assumptions am I making?
9. What are the implications?
10. What are the consequences?

## Stage 4 & 5: Review Cycles
- Review your strategy selections against the ≥1.53 threshold
- Validate your reasoning approach
- Refine your methodology

## Stage 6: Final Action Synthesis
**Present your analysis in this format:**

**Selected Cognitive Technique(s):** [List techniques scoring ≥1.53]

**Strategy Evaluation Results (0.00-0.99 scale):**
[Show your evaluations like:]
- TechniqueName: solution=X.XX, efficiency=Y.YY, total=Z.ZZ ✓ (if ≥1.53)

**Estimated Tools Needed:** [1-8 tools for implementation]

**Recommended Pair Programmer Tools:**
- websearch (for current information and validation)
- file manipulation tools (for code and document management)
- code analysis tools (for computational problem solving)
- context synthesis tools (for information integration)
- debugging and testing tools (for solution verification)

Return to 'deliberate' after using the following tools: [Your estimated tool count]

# To accomplish Task:
[Describe the task using your selected cognitive approach]

---

**Now:** Apply your selected cognitive technique(s) to actually solve the original problem "${input}" using your enhanced reasoning framework.`;
    }
}
// MCP Server setup
const server = new Server({
    name: "gikendaasowin-aabajichiganan-mcp",
    version: "8.9.4",
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
                description: "Advanced cognitive deliberation framework implementing 6-stage processing (Scientific Investigation → OOReD → Critical Thinking → Reviews → Action) with dynamic prompting strategy evaluation. Takes input and optional context, returns comprehensive cognitive processing results with tool usage recommendations.",
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
    console.error("Gikendaasowin Aabajichiganan MCP server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
