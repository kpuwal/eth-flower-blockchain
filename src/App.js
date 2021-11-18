import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from './utils/FlowerPortal.json';
import List from './components/List';
import './App.css';

export default function App() {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contractABI = abi.abi;

  const plant = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const plantPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await plantPortalContract.getTotalFlowers();
        console.log("Retrieved total wave count...", count.toNumber());

        const plantTxn = await plantPortalContract.flower('this is a message', { gasLimit: 300000});
        console.log("Mining...", plantTxn.hash);

        await plantTxn.wait();
        console.log("Mined -- ", plantTxn.hash);

        count = await plantPortalContract.getTotalFlowers();
        console.log("Retrieved total wave count...", count.toNumber());

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => checkIfWalletIsConnected(), []);
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        Connect your Ethereum wallet and plant a flower.
        </div>
        {currentAccount && (
          <button className="waveButton" onClick={plant}>
          Plant a flower
        </button>
        )}
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        <List />
      </div>
    </div>
  );
}
