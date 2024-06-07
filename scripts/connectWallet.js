// Função para converter Wei para Tokens
function convertWeiToTokens(valueInWei) {
    return web3.utils.fromWei(valueInWei, 'ether');
}

// Inicialize contratos
const web3 = new Web3(window.ethereum);

const drinkTokenContractABI = [
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
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isWhiteListed",
                "type": "bool"
            }
        ],
        "name": "AddressWhiteListed",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "addToWhiteList",
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
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "removeFromWhiteList",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
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
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "whiteList",
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
        "name": "WHITELIST_DRINK_PRICE_USD",
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
const drinkTokenContractAddress = '0x3FC6d60A0360401666aF50162BCDbb3423879c61';
window.drinkTokenContract = new web3.eth.Contract(drinkTokenContractABI, drinkTokenContractAddress);

const dripsTokenContractABI = [
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
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "grantReward",
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
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
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
        "name": "ownerMint",
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
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "PenaltyApplied",
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
        "name": "RewardGranted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_stakingContract",
                "type": "address"
            }
        ],
        "name": "setStakingContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "allowed",
                "type": "bool"
            }
        ],
        "name": "toggleConditionalTransfer",
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
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TokensBurned",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
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
        "name": "TokensMinted",
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
const dripsTokenContractAddress = '0x3720D62bcFb9b55890F5B22bb4C8e0143405437E';
window.dripsTokenContract = new web3.eth.Contract(dripsTokenContractABI, dripsTokenContractAddress);

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
const stakingContractAddress = '0xAF7DC2DD0705c6d3022D2F3bA71122c30A10540f';
window.stakingContract = new web3.eth.Contract(stakingContractABI, stakingContractAddress);

// Funções para obter saldos
window.getDrinkBalance = async function(userAddress) {
    try {
        const balance = await window.drinkTokenContract.methods.balanceOf(userAddress).call();
        return balance;
    } catch (error) {
        console.error('Erro ao obter o saldo de DRINK:', error);
        throw error;
    }
}

window.getDripsBalance = async function(userAddress) {
    try {
        const balance = await window.dripsTokenContract.methods.balanceOf(userAddress).call();
        return balance;
    } catch (error) {
        console.error('Erro ao obter o saldo de DRIPS:', error);
        throw error;
    }
}

window.getStakingBalance = async function(userAddress) {
    try {
        const balance = await window.stakingContract.methods.stakingBalance(userAddress).call();
        return balance;
    } catch (error) {
        console.error('Erro ao obter saldo de staking:', error);
        throw error;
    }
}

window.getCalculateRewards = async function(userAddress) {
    try {
        const claimable = await window.stakingContract.methods.calculateRewards(userAddress).call();
        return claimable;
    } catch (error) {
        console.error('Erro ao obter DRIPS a reivindicar:', error);
        throw error;
    }
}

