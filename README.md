# @nbiish/gikendaasowin-aabajichiganan-mcp

```bibtex
@misc{gikendaasowin-aabajichiganan-mcp2025,
  author/creator/steward = {ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band and enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians},
  title/description = {gikendaasowin-aabajichiganan-mcp},
  type_of_work = {Indigenous digital creation/software incorporating traditional knowledge and cultural expressions},
  year = {2025},
  publisher/source/event = {GitHub repository under tribal sovereignty protections},
  howpublished = {\\url{https://github.com/nbiish/gikendaasowin-aabajichiganan-mcp}},
  note = {Authored and stewarded by ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band and enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians. This work embodies Indigenous intellectual property, traditional knowledge systems (TK), traditional cultural expressions (TCEs), and associated data protected under tribal law, federal Indian law, treaty rights, Indigenous Data Sovereignty principles, and international indigenous rights frameworks including UNDRIP. All usage, benefit-sharing, and data governance are governed by the COMPREHENSIVE RESTRICTED USE LICENSE FOR INDIGENOUS CREATIONS WITH TRIBAL SOVEREIGNTY, DATA SOVEREIGNTY, AND WEALTH RECLAMATION PROTECTIONS.}\n}
```

Copyright © 2025 ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), a descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band, and an enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians. This work embodies Traditional Knowledge and Traditional Cultural Expressions. All rights reserved.

This project is licensed under the [COMPREHENSIVE RESTRICTED USE LICENSE FOR INDIGENOUS CREATIONS WITH TRIBAL SOVEREIGNTY, DATA SOVEREIGNTY, AND WEALTH RECLAMATION PROTECTIONS](LICENSE).

<div align="center">
  <hr width="50%">
  
  <h3>Support This Project</h3>
  <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0;">
    <div>
      <h4>Stripe</h4>
      <img src="qr-stripe-donation.png" alt="Scan to donate" width="180"/>
      <p><a href="https://raw.githubusercontent.com/nbiish/license-for-all-works/8e9b73b269add9161dc04bbdd79f818c40fca14e/qr-stripe-donation.png">Donate via Stripe</a></p>
    </div>
    <div style="display: flex; align-items: center;">
      <a href="https://www.buymeacoffee.com/nbiish"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=nbiish&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>
    </div>
  </div>
  
  <hr width="50%">
</div>

ᑭᑫᓐᑖᓱᐎᓐ ᐋᐸᒋᒋᑲᓇᓐ - Gikendaasowin Aabajichiganan - Cognitive Tools MCP: SOTA reasoning suite focused on iterative refinement and tool integration for AI Pair Programming. Enables structured, iterative problem-solving through Chain of Draft methodology, with tools for draft generation, analysis, and refinement. Features include advanced deliberation (`think`), rapid checks (`quick_think`), mandatory complexity assessment (`assess_cuc_n_mode`), context synthesis, confidence gauging, proactive planning, explicit reasoning (CoT), and reflection.

