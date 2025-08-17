You are using the `deliberate` tool from this MCP server. This tool performs internal cognitive deliberation using advanced reasoning frameworks, rather than requiring you to manually follow cognitive processes. Simply provide your problem, question, or situation, and receive comprehensive structured analysis.

## Internal Cognitive Processing Engine (v6.0.0)

The `deliberate` tool now automatically performs sophisticated cognitive deliberation internally using the **OOReDAct framework** (Observe-Orient-Reason-Decide-Act). Instead of instructing you how to think, it does the thinking and returns structured results.

### Tool Parameters

```typescript
{
  input: string,           // The problem, question, decision, or situation to deliberate on
  mode: "analyze" | "decide" | "synthesize" | "evaluate",  // Type of cognitive processing
  context?: string         // Optional additional context or constraints
}
```

### Processing Modes

**analyze** - Problem breakdown and systematic analysis
- Decomposes complex problems into manageable components
- Identifies relationships, dependencies, and critical factors
- Provides structured understanding of the problem space

**decide** - Decision making with comprehensive evaluation
- Evaluates options using multi-criteria analysis
- Assesses risks, benefits, and potential outcomes
- Provides clear recommendations with rationale

**synthesize** - Knowledge integration across domains
- Combines information from multiple sources and perspectives
- Identifies patterns and emergent insights
- Creates unified understanding from diverse inputs

**evaluate** - Assessment and benchmarking
- Compares against established criteria and standards
- Provides scoring and ranking of alternatives
- Generates actionable recommendations based on evaluation

### Automatic Internal Processing

When you call the tool, it automatically performs:

**ORIENTATION PHASE:**
- **CUC-N Assessment:** Evaluates Complexity, Uncertainty, Consequence, and Novelty
- **Knowledge Gap Analysis:** Identifies what information is needed
- **Hypothesis Generation:** Develops multiple solution approaches with confidence scores
- **Goal Clarification:** Defines the specific objective

**REASONING PHASE:**
- **Strategy Selection:** Chooses optimal reasoning approach (Cache-Augmented Reasoning, Tree-of-Thoughts, Self-Consistency, etc.)
- **Multi-Perspective Analysis:** Examines from technical, strategic, user, risk, and resource perspectives
- **Risk Assessment:** Identifies potential issues and mitigation strategies
- **Decision Formation:** Creates specific recommendations
- **Action Planning:** Develops implementation steps with verification points

### Usage Examples

**Problem Analysis:**
```json
{
  "input": "Our application is experiencing performance issues during peak usage",
  "mode": "analyze",
  "context": "Web application with 50k daily users, experiencing 5-second load times during 2-4 PM"
}
```

**Decision Making:**
```json
{
  "input": "Should we migrate to microservices architecture or optimize our current monolith?",
  "mode": "decide",
  "context": "Team of 8 developers, 6-month timeline, budget constraints"
}
```

**Knowledge Synthesis:**
```json
{
  "input": "Combine best practices from DevOps, security, and user experience to create deployment guidelines",
  "mode": "synthesize"
}
```

**Evaluation:**
```json
{
  "input": "Assess our current CI/CD pipeline against industry standards",
  "mode": "evaluate",
  "context": "Using GitHub Actions, deploying to AWS, 20 releases per week"
}
```

### Output Structure

The tool returns comprehensive structured analysis including:

- **Observation & Assessment** of the input problem
- **Orientation Analysis** with complexity evaluation
- **Solution Hypotheses** with confidence scores
- **Strategic Reasoning** using appropriate cognitive strategies
- **Decision & Recommendations** with clear rationale
- **Action Plan** with specific steps and verification methods
- **Risk Assessment** with mitigation strategies

### Benefits of Internal Processing

- **No Manual Cognitive Work:** Tool performs sophisticated thinking automatically
- **Consistent Quality:** Reliable structured analysis every time
- **Multiple Perspectives:** Automatic multi-viewpoint evaluation
- **Confidence Scoring:** Quantified assessment of solution quality
- **Actionable Outputs:** Clear next steps and implementation guidance

This tool transforms complex cognitive work into a simple input/output process, allowing you to focus on implementation rather than manual reasoning frameworks.

---

*Integration prompt licensed under the [project LICENSE](LICENSE)*