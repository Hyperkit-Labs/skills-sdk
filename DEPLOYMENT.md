# Skills-SDK Deployment Guide

> **Ready to ship!** This guide helps you deploy Skills-SDK to production.

---

## 📋 Pre-Deployment Checklist

### Environment Setup

- [x] `.env.example` created with all variables
- [ ] Copy to `.env`: `npm run setup:env`
- [ ] Configure `NPM_TOKEN` in `.env`
- [ ] Configure `GITHUB_TOKEN` in `.env`

### Build & Test

- [ ] Install dependencies: `npm install`
- [ ] Build all packages: `npm run build`
- [ ] Run tests: `npm test`
- [ ] Lint check: `npm run lint`
- [ ] Format check: `npm run format:check`

### GitHub Setup

- [ ] Create repository: `github.com/Hyperkit-Labs/skills-sdk`
- [ ] Push code to GitHub
- [ ] Configure GitHub Secrets:
  - `NPM_TOKEN` - For automated publishing
  - `GITHUB_TOKEN` - Already available in GitHub Actions

### npm Setup

- [ ] Login to npm: `npm login --scope=@hyperkitlab`
- [ ] Verify organization access: `npm org ls hyperkitlab`

---

## 🚀 Deployment Steps

### Step 1: Publish npm Packages

```bash
# Build everything first
npm run build

# Publish skills-solidity (the distribution package)
cd packages/skills-solidity
npm publish --access public

# Optionally publish individual packages
cd ../parsers && npm publish --access public
cd ../validators && npm publish --access public
cd ../bundler && npm publish --access public
cd ../cli && npm publish --access public
```

### Step 2: Generate First SKILL.md

```bash
# From project root
npm run generate:openzeppelin

# This will:
# 1. Fetch latest OpenZeppelin version
# 2. Parse documentation
# 3. Validate schema & compilation
# 4. Generate SKILL.md in skills/solidity/openzeppelin/vX.X.X/
```

### Step 3: Create GitHub Release

```bash
# Tag the release
git tag -a v0.1.0 -m "Release v0.1.0: MVP Complete"
git push origin v0.1.0

# GitHub Actions will automatically:
# - Build all packages
# - Run tests
# - Publish to npm
# - Create GitHub Release with SKILL.md files
```

---

## 🧪 Testing Deployment

### Test npm Package Installation

```bash
# In a new directory
mkdir test-skills-sdk
cd test-skills-sdk
npm init -y
npm install @hyperkitlab/skills-solidity

# Test the API
node -e "
const { loadSkillPack } = require('@hyperkitlab/skills-solidity');
loadSkillPack('openzeppelin').then(content => {
  console.log('✅ Skill loaded:', content.substring(0, 100));
}).catch(err => console.error('❌ Error:', err));
"
```

### Test Automation

```bash
# Trigger daily sync manually
gh workflow run sync.yml

# Check workflow status
gh run list --workflow=sync.yml

# Trigger release workflow
gh workflow run release.yml
```

---

## 📊 Post-Deployment Monitoring

### npm Package Stats

- Check downloads: https://www.npmjs.com/package/@hyperkitlab/skills-solidity
- Monitor versions: `npm view @hyperkitlab/skills-solidity versions`

### GitHub Activity

- Watch repository: github.com/Hyperkit-Labs/skills-sdk
- Monitor Issues: github.com/Hyperkit-Labs/skills-sdk/issues
- Check Actions: github.com/Hyperkit-Labs/skills-sdk/actions

### Daily Sync

- Workflow runs daily at 8 AM UTC
- Creates PR when documentation updates detected
- Review and merge PRs as they come

---

## 🔧 Troubleshooting

### Build Failures

```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

### npm Publish Issues

```bash
# Verify login
npm whoami --registry=https://registry.npmjs.org

# Check package
cd packages/skills-solidity
npm pack --dry-run
```

### GitHub Actions Failures

```bash
# Check logs
gh run view <run-id> --log

# Re-run failed workflow
gh run rerun <run-id>
```

---

## 🎯 Success Criteria

### MVP (v0.1.0)

- [x] OpenZeppelin parser working
- [x] 3-tier validation system
- [x] SKILL.md bundler functional
- [ ] npm package published
- [ ] GitHub repository live
- [ ] Documentation complete

### v1.0.0 (Week 6)

- [ ] 3 providers (OpenZeppelin, Alchemy, thirdweb)
- [ ] Move language support
- [ ] 50+ GitHub stars
- [ ] 20+ npm downloads/week
- [ ] Community engaged

---

## 📞 Support

### Issues

- Create issue: github.com/Hyperkit-Labs/skills-sdk/issues/new
- Email: Hyperkitdev@gmail.com

### Documentation

- README: github.com/Hyperkit-Labs/skills-sdk#readme
- CONTRIBUTING: github.com/Hyperkit-Labs/skills-sdk/blob/main/CONTRIBUTING.md

---

## 🎉 You're Ready!

Follow the steps above to deploy Skills-SDK to production.

**Next:** Publish npm package → Push to GitHub → Watch it work! 🚀
