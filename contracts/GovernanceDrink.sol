// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/Pausable.sol";

contract Governance is Ownable, ReentrancyGuard, Pausable {
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 voteCount;
        uint256 endBlock;
        bool executed;
    }

    IERC20 public governanceDrink;
    uint256 public proposalCount;
    uint256 public votingPeriod;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public votes;

    event ProposalCreated(uint256 indexed id, address indexed proposer, string description, uint256 endBlock);
    event Voted(uint256 indexed id, address indexed voter, uint256 weight);
    event ProposalExecuted(uint256 indexed id);

    constructor(address _governanceDrink, uint256 _votingPeriod) {
        require(_governanceDrink != address(0), "Invalid token address");
        governanceDrink = IERC20(_governanceDrink);
        votingPeriod = _votingPeriod;
    }

    modifier validProposal(uint256 proposalId) {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal id");
        _;
    }

    modifier positiveAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than zero");
        _;
    }

    function createProposal(string calldata description) external whenNotPaused nonReentrant {
        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            proposer: msg.sender,
            description: description,
            voteCount: 0,
            endBlock: block.number + votingPeriod,
            executed: false
        });

        emit ProposalCreated(proposalCount, msg.sender, description, proposals[proposalCount].endBlock);
    }

    function vote(uint256 proposalId) external validProposal(proposalId) whenNotPaused nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(block.number <= proposal.endBlock, "Voting period ended");
        require(!votes[proposalId][msg.sender], "Already voted");

        uint256 weight = governanceDrink.balanceOf(msg.sender);
        require(weight > 0, "No governance tokens");

        proposal.voteCount += weight;
        votes[proposalId][msg.sender] = true;

        emit Voted(proposalId, msg.sender, weight);
    }

    function executeProposal(uint256 proposalId) external onlyOwner validProposal(proposalId) nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(block.number > proposal.endBlock, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");

        proposal.executed = true;
        // Logic to execute the proposal can be added here

        emit ProposalExecuted(proposalId);
    }

    function setVotingPeriod(uint256 _votingPeriod) external onlyOwner {
        votingPeriod = _votingPeriod;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function getProposal(uint256 proposalId) external view validProposal(proposalId) returns (
        uint256 id,
        address proposer,
        string memory description,
        uint256 voteCount,
        uint256 endBlock,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.description,
            proposal.voteCount,
            proposal.endBlock,
            proposal.executed
        );
    }
}
