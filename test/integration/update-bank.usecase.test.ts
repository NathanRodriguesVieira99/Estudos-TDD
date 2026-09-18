import { faker } from "@faker-js/faker";
import { Bank } from "@/bank.ts";
import { UpdateBankUseCase } from "@/update-bank.usecase.ts";
import { BankRepositoryFake } from "../__mocks__/bank.repository-fake.ts";
import type { BankRepository } from "@/bank.repository-database.ts";

let bankRepository: BankRepository;
let sut: UpdateBankUseCase;

beforeAll(() => {
  bankRepository = new BankRepositoryFake();
  sut = new UpdateBankUseCase(bankRepository);
});

describe("UpdateBank UseCase", () => {
  test("Deve alterar um banco", async () => {
    const code = faker.string.numeric(3);
    const name = faker.person.fullName();
    const url = faker.internet.url();
    const bank = Bank.create({ code, name, url });
    const savedBank = await bankRepository.save(bank);
    const bankId = savedBank.getId();
    const inputUpdate = {
      id: bankId,
      codigo: "553",
      nome: "Banco Teste 2",
      url: "teste2.com",
    };
    const updatedBank = await sut.execute(inputUpdate);
    expect(updatedBank.id).toBe(bankId);
    expect(updatedBank.codigo).toBe(inputUpdate.codigo);
    expect(updatedBank.nome).toBe(inputUpdate.nome);
    expect(updatedBank.url).toBe(inputUpdate.url);
    const outputGet = await bankRepository.findById(bankId);
    expect(outputGet).toBeTruthy();
    expect(outputGet?.getId()).toBe(bankId);
    expect(outputGet?.getCode()).toBe(inputUpdate.codigo);
    expect(outputGet?.getName()).toBe(inputUpdate.nome);
    expect(outputGet?.getUrl()).toBe(inputUpdate.url);
    await bankRepository.remove(bankId);
  });
  test.each(["", null, undefined, "Teste"])(
    "Não deve alterar um banco com nome inválido: %s",
    async (invalidName: any) => {
      const code = faker.string.numeric(3);
      const name = faker.person.fullName();
      const url = faker.internet.url();
      const bank = Bank.create({ code, name, url });
      const savedBank = await bankRepository.save(bank);
      const bankId = savedBank.getId();
      const inputUpdate = {
        id: bankId,
        codigo: "553",
        nome: invalidName,
        url: "teste2.com",
      };
      await expect(sut.execute(inputUpdate)).rejects.toThrow("Nome inválido");
      await bankRepository.remove(bankId);
    },
  );
  test.each(["", null, undefined, "String", "1", "01"])(
    "Não deve alterar um banco com código inválido: %s",
    async (invalidCode: any) => {
      const code = faker.string.numeric(3);
      const name = faker.person.fullName();
      const url = faker.internet.url();
      const bank = Bank.create({ code, name, url });
      const savedBank = await bankRepository.save(bank);
      const bankId = savedBank.getId();
      const inputUpdate = {
        id: bankId,
        codigo: invalidCode,
        nome: "Banco Teste 2",
        url: "teste2.com",
      };
      await expect(sut.execute(inputUpdate)).rejects.toThrow("Código inválido");
      await bankRepository.remove(bankId);
    },
  );
  test("Não deve alterar um banco inexistente", async () => {
    const inputUpdate = {
      id: 9_999_999,
      codigo: "666",
      nome: "Banco Teste 2",
      url: "teste2.com",
    };
    await expect(sut.execute(inputUpdate)).rejects.toThrow(
      "Banco não encontrado",
    );
  });
  test("Não deve alterar um banco para um código já existente", async () => {
    const code = faker.string.numeric(3);
    const name = faker.person.fullName();
    const url = faker.internet.url();
    const firstBank = Bank.create({ code, name, url });
    const firstSavedBank = await bankRepository.save(firstBank);
    const firstBankId = firstSavedBank.getId();
    const secondBank = Bank.create({
      code: "554",
      name: "Banco Teste",
      url: "teste.com",
    });
    const secondSavedBank = await bankRepository.save(secondBank);
    const secondBankId = secondSavedBank.getId();
    const inputUpdate = {
      id: firstBankId,
      codigo: "554",
      nome: "Banco Teste 2",
      url: "teste2.com",
    };
    await expect(sut.execute(inputUpdate)).rejects.toThrow(
      "Não é possível alterar o banco para um código já cadastrado",
    );
    await bankRepository.remove(firstBankId);
    await bankRepository.remove(secondBankId);
  });
  test("Não deve alterar um banco para um nome já existente", async () => {
    const code = faker.string.numeric(3);
    const name = faker.person.fullName();
    const url = faker.internet.url();
    const firstInstance = Bank.create({ code, name, url });
    const firstSavedBank = await bankRepository.save(firstInstance);
    const firstBankId = firstSavedBank.getId();
    const secondBank = Bank.create({
      code: "554",
      name: "Banco Teste",
      url: "teste.com",
    });
    const secondSavedBank = await bankRepository.save(secondBank);
    const secondBankId = secondSavedBank.getId();
    const inputUpdate = {
      id: firstBankId,
      codigo: firstSavedBank.getCode(),
      nome: secondSavedBank.getName(),
      url: "teste4.changed.com",
    };
    await expect(sut.execute(inputUpdate)).rejects.toThrow(
      "Não é possível alterar o banco para um nome já cadastrado",
    );
    await bankRepository.remove(firstBankId);
    await bankRepository.remove(secondBankId);
  });
});
