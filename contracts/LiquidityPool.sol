// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/ReentrancyGuard.sol";

contract LiquidityPool is Ownable, ReentrancyGuard {
    IERC20 public drinkToken;

    uint256 public totalLiquidityETH;
    mapping(address => uint256) public liquidityProviderETH;
    mapping(address => uint256) public liquidityProviderDRINK;

    event LiquidityAdded(address indexed provider, uint256 ethAmount, uint256 tokenAmount);
    event LiquidityRemoved(address indexed provider, uint256 ethAmount, uint256 tokenAmount);

    constructor(address _drinkToken) {
        require(_drinkToken != address(0), "Invalid token address");
        drinkToken = IERC20(_drinkToken);
    }

    function addLiquidity(uint256 tokenAmount) external payable nonReentrant {
        require(tokenAmount > 0, "Token amount must be greater than zero");
        require(msg.value > 0, "ETH amount must be greater than zero");

        drinkToken.transferFrom(msg.sender, address(this), tokenAmount);

        liquidityProviderETH[msg.sender] += msg.value;
        liquidityProviderDRINK[msg.sender] += tokenAmount;
        totalLiquidityETH += msg.value;

        emit LiquidityAdded(msg.sender, msg.value, tokenAmount);
    }

    function removeLiquidity(uint256 ethAmount, uint256 tokenAmount) external nonReentrant {
        require(liquidityProviderETH[msg.sender] >= ethAmount, "Insufficient ETH liquidity");
        require(liquidityProviderDRINK[msg.sender] >= tokenAmount, "Insufficient DRINK liquidity");

        liquidityProviderETH[msg.sender] -= ethAmount;
        liquidityProviderDRINK[msg.sender] -= tokenAmount;
        totalLiquidityETH -= ethAmount;

        payable(msg.sender).transfer(ethAmount);
        drinkToken.transfer(msg.sender, tokenAmount);

        emit LiquidityRemoved(msg.sender, ethAmount, tokenAmount);
    }
}
