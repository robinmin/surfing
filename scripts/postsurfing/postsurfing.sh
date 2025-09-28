#!/bin/bash

# PostSurfing CLI Wrapper Script
# 
# This script provides a convenient way to run the PostSurfing CLI tool
# from anywhere in the project directory.

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI_SCRIPT="$SCRIPT_DIR/postsurfing.mjs"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js (version 18+ required)"
    exit 1
fi

# Check if the CLI script exists
if [ ! -f "$CLI_SCRIPT" ]; then
    echo "❌ Error: PostSurfing CLI script not found at $CLI_SCRIPT"
    exit 1
fi

# Run the CLI with all passed arguments
exec node "$CLI_SCRIPT" "$@"
