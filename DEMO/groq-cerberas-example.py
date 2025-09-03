# /// script
# dependencies = [
#   "smolagents[mcp,toolkit,litellm]",
#   "python-dotenv",
#   "groq",
# ]
# ///

"""
Groq & Cerebras Deliberation Demo using the gikendaasowin-aabajichiganan MCP server.

This script demonstrates how to integrate smolagents with our custom MCP server
using high-performance cloud APIs (Groq & Cerebras) instead of local models.

The MCP server offers a "deliberate" tool that implements:
- OOReDAct cognitive cycle (Observe-Orient-Reason-Decide-Act) 
- Multiple prompting strategies (Cache-Augmented Reasoning, Self-Consistency, PAL, etc.)
- Scientific Investigation methodologies
- Critical Thinking frameworks
- Dynamic strategy evaluation system with 0.00-0.99 scoring (≥1.53 threshold)

Groq provides ultra-fast inference with models like Llama-3.3-70b and Mixtral-8x7B.
Cerebras offers incredible speed and throughput for demanding AI workloads.
"""

import os
from dotenv import load_dotenv

from smolagents import MCPClient, CodeAgent, LiteLLMModel
from mcp import StdioServerParameters


def get_available_cloud_model():
    """Get the best available cloud model from Groq or Cerebras."""
    
    # Check for API keys
    groq_key = os.getenv("GROQ_API_KEY")
    cerebras_key = os.getenv("CEREBRAS_API_KEY") 
    openai_key = os.getenv("OPENAI_API_KEY")  # Fallback
    
    # Preferred models in order of preference
    # Groq models (ultra-fast inference)
    if groq_key:
        preferred_groq_models = [
            "groq/llama-3.3-70b-versatile",      # Latest Llama model on Groq
            "groq/llama-3.1-70b-versatile",      # Excellent reasoning
            "groq/mixtral-8x7b-32768",           # Great for complex tasks
            "groq/llama-3.1-8b-instant",        # Fast and efficient
        ]
        
        for model in preferred_groq_models:
            print(f"🚀 Selected Groq model: {model}")
            return model, groq_key, "groq"
    
    # Cerebras models (ultra-high throughput)
    if cerebras_key:
        preferred_cerebras_models = [
            "cerebras/llama3.1-70b",             # High-performance reasoning
            "cerebras/llama3.1-8b",              # Fast inference
        ]
        
        for model in preferred_cerebras_models:
            print(f"🧠 Selected Cerebras model: {model}")
            return model, cerebras_key, "cerebras"
    
    # OpenAI fallback
    if openai_key:
        fallback_model = "gpt-4o-mini"
        print(f"⚠️  Using OpenAI fallback: {fallback_model}")
        return fallback_model, openai_key, "openai"
    
    raise Exception("No API keys found! Please set GROQ_API_KEY, CEREBRAS_API_KEY, or OPENAI_API_KEY")


