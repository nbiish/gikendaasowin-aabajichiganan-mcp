#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create the MCP server - Version 0.8.0 reflects the change in tool signatures and return values
const server = new McpServer({
	name: "gikendaasowin-aabajichiganan-mcp",
	version: "0.8.0", // Updated version
	description: "ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Gikendaasowin Aabajichiganan - (Cognitive Tools v0.8.0): SOTA reasoning suite aligned with AI Pair Programmer Prompt v0.8.0+. Enforces mandatory structured deliberation via `think` after explicit assessment. Returns generated cognitive content (thoughts, plans, CoT, critiques, summaries) for explicit analysis, optimizing for cognitive enhancement."
});

// --- Core Cognitive Deliberation Tools ---

server.tool(
	"think",
	// Main Description: Central hub, now returns the thought for explicit context.
	"MANDATORY Cognitive Hub for Medium/High CUC-N situations. Analyzes inputs/prior steps, plans, verifies, assesses risks, self-corrects. Returns the detailed thought text for explicit grounding in the next step.",
	{
		// Parameter Description: Input IS the thought.
		thought: z.string().describe("Your **detailed** internal monologue following the MANDATORY structure: ## Analysis, ## Plan, ## Verification, ## Anticipated Challenges Analysis & Contingency, ## Risk Assessment, ## Lookahead, ## Self-Correction & Learning.")
	},
	async ({ thought }) => {
		if (!thought || typeof thought !== 'string' || thought.trim().length === 0) { throw new Error('Invalid thought: Must be non-empty, structured reasoning.'); }
		console.error(`[CognitiveToolsServer v0.8.0] Think Tool Received: ${thought.substring(0, 150)}...`);
		// Returns the same thought text received, making it explicit in context.
		return { content: [{ type: "text" as const, text: thought }] };
	}
);

server.tool(
	"quick_think",
	// Main Description: Unchanged - simple confirmation is sufficient here.
	"Cognitive Checkpoint ONLY for situations explicitly assessed as strictly Low CUC-N AND simple task nature. Use sparingly. Logs brief thought.",
	{
		brief_thought: z.string().describe("Your **concise** thought for strictly simple, low CUC-N situations confirmed by prior assessment.")
	},
	async ({ brief_thought }) => {
		if (!brief_thought || typeof brief_thought !== 'string' || brief_thought.trim().length === 0) { throw new Error('Invalid brief_thought: Must be non-empty.'); }
		console.error(`[CognitiveToolsServer v0.8.0] QuickThink Tool Logged: ${brief_thought.substring(0, 100)}...`);
		// Simple confirmation remains appropriate for quick_think.
		return { content: [{ type: "text" as const, text: `Quick Thought logged successfully.` }] };
	}
);

// --- Mandatory Meta-Cognitive Tools (Responses remain concise confirmations) ---

server.tool(
	"assess_complexity_and_select_thought_mode",
	// Main Description: Unchanged.
	"**Mandatory Pre-Deliberation Assessment.** Must be called BEFORE every `think` or `quick_think`. Evaluates CUC-N, recommends strategy, commits to next thought mode.",
	{
		// Parameter Description: Unchanged.
		assessment_and_choice: z.string().describe("Input your assessment *before* calling. MUST include: 1) Situation Description, 2) CUC-N Ratings (L/M/H), 3) Recommended Initial Strategy, 4) Explicit Mode Selection ('Selected Mode: think' or 'Selected Mode: quick_think').")
	},
	async ({ assessment_and_choice }) => {
		const requiredPhrases = ["Complexity", "Uncertainty", "Consequence", "Novelty", "Recommended Initial Strategy", "Selected Mode:"];
		const hasRequiredPhrases = requiredPhrases.every(phrase => assessment_and_choice.includes(phrase));
		const hasModeSelection = assessment_and_choice.includes("Selected Mode: think") || assessment_and_choice.includes("Selected Mode: quick_think");
		if (!assessment_and_choice || typeof assessment_and_choice !== 'string' || !hasRequiredPhrases || !hasModeSelection) { throw new Error('Invalid assessment: String must include CUC-N ratings, Recommended Initial Strategy, and explicit Selected Mode ("think" or "quick_think").'); }
		console.error(`[CognitiveToolsServer v0.8.0] AssessComplexity Tool Signaled: ${assessment_and_choice.substring(0, 150)}...`);
		const mode = assessment_and_choice.includes("Selected Mode: think") ? "think" : "quick_think";
		// Confirmation guides the next step.
		return { content: [{ type: "text" as const, text: `Cognitive Assessment Completed. Proceeding with selected mode: ${mode}. Full Assessment: ${assessment_and_choice}` }] };
	}
);

