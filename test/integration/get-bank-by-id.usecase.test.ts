import { faker } from "@faker-js/faker";
import { Bank } from "@/bank.ts";
import { GetBankByIdUseCase } from "@/get-bank-by-id.usecase.ts";
import { BankRepositoryFake } from "../__mocks__/bank.repository-fake.ts";
import type { BankRepository } from "@/bank.repository-database.ts";

let bankRepository: BankRepository;
let sut: GetBankByIdUseCase;

beforeAll(() => {
  bankRepository = new BankRepositoryFake();
  sut = new GetBankByIdUseCase(bankRepository);
});

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
