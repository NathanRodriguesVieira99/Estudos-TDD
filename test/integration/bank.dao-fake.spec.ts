import { faker } from "@faker-js/faker";

import type { BankDAO } from "@/bank.dao-database.ts";

import { BankDAOFake } from "../__mocks__/bank.dao-fake.ts";

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
    const exists = listBank.find((bank) => bank.banco_id === bankId);
    expect(exists).toBeTruthy();
    expect(exists?.codigo).toBe("123");
    expect(exists?.nome).toBe("nome");
    expect(exists?.url).toBe("url");
    await bankDAO.update({
      id: bankId,
      codigo: "321",
      nome: "nome alterado",
      url: "url alterada",
    });
    const updatedBank = await bankDAO.getById(bankId);
    expect(updatedBank).toBeTruthy();
    expect(updatedBank?.codigo).toBe("321");
    expect(updatedBank?.nome).toBe("nome alterado");
    expect(updatedBank?.url).toBe("url alterada");
    await bankDAO.remove(bankId);
    const bankData = await bankDAO.getById(bankId);
    expect(bankData).toBeFalsy();
  });
  test("Deve retornar um banco pelo código", async () => {
    const bankId = await bankDAO.save({
      codigo: "123",
      nome: "nome teste",
      url: "url.com",
    });
    const savedBank = await bankDAO.getByCode("123");
    expect(savedBank).toBeTruthy();
    expect(savedBank!.banco_id).toBe(bankId);
    expect(savedBank!.codigo).toBe("123");
    expect(savedBank!.nome).toBe("nome teste");
    expect(savedBank!.url).toBe("url.com");
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
    expect(savedBank!.banco_id).toBe(bankId);
    expect(savedBank!.codigo).toBe("123");
    expect(savedBank!.nome).toBe(fakeName);
    expect(savedBank!.url).toBe("url.com");
  });
});
