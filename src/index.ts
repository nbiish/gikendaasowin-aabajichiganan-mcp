#!/usr/bin/env node

/**
 * -----------------------------------------------------------------------------
 * Gikendaasowin Aabajichiganan - Advanced Agentic Cognitive Orchestration MCP Server (v3.5)
 *
 * Description: Provides cognitive tools implementing the Gikendaasowin v7
 * Agentic Operational Guidelines. Enforces a mandatory structured
 * deliberation cycle, **Observe-Orient-Reason-Decide-Act (OOReDAct)**, via
 * the unified 'deliberate' tool. This tool guides the LLM through sophisticated
 * cognitive orchestration, including CUC-N assessment, knowledge gap
 * identification, advanced reasoning (CoT, PS, SCoT, CoD/CR), self-critique
 * elements, and pre-action sandbox simulation. Aligns with dynamic tool
 * environments, including CodeAct preference. Returns Markdown.
 *
 * v3.5 Enhancements:
 * - Updated server version to 3.5.0.
 * - Enhanced `serverInfo.description` to reflect broader cognitive strategies.
 * - Significantly expanded the `deliberate` tool's description to provide
 * expertly verbose and detailed guidance on applying advanced cognitive
 * techniques (PS, Self-Refine/ToT spirit, PoT/PAL identification)
 * within the OOReDAct stages, drawing heavily from advanced prompting research.
 * - Maintained tooling compression, internal system prompt framing, and
 * passthrough nature of the 'deliberate' tool.
 * - Simplified error reporting remains.
 * -----------------------------------------------------------------------------
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { TextContent, ImageContent } from "@modelcontextprotocol/sdk/types.js";

// Define a simplified ToolContent union based on observed usage
type ToolContent = TextContent | ImageContent; // Add ResourceContent if needed later

// --- Server Definition ---

const serverInfo = {
	name: "gikendaasowin-aabajichiganan-mcp",
	version: "3.5.0", // Version reflects significantly enhanced cognitive guidance
	// Updated description with consolidated tooling and expanded cognitive technique guidance
	description: `ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Advanced Agentic Cognitive Orchestration MCP (v3.5): Implements Gikendaasowin v7 Guidelines. Enforces a MANDATORY internal **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle via the unified 'deliberate' tool. This tool guides the LLM through sophisticated cognitive orchestration, including: initial CUC-N assessment and orientation; structured deliberation using advanced reasoning strategies such as **Chain-of-Thought (CoT)** (sequential reasoning), **Plan-and-Solve (PS)** (task decomposition and execution), **Chain-of-Draft/Condensed Reasoning (CoD/CR)** (iterative refinement), and **Structured Chain-of-Thought (SCoT)** (integrating programmatic or plan-based structures); and mandatory mental sandbox simulation with elements of self-critique before action. Emphasizes CodeAct preference for external tasks and returns Markdown.`
};
const server = new McpServer(serverInfo);

// --- Logging Helpers (Internal - No changes needed as per user comments) ---

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
 * @returns An object matching the required MCP tool result structure containing the error message.
 */
function logToolError(toolName: string, error: unknown): { content: ToolContent[] } {
	const timestamp = new Date().toISOString();
	const errorMessage = error instanceof Error ? error.message : String(error);
	console.error(`[${timestamp}] [MCP Server] ! Tool Error: ${toolName} - ${errorMessage}`);
	logToolResult(toolName, false, errorMessage); // Log failure result as well
	// Simplified Error Reporting: Return only the core error message.
	return {
		content: [{
			type: "text" as const,
			text: `**TOOL EXECUTION ERROR in '${toolName}':** ${errorMessage}`
		}]
	};
}

// --- Consolidated Cognitive Deliberation & Refinement Step (v3.5) ---

