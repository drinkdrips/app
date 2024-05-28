import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider);

const liquidityPoolABI = [ /* ABI do LiquidityPool */ ];
const liquidityPoolAddress = '0x...'; // Endereço do contrato LiquidityPool

const liquidityPoolContract = new web3.eth.Contract(liquidityPoolABI, liquidityPoolAddress);

export async function addLiquidity(fromAddress, amount) {
    return await liquidityPoolContract.methods.addLiquidity().send({ from: fromAddress, value: amount });
}

export async function removeLiquidity(fromAddress, amount) {
    return await liquidityPoolContract.methods.removeLiquidity(amount).send({ from: fromAddress });
}

export async function swap(fromAddress, amount, token) {
    return await liquidityPoolContract.methods.swap(amount, token).send({ from: fromAddress });
}
