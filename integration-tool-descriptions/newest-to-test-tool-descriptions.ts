#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create the MCP server
const server = new McpServer({
	name: "gikendaasowin-aabajichiganan",
	// Version reflects novel tools and enhanced guidance
	version: "0.6.1",
	description: "ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Gikendaasowin Aabajichiganan - (Cognitive Tools v0.6.1): SOTA internal reasoning suite for LLM agents. Features advanced deliberation (`think`), rapid checks (`quick_think`), explicit complexity assessment, context synthesis (`synthesize`), confidence gauging, planning, CoT, and reflection. Designed to maximize reliability, traceability, and performance on complex cognitive tasks, pushing beyond current research."
});

// --- Core Cognitive Deliberation Tools ---

server.tool(
	"think",
	// Main Description: For High Cognitive Load situations.
	"MANDATORY Cognitive Hub for **High Complexity/Uncertainty/Consequence/Novelty**. Use for deep analysis, planning, verification, risk assessment, self-correction, and integrating complex outputs (CoT, Plans, Critiques, Syntheses, Low Confidence Gauges). Logs detailed reasoning.",
	{
		// Parameter Description: Must analyze inputs including novel tool outputs.
		thought: z.string().describe("Your **detailed** internal monologue for complex situations. MUST explicitly analyze prior steps/generated text (CoT, Plans, Critiques, Synthesized summaries, Confidence justifications). Structure: ## Analysis, ## Plan, ## Verification, ## Risk Assessment, ## Self-Correction. Ensure depth and clear linkage.")
	},
	async ({ thought }) => {
		if (!thought || typeof thought !== 'string' || thought.trim().length === 0) { throw new Error('Invalid thought: Must be non-empty.'); }
		console.error(`[CognitiveToolsServer] Think Tool Logged: ${thought.substring(0, 100)}...`);
		return { content: [{ type: "text" as const, text: `Deep Thought Logged: ${thought}` }] };
	}
);

server.tool(
	"quick_think",
	// Main Description: For Low Cognitive Load situations. Explicitly contrasted with 'think'.
	"Cognitive Checkpoint for **Low Complexity/Uncertainty/Consequence**. Use ONLY for simple confirmations, acknowledgements, minor step decisions, or sanity checks where deep analysis is clearly unnecessary. Logs brief thought.",
	{
		brief_thought: z.string().describe("Your **concise** thought for simple situations (e.g., 'Acknowledged.', 'Proceeding with planned step X.', 'API call successful, extracting data.'). DO NOT use for analyzing complex outputs or making significant plans.")
	},
	async ({ brief_thought }) => {
		if (!brief_thought || typeof brief_thought !== 'string' || brief_thought.trim().length === 0) { throw new Error('Invalid brief_thought: Must be non-empty.'); }
		console.error(`[CognitiveToolsServer] QuickThink Tool Logged: ${brief_thought.substring(0, 100)}...`);
		return { content: [{ type: "text" as const, text: `Quick Thought Logged: ${brief_thought}` }] };
	}
);

// --- Novel Meta-Cognitive & Context Management Tools ---

server.tool(
	"assess_cuc_n_mode",
	// Main Description: Forces explicit decision between think/quick_think.
	"**Mandatory Pre-Thought Assessment.** Guides the LLM to explicitly evaluate the upcoming cognitive step's complexity, uncertainty, consequence, and novelty, and *commit* to using either `think` or `quick_think` next. Enhances deliberate cognitive resource allocation.",
	{
		// Parameter Description: LLM provides its assessment and chosen mode.
		assessment_and_choice: z.string().describe("Input your assessment: 1) Briefly describe the situation/next step. 2) Rate Complexity (Low/Med/High), Uncertainty (L/M/H), Consequence (L/M/H), Novelty (L/M/H). 3) State your choice: 'Selected Mode: think' or 'Selected Mode: quick_think'. *You* (LLM) make this assessment *before* calling.")
	},
	async ({ assessment_and_choice }) => {
		if (!assessment_and_choice || typeof assessment_and_choice !== 'string' || (!assessment_and_choice.includes("Selected Mode: think") && !assessment_and_choice.includes("Selected Mode: quick_think"))) {
			throw new Error('Invalid assessment: Must include complexity/uncertainty/consequence/novelty ratings and explicit mode selection ("Selected Mode: think" or "Selected Mode: quick_think").');
		}
		console.error(`[CognitiveToolsServer] AssessComplexity Tool Signaled: ${assessment_and_choice.substring(0, 150)}...`);
		// Output confirms the assessment was made and which mode was selected.
		const mode = assessment_and_choice.includes("Selected Mode: think") ? "think" : "quick_think";
		return { content: [{ type: "text" as const, text: `Complexity Assessment Completed. Selected Next Mode: ${mode}. Assessment: ${assessment_and_choice}` }] };
	}
);

