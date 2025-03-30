#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create the MCP server
const server = new McpServer({
	name: "gikendaasowin-aabajichiganan-mcp",
	version: "0.3.9", // Updated version
	description: "ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Gikendaasowin Aabajichiganan - (Cognitive Tools v0.3.9): Provides a suite of advanced internal reasoning tools to guide an LLM agent in sophisticated problem-solving, emphasizing structured thought, planning, and self-correction."
});

// --- Core Cognitive Tool ---

server.tool(
	"think",
	// Enhanced Main Description: Emphasizes mandatory nature, purpose, and expected outcome (logged thought).
	"MANDATORY core cognitive step. Use this internal workspace for structured deliberation before ANY action or final response, AND after using ANY other cognitive tool. Logs your detailed thought process for analysis, planning, verification, risk assessment, and self-correction, ensuring traceable, robust, and compliant reasoning.",
	{
		// Enhanced Parameter Description: More explicit guidance on content and structure.
		thought: z.string().describe("Your detailed internal monologue and reasoning. Structure clearly (e.g., using headings like 'Analysis', 'Plan', 'Verification', 'Risk Assessment', 'Self-Correction'). Content MUST cover: 1) Deconstruction of request/situation, 2) Analysis of previous steps/tool outputs, 3) Formulation of next steps/plan, 4) Verification against constraints/policies, 5) Assessment of potential risks/edge cases, 6) Explicit self-correction if needed. Adapt structure logically but ensure comprehensive reasoning. This logs your thinking process.")
	},
	// Implementation: Correctly echoes the thought, as the tool's job is to log it.
	async ({ thought }) => {
		if (!thought || typeof thought !== 'string' || thought.trim().length === 0) { // Added trim check
			throw new Error('Invalid thought: Must be a non-empty string containing substantive reasoning.');
		}
		// You could potentially add structured logging here if needed later
		console.error(`[CognitiveToolsServer] Think Tool Logged: ${thought.substring(0, 100)}...`); // Log confirmation
		return {
			content: [{
				type: "text" as const,
				text: thought // Return the logged thought
			}]
		};
	}
);

// --- Supporting Cognitive Strategy Tools ---
// Note: These tools primarily guide the LLM to generate specific reasoning patterns,
// which are then analyzed using the mandatory 'think' tool.

server.tool(
	"chain_of_thought",
	// Enhanced Main Description: Clarifies it guides LLM generation.
	"Guides the LLM to generate explicit, sequential reasoning steps for a specific problem. Breaks down complexity into a detailed, linear, logical path. Primarily used for tasks needing high explainability. The generated reasoning MUST be subsequently analyzed using the 'think' tool.",
	{
		// Enhanced Parameter Description: Instructs the LLM on what *it* needs to generate for this field.
		problem_statement: z.string().describe("Provide the specific problem statement for which *you* (the LLM) must now generate and articulate a detailed, step-by-step logical deduction path (Chain of Thought). This output represents your reasoning process.")
	},
	// Implementation: Echoes the input, signaling the LLM performed the CoT generation *before* calling.
	async ({ problem_statement }) => {
		if (!problem_statement || typeof problem_statement !== 'string' || problem_statement.trim().length === 0) {
			throw new Error('Invalid problem statement: Must be a non-empty string.');
		}
		console.error(`[CognitiveToolsServer] ChainOfThought Tool Triggered for: ${problem_statement.substring(0, 100)}...`);
		return {
			content: [{
				type: "text" as const,
				// Return the problem statement to confirm the context for the CoT the LLM *should have generated*.
				// The actual CoT exists in the LLM's preceding generation turn.
				text: `Chain of Thought generation requested for: ${problem_statement}`
			}]
		};
	}
);

