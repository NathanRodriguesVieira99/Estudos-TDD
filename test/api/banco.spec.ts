import axios from "axios";

/* O Axios por default, lança um erro quando não recebe um status 200, esse trecho de código desabilita isso. */
axios.defaults.validateStatus = () => true;

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
