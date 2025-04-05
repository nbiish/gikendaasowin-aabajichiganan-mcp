#!/usr/bin/env node

/**
 * -----------------------------------------------------------------------------
 * Gikendaasowin Aabajichiganan - Cognitive Tools MCP Server
 *
 * Description: Provides a suite of cognitive tools for an AI Pair Programmer
 *              to structure its reasoning, plan actions, analyze results,
 *              and iteratively refine its work (Chain of Draft). Integrates
 *              with generic external environment tools for comprehensive interaction.
 *              Designed to be used with the corresponding integration prompt
 *              focused on iterative refinement and tool integration.
 * Protocol:    Model Context Protocol (MCP) over stdio.
 * -----------------------------------------------------------------------------
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { exec } from 'child_process'; // For executeTerminalCommand
import vm from 'vm'; // For safer executeCode
import fs from 'fs/promises'; // For file operations
import path from 'path'; // For path manipulation, potentially useful

// Helper function to promisify exec
import { promisify } from 'util';
const execPromise = promisify(exec);

// --- Server Definition ---

const server = new McpServer({
	name: "gikendaasowin-aabajichiganan-mcp",
	// Version removed for flexibility
	description: "ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Cognitive Tools Suite: Enables structured, iterative reasoning (Chain of Draft), planning, analysis, and external tool integration for AI Pair Programming."
});

// --- Logging Helper ---
function logToolCall(toolName: string, details?: string) {
	console.error(`[MCP Server] > Tool Call: ${toolName}${details ? ` - ${details}` : ''}`);
}

function logToolResult(toolName: string, success: boolean, resultDetails?: string) {
	console.error(`[MCP Server] < Tool Result: ${toolName} - ${success ? 'Success' : 'Failure'}${resultDetails ? ` - ${resultDetails}` : ''}`);
}

function logToolError(toolName: string, error: any) {
	const errorMessage = error instanceof Error ? error.message : String(error);
	console.error(`[MCP Server] ! Tool Error: ${toolName} - ${errorMessage}`);
	logToolResult(toolName, false, errorMessage); // Log failure result as well
	// Return a structured error message suitable for the LLM
	return { content: [{ type: "text" as const, text: `Error in ${toolName}: ${errorMessage}` }] };
}


// --- Core Cognitive Deliberation & Refinement Tools ---

server.tool(
	"assess_cuc_n_mode",
	"**Mandatory Pre-Deliberation/Pre-Sequence Assessment.** Evaluates task Complexity, Uncertainty, Consequence, Novelty (CUC-N) to determine required cognitive depth and initial strategy. MUST be called before starting complex tasks or changing strategy.",
	{
		assessment_and_choice: z.string().describe("Structured assessment including: 1) Situation Description, 2) CUC-N Ratings (L/M/H), 3) Recommended Initial Strategy (e.g., 'Need to read relevant file for context'), 4) Explicit Mode Selection ('Selected Mode: think' or 'Selected Mode: quick_think').")
	},
	async ({ assessment_and_choice }) => {
		logToolCall('assess_cuc_n_mode');
		try {
			// Basic validation for required components
			if (!assessment_and_choice.includes("Selected Mode:") || !assessment_and_choice.includes("CUC-N Ratings:") || !assessment_and_choice.includes("Recommended Initial Strategy:")) {
				throw new Error('Invalid assessment: String must include CUC-N ratings, Recommended Initial Strategy, and explicit Selected Mode.');
			}
			const mode = assessment_and_choice.includes("Selected Mode: think") ? "think" : "quick_think";
			const resultText = `Cognitive Assessment Completed. Proceeding with selected mode: ${mode}. Full Assessment:\n${assessment_and_choice}`;
			logToolResult('assess_cuc_n_mode', true, `Selected mode: ${mode}`);
			return { content: [{ type: "text" as const, text: resultText }] };
		} catch (error: any) {
			return logToolError('assess_cuc_n_mode', error);
		}
	}
);

server.tool(
	"think",
	"**MANDATORY Central Hub for Analysis, Planning, and Refinement.** Called after assessment, complex cognitive tools, *any* external tool execution, or internal draft generation. Analyzes previous step's outcome/draft, plans immediate next action (cognitive or external), verifies, assesses risk, and self-corrects. Returns the thought text for grounding.",
	{
		thought: z.string().describe("Your **detailed** internal monologue following the MANDATORY structure: ## Analysis (critically evaluate last result/draft, incl. tool errors/warnings), ## Plan (define *immediate* next action & purpose), ## Verification (how to check next step), ## Anticipated Challenges & Contingency, ## Risk Assessment, ## Lookahead, ## Self-Correction & Learning.")
	},
	async ({ thought }) => {
		logToolCall('think');
		try {
			if (!thought || typeof thought !== 'string' || thought.trim().length === 0) {
				throw new Error('Invalid thought: Must be a non-empty string.');
			}
			// Basic check for mandatory sections (can be made more robust)
			const requiredSections = ["## Analysis:", "## Plan:", "## Verification:", "## Anticipated Challenges & Contingency:", "## Risk Assessment:", "## Lookahead:", "## Self-Correction & Learning:"];
			const missingSections = requiredSections.filter(section => !thought.includes(section));
			if (missingSections.length > 0) {
				console.warn(`[MCP Server] Warning: 'think' input might be missing sections: ${missingSections.join(', ')}`);
				// Allow processing but log warning. Could throw error if strictness is desired.
			}
			logToolResult('think', true, `Thought logged (length: ${thought.length})`);
			// Returns the same thought text received, making it explicit in context.
			return { content: [{ type: "text" as const, text: thought }] };
		} catch (error: any) {
			return logToolError('think', error);
		}
	}
);

server.tool(
	"quick_think",
	"Cognitive Checkpoint ONLY for situations explicitly assessed as strictly Low CUC-N (via assess_cuc_n_mode) or for trivial confirmations where detailed analysis via `think` is unnecessary. Use sparingly.",
	{
		brief_thought: z.string().describe("Your **concise** thought for strictly simple, low CUC-N situations or brief confirmations.")
	},
	async ({ brief_thought }) => {
		logToolCall('quick_think');
		try {
			if (!brief_thought || typeof brief_thought !== 'string' || brief_thought.trim().length === 0) {
				throw new Error('Invalid brief_thought: Must be non-empty.');
			}
			logToolResult('quick_think', true, `Logged: ${brief_thought.substring(0, 50)}...`);
			return { content: [{ type: "text" as const, text: `Quick Thought logged successfully.` }] };
		} catch (error: any) {
			return logToolError('quick_think', error);
		}
	}
);

server.tool(
	"gauge_confidence",
	"Meta-Cognitive Checkpoint. Guides internal stating of **confidence (High/Medium/Low) and justification** regarding a plan, analysis, or draft. Output MUST be analyzed in the mandatory `think` step immediately after.",
	{
		assessment_and_confidence: z.string().describe("Input item being assessed. *Internally determine and state*: 1) Confidence Level (H/M/L). 2) Justification. Call this tool *after* making the assessment.")
	},
	async ({ assessment_and_confidence }) => {
		logToolCall('gauge_confidence');
		try {
			const confidenceRegex = /Confidence Level: (High|Medium|Low)/i;
			if (!assessment_and_confidence || typeof assessment_and_confidence !== 'string' || !confidenceRegex.test(assessment_and_confidence)) {
				throw new Error('Invalid confidence assessment: String must include "Confidence Level: High/Medium/Low" and justification.');
			}
			const match = assessment_and_confidence.match(confidenceRegex);
			const level = match ? match[1] : "Unknown";
			const resultText = `Confidence Gauge Completed. Level: ${level}. Assessment Text: ${assessment_and_confidence}. Ready for mandatory post-assessment 'think' analysis (action required if Low/Medium).`;
			logToolResult('gauge_confidence', true, `Level: ${level}`);
			return { content: [{ type: "text" as const, text: resultText }] };
		} catch (error: any) {
			return logToolError('gauge_confidence', error);
		}
	}
);

server.tool(
	"plan_and_solve",
	"Guides internal generation of a **structured plan draft**. Call this tool *with* the generated plan text. Returns the plan text for mandatory `think` analysis to critically evaluate feasibility, refine, and confirm the first action step.",
	{
		generated_plan_text: z.string().describe("The **full, structured plan draft** you generated internally, including goals, steps, potential tool needs, and risks."),
		task_objective: z.string().describe("The original high-level task objective this plan addresses.")
	},
	async ({ generated_plan_text, task_objective }) => {
		logToolCall('plan_and_solve', `Objective: ${task_objective.substring(0, 50)}...`);
		try {
			if (!generated_plan_text || typeof generated_plan_text !== 'string' || generated_plan_text.trim().length === 0) { throw new Error('Invalid generated_plan_text: Must be non-empty.'); }
			if (!task_objective || typeof task_objective !== 'string' || task_objective.trim().length === 0) { throw new Error('Invalid task_objective.'); }
			logToolResult('plan_and_solve', true, `Returned plan draft (length: ${generated_plan_text.length})`);
			// Returns the actual plan text received for analysis.
			return { content: [{ type: "text" as const, text: generated_plan_text }] };
		} catch (error: any) {
			return logToolError('plan_and_solve', error);
		}
	}
);

server.tool(
	"chain_of_thought",
	"Guides internal generation of **detailed, step-by-step reasoning draft (CoT)**. Call this tool *with* the generated CoT text. Returns the CoT text for mandatory `think` analysis to extract insights, identify flaws/gaps, and plan the next concrete action.",
	{
		generated_cot_text: z.string().describe("The **full, step-by-step Chain of Thought draft** you generated internally."),
		problem_statement: z.string().describe("The original problem statement this CoT addresses.")
	},
	async ({ generated_cot_text, problem_statement }) => {
		logToolCall('chain_of_thought', `Problem: ${problem_statement.substring(0, 50)}...`);
		try {
			if (!generated_cot_text || typeof generated_cot_text !== 'string' || generated_cot_text.trim().length === 0) { throw new Error('Invalid generated_cot_text: Must be non-empty.'); }
			if (!problem_statement || typeof problem_statement !== 'string' || problem_statement.trim().length === 0) { throw new Error('Invalid problem_statement.'); }
			logToolResult('chain_of_thought', true, `Returned CoT draft (length: ${generated_cot_text.length})`);
			// Returns the actual CoT text received for analysis.
			return { content: [{ type: "text" as const, text: generated_cot_text }] };
		} catch (error: any) {
			return logToolError('chain_of_thought', error);
		}
	}
);

server.tool(
	"chain_of_draft",
	"Signals that one or more **internal drafts** (code, text, plan fragments) have been generated or refined and are ready for analysis. Call this tool *after* generating/refining draft(s) internally. Response confirms readiness; drafts MUST be analyzed via mandatory `think`.",
	{
		draft_description: z.string().describe("Brief description of the draft(s) generated/refined internally (e.g., 'Initial code snippet for function X', 'Refined plan section 3').")
	},
	async ({ draft_description }) => {
		logToolCall('chain_of_draft', `Description: ${draft_description}`);
		try {
			if (!draft_description || typeof draft_description !== 'string' || draft_description.trim().length === 0) { throw new Error('Invalid draft_description.'); }
			const resultText = `Internal draft(s) ready for analysis: ${draft_description}. MANDATORY: Analyze these draft(s) now in your next 'think' step.`;
			logToolResult('chain_of_draft', true);
			return { content: [{ type: "text" as const, text: resultText }] };
		} catch (error: any) {
			return logToolError('chain_of_draft', error);
		}
	}
);

server.tool(
	"reflection",
	"Guides internal critical self-evaluation on a prior step, draft, or outcome. Call this tool *with* the **generated critique text**. Returns the critique text for mandatory `think` analysis to plan specific corrective actions or refinements.",
	{
		generated_critique_text: z.string().describe("The **full critique text** you generated internally, identifying flaws, strengths, and suggesting improvements."),
		input_subject_description: z.string().describe("A brief description of the original reasoning, plan, code draft, or action result that was critiqued.")
	},
	async ({ generated_critique_text, input_subject_description }) => {
		logToolCall('reflection', `Subject: ${input_subject_description}`);
		try {
			if (!generated_critique_text || typeof generated_critique_text !== 'string' || generated_critique_text.trim().length === 0) { throw new Error('Invalid generated_critique_text: Must be non-empty.'); }
			if (!input_subject_description || typeof input_subject_description !== 'string' || input_subject_description.trim().length === 0) { throw new Error('Invalid input_subject_description.'); }
			logToolResult('reflection', true, `Returned critique (length: ${generated_critique_text.length})`);
			// Returns the actual critique text received for analysis.
			return { content: [{ type: "text" as const, text: generated_critique_text }] };
		} catch (error: any) {
			return logToolError('reflection', error);
		}
	}
);

server.tool(
	"synthesize_prior_reasoning",
	"Context Management Tool. Guides internal generation of a **structured summary** of preceding steps, decisions, or context. Call this tool *with* the generated summary text. Returns the summary for mandatory `think` analysis to consolidate understanding and inform next steps.",
	{
		generated_summary_text: z.string().describe("The **full, structured summary text** you generated internally (e.g., key decisions, open questions, current state)."),
		context_to_summarize_description: z.string().describe("Description of the reasoning span or context that was summarized.")
	},
	async ({ generated_summary_text, context_to_summarize_description }) => {
		logToolCall('synthesize_prior_reasoning', `Context: ${context_to_summarize_description}`);
		try {
			if (!generated_summary_text || typeof generated_summary_text !== 'string' || generated_summary_text.trim().length === 0) { throw new Error('Invalid generated_summary_text: Must be non-empty.'); }
			if (!context_to_summarize_description || typeof context_to_summarize_description !== 'string' || context_to_summarize_description.trim().length === 0) { throw new Error('Invalid context_to_summarize_description.'); }
			logToolResult('synthesize_prior_reasoning', true, `Returned summary (length: ${generated_summary_text.length})`);
			// Returns the actual summary text received for analysis.
			return { content: [{ type: "text" as const, text: generated_summary_text }] };
		} catch (error: any) {
			return logToolError('synthesize_prior_reasoning', error);
		}
	}
);


// --- Generic External Environment Tools ---

// ** File System Operations **

server.tool(
	"readFile",
	"Reads the content of a specified file. Essential for getting context before analysis or modification.",
	{
		filePath: z.string().describe("The path to the file relative to the project root.")
	},
	async ({ filePath }) => {
		logToolCall('readFile', `Path: ${filePath}`);
		try {
			const fileContent = await fs.readFile(filePath, 'utf8');
			// Consider limiting the size returned to avoid overwhelming the context window
			const maxSize = 10000; // Example limit: 10k characters
			const truncatedContent = fileContent.length > maxSize ? fileContent.substring(0, maxSize) + "\n... [File truncated]" : fileContent;
			logToolResult('readFile', true, `Read ${truncatedContent.length} chars from ${filePath}`);
			return { content: [{ type: "text" as const, text: truncatedContent }] };
		} catch (error: any) {
			return logToolError('readFile', error);
		}
	}
);

server.tool(
	"writeFile",
	"Writes the provided content to a specified file, overwriting existing content. Use to apply generated code or modifications.",
	{
		filePath: z.string().describe("The path to the file relative to the project root."),
		content: z.string().describe("The full content to write to the file.")
	},
	async ({ filePath, content }) => {
		logToolCall('writeFile', `Path: ${filePath}, Content Length: ${content.length}`);
		try {
			// Ensure directory exists before writing? (Optional, adds robustness)
			// await fs.mkdir(path.dirname(filePath), { recursive: true });
			await fs.writeFile(filePath, content, 'utf8');
			logToolResult('writeFile', true, `Wrote ${content.length} chars to ${filePath}`);
			return { content: [{ type: "text" as const, text: `Successfully wrote content to ${filePath}.` }] };
		} catch (error: any) {
			return logToolError('writeFile', error);
		}
	}
);

server.tool(
	"listFiles",
	"Lists files and directories within a specified directory path.",
	{
		directoryPath: z.string().describe("The path to the directory relative to the project root (e.g., '.', 'src/components').")
	},
	async ({ directoryPath }) => {
		logToolCall('listFiles', `Path: ${directoryPath}`);
		try {
			const entries = await fs.readdir(directoryPath, { withFileTypes: true });
			const listing = entries.map(entry => `${entry.name}${entry.isDirectory() ? '/' : ''}`).join('\n');
			logToolResult('listFiles', true, `Found ${entries.length} entries in ${directoryPath}`);
			return { content: [{ type: "text" as const, text: listing || "[Directory is empty]" }] };
		} catch (error: any) {
			return logToolError('listFiles', error);
		}
	}
);

server.tool(
	"createDirectory",
	"Creates a new directory at the specified path. Use `recursive: true` to create parent directories if needed.",
	{
		directoryPath: z.string().describe("The path for the new directory relative to the project root."),
		recursive: z.boolean().optional().describe("If true, create parent directories as needed. Defaults to false.")
	},
	async ({ directoryPath, recursive = false }) => {
		logToolCall('createDirectory', `Path: ${directoryPath}, Recursive: ${recursive}`);
		try {
			await fs.mkdir(directoryPath, { recursive: recursive });
			logToolResult('createDirectory', true, `Created directory ${directoryPath}`);
			return { content: [{ type: "text" as const, text: `Successfully created directory ${directoryPath}.` }] };
		} catch (error: any) {
			// Handle 'EEXIST' gracefully if directory already exists? Or let it fail?
			// if (error.code === 'EEXIST' && recursive) { /* handle existing */ }
			return logToolError('createDirectory', error);
		}
	}
);

