import { SchemaValidator } from '../src/SchemaValidator';
import { CompilationValidator } from '../src/CompilationValidator';
import { AgentValidator } from '../src/AgentValidator';

describe('Validators', () => {
  describe('SchemaValidator', () => {
    let validator: SchemaValidator;

    beforeEach(() => {
      validator = new SchemaValidator();
    });

    it('should validate correct skill metadata', () => {
      const validData = {
        name: 'openzeppelin-solidity-v5',
        description: 'OpenZeppelin Contracts for Solidity - AccessControl, Tokens, Upgrades',
        version: '5.0.2',
        language: 'solidity',
        providers: 'openzeppelin',
      };

      expect(validator.validate(validData)).toBe(true);
    });

    it('should reject invalid name format', () => {
      const invalidData = {
        name: 'Invalid Name With Spaces',
        description: 'Valid description here that is long enough',
      };

      expect(validator.validate(invalidData)).toBe(false);
    });

    it('should reject short descriptions', () => {
      const invalidData = {
        name: 'valid-name',
        description: 'Too short',
      };

      expect(validator.validate(invalidData)).toBe(false);
    });

    it('should reject invalid version format', () => {
      const invalidData = {
        name: 'valid-name',
        description: 'Valid description that is long enough for requirements',
        version: 'invalid',
      };

      expect(validator.validate(invalidData)).toBe(false);
    });
  });

  describe('CompilationValidator', () => {
    let validator: CompilationValidator;

    beforeEach(() => {
      validator = new CompilationValidator();
    });

    it('should validate correct Solidity code', async () => {
      const validCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 value;
    
    function setValue(uint256 _value) public {
        value = _value;
    }
}
      `;

      const result = await validator.validateSolidityExamples([validCode]);
      expect(result).toBe(true);
    });

    it('should reject invalid Solidity code', async () => {
      const invalidCode = `
pragma solidity ^0.8.20;
contract Invalid {
    function() { // Syntax error
        invalid syntax here
    }
}
      `;

      const result = await validator.validateSolidityExamples([invalidCode]);
      expect(result).toBe(false);
    });

    it('should extract code blocks from markdown', () => {
      const markdown = `
# Example

\`\`\`solidity
contract Test {
    uint256 value;
}
\`\`\`

Some text

\`\`\`solidity
contract Test2 {
    string name;
}
\`\`\`
      `;

      const blocks = validator.extractCodeBlocks(markdown);
      expect(blocks.length).toBe(2);
    });
  });

  describe('AgentValidator', () => {
    let validator: AgentValidator;

    beforeEach(() => {
      validator = new AgentValidator();
    });

    it('should have default test prompts', () => {
      const prompts = validator.getDefaultTestPrompts();
      expect(prompts.length).toBeGreaterThan(0);
    });

    it('should allow adding custom prompts', () => {
      const initialCount = validator.getDefaultTestPrompts().length;
      validator.addTestPrompt('Create a custom contract');
      expect(validator.getDefaultTestPrompts().length).toBe(initialCount + 1);
    });

    it('should return test results', async () => {
      const results = await validator.testWithPrompts('/stub/path', ['Test prompt']);
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(1);
      expect(results[0]).toHaveProperty('success');
      expect(results[0]).toHaveProperty('prompt');
      expect(results[0]).toHaveProperty('executionTime');
    });
  });
});
