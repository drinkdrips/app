import { connectWallet } from './connectWallet.js';
import { initContracts } from './contractInteractions.js';

document.addEventListener('DOMContentLoaded', async () => {
    document.querySelector('.connect-button').addEventListener('click', connectWallet);

    await initContracts();
});
