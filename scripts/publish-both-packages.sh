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
BUMP_VERSION=false
while getopts "b" opt; do
    case $opt in
        b)
            BUMP_VERSION=true
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            exit 1
            ;;
    esac
done

# Version synchronization check
GIKEN_VERSION=$(jq -r .version package-gikendaasowin.json)
COG_VERSION=$(jq -r .version package-cognitive-tools.json)
if [ "$GIKEN_VERSION" != "$COG_VERSION" ]; then
    echo "Error: Version mismatch between packages"
    echo "gikendaasowin: $GIKEN_VERSION"
    echo "cognitive-tools: $COG_VERSION"
    exit 1
fi

# Optional version bump
if [ "$BUMP_VERSION" = true ]; then
    echo "Bumping version for both packages..."
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
    echo "Version bumped to $NEW_VERSION"
fi

# Prompt for OTP code
echo -n "Enter NPM OTP code: "
read -s OTP_CODE
echo  # Add a newline after input

if [ -z "$OTP_CODE" ]; then
    echo "Error: NPM OTP code must be provided."
    exit 1
fi

# Build the project
echo "Building project..."
npm run build

# Publish the gikendaasowin-aabajichiganan-mcp package
echo "Publishing @nbiish/gikendaasowin-aabajichiganan-mcp..."
cp package.json package.json.original
cp package-gikendaasowin.json package.json
npm publish --otp $OTP_CODE
mv package.json.original package.json

# Publish the cognitive-tools package
echo "Publishing @nbiish/cognitive-tools-mcp..."
cp package.json package.json.backup
cp package-cognitive-tools.json package.json
npm publish --otp $OTP_CODE
mv package.json.backup package.json

echo "Both packages published successfully!" 