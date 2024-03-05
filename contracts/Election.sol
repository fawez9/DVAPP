// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Election {
    struct Candidate {
        uint id;
        string name;
        uint v_count;
    }
    uint public candidateCounter;

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store candidates
    mapping(uint => Candidate) public candidates;

    // voted event
    event votedEvent(uint indexed _canId);

    constructor () {
        addCandidate("Jack");
        addCandidate("Mike");
    }

    // Adding candidates to the map
    function addCandidate (string memory _name) private {
        candidateCounter ++;
        candidates[candidateCounter] = Candidate(candidateCounter, _name, 0);
    }
    
    // voting funtion !!msg.sender = meta data to know the voter's account !! <= provided by solidity 
    //what's under the 'require' wont be executed only if require returns true
    function vote(uint _canId) public {
        // require the voter didnt vote yet
        require(!voters[msg.sender]);
        // require the validate Id of candidate
        require(_canId > 0 && _canId <= candidateCounter);

        voters[msg.sender]=true;
        candidates[_canId].v_count ++;

        // trigger voted event
        emit votedEvent(_canId);
    }

}