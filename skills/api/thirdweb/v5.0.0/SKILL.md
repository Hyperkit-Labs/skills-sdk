---
name: thirdweb-sdk-v5-0-0
description: Thirdweb SDK v5 - Connect, Contracts, Wallets
version: 5.0.0
language: typescript
providers: thirdweb
last_sync: 2026-01-21T13:43:21.836Z
---

# Thirdweb TYPESCRIPT v5.0.0

## Instructions
Use this skill when working with typescript contracts and thirdweb patterns. This skill provides validated code examples and best practices for building secure smart contracts.

### Core Patterns
- **thirdweb_getContract**: Connect to a smart contract using the Thirdweb SDK.
- **thirdweb_erc721_mint**: Mint an NFT to a specific address (ERC721).
- **thirdweb_erc20_transfer**: Transfer tokens (ERC20).
- **thirdweb_smartWallet**: Connect a Smart Wallet (Account Abstraction).

### Code Examples
```solidity

import { getContract } from &quot;thirdweb&quot;;
import { defineChain } from &quot;thirdweb&#x2F;chains&quot;;

const contract &#x3D; getContract({
  client,
  chain: defineChain(1),
  address: &quot;0x...&quot;,
});
```
*Example from thirdweb_getContract*

```solidity

import { mintTo } from &quot;thirdweb&#x2F;extensions&#x2F;erc721&quot;;

const transaction &#x3D; await mintTo({
  contract,
  to: &quot;0x...&quot;,
  nft: {
    name: &quot;My NFT&quot;,
    description: &quot;This is my NFT&quot;,
    image: &quot;https:&#x2F;&#x2F;example.com&#x2F;image.png&quot;,
  },
});
```
*Example from thirdweb_erc721_mint*

```solidity

import { transfer } from &quot;thirdweb&#x2F;extensions&#x2F;erc20&quot;;

const transaction &#x3D; await transfer({
  contract,
  to: &quot;0x...&quot;,
  amount: 100,
});
```
*Example from thirdweb_erc20_transfer*

```solidity

import { smartWallet } from &quot;thirdweb&#x2F;wallets&quot;;

const wallet &#x3D; smartWallet({
  chain: defineChain(1),
  gasless: true,
});
```
*Example from thirdweb_smartWallet*


## Reference
[Full API Documentation](https:&#x2F;&#x2F;portal.thirdweb.com&#x2F;)
