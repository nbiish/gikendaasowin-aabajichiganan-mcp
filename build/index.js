#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// Create the MCP server
const server = new McpServer({
    name: "cognitive-tools-mcp",
    version: "0.3.3",
    description: "Provides a suite of advanced cognitive reasoning tools for sophisticated problem-solving"
});
// Define the think tool
server.tool("think", {
    thought: z.string().describe("Your comprehensive internal analysis, step-by-step reasoning, policy checks, plan formulation/refinement, and self-correction.")
}, async ({ thought }) => {
    if (!thought || typeof thought !== 'string') {
        throw new Error('Invalid thought: Must be a non-empty string');
    }
    return {
        content: [{
                type: "text",
                text: thought
            }]
    };
});
// Define the chain_of_thought tool
server.tool("chain_of_thought", {
    problem_statement: z.string().describe("The specific, well-defined problem requiring detailed step-by-step reasoning.")
}, async ({ problem_statement }) => {
    if (!problem_statement || typeof problem_statement !== 'string') {
        throw new Error('Invalid problem statement: Must be a non-empty string');
    }
    return {
        content: [{
                type: "text",
                text: problem_statement
            }]
    };
});
// Define the reflection tool
server.tool("reflection", {
    input_reasoning_or_plan: z.string().describe("The cognitive output to be evaluated.")
}, async ({ input_reasoning_or_plan }) => {
    if (!input_reasoning_or_plan || typeof input_reasoning_or_plan !== 'string') {
        throw new Error('Invalid input: Must be a non-empty string');
    }
    return {
        content: [{
                type: "text",
                text: input_reasoning_or_plan
            }]
    };
});
// Define the plan_and_solve tool
server.tool("plan_and_solve", {
    task_objective: z.string().describe("The overarching goal requiring a structured plan.")
}, async ({ task_objective }) => {
    if (!task_objective || typeof task_objective !== 'string') {
        throw new Error('Invalid task objective: Must be a non-empty string');
    }
    return {
        content: [{
                type: "text",
                text: task_objective
            }]
    };
});
// Define the chain_of_draft tool
server.tool("chain_of_draft", {
    problem_statement: z.string().describe("Problem suitable for concise, iterative reasoning.")
}, async ({ problem_statement }) => {
    if (!problem_statement || typeof problem_statement !== 'string') {
        throw new Error('Invalid problem statement: Must be a non-empty string');
    }
    return {
        content: [{
                type: "text",
                text: problem_statement
            }]
    };
});
// Setup error handling
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
        console.error('Cognitive Tools MCP Server running on stdio');
    }
    catch (error) {
        console.error('Fatal error in main():', error);
        process.exit(1);
    }
}
main();
