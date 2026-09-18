import { faker } from "@faker-js/faker";
import { Bank } from "@/bank.ts";
import { BankRepositoryFake } from "../mocks/fakes/bank.repository-fake.ts";
import { GetBankListUseCase } from "@/get-bank-list.usecase.ts";
import type { BankRepository } from "@/bank.repository-database.ts";

let bankRepository: BankRepository;
let sut: GetBankListUseCase;

beforeAll(() => {
  bankRepository = new BankRepositoryFake();
  sut = new GetBankListUseCase(bankRepository);
});

test("Deve retornar a lista de bancos", async () => {
  const code = faker.string.numeric(3);
  const name = faker.person.fullName();
  const url = faker.internet.url();
  const instance = Bank.create({ code, name, url });
  const savedBank = await bankRepository.save(instance);
  const bankId = savedBank.getId();
  const output = await sut.execute();
  expect(output).toBeInstanceOf(Array);
  expect(output.length).toBeGreaterThanOrEqual(1);
  const bankData = output.find((bank) => bank.id === bankId);
  expect(bankData).toBeTruthy();
  expect(bankData?.id).toBe(bankId);
  expect(bankData?.codigo).toBe(savedBank.getCode());
  expect(bankData?.nome).toBe(savedBank.getName());
  expect(bankData?.url).toBe(savedBank.getUrl());
  await bankRepository.remove(bankId);
});
