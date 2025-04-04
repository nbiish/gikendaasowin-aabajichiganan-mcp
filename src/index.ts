#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create the MCP server
const server = new McpServer({
	name: "gikendaasowin-aabajichiganan-mcp",
	// Version reflects refined tool integration guidance
	version: "0.7.3",
	description: "ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Gikendaasowin Aabajichiganan - (Cognitive Tools v0.7.3): SOTA internal reasoning suite aligned with AI Pair Programmer Prompt v0.7.2. Enforces mandatory structured deliberation via `think` after explicit assessment. Includes meta-cognition, context synthesis, proactive planning, CoT, reflection, and tool awareness."
});

// --- Core Cognitive Deliberation Tools ---

server.tool(
	"think",
	// Main Description: For High Cognitive Load situations.
	"MANDATORY Cognitive Hub for **High/Medium Complexity, Uncertainty, Consequence, or Novelty (CUC-N)** situations. Use for deep analysis, planning, verification, risk assessment, self-correction, and integrating complex outputs (CoT, Plans, Critiques, Syntheses, Confidence Gauges). Logs detailed reasoning.",
	{
		// Parameter Description: Must analyze inputs including novel tool outputs.
		thought: z.string().describe("Your **detailed** internal monologue for complex situations, triggered after CUC-N assessment indicates 'think' mode. MUST explicitly analyze prior steps & generated text (e.g., CoT text, Plan text including Anticipated Challenges, Reflection critique text, Synthesized summary text, Confidence justification text). Structure MANDATORY: ## Analysis, ## Plan, ## Verification, ## Anticipated Challenges Analysis & Contingency, ## Risk Assessment, ## Lookahead, ## Self-Correction & Learning.")
	},
	async ({ thought }) => {
		if (!thought || typeof thought !== 'string' || thought.trim().length === 0) { throw new Error('Invalid thought: Must be non-empty, structured reasoning.'); }
		console.error(`[CognitiveToolsServer v0.7.3] Think Tool Logged: ${thought.substring(0, 100)}...`);
		// Output confirms deep thought logged, ready for next assessment or action.
		return { content: [{ type: "text" as const, text: `Deep Thought (structured analysis/plan/etc.) logged successfully.` }] };
	}
);

server.tool(
	"quick_think",
	// Main Description: For Low Cognitive Load situations. Explicitly contrasted with 'think'.
	"Cognitive Checkpoint ONLY for situations explicitly assessed as **strictly Low CUC-N AND simple task nature** (e.g., confirmation, acknowledgement). Logs brief thought. **DO NOT USE** for analysis, planning, or after other cognitive tools.",
	{
		// Parameter Description: Simpler input for brief thoughts.
		brief_thought: z.string().describe("Your **concise** thought for strictly simple, low CUC-N situations (e.g., 'Acknowledged user input.', 'Proceeding with confirmed step 3.', 'Code execution successful.').")
	},
	async ({ brief_thought }) => {
		if (!brief_thought || typeof brief_thought !== 'string' || brief_thought.trim().length === 0) { throw new Error('Invalid brief_thought: Must be non-empty.'); }
		console.error(`[CognitiveToolsServer v0.7.3] QuickThink Tool Logged: ${brief_thought.substring(0, 100)}...`);
		// Output confirms brief thought logged.
		return { content: [{ type: "text" as const, text: `Quick Thought logged successfully.` }] };
	}
);

// --- Novel Meta-Cognitive & Context Management Tools ---