server.tool(
	"synthesize_prior_reasoning",
	// Main Description: Manages context window and focuses reasoning.
	"Context Management Tool. Guides the LLM to **generate a concise summary text** of preceding lengthy reasoning chains (multiple `think` logs, CoT outputs). Used to manage context limits and refocus attention before major subsequent `think` steps.",
	{
		// Parameter Description: LLM generates the summary internally first.
		context_to_summarize_description: z.string().describe("Briefly describe the span of reasoning you are summarizing (e.g., 'Summary of planning phase', 'Key takeaways from debugging CoT'). *You* (LLM) must now *internally generate the concise summary text* before calling this tool. This signals the summary is ready.")
	},
	async ({ context_to_summarize_description }) => {
		if (!context_to_summarize_description || typeof context_to_summarize_description !== 'string' || context_to_summarize_description.trim().length === 0) { throw new Error('Invalid context description: Must be non-empty.'); }
		console.error(`[CognitiveToolsServer] SynthesizeReasoning Tool Signaled for: ${context_to_summarize_description}...`);
		// Output confirms context and implies summary text is available internally
		return { content: [{ type: "text" as const, text: `Synthesis internally generated for context: '${context_to_summarize_description}'. Ready for 'think' analysis.` }] };
	}
);

server.tool(
	"gauge_confidence",
	// Main Description: Explicit meta-cognition about certainty.
	"Meta-Cognitive Checkpoint. Guides the LLM to explicitly **state its confidence level (High/Medium/Low) and justification** regarding a specific plan, analysis, conclusion, or proposed action *before* proceeding. Low confidence may trigger Reflection or deeper Thinking.",
	{
		// Parameter Description: LLM provides its confidence assessment.
		assessment_and_confidence: z.string().describe("Input the item being assessed (e.g., 'Confidence in current plan', 'Confidence in generated code correctness'). Then state: 1) Confidence Level (High/Medium/Low). 2) Brief Justification for this level. *You* (LLM) make this assessment *before* calling.")
	},
	async ({ assessment_and_confidence }) => {
		const confidenceRegex = /Confidence Level: (High|Medium|Low)/i;
		if (!assessment_and_confidence || typeof assessment_and_confidence !== 'string' || !confidenceRegex.test(assessment_and_confidence)) {
			throw new Error('Invalid confidence assessment: Must include "Confidence Level: High/Medium/Low" and justification.');
		}
		const match = assessment_and_confidence.match(confidenceRegex);
		const level = match ? match[1] : "Unknown";
		console.error(`[CognitiveToolsServer] GaugeConfidence Tool Signaled: Level ${level}`);
		// Output confirms assessment and level
		return { content: [{ type: "text" as const, text: `Confidence Gauge Completed. Level: ${level}. Assessment: ${assessment_and_confidence}` }] };
	}
);

// --- Supporting Cognitive Strategy Tools (Enhanced Descriptions) ---

server.tool(
	"plan_and_solve",
	// Main Description: Highlights role in structuring complex tasks and managing agentic workflows.
	"Guides the LLM to **generate a structured, multi-step plan text** for a complex objective. Outlines necessary phases, potential sub-tasks, and anticipated tool usage, improving manageability of multi-step agentic workflows. The generated plan MUST be validated and detailed via `think`, and can optionally be passed to `reflection` for critique.",
	{
		// Parameter Description: Instructs LLM on plan generation.
		task_objective: z.string().describe("Input the high-level objective. *You* (the LLM) must now *internally generate the structured plan text* before calling this tool. This signals the plan text is ready for analysis/critique.")
	},
	// Implementation: Signals Planning was performed.
	async ({ task_objective }) => {
		if (!task_objective || typeof task_objective !== 'string' || task_objective.trim().length === 0) {
			throw new Error('Invalid task objective: Must be a non-empty string.');
		}
		console.error(`[CognitiveToolsServer] PlanAndSolve Tool Signaled for: ${task_objective.substring(0, 100)}...`);
		return { content: [{ type: "text" as const, text: `Planning generation signaled for objective: ${task_objective}. Ready for 'think' analysis.` }] };
	}
);

