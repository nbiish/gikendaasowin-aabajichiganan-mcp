#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create the MCP server
const server = new McpServer({
	name: "gikendaasowin-aabajichiganan-mcp",
	// Version reflects significant enhancement in descriptive guidance
	version: "0.4.0",
	description: "ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Gikendaasowin Aabajichiganan - (Cognitive Tools v0.4.0): An MCP server providing a suite of advanced internal reasoning tools designed to elevate an LLM agent's performance in complex problem-solving, particularly in pair programming contexts. Emphasizes structured thought (like Anthropic's 'think' tool research), strategic planning, explicit reasoning (CoT), and iterative self-correction (Reflection) to achieve higher reliability and benchmark-level cognitive capabilities."
});

// --- Core Cognitive Tool ---

server.tool(
	"think",
	// Main Description: Reinforced role as the central cognitive hub, linking to robustness and pair programming clarity.
	"MANDATORY Cognitive Hub & Navigator's Log. Use this internal workspace for structured deliberation BEFORE any external action/response and AFTER using ANY other cognitive tool. This logs your detailed reasoning, enhancing traceability, reliability, and facilitating effective pair programming communication. Essential for complex tasks requiring policy adherence, sequential decision-making, and robust error handling.",
	{
		// Parameter Description: Added emphasis on quality, structure elements, and pair programming role.
		thought: z.string().describe("Your detailed, structured internal monologue (Navigator's Log). MUST explicitly cover: 1) **Analysis** (Deconstruct request/situation/tool output), 2) **Planning** (Concrete next steps, potential tool use), 3) **Verification** (Check against requirements, constraints, best practices), 4) **Risk Assessment** (Identify potential issues, edge cases, errors), 5) **Self-Correction** (Explicitly state corrections to prior reasoning/plans). Use clear headings/structure (e.g., ## Analysis, ## Plan). Quality and completeness of reasoning are paramount for robust performance.")
	},
	// Implementation: Logs the structured thought process.
	async ({ thought }) => {
		if (!thought || typeof thought !== 'string' || thought.trim().length === 0) {
			throw new Error('Invalid thought: Must be a non-empty string containing substantive reasoning.');
		}
		console.error(`[CognitiveToolsServer] Think Tool Logged: ${thought.substring(0, 100)}...`);
		return {
			content: [{
				type: "text" as const,
				text: thought // Return the logged thought for context preservation
			}]
		};
	}
);

// --- Supporting Cognitive Strategy Tools ---
// Note: These guide the LLM's internal generation process *before* the tool call.
// The subsequent mandatory 'think' call analyzes the *result* of that internal generation.

server.tool(
	"chain_of_thought",
	// Main Description: Emphasizes use for complex reasoning, explainability, and reducing errors.
	"Guides the LLM to generate and articulate an explicit, step-by-step logical deduction path. Crucial for complex problem decomposition, algorithmic reasoning, debugging logic, and tasks demanding high explainability to minimize reasoning errors. The generated CoT MUST be analyzed via `think`.",
	{
		// Parameter Description: Instructs LLM on the required *internal* generation task.
		problem_statement: z.string().describe("Input the specific problem/question requiring detailed step-by-step reasoning. *You* (the LLM) must now *internally generate* your detailed Chain of Thought process for this problem *before* calling this tool. This tool call signals the completion of that internal CoT generation.")
	},
	// Implementation: Signals CoT was performed for the given problem.
	async ({ problem_statement }) => {
		if (!problem_statement || typeof problem_statement !== 'string' || problem_statement.trim().length === 0) {
			throw new Error('Invalid problem statement: Must be a non-empty string.');
		}
		console.error(`[CognitiveToolsServer] ChainOfThought Tool Signaled for: ${problem_statement.substring(0, 100)}...`);
		return {
			content: [{
				type: "text" as const,
				text: `Chain of Thought generation signaled for problem: ${problem_statement}`
			}]
		};
	}
);

