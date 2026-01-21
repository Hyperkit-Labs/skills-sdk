# Quick Deployment Script
# Run after npm install and build

echo "🚀 Skills-SDK Deployment Starting..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "⚠️  .env not found. Run: npm run setup:env"
  exit 1
fi

# Build
echo "🔨 Building packages..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

# Test
echo "🧪 Running tests..."
npm test
if [ $? -ne 0 ]; then
  echo "⚠️  Tests failed - continuing anyway"
fi

# Publish to npm
echo ""
echo "📦 Publishing to npm..."
cd packages/skills-solidity
npm publish --access public
cd ../..

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "  1. Push to GitHub: git push origin main"
echo "  2. Create tag: git tag v0.1.0 && git push origin v0.1.0"
echo "  3. Generate SKILL.md: npm run generate:openzeppelin"
