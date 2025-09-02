# Dynamic Prompting Strategy Evaluation Update

## Overview

Updated the MCP server to implement truly dynamic prompting strategy evaluation as specified in `new-mcp-flow.md` lines 101-133. The system now evaluates strategies "in-prompt" rather than using hardcoded scores.

## Key Changes

### 1. Removed Hardcoded Scores
- **Before**: Strategies had fixed `solutionLevel`, `efficiencyLevel`, and `totalScore` values
- **After**: All scores are calculated dynamically based on actual input context

### 2. Implemented Dynamic Evaluation Functions

#### `evaluateSolutionLevel()`
- Analyzes input complexity, task requirements, and mode
- Evaluates how well each strategy solves the specific problem
- Considers factors like:
  - Input length and complexity
  - Code vs analysis vs creative vs decision tasks
  - Multi-step processes
  - Context availability

#### `evaluateEfficiencyLevel()`
- Evaluates computational and cognitive overhead
- Considers factors like:
  - Task simplicity vs complexity
  - Time constraints
  - Context availability
  - Strategy-specific overhead

### 3. Strategy-Specific Evaluation Logic

Each prompting strategy from `modern-prompting.mdc` is evaluated based on:

- **Cache-Augmented Reasoning + ReAct**: Excellent for reasoning + action cycles, benefits from context
- **Self-Consistency**: Best for decision validation, slower but more accurate
- **Tree of Thoughts**: Excels at complex decomposition, high overhead for simple tasks
- **Progressive-Hint Prompting**: Efficient iterative approach, uses context well
- **Cognitive Scaffolding**: Strong for structured thinking, handles complexity well
- **Knowledge Synthesis**: Great for integration tasks, good balance
- **Reflexive Analysis**: Specialized for evaluation and ethical considerations
- **PAL (Program-Aided Language)**: Highly efficient for computational/coding tasks
- **Context-Compression**: Excellent for large inputs, unnecessary for small ones

### 4. Maintains ≥1.38 Threshold System

- Only strategies scoring ≥1.38 (solution + efficiency) are selected
- Multiple strategies can be combined when they meet the threshold
- Results are sorted by total score for optimal selection

## Benefits

1. **Truly Adaptive**: Strategy selection now adapts to actual task requirements
2. **Context-Aware**: Evaluation considers available context and input complexity
3. **Task-Optimized**: Different strategies are preferred for different types of problems
4. **Efficient Resource Use**: Avoids overhead strategies for simple tasks
5. **Spec Compliant**: Fully implements the requirements from new-mcp-flow.md

## Technical Details

- All scoring uses 0.00-0.99 range as specified
- Dynamic evaluation happens during the Orient stage
- Results are formatted to show that scores were "evaluated in-prompt"
- Build and TypeScript compilation successful
- Maintains backward compatibility with existing 2-round deliberation process

---

*This update ensures the MCP deliberation tool truly selects the most appropriate prompting strategies for each specific task, making it more intelligent and efficient.*
