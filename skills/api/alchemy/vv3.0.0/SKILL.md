---
name: alchemy-api-v3-0-0
description: Alchemy Web3 API - Core, NFT, Transfers, AA (Bundler)
version: v3.0.0
language: javascript
providers: alchemy
last_sync: 2026-01-21T13:37:12.186Z
---

# Alchemy JAVASCRIPT vv3.0.0

## Instructions
Use this skill when working with javascript contracts and alchemy patterns. This skill provides validated code examples and best practices for building secure smart contracts.

### Core Patterns
- **eth_getBalance**: Returns the balance of the account of given address.
- **eth_blockNumber**: Returns the number of the most recent block.
- **alchemy_getAssetTransfers**: Get transactions for specific addresses and categories (external, internal, erc20, erc721, erc1155).
- **alchemy_getNftMetadata**: Get metadata for a specific NFT.
- **eth_sendUserOperation**: Submits a User Operation to the mempool.
- **eth_estimateUserOperationGas**: Estimates gas for a User Operation.

### Code Examples
```solidity
const balance &#x3D; await alchemy.core.getBalance(&quot;0x...&quot;);
```
*Example from eth_getBalance*

```solidity
const blockNum &#x3D; await alchemy.core.getBlockNumber();
```
*Example from eth_blockNumber*

```solidity
const response &#x3D; await alchemy.core.getAssetTransfers({ category: [&quot;external&quot;] });
```
*Example from alchemy_getAssetTransfers*

```solidity
const metadata &#x3D; await alchemy.nft.getNftMetadata(&quot;0x...&quot;, &quot;42&quot;);
```
*Example from alchemy_getNftMetadata*

```solidity
const hash &#x3D; await alchemy.aa.sendUserOperation(userOp, entryPoint);
```
*Example from eth_sendUserOperation*


## Reference
[Full API Documentation](https:&#x2F;&#x2F;docs.alchemy.com&#x2F;)
