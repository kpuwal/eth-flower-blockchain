// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract FlowerPortal {
  uint256 totalFlowers;

  constructor() {
    console.log("Yo yo, the script is working!!");
  }

  function flower() public {
    totalFlowers += 1;
    console.log("%s has planted a flower", msg.sender);
  }

  function getTotalFlowers() public view returns (uint256) {
    console.log("we have %d total flowers!", totalFlowers);
    return totalFlowers;
  }
}