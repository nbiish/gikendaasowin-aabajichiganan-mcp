#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create the MCP server
const server = new McpServer({
	name: "gikendaasowin-aabajichiganan-mcp",
	// Version aligned with System Prompt v0.7.2
	version: "0.7.2",
	description: "ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Gikendaasowin Aabajichiganan - (Cognitive Tools v0.7.2): SOTA internal reasoning suite aligned with AI Pair Programmer Prompt v0.7.2. Enforces mandatory structured deliberation via `think` after explicit assessment (`assess_complexity...`). Includes meta-cognition (`gauge_confidence`), context synthesis, proactive planning, CoT, reflection, and tool awareness."
});

// --- Core Cognitive Deliberation Tools ---

server.tool(
	"think",
	// Main Description: Matches v0.7.2 prompt's emphasis on the central hub role.
	"MANDATORY Cognitive Hub for **Medium/High CUC-N** situations or inherently complex tasks (analysis, planning, refinement). Use for deep analysis, planning, verification, risk assessment, self-correction, and integrating outputs from other tools/actions. Logs detailed reasoning.",
	{
		// Parameter Description: Matches the mandatory structured sections required by prompt v0.7.2.
		thought: z.string().describe("Your **detailed** internal monologue. MUST explicitly analyze prior steps & generated text (CoT, Plan, Critique, Summary, Confidence Justification, etc.). Structure MANDATORY: ## Analysis, ## Plan, ## Verification, ## Anticipated Challenges Analysis & Contingency, ## Risk Assessment, ## Lookahead, ## Self-Correction & Learning.")
	},
	async ({ thought }) => {
		if (!thought || typeof thought !== 'string' || thought.trim().length === 0) { throw new Error('Invalid thought: Must be non-empty, structured reasoning.'); }
		console.error(`[CognitiveToolsServer v0.7.2] Think Tool Logged: ${thought.substring(0, 100)}...`);
		return { content: [{ type: "text" as const, text: `Deep Thought (structured analysis/plan/etc.) logged successfully.` }] };
	}
);

server.tool(
	"quick_think",
	// Main Description: Matches v0.7.2 prompt's strict conditions.
	"Cognitive Checkpoint ONLY for situations explicitly assessed as **strictly Low CUC-N AND simple task nature** (e.g., confirmation, acknowledgement). Use sparingly. Logs brief thought.",
	{
		// Parameter Description: Simple input for brief thoughts.
		brief_thought: z.string().describe("Your **concise** thought for strictly simple, low CUC-N situations confirmed by prior assessment (e.g., 'Acknowledged.', 'Proceeding as planned.', 'External tool call successful.').")
	},
	async ({ brief_thought }) => {
		if (!brief_thought || typeof brief_thought !== 'string' || brief_thought.trim().length === 0) { throw new Error('Invalid brief_thought: Must be non-empty.'); }
		console.error(`[CognitiveToolsServer v0.7.2] QuickThink Tool Logged: ${brief_thought.substring(0, 100)}...`);
		return { content: [{ type: "text" as const, text: `Quick Thought logged successfully.` }] };
	}
);

// --- Mandatory Meta-Cognitive & Context Management Tools ---

server.tool(
	"assess_complexity_and_select_thought_mode",
	// Main Description: Matches v0.7.2 prompt's mandatory first step.
	"**Mandatory Pre-Deliberation Assessment.** Must be called BEFORE every `think` or `quick_think`. Evaluates CUC-N, recommends strategy, commits to next thought mode.",
	{
		// Parameter Description: Matches the 4 required components from prompt v0.7.2.
		assessment_and_choice: z.string().describe("Input your assessment *before* calling. MUST include: 1) Situation/Next Step Description. 2) CUC-N Ratings: Complexity(L/M/H), Uncertainty(L/M/H), Consequence(L/M/H), Novelty(L/M/H). 3) Recommended Initial Strategy (e.g., 'Start `think` analysis'). 4) Explicit Mode Selection: 'Selected Mode: think' or 'Selected Mode: quick_think'.")
	},
	async ({ assessment_and_choice }) => {
		const requiredPhrases = ["Complexity", "Uncertainty", "Consequence", "Novelty", "Recommended Initial Strategy", "Selected Mode:"];
		const hasRequiredPhrases = requiredPhrases.every(phrase => assessment_and_choice.includes(phrase));
		const hasModeSelection = assessment_and_choice.includes("Selected Mode: think") || assessment_and_choice.includes("Selected Mode: quick_think");
		if (!assessment_and_choice || typeof assessment_and_choice !== 'string' || !hasRequiredPhrases || !hasModeSelection) { throw new Error('Invalid assessment: String must include CUC-N ratings, Recommended Initial Strategy, and explicit Selected Mode ("think" or "quick_think").'); }
		console.error(`[CognitiveToolsServer v0.7.2] AssessComplexity Tool Signaled: ${assessment_and_choice.substring(0, 150)}...`);
		const mode = assessment_and_choice.includes("Selected Mode: think") ? "think" : "quick_think";
		// Output confirms assessment passed validation and guides the immediate next step (think/quick_think call).
		return { content: [{ type: "text" as const, text: `Cognitive Assessment Completed. Proceeding with selected mode: ${mode}. Full Assessment: ${assessment_and_choice}` }] };
	}
);

