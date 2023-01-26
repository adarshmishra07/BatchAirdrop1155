const Web3 = require("web3");

// Replace with the provider that your contract is deployed to
const provider = new Web3.providers.HttpProvider("https://polygon-rpc.com/");
const web3 = new Web3(provider);

// Replace with the ABI of your contract
const abi = require("./abi.json");
// Replace with the address of the contract
const contractAddress = "";
const contract = new web3.eth.Contract(abi, contractAddress);

// Replace with the private key of the signer
const privateKey = "0x...";
const signer = web3.eth.accounts.privateKeyToAccount(privateKey);

// Replace with the array of addresses to mint tokens for
const addresses = require("./addresses.json");

// Replace with the token ID and URI to mint
const tokenId = 0;
const tokenUri =
  "ipfs://...";

async function mintBatch(start) {
  const batchSize = 150;
  const end = Math.min(start + batchSize, addresses.length);
  const batch = addresses.slice(start, end);

  const totalGas = await contract.methods
    .mint(tokenUri, tokenId, batch, 1)
    .estimateGas({ from: "0x..." });

  // Sign the transaction to mint tokens for the batch of addresses
  const signedTx = await signer.signTransaction({
    data: contract.methods.mint(tokenUri, tokenId, batch, 1).encodeABI(),
    to: contractAddress,
    gas: totalGas.toString(),
  });

  // Send the signed transaction to the network
  const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  if (tx) {
    // Wait for the transaction to be mined
    // await tx.wait();

    // If there are more addresses to mint tokens for, mint the next batch
    if (end < addresses.length) {
      console.log(end);
      mintBatch(end);
    }
  }
}

