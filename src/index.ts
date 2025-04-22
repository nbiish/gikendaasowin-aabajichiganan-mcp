#!/usr/bin/env node

/**
 * -----------------------------------------------------------------------------
 * Gikendaasowin Aabajichiganan - Core Cognitive Tools MCP Server (Ultra-Simplified Core)
 *
 * Description: Provides an ultra-streamlined suite of cognitive tools for an AI agent,
 *              focusing on assessment (`assess_cuc_n_mode`) and a central
 *              deliberation hub (`think` / `quick_think`). Chain of Thought (CoT)
 *              and Chain of Draft (CoD) reasoning styles are performed *within*
 *              the `think` tool as guided by the system prompt, not via separate tools.
 *              Validation on input content structure is removed. Tool results are
 *              returned as formatted Markdown. Versioning removed.
 *
 * Key Principles:
 * 1.  **Focused Deliberation:** Tools guide assessment (`assess_cuc_n_mode`) and
 *     thinking/analysis (`think`, `quick_think`).
 * 2.  **Centralized Analysis (`think`):** The `think` tool is the hub for all
 *     complex analysis, planning, reflection, synthesis, confidence assessment,
 *     and generation of detailed (CoT-style) or concise (CoD-style) reasoning.
 * 3.  **CUC-N Assessment:** `assess_cuc_n_mode` guides initial cognitive depth.
 * 4.  **Iterative Loop:** Assess -> Think/QuickThink -> Analyze results in Think/QuickThink.
 * 5.  **Traceability:** All tool inputs are logged for a complete record.
 * 6.  **Markdown Output:** Tool results are formatted as Markdown.
 *
 * Protocol:    Model Context Protocol (MCP) over stdio.
 * -----------------------------------------------------------------------------
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// --- Server Definition ---

const serverInfo = {
	name: "gikendaasowin-aabajichiganan-mcp",
	version: "1.0.0",
	// Version field removed
	description: `ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Core Cognitive Tools Suite (Ultra-Simplified): Focuses on Assess/Think loop. CoT/CoD styles are integrated into 'think'. Returns Markdown.`
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
function logToolError(toolName: string, error: unknown) {
	const timestamp = new Date().toISOString();
	const errorMessage = error instanceof Error ? error.message : String(error);
	console.error(`[${timestamp}] [MCP Server] ! Tool Error: ${toolName} - ${errorMessage}`);
	logToolResult(toolName, false, errorMessage); // Log failure result as well
	// Return a structured error message suitable for the LLM
	return {
		content: [{
			type: "text" as const,
			text: `Error executing tool '${toolName}': ${errorMessage}. Please analyze this error.`
		}]
	};
}

// --- Core Cognitive Deliberation & Refinement Tools ---

/**
 * Tool: assess_cuc_n_mode
 * Purpose: Initial assessment of task characteristics to determine cognitive strategy.
 * Workflow: Call BEFORE starting complex tasks or significantly changing strategy.
 * Output: Returns the full assessment text formatted as Markdown.
 */
