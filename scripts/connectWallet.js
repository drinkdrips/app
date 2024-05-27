document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.querySelector('.connect-button');
    let web3;
    let userAccount;

    if (!connectButton) {
        console.error("Botão de conexão não encontrado.");
        return;
    }

    // Inicialmente desativa os botões de funcionalidade
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

    connectButton.addEventListener('click', async () => {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                userAccount = accounts[0];
                connectButton.innerText = `Conectado: ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
                connectButton.disabled = true; // Desativa o botão após a conexão

    // Habilitar os outros botões após a conexão
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


    alert('Conexão realizada com sucesso!'); // Adiciona uma mensagem de sucesso
            } catch (error) {
                console.error(error);
                alert('Conexão recusada.');
            }
        } else {
            alert('MetaMask não detectado.');
        }
    });
}
