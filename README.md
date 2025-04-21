# @nbiish/gikendaasowin-aabajichiganan-mcp

```bibtex
@misc{gikendaasowin-aabajichiganan-mcp<|2025=current_year|>,
  author/creator/steward = {ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band and enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians},
  title/description = {gikendaasowin-aabajichiganan-mcp},
  type_of_work = {Indigenous digital creation/software incorporating traditional knowledge and cultural expressions},
  year = {<|current_year|>},
  publisher/source/event = {GitHub repository under tribal sovereignty protections},
  howpublished = {\url{https://github.com/nbiish/gikendaasowin-aabajichiganan-mcp}},
  note = {Authored and stewarded by ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band and enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians. This work embodies Indigenous intellectual property, traditional knowledge systems (TK), traditional cultural expressions (TCEs), and associated data protected under tribal law, federal Indian law, treaty rights, Indigenous Data Sovereignty principles, and international indigenous rights frameworks including UNDRIP. All usage, benefit-sharing, and data governance are governed by the COMPREHENSIVE RESTRICTED USE LICENSE FOR INDIGENOUS CREATIONS WITH TRIBAL SOVEREIGNTY, DATA SOVEREIGNTY, AND WEALTH RECLAMATION PROTECTIONS.}
}
```

Copyright © <|current_year|> ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), a descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band, and an enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians. This work embodies Traditional Knowledge and Traditional Cultural Expressions. All rights reserved.

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

## Features

Provides a suite of cognitive tools for AI agents, enabling structured reasoning and iterative refinement (v1.2.1 Simplified Set):
- `assess_cuc_n_mode`: **Mandatory** initial assessment of task complexity (CUC-N) to select cognitive mode (`think` or `quick_think`).
- `think`: **Mandatory** central hub for comprehensive analysis, planning, verification, and self-correction.
- `quick_think`: Lightweight cognitive checkpoint for simple, low CUC-N steps or trivial confirmations.
- `chain_of_thought`: Guides internal generation and logging of detailed, step-by-step reasoning (CoT).
- `chain_of_draft`: Signals internal generation/refinement and logging of concise drafts (CoD) for efficiency.

## Installation

You can install using either the Anishinaabemowin or English package name:

```bash
# Using Anishinaabemowin package name
npx @nbiish/gikendaasowin-aabajichiganan-mcp

# Using English package name
npx @nbiish/cognitive-tools-mcp
```

## Usage with Claude Desktop

Add to your MCP configuration file (`~/.cursor/mcp.json`). You can use either package name:

```json
{
  "mcpServers": {
    "gikendaasowin-aabajichiganan": {
      "command": "npx",
      "args": ["-y", "@nbiish/gikendaasowin-aabajichiganan-mcp"]
    }
  }
}
```

Or:

```json
{
  "mcpServers": {
    "cognitive-tools": {
      "command": "npx",
      "args": ["-y", "@nbiish/cognitive-tools-mcp"]
    }
  }
}
```

## Tool Descriptions

*(Note: For detailed usage, workflow, and mandatory rules, always refer to [`latest.md`](latest.md))*

### `assess_cuc_n_mode`
- **Purpose**: **Mandatory Pre-Deliberation Assessment.** Evaluates task Complexity, Uncertainty, Consequence, Novelty (CUC-N) to determine required cognitive depth and initial strategy.
- **Input**: `assessment_and_choice` (string) - Your structured assessment including Situation Description, CUC-N Ratings, Rationale, Recommended Strategy, and Explicit Mode Selection (`Selected Mode: think` or `Selected Mode: quick_think`).
- **Follow-up**: Mandatory `think` or `quick_think` (based on selection).

### `think`
- **Purpose**: **MANDATORY Central Hub for Comprehensive Analysis and Planning.** Called after assessment, `chain_of_thought`/`chain_of_draft` results, or external action results. Use for analysis, planning, reflection, synthesis, confidence assessment.
- **Input**: `thought` (string) - Your detailed internal monologue covering key cognitive aspects (Analysis, Plan, Verification, Risk, Learning).
- **Follow-up**: Execute the immediate next action defined in the `## Plan/Decision:` section.

### `quick_think`
- **Purpose**: Cognitive Checkpoint for streamlined processing and simple confirmations where detailed analysis via `think` is unnecessary. Use ONLY when appropriate (Low CUC-N, trivial steps).
- **Input**: `brief_thought` (string) - Your concise thought or confirmation.
- **Follow-up**: Execute the simple next step.

### `chain_of_thought`
- **Purpose**: Guides *internal generation* and logging of detailed, step-by-step reasoning draft (CoT).
- **Workflow**: Internally generate CoT -> Call tool.
- **Input**:
    - `generated_cot_text` (string) - The full CoT draft you generated internally.
    - `problem_statement` (string) - The original problem this CoT addresses.
- **Follow-up**: Mandatory `think` or `quick_think`.

### `chain_of_draft`
- **Purpose**: Signals internal generation/refinement and logging of **efficient, concise drafts (CoD)** using note-like steps, symbols, etc.
- **Workflow**: Internally generate/refine CoD draft(s) -> Call tool.
- **Input**: `draft_description` (string) - Brief but specific description of the CoD draft(s) generated/refined internally.
- **Follow-up**: Mandatory `think` or `quick_think`.

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