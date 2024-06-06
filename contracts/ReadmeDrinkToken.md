Claro! Aqui está um exemplo de `README.md` explicando todas as fases desde o deploy até a fase pós pré-venda para o contrato `DrinkToken`.

```markdown
# DrinkToken

DrinkToken (DRINK) é um token ERC20 baseado na blockchain Ethereum, desenvolvido com funcionalidades de pré-venda, whitelist e controle de pausas para maior segurança. Este documento descreve as etapas para implantar o contrato, conduzir a pré-venda e gerenciar a fase pós-pré-venda.

## Sumário

1. [Descrição do Contrato](#descrição-do-contrato)
2. [Pré-requisitos](#pré-requisitos)
3. [Deploy do Contrato](#deploy-do-contrato)
4. [Gerenciamento da Whitelist](#gerenciamento-da-whitelist)
5. [Condução da Pré-venda](#condução-da-pré-venda)
6. [Encerramento da Pré-venda](#encerramento-da-pré-venda)
7. [Funções Administrativas](#funções-administrativas)

## Descrição do Contrato

O contrato DrinkToken inclui as seguintes funcionalidades:

- **Mint Inicial**: Mint inicial de tokens para o deployer.
- **Whitelist**: Preço especial de $0,05 por token para endereços na whitelist durante a pré-venda.
- **Pré-venda**: Tokens disponíveis a $0,10 por token.
- **Controle de Pausa**: Permite pausar e despausar a compra de tokens para segurança.
- **Limite de Compra**: Limite máximo de compra por endereço durante a pré-venda.

## Pré-requisitos

- Node.js
- Truffle ou Hardhat para deploy do contrato
- Conta no Ethereum com fundos para pagar as taxas de gás
- Solidity ^0.8.20

## Deploy do Contrato

1. Clone o repositório e navegue até o diretório do projeto:
   ```bash
   git clone https://github.com/seu-usuario/drinktoken.git
   cd drinktoken
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure seu ambiente de desenvolvimento com sua chave privada e URL do nó Ethereum no arquivo `.env`.

4. Compile o contrato:
   ```bash
   truffle compile
   ```

5. Faça o deploy do contrato, especificando o mint inicial desejado:
   ```javascript
   const DrinkToken = artifacts.require("DrinkToken");

   module.exports = function(deployer) {
       deployer.deploy(DrinkToken, "1000000" + "000000000000000000"); // Mint inicial de 1.000.000 tokens
   };
   ```

   ```bash
   truffle migrate --network <seu_network>
   ```

## Gerenciamento da Whitelist

1. **Adicionar Endereço à Whitelist**:
   ```solidity
   function addToWhiteList(address account) external onlyOwner;
   ```

   Exemplo usando Web3.js:
   ```javascript
   const addToWhiteList = async (contract, account, owner) => {
       await contract.methods.addToWhiteList(account).send({ from: owner });
   };
   ```

2. **Remover Endereço da Whitelist**:
   ```solidity
   function removeFromWhiteList(address account) external onlyOwner;
   ```

   Exemplo usando Web3.js:
   ```javascript
   const removeFromWhiteList = async (contract, account, owner) => {
       await contract.methods.removeFromWhiteList(account).send({ from: owner });
   };
   ```

## Condução da Pré-venda

1. **Comprar Tokens com USD**:
   Durante a pré-venda, qualquer endereço pode comprar tokens a $0,10 por token, e endereços na whitelist podem comprar a $0,05 por token.
   
   ```solidity
   function buyTokensWithUsd(uint256 usdAmount) external whenNotPaused nonReentrant;
   ```

   Exemplo usando Web3.js:
   ```javascript
   const buyTokens = async (contract, usdAmount, buyer) => {
       await contract.methods.buyTokensWithUsd(usdAmount).send({ from: buyer });
   };
   ```

2. **Pausar e Despausar a Compra de Tokens**:
   Somente o proprietário pode pausar e despausar a compra de tokens.
   
   ```solidity
   function pause() external onlyOwner;
   function unpause() external onlyOwner;
   ```

   Exemplo usando Web3.js:
   ```javascript
   const pauseContract = async (contract, owner) => {
       await contract.methods.pause().send({ from: owner });
   };

   const unpauseContract = async (contract, owner) => {
       await contract.methods.unpause().send({ from: owner });
   };
   ```

## Encerramento da Pré-venda

1. **Encerrar a Pré-venda**:
   Somente o proprietário pode encerrar a pré-venda.
   
   ```solidity
   function endPresale() external onlyOwner;
   ```

   Exemplo usando Web3.js:
   ```javascript
   const endPresale = async (contract, owner) => {
       await contract.methods.endPresale().send({ from: owner });
   };
   ```

## Funções Administrativas

1. **Mint de Tokens**:
   Após o término da pré-venda, o proprietário pode mintar tokens adicionais, respeitando o limite máximo de supply.
   
   ```solidity
   function mintTokens(uint256 amount) external onlyOwner;
   ```

   Exemplo usando Web3.js:
   ```javascript
   const mintTokens = async (contract, amount, owner) => {
       await contract.methods.mintTokens(amount).send({ from: owner });
   };
   ```

2. **Adicionar e Remover Endereços da Whitelist**:
   Conforme descrito anteriormente, o proprietário pode adicionar ou remover endereços da whitelist.

3. **Pausar e Despausar o Contrato**:
   Conforme descrito anteriormente, o proprietário pode pausar e despausar a compra de tokens.

## Considerações Finais

Este contrato oferece um mecanismo seguro e flexível para a distribuição de tokens através de uma pré-venda com preços diferenciados para investidores iniciais e controle total para o proprietário. Utilize as funções administrativas com cautela para manter a integridade do token e proteger os interesses dos investidores.

Se tiver dúvidas ou precisar de mais informações, sinta-se à vontade para abrir uma issue no repositório do projeto.

---

**Aviso Legal**: Este documento é fornecido "como está" e destina-se apenas a fins informativos. Nenhuma garantia é feita quanto à precisão, confiabilidade ou adequação a qualquer propósito específico. Use o contrato e as instruções por sua conta e risco.
```

Esse `README.md` fornece uma visão geral completa do contrato `DrinkToken`, instruções detalhadas para o deploy, gerenciamento da whitelist, condução da pré-venda, encerramento da pré-venda e funções administrativas. Adapte conforme necessário para o seu projeto específico.
