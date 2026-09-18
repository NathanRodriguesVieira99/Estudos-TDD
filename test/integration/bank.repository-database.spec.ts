import mysqlConnection from "mysql2/promise";
import { faker } from "@faker-js/faker";
import { Bank } from "@/bank.ts";
import {
  type BankRepository,
  BankRepositoryDatabase,
} from "@/bank.repository-database.ts";

const connection = mysqlConnection.createPool(String(process.env.DATABASE_URL));

let sut: BankRepository;

beforeEach(() => {
  sut = new BankRepositoryDatabase();
});

afterEach(() => {
  connection.pool.end();
});

describe("Bank Repository Database", () => {
  test("Deve testar o acesso ao banco", async () => {
    const code = faker.string.numeric(3);
    const name = faker.person.fullName();
    const url = faker.internet.url();
    const instance = Bank.create({
      name,
      code,
      url,
    });
    const savedBank = await sut.save(instance);
    const bankId = savedBank.getId();
    const listBank = await sut.list();
    const exists = listBank.find((bank) => bank.getId() === bankId);
    expect(exists).toBeTruthy();
    expect(exists?.getName()).toBe(name);
    expect(exists?.getCode()).toBe(code);
    expect(exists?.getUrl()).toBe(url);
    savedBank.setName("nome alterado");
    savedBank.setCode("321");
    savedBank.setUrl("url.alterada.com");
    await sut.update(savedBank);
    const updatedBank = await sut.findById(savedBank.getId());
    expect(updatedBank).toBeTruthy();
    expect(updatedBank?.getName()).toBe("nome alterado");
    expect(updatedBank?.getCode()).toBe("321");
    expect(updatedBank?.getUrl()).toBe("url.alterada.com");
    await sut.remove(savedBank.getId());
    const bankData = await sut.findById(savedBank.getId());
    expect(bankData).toBeFalsy();
  });
  test("Deve retornar um banco pelo código", async () => {
    const code = faker.string.numeric(3);
    const name = faker.person.fullName();
    const url = faker.internet.url();
    const instance = Bank.create({
      name,
      code,
      url,
    });
    const savedBank = await sut.save(instance);
    const bank = await sut.findByCode(savedBank.getCode());
    expect(bank).toBeTruthy();
    expect(bank?.getId()).toBe(savedBank?.getId());
    expect(bank?.getName()).toBe(name);
    expect(bank?.getCode()).toBe(code);
    expect(bank?.getUrl()).toBe(url);
    await sut.remove(savedBank.getId());
  });
  test("Deve lançar um erro se o bankId não for um número ao remover um banco", async () => {
    await expect(sut.remove("NaN" as any)).rejects.toThrow(
      "ID do Banco informado é inválido",
    );
  });
  test("Deve retornar um banco pelo nome", async () => {
    const code = faker.string.numeric(3);
    const name = faker.person.fullName();
    const url = faker.internet.url();
    const instance = Bank.create({
      name,
      code,
      url,
    });
    const savedBank = await sut.save(instance);
    const bank = await sut.findByName(savedBank.getName());
    expect(bank).toBeTruthy();
    expect(bank?.getId()).toBe(savedBank.getId());
    expect(bank?.getName()).toBe(name);
    expect(bank?.getCode()).toBe(code);
    expect(bank?.getUrl()).toBe(url);
    await sut.remove(savedBank.getId());
  });
});
