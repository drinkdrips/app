// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/Pausable.sol";

contract DripsToken is ERC20, Ownable, Pausable {
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event ConditionalTransfer(address indexed from, address indexed to, uint256 amount);
    event RewardGranted(address indexed to, uint256 amount);
    event PenaltyApplied(address indexed from, uint256 amount);

    mapping(address => bool) public allowedTransfer;
    address public stakingContract;

    constructor(address _initialOwner) ERC20("DripsToken", "DRIPS") {
        transferOwnership(_initialOwner);
    }

    modifier onlyStakingContract() {
        require(msg.sender == stakingContract, "Caller is not the staking contract");
        _;
    }

    function setStakingContract(address _stakingContract) external onlyOwner {
        stakingContract = _stakingContract;
    }

    function mint(address to, uint256 amount) external onlyStakingContract whenNotPaused {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    // Nova função mint para o proprietário
    function ownerMint(address to, uint256 amount) external onlyOwner whenNotPaused {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function burn(uint256 amount) external onlyOwner whenNotPaused {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    function conditionalTransfer(address to, uint256 amount) external whenNotPaused {
        require(allowedTransfer[msg.sender], "Conditional transfer not allowed");
        _transfer(msg.sender, to, amount);
        emit ConditionalTransfer(msg.sender, to, amount);
    }

    function grantReward(address to, uint256 amount) external onlyOwner whenNotPaused {
        _mint(to, amount);
        emit RewardGranted(to, amount);
    }

    function applyPenalty(address from, uint256 amount) external onlyOwner whenNotPaused {
        _burn(from, amount);
        emit PenaltyApplied(from, amount);
    }

    function toggleConditionalTransfer(address account, bool allowed) external onlyOwner whenNotPaused {
        allowedTransfer[account] = allowed;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
