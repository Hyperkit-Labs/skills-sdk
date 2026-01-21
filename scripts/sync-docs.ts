// Daily sync script - checks for doc updates and regenerates SKILL.md files
import { OpenZeppelinParser } from '@hyperkitlab/skills-parsers';
import { generateOpenZeppelinSkill } from './generate-openzeppelin-skill';
import * as fs from 'fs';
import * as path from 'path';

interface VersionCache {
  [provider: string]: string;
}

const CACHE_FILE = path.join(process.cwd(), '.version-cache.json');

async function loadVersionCache(): Promise<VersionCache> {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Failed to load version cache:', error);
  }
  return {};
}

async function saveVersionCache(cache: VersionCache): Promise<void> {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}

async function syncAll() {
  console.log('🔄 Starting daily sync...\n');

  const cache = await loadVersionCache();
  const updatedProviders: string[] = [];

  // Check OpenZeppelin
  const ozParser = new OpenZeppelinParser();
  const latestVersion = await ozParser.fetchLatestVersion();
  const cachedVersion = cache['openzeppelin'];

  if (latestVersion !== cachedVersion) {
    console.log(
      `📦 OpenZeppelin version change detected: ${cachedVersion || 'none'} → ${latestVersion}`
    );
    await generateOpenZeppelinSkill();
    cache['openzeppelin'] = latestVersion;
    updatedProviders.push('openzeppelin');
  } else {
    console.log(`✅ OpenZeppelin up-to-date (v${latestVersion})`);
  }

  // Save updated cache
  await saveVersionCache(cache);

  // Summary
  console.log(`\n📊 Sync complete:`);
  console.log(`   - Providers checked: 1`);
  console.log(`   - Updates found: ${updatedProviders.length}`);
  if (updatedProviders.length > 0) {
    console.log(`   - Updated: ${updatedProviders.join(', ')}`);
  }

  return updatedProviders;
}

if (require.main === module) {
  syncAll().catch((error) => {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  });
}

export { syncAll };