def main():
    """Main function to demonstrate smolagents with cloud APIs + MCP integration."""
    
    # Load environment variables
    load_dotenv()
    
    print("◈──◆──◇ GROQ & CEREBRAS + GIKENDAASOWIN MCP DEMO ◇──◆──◈")
    print("🚀 High-Performance Cloud Inference + Advanced Deliberation")
    print("=" * 70)
    
    # Get best available cloud model
    try:
        model_name, api_key, provider = get_available_cloud_model()
    except Exception as e:
        print(f"❌ Cloud API setup error: {e}")
        print("\n🔧 Setup instructions:")
        print("1. Get a Groq API key: https://console.groq.com/")
        print("2. Get a Cerebras API key: https://inference.cerebras.ai/")
        print("3. Set in .env file:")
        print("   GROQ_API_KEY=your_groq_key")
        print("   CEREBRAS_API_KEY=your_cerebras_key")
        return 1
    
    # Configure MCP server parameters for our deliberation server
    # Using published npm package for real-world testing
    server_parameters = StdioServerParameters(
        command="npx",
        args=["@nbiish/gikendaasowin-aabajichiganan-mcp"],
        env={**os.environ}  # Pass through all environment variables
    )
    
    print("📡 Connecting to Gikendaasowin-Aabajichiganan MCP server (via npx)...")
    
    try:
        # Use MCPClient with context manager for automatic connection management
        with MCPClient(server_parameters) as mcp_tools:
            print(f"✅ Connected! Available tools: {[tool.name for tool in mcp_tools]}")
            
            # Initialize the inference model
            print(f"🔥 Initializing {provider.upper()} model ({model_name})...")
            
            # Configure model based on provider
            if provider == "groq":
                model = LiteLLMModel(
                    model_id=model_name,
                    api_key=api_key
                )
            elif provider == "cerebras": 
                model = LiteLLMModel(
                    model_id=model_name,
                    api_key=api_key,
                    api_base="https://api.cerebras.ai/v1"
                )
            else:  # openai fallback
                model = LiteLLMModel(
                    model_id=model_name,
                    api_key=api_key
                )
            
            # Create CodeAgent with MCP tools and base tools
            agent = CodeAgent(
                tools=mcp_tools,  # MCP tools from our server
                model=model,
                add_base_tools=True,  # Include Python interpreter, web search, etc.
                max_steps=8,  # Allow multiple reasoning steps for complex problems
                verbosity_level=2,  # Show detailed reasoning
                additional_authorized_imports=["json", "requests"]  # Allow common imports
            )
            
            print(f"\n🤖 Agent initialized with {provider.upper()} + deliberation capabilities!")
            print("Available capabilities:")
            for tool in agent.tools.values():
                print(f"  - {tool.name}: {getattr(tool, 'description', 'No description available')}")
            
            # Show proper usage of the deliberate tool
            print("\n📚 Deliberate tool usage (NEW v8.9.4):")
            print("  - Simplified: deliberate(input='Your question here')")
            print("  - With context: deliberate(input='Your question', context='Additional context')")
            print("  - Returns: 6-stage cognitive processing with strategy scoring (0.00-0.99)")
            print("  - Strategy threshold: ≥1.53 (solution + efficiency levels)")
            
            # Demo queries optimized for cloud APIs (more complex than local demos)
            demo_queries = [
                {
                    "title": "🔬 Complex System Analysis",
                    "query": "Use deliberation to analyze: I'm building a distributed microservices architecture for a fintech platform handling 1M+ daily transactions. What are the key architectural decisions I need to make regarding data consistency, security, scalability, and regulatory compliance? Please consider both technical and business factors."
                },
                {
                    "title": "🧮 Multi-Variable Optimization Problem", 
                    "query": "Apply deliberation to this optimization scenario: A renewable energy company needs to decide optimal locations for 50 new solar farms across 3 states. Variables: land cost, solar irradiance, grid connectivity, local regulations, environmental impact, and 10-year ROI projections. Create a comprehensive decision framework."
                },
                {
                    "title": "🎯 Strategic AI Implementation Plan",
                    "query": "Use deliberation to design an AI adoption strategy for a traditional manufacturing company (500 employees, $100M revenue). Consider: current tech capabilities, workforce training, integration challenges, competitive advantages, ethical considerations, and phased implementation over 24 months."
                },
                {
                    "title": "🚀 Innovation Framework Design",
                    "query": "Apply deliberation to create an innovation management framework for identifying, evaluating, and implementing breakthrough technologies in the autonomous vehicle industry. Consider technical feasibility, market readiness, regulatory landscape, and competitive positioning."
                }
            ]
            
            # Run demo queries
            for i, demo in enumerate(demo_queries, 1):
                print(f"\n{demo['title']}")
                print("-" * 60)
                print(f"Query: {demo['query'][:120]}...")
                print(f"\n🤔 Agent deliberating with {provider.upper()}...")
                
                try:
                    result = agent.run(demo['query'])
                    print("\n✅ Deliberation completed!")
                    
                    # Show a summary rather than full result for readability
                    result_preview = result[:300] + "..." if len(result) > 300 else result
                    print(f"Result Preview: {result_preview}")
                    
                    if i < len(demo_queries):
                        continue_prompt = input("\nPress Enter to continue to next demo (or 'skip' to go to interactive mode)...")
                        if continue_prompt.lower() == 'skip':
                            break
                        
                except Exception as e:
                    print(f"❌ Error during deliberation: {e}")
                    continue
            
            # Interactive mode
            print(f"\n🔄 Interactive Mode with {provider.upper()}")
            print("-" * 40)
            print("Ask complex questions for the agent to deliberate on using advanced")
            print("cloud inference. Type 'quit' to exit.")
            
            while True:
                try:
                    user_query = input(f"\n🎯 Your question for {provider.upper()}: ").strip()
                    
                    if user_query.lower() in ['quit', 'exit', 'q']:
                        print("👋 Thanks for using the cloud deliberation demo!")
                        break
                    
                    if not user_query:
                        continue
                    
                    print(f"\n🤔 Agent deliberating with {provider.upper()}...")
                    result = agent.run(user_query)
                    
                    # Format result nicely
                    print(f"\n✅ {provider.upper()} Response:")
                    print("=" * 50)
                    print(result)
                    print("=" * 50)
                    
                except KeyboardInterrupt:
                    print(f"\n👋 Demo interrupted. Thanks for testing {provider.upper()}!")
                    break
                except Exception as e:
                    print(f"❌ Error: {e}")
                    continue
                    
    except Exception as e:
        print(f"❌ Failed to connect to MCP server: {e}")
        print("\n🔧 Troubleshooting tips:")
        print("1. Ensure the package is published: npm view @nbiish/gikendaasowin-aabajichiganan-mcp")
        print("2. Test npx directly: npx @nbiish/gikendaasowin-aabajichiganan-mcp")
        print("3. Check network connectivity and npm registry access")
        print("4. Try clearing npm cache: npm cache clean --force")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())