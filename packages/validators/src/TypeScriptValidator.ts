import * as ts from 'typescript';

export class TypeScriptValidator {
    /**
     * Validates that the provided code snippet is valid TypeScript/JavaScript syntax.
     * Uses ts.transpileModule to check for parsing errors.
     */
    validate(code: string): boolean {
        try {
            // Wrap code in an async function to allow top-level verify
            // validation of 'await' usage which is common in documentation examples.
            const wrappedCode = `async function _validate_wrapper() { ${code} }`;

            const result = ts.transpileModule(wrappedCode, {
                compilerOptions: {
                    noEmit: true,
                    target: ts.ScriptTarget.ESNext,
                    module: ts.ModuleKind.CommonJS
                },
                reportDiagnostics: true
            });

            if (result.diagnostics && result.diagnostics.length > 0) {
                // Log diagnostics if needed
                // console.error(result.diagnostics);
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Validates a full SKILL.md content by parsing out code blocks
     */
    validateSkillMarkdown(content: string): boolean {
        const codeBlocks = this.extractCodeBlocks(content);
        if (codeBlocks.length === 0) return true; // No code, technically valid (or warning)

        let allValid = true;
        for (const code of codeBlocks) {
            if (!this.validate(code)) {
                allValid = false;
                // console.warn('Invalid code block:', code.substring(0, 50) + '...');
            }
        }
        return allValid;
    }

    private extractCodeBlocks(markdown: string): string[] {
        const regex = /```(javascript|typescript|js|ts)\n([\s\S]*?)```/g;
        const blocks: string[] = [];
        let match;
        while ((match = regex.exec(markdown)) !== null) {
            if (match[2]) {
                blocks.push(match[2]);
            }
        }
        return blocks;
    }
}
