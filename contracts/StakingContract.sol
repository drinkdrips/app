// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DripsToken.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/utils/SafeERC20.sol";

contract StakingContract is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    DripsToken public dripsToken;
    IERC20 public drinkToken;

    uint256 public rewardRate = 2; // 0.2 DRIPS per hour per staked DRINK (2 / 10)
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public rewardBalance;
    address[] private stakers;

    event TokensStaked(address indexed staker, uint256 amount);
    event TokensUnstaked(address indexed staker, uint256 amount);
    event RewardClaimed(address indexed staker, uint256 amount);
    event RewardsDistributed(uint256 totalAmount);

    constructor(address _drinkToken, address _dripsToken) {
        require(_drinkToken != address(0), "Invalid DRINK token address");
        require(_dripsToken != address(0), "Invalid DRIPS token address");

        drinkToken = IERC20(_drinkToken);
        dripsToken = DripsToken(_dripsToken);
    }

    function stakeTokens(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(drinkToken.balanceOf(msg.sender) >= amount, "Insufficient balance");

        if (stakingBalance[msg.sender] == 0) {
            stakers.push(msg.sender);
            lastClaimTime[msg.sender] = block.timestamp;
        }

        stakingBalance[msg.sender] += amount;
        drinkToken.safeTransferFrom(msg.sender, address(this), amount);

        emit TokensStaked(msg.sender, amount);
    }

    function unstakeTokens(uint256 amount) external whenNotPaused nonReentrant {
        require(stakingBalance[msg.sender] >= amount, "Insufficient staked balance");
        require(amount > 0, "Amount must be greater than zero");

        _payRewards(msg.sender);

        stakingBalance[msg.sender] -= amount;
        drinkToken.safeTransfer(msg.sender, amount);

        if (stakingBalance[msg.sender] == 0) {
            for (uint256 i = 0; i < stakers.length; i++) {
                if (stakers[i] == msg.sender) {
                    stakers[i] = stakers[stakers.length - 1];
                    stakers.pop();
                    break;
                }
            }
        }

        emit TokensUnstaked(msg.sender, amount);
    }

    function _payRewards(address staker) internal {
        uint256 rewards = calculateRewards(staker);
        if (rewards > 0) {
            rewardBalance[staker] += rewards;
            dripsToken.mint(staker, rewards);
            emit RewardClaimed(staker, rewards);
        }
        lastClaimTime[staker] = block.timestamp;
    }

    function calculateRewards(address staker) public view returns (uint256) {
        uint256 stakingDuration = block.timestamp - lastClaimTime[staker];
        uint256 rewards = (stakingBalance[staker] * stakingDuration * rewardRate) / (3600 * 10);
        return rewards;
    }

    function claimRewards() external whenNotPaused nonReentrant {
        _payRewards(msg.sender);
    }

    function distributeRewards() external onlyOwner whenNotPaused nonReentrant {
        uint256 totalRewards;
        for (uint256 i = 0; i < stakers.length; i++) {
            uint256 rewards = calculateRewards(stakers[i]);
            if (rewards > 0) {
                rewardBalance[stakers[i]] += rewards;
                dripsToken.mint(stakers[i], rewards);
                totalRewards += rewards;
                emit RewardClaimed(stakers[i], rewards);
            }
            lastClaimTime[stakers[i]] = block.timestamp;
        }
        emit RewardsDistributed(totalRewards);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
