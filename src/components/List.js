import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import abi from '../utils/FlowerPortal.json';
import '../App.css';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const contractABI = abi.abi;

const List = () => {
  const [allFlowers, setAllFlowers] = useState([]);

  const getAllFlowers = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const plantPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const flowers = await plantPortalContract.getAllFlowers();
        console.log(flowers);
        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let flowersCleaned = [];
        flowers.forEach(flower => {
          flowersCleaned.push({
            address: flower.planter,
            timestamp: new Date(flower.timestamp * 1000),
            message: flower.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllFlowers(flowersCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let wavePortalContract;
    getAllFlowers();

    const onNewWave = (from, timestamp, message) => {
      console.log('NewFlower', from, timestamp, message);
      setAllFlowers(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on('NewFlower', onNewWave);
    }
  
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off('NewFlower', onNewWave);
      }
    };
  }, []);

  return (
    <div className="list">
      {allFlowers.map((flower, index) => {
        return (
          <div style={{ width: "250px", height: "120px", marginLeft: "16px", marginTop: "16px", padding: "8px", boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 3px 10px 0 rgba(0, 0, 0, 0.09)", borderRadius: "8px", display: "block", float: "left"}}>
            <div key={index} style={{ padding: "8px", background: "rgba(0, 0, 0, 0.09)", borderRadius: "5px", align: "center"}}>
              {/* <div>Address: {flower.address}</div>
              <div>Time: {flower.timestamp.toString()}</div>
              <div>Message: {flower.message}</div> */}
              <img alt="flower" src={`flowers/${flower.message}.png`} style={{width: '80px', height: '80px'}} />
            </div>
            <div style={{paddingTop: "10px", fontSize: "9px"}}>{flower.address}</div>
          </div>)
      })}
    </div>
  )
}

export default List;