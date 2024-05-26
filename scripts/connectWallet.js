import { initContracts } from './contractInteractions.js';
import { updateUIAfterConnect } from './uiUpdate.js';

let web3;
let userAccount;

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

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.connect-button').addEventListener('click', connectWallet);
});
