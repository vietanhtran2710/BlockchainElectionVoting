// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Ballot {
    
    struct Voter {
        bool voted;
        uint vote;
        bool registered;
    }

    uint[35] public voteCount;
    address public chairPerson;
    mapping(address => Voter) voters;

    modifier onlyOwner() {
        require(msg.sender == chairPerson);
        _;
    }
    
    constructor() public {
        chairPerson = msg.sender;
        voters[chairPerson].registered = true;
        voters[chairPerson].voted = false;
    }

    function getChairPerson(uint id) public view returns (address){
        return chairPerson;
    }

    function register(address toVoter) public onlyOwner {
        require(voters[toVoter].registered, "Already registered");
        voters[toVoter].voted = false;
        voters[toVoter].registered = true;
    }

    function vote(uint toProposal) public {
        Voter storage sender = voters[msg.sender];
        require(!(sender.voted || toProposal >= 35 || !sender.registered), "Requirements are not satisfied to vote");
        sender.voted = true;
        sender.vote = toProposal;
        voteCount[toProposal] += 1;
    }

    function winningProposal(uint id) public view returns (uint256 _winningProposal) {
        uint winningVoteCount = 0;
        for (uint256 index = 0; index < 35; index++) {
            if (voteCount[index] > winningVoteCount) {
                winningVoteCount = voteCount[index];
                _winningProposal = index;
            }
        }
    }

    function getVoteCount(uint id) public view returns (uint[35] memory) {
        return voteCount;
    }
}
