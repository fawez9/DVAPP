# Decentralized Voting Application

Welcome to our decentralized voting application! This project utilizes Truffle, Ganache, Solidity, JavaScript, Web3, and MetaMask to provide a compact yet powerful solution for modernizing traditional voting systems.

## Features

1. **Transparency**: Built on Ethereum, our app ensures transparent voting records, reducing the risk of fraud.
2. **Security**: Each vote is securely encrypted and stored on the blockchain, ensuring tamper-proof results.
3. **User-Friendly**: With an intuitive interface, users can easily cast votes using MetaMask.
4. **Smart Contracts**: Solidity smart contracts handle the backend logic, ensuring fair and automated execution of voting rules.

## Getting Started

Follow these steps to set up and run the application locally:

### Step 1: Clone the Project

```bash
git clone https://github.com/fawez9/DVAPP.git
```
### Step 2: Install Dependencies

```bash
npm install
```
### Step 3: Start Ganache

Ensure Ganache is running locally on your machine, you can download it from link below.

link:[ https://archive.trufflesuite.com/ganache/ ]

### Step 4: Compile & Deploy Election Smart Contract

```bash
truffle migrate --reset
```

**Note**: Ensure to migrate the election smart contract each time you restart Ganache.

### Step 5: Configure MetaMask and Link it with Ganache

Configure your MetaMask extension and connect it to your local Ganache network.

### Step 6: Run the Application

```bash
npm run dev
```

Visit this URL in your browser: http://localhost:3000 or you'll find the correct URL prompted on your terminal.

### Contributing

**We welcome contributions from the community! Feel free to submit pull requests or open issues if you encounter any problems or have suggestions for improvement.**
