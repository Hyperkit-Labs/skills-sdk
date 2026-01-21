import * as fs from 'fs';
import * as path from 'path';

export interface SkillPackMetadata {
  name: string;
  version: string;
  provider: string;
  language: string;
}

export async function loadSkillPack(provider: string, version?: string): Promise<string> {
  const skillsDir = path.join(__dirname, '..', 'skills', provider);

  if (!fs.existsSync(skillsDir)) {
    throw new Error(`Skills for provider "${provider}" not found`);
  }

  // Find version directory
  let versionDir: string;

  if (version) {
    versionDir = path.join(skillsDir, `v${version}`);
  } else {
    // Get latest version
    const versions = fs
      .readdirSync(skillsDir)
      .filter((dir) => dir.startsWith('v') && fs.statSync(path.join(skillsDir, dir)).isDirectory());

    if (versions.length === 0) {
      throw new Error(`No versions found for provider "${provider}"`);
    }

    // Sort and get latest
    versions.sort().reverse();
    const latestVersion = versions[0];
    if (!latestVersion) {
      throw new Error(`No valid versions found for provider "${provider}"`);
    }
    versionDir = path.join(skillsDir, latestVersion);
  }

  const skillPath = path.join(versionDir, 'SKILL.md');

  if (!fs.existsSync(skillPath)) {
    throw new Error(`SKILL.md not found at ${skillPath}`);
  }

  return fs.readFileSync(skillPath, 'utf-8');
}

export async function listAvailableSkills(): Promise<SkillPackMetadata[]> {
  const skills: SkillPackMetadata[] = [];
  const skillsBaseDir = path.join(__dirname, '..', 'skills');

  if (!fs.existsSync(skillsBaseDir)) {
    return [];
  }

  const providers = fs
    .readdirSync(skillsBaseDir)
    .filter((item) => fs.statSync(path.join(skillsBaseDir, item)).isDirectory());

  for (const provider of providers) {
    const providerDir = path.join(skillsBaseDir, provider);
    const versions = fs
      .readdirSync(providerDir)
      .filter(
        (item) => item.startsWith('v') && fs.statSync(path.join(providerDir, item)).isDirectory()
      );

    for (const versionDir of versions) {
      const version = versionDir.replace('v', '');
      skills.push({
        name: `${provider}-solidity-v${version}`,
        version,
        provider,
        language: 'solidity',
      });
    }
  }

  return skills;
}

export type { SkillPackMetadata as SkillMeta };
