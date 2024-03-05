App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",

  init: function () {
    // Connect to MetaMask when the page loads
    App.initWeb3();
    window.ethereum.on("accountsChanged", function () {
      App.render();
    });
  },

  initWeb3: function () {
    if (typeof web3 !== "undefined") {
      // If a web3 instance is already provided by MetaMask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Election.json", function (Election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(Election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    });
  },

  // To trigger a refresh event everytime a vote event happens
  listenForEvents: function () {
    App.contracts.Election.deployed().then(function (instance) {
      instance
        .votedEvent(
          {},
          {
            fromBlock: 0,
            toBlock: "latest",
          }
        )
        .watch(function (error, event) {
          console.log("event triggered", event);
          // Reload when a new vote is recorded
          App.render();
        });
    });
  },

  render: function () {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.hide();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
    // Load contract data
    App.contracts.Election.deployed()
      .then(function (instance) {
        electionInstance = instance;
        return electionInstance.candidateCounter();
      })
      .then(function (candidateCounter) {
        var candidatesResults = $("#candidatesResults");
        candidatesResults.empty();

        var candidatesSelect = $("#candidatesSelect");
        candidatesSelect.empty();

        for (var i = 1; i <= candidateCounter; i++) {
          electionInstance.candidates(i).then(function (candidate) {
            var id = candidate[0];
            var name = candidate[1];
            var v_count = candidate[2];

            // Render candidate Result
            var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + v_count + "</td></tr>";
            candidatesResults.append(candidateTemplate);

            // Render candidate ballot option
            var candidateOption = "<option value='" + id + "' >" + name + "</ option>";
            candidatesSelect.append(candidateOption);
          });
        }
        return electionInstance.voters(App.account);
      })
      .then(function (hasVoted) {
        // Do not allow a user to vote
        if (hasVoted) {
          $("form").hide();
        } else {
          $("form").show();
        }
        loader.hide();
        content.show();
      })
      .catch(function (error) {
        console.warn(error);
      });
  },
  castVote: function () {
    var candidateId = $("#candidatesSelect").val();
    App.contracts.Election.deployed()
      .then(function (instance) {
        return instance.vote(candidateId, { from: App.account });
      })
      .then(function (result) {
        // Wait for votes to update
        $("#content").hide();
        $("#loader").show();
      })
      .catch(function (err) {
        console.error(err);
      });
  },
};

// Handle MetaMask connection and UI updates
$(document).ready(function () {
  // Check if MetaMask is installed
  if (typeof window.ethereum !== "undefined") {
    // Initialize App
    App.init();

    // Connect Wallet function
    window.connectWallet = async function () {
      accounts = await window.ethereum.request({ method: "eth_requestAccounts" }).catch((err) => {
        console.log(err.code);
      });
      if (accounts.length >= 0) {
        // MetaMask connected, hide connect button and initialize app
        $("#meta_btn").hide();
        location.reload();
        App.render();
      }
    };
  } else {
    // MetaMask is not installed, handle accordingly
    console.error("MetaMask is not detected in the browser");
  }
  // Call isConnected function when window is fully loaded
  window.onload = async function () {
    isConnected();
  };
});

async function isConnected() {
  const accounts = await ethereum.request({ method: "eth_accounts" });
  if (accounts.length) {
    console.log(`You're connected to: ${accounts[0]}`);
    // Hide connect button and render content
    $("#meta_btn").hide();
  } else {
    console.log("Metamask is not connected");
    // Show connect button
    $("#meta_btn").show();
  }
}
