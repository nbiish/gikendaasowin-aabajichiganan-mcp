#!/usr/bin/env node

/**
 * -----------------------------------------------------------------------------
 * Gikendaasowin Aabajichiganan - Agentic Cognitive Tools MCP Server (v3.4)
 *
 * Description: Provides cognitive tools implementing the Gikendaasowin v7
 * Agentic Operational Guidelines. Enforces a mandatory structured
 * deliberation cycle, **Observe-Orient-Reason-Decide-Act (OOReDAct)**, via
 * internal cognitive steps, initiated by mandatory assessment/orientation.
 * Guides adaptive reasoning using techniques like **Chain-of-Thought (CoT)**,
 * **Chain-of-Draft/Condensed Reasoning (CoD/CR)**, and **Structured
 * Chain-of-Thought (SCoT)**. Aligns with dynamic tool environments,
 * including CodeAct preference. Returns Markdown.
 *
 * v3.4 Enhancements:
 * - Enhanced the description of the `deliberate` tool to be expertly verbose,
 *   explaining the prompting techniques (CoT, CoD/CR, SCoT) before using acronyms,
 *   drawing from the provided research context for professional precision.
 * - Maintained tooling compression, internal system prompt framing, and
 *   expanded cognitive technique acronyms (with explanations on first use in
 *   the main server description).
 * - Simplified error reporting.
 * -----------------------------------------------------------------------------
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// --- Local Type Definitions (Workaround) ---
interface TextContent {
	type: "text";
	text: string;
	[key: string]: unknown; // Add index signature
}

interface ImageContent {
	type: "image";
	data: string; // Base64 encoded
	mimeType: string;
	[key: string]: unknown[] | string | undefined; // Add index signature
}

// Define a simplified ToolContent union based on observed usage
type ToolContent = TextContent | ImageContent; // Add ResourceContent if needed later

// --- Server Definition ---

const serverInfo = {
	name: "gikendaasowin-agentic-cognitive-tools-mcp",
	version: "3.4.0", // Version reflects enhanced tool description verbosity
	// Updated description with consolidated tooling and expanded acronyms
	description: `ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Agentic Cognitive Tools (v3.4): Implements Gikendaasowin v7 Guidelines. Enforces MANDATORY internal **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle using the unified 'deliberate' tool. Starts with initial assessment/orientation, continues with structured deliberation and mandatory mental sandbox logging before actions. Guides adaptive reasoning (**Chain-of-Thought (CoT)**: step-by-step natural language reasoning; **Chain-of-Draft/Condensed Reasoning (CoD/CR)**: iterative refinement/concise steps; **Structured Chain-of-Thought (SCoT)**: reasoning incorporating program structures/plans) & CodeAct preference. Returns Markdown.`
};
const server = new McpServer(serverInfo);

// --- Logging Helpers (Internal - No changes needed) ---

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

// --- Consolidated Cognitive Deliberation & Refinement Step (v3.4) ---

/**
 * Tool: deliberate (Unified Cognitive Process)
 * Purpose: The **REQUIRED & CENTRAL cognitive process** for the **MANDATORY** structured deliberation cycle
 * (**Observe-Orient-Reason-Decide-Act (OOReDAct)**). This tool consolidates the functionality of
 * `assess_and_orient`, `think`, `quick_think`, and `mental_sandbox` into a single, flexible interface.
 * Workflow: **You MUST use this tool** for:
 * 1. Initial assessment and orientation (`stage: "orient"`).
 * 2. Full, structured OOReDAct deliberation after receiving new information or before non-trivial actions (`stage: "reason"`).
 * 3. Brief cognitive acknowledgement of simple, expected outcomes (`stage: "acknowledge"`).
 * 4. Logging the mandatory mental sandbox simulation before actions (`stage: "sandbox"`).
 * Adapt your reasoning style within the 'Reason' stage using techniques like Chain-of-Thought, Chain-of-Draft/Condensed Reasoning, or Structured Chain-of-Thought.
 * Input: An object containing the stage and corresponding cognitive content.
 * Output: The provided content, returned verbatim.
 */
server.tool(
	"deliberate",
	// Expertly verbose description explaining techniques before acronyms
	"**Unified Cognitive Process (Mandatory):** This is your REQUIRED tool for ALL internal cognitive steps, enforcing the **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle. Use `stage: \"orient\"` for the MANDATORY initial assessment (Complexity, Uncertainty, Consequence, Novelty - CUC-N) and OOReDAct Observe/Orient steps at the start of ANY task or strategic pivot. Use `stage: \"reason\"` for the MANDATORY full OOReDAct deliberation cycle after receiving new information (tool/CodeAct results, errors, USER input) and BEFORE any non-trivial action or final response. Within the 'Reason' stage, adapt your reasoning style for optimal performance: employ **Chain-of-Thought** (step-by-step natural language reasoning for complex problems, enhancing accuracy), **Chain-of-Draft/Condensed Reasoning** (iterative refinement or concise steps for efficiency), or **Structured Chain-of-Thought** (reasoning that explicitly incorporates program structures, plans, or structured steps, particularly effective for code generation and structured tasks). Use `stage: \"acknowledge\"` ONLY for brief acknowledgements of simple, expected outcomes where the next step is already clearly defined by a prior 'reason' stage and needs NO re-evaluation. Use `stage: \"sandbox\"` to log the MANDATORY internal `<sandbox>` simulation (Hypothesis Testing, Constraint Checks, Confidence Scoring, Pre-computation, etc.) BEFORE any non-trivial output, plan, decision, or action, as per operational directives. This tool acts as a passthrough, returning the provided content verbatim.",
	z.object({
		stage: z.enum(["orient", "reason", "acknowledge", "sandbox"]).describe("The current stage of the cognitive process."),
		content: z.string().describe("The cognitive content for the specified stage (assessment, deliberation, acknowledgement, or sandbox simulation text). This tool acts as a passthrough.")
	}).shape,
	async ({ stage, content }: { stage: "orient" | "reason" | "acknowledge" | "sandbox", content: string }) => {
		const toolName = 'deliberate';
		logToolCall(toolName, `Stage: ${stage}`);
		try {
			// Treat input as opaque string for the specified stage
			logToolResult(toolName, true, `Stage: ${stage}, Input received (length: ${content.length})`);
			// Log the raw input string with stage context
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} (${stage}) Input String:\n${content}`);
			// Return the input string directly
			return { content: [{ type: "text" as const, text: content }] };

		} catch (error: unknown) {
			// Catch only unexpected runtime errors
			return logToolError(toolName, error);
		}
	}
);

// --- Server Lifecycle and Error Handling (Internal - No changes needed) ---
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
	shutdown().catch(() => process.exit(1));
});

process.on('unhandledRejection', (reason, promise) => {
	const timestamp = new Date().toISOString();
	console.error(`[${timestamp}] [MCP Server] FATAL: Unhandled Promise Rejection:`, reason);
	shutdown().catch(() => process.exit(1));
});

// --- Start the Server (Internal - No changes needed) ---

/**
 * Initializes and starts the MCP server.
 */
async function main(): Promise<void> {
	try {
		const transport = new StdioServerTransport();
		await server.connect(transport);

		const border = '=====================================================';
		console.error(border);
		console.error(` ${serverInfo.description}`); // Uses updated description
		console.error(` Version: ${serverInfo.version}`);
		console.error(` Enforcing Gikendaasowin v7 Guidelines with Unified 'deliberate' Tool`);
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