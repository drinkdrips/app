// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/Pausable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract LiquidityPool is Ownable, ReentrancyGuard, Pausable {
    struct Liquidity {
        uint256 ethAmount;
        uint256 tokenAmount;
        uint256 rewards;
    }

    mapping(address => mapping(address => Liquidity)) public liquidity;
    mapping(address => uint256) public totalEthLiquidity;
    mapping(address => uint256) public totalTokenLiquidity;

    AggregatorV3Interface internal priceFeed;
    uint256 public transactionFee = 3; // 3%

    constructor(address _priceFeedAddress) {
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    event LiquidityAdded(address indexed provider, address indexed token, uint256 ethAmount, uint256 tokenAmount);
    event LiquidityRemoved(address indexed provider, address indexed token, uint256 ethAmount, uint256 tokenAmount);
    event RewardsDistributed(address indexed provider, uint256 rewardAmount);
    event TransactionFeeUpdated(uint256 newFee);

    modifier validToken(address token) {
        require(token != address(0), "Invalid token address");
        _;
    }

    modifier positiveAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than zero");
        _;
    }

    function setTransactionFee(uint256 _transactionFee) external onlyOwner {
        require(_transactionFee <= 100, "Transaction fee too high");
        transactionFee = _transactionFee;
        emit TransactionFeeUpdated(_transactionFee);
    }

    function addEthLiquidity(address token) external payable nonReentrant whenNotPaused validToken(token) positiveAmount(msg.value) {
        Liquidity storage pool = liquidity[msg.sender][token];
        pool.ethAmount += msg.value;
        totalEthLiquidity[token] += msg.value;

        emit LiquidityAdded(msg.sender, token, msg.value, 0);
    }

    function addTokenLiquidity(address token, uint256 tokenAmount) external nonReentrant whenNotPaused validToken(token) positiveAmount(tokenAmount) {
        IERC20(token).transferFrom(msg.sender, address(this), tokenAmount);

        Liquidity storage pool = liquidity[msg.sender][token];
        pool.tokenAmount += tokenAmount;
        totalTokenLiquidity[token] += tokenAmount;

        emit LiquidityAdded(msg.sender, token, 0, tokenAmount);
    }

    function removeEthLiquidity(address token, uint256 ethAmount) external nonReentrant whenNotPaused validToken(token) positiveAmount(ethAmount) {
        Liquidity storage pool = liquidity[msg.sender][token];
        require(pool.ethAmount >= ethAmount, "Insufficient ETH liquidity");

        pool.ethAmount -= ethAmount;
        totalEthLiquidity[token] -= ethAmount;
        payable(msg.sender).transfer(ethAmount);

        emit LiquidityRemoved(msg.sender, token, ethAmount, 0);
    }

    function removeTokenLiquidity(address token, uint256 tokenAmount) external nonReentrant whenNotPaused validToken(token) positiveAmount(tokenAmount) {
        Liquidity storage pool = liquidity[msg.sender][token];
        require(pool.tokenAmount >= tokenAmount, "Insufficient token liquidity");

        pool.tokenAmount -= tokenAmount;
        totalTokenLiquidity[token] -= tokenAmount;
        IERC20(token).transfer(msg.sender, tokenAmount);

        emit LiquidityRemoved(msg.sender, token, 0, tokenAmount);
    }

    function getTokenPriceInEth() public view returns (uint256) {
        (, int256 price, , ,) = priceFeed.latestRoundData();
        return uint256(price);
    }

    function distributeRewards(address token) external onlyOwner nonReentrant whenNotPaused {
        uint256 totalRewards = address(this).balance; // assuming rewards are in ETH
        for (uint256 i = 0; i < address(this).balance; i++) {
            address provider = msg.sender;
            Liquidity storage pool = liquidity[provider][token];
            uint256 providerShare = (pool.ethAmount * 1e18) / totalEthLiquidity[token];
            uint256 reward = (totalRewards * providerShare) / 1e18;
            pool.rewards += reward;
            emit RewardsDistributed(provider, reward);
        }
    }

    function claimRewards(address token) external nonReentrant whenNotPaused {
        Liquidity storage pool = liquidity[msg.sender][token];
        uint256 reward = pool.rewards;
        require(reward > 0, "No rewards to claim");
        pool.rewards = 0;
        payable(msg.sender).transfer(reward);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function getRewards(address token) external view returns (uint256) {
        return liquidity[msg.sender][token].rewards;
    }
}
