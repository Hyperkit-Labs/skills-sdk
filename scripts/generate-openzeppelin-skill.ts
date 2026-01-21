// Integration script: Parse OpenZeppelin docs → Validate in Skill.md
import { OpenZeppelinParser } from '../packages/parsers/dist/openzeppelin/OpenZeppelinParser';
import { SchemaValidator } from '../packages/validators/dist/SchemaValidator';
import { CompilationValidator } from '../packages/validators/dist/CompilationValidator';
import { SkillAssembler } from '../packages/bundler/dist/SkillAssembler';
import * as fs from 'fs';
import * as path from 'path';

async function generateOpenZeppelinSkill() {
  console.log('🚀 Starting OpenZeppelin SKILL.md generation...\n');

  // Step 1: Parse OpenZeppelin docs
  console.log('📖 Parsing OpenZeppelin documentation...');
  const parser = new OpenZeppelinParser();
  const version = await parser.fetchLatestVersion();
  console.log(`   Version: ${version}`);

  const entries = await parser.extractDocs();
  console.log(`   Extracted ${entries.length} contract entries\n`);

  // Step 2: Assemble SKILL.md
  console.log('📝 Assembling SKILL.md...');
  const assembler = new SkillAssembler();
  const metadata = {
    name: `openzeppelin-solidity-v${version.replace(/\./g, '-')}`,
    description: 'OpenZeppelin Contracts for Solidity - AccessControl, Tokens, NFTs, Upgrades',
    version,
    language: 'solidity',
    providers: 'openzeppelin',
    last_sync: new Date().toISOString(),
  };

  const skillMd = assembler.assemble(entries, metadata);
  const tokenCount = assembler.countTokens(skillMd);
  console.log(`   Token count: ${tokenCount} / 5000\n`);

  // Step 3: Validate
  console.log('✅ Validating SKILL.md...');

  const schemaValidator = new SchemaValidator();
  const schemaValid = schemaValidator.validate(metadata);
  console.log(`   Schema validation: ${schemaValid ? '✓' : '✗'}`);

  const compilationValidator = new CompilationValidator();
  const compilationValid = await compilationValidator.validateSkillMarkdown(skillMd);
  console.log(`   Compilation validation: ${compilationValid ? '✓' : '✗'}\n`);

  // Step 4: Write to file
  const outputDir = path.join(process.cwd(), 'skills', 'solidity', 'openzeppelin', `v${version}`);
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, 'SKILL.md');
  fs.writeFileSync(outputPath, skillMd, 'utf-8');
  console.log(`✨ SKILL.md generated successfully!`);
  console.log(`   Output: ${outputPath}\n`);

  // Summary
  console.log('📊 Summary:');
  console.log(`   - Entries: ${entries.length}`);
  console.log(`   - Token count: ${tokenCount}`);
  console.log(`   - Schema valid: ${schemaValid}`);
  console.log(`   - Code valid: ${compilationValid}`);
  console.log(`   - File: ${outputPath}`);
}

// Run if called directly
if (require.main === module) {
  generateOpenZeppelinSkill().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export { generateOpenZeppelinSkill };
