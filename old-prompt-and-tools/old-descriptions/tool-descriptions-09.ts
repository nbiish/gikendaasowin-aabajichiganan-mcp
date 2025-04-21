#!/usr/bin/env node

/**
 * -----------------------------------------------------------------------------
 * Gikendaasowin Aabajichiganan - Core Cognitive Tools MCP Server
 *
 * Version: 0.9.12
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

export const version = "0.9.12";

// --- Server Definition ---

const server = new McpServer({
	name: "gikendaasowin-aabajichiganan-mcp",
	version: version,
	description: "ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Core Cognitive Tools Suite v0.9.12: Enables structured, iterative reasoning (Chain of Thought/Draft), planning, and analysis for AI agents, focusing on the cognitive loop. MANDATORY `think` step integrates results."
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
			text: `Error executing tool '${toolName}': ${errorMessage}.`
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
	"**Mandatory Pre-Deliberation Assessment.** Evaluates task Complexity, Uncertainty, Consequence, Novelty (CUC-N) to determine required cognitive depth and initial strategy. MUST be called before starting complex tasks or changing strategy. Based on assessment, use either `think` (for structured analysis) or `quick_think` (for streamlined processing) in the next step.",
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
			const modeMatch = assessment_and_choice.match(modeRegex);
			if (!modeMatch || !modeMatch[1]) {
				throw new Error('Invalid assessment: String must include explicit "Selected Mode: think" or "Selected Mode: quick_think".');
			}

			const selectedMode = modeMatch[1].toLowerCase();
			logToolResult(toolName, true, `Selected mode: ${selectedMode}`);
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Assessment Details:\n${assessment_and_choice}`);

			return { content: [{ type: "text" as const, text: assessment_and_choice }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: think
 * Purpose: The **CENTRAL HUB** for the cognitive loop, incorporating OODReAct principles (Observe-Orient-Decide-Reason-Act).
 * Workflow: Combines observation, orientation, decision-making, reasoning, and action for enhanced problem-solving.
 * Output: Returns the structured thought text itself, grounding the AI's reasoning process in the context.
 */
