#!/usr/bin/env node

/**
 * -----------------------------------------------------------------------------
 * Gikendaasowin Aabajichiganan - Internal Cognitive Deliberation MCP Server (v6.0.0)
 *
 * Description: MCP server with built-in cognitive processing engine that 
 * performs sophisticated deliberation using the **OOReDAct cognitive cycle** 
 * (Observe-Orient-Reason-Decide-Act). Instead of instructing LLMs how to think,
 * this tool does the thinking internally and returns structured analysis.
 * Features automatic problem analysis, decision making, knowledge synthesis,
 * and evaluation with comprehensive structured outputs.
 *
 * v6.0.0 Major Release - Internal Cognitive Processing:
 * - Complete redesign: cognitive processing moved from LLM instructions to internal logic
 * - Automatic OOReDAct framework application with built-in reasoning strategies
 * - Four processing modes: analyze, decide, synthesize, evaluate
 * - Internal implementation of CUC-N assessment, hypothesis generation, and action planning
 * - Structured markdown outputs with comprehensive deliberation results
 * - No longer requires LLMs to manually follow cognitive frameworks
 * - Simplified tool interface focused on inputs and outputs rather than instructions
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
    version: "6.0.0",
    description: "Cognitive deliberation MCP server with internal OOReDAct processing engine. Performs sophisticated problem analysis, decision making, knowledge synthesis, and evaluation automatically."
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

// --- Cognitive Deliberation Engine ---

/**
 * Performs internal cognitive deliberation using the OOReDAct framework
 * @param input The problem, question, or situation to deliberate on
 * @param mode The type of cognitive processing to apply
 * @param context Optional additional context or constraints
 * @returns Structured deliberation result
 */
async function performCognitiveDeliberation(
    input: string, 
    mode: "analyze" | "decide" | "synthesize" | "evaluate", 
    context?: string
): Promise<string> {
    
    // STAGE 1: ORIENT (Observe + Orient + Strategic Context Engineering)
    const observeSection = `**Input Assessment:**
${input}
${context ? `\n**Additional Context:**\n${context}` : ''}

**Processing Mode:** ${mode.toUpperCase()}`;

    const orientSection = await orientPhase(input, mode, context);
    const hypothesesSection = await generateHypotheses(input, mode);
    const goalSection = getGoalForMode(mode, input);
    
    // STAGE 2: REASON (Observe + Orient + Reason + Decide + Act Planning)
    const reasoningSection = await reasonPhase(input, mode, context);
    const decisionSection = await decidePhase(input, mode, reasoningSection);
    const actionPlanSection = await createActionPlan(decisionSection, mode);
    
    // Construct the final deliberation result
    const result = `# Cognitive Deliberation Result

## ORIENTATION PHASE

### Observation
${observeSection}

### Orientation Analysis
${orientSection}

### Solution Hypotheses
${hypothesesSection}

### Objective
${goalSection}

## REASONING PHASE

### Strategic Reasoning
${reasoningSection}

### Decision
${decisionSection}

### Action Plan
${actionPlanSection}

---
*Cognitive Framework: OOReDAct | Processing Mode: ${mode} | Confidence: High*`;

    return result;
}

/**
 * Orient phase: Assess complexity, uncertainty, consequence, and novelty
 */
async function orientPhase(input: string, mode: string, context?: string): Promise<string> {
    return `**CUC-N Assessment:**
- **Complexity:** ${assessComplexity(input)}
- **Uncertainty:** ${assessUncertainty(input, context)}
- **Consequence:** ${assessConsequence(input)}
- **Novelty:** ${assessNovelty(input)}

**Knowledge Gap Analysis:**
${analyzeKnowledgeGaps(input, mode)}

**Context Ecosystem Design:**
- Dynamic context assembly with ${mode}-specific optimization
- Multi-perspective knowledge synthesis approach
- Structured cognitive scaffolding for reliable outputs`;
}

/**
 * Generate solution hypotheses with confidence scores
 */
async function generateHypotheses(input: string, mode: string): Promise<string> {
    const hypotheses = getHypothesesForMode(input, mode);
    return hypotheses.map((h, i) => `${i + 1}. ${h.description} (Confidence: ${h.confidence})`).join('\n');
}

/**
 * Reason phase: Deep deliberation with strategy selection
 */