server.tool(
	"assess_cuc_n",
	// Main Description: Forces explicit decision between think/quick_think.
	"**Mandatory Pre-Cognitive Assessment.** Must be called BEFORE every `think` or `quick_think`. Guides the LLM to explicitly evaluate CUC-N, recommend an initial strategy, and commit to the next thought mode (`think` or `quick_think`).",
	{
		// Parameter Description: LLM provides its assessment and chosen mode.
		assessment_and_choice: z.string().describe("Input your assessment *before* calling. MUST include: 1) Situation/Next Step Description. 2) CUC-N Ratings: Complexity(L/M/H), Uncertainty(L/M/H), Consequence(L/M/H), Novelty(L/M/H). 3) Recommended Initial Strategy (e.g., 'Start `think` analysis', 'Use `plan_and_solve`'). 4) Explicit Mode Selection: 'Selected Mode: think' or 'Selected Mode: quick_think'.")
	},
	async ({ assessment_and_choice }) => {
		// Enhanced validation to check for key phrases expected from the prompt's instructions
		const requiredPhrases = ["Complexity", "Uncertainty", "Consequence", "Novelty", "Recommended Initial Strategy", "Selected Mode:"];
		const hasRequiredPhrases = requiredPhrases.every(phrase => assessment_and_choice.includes(phrase));
		const hasModeSelection = assessment_and_choice.includes("Selected Mode: think") || assessment_and_choice.includes("Selected Mode: quick_think");

		if (!assessment_and_choice || typeof assessment_and_choice !== 'string' || !hasRequiredPhrases || !hasModeSelection) {
			throw new Error('Invalid assessment: String must include CUC-N ratings, Recommended Initial Strategy, and explicit Selected Mode ("think" or "quick_think").');
		}
		console.error(`[CognitiveToolsServer v0.7.3] AssessComplexity Tool Signaled: ${assessment_and_choice.substring(0, 150)}...`);
		const mode = assessment_and_choice.includes("Selected Mode: think") ? "think" : "quick_think";
		// Output confirms the assessment was made and guides the next step.
		return { content: [{ type: "text" as const, text: `Cognitive Assessment Completed. Proceeding with selected mode: ${mode}. Full Assessment: ${assessment_and_choice}` }] };
	}
);

server.tool(
	"synthesize_prior_reasoning",
	// Main Description: Manages context window and focuses reasoning.
	"Context Management Tool. Guides the LLM to **internally generate a structured summary text** of preceding lengthy reasoning, focusing on **`Key Decisions Made`** and **`Open Questions/Uncertainties`**. Used to manage context and refocus attention.",
	{
		// Parameter Description: Reminds LLM of the required internal summary structure.
		context_to_summarize_description: z.string().describe("Describe the reasoning span being summarized. *You* (LLM) must now *internally generate the structured summary text (including Key Decisions, Open Questions)* before calling. This signals the summary is ready for `think` analysis.")
	},
	async ({ context_to_summarize_description }) => {
		if (!context_to_summarize_description || typeof context_to_summarize_description !== 'string' || context_to_summarize_description.trim().length === 0) { throw new Error('Invalid context description: Must be non-empty.'); }
		console.error(`[CognitiveToolsServer v0.7.3] SynthesizeReasoning Tool Signaled for: ${context_to_summarize_description}...`);
		// Output implies structured summary is ready for analysis.
		return { content: [{ type: "text" as const, text: `Structured synthesis internally generated for context: '${context_to_summarize_description}'. Ready for detailed analysis in next 'think' step.` }] };
	}
);

server.tool(
	"gauge_confidence",
	// Main Description: Explicit meta-cognition about certainty.
	"Meta-Cognitive Checkpoint. Guides the LLM to explicitly **state confidence (High/Medium/Low) and justification** regarding a specific item (plan, conclusion, action). Output MUST be analyzed in next `think` step; Low/Medium confidence requires specific action.",
	{
		// Parameter Description: Matches prompt requirements.
		assessment_and_confidence: z.string().describe("Input the item being assessed (e.g., 'Confidence in proposed refactoring plan'). Then *internally determine and state*: 1) Confidence Level (High/Medium/Low). 2) Justification for this level. Call this tool *after* making the assessment.")
	},
	async ({ assessment_and_confidence }) => {
		const confidenceRegex = /Confidence Level: (High|Medium|Low)/i;
		if (!assessment_and_confidence || typeof assessment_and_confidence !== 'string' || !confidenceRegex.test(assessment_and_confidence)) {
			throw new Error('Invalid confidence assessment: String must include "Confidence Level: High/Medium/Low" and justification.');
		}
		const match = assessment_and_confidence.match(confidenceRegex);
		const level = match ? match[1] : "Unknown";
		console.error(`[CognitiveToolsServer v0.7.3] GaugeConfidence Tool Signaled: Level ${level}`);
		// Output confirms level and prepares for analysis.
		return { content: [{ type: "text" as const, text: `Confidence Gauge Completed. Level: ${level}. Assessment Text: ${assessment_and_confidence}. Ready for mandatory 'think' analysis (action required if Low/Medium).` }] };
	}
);

