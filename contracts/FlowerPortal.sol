// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract FlowerPortal {
  uint256 totalFlowers;
  uint256 flowersPics;
  uint256 picture;
  // We will be using this below to help generate a random number
  uint256 private seed;
  
  event NewFlower(address indexed from, uint256 timestamp, string message, string picture);

  /*
     * I created a struct here named Wave.
     * A struct is basically a custom datatype where we can customize what we want to hold inside it.
     */
  struct Flower {
    address planter; // The address of the user who waved.
    string message; // The message the user sent.
    uint256 timestamp; // The timestamp when the user waved.
  }

  Flower[] flowers;

  /*
  * This is an address => uint mapping, meaning I can associate an address with a number!
  * In this case, I'll be storing the address with the last time the user waved at us.
  */
  mapping(address => uint256) public lastPlantedAt;

  constructor() payable {
    console.log("We have been constructed!");
    /*
    * Set the initial seed to pick random winner among users
    */
    seed = (block.timestamp + block.difficulty) % 100;
    console.log("seed ", seed);
  }

  function flower(string memory _message) public {
    /*
    * We need to make sure the current timestamp is at least 15-minutes bigger than the last timestamp we stored
    */
    require(
        lastPlantedAt[msg.sender] + 15 minutes < block.timestamp,
        "Wait 15min before waving again"
    );

    /*
      * Update the current timestamp we have for the user
      */
    lastPlantedAt[msg.sender] = block.timestamp;

    totalFlowers += 1;
    console.log("%s has planted a flower", msg.sender);

    /*
    * This is where I actually store the wave data in the array.
    */
    flowers.push(Flower(msg.sender, _message, block.timestamp));

    //  Generate a new seed for the next user that sends a wave
    seed = (block.difficulty + block.timestamp + seed) % 100;
    console.log("next seed ", seed);

    if (seed <= 50) {
      console.log("%s won!", msg.sender);

      uint256 prizeAmount = 0.0001 ether;
      require(
          prizeAmount <= address(this).balance,
          "Trying to withdraw more money than the contract has."
      );
      (bool success, ) = (msg.sender).call{value: prizeAmount}("");
      require(success, "Failed to withdraw money from contract.");
    }


    // I added some fanciness here, Google it and try to figure out what it is! Let me know what you learn in #general-chill-chat
    emit NewFlower(msg.sender, block.timestamp, _message);
  }

  /*
     * I added a function getAllWaves which will return the struct array, waves, to us.
     * This will make it easy to retrieve the waves from our website!
     */
  function getAllFlowers() public view returns (Flower[] memory) {
    return flowers;
  }

  function getTotalFlowers() public view returns (uint256) {
    console.log("we have %d flowers!", totalFlowers);
    return totalFlowers;
  }
}