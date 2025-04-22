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

# Increment versions BEFORE build/publish, ensuring they are synchronized
echo "\n⬆️ Incrementing and synchronizing package versions..."

# 1. Increment Giken package version
echo "   - Incrementing $GIKEN_PKG..."
mv $GIKEN_PKG $MAIN_PKG # Rename Giken to main
npm version patch --no-git-tag-version # Increment version in main (which is Giken)
NEW_VERSION=$(node -p "require('./$MAIN_PKG').version") # Read the new version
mv $MAIN_PKG $GIKEN_PKG # Rename back to Giken
echo "     - Set $GIKEN_PKG to version: $NEW_VERSION"

# 2. Set Cognitive Tools package to the exact same version
echo "   - Synchronizing $COGNITIVE_PKG..."
mv $COGNITIVE_PKG $MAIN_PKG # Rename Cog to main
npm version "$NEW_VERSION" --no-git-tag-version --allow-same-version # Set exact version (allow-same-version handles edge case where it might match initially)
mv $MAIN_PKG $COGNITIVE_PKG # Rename back to Cog
echo "     - Set $COGNITIVE_PKG to version: $NEW_VERSION"

# 3. Ensure the main package.json is ready for the build step
echo "   - Preparing package.json for build..."
cp $GIKEN_PKG $MAIN_PKG

# Build the project (using the main package context)
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