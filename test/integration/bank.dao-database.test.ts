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
    const code = faker.string.numeric(3);
    const name = faker.person.fullName();
    await connection.query(`DELETE FROM banco WHERE codigo = ? AND nome = ?`, [
      code,
      name,
    ]);
    const bankId = await bankDAO.save({
      codigo: code,
      nome: name,
      url: "url",
    });
    const listBank = await bankDAO.list();
    const exists = listBank.find((bank) => bank.banco_id === bankId);
    expect(exists).toBeTruthy();
    expect(exists?.codigo).toBe(code);
    expect(exists?.nome).toBe(name);
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
    const code = faker.string.numeric(3);
    const name = faker.person.fullName();
    await connection.query(`DELETE FROM banco WHERE codigo = ? AND nome = ?`, [
      code,
      name,
    ]);
    const bankId = await bankDAO.save({
      codigo: code,
      nome: name,
      url: "url.com",
    });
    const savedBank = await bankDAO.getByCode(code);
    expect(savedBank).toBeTruthy();
    expect(savedBank!.banco_id).toBe(bankId);
    expect(savedBank!.codigo).toBe(code);
    expect(savedBank!.nome).toBe(name);
    expect(savedBank!.url).toBe("url.com");
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
    expect(savedBank!.banco_id).toBe(bankId);
    expect(savedBank!.codigo).toBe(fakeCode);
    expect(savedBank!.nome).toBe(fakeName);
    expect(savedBank!.url).toBe("url.com");
  });
});