// --- Supporting Cognitive Strategy Tools ---

server.tool(
	"plan_and_solve",
	// Main Description: Emphasizes plan text structure and potential for other tools.
	"Guides the LLM to **internally generate structured plan text**, including **`Anticipated Challenges/Risks`**. The plan steps might logically suggest the need for other tools (known or discovered). The generated plan text MUST be validated/detailed via `think`.",
	{
		// Parameter Description: Reminds LLM of required internal generation content and openness.
		task_objective: z.string().describe("Input the objective. *You* (LLM) must now *internally generate the structured plan text, including Anticipated Challenges/Risks, and noting steps where other tools might be applicable,* before calling. Signals plan text is ready for `think` analysis.")
	},
	async ({ task_objective }) => {
		if (!task_objective || typeof task_objective !== 'string' || task_objective.trim().length === 0) { throw new Error('Invalid task objective.'); }
		console.error(`[CognitiveToolsServer v0.7.3] PlanAndSolve Tool Signaled for: ${task_objective.substring(0, 100)}...`);
		// Output implies plan text *with risks and potential tool needs* is ready.
		return { content: [{ type: "text" as const, text: `Structured plan (incl. Risks/Challenges, potential tool needs) internally generated for objective: ${task_objective}. Ready for mandatory 'think' analysis.` }] };
	}
);

server.tool(
	"chain_of_thought",
	// Main Description: Refined to explicitly mention potential for other tools within the reasoning.
	"Guides the LLM to **internally generate detailed, step-by-step reasoning text (CoT)**. Steps within the CoT might logically identify points requiring external data, computation, code execution, or checks for other available tools. The generated CoT text MUST be analyzed via `think`.",
	{
		// Parameter Description: Explicitly guides internal generation to consider tool needs.
		problem_statement: z.string().describe("Input the specific problem requiring detailed CoT. *You* (LLM) must now *internally generate the full CoT text*, structuring it clearly and explicitly noting any steps where other tools (e.g., code execution, file access, web search, list_tools) might be needed *after* this CoT is analyzed. Call this tool *after* generating the text.")
	},
	// Implementation: Signals CoT was performed and is ready for analysis.
	async ({ problem_statement }) => {
		if (!problem_statement || typeof problem_statement !== 'string' || problem_statement.trim().length === 0) { throw new Error('Invalid problem statement.'); }
		console.error(`[CognitiveToolsServer v0.7.3] ChainOfThought Tool Signaled for: ${problem_statement.substring(0, 100)}...`);
		// Output implies CoT text *potentially identifying tool needs* is ready for analysis.
		return { content: [{ type: "text" as const, text: `Detailed CoT (potentially identifying needs for other tools) internally generated for problem: ${problem_statement}. Ready for mandatory 'think' analysis.` }] };
	}
);

