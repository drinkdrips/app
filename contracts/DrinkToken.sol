// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract DrinkToken is ERC20, Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    uint256 public constant MAX_SUPPLY = 51_000_000 * (10 ** uint256(18));
    uint256 public constant MAX_DRINKS_STAKE = 100 * (10 ** 18);
    uint256 public constant PRE_SALE_SUPPLY = 30_000_000 * (10 ** uint256(18));
    uint256 public constant DRINK_PRICE_USD = 10; // $0.10 por Drink token
    bool public presaleActive = true;

    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public startTime;
    mapping(address => uint256) public tokensPurchased;

    event TokensPurchased(address indexed buyer, address indexed token, uint256 amountPaid, uint256 amountBought);
    event TokensStaked(address indexed staker, uint256 amount);
    event TokensUnstaked(address indexed staker, uint256 amount);

    AggregatorV3Interface internal priceFeedUSD;
    AggregatorV3Interface internal priceFeedETH;
    AggregatorV3Interface internal priceFeedMATIC;
    AggregatorV3Interface internal priceFeedBTC;

    constructor(
        address _priceFeedUSD,
        address _priceFeedETH,
        address _priceFeedMATIC,
        address _priceFeedBTC
    ) ERC20("DrinkToken", "DRINK") Ownable(msg.sender) {
        require(_priceFeedUSD != address(0), "Invalid price feed address");
        require(_priceFeedETH != address(0), "Invalid price feed address");
        require(_priceFeedMATIC != address(0), "Invalid price feed address");
        require(_priceFeedBTC != address(0), "Invalid price feed address");

        priceFeedUSD = AggregatorV3Interface(_priceFeedUSD);
        priceFeedETH = AggregatorV3Interface(_priceFeedETH);
        priceFeedMATIC = AggregatorV3Interface(_priceFeedMATIC);
        priceFeedBTC = AggregatorV3Interface(_priceFeedBTC);
    }

    function getLatestPrice(AggregatorV3Interface priceFeed) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 1e10); // ajustando o preço para ter 18 decimais
    }

    function buyTokensWithEth() external payable whenNotPaused nonReentrant {
        uint256 ethPrice = getLatestPrice(priceFeedETH);
        uint256 tokenAmount = (msg.value * ethPrice) / DRINK_PRICE_USD;

        _handlePurchase(tokenAmount);
        emit TokensPurchased(msg.sender, address(0), msg.value, tokenAmount);
    }

    function buyTokensWithMatic(uint256 maticAmount) external whenNotPaused nonReentrant {
        uint256 maticPrice = getLatestPrice(priceFeedMATIC);
        uint256 tokenAmount = (maticAmount * maticPrice) / DRINK_PRICE_USD;

        _handlePurchase(tokenAmount);
        emit TokensPurchased(msg.sender, address(0), maticAmount, tokenAmount);
    }

        function buyTokensWithBtc(uint256 btcAmount) external whenNotPaused nonReentrant {
        uint256 btcPrice = getLatestPrice(priceFeedBTC);
        uint256 tokenAmount = (btcAmount * btcPrice) / DRINK_PRICE_USD;

        _handlePurchase(tokenAmount);
        emit TokensPurchased(msg.sender, address(0), btcAmount, tokenAmount);
    }

    function buyTokensWithUsd(uint256 usdAmount) external whenNotPaused nonReentrant {
        uint256 tokenAmount = (usdAmount * 1e18) / DRINK_PRICE_USD;

        _handlePurchase(tokenAmount);
        emit TokensPurchased(msg.sender, address(0), usdAmount, tokenAmount);
    }

    function _handlePurchase(uint256 tokenAmount) internal {
        require(totalSupply() + tokenAmount <= MAX_SUPPLY, "Exceeds maximum supply");
        if (presaleActive) {
            require(totalSupply() + tokenAmount <= PRE_SALE_SUPPLY, "Exceeds pre-sale supply");
            uint256 maxPurchase = PRE_SALE_SUPPLY / 200; // 0.5% of pre-sale supply
            require(tokensPurchased[msg.sender] + tokenAmount <= maxPurchase, "Exceeds maximum purchase limit per address during pre-sale");
            tokensPurchased[msg.sender] += tokenAmount;
        }
        _mint(msg.sender, tokenAmount);
    }

    function endPresale() external onlyOwner {
        presaleActive = false;
    }

    function mintTokens(uint256 amount) external onlyOwner {
        require(!presaleActive, "Cannot mint during presale");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds maximum supply");
        _mint(msg.sender, amount);
    }

    function stakeTokens(uint256 amount) public whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(stakingBalance[msg.sender] + amount <= MAX_DRINKS_STAKE, "Exceeds maximum drinks stake");

        if (stakingBalance[msg.sender] == 0) {
            startTime[msg.sender] = block.timestamp;
        }

        IERC20(address(this)).safeTransferFrom(msg.sender, address(this), amount);
        stakingBalance[msg.sender] += amount;

        emit TokensStaked(msg.sender, amount);
    }

    function unstakeTokens(uint256 amount) public whenNotPaused nonReentrant {
        require(stakingBalance[msg.sender] >= amount, "Insufficient staked balance");
        require(amount > 0, "Amount must be greater than zero");

        stakingBalance[msg.sender] -= amount;

        if (stakingBalance[msg.sender] == 0) {
            startTime[msg.sender] = 0;
        }

        IERC20(address(this)).safeTransfer(msg.sender, amount);

        emit TokensUnstaked(msg.sender, amount);
    }

    function updatePriceFeeds(
        address _priceFeedUSD,
        address _priceFeedETH,
        address _priceFeedMATIC,
        address _priceFeedBTC
    ) external onlyOwner {
        require(_priceFeedUSD != address(0), "Invalid price feed address");
        require(_priceFeedETH != address(0), "Invalid price feed address");
        require(_priceFeedMATIC != address(0), "Invalid price feed address");
        require(_priceFeedBTC != address(0), "Invalid price feed address");

        priceFeedUSD = AggregatorV3Interface(_priceFeedUSD);
        priceFeedETH = AggregatorV3Interface(_priceFeedETH);
        priceFeedMATIC = AggregatorV3Interface(_priceFeedMATIC);
        priceFeedBTC = AggregatorV3Interface(_priceFeedBTC);
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
