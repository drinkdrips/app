document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.querySelector('.connect-button');
    let userAccount;

    if (!connectButton) {
        console.error("Botão de conexão não encontrado.");
        return;
    }

    const disableButtons = () => {
        document.querySelectorAll('button').forEach(button => button.disabled = true);
    };

    const enableButtons = () => {
        document.querySelectorAll('button').forEach(button => button.disabled = false);
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
    window.getUserAccount = () => userAccount;
    window.getWeb3 = () => web3;
});
