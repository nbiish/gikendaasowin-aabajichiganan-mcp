# @nbiish/gikendaasowin-aabajichiganan-mcp

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

Copyright © 2025 ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), a descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band, and an enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians. This work embodies Traditional Knowledge and Traditional Cultural Expressions. All rights reserved.

This project is licensed under the [COMPREHENSIVE RESTRICTED USE LICENSE FOR INDIGENOUS CREATIONS WITH TRIBAL SOVEREIGNTY, DATA SOVEREIGNTY, AND WEALTH RECLAMATION PROTECTIONS](LICENSE).

<div align="center">
  <hr width="50%">
  
  <h3>Support This Project</h3>
  <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0;">
    <div>
      <h4>Stripe</h4>
      <img src="qr-stripe-donation.png" alt="Scan to donate" width="180"/>
      <p><a href="https://donate.stripe.com/3cs29La1j8UGfnObII">Donate via Stripe</a></p>
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

Provides a suite of cognitive tools for AI agents, enabling structured reasoning and iterative refinement:
- `assess_cuc_n_mode`: **Mandatory** initial assessment of task complexity (CUC-N) to select cognitive mode (`think` or `quick_think`).
- `think`: **Mandatory** central hub for analysis, planning, verification, and self-correction, incorporating OODReAct principles.
- `quick_think`: Lightweight cognitive checkpoint for simple, low CUC-N steps or trivial confirmations.
- `gauge_confidence`: Meta-cognitive check to state confidence (High/Medium/Low) in a plan, analysis, or draft.
- `chain_of_thought`: Guides internal generation of detailed, step-by-step reasoning (CoT).
- `plan_and_solve`: Guides internal generation of a structured, multi-step plan.
- `chain_of_draft`: Signals internal generation/refinement of concise drafts (CoD).
- `reflection`: Guides internal generation of a critical self-evaluation (critique).
- `synthesize_prior_reasoning`: Guides internal generation of a summary to consolidate context.

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
- **Purpose**: **Mandatory Pre-Deliberation Assessment.** Evaluates task Complexity, Uncertainty, Consequence, Novelty (CUC-N) to determine required cognitive depth and initial strategy. MUST be called before starting complex tasks or changing strategy.
- **Input**: `assessment_and_choice` (string) - Your structured assessment including Situation Description, CUC-N Ratings, Rationale, Recommended Strategy, and Explicit Mode Selection (`Selected Mode: think` or `Selected Mode: quick_think`).
- **Follow-up**: Mandatory `think` or `quick_think` (based on selection).

### `think`
- **Purpose**: **MANDATORY Central Hub for Analysis and Planning.** Called after assessment, other cognitive tools, internal drafts, or external action results. Incorporates OODReAct principles (Observe-Orient-Decide-Reason-Act).
- **Input**: `thought` (string) - Your detailed internal monologue, ideally structured with sections like Observe, Orient, Decide, Reason, Act, Verification, Risk & Contingency, Learning & Adaptation.
- **Follow-up**: Execute the immediate next action defined in the `## Plan:` (or `## Decide:`) section.

### `quick_think`
- **Purpose**: Cognitive Checkpoint for streamlined processing and simple confirmations where detailed analysis via `think` is unnecessary. Use ONLY when appropriate (Low CUC-N, trivial steps).
- **Input**: `brief_thought` (string) - Your concise thought or confirmation.
- **Follow-up**: Execute the simple next step.

### `gauge_confidence`
- **Purpose**: Meta-Cognitive Checkpoint. Guides *internal stating* of confidence (High/Medium/Low) and justification regarding a specific plan, analysis, or draft.
- **Workflow**: Internally generate assessment -> Call tool.
- **Input**: `assessment_and_confidence` (string) - Text containing the item being assessed AND your explicit internal assessment (Confidence Level + Justification).
- **Follow-up**: Mandatory `think` or `quick_think`.

