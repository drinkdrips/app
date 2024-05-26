export function updateUIAfterConnect(userAccount) {
    const connectButton = document.querySelector('.connect-button');
    if (connectButton) {
        connectButton.innerText = `Conectado: ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
        connectButton.disabled = true;
    }

    // Habilitar os botões de funcionalidade após a conexão
    const buyDrinksButton = document.querySelector('#buyDrinksForm button');
    if (buyDrinksButton) buyDrinksButton.disabled = false;

    const approveDrinksButton = document.querySelector('#approveDrinksForm button');
    if (approveDrinksButton) approveDrinksButton.disabled = false;

    const stakeDrinksButton = document.querySelector('#stakeDrinksForm button');
    if (stakeDrinksButton) stakeDrinksButton.disabled = false;

    const unstakeDrinksButton = document.querySelector('#unstakeDrinksForm button');
    if (unstakeDrinksButton) unstakeDrinksButton.disabled = false;

    const refreshBalancesButton = document.querySelector('#refreshBalancesBtn');
    if (refreshBalancesButton) refreshBalancesButton.disabled = false;
}

document.addEventListener('DOMContentLoaded', () => {
    // Desabilitar os botões ao carregar a página
    const buyDrinksButton = document.querySelector('#buyDrinksForm button');
    if (buyDrinksButton) buyDrinksButton.disabled = true;

    const approveDrinksButton = document.querySelector('#approveDrinksForm button');
    if (approveDrinksButton) approveDrinksButton.disabled = true;

    const stakeDrinksButton = document.querySelector('#stakeDrinksForm button');
    if (stakeDrinksButton) stakeDrinksButton.disabled = true;

    const unstakeDrinksButton = document.querySelector('#unstakeDrinksForm button');
    if (unstakeDrinksButton) unstakeDrinksButton.disabled = true;

    const refreshBalancesButton = document.querySelector('#refreshBalancesBtn');
    if (refreshBalancesButton) refreshBalancesButton.disabled = true;
});
