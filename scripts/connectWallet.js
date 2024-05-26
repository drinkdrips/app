import Web3 from 'web3';

let web3;
let userAccount;

async function connectWallet() {
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];
            updateUIAfterConnect();
            alert('Conexão realizada com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Conexão recusada.');
        }
    } else {
        alert('MetaMask não detectado.');
    }
}

function updateUIAfterConnect() {
    const connectButton = document.querySelector('.connect-button');
    connectButton.innerText = `Conectado: ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
    connectButton.disabled = true;

    document.getElementById('buyDrinksForm').querySelector('button').disabled = false;
    document.getElementById('approveDrinksForm').querySelector('button').disabled = false;
    document.getElementById('stakeDrinksForm').querySelector('button').disabled = false;
    document.getElementById('unstakeDrinksForm').querySelector('button').disabled = false;
    document.getElementById('refreshBalancesBtn').disabled = false;
}

export { connectWallet };