server.tool(
	"chain_of_draft",
	// Main Description: Positions for efficient exploration, results analyzed by 'think'.
	"Guides the LLM to **internally generate concise, iterative reasoning draft texts** ('thought-sketches'). Useful for efficiently exploring multiple solution paths or brainstorming hypotheses. Drafts MUST be analyzed comparatively via `think`.",
	{
		// Parameter Description: Instructs LLM on internal draft generation.
		problem_statement: z.string().describe("Input the problem or question for exploration. *You* (LLM) must now *internally generate brief, iterative draft texts* (e.g., key steps, pros/cons) for potential approaches before calling this tool. Signals drafts are ready for `think` analysis.")
	},
	// Implementation: Signals Drafting was performed.
	async ({ problem_statement }) => {
		if (!problem_statement || typeof problem_statement !== 'string' || problem_statement.trim().length === 0) { throw new Error('Invalid problem statement.'); }
		console.error(`[CognitiveToolsServer v0.7.3] ChainOfDraft Tool Signaled for: ${problem_statement.substring(0, 100)}...`);
		// Output implies draft texts are ready for comparative analysis.
		return { content: [{ type: "text" as const, text: `Reasoning drafts internally generated for problem: ${problem_statement}. Ready for mandatory 'think' analysis.` }] };
	}
);

server.tool(
	"reflection",
	// Main Description: Explicitly mentions taking prior text as input for critique, results analyzed by 'think'.
	"Guides the LLM to perform critical self-evaluation on **previously generated text** (reasoning, plans, code concepts). Essential for iterative refinement and improving accuracy. The *generated critique text* MUST be analyzed via `think`.",
	{
		// Parameter Description: Input is the specific text to be critiqued internally.
		input_reasoning_or_plan: z.string().describe("Input the **exact text** (e.g., from a prior `think` log, or internally generated plan/CoT/code concept) that *you* (the LLM) must now *internally generate a critique for*. Your critique should identify flaws and suggest improvements. Call this tool *after* generating the critique.")
	},
	// Implementation: Signals Reflection was performed.
	async ({ input_reasoning_or_plan }) => {
		if (!input_reasoning_or_plan || typeof input_reasoning_or_plan !== 'string' || input_reasoning_or_plan.trim().length === 0) { throw new Error('Invalid input reasoning/plan.'); }
		console.error(`[CognitiveToolsServer v0.7.3] Reflection Tool Signaled for analysis.`);
		// Output implies critique text is ready for analysis.
		return { content: [{ type: "text" as const, text: `Reflection critique internally generated for input text: '${input_reasoning_or_plan.substring(0, 100)}...'. Ready for mandatory 'think' analysis.` }] };
	}
);


// --- Server Lifecycle and Error Handling ---

process.on('SIGINT', async () => {
	console.error('\n[CognitiveToolsServer v0.7.3] Received SIGINT, shutting down gracefully.');
	await server.close();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.error('\n[CognitiveToolsServer v0.7.3] Received SIGTERM, shutting down gracefully.');
	await server.close();
	process.exit(0);
});

process.on('uncaughtException', (error) => {
	console.error('[CognitiveToolsServer v0.7.3] FATAL: Uncaught Exception:', error);
	// Attempt graceful shutdown, but prioritize process exit
	server.close().catch(err => console.error('[CognitiveToolsServer v0.7.3] Error during shutdown on uncaughtException:', err)).finally(() => {
		process.exit(1); // Exit on fatal error
	});
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('[CognitiveToolsServer v0.7.3] FATAL: Unhandled Promise Rejection:', reason);
	// Attempt graceful shutdown, but prioritize process exit
	server.close().catch(err => console.error('[CognitiveToolsServer v0.7.3] Error during shutdown on unhandledRejection:', err)).finally(() => {
		process.exit(1); // Exit on fatal error
	});
});

// Start the server
async function main() {
	try {
		const transport = new StdioServerTransport();
		await server.connect(transport);
		console.error('ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Gikendaasowin Aabajichiganan - (Cognitive Tools v0.7.2) MCP Server running on stdio');
	}
	catch (error) {
		console.error('[CognitiveToolsServer v0.7.2] Fatal error during startup:', error);
		process.exit(1);
	}
}

// Execute the main function to start the server
main();