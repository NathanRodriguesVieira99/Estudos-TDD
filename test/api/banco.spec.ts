import axios from "axios";

/* O Axios por default, lança um erro quando não recebe um status 200, esse trecho de código desabilita isso. */
axios.defaults.validateStatus = () => true;

/***************************
  TDD (Test-Driven Development)
  É uma metodologia onde os testes são escritos antes do código de produção e constitui em três etapas:
  RED => Escrever um teste que inicialmente não passa.
  GREEN => Escrever um código minimo para esse teste passar.
  REFACTOR => Refatora o código seguindo boas práticas, clean code, etc sem quebrar o teste e o ciclo se repete.
 ***************************/

/***************************
 Acrônimo FIRST é um conjunto de boas práticas para os testes automatizados.
 F => Fast => Os testes devem ser rápidos para executar.
 I => Independent => Os testes não podem depender um dos outros. A ordem de execução não pode importar e nem devem compartilhar estado entre si.
 R => Repeatable => Os testes devem produzir o mesmo resultado toda vez que forem executados. Independente do ambiente.
 S => Self-validating => Os testes devem determinar explicitamente se passaram ou falharam.
 T => Timely => Os testes devem ser escritos no momento certo, idealmente antes do código de produção se utilizando de TDD.
 ***************************/

/***************************
 Test Doubles (Dublês de Teste) são objetos que fingem serem objetos reais para fins de testes.
 São usados para simular dependencias externas ao nosso SUT (System Under Testing) ou qualquer elemento real em um teste. Eles São:

 Mock => São objetos que simulam interações com dependencias externas ao teste.
 Com Mocks podemos controlar e inspecionar requisições, simular comportamento, verificar se um método foi ou não chamado,
 se o método foi chamado com parametros corretos, etc.

 Stub => São objetos que simulam interações de alguma dependência externa ao SUT.
 Diferente do Mock, Stub é um objeto com respostas prontas (fixas) para serem usadas no teste.

 Spy => São Stubs com capacidade de gravação, ou seja, registrar quantas vezes um método foi chamado, quais parametros foram recebidos, etc.
 Ele basicamente 'espiona' o método real.

 Fake => São objetos reais muito próximos da versão em produção, mas que trazem velocidade aos testes.

 Dummy => São apenas uma lista de argumentos que utilizamos para manter a assinatura/contrato do método no teste,
 servem apenas para preencher um espaço necessário, mas não produzem efeito no teste.
 ***************************/

const baseUrl = "http://localhost:3001";

test("Deve retornar a lista de bancos (GET/banco)", async () => {
  const inputCreate = {
    codigo: "559",
    nome: "Banco Teste List",
    url: "teste_list.com",
  };
  const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate);
  const outputCreate = responseCreate.data;
  const bankId = outputCreate.id;
  const response = await axios.get(`${baseUrl}/banco`);
  const output = response.data;
  expect(response.status).toBe(200);
  expect(output).toBeInstanceOf(Array);
  expect(output.length).toBeGreaterThan(1);
  const bankData = output.find((bank) => bank.id === bankId);
  expect(bankData).toBeTruthy();
  expect(bankData.id).toBe(bankId);
  expect(bankData.codigo).toBe(inputCreate.codigo);
  expect(bankData.nome).toBe(inputCreate.nome);
  expect(bankData.url).toBe(inputCreate.url);
  await axios.delete(`${baseUrl}/banco/${bankId}`);
});
test("Deve retornar um banco (GET /banco/:id)", async () => {
  const inputCreate = {
    codigo: "559",
    nome: "Banco Teste Find One",
    url: "teste_find_one.com",
  };
  const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate);
  const outputCreate = responseCreate.data;
  const bankId = outputCreate.id;
  const response = await axios.get(`${baseUrl}/banco/${bankId}`);
  const output = response.data;
  expect(response.status).toBe(200);
  expect(output.id).toBe(bankId);
  expect(output.codigo).toBe(inputCreate.codigo);
  expect(output.nome).toBe(inputCreate.nome);
  expect(output.url).toBe(inputCreate.url);
  await axios.delete(`${baseUrl}/banco/${bankId}`);
});
test("Deve criar um banco (POST /banco)", async () => {
  const inputCreate = {
    codigo: "555",
    nome: "Banco Teste",
    url: "teste.com",
  };
  const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate);
  const outputCreate = responseCreate.data;
  const bankId = outputCreate.id;
  expect(responseCreate.status).toBe(201);
  expect(outputCreate.id).toBeTruthy();
  expect(outputCreate.codigo).toBe(inputCreate.codigo);
  expect(outputCreate.nome).toBe(inputCreate.nome);
  expect(outputCreate.url).toBe(inputCreate.url);
  const responseGet = await axios.get(`${baseUrl}/banco/${bankId}`);
  const outputGet = responseGet.data;
  expect(outputGet.id).toBe(outputCreate.id);
  expect(outputGet.codigo).toBe(outputCreate.codigo);
  expect(outputGet.nome).toBe(outputCreate.nome);
  expect(outputGet.url).toBe(outputCreate.url);
  await axios.delete(`${baseUrl}/banco/${bankId}`);
});
test("Deve alterar um banco (PUT /banco)", async () => {
  const inputCreate = {
    codigo: "553",
    nome: "Banco Teste",
    url: "teste.com",
  };
  const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate);
  const outputCreate = responseCreate.data;
  const bankId = outputCreate.id;
  const inputUpdate = {
    codigo: "553",
    nome: "Banco Teste 2",
    url: "teste2.com",
  };
  const responseUpdate = await axios.put(
    `${baseUrl}/banco/${bankId}`,
    inputUpdate,
  );
  const outputUpdate = responseUpdate.data;
  expect(responseUpdate.status).toBe(200);
  expect(outputUpdate.id).toBe(bankId);
  expect(outputUpdate.codigo).toBe(inputUpdate.codigo);
  expect(outputUpdate.nome).toBe(inputUpdate.nome);
  expect(outputUpdate.url).toBe(inputUpdate.url);
  const responseGet = await axios.get(`${baseUrl}/banco/${outputCreate.id}`);
  const outputGet = responseGet.data;
  expect(outputGet.id).toBe(outputCreate.id);
  expect(outputGet.codigo).toBe(inputUpdate.codigo);
  expect(outputGet.nome).toBe(inputUpdate.nome);
  expect(outputGet.url).toBe(inputUpdate.url);
  await axios.delete(`${baseUrl}/banco/${outputCreate.id}`);
});
test("Deve deletar um banco (DELETE /banco/:id)", async () => {
  const inputCreate = {
    codigo: "556",
    nome: "Banco Teste Delete",
    url: "teste_delete.com",
  };
  const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate);
  const outputCreate = responseCreate.data;
  const bankId = outputCreate.id;
  const responseDelete = await axios.delete(`${baseUrl}/banco/${bankId}`);
  expect(responseDelete.status).toBe(200);
  const responseGet = await axios.get(`${baseUrl}/banco/${bankId}`);
  expect(responseGet.status).toBe(404);
});
