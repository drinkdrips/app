import { initContracts } from './contractInteractions.js';
import { updateUIAfterConnect } from './uiUpdate.js';

let web3;
let userAccount;

// Função para conectar a MetaMask
async function connectMetaMask() {
    try {
        // Solicita ao usuário permissão para acessar sua conta MetaMask
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Atualiza a interface do usuário após a conexão bem-sucedida
        await connectWallet();
    } catch (error) {
        console.error('Erro ao conectar à MetaMask:', error);
    }
}

// Função para conectar a carteira
export async function connectWallet() {
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];
            await initContracts(web3, userAccount);
            updateUIAfterConnect(userAccount);
            alert('Conexão realizada com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Conexão recusada.');
        }
    } else {
        alert('MetaMask não detectado.');
    }
}

// Adiciona um ouvinte de evento ao botão de conexão à MetaMask
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.connect-button').addEventListener('click', connectMetaMask);
});
