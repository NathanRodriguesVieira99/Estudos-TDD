import { faker } from "@faker-js/faker";
import { Bank } from "@/bank.ts";
import { GetBankByIdUseCase } from "@/get-bank-by-id.usecase.ts";
import { BankRepositoryFake } from "../__mocks__/bank.repository-fake.ts";
import { NotFoundError } from "@/not-found.error.ts";
import type { BankRepository } from "@/bank.repository-database.ts";

let bankRepository: BankRepository;
let sut: GetBankByIdUseCase;

beforeAll(() => {
  bankRepository = new BankRepositoryFake();
  sut = new GetBankByIdUseCase(bankRepository);
});

describe("Get Bank By ID UseCase", () => {
  test("Deve retornar um banco pelo ID", async () => {
    const code = faker.string.numeric(3);
    const name = faker.person.fullName();
    const url = faker.internet.url();
    const instance = Bank.create({ code, name, url });
    const savedBank = await bankRepository.save(instance);
    const bankId = savedBank.getId();
    const inputSut = { id: bankId };
    const output = await sut.execute(inputSut);
    expect(output?.id).toBe(bankId);
    expect(output?.codigo).toBe(savedBank.getCode());
    expect(output?.nome).toBe(savedBank.getName());
    expect(output?.url).toBe(savedBank.getUrl());
    await bankRepository.remove(bankId);
  });
  test("Deve lançar um erro se o banco não for encontrado", async () => {
    const bankId = 67_6767_6767;
    const inputSut = { id: bankId };
    await expect(() => sut.execute(inputSut)).rejects.toThrow(
      new NotFoundError("Banco não encontrado"),
    );
  });
});
