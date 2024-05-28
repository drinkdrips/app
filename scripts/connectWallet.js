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
                web3 = new Web3(provider);
                await provider.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                userAccount = accounts[0];
                connectButton.innerText = `Conectado: ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
                connectButton.disabled = true; // Desativa o botão após a conexão

                // Habilitar os outros botões após a conexão
                enableButtons();

                alert('Conexão realizada com sucesso!'); // Adiciona uma mensagem de sucesso
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

    // Tornar as funções disponíveis globalmente para uso em outros scripts
    window.connectWallet = connectWallet;
    window.createContractInstance = createContractInstance;
    window.getUserAccount = () => userAccount;  // Adicionar esta linha
});
