#!/usr/bin/env node

/**
 * -----------------------------------------------------------------------------
 * Gikendaasowin Aabajichiganan - Core INTERNAL Cognitive Tools (v4)
 *
 * Description: Provides a mandatory internal suite of cognitive tools for an AI
 *              agent, heavily emphasizing the `think` tool as the central reasoning
 *              engine, guided by SOTA prompting principles (structured thought, CoT).
 *              These tools are STRICTLY for internal deliberation and logging.
 *
 * Key Principles:
 * 1.  **Internal Use Only:** Tools (`assess_cuc_n_mode`, `think`, `quick_think`)
 *     are part of the agent's internal cognitive loop and MUST NOT be exposed to the user.
 * 2.  **Mandatory `think` Hub:** `think` is the required tool for all non-trivial
 *     analysis, planning, reasoning (CoT/CoD), reflection, and error handling.
 * 3.  **Structured Reasoning:** Prompts enforce structured input (OODReAct for `think`).
 * 4.  **Traceability:** All internal tool inputs are logged for debugging and analysis.
 * 5.  **Log Output:** Tools return their input formatted as a Markdown log entry.
 *
 * Protocol:    Model Context Protocol (MCP) over stdio.
 * -----------------------------------------------------------------------------
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// --- Server Definition ---

const serverInfo = {
	name: "gikendaasowin-aabajichiganan-mcp-internal", // Keep internal marker
	version: "4.0.0", // Increment version
	description: `ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Core INTERNAL Cognitive Tools Suite (v4): MANDATORY Assess/Think loop for internal reasoning ONLY. Enforces structured 'think' via OODReAct. Returns internal Markdown log.`
};
const server = new McpServer(serverInfo);

// --- Logging Helpers ---

/**
 * Logs an incoming INTERNAL tool call to stderr.
 * @param toolName The name of the internal tool being called.
 * @param details Optional additional details about the call.
 */
function logToolCall(toolName: string, details?: string): void {
	const timestamp = new Date().toISOString();
	console.error(`[${timestamp}] [MCP Server - INTERNAL] > Tool Call: ${toolName}${details ? ` - ${details}` : ''}`);
}

/**
 * Logs the result (success or failure) of an INTERNAL tool execution to stderr.
 * @param toolName The name of the internal tool executed.
 * @param success Whether the execution was successful.
 * @param resultDetails Optional details about the result.
 */
function logToolResult(toolName: string, success: boolean, resultDetails?: string): void {
	const timestamp = new Date().toISOString();
	console.error(`[${timestamp}] [MCP Server - INTERNAL] < Tool Result: ${toolName} - ${success ? 'Success' : 'Failure'}${resultDetails ? ` - ${resultDetails}` : ''}`);
}

/**
 * Logs an error during INTERNAL tool execution and formats an error response for the LLM.
 * Guides the LLM to use the 'think' tool for analysis.
 * @param toolName The name of the internal tool where the error occurred.
 * @param error The error object or message.
 * @returns An object matching the required MCP tool result structure containing the error message.
 */
function logToolError(toolName: string, error: unknown) {
	const timestamp = new Date().toISOString();
	const errorMessage = error instanceof Error ? error.message : String(error);
	console.error(`[${timestamp}] [MCP Server - INTERNAL] ! Tool Error: ${toolName} - ${errorMessage}`);
	logToolResult(toolName, false, errorMessage); // Log failure result

	// Return a structured error message guiding the next internal step
	return {
		content: [{
			type: "text" as const,
			// Explicitly direct the next step to be analysis via 'think'
			text: `INTERNAL Tool Execution Failed:\nTool: ${toolName}\nError: ${errorMessage}\n\n**Action Required: Immediately use the 'think' tool to analyze this failure (Observe, Orient, Decide, Reason...) before proceeding.**`
		}]
	};
}


// --- Core INTERNAL Cognitive Deliberation & Refinement Tools ---

/**
 * Tool: assess_cuc_n_mode (Internal Pre-computation)
 * Purpose: Mandatory internal assessment of task CUC-N to determine required cognitive depth and select the next internal tool (`think` or `quick_think`).
 * Workflow: Call internally BEFORE starting any non-trivial task or request. Output selection is binding.
 * Output: Returns the assessment text formatted as Markdown log, confirming the mandatory next internal step.
 */
