import { SkillAssembler } from '../src/SkillAssembler';

// Mock js-tiktoken to avoid WASM/ESM issues in Jest
jest.mock('js-tiktoken', () => ({
  encoding_for_model: () => ({
    encode: (str: string) => {
      // Mock implementation: 1 token per 4 chars approx
      return new Array(Math.ceil(str.length / 4));
    },
    free: () => { },
  }),
}));

describe('SkillAssembler', () => {
  let assembler: SkillAssembler;

  beforeEach(() => {
    assembler = new SkillAssembler();
  });

  describe('assemble', () => {
    it('should generate valid SKILL.md format', () => {
      const entries = [
        {
          name: 'AccessControl',
          description: 'Role-based access control mechanism',
          category: 'Access Control',
          examples: ['contract MyContract is AccessControl {}'],
          functions: ['grantRole', 'revokeRole'],
        },
      ];

      const metadata = {
        name: 'openzeppelin-solidity-v5',
        description: 'OpenZeppelin Contracts for Solidity',
        version: '5.0.2',
        language: 'solidity',
        providers: 'openzeppelin',
        last_sync: '2026-01-21T00:00:00Z',
      };

      const skill = assembler.assemble(entries, metadata);

      // Check YAML frontmatter
      expect(skill).toContain('---');
      expect(skill).toContain('name: openzeppelin-solidity-v5');
      expect(skill).toContain('language: solidity');

      // Check content
      expect(skill).toContain('# OpenZeppelin SOLIDITY v5.0.2');
      expect(skill).toContain('AccessControl');
      expect(skill).toContain('```solidity');
    });

    it('should handle multiple providers', () => {
      const metadata = {
        name: 'test-skill',
        description: 'Test skill with multiple providers',
        version: '1.0.0',
        language: 'solidity',
        providers: ['openzeppelin', 'alchemy'],
        last_sync: '2026-01-21T00:00:00Z',
      };

      const skill = assembler.assemble([], metadata);
      expect(skill).toContain('providers: openzeppelin, alchemy');
    });
  });

  describe('countTokens', () => {
    it('should count tokens in content', () => {
      const content = 'This is a test content for token counting';
      const count = assembler.countTokens(content);
      expect(count).toBeGreaterThan(0);
      expect(typeof count).toBe('number');
    });

    it('should handle long content', () => {
      const longContent = 'word '.repeat(1000);
      const count = assembler.countTokens(longContent);
      expect(count).toBeGreaterThan(100);
    });
  });

  describe('token limiting', () => {
    it('should trim content exceeding token limit', () => {
      // Create a massive entry set
      const largeEntries = Array.from({ length: 100 }, (_, i) => ({
        name: `Contract${i}`,
        description: `This is a very long description for contract ${i} that goes on and on with lots of details`,
        category: 'Test',
        examples: [
          `contract Contract${i} {
            uint256 value${i};
            string name${i};
            address owner${i};
            mapping(address => uint256) balances${i};
            function setValue${i}(uint256 _value) public {}
            function getValue${i}() public view returns (uint256) {}
          }`,
        ],
        functions: [`setValue${i}`, `getValue${i}`],
      }));

      const metadata = {
        name: 'large-skill',
        description: 'A skill with many examples',
        version: '1.0.0',
        language: 'solidity',
        providers: 'test',
        last_sync: '2026-01-21T00:00:00Z',
      };

      const skill = assembler.assemble(largeEntries, metadata);
      const tokenCount = assembler.countTokens(skill);

      // Should be under or at the limit
      expect(tokenCount).toBeLessThanOrEqual(5500); // Allow small margin
    });
  });
});
