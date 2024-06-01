document.addEventListener('DOMContentLoaded', async () => {
    // Adiciona event listeners aos formulários

    document.getElementById('refreshBalancesBtn').addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const userAccount = accounts[0]; // Assumindo que você deseja usar a primeira conta
            if (userAccount) {
                await refreshBalances();
            }
        } catch (error) {
            console.error('Erro ao obter contas:', error.message);
        }
    });
    
    document.getElementById('buyDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const amount = document.getElementById('tokenAmount').value;
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const userAccount = accounts[0]; // Assumindo que você deseja usar a primeira conta
            if (userAccount) {
                await window.buyTokensWithUsd(userAccount, amount); // Passando userAccount como primeiro argumento
                await refreshBalances();
            } else {
                console.error('Usuário não está conectado');
            }
        } catch (error) {
            console.error('Erro ao comprar tokens durante a pré-venda:', error.message);
        }
    });

    document.getElementById('approveDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const amountInTokens = document.getElementById('approveAmount').value;
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const userAccount = accounts[0]; // Assumindo que você deseja usar a primeira conta
            const spenderAddress = stakingContractAddress;
            if (userAccount) {
                await window.approve(spenderAddress, amountInTokens);
                console.log('Aprovação bem-sucedida para stake de tokens');
            } else {
                console.error('Usuário não está conectado');
            }
        } catch (error) {
            console.error('Erro ao aprovar stake de tokens:', error.message);
        }
    });

    document.getElementById('stakeDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const amount = document.getElementById('stakeAmount').value;
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const userAccount = accounts[0]; // Assumindo que você deseja usar a primeira conta
            if (userAccount) {
                await window.stakeTokens(amount);
                await refreshBalances();
            } else {
                console.error('Usuário não está conectado');
            }
        } catch (error) {
            console.error('Erro ao fazer staking de tokens:', error.message);
        }
    });

    document.getElementById('unstakeDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const amount = document.getElementById('unstakeAmount').value;
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const userAccount = accounts[0]; // Assumindo que você deseja usar a primeira conta
            if (userAccount) {
                await window.unstakeTokens(amount);
                await refreshBalances();
            } else {
                console.error('Usuário não está conectado');
            }
        } catch (error) {
            console.error('Erro ao realizar o unstake:', error.message);
        }
    });

    document.getElementById('claimDripsForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const userAccount = accounts[0]; // Assumindo que você deseja usar a primeira conta
            if (userAccount) {
                await window.claimRewards();
                await refreshBalances();
            } else {
                console.error('Usuário não está conectado');
            }
        } catch (error) {
            console.error('Erro ao reivindicar recompensas:', error.message);
        }
    });
});
