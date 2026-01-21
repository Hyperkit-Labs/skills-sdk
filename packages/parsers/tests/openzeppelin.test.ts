import { OpenZeppelinParser } from '../src/openzeppelin/OpenZeppelinParser';

describe('OpenZeppelinParser', () => {
  let parser: OpenZeppelinParser;

  beforeEach(() => {
    parser = new OpenZeppelinParser();
  });

  describe('fetchLatestVersion', () => {
    it('should fetch the latest version from GitHub', async () => {
      const version = await parser.fetchLatestVersion();
      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
      expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    }, 10000);

    it('should return fallback version on error', async () => {
      const version = await parser.fetchLatestVersion();
      expect(version).toBeDefined();
    });
  });

  describe('extractContracts', () => {
    it('should extract contract entries from OpenZeppelin docs', async () => {
      const entries = await parser.extractContracts();
      expect(Array.isArray(entries)).toBe(true);
      if (entries.length > 0) {
        expect(entries[0]).toHaveProperty('name');
        expect(entries[0]).toHaveProperty('description');
        expect(entries[0]).toHaveProperty('examples');
        expect(entries[0]).toHaveProperty('functions');
        expect(entries[0]).toHaveProperty('category');
      }
    }, 30000);

    it('should handle errors gracefully', async () => {
      const entries = await parser.extractContracts('http://invalid-url.com');
      expect(Array.isArray(entries)).toBe(true);
      expect(entries.length).toBe(0);
    });
  });

  describe('categorize', () => {
    it('should categorize Access Control contracts', () => {
      expect(parser.categorize('AccessControl')).toBe('Access Control');
      expect(parser.categorize('Ownable')).toBe('Access Control');
    });

    it('should categorize ERC20 contracts', () => {
      expect(parser.categorize('ERC20')).toBe('Token Standards');
      expect(parser.categorize('MyToken')).toBe('Token Standards');
    });

    it('should categorize NFT contracts', () => {
      expect(parser.categorize('ERC721')).toBe('NFT Standards');
      expect(parser.categorize('ERC1155')).toBe('NFT Standards');
    });

    it('should categorize Upgradeable contracts', () => {
      expect(parser.categorize('UUPSUpgradeable')).toBe('Upgradeable');
      expect(parser.categorize('Proxy')).toBe('Upgradeable');
    });

    it('should return Utilities for unknown contracts', () => {
      expect(parser.categorize('Unknown')).toBe('Utilities');
    });
  });
});
