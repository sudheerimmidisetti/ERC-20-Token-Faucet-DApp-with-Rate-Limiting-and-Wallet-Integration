# ERC-20 Token Faucet DApp with Rate Limiting and Wallet Integration

## Project Overview

This project is a full-stack Web3 decentralized application (DApp) that
implements an ERC-20 token faucet with strict rate limiting. It
demonstrates end-to-end blockchain development including smart
contracts, frontend wallet integration, Dockerized deployment, and
automated evaluation interfaces.

The faucet allows users to claim a fixed amount of ERC-20 tokens while
enforcing: - A **24-hour cooldown** between claims - A **lifetime
maximum claim limit** - **Admin-controlled pause/unpause** functionality

All rules are enforced **on-chain**, ensuring trustless and transparent
behavior.

------------------------------------------------------------------------

## Architecture

-   **Smart Contracts**: Solidity (ERC-20 Token + Faucet)
-   **Frontend**: React + Vite + ethers.js
-   **Blockchain Network**: Sepolia Testnet
-   **Tooling**: Hardhat, OpenZeppelin, Docker
-   **Evaluation Interface**: `window.__EVAL__` for automated testing

------------------------------------------------------------------------

## Project Structure

    submission/
    ├── contracts/
    │   ├── Token.sol
    │   ├── TokenFaucet.sol
    │   └── test/
    │       └── TokenFaucet.test.js
    ├── frontend/
    │   ├── src/
    │   │   ├── App.jsx
    │   │   ├── main.jsx
    │   │   └── utils/
    │   │       ├── contracts.js
    │   │       └── eval.js
    │   ├── public/
    │   ├── Dockerfile
    │   └── package.json
    ├── scripts/
    │   ├── deploy.js
    │   └── check-balance.js
    ├── docker-compose.yml
    ├── .env.example
    ├── hardhat.config.js
    └── README.md

------------------------------------------------------------------------

## Smart Contract Features

### ERC-20 Token

-   Fully ERC-20 compliant
-   Fixed maximum supply
-   Only faucet can mint tokens
-   Emits Transfer events

### Faucet

-   Fixed tokens per claim
-   24-hour cooldown per address
-   Lifetime claim limit per address
-   Admin pause/unpause support
-   Public state mappings:
    -   `lastClaimAt`
    -   `totalClaimed`

------------------------------------------------------------------------

## Required Public Functions

-   `requestTokens()`
-   `canClaim(address)`
-   `remainingAllowance(address)`
-   `isPaused()`

------------------------------------------------------------------------

## Events

-   `TokensClaimed(address user, uint256 amount, uint256 timestamp)`
-   `FaucetPaused(bool paused)`

------------------------------------------------------------------------

## Revert Conditions

-   Claim during cooldown
-   Lifetime limit exceeded
-   Faucet paused
-   Insufficient token supply

------------------------------------------------------------------------

## Frontend Features

-   Wallet connect/disconnect
-   Shows connected address
-   Displays real-time token balance
-   Shows cooldown timer
-   Shows remaining allowance
-   Loading indicators during transactions
-   User-friendly error messages

------------------------------------------------------------------------

## Evaluation Interface (CRITICAL)

The frontend exposes:

``` js
window.__EVAL__ = {
  connectWallet,
  requestTokens,
  getBalance,
  canClaim,
  getRemainingAllowance,
  getContractAddresses
};
```

-   All numeric values returned as **strings**\
-   Errors are thrown with descriptive messages

------------------------------------------------------------------------

## Docker Setup

### Run Locally

``` bash
cp .env.example .env
docker compose up
```

-   App runs at: http://localhost:3000
-   Health check: `/health` → HTTP 200

------------------------------------------------------------------------

## Environment Variables

``` env
VITE_RPC_URL=
VITE_TOKEN_ADDRESS=
VITE_FAUCET_ADDRESS=
```

------------------------------------------------------------------------

## Testing Strategy

-   Unit tests for all smart contract functions
-   Covers success paths and revert cases
-   Uses Hardhat time manipulation for cooldown testing
-   Verifies event emissions

------------------------------------------------------------------------

## Security Considerations

-   Checks-effects-interactions pattern
-   Solidity 0.8+ overflow protection
-   Strict access control
-   No hardcoded secrets
-   Gas-efficient storage usage

------------------------------------------------------------------------

## Deployment

-   Network: **Sepolia**
-   Contracts verified on **Etherscan**
-   Deployment handled via `scripts/deploy.js`

------------------------------------------------------------------------

## Submission Checklist

-  Contracts deployed & verified
-  Docker setup works
-  `/health` endpoint available
-  window.\_\_EVAL\_\_ functions work
-  README complete
