document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.querySelector('.connect-button');
    let web3;
    let userAccount;

    if (!connectButton) {
        console.error("Botão de conexão não encontrado.");
        return;
    }

    // Inicialmente desativa os botões de funcionalidade
    document.getElementById('buyDrinksForm').querySelector('button').disabled = true;
    document.getElementById('approveDrinksForm').querySelector('button').disabled = true;
    document.getElementById('stakeDrinksForm').querySelector('button').disabled = true;
    document.getElementById('unstakeDrinksForm').querySelector('button').disabled = true;
    document.getElementById('refreshBalancesBtn').disabled = true;

    // Endereços e ABIs dos contratos
    const drinkTokenAddress = "0xB1c4a4C498B14a02F106f5621d7D8D77A27b4fE9"; // Substitua pelo endereço do contrato DrinkToken
    const dripsTokenAddress = "0x2a2bcB903e6a222E4687a6ab132e420033865B46"; // Substitua pelo endereço do contrato DripsToken
    const stakingContractAddress = "0x27BeefaA72b166ec5d7eaCcC4CF5331c4DC2bEAD"; // Substitua pelo endereço do contrato StakingContract

    const drinkTokenAbi = [ /* ABI do DrinkToken */ ];
    const dripsTokenAbi = [ /* ABI do DripsToken */ ];
    const stakingContractAbi = [ /* ABI do StakingContract */ ];

    connectButton.addEventListener('click', async () => {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                userAccount = accounts[0];
                connectButton.innerText = `Conectado: ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
                connectButton.disabled = true; // Desativa o botão após a conexão

                // Habilitar os outros botões após a conexão
                document.getElementById('buyDrinksForm').querySelector('button').disabled = false;
                document.getElementById('approveDrinksForm').querySelector('button').disabled = false;
                document.getElementById('stakeDrinksForm').querySelector('button').disabled = false;
                document.getElementById('unstakeDrinksForm').querySelector('button').disabled = false;
                document.getElementById('refreshBalancesBtn').disabled = false;

                alert('Conexão realizada com sucesso!');
            } catch (error) {
                console.error(error);
                alert('Conexão recusada.');
            }
        } else {
            alert('MetaMask não detectado.');
        }
    });

    document.getElementById('buyDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const paymentToken = document.getElementById('paymentToken').value;
        const tokenAmount = document.getElementById('tokenAmount').value;

        try {
            const drinkTokenContract = new web3.eth.Contract(drinkTokenAbi, drinkTokenAddress);
            if (paymentToken === 'eth') {
                await drinkTokenContract.methods.buyTokensWithEth().send({
                    from: userAccount,
                    value: web3.utils.toWei(tokenAmount, 'ether')
                });
            } else {
                await drinkTokenContract.methods.buyTokensWithToken(paymentToken, web3.utils.toWei(tokenAmount, 'ether')).send({
                    from: userAccount
                });
            }
            alert('Compra realizada com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro na compra.');
        }
    });

    document.getElementById('approveDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const approveAmount = document.getElementById('approveAmount').value;

        try {
            const drinkTokenContract = new web3.eth.Contract(drinkTokenAbi, drinkTokenAddress);
            await drinkTokenContract.methods.approve(stakingContractAddress, web3.utils.toWei(approveAmount, 'ether')).send({
                from: userAccount
            });
            alert('Aprovação realizada com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro na aprovação.');
        }
    });

    document.getElementById('stakeDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const stakeAmount = document.getElementById('stakeAmount').value;

        try {
            const stakingContract = new web3.eth.Contract(stakingContractAbi, stakingContractAddress);
            await stakingContract.methods.stakeTokens(web3.utils.toWei(stakeAmount, 'ether')).send({
                from: userAccount
            });
            alert('Stake realizado com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro no stake.');
        }
    });

    document.getElementById('unstakeDrinksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const unstakeAmount = document.getElementById('unstakeAmount').value;

        try {
            const stakingContract = new web3.eth.Contract(stakingContractAbi, stakingContractAddress);
            await stakingContract.methods.unstakeTokens(web3.utils.toWei(unstakeAmount, 'ether')).send({
                from: userAccount
            });
            alert('Unstake realizado com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro no unstake.');
        }
    });

    document.getElementById('refreshBalancesBtn').addEventListener('click', async () => {
        try {
            const drinkTokenContract = new web3.eth.Contract(drinkTokenAbi, drinkTokenAddress);
            const dripsTokenContract = new web3.eth.Contract(dripsTokenAbi, dripsTokenAddress);

            const drinkBalance = await drinkTokenContract.methods.balanceOf(userAccount).call();
            const dripsBalance = await dripsTokenContract.methods.balanceOf(userAccount).call();
            document.getElementById('drinkBalance').innerText = web3.utils.fromWei(drinkBalance, 'ether');
            document.getElementById('dripsBalance').innerText = web3.utils.fromWei(dripsBalance, 'ether');

            // Atualizar outros saldos e informações
            const stakedDrinkBalance = await stakingContract.methods.stakedBalanceOf(userAccount).call();
            const claimableDrips = await stakingContract.methods.claimableDrips(userAccount).call();
            const stakeDuration = await stakingContract.methods.stakeDuration(userAccount).call();

            document.getElementById('stakedDrinkBalance').innerText = web3.utils.fromWei(stakedDrinkBalance, 'ether');
            document.getElementById('claimableDrips').innerText = web3.utils.fromWei(claimableDrips, 'ether');
            document.getElementById('stakeDuration').innerText = stakeDuration; // Assumindo que stakeDuration é uma string legível

        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar saldos.');
        }
    });

    document.getElementById('year').textContent = new Date().getFullYear();
});
