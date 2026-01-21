# Changelog

All notable changes to Skills-SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- OpenZeppelin Contracts v5.x parser
- 3-tier validation system (schema, compilation, agent)
- SKILL.md bundler with token optimization
- skills-solidity npm package
- Daily sync automation (GitHub Actions)
- Release automation workflow
- Integration scripts for SKILL.md generation

### Infrastructure

- TypeScript monorepo with npm workspaces
- Jest testing framework with 90% coverage requirement
- ESLint + Prettier configuration
- GitHub Actions CI/CD (validate, test, sync, release)

## [0.1.0] - 2026-01-21

### Added

- Initial project scaffolding
- Parser package (@skills-sdk/parsers)
- Validators package (@skills-sdk/validators)
- Bundler package (@skills-sdk/bundler)
- CLI package (@skills-sdk/cli)
- Skills-solidity distribution package (@hyperkitlab/skills-solidity)

### Features

- OpenZeppelin parser with GitHub API integration
- Schema validator using AJV
- Compilation validator using solc
- Agent validator framework (stub for HyperAgent integration)
- Skill assembler with Mustache templating
- Token counting with js-tiktoken
- Progressive disclosure for large skills

### Documentation

- Comprehensive README
- CONTRIBUTING.md
- Implementation plan
- Project board
- Quick start guide

---

## Version History

- **0.1.0** - Initial release (Phase 1-2 complete)
- **Unreleased** - Phase 3-5 in progress

---

For detailed implementation progress, see [PROJECT_BOARD.md](.github/PROJECT_BOARD.md)
