---
name: sui-move-1-0-0
description: Sui Move Framework - Objects, Coins, Transfers
version: 1.0.0
language: move
providers: sui
last_sync: 2026-01-21T13:50:00.497Z
---

# Sui MOVE v1.0.0

## Instructions
Use this skill when working with move contracts and sui patterns. This skill provides validated code examples and best practices for building secure smart contracts.

### Core Patterns
- **sui_object_uid**: Creating a new object with uniform unique identifier (UID).
- **sui_coin_create_currency**: Create a new currency using the One-Time-Witness pattern.
- **sui_transfer**: Transfer ownership of an object.

### Code Examples
```solidity

    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    struct MyObject has key {
        id: UID,
        value: u64,
    }

    public fun create(ctx: &amp;mut TxContext) {
        let object &#x3D; MyObject {
            id: object::new(ctx),
            value: 0,
        };
        transfer::share_object(object);
    }
```
*Example from sui_object_uid*

```solidity

    use sui::coin;
    use std::option;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct MY_COIN has drop {}

    fun init(witness: MY_COIN, ctx: &amp;mut TxContext) {
        let (treasury, metadata) &#x3D; coin::create_currency(
            witness, 
            9, 
            b&quot;MYC&quot;, 
            b&quot;My Coin&quot;, 
            b&quot;Description&quot;, 
            option::none(), 
            ctx
        );
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx));
    }
```
*Example from sui_coin_create_currency*

```solidity

    use sui::transfer;

    public fun send_object(obj: MyObject, recipient: address) {
        transfer::public_transfer(obj, recipient);
    }
```
*Example from sui_transfer*


## Reference
[Full API Documentation](#)
