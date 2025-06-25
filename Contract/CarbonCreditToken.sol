// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCreditToken is ERC20, Ownable {
    constructor(uint256 initialSupply, address initialOwner) 
        ERC20("Carbon Credit Token", "CCT") 
        Ownable(initialOwner) 
    {
        _mint(initialOwner, initialSupply * 10 ** decimals());
    }

    function mintERC20(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
