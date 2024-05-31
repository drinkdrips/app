import { stakeTokens, unstakeTokens, claimRewards, getStakingBalance, calculateRewards } from './staking.js';

document.addEventListener('DOMContentLoaded', () => {
    // Adiciona event listeners aos formulários

    document.getElementById('refreshBalancesBtn').addEventListener('click', async (event) => {
        event.preventDefault();
        const userAccount = window.getUserAccount();
        if (userAccount) {
            await refreshBalances();
        }
    });
    
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
    
    // Obtenha o valor do campo de entrada
    const amountInTokens = document.getElementById('approveAmount').value;
    
    // Obtenha a conta do usuário logado na MetaMask
    const userAccount = window.getUserAccount();
    
    // Defina o endereço do contrato de staking
    const spenderAddress = '0x318D6a1b84d06fc0dA16eB628A8C1a579B2307c3'; // ndereço do StakingContract
    
    if (userAccount) {
        try {
            // Aprove o contrato de staking para gastar tokens em nome do usuário
            await approve(userAccount, spenderAddress, amountInTokens);
            console.log('Aprovação bem-sucedida para stake de tokens');
        } catch (error) {
            console.error('Erro ao aprovar stake de tokens:', error);
        }
    } else {
        console.error('Usuário não está conectado');
    }
});

    document.getElementById('stakeDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('stakeAmount').value;
        const userAccount = window.getUserAccount();
        const stakingContractAddress = '0x318D6a1b84d06fc0dA16eB628A8C1a579B2307c3'; // Endereço do contrato de staking
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
        const stakingContractAddress = '0x318D6a1b84d06fc0dA16eB628A8C1a579B2307c3'; // Endereço do contrato de staking

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
            await claimRewards(userAccount);
            await refreshBalances();
        }
    });

    // Função para converter Wei para Tokens
    function convertWeiToTokens(valueInWei) {
        return web3.utils.fromWei(valueInWei, 'ether');
    }

    async function refreshBalances() {
        const userAccount = window.getUserAccount();
        if (!userAccount) {
            console.error('Usuário não autenticado.');
            return;
        }

        try {
            // Obtém o saldo de DRINKS
            const drinkBalanceWei = await window.getDrinkBalance(userAccount);
            const drinkBalance = convertWeiToTokens(drinkBalanceWei);
            console.log('Saldo de DRINKS:', drinkBalance);
            document.getElementById('drinkBalance').innerText = drinkBalance;

            // Obtém o saldo de DRIPS
            const dripsBalanceWei = await window.getDripsBalance(userAccount);
            const dripsBalance = convertWeiToTokens(dripsBalanceWei);
            console.log('Saldo de DRIPS:', dripsBalance);
            document.getElementById('dripsBalance').innerText = dripsBalance;

            // Obtém o saldo de tokens em stake
            const stakingBalanceWei = await getStakingBalance(userAccount);
            const stakingBalance = convertWeiToTokens(stakingBalanceWei);
            console.log('Saldo de tokens em stake:', stakingBalance);
            document.getElementById('stakingBalance').innerText = stakingBalance;

            // Calcula recompensas em DRIPS de um staker específico
            const claimableDripsWei = await calculateRewards(userAccount);
            const claimableDrips = convertWeiToTokens(claimableDripsWei);
            console.log('DRIPS a Reivindicar:', claimableDrips);
            document.getElementById('claimableDrips').innerText = claimableDrips;

            // Continue para outros saldos, se necessário...

        } catch (error) {
            console.error('Erro ao obter saldos:', error);
        }
    }

    // Atualiza os saldos ao carregar a página
    window.addEventListener('load', async () => {
        await refreshBalances();
    });
});
