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

## FINAL OUTPUT OF DELIBERATION MCP


___

## ADDITIONAL TOOLING LOGIC

- the final output should include a ```tool use before re-deliberation: {number of tools used before returning}```
- During the 'Orient stage, the system should review each of the prompting strategies from [modern-prompting.mdc](modern-prompting.mdc) and based on the mcp input and task at hand -> run parallel determinations of which prompting strategy would provide the best solution the most efficiently by assigning every strategy a ```solution level: {0.00-0.99}``` and ```efficiency level: {0.00-0.99}``` which will be summed together to determine which tool to use based on the summation at the end of the parallel prompting strategy review.
- Ensure that the parallel decision process for the prompting strategy has the detailed and full versions of the prompting strategies from [modern-prompting.mdc](modern-prompting.mdc)
        - If more than one tool should come to the summation of ≥1.42 -> use a combination of the ≥1.53 rated prompting strategies.

### ACCOMPLISHES

- Improved efficiency in selecting the most appropriate prompting strategy.
- Enhanced ability to adapt to varying input and task requirements.
- Streamlined decision-making process for tool selection.
- Encourages LLMs to return to the ````deliberate``` mcp tool to re-orient to the best strategy.

___

## IMPORTANT TESTING RESULTS AND OBSERVATIONS -> CHANGES NECESSARY

 - designing the intake of these cognitive techniques as a SINGLE tool call is CRITICAL to allowing all LLMs to use this properly.
- CRITICAL -> This tool MUST follow this pseudo code process -> (llm calls deliberate mcp tool) -> ('1st round' of deliberation: takes the llm through stages 1-2) -> ('2nd round' of deliberation: takes the llm through stages 3-6) -> (markdown formatted output of the two previous 'rounds of deliberation' is returned from the deliberate mcp tool + the recommended number of tool usage before returning to deliberate again)
- recommended end tool use before re-deliberate is CRITICAL
- (the 0.00 - 1.00+ system is CRITICAL) → (no percentages or ‘metrics’)
- (going through each phase is CRITICAL)
- (the suggested tools should exclusively reflect ‘pair programmers’ tools and typical use cases for mcp servers like file manipulation, websearch, and code tools) -> (also recommend the other tools you see beside 'deliberate' as examples)
- FINAL OUTPUT:
        - final phase of deliberate markdown formatted text + tool use before re-deliberation: {number of tools used before returning to deliberate again}
        - (formatted output of multi-stage deliberation proposed solution comprised of the best rated cognitive framework/s and critical thinking strategies) = (final most fact based and well thought out answer for the LLM to intake and proceed with their normal thinking processes)

### FINAL OUTPUT PASS METRIC

- formatted markdown output of the final results
- must include ```tool use before re-deliberation: {number of tools used before returning to deliberate again}```