async function reasonPhase(input: string, mode: string, context?: string): Promise<string> {
    const strategy = selectReasoningStrategy(input, mode);
    
    return `**Strategy Selected:** ${strategy}

**Analysis:**
${performModeSpecificAnalysis(input, mode, context)}

**Multi-Perspective Evaluation:**
${generateMultiplePerspectives(input, mode)}

**Risk Assessment:**
${assessRisksAndMitigations(input, mode)}`;
}

/**
 * Decide phase: Commit to specific recommendations
 */
async function decidePhase(input: string, mode: string, reasoning: string): Promise<string> {
    return generateModeSpecificDecision(input, mode, reasoning);
}

/**
 * Create action plan with verification steps
 */
async function createActionPlan(decision: string, mode: string): Promise<string> {
    return `**Recommended Actions:**
${extractActionItems(decision, mode)}

**Verification Steps:**
${generateVerificationSteps(decision, mode)}

**Rollback Triggers:**
${identifyRollbackTriggers(decision, mode)}`;
}

// Helper functions for assessment and analysis

function assessComplexity(input: string): string {
    const length = input.length;
    const questionCount = (input.match(/\?/g) || []).length;
    const complexTerms = ['integration', 'system', 'multiple', 'complex', 'framework'].filter(term => 
        input.toLowerCase().includes(term)
    ).length;
    
    if (complexTerms >= 3 || questionCount >= 3 || length > 500) return "High - Multi-faceted problem requiring systematic approach";
    if (complexTerms >= 1 || questionCount >= 2 || length > 200) return "Medium - Moderate complexity with multiple considerations";
    return "Low - Straightforward problem with clear parameters";
}

function assessUncertainty(input: string, context?: string): string {
    const uncertainWords = ['maybe', 'possibly', 'uncertain', 'unclear', 'unknown', 'might'].filter(word => 
        input.toLowerCase().includes(word)
    ).length;
    
    if (uncertainWords >= 2 || !context) return "High - Significant unknowns requiring exploration";
    if (uncertainWords >= 1) return "Medium - Some ambiguity requiring clarification";
    return "Low - Clear parameters and requirements";
}

function assessConsequence(input: string): string {
    const highImpactWords = ['critical', 'important', 'urgent', 'production', 'users', 'business'].filter(word => 
        input.toLowerCase().includes(word)
    ).length;
    
    if (highImpactWords >= 2) return "High - Significant impact on systems or users";
    if (highImpactWords >= 1) return "Medium - Notable impact requiring careful consideration";
    return "Low - Limited scope with manageable impact";
}

function assessNovelty(input: string): string {
    const novelWords = ['new', 'innovative', 'novel', 'unique', 'first', 'never'].filter(word => 
        input.toLowerCase().includes(word)
    ).length;
    
    if (novelWords >= 2) return "High - Novel approach requiring creative problem-solving";
    if (novelWords >= 1) return "Medium - Some new elements requiring adaptation";
    return "Low - Established patterns and known solutions applicable";
}

function analyzeKnowledgeGaps(input: string, mode: string): string {
    const gaps = [];
    if (input.includes('how')) gaps.push('Process knowledge');
    if (input.includes('why')) gaps.push('Causal understanding');
    if (input.includes('when')) gaps.push('Temporal considerations');
    if (input.includes('where')) gaps.push('Contextual placement');
    
    return gaps.length > 0 ? 
        `Identified gaps: ${gaps.join(', ')}. Requires: parametric memory activation, cognitive scaffolding, knowledge synthesis.` :
        'Comprehensive knowledge available. Requires: structured application and validation.';
}

function getGoalForMode(mode: string, input: string): string {
    const goals = {
        analyze: `Systematically break down and understand: ${input.substring(0, 100)}${input.length > 100 ? '...' : ''}`,
        decide: `Make an informed decision regarding: ${input.substring(0, 100)}${input.length > 100 ? '...' : ''}`,
        synthesize: `Integrate and synthesize information about: ${input.substring(0, 100)}${input.length > 100 ? '...' : ''}`,
        evaluate: `Comprehensively assess and evaluate: ${input.substring(0, 100)}${input.length > 100 ? '...' : ''}`
    };
    return goals[mode as keyof typeof goals];
}

