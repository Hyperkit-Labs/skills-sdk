import Ajv from 'ajv';

export interface SkillMetadata {
  name: string;
  description: string;
  version?: string;
  language?: string;
  providers?: string | string[];
  last_sync?: string;
}

export class SchemaValidator {
  private ajv: Ajv;
  private schema: any; // Using any to avoid strict type checking issues

  constructor() {
    this.ajv = new Ajv({ allErrors: true, strict: false });

    this.schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          pattern: '^[a-z0-9-]+$',
          minLength: 1,
          maxLength: 100,
        },
        description: {
          type: 'string',
          minLength: 10,
          maxLength: 200,
        },
        version: {
          type: 'string',
          pattern: '^\\d+\\.\\d+\\.\\d+$',
        },
        language: {
          type: 'string',
          enum: ['solidity', 'move', 'typescript', 'rust'],
        },
        providers: {
          anyOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
        },
        last_sync: {
          type: 'string',
          // Removed format: 'date-time' to avoid needing ajv-formats plugin
        },
      },
      required: ['name', 'description'],
      additionalProperties: true,
    };
  }

  validate(skillData: unknown): boolean {
    const validate = this.ajv.compile(this.schema);
    const valid = validate(skillData);

    if (!valid) {
      console.error('Schema validation errors:', validate.errors);
    }

    return valid;
  }

  getErrors(): string[] {
    const validate = this.ajv.compile(this.schema);
    return (validate.errors || []).map((err) => {
      return `${err.instancePath} ${err.message}`;
    });
  }

  validateYAMLFrontmatter(frontmatter: string): boolean {
    try {
      // Parse YAML frontmatter (simple key: value pairs)
      const lines = frontmatter
        .split('\n')
        .filter((line) => line.trim() && !line.startsWith('---'));
      const data: Record<string, unknown> = {};

      for (const line of lines) {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          data[key.trim()] = valueParts.join(':').trim();
        }
      }

      return this.validate(data);
    } catch (error) {
      console.error('Failed to parse YAML frontmatter:', error);
      return false;
    }
  }
}
