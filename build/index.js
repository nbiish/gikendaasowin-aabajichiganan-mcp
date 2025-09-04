#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
// Compressed cognitive strategies from modern-prompting research
const PROMPTING_STRATEGIES = {
    "Chain of Draft (CoD)": {
        description: "Concise reasoning drafts ≤5 words/step. Essential calculations only. Abstract verbose details."
    },
    "Cache-Augmented Reasoning + ReAct": {
        description: "Interleave knowledge activation with reasoning cycles. Keep rationale concise (≤8 bullets). Progressive knowledge building."
    },
    "Self-Consistency": {
        description: "Generate 3 reasoning drafts in parallel. Return most consistent answer for high-stakes decisions."
    },
    "PAL (Program-Aided Language)": {
        description: "Generate executable code for computational tasks. Include result + minimal rationale. Prefix '# PoT offload'."
    },
    "Reflexion": {
        description: "Single critique and revision cycle. Use when confidence < 0.7. Avoid verbose chain-of-thought exposure."
    },
    "Context-Compression": {
        description: "LLMLingua compression when context exceeds budget. Prefer Minimal-CoT and bounded ToT-lite."
    },
    "ToT-lite (Tree of Thoughts)": {
        description: "Bounded breadth/depth exploration. Limited branching for complex problem decomposition efficiency."
    },
    "Metacognitive Prompting (MP)": {
        description: "5-stage introspective reasoning: understand → judge → evaluate → decide → assess confidence. Human-like cognition."
    },
    "Automated Prompt Optimization (APO)": {
        description: "Autonomously refine prompts via performance feedback. Expert prompting + iterative refinement. Reduces manual effort."
    },
    "Reflexive Analysis": {
        description: "Embed ethical/legal/cultural considerations. Evaluate against project guidelines. Indigenous Data Sovereignty aware."
    },
    "Progressive-Hint Prompting (PHP)": {
        description: "Use previous outputs as contextual hints. Multi-turn interaction with cumulative knowledge building."
    },
    "Cache-Augmented Generation (CAG)": {
        description: "Preload relevant context into working memory. Eliminate real-time retrieval dependencies."
    },
    "Cognitive Scaffolding Prompting": {
        description: "Structure reasoning through metacognitive frameworks. Mental model construction + validation. Self-monitoring processes."
    },
    "Internal Knowledge Synthesis (IKS)": {
        description: "Generate hypothetical knowledge constructs from parametric memory. Cross-reference internal knowledge consistency."
    },
    "Multimodal Synthesis": {
        description: "Process text/images/data integration. Visual question answering + cross-modal analysis. Broader task solutions."
    },
    "Knowledge Synthesis Prompting (KSP)": {
        description: "Integrate multiple internal domains. Fine-grained coherence validation. Cross-domain knowledge integration."
    },
    "Prompt Compression": {
        description: "LLMLingua for token budget management. Preserve semantic content while reducing length constraints."
    }
};
class DeliberationEngine {
    deliberate(input, context) {
        // /// [6-stage self-prompting framework for LLMs with unified input]
        const strategiesList = Object.entries(PROMPTING_STRATEGIES)
            .map(([name, strategy]) => `**${name}:** ${strategy.description}`)
            .join('\n');
        return `You are now entering a 6-stage cognitive deliberation process. Please work through each stage systematically:

## Stage 1: Scientific Investigation
**Your Task:** Analyze the following prompt using scientific methodology:
- **Prompt:** "${input}"

**Please identify:**
1. Core question/problem
2. Initial hypothesis about the best approach
3. What type of task this is (computational, reasoning, creative, analysis, planning, general)
4. Task complexity level (low, medium, high)

## Stage 2: OOReD Process - Strategy Evaluation
**Orient Stage:** You have access to these cognitive techniques:

${strategiesList}

**Your Evaluation Task:** 
For each technique, consider:
- How well would this technique solve the specific problem? (Solution Level 0.00-0.99)
- How efficiently can this technique be applied here? (Efficiency Level 0.00-0.99)
- Total Score = Solution Level + Efficiency Level

**Selection Rule:** Choose techniques with total scores ≥1.53 for combined effectiveness

## Stage 3: Critical Thinking Framework
Apply rapid validation checks:
1. **Purpose:** What outcome am I optimizing for?
2. **Question:** What specific problem needs solving?
3. **Context:** What constraints or requirements apply?
4. **Evidence:** What facts do I need vs. what do I have?
5. **Reliability:** How confident am I in my information sources?
6. **Assumptions:** What am I taking for granted that could be wrong?
7. **Implications:** What happens if I'm right? What if I'm wrong?

## Stage 4 & 5: Review Cycles
- Review your strategy selections against the ≥1.53 threshold
- Validate your reasoning approach
- Refine your methodology

## Stage 6: Final Action Synthesis
**Present your analysis in this format:**

**DELIBERATION:** [Your thought process through stages 1-5]

**SELECTED TOOLS:** [List of tools you estimate are needed to accomplish the task]

**Strategy Evaluation Results (0.00-0.99 scale):**
[Show your evaluations like:]
- TechniqueName: solution=X.XX, efficiency=Y.YY, total=Z.ZZ ✓ (if ≥1.53)

**Selected Cognitive Technique(s):** [List techniques scoring ≥1.53]

**Estimated Tools Needed:** [1-8 tools for implementation]

---

**Now:** Apply your selected cognitive technique(s) to actually solve the original problem "${input}" using your enhanced reasoning framework.`;
    }
}
// MCP Server setup with 6-stage cognitive deliberation framework
const server = new Server({
    name: "gikendaasowin-aabajichiganan-mcp",
    version: "10.0.2", // /// [6-stage deliberation with 0.00-0.99 scoring system + prompt variable fix]
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
                description: "Advanced cognitive deliberation framework implementing 6-stage processing (Scientific Investigation → OOReD → Critical Thinking → Review → OOReD → Act) with dynamic prompting strategy evaluation. Takes a prompt combining the question/problem and any context, returns comprehensive cognitive processing results with tool usage recommendations.",
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
// Start the server with 6-stage cognitive deliberation framework
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Gikendaasowin Aabajichiganan MCP server running with 6-stage cognitive deliberation framework");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
