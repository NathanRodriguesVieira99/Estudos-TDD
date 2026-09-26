import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { BankDAODatabase } from "@/bank.dao-database.ts";
import { ApplicationError } from "@/application-error.ts";
import { MySQLAdapter } from "@/mysql.adapter.ts";
import type { DatabaseConnection } from "@/database-connection.ts";

let databaseConnection: DatabaseConnection;
let sut: BankDAODatabase;

beforeAll(() => {
  databaseConnection = new MySQLAdapter(String(process.env.DATABASE_URL));
  sut = new BankDAODatabase(databaseConnection);
});

afterAll(async () => {
  await databaseConnection.close();
  sinon.restore();
});

describe("Bank DAO Database", () => {
  test("deve chamar a query da conexao corretamente", async () => {
    const querySpy = sinon.spy(databaseConnection, "query");
    const fakeName = faker.person.fullName();
    await sut.getByName(fakeName);
    expect(querySpy.calledOnce).toBeTruthy();
    expect(
      querySpy.calledWith(sinon.match("nome = ?"), [fakeName]),
    ).toBeTruthy();
  });
  test("Deve testar o acesso ao banco", async () => {
    const code = faker.string.numeric(3);
    const name = faker.person.fullName();
    const bankId = await sut.save({
      codigo: code,
      nome: name,
      url: "url",
    });
    const listBank = await sut.list();
    const exists = listBank.find((bank) => bank.banco_id === bankId);
    expect(exists).toBeTruthy();
    expect(exists?.codigo).toBe(code);
    expect(exists?.nome).toBe(name);
    expect(exists?.url).toBe("url");
    await sut.update({
      id: bankId,
      codigo: "321",
      nome: "nome alterado",
      url: "url alterada",
    });
    const updatedBank = await sut.getById(bankId);
    expect(updatedBank).toBeTruthy();
    expect(updatedBank?.codigo).toBe("321");
    expect(updatedBank?.nome).toBe("nome alterado");
    expect(updatedBank?.url).toBe("url alterada");
    await sut.remove(bankId);
    const bankData = await sut.getById(bankId);
    expect(bankData).toBeFalsy();
  });
  test("Deve retornar um banco pelo código", async () => {
    const code = faker.string.numeric(3);
    const name = faker.person.fullName();
    const url = faker.internet.url();
    await databaseConnection.query(
      `DELETE FROM banco WHERE codigo = ? AND nome = ? AND url = ?`,
      [code, name, url],
    );
    const bankId = await sut.save({
      codigo: code,
      nome: name,
      url,
    });
    const savedBank = await sut.getByCode(code);
    expect(savedBank).toBeTruthy();
    expect(savedBank!.banco_id).toBe(bankId);
    expect(savedBank!.codigo).toBe(code);
    expect(savedBank!.nome).toBe(name);
    expect(savedBank!.url).toBe(url);
  });
  test("Deve lançar um erro se o bankId não for um número ao remover um banco", async () => {
    await expect(sut.remove("NaN" as any)).rejects.toThrow(
      new ApplicationError("ID do Banco informado é inválido"),
    );
  });
  test("Deve retornar um banco pelo nome", async () => {
    const fakeCode = faker.string.numeric(3);
    const fakeName = faker.person.fullName();
    const bankId = await sut.save({
      codigo: fakeCode,
      nome: fakeName,
      url: "url.com",
    });
    const savedBank = await sut.getByName(fakeName);
    expect(savedBank).toBeTruthy();
    expect(savedBank!.banco_id).toBe(bankId);
    expect(savedBank!.codigo).toBe(fakeCode);
    expect(savedBank!.nome).toBe(fakeName);
    expect(savedBank!.url).toBe("url.com");
  });
});
