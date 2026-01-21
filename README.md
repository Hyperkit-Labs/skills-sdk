<div align="center">
  <img src="public/img/Skill-sdk-banner.png" alt="Skills-SDK Banner_Image" width="100%" />
</div>

> **Web3 Knowledge Layer for AI Agents**  
> Transform blockchain documentation into AI-ready SKILL.md packs with automatic syncing and validation.
>
> *Based on the [Anthropic Agent Skills](https://github.com/anthropics/anthropic-agent-skills) standard. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for attribution.*

[![npm version](https://img.shields.io/npm/v/@hyperkitlab/skills-solidity)](https://www.npmjs.com/package/@hyperkitlab/skills-solidity)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Node version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](package.json)

---

## 🎯 What Is This?

Skills-SDK is a **documentation aggregation pipeline** that:

1. **Fetches** Web3 docs from providers (OpenZeppelin, Alchemy, thirdweb)
2. **Parses** & extracts contracts, patterns, code examples
3. **Validates** using 3-tier system (schema, compilation, agent testing)
4. **Bundles** into AI-optimized SKILL.md files (<5K tokens)
5. **Publishes** as npm packages with daily auto-sync

**Result**: AI agents (Claude, Cursor, HyperAgent) get correct, current Web3 knowledge.

---

## ⚡ Quick Start

### For Users (Install Skills)

```bash
npm install @hyperkitlab/skills-solidity
```

```typescript
import { loadSkillPack } from '@hyperkitlab/skills-solidity';

// Load OpenZeppelin v5.5 skills
const ozSkills = await loadSkillPack('openzeppelin', '5.5.0');
// Use in your AI agent context
```

### For Contributors (Build Skills)

```bash
git clone https://github.com/Hyperkit-Labs/skills-sdk
cd skills-sdk
npm install
npm run build

# Generate OpenZeppelin SKILL.md
npm run generate:openzeppelin
```

---

## 📦 Packages

| Package                        | Version | Description                  |
| ------------------------------ | ------- | ---------------------------- |
| `@hyperkitlab/skills-solidity` | 5.0.2   | OpenZeppelin Solidity skills |
| `@skills-sdk/parsers`          | 0.1.0   | Web3 documentation parsers   |
| `@skills-sdk/validators`       | 0.1.0   | 3-tier validation system     |
| `@skills-sdk/bundler`          | 0.1.0   | SKILL.md assembler           |
| `@skills-sdk/cli`              | 0.1.0   | Command-line tools           |

---

## 🏗️ Architecture

```
┌─────────────────┐
│ Upstream Docs   │  OpenZeppelin, Alchemy, thirdweb
└────────┬────────┘
         │
    ┌────▼────┐
    │ Parsers │  cheerio, playwright, undici
    └────┬────┘
         │
   ┌─────▼─────┐
   │Validators │  AJV, solc, agent testing
   └─────┬─────┘
         │
    ┌────▼────┐
    │ Bundler │  Mustache, token counting
    └────┬────┘
         │
  ┌──────▼──────┐
  │Distribution │  npm, GitHub Releases, CDN
  └──────┬──────┘
         │
  ┌──────▼──────┐
  │  AI Agents  │  Claude, Cursor, HyperAgent
  └─────────────┘
```

---

## 🔧 Supported Providers

### Current (v0.1.0)

- ✅ **OpenZeppelin Contracts v5.x** - AccessControl, ERC20, ERC721, Upgradeable

### Roadmap

- 🔄 **Alchemy** - Account Abstraction, Bundlers, Paymasters
- 🔄 **thirdweb** - Connect, Engine, Deployment
- 🔄 **Sui Framework** (Move)
- 🔄 **Aptos SDK** (Move)

---

## 🎨 Features

### 3-Tier Validation

1. **Schema (Tier 1)** - AJV validation of YAML frontmatter
2. **Compilation (Tier 2)** - solc validates all Solidity examples
3. **Agent (Tier 3)** - AI agent tests using generated skills

### Token Optimization

- Progressive disclosure (main <5K tokens, references separate)
- Mustache templating with smart trimming
- js-tiktoken for accurate counting

### Auto-Sync

- Daily cron job checks upstream documentation
- Auto-creates PR when new versions detected
- Redis caching (70%+ hit rate)

### Quality Assurance

- 90% test coverage requirement
- TypeScript strict mode
- GitHub Actions CI/CD
- Cross-platform testing (Ubuntu, Windows, macOS)

---

## 📖 Documentation

- [Implementation Plan](.github/IMPLEMENTATION_PR.md)
- [Project Board](.github/PROJECT_BOARD.md)
- [Quick Start Guide](.github/QUICK_START.md)
- [Contributing](CONTRIBUTING.md)

---

## 🚀 Development

### Prerequisites

- Node.js >=20.0.0
- npm >=10.0.0

### Setup

```bash
npm install
npm run build
npm test
```

### Project Structure

```
skills-sdk/
├── packages/
│   ├── parsers/        # Documentation parsers
│   ├── validators/     # Validation engines
│   ├── bundler/        # SKILL.md assembler
│   ├── cli/            # Command-line tools
│   └── skills-solidity/ # Distribution package
├── scripts/            # Automation scripts
├── skills/             # Generated SKILL.md files
└── .github/            # CI/CD workflows
```

### Commands

```bash
npm run build           # Build all packages
npm test                # Run test suite
npm run lint            # ESLint check
npm run format          # Prettier format
npm run validate:all    # Full validation
```

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Bounty Program

- $50 per new parser (verified providers)
- $100 for complex parsers (JS-rendered, multi-step)

[View Open Issues](https://github.com/Hyperkit-Labs/skills-sdk/issues)

---

## 📊 Success Metrics

### MVP (Week 2)

- ✅ OpenZeppelin parser working
- ✅ 3-tier validation complete
- ✅ First SKILL.md generated
- ⏳ npm package published

### v1.0 (Week 6)

- ⏳ 3 providers (OpenZeppelin, Alchemy, thirdweb)
- ⏳ Move language support (Sui, Aptos)
- ⏳ 50+ GitHub stars
- ⏳ 20+ npm downloads/week

---

## 📄 License

Apache-2.0 © [HyperKit Labs](https://hyperionkit.xyz)

---

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/@hyperkitlab/skills-solidity)
- [Documentation](https://github.com/Hyperkit-Labs/skills-sdk#readme)
- [Issues](https://github.com/Hyperkit-Labs/skills-sdk/issues)
- [Agent Skills Standard](https://agentskills.io)
- [HyperKit Labs](https://hyperionkit.xyz)

---

## ⭐ Star History

If you find this useful, please ⭐ star the repo!

---

**Made with ❤️ by HyperKit Labs for the AI + Web3 community**
