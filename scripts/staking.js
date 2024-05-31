// Assumindo que Web3 está disponível globalmente
const web3 = new Web3(window.ethereum);
const stakingContractAddress = '0x318D6a1b84d06fc0dA16eB628A8C1a579B2307c3'; // Endereço do contrato StakingContract
const stakingContractABI = [
	{
		"inputs": [],
		"name": "claimRewards",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "distributeRewards",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_drinkToken",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_dripsToken",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Paused",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "staker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "RewardClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			}
		],
		"name": "RewardsDistributed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "stakeTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "staker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TokensStaked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "staker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TokensUnstaked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unpause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Unpaused",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "unstakeTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "staker",
				"type": "address"
			}
		],
		"name": "calculateRewards",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "drinkToken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "dripsToken",
		"outputs": [
			{
				"internalType": "contract DripsToken",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lastClaimTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "rewardBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rewardRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "stakingBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const stakingContract = new web3.eth.Contract(stakingContractABI, stakingContractAddress);

// Função para stake de tokens
export async function stakeTokens(fromAddress, amount) {
    return await stakingContract.methods.stakeTokens(amount).send({ from: fromAddress });
}

// Função para unstake de tokens
export async function unstakeTokens(fromAddress, amount) {
    return await stakingContract.methods.unstakeTokens(amount).send({ from: fromAddress });
}

// Função para reivindicar recompensas
export async function claimRewards(fromAddress) {
    return await stakingContract.methods.claimRewards().send({ from: fromAddress });
}

// Função para distribuir recompensas
export async function distributeRewards(fromAddress) {
    return await stakingContract.methods.distributeRewards().send({ from: fromAddress });
}
// Função para pausar o contrato
export async function pause(fromAddress) {
    return await stakingContract.methods.pause().send({ from: fromAddress });
}

// Função para retomar o contrato
export async function unpause(fromAddress) {
    return await stakingContract.methods.unpause().send({ from: fromAddress });
}

// Função para transferir a propriedade do contrato
export async function transferOwnership(fromAddress, newOwner) {
    return await stakingContract.methods.transferOwnership(newOwner).send({ from: fromAddress });
}

// Função para renunciar à propriedade do contrato
export async function renounceOwnership(fromAddress) {
    return await stakingContract.methods.renounceOwnership().send({ from: fromAddress });
}

// Função para calcular as recompensas de um staker específico
export async function calculateRewards(stakerAddress) {
    return await stakingContract.methods.calculateRewards(stakerAddress).call();
}

// Função para obter o endereço do token drink
export async function getDrinkTokenAddress() {
    return await stakingContract.methods.drinkToken().call();
}

// Função para obter o endereço do token drips
export async function getDripsTokenAddress() {
    return await stakingContract.methods.dripsToken().call();
}

// Função para obter o último horário de reivindicação de recompensas de um staker específico
export async function getLastClaimTime(stakerAddress) {
    return await stakingContract.methods.lastClaimTime(stakerAddress).call();
}

// Função para obter o endereço do proprietário do contrato
export async function getOwner() {
    return await stakingContract.methods.owner().call();
}

// Função para verificar se o contrato está pausado
export async function isPaused() {
    return await stakingContract.methods.paused().call();
}

// Função para obter o saldo de recompensas de um staker específico
export async function getRewardBalance(stakerAddress) {
    return await stakingContract.methods.rewardBalance(stakerAddress).call();
}

// Função para obter a taxa de recompensas
export async function getRewardRate() {
    return await stakingContract.methods.rewardRate().call();
}

// Função para obter o saldo de tokens em stake de um endereço específico
export async function getStakingBalance(address) {
    try {
        const balance = await stakingContract.methods.stakingBalance(address).call();
        return balance;
    } catch (error) {
        console.error('Erro ao obter saldo de staking:', error);
        throw error;
    }
}
