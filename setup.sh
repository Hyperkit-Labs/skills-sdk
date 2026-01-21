#!/bin/bash
# Quick setup script for Skills-SDK

echo "🚀 Skills-SDK Quick Setup"
echo ""

# Check Node version
echo "Checking Node.js version..."
node --version
if [ $? -ne 0 ]; then
    echo "❌ Node.js not found. Please install Node.js >=20.0.0"
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Build
echo ""
echo "🔨 Building packages..."
npm run build

# Run tests
echo ""
echo "🧪 Running tests..."
npm test

# Summary
echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Configure .env file (copy from .env.example)"
echo "  2. Generate first SKILL.md: npm run generate:openzeppelin"
echo "  3. Publish to npm: cd packages/skills-solidity && npm publish"
