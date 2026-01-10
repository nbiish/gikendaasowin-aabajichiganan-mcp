#!/bin/bash
# Local secret scanner
# Generates SECURITY_REPORT.md for LLM consumption

OUTPUT_FILE="SECURITY_REPORT.md"

# Define patterns (sync with detect-secrets.yml)
PATTERNS=(
    "BSA[a-zA-Z0-9]{27}"
    "tvly-[a-zA-Z0-9-]{30,}"
    "BRAVE_API_KEY.*[\"'][^\"']{10,}[\"']"
    "tavilyApiKey=[^&\"\\s]{10,}"
    "ghp_[A-Za-z0-9]{36}"
    "gho_[A-Za-z0-9]{36}"
    "ghu_[A-Za-z0-9]{36}"
    "ghs_[A-Za-z0-9]{36}"
    "ghr_[A-Za-z0-9]{36}"
    "github_pat_[A-Za-z0-9_]{50,}"
    "sk-ant-[A-Za-z0-9_-]{20,}"
    "sk-[A-Za-z0-9]{20,}"
    "AKIA[0-9A-Z]{16}"
    "-----BEGIN [A-Z ]*PRIVATE KEY-----"
    "/Volumes/[A-Za-z0-9._-]+/"
    "/Users/[A-Za-z0-9._-]+/"
)

# Start report
echo "# Security Scan Report" > "$OUTPUT_FILE"
echo "Date: $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "## Summary" >> "$OUTPUT_FILE"
echo "The following potential secrets were detected in your codebase." >> "$OUTPUT_FILE"
echo "Please review and remediate them before committing." >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

FOUND=0

echo "🔍 Scanning for secrets..."
for pattern in "${PATTERNS[@]}"; do
    # Grep recursively, exclude .git, exclude the report itself, exclude ignored dirs
    # Use -n for line numbers, -I to ignore binary files
    # We explicitly exclude the scanner scripts and configuration files that define these patterns
    # Also exclude .env files (should be in .gitignore, not committed)
    matches=$(grep -rInE \
        --exclude-dir={.git,node_modules,venv,.venv,target,dist,build,__pycache__} \
        --exclude="$OUTPUT_FILE" \
        --exclude="scan_secrets.sh" \
        --exclude="detect-secrets.yml" \
        --exclude=".git-secrets-setup.sh" \
        --exclude="sanitize-settings.sh" \
        --exclude="secret-protection-help.sh" \
        --exclude="sanitize.py" \
        --exclude="security_scan.sh" \
        --exclude="*.md" \
        --exclude=".env" \
        --exclude=".env.*" \
        --exclude="*.env" \
        --exclude="*.bak" \
        "$pattern" . 2>/dev/null | grep -vE "YOUR_[A-Z_]+_HERE|BSAtestkey|example|template|your-key-here|\$\{BRAVE_API_KEY\}|/path/to/your/")
    
    if [ -n "$matches" ]; then
        FOUND=1
        echo "### ⚠️ Pattern Match: \`$pattern\`" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "**SECURITY NOTE:** This report shows file locations and line numbers only - no actual secrets are displayed." >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "| File | Line |" >> "$OUTPUT_FILE"
        echo "|------|------|" >> "$OUTPUT_FILE"
        
        # Extract only file path and line number (safe - no secret content)
        echo "$matches" | while IFS= read -r line; do
            file_path=$(echo "$line" | cut -d: -f1)
            line_num=$(echo "$line" | cut -d: -f2)
            echo "| \`${file_path}\` | ${line_num} |" >> "$OUTPUT_FILE"
        done
        
        echo "" >> "$OUTPUT_FILE"
        echo "Found match for: $pattern"
    fi
done

if [ $FOUND -eq 1 ]; then
    echo "" >> "$OUTPUT_FILE"
    echo "## Recommended Actions" >> "$OUTPUT_FILE"
    echo "1. **Auto-cleanse:** Secrets will be automatically cleansed on commit via pre-commit hook" >> "$OUTPUT_FILE"
    echo "2. **Manual:** Run \`python3 .ainish/scripts/sanitize.py <file>\` to auto-sanitize known keys." >> "$OUTPUT_FILE"
    echo "3. **Manual:** Replace the secret with a placeholder (e.g., \`YOUR_API_KEY_HERE\`)." >> "$OUTPUT_FILE"
    echo "4. **Ignore:** Add the file to \`.gitignore\` if it should not be committed." >> "$OUTPUT_FILE"
    
    echo "❌ Secrets detected! Report generated at: $OUTPUT_FILE"
    echo "   (Safe report - no actual secrets included)"
    echo "   Secrets will be automatically cleansed on commit."
    exit 1
else
    echo "✅ No secrets detected."
    # Clean up report if no secrets found (optional, but good for hygiene)
    rm -f "$OUTPUT_FILE"
    exit 0
fi
