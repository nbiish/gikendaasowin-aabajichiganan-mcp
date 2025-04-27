#!/usr/bin/env node

/**
 * -----------------------------------------------------------------------------
 * Gikendaasowin Aabajichiganan - Agentic Cognitive Tools MCP Server (v3.2)
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
 * v3.2 Enhancements:
 * - Expanded cognitive technique acronyms (OOReDAct, CoT, CoD/CR, SCoT)
 *   with brief explanations on first use in descriptions.
 * - Maintained internal system prompt framing.
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
	[key: string]: unknown; // Add index signature
}

// Define a simplified ToolContent union based on observed usage
type ToolContent = TextContent | ImageContent; // Add ResourceContent if needed later

// --- Server Definition ---

const serverInfo = {
	name: "gikendaasowin-agentic-cognitive-tools-mcp",
	version: "3.2.0", // Version reflects acronym expansion
	// Updated description with expanded acronyms
	description: `ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Agentic Cognitive Tools (v3.2): Implements Gikendaasowin v7 Guidelines. Enforces MANDATORY internal **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle: Starts with 'assess_and_orient', continues with 'think' deliberation before actions. Guides adaptive reasoning (**Chain-of-Thought (CoT)**, **Chain-of-Draft/Condensed Reasoning (CoD/CR)**, **Structured Chain-of-Thought (SCoT)**) & CodeAct preference. Returns Markdown.`
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
 * Logs an error during tool execution and formats a standard error response for the LLM,
 * guiding towards the mandatory internal deliberation cycle with expanded acronyms on first use.
 * @param toolName The name of the tool where the error occurred.
 * @param error The error object or message.
 * @returns An object matching the required MCP tool result structure containing the error message.
 */
function logToolError(toolName: string, error: unknown): { content: ToolContent[] } {
	const timestamp = new Date().toISOString();
	const errorMessage = error instanceof Error ? error.message : String(error);
	console.error(`[${timestamp}] [MCP Server] ! Tool Error: ${toolName} - ${errorMessage}`);
	logToolResult(toolName, false, errorMessage); // Log failure result as well
	// **Simplified Error Reporting:** Return only the core error message.
	return {
		content: [{
			type: "text" as const,
			// Simpler error message, removing corrective action guidance.
			text: `**TOOL EXECUTION ERROR in '${toolName}':** ${errorMessage}`
		}]
	};
}


// --- Core Cognitive Deliberation & Refinement Steps (v3.2 - Expanded Acronyms) ---

/**
 * Step: assess_and_orient (Mandatory Initial Assessment & Orientation)
 * Purpose: **Mandatory first step** for every new user request AND before any significant strategic pivot.
 * Establishes initial context by assessing task characteristics (Complexity, Uncertainty, Consequence, Novelty - CUC-N)
 * and performing the initial Observe/Orient steps of the **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle.
 * Workflow: **Perform this step** at the beginning of processing a user request or when changing overall approach.
 * Its output informs the *first* full OOReDAct cycle (`think` step).
 * Input: A single string provided by the LLM (treated as opaque data).
 * Output: The input string, returned verbatim.
 */
server.tool(
	"assess_and_orient",
	// **Internal Framing:** Expanded OOReDAct on first mention.
	"**Mandatory Initial Assessment & Orientation:** At the start of EVERY user request AND before any major change in strategy, you MUST perform this initial assessment and orientation. Analyze the request/situation using CUC-N (Complexity, Uncertainty, Consequence, Novelty) to perform the initial 'Observe' and 'Orient' steps of the **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle. This assessment is CRITICAL for grounding your subsequent reasoning and planning within the main OOReDAct cycle.",
	{
		// Input is a simple string, description reflects pass-through nature.
		assessment_and_orientation_text: z.string().describe("Provide the assessment/orientation text. This tool acts as a passthrough and will return the input verbatim without validation or modification.")
	},
	// Simplified handler: No validation, just return input.
	async ({ assessment_and_orientation_text }: { assessment_and_orientation_text: string }) => {
		const toolName = 'assess_and_orient';
		logToolCall(toolName);
		try {
			// No validation or processing - treat input as opaque string
			logToolResult(toolName, true, `Input received (length: ${assessment_and_orientation_text.length})`);
			// Log the raw input string
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input String:\n${assessment_and_orientation_text}`);
			// Return the input string directly
			return { content: [{ type: "text" as const, text: assessment_and_orientation_text }] };

		} catch (error: unknown) {
			// Catch only unexpected runtime errors
			return logToolError(toolName, error);
		}
	}
);

/**
 * Step: think (Mandatory OOReDAct Deliberation Cycle)
 * Purpose: The **REQUIRED & CENTRAL cognitive process** for the **MANDATORY** structured deliberation cycle
 * (**Observe-Orient-Reason-Decide-Act (OOReDAct)**).
 * Workflow: **You MUST perform this full, structured OOReDAct cycle** *after* the initial `assess_and_orient` step,
 * *after* receiving subsequent new information (tool results, CodeAct output/errors, USER input, file reads),
 * and *before* executing any non-trivial action or providing a final response. Use it to rigorously follow the OOReDAct
 * structure, document reasoning (adapting reasoning styles like **Chain-of-Thought (CoT)**, **Chain-of-Draft/Condensed Reasoning (CoD/CR)**,
 * or **Structured Chain-of-Thought (SCoT)** as needed), decide the next step, and plan actions precisely.
 * Input: A single string provided by the LLM (treated as opaque data).
 * Output: The input string, returned verbatim.
 */
server.tool(
	"think",
	// **Internal Framing:** Expanded OOReDAct, CoT, CoD/CR, SCoT on first mention in this tool's description.
	"**Mandatory OOReDAct Deliberation Cycle:** You MUST perform the full, structured **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle *after* the initial `assess_and_orient` step, *after* receiving new information (tool/CodeAct results, errors, USER input), and *before* any non-trivial action or final response. Follow the complete OOReDAct structure, adapting your reasoning style within the 'Reason' step (e.g., using detailed **Chain-of-Thought (CoT)** for complexity, concise **Chain-of-Draft/Condensed Reasoning (CoD/CR)** for efficiency, or **Structured Chain-of-Thought (SCoT)** for planning/code) for reliable, verifiable, and adaptive behavior.",
	{
		// Input is a simple string, description reflects pass-through nature.
		thought: z.string().describe("Provide the OOReDAct deliberation text. This tool acts as a passthrough and will return the input verbatim without validation or modification.")
	},
	// Simplified handler: No validation, just return input.
	async ({ thought }: { thought: string }) => {
		const toolName = 'think';
		logToolCall(toolName);
		try {
			// No validation or processing - treat input as opaque string
			logToolResult(toolName, true, `Input received (length: ${thought.length})`);
			// Log the raw input string
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input String:\n${thought}`);
			// Return the input string directly
			return { content: [{ type: "text" as const, text: thought }] };

		} catch (error: unknown) {
			// Catch only unexpected runtime errors
			return logToolError(toolName, error);
		}
	}
);


