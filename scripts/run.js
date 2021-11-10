const hre = require("hardhat");

const main = async () => {
  // here I grabbed the wallet address of contract owner and I also grabbed a random wallet address and called it randomPerson. 
  const [owner, randomPerson] = await hre.ethers.getSigners();

  // This will actually compile our contract and generate the necessary files we need to work with our contract under the artifacts directory. Go check it out after you run this :).
  const flowerContractFactory = await hre.ethers.getContractFactory('FlowerPortal');

  //  Hardhat will create a local Ethereum network for us, but just for this contract. Then, after the script completes it'll destroy that local network. So, every time you run the contract, it'll be a fresh blockchain. What's the point? It's kinda like refreshing your local server every time so you always start from a clean slate which makes it easy to debug errors.
  const flowerContract = await flowerContractFactory.deploy();

  // We'll wait until our contract is officially deployed to our local blockchain! Our constructor runs when we actually deploy
  await flowerContract.deployed();

  // Finally, once it's deployed waveContract.address  will basically give us the address of the deployed contract. This address is how we can actually find our contract on the blockchain. There are millions of contracts on the actual blockchain. So, this address gives us easy access to the contract we're interested in working with! This will be more important a bit later once we deploy to a real Ethereum network.
  console.log("Contract deployed to:", flowerContract.address);
  console.log("Contract deployed by:", owner.address);
  console.log("random person", randomPerson.address);

  let flowerCount;
  flowerCount = await flowerContract.getTotalFlowers();

  let flowerTxn = await flowerContract.flower('A message!');
  await flowerTxn.wait();

  flowerCount = await flowerContract.getTotalFlowers();

  flowerTxn = await flowerContract.connect(randomPerson).flower('Another message!');
  await flowerTxn.wait();

  flowerCount = await flowerContract.getTotalFlowers();
  console.log(flowerCount.toNumber());

  let allFlowers = await flowerContract.getAllFlowers();
  console.log(allFlowers);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();