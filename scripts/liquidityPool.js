// Inicializa o Web3 e o contrato inteligente
const web3 = new Web3(window.ethereum);
const liquidityPoolContractAddress = '0x027fECb087745D83f12411D84d745D10A947480C';
const liquidityPoolABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "addEthLiquidity",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenAmount",
        "type": "uint256"
      }
    ],
    "name": "addTokenLiquidity",
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
        "name": "provider",
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
        "name": "ethAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenAmount",
        "type": "uint256"
      }
    ],
    "name": "LiquidityAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "provider",
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
        "name": "ethAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenAmount",
        "type": "uint256"
      }
    ],
    "name": "LiquidityRemoved",
    "type": "event"
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
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "ethAmount",
        "type": "uint256"
      }
    ],
    "name": "removeEthLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenAmount",
        "type": "uint256"
      }
    ],
    "name": "removeTokenLiquidity",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "liquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "ethAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tokenAmount",
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
  }
];
const liquidityPoolContract = new web3.eth.Contract(liquidityPoolABI, liquidityPoolContractAddress);

// Função para adicionar liquidez em Ethereum
window.addEthLiquidity = async function(userAccount, tokenAddress, ethAmount) {
    try {
        const amountInWei = web3.utils.toWei(ethAmount.toString(), 'ether');
        console.log(`Adding ${amountInWei} Wei ETH liquidity from ${userAccount}`);

        const result = await liquidityPoolContract.methods.addEthLiquidity(tokenAddress).send({ from: userAccount, value: amountInWei });
        console.log('ETH liquidity added successfully');
        return result;
    } catch (error) {
        console.error('Error adding ETH liquidity:', error);
        if (error.data) {
            console.error('Error details:', error.data);
        }
        throw error;
    }
};

// Função para adicionar liquidez em Token
window.addTokenLiquidity = async function(userAccount, tokenAddress, tokenAmount) {
    try {
        const amountInWei = web3.utils.toWei(tokenAmount.toString(), 'ether');
        console.log(`Adding ${amountInWei} Wei token liquidity from ${userAccount}`);

        const result = await liquidityPoolContract.methods.addTokenLiquidity(tokenAddress, amountInWei).send({ from: userAccount });
        console.log('Token liquidity added successfully');
        return result;
    } catch (error) {
        console.error('Error adding token liquidity:', error);
        if (error.data) {
            console.error('Error details:', error.data);
        }
        throw error;
    }
};

// Função para remover liquidez em Ethereum
window.removeEthLiquidity = async function(userAccount, tokenAddress, ethAmount) {
    try {
        const amountInWei = web3.utils.toWei(ethAmount.toString(), 'ether');
        console.log(`Removing ${amountInWei} Wei ETH liquidity from ${userAccount}`);

        const result = await liquidityPoolContract.methods.removeEthLiquidity(tokenAddress, amountInWei).send({ from: userAccount });
        console.log('ETH liquidity removed successfully');
        return result;
    } catch (error) {
        console.error('Error removing ETH liquidity:', error);
        if (error.data) {
            console.error('Error details:', error.data);
        }
        throw error;
    }
};

// Função para remover liquidez em Token
window.removeTokenLiquidity = async function(userAccount, tokenAddress, tokenAmount) {
    try {
        const amountInWei = web3.utils.toWei(tokenAmount.toString(), 'ether');
        console.log(`Removing ${amountInWei} Wei token liquidity from ${userAccount}`);

        const result = await liquidityPoolContract.methods.removeTokenLiquidity(tokenAddress, amountInWei).send({ from: userAccount });
        console.log('Token liquidity removed successfully');
        return result;
    } catch (error) {
        console.error('Error removing token liquidity:', error);
        if (error.data) {
            console.error('Error details:', error.data);
        }
        throw error;
    }
};

// Manipulação de formulário para adicionar e remover liquidez
document.getElementById('addLiquidityForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const ethAmount = document.getElementById('addLiquidityEthAmount').value;
    const tokenAmount = document.getElementById('addLiquidityDrinkAmount').value;
    const userAccount = (await web3.eth.getAccounts())[0];
    const tokenAddress = '0xe2c5Ec55661367162b6f6dccf017deA678b5EEF8';  // Substitua pelo endereço do token

    if (ethAmount > 0) {
        await addEthLiquidity(userAccount, tokenAddress, ethAmount);
    }
    if (tokenAmount > 0) {
        await addTokenLiquidity(userAccount, tokenAddress, tokenAmount);
    }
});

document.getElementById('removeLiquidityForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const ethAmount = document.getElementById('removeLiquidityEthAmount').value;
    const tokenAmount = document.getElementById('removeLiquidityDrinkAmount').value;
    const userAccount = (await web3.eth.getAccounts())[0];
    const tokenAddress = '0xe2c5Ec55661367162b6f6dccf017deA678b5EEF8';  // Substitua pelo endereço do token

    if (ethAmount > 0) {
        await removeEthLiquidity(userAccount, tokenAddress, ethAmount);
    }
    if (tokenAmount > 0) {
        await removeTokenLiquidity(userAccount, tokenAddress, tokenAmount);
    }
});
