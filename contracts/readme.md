# README: Contratos e Integração

Este README destina-se a garantir que todos os contratos estejam funcionais e integrados corretamente, fornecendo informações sobre os contratos envolvidos e os passos necessários para verificar sua funcionalidade.

## Contratos

1. **DrinkToken.sol**: Este contrato gerencia o token principal DRINK, incluindo funcionalidades de compra, venda e staking.
2. **LiquidityPool.sol**: Gerencia a adição e remoção de liquidez no pool, permitindo trocas entre ETH e DRINK.
3. **Swap.sol**: Gerencia as trocas entre ETH e DRINK usando os pools de liquidez.
4. **StakingContract.sol**: Permite aos usuários fazer staking de DRINK tokens para ganhar recompensas em DRIPS tokens.
5. **DripsToken.sol**: Gerencia o token DRIPS, incluindo a capacidade de mintar tokens como recompensas de staking.
6. **StakingFactory.sol**: Permite a criação de novos contratos de staking, transferindo a propriedade para o criador do contrato.

## Integração e Funcionamento

### Passos para Verificar a Funcionalidade

1. **Deploy dos Contratos**
   - Deploy do contrato de token DRIPS (DripsToken.sol).
   - Deploy do contrato de token DRINK (DrinkToken.sol), configurando os feeds de preços adequados.
   - Deploy do contrato de pool de liquidez (LiquidityPool.sol) com o endereço do token DRINK.
   - Deploy do contrato de swap (Swap.sol) com o endereço do pool de liquidez.
   - Deploy do contrato da fábrica de staking (StakingFactory.sol).

2. **Configuração Pós-Deploy**
   - Configurar o contrato de StakingContract com o endereço dos tokens DRINK e DRIPS via StakingFactory.
   - Configurar o endereço do contrato de staking no contrato DripsToken.

3. **Fluxo de Uso**
   - Adicionar/Remover Liquidez: Usuários podem adicionar e remover liquidez no LiquidityPool.
   - Troca de Tokens: Usuários podem trocar ETH por DRINK e vice-versa via Swap.
   - Staking: Usuários podem fazer staking de DRINK tokens no StakingContract e receber recompensas em DRIPS tokens.

## Testes e Validação

Para garantir que tudo está funcionando corretamente, siga estas etapas:

1. **Testar Funções Individuais**
   - Comprar tokens DRINK com ETH.
   - Adicionar e remover liquidez no pool.
   - Trocar tokens usando o contrato de swap.
   - Fazer staking e receber recompensas em DRIPS.

2. **Verificar Eventos**
   - Assegure-se de que todos os eventos estão sendo emitidos corretamente para facilitar a rastreabilidade e o debugging.

3. **Auditoria de Segurança**
   - Revise os contratos para garantir que não há vulnerabilidades de segurança, especialmente reentrância e overflow/underflow.