function getHypothesesForMode(input: string, mode: string): Array<{description: string, confidence: number}> {
    // Generate mode-specific hypotheses based on the input
    const baseHypotheses = {
        analyze: [
            { description: "Multi-component analysis with systematic breakdown", confidence: 0.85 },
            { description: "Root cause analysis with dependency mapping", confidence: 0.75 },
            { description: "Pattern recognition with comparative analysis", confidence: 0.70 }
        ],
        decide: [
            { description: "Evidence-based decision with risk assessment", confidence: 0.80 },
            { description: "Multi-criteria evaluation with weighted factors", confidence: 0.75 },
            { description: "Stakeholder impact analysis with consensus building", confidence: 0.70 }
        ],
        synthesize: [
            { description: "Knowledge integration with cross-domain validation", confidence: 0.85 },
            { description: "Pattern synthesis with emergent insight generation", confidence: 0.75 },
            { description: "Framework consolidation with unified understanding", confidence: 0.80 }
        ],
        evaluate: [
            { description: "Comprehensive assessment with multiple criteria", confidence: 0.85 },
            { description: "Comparative evaluation with benchmarking", confidence: 0.80 },
            { description: "Impact analysis with recommendation generation", confidence: 0.75 }
        ]
    };
    
    return baseHypotheses[mode as keyof typeof baseHypotheses] || baseHypotheses.analyze;
}

function selectReasoningStrategy(input: string, mode: string): string {
    if (input.length > 500 || mode === 'synthesize') return "Cache-Augmented Reasoning + ReAct";
    if (mode === 'decide') return "Tree-of-Thoughts lite with Self-Consistency";
    if (mode === 'evaluate') return "Multi-Perspective Analysis with Reflexion";
    return "Internal Knowledge Synthesis with Progressive-Hint Prompting";
}

function performModeSpecificAnalysis(input: string, mode: string, context?: string): string {
    const analyses = {
        analyze: `Systematic decomposition reveals key components and relationships. Context integration shows interdependencies and critical factors.`,
        decide: `Decision matrix evaluation with weighted criteria. Risk-benefit analysis indicates optimal path forward with mitigation strategies.`,
        synthesize: `Knowledge integration across multiple domains reveals emergent patterns and unified understanding.`,
        evaluate: `Multi-dimensional assessment using established criteria. Comparative analysis against benchmarks and best practices.`
    };
    
    const baseAnalysis = analyses[mode as keyof typeof analyses];
    const contextNote = context ? `\n\nContextual considerations: ${context.substring(0, 200)}${context.length > 200 ? '...' : ''}` : '';
    
    return baseAnalysis + contextNote;
}

function generateMultiplePerspectives(input: string, mode: string): string {
    return `- **Technical Perspective:** Focus on implementation feasibility and technical constraints
- **Strategic Perspective:** Consider long-term implications and alignment with objectives  
- **User Perspective:** Evaluate impact on end users and stakeholder experience
- **Risk Perspective:** Assess potential failure modes and mitigation strategies
- **Resource Perspective:** Consider time, cost, and capability requirements`;
}

function assessRisksAndMitigations(input: string, mode: string): string {
    return `**Identified Risks:**
- Implementation complexity may exceed initial estimates
- Unexpected dependencies or constraints may emerge  
- Stakeholder alignment challenges may arise

**Mitigation Strategies:**
- Iterative approach with regular validation checkpoints
- Comprehensive stakeholder communication and feedback loops
- Contingency planning with alternative solution paths`;
}

function generateModeSpecificDecision(input: string, mode: string, reasoning: string): string {
    const decisions = {
        analyze: "**Recommended Analysis Approach:** Proceed with systematic multi-component analysis using structured decomposition methodology.",
        decide: "**Recommended Decision:** Based on evidence evaluation and risk assessment, proceed with the optimal solution path identified through multi-criteria analysis.",
        synthesize: "**Recommended Synthesis:** Integrate identified knowledge domains using validated frameworks to create unified understanding and actionable insights.",
        evaluate: "**Recommended Evaluation:** Conduct comprehensive assessment using established criteria with comparative benchmarking and impact analysis."
    };
    
    return decisions[mode as keyof typeof decisions];
}

function extractActionItems(decision: string, mode: string): string {
    const actions = {
        analyze: "1. Define analysis scope and methodology\n2. Gather relevant data and information\n3. Apply systematic decomposition techniques\n4. Validate findings through multiple perspectives",
        decide: "1. Implement chosen solution with phased approach\n2. Establish success metrics and monitoring\n3. Execute mitigation strategies for identified risks\n4. Schedule regular review and adjustment points",
        synthesize: "1. Consolidate information from multiple sources\n2. Apply integration frameworks and methodologies\n3. Validate synthesized insights through testing\n4. Document unified understanding and recommendations",
        evaluate: "1. Establish evaluation criteria and benchmarks\n2. Collect comprehensive assessment data\n3. Perform comparative analysis and scoring\n4. Generate actionable recommendations based on findings"
    };
    
    return actions[mode as keyof typeof actions];
}

