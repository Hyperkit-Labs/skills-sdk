#!/bin/bash
# Skills-SDK Version Management Script
# Integrates with existing version/scripts/parallel-commit.sh

VERSION_FILE="version/package.json.txt"
CURRENT_VERSION=$(grep '"version"' $VERSION_FILE | sed 's/.*"version": "\(.*\)".*/\1/')

echo "🏷️  Skills-SDK Version Manager"
echo ""
echo "Current version: $CURRENT_VERSION"
echo ""

# Parse command
case "$1" in
  "bump")
    echo "📈 Bumping version..."
    # Use existing parallel-commit script
    cd version && ./scripts/parallel-commit.sh
    ;;
    
  "tag")
    echo "🏷️  Creating git tag..."
    git tag -a "v$CURRENT_VERSION" -m "Release v$CURRENT_VERSION"
    git push origin "v$CURRENT_VERSION"
    echo "✅ Tagged v$CURRENT_VERSION"
    ;;
    
  "publish")
    echo "📦 Publishing version $CURRENT_VERSION..."
    
    # Update all package.json files
    for pkg in packages/*/package.json; do
      sed -i "s/\"version\": \".*\"/\"version\": \"$CURRENT_VERSION\"/" $pkg
    done
    
    echo "✅ Updated package versions to $CURRENT_VERSION"
    ;;
    
  *)
    echo "Usage: $0 {bump|tag|publish}"
    echo ""
    echo "Commands:"
    echo "  bump    - Bump version using parallel-commit script"
    echo "  tag     - Create git tag for current version"
    echo "  publish - Update all package.json files with current version"
    exit 1
    ;;
esac
