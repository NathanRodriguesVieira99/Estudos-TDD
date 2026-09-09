import { faker } from "@faker-js/faker";
import mysqlConnection from "mysql2/promise";

import { BankDAODatabase } from "@/bank.dao-database.ts";

let bankDAO: BankDAODatabase;

const connection = mysqlConnection.createPool(String(process.env.DATABASE_URL));

beforeAll(() => {
  bankDAO = new BankDAODatabase();
});

afterAll(() => {
  connection.pool.end();
});

describe("Bank DAO Database", () => {
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
    const fakeCode = faker.string.numeric(3);
    await connection.query(`DELETE FROM BANCO WHERE CODIGO = ?`, [fakeCode]);
    const bankId = await bankDAO.save({
      codigo: fakeCode,
      nome: "nome",
      url: "url.com",
    });
    const savedBank = await bankDAO.getByCode(fakeCode);
    expect(savedBank).toBeTruthy();
    expect(savedBank!.BANCO_ID).toBe(bankId);
    expect(savedBank!.CODIGO).toBe(fakeCode);
    expect(savedBank!.NOME).toBe("nome");
    expect(savedBank!.URL).toBe("url.com");
  });
  test("Deve lançar um erro se o bankId não for um número ao remover um banco", async () => {
    await expect(bankDAO.remove("NaN" as any)).rejects.toThrow(
      "ID do Banco informado é inválido",
    );
  });
  test("Deve retornar um banco pelo nome", async () => {
    const fakeCode = faker.string.numeric(3);
    const fakeName = faker.person.fullName();
    const bankId = await bankDAO.save({
      codigo: fakeCode,
      nome: fakeName,
      url: "url.com",
    });
    const savedBank = await bankDAO.getByName(fakeName);
    expect(savedBank).toBeTruthy();
    expect(savedBank!.BANCO_ID).toBe(bankId);
    expect(savedBank!.CODIGO).toBe(fakeCode);
    expect(savedBank!.NOME).toBe(fakeName);
    expect(savedBank!.URL).toBe("url.com");
  });
});
