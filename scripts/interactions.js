import { stakeTokens, unstakeTokens, claimRewards } from './staking.js';
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

    document.getElementById('approveDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('approveAmount').value;
        const userAccount = window.getUserAccount();
        const stakingContractAddress = '0xF1Ebaa6f5C9A4D3EEd735CAD364605646E79cFFB'; // Endereço do contrato de staking
        if (userAccount) {
           try {
            // Primeiro, aprova o contrato de staking a gastar tokens em nome do usuário
            await window.approve(userAccount, stakingContractAddress, amount);

        } catch (error) {
                console.error('Erro ao aprovar stake de tokens:', error);
            }
        }
    });
    
    document.getElementById('stakeDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('stakeAmount').value;
        const userAccount = window.getUserAccount();
        const stakingContractAddress = '0xF1Ebaa6f5C9A4D3EEd735CAD364605646E79cFFB'; // Endereço do contrato de staking
        if (userAccount) {
           try {
            await stakeTokens(userAccount, amount);
            // Atualiza os saldos
            await refreshBalances();
        } catch (error) {
                console.error('Erro ao fazer staking de tokens:', error);
            }
        }
    });

    document.getElementById('unstakeDrinksForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const amount = document.getElementById('unstakeAmount').value;
    const userAccount = window.getUserAccount();
    const stakingContractAddress = '0xF1Ebaa6f5C9A4D3EEd735CAD364605646E79cFFB'; // Endereço do contrato de staking

    // Verifica se o usuário e o valor são válidos
    if (!userAccount) {
        console.error('Usuário não autenticado.');
        return;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
        console.error('Valor de retirada inválido.');
        return;
    }

    try {
        await unstakeTokens(userAccount, amount);
        await refreshBalances();
    } catch (error) {
        console.error('Erro ao realizar o unstake:', error);
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
