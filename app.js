const connectButton = document.querySelector('.connect-button');
let web3;
let userAccount;

// Endereços e ABIs dos contratos
const drinkTokenAddress = "0xYourDrinkTokenAddress"; // Substitua pelo endereço do contrato DrinkToken
const dripsTokenAddress = "0xYourDripsTokenAddress"; // Substitua pelo endereço do contrato DripsToken
const stakingContractAddress = "0xYourStakingContractAddress"; // Substitua pelo endereço do contrato StakingContract

const drinkTokenAbi = [/* ABI do DrinkToken */];
const dripsTokenAbi = [/* ABI do DripsToken */];
const stakingContractAbi = [/* ABI do StakingContract */];

connectButton.addEventListener('click', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];
            connectButton.innerText = `Conectado: ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
            connectButton.disabled = true; // Desativa o botão após a conexão

            // Habilitar os outros botões após a conexão
            document.getElementById('buyTokensButton').disabled = false;
            document.getElementById('stakeTokensButton').disabled = false;
            document.getElementById('unstakeTokensButton').disabled = false;
            document.getElementById('claimRewardsButton').disabled = false;
        } catch (error) {
            console.error(error);
            alert('Conexão recusada.');
        }
    } else {
        alert('MetaMask não detectado.');
    }
});

document.getElementById('buyDrinksEthForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const ethAmount = document.getElementById('ethAmount').value;

    try {
        const drinkTokenContract = new web3.eth.Contract(drinkTokenAbi, drinkTokenAddress);
        await drinkTokenContract.methods.buyTokensWithEther().send({
            from: userAccount,
            value: web3.utils.toWei(ethAmount, 'ether')
        });
        alert('Compra realizada com sucesso!');
    } catch (error) {
        console.error(error);
        alert('Erro na compra.');
    }
});

document.getElementById('buyDrinksUsdtForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const usdtAmount = document.getElementById('usdtAmount').value;

    try {
        const drinkTokenContract = new web3.eth.Contract(drinkTokenAbi, drinkTokenAddress);
        await drinkTokenContract.methods.buyTokensWithToken('0xYourUsdtTokenAddress', web3.utils.toWei(usdtAmount, 'mwei')).send({
            from: userAccount
        });
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
    } catch (error) {
        console.error(error);
        alert('Erro ao atualizar saldos.');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('year').textContent = new Date().getFullYear();
});
