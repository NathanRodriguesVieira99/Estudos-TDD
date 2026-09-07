# Anotações sobre padrões e boas práticas para testes

## TDD (Test-Driven Development)

É uma metodologia onde os testes são escritos antes do código de produção e constitui em três etapas:

- RED: Escrever um teste que inicialmente não passa.
- GREEN: Escrever um código minimo para esse teste passar.
- REFACTOR: Refatora o código seguindo boas práticas, clean code, etc sem quebrar o teste e o ciclo se repete.

## Acrônimo FIRST é um conjunto de boas práticas para os testes automatizados

- F (Fast ): Os testes devem ser rápidos para executar.
- I (Independent) Os testes não podem depender um dos outros. A ordem de execução não pode importar e nem devem compartilhar estado entre si.
- R (Repeatable): Os testes devem produzir o mesmo resultado toda vez que forem executados. Independente do ambiente.
- S (Self-validating): Os testes devem determinar explicitamente se passaram ou falharam.
- T (Timely): Os testes devem ser escritos no momento certo, idealmente antes do código de produção se utilizando de TDD.

## Test Doubles (Dublês de Teste) são objetos que fingem serem objetos reais para fins de testes

São usados para simular dependencias externas ao nosso SUT (System Under Testing) ou qualquer elemento real em um teste. Eles São:

- Mock: São objetos que simulam interações com dependencias externas ao teste.
  Com Mocks podemos controlar e inspecionar requisições, simular comportamento, verificar se um método foi ou não chamado,
  se o método foi chamado com parametros corretos, etc.

- Stub: São objetos que simulam interações de alguma dependência externa ao SUT.
  Diferente do Mock, Stub é um objeto com respostas prontas (fixas) para serem usadas no teste.

- Spy: São Stubs com capacidade de gravação, ou seja, registrar quantas vezes um método foi chamado, quais parametros foram recebidos, etc.
  Ele basicamente 'espiona' o método real.

- Fake: São objetos reais muito próximos da versão em produção, mas que trazem velocidade aos testes.

- Dummy: São apenas uma lista de argumentos que utilizamos para manter a assinatura/contrato do método no teste,
  servem apenas para preencher um espaço necessário, mas não produzem efeito no teste.
