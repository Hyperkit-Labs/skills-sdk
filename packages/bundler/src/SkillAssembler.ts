import Mustache from 'mustache';
// @ts-ignore - js-tiktoken may not have types
import { encoding_for_model } from 'js-tiktoken';

export interface SkillMetadata {
  name: string;
  description: string;
  version: string;
  language: string;
  providers: string | string[];
  last_sync: string;
}

export interface SkillPattern {
  name: string;
  description: string;
  examples?: string[];
}

export interface SkillExample {
  language: string;
  code: string;
  description?: string;
}

export class SkillAssembler {
  private readonly maxTokens = 5000;
  private readonly template = `---
name: {{name}}
description: {{description}}
version: {{version}}
language: {{language}}
providers: {{providers}}
last_sync: {{last_sync}}
---

# {{title}}

## Instructions
{{instructions}}

### Core Patterns
{{#patterns}}
- **{{name}}**: {{description}}
{{/patterns}}

### Code Examples
{{#examples}}
\`\`\`{{language}}
{{code}}
\`\`\`
{{#description}}
*{{description}}*
{{/description}}

{{/examples}}

## Reference
[Full API Documentation]({{reference_url}})
`;

  assemble(entries: unknown[], metadata: SkillMetadata): string {
    // Transform entries into patterns and examples
    const patterns = this.extractPatterns(entries);
    const examples = this.extractExamples(entries);

    const data = {
      name: metadata.name,
      description: metadata.description,
      version: metadata.version,
      language: metadata.language,
      providers: Array.isArray(metadata.providers)
        ? metadata.providers.join(', ')
        : metadata.providers,
      last_sync: metadata.last_sync || new Date().toISOString(),
      title: this.generateTitle(metadata),
      instructions: this.generateInstructions(metadata),
      patterns: patterns.slice(0, 10), // Limit to prevent token overflow
      examples: examples.slice(0, 5), // Limit examples
      reference_url: this.generateReferenceUrl(metadata),
    };

    let rendered = Mustache.render(this.template, data);

    // Check token count and trim if necessary
    const tokenCount = this.countTokens(rendered);

    if (tokenCount > this.maxTokens) {
      console.warn(`Skill exceeds ${this.maxTokens} tokens (${tokenCount}). Trimming...`);
      rendered = this.trimToTokenLimit(rendered, data as Record<string, unknown>);
    }

    return rendered;
  }

  private extractPatterns(entries: unknown[]): SkillPattern[] {
    // Type assertion for known structure from parsers
    interface DocEntry {
      name: string;
      description: string;
      category: string;
      examples?: string[];
    }

    const docs = entries as DocEntry[];
    return docs.map((entry) => ({
      name: entry.name,
      description: entry.description,
      examples: entry.examples,
    }));
  }

  private extractExamples(entries: unknown[]): SkillExample[] {
    interface DocEntry {
      name: string;
      examples: string[];
      category: string;
    }

    const docs = entries as DocEntry[];
    const examples: SkillExample[] = [];

    for (const entry of docs) {
      if (entry.examples && entry.examples.length > 0 && entry.examples[0]) {
        examples.push({
          language: 'solidity',
          code: entry.examples[0],
          description: `Example from ${entry.name}`,
        });
      }
    }

    return examples;
  }

  private generateTitle(metadata: SkillMetadata): string {
    const provider = Array.isArray(metadata.providers)
      ? (metadata.providers[0] ?? 'unknown')
      : metadata.providers;

    return `${provider.charAt(0).toUpperCase() + provider.slice(1)} ${metadata.language.toUpperCase()} v${metadata.version}`;
  }

  private generateInstructions(metadata: SkillMetadata): string {
    return `Use this skill when working with ${metadata.language} contracts and ${metadata.providers} patterns. This skill provides validated code examples and best practices for building secure smart contracts.`;
  }

  private generateReferenceUrl(metadata: SkillMetadata): string {
    const provider = Array.isArray(metadata.providers)
      ? (metadata.providers[0] ?? 'unknown')
      : metadata.providers;

    const urls: Record<string, string> = {
      openzeppelin: `https://docs.openzeppelin.com/contracts/${metadata.version}/`,
      alchemy: 'https://docs.alchemy.com/',
      thirdweb: 'https://portal.thirdweb.com/',
    };

    return urls[provider.toLowerCase()] || '#';
  }

  countTokens(content: string): number {
    try {
      const encoding = encoding_for_model('gpt-4');
      const tokens = encoding.encode(content);
      encoding.free();
      return tokens.length;
    } catch (_error) {
      // Fallback: rough estimation (1 token ≈ 4 characters)
      return Math.ceil(content.length / 4);
    }
  }

  private trimToTokenLimit(_content: string, data: Record<string, unknown>): string {
    // Progressive trimming strategy:
    // 1. Reduce examples
    // 2. Reduce patterns
    // 3. Truncate descriptions

    const trimmedData = { ...data } as Record<string, unknown> & {
      patterns?: SkillPattern[];
      examples?: SkillExample[];
    };

    // Reduce examples first
    if (trimmedData.examples && Array.isArray(trimmedData.examples)) {
      trimmedData.examples = trimmedData.examples.slice(0, 3);
    }
    let rendered = Mustache.render(this.template, trimmedData);

    if (this.countTokens(rendered) <= this.maxTokens) {
      return rendered;
    }

    // Reduce patterns
    if (trimmedData.patterns && Array.isArray(trimmedData.patterns)) {
      trimmedData.patterns = trimmedData.patterns.slice(0, 5);
    }
    rendered = Mustache.render(this.template, trimmedData);

    return rendered;
  }

  splitLargeSkill(
    _content: string,
    _metadata: SkillMetadata
  ): {
    main: string;
    references: string[];
  } {
    // For very large skills, split into main file + reference files
    return {
      main: _content,
      references: [],
    };
  }
}
