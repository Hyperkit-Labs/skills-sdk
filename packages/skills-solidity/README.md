# @hyperkitlab/skills-solidity

> **OpenZeppelin Solidity Skills for AI Agents**  
> Auto-synced, validated blockchain knowledge packs for Claude, Cursor, and other AI coding assistants.

## 🚀 Quick Start

```bash
npm install @hyperkitlab/skills-solidity
```

### Usage

```typescript
import { loadSkillPack, listAvailableSkills } from '@hyperkitlab/skills-solidity';

// Load OpenZeppelin v5 skills
const skillContent = await loadSkillPack('openzeppelin', '5.0.2');

// List all available skills
const skills = await listAvailableSkills();
console.log(skills);
// [{ name: 'openzeppelin-solidity-v5.0.2', version: '5.0.2', provider: 'openzeppelin', language: 'solidity' }]
```

## 📦 What's Included

- **OpenZeppelin Contracts v5.x** - AccessControl, ERC20, ERC721, Upgradeable patterns
- **Validated Code Examples** - All Solidity examples compile successfully
- **Token-Optimized** - Under 5000 tokens per SKILL.md for efficient AI context
- **Auto-Synced** - Daily updates from upstream provider documentation

## 🎯 Use Cases

### For Developers

Get AI assistance that actually understands Web3:

```typescript
// In Cursor, Claude Code, or any AI assistant:
// "Create an ERC20 with AccessControl and pausable functionality"
// AI uses the loaded skill and generates correct, current code
```

### For AI Tool Builders

Integrate Web3 knowledge into your AI products:

```typescript
import { loadSkillPack } from '@hyperkitlab/skills-solidity';

const ozSkills = await loadSkillPack('openzeppelin');
// Use ozSkills content as AI agent context
```

## 🔧 Supported Providers

| Provider     | Version | Features                              |
| ------------ | ------- | ------------------------------------- |
| OpenZeppelin | 5.0.2   | AccessControl, Tokens, NFTs, Upgrades |

## 📖 SKILL.md Format

Each skill follows the Agent Skills standard ([agentskills.io](https://agentskills.io)):

````markdown
---
name: openzeppelin-solidity-v5-0-2
description: OpenZeppelin Contracts for Solidity
version: 5.0.2
language: solidity
providers: openzeppelin
---

# OpenZeppelin SOLIDITY v5.0.2

## Instructions

... (AI-optimized guidance)

### Core Patterns

- **AccessControl**: Role-based permissions
- **ERC20**: Token standard implementation

### Code Examples

```solidity
// Validated, compiling examples
```
````

````

## 🛠️ Development

```bash
# Clone
git clone https://github.com/Hyperkit-Labs/skills-sdk
cd skills-sdk

# Install
npm install

# Build
npm run build

# Test
npm test
````

## 📊 Quality Guarantees

- ✅ **Schema Validation** - All SKILL.md files pass strict schema checks
- ✅ **Compilation Validation** - Every Solidity example compiles with solc
- ✅ **Token Limits** - Under 5000 tokens for efficient AI loading
- ✅ **Daily Syncs** - Automatic updates from upstream documentation

## 📄 License

Apache-2.0 © [HyperKit Labs](https://hyperionkit.xyz)

## 🔗 Links

- [Skills SDK](https://github.com/Hyperkit-Labs/skills-sdk)
- [Documentation](https://github.com/Hyperkit-Labs/skills-sdk#readme)
- [Issues](https://github.com/Hyperkit-Labs/skills-sdk/issues)
- [Agent Skills Standard](https://agentskills.io)

---

**Made with ❤️ for the AI + Web3 community**
