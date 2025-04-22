#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Define package file names
GIKEN_PKG="package-gikendaasowin.json"
COGNITIVE_PKG="package-cognitive-tools.json"
MAIN_PKG="package.json"
MAIN_PKG_BACKUP="package.json.bak"

# Ensure backup doesn't exist from a previous failed run
rm -f $MAIN_PKG_BACKUP

# Prompt for NPM OTP
read -p "🔑 Enter NPM OTP code: " NPM_OTP

# Build the project
echo "\n🏗️ Building project..."
npm run build

# Publish the main (gikendaasowin) package
echo "\n📦 Publishing @nbiish/gikendaasowin-aabajichiganan-mcp..."
cp $GIKEN_PKG $MAIN_PKG # Ensure main package.json has correct name/version for first publish
npm publish --otp="$NPM_OTP"

# Prepare and publish the cognitive-tools package
echo "\n📦 Publishing @nbiish/cognitive-tools-mcp..."
cp $MAIN_PKG $MAIN_PKG_BACKUP # Backup the just published package.json
cp $COGNITIVE_PKG $MAIN_PKG  # Replace package.json with cognitive-tools version

# Publish the second package
npm publish --otp="$NPM_OTP"

# Restore original package.json and cleanup
mv $MAIN_PKG_BACKUP $MAIN_PKG

echo "\n✅ Successfully published both packages!" 