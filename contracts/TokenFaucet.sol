// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenFaucet is Ownable {
    FaucetToken public token;
    uint256 public constant FAUCET_AMOUNT = 100 * 10**18;
    uint256 public constant COOLDOWN_TIME = 24 hours;
    uint256 public constant MAX_LIFETIME_CLAIM = 1000 * 10**18;
    bool public isPaused;

    mapping(address => uint256) public lastClaimAt;
    mapping(address => uint256) public totalClaimed;

    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetPaused(bool paused);

    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = FaucetToken(_tokenAddress);
    }

    function requestTokens() external {
        require(!isPaused, "Faucet is paused");
        require(canClaim(msg.sender), "Claim not allowed");

        lastClaimAt[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] += FAUCET_AMOUNT;

        token.mint(msg.sender, FAUCET_AMOUNT);
        emit TokensClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }

    function canClaim(address user) public view returns (bool) {
        if (isPaused) return false;
        if (totalClaimed[user] + FAUCET_AMOUNT > MAX_LIFETIME_CLAIM) return false;
        if (block.timestamp < lastClaimAt[user] + COOLDOWN_TIME) return false;
        return true;
    }

    function remainingAllowance(address user) external view returns (uint256) {
        if (totalClaimed[user] >= MAX_LIFETIME_CLAIM) return 0;
        return MAX_LIFETIME_CLAIM - totalClaimed[user];
    }

    function setPaused(bool _state) external onlyOwner {
        isPaused = _state;
        emit FaucetPaused(_state);
    }
}