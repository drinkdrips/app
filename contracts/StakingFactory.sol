// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./StakingContract.sol";

contract StakingFactory {
    event StakingContractDeployed(address indexed contractAddress, address indexed owner);

    function deployStakingContract(address _drinkToken, address _dripsToken) external {
        StakingContract stakingContract = new StakingContract(_drinkToken, _dripsToken);
        stakingContract.transferOwnership(msg.sender); // Transfer ownership to the deployer
        emit StakingContractDeployed(address(stakingContract), msg.sender);
    }
}
