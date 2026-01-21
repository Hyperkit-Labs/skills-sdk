// Base Parser interface - to be implemented by provider-specific parsers
export interface Parser {
  fetchLatestVersion(): Promise<string>;
  extractContracts(url: string): Promise<DocEntry[]>;
}

export interface DocEntry {
  name: string;
  description: string;
  examples: string[];
  functions: string[];
  category: string;
}
