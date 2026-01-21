// E2E Test: Full Skills-SDK Pipeline
// Tests: Parse → Validate → Bundle → Generate SKILL.md

const { OpenZeppelinParser } = require('../packages/parsers/dist/openzeppelin/OpenZeppelinParser');
const { SchemaValidator } = require('../packages/validators/dist/SchemaValidator');
const { CompilationValidator } = require('../packages/validators/dist/CompilationValidator');
const { SkillAssembler } = require('../packages/bundler/dist/SkillAssembler');
const fs = require('fs');
const path = require('path');

async function runE2ETest() {
    console.log('🧪 Running E2E Test: Full Pipeline\n');

    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    function test(name, fn) {
        try {
            fn();
            results.passed++;
            results.tests.push({ name, status: '✅ PASS' });
            console.log(`✅ ${name}`);
        } catch (error) {
            results.failed++;
            results.tests.push({ name, status: '❌ FAIL', error: error.message });
            console.log(`❌ ${name}: ${error.message}`);
        }
    }

    // Test 1: Parser instantiation
    let parser;
    test('Parser: OpenZeppelinParser instantiates', () => {
        parser = new OpenZeppelinParser();
        if (!parser) throw new Error('Parser is null');
    });

    // Test 2: Validator instantiation
    let schemaValidator, compilationValidator;
    test('Validator: SchemaValidator instantiates', () => {
        schemaValidator = new SchemaValidator();
        if (!schemaValidator) throw new Error('SchemaValidator is null');
    });

    test('Validator: CompilationValidator instantiates', () => {
        compilationValidator = new CompilationValidator();
        if (!compilationValidator) throw new Error('CompilationValidator is null');
    });

    // Test 3: Bundler instantiation
    let assembler;
    test('Bundler: SkillAssembler instantiates', () => {
        assembler = new SkillAssembler();
        if (!assembler) throw new Error('SkillAssembler is null');
    });

    // Test 4: Version fetching
    let version;
    test('Parser: Fetches latest version', async () => {
        version = await parser.fetchLatestVersion();
        if (!version || !version.match(/^\d+\.\d+\.\d+$/)) {
            throw new Error(`Invalid version format: ${version}`);
        }
    });

    // Test 5: Metadata validation (skills.sh format)
    const metadata = {
        name: 'test-skill',
        description: 'Test skill for E2E validation pipeline',
        version: '1.0.0',
        language: 'solidity',
        provider: 'openzeppelin',
    };

    test('Validation: Metadata passes schema validation', () => {
        const valid = schemaValidator.validate(metadata);
        if (!valid) throw new Error('Schema validation failed');
    });

    // Test 6: SKILL.md generation with sample data
    const sampleEntries = [
        {
            name: 'ERC20',
            description: 'Standard token interface',
            category: 'Token Standards',
            examples: ['contract MyToken is ERC20 { }'],
            functions: ['transfer', 'approve', 'balanceOf'],
        }
    ];

    let skillMd;
    test('Bundler: Assembles SKILL.md from entries', () => {
        skillMd = assembler.assemble(sampleEntries, metadata);
        if (!skillMd || skillMd.length === 0) {
            throw new Error('Generated SKILL.md is empty');
        }
    });

    // Test 7: YAML frontmatter format (skills.sh requirement)
    test('Format: SKILL.md has valid YAML frontmatter', () => {
        if (!skillMd.startsWith('---')) {
            throw new Error('Missing YAML frontmatter opening');
        }
        const parts = skillMd.split('---');
        if (parts.length < 3) {
            throw new Error('Invalid YAML frontmatter structure');
        }
        const frontmatter = parts[1];
        if (!frontmatter.includes('name:')) throw new Error('Missing name field');
        if (!frontmatter.includes('description:')) throw new Error('Missing description field');
        if (!frontmatter.includes('version:')) throw new Error('Missing version field');
    });

    // Test 8: Token limit compliance
    test('Optimization: Token count under 5000 limit', () => {
        const tokenCount = assembler.countTokens(skillMd);
        if (tokenCount > 5000) {
            throw new Error(`Token count ${tokenCount} exceeds 5000 limit`);
        }
    });

    // Test 9: Compilation validation
    test('Validation: Solidity code compiles', async () => {
        const compilationValid = await compilationValidator.validateSkillMarkdown(skillMd);
        if (!compilationValid) {
            throw new Error('Compilation validation failed');
        }
    });

    // Test 10: Check generated SKILL.md file exists
    const skillPath = path.join(process.cwd(), 'skills', 'solidity', 'openzeppelin', `v${version}`, 'SKILL.md');
    test('File: Generated SKILL.md exists on disk', () => {
        if (!fs.existsSync(skillPath)) {
            throw new Error(`SKILL.md not found at ${skillPath}`);
        }
    });

    // Test 11: Verify skills.sh format compliance
    test('Format: Matches skills.sh standard structure', () => {
        const generatedSkill = fs.readFileSync(skillPath, 'utf-8');

        // Must have YAML frontmatter
        if (!generatedSkill.match(/^---\n[\s\S]+?\n---\n/)) {
            throw new Error('Invalid YAML frontmatter format');
        }

        // Must have markdown headings
        if (!generatedSkill.includes('# ')) {
            throw new Error('Missing markdown headings');
        }

        // Must have code blocks
        if (!generatedSkill.includes('```solidity')) {
            throw new Error('Missing Solidity code blocks');
        }
    });

    // Test 12: Package structure validation
    const packagePath = path.join(process.cwd(), 'packages', 'skills-solidity', 'package.json');
    test('Package: skills-solidity package.json exists', () => {
        if (!fs.existsSync(packagePath)) {
            throw new Error('skills-solidity package.json not found');
        }
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
        if (pkg.name !== '@hyperkitlab/skills-solidity') {
            throw new Error(`Wrong package name: ${pkg.name}`);
        }
    });

    // Results summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 E2E Test Results Summary');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${results.passed + results.failed}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

    if (results.failed > 0) {
        console.log('\n❌ Failed Tests:');
        results.tests.filter(t => t.status.includes('FAIL')).forEach(t => {
            console.log(`  - ${t.name}: ${t.error}`);
        });
    }

    console.log('\n' + '='.repeat(50));

    return results.failed === 0;
}

// Run if called directly
if (require.main === module) {
    runE2ETest()
        .then(success => {
            if (success) {
                console.log('\n🎉 ALL E2E TESTS PASSED!');
                process.exit(0);
            } else {
                console.log('\n❌ SOME E2E TESTS FAILED');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('❌ E2E Test Error:', error);
            process.exit(1);
        });
}

module.exports = { runE2ETest };
