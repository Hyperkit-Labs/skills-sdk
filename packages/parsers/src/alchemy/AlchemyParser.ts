// import { fetch } from 'undici';
import { Parser, DocEntry } from '../base/Parser';
import { ParserOptions } from '../types';

export class AlchemyParser implements Parser {
    // Phase 3: Static Definitions (Fallback for restricted environments)
    // In a full production env with Playwright/Network access, we would scrape or fetch OpenRPC.
    private readonly staticDefinitions: DocEntry[] = [
        // --- Core API ---
        {
            name: 'eth_getBalance',
            description: 'Returns the balance of the account of given address.',
            category: 'Core',
            functions: ['eth_getBalance(address: string, block: string)'],
            examples: ['const balance = await alchemy.core.getBalance("0x...");']
        },
        {
            name: 'eth_blockNumber',
            description: 'Returns the number of the most recent block.',
            category: 'Core',
            functions: ['eth_blockNumber()'],
            examples: ['const blockNum = await alchemy.core.getBlockNumber();']
        },
        // --- Enhanced API ---
        {
            name: 'alchemy_getAssetTransfers',
            description: 'Get transactions for specific addresses and categories (external, internal, erc20, erc721, erc1155).',
            category: 'Enhanced APIs',
            functions: ['alchemy_getAssetTransfers(params: AssetTransfersParams)'],
            examples: [`const response = await alchemy.core.getAssetTransfers({ category: ["external"] });`]
        },
        {
            name: 'alchemy_getNftMetadata',
            description: 'Get metadata for a specific NFT.',
            category: 'NFT API',
            functions: ['alchemy_getNftMetadata(contract: string, tokenId: string)'],
            examples: [`const metadata = await alchemy.nft.getNftMetadata("0x...", "42");`]
        },
        // --- Account Abstraction (Bundler) ---
        {
            name: 'eth_sendUserOperation',
            description: 'Submits a User Operation to the mempool.',
            category: 'Account Abstraction',
            functions: ['eth_sendUserOperation(userOp: UserOperation, entryPoint: string)'],
            examples: [`const hash = await alchemy.aa.sendUserOperation(userOp, entryPoint);`]
        },
        {
            name: 'eth_estimateUserOperationGas',
            description: 'Estimates gas for a User Operation.',
            category: 'Account Abstraction',
            functions: ['eth_estimateUserOperationGas(userOp: UserOperation, entryPoint: string)'],
            examples: [`const gas = await alchemy.aa.estimateUserOperationGas(userOp, entryPoint);`]
        }
    ];

    constructor(private options: ParserOptions = {}) { }

    async fetchLatestVersion(): Promise<string> {
        return 'v3.0.0';
    }

    async extractDocs(_url?: string): Promise<DocEntry[]> {
        const cacheKey = 'alchemy:docs';

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
        if (methodName.startsWith('alchemy_')) return 'Enhanced APIs';
        if (methodName.startsWith('eth_sendUser')) return 'Account Abstraction';
        if (methodName.startsWith('eth_')) return 'Core';
        return 'Other';
    }
}
