// Função para atualizar a interface do usuário
async function updateUI() {
    // Verifica se o usuário está conectado à MetaMask
    if (window.ethereum && window.ethereum.selectedAddress) {
        // Ativa todos os botões
        enableButtons();
        
        // Atualiza o endereço da carteira exibido na MetaMask
        await updateMetaMaskAddress();
    } else {
        // Desativa todos os botões se o usuário não estiver conectado à MetaMask
        disableButtons();
    }
}

// Função para desativar todos os botões
function disableButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
    });
}

// Função para ativar todos os botões
function enableButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = false;
    });
}

// Função para atualizar o endereço da carteira exibido na MetaMask
async function updateMetaMaskAddress() {
    // Obtém o endereço da carteira conectada
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
        const address = accounts[0];
        // Atualiza o endereço da carteira exibido na MetaMask
        await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: address,
                    symbol: 'DRINK', // Símbolo do token
                    decimals: 18, // Casas decimais do token
                    image: 'https://example.com/drink-token.png', // URL da imagem do token
                },
            },
        });
    }
}

// Atualiza a interface do usuário quando a página é carregada
document.addEventListener('DOMContentLoaded', async () => {
    await updateUI();
});

// Atualiza a interface do usuário quando há uma mudança de conta na MetaMask
window.ethereum.on('accountsChanged', async (accounts) => {
    await updateUI();
});

// Atualiza a interface do usuário quando há uma mudança na conexão à MetaMask
window.ethereum.on('chainChanged', async () => {
    await updateUI();
});
