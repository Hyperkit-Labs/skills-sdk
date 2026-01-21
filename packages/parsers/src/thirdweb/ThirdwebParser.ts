import { Parser, DocEntry } from '../base/Parser';
import { ParserOptions } from '../types';

export class ThirdwebParser implements Parser {
    // Phase 4: Static Definitions (Fallback for complex Next.js docs without browser access)
    private readonly staticDefinitions: DocEntry[] = [
        // --- SDK Core ---
        {
            name: 'thirdweb_getContract',
            description: 'Connect to a smart contract using the Thirdweb SDK.',
            category: 'SDK Core',
            functions: ['getContract({ client, chain, address })'],
            examples: [`
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

const contract = getContract({
  client,
  chain: defineChain(1),
  address: "0x...",
});`]
        },
        // --- ERC721 ---
        {
            name: 'thirdweb_erc721_mint',
            description: 'Mint an NFT to a specific address (ERC721).',
            category: 'ERC721',
            functions: ['mintTo({ contract, to, nft })'],
            examples: [`
import { mintTo } from "thirdweb/extensions/erc721";

const transaction = await mintTo({
  contract,
  to: "0x...",
  nft: {
    name: "My NFT",
    description: "This is my NFT",
    image: "https://example.com/image.png",
  },
});`]
        },
        // --- ERC20 ---
        {
            name: 'thirdweb_erc20_transfer',
            description: 'Transfer tokens (ERC20).',
            category: 'ERC20',
            functions: ['transfer({ contract, to, amount })'],
            examples: [`
import { transfer } from "thirdweb/extensions/erc20";

const transaction = await transfer({
  contract,
  to: "0x...",
  amount: 100,
});`]
        },
        // --- Account Abstraction ---
        {
            name: 'thirdweb_smartWallet',
            description: 'Connect a Smart Wallet (Account Abstraction).',
            category: 'Wallets',
            functions: ['smartWallet(config)'],
            examples: [`
import { smartWallet } from "thirdweb/wallets";

const wallet = smartWallet({
  chain: defineChain(1),
  gasless: true,
});`]
        }
    ];

    constructor(private options: ParserOptions = {}) { }

    async fetchLatestVersion(): Promise<string> {
        return 'v5.0.0'; // Thirdweb SDK v5
    }

    async extractDocs(_url?: string): Promise<DocEntry[]> {
        const cacheKey = 'thirdweb:docs';

        if (this.options.cache) {
            const cached = await this.options.cache.get(cacheKey);
            if (cached) {
                try {
                    return JSON.parse(cached);
                } catch (e) { /* ignore */ }
            }
        }

        // Use static definitions
        const entries = this.staticDefinitions;

        if (this.options.cache) {
            await this.options.cache.set(cacheKey, JSON.stringify(entries), this.options.cacheTTL || 86400);
        }

        return entries;
    }

    categorize(methodName: string): string {
        if (methodName.includes('erc721')) return 'ERC721';
        if (methodName.includes('erc20')) return 'ERC20';
        if (methodName.includes('Wallet')) return 'Wallets';
        return 'SDK Core';
    }
}
