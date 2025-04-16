#!/usr/bin/env node

/**
 * -----------------------------------------------------------------------------
 * Gikendaasowin Aabajichiganan - Core Cognitive Tools MCP Server
 *
 * Version: 0.9.6
 *
 * Description: Provides a suite of cognitive tools for an AI Pair Programmer,
 *              enabling structured reasoning, planning, analysis, and iterative
 *              refinement (Chain of Thought, Chain of Draft, Reflection).
 *              This server focuses on managing the AI's *internal cognitive loop*,
 *              as described in the Anthropic research on the 'think' tool and
 *              related cognitive patterns. External actions are planned within
 *              the 'think' step but executed by the calling environment.
 *
 * Key Principles:
 * 1.  **Structured Deliberation:** Tools guide specific cognitive acts (planning,
 *     reasoning, critique).
 * 2.  **Centralized Analysis (`think`):** The `think` tool is mandatory after
 *     most cognitive actions or receiving external results, serving as the hub
 *     for analysis, planning the *next immediate step*, verification, and
 *     self-correction.
 * 3.  **CUC-N Assessment:** Task characteristics determine the required depth
 *     of cognition (full `think` vs. `quick_think`).
 * 4.  **Internal Generation First:** Tools like `plan_and_solve`, `chain_of_thought`,
 *     `reflection`, and `synthesize_prior_reasoning` are called *after* the AI
 *     has internally generated the relevant text (plan, CoT, critique, summary).
 *     The tool logs this generation and returns it, grounding the AI for the
 *     mandatory `think` analysis step.
 * 5.  **Iterative Refinement (Chain of Draft):** The `chain_of_draft` tool signals
 *     internal draft creation/modification, prompting analysis via `think`.
 *
 * Protocol:    Model Context Protocol (MCP) over stdio.
 * -----------------------------------------------------------------------------
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

export const version = "0.9.6";

// --- Server Definition ---

const server = new McpServer({
	name: "gikendaasowin-aabajichiganan-mcp",
	version: version,
	description: "ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Core Cognitive Tools Suite v0.9.6: Enables structured, iterative reasoning (Chain of Thought/Draft), planning, and analysis for AI agents, focusing on the cognitive loop. MANDATORY `think` step integrates results."
});

// --- Logging Helpers ---

/**
 * Logs an incoming tool call to stderr.
 * @param toolName The name of the tool being called.
 * @param details Optional additional details about the call.
 */
function logToolCall(toolName: string, details?: string): void {
	const timestamp = new Date().toISOString();
	console.error(`[${timestamp}] [MCP Server] > Tool Call: ${toolName}${details ? ` - ${details}` : ''}`);
}

/**
 * Logs the result (success or failure) of a tool execution to stderr.
 * @param toolName The name of the tool executed.
 * @param success Whether the execution was successful.
 * @param resultDetails Optional details about the result.
 */
function logToolResult(toolName: string, success: boolean, resultDetails?: string): void {
	const timestamp = new Date().toISOString();
	console.error(`[${timestamp}] [MCP Server] < Tool Result: ${toolName} - ${success ? 'Success' : 'Failure'}${resultDetails ? ` - ${resultDetails}` : ''}`);
}

/**
 * Logs an error during tool execution and formats a standard error response for the LLM.
 * @param toolName The name of the tool where the error occurred.
 * @param error The error object or message.
 * @returns An McpToolResult containing the error message.
 */
function logToolError(toolName: string, error: unknown) {
	const timestamp = new Date().toISOString();
	const errorMessage = error instanceof Error ? error.message : String(error);
	console.error(`[${timestamp}] [MCP Server] ! Tool Error: ${toolName} - ${errorMessage}`);
	logToolResult(toolName, false, errorMessage); // Log failure result as well
	// Return a structured error message suitable for the LLM
	return {
		content: [{
			type: "text" as const,
			text: `Error executing tool '${toolName}': ${errorMessage}. Please analyze this error in your next 'think' step and adjust your plan.`
		}]
	};
}

