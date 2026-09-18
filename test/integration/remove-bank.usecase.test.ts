import { faker } from "@faker-js/faker";
import { Bank } from "@/bank.ts";
import { RemoveBankUseCase } from "@/remove-bank.usecase.ts";
import { BankRepositoryFake } from "../__mocks__/bank.repository-fake.ts";
import type { BankRepository } from "@/bank.repository-database.ts";

let bankRepository: BankRepository;
let sut: RemoveBankUseCase;

beforeAll(() => {
  bankRepository = new BankRepositoryFake();
  sut = new RemoveBankUseCase(bankRepository);
});

test("Deve deletar um banco ", async () => {
  const code = faker.string.numeric(3);
  const name = faker.person.fullName();
  const url = faker.internet.url();
  const instance = Bank.create({ code, name, url });
  const savedBank = await bankRepository.save(instance);
  const bankId = savedBank.getId();
  const inputSut = {
    id: bankId,
  };
  await sut.execute(inputSut);
  const bankExists = await bankRepository.findById(bankId);
  expect(bankExists?.getId()).toBeFalsy();
});
