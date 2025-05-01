# ◈──◆──◇ GIIZHENDAM AABAJICHIGANAN MCP SERVER ◇──◆──◈

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

```bibtex
╭──────────────────────────────────────────────────────────────────────╮
│  ᐴ BIBTEX ᔔ [ CITATION FORMAT ]                                     │
╰──────────────────────────────────────────────────────────────────────╯
@misc{gikendaasowin-aabajichiganan-mcp2025,
  author/creator/steward = {ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band and enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians},
  title/description = {gikendaasowin-aabajichiganan-mcp},
  type_of_work = {Indigenous digital creation/software incorporating traditional knowledge and cultural expressions},
  year = {2025},
  publisher/source/event = {GitHub repository under tribal sovereignty protections},
  howpublished = {\url{https://github.com/nbiish/gikendaasowin-aabajichiganan-mcp}},
  note = {Authored and stewarded by ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band and enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians. This work embodies Indigenous intellectual property, traditional knowledge systems (TK), traditional cultural expressions (TCEs), and associated data protected under tribal law, federal Indian law, treaty rights, Indigenous Data Sovereignty principles, and international indigenous rights frameworks including UNDRIP. All usage, benefit-sharing, and data governance are governed by the COMPREHENSIVE RESTRICTED USE LICENSE FOR INDIGENOUS CREATIONS WITH TRIBAL SOVEREIGNTY, DATA SOVEREIGNTY, AND WEALTH RECLAMATION PROTECTIONS.}
}
```

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

Copyright © 2025 ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), a descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band, and an enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians. This work embodies Traditional Knowledge and Traditional Cultural Expressions. All rights reserved.

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

This project is licensed under the [COMPREHENSIVE RESTRICTED USE LICENSE FOR INDIGENOUS CREATIONS WITH TRIBAL SOVEREIGNTY, DATA SOVEREIGNTY, AND WEALTH RECLAMATION PROTECTIONS](LICENSE).

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Agentic Cognitive Tools (v3.2.0): Implements Gikendaasowin v7 Guidelines. Enforces MANDATORY internal **Observe-Orient-Reason-Decide-Act (OOReDAct)** cycle: Starts with 'assess_and_orient', continues with 'think' deliberation before actions. Guides adaptive reasoning (**Chain-of-Thought (CoT)**, **Chain-of-Draft/Condensed Reasoning (CoD/CR)**, **Structured Chain-of-Thought (SCoT)**) & CodeAct preference. Returns Markdown.

