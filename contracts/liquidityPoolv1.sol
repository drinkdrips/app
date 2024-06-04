// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract LiquidityPool is Ownable, ReentrancyGuard {
    struct Liquidity {
        uint256 ethAmount;
        uint256 tokenAmount;
    }

    mapping(address => mapping(address => Liquidity)) public liquidity;

    AggregatorV3Interface internal priceFeed;

    constructor(address _priceFeedAddress) {
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    event LiquidityAdded(address indexed provider, address indexed token, uint256 ethAmount, uint256 tokenAmount);
    event LiquidityRemoved(address indexed provider, address indexed token, uint256 ethAmount, uint256 tokenAmount);

    function addEthLiquidity(address token) external payable nonReentrant {
        require(token != address(0), "Invalid token address");
        require(msg.value > 0, "ETH amount must be greater than zero");

        Liquidity storage pool = liquidity[msg.sender][token];
        pool.ethAmount += msg.value;

        emit LiquidityAdded(msg.sender, token, msg.value, 0);
    }

    function addTokenLiquidity(address token, uint256 tokenAmount) external nonReentrant {
        require(token != address(0), "Invalid token address");
        require(tokenAmount > 0, "Token amount must be greater than zero");

        IERC20(token).transferFrom(msg.sender, address(this), tokenAmount);

        Liquidity storage pool = liquidity[msg.sender][token];
        pool.tokenAmount += tokenAmount;

        emit LiquidityAdded(msg.sender, token, 0, tokenAmount);
    }

    function removeEthLiquidity(address token, uint256 ethAmount) external nonReentrant {
        require(token != address(0), "Invalid token address");
        require(ethAmount > 0, "ETH amount must be greater than zero");

        Liquidity storage pool = liquidity[msg.sender][token];
        require(pool.ethAmount >= ethAmount, "Insufficient ETH liquidity");

        pool.ethAmount -= ethAmount;
        payable(msg.sender).transfer(ethAmount);

        emit LiquidityRemoved(msg.sender, token, ethAmount, 0);
    }

    function removeTokenLiquidity(address token, uint256 tokenAmount) external nonReentrant {
        require(token != address(0), "Invalid token address");
        require(tokenAmount > 0, "Token amount must be greater than zero");

        Liquidity storage pool = liquidity[msg.sender][token];
        require(pool.tokenAmount >= tokenAmount, "Insufficient token liquidity");

        pool.tokenAmount -= tokenAmount;
        IERC20(token).transfer(msg.sender, tokenAmount);

        emit LiquidityRemoved(msg.sender, token, 0, tokenAmount);
    }

    function getTokenPriceInEth() public view returns (uint256) {
    (, int256 price, , ,) = priceFeed.latestRoundData();
    return uint256(price);
    }

}
