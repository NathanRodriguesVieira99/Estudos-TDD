import { faker } from "@faker-js/faker";

import type { BankDAO } from "@/bank.dao-database.ts";

import { BankDAOFake } from "../mocks/fakes/bank.dao.fake.ts";

let bankDAO: BankDAO;

beforeEach(() => {
  bankDAO = new BankDAOFake();
});

describe("Bank DAO Fake", () => {
  test("Deve testar o acesso ao banco", async () => {
    const bankId = await bankDAO.save({
      codigo: "123",
      nome: "nome",
      url: "url",
    });
    const listBank = await bankDAO.list();
    const exists = listBank.find((bank) => bank.BANCO_ID === bankId);
    expect(exists).toBeTruthy();
    expect(exists?.CODIGO).toBe("123");
    expect(exists?.NOME).toBe("nome");
    expect(exists?.URL).toBe("url");
    await bankDAO.update({
      id: bankId,
      codigo: "321",
      nome: "nome alterado",
      url: "url alterada",
    });
    const updatedBank = await bankDAO.getById(bankId);
    expect(updatedBank).toBeTruthy();
    expect(updatedBank?.CODIGO).toBe("321");
    expect(updatedBank?.NOME).toBe("nome alterado");
    expect(updatedBank?.URL).toBe("url alterada");
    await bankDAO.remove(bankId);
    const bankData = await bankDAO.getById(bankId);
    expect(bankData).toBeFalsy();
  });
  test("Deve retornar um banco pelo código", async () => {
    const bankId = await bankDAO.save({
      codigo: "123",
      nome: "nome",
      url: "url.com",
    });
    const savedBank = await bankDAO.getByCode("123");
    expect(savedBank).toBeTruthy();
    expect(savedBank!.BANCO_ID).toBe(bankId);
    expect(savedBank!.CODIGO).toBe("123");
    expect(savedBank!.NOME).toBe("nome");
    expect(savedBank!.URL).toBe("url.com");
  });
  test("Deve retornar um banco pelo nome", async () => {
    const fakeName = faker.person.fullName();
    const bankId = await bankDAO.save({
      codigo: "123",
      nome: fakeName,
      url: "url.com",
    });
    const savedBank = await bankDAO.getByName(fakeName);
    expect(savedBank).toBeTruthy();
    expect(savedBank!.BANCO_ID).toBe(bankId);
    expect(savedBank!.CODIGO).toBe("123");
    expect(savedBank!.NOME).toBe(fakeName);
    expect(savedBank!.URL).toBe("url.com");
  });
});
