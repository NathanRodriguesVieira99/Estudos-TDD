import type { BankRepository } from "@/bank.repository-database.ts";
import { Bank } from "@/bank.ts";

import { BankRepositoryFake } from "../mocks/fakes/bank.repository-fake.ts";

let bankRepository: BankRepository;

beforeEach(() => {
  bankRepository = new BankRepositoryFake();
});

describe("Bank Repository Fake", () => {
  test("Deve testar o acesso ao banco", async () => {
    const name = "nome";
    const code = "123";
    const url = "url";
    const bank = Bank.create({
      name,
      code,
      url,
    });
    const savedBank = await bankRepository.save(bank);
    const listBank = await bankRepository.list();
    const exists = listBank.find((bank) => bank.getId() === savedBank.getId());
    expect(exists).toBeTruthy();
    expect(exists?.getName()).toBe(name);
    expect(exists?.getCode()).toBe(code);
    expect(exists?.getUrl()).toBe(url);
    savedBank.setName("nome alterado");
    savedBank.setCode("321");
    savedBank.setUrl("url.alterada.com");
    await bankRepository.update(savedBank);
    const updatedBank = await bankRepository.findById(savedBank.getId());
    expect(updatedBank).toBeTruthy();
    expect(updatedBank?.getName()).toBe("nome alterado");
    expect(updatedBank?.getCode()).toBe("321");
    expect(updatedBank?.getUrl()).toBe("url.alterada.com");
    await bankRepository.remove(savedBank.getId());
    const bankData = await bankRepository.findById(savedBank.getId());
    expect(bankData).toBeFalsy();
  });
  test("Deve retornar um banco pelo código", async () => {
    const code = "123";
    const name = "nome";
    const url = "url.com";
    const instance = Bank.create({ name, code, url });
    const savedBank = await bankRepository.save(instance);
    const bank = await bankRepository.findByCode(savedBank.getCode());
    expect(bank).toBeTruthy();
    expect(bank!.getId()).toBe(savedBank.getId());
    expect(bank!.getName()).toBe(name);
    expect(bank!.getCode()).toBe(code);
    expect(bank!.getUrl()).toBe(url);
    await bankRepository.remove(savedBank.getId());
  });
  test("Deve retornar um banco pelo nome", async () => {
    const code = "123";
    const name = "nome";
    const url = "url.com";
    const instance = Bank.create({ name, code, url });
    const savedBank = await bankRepository.save(instance);
    const bank = await bankRepository.findByName(savedBank.getName());
    expect(bank).toBeTruthy();
    expect(bank!.getId()).toBe(savedBank.getId());
    expect(bank!.getName()).toBe(name);
    expect(bank!.getCode()).toBe(code);
    expect(bank!.getUrl()).toBe(url);
    await bankRepository.remove(savedBank.getId());
  });
});