server.tool(
	"deleteFile",
	"Deletes the specified file. Use with caution.",
	{
		filePath: z.string().describe("The path to the file to delete relative to the project root.")
	},
	async ({ filePath }) => {
		logToolCall('deleteFile', `Path: ${filePath}`);
		try {
			await fs.unlink(filePath);
			logToolResult('deleteFile', true, `Deleted file ${filePath}`);
			return { content: [{ type: "text" as const, text: `Successfully deleted file ${filePath}.` }] };
		} catch (error: any) {
			// Handle 'ENOENT' (file not found) gracefully?
			return logToolError('deleteFile', error);
		}
	}
);

// ** Code Execution & Terminal **

server.tool(
	"executeCode",
	"Executes a provided code snippet in a sandboxed environment. Crucial for testing drafts/logic. Currently supports JavaScript.",
	{
		codeSnippet: z.string().describe("The code snippet to execute (currently JavaScript)."),
		language: z.string().optional().describe("The language of the snippet (defaults to javascript). Informational for now.")
	},
	async ({ codeSnippet, language = 'javascript' }) => {
		// Basic check for language - could expand later
		if (language.toLowerCase() !== 'javascript') {
			return logToolError('executeCode', new Error(`Unsupported language: ${language}. Only JavaScript is currently supported.`));
		}
		logToolCall('executeCode', `Lang: ${language}, Snippet: ${codeSnippet.substring(0, 50)}...`);
		try {
			// Use Node.js vm module for basic sandboxing (better than eval)
			const context = vm.createContext({}); // Create an empty context
			const script = new vm.Script(codeSnippet);
			const result = script.runInContext(context, { timeout: 5000 }); // Add a timeout
			const resultString = typeof result === 'undefined' ? 'undefined' : JSON.stringify(result);
			logToolResult('executeCode', true, `Result: ${resultString.substring(0, 100)}...`);
			return { content: [{ type: "text" as const, text: `Execution Result: ${resultString}` }] };
		} catch (error: any) {
			return logToolError('executeCode', error);
		}
	}
);

