document.addEventListener('DOMContentLoaded', () => {
    // Adiciona event listeners aos formulários
    document.getElementById('buyDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('tokenAmount').value;
        const paymentToken = document.getElementById('paymentToken').value;
        const userAccount = window.getUserAccount();
        if (userAccount) {
            await window.buyDrink(userAccount, amount, paymentToken);
            await refreshBalances();
        }
    });

    document.getElementById('stakeDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('stakeAmount').value;
        const userAccount = window.getUserAccount();
        if (userAccount) {
            await window.stakeTokens(userAccount, amount);
            await refreshBalances();
        }
    });

    document.getElementById('unstakeDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('unstakeAmount').value;
        const userAccount = window.getUserAccount();
        if (userAccount) {
            await window.unstakeTokens(userAccount, amount);
            await refreshBalances();
        }
    });

    document.getElementById('addLiquidityForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('addLiquidityAmount').value;
        const userAccount = window.getUserAccount();
        if (userAccount) {
            await window.addLiquidity(userAccount, amount);
            await refreshBalances();
        }
    });

    document.getElementById('removeLiquidityForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('removeLiquidityAmount').value;
        const userAccount = window.getUserAccount();
        if (userAccount) {
            await window.removeLiquidity(userAccount, amount);
            await refreshBalances();
        }
    });

    document.getElementById('swapForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('swapAmount').value;
        const userAccount = window.getUserAccount();
        if (userAccount) {
            await window.swap(userAccount, amount);
            await refreshBalances();
        }
    });

    document.getElementById('claimDripsForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const userAccount = window.getUserAccount();
        if (userAccount) {
            await window.claimDrips(userAccount);
            await refreshBalances();
        }
    });

    async function refreshBalances() {
        const userAccount = window.getUserAccount();
        if (userAccount) {
            try {
                const drinkBalance = await window.getDrinkBalance(userAccount);
                console.log('Saldo de DRINK:', drinkBalance); // Adicione este log para depuração
                document.getElementById('drinkBalance').innerText = drinkBalance;
                // Continue para outros saldos...
            } catch (error) {
                console.error('Erro ao obter o saldo de DRINK:', error);
            }
        }
    }

    // Atualiza os saldos ao carregar a página
    window.addEventListener('load', async () => {
        await refreshBalances();
    });
});
