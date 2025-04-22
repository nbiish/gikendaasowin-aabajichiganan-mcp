---
description: 
globs: 
alwaysApply: false
---
# LLM-Optimized Agile MVP PRD

## Purpose
* Provide a lean, standardized PRD template for LLM-driven requirement definition and iteration.

## Vision & Goals
* **Vision:** [Aspirational product outcome]
* **Primary Goal:** [Key user problem to solve & desired outcome]

## Core MVP Definition
* **Definition:** Minimal feature set to solve the core problem for early adopters and enable validated learning.
* **Scope:**
  * **Must have:** [List essential features]
  * **Out of scope:** [Explicitly excluded features]

## Guiding Principles
* Build–Measure–Learn feedback loop
* Problem-focused & user-centric
* Minimalism: include only essentials
* Viability: ensure functional value

## Success Metrics
* **Quantitative:** e.g., activation rate, task completion
* **Qualitative:** e.g., user satisfaction, feedback themes

## Feedback & Iteration
* Collect feedback via surveys, interviews, analytics.
* Plan and prioritize next iterations based on insights.

## Terminology
* **MVP:** Minimum Viable Product
* **MLP:** Minimum Lovable Product
* **MMP:** Minimum Marketable Product

## Prompt Engineering Guide
* Reference sections by header (e.g., "## Success Metrics") to scope LLM responses.
* Example prompt: "Based on the Vision & Goals, suggest three Must-have features."

## Document Types Overview
- Agile Requirements Management: Iterative, user-story-driven approach ideal for projects requiring flexibility and ongoing feedback.
- Waterfall PRD: Comprehensive upfront specification best suited for well-defined scopes or regulated environments.
- MRD→PRD Combined: Market-driven strategic analysis feeding detailed requirements for large-scale, strategic initiatives.
- Functional Specification Document (FSD): Feature-level behavioral specs providing precise implementation guidance.

## Prompting Tips
* **Target headers:** Scope LLM queries by section (e.g., "## Success Metrics").
* **Comparison prompts:** "Compare Agile vs Waterfall based on Formality and Timing."
* **Feature generation:** "Suggest 3 Must-have features under Core MVP Definition."
* **Refinement prompts:** "Based on feedback data, propose next iteration goals."

## Agile MVP Framework for Project Goal Setting
- Define Problem & Target Audience: articulate the core user problem and identify early adopters.
- Identify Core Value & Essential Features: specify minimal must-have features and out-of-scope items.
- Prioritize & Scope: confirm the smallest viable increment for validated learning.
- Define Success Metrics: set quantitative and qualitative measures to validate core assumptions.
- Plan Feedback & Iteration: outline mechanisms for collecting feedback and guiding next steps.

## Key Considerations
* **Benefits:** Faster time-to-market (for learning), reduced development waste, early risk mitigation, validated learning, customer-centric development.
* **Challenges:** Resisting feature creep ("scope creep"), effectively gathering and acting on user feedback, managing stakeholder expectations (MVP is not the final product).

## Codebase Structure Example (Conceptual Mapping)

This structure provides a conceptual hierarchy inspired by principles like Domain-Driven Design (DDD) and Atomic Design for organizing codebase elements.

*   **Matter:** Represents the largest boundaries, akin to DDD Bounded Contexts or major application domains/services.
    *   *Example Directory:* `/src/matter/user-management/`
    *   *Example Directory:* `/src/matter/order-processing/`
    *   *Focus:* High-level domain logic, coordination between molecules.

*   **Molecules:** Represents composite features, use cases, or larger components formed by combining Atoms within a specific Matter. Analogous to complex components or feature slices.
    *   *Example Directory:* `/src/matter/user-management/molecules/registration-flow/`
    *   *Example Directory:* `/src/matter/order-processing/molecules/checkout-process/`
    *   *Example Component:* `UserProfileCard` (combining Atom components like `Avatar`, `UserName`, `EditButton`)
    *   *Focus:* Orchestrating Atoms to fulfill a specific feature or user interaction.

*   **Atoms:** Represents the smallest reusable building blocks, similar to Atomic Design's atoms or core domain entities/functions.
    *   *Example Directory:* `/src/atoms/ui/` (for UI components)
    *   *Example Directory:* `/src/atoms/domain/` (for core domain objects/logic)
    *   *Example UI Component:* `Button.tsx`, `Input.tsx`, `Label.tsx`
    *   *Example Domain Atom:* `class UserId { ... }`, `function calculateDiscount(...)`
    *   *Focus:* Single responsibility, reusability, minimal dependencies.

*   **Quanta:** Represents the most fundamental, indivisible units – often cross-cutting concerns or foundational elements.
    *   *Example Directory:* `/src/quanta/utils/`
    *   *Example Directory:* `/src/quanta/constants/`
    *   *Example Directory:* `/src/quanta/design-tokens/`
    *   *Example File:* `dateTimeUtils.ts`, `apiEndpoints.ts`, `colors.ts`, `spacing.ts`
    *   *Focus:* Pure functions, configuration values, fundamental definitions used across Atoms and Molecules.