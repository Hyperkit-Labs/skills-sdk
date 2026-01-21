import { ThirdwebParser } from '../packages/parsers/dist/thirdweb/ThirdwebParser';
import { RedisCache } from '../packages/parsers/dist/cache/RedisCache';
import { SchemaValidator } from '../packages/validators/dist/SchemaValidator';
import { TypeScriptValidator } from '../packages/validators/dist/TypeScriptValidator';
import { SkillAssembler } from '../packages/bundler/dist/SkillAssembler';
import * as fs from 'fs';
import * as path from 'path';

async function generateThirdwebSkill() {
    console.log('🚀 Starting Thirdweb SKILL.md generation...\n');

    // Step 1: Parse Thirdweb docs
    console.log('📖 Parsing Thirdweb documentation...');

    const cache = new RedisCache();
    const parser = new ThirdwebParser({ cache });

    const version = await parser.fetchLatestVersion();
    const versionClean = version.replace(/^v/, '');
    console.log(`   Version: ${version}`);

    const entries = await parser.extractDocs();
    console.log(`   Extracted ${entries.length} API entries\n`);

    // Step 2: Assemble SKILL.md
    console.log('📝 Assembling SKILL.md...');
    const assembler = new SkillAssembler();
    const metadata = {
        name: `thirdweb-sdk-v${versionClean.replace(/\./g, '-')}`,
        description: 'Thirdweb SDK v5 - Connect, Contracts, Wallets',
        version: versionClean,
        language: 'typescript',
        providers: 'thirdweb',
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

    const tsValidator = new TypeScriptValidator();
    const codeValid = tsValidator.validateSkillMarkdown(skillMd);
    console.log(`   Code validation (TS): ${codeValid ? '✓' : '✗'}\n`);

    // Step 4: Write to file
    const outputDir = path.join(process.cwd(), 'skills', 'api', 'thirdweb', `v${versionClean}`);
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
    console.log(`   - Code valid: ${codeValid}`);
    console.log(`   - File: ${outputPath}`);

    await cache.disconnect();
}

if (require.main === module) {
    generateThirdwebSkill().catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
}

export { generateThirdwebSkill };
