// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/Pausable.sol";

contract DrinkToken is ERC20, Ownable, ReentrancyGuard, Pausable {
    uint256 public constant MAX_SUPPLY = 51_000_000 * (10 ** uint256(18));
    uint256 public constant PRE_SALE_SUPPLY = 30_000_000 * (10 ** uint256(18));
    uint256 public constant DRINK_PRICE_USD = 10; // $0.10 por Drink token
    bool public presaleActive = true;

    mapping(address => uint256) public tokensPurchased;

    event TokensPurchased(address indexed buyer, address indexed token, uint256 amountPaid, uint256 amountBought);

    constructor() ERC20("DrinkToken", "DRINK") {}

    function buyTokensWithUsd(uint256 usdAmount) external whenNotPaused nonReentrant {
        uint256 tokenAmount = (usdAmount * 100) * (10 ** uint256(18)) / DRINK_PRICE_USD;
        _handlePurchase(tokenAmount);
        emit TokensPurchased(msg.sender, address(0), usdAmount, tokenAmount);
    }

    function _handlePurchase(uint256 tokenAmount) internal {
        require(totalSupply() + tokenAmount <= MAX_SUPPLY, "Exceeds maximum supply");
        if (presaleActive) {
            require(totalSupply() + tokenAmount <= PRE_SALE_SUPPLY, "Exceeds pre-sale supply");
            uint256 maxPurchase = PRE_SALE_SUPPLY / 200; // 0.5% of pre-sale supply
            require(tokensPurchased[msg.sender] + tokenAmount <= maxPurchase, "Exceeds maximum purchase limit per address during pre-sale");
            tokensPurchased[msg.sender] += tokenAmount;
        }
        _mint(msg.sender, tokenAmount);
    }

    function endPresale() external onlyOwner {
        presaleActive = false;
    }

    function mintTokens(uint256 amount) external onlyOwner {
        require(!presaleActive, "Cannot mint during presale");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds maximum supply");
        _mint(msg.sender, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
