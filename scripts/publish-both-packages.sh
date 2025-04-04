#!/bin/bash
set -e

# Build the project
echo "Building project..."
npm run build

# Publish the main package
echo "Publishing @nbiish/gikendaasowin-aabajichiganan-mcp..."
npm publish

# Publish the cognitive-tools package
echo "Publishing @nbiish/cognitive-tools-mcp..."
cp package-cognitive-tools.json package.json.backup
cp package-cognitive-tools.json package.json
npm publish
mv package.json.backup package.json

echo "Both packages published successfully!" 