server.tool(
	"executeTerminalCommand",
	"Executes a shell command in the project's root directory. Useful for build steps, git operations, running test suites, etc.",
	{
		command: z.string().describe("The shell command to execute (e.g., 'npm run test', 'git status').")
	},
	async ({ command }) => {
		logToolCall('executeTerminalCommand', `Command: ${command}`);
		try {
			// Execute command - consider security implications carefully in production
			// Set a timeout? Limit allowed commands?
			const { stdout, stderr } = await execPromise(command, { timeout: 30000, encoding: 'utf8' }); // 30s timeout

			let resultText = "";
			if (stderr) {
				resultText += `Standard Error:\n${stderr}\n`;
				logToolResult('executeTerminalCommand', false, `Command finished with stderr.`); // Consider stderr as potential failure
			}
			resultText += `Standard Output:\n${stdout}`;
			logToolResult('executeTerminalCommand', true, `Command finished.`);

			// Limit output size?
			const maxSize = 5000;
			if (resultText.length > maxSize) {
				resultText = resultText.substring(0, maxSize) + "\n... [Output truncated]";
			}

			return { content: [{ type: "text" as const, text: resultText }] };
		} catch (error: any) {
			// Error object from exec often includes stdout/stderr which might be useful
			let errorDetails = error instanceof Error ? error.message : String(error);
			if (error.stdout) errorDetails += `\nSTDOUT:\n${error.stdout}`;
			if (error.stderr) errorDetails += `\nSTDERR:\n${error.stderr}`;
			return logToolError('executeTerminalCommand', errorDetails);
		}
	}
);

