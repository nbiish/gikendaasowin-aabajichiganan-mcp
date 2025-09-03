# PRODUCT REQUIREMENTS DOCUMENT: GIKENDAASOWIN AABAJICHIGANAN MCP SERVER

**Author:** ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi) | **Date:** September 2, 2025 | **Version:** 8.9.6

## 1. OBJECTIVE

**Purpose:** Enable LLMs to leverage advanced cognitive deliberation frameworks for enhanced problem-solving through a structured 6-stage process that prompts LLMs to evaluate and select optimal cognitive techniques dynamically rather than providing pre-calculated solutions.

## 2. SCOPE

**In-Scope Features:**

- LLM-guided cognitive technique evaluation using 0.00-0.99 scoring system
- 6-stage deliberation framework (Scientific Investigation → OOReD → Critical Thinking → Reviews → Action)
- 15 modern prompting strategies for dynamic LLM selection
- ≥1.53 threshold rule for strategy combination and selection
- Iterative re-deliberation encouragement with tool usage estimation

**Out-of-Scope:**

- Hardcoded cognitive evaluations or pre-calculated strategy selections
- Complex UI interfaces or visual components
- Real-time collaborative deliberation features

## 3. USER EXPERIENCE

**User Flow:**

1. LLM calls `deliberate(input: string, context?: string)`
2. Tool provides structured 6-stage cognitive framework
3. LLM evaluates 15 cognitive techniques with solution/efficiency ratings
4. LLM selects techniques scoring ≥1.53 for implementation
5. LLM receives guidance to return to deliberate after using recommended tools

## 4. STRUCTURE → 'camel' workflow → QAMMML (Quanta Atoms Molecule Matter Matter-Phase Lifeform)

**Quanta:** Individual cognitive technique evaluations (0.00-0.99 scores)

**Atoms:** Single-stage deliberation components (Scientific Investigation, OOReD, Critical Thinking, etc.)

**Molecules:** 6-stage deliberation cycles combining multiple cognitive processes

**Matter:** Complete deliberation framework with technique selection and tool recommendations

**Matter Phases:** LLM-guided implementation cycles using selected cognitive techniques

**Lifeforms:** Enhanced AI reasoning capabilities through systematic cognitive deliberation

## 5. FUNCTIONAL REQUIREMENTS

### Core Features

- **LLM-Guided Evaluation:** Tool prompts LLM to evaluate cognitive techniques rather than providing hardcoded scores
- **Dynamic Strategy Selection:** 15 modern prompting strategies available for LLM assessment
- **Structured Framework:** 6-stage deliberation process with critical thinking questions
- **Threshold-Based Selection:** ≥1.53 scoring rule for technique combination
- **Tool Integration Planning:** Recommendations for tool usage and re-deliberation timing

## 6. NON-FUNCTIONAL REQUIREMENTS

**Performance:** Fast framework delivery (<2s), scalable to multiple concurrent deliberations
**Usability:** Single-parameter simplicity (input + optional context), clear structured prompts
**Security:** No data persistence, stateless operation, input sanitization
**Compatibility:** MCP protocol compliance, TypeScript/Node.js environment, npm package distribution

## 7. ASSUMPTIONS & CONSTRAINTS

**Assumptions:**

- LLMs can effectively evaluate cognitive techniques using numerical scoring
- 0.00-0.99 scoring system provides sufficient granularity for technique selection
- Users prefer LLM-guided evaluation over pre-calculated recommendations

**Constraints:**

- Technology: TypeScript, Node.js, MCP protocol specification
- Architecture: Single-function tool interface with structured prompt output
- Cognitive Framework: Must adhere to 6-stage deliberation process from new-mcp-flow.md

## 8. SUCCESS METRICS

**Key Performance Indicators:**

- Tool adoption rate: Target >80% preference over hardcoded approaches
- LLM technique selection accuracy: Target >90% appropriate technique selection  
- Re-deliberation engagement: Target >60% users return to deliberate with tools as recommended
- Problem-solving improvement: Target >40% better solution quality versus baseline

## 9. Knowledge Base

**Knowledge Base:**

- [new-mcp-flow.md](new-flow/new-mcp-flow.md): Complete flow specification and images
- [modern-prompting.mdc](modern-prompting.mdc): 15 cognitive techniques for LLM evaluation
- [latest.md](latest.md): Integration guidelines and implementation notes
- [REFACTOR_SUMMARY.md](REFACTOR_SUMMARY.md): Migration from hardcoded to LLM-guided approach

## 10. ACCEPTANCE CRITERIA

**Core Functionality:**

- [ ] Tool prompts LLM for technique evaluation instead of providing pre-calculated scores
- [ ] All 15 cognitive techniques from modern-prompting.mdc are presented for evaluation
- [ ] 0.00-0.99 scoring system with ≥1.53 threshold rule implemented correctly
- [ ] 6-stage deliberation framework follows new-mcp-flow.md specification exactly
- [ ] Tool encourages iterative re-deliberation with estimated tool usage counts

**Quality Standards:**

- [ ] Performance meets sub-2-second response targets
- [ ] No hardcoded cognitive evaluations remain in codebase
- [ ] MCP protocol compliance verified through testing
- [ ] TypeScript compilation successful with no errors

## 11. OPEN QUESTIONS

- How to measure long-term cognitive improvement in LLM problem-solving?
- Should we add analytics to track which cognitive techniques are most frequently selected?
- What is the optimal tool usage count recommendation for complex problems?

---

## PRD BEST PRACTICES CHECKLIST

- [x] Use clear, unambiguous language
- [x] Include specific, measurable requirements
- [x] Define success criteria objectively
- [x] Balance detail with conciseness
- [x] Treat PRD and Knowledge Base as living documents
- [x] Reference PRD and Knowledge Base throughout development lifecycle

---
*This PRD documents the successful implementation of LLM-guided cognitive deliberation as specified in new-mcp-flow.md. The tool now functions as a cognitive framework enhancer rather than a prescriptive system.*
