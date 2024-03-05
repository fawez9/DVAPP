var Election = artifacts.require("./Election.sol");
const Web3 = require("web3");
contract("Election", function (accounts) {
  var i_elec;
  it("Two candidates initialization", function () {
    return Election.deployed()
      .then(function (i) {
        return i.candidateCounter();
      })
      .then(function (count) {
        assert.equal(count, 2);
      });
  });
  it("Initializing candidates with correct values", function () {
    return Election.deployed()
      .then(function (i) {
        i_elec = i;
        return i_elec.candidates(1);
      })
      .then(function (candiadate) {
        assert.equal(candiadate[0], 1, "correct id");
        assert.equal(candiadate[1], "Jack", "correct name");
        assert.equal(candiadate[2], 0, "correct V_count");
        return i_elec.candidates(2);
      })
      .then(function (candiadate) {
        assert.equal(candiadate[0], 2, "correct id");
        assert.equal(candiadate[1], "Mike", "correct name");
        assert.equal(candiadate[2], 0, "correct V_count");
      });
  });
  it("Casting a Vote", function () {
    return Election.deployed()
      .then(function (instance) {
        electionInstance = instance;
        candidateId = 1;
        return electionInstance.vote(candidateId, { from: accounts[0] });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "an event was triggered");
        assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
        assert.equal(receipt.logs[0].args._canId.toNumber(), candidateId, "the candidate id is correct");
        return electionInstance.voters(accounts[0]);
      })
      .then(function (voted) {
        assert(voted, "voter marked as voted");
        return electionInstance.candidates(candidateId);
      })
      .then(function (candidate) {
        assert.isDefined(candidate, "candidate should be defined"); // Ensure candidate is defined
        var v_count = candidate[2].toNumber();
        assert.equal(v_count, 1, "incrementing the candidate's vote count");
      });
  });
  it("Exception on invalid candidate", function () {
    return Election.deployed()
      .then(function (instance) {
        electionInstance = instance;
        return electionInstance.vote(99, { from: accounts[1] });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(error.message.indexOf("revert") >= 0, "error message must contain revert");
        return electionInstance.candidates(1);
      })
      .then(function (candidate1) {
        var v_count = candidate1[2];
        assert.equal(v_count, 1, "candidate 1 did not receive any votes");
        return electionInstance.candidates(2);
      })
      .then(function (candidate2) {
        var v_count = candidate2[2];
        assert.equal(v_count, 0, "candidate 2 did not receive any votes");
      });
  });
  it("Exception on double vote", function () {
    return Election.deployed()
      .then(function (instance) {
        // First vote
        electionInstance = instance;
        candidateId = 2;
        return electionInstance.vote(candidateId, { from: accounts[1] });
      })
      .then(function () {
        // Try to vote again
        return electionInstance.vote(candidateId, { from: accounts[1] });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(error.message.indexOf("revert") >= 0, "Error message must contain revert");
        return electionInstance.candidates(1);
      })
      .then(function (candidate1) {
        var v_count = candidate1[2];
        assert.equal(v_count, 1, "candidate 1 did not receive any votes");
        return electionInstance.candidates(2);
      })
      .then(function (candidate2) {
        var v_count = candidate2[2];
        assert.equal(v_count, 1, "candidate 2 did not receive any votes");
      });
  });
});