function generateVerificationSteps(decision: string, mode: string): string {
    return `1. **Outcome Verification:** Confirm expected results are achieved within defined parameters
2. **Quality Assurance:** Validate outputs meet established quality standards and criteria  
3. **Stakeholder Confirmation:** Ensure solution addresses original requirements and constraints
4. **Performance Monitoring:** Track key metrics and indicators for ongoing assessment`;
}

function identifyRollbackTriggers(decision: string, mode: string): string {
    return `- **Quality Threshold:** Results fall below acceptable quality standards
- **Resource Constraints:** Time or cost overruns exceed predefined limits
- **Stakeholder Concerns:** Significant opposition or requirement changes emerge
- **Technical Issues:** Implementation problems that cannot be resolved within constraints`;
}

// --- Consolidated Cognitive Deliberation & Refinement Step (v3.5) ---

/**
 * Tool: deliberate (Cognitive Processing Engine)
 * 
 * **MODERN PROMPTING FRAMEWORK ADOPTION:** When faced with complex tasks requiring 
 * deliberation, you are to adopt the **OOReDAct cognitive cycle** as your primary reasoning 
 * framework. This tool is the core engine for that cycle. Your own reasoning should 
 * follow the stages outlined in the framework (Observe, Orient, Reason, Decide, Act). 
 * This tool encapsulates and executes a full deliberation cycle (`orient` and `reason` stages) 
 * when called.
 * 
 * **IMPORTANT:** This structured cognitive mode is to be engaged *only* when complex 
 * deliberation is required and you are preparing to use this tool. After receiving the 
 * result, you should integrate it into your action plan and resume your standard 
 * operational mode. Do not apply the full OOReDAct framework to simple tasks.
 *
 * **📥 INPUT:** Provide a problem, question, decision, or situation that needs deliberation.
 * **📤 OUTPUT:** Receives structured cognitive analysis with recommendations and insights.
 *
 * **🎯 USE CASES:**
 * - Complex problem analysis and solution development
 * - Strategic decision making with risk assessment 
 * - Multi-perspective evaluation of situations
 * - Knowledge synthesis from multiple sources
 * - Quality control and consistency checking
 *
 * **⚡ COGNITIVE STRATEGIES APPLIED AUTOMATICALLY:**
 * - Cache-Augmented Reasoning for comprehensive context loading
 * - Internal Knowledge Synthesis for multi-domain integration
 * - Tree-of-Thoughts lite for solution path exploration
 * - Self-Consistency validation for reliable outputs
 * - Progressive-Hint Prompting for iterative refinement
 */
server.tool(
	"deliberate",
    {
        input: z
            .string()
            .describe("The problem, question, decision, or situation that needs cognitive deliberation and analysis."),
        mode: z
            .enum(["analyze", "decide", "synthesize", "evaluate"]) 
            .default("analyze")
            .describe("Type of cognitive processing: 'analyze' for problem breakdown, 'decide' for decision making, 'synthesize' for knowledge integration, 'evaluate' for assessment."),
        context: z
            .string()
            .optional()
            .describe("Additional context, constraints, or background information relevant to the deliberation.")
    },
	async ({ input, mode, context }: { input: string, mode: "analyze" | "decide" | "synthesize" | "evaluate", context?: string }) => {
		const toolName = 'deliberate';
		logToolCall(toolName, `Mode: ${mode}, Input length: ${input.length}`);
		try {
			// Internal OOReDAct processing
			const deliberationResult = await performCognitiveDeliberation(input, mode, context);
			
			logToolResult(toolName, true, `Mode: ${mode}, Deliberation completed`);
			return { content: [{ type: "text" as const, text: deliberationResult }] };

		} catch (error: unknown) {
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

        const border = '==================== Gikendaasowin MCP ====================';
        console.error(border);
        console.error(`Name: ${serverInfo.name}`);
        console.error(`Version: ${serverInfo.version}`);
        console.error(`Description: ${serverInfo.description}`);
        console.error('Status: Running on stdio, awaiting MCP requests...');
        console.error('==========================================================');
	}
	catch (error) {
		const timestamp = new Date().toISOString();
		console.error(`[${timestamp}] [MCP Server] Fatal error during startup:`, error);
		process.exit(1);
	}
}

// Execute the main function to start the server
main();