server.tool(
	"assess_cuc_n_mode",
	"**Initial Assessment.** Evaluates task Complexity, Uncertainty, Consequence, Novelty (CUC-N) to determine required cognitive depth and initial strategy. Call before starting complex tasks. Based on assessment, use either `think` (for structured analysis) or `quick_think` (for streamlined processing) in the next step.",
	{
		assessment_and_choice: z.string().describe("Your structured assessment including: 1) Situation Description, 2) CUC-N Ratings (Low/Medium/High for each), 3) Rationale for ratings, 4) Recommended Initial Cognitive Strategy (e.g., 'Proceed with think step'), 5) Explicit Mode Selection ('Selected Mode: think' or 'Selected Mode: quick_think').")
	},
	async ({ assessment_and_choice }: { assessment_and_choice: string }) => {
		const toolName = 'assess_cuc_n_mode';
		logToolCall(toolName);
		try {
			// Basic Zod validation ensures it's a string. Content validation removed.
			const modeRegex = /Selected Mode: (think|quick_think)/i;
			const modeMatch = assessment_and_choice.match(modeRegex);
			const selectedMode = modeMatch ? modeMatch[1].toLowerCase() : "unknown"; // Extract mode for logging

			// Ensure assessment_and_choice is a non-empty string
			if (assessment_and_choice.trim().length === 0) {
				throw new Error('Invalid assessment_and_choice: Must be a non-empty string.');
			}
			if (!modeMatch) {
				// Add a check for the mode selection presence
                throw new Error('Invalid assessment: String must include explicit "Selected Mode: think" or "Selected Mode: quick_think".');
            }


			logToolResult(toolName, true, `Selected mode (extracted): ${selectedMode}`);
			// Log full input for traceability
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input:\n${assessment_and_choice}`);

			// Return the full assessment text, now without markdown wrappers
			return {
				content: [{
					type: "text" as const,
					text: assessment_and_choice // Removed wrappers
				}]
			};
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);

/**
 * Tool: think
 * Purpose: The **CENTRAL, COMPREHENSIVE HUB** for the cognitive loop. Incorporates OODReAct principles.
 * Workflow: Handles ALL complex analysis, planning, reflection, synthesis, confidence assessment, and generation of detailed (CoT-style) or concise (CoD-style) reasoning. Structure is guided by the prompt.
 * Output: Returns the structured thought text itself, formatted as Markdown.
 */
server.tool(
	"think",
	"**Central Hub for Comprehensive Analysis and Planning.** Use after `assess_cuc_n_mode`, after external action results/errors, or after `quick_think` if deeper analysis is needed. Incorporates OODReAct principles. Perform ALL detailed analysis, planning, reflection, synthesis, confidence assessment, and detailed (CoT-style) or concise (CoD-style) reasoning within this tool. Structure your thought clearly using headings. For simpler follow-up steps, consider using `quick_think`.",
	{
		thought: z.string().describe("Your **detailed** internal monologue covering Analysis/Observation, Plan/Decision, Verification, Risk & Contingency, and Learning & Adaptation. Include CoT/CoD style reasoning in the 'Reason' section when needed. Use clear headings. OODReAct-style headers are recommended.")
	},
	async ({ thought }: { thought: string }) => {
		const toolName = 'think';
		logToolCall(toolName);

		try {
			// Basic Zod validation ensures it's a non-empty string. Content validation removed.
			if (thought.trim().length === 0) {
				throw new Error('Invalid thought: Must be a non-empty string containing substantive reasoning.');
			}

			logToolResult(toolName, true, `Thought logged (length: ${thought.length})`);
			// Log full input for traceability
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input:\n${thought}`);

			// Returns the same thought text received, now without markdown wrappers
			return {
				content: [{
					type: "text" as const,
					text: thought // Removed wrappers
				}]
			};
		} catch (error: unknown) {
			// Use logToolError to format the error for the LLM
			return logToolError(toolName, error);
		}
	}
);

/**
 * Cognitive Checkpoint ONLY for situations explicitly assessed as strictly Low CUC-N
 * (via `assess_cuc_n_mode`) or for trivial confirmations/acknowledgements where
 * detailed analysis via `think` is unnecessary. Use SPARINGLY.
 */
export interface QuickThinkInput {
	/**
	 * Your **concise** thought or confirmation for this simple, low CUC-N step.
	 * Briefly state the observation/action and confirm it's trivial.
	 */
	brief_thought: string;
}

/**
 * Tool: quick_think
 * Purpose: A lightweight cognitive checkpoint for streamlined processing and simple confirmations.
 * Workflow: Use ONLY when full structured analysis via `think` is genuinely unnecessary (Low CUC-N or trivial results).
 * Output: Returns the brief thought text, formatted as Markdown.
 */
server.tool(
	"quick_think",
	"Cognitive Checkpoint for streamlined processing and simple confirmations where detailed analysis via `think` is unnecessary. Use ONLY when full structured deliberation would be excessive (verified Low CUC-N or trivial results).",
	{
		brief_thought: z.string().describe("Your **concise** thought or confirmation for this step. Briefly state the observation/action and explain why detailed analysis via 'think' isn't needed.")
	},
	async ({ brief_thought }: { brief_thought: string }) => {
		const toolName = 'quick_think';
		logToolCall(toolName);
		try {
			// Basic Zod validation ensures it's a non-empty string. Content validation removed.
			if (brief_thought.trim().length === 0) {
				throw new Error('Invalid brief_thought: Must be a non-empty string.');
			}
			logToolResult(toolName, true, `Logged: ${brief_thought.substring(0, 80)}...`);
			// Log full input for traceability
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input:\n${brief_thought}`);

			// Return the brief thought text, now without markdown wrappers
			return {
				content: [{
					type: "text" as const,
					text: brief_thought // Removed wrappers
				}]
			};
		} catch (error: unknown) {
			return logToolError(toolName, error);
		}
	}
);


// --- REMOVED chain_of_thought Tool ---


// --- REMOVED chain_of_draft Tool ---


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
		console.error(` ${serverInfo.description}`);
		// Version logging removed from startup message
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