// Função para atualizar os saldos
async function refreshBalances() {
    const userAccount = window.getUserAccount();
    if (userAccount) {
        try {
            const drinkBalanceWei = await window.getDrinkBalance(userAccount);
            const drinkBalance = convertWeiToTokens(drinkBalanceWei);
            console.log('Saldo de DRINK:', drinkBalance);
            document.getElementById('drinkBalance').innerText = drinkBalance;

            const dripsBalanceWei = await window.getDripsBalance(userAccount);
            const dripsBalance = convertWeiToTokens(dripsBalanceWei);
            console.log('Saldo de DRIPS:', dripsBalance);
            document.getElementById('dripsBalance').innerText = dripsBalance;

            const stakingBalanceWei = await window.getStakingBalance(userAccount);
            const stakingBalance = convertWeiToTokens(stakingBalanceWei);
            console.log('Saldo de tokens em stake:', stakingBalance);
            document.getElementById('stakingBalance').innerText = stakingBalance;

            const claimableDripsWei = await window.getCalculateRewards(userAccount);
            const claimableDrips = convertWeiToTokens(claimableDripsWei);
            console.log('DRIPS a Reivindicar:', claimableDrips);
            document.getElementById('claimableDrips').innerText = claimableDrips;

            // Continue para outros saldos, se necessário...
        } catch (error) {
            console.error('Erro ao obter os saldos:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.querySelector('.connect-button');
    let web3;
    let userAccount;

    if (!connectButton) {
        console.error("Botão de conexão não encontrado.");
        return;
    }

    const disableButtons = () => {
        document.getElementById('buyDrinksForm').querySelector('button').disabled = true;
        document.getElementById('approveDrinksForm').querySelector('button').disabled = true;
        document.getElementById('stakeDrinksForm').querySelector('button').disabled = true;
        document.getElementById('unstakeDrinksForm').querySelector('button').disabled = true;
        document.getElementById('addLiquidityForm').querySelector('button').disabled = true;
        document.getElementById('removeLiquidityForm').querySelector('button').disabled = true;
        document.getElementById('swapButton').querySelector('button').disabled = true;
        document.getElementById('claimDripsForm').querySelector('button').disabled = true;
        document.getElementById('createProposalForm').querySelector('button').disabled = true;
        document.getElementById('governanceProposals').querySelector('button').disabled = true;
    };

    const enableButtons = () => {
        document.getElementById('buyDrinksForm').querySelector('button').disabled = false;
        document.getElementById('approveDrinksForm').querySelector('button').disabled = false;
        document.getElementById('stakeDrinksForm').querySelector('button').disabled = false;
        document.getElementById('unstakeDrinksForm').querySelector('button').disabled = false;
        document.getElementById('addLiquidityForm').querySelector('button').disabled = false;
        document.getElementById('removeLiquidityForm').querySelector('button').disabled = false;
        document.getElementById('swapButton').querySelector('button').disabled = false;
        document.getElementById('claimDripsForm').querySelector('button').disabled = false;
        document.getElementById('createProposalForm').querySelector('button').disabled = false;
        document.getElementById('governanceProposals').querySelector('button').disabled = false;
    };

    disableButtons();

    connectButton.addEventListener('click', async () => {
        await connectWallet();
    });

    async function connectWallet() {
        if (window.ethereum) {
            try {
                const provider = window.ethereum;
                if (!web3) {
                    web3 = new Web3(provider);
                }
                await provider.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                userAccount = accounts[0];
                connectButton.innerText = `Conectado: ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
                connectButton.disabled = true; // Desativa o botão após a conexão

                // Habilitar os outros botões após a conexão
                enableButtons();

                alert('Conexão realizada com sucesso!');

                // Atualiza os saldos após a conexão bem-sucedida
                await refreshBalances();

                // Adiciona o evento 'disconnect'
                window.ethereum.on('disconnect', (error) => {
                    console.log('MetaMask desconectado:', error);
                    disableButtons();
                    connectButton.innerText = 'Conectar MetaMask';
                    connectButton.disabled = false;
                });

            } catch (error) {
                console.error('Erro ao conectar com MetaMask:', error);
                alert('Conexão recusada.');
            }
        } else {
            alert('MetaMask não detectado.');
        }
    }

    function createContractInstance(abi, contractAddress) {
        if (!web3) {
            console.error('web3 não está inicializado.');
            return null;
        }
        return new web3.eth.Contract(abi, contractAddress);
    }

    window.connectWallet = connectWallet;
    window.createContractInstance = createContractInstance;
    window.getUserAccount = () => userAccount;

    // Atualiza os saldos ao carregar a página
    window.addEventListener('load', async () => {
        await refreshBalances();
    });
});

// Função para compra de Tokens
window.buyTokensWithUsd = async function(userAccount, amount) {
    try {
        console.log('User Account:', userAccount);
        console.log('Amount:', amount);
        const result = await window.drinkTokenContract.methods.buyTokensWithUsd(amount).send({ from: userAccount });
        console.log('Compra de DRINKS realizada com sucesso');
        return result;
    } catch (error) {
        console.error('Erro ao comprar tokens durante a pré-venda:', error.message);
        throw error;
    }
}

// Listener para o formulário de compra de tokens
document.getElementById('buyDrinksForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const amount = document.getElementById('usdAmount').value;
        console.log('Amount from input:', amount);
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const userAccount = accounts[0];
        console.log('User Account:', userAccount);

        if (userAccount) {
            await window.buyTokensWithUsd(userAccount, amount);
            await refreshBalances();
        } else {
            console.error('Usuário não está conectado');
        }
    } catch (error) {
        console.error('Erro ao comprar tokens durante a pré-venda:', error.message);
    }
});

// Função para Aprovação e Manipulação de Drinks (Aprovação para Stake)
window.approve = async function(spenderAddress, amountInTokens) {
    try {
        // Obtenha a conta do usuário logado na MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const userAccount = accounts[0];

        // Converta o valor de tokens para Wei
        const amountInWei = web3.utils.toWei(amountInTokens.toString(), 'ether');

        // Aprovar o spender
        const result = await window.drinkTokenContract.methods.approve(spenderAddress, amountInWei).send({ from: userAccount });
        console.log('Aprovação bem-sucedida');
        return result;
    } catch (error) {
        console.error('Erro ao aprovar:', error.message);
        throw error;
    }
}

// Listener para o formulário de aprovação de tokens para Stake
    document.getElementById('approveDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const amountInTokens = document.getElementById('approveAmount').value;
            console.log('amountInTokens from input:', amountInTokens);
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const userAccount = accounts[0];
            console.log('User Account:', userAccount);
            const spenderAddress = stakingContractAddress;
            if (userAccount) {
                await window.approve(spenderAddress, amountInTokens);
                console.log('Aprovação bem-sucedida para stake de tokens');
            } else {
                console.error('Usuário não está conectado');
            }
        } catch (error) {
            console.error('Erro ao aprovar stake de tokens:', error.message);
        }
    });


// Função para Stake de Tokens
window.stakeTokens = async function(userAccount, amount) {
    try {
        // Converta o valor de tokens para Wei
        const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
        console.log(`Staking ${amountInWei} tokens from ${userAccount}`);
    console.log(web3.utils.fromWei(amountInWei, 'ether')); //Log para prova real (converte de volta de Wei para Ether)
        
        // Chame o método stakeTokens no contrato de staking
        const result = await window.stakingContract.methods.stakeTokens(amountInWei).send({ from: userAccount });
        console.log('Stake realizado com sucesso');
        return result;
    } catch (error) {
        console.error('Erro ao tentar fazer Stake:', error);
        // Verifique se há mais detalhes na propriedade `error.data`
        if (error.data) {
            console.error('Detalhes do erro:', error.data);
        }
        throw error;
    }
}

// Listener para o formulário de Stake
document.getElementById('stakeDrinksForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const amount = document.getElementById('stakeAmount').value;
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const userAccount = accounts[0];
        if (userAccount) {
            await window.stakeTokens(userAccount, amount);  // Passando userAccount e amount corretamente
            await refreshBalances();
        } else {
            console.error('Usuário não está conectado');
        }
    } catch (error) {
        console.error('Erro ao fazer staking de tokens:', error.message);
    }
});

// Função para Unstake de Tokens
window.unstakeTokens = async function(userAccount, amount) {
    try {
        // Converta o valor de tokens para Wei
        const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
        
        console.log(`Unstaking ${amountInWei} tokens from ${userAccount}`);

        // Chame o método unstakeTokens no contrato de staking
        const result = await window.stakingContract.methods.unstakeTokens(amountInWei).send({ from: userAccount });
        console.log('Unstake realizado com sucesso');
        return result;
    } catch (error) {
        console.error('Erro ao tentar fazer Unstake:', error);
        // Verifique se há mais detalhes na propriedade `error.data`
        if (error.data) {
            console.error('Detalhes do erro:', error.data);
        }
        throw error;
    }
}

// Listener para o formulário de Unstake
document.getElementById('unstakeDrinksForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const amount = document.getElementById('unstakeAmount').value;
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const userAccount = accounts[0];

        if (!userAccount) {
            console.error('Usuário não está conectado');
            return;
        }

        // Tente fazer o unstake dos tokens
        await window.unstakeTokens(userAccount, amount);
        await refreshBalances();
    } catch (error) {
        console.error('Erro ao fazer unstake de tokens:', error.message);
        if (error.data) {
            console.error('Detalhes do erro:', error.data);
        }
    }
});


// Função para calcular recompensas
window.calculateRewards = async function(stakerAddress) {
    try {
        const rewards = await window.stakingContract.methods.calculateRewards(stakerAddress).call();
        return rewards;
    } catch (error) {
        console.error('Erro ao calcular recompensas:', error);
        throw error;
    }
}

// Função para reivindicar recompensas
window.claimRewards = async function(userAccount) {
    try {
        const result = await window.stakingContract.methods.claimRewards().send({ from: userAccount });
        console.log('Recompensas reivindicadas com sucesso');
        return result;
    } catch (error) {
        console.error('Erro ao reivindicar recompensas:', error.message);
        if (error.data) {
            console.error('Detalhes do erro:', error.data);
        }
        throw error;
    }
}

// Listener para o formulário de reivindicação de recompensas
document.getElementById('claimDripsForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const userAccount = accounts[0];

        if (!userAccount) {
            console.error('Usuário não está conectado');
            return;
        }

        // Tente reivindicar as recompensas
        await window.claimRewards(userAccount);
        await refreshBalances();
    } catch (error) {
        console.error('Erro ao reivindicar recompensas:', error.message);
        if (error.data) {
            console.error('Detalhes do erro:', error.data);
        }
    }
});
