#!/bin/bash
set -e

# Check if OTP argument is provided
if [ -z "$1" ]; then
  echo "Error: NPM OTP code must be provided as the first argument."
  exit 1
fi

OTP_CODE=$1

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