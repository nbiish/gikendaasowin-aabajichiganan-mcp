# PRODUCT REQUIREMENTS DOCUMENT: GIKENDAASOWIN AABAJICHIGANAN MCP SERVER

**Author:** ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi) | **Date:** September 2, 2025 | **Version:** 8.9.0

## 1. OBJECTIVE

**Purpose:** Revolutionary MCP server that implements a 2-round, 6-stage cognitive deliberation framework with minimal filler verbiage, maximum LLM freedom, and dynamic prompting strategy evaluation from modern-prompting.mdc. The tool serves as an "advanced guided notepad" providing cognitive enhancement without constraining AI creativity.

## 2. SCOPE

**In-Scope Features:**

- Single `deliberate` tool accepting only `input` and optional `context` parameters
- Automatic mode detection (analyze, decide, synthesize, evaluate) based on input analysis
- 6-stage cognitive processing in 2 internal rounds without verbose formatting
- Dynamic prompting strategy evaluation with ≥1.42 threshold selection
- Natural integration of "tool use before re-deliberation" count
- Zero filler verbiage approach allowing complete LLM output freedom

**Out-of-Scope:**

- Multiple tool interfaces or complex parameter configurations
- Verbose formatting, headers, or output constraints
- Manual mode selection or strategy specification
- Session management or multi-call deliberation processes

## 3. USER EXPERIENCE

**User Flow:** LLM calls deliberate(input, context?) → Receives pure cognitive processing results → Constructs own narrative/format → Uses tool count for re-deliberation planning

## 4. STRUCTURE -> 'camel' workflow -> QAMMML (Quanta Atoms Molecule Matter Matter-Phase Lifeform)

**Quanta:** Individual cognitive processing functions (identifyScientificQuestion, formHypothesis, etc.)

**Atoms:** Stage processing functions (performScientificInvestigation, performInitialOOReD, etc.)

**Molecules:** Round processing (Round 1: Stages 1-2, Round 2: Stages 3-6)

**Matter:** Complete cognitive deliberation process (performCognitiveDeliberation)

**Matter Phases:** Tool interface and MCP server integration

**Lifeforms:** Full MCP server ecosystem with dual npm packages

## 5. FUNCTIONAL REQUIREMENTS

### Core Features

- **Single Tool Interface:** `deliberate(input: string, context?: string)`
- **Automatic Processing:** Scientific Investigation → OOReD → Critical Thinking → Reviews → Final Action
- **Dynamic Strategy Selection:** Evaluates all strategies from modern-prompting.mdc with real-time scoring
- **Minimal Output:** Raw cognitive processing without formatting constraints
- **Tool Count Integration:** Natural "tool use before re-deliberation: X" integration

### Prompting Strategy Integration

**From modern-prompting.mdc:**
- Cache-Augmented Reasoning + ReAct
- Self-Consistency (3 parallel drafts)
- ToT-lite (Tree of Thoughts)
- Progressive-Hint Prompting (PHP)
- Cognitive Scaffolding Prompting
- Knowledge Synthesis Prompting (KSP)
- Reflexive Analysis
- PAL (Program-Aided Language)
- Context-Compression

**Dynamic Evaluation System:**
- Solution Level: 0.00-0.99 based on task-specific problem-solving capability
- Efficiency Level: 0.00-0.99 based on computational/cognitive overhead
- Selection Threshold: ≥1.42 total score for strategy activation
- Multiple Strategy Combination: ≥1.53 rated strategies used together

## 6. NON-FUNCTIONAL REQUIREMENTS

**Performance:** Single tool call processing, no session dependencies
**Usability:** Maximum LLM freedom with zero formatting constraints
**Compatibility:** Standard MCP protocol, npm packages for both Anishinaabemowin and English names
**Maintainability:** Dual package synchronization with identical functionality

## 7. ASSUMPTIONS & CONSTRAINTS

**Assumptions:**
- LLMs benefit from cognitive frameworks when given output freedom
- Tool count integration aids deliberation workflow planning
- Dynamic strategy evaluation improves over hardcoded approaches

**Constraints:**
- Technology: TypeScript 5.9+, MCP SDK, Node.js ecosystem
- MCP Tool Name Limit: 60 characters total (server + tool name)
- Single-call architecture: All processing must happen in one tool invocation

## 8. SUCCESS METRICS

**Key Performance Indicators:**
- LLM Integration Score: >95% natural output construction
- Strategy Selection Accuracy: >90% optimal strategy identification for task type
- Output Freedom Index: 0% formatting constraints imposed
- Processing Efficiency: Single-call completion rate >99%

## 9. Knowledge Base

**Knowledge Base:**
- [new-flow/new-mcp-flow.md](new-flow/new-mcp-flow.md): Core architecture and flow requirements
- [modern-prompting.mdc](modern-prompting.mdc): Complete prompting strategy definitions and evaluation criteria
- [.cursor/rules/](/.cursor/rules/): Development guidelines and publishing requirements

## 10. ACCEPTANCE CRITERIA

**Core Functionality:**
- [ ] Single tool `deliberate` accepts only input and context parameters
- [ ] Automatic mode detection based on input analysis keywords
- [ ] Complete 6-stage processing in 2 internal rounds
- [ ] Dynamic prompting strategy evaluation with ≥1.42 threshold
- [ ] Zero verbose formatting or output constraints
- [ ] Natural "tool use before re-deliberation: X" integration

**Quality Standards:**
- [ ] Version synchronization across all three package.json files
- [ ] Dual npm package publishing capability
- [ ] MCP protocol compliance with 60-character limit
- [ ] TypeScript compilation without errors
- [ ] Natural LLM interaction without formatting constraints

## 11. OPEN QUESTIONS

- Optimal strategy combination algorithms for multiple ≥1.53 rated strategies
- Tool recommendation accuracy optimization based on cognitive processing results
- Integration testing methodologies for LLM freedom validation

---

## PRD BEST PRACTICES CHECKLIST

- [x] Use clear, unambiguous language
- [x] Include specific, measurable requirements  
- [x] Define success criteria objectively
- [x] Balance detail with conciseness
- [x] Treat PRD and Knowledge Base as living documents
- [x] Reference PRD and Knowledge Base throughout development lifecycle

---

## TECHNICAL ARCHITECTURE

### 6-Stage Cognitive Framework

**Round 1: Foundation**
1. **Scientific Investigation:** Hypothesis formation, experimental design, evidence framework
2. **Initial OOReD:** Observe-Orient-Reason-Decide with multiple pathway exploration

**Round 2: Advanced Processing**  
3. **Critical Thinking:** 10-step framework with pre-action planning and tool identification
4. **Scientific Review:** Systematic validation and cross-stage consistency checking
5. **OOReD Review:** Multi-path refinement with expert perspectives integration
6. **Final Action:** Comprehensive synthesis with implementation recommendations

### Dynamic Strategy Evaluation

**Real-time Assessment:**
- Input complexity analysis (length, terminology, domain indicators)
- Task type detection (coding, analysis, creative, decision-making)
- Context availability and depth evaluation
- Computational efficiency requirements

**Strategy Scoring:**
- Solution capability for specific problem type
- Processing efficiency for given constraints  
- Context utilization effectiveness
- Multi-strategy combination benefits

---

*This PRD template reflects the current v8.9.0 implementation with minimal filler approach and maximum LLM freedom while maintaining comprehensive cognitive processing capabilities.*
