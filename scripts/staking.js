// Assumindo que Web3 está disponível globalmente
const web3 = new Web3(window.ethereum);

const stakingContractABI = [ /* ABI do StakingContract */ ];
const stakingContractAddress = '0x...'; // Endereço do contrato StakingContract

const stakingContract = new web3.eth.Contract(stakingContractABI, stakingContractAddress);

export async function stakeTokens(fromAddress, amount) {
    return await stakingContract.methods.stake(amount).send({ from: fromAddress });
}

export async function unstakeTokens(fromAddress, amount) {
    return await stakingContract.methods.unstake(amount).send({ from: fromAddress });
}

export async function claimDrips(fromAddress) {
    return await stakingContract.methods.claimDrips().send({ from: fromAddress });
}
