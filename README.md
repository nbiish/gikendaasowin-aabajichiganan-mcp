# @nbiish/gikendaasowin-aabajichiganan-mcp

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

**See the latest integration details in [`integration-prompts/integration-prompt-07.md`](integration-prompts/integration-prompt-07.md).**

## Features

Provides five cognitive tools for AI agents:
- `think`: Internal workspace for structured analysis and planning
- `chain_of_thought`: Sequential reasoning steps for problem-solving
- `reflection`: Self-critique and improvement of reasoning
- `plan_and_solve`: High-level strategy development
- `chain_of_draft`: Concise, iterative reasoning steps

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

### Think Tool
- **Purpose**: MANDATORY core cognitive step for structured deliberation. Use this internal workspace for analysis, planning, verification, risk assessment, and self-correction before ANY action and after using other cognitive tools.
- **Input**: `thought` (string) - Your detailed internal monologue and reasoning. Structure clearly with sections like Analysis, Plan, Verification, Risk Assessment, and Self-Correction.
- **Response Format**:
```json
{
  "content": [{
    "type": "text",
    "text": "Returns the complete thought content you provided for explicit grounding in the next step"
  }]
}
```

### Chain of Thought Tool
- **Purpose**: Generate explicit, sequential reasoning steps for problem-solving
- **Input**: 
  - `generated_cot_text` (string) - The full, step-by-step Chain of Thought text you generated internally
  - `problem_statement` (string) - The original problem statement this CoT addresses
- **Response Format**: Returns the complete CoT text for mandatory analysis in the next step

### Reflection Tool
- **Purpose**: Self-critique and improvement of reasoning or plans
- **Input**: 
  - `generated_critique_text` (string) - The full critique text you generated internally
  - `input_reasoning_or_plan` (string) - The original text that was critiqued
- **Response Format**: Returns the complete critique text for mandatory analysis in the next step

### Plan and Solve Tool
- **Purpose**: High-level strategy development for complex objectives
- **Input**: 
  - `generated_plan_text` (string) - The full, structured plan text you generated internally
  - `task_objective` (string) - The original high-level task objective this plan addresses
- **Response Format**: Returns the complete plan text for mandatory analysis in the next step

### Chain of Draft Tool
- **Purpose**: Concise, iterative reasoning steps for rapid exploration
- **Input**: `problem_statement` (string) - Problem suitable for concise, iterative reasoning
- **Response Format**: Returns a confirmation message; the drafts you generated internally must be analyzed in the next step

### Mandatory Pre-Deliberation Assessment
- **Purpose**: Must be called BEFORE initiating significant cognitive processes (`think`) or complex action sequences. Evaluates CUC-N, recommends strategy, commits to next thought mode.
- **Input**: `assessment_and_choice` (string) - Your assessment including Situation Description, CUC-N Ratings, Recommended Strategy, and Selected Mode
- **Response Format**: Returns confirmation with the selected mode

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

## Test Examples

Here are some example test cases that demonstrate the cognitive tools using culturally appropriate Anishinaabe concepts. These examples are provided with respect and acknowledgment of Anishinaabe teachings.

### Using the MCP Inspector

1. Start the MCP Inspector:
```bash
npm run inspector
```

2. Connect to the server and try these example tool calls:

#### Think Tool Example
```json
{
  "toolName": "think",
  "arguments": {
    "thought": "Analyzing the Seven Grandfather Teachings (Nibwaakaawin - Wisdom, Zaagi'idiwin - Love, Minaadendamowin - Respect, Aakode'ewin - Bravery, Gwayakwaadiziwin - Honesty, Dabaadendiziwin - Humility, Debwewin - Truth) and their application in modern problem-solving:\n\n1. How does Nibwaakaawin guide decision-making?\n2. How can Zaagi'idiwin inform our approach to community?\n3. How does Minaadendamowin shape our relationship with knowledge?"
  }
}
```

Example Response:
```json
{
  "content": [{
    "type": "text",
    "text": "Analyzing the Seven Grandfather Teachings..."
  }]
}
```

#### Chain of Thought Example
```json
{
  "toolName": "chain_of_thought",
  "arguments": {
    "problem_statement": "Understanding the seasonal cycle of maple sugar harvesting (ziigwaage - spring sugar making):\n1. Observe weather patterns and temperature changes\n2. Identify appropriate maple trees\n3. Prepare tools and equipment respectfully\n4. Follow proper protocols for tree tapping\n5. Collect sap with gratitude\n6. Process sap into sugar while sharing teachings"
  }
}
```

#### Reflection Example
```json
{
  "toolName": "reflection",
  "arguments": {
    "input_reasoning_or_plan": "Reflecting on our relationship with Nibi (water):\n- Understanding water as first medicine\n- Considering our role as water protectors\n- Learning from the teachings of water\n- Examining how we honor water in daily life\n- Planning actions to protect water sources"
  }
}
```

#### Plan and Solve Example
```json
{
  "toolName": "plan_and_solve",
  "arguments": {
    "task_objective": "Planning a community gathering that honors traditional protocols:\n1. Consult with Elders on proper procedures\n2. Select appropriate time based on seasonal calendar\n3. Arrange for traditional foods and medicines\n4. Prepare the gathering space with respect\n5. Ensure proper opening and closing ceremonies\n6. Include time for teaching and sharing"
  }
}
```

