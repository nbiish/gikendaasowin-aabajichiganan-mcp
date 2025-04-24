#!/usr/bin/env node

/**
 * -----------------------------------------------------------------------------
 * Gikendaasowin Aabajichiganan - Agentic Cognitive Tools MCP Server (v2.0)
 *
 * Description: Provides cognitive tools for an AI agent based on the
 * Gikendaasowin Cognitive Framework (v7 Guidelines). Emphasizes
 * a mandatory structured deliberation cycle (Observe-Orient-Decide-Act)
 * performed *after* receiving information and *before* significant actions,
 * ideally using the `think` tool. Supports adaptive reasoning styles
 * (CoT, CoD/CRP, SCoT) and integrates with potentially dynamic toolsets,
 * including a preference for Executable Code Actions (CodeAct) if available.
 * Returns Markdown.
 *
 * Key Principles (v7 Alignment):
 * 1.  **Mandatory Deliberation:** A structured internal reasoning cycle is required
 * before non-trivial actions.
 * 2.  **Centralized Analysis (`think`):** The `think` tool is the preferred mechanism
 * for the mandatory deliberation cycle (analysis, planning, OODReAct structure).
 * 3.  **Adaptability:** Assumes the agent adapts to dynamically available tools.
 * 4.  **CodeAct Preference:** Aligns with agent preference for executable code actions.
 * 5.  **Adaptive Reasoning:** Supports CoT, CoD/CRP, SCoT styles within `think`.
 * 6.  **Traceability:** Logs tool usage; `think` tool provides reasoning trace.
 * 7.  **Markdown Output:** Tool results formatted as Markdown.
 *
 * Protocol:    Model Context Protocol (MCP) over stdio.
 * -----------------------------------------------------------------------------
 */

import { McpServer, ToolContent } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// --- Server Definition ---

const serverInfo = {
	name: "gikendaasowin-agentic-cognitive-tools-mcp",
	version: "2.0.0", // Version reflects alignment with v7 guidelines
	description: `ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Agentic Cognitive Tools (v2.0): Implements Gikendaasowin v7 Guidelines. Facilitates mandatory Observe-Orient-Decide-Act deliberation cycle (using 'think' tool) before actions. Supports adaptive reasoning (CoT, CoD/CRP, SCoT) and dynamic tool environments (incl. CodeAct preference). Returns Markdown.`
};
const server = new McpServer(serverInfo);

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
 * @returns An object matching the required MCP tool result structure containing the error message.
 */
function logToolError(toolName: string, error: unknown): { content: ToolContent[] } {
	const timestamp = new Date().toISOString();
	const errorMessage = error instanceof Error ? error.message : String(error);
	console.error(`[${timestamp}] [MCP Server] ! Tool Error: ${toolName} - ${errorMessage}`);
	logToolResult(toolName, false, errorMessage); // Log failure result as well
	// Return a structured error message suitable for the LLM, guiding towards the mandatory deliberation step
	return {
		content: [{
			type: "text" as const,
			text: `Error executing tool '${toolName}': ${errorMessage}. **Action Required:** Initiate the mandatory deliberation cycle (use the 'think' tool if available) to analyze this error (Observe/Orient), review context/goals, and plan the next corrective step (Decide/Reason/Act(Plan)).`
		}]
	};
}


// --- Core Cognitive Deliberation & Refinement Tools (Aligned with v7 Guidelines) ---

/**
 * Tool: assess_cuc_n_mode (Optional Initial Assessment)
 * Purpose: Optional initial assessment of task characteristics (Complexity, Uncertainty, Consequence, Novelty)
 * to *inform* the strategy for the mandatory deliberation cycle.
 * Workflow: Can be called *optionally* at the start of complex tasks to help frame the initial approach.
 * The primary, mandatory deliberation happens *later* using `think` or internally.
 * Output: Returns the assessment text formatted as Markdown.
 */
