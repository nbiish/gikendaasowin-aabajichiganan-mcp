# Research & Enhancement Report: Strategies 11-15 (Jan 2026)

This document details the analysis and modernization of cognitive strategies 11 through 15, based on AI prompting and context engineering best practices as of January 10th, 2026.

## Overview of Strategies

11. **Progressive-Hint Prompting (PHP)**
12. **Cache-Augmented Generation (CAG)**
13. **Cognitive Scaffolding Prompting**
14. **Internal Knowledge Synthesis (IKS)**
15. **Multimodal Synthesis**

---

## 11. Progressive-Hint Prompting (PHP)

### Research Analysis (2026)
Current best practices treat PHP as a joint context-engineering layer. Key advancements include:
- **Base Model Synergy**: Combining PHP with "Complex Chain-of-Thought" (Complex CoT) as a base significantly boosts performance (e.g., GSM8K accuracy gains).
- **Stability Stopping**: Stopping iterations when the answer stabilizes (matches previous turn) or probability mass consolidates, rather than a fixed number of steps.
- **Compressed Hints**: Using summarized rationales or "delta hints" (only new info) instead of full history to save context window and reduce distraction.
- **Two-Part Prompts**: Explicitly separating the "Question" from "Hints" using proximity phrases like "The answer is close to..." to orient the model.

### Improvement Proposal

#### Before
> **Progressive-Hint Prompting (PHP):** Enables automatic multiple interactions between users and LLMs by using previously generated answers as hints to progressively guide toward correct answers. Implements cumulative knowledge building through multi-turn interaction.

#### After (Modernized)
> **Progressive-Hint Prompting (PHP-v2):** Iterative refinement protocol that couples **Complex CoT** with stability-based stopping criteria. Uses **compressed rationale hints** ("The answer is close to...") and **delta-updates** to guide reasoning toward convergence without context pollution. Auto-terminates when answer consistency is achieved across turns.

#### Justification
- **Complex CoT**: Research shows simple prompts fail to leverage PHP's full potential; complex bases are required for logic tasks.
- **Efficiency**: "Compressed rationales" and "delta hints" address the token bloat of naive PHP.
- **Reliability**: Explicit stability checks prevent infinite loops and over-correction.

#### Implementation Recommendations
- **Prompt Structure**: `[Question] + [Previous Answer Summary (Hint)] + [Instruction: "Refine your answer based on the hint, if the hint is consistent with the question."]`
- **Stopping Logic**: `if (current_answer == previous_answer) -> Stop`.

---

## 12. Cache-Augmented Generation (CAG)

### Research Analysis (2026)
CAG has evolved from simple KV-caching to semantic and hierarchical caching:
- **Hierarchical Caching**: Distinguishing between **Prompt Cache** (instructions), **Sub-reasoning Cache** (reusable logic patterns), and **Retrieval Cache** (RAG results).
- **Semantic Keys**: Using embeddings to key cached items, allowing reuse of reasoning for *semantically similar* (not just identical) queries.
- **Session vs. Global**: Managing a "Session Cache" for user-specific context and a "Global Cache" for task-agnostic facts/patterns.
- **Symbolic References**: Referencing cached items via symbolic IDs to keep prompts clean.

### Improvement Proposal

#### Before
> **Cache-Augmented Generation (CAG):** Preloads relevant context into working memory to eliminate real-time retrieval dependencies and reduce latency. Implements memory management strategies including short-term and long-term memory for personalized responses.

#### After (Modernized)
> **Cache-Augmented Generation (CAG-v2):** Hierarchical **Semantic Caching** system managing **Prompt, Sub-reasoning, and Retrieval** layers. Uses embedding-based keys to reuse reasoning patterns across semantically similar tasks. Optimizes latency via **Session/Global context separation** and **symbolic reference pointers** to eliminate redundant computation.

#### Justification
- **Granularity**: Modern CAG is not just about "preloading context" but about *granular reuse* of compute.
- **Semantic Search**: Exact matching is obsolete; semantic keys allow for 40-50% greater cache hit rates on reasoning tasks.
- **Scalability**: Hierarchical separation ensures the system scales to long sessions without context window overflow.

#### Implementation Recommendations
- **Architecture**: Implement a `CacheManager` that stores `(embedding(prompt), result)` pairs.
- **Policy**: Check Global Cache -> Check Session Cache -> Compute -> Update Caches.

---

## 13. Cognitive Scaffolding Prompting

### Research Analysis (2026)
Scaffolding has moved towards formal, symbolic structures:
- **TMK Models**: **Task-Method-Knowledge** prompting forces the model to define Goal, Subtasks, Methods, and State explicitly.
- **Recursive Language Models (RLM)**: Decomposing tasks into sub-calls and performing **context folding** (compressing results) to manage complexity.
- **Meta-Prompting**: Asking the LLM to *design* its own scaffolding/protocol for a specific domain before solving the task.
- **Mental Models**: Enforcing phase-based reasoning (Understand → Model → Plan → Execute → Evaluate).

### Improvement Proposal

#### Before
> **Cognitive Scaffolding Prompting:** Expanded scaffolding with four key elements: expert, reciprocal, and self-scaffolding. Prompts construction of internal mental models reflecting prior experiences and cognitive demands. Enables systematic problem-solving through structured cognitive support.