// ** Web & Information Retrieval **

server.tool(
	"webSearch",
	"Performs a web search using an external service (stubbed). Useful for finding API documentation, error explanations, or concepts.",
	{
		query: z.string().describe("The search query.")
	},
	async ({ query }) => {
		logToolCall('webSearch', `Query: ${query}`);
		// --- STUB IMPLEMENTATION ---
		// In a real scenario, this would call a search API (Google, Bing, DuckDuckGo, Brave Search etc.)
		// For now, return a placeholder message.
		const resultText = `[Web Search Stub] Would search for: "${query}". No live search configured.`;
		logToolResult('webSearch', true, 'Stub executed');
		return { content: [{ type: "text" as const, text: resultText }] };
		// --- END STUB ---

		/* // Example using a hypothetical search API client
		try {
			// const searchResults = await searchApiClient.search(query);
			// const formattedResults = formatSearchResults(searchResults); // Process results
			// logToolResult('webSearch', true, `Found results for ${query}`);
			// return { content: [{ type: "text", text: formattedResults }] };
		} catch (error: any) {
			return logToolError('webSearch', error);
		}
		*/
	}
);


// --- Server Lifecycle and Error Handling ---

process.on('SIGINT', async () => {
	console.error('\n[MCP Server] Received SIGINT, shutting down gracefully.');
	await server.close();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.error('\n[MCP Server] Received SIGTERM, shutting down gracefully.');
	await server.close();
	process.exit(0);
});

process.on('uncaughtException', (error, origin) => {
	console.error(`[MCP Server] FATAL: Uncaught Exception at: ${origin}`, error);
	server.close().catch(err => console.error('[MCP Server] Error during shutdown on uncaughtException:', err)).finally(() => {
		process.exit(1);
	});
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('[MCP Server] FATAL: Unhandled Promise Rejection:', reason);
	server.close().catch(err => console.error('[MCP Server] Error during shutdown on unhandledRejection:', err)).finally(() => {
		process.exit(1);
	});
});

// --- Start the Server ---

async function main() {
	try {
		const transport = new StdioServerTransport();
		await server.connect(transport);
		console.error('-----------------------------------------------------');
		console.error(' ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Cognitive Tools MCP Server');
		console.error(' Status: Running on stdio');
		console.error('-----------------------------------------------------');
	}
	catch (error) {
		console.error('[MCP Server] Fatal error during startup:', error);
		process.exit(1);
	}
}

// Execute the main function to start the server
main();