/**
 * Tool: deliberate (Unified Cognitive Process)
 * 
 * **Orchestrated Cognitive Deliberation (MANDATORY & UNIFIED):** This is your REQUIRED and CENTRAL tool for ALL internal cognitive operations, rigorously enforcing the **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle. Adherence is paramount for Gikendaasowin v7 compliance.
 *
 * **Stages & Cognitive Techniques:**
 *
 * * **`stage: "orient"` (OOReDAct: Observe & Orient - MANDATORY START):**
 *     * **Purpose:** At the absolute beginning of ANY new task, sub-task, or significant strategic pivot, you MUST use this stage.
 *     * **Content Requirements:** Perform a comprehensive initial assessment:
 *         1.  **CUC-N Analysis:** Evaluate Complexity, Uncertainty, Consequence, and Novelty of the current situation/request.
 *         2.  **Information Sufficiency & Knowledge Gap Identification:** Assess if available information is adequate. Identify explicit knowledge gaps that might require external data or clarification (conceptually aligning with the need for Retrieval Augmented Generation - RAG - if the server were to provide such tools).
 *         3.  **Initial Hypothesis Formulation:** Based on the CUC-N and information assessment, formulate initial hypotheses or potential approaches.
 *         4.  **Goal Clarification:** Clearly define the immediate objective for this phase of deliberation.
 *     * This stage establishes critical context and grounds all subsequent reasoning.
 *
 * * **`stage: "reason"` (OOReDAct: Reason & Decide - MANDATORY DELIBERATION):**
 *     * **Purpose:** After the initial `orient` stage, and CRITICALLY after receiving ANY new information (tool results, CodeAct outputs/errors, user input, file contents, etc.), and BEFORE any non-trivial action, decision, or final response, you MUST use this stage for full, structured deliberation.
 *     * **Content Requirements - Adaptive Reasoning Strategies:** Within your `content` for this stage, clearly articulate your reasoning process using one or more of the following, selecting the most appropriate for the sub-task's nature:
 *         1.  **Chain-of-Thought (CoT):** For problems requiring detailed, sequential natural language reasoning. Break down the problem into explicit intermediate steps. Explain your logic at each step to ensure clarity and verifiability.
 *         2.  **Plan-and-Solve (PS) Prompting:** For complex tasks, first devise a multi-step plan (decompose the main task into smaller, ordered sub-tasks). Then, articulate the execution of each sub-task according to the plan. This is often preferred for structured problem-solving.
 *         3.  **Structured Chain-of-Thought (SCoT):** When the problem involves code generation, algorithmic thinking, or highly structured outputs, explicitly incorporate program structures (sequences, branches, loops), data schemas, or formal plan outlines into your reasoning steps.
 *         4.  **Chain-of-Draft/Condensed Reasoning (CoD/CR):** For iterative refinement or when a full CoT/PS is too verbose for a simpler sub-problem (that still requires thought), generate a concise draft of reasoning, then critically review and condense it, or iterate through drafts if necessary.
 *         5.  **Critical Evaluation & Refinement (Self-Refine Spirit):** Throughout your reasoning, pause to critically evaluate your own intermediate conclusions or plans. Identify potential flaws, biases, or areas for improvement and articulate these refinements.
 *         6.  **(For Highly Complex/Ambiguous Scenarios - Tree of Thoughts (ToT) Spirit):** If faced with significant ambiguity or multiple viable solution paths, briefly outline alternative lines of reasoning and justify your chosen path or why others were discarded. This involves exploring diverse solution pathways and evaluating them.
 *         7.  **Computational Offloading Identification (Program of Thoughts (PoT)/Program-aided Language Models (PAL) Spirit):** If your reasoning identifies steps that require precise calculation or complex symbolic manipulation beyond reliable LLM capabilities, explicitly note these as candidates for potential offloading to a dedicated computational tool if such a tool were available/invoked subsequently.
 *
 * * **`stage: "sandbox"` (OOReDAct: Decide & Pre-Act Simulation - MANDATORY PRE-ACTION):**
 *     * **Purpose:** BEFORE committing to any non-trivial output (including final responses, plans, or CodeAct generation), you MUST use this stage to log your internal mental sandbox simulation.
 *     * **Content Requirements:** Detail your simulation, including:
 *         1.  **Hypothesis Testing:** Test the chosen plan/action against constraints, goals, and potential edge cases.
 *         2.  **Pre-Mortem Analysis:** Briefly consider potential failure modes of your intended action/response and how they might be mitigated.
 *         3.  **Confidence Scoring & Justification:** State your confidence level in the proposed action/response and briefly justify it based on the deliberation and sandbox simulation.
 *         4.  **Parameter/Code Dry Run (if applicable):** If preparing for CodeAct or a tool call with parameters, mentally (or by outlining) "dry run" the core logic.
 *
 * * **`stage: "acknowledge"` (OOReDAct: Act - LIMITED USE):**
 *     * **Purpose:** Use this stage **SPARINGLY**. It is ONLY for brief, verbatim acknowledgements of simple, expected, and non-problematic outcomes from a *prior* step (e.g., "System status confirmed normal, proceeding with previously reasoned backup sequence.") where the next action is *already unequivocally defined* by a comprehensive preceding `reason` and `sandbox` stage and requires NO further evaluation or adaptation.
 *     * **This stage DOES NOT substitute for a full `reason` or `sandbox` cycle when new information is processed or a non-trivial decision is made.**
 *
 * **General Directives:**
 * * This `deliberate` tool acts as a passthrough; your `content` is returned verbatim for your own verification and state tracking.
 * * The choice of reasoning strategy within the `reason` stage should be dynamic and justified by the task's specific demands.
 * * Strict adherence to this structured deliberation protocol is essential for robust, verifiable, and adaptive agent performance.
 *     Acronym Key: CUC-N (Complexity, Uncertainty, Consequence, Novelty), CoT (Chain-of-Thought), PS (Plan-and-Solve), SCoT (Structured Chain-of-Thought), CoD/CR (Chain-of-Draft/Condensed Reasoning), RAG (Retrieval Augmented Generation), ToT (Tree of Thoughts), PoT (Program of Thoughts), PAL (Program-aided Language Models).
 */
