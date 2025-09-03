# This image is our total flow -> ![Overall Deliberation Flow](/new-flow/new-flow-images/overall-flow.png)

___

## STAGE 1

![MCP Input](/new-flow/new-flow-images/stage-1-mcp-input.png)

- Scientific Investigation follows a series of logic and orderly steps to formulate hypotheses.
    - 1. Identify question
    - 2. Form hypothesis
    - 3. Conduct experiment
    - 4. Analyze data
    - 5. Draw conclusions

___

## STAGE 2

![OOReD](/new-flow/new-flow-images/stage-2-OOReD-flow.png)

- O.O.Re.D.
    - Observe
        - Observe the input, needs, and situation.
    - Orient
        - Orient to the solution.
    - Reason
        - Why is the proposed solution the correct answer? What are the facts?
    - Decide
        - Decide which tools and actions are needed to implement the solution.

___

## STAGE 3

![First round of deliberation](/new-flow/new-flow-images/stage-3-first-round-of-deliberation.png)

- Steps in Critical Thinking:
    - 1. What is the purpose of my thinking?
    - 2. What precise question am I trying to answer?
    - 3. Within what context or framework am I operating?
    - 4. What information do I have and need to gather?
    - 5. How reliable and credible is this information?
    - 6. What concepts, algorithms, and facts are relevant to my thinking?
    - 7. What conclusions can I draw from this information?
    - 8. What am I taking for granted; what assumptions am I making?
    - 9. If I accept conclusions, what are the implications?
    - 10. What would be the consequences if I put this solution into action?
- pre-Act action
    - prompting strategies
    - list tools we need upon 'Act' stage.
        - websearch
        - mcp servers
        - file and code tools
    - user feedback
    - knowledge base

___

## STAGE 4

![MCP Input - Review](/new-flow/new-flow-images/stage-1-mcp-input.png)

- Scientific Investigation follows a series of logic and orderly steps to formulate hypotheses.
    - 1. Identify question
    - 2. Form hypothesis
    - 3. Conduct experiment
    - 4. Analyze data
    - 5. Draw conclusions

___

## STAGE 5

![OOReD](/new-flow/new-flow-images/stage-2-OOReD-flow.png)

- O.O.Re.D.
    - Observe
        - Observe the input, needs, and situation.
    - Orient
        - Orient to the solution.
    - Reason
        - Why is the proposed solution the correct answer? What are the facts?
    - Decide
        - Decide which tools and actions are needed to implement the solution.

___

## STAGE 6

![Final Stage - Act](/new-flow/new-flow-images/final-stage-Act-upon-deliberation.png)
- Fact based Action

___

## TOOLING LOGIC

### INPUT  

- single tool call: `deliberate(input: string, context?: string)`

#### MCP TOOL DOES THE FOLLOWING

- The 'Orient stage': presents LLM calling the mcp tool each of the prompting strategies from [modern-prompting.mdc](modern-prompting.mdc) within and asked to apply these to the 'input' -> LLM determines which prompting strategy would provide the best solution the most efficiently by assigning every strategy a ```solution level: {0.00-0.99}``` and ```efficiency level: {0.00-0.99}``` rating which will be summed together to determine which tool to use based on which tools ≧1.53
- If more than one tool should come to the summation of ≥1.53 -> use a combination of the strategies
- LLM is prompted with Stages 1-5
- Ask the LLM what tools are needed to accomplish the task?
- Stage 6 is formatted output of mcp tool

___

### OUTPUT  

The final output should be formatted markdown that follows this strucure:

___
```DELIBERATION: {though process through Stages 1-5 + selected cognitive technique/s output}```

```Return to  'deliberate' after using the following tools: {number of tools used before returning}```

```# To accomplish Task:\n{task identified from critical thinking process}```
___

### ACCOMPLISHES

- Single-shot prompt of cognitive strategies to 'think' about the most appropriate prompting strategy to accomplish the task at hand.
- Enhanced ability to adapt to varying input and task requirements.
- Thorough evaluation of potential solutions and tools to required for the best course of action.
- Streamlined decision-making process for tool selection.
- Encourages LLMs to return to the ````deliberate``` mcp tool to re-orient to the best strategy.

___

## IMPORTANT TESTING RESULTS AND OBSERVATIONS -> CHANGES NECESSARY

- recommended end tool use before re-deliberate is CRITICAL
- (the 0.00 - 1.00+ system is CRITICAL) → (no percentages or ‘metrics’)
- (the suggested tools should exclusively reflect ‘pair programmers’ tools and typical use cases for mcp servers like file manipulation, websearch, and code tools) -> (also recommend the other tools you see beside 'deliberate' as examples)

