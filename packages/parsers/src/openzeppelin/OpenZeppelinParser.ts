import * as cheerio from 'cheerio';
import { fetch } from 'undici';
import { Parser, DocEntry } from '../base/Parser';
import { ParserOptions } from '../types';

export class OpenZeppelinParser implements Parser {
  private readonly baseUrl = 'https://docs.openzeppelin.com/contracts/5.x';
  private readonly githubApiUrl =
    'https://api.github.com/repos/OpenZeppelin/openzeppelin-contracts/releases/latest';

  constructor(private options: ParserOptions = {}) { }

  async fetchLatestVersion(): Promise<string> {
    const cacheKey = 'openzeppelin:version';

    if (this.options.cache) {
      const cached = await this.options.cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await fetch(this.githubApiUrl);
      const data = (await response.json()) as { tag_name: string };
      const version = data.tag_name.replace('v', '');

      if (this.options.cache) {
        await this.options.cache.set(cacheKey, version, this.options.cacheTTL || 3600);
      }
      return version;
    } catch (error) {
      console.error('Failed to fetch latest OpenZeppelin version:', error);
      return '5.0.2'; // Fallback version
    }
  }

  async extractDocs(_url?: string): Promise<DocEntry[]> {
    const cacheKey = 'openzeppelin:docs';

    if (this.options.cache) {
      const cached = await this.options.cache.get(cacheKey);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.warn('Cache parse error, re-fetching');
        }
      }
    }

    const entries: DocEntry[] = [];

    try {
      // Extract contract documentation sections
      const categories = {
        'Access Control': `${this.baseUrl}/access-control`,
        'Token Standards': `${this.baseUrl}/erc20`,
        'NFT Standards': `${this.baseUrl}/erc721`,
        Upgradeable: `${this.baseUrl}/upgradeable`,
      };

      for (const [category, categoryUrl] of Object.entries(categories)) {
        const categoryEntries = await this.extractCategoryContracts(categoryUrl, category);
        entries.push(...categoryEntries);
      }

      if (this.options.cache && entries.length > 0) {
        await this.options.cache.set(cacheKey, JSON.stringify(entries), this.options.cacheTTL || 86400); // 24h cache
      }

      return entries;
    } catch (error) {
      console.error('Failed to extract OpenZeppelin contracts:', error);
      return [];
    }
  }

  private async extractCategoryContracts(url: string, category: string): Promise<DocEntry[]> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      const entries: DocEntry[] = [];

      // Extract code examples
      $('pre code.language-solidity').each((_, element) => {
        const code = $(element).text();
        const contractName = this.extractContractName(code);

        if (contractName) {
          // Find description (previous heading or paragraph)
          const description =
            $(element).closest('div').prevAll('p').first().text().trim() || 'OpenZeppelin contract';

          entries.push({
            name: contractName,
            description,
            examples: [code],
            functions: this.extractFunctions(code),
            category,
          });
        }
      });

      return entries;
    } catch (error) {
      console.error(`Failed to extract category ${category}:`, error);
      return [];
    }
  }

  private extractContractName(code: string): string | null {
    const match = code.match(/contract\s+(\w+)/);
    return match?.[1] ?? null;
  }

  private extractFunctions(code: string): string[] {
    const functionRegex = /function\s+(\w+)\s*\([^)]*\)/g;
    const functions: string[] = [];
    let match;

    while ((match = functionRegex.exec(code)) !== null) {
      if (match[1]) {
        functions.push(match[1]);
      }
    }

    return functions;
  }

  categorize(name: string): string {
    if (/Access|Role|Ownable/.test(name)) return 'Access Control';
    if (/ERC20|Token/.test(name)) return 'Token Standards';
    if (/ERC721|ERC1155|NFT/.test(name)) return 'NFT Standards';
    if (/Upgradeable|Proxy|UUPS/.test(name)) return 'Upgradeable';
    return 'Utilities';
  }
}
