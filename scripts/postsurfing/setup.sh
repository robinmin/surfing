#!/bin/bash

# PostSurfing CLI Setup Script
# 
# This script helps set up the PostSurfing CLI tool for easy usage

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${BLUE}🏄 PostSurfing CLI Setup${NC}"
echo "=================================="

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed${NC}"
    echo "Please install Node.js (version 18+ required) from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js found: $NODE_VERSION${NC}"

# Check if we're in the right directory
if [ ! -f "$PROJECT_ROOT/package.json" ]; then
    echo -e "${RED}❌ Error: Not in Surfing project root${NC}"
    echo "Please run this script from the Surfing project directory"
    exit 1
fi

echo -e "${GREEN}✅ Surfing project detected${NC}"

# Make scripts executable
echo "Making CLI scripts executable..."
chmod +x "$SCRIPT_DIR/postsurfing.mjs"
chmod +x "$SCRIPT_DIR/postsurfing.sh"
echo -e "${GREEN}✅ Scripts made executable${NC}"

# Test the CLI
echo "Testing CLI functionality..."
if node "$SCRIPT_DIR/postsurfing.mjs" --help > /dev/null 2>&1; then
    echo -e "${GREEN}✅ CLI is working correctly${NC}"
else
    echo -e "${RED}❌ CLI test failed${NC}"
    exit 1
fi

# Run tests
echo "Running test suite..."
if node "$PROJECT_ROOT/tests/postsurfing/test-runner.mjs" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ All tests passed${NC}"
else
    echo -e "${YELLOW}⚠️  Some tests failed - check test output${NC}"
fi

# Suggest alias setup
echo ""
echo -e "${BLUE}📝 Setup Complete!${NC}"
echo ""
echo "To use the CLI from anywhere, add this alias to your shell profile:"
echo ""
echo -e "${YELLOW}# Add to ~/.bashrc, ~/.zshrc, or ~/.profile${NC}"
echo "alias postsurfing=\"node $SCRIPT_DIR/postsurfing.mjs\""
echo ""
echo "Or use the wrapper script:"
echo "alias postsurfing=\"$SCRIPT_DIR/postsurfing.sh\""
echo ""
echo -e "${BLUE}Usage Examples:${NC}"
echo "postsurfing ./my-article.md --type articles"
echo "postsurfing ./legacy.html --type documents --auto-convert"
echo "postsurfing ./project.md --type showcase --interactive"
echo ""
echo -e "${GREEN}🎉 PostSurfing CLI is ready to use!${NC}"
