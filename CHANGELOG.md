# Changelog

All notable changes to this project will be documented in this file.

## [11.0.0] - 2026-01-10

### Added
- **Strategies 11-15 Modernization**: Updated definitions and prompting strategies for Progressive-Hint Prompting (PHP), Cache-Augmented Generation (CAG), Cognitive Scaffolding Prompting, Internal Knowledge Synthesis (IKS), and Multimodal Synthesis to reflect January 2026 best practices.
  - **PHP**: Added "Complex CoT" base and stability-based stopping.
  - **CAG**: Implemented hierarchical semantic caching (Prompt/Logic/Retrieval) and session separation.
  - **CSP**: Adopted Task-Method-Knowledge (TMK) symbolic structures and recursive context folding.
  - **IKS**: Introduced "Build-then-Answer" protocol with source-tagged knowledge briefs.
  - **Multimodal**: Upgraded to Visual Chain-of-Thought (V-CoT) with symbolic scene graphs.
- **Unit Tests**: Added `src/index.test.ts` to verify deliberation engine outputs and strategy descriptions.
- **Test Script**: Added `npm test` script to package.json.

### Changed
- Updated `latest.md` with detailed modern definitions of the advanced strategies.
- Refactored `src/index.ts` to export `DeliberationEngine` and `PROMPTING_STRATEGIES` for better testability.
- Added execution guard to `src/index.ts` to allow importing modules without starting the server.
