# Skills-SDK Makefile
# Wraps npm scripts for cross-platform consistency

.PHONY: install build test lint format clean help release

help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make build    - Build all packages"
	@echo "  make test     - Run all tests"
	@echo "  make lint     - Run linter"
	@echo "  make format   - Format code"
	@echo "  make clean    - Clean dist folders"
	@echo "  make release  - Publish packages"

install:
	npm ci

build:
	npm run build

test:
	npm test

lint:
	npm run lint

format:
	npm run format

clean:
	npm run clean

release:
	npm run release
