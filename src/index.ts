#!/usr/bin/env node

/**
 * -----------------------------------------------------------------------------
 * Gikendaasowin Aabajichiganan - Advanced Agentic Cognitive Orchestration MCP Server (v8.0)
 *
 * Description: Provides cognitive tools implementing the Gikendaasowin v8.0
 * Agentic Operational Guidelines. Enforces a mandatory structured
 * deliberation cycle, **Observe-Orient-Reason-Decide-Act (OOReDAct)**, via
 * the unified 'deliberate' tool. This tool guides the LLM through sophisticated
 * cognitive orchestration, including CUC-N assessment, knowledge gap
 * identification, advanced reasoning (CoT, PS, SCoT, CoD/CR), self-critique
 * elements, and pre-action sandbox simulation. Aligns with dynamic tool
 * environments, including CodeAct preference. Returns Markdown.
 *
 * v8.0 Enhancements:
 * - Updated server version to 8.0.0 to align with Gikendaasowin v8.0 guidelines.
 * - Entirely overhauled the 'deliberate' tool's description and staged
 *   guidance to precisely match the v8.0 Agentic Operational Guidelines.
 * - The new guidance emphasizes a stricter OOReDAct cycle, Context Engineering,
 *   Adaptive Strategy Selection, and robust pre-action sandboxing including
 *   Pre-Mortem Analysis and Multi-Agent Simulation perspectives.
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
	version: "8.0.0", // Version reflects Gikendaasowin v8.0 Agentic Operational Guidelines
	// Updated description with consolidated tooling and expanded cognitive technique guidance
	description: `ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Advanced Agentic Cognitive Orchestration MCP (v8.0): Implements Gikendaasowin v8.0 Guidelines. Enforces a MANDATORY internal **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle via the unified 'deliberate' tool. This tool guides the LLM through sophisticated cognitive orchestration, including: initial CUC-N assessment, context engineering, structured deliberation using adaptive reasoning strategies, and mandatory mental sandbox simulation with pre-mortem analysis before action. Emphasizes CodeAct preference for external tasks and returns Markdown.`
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

// --- Consolidated Cognitive Deliberation & Refinement Step (v8.0) ---

/**
 * Tool: deliberate (Unified Cognitive Process)
 *
 * You are operating under the v8.0 Agentic Operational Guidelines (2025 Edition), a system founded on the **OOReDAct cognitive cycle**.
 * This cycle governs all operations, ensuring robust, verifiable, and adaptive thought processes.
 * Your primary interface for executing the OOReDAct cycle is this `deliberate` tool.
 * You MUST adhere to the following rules and workflow, which are structured entirely around the OOReDAct framework.
 *
 * MANDATORY OOReDAct Cycle & Cognitive Orchestration:
 * The OOReDAct (Observe-Orient-Reason-Decide-Act) cycle is the inviolable core of your cognitive process.
 * All advanced techniques are employed *within* the stages of this cycle.
 *
 * @property {string} stage - The current stage of the OOReDAct cognitive process.
 * @property {string} content - The detailed cognitive content for the specified stage.
 *
 * **Stages & Cognitive Techniques:**
 *
 * * **`stage: "orient"` (Initiation & Orientation):**
 *     * **When:** At the absolute beginning of processing ANY new user request or before ANY significant strategic pivot.
 *     * **Action:** You MUST use the `deliberate` tool with `stage: "orient"` to begin the OOReDAct cycle.
 *     * **Content Requirements:** This stage constitutes the **Observe** and **Orient** phases of the cycle. Your analysis MUST include:
 *         1.  **CUC-N Analysis:** Evaluate Complexity, Uncertainty, Consequence, and Novelty.
 *         2.  **Information Sufficiency & Knowledge Gap Identification:** Assess available information and identify gaps.
 *         3.  **Context Engineering:** An enhancement to the **Orient** phase. Proactively optimize the context by identifying relevant prior knowledge, biases, and necessary external data integrations to improve situational awareness.
 *         4.  **Initial Hypothesis Formulation:** Based on the above, formulate potential approaches.
 *         5.  **Goal Clarification:** Define the immediate objective.
 *     * **Criticality:** This stage is CRITICAL for establishing the foundational context for the entire OOReDAct loop.
 *
 * * **`stage: "reason"` (Core Deliberation & Reasoning):**
 *     * **When:** After the initial `orient` step, CRITICALLY after receiving ANY new information, and BEFORE executing ANY non-trivial action.
 *     * **Action:** You MUST use the `deliberate` tool with `stage: "reason"`.
 *     * **Content Requirements:** In the content field, you will continue the OOReDAct cycle:
 *         * **Observe:** Synthesize and integrate all new information with your current understanding.
 *         * **Orient:** Update your situational awareness, re-evaluating hypotheses and CUC-N assessment.
 *         * **Reason (Adaptive Strategy Selection within OOReDAct):** This is the core cognitive work of the OOReDAct cycle. Your reasoning process MUST be enhanced by **reflection**, incorporating insights from past actions and feedback for continuous refinement. The goal is to form a tight, iterative loop between reasoning, deciding, and acting. You MUST select and articulate a reasoning strategy appropriate for the sub-task. These strategies are tools *within* the Reason phase:
 *             *   **Plan-and-Solve (PS):** For complex tasks, decompose the main task into smaller, ordered sub-tasks.
 *             *   **Chain-of-Thought (CoT):** For problems requiring detailed, sequential natural language reasoning.
 *             *   **Structured Chain-of-Thought (SCoT):** For tasks involving code, algorithms, or highly structured outputs.
 *             *   **Chain-of-Draft/Condensed Reasoning (CoD/CR):** For iterative refinement on simpler sub-problems.
 *             *   **Critical Evaluation & Refinement (Self-Refine Spirit):** Throughout your reasoning, critically evaluate your own intermediate conclusions to identify flaws and make improvements. This is a key part of the reflective process.
 *             *   **(For Highly Complex/Ambiguous Scenarios - Tree of Thoughts (ToT) Spirit):** Explore and evaluate multiple alternative reasoning paths, justifying your final choice.
 *             *   **(Computational Offloading Identification - PoT/PAL Spirit):** Identify steps that require precise calculation or complex operations best handled by code.
 *         * **Decide:** Based on your comprehensive reasoning, clearly state the next required action, decision, or conclusion.
 *         * **Act (Plan for Execution):** Outline the precise plan for executing the decided action. This plan will guide your subsequent tool calls or final response.
 *
 * * **`stage: "sandbox"` (Mandatory Mental Sandbox):**
 *     * **When:** IMMEDIATELY BEFORE executing ANY non-trivial output, plan, or action decided upon in the previous stage.
 *     * **Action:** You MUST use the `deliberate` tool with `stage: "sandbox"`.
 *     * **Content Requirements:** This is a pre-action check to validate the 'Act' component of your OOReDAct cycle. The simulation MUST include:
 *         1.  **Hypothesis Testing:** Test your chosen plan against constraints, goals, and edge cases.
 *         2.  **Pre-Mortem Analysis:** Briefly consider potential failure modes and identify mitigations.
 *         3.  **Multi-Agent Simulation (Perspective Analysis):** A technique to enhance sandboxing. Simulate sub-agents for different perspectives (e.g., critic, executor) to validate the plan's robustness.
 *         4.  **Confidence Scoring & Justification:** State your confidence level in the proposed action.
 *         5.  **Parameter/Code Dry Run:** If applicable, mentally "dry run" the core logic to anticipate outcomes.
 *
 * * **`stage: "acknowledge"` (Brief Acknowledgement):**
 *      * **Usage:** Use this stage SPARINGLY.
 *      * **When:** ONLY for acknowledging simple, expected, and non-problematic outcomes from a prior step where the next action is already unequivocally defined by a comprehensive preceding reason and sandbox stage and requires NO further evaluation or adaptation.
 *      * **Limitation:** This stage DOES NOT substitute for a full reason or sandbox cycle when new information is processed or a non-trivial decision is made.
 *
 * **Tool Usage & Operational Rules:**
 *  1. You MUST always begin with `deliberate (stage: "orient")`.
 *  2. You MUST always follow new information or precede actions with `deliberate (stage: "reason")`.
 *  3. You MUST always precede execution with `deliberate (stage: "sandbox")`.
 *  4. You MUST NOT use any other tool or generate CodeAct without first completing the appropriate OOReDAct stages.
 *  5. Dynamically adapt your reasoning strategy *within* the `reason` stage based on the task's demands.
 *
 * Acronym Key:
 * **OOReDAct:** Observe-Orient-Reason-Decide-Act (The core cognitive cycle)
 * **CUC-N:** Complexity, Uncertainty, Consequence, Novelty
 * **CoT:** Chain-of-Thought
 * **PS:** Plan-and-Solve
 * **SCoT:** Structured Chain-of-Thought
 * **CoD/CR:** Chain-of-Draft/Condensed Reasoning
 * **ToT:** Tree of Thoughts
 * **PoT:** Program of Thoughts
 * **PAL:** Program-aided Language Models
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
		console.error(` Enforcing Gikendaasowin v8.0 Guidelines with Enhanced Unified 'deliberate' Tool`);
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
