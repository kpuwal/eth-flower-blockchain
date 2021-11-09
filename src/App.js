import * as React from "react";
// import { ethers } from "ethers";
import './App.css';

export default function App() {

  const plant = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am kasia and I collect plants. Connect your Ethereum wallet and plant one flower for me!
        </div>

        <button className="waveButton" onClick={plant}>
          Plant a flower
        </button>
      </div>
    </div>
  );
}
