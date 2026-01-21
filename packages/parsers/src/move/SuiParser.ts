import { Parser, DocEntry } from '../base/Parser';
import { ParserOptions } from '../types';

export class SuiParser implements Parser {
    // Phase 4: Static Definitions for Sui Move
    // Curated for Move 2024 edition to ensure high quality (avoiding outdated doc scrapes)
    private readonly staticDefinitions: DocEntry[] = [
        // --- Object Basics ---
        {
            name: 'sui_object_uid',
            description: 'Creating a new object with uniform unique identifier (UID).',
            category: 'Sui Core',
            functions: ['object::new(ctx: &mut TxContext): UID'],
            examples: [`
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    struct MyObject has key {
        id: UID,
        value: u64,
    }

    public fun create(ctx: &mut TxContext) {
        let object = MyObject {
            id: object::new(ctx),
            value: 0,
        };
        transfer::share_object(object);
    }`]
        },
        // --- Coin Pattern ---
        {
            name: 'sui_coin_create_currency',
            description: 'Create a new currency using the One-Time-Witness pattern.',
            category: 'Sui Framework',
            functions: ['coin::create_currency<T>(witness: T, decimals: u8, symbol: vector<u8>, name: vector<u8>, description: vector<u8>, icon_url: Option<Url>, ctx: &mut TxContext)'],
            examples: [`
    use sui::coin;
    use std::option;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct MY_COIN has drop {}

    fun init(witness: MY_COIN, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(
            witness, 
            9, 
            b"MYC", 
            b"My Coin", 
            b"Description", 
            option::none(), 
            ctx
        );
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx));
    }`]
        },
        // --- Transfer ---
        {
            name: 'sui_transfer',
            description: 'Transfer ownership of an object.',
            category: 'Sui Core',
            functions: ['transfer::public_transfer<T: key + store>(obj: T, recipient: address)'],
            examples: [`
    use sui::transfer;

    public fun send_object(obj: MyObject, recipient: address) {
        transfer::public_transfer(obj, recipient);
    }`]
        }
    ];

    constructor(private options: ParserOptions = {}) { }

    async fetchLatestVersion(): Promise<string> {
        return 'framework-v1.0.0'; // Sui Move Framework version
    }

    async extractDocs(_url?: string): Promise<DocEntry[]> {
        const cacheKey = 'sui:docs';

        if (this.options.cache) {
            const cached = await this.options.cache.get(cacheKey);
            if (cached) {
                try {
                    return JSON.parse(cached);
                } catch (e) { /* ignore */ }
            }
        }

        const entries = this.staticDefinitions;

        if (this.options.cache) {
            await this.options.cache.set(cacheKey, JSON.stringify(entries), this.options.cacheTTL || 86400);
        }

        return entries;
    }

    categorize(methodName: string): string {
        if (methodName.includes('coin')) return 'Sui Framework';
        return 'Sui Core';
    }
}
