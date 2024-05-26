// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./StakingContract.sol";

contract StakingFactory {
    event StakingContractDeployed(address indexed contractAddress);

    function deployStakingContract(address _drinkToken, address _dripsToken) external {
        StakingContract stakingContract = new StakingContract(_drinkToken, _dripsToken);
        emit StakingContractDeployed(address(stakingContract));
    }
}