server.tool(
	"assess_cuc_n_mode",
	"**(Optional) Initial Task Assessment.** Evaluates task Complexity, Uncertainty, Consequence, Novelty (CUC-N) to *inform* the initial strategy. Call optionally before complex tasks. This assessment helps frame the mandatory deliberation cycle (which uses `think` or occurs internally) but does *not* replace it. Output is your assessment.",
	{
		assessment_text: z.string().describe("Your structured CUC-N assessment including: 1) Situation/Task Summary, 2) CUC-N Analysis (Low/Medium/High rationale), 3) Potential Strategy Considerations (e.g., 'Requires careful step-by-step planning via CoT', 'Efficiency via CoD/CRP seems appropriate', 'Need to prioritize CodeAct for file manipulation'). This informs, but does not dictate, the mandatory deliberation step.")
	},
	async ({ assessment_text }: { assessment_text: string }) => {
		const toolName = 'assess_cuc_n_mode';
		logToolCall(toolName);
		try {
			if (assessment_text.trim().length === 0) {
				throw new Error('Invalid assessment_text: Must be a non-empty string containing the CUC-N analysis.');
			}

			logToolResult(toolName, true, `Assessment logged (length: ${assessment_text.length})`);
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input:\n${assessment_text}`);

			// Return the assessment text directly
			return {
				content: [{
					type: "text" as const,
					text: assessment_text
				}]
			};
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: think (Mandatory Deliberation Hub)
 * Purpose: The **PREFERRED & CENTRAL HUB** for the **MANDATORY** structured deliberation cycle
 * (Observe-Orient-Decide-Act).
 * Workflow: **MUST** be called (if available) *after* receiving new information (tool results, CodeAct output/errors,
 * USER input, file reads) and *before* executing any non-trivial action (tool call, CodeAct execution,
 * complex response generation). Use it to analyze inputs, orient context/goals/policies, decide the next
 * action, reason (CoT, CoD/CRP, SCoT), plan the action details (tool params, CodeAct code), define
 * verification, and consider risks. Essential for reliability, error handling, and complex tasks.
 * Output: Returns the structured thought process itself, formatted as Markdown, serving as an internal log.
 */
server.tool(
	"think",
	"**Mandatory Deliberation Hub.** Use this tool (if available) for the required structured deliberation cycle *after* info and *before* action. Input MUST follow the OODReAct structure: ## Observe (analyze inputs/results/errors), ## Orient (context/goals/policy check), ## Decide (next action: tool, CodeAct, query, respond), ## Reason (justify decision; use CoT, CoD/CRP, or SCoT style), ## Act (Plan) (tool params, CodeAct code, response draft), ## Verification (success criteria), ## Risk & Contingency (briefly).",
	{
		thought: z.string().describe("Your **structured OODReAct deliberation**. MUST include all sections: Observe, Orient, Decide, Reason (using appropriate CoT/CoD/CRP/SCoT style), Act(Plan) (with specific tool parameters or CodeAct code), Verification, Risk & Contingency. This is critical for documenting the mandatory reasoning process before acting.")
	},
	async ({ thought }: { thought: string }) => {
		const toolName = 'think';
		logToolCall(toolName);

		try {
			// Basic validation: Check if it's non-empty and maybe contains expected markers
			if (thought.trim().length === 0) {
				throw new Error('Invalid thought: Must be a non-empty string.');
			}
			if (!thought.includes("## Observe:") || !thought.includes("## Orient:") || !thought.includes("## Decide:") || !thought.includes("## Reason:") || !thought.includes("## Act (Plan):")) {
				throw new Error('Invalid thought structure: Must contain required OODReAct sections (Observe, Orient, Decide, Reason, Act(Plan)).');
			}

			logToolResult(toolName, true, `Deliberation logged (length: ${thought.length})`);
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input:\n${thought}`);

			// Return the thought process itself as the result
			return {
				content: [{
					type: "text" as const,
					text: thought
				}]
			};
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);


/**
 * Tool: quick_think (Minimal Cognitive Step - Use With Extreme Caution)
 * Purpose: A minimal cognitive step ONLY for acknowledging *trivial*, *immediately obvious* successes or state transitions.
 * Workflow: **STRONGLY DISCOURAGED.** Use ONLY if the mandatory deliberation cycle (`think` or internal) is genuinely unnecessary
 * because the situation involves absolutely no analysis, planning, policy check, error handling, or complex reasoning.
 * Example: Confirming receipt of simple data before an already-planned trivial action.
 * **DO NOT USE** after most tool calls, CodeAct executions, or before any complex action - use `think` instead.
 * Output: Returns the brief thought text, formatted as Markdown.
 */
server.tool(
	"quick_think",
	"**(Use Sparingly/Discouraged) Minimal Cognitive Step.** Use ONLY for acknowledging *trivial successes* or confirming *obvious, pre-planned* simple steps where NO analysis/planning/policy check is needed (e.g., 'Data received, proceeding with planned step X'). **The mandatory deliberation cycle (`think` tool or internal) is required for almost all situations.** Prefer `think` after any tool/CodeAct output or error.",
	{
		brief_thought: z.string().describe("Your **extremely concise** confirmation for a truly trivial step (e.g., 'Trivial action X succeeded'). Must be non-empty but very short. DO NOT use for analysis, planning, error reflection, or complex reasoning - use the `think` tool for the mandatory deliberation cycle.")
	},
	async ({ brief_thought }: { brief_thought: string }) => {
		const toolName = 'quick_think';
		logToolCall(toolName);
		try {
			if (brief_thought.trim().length === 0) {
				throw new Error('Invalid brief_thought: Must be a non-empty string.');
			}
			// Optional stricter length check to enforce brevity
			if (brief_thought.length > 150) { // Example limit
				console.error(`[${new Date().toISOString()}] [MCP Server] WARNING: 'quick_think' input is long. Ensure 'think' wasn't more appropriate.`);
			}
			logToolResult(toolName, true, `Logged: ${brief_thought.substring(0, 80)}...`);
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input:\n${brief_thought}`);

			// Return the brief thought
			return {
				content: [{
					type: "text" as const,
					text: brief_thought
				}]
			};
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

// Setup signal handlers
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Setup global error handlers
process.on('uncaughtException', (error, origin) => {
	const timestamp = new Date().toISOString();
	console.error(`[${timestamp}] [MCP Server] FATAL: Uncaught Exception at: ${origin}`, error);
	shutdown().catch(() => process.exit(1)); // Attempt graceful shutdown
});

process.on('unhandledRejection', (reason, promise) => {
	const timestamp = new Date().toISOString();
	console.error(`[${timestamp}] [MCP Server] FATAL: Unhandled Promise Rejection:`, reason);
	shutdown().catch(() => process.exit(1)); // Attempt graceful shutdown
});

// --- Start the Server ---

/**
 * Initializes and starts the MCP server.
 */
async function main(): Promise<void> {
	try {
		const transport = new StdioServerTransport();
		await server.connect(transport);

		const border = '=====================================================';
		console.error(border);
		console.error(` ${serverInfo.description}`);
		console.error(` Version: ${serverInfo.version}`);
		console.error(` Aligned with Gikendaasowin v7 Agentic Guidelines`);
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

