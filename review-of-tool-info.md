# Review of Tool Info

## 1. Current Tool Definitions
- **assess_cuc_n_mode**: Evaluates Complexity, Uncertainty, Consequence, Novelty to choose initial cognitive strategy; returns full assessment in Markdown.
- **think**: Central hub for OODReAct‑style analysis, planning, reflection, synthesis, and confidence assessment; returns structured thought in Markdown.
- **quick_think**: Lightweight checkpoint for trivial steps or confirmations when full analysis is unnecessary; returns brief thought in Markdown.
- **chain_of_thought**: Logs detailed, step‑by‑step reasoning drafts (CoT) for complex problem solving; expects CoT text and original problem statement.
- **chain_of_draft**: Logs concise reasoning drafts (CoD) for token‑efficient reasoning; expects a brief draft description.

## 2. Proposed Condensed Descriptions
- **assess_cuc_n_mode**: "Assess CUC‑N factors to select the initial cognitive mode (think or quick_think)."
- **think**: "Perform detailed OODReAct analysis, planning, and self‑reflection."
- **quick_think**: "Log a concise checkpoint for trivial or low‑complexity steps."
- **chain_of_thought**: "Record detailed, step‑by‑step Chain of Thought drafts."
- **chain_of_draft**: "Record concise Chain of Draft notes for token‑efficient reasoning."

## 3. Rationale
- Focus each description on core purpose and workflow.
- Remove detailed usage guidelines and examples to save tokens.
- Preserve clarity by highlighting inputs and outputs.

## 4. Implementation Plan
1. Open `src/index.ts`.
2. Locate each `server.tool(...)` call.
3. Replace the long description argument with the corresponding condensed description above.
4. Ensure `z.string().describe(...)` calls remain for input schema clarity.
5. Run cognitive tool integration tests to verify behavior.
6. Update any related documentation to match new summaries.

---
*This plan condenses tool info, reduces token usage, and retains essential details for developer reference.*
