// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract DrinkToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 51_000_000 * (10 ** uint256(18));
    uint256 public constant MAX_DRINKS_STAKE = 100 * (10 ** 18);

    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public startTime;

    event TokensPurchased(address indexed buyer, address indexed token, uint256 amountPaid, uint256 amountBought);
    event TokensStaked(address indexed staker, uint256 amount);
    event TokensUnstaked(address indexed staker, uint256 amount);

    AggregatorV3Interface internal priceFeedUSD;
    AggregatorV3Interface internal priceFeedETH;
    AggregatorV3Interface internal priceFeedMATIC;
    AggregatorV3Interface internal priceFeedBTC;

    uint256 public constant DRINK_PRICE_USD = 10; // $0.10 por Drink token

    constructor(
        address _priceFeedUSD,
        address _priceFeedETH,
        address _priceFeedMATIC,
        address _priceFeedBTC
    ) ERC20("DrinkToken", "DRINK") Ownable(msg.sender) {
        priceFeedUSD = AggregatorV3Interface(_priceFeedUSD);
        priceFeedETH = AggregatorV3Interface(_priceFeedETH);
        priceFeedMATIC = AggregatorV3Interface(_priceFeedMATIC);
        priceFeedBTC = AggregatorV3Interface(_priceFeedBTC);
    }

    function getLatestPrice(AggregatorV3Interface priceFeed) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 1e10); // ajustando o preço para ter 18 decimais
    }

    function buyTokensWithEth() external payable {
        uint256 ethPrice = getLatestPrice(priceFeedETH);
        uint256 tokenAmount = (msg.value * ethPrice) / DRINK_PRICE_USD;

        uint256 maxPurchase = 51_000 * (10 ** uint256(decimals()));
        require(tokenAmount <= maxPurchase, "Exceeds maximum purchase limit");

        _mint(msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, address(0), msg.value, tokenAmount);
    }

    function buyTokensWithMatic(uint256 maticAmount) external {
        uint256 maticPrice = getLatestPrice(priceFeedMATIC);
        uint256 tokenAmount = (maticAmount * maticPrice) / DRINK_PRICE_USD;

        uint256 maxPurchase = 51_000 * (10 ** uint256(decimals()));
        require(tokenAmount <= maxPurchase, "Exceeds maximum purchase limit");

        _mint(msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, address(0), maticAmount, tokenAmount);
    }

    function buyTokensWithBtc(uint256 btcAmount) external {
        uint256 btcPrice = getLatestPrice(priceFeedBTC);
        uint256 tokenAmount = (btcAmount * btcPrice) / DRINK_PRICE_USD;

        uint256 maxPurchase = 51_000 * (10 ** uint256(decimals()));
        require(tokenAmount <= maxPurchase, "Exceeds maximum purchase limit");

        _mint(msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, address(0), btcAmount, tokenAmount);
    }

    function buyTokensWithUsd(uint256 usdAmount) external {
        uint256 tokenAmount = (usdAmount * 1e18) / DRINK_PRICE_USD;

        uint256 maxPurchase = 51_000 * (10 ** uint256(decimals()));
        require(tokenAmount <= maxPurchase, "Exceeds maximum purchase limit");

        _mint(msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, address(0), usdAmount, tokenAmount);
    }

    function stakeTokens(uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(stakingBalance[msg.sender] + amount <= MAX_DRINKS_STAKE, "Exceeds maximum drinks stake");

        if (stakingBalance[msg.sender] == 0) {
            startTime[msg.sender] = block.timestamp;
        }

        _transfer(msg.sender, address(this), amount);
        stakingBalance[msg.sender] += amount;

        emit TokensStaked(msg.sender, amount);
    }

    function unstakeTokens(uint256 amount) public {
        require(stakingBalance[msg.sender] >= amount, "Insufficient staked balance");
        require(amount > 0, "Amount must be greater than zero");

        stakingBalance[msg.sender] -= amount;

        if (stakingBalance[msg.sender] == 0) {
            startTime[msg.sender] = 0;
        }

        _transfer(address(this), msg.sender, amount);

        emit TokensUnstaked(msg.sender, amount);
    }
}