server.tool(
	"gauge_confidence",
	// Main Description: Unchanged.
	"Meta-Cognitive Checkpoint. Guides internal stating of **confidence (High/Medium/Low) and justification**. Output MUST be analyzed in the mandatory `think` step immediately after; Low/Medium confidence requires specific action planning.",
	{
		// Parameter Description: Unchanged.
		assessment_and_confidence: z.string().describe("Input item being assessed. *Internally determine and state*: 1) Confidence Level (H/M/L). 2) Justification. Call this tool *after* making the assessment.")
	},
	async ({ assessment_and_confidence }) => {
		const confidenceRegex = /Confidence Level: (High|Medium|Low)/i;
		if (!assessment_and_confidence || typeof assessment_and_confidence !== 'string' || !confidenceRegex.test(assessment_and_confidence)) { throw new Error('Invalid confidence assessment: String must include "Confidence Level: High/Medium/Low" and justification.'); }
		const match = assessment_and_confidence.match(confidenceRegex);
		const level = match ? match[1] : "Unknown";
		console.error(`[CognitiveToolsServer v0.8.0] GaugeConfidence Tool Signaled: Level ${level}`);
		// Confirmation includes level, prepares for mandatory analysis.
		return { content: [{ type: "text" as const, text: `Confidence Gauge Completed. Level: ${level}. Assessment Text: ${assessment_and_confidence}. Ready for mandatory post-assessment 'think' analysis (action required if Low/Medium).` }] };
	}
);


// --- Supporting Cognitive Strategy Tools (Now Accept & Return Generated Text) ---

server.tool(
	"plan_and_solve",
	// Main Description: Now returns the plan text itself.
	"Guides internal generation of **structured plan text** (incl. Risks/Challenges, potential tool needs). Call this tool *with* the generated plan text. Returns the plan text for mandatory `think` analysis.",
	{
		// NEW Parameter: Accepts the generated plan.
		generated_plan_text: z.string().describe("The **full, structured plan text** you generated internally, including Anticipated Challenges/Risks and potential other tool needs."),
		task_objective: z.string().describe("The original high-level task objective this plan addresses.") // Keep original objective for context logging.
	},
	async ({ generated_plan_text, task_objective }) => {
		if (!generated_plan_text || typeof generated_plan_text !== 'string' || generated_plan_text.trim().length === 0) { throw new Error('Invalid generated_plan_text: Must be non-empty.'); }
		if (!task_objective || typeof task_objective !== 'string' || task_objective.trim().length === 0) { throw new Error('Invalid task_objective.'); }
		console.error(`[CognitiveToolsServer v0.8.0] PlanAndSolve Tool Received Plan for Objective: ${task_objective.substring(0, 100)}...`);
		// Returns the actual plan text received.
		return { content: [{ type: "text" as const, text: generated_plan_text }] };
	}
);

server.tool(
	"chain_of_thought",
	// Main Description: Now returns the CoT text itself.
	"Guides internal generation of **detailed, step-by-step reasoning text (CoT)**. Call this tool *with* the generated CoT text. Returns the CoT text for mandatory `think` analysis.",
	{
		// NEW Parameter: Accepts the generated CoT.
		generated_cot_text: z.string().describe("The **full, step-by-step Chain of Thought text** you generated internally, potentially noting needs for other tools."),
		problem_statement: z.string().describe("The original problem statement this CoT addresses.") // Keep original problem statement for context logging.
	},
	async ({ generated_cot_text, problem_statement }) => {
		if (!generated_cot_text || typeof generated_cot_text !== 'string' || generated_cot_text.trim().length === 0) { throw new Error('Invalid generated_cot_text: Must be non-empty.'); }
		if (!problem_statement || typeof problem_statement !== 'string' || problem_statement.trim().length === 0) { throw new Error('Invalid problem_statement.'); }
		console.error(`[CognitiveToolsServer v0.8.0] ChainOfThought Tool Received CoT for Problem: ${problem_statement.substring(0, 100)}...`);
		// Returns the actual CoT text received.
		return { content: [{ type: "text" as const, text: generated_cot_text }] };
	}
);

