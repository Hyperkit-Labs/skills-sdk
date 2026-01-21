import * as cheerio from 'cheerio';
import { fetch } from 'undici';
import { Parser, DocEntry } from '../base/Parser';

export class OpenZeppelinParser implements Parser {
  private readonly baseUrl = 'https://docs.openzeppelin.com/contracts/5.x';
  private readonly githubApiUrl =
    'https://api.github.com/repos/OpenZeppelin/openzeppelin-contracts/releases/latest';

  async fetchLatestVersion(): Promise<string> {
    try {
      const response = await fetch(this.githubApiUrl);
      const data = (await response.json()) as { tag_name: string };
      return data.tag_name.replace('v', '');
    } catch (error) {
      console.error('Failed to fetch latest OpenZeppelin version:', error);
      return '5.0.2'; // Fallback version
    }
  }

  async extractContracts(_url?: string): Promise<DocEntry[]> {

    const entries: DocEntry[] = [];

    try {
      // Fetch the main documentation page
      // const response = await fetch(targetUrl);
      // const _html = await response.text();
      // cheerio.load(_html); // Removed: not currently used, will be needed in Phase 3

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