/**
 * Step: quick_think (Minimal Cognitive Acknowledgement)
 * Purpose: For acknowledging *simple, expected, non-problematic* outcomes ONLY, where the next step is
 * *already clearly defined* by a prior **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle (`think` step)
 * and requires NO re-evaluation or adaptation.
 * Workflow: Use sparingly to maintain cognitive flow in straightforward sequences. **Does NOT replace the mandatory OOReDAct cycle**.
 * The full OOReDAct cycle (`think` step) is MANDATORY for handling new information, errors, planning changes,
 * or any step requiring analysis or decision-making.
 * Input: A single string provided by the LLM (treated as opaque data).
 * Output: The brief acknowledgement text (Markdown).
 */
server.tool(
	"quick_think",
	// **Internal Framing:** Expanded OOReDAct on first mention here.
	"**Minimal Cognitive Acknowledgement:** Use ONLY for acknowledging *simple, expected, non-problematic* outcomes (e.g., 'Data fetch OK, proceeding with planned analysis') where the next step is *already determined* by a prior **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle (`think` step) and needs NO re-evaluation. Helps maintain flow in simple sequences. **This step DOES NOT satisfy the mandatory OOReDAct deliberation requirement.** Perform the full OOReDAct cycle (`think` step) for any analysis, planning, reasoning, error handling, or decision making.",
	{
		// Input is a simple string, description reflects pass-through nature.
		brief_thought: z.string().describe("Provide the brief acknowledgement text. This tool acts as a passthrough and will return the input verbatim without validation or modification.")
	},
	// Simplified handler: No validation, just return input.
	async ({ brief_thought }: { brief_thought: string }) => {
		const toolName = 'quick_think';
		logToolCall(toolName);
		try {
			// No validation or processing - treat input as opaque string
			logToolResult(toolName, true, `Input received (length: ${brief_thought.length})`);
			// Log the raw input string
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input String:\n${brief_thought}`);
			// Return the input string directly
			return { content: [{ type: "text" as const, text: brief_thought }] };

		} catch (error: unknown) {
			// Catch only unexpected runtime errors
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: mental_sandbox (Mental Sandbox Simulation Logging)
 * Purpose: **Mandatory Step** for logging the internal cognitive simulation (`<sandbox>`) BEFORE any non-trivial output,
 * plan, decision, or action, encompassing steps like Hypothesis Generation/Testing, Constraint Checks,
 * Confidence Scoring, and Pre-computational Analysis.
 * Workflow: Invoke this tool to record the detailed simulation text. The tool functions as a passthrough,
 * returning the provided text verbatim without modification.
 * Input: A single string containing the detailed sandbox simulation text.
 * Output: The input string, returned verbatim.
 */
server.tool(
	"mental_sandbox",
	// **Internal Framing:** Tool for logging the mandatory sandbox simulation.
	"**Mandatory Mental Sandbox Simulation Logging:** Use this tool BEFORE any non-trivial output/plan/decision/action to log the mandatory internal `<sandbox>` simulation (Hypothesis Testing, Constraint Checks, Confidence, Pre-computation, etc.) as per operational directives. This tool acts as a passthrough and returns the provided simulation text verbatim.",
	{
		// Input is a simple string, description reflects pass-through nature.
		sandbox_content: z.string().describe("Provide the sandbox simulation text. This tool acts as a passthrough and will return the input verbatim without validation or modification.")
	},
	// Simplified handler: No validation, just return input.
	async ({ sandbox_content }: { sandbox_content: string }) => {
		const toolName = 'mental_sandbox';
		logToolCall(toolName);
		try {
			// No validation or processing - treat input as opaque string
			logToolResult(toolName, true, `Input received (length: ${sandbox_content.length})`);
			// Log the raw input string
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input String:\n${sandbox_content}`);
			// Return the input string directly
			return { content: [{ type: "text" as const, text: sandbox_content }] };

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
		console.error(` Enforcing Gikendaasowin v7 Guidelines with Internal OOReDAct Cycle`);
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