server.tool(
	"deliberate",
	{
		stage: z.enum(["orient", "reason", "acknowledge", "sandbox"]).describe("The current stage of the OOReDAct cognitive process."),
		content: z.string().describe("The detailed cognitive content for the specified stage (e.g., CUC-N assessment, CoT reasoning, PS plan, sandbox simulation text). This tool acts as a passthrough, returning your content verbatim.")
	},
	async ({ stage, content }: { stage: "orient" | "reason" | "acknowledge" | "sandbox", content: string }) => {
		const toolName = 'deliberate';
		logToolCall(toolName, `Stage: ${stage}`);
		try {
			// Treat input as opaque string for the specified stage
			// The detailed guidance on how to structure this string is in the tool description.
			logToolResult(toolName, true, `Stage: ${stage}, Input received (length: ${content.length})`);
			// Log the raw input string with stage context for server-side auditing
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} (${stage}) Input String:\n${content}`);
			// Return the input string directly, as per passthrough design
			return { content: [{ type: "text" as const, text: content }] };

		} catch (error: unknown) {
			// Catch only unexpected runtime errors within this passthrough logic
			return logToolError(toolName, error);
		}
	}
);

// --- Server Lifecycle and Error Handling (Internal - No changes needed as per user comments) ---
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

// Setup signal handlers
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Setup global error handlers
process.on('uncaughtException', (error, origin) => {
	const timestamp = new Date().toISOString();
	console.error(`[${timestamp}] [MCP Server] FATAL: Uncaught Exception at: ${origin}`, error);
	shutdown().catch(() => process.exit(1)); // Attempt graceful shutdown, then force exit
});

process.on('unhandledRejection', (reason, promise) => {
	const timestamp = new Date().toISOString();
	console.error(`[${timestamp}] [MCP Server] FATAL: Unhandled Promise Rejection:`, reason);
	shutdown().catch(() => process.exit(1)); // Attempt graceful shutdown, then force exit
});

// --- Start the Server (Internal - No changes needed as per user comments) ---

/**
 * Initializes and starts the MCP server.
 */
async function main(): Promise<void> {
	try {
		const transport = new StdioServerTransport();
		await server.connect(transport);

		const border = '======================================================================'; // Adjusted border for new desc length
		console.error(border);
		console.error(` ${serverInfo.description}`); // Uses updated description
		console.error(` Version: ${serverInfo.version}`);
		console.error(` Enforcing Gikendaasowin v7 Guidelines with Enhanced Unified 'deliberate' Tool`);
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
