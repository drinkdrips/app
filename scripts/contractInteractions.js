import { web3, connectWallet } from './connectWallet.js'; // Caminho relativo correto

// Endereços dos contratos
const DRINK_TOKEN_ADDRESS = '0x...'; // Substitua pelo endereço real do DrinkToken
const DRIPS_TOKEN_ADDRESS = '0x...'; // Substitua pelo endereço real do DripsToken
const STAKING_CONTRACT_ADDRESS = '0x...'; // Substitua pelo endereço real do StakingContract

// ABIs dos contratos
const drinkTokenABI = [/* ABI do DrinkToken */];
const dripsTokenABI = [/* ABI do DripsToken */];
const stakingContractABI = [/* ABI do StakingContract */];

// Instâncias dos contratos
const drinkTokenContract = new web3.eth.Contract(drinkTokenABI, DRINK_TOKEN_ADDRESS);
const dripsTokenContract = new web3.eth.Contract(dripsTokenABI, DRIPS_TOKEN_ADDRESS);
const stakingContract = new web3.eth.Contract(stakingContractABI, STAKING_CONTRACT_ADDRESS);

// Função para conectar a conta do usuário
async function getAccount() {
    const accounts = await connectWallet();
    return accounts[0];
}

// Funções de interação com os contratos

// Obter saldo de DrinkToken
async function getDrinkTokenBalance() {
    const account = await getAccount();
    const balance = await drinkTokenContract.methods.balanceOf(account).call();
    document.getElementById('drinkBalance').innerText = balance;
}

// Obter saldo de DripsToken
async function getDripsTokenBalance() {
    const account = await getAccount();
    const balance = await dripsTokenContract.methods.balanceOf(account).call();
    document.getElementById('dripsBalance').innerText = balance;
}

// Obter saldo em staking
async function getStakedDrinkBalance() {
    const account = await getAccount();
    const balance = await stakingContract.methods.stakedBalanceOf(account).call(); // Supondo que o contrato tem essa função
    document.getElementById('stakedDrinkBalance').innerText = balance;
}

// Obter DRIPS a reivindicar
async function getClaimableDrips() {
    const account = await getAccount();
    const claimable = await stakingContract.methods.claimableDrips(account).call(); // Supondo que o contrato tem essa função
    document.getElementById('claimableDrips').innerText = claimable;
}

// Aprovar tokens para staking
async function approveDrinks() {
    const account = await getAccount();
    const amount = document.getElementById('approveAmount').value;
    await drinkTokenContract.methods.approve(STAKING_CONTRACT_ADDRESS, amount).send({ from: account });
    alert('Tokens aprovados para staking');
}

// Fazer staking de tokens
async function stakeDrinks() {
    const account = await getAccount();
    const amount = document.getElementById('stakeAmount').value;
    await stakingContract.methods.stake(amount).send({ from: account });
    alert('Tokens staked');
    getStakedDrinkBalance();
}

// Retirar tokens do staking
async function unstakeDrinks() {
    const account = await getAccount();
    const amount = document.getElementById('unstakeAmount').value;
    await stakingContract.methods.unstake(amount).send({ from: account });
    alert('Tokens unstaked');
    getStakedDrinkBalance();
}

// Reivindicar DRIPS
async function claimDrips() {
    const account = await getAccount();
    await stakingContract.methods.claim().send({ from: account });
    alert('DRIPS reivindicados');
    getClaimableDrips();
}

// Adicionar liquidez
async function addLiquidity() {
    const account = await getAccount();
    const amount = document.getElementById('addLiquidityAmount').value;
    await stakingContract.methods.addLiquidity(web3.utils.toWei(amount, 'ether')).send({ from: account });
    alert('Liquidez adicionada');
}

// Remover liquidez
async function removeLiquidity() {
    const account = await getAccount();
    const amount = document.getElementById('removeLiquidityAmount').value;
    await stakingContract.methods.removeLiquidity(web3.utils.toWei(amount, 'ether')).send({ from: account });
    alert('Liquidez removida');
}

// Trocar tokens
async function swapTokens() {
    const account = await getAccount();
    const amount = document.getElementById('swapAmount').value;
    await stakingContract.methods.swap(web3.utils.toWei(amount, 'ether')).send({ from: account });
    alert('Tokens trocados');
}

// Criar proposta de governança
async function createProposal() {
    const account = await getAccount();
    const description = document.getElementById('proposalDescription').value;
    await stakingContract.methods.createProposal(description).send({ from: account });
    alert('Proposta criada');
}

// Atualizar saldos
async function updateBalances() {
    await getDrinkTokenBalance();
    await getDripsTokenBalance();
    await getStakedDrinkBalance();
    await getClaimableDrips();
}

// Configurar eventos no front-end
document.querySelector('.connect-button').addEventListener('click', connectWallet);
document.getElementById('refreshBalancesBtn').addEventListener('click', updateBalances);
document.getElementById('buyDrinksForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    // Lógica para compra de DRINK (a implementar)
});
document.getElementById('approveDrinksForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await approveDrinks();
});
document.getElementById('stakeDrinksForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await stakeDrinks();
});
document.getElementById('unstakeDrinksForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await unstakeDrinks();
});
document.getElementById('claimDripsForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await claimDrips();
});
document.getElementById('addLiquidityForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await addLiquidity();
});
document.getElementById('removeLiquidityForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await removeLiquidity();
});
document.getElementById('swapForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await swapTokens();
});
document.getElementById('createProposalForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await createProposal();
});

// Inicializar saldos na carga da página
window.onload = updateBalances;
