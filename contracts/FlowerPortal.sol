// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract FlowerPortal {
  uint256 totalFlowers;
  event NewFlower(address indexed from, uint256 timestamp, string message);

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

  constructor() {
    console.log("Yo yo, the script is working!!");
  }

  function flower(string memory _message) public {
    totalFlowers += 1;
    console.log("%s has planted a flower", msg.sender);

    /*
    * This is where I actually store the wave data in the array.
    */
    flowers.push(Flower(msg.sender, _message, block.timestamp));

    /*
    * I added some fanciness here, Google it and try to figure out what it is!
    * Let me know what you learn in #general-chill-chat
    */
    emit NewFlower(msg.sender, block.timestamp, _message);

    uint256 prizeAmount = 0.0001 ether;
    require(
        prizeAmount <= address(this).balance,
        "Trying to withdraw more money than the contract has."
    );
    (bool success, ) = (msg.sender).call{value: prizeAmount}("");
    require(success, "Failed to withdraw money from contract.");
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