document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.ethereum !== 'undefined') {
        window.web3 = new Web3(window.ethereum);
        console.log('Web3 foi inicializado com o provedor do MetaMask');
    } else {
        console.error('MetaMask não está disponível. Por favor, instale MetaMask.');
        return; // Pare a execução se MetaMask não estiver disponível
    }
    
    const dripsTokenAddress = '0x3F4bD5DfB17001F259967465822d1cEf8a892696'; // Substitua pelo endereço real do contrato
    const dripsTokenAbi = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "applyPenalty",
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
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "burn",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_initialOwner",
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
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "conditionalTransfer",
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
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "ConditionalTransfer",
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
            "anonymous": false,
            "inputs": [],
            "name": "Paused",
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
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "allowedTransfer",
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
            "name": "stakingContract",
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

    window.dripsTokenContract = new web3.eth.Contract(dripsTokenAbi, dripsTokenAddress);

    async function getDripsBalance(account) {
        try {
            const balance = await window.dripsTokenContract.methods.balanceOf(account).call();
            return web3.utils.fromWei(balance, 'ether'); // Assumindo que o token é de 18 decimais
        } catch (error) {
            console.error('Erro ao consultar saldo de DRIPS:', error);
            return null;
        }
    }

    // Exemplo de função para transferir DRIPS
    async function transferDrips(fromAccount, toAccount, amount) {
        try {
            const amountInWei = web3.utils.toWei(amount, 'ether'); // Assumindo que o token é de 18 decimais
            const receipt = await window.dripsTokenContract.methods.transfer(toAccount, amountInWei).send({ from: fromAccount });
            return receipt;
        } catch (error) {
            console.error('Erro ao transferir DRIPS:', error);
            return null;
        }
    }

    // Função para aplicar penalidade
    async function applyPenalty(fromAccount, amount) {
        try {
            const amountInWei = web3.utils.toWei(amount, 'ether');
            const receipt = await window.dripsTokenContract.methods.applyPenalty(fromAccount, amountInWei).send({ from: fromAccount });
            return receipt;
        } catch (error) {
            console.error('Erro ao aplicar penalidade:', error);
            return null;
        }
    }

    // Função para aprovar
    async function approve(spender, amount) {
        try {
            const amountInWei = web3.utils.toWei(amount, 'ether');
            const receipt = await window.dripsTokenContract.methods.approve(spender, amountInWei).send();
            return receipt;
        } catch (error) {
            console.error('Erro ao aprovar:', error);
            return null;
        }
    }

    // Função para queimar tokens
    async function burn(amount) {
        try {
            const amountInWei = web3.utils.toWei(amount, 'ether');
            const receipt = await window.dripsTokenContract.methods.burn(amountInWei).send();
            return receipt;
        } catch (error) {
            console.error('Erro ao queimar tokens:', error);
            return null;
        }
    }

    // Função para transferência condicional
    async function conditionalTransfer(to, amount) {
        try {
            const amountInWei = web3.utils.toWei(amount, 'ether');
            const receipt = await window.dripsTokenContract.methods.conditionalTransfer(to, amountInWei).send();
            return receipt;
        } catch (error) {
            console.error('Erro ao realizar transferência condicional:', error);
            return null;
        }
    }

    // Função para diminuir a permissão
    async function decreaseAllowance(spender, subtractedValue) {
        try {
            const amountInWei = web3.utils.toWei(subtractedValue, 'ether');
            const receipt = await window.dripsTokenContract.methods.decreaseAllowance(spender, amountInWei).send();
            return receipt;
        } catch (error) {
            console.error('Erro ao diminuir permissão:', error);
            return null;
        }
    }

    // Função para aumentar a permissão
    async function increaseAllowance(spender, addedValue) {
        try {
            const amountInWei = web3.utils.toWei(addedValue, 'ether');
            const receipt = await window.dripsTokenContract.methods.increaseAllowance(spender, amountInWei).send();
            return receipt;
        } catch (error) {
            console.error('Erro ao aumentar permissão:', error);
            return null;
        }
    }

    // Função para verificar o allowance
    async function allowance(owner, spender) {
        try {
            const allowanceAmount = await window.dripsTokenContract.methods.allowance(owner, spender).call();
            return web3.utils.fromWei(allowanceAmount, 'ether');
        } catch (error) {
            console.error('Erro ao verificar allowance:', error);
            return null;
        }
    }

    // Função para verificar se a transferência é permitida
    async function allowedTransfer(account) {
        try {
            const isAllowed = await window.dripsTokenContract.methods.allowedTransfer(account).call();
            return isAllowed;
        } catch (error) {
            console.error('Erro ao verificar se a transferência é permitida:', error);
            return null;
        }
    }

    // Função para obter o balanceOf
    async function balanceOf(account) {
        try {
            const balance = await window.dripsTokenContract.methods.balanceOf(account).call();
            return web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            console.error('Erro ao obter saldo:', error);
            return null;
        }
    }

    // Função para obter decimals
    async function decimals() {
        try {
            const decimals = await window.dripsTokenContract.methods.decimals().call();
            return decimals;
        } catch (error) {
            console.error('Erro ao obter decimals:', error);
            return null;
        }
    }

    // Função para obter name
    async function name() {
        try {
            const name = await window.dripsTokenContract.methods.name().call();
            return name;
        } catch (error) {
            console.error('Erro ao obter name:', error);
            return null;
        }
    }

    // Função para obter owner
    async function owner() {
        try {
            const ownerAddress = await window.dripsTokenContract.methods.owner().call();
            return ownerAddress;
        } catch (error) {
            console.error('Erro ao obter owner:', error);
            return null;
        }
    }

    // Função para verificar se o contrato está pausado
    async function paused() {
        try {
            const isPaused = await window.dripsTokenContract.methods.paused().call();
            return isPaused;
        } catch (error) {
            console.error('Erro ao verificar se o contrato está pausado:', error);
            return null;
        }
    }

    // Função para obter o stakingContract
    async function stakingContract() {
        try {
            const stakingContractAddress = await window.dripsTokenContract.methods.stakingContract().call();
            return stakingContractAddress;
        } catch (error) {
            console.error('Erro ao obter stakingContract:', error);
            return null;
        }
    }

    // Função para obter o symbol
    async function symbol() {
        try {
            const symbol = await window.dripsTokenContract.methods.symbol().call();
            return symbol;
        } catch (error) {
            console.error('Erro ao obter symbol:', error);
            return null;
        }
    }

    // Função para obter totalSupply
    async function totalSupply() {
        try {
            const totalSupply = await window.dripsTokenContract.methods.totalSupply().call();
            return web3.utils.fromWei(totalSupply, 'ether');
        } catch (error) {
            console.error('Erro ao obter totalSupply:', error);
            return null;
        }
    }

    // Torne as funções disponíveis globalmente para uso em outros scripts
    window.getDripsBalance = getDripsBalance;
    window.transferDrips = transferDrips;
    window.applyPenalty = applyPenalty;
    window.approve = approve;
    window.burn = burn;
    window.conditionalTransfer = conditionalTransfer;
    window.decreaseAllowance = decreaseAllowance;
    window.increaseAllowance = increaseAllowance;
    window.allowance = allowance;
    window.allowedTransfer = allowedTransfer;
    window.balanceOf = balanceOf;
    window.decimals = decimals;
    window.name = name;
    window.owner = owner;
    window.paused = paused;
    window.stakingContract = stakingContract;
    window.symbol = symbol;
    window.totalSupply = totalSupply;
});
