# Plan: Update Cognitive Tools MCP Server

**Objective:** Update the `cognitive-tools` MCP server (`src/index.ts`) to implement and integrate the five internal cognitive tools (`think`, `chain_of_thought`, `reflection`, `plan_and_solve`, `chain_of_draft`) as described in the provided system prompt.

**Steps:**

1.  **Define Tool Objects:**
    *   Keep the existing `thinkTool` object.
    *   Create similar TypeScript constant objects (`chainOfThoughtTool`, `reflectionTool`, `planAndSolveTool`, `chainOfDraftTool`) for the other four tools.
    *   Each object will contain:
        *   `name`: The tool's name (e.g., 'chain_of_thought').
        *   `description`: The description provided in the system prompt.
        *   `inputSchema`: The JSON schema defining the expected input parameters (e.g., `problem_statement` for `chain_of_thought`), based on the system prompt.

2.  **Create Argument Validators:**
    *   Keep the existing `validateThinkArgs`.
    *   Use `ajv.compile()` to create validator functions for the input schemas of the four new tools (e.g., `validateChainOfThoughtArgs`, `validateReflectionArgs`, etc.).

3.  **Update Tool List:**
    *   Modify the `ListToolsRequestSchema` handler (around line 73 in the original file) to return an array containing *all five* tool objects (`[thinkTool, chainOfThoughtTool, reflectionTool, planAndSolveTool, chainOfDraftTool]`).

4.  **Refactor Call Tool Handler:**
    *   Modify the `CallToolRequestSchema` handler (around line 81 in the original file) to handle calls for any of the five tools.
    *   Use a `switch` statement or `if/else if` chain based on the requested `name`.
    *   Inside each case:
        *   Select the appropriate validator function (created in step 2).
        *   Validate the provided `args` against the tool's schema using the validator.
        *   If validation fails, throw an `McpError` with `ErrorCode.InvalidParams`.
        *   If validation succeeds, return the standard acknowledgement response.

5.  **Update Server Metadata:**
    *   Update the server `description` in the `CognitiveToolsServer` constructor (around line 45 in the original file) to accurately reflect that it provides the full suite of cognitive tools.
    *   Increment the server `version` (around line 44 in the original file) to indicate a significant update (e.g., `0.2.0`).

**Diagram:**

```mermaid
graph TD
    A[Start: User Request] --> B{Analyze src/index.ts};
    B --> C[Plan: Define 5 Tool Objects];
    C --> D[Plan: Create ajv Validators];
    D --> E[Plan: Update ListTools Handler];
    E --> F[Plan: Refactor CallTool Handler];
    F --> G[Plan: Update Server Metadata];
    G --> H{Present Plan to User};
    H -- Approve --> I{Ask to Save Plan?};
    I -- Yes --> J[Save Plan to MD];
    I -- No --> K[Suggest Switch to 'code' Mode];
    J --> K;
    H -- Revise --> B;