server.tool(
	"synthesize_prior_reasoning",
	// Main Description: Aligned with prompt's goal of structured summary to feed into mandatory 'think'.
	"Context Management Tool. Guides internal generation of a **structured summary text** (focusing on **`Key Decisions Made`** and **`Open Questions/Uncertainties`**) for long reasoning chains. Output text MUST be analyzed via mandatory `think` immediately after.",
	{
		// Parameter Description: Reminds LLM of the required internal summary structure.
		context_to_summarize_description: z.string().describe("Describe the reasoning span being summarized. *You* (LLM) must now *internally generate the structured summary text* before calling. This signals the summary is ready for the mandatory post-assessment `think` analysis.")
	},
	async ({ context_to_summarize_description }) => {
		if (!context_to_summarize_description || typeof context_to_summarize_description !== 'string' || context_to_summarize_description.trim().length === 0) { throw new Error('Invalid context description: Must be non-empty.'); }
		console.error(`[CognitiveToolsServer v0.7.2] SynthesizeReasoning Tool Signaled for: ${context_to_summarize_description}...`);
		// Output implies structured summary is ready for analysis via the mandatory next assessment/think steps.
		return { content: [{ type: "text" as const, text: `Structured synthesis internally generated for context: '${context_to_summarize_description}'. Ready for mandatory post-assessment 'think' analysis.` }] };
	}
);

server.tool(
	"gauge_confidence",
	// Main Description: Aligned with prompt's active confidence management feeding into mandatory 'think'.
	"Meta-Cognitive Checkpoint. Guides internal stating of **confidence (High/Medium/Low) and justification**. Output MUST be analyzed in the mandatory `think` step immediately after; Low/Medium confidence requires specific action planning in that `think` step.",
	{
		// Parameter Description: Matches prompt requirements.
		assessment_and_confidence: z.string().describe("Input item being assessed. *Internally determine and state*: 1) Confidence Level (High/Medium/Low). 2) Justification. Call this tool *after* making the assessment.")
	},
	async ({ assessment_and_confidence }) => {
		const confidenceRegex = /Confidence Level: (High|Medium|Low)/i;
		if (!assessment_and_confidence || typeof assessment_and_confidence !== 'string' || !confidenceRegex.test(assessment_and_confidence)) { throw new Error('Invalid confidence assessment: String must include "Confidence Level: High/Medium/Low" and justification.'); }
		const match = assessment_and_confidence.match(confidenceRegex);
		const level = match ? match[1] : "Unknown";
		console.error(`[CognitiveToolsServer v0.7.2] GaugeConfidence Tool Signaled: Level ${level}`);
		// Output confirms level and prepares for mandatory analysis via assessment/think.
		return { content: [{ type: "text" as const, text: `Confidence Gauge Completed. Level: ${level}. Assessment Text: ${assessment_and_confidence}. Ready for mandatory post-assessment 'think' analysis (action required if Low/Medium).` }] };
	}
);

// --- Supporting Cognitive Strategy Tools (Trigger Mandatory 'Think' Analysis After) ---

server.tool(
	"plan_and_solve",
	// Main Description: Aligned with proactive planning including risks and tool awareness.
	"Guides internal generation of **structured plan text** (incl. **`Anticipated Challenges/Risks`** and potential **other tool needs**). Generated text MUST be analyzed via mandatory `think` immediately after.",
	{
		// Parameter Description: Reminds LLM of required internal generation content.
		task_objective: z.string().describe("Input the objective. *You* (LLM) must now *internally generate the structured plan text (incl. Risks/Challenges, potential tool needs)* before calling. Signals plan text is ready for mandatory post-assessment `think` analysis.")
	},
	async ({ task_objective }) => {
		if (!task_objective || typeof task_objective !== 'string' || task_objective.trim().length === 0) { throw new Error('Invalid task objective.'); }
		console.error(`[CognitiveToolsServer v0.7.2] PlanAndSolve Tool Signaled for: ${task_objective.substring(0, 100)}...`);
		// Output implies plan text *with risks and potential tool needs* is ready for mandatory analysis via assessment/think.
		return { content: [{ type: "text" as const, text: `Structured plan (incl. Risks/Challenges, potential tool needs) internally generated for objective: ${task_objective}. Ready for mandatory post-assessment 'think' analysis.` }] };
	}
);

