const governanceContractAddress = '0xCE3F6FC323bDEc1eAdAE9f00EED4C5a683F1d8cC';
const governanceABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            }
        ],
        "name": "createProposal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            }
        ],
        "name": "executeProposal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_governanceToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_votingPeriod",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "proposer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "endBlock",
                "type": "uint256"
            }
        ],
        "name": "ProposalCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "ProposalExecuted",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_votingPeriod",
                "type": "uint256"
            }
        ],
        "name": "setVotingPeriod",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "voter",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "weight",
                "type": "uint256"
            }
        ],
        "name": "Voted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            }
        ],
        "name": "getProposal",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "proposer",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "voteCount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endBlock",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "executed",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "governanceToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "proposalCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "proposals",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "proposer",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "voteCount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endBlock",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "executed",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "votes",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "votingPeriod",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Inicializa o Web3 e os contratos
const web3 = new Web3(window.ethereum);
window.governanceContract = new web3.eth.Contract(governanceABI, governanceContractAddress);

// Função para obter a conta do usuário
async function getUserAccount() {
    const accounts = await web3.eth.requestAccounts();
    return accounts[0];
}

// Função para criar uma nova proposta
window.createProposal = async function(description) {
    const userAccount = await getUserAccount();
    if (userAccount) {
        try {
            const receipt = await governanceContract.methods.createProposal(description).send({ from: userAccount });
            console.log('Proposta criada:', receipt.events.ProposalCreated.returnValues);
            alert('Proposta criada com sucesso!');
            addProposalToUI(receipt.events.ProposalCreated.returnValues.id, description);
        } catch (error) {
            console.error('Erro ao criar proposta:', error);
            alert('Erro ao criar proposta');
        }
    } else {
        alert('Conta de usuário não encontrada.');
    }
};

// Função para votar em uma proposta
window.voteOnProposal = async function(proposalId) {
    const userAccount = await getUserAccount();
    if (userAccount) {
        try {
            const receipt = await governanceContract.methods.vote(proposalId).send({ from: userAccount });
            console.log('Voto registrado:', receipt.events.Voted.returnValues);
            alert('Voto registrado com sucesso!');
            updateVoteCountUI(proposalId, receipt.events.Voted.returnValues.weight);
        } catch (error) {
            console.error('Erro ao votar na proposta:', error);
            alert('Erro ao votar na proposta');
        }
    } else {
        alert('Conta de usuário não encontrada.');
    }
};

// Função para executar uma proposta
window.executeProposal = async function(proposalId) {
    const userAccount = await getUserAccount();
    if (userAccount) {
        try {
            const receipt = await governanceContract.methods.executeProposal(proposalId).send({ from: userAccount });
            console.log('Proposta executada:', receipt.events.ProposalExecuted.returnValues);
            alert('Proposta executada com sucesso!');
            markProposalAsExecuted(proposalId);
        } catch (error) {
            console.error('Erro ao executar proposta:', error);
            alert('Erro ao executar proposta');
        }
    } else {
        alert('Conta de usuário não encontrada.');
    }
};

// Função para obter os detalhes de uma proposta
window.getProposalDetails = async function(proposalId) {
    try {
        const proposal = await governanceContract.methods.getProposal(proposalId).call();
        console.log('Detalhes da proposta:', proposal);
        // Atualize a interface do usuário com os detalhes da proposta
    } catch (error) {
        console.error('Erro ao obter detalhes da proposta:', error);
    }
};

// Função para lidar com o envio do formulário de criação de proposta
window.handleCreateProposal = function(event) {
    event.preventDefault(); // Previne o comportamento padrão de recarregar a página

    // Obtém os valores dos campos do formulário
    const description = document.getElementById('proposalDescription').value;

    // Chama a função para criar uma proposta com a descrição fornecida
    createProposal(description);
};

// Adiciona listener para o formulário na inicialização
document.getElementById('createProposalForm').addEventListener('submit', handleCreateProposal);

// Listeners para eventos emitidos pelo contrato
governanceContract.events.ProposalCreated({}, (error, event) => {
    if (!error) {
        console.log('Proposta Criada:', event.returnValues);
        addProposalToUI(event.returnValues.id, event.returnValues.description);
    } else {
        console.error('Erro ao escutar evento ProposalCreated:', error);
    }
});

governanceContract.events.Voted({}, (error, event) => {
    if (!error) {
        console.log('Voto Registrado:', event.returnValues);
        updateVoteCountUI(event.returnValues.proposalId, event.returnValues.weight);
    } else {
        console.error('Erro ao escutar evento Voted:', error);
    }
});

governanceContract.events.ProposalExecuted({}, (error, event) => {
    if (!error) {
        console.log('Proposta Executada:', event.returnValues);
        markProposalAsExecuted(event.returnValues.proposalId);
    } else {
        console.error('Erro ao escutar evento ProposalExecuted:', error);
    }
});

// Função para carregar propostas existentes ao inicializar a página
window.loadProposals = async function() {
    try {
        const proposalCount = await governanceContract.methods.proposalCount().call();
        for (let i = 0; i < proposalCount; i++) {
            const proposal = await governanceContract.methods.getProposal(i).call();
            addProposalToUI(proposal.id, proposal.description, proposal.voteCount);
        }
    } catch (error) {
        console.error('Erro ao carregar propostas:', error);
    }
};

// Chama a função para carregar as propostas quando a página é carregada
window.addEventListener('load', loadProposals);

// Função para adicionar uma proposta à interface do usuário
function addProposalToUI(id, description, voteCount = 0) {
    const proposalsContainer = document.getElementById('governanceProposals');
    const proposalCard = `
        <div class="col-md-4" id="proposal-${id}">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Proposta ${id}</h5>
                    <p class="card-text">${description}</p>
                    <p class="vote-count">Votos: ${voteCount}</p>
                    <button class="btn btn-primary" onclick="voteOnProposal(${id})">Votar</button>
                </div>
            </div>
        </div>
    `;
    proposalsContainer.innerHTML += proposalCard;
}

function updateVoteCountUI(proposalId, votes) {
    const proposalCard = document.getElementById(`proposal-${proposalId}`);
    const voteCountElement = proposalCard.querySelector('.vote-count');
    voteCountElement.textContent = `Votos: ${votes}`;
}

function markProposalAsExecuted(proposalId) {
    const proposalCard = document.getElementById(`proposal-${proposalId}`);
    proposalCard.querySelector('.card-body').classList.add('executed');
    const executedMessage = document.createElement('p');
    executedMessage.className = 'executed-message';
    executedMessage.textContent = 'Proposta Executada';
    proposalCard.querySelector('.card-body').appendChild(executedMessage);
}
