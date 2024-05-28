document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.querySelector('.connect-button');
    let userAccount;
    let web3;  // Certifique-se de declarar web3 aqui

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
        console.log("Botão de conexão clicado.");
        await connectWallet();
    });

    async function connectWallet() {
        if (window.ethereum) {
            try {
                console.log("MetaMask detectado.");
                const provider = window.ethereum;
                console.log("Provedor MetaMask definido:", provider);
                web3 = new Web3(provider);
                console.log("Web3 inicializado com o provedor MetaMask.");
                await provider.request({ method: 'eth_requestAccounts' });
                console.log("Contas solicitadas.");
                const accounts = await web3.eth.getAccounts();
                userAccount = accounts[0];
                console.log(`Conta conectada: ${userAccount}`);
                connectButton.innerText = `Conectado: ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
                connectButton.disabled = true; // Desativa o botão após a conexão

                // Habilitar os outros botões após a conexão
                enableButtons();

                alert('Conexão realizada com sucesso!'); // Adiciona uma mensagem de sucesso

                // Atualiza os saldos após a conexão bem-sucedida
                await refreshBalances();
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
});
