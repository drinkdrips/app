import { getDrinkBalance, buyDrink } from './drinkToken.js';
import { addLiquidity, removeLiquidity, swap } from './liquidityPool.js';
import { stakeTokens, unstakeTokens, claimDrips } from './staking.js';

document.addEventListener('DOMContentLoaded', () => {
    const checkGetUserAccount = () => {
        if (typeof window.getUserAccount !== 'function') {
            console.error('Função getUserAccount não encontrada.');
            return false;
        }
        return true;
    };

    if (!checkGetUserAccount()) {
        console.error('Certifique-se de que connectWallet.js foi carregado corretamente.');
        return;
    }

    // Adiciona event listeners aos formulários
    document.getElementById('buyDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('tokenAmount').value;
        const paymentToken = document.getElementById('paymentToken').value;
        const userAccount = window.getUserAccount();
        if (userAccount) {
            await buyDrink(userAccount, amount, paymentToken);
            await refreshBalances();
        }
    });

    document.getElementById('stakeDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('stakeAmount').value;
        const userAccount = window.getUserAccount();
        if (userAccount) {
            await stakeTokens(userAccount, amount);
            await refreshBalances();
        }
    });

    document.getElementById('unstakeDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('unstakeAmount').value;
        const userAccount = window.getUserAccount();
        if (userAccount) {
            await unstakeTokens(userAccount, amount);
            await refreshBalances();
        }
    });

    document.getElementById('addLiquidityForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('addLiquidityAmount').value;
        const userAccount = window.getUserAccount();
        if (userAccount) {
            await addLiquidity(userAccount, amount);
            await refreshBalances();
        }
    });

    document.getElementById('removeLiquidityForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('removeLiquidityAmount').value;
        const userAccount = window.getUserAccount();
        if (userAccount) {
            await removeLiquidity(userAccount, amount);
            await refreshBalances();
        }
    });

    document.getElementById('swapForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('swapAmount').value;
        const userAccount = window.getUserAccount();
        if (userAccount) {
            await swap(userAccount, amount);
            await refreshBalances();
        }
    });

    document.getElementById('claimDripsForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const userAccount = window.getUserAccount();
        if (userAccount) {
            await claimDrips(userAccount);
            await refreshBalances();
        }
    });

    async function refreshBalances() {
        const userAccount = window.getUserAccount();
        if (userAccount) {
            const drinkBalance = await getDrinkBalance(userAccount);
            document.getElementById('drinkBalance').innerText = drinkBalance;
            // Continue para outros saldos...
        }
    }

    // Atualiza os saldos ao carregar a página
    window.addEventListener('load', async () => {
        await refreshBalances();
    });
});
