document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.ethereum !== 'undefined') {
        window.web3 = new Web3(window.ethereum);
        console.log('Web3 foi inicializado com o provedor do MetaMask');
    } else {
        console.error('MetaMask não está disponível. Por favor, instale MetaMask.');
        return; // Pare a execução se MetaMask não estiver disponível
    }

    const drinkTokenAddress = '0xe2c5Ec55661367162b6f6dccf017deA678b5EEF8'; // Endereço do contrato DrinkToken
     // ABI do contrato DrinkToken
    const drinkTokenABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "usdAmount",
				"type": "uint256"
			}
		],
		"name": "buyTokensWithUsd",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endPresale",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mintTokens",
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
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountPaid",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountBought",
				"type": "uint256"
			}
		],
		"name": "TokensPurchased",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
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
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
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
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
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
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DRINK_PRICE_USD",
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
		"name": "MAX_SUPPLY",
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
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
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
		"inputs": [],
		"name": "PRE_SALE_SUPPLY",
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
		"name": "presaleActive",
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
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
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
		"name": "tokensPurchased",
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
		"name": "totalSupply",
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

    // Certifique-se de que o Web3 está inicializado antes de criar a instância do contrato
    if (window.web3 && window.web3.eth) {
        window.drinkTokenContract = new window.web3.eth.Contract(drinkTokenABI, drinkTokenAddress);
        console.log('Instância do contrato DrinkToken criada com sucesso');
    } else {
        console.error('web3 não está inicializado.');
        return; // Pare a execução se web3 não estiver inicializado corretamente
    }

    // Função para obter saldo de DRINK
    async function getDrinkBalance(address) {
        try {
            const balance = await window.drinkTokenContract.methods.balanceOf(address).call();
            return balance;
        } catch (error) {
            console.error('Erro ao obter saldo de DRINK:', error);
            throw error;
        }
    }

    // Função para comprar DRINK
    async function buyDrink(fromAddress, amount, paymentToken) {
        try {
            await window.drinkTokenContract.methods.buyTokensWithUsd(amount).send({ from: fromAddress });
            console.log('Compra de DRINK realizada com sucesso');
        } catch (error) {
            console.error('Erro ao comprar DRINK:', error);
            throw error;
        }
    }

    // Função para aprovar o contrato de staking a gastar tokens em nome do usuário
    async function approve(fromAddress, spenderAddress, amount) {
        try {
            await window.drinkTokenContract.methods.approve(spenderAddress, amount).send({ from: fromAddress });
            console.log('Aprovação bem-sucedida para gastar tokens em nome do usuário');
        } catch (error) {
            console.error('Erro ao aprovar gasto de tokens:', error);
            throw error;
        }
    }

    // Função para verificar a quantidade permitida para gasto por um endereço específico
    async function allowance(ownerAddress, spenderAddress) {
        try {
            const remaining = await window.drinkTokenContract.methods.allowance(ownerAddress, spenderAddress).call();
            return remaining;
        } catch (error) {
            console.error('Erro ao verificar a quantidade permitida:', error);
            throw error;
        }
    }

    // Função para transferir tokens para outro endereço
    async function transfer(fromAddress, toAddress, amount) {
        try {
            await window.drinkTokenContract.methods.transfer(toAddress, amount).send({ from: fromAddress });
            console.log('Transferência de tokens realizada com sucesso');
        } catch (error) {
            console.error('Erro ao transferir tokens:', error);
            throw error;
        }
    }

    // Função para transferir tokens de um endereço para outro
    async function transferFrom(fromAddress, senderAddress, recipientAddress, amount) {
        try {
            await window.drinkTokenContract.methods.transferFrom(senderAddress, recipientAddress, amount).send({ from: fromAddress });
            console.log('Transferência de tokens de um endereço para outro realizada com sucesso');
        } catch (error) {
            console.error('Erro ao transferir tokens de um endereço para outro:', error);
            throw error;
        }
    }

    // Função para pausar o contrato
    async function pause(fromAddress) {
        try {
            await window.drinkTokenContract.methods.pause().send({ from: fromAddress });
            console.log('Contrato pausado com sucesso');
        } catch (error) {
            console.error('Erro ao pausar o contrato:', error);
            throw error;
        }
    }

    // Função para despausar o contrato
    async function unpause(fromAddress) {
        try {
            await window.drinkTokenContract.methods.unpause().send({ from: fromAddress });
            console.log('Contrato despausado com sucesso');
        } catch (error) {
            console.error('Erro ao despausar o contrato:', error);
            throw error;
        }
    }

    // Função para renunciar à propriedade do contrato
    async function renounceOwnership(fromAddress) {
        try {
            await window.drinkTokenContract.methods.renounceOwnership().send({ from: fromAddress });
            console.log('Propriedade do contrato renunciada com sucesso');
        } catch (error) {
            console.error('Erro ao renunciar à propriedade do contrato:', error);
            throw error;
        }
    }

    // Função para transferir a propriedade do contrato para outro endereço
    async function transferOwnership(fromAddress, newOwnerAddress) {
        try {
            await window.drinkTokenContract.methods.transferOwnership(newOwnerAddress).send({ from: fromAddress });
            console.log('Propriedade do contrato transferida com sucesso');
        } catch (error) {
            console.error('Erro ao transferir a propriedade do contrato:', error);
            throw error;
        }
    }

    // Tornar as funções disponíveis globalmente
    window.getDrinkBalance = getDrinkBalance;
    window.buyDrink = buyDrink;
    window.approve = approve;
    window.allowance = allowance;
    window.transfer = transfer;
    window.transferFrom = transferFrom;
    window.pause = pause;
    window.unpause = unpause;
    window.renounceOwnership = renounceOwnership;
    window.transferOwnership = transferOwnership;
});