server.tool(
	"chain_of_thought",
	// Main Description: Refined to explicitly mention potential for other tools within the reasoning.
	"Guides internal generation of **detailed, step-by-step reasoning text (CoT)**. CoT steps might identify needs for **other tools**. Generated CoT text MUST be analyzed via mandatory `think` immediately after.",
	{
		// Parameter Description: Explicitly guides internal generation to consider tool needs.
		problem_statement: z.string().describe("Input the specific problem requiring detailed CoT. *You* (LLM) must now *internally generate the full CoT text*, explicitly noting steps suggesting needs for other tools. Call this tool *after* generating the text.")
	},
	async ({ problem_statement }) => {
		if (!problem_statement || typeof problem_statement !== 'string' || problem_statement.trim().length === 0) { throw new Error('Invalid problem statement.'); }
		console.error(`[CognitiveToolsServer v0.7.2] ChainOfThought Tool Signaled for: ${problem_statement.substring(0, 100)}...`);
		// Output implies CoT text *potentially identifying tool needs* is ready for mandatory analysis via assessment/think.
		return { content: [{ type: "text" as const, text: `Detailed CoT (potentially identifying needs for other tools) internally generated for problem: ${problem_statement}. Ready for mandatory post-assessment 'think' analysis.` }] };
	}
);

server.tool(
	"chain_of_draft",
	// Main Description: Positions for efficient exploration, results analyzed by mandatory 'think'.
	"Guides internal generation of **concise, iterative reasoning draft texts** ('thought-sketches') for exploring options. Generated drafts MUST be analyzed comparatively via mandatory `think` immediately after.",
	{
		// Parameter Description: Instructs LLM on internal draft generation.
		problem_statement: z.string().describe("Input problem for exploration. *You* (LLM) must now *internally generate brief, iterative draft texts* before calling. Signals drafts are ready for mandatory post-assessment `think` analysis.")
	},
	async ({ problem_statement }) => {
		if (!problem_statement || typeof problem_statement !== 'string' || problem_statement.trim().length === 0) { throw new Error('Invalid problem statement.'); }
		console.error(`[CognitiveToolsServer v0.7.2] ChainOfDraft Tool Signaled for: ${problem_statement.substring(0, 100)}...`);
		// Output implies draft texts are ready for mandatory comparative analysis via assessment/think.
		return { content: [{ type: "text" as const, text: `Reasoning drafts internally generated for problem: ${problem_statement}. Ready for mandatory post-assessment 'think' analysis.` }] };
	}
);

server.tool(
	"reflection",
	// Main Description: Explicitly mentions taking prior text as input for critique, results analyzed by mandatory 'think'.
	"Guides internal critical self-evaluation on **previously generated text** (reasoning, plans, code concepts). Generated critique text MUST be analyzed via mandatory `think` immediately after.",
	{
		// Parameter Description: Input is the specific text to be critiqued internally.
		input_reasoning_or_plan: z.string().describe("Input the **exact text** to be critiqued. *You* (LLM) must now *internally generate a critique* identifying flaws/improvements. Call this tool *after* generating the critique.")
	},
	async ({ input_reasoning_or_plan }) => {
		if (!input_reasoning_or_plan || typeof input_reasoning_or_plan !== 'string' || input_reasoning_or_plan.trim().length === 0) { throw new Error('Invalid input reasoning/plan.'); }
		console.error(`[CognitiveToolsServer v0.7.2] Reflection Tool Signaled for analysis.`);
		// Output implies critique text is ready for mandatory analysis via assessment/think.
		return { content: [{ type: "text" as const, text: `Reflection critique internally generated for input text: '${input_reasoning_or_plan.substring(0, 100)}...'. Ready for mandatory post-assessment 'think' analysis.` }] };
	}
);

// --- Server Lifecycle and Error Handling ---

process.on('SIGINT', async () => {
	console.error('\n[CognitiveToolsServer v0.7.2] Received SIGINT, shutting down gracefully.');
	await server.close();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.error('\n[CognitiveToolsServer v0.7.2] Received SIGTERM, shutting down gracefully.');
	await server.close();
	process.exit(0);
});

process.on('uncaughtException', (error) => {
	console.error('[CognitiveToolsServer v0.7.2] FATAL: Uncaught Exception:', error);
	server.close().catch(err => console.error('[CognitiveToolsServer v0.7.2] Error during shutdown on uncaughtException:', err)).finally(() => {
		process.exit(1); // Exit on fatal error
	});
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('[CognitiveToolsServer v0.7.2] FATAL: Unhandled Promise Rejection:', reason);
	server.close().catch(err => console.error('[CognitiveToolsServer v0.7.2] Error during shutdown on unhandledRejection:', err)).finally(() => {
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