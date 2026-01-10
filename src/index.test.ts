import { describe, it, expect } from 'vitest';
import { PROMPTING_STRATEGIES, DeliberationEngine } from './index.js';

describe('Prompting Strategies Implementation (Strategies 1-15)', () => {
  
  // Strategies 1-5
  it('Strategy 1: CAR-ReAct', () => {
    const strategy = PROMPTING_STRATEGIES["Cache-Augmented ReAct (CAR-ReAct)"];
    expect(strategy).toBeDefined();
    expect(strategy.description).toContain('Tier 1');
    expect(strategy.protocol).toContain('DO NOT re-output Tier 1 content');
  });

  it('Strategy 2: ARC', () => {
    const strategy = PROMPTING_STRATEGIES["Adaptive Reasoning Consensus (ARC)"];
    expect(strategy).toBeDefined();
    expect(strategy.description).toContain('*quality* and *pattern*');
    expect(strategy.protocol).toContain('Weighted aggregation');
  });

  it('Strategy 3: SNE', () => {
    const strategy = PROMPTING_STRATEGIES["Substrate-Native Execution (SNE)"];
    expect(strategy).toBeDefined();
    expect(strategy.description).toContain('Universal Execution Delegation');
    expect(strategy.protocol).toContain('Delegate to native runtime');
  });

  it('Strategy 4: RCA', () => {
    const strategy = PROMPTING_STRATEGIES["Recursive Contextual Audit (RCA)"];
    expect(strategy).toBeDefined();
    expect(strategy.description).toContain('Correction Vector');
    expect(strategy.protocol).toContain('Map error to Tier 1 deviation');
  });

  it('Strategy 5: SID', () => {
    const strategy = PROMPTING_STRATEGIES["Semantic Information Density (SID)"];
    expect(strategy).toBeDefined();
    expect(strategy.description).toContain('information entropy');
    expect(strategy.protocol).toContain('CUC-N score');
  });

  // Strategies 6-10
  it('Strategy 6: Reflexion (Single-Shot)', () => {
    const strategy = PROMPTING_STRATEGIES["Reflexion (Single-Shot)"];
    expect(strategy).toBeDefined();
    expect(strategy.description).toContain('Single-shot recursive critique');
    expect(strategy.protocol).toContain('<reflexion_protocol>');
    expect(strategy.protocol).toContain('DRAFT');
    expect(strategy.protocol).toContain('REFLECTION');
  });

  it('Strategy 7: ToT-lite', () => {
    const strategy = PROMPTING_STRATEGIES["ToT-lite (Tree of Thoughts)"];
    expect(strategy).toBeDefined();
    expect(strategy.description).toContain('Bounded parallel exploration');
    expect(strategy.protocol).toContain('<tot_lite_protocol>');
  });

  it('Strategy 8: Metacognitive Prompting', () => {
    const strategy = PROMPTING_STRATEGIES["Metacognitive Prompting (MP)"];
    expect(strategy).toBeDefined();
    expect(strategy.protocol).toContain('<metacognitive_protocol>');
    expect(strategy.protocol).toContain('PLAN');
    expect(strategy.protocol).toContain('MONITOR');
  });

  it('Strategy 9: APO', () => {
    const strategy = PROMPTING_STRATEGIES["Automated Prompt Optimization (APO)"];
    expect(strategy).toBeDefined();
    expect(strategy.protocol).toContain('<apo_protocol>');
  });

  // Strategies 11-15
  it('Strategy 11: PHP-v2', () => {
    const strategy = PROMPTING_STRATEGIES["Progressive-Hint Prompting (PHP-v2)"];
    expect(strategy).toBeDefined();
    expect(strategy.protocol).toContain('Stop if answer stabilizes');
  });

  it('Strategy 12: CAG-v2', () => {
    const strategy = PROMPTING_STRATEGIES["Cache-Augmented Generation (CAG-v2)"];
    expect(strategy).toBeDefined();
    expect(strategy.protocol).toContain('Session Cache');
  });

  it('Strategy 13: CSP-v2', () => {
    const strategy = PROMPTING_STRATEGIES["Cognitive Scaffolding Prompting (CSP-v2)"];
    expect(strategy).toBeDefined();
    expect(strategy.protocol).toContain('Task Goal');
    expect(strategy.protocol).toContain('State Table');
  });

  it('Strategy 14: IKS-v2', () => {
    const strategy = PROMPTING_STRATEGIES["Internal Knowledge Synthesis (IKS-v2)"];
    expect(strategy).toBeDefined();
    expect(strategy.protocol).toContain('Source-Tagged Knowledge Brief');
  });

  it('Strategy 15: V-CoT', () => {
    const strategy = PROMPTING_STRATEGIES["Multimodal Synthesis (V-CoT)"];
    expect(strategy).toBeDefined();
    expect(strategy.protocol).toContain('Scene Graph');
  });

  it('DeliberationEngine should include protocols in prompt', () => {
    const engine = new DeliberationEngine();
    const result = engine.deliberate('test input');
    
    // Check for some keys
    expect(result).toContain('**Reflexion (Single-Shot):**');
    expect(result).toContain('*Protocol:*');
    expect(result).toContain('<reflexion_protocol>');
  });
});
