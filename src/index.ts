#!/usr/bin/env node

/**
 * -----------------------------------------------------------------------------
 * Gikendaasowin Aabajichiganan – Core Cognitive Tools MCP Server (2025 SOTA Edition)
 *
 * Description: Provides a streamlined suite of cognitive tools for an AI agent,
 *              focusing on assessment (`assess_cuc_n_mode`) and a central
 *              deliberation hub (`think` / `quick_think`). Chain of Thought (CoT)
 *              and Chain of Draft (CoD) reasoning styles are performed *within*
 *              the `think` tool as guided by the system prompt.
 *              All tool invocations are logged for traceability.
 *              Implements best practices from Anthropic's "think" tool research,
 *              τ-Bench/SWE-Bench results, and latest prompt engineering literature.
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
    version: "2.0.0",
    description: `Gikendaasowin Aabajichiganan – Core Cognitive Tools Suite (2025 SOTA): Focuses on Assess/Think loop. CoT/CoD styles are integrated into 'think'. Returns Markdown.`
};
const server = new McpServer(serverInfo);

// --- Logging Helpers ---

function logToolCall(toolName: string, details?: string): void {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [MCP Server] > Tool Call: ${toolName}${details ? ` - ${details}` : ''}`);
}

function logToolResult(toolName: string, success: boolean, resultDetails?: string): void {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [MCP Server] < Tool Result: ${toolName} - ${success ? 'Success' : 'Failure'}${resultDetails ? ` - ${resultDetails}` : ''}`);
}

function logToolError(toolName: string, error: unknown) {
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[${timestamp}] [MCP Server] ! Tool Error: ${toolName} - ${errorMessage}`);
    logToolResult(toolName, false, errorMessage);
    return {
        content: [{
            type: "text" as const,
            text: `Error executing tool '${toolName}': ${errorMessage}. Please analyze this error using a 'think' step.`
        }]
    };
}

// --- Core Cognitive Deliberation & Refinement Tools ---

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
            const modeRegex = /Selected Mode: (think|quick_think)/i;
            const modeMatch = assessment_and_choice.match(modeRegex);
            const selectedMode = modeMatch ? modeMatch[1].toLowerCase() : "unknown";
            if (assessment_and_choice.trim().length === 0) {
                throw new Error('Invalid assessment_and_choice: Must be a non-empty string.');
            }
            if (!modeMatch) {
                throw new Error('Invalid assessment: String must include explicit "Selected Mode: think" or "Selected Mode: quick_think".');
            }
            logToolResult(toolName, true, `Selected mode (extracted): ${selectedMode}`);
            console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input:\n${assessment_and_choice}`);
            return {
                content: [{
                    type: "text" as const,
                    text: assessment_and_choice
                }]
            };
        } catch (error: unknown) {
            return logToolError(toolName, error);
        }
    }
);

server.tool(
    "think",
    "**Central Hub for Comprehensive Analysis and Planning.** Use after `assess_cuc_n_mode`, after external action results/errors, or after `quick_think` if deeper analysis is needed. Incorporates OODReAct principles. Perform ALL detailed analysis, planning, reflection, synthesis, confidence assessment, and detailed (CoT-style) or concise (CoD-style) reasoning within this tool. Structure your thought clearly using headings. For simpler follow-up steps, consider using `quick_think`.",
    {
        thought: z.string().describe("Your **detailed** internal monologue covering Analysis/Observation, Plan/Decision, Verification, Risk & Contingency, and Learning & Adaptation. Include CoT/CoD style reasoning in the 'Reason' section when needed. Use clear headings as per system prompt.")
    },
    async ({ thought }: { thought: string }) => {
        const toolName = 'think';
        logToolCall(toolName);
        try {
            if (thought.trim().length === 0) {
                throw new Error('Invalid thought: Must be a non-empty string containing substantive reasoning.');
            }
            logToolResult(toolName, true, `Thought logged (length: ${thought.length})`);
            console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input:\n${thought}`);
            return {
                content: [{
                    type: "text" as const,
                    text: thought
                }]
            };
        } catch (error: unknown) {
            return logToolError(toolName, error);
        }
    }
);

export interface QuickThinkInput {
    brief_thought: string;
}

server.tool(
    "quick_think",
    "**Cognitive Checkpoint & Concise Drafter.** Use for simple confirmations OR efficient **Chain of Draft (CoD)** reasoning where detailed analysis via `think` is unnecessary. CoD focuses on minimal, essential steps (~5 words, equations) for speed and token efficiency. Use ONLY when full deliberation is excessive (verified Low CUC-N or targeted CoD).",
    {
        brief_thought: z.string().describe("Your **concise** input. For confirmations: State observation/action & confirm triviality. For CoD: Provide the minimal draft step (essential info, ~5 words, equation, etc.).")
    },
    async ({ brief_thought }: { brief_thought: string }) => {
        const toolName = 'quick_think';
        logToolCall(toolName);
        try {
            if (brief_thought.trim().length === 0) {
                throw new Error('Invalid brief_thought: Must be a non-empty string.');
            }
            logToolResult(toolName, true, `Logged: ${brief_thought.substring(0, 80)}...`);
            console.error(`[${new Date().toISOString()}] [MCP Server] - ${toolName} Input:\n${brief_thought}`);
            return {
                content: [{
                    type: "text" as const,
                    text: brief_thought
                }]
            };
        } catch (error: unknown) {
            return logToolError(toolName, error);
        }
    }
);

// --- Error Handling & Server Lifecycle ---

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
    shutdown().catch(() => process.exit(1));
});

process.on('unhandledRejection', (reason, promise) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [MCP Server] FATAL: Unhandled Promise Rejection:`, reason);
    shutdown().catch(() => process.exit(1));
});

// --- Start the Server ---

async function main(): Promise<void> {
    try {
        const transport = new StdioServerTransport();
        await server.connect(transport);

        const border = '-----------------------------------------------------';
        console.error(border);
        console.error(` ${serverInfo.description}`);
        console.error(' Status: Running on stdio, awaiting MCP requests...');
        console.error(border);
    }
    catch (error) {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] [MCP Server] Fatal error during startup:`, error);
        process.exit(1);
    }
}

main();