// --- Core Cognitive Deliberation & Refinement Tools ---

/**
 * Tool: assess_cuc_n_mode
 * Purpose: Mandatory initial assessment of task characteristics to determine cognitive strategy.
 * Workflow: Call BEFORE starting complex tasks or significantly changing strategy.
 * Output: Confirms assessment and selected mode (`think` or `quick_think`). Result MUST inform the subsequent cognitive flow.
 */
server.tool(
	"assess_cuc_n_mode",
	"**Mandatory Pre-Deliberation Assessment.** Evaluates task Complexity, Uncertainty, Consequence, Novelty (CUC-N) to determine required cognitive depth and initial strategy. MUST be called before starting complex tasks or changing strategy. Selects 'think' (default) or 'quick_think' (only for verified Low CUC-N).",
	{
		assessment_and_choice: z.string().describe("Your structured assessment including: 1) Situation Description, 2) CUC-N Ratings (Low/Medium/High for each), 3) Rationale for ratings, 4) Recommended Initial Cognitive Strategy (e.g., 'Start with chain_of_thought then think'), 5) Explicit Mode Selection ('Selected Mode: think' or 'Selected Mode: quick_think').")
	},
	async ({ assessment_and_choice }) => {
		const toolName = 'assess_cuc_n_mode';
		logToolCall(toolName);
		try {
			// Enhanced validation using regex for robustness
			const modeRegex = /Selected Mode: (think|quick_think)/i;
			const cucnRegex = /CUC-N Ratings:/i;
			const strategyRegex = /Recommended Initial Strategy:/i;

			if (!assessment_and_choice || typeof assessment_and_choice !== 'string') {
				throw new Error('Input must be a non-empty string.');
			}
			if (!cucnRegex.test(assessment_and_choice)) {
				throw new Error('Invalid assessment: String must include "CUC-N Ratings:".');
			}
            /* // User request: Remove strict check for 'Recommended Initial Strategy:'
            if (!strategyRegex.test(assessment_and_choice)) {
				throw new Error('Invalid assessment: String must include "Recommended Initial Strategy:".');
			}
            */
			const modeMatch = assessment_and_choice.match(modeRegex);
			if (!modeMatch || !modeMatch[1]) {
				throw new Error('Invalid assessment: String must include explicit "Selected Mode: think" or "Selected Mode: quick_think".');
			}

			const selectedMode = modeMatch[1].toLowerCase();
			logToolResult(toolName, true, `Selected mode: ${selectedMode} - Returning original assessment + reminder.`);
			// Log the full assessment server-side for traceability
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Assessment Details:\n${assessment_and_choice}`);

			// New logic: Return original input + reminder
			const reminder = "\n\n---\nSchema Reminder: Ensure assessment includes: 1) Situation Description, 2) CUC-N Ratings:, 3) Rationale for ratings, 4) Recommended Initial Strategy:, 5) Selected Mode: think/quick_think.";
			return { content: [{ type: "text" as const, text: assessment_and_choice + reminder }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: think
 * Purpose: The **CENTRAL HUB** for the cognitive loop. Mandatory after assessment, other cognitive tools, internal drafts, or external action results.
 * Workflow: Analyze previous step -> Plan immediate next step -> Verify -> Assess Risk -> Self-Correct.
 * Output: Returns the structured thought text itself, grounding the AI's reasoning process in the context.
 */
server.tool(
	"think",
	"**MANDATORY Central Hub for Analysis, Planning, and Refinement.** Called after assessment, other cognitive tools (`plan_and_solve`, `chain_of_thought`, etc.), internal drafts (`chain_of_draft`), or external action results. Analyzes previous step's outcome/draft, plans the *immediate* next action (cognitive or planning external action), verifies plan, assesses risk/challenges, looks ahead, and self-corrects. Follow the MANDATORY structure in the `thought` parameter.",
	{
		thought: z.string().describe("Your **detailed** internal monologue following the MANDATORY structure: ## Analysis: (Critically evaluate last result/draft/observation. What worked? What didn't? What are the implications?), ## Plan: (Define the *single, immediate* next action and its specific purpose. Is it calling another cognitive tool, generating a draft, planning an external action, or concluding?), ## Verification: (How will you confirm the next step is correct or successful?), ## Anticipated Challenges & Contingency: (What could go wrong with the next step? How will you handle it?), ## Risk Assessment: (Briefly assess risk of the planned step - Low/Medium/High), ## Lookahead: (How does this step fit into the overall goal?), ## Self-Correction & Learning: (Any adjustments needed based on the analysis? What was learned?).")
	},
	async ({ thought }) => {
		const toolName = 'think';
		logToolCall(toolName);
		try {
			if (!thought || typeof thought !== 'string' || thought.trim().length === 0) {
				throw new Error('Invalid thought: Must be a non-empty string containing the structured analysis and plan.');
			}
			// Basic structural check (case-insensitive) - Warning, not strict failure
			const requiredSections = ["## Analysis:", "## Plan:", "## Verification:", "## Anticipated Challenges & Contingency:", "## Risk Assessment:", "## Lookahead:", "## Self-Correction & Learning:"];
			const missingSections = requiredSections.filter(section => !thought.toLowerCase().includes(section.toLowerCase()));
			if (missingSections.length > 0) {
				console.warn(`[${new Date().toISOString()}] [MCP Server] Warning: '${toolName}' input might be missing sections: ${missingSections.join(', ')}. Ensure full structure is followed for optimal reasoning.`);
			}

			logToolResult(toolName, true, `Thought logged (length: ${thought.length})`);
			// Returns the same thought text received. This grounds the reasoning in the context.
			// The AI uses this output implicitly as the starting point for its *next* internal step or external action.
			return { content: [{ type: "text" as const, text: thought }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: quick_think
 * Purpose: A lightweight cognitive checkpoint for **strictly Low CUC-N situations** or trivial confirmations.
 * Workflow: Use ONLY when `assess_cuc_n_mode` explicitly selected 'quick_think'. Use sparingly.
 * Output: Logs the brief thought.
 */
server.tool(
	"quick_think",
	"Cognitive Checkpoint ONLY for situations explicitly assessed as strictly Low CUC-N (via `assess_cuc_n_mode`) or for trivial confirmations/acknowledgements where detailed analysis via `think` is unnecessary. Use SPARINGLY.",
	{
		brief_thought: z.string().describe("Your **concise** thought or confirmation for this simple, low CUC-N step. Briefly state the observation/action and confirm it's trivial.")
	},
	async ({ brief_thought }) => {
		const toolName = 'quick_think';
		logToolCall(toolName);
		try {
			if (!brief_thought || typeof brief_thought !== 'string' || brief_thought.trim().length === 0) {
				throw new Error('Invalid brief_thought: Must be a non-empty string.');
			}
			logToolResult(toolName, true, `Logged: ${brief_thought.substring(0, 80)}...`);
			// Returns the brief thought, similar to 'think', for grounding.
			return { content: [{ type: "text" as const, text: brief_thought }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: gauge_confidence
 * Purpose: Meta-Cognitive Checkpoint to explicitly state confidence in a preceding analysis, plan, or draft.
 * Workflow: Generate assessment -> Call this tool with assessment text -> MANDATORY `think` step follows to analyze the confidence level.
 * Output: Confirms confidence gauging and level. Emphasizes need for `think` analysis, especially if not High.
 */
server.tool(
	"gauge_confidence",
	"Meta-Cognitive Checkpoint. Guides *internal stating* of **confidence (High/Medium/Low) and justification** regarding a specific plan, analysis, or draft you just formulated. Call this tool *with* the text containing your confidence assessment. Output MUST be analyzed in the mandatory `think` step immediately following.",
	{
		assessment_and_confidence: z.string().describe("The text containing the item being assessed AND your explicit internal assessment: 1) Confidence Level: (High/Medium/Low). 2) Justification for this level.")
	},
	async ({ assessment_and_confidence }) => {
		const toolName = 'gauge_confidence';
		logToolCall(toolName);
		try {
			const confidenceRegex = /Confidence Level: (High|Medium|Low)/i;
			if (!assessment_and_confidence || typeof assessment_and_confidence !== 'string') {
				throw new Error('Input must be a non-empty string.');
			}
			const match = assessment_and_confidence.match(confidenceRegex);
			if (!match || !match[1]) {
				throw new Error('Invalid confidence assessment: String must include "Confidence Level: High/Medium/Low" and justification.');
			}

			const level = match[1];
			const emphasis = (level.toLowerCase() !== 'high') ? "CRITICAL: Analyze implications of non-High confidence." : "Proceed with analysis.";
			const resultText = `Confidence Gauge Completed. Stated Level: ${level}. Assessment Text Logged. MANDATORY: Analyze this confidence level and justification in your next 'think' step. ${emphasis}`;
			logToolResult(toolName, true, `Level: ${level}`);
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Confidence Details:\n${assessment_and_confidence}`);
			return { content: [{ type: "text" as const, text: resultText }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: plan_and_solve
 * Purpose: Guides the *internal generation* of a structured plan draft.
 * Workflow: Internally generate plan -> Call this tool *with* the plan text -> MANDATORY `think` step follows to analyze/refine the plan.
 * Output: Returns the provided plan text for grounding and analysis.
 */
server.tool(
	"plan_and_solve",
	"Guides *internal generation* of a **structured plan draft**. Call this tool *with* the generated plan text you created internally. Returns the plan text. MANDATORY: Use the next `think` step to critically evaluate this plan's feasibility, refine it, and confirm the *first actionable step*.",
	{
		generated_plan_text: z.string().describe("The **full, structured plan draft** you generated internally, including goals, steps, potential external tool needs, assumptions, and risks."),
		task_objective: z.string().describe("The original high-level task objective this plan addresses.")
	},
	async ({ generated_plan_text, task_objective }) => {
		const toolName = 'plan_and_solve';
		logToolCall(toolName, `Objective: ${task_objective.substring(0, 80)}...`);
		try {
			if (!generated_plan_text || typeof generated_plan_text !== 'string' || generated_plan_text.trim().length === 0) {
				throw new Error('Invalid generated_plan_text: Must be a non-empty string containing the plan.');
			}
			if (!task_objective || typeof task_objective !== 'string' || task_objective.trim().length === 0) {
				throw new Error('Invalid task_objective: Must provide the original objective.');
			}
			logToolResult(toolName, true, `Returned plan draft for analysis (length: ${generated_plan_text.length})`);
			// Returns the actual plan text received. The AI must analyze this in the next 'think' step.
			return { content: [{ type: "text" as const, text: generated_plan_text }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: chain_of_thought
 * Purpose: Guides the *internal generation* of a detailed, step-by-step reasoning draft (CoT).
 * Workflow: Internally generate CoT -> Call this tool *with* the CoT text -> MANDATORY `think` step follows to analyze the reasoning.
 * Output: Returns the provided CoT text for grounding and analysis.
 */
server.tool(
	"chain_of_thought",
	"Guides *internal generation* of **detailed, step-by-step reasoning draft (CoT)**. Call this tool *with* the generated CoT text you created internally. Returns the CoT text. MANDATORY: Use the next `think` step to analyze this reasoning, extract insights, identify flaws/gaps, and plan the next concrete action based on the CoT.",
	{
		generated_cot_text: z.string().describe("The **full, step-by-step Chain of Thought draft** you generated internally to solve or analyze the problem."),
		problem_statement: z.string().describe("The original problem statement or question this CoT addresses.")
	},
	async ({ generated_cot_text, problem_statement }) => {
		const toolName = 'chain_of_thought';
		logToolCall(toolName, `Problem: ${problem_statement.substring(0, 80)}...`);
		try {
			if (!generated_cot_text || typeof generated_cot_text !== 'string' || generated_cot_text.trim().length === 0) {
				throw new Error('Invalid generated_cot_text: Must be a non-empty string containing the CoT.');
			}
			if (!problem_statement || typeof problem_statement !== 'string' || problem_statement.trim().length === 0) {
				throw new Error('Invalid problem_statement: Must provide the original problem.');
			}
			logToolResult(toolName, true, `Returned CoT draft for analysis (length: ${generated_cot_text.length})`);
			// Returns the actual CoT text received. The AI must analyze this in the next 'think' step.
			return { content: [{ type: "text" as const, text: generated_cot_text }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: chain_of_draft
 * Purpose: Signals that internal drafts (code, text, plan fragments) have been generated or refined.
 * Workflow: Internally generate/refine draft(s) -> Call this tool -> MANDATORY `think` step follows to analyze the draft(s).
 * Output: Confirms readiness for analysis.
 */
server.tool(
	"chain_of_draft",
	"Signals that one or more **internal drafts** (e.g., code snippets, documentation sections, refined plan steps) have been generated or refined and are ready for analysis. Call this tool *after* generating/refining draft(s) internally. Response confirms readiness. MANDATORY: Analyze these draft(s) in your next `think` step.",
	{
		draft_description: z.string().describe("Brief but specific description of the draft(s) generated/refined internally (e.g., 'Initial Python function for API call', 'Refined error handling in plan step 3', 'Drafted README introduction').")
	},
	async ({ draft_description }) => {
		const toolName = 'chain_of_draft';
		logToolCall(toolName, `Description: ${draft_description}`);
		try {
			if (!draft_description || typeof draft_description !== 'string' || draft_description.trim().length === 0) {
				throw new Error('Invalid draft_description: Must provide a description.');
			}
			const resultText = `Internal draft(s) ready for analysis: \"${draft_description}\". MANDATORY: Analyze these draft(s) now using the structured format in your next 'think' step. Evaluate correctness, completeness, and alignment with goals.`;
			logToolResult(toolName, true);
			return { content: [{ type: "text" as const, text: resultText }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: reflection
 * Purpose: Guides the *internal generation* of a critical self-evaluation (critique) of a prior step, draft, or outcome.
 * Workflow: Internally generate critique -> Call this tool *with* the critique text -> MANDATORY `think` step follows to act on the critique.
 * Output: Returns the provided critique text for grounding and analysis.
 */
server.tool(
	"reflection",
	"Guides *internal generation* of a critical self-evaluation (critique) on a prior step, draft, plan, or outcome. Call this tool *with* the **generated critique text** you created internally. Returns the critique text. MANDATORY: Use the next `think` step to analyze this critique and plan specific corrective actions or refinements based on it.",
	{
		generated_critique_text: z.string().describe("The **full critique text** you generated internally, identifying specific flaws, strengths, assumptions, alternative approaches, and concrete suggestions for improvement."),
		input_subject_description: z.string().describe("A brief description of the original reasoning, plan, code draft, or action result that was critiqued (e.g., 'Critique of the plan generated via plan_and_solve', 'Reflection on the CoT for problem X').")
	},
	async ({ generated_critique_text, input_subject_description }) => {
		const toolName = 'reflection';
		logToolCall(toolName, `Subject: ${input_subject_description}`);
		try {
			if (!generated_critique_text || typeof generated_critique_text !== 'string' || generated_critique_text.trim().length === 0) {
				throw new Error('Invalid generated_critique_text: Must be a non-empty string containing the critique.');
			}
			if (!input_subject_description || typeof input_subject_description !== 'string' || input_subject_description.trim().length === 0) {
				throw new Error('Invalid input_subject_description: Must describe what was critiqued.');
			}
			logToolResult(toolName, true, `Returned critique for analysis (length: ${generated_critique_text.length})`);
			// Returns the actual critique text received. The AI must analyze this in the next 'think' step.
			return { content: [{ type: "text" as const, text: generated_critique_text }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: synthesize_prior_reasoning
 * Purpose: Context Management Tool. Guides the *internal generation* of a structured summary of preceding context.
 * Workflow: Internally generate summary -> Call this tool *with* the summary text -> MANDATORY `think` step follows to use the summary.
 * Output: Returns the provided summary text for grounding and analysis.
 */
server.tool(
	"synthesize_prior_reasoning",
	"Context Management Tool. Guides *internal generation* of a **structured summary** of preceding steps, decisions, key findings, or relevant context to consolidate understanding before proceeding. Call this tool *with* the generated summary text you created internally. Returns the summary. MANDATORY: Use the next `think` step to leverage this summary and inform the next action.",
	{
		generated_summary_text: z.string().describe("The **full, structured summary text** you generated internally (e.g., key decisions made, open questions, current state of implementation, relevant facts gathered)."),
		context_to_summarize_description: z.string().describe("Description of the reasoning span or context that was summarized (e.g., 'Summary of the last 5 steps', 'Consolidated findings from tool results A and B').")
	},
	async ({ generated_summary_text, context_to_summarize_description }) => {
		const toolName = 'synthesize_prior_reasoning';
		logToolCall(toolName, `Context: ${context_to_summarize_description}`);
		try {
			if (!generated_summary_text || typeof generated_summary_text !== 'string' || generated_summary_text.trim().length === 0) {
				throw new Error('Invalid generated_summary_text: Must be a non-empty string containing the summary.');
			}
			if (!context_to_summarize_description || typeof context_to_summarize_description !== 'string' || context_to_summarize_description.trim().length === 0) {
				throw new Error('Invalid context_to_summarize_description: Must describe what was summarized.');
			}
			logToolResult(toolName, true, `Returned summary for analysis (length: ${generated_summary_text.length})`);
			// Returns the actual summary text received. The AI must analyze/use this in the next 'think' step.
			return { content: [{ type: "text" as const, text: generated_summary_text }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);


// --- Server Lifecycle and Error Handling ---

/**
 * Gracefully shuts down the server.
 */
async function shutdown(): Promise<void> {
	console.error('\n[MCP Server] Shutting down gracefully...');
	try {
		await server.close();
		console.error('[MCP Server] Server closed.');
		process.exit(0);
	} catch (err) {
		console.error('[MCP Server] Error during shutdown:', err);
		process.exit(1);
	}
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('uncaughtException', (error, origin) => {
	const timestamp = new Date().toISOString();
	console.error(`[${timestamp}] [MCP Server] FATAL: Uncaught Exception at: ${origin}`, error);
	// Attempt graceful shutdown, but exit quickly if it fails
	shutdown().catch(() => process.exit(1));
});

process.on('unhandledRejection', (reason, promise) => {
	const timestamp = new Date().toISOString();
	console.error(`[${timestamp}] [MCP Server] FATAL: Unhandled Promise Rejection:`, reason);
	// Attempt graceful shutdown, but exit quickly if it fails
	shutdown().catch(() => process.exit(1));
});

// --- Start the Server ---

/**
 * Initializes and starts the MCP server.
 */
async function main(): Promise<void> {
	try {
		const transport = new StdioServerTransport();
		await server.connect(transport);
		const border = '-----------------------------------------------------';
		console.error(border);
		console.error(` ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Core Cognitive Tools Suite v0.9.6: Enables structured, iterative reasoning (Chain of Thought/Draft), planning, and analysis for AI agents, focusing on the cognitive loop. MANDATORY \`think\` step integrates results.`);
		console.error(` Version: ${version}`);
		console.error(' Status: Running on stdio, awaiting MCP requests...');
		console.error(border);
	}
	catch (error) {
		const timestamp = new Date().toISOString();
		console.error(`[${timestamp}] [MCP Server] Fatal error during startup:`, error);
		process.exit(1);
	}
}

// Execute the main function to start the server
main();