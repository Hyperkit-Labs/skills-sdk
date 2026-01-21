import { SuiParser } from '../packages/parsers/dist/move/SuiParser';
import { RedisCache } from '../packages/parsers/dist/cache/RedisCache';
import { SchemaValidator } from '../packages/validators/dist/SchemaValidator';
import { SkillAssembler } from '../packages/bundler/dist/SkillAssembler';
import * as fs from 'fs';
import * as path from 'path';

async function generateSuiSkill() {
    console.log('🚀 Starting Sui Move SKILL.md generation...\n');

    console.log('📖 Parsing Sui documentation...');

    const cache = new RedisCache();
    const parser = new SuiParser({ cache });

    const version = (await parser.fetchLatestVersion()).trim();
    const versionClean = version.replace('framework-v', '');
    console.log(`   Version: ${version}`);

    const entries = await parser.extractDocs();
    console.log(`   Extracted ${entries.length} Move entries\n`);

    console.log('📝 Assembling SKILL.md...');
    const assembler = new SkillAssembler();
    const metadata = {
        name: `sui-move-${versionClean.replace(/\./g, '-')}`,
        description: 'Sui Move Framework - Objects, Coins, Transfers',
        version: versionClean,
        language: 'move',
        providers: 'sui',
        last_sync: new Date().toISOString(),
    };

    const skillMd = assembler.assemble(entries, metadata);
    const tokenCount = assembler.countTokens(skillMd);
    console.log(`   Token count: ${tokenCount} / 5000\n`);

    console.log('✅ Validating SKILL.md...');

    const schemaValidator = new SchemaValidator();
    const schemaValid = schemaValidator.validate(metadata);
    console.log(`   Schema validation: ${schemaValid ? '✓' : '✗'}`);

    // Note: Skipping Code Validation for Move as TS Validator is not compatible.

    console.log(`Debug: Clean Version '${versionClean}'`);

    // Step 4: Write to file
    const outputDir = path.join(process.cwd(), 'skills', 'move', 'sui', `v${versionClean}`);
    fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, 'SKILL.md');
    fs.writeFileSync(outputPath, skillMd, 'utf-8');
    console.log(`✨ SKILL.md generated successfully!`);
    console.log(`   Output: ${outputPath}\n`);

    await cache.disconnect();
}

if (require.main === module) {
    generateSuiSkill().catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
}

export { generateSuiSkill };
