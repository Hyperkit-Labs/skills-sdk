import solc from 'solc';

export class CompilationValidator {
  async validateSolidityExamples(codeBlocks: string[]): Promise<boolean> {
    let allValid = true;

    for (const code of codeBlocks) {
      const isValid = await this.compileSolidity(code);
      if (!isValid) {
        allValid = false;
        console.error(`Solidity compilation failed for code block`);
      }
    }

    return allValid;
  }

  private async compileSolidity(code: string): Promise<boolean> {
    try {
      // Prepare input for solc compiler
      const input = {
        language: 'Solidity',
        sources: {
          'contract.sol': {
            content: code,
          },
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*'],
            },
          },
        },
      };

      // Compile
      const output = JSON.parse(solc.compile(JSON.stringify(input)));

      // Check for errors
      if (output.errors) {
        const errors = output.errors.filter(
          (error: { severity: string }) => error.severity === 'error'
        );

        if (errors.length > 0) {
          console.error('Compilation errors:', errors);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Solidity compilation exception:', error);
      return false;
    }
  }

  extractCodeBlocks(markdown: string): string[] {
    // Extract fenced code blocks with solidity language
    const codeBlockRegex = /```solidity\n([\s\S]*?)```/g;
    const blocks: string[] = [];
    let match;

    while ((match = codeBlockRegex.exec(markdown)) !== null) {
      if (match[1]) {
        blocks.push(match[1]);
      }
    }

    return blocks;
  }

  async validateSkillMarkdown(markdown: string): Promise<boolean> {
    const codeBlocks = this.extractCodeBlocks(markdown);

    if (codeBlocks.length === 0) {
      console.warn('No Solidity code blocks found in markdown');
      return true; // Not an error if no code blocks
    }

    return this.validateSolidityExamples(codeBlocks);
  }
}
