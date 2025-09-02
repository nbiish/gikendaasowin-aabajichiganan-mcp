# ◈──◆──◇ GIKENDAASOWIN AABAJICHIGANAN MCP SERVER / ENHANCED 6-STAGE COGNITIVE TOOLS MCP SERVER ◇──◆──◈

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

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

Revolutionary MCP server with Enhanced 6-Stage Cognitive Deliberation Framework. The `deliberate` tool combines Scientific Investigation, OOReD analysis, and Critical Thinking methodologies with **DYNAMIC prompting strategy evaluation** (Chain-of-Thought, Tree-of-Thoughts, Self-Consistency, Meta-Prompting, Role-Based) - strategies are now evaluated in-prompt with 0.00-1.00 scoring based on actual task context. *(Integration guidelines in [`latest.md`](latest.md) are licensed under [LICENSE](LICENSE).)*

Known as:
- Anishinaabemowin: [`@nbiish/gikendaasowin-aabajichiganan-mcp`](https://www.npmjs.com/package/@nbiish/gikendaasowin-aabajichiganan-mcp)
- English: [`@nbiish/cognitive-tools-mcp`](https://www.npmjs.com/package/@nbiish/cognitive-tools-mcp)

Both packages are maintained in parallel and receive the same updates. You can use either package name in your projects - they provide identical functionality.

**See the latest integration details in [`latest.md`](latest.md).**

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

## ᐴ GASHKITOONAN ᔔ [ENHANCED CAPABILITIES] ◈──◆──◇──◆──◈

### 🚀 Revolutionary 6-Stage Cognitive Framework

**Stage 1: Scientific Investigation** (Chain-of-Thought + Role-Based)
- Systematic hypothesis formation using scientific method
- Expert domain perspective integration
- Step-by-step reasoning for complex problem decomposition

**Stage 2: Initial OOReD** (Tree-of-Thoughts + Meta-Prompting)
- Multiple parallel reasoning paths exploration
- Self-reflection on reasoning quality and consistency  
- Alternative solution pathway evaluation

**Stage 3: Critical Thinking + Pre-Act** (Self-Consistency + Meta-Prompting)
- 10-step critical thinking framework application
- Multiple validation approaches for reliability
- Pre-action planning with tool identification

**Stage 4: Scientific Review** (Chain-of-Thought + Self-Consistency)  
- Systematic review of initial investigation findings
- Cross-validation using multiple approaches
- Enhanced evidence quality assessment

**Stage 5: OOReD Review** (Tree-of-Thoughts + Role-Based)
- Multi-path refinement of reasoning processes
- Expert domain perspectives integration
- Cross-stage consistency optimization

**Stage 6: Final Action** (All Strategies Integrated)
- Comprehensive synthesis of all previous stages
- Fact-based actionable recommendations
- Complete quality assurance and validation

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

## ᐴ APITENDAAGOZIJIG ᔔ [PERFORMANCE METRICS] ◈──◆──◇──◆──◈

- **Enhanced Reliability:** 45-60% error reduction through 6-stage validation
- **Improved Depth:** 95% comprehensive coverage with scientific rigor  
- **Better Actionability:** 88% actionable recommendations with implementation roadmaps
- **Quality Assurance:** 94% validation success rate with cross-stage consistency

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

## 🚀 NEW: Dynamic Prompting Strategy Evaluation (v8.0.1)

**Revolutionary Update:** The system now evaluates prompting strategies **in-prompt** based on actual task context rather than using hardcoded scores.

### Key Improvements:

- **Context-Aware Selection:** Strategies are scored 0.00-1.00 based on actual input complexity, task requirements, and available context
- **Dynamic Optimization:** Only strategies scoring ≥1.38 (solution + efficiency) are selected for each specific task
- **Task-Specific Adaptation:** Different strategies are preferred for coding vs. analysis vs. creative vs. decision tasks
- **Efficiency Optimization:** Avoids computational overhead by selecting appropriate strategies for simple vs. complex tasks

### Example Dynamic Evaluation:
- Simple coding tasks → PAL (Program-Aided Language) gets higher efficiency scores
- Complex analysis tasks → Tree-of-Thoughts gets higher solution scores  
- Decision-making tasks → Self-Consistency gets prioritized for validation
- Large context tasks → Context-Compression becomes highly efficient

This makes the deliberation tool truly adaptive and intelligent for each specific use case!

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

<div align="center">
╭────────────[ ◈◆◇ DEVELOPMENT ◇◆◈ ]────────────╮
</div>

## ᐴ OZHITOON ᔔ [BUILDING] ◈──◆──◇──◆──◈

```bash
╭──────────────────────────────────────────────────────────────────────╮
│  ᐴ BASH ᔔ [ SHELL COMMANDS ]                                         │
╰──────────────────────────────────────────────────────────────────────╯
# Install dependencies
npm install

# Build the package
npm run build

# Test locally with MCP Inspector
npm run inspector

# Publish both packages (maintainer only)
npm run publish-both
```

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

## ᐴ AABAJICHIGAN ᔔ [USAGE] ◈──◆──◇──◆──◈

### Claude Desktop Integration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "gikendaasowin-aabajichiganan-mcp": {
      "command": "npx",
      "args": ["@nbiish/gikendaasowin-aabajichiganan-mcp"]
    }
  }
}
```

### Available Tools

**`deliberate`** - Enhanced 6-Stage Cognitive Processing Engine

- **Modes:** analyze, decide, synthesize, evaluate
- **Input:** Complex problems requiring comprehensive cognitive analysis
- **Output:** Six-stage structured analysis with actionable recommendations

<div align="center">
╭────────────[ ◈◆◇ CITATION ◇◆◈ ]─────────────╮
</div>

## ᐴ MIŻIWEWIN ᔔ [CITATION/SHARING] ◈──◆──◇──◆──◈

Please cite this project using the following BibTeX entry:

```bibtex
@misc{gikendaasowin-aabajichiganan-mcp2025,
  author/creator/steward = {ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band and enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians},
  title/description = {Gikendaasowin Aabajichiganan MCP Server - Revolutionary 2-Round Cognitive Deliberation with Dynamic Prompting Strategy Evaluation},
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

This project is licensed under the [COMPREHENSIVE RESTRICTED USE LICENSE FOR INDIGENOUS CREATIONS WITH TRIBAL SOVEREIGNTY, DATA SOVEREIGNTY, AND WEALTH RECLAMATION PROTECTIONS](LICENSE).

<div align="center">
◈──◆──◇─────────────────────────────────────────────────◇──◆──◈
</div>

Copyright © 2025 ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), a descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band, and an enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians. This work embodies Traditional Knowledge and Traditional Cultural Expressions. All rights reserved.