Known as:
- Anishinaabemowin: [`@nbiish/gikendaasowin-aabajichiganan-mcp`](https://www.npmjs.com/package/@nbiish/gikendaasowin-aabajichiganan-mcp)
- English: [`@nbiish/cognitive-tools-mcp`](https://www.npmjs.com/package/@nbiish/cognitive-tools-mcp)

Both packages are maintained in parallel and receive the same updates. You can use either package name in your projects - they provide identical functionality.

**Note on Usage:** While the packages provide the core functionality, for clarity and alignment with careful prompting research, it's recommended to configure and invoke this MCP server using a more descriptive name like `deliberation` in your MCP client configuration (e.g., `mcp.json`), as shown in the example `mcp.json` reference. The internal tool name exposed by the server remains `deliberate`.

**Recent Updates:**
- v2.0.15: Updated Zod schema usage in `server.tool` to fix type error and rebuilt.
- v2.0.6: Added `mental_sandbox` tool for logging internal cognitive simulations.
- v2.0.6: Removed prefixing from cognitive tool outputs to ensure verbatim logging.
- Resolved TypeScript compilation errors related to MCP SDK types and server configuration.
- Ensured successful build process.

**See the latest integration details in [`latest.md`](latest.md).**

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

<div align="center">
╭───────────[ ◈◆◇ GIKENDAASOWIN ◇◆◈ ]───────────╮
</div>

## ᐴ GIKENDAASOWIN ᔔ [KNOWLEDGE/GUIDELINES] ◈──◆──◇──◆──◈

You are operating under the Gikendaasowin v7 Agentic Operational Guidelines, designed for robust, verifiable, and adaptive cognitive processes. Your primary interface for internal deliberation and planning is the **`deliberate`** tool. You **MUST** adhere to the following rules and workflow:

**MANDATORY OOReDAct Cycle:**

1.  **Initiation & Orientation (`deliberate` with `stage: "orient"`):** At the absolute beginning of processing ANY new user request or before ANY significant strategic pivot or change in direction, you **MUST** use the `deliberate` tool with `stage: "orient"`. In the `content` field, perform a mandatory initial assessment and orientation. Analyze the task/situation using the **CUC-N framework (Complexity, Uncertainty, Consequence, Novelty)**. This constitutes the initial **Observe** and **Orient** steps of the **OOReDAct (Observe-Orient-Reason-Decide-Act)** cycle. This step is CRITICAL for establishing context and grounding all subsequent actions.

2.  **Core Deliberation (`deliberate` with `stage: "reason"`):** After the initial `orient` step, and CRITICALLY after receiving ANY new information (results from tools, CodeAct output/errors, USER input, file reads, etc.), and BEFORE executing ANY non-trivial action (calling other tools, generating CodeAct, providing a final response), you **MUST** use the `deliberate` tool with `stage: "reason"`. In the `content` field, perform a full, structured **OOReDAct** cycle.
    *   **Observe:** Synthesize and integrate all new information and current state.
    *   **Orient:** Update your understanding of the situation based on the new observations and the initial orientation.
    *   **Reason:** This is where you perform the core cognitive work. Adapt your reasoning style based on the task requirements and complexity, drawing from the following techniques:
        *   **Chain-of-Thought (CoT):** For complex problems requiring detailed, step-by-step natural language reasoning to ensure accuracy and verifiability. Explicitly lay out each logical step.
        *   **Chain-of-Draft/Condensed Reasoning (CoD/CR):** For iterative problem-solving or when a more concise reasoning path is sufficient. Refine your thinking through drafts or provide a condensed sequence of key steps.
        *   **Structured Chain-of-Thought (SCoT):** Particularly useful for planning, code generation, or tasks requiring structured output. Incorporate program structures (sequence, branch, loop) or other explicit structural elements into your reasoning process to guide the subsequent action.
    *   **Decide:** Based on your reasoning, clearly state the next required action(s) or conclusion.
    *   **Act:** Plan the precise execution of the decided action(s). This plan will guide your subsequent tool calls or CodeAct generation.
    The output of this `reason` stage **MUST** clearly articulate the Observe, Orient, Reason (using an appropriate technique), Decide, and Act components.

3.  **Mandatory Mental Sandbox (`deliberate` with `stage: "sandbox"`):** IMMEDIATELY BEFORE executing ANY non-trivial output, plan, decision, or action (including tool calls or CodeAct), you **MUST** use the `deliberate` tool with `stage: "sandbox"`. In the `content` field, log your internal cognitive simulation. This includes Hypothesis Generation/Testing, Constraint Checks, Confidence Scoring, and Pre-computational Analysis related to the planned action. This step ensures a final verification before committing to an action.

4.  **Brief Acknowledgement (`deliberate` with `stage: "acknowledge"`):** Use this stage **SPARINGLY** and ONLY for acknowledging simple, expected, non-problematic outcomes (e.g., "File read successfully, proceeding as planned") where the next step is *already clearly defined* by a prior `reason` stage and requires NO re-evaluation or adaptation. This stage **DOES NOT** satisfy the mandatory `reason` cycle requirement.

**Tool Usage Rules:**

*   You **MUST** always begin a new task or strategic shift with `deliberate` (stage: "orient").
*   You **MUST** always follow new information or precede non-trivial actions with `deliberate` (stage: "reason").
*   You **MUST** always precede non-trivial outputs, plans, decisions, or actions with `deliberate` (stage: "sandbox").
*   You **MUST NOT** use any other tool or generate CodeAct without first completing the appropriate `deliberate` stages (`orient` -> `reason` -> `sandbox`) for the current context.
*   Adapt your reasoning style (CoT, CoD/CR, SCoT) within the `reason` stage of the `deliberate` tool based on the task's needs.
*   All output from the `deliberate` tool will be returned to you verbatim. Use this feedback to verify your internal state and proceed.
*   Prioritize CodeAct for external interactions where appropriate, but ALWAYS precede CodeAct generation with the mandatory `deliberate` stages.

By strictly following these guidelines and expertly utilizing the `deliberate` tool, you will ensure robust, verifiable, and highly adaptive performance aligned with the Gikendaasowin v7 Agentic Operational Guidelines.

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

<div align="center">
╭────────────[ ◈◆◇ DEVELOPMENT ◇◆◈ ]────────────╮
</div>

## ᐴ OZHITOON ᔔ [BUILDING] ◈──◆──◇──◆──◈

```bash
╭──────────────────────────────────────────────────────────────────────╮
│  ᐴ BASH ᔔ [ SHELL COMMANDS ]                                        │
╰──────────────────────────────────────────────────────────────────────╯
# Install dependencies
npm install

# Build the package
npm run build

# Test locally with MCP Inspector
npm run inspector

# Start the server
npm start

# Publishing both packages
./scripts/publish-both-packages.sh  # Publishes both package versions automatically
```

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

<div align="center">
╭────────────[ ◈◆◇ PUBLISHING ◇◆◈ ]─────────────╮
</div>

## ᐴ MIIGIWEWIN ᔔ [OFFERING/PUBLISHING] ◈──◆──◇──◆──◈

This project maintains two npm packages that must be kept in sync:
- `@nbiish/gikendaasowin-aabajichiganan-mcp`
- `@nbiish/cognitive-tools-mcp`

### ᐴ NITAM-AABAJICHIGANAN ᔔ [PREREQUISITES] ◈──◆──◈
- Node.js >=14.0.0
- npm
- jq (for version management)

### ᐴ MAAJITAAWIN ᔔ [BEGINNING/PROCESS] ◈──◆──◈

The `scripts/publish-both-packages.sh` script handles publishing both packages. It includes several safety features:
- Version Synchronization Check
  - Automatically verifies both packages have matching versions
  - Prevents publishing if versions don't match

- Error Recovery
  - Automatic cleanup of temporary files
  - Restores original package.json on failure

- Version Management
  - Optional automatic version bumping
  - Ensures both packages maintain the same version

### ᐴ INAABAJICHIGAN ᔔ [USAGE] ◈──◆──◈

Basic publishing:
```bash
╭──────────────────────────────────────────────────────────────────────╮
│  ᐴ BASH ᔔ [ SHELL COMMANDS ]                                        │
╰──────────────────────────────────────────────────────────────────────╯
npm run publish-both
```

Publishing with version bump:
```bash
╭──────────────────────────────────────────────────────────────────────╮
│  ᐴ BASH ᔔ [ SHELL COMMANDS ]                                        │
╰──────────────────────────────────────────────────────────────────────╯
./scripts/publish-both-packages.sh -b
```

The script will:
1. Check for required dependencies
2. Verify version synchronization
3. Optionally bump versions (with -b flag)
4. Prompt for NPM OTP code
5. Build the project
6. Publish both packages
7. Clean up temporary files

### ᐴ NAANAAGADAWENINDIZOWIN ᔔ [VERIFICATION/HANDLING] ◈──◆──◈

The script includes robust error handling:
- Checks for required tools (jq)
- Validates version synchronization
- Automatic cleanup on failure
- Preserves original files

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

<div align="center">
╭────────────[ ◈◆◇ EXAMPLES ◇◆◈ ]─────────────╮
</div>

## ᐴ WAABANDA'IWEWIN ᔔ [EXAMPLES] ◈──◆──◇──◆──◈

Here are some example test cases that demonstrate the cognitive tools using culturally appropriate Anishinaabe concepts. These examples are provided with respect and acknowledgment of Anishinaabe teachings.

*(Note: These examples show tool invocation structure. The actual content for inputs like `thought`, `sandbox_content`, etc., must be generated internally by the agent based on the specific task, following the workflows described in `latest.md`.)*

### ᐴ GANAWAABANDAAN ᔔ [EXAMINING/INSPECTOR] ◈──◆──◈

1. Start the MCP Inspector:
```bash
╭──────────────────────────────────────────────────────────────────────╮
│  ᐴ BASH ᔔ [ SHELL COMMANDS ]                                        │
╰──────────────────────────────────────────────────────────────────────╯
npm run inspector
```

2. Connect to the server and try these example tool calls:

#### `think` Tool Example
```json
╭──────────────────────────────────────────────────────────────────────╮
│  ᐴ JSON ᔔ [ DATA FORMAT ]                                           │
╰──────────────────────────────────────────────────────────────────────╯
{
  "toolName": "think",
  "arguments": {
    "thought": "## Observe:\\\\nReceived task to explain Mino-Bimaadiziwin. Assessment chose \'think\' mode.\\\\n## Orient:\\\\nMino-Bimaadiziwin is central to Anishinaabe philosophy, encompassing balance, health, and connection.\\\\n## Decide:\\\\nPlan to use structured reasoning (SCoT) to outline the explanation.\\\\n## Reason:\\\\nA step-by-step approach (SCoT) will clarify the components (spiritual, mental, emotional, physical well-being, community, land, spirit).\\\\n## Act (Plan):\\\\nGenerate SCoT outline for Mino-Bimaadiziwin explanation.\\\\n## Verification:\\\\nReview generated SCoT for accuracy, completeness, and cultural sensitivity before finalizing response.\\\\n## Risk & Contingency:\\\\nRisk: Misrepresenting cultural concepts (Medium). Contingency: Rely on established knowledge, cross-reference if unsure, state limitations.\\\\n## Learning & Adaptation:\\\\nReinforce the need for careful handling of cultural knowledge."
  }
}
```

#### `quick_think` Example
```json
╭──────────────────────────────────────────────────────────────────────╮
│  ᐴ JSON ᔔ [ DATA FORMAT ]                                           │
╰──────────────────────────────────────────────────────────────────────╯
{
  "toolName": "quick_think",
  "arguments": {
    "brief_thought": "Observed successful completion of file read. Task is simple confirmation, no deep analysis needed. Proceeding to next step."
  }
}
```

#### `mental_sandbox` Example
```json
╭──────────────────────────────────────────────────────────────────────╮
│  ᐴ JSON ᔔ [ DATA FORMAT ]                                           │
╰──────────────────────────────────────────────────────────────────────╯
{
  "toolName": "mental_sandbox",
  "arguments": {
    "sandbox_content": "<sandbox>\\n## Hypothesis Generation & Testing\\n<hypotheses>\\n1. Explain 'Debwewin' (Truth) directly using Seven Grandfather Teachings context.\\n2. Compare 'Debwewin' to Western concepts of truth, highlighting differences.\\n</hypotheses>\\n<evaluation>\\nHypothesis 1: High alignment with Anishinaabe worldview, promotes understanding within cultural context. Medium complexity.\\nHypothesis 2: Risks misinterpretation or oversimplification, potentially reinforces colonial framing. High complexity.\\n</evaluation>\\n## Constraint Checklist\\n<constraint_check>\\n1. Cultural Sensitivity: Pass (Hypothesis 1 focuses on internal context).\\n2. Accuracy: Pass (Based on teachings).\\n3. Clarity for User: Pass (Needs careful wording).\\n</constraint_check>\\n## Confidence Score\\n<confidence>High (for Hypothesis 1)</confidence>\\n## Pre-computational Analysis\\n<pre_computation>\\nSimulating Hypothesis 1: Leads to explanation focused on honesty, integrity, speaking from the heart. Positive impact on understanding Anishinaabe values.\\nSimulating Hypothesis 2: Leads to potentially complex, potentially problematic comparative analysis. Risk of inaccuracy.\\n</pre_computation>\\n</sandbox>"
  }
}
```

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

<div align="center">
╭────────────[ ◈◆◇ CITATION ◇◆◈ ]─────────────╮
</div>

## ᐴ MIŻIWEWIN ᔔ [CITATION/SHARING] ◈──◆──◇──◆──◈

Please cite this project using the following BibTeX entry:

```bibtex
╭──────────────────────────────────────────────────────────────────────╮
│  ᐴ BIBTEX ᔔ [ CITATION FORMAT ]                                     │
╰──────────────────────────────────────────────────────────────────────╯
@misc{gikendaasowin-aabajichiganan-mcp2025,
  author/creator/steward = {ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band and enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians},
  title/description = {gikendaasowin-aabajichiganan-mcp},
  type_of_work = {Indigenous digital creation/software incorporating traditional knowledge and cultural expressions},
  year = {2025},
  publisher/source/event = {GitHub repository under tribal sovereignty protections},
  howpublished = {\url{https://github.com/nbiish/gikendaasowin-aabajichiganan-mcp}},
  note = {Authored and stewarded by ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band and enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians. This work embodies Indigenous intellectual property, traditional knowledge systems (TK), traditional cultural expressions (TCEs), and associated data protected under tribal law, federal Indian law, treaty rights, Indigenous Data Sovereignty principles, and international indigenous rights frameworks including UNDRIP. All usage, benefit-sharing, and data governance are governed by the COMPREHENSIVE RESTRICTED USE LICENSE FOR INDIGENOUS CREATIONS WITH TRIBAL SOVEREIGNTY, DATA SOVEREIGNTY, AND WEALTH RECLAMATION PROTECTIONS.}
}