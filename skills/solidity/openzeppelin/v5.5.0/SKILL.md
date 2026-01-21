---
name: openzeppelin-contracts-solidity
description: OpenZeppelin Contracts - Secure, audited smart contract library for Ethereum development
version: 5.5.0
language: solidity
provider: openzeppelin
tags: [ethereum, solidity, security, defi, nft]
---

# OpenZeppelin Contracts for Solidity

Production-ready smart contract library with security-audited implementations of ERC standards, access control, and common patterns.

## Key Capabilities

- **ERC Standards**: ERC20, ERC721, ERC1155 token implementations
- **Access Control**: Ownable, Role-Based Access Control (RBAC)
- **Security**: ReentrancyGuard, Pausable contract patterns
- **Upgradeable**: Transparent and UUPS proxy patterns
- **Governance**: Governance contracts with voting mechanisms

## Quick Start

### Installing OpenZeppelin Contracts

```bash
npm install @openzeppelin/contracts
```

### Basic ERC20 Token

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
```

### Access Control with Ownable

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MyContract is Ownable {
    uint256 public value;

    constructor() Ownable(msg.sender) {}

    function setValue(uint256 newValue) public onlyOwner {
        value = newValue;
    }
}
```

### ERC721 NFT

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender)  {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
    }
}
```

### Reentrancy Protection

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SecureVault is ReentrancyGuard {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public nonReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");
        
        balances[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
```

### Upgradeable Contracts (UUPS)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MyUpgradeableContract is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 public value;

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function setValue(uint256 newValue) public onlyOwner {
        value = newValue;
    }
}
```

## Common Patterns

### Pausable Emergency Stop

```solidity
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PausableToken is Pausable, Ownable {
    constructor() Ownable(msg.sender) {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function transfer() public whenNotPaused {
        // Transfer logic
    }
}
```

### Role-Based Access Control

```solidity
import "@openzeppelin/contracts/access/AccessControl.sol";

contract RoleBasedContract is AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mint(address to) public onlyRole(MINTER_ROLE) {
        // Minting logic
    }
}
```

## Best Practices

1. **Always use latest stable version** - Security updates are critical
2. **Audit custom code** - OpenZeppelin is audited, but your extensions need review
3. **Test thoroughly** - Use Hardhat/Foundry with comprehensive test coverage
4. **Follow upgrade patterns** - Use transparent or UUPS proxies correctly
5. **Gas optimization** - Balance security with gas costs
6. **Events for tracking** - Emit events for all state changes

## Security Considerations

- Never extend contracts unless you understand the inheritance chain
- Use `ReentrancyGuard` for functions with external calls
- Implement access control before deployment
- Test upgradeability paths thoroughly
- Monitor for security advisories

## Resources

- [Official Documentation](https://docs.openzeppelin.com/contracts/5.x/)
- [GitHub Repository](https://github.com/OpenZeppelin/openzeppelin-contracts)
- [Security Advisories](https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories)
- [Upgrades Plugins](https://docs.openzeppelin.com/upgrades-plugins/1.x/)

## Version Compatibility

- Solidity: ^0.8.20
- Hardhat: ^2.0.0
- Node.js: >=16.0.0
