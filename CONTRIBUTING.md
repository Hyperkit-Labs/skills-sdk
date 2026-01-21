# Contributing to Skills-SDK

Thank you for your interest in contributing to Skills-SDK! This document provides guidelines and instructions for contributing.

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/skills-sdk`
3. **Install** dependencies: `npm install`
4. **Build**: `npm run build`
5. **Test**: `npm test`

## 📋 How to Contribute

### Adding a New Parser

Want to add support for a new provider? Follow these steps:

1. **Create parser file**: `packages/parsers/src/[provider]/[Provider]Parser.ts`

```typescript
import { Parser, DocEntry } from '../base/Parser';

export class MyProviderParser implements Parser {
  async fetchLatestVersion(): Promise<string> {
    // Fetch from GitHub API or provider versioning
  }

  async extractContracts(url: string): Promise<DocEntry[]> {
    // Parse documentation and extract contracts
  }
}
```

2. **Add tests**: `packages/parsers/tests/[provider].test.ts`

```typescript
describe('MyProviderParser', () => {
  it('should fetch latest version', async () => {
    const parser = new MyProviderParser();
    const version = await parser.fetchLatestVersion();
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
```

3. **Export** in `packages/parsers/src/index.ts`
4. **Submit PR** with description and examples

### Bounty Program

We offer bounties for quality contributions:

- **$50** - New parser for verified providers (OpenZeppelin, Alchemy, etc.)
- **$100** - Complex parsers requiring Playwright or multi-step processing

**Requirements for bounty**:

- 90%+ test coverage
- Passes all validation tiers
- Documentation included
- Examples provided

## 🧪 Testing

### Running Tests

```bash
# All tests
npm test

# Specific package
cd packages/parsers && npm test

# With coverage
npm run test:coverage
```

### Test Requirements

- **Unit tests**: 90% coverage minimum
- **Integration tests**: For parser → validator → bundler pipeline
- **E2E tests**: For npm package usage

## 📝 Code Style

We use ESLint + Prettier:

```bash
npm run lint        # Check
npm run lint:fix    # Fix
npm run format      # Prettier
```

**Key rules**:

- TypeScript strict mode
- No `any` types (warn only)
- Prefer `const` over `let`
- Single quotes
- 100 char line width

## 🔀 Pull Request Process

1. **Create feature branch**: `git checkout -b feature/my-parser`
2. **Make changes** with clear commit messages
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Run validation**: `npm run validate:all`
6. **Push** to your fork
7. **Create PR** with:
   - Clear description
   - Screenshots/examples if UI-related
   - Link to related issues

### PR Checklist

- [ ] Tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] Linting clean (`npm run lint`)
- [ ] Coverage ≥90%
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (if applicable)

## 📚 Documentation

When adding features:

- Update inline JSDoc comments
- Add examples to README
- Update relevant `.md` files in `docs/`

## 🐛 Reporting Issues

Use GitHub Issues with:

- **Bug reports**: Include error logs, steps to reproduce
- **Feature requests**: Describe use case and expected behavior
- **Parser requests**: Provider name, documentation URL, priority

## 💬 Community

- **GitHub Discussions**: For questions and ideas
- **Issues**: For bugs and tracked work
- **Discord** (coming soon): Real-time chat

## 🏆 Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Eligible for bounties

## 📄 License

By contributing, you agree that your contributions will be licensed under Apache-2.0.

---

**Thank you for helping build Skills-SDK!** 🙏