server.tool(
	"chain_of_draft",
	// Main Description: Keeping as signal due to complexity of multiple drafts. Response reinforces next step.
	"Guides internal generation of **concise, iterative reasoning draft texts**. Call this tool *after* generating drafts internally. Response confirms generation; drafts MUST be analyzed via mandatory `think`.",
	{
		// Parameter: Still just the problem statement. LLM handles drafts internally.
		problem_statement: z.string().describe("Input problem for exploration. *You* (LLM) must now *internally generate brief, iterative draft texts*. Call this tool *after* generation to signal readiness for analysis.")
	},
	async ({ problem_statement }) => {
		if (!problem_statement || typeof problem_statement !== 'string' || problem_statement.trim().length === 0) { throw new Error('Invalid problem statement.'); }
		console.error(`[CognitiveToolsServer v0.8.0] ChainOfDraft Tool Signaled for: ${problem_statement.substring(0, 100)}...`);
		// Returns confirmation, strongly reminding LLM of the mandatory next step.
		return { content: [{ type: "text" as const, text: `Reasoning drafts generated internally for problem: ${problem_statement}. MANDATORY: Analyze these drafts now in your next post-assessment 'think' step.` }] };
	}
);

server.tool(
	"reflection",
	// Main Description: Now returns the critique text itself.
	"Guides internal critical self-evaluation on prior text. Call this tool *with* the **generated critique text**. Returns the critique text for mandatory `think` analysis.",
	{
		// NEW Parameter: Accepts the generated critique.
		generated_critique_text: z.string().describe("The **full critique text** you generated internally, identifying flaws and suggesting improvements."),
		input_reasoning_or_plan: z.string().describe("The original text that was critiqued.") // Keep original text for context logging.
	},
	async ({ generated_critique_text, input_reasoning_or_plan }) => {
		if (!generated_critique_text || typeof generated_critique_text !== 'string' || generated_critique_text.trim().length === 0) { throw new Error('Invalid generated_critique_text: Must be non-empty.'); }
		if (!input_reasoning_or_plan || typeof input_reasoning_or_plan !== 'string' || input_reasoning_or_plan.trim().length === 0) { throw new Error('Invalid input_reasoning_or_plan.'); }
		console.error(`[CognitiveToolsServer v0.8.0] Reflection Tool Received Critique for: ${input_reasoning_or_plan.substring(0, 100)}...`);
		// Returns the actual critique text received.
		return { content: [{ type: "text" as const, text: generated_critique_text }] };
	}
);

server.tool(
	"synthesize_prior_reasoning",
	// Main Description: Now returns the summary text itself.
	"Context Management Tool. Guides internal generation of a **structured summary text** (incl. Key Decisions, Open Questions). Call this tool *with* the generated summary text. Returns the summary for mandatory `think` analysis.",
	{
		// NEW Parameter: Accepts the generated summary.
		generated_summary_text: z.string().describe("The **full, structured summary text** you generated internally."),
		context_to_summarize_description: z.string().describe("Description of the reasoning span that was summarized.") // Keep description for context logging.
	},
	async ({ generated_summary_text, context_to_summarize_description }) => {
		if (!generated_summary_text || typeof generated_summary_text !== 'string' || generated_summary_text.trim().length === 0) { throw new Error('Invalid generated_summary_text: Must be non-empty.'); }
		if (!context_to_summarize_description || typeof context_to_summarize_description !== 'string' || context_to_summarize_description.trim().length === 0) { throw new Error('Invalid context_to_summarize_description.'); }
		console.error(`[CognitiveToolsServer v0.8.0] SynthesizeReasoning Tool Received Summary for: ${context_to_summarize_description}...`);
		// Returns the actual summary text received.
		return { content: [{ type: "text" as const, text: generated_summary_text }] };
	}
);


// --- Server Lifecycle and Error Handling (Unchanged) ---

process.on('SIGINT', async () => {
	console.error('\n[CognitiveToolsServer v0.8.0] Received SIGINT, shutting down gracefully.');
	await server.close();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.error('\n[CognitiveToolsServer v0.8.0] Received SIGTERM, shutting down gracefully.');
	await server.close();
	process.exit(0);
});

process.on('uncaughtException', (error) => {
	console.error('[CognitiveToolsServer v0.8.0] FATAL: Uncaught Exception:', error);
	server.close().catch(err => console.error('[CognitiveToolsServer v0.8.0] Error during shutdown on uncaughtException:', err)).finally(() => {
		process.exit(1);
	});
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('[CognitiveToolsServer v0.8.0] FATAL: Unhandled Promise Rejection:', reason);
	server.close().catch(err => console.error('[CognitiveToolsServer v0.8.0] Error during shutdown on unhandledRejection:', err)).finally(() => {
		process.exit(1);
	});
});

// Start the server
async function main() {
	try {
		const transport = new StdioServerTransport();
		await server.connect(transport);
		console.error('ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Gikendaasowin Aabajichiganan - (Cognitive Tools v0.8.0) MCP Server running on stdio');
	}
	catch (error) {
		console.error('[CognitiveToolsServer v0.8.0] Fatal error during startup:', error);
		process.exit(1);
	}
}

// Execute the main function to start the server
main();