server.tool(
	"chain_of_thought",
	// Main Description: Emphasizes generating text for later analysis.
	"Guides the LLM to **generate detailed, step-by-step reasoning text**. Used for complex logic or explainability. The *generated CoT text* MUST then be analyzed in a subsequent `think` call.",
	{
		// Parameter Description: Focus on the input problem.
		problem_statement: z.string().describe("Input the problem requiring detailed step-by-step reasoning. *You* (the LLM) must now *internally generate the full CoT text* before calling this tool. This signals that CoT text is ready for analysis in the next `think` step.")
	},
	// Implementation: Signals CoT was performed for the given problem.
	async ({ problem_statement }) => {
		if (!problem_statement || typeof problem_statement !== 'string' || problem_statement.trim().length === 0) {
			throw new Error('Invalid problem statement: Must be a non-empty string.');
		}
		console.error(`[CognitiveToolsServer] ChainOfThought Tool Signaled for: ${problem_statement.substring(0, 100)}...`);
		return { content: [{ type: "text" as const, text: `Chain of Thought internally generated for problem: ${problem_statement}. Ready for 'think' analysis.` }] };
	}
);

server.tool(
	"chain_of_draft",
	// Main Description: Positions for efficient exploration and hypothesis generation.
	"Guides the LLM to **generate concise, iterative reasoning draft texts** ('thought-sketches'). Useful for efficiently exploring multiple solution paths, brainstorming hypotheses, or outlining approaches when full CoT verbosity is premature. Drafts MUST be analyzed comparatively via `think`.",
	{
		// Parameter Description: Instructs LLM on draft generation.
		problem_statement: z.string().describe("Input the problem or question for exploration. *You* (the LLM) must now *internally generate brief, iterative draft texts* (key steps, pros/cons, core ideas) for potential approaches *before* calling this tool.")
	},
	// Implementation: Signals Drafting was performed.
	async ({ problem_statement }) => {
		if (!problem_statement || typeof problem_statement !== 'string' || problem_statement.trim().length === 0) {
			throw new Error('Invalid problem statement: Must be a non-empty string.');
		}
		console.error(`[CognitiveToolsServer] ChainOfDraft Tool Signaled for: ${problem_statement.substring(0, 100)}...`);
		return { content: [{ type: "text" as const, text: `Chain of Draft generation signaled for problem: ${problem_statement}. Ready for 'think' analysis.` }] };
	}
);

server.tool(
	"reflection",
	// Main Description: Explicitly mentions taking prior text as input for critique.
	"Guides the LLM to perform critical self-evaluation on **previously generated text** (reasoning, plans, code concepts). Essential for iterative refinement and improving accuracy. The *generated critique text* MUST be analyzed via `think`.",
	{
		// Parameter Description: Input is the text to be critiqued.
		input_reasoning_or_plan: z.string().describe("Input the **exact text** (e.g., from a prior `think` log, or internally generated plan/CoT/code concept) that *you* (the LLM) must now *internally generate a critique for*. Your critique should identify flaws and suggest improvements.")
	},
	// Implementation: Signals Reflection was performed.
	async ({ input_reasoning_or_plan }) => {
		if (!input_reasoning_or_plan || typeof input_reasoning_or_plan !== 'string' || input_reasoning_or_plan.trim().length === 0) {
			throw new Error('Invalid input reasoning/plan: Must be a non-empty string.');
		}
		console.error(`[CognitiveToolsServer] Reflection Tool Signaled for analysis.`);
		return { content: [{ type: "text" as const, text: `Reflection internally generated for input text: '${input_reasoning_or_plan.substring(0, 100)}...'. Ready for 'think' analysis.` }] };
	}
);


// --- Server Lifecycle and Error Handling ---

process.on('SIGINT', async () => {
	console.error('[CognitiveToolsServer] Received SIGINT, shutting down.');
	await server.close();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.error('[CognitiveToolsServer] Received SIGTERM, shutting down.');
	await server.close();
	process.exit(0);
});

process.on('uncaughtException', (error) => {
	console.error('[CognitiveToolsServer] Uncaught exception:', error);
	// Depending on severity, you might want to gracefully shutdown or just log
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('[CognitiveToolsServer] Unhandled promise rejection:', reason);
	// Depending on severity, you might want to gracefully shutdown or just log
});

// Start the server
async function main() {
	try {
		const transport = new StdioServerTransport();
		await server.connect(transport);
		console.error('ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Gikendaasowin Aabajichiganan - (Cognitive Tools v0.6.1) MCP Server running on stdio');
	}
	catch (error) {
		console.error('[CognitiveToolsServer] Fatal error during startup:', error);
		process.exit(1);
	}
}

// Execute the main function to start the server
main();