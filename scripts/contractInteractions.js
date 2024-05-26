import Web3 from 'web3';
import { abi as DrinkTokenAbi } from './contracts/DrinkToken.json';
import { abi as DripsTokenAbi } from './contracts/DripsToken.json';
import { abi as StakingContractAbi } from './contracts/StakingContract.json';

let web3;
let drinkTokenContract;
let dripsTokenContract;
let stakingContract;

async function initContracts() {
    web3 = new Web3(window.ethereum);
    const DRINK_TOKEN_ADDRESS = "0xB8636E1026dEAB5038Fb5BfB1b5214495525c8ab"; // Endereço do contrato DrinkToken
    const DRIPS_TOKEN_ADDRESS = "0x25e2d4663BC853E8E2a81379D35a4895ccef66d6"; // Endereço do contrato DripsToken
    const STAKING_CONTRACT_ADDRESS = "0xE4e1A5c25D5B5a418Cdc24BCebE8F640e1109eC3"; // Endereço do contrato StakingContract

    drinkTokenContract = new web3.eth.Contract(DrinkTokenAbi, DRINK_TOKEN_ADDRESS);
    dripsTokenContract = new web3.eth.Contract(DripsTokenAbi, DRIPS_TOKEN_ADDRESS);
    stakingContract = new web3.eth.Contract(StakingContractAbi, STAKING_CONTRACT_ADDRESS);
}

export { initContracts };
