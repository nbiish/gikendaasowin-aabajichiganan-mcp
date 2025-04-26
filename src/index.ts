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
	// **Refined Error Guidance:** Expanded acronyms on first mention here.
	return {
		content: [{
			type: "text" as const,
			text: `**INTERNAL ERROR during '${toolName}':** ${errorMessage}\n\n**CORRECTIVE ACTION REQUIRED:** You MUST now perform the full **Observe-Orient-Reason-Decide-Act (OOReDAct)** deliberation cycle to address this error. Structure your thinking with: 1. **Observe** this error message. 2. **Orient** by analyzing the error in context of the goal and previous steps. 3. **Reason** about potential causes and solutions (use adaptive reasoning: **Chain-of-Thought (CoT)** for detailed steps, **Chain-of-Draft/Condensed Reasoning (CoD/CR)** for efficient summaries, or **Structured Chain-of-Thought (SCoT)** for plans/code, as appropriate). 4. **Decide** on the *single best* corrective action (e.g., retry, modify parameters, use different tool/CodeAct, ask USER). 5. **Act(Plan)** the exact parameters or code for the correction. 6. Define **Verification** and **Risk/Contingency**.`
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
 * Output: The assessment and initial orientation text formatted as Markdown.
 */
server.tool(
	"assess_and_orient",
	// **Internal Framing:** Expanded OOReDAct on first mention.
	"**Mandatory Initial Assessment & Orientation:** At the start of EVERY user request AND before any major change in strategy, you MUST perform this initial assessment and orientation. Analyze the request/situation using CUC-N (Complexity, Uncertainty, Consequence, Novelty) to perform the initial 'Observe' and 'Orient' steps of the **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle. This assessment is CRITICAL for grounding your subsequent reasoning and planning within the main OOReDAct cycle.",
	{
		assessment_and_orientation_text: z.string().describe("Provide your structured CUC-N assessment and initial Orientation. MUST include: 1) Task/Situation Summary (Observe). 2) CUC-N Analysis (Rationale for Low/Medium/High ratings). 3) Initial Orientation (Contextualize task based on CUC-N, goals, constraints, available tools/knowledge; identify key challenges/unknowns). 4) Strategic Implications (How CUC-N influences the approach, e.g., 'High consequence requires rigorous verification in subsequent OOReDAct cycles', 'High uncertainty suggests iterative refinement').")
	},
	async ({ assessment_and_orientation_text }: { assessment_and_orientation_text: string }) => {
		const toolName = 'assess_and_orient';
		logToolCall(toolName);
		try {
			if (assessment_and_orientation_text.trim().length === 0) {
				throw new Error('Invalid input: Must provide a non-empty CUC-N assessment and orientation.');
			}
			if (!assessment_and_orientation_text.includes("CUC-N Analysis") || !assessment_and_orientation_text.includes("Initial Orientation")) {
				console.warn(`[${new Date().toISOString()}] [MCP Server] WARNING: '${toolName}' input may be missing key sections (CUC-N Analysis, Initial Orientation). Ensure full assessment.`);
			}
			logToolResult(toolName, true, `Assessment & Orientation logged (length: ${assessment_and_orientation_text.length})`);
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input:\n${assessment_and_orientation_text}`);
			return { content: [{ type: "text" as const, text: assessment_and_orientation_text }] };
		} catch (error: unknown) {
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
 * Output: The structured thought process itself (Markdown), serving as your verifiable internal reasoning log.
 */
server.tool(
	"think",
	// **Internal Framing:** Expanded OOReDAct, CoT, CoD/CR, SCoT on first mention in this tool's description.
	"**Mandatory OOReDAct Deliberation Cycle:** You MUST perform the full, structured **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle *after* the initial `assess_and_orient` step, *after* receiving new information (tool/CodeAct results, errors, USER input), and *before* any non-trivial action or final response. Follow the complete OOReDAct structure, adapting your reasoning style within the 'Reason' step (e.g., using detailed **Chain-of-Thought (CoT)** for complexity, concise **Chain-of-Draft/Condensed Reasoning (CoD/CR)** for efficiency, or **Structured Chain-of-Thought (SCoT)** for planning/code) for reliable, verifiable, and adaptive behavior.",
	{
		// **Internal Framing:** Expanded acronyms with explanations in the input description.
		thought: z.string().describe("Provide your **complete, structured OOReDAct deliberation**. MUST include ALL sections: ## Observe (Analyze latest inputs/results/errors objectively), ## Orient (Contextualize vs goal/policy/prior state/assessment), ## Reason (Justify decision; adapt reasoning style: use **Chain-of-Thought (CoT)** for detailed, step-by-step derivation when complexity is high; use **Chain-of-Draft/Condensed Reasoning (CoD/CR)** for a more concise, high-signal summary when appropriate; use **Structured Chain-of-Thought (SCoT)** for outlining plans or generating structured code), ## Decide (Single, immediate next action: specific tool call, CodeAct execution, query USER, final response), ## Act (Plan) (Detail execution: EXACT tool params per current schema, OR complete runnable CodeAct Python snippet, OR precise response draft), ## Verification (Expected outcome/success criteria for *this* step), ## Risk & Contingency (Brief fallback if verification fails).")
	},
	async ({ thought }: { thought: string }) => {
		const toolName = 'think';
		logToolCall(toolName);
		try {
			if (thought.trim().length === 0) {
				throw new Error('Invalid thought: Input cannot be empty.');
			}
			const requiredSections = ["## Observe", "## Orient", "## Reason", "## Decide", "## Act (Plan)", "## Verification", "## Risk & Contingency"];
			const missingSections = requiredSections.filter(section => !thought.includes(section));
			if (missingSections.length > 0) {
				throw new Error(`Invalid thought structure: Missing required OOReDAct section(s): ${missingSections.join(', ')}. You must provide the complete deliberation.`);
			}
			logToolResult(toolName, true, `Deliberation logged (length: ${thought.length})`);
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input:\n${thought}`);
			return { content: [{ type: "text" as const, text: thought }] };
		} catch (error: unknown) {
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
 * Output: The brief acknowledgement text (Markdown).
 */
server.tool(
	"quick_think",
	// **Internal Framing:** Expanded OOReDAct on first mention here.
	"**Minimal Cognitive Acknowledgement:** Use ONLY for acknowledging *simple, expected, non-problematic* outcomes (e.g., 'Data fetch OK, proceeding with planned analysis') where the next step is *already determined* by a prior **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle (`think` step) and needs NO re-evaluation. Helps maintain flow in simple sequences. **This step DOES NOT satisfy the mandatory OOReDAct deliberation requirement.** Perform the full OOReDAct cycle (`think` step) for any analysis, planning, reasoning, error handling, or decision making.",
	{
		// **Internal Framing:** Expanded OOReDAct on first mention here.
		brief_thought: z.string().describe("Provide your **extremely concise** acknowledgement for a genuinely trivial step (max ~15 words recommended, e.g., 'Step X succeeded as expected.'). Must be non-empty. **Do NOT use this for ANY analysis, planning, reasoning, decision-making, or error handling** - perform the full **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle (`think` step) instead.")
	},
	async ({ brief_thought }: { brief_thought: string }) => {
		const toolName = 'quick_think';
		logToolCall(toolName);
		try {
			if (brief_thought.trim().length === 0) {
				throw new Error('Invalid brief_thought: Must be non-empty.');
			}
			if (brief_thought.includes("##")) {
				throw new Error("Invalid brief_thought: Cannot contain '##' sections. Use the full OOReDAct cycle (`think` step) for structured deliberation.");
			}
			if (brief_thought.length > 100) {
				console.warn(`[${new Date().toISOString()}] [MCP Server] WARNING: 'quick_think' input is long (${brief_thought.length} chars). Confirm this step was truly trivial and required no OOReDAct deliberation.`);
			}
			logToolResult(toolName, true, `Logged: ${brief_thought.substring(0, 80)}...`);
			console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input:\n${brief_thought}`);
			return { content: [{ type: "text" as const, text: brief_thought }] };
		} catch (error: unknown) {
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