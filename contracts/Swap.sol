// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Swap is Ownable, ReentrancyGuard {
    IERC20 public drinkToken;
    AggregatorV3Interface internal priceFeedETH;
    AggregatorV3Interface internal priceFeedDrinkETH;

    event SwapEthForDrink(address indexed swapper, uint256 ethAmount, uint256 tokenAmount);
    event SwapDrinkForEth(address indexed swapper, uint256 tokenAmount, uint256 ethAmount);

    constructor(address _drinkToken, address _priceFeedETH, address _priceFeedDrinkETH) {
        require(_drinkToken != address(0), "Invalid token address");
        require(_priceFeedETH != address(0), "Invalid ETH price feed address");
        require(_priceFeedDrinkETH != address(0), "Invalid Drink price feed address");

        drinkToken = IERC20(_drinkToken);
        priceFeedETH = AggregatorV3Interface(_priceFeedETH);
        priceFeedDrinkETH = AggregatorV3Interface(_priceFeedDrinkETH);
    }

    function getLatestPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price feed");
        return uint256(price);
    }

    function swapEthForDrink() external payable nonReentrant {
        uint256 ethPrice = getLatestPrice(priceFeedETH);
        uint256 drinkPrice = getLatestPrice(priceFeedDrinkETH);
        uint256 tokenAmount = (msg.value * drinkPrice) / ethPrice;

        require(drinkToken.balanceOf(address(this)) >= tokenAmount, "Insufficient token balance in contract");

        drinkToken.transfer(msg.sender, tokenAmount);

        emit SwapEthForDrink(msg.sender, msg.value, tokenAmount);
    }

    function swapDrinkForEth(uint256 tokenAmount) external nonReentrant {
        require(drinkToken.balanceOf(msg.sender) >= tokenAmount, "Insufficient token balance");

        uint256 ethPrice = getLatestPrice(priceFeedETH);
        uint256 drinkPrice = getLatestPrice(priceFeedDrinkETH);
        uint256 ethAmount = (tokenAmount * ethPrice) / drinkPrice;

        require(address(this).balance >= ethAmount, "Insufficient ETH balance in contract");

        drinkToken.transferFrom(msg.sender, address(this), tokenAmount);
        payable(msg.sender).transfer(ethAmount);

        emit SwapDrinkForEth(msg.sender, tokenAmount, ethAmount);
    }
}
