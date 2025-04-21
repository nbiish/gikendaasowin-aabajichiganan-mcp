#!/bin/bash
set -e

# Check for required tools
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed. Please install jq first."
    exit 1
fi

# Cleanup function for error recovery
cleanup() {
    if [ -f package.json.original ]; then
        mv package.json.original package.json
    fi
    if [ -f package.json.backup ]; then
        mv package.json.backup package.json
    fi
    if [ -f temp ]; then
        rm temp
    fi
}
trap cleanup EXIT

# Parse command line options
BUMP_VERSION=true
SKIP_OTP=false
DRY_RUN=false
OTP_CODE=""

usage() {
    echo "Usage: $0 [-b] [-s] [-d] [-o OTP] [-h]"
    echo "  -b: Bump version automatically"
    echo "  -s: Skip OTP requirement (for environments without 2FA)"
    echo "  -d: Dry run (don't actually publish)"
    echo "  -o OTP: Provide OTP code directly (avoids prompt)"
    echo "  -h: Show this help"
    exit 1
}

while getopts "bsdo:h" opt; do
    case $opt in
        b)
            BUMP_VERSION=true
            ;;
        s)
            SKIP_OTP=true
            ;;
        d)
            DRY_RUN=true
            ;;
        o)
            OTP_CODE="$OPTARG"
            ;;
        h)
            usage
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            usage
            ;;
    esac
done

# Display current mode
echo "⚙️ Running in: "
if [ "$DRY_RUN" = true ]; then
    echo "  - DRY RUN mode (no actual publishing)"
fi
if [ "$BUMP_VERSION" = true ]; then
    echo "  - Version bumping ENABLED"
fi
if [ "$SKIP_OTP" = true ]; then
    echo "  - OTP checking DISABLED"
fi
echo ""

# Version synchronization check
GIKEN_VERSION=$(jq -r .version package-gikendaasowin.json)
COG_VERSION=$(jq -r .version package-cognitive-tools.json)
if [ "$GIKEN_VERSION" != "$COG_VERSION" ]; then
    echo "❌ Error: Version mismatch between packages"
    echo "gikendaasowin: $GIKEN_VERSION"
    echo "cognitive-tools: $COG_VERSION"
    exit 1
fi

echo "✅ Version check passed: both packages at $GIKEN_VERSION"

# Optional version bump
if [ "$BUMP_VERSION" = true ]; then
    echo "🔼 Bumping version for both packages..."
    # Get current version and bump patch
    CURRENT_VERSION=$GIKEN_VERSION
    MAJOR=$(echo $CURRENT_VERSION | cut -d. -f1)
    MINOR=$(echo $CURRENT_VERSION | cut -d. -f2)
    PATCH=$(echo $CURRENT_VERSION | cut -d. -f3)
    NEW_PATCH=$((PATCH + 1))
    NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"
    
    # Update both package files
    jq ".version = \"$NEW_VERSION\"" package-gikendaasowin.json > temp && mv temp package-gikendaasowin.json
    jq ".version = \"$NEW_VERSION\"" package-cognitive-tools.json > temp && mv temp package-cognitive-tools.json
    echo "🚀 Version bumped to $NEW_VERSION"
fi

# OTP handling
OTP_PARAM=""
if [ "$SKIP_OTP" = false ] && [ "$DRY_RUN" = false ]; then
    # Check if user is already logged in
    npm whoami &> /dev/null
    if [ $? -ne 0 ]; then
        echo "❌ You are not logged in to npm. Please run 'npm login' first."
        exit 1
    fi
    
    # If OTP not provided via -o option, prompt for it
    if [ -z "$OTP_CODE" ]; then
        echo -n "🔑 Enter NPM OTP code: "
        read -r OTP_CODE
        echo  # Add a newline after input

        if [ -z "$OTP_CODE" ]; then
            echo "❌ Error: NPM OTP code must be provided."
            exit 1
        fi
    fi
    OTP_PARAM="--otp $OTP_CODE"
fi

# Build the project
echo "🏗️ Building project..."
npm run build

# Construct npm publish command
DRY_RUN_PARAM=""
if [ "$DRY_RUN" = true ]; then
    DRY_RUN_PARAM="--dry-run"
    echo "📝 DRY RUN MODE - No actual publishing will occur"
fi

# Publish the gikendaasowin-aabajichiganan-mcp package
echo "📦 Publishing @nbiish/gikendaasowin-aabajichiganan-mcp..."
cp package.json package.json.original
cp package-gikendaasowin.json package.json
npm publish $OTP_PARAM $DRY_RUN_PARAM || {
    echo "❌ Failed to publish @nbiish/gikendaasowin-aabajichiganan-mcp"
    echo "Try running 'npm login' first or check your NPM credentials"
    mv package.json.original package.json
    exit 1
}
mv package.json.original package.json

# Publish the cognitive-tools package
echo "📦 Publishing @nbiish/cognitive-tools-mcp..."
cp package.json package.json.backup
cp package-cognitive-tools.json package.json
npm publish $OTP_PARAM $DRY_RUN_PARAM || {
    echo "❌ Failed to publish @nbiish/cognitive-tools-mcp"
    echo "Try running 'npm login' first or check your NPM credentials"
    mv package.json.backup package.json
    exit 1
}
mv package.json.backup package.json

echo "✅ Both packages published successfully!" 