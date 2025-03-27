#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
	CallToolRequestSchema,
	ErrorCode,
	ListToolsRequestSchema,
	McpError,
	Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { Ajv, ValidateFunction } from 'ajv'; // Using named import for Ajv and ValidateFunction

const ajv = new Ajv();

// --- Tool Definitions ---

const thinkTool: Tool = {
	name: 'think',
	description:
		'Your primary internal workspace for structured analysis, planning, verification, and self-correction.',
	inputSchema: {
		type: 'object',
		properties: {
			thought: {
				type: 'string',
				description:
					'Your comprehensive internal analysis, step-by-step reasoning, policy checks, plan formulation/refinement, and self-correction.',
			},
		},
		required: ['thought'],
	},
};

const chainOfThoughtTool: Tool = {
	name: 'chain_of_thought',
	description:
		'Generates explicit, sequential reasoning steps to solve a specific problem or answer a question. Emphasizes showing the work.',
	inputSchema: {
		type: 'object',
		properties: {
			problem_statement: {
				type: 'string',
				description:
					'The specific, well-defined problem requiring detailed step-by-step reasoning.',
			},
		},
		required: ['problem_statement'],
	},
};

const reflectionTool: Tool = {
	name: 'reflection',
	description:
		'Facilitates self-critique and iterative improvement of generated thoughts, plans, or reasoning chains.',
	inputSchema: {
		type: 'object',
		properties: {
			input_reasoning_or_plan: {
				type: 'string',
				description: 'The cognitive output to be evaluated.',
			},
		},
		required: ['input_reasoning_or_plan'],
	},
};

const planAndSolveTool: Tool = {
	name: 'plan_and_solve',
	description:
		'Develops a high-level, structured strategy or sequence of actions to achieve a complex, multi-stage objective.',
	inputSchema: {
		type: 'object',
		properties: {
			task_objective: {
				type: 'string',
				description: 'The overarching goal requiring a structured plan.',
			},
		},
		required: ['task_objective'],
	},
};

const chainOfDraftTool: Tool = {
	name: 'chain_of_draft',
	description:
		'Generates concise, iterative drafts of reasoning steps, prioritizing efficiency over exhaustive detail.',
	inputSchema: {
		type: 'object',
		properties: {
			problem_statement: {
				type: 'string',
				description: 'Problem suitable for concise, iterative reasoning.',
			},
		},
		required: ['problem_statement'],
	},
};

// --- Tool Validators ---

const validateThinkArgs = ajv.compile(thinkTool.inputSchema);
const validateChainOfThoughtArgs = ajv.compile(chainOfThoughtTool.inputSchema);
const validateReflectionArgs = ajv.compile(reflectionTool.inputSchema);
const validatePlanAndSolveArgs = ajv.compile(planAndSolveTool.inputSchema);
const validateChainOfDraftArgs = ajv.compile(chainOfDraftTool.inputSchema);

const allTools = [
	thinkTool,
	chainOfThoughtTool,
	reflectionTool,
	planAndSolveTool,
	chainOfDraftTool,
];

const toolValidators: Record<string, ValidateFunction> = {
	think: validateThinkArgs,
	chain_of_thought: validateChainOfThoughtArgs,
	reflection: validateReflectionArgs,
	plan_and_solve: validatePlanAndSolveArgs,
	chain_of_draft: validateChainOfDraftArgs,
};

// --- Server Implementation ---

class CognitiveToolsServer {
	private server: Server;
	private serverInfo: { name: string; version: string; description: string }; // Store server info

	constructor() {
		this.serverInfo = { // Assign server info
			name: 'cognitive-tools-server',
			version: '0.2.0', // Incremented version
			description: 'Provides a suite of cognitive reasoning tools (think, CoT, reflection, plan_and_solve, CoD)', // Updated description
		};
		this.server = new Server(
			this.serverInfo, // Use stored info
			{
				capabilities: {
					resources: {}, // No resources defined yet
					tools: {}, // Handled dynamically by request handlers
				},
			}
		);

		this.setupToolHandlers();

		this.server.onerror = (error) =>
			console.error('[CognitiveToolsServer MCP Error]', error);
		process.on('SIGINT', async () => {
			console.error('[CognitiveToolsServer] Received SIGINT, shutting down.');
			await this.server.close();
			process.exit(0);
		});
		process.on('SIGTERM', async () => {
			console.error('[CognitiveToolsServer] Received SIGTERM, shutting down.');
			await this.server.close();
			process.exit(0);
		});
	}

	private setupToolHandlers() {
		// List Tools Handler
		this.server.setRequestHandler(ListToolsRequestSchema, async () => {
			console.error('[CognitiveToolsServer] ListTools request received. Responding with all tools.');
			return {
				tools: allTools, // Return all defined tools
			};
		});

		// Call Tool Handler
		this.server.setRequestHandler(
			CallToolRequestSchema,
			async (request) => {
				const { name, arguments: args } = request.params;
				console.error(
					`[CognitiveToolsServer] Received call for tool: ${name} with args:`,
					JSON.stringify(args, null, 2)
				);

				const validator = toolValidators[name];

				if (!validator) {
					console.error(`[CognitiveToolsServer] Unknown tool requested: ${name}`);
					throw new McpError(
						ErrorCode.MethodNotFound,
						`Unknown tool: ${name}`
					);
				}

				console.error(`[CognitiveToolsServer] Validating arguments for tool: ${name}`);

				// Validate arguments
				if (!validator(args as unknown)) {
					const errors = validator.errors ?? [];
					console.error(
						`[CognitiveToolsServer] Invalid arguments for tool ${name}:`,
						errors
					);
					throw new McpError(
						ErrorCode.InvalidParams,
						`Invalid arguments for tool ${name}: ${ajv.errorsText(errors)}`
					);
				}

				console.error(`[CognitiveToolsServer] Arguments validated successfully for tool: ${name}`);

				// Return standard acknowledgement response
				// The actual cognitive work is done by the agent calling the tool.
				const responseContent = { acknowledged: true, tool: name };
				console.error(
					`[CognitiveToolsServer] Responding for tool ${name}:`,
					JSON.stringify(responseContent, null, 2)
				);
				return {
					content: [
						{
							type: 'application/json',
							text: JSON.stringify(responseContent, null, 2),
						},
					],
				};
			}
		);
	}

	async run() {
		const transport = new StdioServerTransport();
		await this.server.connect(transport);
		console.error(`[CognitiveToolsServer] MCP server (v${this.serverInfo.version}) running on stdio`); // Use this.serverInfo.version
	}
}

const server = new CognitiveToolsServer();
server.run().catch((err) => {
	console.error('[CognitiveToolsServer] Failed to start server:', err);
	process.exit(1);
});
