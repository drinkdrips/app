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
        uint256 tokenRewards;
        uint256 lastCheckpoint;
        uint256 depositTimestamp;
    }

    mapping(address => mapping(address => Liquidity)) public liquidity;
    mapping(address => uint256) public totalEthLiquidity;
    mapping(address => uint256) public totalTokenLiquidity;

    AggregatorV3Interface internal priceFeed;
    IERC20 public rewardToken;
    uint256 public transactionFee = 3; // 3%
    uint256 public checkpointInterval = 1 weeks;
    uint256 public lastCheckpointTime;
    uint256 public rewardRate; // Tokens rewarded per ETH per checkpoint interval

    address[] public providers;
    mapping(address => bool) public isProvider;

    constructor(address _priceFeedAddress, address _rewardToken, uint256 _rewardRate) {
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
        rewardToken = IERC20(_rewardToken);
        rewardRate = _rewardRate;
        lastCheckpointTime = block.timestamp;
    }

    event LiquidityAdded(address indexed provider, address indexed token, uint256 ethAmount, uint256 tokenAmount);
    event LiquidityRemoved(address indexed provider, address indexed token, uint256 ethAmount, uint256 tokenAmount);
    event RewardsDistributed(address indexed provider, uint256 rewardAmount, uint256 tokenRewardAmount);
    event TransactionFeeUpdated(uint256 newFee);
    event RewardsCompounded(address indexed provider, uint256 ethAmount, uint256 tokenAmount);
    event ETHDeposited(address indexed depositor, uint256 amount);
    event TokensDeposited(address indexed depositor, uint256 amount);

    modifier validToken(address token) {
        require(token != address(0), "Invalid token address");
        _;
    }

    modifier positiveAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than zero");
        _;
    }

    modifier updateCheckpoint(address provider, address token) {
        if (block.timestamp > lastCheckpointTime + checkpointInterval) {
            _distributeRewards(token);
        }
        _;
    }

    function setTransactionFee(uint256 _transactionFee) external onlyOwner {
        require(_transactionFee <= 100, "Transaction fee too high");
        transactionFee = _transactionFee;
        emit TransactionFeeUpdated(_transactionFee);
    }

    function depositETH() external payable onlyOwner {
        require(msg.value > 0, "Amount must be greater than zero");
        emit ETHDeposited(msg.sender, msg.value);
    }

    function depositTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        rewardToken.transferFrom(msg.sender, address(this), amount);
        emit TokensDeposited(msg.sender, amount);
    }

    function addEthLiquidity(address token) external payable nonReentrant whenNotPaused validToken(token) positiveAmount(msg.value) updateCheckpoint(msg.sender, token) {
        Liquidity storage pool = liquidity[msg.sender][token];
        if (pool.ethAmount == 0) {
            pool.depositTimestamp = block.timestamp;
        }
        pool.ethAmount += msg.value;
        totalEthLiquidity[token] += msg.value;

        if (!isProvider[msg.sender]) {
            providers.push(msg.sender);
            isProvider[msg.sender] = true;
        }

        emit LiquidityAdded(msg.sender, token, msg.value, 0);
    }

    function addTokenLiquidity(address token, uint256 tokenAmount) external nonReentrant whenNotPaused validToken(token) positiveAmount(tokenAmount) updateCheckpoint(msg.sender, token) {
        IERC20(token).transferFrom(msg.sender, address(this), tokenAmount);

        Liquidity storage pool = liquidity[msg.sender][token];
        if (pool.tokenAmount == 0) {
            pool.depositTimestamp = block.timestamp;
        }
        pool.tokenAmount += tokenAmount;
        totalTokenLiquidity[token] += tokenAmount;

        if (!isProvider[msg.sender]) {
            providers.push(msg.sender);
            isProvider[msg.sender] = true;
        }

        emit LiquidityAdded(msg.sender, token, 0, tokenAmount);
    }

    function removeEthLiquidity(address token, uint256 ethAmount) external nonReentrant whenNotPaused validToken(token) positiveAmount(ethAmount) updateCheckpoint(msg.sender, token) {
        Liquidity storage pool = liquidity[msg.sender][token];
        require(pool.ethAmount >= ethAmount, "Insufficient ETH liquidity");

        pool.ethAmount -= ethAmount;
        totalEthLiquidity[token] -= ethAmount;
        payable(msg.sender).transfer(ethAmount);

        emit LiquidityRemoved(msg.sender, token, ethAmount, 0);
    }

    function removeTokenLiquidity(address token, uint256 tokenAmount) external nonReentrant whenNotPaused validToken(token) positiveAmount(tokenAmount) updateCheckpoint(msg.sender, token) {
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

    function _distributeRewards(address token) internal {
        uint256 totalRewards = address(this).balance; // assuming rewards are in ETH
        uint256 totalTokenRewards = rewardRate * checkpointInterval; // Tokens to distribute in this interval
        if (totalEthLiquidity[token] > 0) {
            for (uint256 i = 0; i < providers.length; i++) {
                address provider = providers[i];
                Liquidity storage pool = liquidity[provider][token];
                if (pool.ethAmount > 0) {
                    uint256 providerShare = (pool.ethAmount * 1e18) / totalEthLiquidity[token];
                    uint256 reward = (totalRewards * providerShare) / 1e18;
                    uint256 tokenReward = (totalTokenRewards * providerShare) / 1e18;
                    pool.rewards += reward;
                    pool.tokenRewards += tokenReward;
                    emit RewardsDistributed(provider, reward, tokenReward);
                }
            }
        }
        lastCheckpointTime = block.timestamp;
    }

    function claimRewards(address token) external nonReentrant whenNotPaused updateCheckpoint(msg.sender, token) {
        Liquidity storage pool = liquidity[msg.sender][token];
        uint256 reward = pool.rewards;
        uint256 tokenReward = pool.tokenRewards;
        require(reward > 0 || tokenReward > 0, "No rewards to claim");
        if (reward > 0) {
            pool.rewards = 0;
            payable(msg.sender).transfer(reward);
        }
        if (tokenReward > 0) {
            pool.tokenRewards = 0;
            rewardToken.transfer(msg.sender, tokenReward);
        }
    }

    function compoundRewards(address token) external nonReentrant whenNotPaused updateCheckpoint(msg.sender, token) {
        Liquidity storage pool = liquidity[msg.sender][token];
        uint256 reward = pool.rewards;
        uint256 tokenReward = pool.tokenRewards;
        require(reward > 0 || tokenReward > 0, "No rewards to compound");
        
        if (reward > 0) {
            pool.rewards = 0;
            pool.ethAmount += reward;
            totalEthLiquidity[token] += reward;
        }
        
        if (tokenReward > 0) {
            pool.tokenRewards = 0;
            pool.tokenAmount += tokenReward;
            totalTokenLiquidity[token] += tokenReward;
        }
        
        emit RewardsCompounded(msg.sender, reward, tokenReward);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function getRewards(address token) external view returns (uint256 ethRewards, uint256 tokenRewards) {
        Liquidity storage pool = liquidity[msg.sender][token];
        ethRewards = pool.rewards;
        tokenRewards = pool.tokenRewards;
    }

    function getContractETHBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getContractTokenBalance() external view returns (uint256) {
        return rewardToken.balanceOf(address(this));
    }

    function getLiquidityDuration(address token) external view returns (uint256) {
        Liquidity storage pool = liquidity[msg.sender][token];
        return block.timestamp - pool.depositTimestamp;
    }
    
    function updateRewardRate(uint256 _rewardRate) external onlyOwner {
        rewardRate = _rewardRate;
    }

    function setCheckpointInterval(uint256 _interval) external onlyOwner {
        checkpointInterval = _interval;
    }

    function setPriceFeed(address _priceFeedAddress) external onlyOwner {
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    function setRewardToken(address _rewardToken) external onlyOwner {
        rewardToken = IERC20(_rewardToken);
    }
    
    function calculateDynamicFee(address token) internal view returns (uint256) {
        // Exemplo básico de cálculo de taxa dinâmica
        uint256 totalLiquidity = totalEthLiquidity[token] + totalTokenLiquidity[token];
        if (totalLiquidity < 1000 ether) {
            return 5; // 5% de taxa se a liquidez total for menor que 1000 ETH
        } else if (totalLiquidity < 10000 ether) {
            return 3; // 3% de taxa se a liquidez total for menor que 10000 ETH
        } else {
            return 1; // 1% de taxa se a liquidez total for maior que 10000 ETH
        }
    }

    function applyDynamicFee(uint256 amount, address token) internal view returns (uint256) {
        uint256 feePercent = calculateDynamicFee(token);
        uint256 fee = (amount * feePercent) / 100;
        return amount - fee;
    }

    function addEthLiquidityWithDynamicFee(address token) external payable nonReentrant whenNotPaused validToken(token) positiveAmount(msg.value) updateCheckpoint(msg.sender, token) {
        uint256 amountAfterFee = applyDynamicFee(msg.value, token);

        Liquidity storage pool = liquidity[msg.sender][token];
        if (pool.ethAmount == 0) {
            pool.depositTimestamp = block.timestamp;
        }
        pool.ethAmount += amountAfterFee;
        totalEthLiquidity[token] += amountAfterFee;

        if (!isProvider[msg.sender]) {
            providers.push(msg.sender);
            isProvider[msg.sender] = true;
        }

        emit LiquidityAdded(msg.sender, token, amountAfterFee, 0);
    }

    function addTokenLiquidityWithDynamicFee(address token, uint256 tokenAmount) external nonReentrant whenNotPaused validToken(token) positiveAmount(tokenAmount) updateCheckpoint(msg.sender, token) {
        uint256 amountAfterFee = applyDynamicFee(tokenAmount, token);

        IERC20(token).transferFrom(msg.sender, address(this), amountAfterFee);

        Liquidity storage pool = liquidity[msg.sender][token];
        if (pool.tokenAmount == 0) {
            pool.depositTimestamp = block.timestamp;
        }
        pool.tokenAmount += amountAfterFee;
        totalTokenLiquidity[token] += amountAfterFee;

        if (!isProvider[msg.sender]) {
            providers.push(msg.sender);
            isProvider[msg.sender] = true;
        }

        emit LiquidityAdded(msg.sender, token, 0, amountAfterFee);
    }
}
