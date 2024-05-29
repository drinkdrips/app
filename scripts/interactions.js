document.addEventListener('DOMContentLoaded', () => {
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
            try {
                const drinkBalance = await getDrinkBalance(userAccount);
                console.log('Saldo de DRINK:', drinkBalance); // Log para depuração
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

    // Adiciona a função ao objeto window para uso global
    window.refreshBalances = refreshBalances;
});