### `chain_of_thought`
- **Purpose**: Guides *internal generation* of a detailed, step-by-step reasoning draft (CoT).
- **Workflow**: Internally generate CoT -> Call tool.
- **Input**:
    - `generated_cot_text` (string) - The full CoT draft you generated internally.
    - `problem_statement` (string) - The original problem this CoT addresses.
- **Follow-up**: Mandatory `think` or `quick_think`.

### `plan_and_solve`
- **Purpose**: Guides *internal generation* of a structured plan draft.
- **Workflow**: Internally generate plan -> Call tool.
- **Input**:
    - `generated_plan_text` (string) - The full, structured plan draft you generated internally.
    - `task_objective` (string) - The original high-level task objective.
- **Follow-up**: Mandatory `think` or `quick_think`.

### `chain_of_draft`
- **Purpose**: Signals that one or more **internal drafts** have been generated/refined using Chain of Draft (CoD) principles (concise, note-like steps).
- **Workflow**: Internally generate/refine draft(s) -> Call tool.
- **Input**: `draft_description` (string) - Brief but specific description of the draft(s) generated/refined internally.
- **Follow-up**: Mandatory `think` or `quick_think`.

### `reflection`
- **Purpose**: Guides *internal generation* of a critical self-evaluation (critique) on a prior step, draft, plan, or outcome.
- **Workflow**: Internally generate critique -> Call tool.
- **Input**:
    - `generated_critique_text` (string) - The full critique text you generated internally.
    - `input_subject_description` (string) - A brief description of what was critiqued.
- **Follow-up**: Mandatory `think` or `quick_think`.

### `synthesize_prior_reasoning`
- **Purpose**: Context Management Tool. Guides *internal generation* of a structured summary of preceding context.
- **Workflow**: Internally generate summary -> Call tool.
- **Input**:
    - `generated_summary_text` (string) - The full, structured summary text you generated internally.
    - `context_to_summarize_description` (string) - Description of the context that was summarized.
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

#### `gauge_confidence` Example
```json
{
  "toolName": "gauge_confidence",
  "arguments": {
    "assessment_and_confidence": "Assessment of the plan to explain Mino-Bimaadiziwin using CoT.\\nConfidence Level: Medium.\\nJustification: The CoT approach is suitable, but explaining deep cultural concepts always carries a risk of nuance loss. Confidence is medium as external validation isn't possible here."
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

#### `plan_and_solve` Example
```json
{
  "toolName": "plan_and_solve",
  "arguments": {
    "generated_plan_text": "Goal: Plan a community gathering honoring traditional protocols.\\nStep 1: Consult Elders on protocols (Timing: Next action).\\nStep 2: Identify suitable date/location based on consultation.\\nStep 3: Arrange traditional foods/medicines.\\nStep 4: Prepare space respectfully.\\nStep 5: Finalize opening/closing ceremony details.\\nAssumptions: Elders are available for consultation.\\nRisks: Scheduling conflicts (Medium).",
    "task_objective": "Planning a community gathering that honors traditional protocols."
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

#### `reflection` Example
```json
{
  "toolName": "reflection",
  "arguments": {
    "generated_critique_text": "Critique of CoT for Mino-Bimaadiziwin: Strengths - Covers key components. Weaknesses - Could elaborate more on the interconnectedness of the teachings. Suggestion - Add a concluding step summarizing the holistic nature.",
    "input_subject_description": "Critique of the internally generated CoT for explaining Mino-Bimaadiziwin."
  }
}
```

#### `synthesize_prior_reasoning` Example
```json
{
  "toolName": "synthesize_prior_reasoning",
  "arguments": {
    "generated_summary_text": "Summary of last 3 steps: 1) Assessed task (explain Mino-Bimaadiziwin). 2) Planned to use CoT via 'think'. 3) Internally generated CoT draft covering definition, Four Hills, Seven Teachings, health aspects, and connection.",
    "context_to_summarize_description": "Summary of assessment, planning, and CoT generation for Mino-Bimaadiziwin explanation."
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