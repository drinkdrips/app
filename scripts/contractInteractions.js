let drinkTokenContract;
let dripsTokenContract;
let stakingContract;
let userAccount;

async function loadABI(contractName) {
    const response = await fetch(`../contracts/${contractName}.json`);
    const contractJson = await response.json();
    return contractJson.abi;
}

export async function initContracts(web3, account) {
    userAccount = account;

    const drinkTokenAddress = '0xB8636E1026dEAB5038Fb5BfB1b5214495525c8ab; // Substitua pelo endereço do contrato DrinkToken
    const dripsTokenAddress = '0x25e2d4663BC853E8E2a81379D35a4895ccef66d6'; // Substitua pelo endereço do contrato DripsToken
    const stakingContractAddress = '0xE4e1A5c25D5B5a418Cdc24BCebE8F640e1109eC3'; // Substitua pelo endereço do contrato StakingContract

    const drinkTokenAbi = await loadABI('DrinkToken');
    const dripsTokenAbi = await loadABI('DripsToken');
    const stakingContractAbi = await loadABI('StakingContract');

    drinkTokenContract = new web3.eth.Contract(drinkTokenAbi, drinkTokenAddress);
    dripsTokenContract = new web3.eth.Contract(dripsTokenAbi, dripsTokenAddress);
    stakingContract = new web3.eth.Contract(stakingContractAbi, stakingContractAddress);
}

// Funções para interações com contratos
export async function buyDrinks(paymentToken, tokenAmount) {
    try {
        const method = paymentToken === 'eth' ? 'buyTokensWithEth' : 'buyTokensWithToken';
        await drinkTokenContract.methods[method](web3.utils.toWei(tokenAmount, 'ether')).send({
            from: userAccount,
            value: paymentToken === 'eth' ? web3.utils.toWei(tokenAmount, 'ether') : undefined
        });
        alert('Compra realizada com sucesso!');
    } catch (error) {
        console.error(error);
        alert('Erro na compra.');
    }
}

export async function approveTokens(approveAmount) {
    try {
        await drinkTokenContract.methods.approve(stakingContract.options.address, web3.utils.toWei(approveAmount, 'ether')).send({
            from: userAccount
        });
        alert('Aprovação realizada com sucesso!');
    } catch (error) {
        console.error(error);
        alert('Erro na aprovação.');
    }
}

export async function stakeTokens(stakeAmount) {
    try {
        await stakingContract.methods.stakeTokens(web3.utils.toWei(stakeAmount, 'ether')).send({
            from: userAccount
        });
        alert('Stake realizado com sucesso!');
    } catch (error) {
        console.error(error);
        alert('Erro no stake.');
    }
}

export async function unstakeTokens(unstakeAmount) {
    try {
        await stakingContract.methods.unstakeTokens(web3.utils.toWei(unstakeAmount, 'ether')).send({
            from: userAccount
        });
        alert('Unstake realizado com sucesso!');
    } catch (error) {
        console.error(error);
        alert('Erro no unstake.');
    }
}

export async function refreshBalances() {
    try {
        const drinkBalance = await drinkTokenContract.methods.balanceOf(userAccount).call();
        const dripsBalance = await dripsTokenContract.methods.balanceOf(userAccount).call();
        document.getElementById('drinkBalance').innerText = web3.utils.fromWei(drinkBalance, 'ether');
        document.getElementById('dripsBalance').innerText = web3.utils.fromWei(dripsBalance, 'ether');
    } catch (error) {
        console.error(error);
        alert('Erro ao atualizar saldos.');
    }
}
