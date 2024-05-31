// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Swap is Ownable, ReentrancyGuard {
    IERC20 public drinkToken;
    AggregatorV3Interface internal priceFeedETH;
    address public _PRICEFEEDDRINKETH;

    event SwapEthForDrink(address indexed swapper, uint256 ethAmount, uint256 tokenAmount);
    event SwapDrinkForEth(address indexed swapper, uint256 tokenAmount, uint256 ethAmount);

    constructor(address _drinkToken, address _priceFeedETH, address _priceFeedDrinkEth) {
        require(_drinkToken != address(0), "Invalid token address");
        require(_priceFeedETH != address(0), "Invalid ETH price feed address");
        require(_priceFeedDrinkEth != address(0), "Invalid Drink token price feed address");

        drinkToken = IERC20(_drinkToken);
        priceFeedETH = AggregatorV3Interface(_priceFeedETH);
        _PRICEFEEDDRINKETH = _priceFeedDrinkEth;
    }

    function getLatestPrice(AggregatorV3Interface priceFeed) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 1e10); // Adjusting the price to have 18 decimals
    }

    function swapEthForDrink() external payable nonReentrant {
        require(_PRICEFEEDDRINKETH != address(0), "Drink token price feed address not set");
        uint256 ethPrice = getLatestPrice(priceFeedETH);
        uint256 tokenAmount = (msg.value * ethPrice) / 10; // Assuming DRINK_PRICE_USD = 10

        require(drinkToken.balanceOf(address(this)) >= tokenAmount, "Insufficient token balance in contract");

        drinkToken.transfer(msg.sender, tokenAmount);

        emit SwapEthForDrink(msg.sender, msg.value, tokenAmount);
    }

    function swapDrinkForEth(uint256 tokenAmount) external nonReentrant {
        require(_PRICEFEEDDRINKETH != address(0), "Drink token price feed address not set");
        require(drinkToken.balanceOf(msg.sender) >= tokenAmount, "Insufficient token balance");

        uint256 ethPrice = getLatestPrice(AggregatorV3Interface(_PRICEFEEDDRINKETH));
        uint256 ethAmount = (tokenAmount * 10) / ethPrice; // Assuming DRINK_PRICE_USD = 10

        require(address(this).balance >= ethAmount, "Insufficient ETH balance in contract");

        drinkToken.transferFrom(msg.sender, address(this), tokenAmount);
        payable(msg.sender).transfer(ethAmount);

        emit SwapDrinkForEth(msg.sender, tokenAmount, ethAmount);
    }
}
