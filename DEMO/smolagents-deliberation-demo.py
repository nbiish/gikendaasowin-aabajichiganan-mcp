# /// script
# dependencies = [
#   "smolagents[mcp,toolkit,litellm]",
#   "python-dotenv",
# ]
# ///

"""
smolagents deliberation demo using the gikendaasowin-aabajichiganan MCP server.

This script demonstrates how to integrate smolagents with our custom MCP server
that provides advanced deliberation capabilities using various cognitive frameworks.

The MCP server offers a "deliberate" tool that implements:
- OOReDAct cognitive cycle (Observe-Orient-Reason-Decide-Act)
- Multiple prompting strategies (Cache-Augmented Reasoning, Self-Consistency, PAL, etc.)
- Scientific Investigation methodologies
- Critical Thinking frameworks
- Dynamic strategy evaluation system

Updated to work with local Ollama models (granite3.3:2b) for privacy and local execution.
"""

import os
from dotenv import load_dotenv

from smolagents import MCPClient, CodeAgent, LiteLLMModel
from mcp import StdioServerParameters

def get_available_ollama_model():
    """Get the best available Ollama model from our preferred list."""
    import subprocess
    
    # Preferred models in order of preference
    preferred_models = [
        "granite3.3:2b",
        "llama3.2:1b", 
        "granite3.3:latest",
        "deepseek-r1:latest",
        "qwen3:latest"
    ]
    
    try:
        # Get list of available models
        result = subprocess.run(['ollama', 'list'], 
                              capture_output=True, text=True, check=True)
        available_models = [line.split()[0] for line in result.stdout.strip().split('\n')[1:]]
        
        # Find the first preferred model that's available
        for model in preferred_models:
            if model in available_models:
                print(f"🎯 Selected Ollama model: {model}")
                return model
        
        # Fallback to first available model
        if available_models:
            model = available_models[0]
            print(f"⚠️  Using fallback model: {model}")
            return model
        
        raise Exception("No Ollama models found")
        
    except subprocess.CalledProcessError:
        raise Exception("Failed to get Ollama model list. Is Ollama installed and running?")
    except Exception as e:
        raise Exception(f"Error checking Ollama models: {e}")


def main():
    """Main function to demonstrate smolagents with gikendaasowin-aabajichiganan MCP integration."""
    
    # Load environment variables
    load_dotenv()
    
    print("🧠 Smolagents + Gikendaasowin-Aabajichiganan MCP Demo")
    print("🦬 Using Local Ollama Models for Privacy")
    print("=" * 60)
    
    # Get best available Ollama model
    try:
        ollama_model = get_available_ollama_model()
    except Exception as e:
        print(f"❌ Ollama setup error: {e}")
        print("\nSetup instructions:")
        print("1. Install Ollama: https://ollama.com/")
        print("2. Pull a model: ollama pull granite3.3:2b")
        print("3. Start Ollama: ollama serve")
        return 1
    
    # Configure MCP server parameters for our deliberation server
    # Using local build instead of npm package for development
    mcp_server_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "build", "index.js")
    
    server_parameters = StdioServerParameters(
        command="node",
        args=[mcp_server_path],
        env={**os.environ}  # Pass through all environment variables
    )
    
    print("📡 Connecting to Gikendaasowin-Aabajichiganan MCP server...")
    
    try:
        # Use MCPClient with context manager for automatic connection management
        with MCPClient(server_parameters) as mcp_tools:
            print(f"✅ Connected! Available tools: {[tool.name for tool in mcp_tools]}")
            
            # Initialize the inference model using Ollama with selected model
            # LiteLLMModel allows us to use local Ollama models
            print(f"🧠 Initializing Ollama model ({ollama_model})...")
            model = LiteLLMModel(
                model_id=f"ollama_chat/{ollama_model}",
                api_base="http://localhost:11434",  # Default Ollama endpoint
                api_key="ollama"  # Required by LiteLLM for Ollama
            )
            
            # Create CodeAgent with MCP tools and base tools
            agent = CodeAgent(
                tools=mcp_tools,  # MCP tools from our server
                model=model,
                add_base_tools=True,  # Include Python interpreter, web search, etc.
                max_steps=6,  # Allow multiple reasoning steps
                verbosity_level=2,  # Show detailed reasoning
                additional_authorized_imports=["json"]  # Allow JSON parsing for MCP results
            )
            
            print("\n🤖 Agent initialized with deliberation capabilities!")
            print("Available capabilities:")
            for tool in agent.tools.values():
                print(f"  - {tool.name}: {getattr(tool, 'description', 'No description available')}")
            
            # Show proper usage of the deliberate tool
            print("\n📚 Deliberate tool usage:")
            print("  - Correct: deliberate(input='Your question here')")
            print("  - With context: deliberate(input='Your question', context='Additional context')")
            print("  - Note: Returns detailed analysis using OOReDAct cognitive framework")
            
            # Demo queries showcasing different aspects of the deliberation tool
            # Optimized for local models - shorter, more focused queries
            demo_queries = [
                {
                    "title": "🔬 Problem Analysis with Deliberation",
                    "query": "Use the deliberation tool to analyze this problem: I need to choose between Python and JavaScript for a web scraping project. Consider factors like performance, ease of use, and library availability."
                },
                {
                    "title": "🧮 Mathematical Reasoning",
                    "query": "Please use deliberation to solve this step by step: If I save $500 per month at 5% annual interest compounded monthly, how much will I have after 3 years?"
                },
                {
                    "title": "🎯 Decision Framework",
                    "query": "Use the deliberation tool to create a decision framework for choosing a laptop: budget $1000-1500, uses: coding, light gaming, portability important."
                }
            ]
            
            # Run demo queries
            for i, demo in enumerate(demo_queries, 1):
                print(f"\n{demo['title']}")
                print("-" * 50)
                print(f"Query: {demo['query']}")
                print("\n🤔 Agent deliberating...")
                
                try:
                    result = agent.run(demo['query'])
                    print("\n✅ Deliberation completed!")
                    print(f"Result: {result}")
                    
                    if i < len(demo_queries):
                        input("\nPress Enter to continue to next demo...")
                        
                except Exception as e:
                    print(f"❌ Error during deliberation: {e}")
                    continue
            
            # Interactive mode
            print("\n🔄 Interactive Mode")
            print("-" * 30)
            print("You can now ask the agent any question. It will use the deliberation tool")
            print("to provide thoughtful, systematic analysis. Type 'quit' to exit.")
            
            while True:
                try:
                    user_query = input("\n🎯 Your question: ").strip()
                    
                    if user_query.lower() in ['quit', 'exit', 'q']:
                        print("👋 Thanks for using the deliberation demo!")
                        break
                    
                    if not user_query:
                        continue
                    
                    print("\n🤔 Agent deliberating...")
                    result = agent.run(user_query)
                    print(f"\n✅ Response: {result}")
                    
                except KeyboardInterrupt:
                    print("\n👋 Demo interrupted. Goodbye!")
                    break
                except Exception as e:
                    print(f"❌ Error: {e}")
                    continue
                    
    except Exception as e:
        print(f"❌ Failed to connect to MCP server: {e}")
        print("\nTroubleshooting tips:")
        print("1. Ensure Node.js is installed (node --version)")
        print("2. Check if the MCP package is available: npx @nbiish/gikendaasowin-aabajichiganan-mcp --version")
        print("3. Verify network connectivity for npx package downloads")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
