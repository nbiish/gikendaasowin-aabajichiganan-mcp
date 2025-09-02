#!/usr/bin/env node

/**
 * Quick test to see the deliberation output with our changes
 */

const { McpServer } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");

// Import the built server
const serverModule = require('./build/index.js');

async function testDeliberation() {
    console.log("Testing deliberation with threshold ≥1.42...");
    
    // Mock a simple deliberation call to see the output format
    const testInput = "Need to update index.ts file based on critical change from ≥1.38 to ≥1.42 threshold";
    const mode = "analyze";
    const context = "TypeScript MCP server optimization";
    
    console.log("\n--- Testing Deliberation Output ---");
    console.log("Input:", testInput);
    console.log("Mode:", mode);
    console.log("Expected improvements: Less verbose output, no redundant 'Strategy-Enhanced Results' sections");
}

testDeliberation();