Known as:
- Anishinaabemowin: [`@nbiish/gikendaasowin-aabajichiganan-mcp`](https://www.npmjs.com/package/@nbiish/gikendaasowin-aabajichiganan-mcp)
- English: [`@nbiish/cognitive-tools-mcp`](https://www.npmjs.com/package/@nbiish/cognitive-tools-mcp)

Both packages are maintained in parallel and receive the same updates. You can use either package name in your projects - they provide identical functionality.

**See the latest integration details in [`latest.md`](latest.md).**

## Integration Prompt & Usage Guidelines

*(Note: This section reflects the content of `latest.md` and serves as the canonical guide for using these cognitive tools.)*

# SECONDARY SYSTEM PROMPT

You are the world's best SOTA Cognitive Agent! Your goal is to solve complex tasks with traceable, verifiable, and self-correcting reasoning. Operate within a structured cognitive loop, focusing on internal deliberation before planning external actions.

## GUIDING PRINCIPLES

1.  **Structured Deliberation:** Use the provided cognitive tools (`assess_cuc_n_mode`, `think`, `quick_think`, `chain_of_thought`, `chain_of_draft`) for their intended cognitive functions.
2.  **`think` is the Central Hub:** Prioritize using `think` for all complex analysis, planning, reflection, synthesis, and confidence assessment after most actions or observations. This is the recommended approach for robust reasoning.
3.  **Iterative Refinement:** Generate cognitive artifacts (CoT, CoD) internally, log them using the appropriate tool (`chain_of_thought`, `chain_of_draft`), then analyze in `think` or `quick_think`.
4.  **Context-Driven Depth:** Use `assess_cuc_n_mode` initially to guide your first step. For subsequent steps, use `think` for complex analysis (recommended default), and `quick_think` only for demonstrably trivial steps/results where detailed analysis is genuinely unnecessary. Be conservative with `quick_think`.
5.  **External Actions:** Plan external actions within `think`; execution is handled by the environment. Analyze results in `think` (recommended) or `quick_think` (if trivial).
6.  **Traceability:** Your structured use of `think` is key for verifiable reasoning.

## CORE WORKFLOW

1.  **Assess:** Call `assess_cuc_n_mode` for any non-trivial task as a starting point.
2.  **Deliberate:** Call `think` (recommended) or `quick_think` based on assessment/previous step. Analyze inputs/results. Plan immediate next cognitive action (e.g., use `chain_of_thought`, `chain_of_draft`) or plan external action.
3.  **Generate/Log (if applicable):** If planning CoT/CoD, generate internally, then call `chain_of_thought` or `chain_of_draft` to log it.
4.  **Execute/Observe:** If planning external action, wait for environment execution and result.
5.  **Return to Step 2 (Deliberate):** Analyze the result of the previous step (tool output, external result, error) using `think` (recommended default) or `quick_think` (if trivial). Iterate until task completion.
6.  **Conclude:** Formulate final answer within the `## Plan/Decision:` section of the final `think` step.

## `think` TOOL STRUCTURE GUIDANCE

Structure your `thought` input comprehensively using clear headings. This is crucial for effective analysis and planning. Recommended structure:
*   `## Observe:` (Analysis of previous step/result/error)
*   `## Orient:` (Contextualize, synthesize)
*   `## Decide:` (Define *single, immediate* next action: cognitive tool call or external action plan)
*   `## Reason:` (Rationale, alternatives, multi-step strategy, confidence assessment)
*   `## Act:` (Execution detail for planned action)
*   `## Verification:` (How to check next step's success)
*   `## Risk & Contingency:` (Potential problems, handling, risk level)
*   `## Learning & Adaptation:` (Adjustments, lessons learned, reflection)

## CHAIN OF DRAFT (CoD) GUIDELINES

When using `chain_of_draft` for efficiency:
*   **Internally Generate CoD:** Follow these guidelines *before* calling the `chain_of_draft` tool.
*   **Extreme Conciseness:** Use very brief notes (1-5 words), avoid full sentences.
*   **Symbols/Equations/Code:** Prioritize these over text.
*   **Essential Info Only:** Omit redundancy. Think 'scratchpad'.
*   **Final Answer:** Mark clearly if applicable (e.g., `#### Final Answer: [answer]`).
*   **Call Tool:** Call `chain_of_draft` with a brief description of the CoD artifact's purpose.

## ERROR HANDLING

If a tool or external action returns an error, analyze it. Your next step should be `think` to perform root cause analysis and plan correction.

---

Adhere to this workflow and prioritize the use of `think` for analysis and planning. Leverage CoD for efficiency where appropriate. Produce clear, traceable, SOTA-level reasoning.

## Development

```bash
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

## Publishing Both Packages

This project maintains two npm packages that must be kept in sync:
- `@nbiish/gikendaasowin-aabajichiganan-mcp`
- `@nbiish/cognitive-tools-mcp`

### Prerequisites
- Node.js >=14.0.0
- npm
- jq (for version management)

### Publishing Process

The `scripts/publish-both-packages.sh` script handles publishing both packages. It includes several safety features:

1. Version Synchronization Check
   - Automatically verifies both packages have matching versions
   - Prevents publishing if versions don't match

2. Error Recovery
   - Automatic cleanup of temporary files
   - Restores original package.json on failure

3. Version Management
   - Optional automatic version bumping
   - Ensures both packages maintain the same version

### Usage

Basic publishing:
```bash
npm run publish-both
```

Publishing with version bump:
```bash
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

### Error Handling

The script includes robust error handling:
- Checks for required tools (jq)
- Validates version synchronization
- Automatic cleanup on failure
- Preserves original files

## Test Examples

Here are some example test cases that demonstrate the cognitive tools using culturally appropriate Anishinaabe concepts. These examples are provided with respect and acknowledgment of Anishinaabe teachings.

*(Note: These examples show tool invocation structure. The actual content for inputs like `thought`, `generated_cot_text`, etc., must be generated internally by the agent based on the specific task, following the workflows described in `latest.md`.)*

### Using the MCP Inspector

1. Start the MCP Inspector:
```bash
npm run inspector
```

2. Connect to the server and try these example tool calls:

#### `assess_cuc_n_mode` Example
```json
{
  "toolName": "assess_cuc_n_mode",
  "arguments": {
    "assessment_and_choice": "1) Situation Description: User wants to understand the Anishinaabe concept of Mino-Bimaadiziwin (Living the Good Life).\\n2) CUC-N Ratings: Complexity: Medium (Involves cultural concepts), Uncertainty: Medium (Requires accessing and synthesizing knowledge), Consequence: Medium (Accuracy is important), Novelty: Low (Explaining concepts is common).\\n3) Rationale: Requires careful explanation of interconnected teachings.\\n4) Recommended Initial Strategy: Use chain_of_thought to break down the concept.\\n5) Explicit Mode Selection: Selected Mode: think"
  }
}
```

#### `think` Tool Example
```json
{
  "toolName": "think",
  "arguments": {
    "thought": "## Observe:\\nReceived task to explain Mino-Bimaadiziwin. Assessment chose 'think' mode.\\n## Orient:\\nMino-Bimaadiziwin is central to Anishinaabe philosophy, encompassing balance, health, and connection.\\n## Decide:\\nPlan to use chain_of_thought to structure the explanation.\\n## Reason:\\nA step-by-step approach will clarify the components (spiritual, mental, emotional, physical well-being).\\n## Act:\\nInternally generate CoT for Mino-Bimaadiziwin.\\n## Verification:\\nReview generated CoT for accuracy and completeness before calling the tool.\\n## Risk & Contingency:\\nRisk: Misrepresenting cultural concepts (Medium). Contingency: Rely on established knowledge, cross-reference if unsure, state limitations.\\n## Learning & Adaptation:\\nReinforce the need for careful handling of cultural knowledge."
  }
}
```

#### `quick_think` Example
```json
{
  "toolName": "quick_think",
  "arguments": {
    "brief_thought": "Observed successful completion of file read. Task is simple confirmation, no deep analysis needed. Proceeding to next step."
  }
}
```

#### `chain_of_thought` Example
```json
{
  "toolName": "chain_of_thought",
  "arguments": {
    "generated_cot_text": "Step 1: Define Mino-Bimaadiziwin - Living in balance and harmony.\\nStep 2: Explain the Four Hills of Life (infancy, youth, adulthood, elderhood) and their connection.\\nStep 3: Discuss the importance of the Seven Grandfather Teachings.\\nStep 4: Relate physical, mental, emotional, spiritual health.\\nStep 5: Emphasize connection to community, land, and spirit.",
    "problem_statement": "Explain the Anishinaabe concept of Mino-Bimaadiziwin."
  }
}
```

#### `chain_of_draft` Example
```json
{
  "toolName": "chain_of_draft",
  "arguments": {
    "draft_description": "Draft 1: Basic Anishinaabemowin greetings - Boozhoo, Aaniin. Draft 2: Added Miigwech, Baamaapii. Draft 3: Noted pronunciation focus needed."
  }
}
```

## Citation

Please cite this project using the following BibTeX entry:

```bibtex
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