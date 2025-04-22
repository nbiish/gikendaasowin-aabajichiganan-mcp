#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Remove argument check - we will prompt instead
# if [ -z "$1" ]; then
#   echo "❌ Error: NPM OTP code must be provided as the first argument."
#   exit 1
# fi
# NPM_OTP="$1"

# Define package file names (still needed for the copy strategy)
GIKEN_PKG="package-gikendaasowin.json"
COGNITIVE_PKG="package-cognitive-tools.json"
MAIN_PKG="package.json"
MAIN_PKG_BACKUP="package.json.bak" # Keep backup for safety during swap

# Ensure backup doesn't exist from a previous failed run
rm -f $MAIN_PKG_BACKUP

# Prompt for NPM OTP (Restored)
read -p "🔑 Enter NPM OTP code: " NPM_OTP

# Build the project (assuming this is necessary before publishing either)
echo "\n🏗️ Building project..."
npm run build

# Prepare and publish the main (gikendaasowin) package
echo "\n📦 Publishing @nbiish/gikendaasowin-aabajichiganan-mcp..."
cp $GIKEN_PKG $MAIN_PKG
npm publish --otp="$NPM_OTP" --access public # Added --access public explicitly

# Prepare and publish the cognitive-tools package
echo "\n📦 Publishing @nbiish/cognitive-tools-mcp..."
cp $MAIN_PKG $MAIN_PKG_BACKUP # Backup the just published (gikendaasowin) package.json info
cp $COGNITIVE_PKG $MAIN_PKG  # Copy cognitive-tools info to package.json
npm publish --otp="$NPM_OTP" --access public # Added --access public explicitly

# Restore original main package.json (which should match cognitive-tools.json after the last copy)
# Or, more safely, copy the backup (which matches the first published package)
mv $MAIN_PKG_BACKUP $MAIN_PKG
echo "\n🧹 Restored original package.json state (matching first published package)."


echo "\n✅ Successfully attempted to publish both packages!" 