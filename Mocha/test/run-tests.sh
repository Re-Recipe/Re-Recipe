#!/bin/bash

echo "Running all Mocha tests..."
# Navigate to the script's directory
cd "$(dirname "$0")"
# Run Mocha tests with the spec reporter
npx mocha --reporter spec