server.tool(
	"reflection",
	// Enhanced Main Description: Clarifies it guides LLM self-critique.
	"Guides the LLM to perform self-critique on previously generated reasoning or plans. Evaluates logical consistency, completeness, efficiency, and potential biases, suggesting specific refinements. The critique and refined output MUST be analyzed in a subsequent 'think' step.",
	{
		// Enhanced Parameter Description: Instructs the LLM on what *it* needs to generate.
		input_reasoning_or_plan: z.string().describe("Provide the specific reasoning segment or plan (e.g., from a 'think' step) that *you* (the LLM) must now critically evaluate. Your evaluation should identify flaws, biases, or inconsistencies and propose concrete improvements.")
	},
	// Implementation: Echoes the input, signaling the LLM performed the reflection *before* calling.
	async ({ input_reasoning_or_plan }) => {
		if (!input_reasoning_or_plan || typeof input_reasoning_or_plan !== 'string' || input_reasoning_or_plan.trim().length === 0) {
			throw new Error('Invalid input reasoning/plan: Must be a non-empty string.');
		}
		console.error(`[CognitiveToolsServer] Reflection Tool Triggered for analysis.`);
		return {
			content: [{
				type: "text" as const,
				text: `Reflection requested on: ${input_reasoning_or_plan.substring(0, 150)}...` // Confirm context
			}]
		};
	}
);

server.tool(
	"plan_and_solve",
	// Enhanced Main Description: Clarifies it guides LLM plan generation.
	"Guides the LLM to develop a high-level, structured strategy (plan) for complex, multi-stage objectives. Outlines major phases and potential tool usage. The generated plan MUST be reviewed, validated, and potentially refined using the 'think' tool.",
	{
		// Enhanced Parameter Description: Instructs the LLM on what *it* needs to generate.
		task_objective: z.string().describe("Provide the high-level task objective for which *you* (the LLM) must now create a structured, multi-step strategic plan. Outline the main phases and anticipated steps or tool usage.")
	},
	// Implementation: Echoes the input, signaling the LLM performed the planning *before* calling.
	async ({ task_objective }) => {
		if (!task_objective || typeof task_objective !== 'string' || task_objective.trim().length === 0) {
			throw new Error('Invalid task objective: Must be a non-empty string.');
		}
		console.error(`[CognitiveToolsServer] PlanAndSolve Tool Triggered for: ${task_objective.substring(0, 100)}...`);
		return {
			content: [{
				type: "text" as const,
				text: `Planning requested for objective: ${task_objective}` // Confirm context
			}]
		};
	}
);

server.tool(
	"chain_of_draft",
	// Enhanced Main Description: Clarifies it guides LLM draft generation.
	"Guides the LLM to generate concise, iterative drafts of reasoning steps, prioritizing efficiency. Useful for rapid exploration or brainstorming when full CoT verbosity isn't needed. The generated drafts MUST be subsequently analyzed via the 'think' tool.",
	{
		// Enhanced Parameter Description: Instructs the LLM on what *it* needs to generate.
		problem_statement: z.string().describe("Provide the problem statement for which *you* (the LLM) will now generate brief, iterative reasoning drafts (Chain of Draft). Focus on key steps/insights concisely.")
	},
	// Implementation: Echoes the input, signaling the LLM performed the drafting *before* calling.
	async ({ problem_statement }) => {
		if (!problem_statement || typeof problem_statement !== 'string' || problem_statement.trim().length === 0) {
			throw new Error('Invalid problem statement: Must be a non-empty string.');
		}
		console.error(`[CognitiveToolsServer] ChainOfDraft Tool Triggered for: ${problem_statement.substring(0, 100)}...`);
		return {
			content: [{
				type: "text" as const,
				text: `Chain of Draft generation requested for: ${problem_statement}` // Confirm context
			}]
		};
	}
);


// --- Server Lifecycle and Error Handling ---

process.on('SIGINT', async () => {
	console.error('[CognitiveToolsServer] Received SIGINT, shutting down.');
	await server.close();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.error('[CognitiveToolsServer] Received SIGTERM, shutting down.');
	await server.close();
	process.exit(0);
});

process.on('uncaughtException', (error) => {
	console.error('[CognitiveToolsServer] Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('[CognitiveToolsServer] Unhandled promise rejection:', reason);
});

// Start the server
async function main() {
	try {
		const transport = new StdioServerTransport();
		await server.connect(transport);
		console.error('ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Gikendaasowin Aabajichiganan - (Cognitive Tools) MCP Server running on stdio');
	}
	catch (error) {
		console.error('Fatal error in main():', error);
		process.exit(1);
	}
}

main();