server.tool(
	"think",
	"**MANDATORY Central Hub for Analysis and Planning.** Called after assessment (`assess_cuc_n_mode`), other cognitive tools (`plan_and_solve`, `chain_of_thought`, `chain_of_draft`, `reflection`, `synthesize_prior_reasoning`, `gauge_confidence`), internal drafts (`chain_of_draft`), or external action results. Incorporates OODReAct principles (Observe-Orient-Decide-Reason-Act) for enhanced problem-solving. Consider structuring your thought process to: 1) Observe new information and changes, 2) Orient by analyzing context and patterns, 3) Decide on potential actions, 4) Reason through implications and alternatives, and 5) Act by planning specific execution steps. Follow the MANDATORY structure in the `thought` parameter. For simpler follow-up steps, consider using `quick_think` instead.",
	{
		thought: z.string().describe("Your **detailed** internal monologue. While any clear, structured format is accepted, consider following OODReAct principles in your thinking:\n- Observe: What new information/signals are available?\n- Orient: How does this fit into the bigger picture?\n- Decide: What are the potential actions to take?\n- Reason: What are the implications and alternatives?\n- Act: How to execute the chosen action?\n\nRequired sections:\n## Analysis/Observation\n## Plan/Decision\n## Verification\n## Risk & Contingency\n## Learning & Adaptation")
	},
	async ({ thought }) => {
		const toolName = 'think';
		logToolCall(toolName);
		
		try {
			if (!thought || typeof thought !== 'string' || thought.trim().length === 0) {
				throw new Error('Invalid thought: Must be a non-empty string containing substantive reasoning.');
			}

			// Define required sections (more flexible now)
			const requiredSections = [
				["## Analysis:", "## Observe:", "## Observation:"],
				["## Orient:", "## Orientation:"],
				["## Plan:", "## Decide:", "## Decision:"],
				["## Reason:", "## Reasoning:", "## Analysis:"],
				["## Act:", "## Action:", "## Execution:"],
				["## Verification:"],
				["## Risk & Contingency:", "## Risks:", "## Challenges:"],
				["## Learning & Adaptation:", "## Self-Correction:", "## Learning:"]
			];
			
			const missingSections = requiredSections.filter(sectionGroup => 
				!sectionGroup.some(section => thought.includes(section))
			);

			let validationReport = [];
			
			if (missingSections.length > 0) {
				validationReport.push("WARNING: Some recommended sections might be missing. Consider including observation, orientation, decision, reasoning, action, verification, risks, and learning components in your thought process.");
			}

			if (validationReport.length > 0) {
				console.warn(`[${new Date().toISOString()}] [CognitiveToolsServer] Think Tool Validation Report:\n${validationReport.join("\n")}`);
			}

			const format = thought.includes("## Observe:") ? "OODReAct-style" : "Traditional";
			logToolResult(toolName, true, `Thought logged (Style: ${format}, Length: ${thought.length})`);

			return {
				content: [{ type: "text" as const, text: thought }]
			};
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Cognitive Checkpoint ONLY for situations explicitly assessed as strictly Low CUC-N 
 * (via `assess_cuc_n_mode`) or for trivial confirmations/acknowledgements where 
 * detailed analysis via `think` is unnecessary. Provides a streamlined version of 
 * the OODReAct (Observe-Orient-Decide-Reason-Act) framework for simple cases.
 * Use SPARINGLY.
 */
export interface QuickThinkInput {
	/**
	 * Your **concise** thought or confirmation for this simple, low CUC-N step.
	 * Briefly state the observation/action and confirm it's trivial.
	 * While this is a simplified version of OODReAct, ensure basic observation
	 * and reasoning are still present, even if brief.
	 */
	brief_thought: string;
}

/**
 * Tool: quick_think
 * Purpose: A lightweight cognitive checkpoint for streamlined processing and simple confirmations.
 * Workflow: Use when full structured analysis via `think` is not necessary.
 * Output: Logs the brief thought.
 */
server.tool(
	"quick_think",
	"Cognitive Checkpoint for streamlined processing and simple confirmations where detailed analysis via `think` is unnecessary. Use when full structured deliberation would be excessive for the current step.",
	{
		brief_thought: z.string().describe("Your **concise** thought or confirmation for this step. Briefly state the observation/action and explain why detailed analysis isn't needed.")
	},
	async ({ brief_thought }) => {
		const toolName = 'quick_think';
		logToolCall(toolName);
		try {
			if (!brief_thought || typeof brief_thought !== 'string' || brief_thought.trim().length === 0) {
				throw new Error('Invalid brief_thought: Must be a non-empty string.');
			}
			logToolResult(toolName, true, `Logged: ${brief_thought.substring(0, 80)}...`);
			return { content: [{ type: "text" as const, text: brief_thought }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: gauge_confidence
 * Purpose: Meta-Cognitive Checkpoint to explicitly state confidence in a preceding analysis, plan, or draft.
 * Workflow: Generate assessment -> Call this tool with assessment text -> Follow with either `think` or `quick_think`.
 * Output: Confirms confidence gauging and level.
 */
server.tool(
	"gauge_confidence",
	"Meta-Cognitive Checkpoint. Guides *internal stating* of **confidence (High/Medium/Low) and justification** regarding a specific plan, analysis, or draft you just formulated. Call this tool *with* the text containing your confidence assessment. Follow with either `think` (for detailed analysis) or `quick_think` (for straightforward confirmation) based on the confidence level and complexity.",
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
			logToolResult(toolName, true, `Level: ${level}`);
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Confidence Details:\n${assessment_and_confidence}`);
			return { content: [{ type: "text" as const, text: assessment_and_confidence }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: chain_of_thought
 * Purpose: Guides *internal generation* of detailed, step-by-step reasoning draft (CoT).
 * Workflow: Generate CoT -> Call this tool with CoT text -> Follow with either `think` or `quick_think`.
 * Output: Returns the CoT text for analysis.
 */
server.tool(
	"chain_of_thought",
	"Guides *internal generation* of **detailed, step-by-step reasoning draft (CoT)**. Call this tool *with* the generated CoT text you created internally. Returns the CoT text. Follow with either `think` (for complex reasoning chains requiring detailed analysis) or `quick_think` (for straightforward reasoning steps) to process the CoT and plan next actions.",
	{
		generated_cot_text: z.string().describe("The **full, step-by-step Chain of Thought draft** you generated internally to solve or analyze the problem."),
		problem_statement: z.string().describe("The original problem statement or question this CoT addresses.")
	},
	async ({ generated_cot_text, problem_statement }) => {
		const toolName = 'chain_of_thought';
		logToolCall(toolName);
		try {
			if (!generated_cot_text || typeof generated_cot_text !== 'string' || !problem_statement || typeof problem_statement !== 'string') {
				throw new Error('Both generated_cot_text and problem_statement must be non-empty strings.');
			}

			if (!generated_cot_text.match(/step|phase|:\s|^\d+[\.\)]/im)) {
				throw new Error('Invalid CoT format: Must contain clear reasoning steps (numbered, labeled as steps/phases, or with clear delineation).');
			}

			logToolResult(toolName, true, `Problem: ${problem_statement.substring(0, 50)}...`);
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Details:\nProblem: ${problem_statement}\nReasoning:\n${generated_cot_text}`);
			return { content: [{ type: "text" as const, text: generated_cot_text }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: plan_and_solve
 * Purpose: Guides *internal generation* of a structured plan draft.
 * Workflow: Generate plan -> Call this tool with plan text -> Follow with either `think` or `quick_think`.
 * Output: Returns the plan text for analysis.
 */
server.tool(
	"plan_and_solve",
	"Guides *internal generation* of a **structured plan draft**. Call this tool *with* the generated plan text you created internally. Returns the plan text. Follow with either `think` (for complex plans requiring detailed analysis) or `quick_think` (for straightforward plans) to evaluate feasibility and confirm next steps.",
	{
		generated_plan_text: z.string().describe("The **full, structured plan draft** you generated internally, including goals, steps, potential external tool needs, assumptions, and risks."),
		task_objective: z.string().describe("The original high-level task objective this plan addresses.")
	},
	async ({ generated_plan_text, task_objective }) => {
		const toolName = 'plan_and_solve';
		logToolCall(toolName);
		try {
			if (!generated_plan_text || typeof generated_plan_text !== 'string' || !task_objective || typeof task_objective !== 'string') {
				throw new Error("Missing or invalid required parameters: 'generated_plan_text' and 'task_objective' must be non-empty strings.");
			}

			// Basic structure check (optional, less strict)
			// if (!generated_plan_text.match(/phase|step|goal|objective|:\\s|^\\d+[\\.\\)]/im)) {
			// 	console.warn(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Warning: Plan structure might be basic. Consider using clear steps/phases.`);
			// }

			// Removed strict validation for risk/challenge
			// if (!generated_plan_text.toLowerCase().includes('risk') && !generated_plan_text.toLowerCase().includes('challenge')) {
			// 	throw new Error("Invalid plan format: Must include risk/challenge assessment.");
			// }

			logToolResult(toolName, true, `Task: ${task_objective.substring(0, 50)}...`);
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Details:\nTask: ${task_objective}\nPlan:\n${generated_plan_text}`);
			// Return the plan text directly (potentially formatted as markdown if needed, but currently just text)
			return { content: [{ type: "text" as const, text: generated_plan_text }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: chain_of_draft
 * Purpose: Signals that internal drafts have been generated/refined using Chain of Draft (CoD) principles.
 * Workflow: Internally generate/refine concise draft(s) -> Call this tool -> Follow with either `think` or `quick_think`.
 * Best Practices from Research:
 * - Keep each draft step short (< 5 words) like human notes
 * - Use equations, symbols, or brief phrases instead of sentences
 * - Focus on essential information only
 * - End with #### followed by final answer/conclusion
 * Output: Returns markdown-formatted response with CoD guidance and next tool recommendation.
 */
server.tool(
	"chain_of_draft",
	"Signals that one or more **internal drafts** have been generated/refined using Chain of Draft (CoD) principles. CoD is an efficient prompting technique that uses concise, note-like drafts instead of full sentences. Best practices:\n- Keep each step short (< 5 words)\n- Use equations/symbols when possible\n- Focus on essential information\n- End with #### followed by conclusion\n\nCall this tool *after* generating/refining draft(s) internally. Returns markdown-formatted response with next tool recommendation. Follow with either `think` (for complex drafts requiring detailed analysis) or `quick_think` (for straightforward drafts) to evaluate and plan next steps.",
	{
		draft_description: z.string().describe("Brief but specific description of the draft(s) generated/refined internally (e.g., 'Initial API function - params defined', 'Error handling v2', 'README structure').")
	},
	async ({ draft_description }) => {
		const toolName = 'chain_of_draft';
		logToolCall(toolName, `Description: ${draft_description}`);
		try {
			if (!draft_description || typeof draft_description !== 'string' || draft_description.trim().length === 0) {
				throw new Error('Invalid draft_description: Must provide a description.');
			}

			logToolResult(toolName, true);
			return { content: [{ type: "text" as const, text: draft_description }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: reflection
 * Purpose: Guides *internal generation* of a critical self-evaluation (critique) on a prior step, draft, plan, or outcome.
 * Call this tool *with* the **generated critique text** you created internally.
 * Returns the critique text.
 * Follow with either `think` or `quick_think` to process the critique.
 */
server.tool(
	"reflection",
	"Guides *internal generation* of a critical self-evaluation (critique) on a prior step, draft, plan, or outcome. Call this tool *with* the **generated critique text** you created internally. Returns the critique text. Follow with either `think` (for complex critiques requiring detailed analysis) or `quick_think` (for straightforward critiques) to process the feedback and plan improvements.",
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
			logToolResult(toolName, true, `Critique length: ${generated_critique_text.length}`);
			return { content: [{ type: "text" as const, text: generated_critique_text }] };
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: synthesize_prior_reasoning
 * Purpose: Context Management Tool. Guides the *internal generation* of a structured summary of preceding context.
 * Workflow: Internally generate summary -> Call this tool *with* the summary text -> Follow with either `think` or `quick_think`.
 * Output: Returns the provided summary text for grounding and analysis.
 */
server.tool(
	"synthesize_prior_reasoning",
	"Context Management Tool. Guides *internal generation* of a **structured summary** of preceding steps, decisions, key findings, or relevant context to consolidate understanding before proceeding. Call this tool *with* the generated summary text you created internally. Returns the summary. Follow with either `think` (for complex context requiring detailed analysis) or `quick_think` (for straightforward context) to leverage this summary and inform next actions.",
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
			logToolResult(toolName, true, `Summary length: ${generated_summary_text.length}`);
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
		console.error(` ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Core Cognitive Tools Suite v0.9.12: Enables structured, iterative reasoning (Chain of Thought/Draft), planning, and analysis for AI agents, focusing on the cognitive loop. MANDATORY \`think\` step integrates results.`);
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