#### Chain of Draft Example
```json
{
  "toolName": "chain_of_draft",
  "arguments": {
    "problem_statement": "Learning basic Anishinaabemowin greetings:\n1. Boozhoo (Hello)\n2. Aaniin (Hello/Welcome)\n3. Miigwech (Thank you)\n4. Baamaapii (Until later/Goodbye)\n5. Practice proper pronunciation\n6. Understand cultural context of each greeting"
  }
}
```

## Version History

**0.9.1**
- Fixed package publishing script to correctly publish both packages with different names
- Updated both packages to maintain version consistency

**0.9.0**
- Major update focused on iterative refinement and Chain of Draft methodology
- Updated tools with enhanced support for draft generation, analysis, and refinement
- Improved error handling, logging, and parameter descriptions
- Removed explicit version references for greater flexibility

**0.8.5**: Version update to resolve npm publish conflicts and maintain consistency between packages. Continues using the shortened tool name `assess_cuc_n_mode` to comply with MCP tool name length requirements.
- **0.8.4**: Version bump to align packages after updating the tool name from `assess_complexity_and_select_thought_mode` to `assess_cuc_n_mode`. Ensures consistent naming across all files.
- **0.8.3**: Updated package version to maintain consistency between `gikendaasowin-aabajichiganan-mcp` and `cognitive-tools-mcp` packages. Ensures all references to the tool use the shortened name `assess_cuc_n_mode`.
- **0.8.2**: Removed integration prompt references from codebase and made various refinements. Shortened `assess_complexity_and_select_thought_mode` to `assess_cuc_n_mode` to address MCP tool name length limitation.
- **0.8.1**: Updated tool function to integrate with external tools, renamed `assess_cuc_n_mode` to `assess_complexity_and_select_thought_mode`, improved validation of thought structure, aligned with AI Pair Programmer Prompt v0.8.1+
- **0.8.0**: Updated tool function design to return generated content for explicit analysis, renamed `assess_cuc_n` to `assess_cuc_n_mode`, aligned with AI Pair Programmer Prompt v0.8.0+
- **0.7.3**: Improved dual package publishing with automated scripts, consistent versioning, and documentation updates
- **0.7.2**: Updated tool names for length constraints (`assess_complexity_and_select_thought_mode` → `assess_cuc_n`), improved dual package publishing support, and aligned with AI Pair Programmer Prompt v0.7.2
- **0.7.1**: Updated to align with AI Pair Programmer Prompt v0.7.1+, renamed `assess_cuc_n_mode` to `assess_cuc_n`, enhanced cognitive tools for more explicit handling of tool needs
- **0.6.1**: Fixed tool naming issue for technical length limitation
- **0.3.9**: Updated tool descriptions and fixed error handling to improve reliability
- **0.3.6**: Updated repository URLs to point to gikendaasowin-aabajichiganan-mcp
- **0.3.5**: Updated license link and repository URLs
- **0.3.4**: Dual package publishing (Anishinaabemowin and English names)
- **0.3.3**: Fixed response format to comply with MCP schema, synchronized version numbers
- **0.3.2**: Updated response format structure
- **0.3.1**: Initial public release with basic functionality
- **0.3.0**: Development version

## Copyright

Copyright © 2025 ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), a descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band, and an enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians. All rights reserved.

## License

This work is licensed under the [COMPREHENSIVE RESTRICTED USE LICENSE FOR INDIGENOUS CREATIONS WITH TRIBAL SOVEREIGNTY, DATA SOVEREIGNTY, AND WEALTH RECLAMATION PROTECTIONS](https://github.com/nbiish/license-for-all-works/blob/main/LICENSE).

## Citation

Please cite this project using the following BibTeX entry:

```bibtex
@misc{gikendaasowin-aabajichiganan-mcp2025,
  author/creator/steward = {ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band},
  title/description = {gikendaasowin-aabajichiganan-mcp},
  type_of_work = {Indigenous digital creation/software incorporating traditional knowledge and cultural expressions},
  year = {2025},
  publisher/source/event = {GitHub repository under tribal sovereignty protections},
  howpublished = {\url{https://github.com/nbiish/gikendaasowin-aabajichiganan-mcp}},
  note = {Authored and stewarded by ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band (whose community faced violent dispersal resulting in descendants affiliating with LTBB, GTBOCI, and First Nations in Canada, as detailed in the Preamble), an enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians. This work embodies Indigenous intellectual property, traditional knowledge systems (TK), traditional cultural expressions (TCEs), and associated data protected under tribal law, federal Indian law, treaty rights, Indigenous Data Sovereignty principles, and international indigenous rights frameworks including UNDRIP. All usage, benefit-sharing, and data governance are governed by the COMPREHENSIVE RESTRICTED USE LICENSE FOR INDIGENOUS CREATIONS WITH TRIBAL SOVEREIGNTY, DATA SOVEREIGNTY, AND WEALTH RECLAMATION PROTECTIONS.}
}
```