server.tool(
	"reflection",
	// Main Description: Positions as key for iterative refinement, accuracy, and benchmark performance.
	"Guides the LLM to perform critical self-evaluation of its own prior reasoning, plans, or generated code. Essential for iterative refinement, identifying hidden flaws, improving robustness, and achieving higher accuracy on complex benchmarks. The critique MUST be analyzed via `think`.",
	{
		// Parameter Description: Instructs LLM on the self-critique task.
		input_reasoning_or_plan: z.string().describe("Input the specific reasoning, plan, or code segment *you* (the LLM) must now critically evaluate *before* calling this tool. Your internal critique should identify logical fallacies, overlooked assumptions, potential inefficiencies, biases, or edge cases, and propose concrete improvements.")
	},
	// Implementation: Signals Reflection was performed.
	async ({ input_reasoning_or_plan }) => {
		if (!input_reasoning_or_plan || typeof input_reasoning_or_plan !== 'string' || input_reasoning_or_plan.trim().length === 0) {
			throw new Error('Invalid input reasoning/plan: Must be a non-empty string.');
		}
		console.error(`[CognitiveToolsServer] Reflection Tool Signaled for analysis.`);
		return {
			content: [{
				type: "text" as const,
				text: `Reflection generation signaled for input: ${input_reasoning_or_plan.substring(0, 150)}...`
			}]
		};
	}
);

server.tool(
	"plan_and_solve",
	// Main Description: Highlights role in structuring complex tasks and managing agentic workflows.
	"Guides the LLM to decompose a complex objective into a high-level, structured strategic plan. Outlines necessary phases, potential sub-tasks, and anticipated tool usage, improving manageability of multi-step agentic workflows. The generated plan MUST be validated and detailed via `think`.",
	{
		// Parameter Description: Instructs LLM on plan generation.
		task_objective: z.string().describe("Input the high-level objective. *You* (the LLM) must now *internally generate* a structured, multi-step plan (roadmap) to achieve this objective *before* calling this tool. Consider dependencies and necessary intermediate steps.")
	},
	// Implementation: Signals Planning was performed.
	async ({ task_objective }) => {
		if (!task_objective || typeof task_objective !== 'string' || task_objective.trim().length === 0) {
			throw new Error('Invalid task objective: Must be a non-empty string.');
		}
		console.error(`[CognitiveToolsServer] PlanAndSolve Tool Signaled for: ${task_objective.substring(0, 100)}...`);
		return {
			content: [{
				type: "text" as const,
				text: `Planning generation signaled for objective: ${task_objective}`
			}]
		};
	}
);

server.tool(
	"chain_of_draft",
	// Main Description: Positions for efficient exploration and hypothesis generation.
	"Guides the LLM to generate concise, iterative reasoning drafts ('thought-sketches'). Useful for efficiently exploring multiple solution paths, brainstorming hypotheses, or outlining approaches when full CoT verbosity is premature. Drafts MUST be analyzed comparatively via `think`.",
	{
		// Parameter Description: Instructs LLM on draft generation.
		problem_statement: z.string().describe("Input the problem or question for exploration. *You* (the LLM) must now *internally generate* brief, iterative reasoning drafts (key steps, pros/cons, core ideas) for potential approaches *before* calling this tool.")
	},
	// Implementation: Signals Drafting was performed.
	async ({ problem_statement }) => {
		if (!problem_statement || typeof problem_statement !== 'string' || problem_statement.trim().length === 0) {
			throw new Error('Invalid problem statement: Must be a non-empty string.');
		}
		console.error(`[CognitiveToolsServer] ChainOfDraft Tool Signaled for: ${problem_statement.substring(0, 100)}...`);
		return {
			content: [{
				type: "text" as const,
				text: `Chain of Draft generation signaled for problem: ${problem_statement}`
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
		console.error('ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Gikendaasowin Aabajichiganan - (Cognitive Tools v0.4.0) MCP Server running on stdio');
	}
	catch (error) {
		console.error('Fatal error in main():', error);
		process.exit(1);
	}
}

main();