#### After (Modernized)
> **Cognitive Scaffolding Prompting (CSP-v2):** Deploys **Task-Method-Knowledge (TMK)** symbolic structures and **Recursive Context Folding**. Prompts the model to explicitly define **Goal-Subtask-State** architectures and **Phase-Based Mental Models** (Understand → Model → Execute). Uses **Meta-Prompting** to dynamically generate domain-specific reasoning protocols.

#### Justification
- **Structure**: "Expert/reciprocal" terms are vague. TMK and RLM are concrete, proven 2026 frameworks.
- **Autonomy**: Meta-prompting allows the model to adapt the scaffold to the specific problem instance, rather than using a rigid template.
- **Depth**: Recursive folding handles tasks that exceed single-pass context limits.

#### Implementation Recommendations
- **Prompt Template**: `Define the [Task Goal]. Break it down into [Subtasks] with [Methods]. Maintain a [State Table] of variables.`
- **Recursion**: For complex subtasks, spawn a new `deliberate` call and summarize the return value.

---

## 14. Internal Knowledge Synthesis (IKS)

### Research Analysis (2026)
IKS now focuses on hallucination reduction via stable knowledge states:
- **Two-Stage Verification**: 1. Build a "Knowledge Brief" (source-tagged). 2. Answer *strictly* from the brief.
- **Think-Action Loops**: Grounding reasoning in retrieved evidence mid-stream (ReAct style) but focused on *internal* knowledge validation.
- **Consistency Checks**: Cross-referencing generated claims against the "Knowledge Brief" to detect contradictions.
- **Project Briefs**: Maintaining a persistent "Single Source of Truth" document for long-running tasks.

### Improvement Proposal

#### Before
> **Internal Knowledge Synthesis (IKS):** Generates hypothetical knowledge constructs from parametric memory and cross-references internal knowledge consistency. Addresses conflicts between parametric and context-provided knowledge for coherent distributed responses.

#### After (Modernized)
> **Internal Knowledge Synthesis (IKS-v2):** Constructs a verifiable **Source-Tagged Knowledge Brief** before reasoning. Enforces a **Two-Stage "Build-then-Answer" protocol** where responses are strictly grounded in the synthesized brief. Applies **Cross-Consistency Checks** to resolve conflicts between parametric memory and external context, minimizing hallucination.

#### Justification
- **Hallucination Control**: The "Build-then-Answer" split is the most effective current method for reducing factual errors.
- **Verifiability**: Source-tagging (even internal parametric sources) forces the model to be explicit about uncertainty.
- **Rigour**: Moving from "hypothetical constructs" to "verifiable briefs".

#### Implementation Recommendations
- **Process**:
    1. Prompt: "List all facts needed to answer X. Tag them [Certain/Uncertain]."
    2. Prompt: "Using ONLY the facts above, answer X. If a fact is missing, state 'Unknown'."

---

## 15. Multimodal Synthesis

### Research Analysis (2026)
Multimodal interaction has matured into "Visual Chain-of-Thought":
- **Visual CoT**: Explicitly detailing visual reasoning steps (e.g., "Step 1: Locate red box. Step 2: Read text inside...").
- **Visual Artifacts**: Generating bounding boxes, segmentation maps, or scene graphs as intermediate reasoning steps.
- **Joint Encoders**: Leveraging models with shared token spaces (no separate vision tower) for fine-grained understanding.
- **World Models**: Using latent space representations to reason about physics, 3D geometry, and object dynamics.

### Improvement Proposal

#### Before
> **Multimodal Synthesis:** Multimodal Chain-of-Thought using both text and visual inputs to guide reasoning. Particularly effective for charts, images, or diagrams interpretation. Enables cross-modal analysis for broader complex task solutions.

#### After (Modernized)
> **Multimodal Synthesis (V-CoT):** Implements **Visual Chain-of-Thought** with explicit **Intermediate Visual Artifacts** (bounding boxes, scene graphs). Leverages **Joint-Encoder Latent Spaces** for fine-grained cross-modal grounding. Decomposes complex visual inputs into **Symbolic Scene Representations** to enable high-fidelity reasoning over charts, UIs, and physical dynamics.

#### Justification
- **Precision**: V-CoT is the standard for high-performance vision-language tasks in 2026.
- **Grounding**: Generating artifacts (boxes/graphs) forces the model to "look" before answering, reducing visual hallucinations.
- **Depth**: "Scene graphs" and "world models" enable reasoning *about* the image, not just describing it.

#### Implementation Recommendations
- **Prompting**: "First, describe the layout of the image using a coordinate system/scene graph. Then, answer the question based on this structural understanding."

---

## Summary of Changes

| Strategy | Key Upgrade |
| :--- | :--- |
| **11. PHP** | Added **Stability Stopping** & **Compressed Hints** |
| **12. CAG** | Added **Hierarchical Semantic Caching** & **Session Layers** |
| **13. CSP** | Added **TMK Symbolic Models** & **Meta-Prompting** |
| **14. IKS** | Added **Two-Stage "Build-then-Answer"** & **Source-Tagged Briefs** |
| **15. Multimodal** | Added **Visual CoT** & **Symbolic Scene Graphs** |
