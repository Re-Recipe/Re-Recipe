#!/bin/bash
echo "Running custom build script..."
npm cache clean --force
rm -rf node_modules
npm install