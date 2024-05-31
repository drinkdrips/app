document.addEventListener('DOMContentLoaded', () => {
    // Adiciona event listeners aos formulários

    document.getElementById('refreshBalancesBtn').addEventListener('click', async (event) => {
        event.preventDefault();
        const userAccount = window.ethereum.selectedAddress;
        if (userAccount) {
            await refreshBalances();
        }
    });
    
    document.getElementById('buyDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('tokenAmount').value;
        const paymentToken = document.getElementById('paymentToken').value;
        const userAccount = window.ethereum.selectedAddress;
        if (userAccount) {
            try {
                await window.buyTokens(amount);
                await refreshBalances();
            } catch (error) {
                console.error('Erro ao comprar tokens:', error.message);
            }
        } else {
            console.error('Usuário não está conectado');
        }
    });

    document.getElementById('approveDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amountInTokens = document.getElementById('approveAmount').value;
        const userAccount = window.ethereum.selectedAddress;
        const spenderAddress = stakingContractAddress;
        if (userAccount) {
            try {
                await window.approve(spenderAddress, amountInTokens);
                console.log('Aprovação bem-sucedida para stake de tokens');
            } catch (error) {
                console.error('Erro ao aprovar stake de tokens:', error.message);
            }
        } else {
            console.error('Usuário não está conectado');
        }
    });

    document.getElementById('stakeDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('stakeAmount').value;
        const userAccount = window.ethereum.selectedAddress;
        if (userAccount) {
            try {
                await window.stakeTokens(amount);
                await refreshBalances();
            } catch (error) {
                console.error('Erro ao fazer staking de tokens:', error.message);
            }
        } else {
            console.error('Usuário não está conectado');
        }
    });

    document.getElementById('unstakeDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('unstakeAmount').value;
        const userAccount = window.ethereum.selectedAddress;
        if (userAccount) {
            try {
                await window.unstakeTokens(amount);
                await refreshBalances();
            } catch (error) {
                console.error('Erro ao realizar o unstake:', error.message);
            }
        } else {
            console.error('Usuário não está conectado');
        }
    });

    document.getElementById('claimDripsForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const userAccount = window.ethereum.selectedAddress;
        if (userAccount) {
            try {
                await window.claimRewards();
                await refreshBalances();
            } catch (error) {
                console.error('Erro ao reivindicar recompensas:', error.message);
            }
        } else {
            console.error('Usuário não está conectado');
        }
    });
});
