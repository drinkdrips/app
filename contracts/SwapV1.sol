// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/Pausable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Swap is Ownable, ReentrancyGuard, Pausable {
    IERC20 public drinkToken;
    IERC20 public wethToken;
    IERC20 public usdcToken;
    IERC20 public maticToken;

    AggregatorV3Interface internal priceFeedETH;
    AggregatorV3Interface internal priceFeedWETH;
    AggregatorV3Interface internal priceFeedUSDC;
    AggregatorV3Interface internal priceFeedMATIC;
    AggregatorV3Interface internal priceFeedDrinkETH;

    uint256 public transactionFee = 3; // 3%

    event SwapEthForDrink(address indexed swapper, uint256 ethAmount, uint256 tokenAmount);
    event SwapDrinkForEth(address indexed swapper, uint256 tokenAmount, uint256 ethAmount);
    event SwapTokenForDrink(address indexed swapper, address indexed token, uint256 tokenAmount, uint256 drinkAmount);
    event SwapDrinkForToken(address indexed swapper, uint256 drinkAmount, address indexed token, uint256 tokenAmount);
    event TransactionFeeUpdated(uint256 newFee);

    constructor(
        address _drinkToken,
        address _wethToken,
        address _usdcToken,
        address _maticToken,
        address _priceFeedETH,
        address _priceFeedWETH,
        address _priceFeedUSDC,
        address _priceFeedMATIC,
        address _priceFeedDrinkETH
    ) {
        require(_drinkToken != address(0), "Invalid DRINK token address");
        require(_wethToken != address(0), "Invalid WETH token address");
        require(_usdcToken != address(0), "Invalid USDC token address");
        require(_maticToken != address(0), "Invalid MATIC token address");
        require(_priceFeedETH != address(0), "Invalid ETH price feed address");
        require(_priceFeedWETH != address(0), "Invalid WETH price feed address");
        require(_priceFeedUSDC != address(0), "Invalid USDC price feed address");
        require(_priceFeedMATIC != address(0), "Invalid MATIC price feed address");
        require(_priceFeedDrinkETH != address(0), "Invalid DRINK price feed address");

        drinkToken = IERC20(_drinkToken);
        wethToken = IERC20(_wethToken);
        usdcToken = IERC20(_usdcToken);
        maticToken = IERC20(_maticToken);

        priceFeedETH = AggregatorV3Interface(_priceFeedETH);
        priceFeedWETH = AggregatorV3Interface(_priceFeedWETH);
        priceFeedUSDC = AggregatorV3Interface(_priceFeedUSDC);
        priceFeedMATIC = AggregatorV3Interface(_priceFeedMATIC);
        priceFeedDrinkETH = AggregatorV3Interface(_priceFeedDrinkETH);
    }

    modifier validToken(address token) {
        require(token != address(0), "Invalid token address");
        _;
    }

    modifier positiveAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than zero");
        _;
    }

    function setTransactionFee(uint256 _transactionFee) external onlyOwner {
        require(_transactionFee <= 100, "Transaction fee too high");
        transactionFee = _transactionFee;
        emit TransactionFeeUpdated(_transactionFee);
    }

    function getLatestPrice(AggregatorV3Interface priceFeed) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 1e10); // Adjusting the price to have 18 decimals
    }

    function swapEthForDrink() external payable nonReentrant whenNotPaused positiveAmount(msg.value) {
        uint256 ethPrice = getLatestPrice(priceFeedETH);
        uint256 tokenAmount = (msg.value * ethPrice) / 10; // Assuming DRINK_PRICE_USD = 10
        uint256 fee = (tokenAmount * transactionFee) / 100;
        uint256 netTokenAmount = tokenAmount - fee;

        require(drinkToken.balanceOf(address(this)) >= netTokenAmount, "Insufficient token balance in contract");

        drinkToken.transfer(msg.sender, netTokenAmount);

        emit SwapEthForDrink(msg.sender, msg.value, netTokenAmount);
    }

    function swapDrinkForEth(uint256 tokenAmount) external nonReentrant whenNotPaused positiveAmount(tokenAmount) {
        require(drinkToken.balanceOf(msg.sender) >= tokenAmount, "Insufficient token balance");

        uint256 ethPrice = getLatestPrice(priceFeedDrinkETH);
        uint256 ethAmount = (tokenAmount * 10) / ethPrice; // Assuming DRINK_PRICE_USD = 10
        uint256 fee = (ethAmount * transactionFee) / 100;
        uint256 netEthAmount = ethAmount - fee;

        require(address(this).balance >= netEthAmount, "Insufficient ETH balance in contract");

        drinkToken.transferFrom(msg.sender, address(this), tokenAmount);
        payable(msg.sender).transfer(netEthAmount);

        emit SwapDrinkForEth(msg.sender, tokenAmount, netEthAmount);
    }

    function swapTokenForDrink(address token, uint256 tokenAmount) external nonReentrant whenNotPaused validToken(token) positiveAmount(tokenAmount) {
        AggregatorV3Interface priceFeed = getPriceFeed(token);
        require(priceFeed != AggregatorV3Interface(address(0)), "Unsupported token");

        uint256 tokenPrice = getLatestPrice(priceFeed);
        uint256 drinkPrice = getLatestPrice(priceFeedDrinkETH);
        uint256 drinkAmount = (tokenAmount * tokenPrice) / drinkPrice;
        uint256 fee = (drinkAmount * transactionFee) / 100;
        uint256 netDrinkAmount = drinkAmount - fee;

        require(drinkToken.balanceOf(address(this)) >= netDrinkAmount, "Insufficient DRINK balance in contract");

        IERC20(token).transferFrom(msg.sender, address(this), tokenAmount);
        drinkToken.transfer(msg.sender, netDrinkAmount);

        emit SwapTokenForDrink(msg.sender, token, tokenAmount, netDrinkAmount);
    }

    function swapDrinkForToken(uint256 drinkAmount, address token) external nonReentrant whenNotPaused validToken(token) positiveAmount(drinkAmount) {
        require(drinkToken.balanceOf(msg.sender) >= drinkAmount, "Insufficient DRINK balance");

        AggregatorV3Interface priceFeed = getPriceFeed(token);
        require(priceFeed != AggregatorV3Interface(address(0)), "Unsupported token");

        uint256 tokenPrice = getLatestPrice(priceFeed);
        uint256 drinkPrice = getLatestPrice(priceFeedDrinkETH);
        uint256 tokenAmount = (drinkAmount * drinkPrice) / tokenPrice;
        uint256 fee = (tokenAmount * transactionFee) / 100;
        uint256 netTokenAmount = tokenAmount - fee;

        require(IERC20(token).balanceOf(address(this)) >= netTokenAmount, "Insufficient token balance in contract");

        drinkToken.transferFrom(msg.sender, address(this), drinkAmount);
        IERC20(token).transfer(msg.sender, netTokenAmount);

        emit SwapDrinkForToken(msg.sender, drinkAmount, token, netTokenAmount);
    }

    function getPriceFeed(address token) internal view returns (AggregatorV3Interface) {
        if (token == address(wethToken)) {
            return priceFeedWETH;
        } else if (token == address(usdcToken)) {
            return priceFeedUSDC;
        } else if (token == address(maticToken)) {
            return priceFeedMATIC;
        } else {
            return AggregatorV3Interface(address(0));
        }
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    receive() external payable {}
}
