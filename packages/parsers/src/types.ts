// Type definitions for parsers package
export interface ParsedDoc {
  provider: string;
  version: string;
  entries: DocEntry[];
  lastSync: string;
}

export interface DocEntry {
  name: string;
  description: string;
  examples: string[];
  functions: string[];
  category: string;
}

import { Cache } from './cache/Cache';

export interface ParserOptions {
  cacheEnabled?: boolean;
  cacheTTL?: number;
  timeout?: number;
  cache?: Cache;
}
