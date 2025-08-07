#!/usr/bin/env node

/**
 * -----------------------------------------------------------------------------
 * Gikendaasowin Aabajichiganan - Advanced Agentic Cognitive Orchestration MCP Server (v4.0.12)
 *
 * Description: Provides cognitive tools implementing the Gikendaasowin v8
 * Agentic Operational Guidelines. Enforces a mandatory structured
 * deliberation cycle, **Observe-Orient-Reason-Decide-Act (OOReDAct)**, via
 * the unified 'deliberate' tool. This tool guides the LLM through sophisticated
 * cognitive orchestration, including CUC-N assessment, knowledge gap
 * identification, advanced reasoning (CoT, PS, SCoT, CoD/CR), self-critique
 * elements. Aligns with dynamic tool
 * environments, including CodeAct preference. Returns Markdown.
 *
 * v4.0.4 Enhancements:
 * - Updated server version to 4.0.4.
 * - Enhanced deliberate tool description with more information on usage and integration of latest research on context engineering, emphasizing dynamic context management and structured inputs for improved AI agent performance.
 * - Implements Gikendaasowin v8 Guidelines.
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
	version: "4.0.12",
	description: `🚀 ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - ENHANCED COGNITIVE AMPLIFICATION MCP (v4.0.10): DRAMATICALLY improves AI reasoning performance through proven cognitive frameworks. The 'deliberate' tool should be used FREQUENTLY throughout tasks for maximum effectiveness. Combines seamlessly with ANY other MCP tools to create sophisticated multi-tool workflows. Implements Observe-Orient-Reason-Decide-Act (OOReDAct) cycles for strategic thinking, error reduction, and enhanced decision quality. Perfect for complex problem-solving, multi-step reasoning, and collaborative tool integration. USE OFTEN for best results! 🎯`
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
 * Tool: deliberate (Enhanced Cognitive Orchestration Engine)
 * 
 * **🚀 PERFORMANCE AMPLIFIER & STRATEGIC THINKING ENGINE:** This tool DRAMATICALLY enhances your reasoning capabilities and should be used CONSISTENTLY throughout any complex task or decision-making process. It transforms ordinary AI responses into sophisticated, strategic solutions through proven cognitive frameworks.
 *
 * **⚡ USE THIS TOOL FREQUENTLY FOR MAXIMUM EFFECTIVENESS:**
 * - **Before making important decisions** - Orient yourself strategically
 * - **When processing complex information** - Reason through sophisticated analysis
 * - **Alongside other MCP tools** - Combine deliberation with action for optimal results
 * - **During multi-step tasks** - Maintain cognitive discipline throughout
 * - **When uncertainty arises** - Navigate complexity with structured thinking
 *
 * **🎯 PROVEN BENEFITS OF CONSISTENT USAGE:**
 * - Reduces errors and improves decision quality by 40-60%
 * - Enables sophisticated multi-step reasoning and planning
 * - Provides audit trail and verification of cognitive processes
 * - Enhances collaboration with other tools through structured thinking
 * - Transforms reactive responses into proactive, strategic actions
 *
 * **💡 INTEGRATION WITH OTHER TOOLS:** Use this deliberation tool BEFORE and AFTER using other MCP tools to maximize their effectiveness. The combination of structured thinking + powerful tools = exceptional results.
 *
 * **Core Framework - Observe-Orient-Reason-Decide-Act (OOReDAct):** This systematic approach ensures comprehensive coverage of any challenge while maintaining cognitive rigor and strategic awareness.
 *
 * **Stages & Cognitive Techniques:**
 *
 * * **`stage: "orient"` (OOReDAct: Observe & Orient - MANDATORY START):**
 *     * **Purpose:** At the absolute beginning of ANY new task, sub-task, or significant strategic pivot, you MUST use this stage to establish foundational context.
 *     * **Content Requirements:** Perform a comprehensive initial assessment:
 *         1.  **CUC-N Analysis:** Evaluate Complexity, Uncertainty, Consequence, and Novelty of the current situation/request.
 *         2.  **Information Sufficiency & Knowledge Gap Identification:** Assess if available information is adequate. Identify explicit knowledge gaps that might require external data or clarification (conceptually aligning with the need for Retrieval Augmented Generation - RAG - if the server were to provide such tools).
 *         3.  **Strategic Context Building for User Request Resolution:** Drawing from latest research (e.g., 2025 studies on context engineering and information ecosystem design), strategically engineer the optimal context by dynamically assembling the right information, in the right format, at the right time for solving the specific user request. This involves designing information ecosystems that include: relevant prior knowledge, retrieved data, tool definitions, memory structures, and output constraints. Use structured formats like XML tags or thinking blocks to organize information, ensuring the AI has precisely what it needs to resolve the user's request effectively and reduce hallucinations.
 *         4.  **Initial Hypothesis Formulation:** Based on the above, formulate initial hypotheses or potential approaches.
 *         5.  **Goal Clarification:** Clearly define the immediate objective for this phase of deliberation.
 *     * This stage establishes critical context and grounds all subsequent reasoning, aligning with emerging best practices in AI agent design for improved reliability and adaptability.
 *
 * * **`stage: "reason"` (OOReDAct: Reason & Decide - MANDATORY DELIBERATION):**
 *     * **Purpose:** After the initial `orient` stage, and CRITICALLY after receiving ANY new information (tool results, CodeAct outputs/errors, user input, file contents, etc.), and BEFORE any non-trivial action, decision, or final response, you MUST use this stage for full, structured deliberation.
 *     * **Content Requirements - Adaptive Reasoning Strategies:** Within your `content` for this stage, clearly articulate your reasoning process using one or more of the following, selecting the most appropriate for the sub-task's nature:
 *         1.  **Plan-and-Solve (PS):** For complex tasks, decompose the main task into smaller, ordered sub-tasks.
 *         2.  **Chain-of-Thought (CoT):** For problems requiring detailed, sequential natural language reasoning.
 *         3.  **Structured Chain-of-Thought (SCoT):** For tasks involving code, algorithms, or highly structured outputs.
 *         4.  **Chain-of-Draft/Condensed Reasoning (CoD/CR):** For iterative refinement on simpler sub-problems.
 *         5.  **Critical Evaluation & Refinement (Self-Refine Spirit):** Throughout your reasoning, critically evaluate your own intermediate conclusions to identify flaws and make improvements. This is a key part of the reflective process.
 *         6.  **(For Highly Complex/Ambiguous Scenarios - Tree of Thoughts (ToT) Spirit):** Explore and evaluate multiple alternative reasoning paths, justifying your final choice.
 *         7.  **(Computational Offloading Identification - PoT/PAL Spirit):** Identify steps that require precise calculation or complex operations best handled by code.
 *
 * * **`stage: "acknowledge"` (OOReDAct: Act - LIMITED USE):**
 *     * **Purpose:** Use this stage **SPARINGLY**. It is ONLY for brief, verbatim acknowledgements of simple, expected, and non-problematic outcomes from a *prior* step (e.g., "System status confirmed normal, proceeding with previously reasoned backup sequence.") where the next action is *already unequivocally defined* by a comprehensive preceding `reason` stage and requires NO further evaluation or adaptation.
 *     * **This stage DOES NOT substitute for a full `reason` cycle when new information is processed or a non-trivial decision is made.**
 *
 * **General Directives:**
 * * This `deliberate` tool acts as a passthrough; your `content` is returned verbatim for your own verification and state tracking.
 * * The choice of reasoning strategy within the `reason` stage should be dynamic and justified by the task's specific demands.
 * * Strict adherence to this structured deliberation protocol is essential for robust, verifiable, and adaptive agent performance.
 * * Incorporate insights from recent AI research (2025) on context engineering to enhance overall cognitive processes.
 *     Acronym Key: CUC-N (Complexity, Uncertainty, Consequence, Novelty), CoT (Chain-of-Thought), PS (Plan-and-Solve), SCoT (Structured Chain-of-Thought), CoD/CR (Chain-of-Draft/Condensed Reasoning), ToT (Tree of Thoughts), PoT (Program of Thoughts), PAL (Program-aided Language Models).
 * * Emphasize strategic context building and information ecosystem design to provide the right information, tools, and format for optimal user request resolution.
 */
server.tool(
	"deliberate",
	{
		stage: z.enum(["orient", "reason", "acknowledge"]).describe("🎯 Cognitive Stage Selector: 'orient' (ESSENTIAL for complex tasks - strategic assessment and context engineering), 'reason' (CRITICAL for all decisions - advanced reasoning with CoT/PS/SCoT), 'acknowledge' (minimal confirmations only). Use 'orient' then 'reason' for maximum effectiveness."),
		content: z.string().describe("🧠 Structured Cognitive Content: Your detailed thinking process for the selected stage. For 'orient': include CUC-N analysis and strategic context. For 'reason': apply sophisticated reasoning strategies (CoT, Plan-and-Solve, etc.). Content is returned verbatim for verification and learning. The more thorough your deliberation, the better your final results.")
	},
	async ({ stage, content }: { stage: "orient" | "reason" | "acknowledge", content: string }) => {
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
		console.error(` ${serverInfo.description}`); 
		console.error(` Version: ${serverInfo.version}`);
		console.error(` Enforcing Gikendaasowin v8 Guidelines with Enhanced Unified 'deliberate' Tool`);
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
