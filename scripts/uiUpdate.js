import { buyDrinks, approveTokens, stakeTokens, unstakeTokens, refreshBalances } from './contractInteractions.js';

export function updateUIAfterConnect(userAccount) {
    const connectButton = document.querySelector('.connect-button');
    connectButton.innerText = `Conectado: ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
    connectButton.disabled = true;

    document.getElementById('buyDrinksForm').querySelector('button').disabled = false;
    document.getElementById('approveDrinksForm').querySelector('button').disabled = false;
    document.getElementById('stakeDrinksForm').querySelector('button').disabled = false;
    document.getElementById('unstakeDrinksForm').querySelector('button').disabled = false;
    document.getElementById('refreshBalancesBtn').disabled = false;
}

// Função para inicializar eventos na interface do usuário
export function initUIEvents() {
    document.getElementById('buyDrinksForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const paymentToken = document.getElementById('paymentToken').value;
        const tokenAmount = document.getElementById('tokenAmount').value;
        buyDrinks(paymentToken, tokenAmount);
    });

    document.getElementById('approveDrinksForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const approveAmount = document.getElementById('approveAmount').value;
        approveTokens(approveAmount);
    });

    document.getElementById('stakeDrinksForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const stakeAmount = document.getElementById('stakeAmount').value;
        stakeTokens(stakeAmount);
    });

    document.getElementById('unstakeDrinksForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const unstakeAmount = document.getElementById('unstakeAmount').value;
        unstakeTokens(unstakeAmount);
    });

    document.getElementById('refreshBalancesBtn').addEventListener('click', refreshBalances);
}

document.addEventListener('DOMContentLoaded', initUIEvents);