server.tool(
	"assess_cuc_n_mode",
	"**INTERNAL Use Only.** Mandatory Initial Assessment. Evaluates task CUC-N. MUST explicitly state 'Selected Mode: think' or 'Selected Mode: quick_think' which dictates the required next internal step. This assessment guides internal processing ONLY.",
	{
		assessment_and_choice: z.string().min(1, "Assessment cannot be empty.") // Ensure non-empty
			.includes("Selected Mode:", { message: "Assessment MUST include 'Selected Mode: think' or 'Selected Mode: quick_think'." }) // Enforce selection presence
			.describe("Your internal structured CUC-N assessment (Situation, Ratings, Rationale, Strategy) concluding with the MANDATORY 'Selected Mode: think' or 'Selected Mode: quick_think' line. This dictates the next internal tool call.")
	},
	async ({ assessment_and_choice }: { assessment_and_choice: string }) => {
		const toolName = 'assess_cuc_n_mode';
		logToolCall(toolName);
		try {
			// Zod validation now handles non-empty and presence of "Selected Mode:"
			const modeRegex = /Selected Mode: (think|quick_think)/i;
			const modeMatch = assessment_and_choice.match(modeRegex);
			// We rely on Zod to ensure modeMatch is not null due to .includes check, but double-check for robustness
			if (!modeMatch) {
				 throw new Error("Internal validation failed: 'Selected Mode:' found but couldn't extract 'think' or 'quick_think'. Input was: " + assessment_and_choice);
			}
			const selectedMode = modeMatch[1].toLowerCase();

			logToolResult(toolName, true, `Mandatory next internal mode: ${selectedMode}`);
			console.error(`[${new Date().toISOString()}] [MCP Server - INTERNAL] - ${toolName} Input:\n${assessment_and_choice}`);

			// Return the assessment text as a log/confirmation
			return {
				content: [{
					type: "text" as const,
					// Clarify the output's purpose
					text: `Internal CUC-N Assessment Logged. Mandatory Next Step: ${selectedMode}\n---\nAssessment Details:\n${assessment_and_choice}`
				}]
			};
		} catch (error: unknown) {
			// Catch Zod errors or other exceptions
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: think (Primary Internal Reasoning Engine - MANDATORY HUB)
 * Purpose: The **central, mandatory hub** for ALL significant internal cognitive work (analysis, planning, CoT/CoD reasoning, reflection, error handling). Internal use ONLY.
 * Workflow: Use whenever required by `assess_cuc_n_mode`, after receiving non-trivial tool results/errors, or before complex external actions. MUST follow OODReAct structure.
 * Output: Returns the structured thought text itself as a Markdown log entry.
 */
server.tool(
	"think",
	"**INTERNAL Use Only. Mandatory Central Hub for Reasoning.** Use for ALL internal analysis, planning, CoT/CoD reasoning, reflection, error handling. MUST use OODReAct structure (Observe, Orient, Decide, Reason, Act, Verification, Risk, Learning).",
	{
		thought: z.string().min(10, "Thought must contain substantive reasoning.") // Require minimum length
			// Enforce presence of key OODReAct sections for structure
			.includes("## Observe:", { message: "Thought MUST include '## Observe:' section." })
			.includes("## Orient:", { message: "Thought MUST include '## Orient:' section." })
			.includes("## Decide:", { message: "Thought MUST include '## Decide:' section." })
			.includes("## Reason:", { message: "Thought MUST include '## Reason:' section where CoT/CoD happens." })
			// Add more checks as needed (Act, Verification, etc.) if strict enforcement is desired
			// .includes("## Act:", "Thought MUST include '## Act:' section.")
			// .includes("## Verification:", "Thought MUST include '## Verification:' section.")
			// .includes("## Risk & Contingency:", "Thought MUST include '## Risk & Contingency:' section.")
			// .includes("## Learning & Adaptation:", "Thought MUST include '## Learning & Adaptation:' section.")
			.describe("Your **detailed internal monologue** STRICTLY following the OODReAct structure. Cover analysis (Observe), context (Orient), next step (Decide), detailed rationale/CoT/CoD (Reason), execution plan (Act), success checks (Verification), risks (Risk), and learning (Learning). This is purely for internal reasoning.")
	},
	async ({ thought }: { thought: string }) => {
		const toolName = 'think';
		logToolCall(toolName);
		try {
			// Zod validation handles non-empty and key section presence checks
			logToolResult(toolName, true, `Internal thought logged (length: ${thought.length})`);
			console.error(`[${new Date().toISOString()}] [MCP Server - INTERNAL] - ${toolName} Input:\n${thought}`);

			// Return the thought text as a log entry
			return {
				content: [{
					type: "text" as const,
					text: `Internal Thought Logged (OODReAct Structure):\n---\n${thought}` // Added prefix and structure reminder
				}]
			};
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: quick_think (Internal Trivial Checkpoint - RARE USE)
 * Purpose: An internal-only lightweight confirmation step for unambiguously trivial situations assessed as Low CUC-N.
 * Workflow: Use EXTREMELY SPARINGLY, ONLY when explicitly selected by `assess_cuc_n_mode` for trivial confirmations. Default to `think`.
 * Output: Returns the brief thought text as a Markdown log entry.
 */
server.tool(
	"quick_think",
	"**INTERNAL Use Only. Trivial Confirmation Checkpoint.** Use EXTREMELY SPARINGLY, ONLY for acknowledging trivial success when explicitly permitted by prior 'assess_cuc_n_mode' (Low CUC-N). Any analysis requires 'think'.",
	{
		brief_thought: z.string().min(1, "Brief thought cannot be empty.")
			.max(200, "Brief thought should be concise (max 200 chars). Use 'think' for detail.") // Add max length
			.describe("Your **concise internal** confirmation for a verified trivial step (e.g., 'Acknowledged trivial success: file read OK.'). Use ONLY when full deliberation via 'think' is explicitly unnecessary per assessment.")
	},
	async ({ brief_thought }: { brief_thought: string }) => {
		const toolName = 'quick_think';
		logToolCall(toolName);
		try {
			// Zod validation handles non-empty and max length
			logToolResult(toolName, true, `Internal brief thought logged: ${brief_thought.substring(0, 80)}...`);
			console.error(`[${new Date().toISOString()}] [MCP Server - INTERNAL] - ${toolName} Input:\n${brief_thought}`);

			// Return the brief thought text as a log entry
			return {
				content: [{
					type: "text" as const,
					text: `Internal Quick Thought Logged:\n---\n${brief_thought}` // Added prefix
				}]
			};
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);


// --- Server Lifecycle and Error Handling --- (Keep existing shutdown, uncaughtException, unhandledRejection)
/**
 * Gracefully shuts down the server.
 */
async function shutdown(): Promise<void> {
	console.error('\n[MCP Server - INTERNAL] Shutting down gracefully...');
	try {
		await server.close();
		console.error('[MCP Server - INTERNAL] Server closed.');
		process.exit(0);
	} catch (err) {
		console.error('[MCP Server - INTERNAL] Error during shutdown:', err);
		process.exit(1);
	}
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('uncaughtException', (error, origin) => {
	const timestamp = new Date().toISOString();
	console.error(`[${timestamp}] [MCP Server - INTERNAL] FATAL: Uncaught Exception at: ${origin}`, error);
	shutdown().catch(() => process.exit(1));
});

process.on('unhandledRejection', (reason, promise) => {
	const timestamp = new Date().toISOString();
	console.error(`[${timestamp}] [MCP Server - INTERNAL] FATAL: Unhandled Promise Rejection:`, reason);
	shutdown().catch(() => process.exit(1));
});


// --- Start the Server ---

/**
 * Initializes and starts the MCP server for INTERNAL cognitive tools.
 */
async function main(): Promise<void> {
	try {
		const transport = new StdioServerTransport();
		await server.connect(transport);

		const border = '-----------------------------------------------------';
		console.error(border);
		console.error(` ${serverInfo.description}`);
		console.error(` Version: ${serverInfo.version}`);
		console.error(' Status: Running on stdio, awaiting INTERNAL MCP requests...');
		console.error(border);
	}
	catch (error) {
		const timestamp = new Date().toISOString();
		console.error(`[${timestamp}] [MCP Server - INTERNAL] Fatal error during startup:`, error);
		process.exit(1);
	}
}

// Execute the main function to start the server
main();
