import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import abi from '../utils/FlowerPortal.json';
import Flower1 from '../assets/flowers/flower.png';
import Flower2 from '../assets/flowers/flower-2.png';
import Flower3 from '../assets/flowers/flower-3.png';
import Flower4 from '../assets/flowers/tulip-2.png';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const contractABI = abi.abi;
const randomFlowers = [
  Flower1,
  Flower2,
  Flower3,
  Flower4
]

const Flower = () => {
  return (
    <div>
    <img
      src={randomFlowers[Math.floor(Math.random() * randomFlowers.length)]} alt='flower'
      style={{width: '50px', height: '50px'}}
    />
    </div>
  )
}

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
    <>
      {allFlowers.map((flower, index) => {
        return (
          <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
            <div>Address: {flower.address}</div>
            <div>Time: {flower.timestamp.toString()}</div>
            <div>Message: {flower.message}</div>
          </div>)
      })}
      <Flower />
    </>
  )
}

export default List;