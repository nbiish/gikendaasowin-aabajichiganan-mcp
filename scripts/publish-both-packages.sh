#!/bin/bash
set -e

# Build the project
echo "Building project..."
npm run build

# Publish the gikendaasowin-aabajichiganan-mcp package
echo "Publishing @nbiish/gikendaasowin-aabajichiganan-mcp..."
cp package.json package.json.original
cp package-gikendaasowin.json package.json
npm publish
mv package.json.original package.json

# Publish the cognitive-tools package
echo "Publishing @nbiish/cognitive-tools-mcp..."
cp package.json package.json.backup
cp package-cognitive-tools.json package.json
npm publish
mv package.json.backup package.json

echo "Both packages published successfully!" 