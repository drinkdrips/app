// Função para converter Wei para Tokens
function convertWeiToTokens(valueInWei) {
    return web3.utils.fromWei(valueInWei, 'ether');
}

// Inicialize contratos
const web3 = new Web3(window.ethereum);

const drinkTokenContractABI = [ /* ABI do contrato de token DRINK */ ];
const drinkTokenContractAddress = '0xEndereçoDoContratoDrink';
window.drinkTokenContract = new web3.eth.Contract(drinkTokenContractABI, drinkTokenContractAddress);

const dripsTokenContractABI = [ /* ABI do contrato de token DRIPS */ ];
const dripsTokenContractAddress = '0xEndereçoDoContratoDrips';
window.dripsTokenContract = new web3.eth.Contract(dripsTokenContractABI, dripsTokenContractAddress);

const stakingContractABI = [ /* ABI do contrato de staking */ ];
const stakingContractAddress = '0xEndereçoDoContratoDeStaking';
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

window.getClaimableDrips = async function(userAddress) {
    try {
        const claimable = await window.stakingContract.methods.claimableDrips(userAddress).call();
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

            const claimableDripsWei = await window.getClaimableDrips(userAccount);
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
        document.getElementById('refreshBalancesBtn').disabled = true;
        document.getElementById('buyDrinksForm').querySelector('button').disabled = true;
        document.getElementById('approveDrinksForm').querySelector('button').disabled = true;
        document.getElementById('stakeDrinksForm').querySelector('button').disabled = true;
        document.getElementById('unstakeDrinksForm').querySelector('button').disabled = true;
        document.getElementById('addLiquidityForm').querySelector('button').disabled = true;
        document.getElementById('removeLiquidityForm').querySelector('button').disabled = true;
        document.getElementById('swapForm').querySelector('button').disabled = true;
        document.getElementById('claimDripsForm').querySelector('button').disabled = true;
        document.getElementById('createProposalForm').querySelector('button').disabled = true;
        document.getElementById('governanceProposals').querySelector('button').disabled = true;
    };

    const enableButtons = () => {
        document.getElementById('refreshBalancesBtn').disabled = false;
        document.getElementById('buyDrinksForm').querySelector('button').disabled = false;
        document.getElementById('approveDrinksForm').querySelector('button').disabled = false;
        document.getElementById('stakeDrinksForm').querySelector('button').disabled = false;
        document.getElementById('unstakeDrinksForm').querySelector('button').disabled = false;
        document.getElementById('addLiquidityForm').querySelector('button').disabled = false;
        document.getElementById('removeLiquidityForm').querySelector('button').disabled = false;
        document.getElementById('swapForm').querySelector('button').disabled = false;
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
