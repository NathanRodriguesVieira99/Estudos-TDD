import { faker } from "@faker-js/faker";
import axios from "axios";

/* O Axios por default, lança um erro quando não recebe um status 200, esse trecho de código desabilita isso. */
axios.defaults.validateStatus = () => true;

const baseUrl = "http://localhost:3001";

describe("GET /banco", () => {
  test("Deve retornar a lista de bancos", async () => {
    const fakeCode = faker.string.numeric(3);
    const inputCreate = {
      codigo: fakeCode,
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
});
describe("GET /banco/:id", () => {
  test("Deve retornar um banco", async () => {
    const fakeCode = faker.string.numeric(3);
    const inputCreate = {
      codigo: fakeCode,
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
});
describe("POST /banco", () => {
  test("Deve criar um banco", async () => {
    const fakeCode = faker.string.numeric(3);
    const inputCreate = {
      codigo: fakeCode,
      nome: "Banco Teste",
      url: "teste.com",
    };
    const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate);
    const outputCreate = responseCreate.data;
    const bankId = outputCreate.id;
    expect(bankId).toBeTruthy()
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
  /*
    test.each([])('', () => { })

    No Vitest/Jest se usa quando precisa rodar o mesmo teste
    com diferentes variáveis (são casos de teste com múltiplos valores).
    
    Passa o valor das variáveis no array (strings,objetos,etc.).
    No nome do teste se passa %s para strings, %o para objetos etc. 
    Docs do vitest com cada opção: https://vitest.dev/api/test.html#test-each.
   
    No segundo parâmetro que é a função onde o teste roda em test.each([])('', async () => { }), se passa os
    parâmetros da função (as variáveis do array) com o valor mudando a cada teste.
    Esses parametros podem receber qualquer nome.
    */
  test.each([""])(
    "Não deve criar um banco com nome inválido: %s (POST /banco)",
    async (invalidName: any) => {
      const fakeCode = faker.string.numeric(3);
      const inputCreate = {
        codigo: fakeCode,
        nome: invalidName,
        url: "teste.com",
      };
      const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate);
      expect(responseCreate.status).toBe(422);
      const outputCreate = responseCreate.data;
      expect(outputCreate.message).toBe("Nome inválido");
    },
  );
  test.each([""])(
    "Não deve criar um banco com nome código inválido: %s",
    async (invalidCode: any) => {
      const inputCreate = {
        codigo: invalidCode,
        nome: "Teste Silva",
        url: "teste.com",
      };
      const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate);
      expect(responseCreate.status).toBe(422);
      const outputCreate = responseCreate.data;
      expect(outputCreate.message).toBe("Código inválido");
    },
  );
});
describe("PUT /banco/:id", () => {
  test("Deve alterar um banco", async () => {
    const fakeCode = faker.string.numeric(3);
    const inputCreate = {
      codigo: fakeCode,
      nome: "Banco Teste",
      url: "teste.com",
    };
    const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate);
    const outputCreate = responseCreate.data;
    const bankId = outputCreate.id;
    const inputUpdate = {
      codigo: fakeCode,
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
  test.each([""])(
    "Não deve alterar um banco com nome inválido %s",
    async (invalidName: any) => {
      const bankId = 9_999_999;
      const inputUpdate = {
        codigo: "777",
        nome: invalidName,
        url: "teste2.com",
      };
      const responseUpdate = await axios.put(
        `${baseUrl}/banco/${bankId}`,
        inputUpdate,
      );
      expect(responseUpdate.status).toBe(422);
      const outputUpdate = responseUpdate.data;
      expect(outputUpdate.message).toBe("Nome inválido");
    },
  );
  test.each([""])(
    "Não deve alterar um banco com código inválido %s",
    async (invalidCode: any) => {
      const fakeCode = faker.string.numeric(3);
      const inputCreate = {
        codigo: fakeCode,
        nome: "Banco Teste",
        url: "teste.com",
      };
      const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate);
      const outputCreate = responseCreate.data;
      const bankId = outputCreate.id;
      const inputUpdate = {
        codigo: invalidCode,
        nome: "Banco Teste 2",
        url: "teste2.com",
      };
      const responseUpdate = await axios.put(
        `${baseUrl}/banco/${bankId}`,
        inputUpdate,
      );
      expect(responseUpdate.status).toBe(422);
      const outputUpdate = responseUpdate.data;
      expect(outputUpdate.message).toBe("Código inválido");
      await axios.delete(`${baseUrl}/banco/${outputCreate.id}`);
    },
  );
  test.each([""])("Não deve alterar um banco inexistente", async () => {
    const bankId = 9_999_999;
    const inputUpdate = {
      codigo: "666",
      nome: "Banco Teste 2",
      url: "teste2.com",
    };
    const responseUpdate = await axios.put(
      `${baseUrl}/banco/${bankId}`,
      inputUpdate,
    );
    expect(responseUpdate.status).toBe(404);
    const outputUpdate = responseUpdate.data;
    expect(outputUpdate.message).toBe("Banco não encontrado");
  });
});
describe("DELETE /banco/:id", () => {
  test("Deve deletar um banco", async () => {
    const fakeCode = faker.string.numeric(3);
    const inputCreate = {
      codigo: fakeCode,
      nome: "Banco Teste Delete",
      url: "teste_delete.com",
    };
    const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate);
    const outputCreate = responseCreate.data;
    const bankId = outputCreate.id;
    expect(bankId).toBeTruthy();
    const responseDelete = await axios.delete(`${baseUrl}/banco/${bankId}`);
    expect(responseDelete.status).toBe(200);
    const responseGet = await axios.get(`${baseUrl}/banco/${bankId}`);
    expect(responseGet.status).toBe(404);
    expect(responseGet.data?.id).toBeFalsy();
  });
});
