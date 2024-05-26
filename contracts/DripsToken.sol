// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract DripsToken is ERC20, Ownable, Pausable {
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event ConditionalTransfer(address indexed from, address indexed to, uint256 amount);
    event RewardGranted(address indexed to, uint256 amount);
    event PenaltyApplied(address indexed from, uint256 amount);

    // Estrutura de dados para rastrear as condições de transferência
    mapping(address => bool) public allowedTransfer;
    address public stakingContract;

    // Construtor que inicializa o contrato
    constructor(address _initialOwner) ERC20("DripsToken", "DRIPS") Ownable(msg.sender) {
        transferOwnership(_initialOwner);
    }

    modifier onlyStakingContract() {
        require(msg.sender == stakingContract, "Caller is not the staking contract");
        _;
    }

    // Função para configurar o contrato de staking
    function setStakingContract(address _stakingContract) external onlyOwner {
        stakingContract = _stakingContract;
    }

    // Função para cunhar novos tokens (somente o contrato de staking pode chamar)
    function mint(address to, uint256 amount) external onlyStakingContract whenNotPaused {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    // Função para queimar tokens (somente o proprietário pode chamar)
    function burn(uint256 amount) external onlyOwner whenNotPaused {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    // Função para permitir transferências condicionais
    function conditionalTransfer(address to, uint256 amount) external whenNotPaused {
        require(allowedTransfer[msg.sender], "Conditional transfer not allowed");
        _transfer(msg.sender, to, amount);
        emit ConditionalTransfer(msg.sender, to, amount);
    }

    // Função para conceder recompensas
    function grantReward(address to, uint256 amount) external onlyOwner whenNotPaused {
        _mint(to, amount);
        emit RewardGranted(to, amount);
    }

    // Função para aplicar penalidades
    function applyPenalty(address from, uint256 amount) external onlyOwner whenNotPaused {
        _burn(from, amount);
        emit PenaltyApplied(from, amount);
    }

    // Função para permitir ou proibir transferências condicionais
    function toggleConditionalTransfer(address account, bool allowed) external onlyOwner whenNotPaused {
        allowedTransfer[account] = allowed;
    }

    // Função para pausar todas as operações do contrato
    function pause() external onlyOwner {
        _pause();
    }

    // Função para despausar todas as operações do contrato
    function unpause() external onlyOwner {
        _unpause();
    }
}
