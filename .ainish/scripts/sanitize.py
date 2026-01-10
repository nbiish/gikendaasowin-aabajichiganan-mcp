#!/usr/bin/env python3
import json
import os
import re
import sys
from typing import Any, Dict, List, Union

def sanitize_value(key: str, value: Any) -> Any:
    """Sanitize a single value based on key name or value pattern."""
    if not isinstance(value, str):
        return value

    # Sanitize API keys based on key name
    if "API_KEY" in key.upper() or "TOKEN" in key.upper() or "SECRET" in key.upper():
        return f"YOUR_{key.upper()}_HERE"
    
    # Sanitize specific keys from original script
    if key == "tavilyApiKey":
        return "YOUR_TAVILY_API_KEY_HERE"

    # Sanitize local paths
    if key in ["cwd", "MEMORY_FILE_PATH"] and (value.startswith("/Volumes/") or value.startswith("/Users/")):
        if key == "cwd":
            return "/path/to/your/mcp/servers"
        if key == "MEMORY_FILE_PATH":
            return "/path/to/your/memory/memories.jsonl"
            
    value = sanitize_text(value)

    return value


def sanitize_text(text: str) -> str:
    if not text:
        return text

    patterns: List[tuple[str, str, int]] = [
        (r"tvly-[a-zA-Z0-9-]{30,}", "YOUR_TAVILY_API_KEY_HERE", 0),
        (r"tavilyApiKey=[^&\"\s]{10,}", "tavilyApiKey=YOUR_TAVILY_API_KEY_HERE", 0),
        (r"BSA[a-zA-Z0-9]{27}", "YOUR_BRAVE_API_KEY_HERE", 0),
        (r"\bsk-ant-[a-zA-Z0-9_-]{20,}\b", "YOUR_ANTHROPIC_API_KEY_HERE", 0),
        (r"\bsk-[a-zA-Z0-9]{20,}\b", "YOUR_OPENAI_API_KEY_HERE", 0),
        (r"\bghp_[A-Za-z0-9]{36}\b", "YOUR_GITHUB_TOKEN_HERE", 0),
        (r"\bgho_[A-Za-z0-9]{36}\b", "YOUR_GITHUB_TOKEN_HERE", 0),
        (r"\bghu_[A-Za-z0-9]{36}\b", "YOUR_GITHUB_TOKEN_HERE", 0),
        (r"\bghs_[A-Za-z0-9]{36}\b", "YOUR_GITHUB_TOKEN_HERE", 0),
        (r"\bghr_[A-Za-z0-9]{36}\b", "YOUR_GITHUB_TOKEN_HERE", 0),
        (r"\bgithub_pat_[A-Za-z0-9_]{50,}\b", "YOUR_GITHUB_TOKEN_HERE", 0),
        (r"\bxox[baprs]-[A-Za-z0-9-]{10,}\b", "YOUR_SLACK_TOKEN_HERE", 0),
        (r"\bAKIA[0-9A-Z]{16}\b", "YOUR_AWS_ACCESS_KEY_ID_HERE", 0),
        (r"(?s)-----BEGIN [A-Z ]*PRIVATE KEY-----.*?-----END [A-Z ]*PRIVATE KEY-----", "YOUR_PRIVATE_KEY_HERE", re.DOTALL),
        (r"/Volumes/[A-Za-z0-9._-]+/[^\s\"'`]*", "/path/to/your/volume", 0),
        (r"/Users/[A-Za-z0-9._-]+/[^\s\"'`]*", "/path/to/your/home", 0),
    ]

    out = text
    for pattern, replacement, flags in patterns:
        out = re.sub(pattern, replacement, out, flags=flags)
    return out


def is_binary_file(file_path: str) -> bool:
    try:
        with open(file_path, "rb") as f:
            chunk = f.read(8192)
        return b"\x00" in chunk
    except Exception:
        return True

def sanitize_structure(data: Any, key_context: str = "") -> Any:
    """Recursively sanitize a JSON structure."""
    if isinstance(data, dict):
        return {k: sanitize_structure(v, k) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_structure(item, key_context) for item in data]
    else:
        return sanitize_value(key_context, data)

def process_env_file(file_path: str) -> bool:
    """Process a single .env file."""
    try:
        if is_binary_file(file_path):
            return False

        with open(file_path, 'r') as f:
            lines = f.readlines()
        
        new_lines = []
        changed = False
        
        for line in lines:
            line = line.strip()
            if not line or line.startswith('#'):
                new_lines.append(line)
                continue
                
            if '=' in line:
                key, value = line.split('=', 1)
                sanitized_value = sanitize_value(key, value)
                if sanitized_value != value:
                    new_lines.append(f"{key}={sanitized_value}")
                    changed = True
                else:
                    new_lines.append(line)
            else:
                new_lines.append(line)
                
        if not changed:
            return False
            
        with open(file_path, 'w') as f:
            f.write('\n'.join(new_lines))
            f.write('\n')
            
        return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}", file=sys.stderr)
        return False

def process_text_file(file_path: str) -> bool:
    """Process any text file using pattern-based replacement."""
    try:
        if is_binary_file(file_path):
            return False

        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        sanitized = sanitize_text(content)

        if sanitized == content:
            return False
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(sanitized)
        
        return True
    except Exception as e:
        # If text processing fails, try JSON as fallback
        if file_path.endswith('.json') or file_path.endswith('.jsonc'):
            return process_json_file(file_path)
        return False

def process_file(file_path: str) -> bool:
    """Process a single file based on extension."""
    if file_path.endswith('.json') or file_path.endswith('.jsonc'):
        # Try JSON first
        result = process_json_file(file_path)
        if result:
            return True
        # If JSON processing didn't change anything (or failed), fallback to text
        return process_text_file(file_path)
    elif file_path.endswith('.env') or file_path.endswith('.env.local') or file_path.endswith('.env.development') or file_path.endswith('.env.production'):
        return process_env_file(file_path)
    else:
        # For all other file types, use pattern-based text processing
        return process_text_file(file_path)

def process_json_file(file_path: str) -> bool:
    """Process a single JSON file."""
    try:
        if is_binary_file(file_path):
            return False

        with open(file_path, 'r') as f:
            data = json.load(f)
        
        sanitized_data = sanitize_structure(data)
        
        # Check if changed
        if data == sanitized_data:
            return False
            
        with open(file_path, 'w') as f:
            json.dump(sanitized_data, f, indent=2)
            # Add newline at end of file
            f.write('\n')
            
        return True
    except Exception:
        # Return False to trigger fallback or indicate no change
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: sanitize.py <file1> [file2 ...]")
        sys.exit(1)

    files = sys.argv[1:]
    changed_files = []

    for file_path in files:
        try:
            if process_file(file_path):
                changed_files.append(file_path)
                # Don't print to stdout (silent mode for hooks)
                # print(f"Sanitized: {file_path}", file=sys.stderr)
        except Exception as e:
            # Silently skip files that can't be processed
            pass

    # Silent mode - don't print unless explicitly needed
    # if changed_files:
    #     print(f"Modified {len(changed_files)} files.")
    # else:
    #     print("No files needed sanitization.")

if __name__ == "__main__":
    main()
